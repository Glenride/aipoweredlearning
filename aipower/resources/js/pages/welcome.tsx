import { Head, Link, usePage } from '@inertiajs/react';

import { login, register } from '@/routes';
import { type SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="AETHER - The Operating System for the One-Person Holding Company">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=merriweather:400,700,900|jetbrains-mono:400,500,600"
                    rel="stylesheet"
                />
                <meta
                    name="description"
                    content="Stop trading time. Start building leverage. AETHER is the operating system for the One-Person Holding Company."
                />
            </Head>

            <div className="dark min-h-screen bg-[#050505] text-[#E8E8E8]">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
                    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="font-[Merriweather] text-xl font-bold tracking-tight text-white">
                            AETHER
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-[JetBrains_Mono] text-sm text-white transition-all hover:border-white/20 hover:bg-white/10"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="font-[JetBrains_Mono] text-sm text-[#A8A8A8] transition-colors hover:text-white"
                                    >
                                        Login
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2 font-[JetBrains_Mono] text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-blue-400 hover:shadow-lg hover:shadow-purple-500/25"
                                        >
                                            Initialize The Architect
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
                    {/* Animated background gradient */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-1/2 left-1/4 h-[800px] w-[800px] rounded-full bg-purple-600/10 blur-[120px]" />
                        <div className="absolute top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
                        <div className="absolute -bottom-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <h1 className="mb-6 font-[Merriweather] text-5xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                            The Era of the Employee{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                is Over.
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl font-[JetBrains_Mono] text-lg leading-relaxed text-[#A8A8A8] md:text-xl">
                            Stop trading time. Start building leverage.{' '}
                            <span className="text-white">AETHER</span> is the
                            operating system for the One-Person Holding
                            Company.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={canRegister ? register() : login()}
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-4 font-[JetBrains_Mono] text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-purple-500/30"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <span className="relative">
                                    [ Initialize The Architect ]
                                </span>
                            </Link>
                            <span className="font-[JetBrains_Mono] text-sm italic text-[#666]">
                                No courses. No videos. Pure actionable
                                intelligence.
                            </span>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <svg
                            className="h-6 w-6 text-[#666]"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Problem Section - The Assembly Line */}
                <section className="relative border-t border-white/5 px-6 py-24 md:py-32">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8 font-[JetBrains_Mono] text-sm uppercase tracking-widest text-purple-400">
                            // The Problem
                        </div>
                        <h2 className="mb-8 font-[Merriweather] text-4xl font-bold leading-tight text-white md:text-5xl">
                            You Were Trained for a World That No Longer Exists.
                        </h2>
                        <div className="space-y-6 font-[JetBrains_Mono] text-lg leading-relaxed text-[#A8A8A8]">
                            <p>
                                The assembly line demanded compliance. The gig
                                economy demands exhaustion. Both are traps
                                designed to keep you renting your time.
                            </p>
                            <p>
                                In 2026, the cost of creation is{' '}
                                <span className="text-white">zero</span>. The
                                only scarce asset is{' '}
                                <span className="italic text-cyan-400">
                                    specific human judgment
                                </span>
                                . If you are not using AI to clone your mind,
                                you are falling behind.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Solution Section - The Digital Twin */}
                <section className="relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0f] px-6 py-24 md:py-32">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8 font-[JetBrains_Mono] text-sm uppercase tracking-widest text-blue-400">
                            // The Solution
                        </div>
                        <h2 className="mb-8 font-[Merriweather] text-4xl font-bold leading-tight text-white md:text-5xl">
                            Don't Just Learn.{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Build.
                            </span>
                        </h2>
                        <div className="space-y-6 font-[JetBrains_Mono] text-lg leading-relaxed text-[#A8A8A8]">
                            <p>
                                Traditional education is passive. AETHER is{' '}
                                <span className="text-white">active</span>. We
                                don't give you a PDF; we give you{' '}
                                <span className="font-bold text-white">
                                    The Architect
                                </span>
                                —an AI engine trained on the frameworks of the
                                world's top operators.
                            </p>
                            <p>
                                It doesn't just "teach" you business. It{' '}
                                <span className="text-cyan-400">
                                    interviews you
                                </span>
                                , extracts your specific knowledge, and
                                architects a custom business model for you in
                                real-time.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Feature Showcase */}
                <section className="relative border-t border-white/5 px-6 py-24 md:py-32">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 text-center">
                            <div className="mb-4 font-[JetBrains_Mono] text-sm uppercase tracking-widest text-purple-400">
                                // The Process
                            </div>
                            <h2 className="font-[Merriweather] text-3xl font-bold text-white md:text-4xl">
                                From Knowledge to Revenue in 14 Days
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5">
                                <div className="mb-6 font-[JetBrains_Mono] text-4xl font-bold text-purple-400">
                                    01
                                </div>
                                <h3 className="mb-4 font-[Merriweather] text-xl font-bold text-white">
                                    The Extraction
                                </h3>
                                <p className="font-[JetBrains_Mono] text-sm leading-relaxed text-[#A8A8A8]">
                                    We identify your "Specific Knowledge"—the
                                    intersection of your skills, interests, and
                                    personality that cannot be automated.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
                                <div className="mb-6 font-[JetBrains_Mono] text-4xl font-bold text-blue-400">
                                    02
                                </div>
                                <h3 className="mb-4 font-[Merriweather] text-xl font-bold text-white">
                                    The Blueprint
                                </h3>
                                <p className="font-[JetBrains_Mono] text-sm leading-relaxed text-[#A8A8A8]">
                                    The Architect generates a complete
                                    Micro-SaaS or Productized Service roadmap
                                    tailored to your constraints.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5">
                                <div className="mb-6 font-[JetBrains_Mono] text-4xl font-bold text-cyan-400">
                                    03
                                </div>
                                <h3 className="mb-4 font-[Merriweather] text-xl font-bold text-white">
                                    The Execution
                                </h3>
                                <p className="font-[JetBrains_Mono] text-sm leading-relaxed text-[#A8A8A8]">
                                    Receive a step-by-step interactive sprint
                                    plan to launch your MVP in 14 days.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative border-t border-white/5 bg-gradient-to-b from-[#0a0a0f] to-[#050505] px-6 py-24 md:py-32">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-[100px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 font-[Merriweather] text-3xl font-bold text-white md:text-4xl">
                            Ready to Build Your Empire?
                        </h2>
                        <p className="mb-10 font-[JetBrains_Mono] text-lg text-[#A8A8A8]">
                            Join the founders who've stopped trading time for
                            money.
                        </p>
                        <Link
                            href={canRegister ? register() : login()}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-4 font-[JetBrains_Mono] text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-purple-500/30"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className="relative">
                                [ Initialize The Architect ]
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 px-6 py-12">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex flex-col items-center gap-2 md:items-start">
                            <div className="font-[Merriweather] text-lg font-bold text-white">
                                AETHER
                            </div>
                            <p className="font-[JetBrains_Mono] text-sm text-[#666]">
                                © 2026. Sovereignty is the new retirement.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link
                                href={login()}
                                className="font-[JetBrains_Mono] text-sm text-[#A8A8A8] transition-colors hover:text-white"
                            >
                                Login
                            </Link>
                            <a
                                href="#"
                                className="font-[JetBrains_Mono] text-sm text-[#A8A8A8] transition-colors hover:text-white"
                            >
                                Manifesto
                            </a>
                            <a
                                href="#"
                                className="font-[JetBrains_Mono] text-sm text-[#A8A8A8] transition-colors hover:text-white"
                            >
                                Twitter
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
