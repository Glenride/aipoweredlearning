import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Plus, Zap, Sparkles } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { BlueprintCard } from '@/components/blueprints/BlueprintCard';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, Blueprint, ChatSession, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [blueprintsRes, sessionsRes] = await Promise.all([
                fetch('/blueprints'),
                fetch('/chat/sessions'),
            ]);

            if (blueprintsRes.ok) {
                setBlueprints(await blueprintsRes.json());
            }
            if (sessionsRes.ok) {
                setSessions(await sessionsRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const activeSessions = sessions.filter((s) => s.status === 'active');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - AETHER">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=merriweather:400,700,900|jetbrains-mono:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-[Merriweather] text-2xl font-bold text-white">
                            Welcome back, {auth.user.name.split(' ')[0]}
                        </h1>
                        <p className="mt-1 font-[JetBrains_Mono] text-sm text-zinc-400">
                            Your blueprints for building leverage.
                        </p>
                    </div>
                    <Link
                        href="/architect"
                        className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 font-[JetBrains_Mono] text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-cyan-400 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                        <Zap className="h-4 w-4" />
                        Start New Session
                    </Link>
                </div>

                {/* Active Sessions */}
                {activeSessions.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                            <span className="font-[JetBrains_Mono] text-sm font-semibold text-amber-500">
                                Active Sessions
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeSessions.map((session) => (
                                <Link
                                    key={session.id}
                                    href="/architect"
                                    className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2 font-[JetBrains_Mono] text-sm text-amber-300 hover:bg-amber-500/20 transition-colors"
                                >
                                    {session.title || `Session #${session.id}`}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blueprints Grid */}
                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                    </div>
                ) : blueprints.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-12">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                            <Sparkles className="h-8 w-8 text-purple-400" />
                        </div>
                        <h2 className="mb-2 font-[Merriweather] text-xl font-bold text-white">
                            No Blueprints Yet
                        </h2>
                        <p className="mb-6 max-w-sm text-center font-[JetBrains_Mono] text-sm text-zinc-400">
                            Start a session with The Architect to extract your specific
                            knowledge and generate your first Strategy Card.
                        </p>
                        <Link
                            href="/architect"
                            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-[JetBrains_Mono] text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-cyan-400"
                        >
                            <Plus className="h-4 w-4" />
                            Create Your First Blueprint
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            <h2 className="font-[JetBrains_Mono] text-sm uppercase tracking-wider text-zinc-400">
                                Your Blueprints ({blueprints.length})
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {blueprints.map((blueprint) => (
                                <BlueprintCard key={blueprint.id} blueprint={blueprint} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
