import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { useEffect, useRef } from 'react';

interface ChatMessageProps {
    message: Message;
    isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
        <div
            className={cn(
                'group relative mb-6 flex gap-4',
                isUser && 'flex-row-reverse',
            )}
        >
            {/* Role indicator */}
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-[JetBrains_Mono] text-xs font-bold',
                    isUser
                        ? 'bg-amber-500/20 text-amber-500'
                        : isSystem
                            ? 'bg-zinc-700 text-zinc-400'
                            : 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-cyan-400',
                )}
            >
                {isUser ? 'YOU' : isSystem ? 'SYS' : 'AI'}
            </div>

            {/* Message content */}
            <div
                className={cn(
                    'flex-1 space-y-2 overflow-hidden',
                    isUser && 'text-right',
                )}
            >
                <div
                    className={cn(
                        'inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left',
                        isUser
                            ? 'bg-amber-500/10 text-zinc-200'
                            : 'bg-zinc-800/50 text-zinc-300',
                    )}
                >
                    <div className="font-[JetBrains_Mono] text-sm leading-relaxed whitespace-pre-wrap">
                        <MessageContent content={message.content} />
                        {isStreaming && (
                            <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-cyan-400" />
                        )}
                    </div>
                </div>
                <div
                    className={cn(
                        'font-[JetBrains_Mono] text-xs text-zinc-600',
                        isUser && 'text-right',
                    )}
                >
                    {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </div>
    );
}

interface MessageContentProps {
    content: string;
}

function MessageContent({ content }: MessageContentProps) {
    // Simple markdown-like rendering for bold and italic
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={index} className="font-bold text-white">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return (
                        <em key={index} className="italic text-zinc-400">
                            {part.slice(1, -1)}
                        </em>
                    );
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                        <code
                            key={index}
                            className="rounded bg-zinc-700 px-1.5 py-0.5 text-cyan-400"
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </>
    );
}

interface ChatMessagesProps {
    messages: Message[];
    streamingContent?: string;
}

export function ChatMessages({
    messages,
    streamingContent,
}: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, streamingContent]);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700"
        >
            <div className="mx-auto max-w-3xl">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {/* Streaming message */}
                {streamingContent && (
                    <ChatMessage
                        message={{
                            id: -1,
                            chat_session_id: -1,
                            role: 'assistant',
                            content: streamingContent,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        }}
                        isStreaming
                    />
                )}
            </div>
        </div>
    );
}
