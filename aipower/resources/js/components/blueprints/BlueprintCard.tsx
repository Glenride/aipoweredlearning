import { Blueprint } from '@/types';
import { Link } from '@inertiajs/react';
import { Target, DollarSign, ArrowRight } from 'lucide-react';

interface BlueprintCardProps {
    blueprint: Blueprint;
}

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
    return (
        <Link
            href={`/blueprints/${blueprint.id}`}
            className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5"
        >
            {/* Header */}
            <div className="border-b border-zinc-800 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 px-5 py-3">
                <div className="flex items-center justify-between">
                    <span className="font-[JetBrains_Mono] text-xs text-purple-400">
                        {blueprint.niche || 'Strategy Card'}
                    </span>
                    <span className="font-[JetBrains_Mono] text-xs text-zinc-600">
                        {new Date(blueprint.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="mb-2 font-[Merriweather] text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {blueprint.project_name}
                </h3>

                {blueprint.tagline && (
                    <p className="mb-4 font-[JetBrains_Mono] text-sm text-zinc-400 line-clamp-2">
                        {blueprint.tagline}
                    </p>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap gap-3">
                    {blueprint.target_audience && (
                        <div className="flex items-center gap-1.5 text-amber-500">
                            <Target className="h-3.5 w-3.5" />
                            <span className="font-[JetBrains_Mono] text-xs truncate max-w-[120px]">
                                {blueprint.target_audience}
                            </span>
                        </div>
                    )}
                    {blueprint.monetization_model && (
                        <div className="flex items-center gap-1.5 text-green-500">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span className="font-[JetBrains_Mono] text-xs">
                                {blueprint.monetization_model}
                            </span>
                        </div>
                    )}
                </div>

                {/* MVP Features preview */}
                {blueprint.mvp_features && blueprint.mvp_features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <p className="font-[JetBrains_Mono] text-xs text-zinc-500 mb-2">
                            {blueprint.mvp_features.length} MVP Features
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {blueprint.mvp_features.slice(0, 3).map((feature, index) => (
                                <span
                                    key={index}
                                    className="rounded-full bg-zinc-800 px-2.5 py-1 font-[JetBrains_Mono] text-xs text-zinc-400 truncate max-w-[150px]"
                                >
                                    {feature}
                                </span>
                            ))}
                            {blueprint.mvp_features.length > 3 && (
                                <span className="rounded-full bg-zinc-800 px-2.5 py-1 font-[JetBrains_Mono] text-xs text-zinc-500">
                                    +{blueprint.mvp_features.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Hover footer */}
            <div className="flex items-center justify-end gap-2 border-t border-zinc-800 bg-zinc-900 px-5 py-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-[JetBrains_Mono] text-xs text-cyan-400">
                    View Details
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
