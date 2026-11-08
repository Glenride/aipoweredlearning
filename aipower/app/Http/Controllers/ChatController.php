<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use App\Models\Message;
use App\Models\Blueprint;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    public function __construct(
        protected AIService $aiService
    ) {}

    /**
     * Get all chat sessions for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $sessions = Auth::user()
            ->chatSessions()
            ->with('blueprint')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($sessions);
    }

    /**
     * Create a new chat session.
     */
    public function store(Request $request): JsonResponse
    {
        $session = Auth::user()->chatSessions()->create([
            'title' => $request->input('title'),
            'status' => 'active',
        ]);

        // Add the initial system greeting as a message
        $initialMessage = "Session initialized. I am The Architect.\n\nTell me—what have you been genuinely obsessed with for the last 6 months? Not what you think you should be interested in. What actually keeps you up at night?";
        
        $session->messages()->create([
            'role' => 'assistant',
            'content' => $initialMessage,
        ]);

        $session->load('messages');

        return response()->json($session, 201);
    }

    /**
     * Get a specific chat session with messages.
     */
    public function show(ChatSession $session): JsonResponse
    {
        // Ensure the user owns this session
        if ($session->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $session->load(['messages', 'blueprint']);

        return response()->json($session);
    }

    /**
     * Send a message to the AI and stream the response.
     */
    public function sendMessage(Request $request, ChatSession $session): StreamedResponse
    {
        // Ensure the user owns this session
        if ($session->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'content' => 'required|string|max:10000',
        ]);

        // Save the user's message
        $session->messages()->create([
            'role' => 'user',
            'content' => $request->input('content'),
        ]);

        // Get conversation history
        $messages = $session->messages()
            ->orderBy('created_at')
            ->get()
            ->map(fn($msg) => [
                'role' => $msg->role,
                'content' => $msg->content,
            ])
            ->toArray();

        // Stream the AI response
        return response()->stream(function () use ($session, $messages) {
            $fullContent = '';

            foreach ($this->aiService->streamChat($messages) as $chunk) {
                $fullContent .= $chunk;
                
                // Send the chunk as a Server-Sent Event
                echo "data: " . json_encode(['content' => $chunk]) . "\n\n";
                
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
            }

            // Save the complete AI response
            $session->messages()->create([
                'role' => 'assistant',
                'content' => $fullContent,
            ]);

            // Check if a Strategy Card was generated
            $blueprint = $this->aiService->extractBlueprint($fullContent);
            
            if ($blueprint) {
                // Send the blueprint as a final event
                echo "data: " . json_encode(['blueprint' => $blueprint]) . "\n\n";
                
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
            }

            // Send done signal
            echo "data: [DONE]\n\n";
            
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();

        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Complete a session and save the blueprint.
     */
    public function complete(Request $request, ChatSession $session): JsonResponse
    {
        // Ensure the user owns this session
        if ($session->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'project_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'target_audience' => 'nullable|string',
            'monetization_model' => 'nullable|string|max:255',
            'mvp_features' => 'nullable|array',
            'niche' => 'nullable|string|max:255',
            'problem_statement' => 'nullable|string',
            'solution_concept' => 'nullable|string',
            'roadmap_json' => 'nullable|array',
        ]);

        // Create or update the blueprint
        $blueprint = $session->blueprint()->updateOrCreate(
            ['chat_session_id' => $session->id],
            array_merge(
                $request->only([
                    'project_name',
                    'tagline',
                    'target_audience',
                    'monetization_model',
                    'mvp_features',
                    'niche',
                    'problem_statement',
                    'solution_concept',
                    'roadmap_json',
                ]),
                ['user_id' => Auth::id()]
            )
        );

        // Mark session as completed
        $session->update([
            'status' => 'completed',
            'title' => $session->title ?? $request->input('project_name'),
        ]);

        return response()->json([
            'session' => $session->fresh(),
            'blueprint' => $blueprint,
        ]);
    }
}
