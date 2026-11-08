import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Plus, History, Zap } from 'lucide-react';

import { ChatMessages } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { StrategyCard } from '@/components/chat/StrategyCard';
import { ChatSession, Message, StrategyCard as StrategyCardType } from '@/types';

export default function Architect() {
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [strategyCard, setStrategyCard] = useState<StrategyCardType | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Fetch existing sessions on mount
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await fetch('/chat/sessions');
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    const startNewSession = async () => {
        setIsLoading(true);
        setStrategyCard(null);

        try {
            const response = await fetch('/chat/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            if (response.ok) {
                const data: ChatSession = await response.json();
                setSession(data);
                setMessages(data.messages || []);
                fetchSessions(); // Refresh session list
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSession = async (sessionId: number) => {
        setIsLoading(true);
        setStrategyCard(null);

        try {
            const response = await fetch(`/chat/sessions/${sessionId}`);
            if (response.ok) {
                const data: ChatSession = await response.json();
                setSession(data);
                setMessages(data.messages || []);
                setShowHistory(false);
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!session || isStreaming) return;

        // Optimistically add user message
        const tempUserMessage: Message = {
            id: Date.now(),
            chat_session_id: session.id,
            role: 'user',
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);
        setIsStreaming(true);
        setStreamingContent('');

        try {
            const response = await fetch(`/chat/sessions/${session.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);

                            if (data === '[DONE]') {
                                // Stream complete
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);

                                if (parsed.content) {
                                    fullContent += parsed.content;
                                    setStreamingContent(fullContent);
                                }

                                if (parsed.blueprint) {
                                    setStrategyCard(parsed.blueprint);
                                }
                            } catch {
                                // Ignore malformed JSON
                            }
                        }
                    }
                }
            }

            // Add the complete AI message
            const aiMessage: Message = {
                id: Date.now() + 1,
                chat_session_id: session.id,
                role: 'assistant',
                content: fullContent,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsStreaming(false);
            setStreamingContent('');
        }
    }, [session, isStreaming]);

    const saveBlueprint = async () => {
        if (!session || !strategyCard) return;

        setIsSaving(true);

        try {
            const response = await fetch(`/chat/sessions/${session.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(strategyCard),
            });

            if (response.ok) {
                // Redirect to dashboard
                router.visit('/dashboard');
            }
        } catch (error) {
            console.error('Failed to save blueprint:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Head title="The Architect - AETHER">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=merriweather:400,700,900|jetbrains-mono:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex h-screen flex-col bg-zinc-950">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="font-[Merriweather] text-lg font-bold text-white">
                                The Architect
                            </h1>
                            {session && (
                                <p className="font-[JetBrains_Mono] text-xs text-zinc-500">
                                    Session #{session.id} • {session.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 font-[JetBrains_Mono] text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                        >
                            <History className="h-4 w-4" />
                            History
                        </button>
                        <button
                            onClick={startNewSession}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 font-[JetBrains_Mono] text-xs font-semibold text-white transition-all hover:from-purple-500 hover:to-cyan-400"
                        >
                            <Plus className="h-4 w-4" />
                            New Session
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Session History Sidebar */}
                    {showHistory && (
                        <aside className="w-64 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-900/50">
                            <div className="p-4">
                                <h2 className="mb-4 font-[JetBrains_Mono] text-xs uppercase tracking-wider text-zinc-500">
                                    Previous Sessions
                                </h2>
                                {sessions.length === 0 ? (
                                    <p className="font-[JetBrains_Mono] text-xs text-zinc-600">
                                        No sessions yet
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {sessions.map((s) => (
                                            <li key={s.id}>
                                                <button
                                                    onClick={() => loadSession(s.id)}
                                                    className={`w-full rounded-lg p-3 text-left transition-colors ${session?.id === s.id
                                                            ? 'bg-purple-500/20 border border-purple-500/30'
                                                            : 'bg-zinc-800/50 hover:bg-zinc-800'
                                                        }`}
                                                >
                                                    <p className="font-[JetBrains_Mono] text-sm text-white truncate">
                                                        {s.title || `Session #${s.id}`}
                                                    </p>
                                                    <p className="font-[JetBrains_Mono] text-xs text-zinc-500">
                                                        {new Date(s.created_at).toLocaleDateString()}
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-block rounded-full px-2 py-0.5 font-[JetBrains_Mono] text-[10px] uppercase ${s.status === 'completed'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : s.status === 'active'
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : 'bg-zinc-700 text-zinc-400'
                                                            }`}
                                                    >
                                                        {s.status}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </aside>
                    )}

                    {/* Main Chat Area */}
                    <main className="flex flex-1 flex-col overflow-hidden">
                        {!session ? (
                            /* Empty State */
                            <div className="flex flex-1 flex-col items-center justify-center px-6">
                                <div className="max-w-md text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                                        <Zap className="h-10 w-10 text-cyan-400" />
                                    </div>
                                    <h2 className="mb-4 font-[Merriweather] text-2xl font-bold text-white">
                                        Initialize The Architect
                                    </h2>
                                    <p className="mb-8 font-[JetBrains_Mono] text-sm leading-relaxed text-zinc-400">
                                        Start a new session to extract your specific knowledge and
                                        architect a custom business model tailored to your unique
                                        skills and interests.
                                    </p>
                                    <button
                                        onClick={startNewSession}
                                        disabled={isLoading}
                                        className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 font-[JetBrains_Mono] text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-cyan-400"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Initializing...
                                            </>
                                        ) : (
                                            <>
                                                [ Begin Extraction ]
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <ChatMessages
                                    messages={messages}
                                    streamingContent={isStreaming ? streamingContent : undefined}
                                />

                                {/* Strategy Card (if generated) */}
                                {strategyCard && (
                                    <div className="border-t border-zinc-800 bg-zinc-900/50 p-6">
                                        <div className="mx-auto max-w-3xl">
                                            <StrategyCard
                                                strategyCard={strategyCard}
                                                onSave={saveBlueprint}
                                                isSaving={isSaving}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Input */}
                                {session.status !== 'completed' && (
                                    <ChatInput
                                        onSend={sendMessage}
                                        disabled={isStreaming}
                                        placeholder="Share your thoughts..."
                                    />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
