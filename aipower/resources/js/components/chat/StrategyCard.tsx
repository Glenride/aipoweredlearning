import { StrategyCard as StrategyCardType } from '@/types';
import { Link } from '@inertiajs/react';
import { Sparkles, Target, DollarSign, Lightbulb, ArrowRight } from 'lucide-react';

interface StrategyCardProps {
    strategyCard: StrategyCardType;
    onSave?: () => void;
    isSaving?: boolean;
    showSaveButton?: boolean;
}

export function StrategyCard({
    strategyCard,
    onSave,
    isSaving = false,
    showSaveButton = true,
}: StrategyCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/20">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 px-6 py-4">
                <div className="flex items-center gap-2 font-[JetBrains_Mono] text-xs uppercase tracking-widest text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    Strategy Card Generated
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
                {/* Project Name & Tagline */}
                <div>
                    <h3 className="font-[Merriweather] text-2xl font-bold text-white">
                        {strategyCard.project_name}
                    </h3>
                    {strategyCard.tagline && (
                        <p className="mt-2 font-[JetBrains_Mono] text-sm text-cyan-400">
                            {strategyCard.tagline}
                        </p>
                    )}
                </div>

                {/* Key Details Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Target Audience */}
                    {strategyCard.target_audience && (
                        <div className="rounded-xl bg-zinc-800/50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-amber-500">
                                <Target className="h-4 w-4" />
                                <span className="font-[JetBrains_Mono] text-xs uppercase tracking-wider">
                                    Target Audience
                                </span>
                            </div>
                            <p className="font-[JetBrains_Mono] text-sm text-zinc-300">
                                {strategyCard.target_audience}
                            </p>
                        </div>
                    )}

                    {/* Monetization */}
                    {strategyCard.monetization_model && (
                        <div className="rounded-xl bg-zinc-800/50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-green-500">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-[JetBrains_Mono] text-xs uppercase tracking-wider">
                                    Monetization
                                </span>
                            </div>
                            <p className="font-[JetBrains_Mono] text-sm text-zinc-300">
                                {strategyCard.monetization_model}
                            </p>
                        </div>
                    )}
                </div>

                {/* Problem & Solution */}
                {(strategyCard.problem_statement || strategyCard.solution_concept) && (
                    <div className="space-y-4">
                        {strategyCard.problem_statement && (
                            <div>
                                <h4 className="mb-2 font-[JetBrains_Mono] text-xs uppercase tracking-wider text-zinc-500">
                                    The Problem
                                </h4>
                                <p className="font-[JetBrains_Mono] text-sm leading-relaxed text-zinc-300">
                                    {strategyCard.problem_statement}
                                </p>
                            </div>
                        )}
                        {strategyCard.solution_concept && (
                            <div>
                                <h4 className="mb-2 font-[JetBrains_Mono] text-xs uppercase tracking-wider text-zinc-500">
                                    The Solution
                                </h4>
                                <p className="font-[JetBrains_Mono] text-sm leading-relaxed text-zinc-300">
                                    {strategyCard.solution_concept}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* MVP Features */}
                {strategyCard.mvp_features && strategyCard.mvp_features.length > 0 && (
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-blue-400">
                            <Lightbulb className="h-4 w-4" />
                            <span className="font-[JetBrains_Mono] text-xs uppercase tracking-wider">
                                MVP Features
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {strategyCard.mvp_features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 font-[JetBrains_Mono] text-sm text-zinc-300"
                                >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/20 text-xs text-blue-400">
                                        {index + 1}
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer with Save Button */}
            {showSaveButton && onSave && (
                <div className="border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-[JetBrains_Mono] text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving Blueprint...
                            </>
                        ) : (
                            <>
                                Save to Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
