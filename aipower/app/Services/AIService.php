<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class AIService
{
    private string $model;
    private string $systemPrompt;

    public function __construct()
    {
        $this->model = config('openai.model', 'gpt-4o');
        $this->systemPrompt = <<<'PROMPT'
You are The Architect—a ruthless but empathetic business strategist who helps people build One-Person Holding Companies.

Your mission is to extract the user's "Specific Knowledge"—the intersection of their skills, interests, and personality that cannot be automated—and package it into a high-leverage digital business model.

## YOUR PERSONALITY
- Direct and incisive, like Naval Ravikant meets Dan Koe
- Empathetic but not soft—you push back when needed
- You speak in clear, memorable phrases
- You ask probing questions that make people think differently

## HARD CONSTRAINTS
- Do NOT give generic advice
- Do NOT suggest dropshipping, affiliate marketing, print-on-demand, or MLM
- Focus ONLY on high-leverage digital assets: Micro-SaaS, Productized Services, Digital Products, or Content Businesses
- Never use corporate jargon or platitudes
- Be specific and actionable

## CONVERSATION FLOW

### Phase 1: Extraction (2-4 exchanges)
Start by asking: "Tell me—what have you been genuinely obsessed with for the last 6 months? Not what you think you should be interested in. What actually keeps you up at night?"

Then probe deeper:
- What problems have you solved for yourself that others haven't?
- What do people ask you for help with, even when you're not getting paid?
- What intersection of skills do you have that's rare?

### Phase 2: Pattern Recognition (1-2 exchanges)
Reflect back what you're hearing. Identify the "unfair advantage" hidden in their story.

### Phase 3: Strategy Card Generation
When you have enough information (usually after 4-6 total exchanges), generate a Strategy Card.

CRITICAL: When generating the Strategy Card, you MUST output it in this EXACT JSON format, wrapped in a markdown code block:

```json
{
  "strategy_card": {
    "project_name": "A memorable, brandable name for their business",
    "tagline": "A one-liner that captures the value proposition",
    "target_audience": "Specific description of who this serves",
    "monetization_model": "How they'll make money (subscription, one-time, etc.)",
    "mvp_features": ["Feature 1", "Feature 2", "Feature 3"],
    "niche": "The specific market segment",
    "problem_statement": "The core problem being solved",
    "solution_concept": "How the product/service solves it"
  }
}
```

After outputting the Strategy Card, explain your reasoning and offer to refine it based on their feedback.

## IMPORTANT REMINDERS
- This is a GUIDED interview, not a freeform chat
- Keep responses concise but impactful (2-4 paragraphs max)
- Use markdown formatting for readability
- Ask ONE question at a time to maintain focus
PROMPT;
    }

    /**
     * Get the system prompt for the AI.
     */
    public function getSystemPrompt(): string
    {
        return $this->systemPrompt;
    }

    /**
     * Send a message and get a streaming response.
     *
     * @param array $messages Array of messages with 'role' and 'content'
     * @return \Generator
     */
    public function streamChat(array $messages): \Generator
    {
        $formattedMessages = array_merge(
            [['role' => 'system', 'content' => $this->systemPrompt]],
            $messages
        );

        $stream = OpenAI::chat()->createStreamed([
            'model' => $this->model,
            'messages' => $formattedMessages,
            'temperature' => 0.7,
            'max_tokens' => 2000,
        ]);

        foreach ($stream as $response) {
            $content = $response->choices[0]->delta->content ?? '';
            if ($content !== '') {
                yield $content;
            }
        }
    }

    /**
     * Send a message and get the complete response.
     *
     * @param array $messages Array of messages with 'role' and 'content'
     * @return string
     */
    public function chat(array $messages): string
    {
        $formattedMessages = array_merge(
            [['role' => 'system', 'content' => $this->systemPrompt]],
            $messages
        );

        $response = OpenAI::chat()->create([
            'model' => $this->model,
            'messages' => $formattedMessages,
            'temperature' => 0.7,
            'max_tokens' => 2000,
        ]);

        return $response->choices[0]->message->content ?? '';
    }

    /**
     * Extract a Blueprint/Strategy Card from AI response content.
     *
     * @param string $content The AI's response content
     * @return array|null The extracted strategy card data, or null if not found
     */
    public function extractBlueprint(string $content): ?array
    {
        // Look for JSON in code blocks
        $pattern = '/```json\s*\n?\s*(\{[\s\S]*?"strategy_card"[\s\S]*?\})\s*\n?\s*```/';
        
        if (preg_match($pattern, $content, $matches)) {
            try {
                $data = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
                
                if (isset($data['strategy_card'])) {
                    return $data['strategy_card'];
                }
            } catch (\JsonException $e) {
                Log::warning('Failed to parse Strategy Card JSON', [
                    'error' => $e->getMessage(),
                    'content' => $matches[1],
                ]);
            }
        }

        // Fallback: try to find JSON without code blocks
        $fallbackPattern = '/\{[\s\S]*?"strategy_card"\s*:\s*\{[\s\S]*?\}\s*\}/';
        
        if (preg_match($fallbackPattern, $content, $matches)) {
            try {
                $data = json_decode($matches[0], true, 512, JSON_THROW_ON_ERROR);
                
                if (isset($data['strategy_card'])) {
                    return $data['strategy_card'];
                }
            } catch (\JsonException $e) {
                Log::warning('Failed to parse fallback Strategy Card JSON', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }
}
