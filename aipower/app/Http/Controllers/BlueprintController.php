<?php

namespace App\Http\Controllers;

use App\Models\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BlueprintController extends Controller
{
    /**
     * Get all blueprints for the authenticated user (JSON).
     */
    public function index(): JsonResponse
    {
        $blueprints = Auth::user()
            ->blueprints()
            ->with('chatSession')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($blueprints);
    }

    /**
     * Show a specific blueprint.
     */
    public function show(Blueprint $blueprint): JsonResponse|Response
    {
        // Ensure the user owns this blueprint
        if ($blueprint->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $blueprint->load('chatSession.messages');

        // If JSON is requested, return JSON
        if (request()->wantsJson()) {
            return response()->json($blueprint);
        }

        // Otherwise return Inertia view
        return Inertia::render('blueprints/show', [
            'blueprint' => $blueprint,
        ]);
    }
}
