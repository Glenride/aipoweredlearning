<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blueprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chat_session_id',
        'project_name',
        'tagline',
        'target_audience',
        'monetization_model',
        'mvp_features',
        'niche',
        'problem_statement',
        'solution_concept',
        'roadmap_json',
    ];

    protected $casts = [
        'mvp_features' => 'array',
        'roadmap_json' => 'array',
    ];

    /**
     * Get the user that owns the blueprint.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the chat session that generated this blueprint.
     */
    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class);
    }
}
