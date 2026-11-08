<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_session_id',
        'role',
        'content',
        'meta_data',
    ];

    protected $casts = [
        'role' => 'string',
        'meta_data' => 'array',
    ];

    /**
     * Get the chat session that owns the message.
     */
    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class);
    }

    /**
     * Scope a query to only include user messages.
     */
    public function scopeFromUser($query)
    {
        return $query->where('role', 'user');
    }

    /**
     * Scope a query to only include assistant messages.
     */
    public function scopeFromAssistant($query)
    {
        return $query->where('role', 'assistant');
    }
}
