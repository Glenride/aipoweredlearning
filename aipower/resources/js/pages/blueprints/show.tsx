import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Target, DollarSign, Lightbulb, MessageSquare, Calendar } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Blueprint, Message } from '@/types';

interface BlueprintShowProps {
    blueprint: Blueprint;
}

export default function BlueprintShow({ blueprint: initialBlueprint }: BlueprintShowProps) {
    const [blueprint, setBlueprint] = useState<Blueprint>(initialBlueprint);
    const [showConversation, setShowConversation] = useState(false);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: blueprint.project_name, href: `/blueprints/${blueprint.id}` },
            ]}
        >
            <Head title={`${blueprint.project_name} - AETHER`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=merriweather:400,700,900|jetbrains-mono:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex h-full flex-1 flex-col overflow-y-auto p-6">
                <div className="mx-auto w-full max-w-4xl">
                    {/* Back button */}
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 font-[JetBrains_Mono] text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="rounded-full bg-purple-500/20 px-3 py-1 font-[JetBrains_Mono] text-xs text-purple-400">
                                {blueprint.niche || 'Strategy Card'}
                            </span>
                            <span className="flex items-center gap-1 font-[JetBrains_Mono] text-xs text-zinc-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(blueprint.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <h1 className="font-[Merriweather] text-3xl font-bold text-white mb-3">
                            {blueprint.project_name}
                        </h1>
                        {blueprint.tagline && (
                            <p className="font-[JetBrains_Mono] text-lg text-cyan-400">
                                {blueprint.tagline}
                            </p>
                        )}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 mb-8">
                        {blueprint.target_audience && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                                <div className="flex items-center gap-2 mb-3 text-amber-500">
                                    <Target className="h-5 w-5" />
                                    <span className="font-[JetBrains_Mono] text-xs uppercase tracking-wider">
                                        Target Audience
                                    </span>
                                </div>
                                <p className="font-[JetBrains_Mono] text-sm text-zinc-300 leading-relaxed">
                                    {blueprint.target_audience}
                                </p>
                            </div>
                        )}

                        {blueprint.monetization_model && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                                <div className="flex items-center gap-2 mb-3 text-green-500">
                                    <DollarSign className="h-5 w-5" />
                                    <span className="font-[JetBrains_Mono] text-xs uppercase tracking-wider">
                                        Monetization Model
                                    </span>
                                </div>
                                <p className="font-[JetBrains_Mono] text-sm text-zinc-300 leading-relaxed">
                                    {blueprint.monetization_model}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Problem & Solution */}
                    <div className="space-y-6 mb-8">
                        {blueprint.problem_statement && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h2 className="mb-4 font-[Merriweather] text-lg font-bold text-white">
                                    The Problem
                                </h2>
                                <p className="font-[JetBrains_Mono] text-sm text-zinc-300 leading-relaxed">
                                    {blueprint.problem_statement}
                                </p>
                            </div>
                        )}

                        {blueprint.solution_concept && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                                <h2 className="mb-4 font-[Merriweather] text-lg font-bold text-white">
                                    The Solution
                                </h2>
                                <p className="font-[JetBrains_Mono] text-sm text-zinc-300 leading-relaxed">
                                    {blueprint.solution_concept}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* MVP Features */}
                    {blueprint.mvp_features && blueprint.mvp_features.length > 0 && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 mb-8">
                            <div className="flex items-center gap-2 mb-6 text-blue-400">
                                <Lightbulb className="h-5 w-5" />
                                <h2 className="font-[Merriweather] text-lg font-bold text-white">
                                    MVP Features
                                </h2>
                            </div>
                            <ul className="space-y-4">
                                {blueprint.mvp_features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-4"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 font-[JetBrains_Mono] text-sm font-bold text-blue-400">
                                            {index + 1}
                                        </span>
                                        <p className="pt-1 font-[JetBrains_Mono] text-sm text-zinc-300 leading-relaxed">
                                            {feature}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* View Conversation Toggle */}
                    {blueprint.chat_session?.messages && blueprint.chat_session.messages.length > 0 && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                            <button
                                onClick={() => setShowConversation(!showConversation)}
                                className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="font-[JetBrains_Mono] text-sm">
                                        View Original Conversation
                                    </span>
                                </div>
                                <span className="font-[JetBrains_Mono] text-xs text-zinc-500">
                                    {blueprint.chat_session.messages.length} messages
                                </span>
                            </button>

                            {showConversation && (
                                <div className="border-t border-zinc-800 p-5 space-y-4 max-h-96 overflow-y-auto">
                                    {blueprint.chat_session.messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-[JetBrains_Mono] text-[10px] font-bold ${message.role === 'user'
                                                        ? 'bg-amber-500/20 text-amber-500'
                                                        : 'bg-purple-500/20 text-purple-400'
                                                    }`}
                                            >
                                                {message.role === 'user' ? 'YOU' : 'AI'}
                                            </div>
                                            <div
                                                className={`max-w-[85%] rounded-lg px-4 py-2 ${message.role === 'user'
                                                        ? 'bg-amber-500/10 text-zinc-200'
                                                        : 'bg-zinc-800 text-zinc-300'
                                                    }`}
                                            >
                                                <p className="font-[JetBrains_Mono] text-xs whitespace-pre-wrap">
                                                    {message.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
