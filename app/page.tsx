import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Github,
  MessageSquare,
  Network,
  Radar,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

const proofPoints = [
  { value: "4", label: "match signals" },
  { value: "<1s", label: "profile lookup" },
  { value: "Real", label: "time chat" },
  { value: "0", label: "manual sorting" },
];

const storySteps = [
  {
    step: "01",
    title: "Connect the repo that matters",
    text:
      "Sign in with GitHub and DevMatch reads the shape of your work: languages, cadence, contribution rhythm, and how active the profile really is.",
  },
  {
    step: "02",
    title: "See who fits the way you build",
    text:
      "Instead of a giant list, you get a ranked set of people with overlap that makes sense for the project, not just a generic skill match.",
  },
  {
    step: "03",
    title: "Start with context, not cold outreach",
    text:
      "Open a chat already anchored to why the match exists, so the first message feels like a continuation of work rather than a pitch.",
  },
];

const signalCards = [
  {
    title: "Language overlap",
    value: "84%",
    note: "TypeScript, React, Node",
    accent: "from-emerald-400/25 to-emerald-500/5",
  },
  {
    title: "Active this week",
    value: "12 commits",
    note: "steady, not noisy",
    accent: "from-pink-400/25 to-pink-500/5",
  },
  {
    title: "Most useful signal",
    value: "Shipping pace",
    note: "consistent contribution rhythm",
    accent: "from-cyan-400/25 to-cyan-500/5",
  },
];

const featureCards = [
  {
    icon: Radar,
    title: "Match scores that explain themselves",
    description:
      "Every score is broken into understandable signals so the result feels earned, not magical.",
    size: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: Network,
    title: "Built around real collaboration",
    description:
      "Profiles are tuned for pair programming, side projects, and teams that need people who actually ship.",
    size: "lg:col-span-1",
  },
  {
    icon: MessageSquare,
    title: "Conversation starts in context",
    description:
      "The first chat already carries the reasons for the match, so the intro is shorter and better.",
    size: "lg:col-span-1 lg:row-span-2",
  },
  {
    icon: Zap,
    title: "Fast enough to browse like a product",
    description:
      "Background jobs and cached signals keep the experience responsive without feeling stripped down.",
    size: "lg:col-span-1",
  },
  {
    icon: Users,
    title: "Designed for smaller, intentional teams",
    description:
      "Not everyone needs a giant network. This is built for the people who want a few high-quality matches.",
    size: "lg:col-span-1",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.12),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,rgba(8,11,20,1)_0%,rgba(6,8,14,1)_100%)] text-foreground">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
        <div className="absolute left-[-8%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-pink-500/10 blur-[120px] animate-blob-slow" />
        <div className="absolute bottom-[-12%] right-[-6%] h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] animate-blob-slow" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-lg shadow-pink-500/10">
              <GitBranch className="h-4 w-4 text-pink-300" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight sm:text-base">DevMatch</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">v2</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="#story"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
            >
              See the flow
            </a>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-pink-400/40 hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300 animate-fade-in">
                <Sparkles className="h-3.5 w-3.5" />
                Built from GitHub signals, not generic profiles
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-7xl animate-slide-up">
                Find developers who actually move at your pace.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg animate-slide-up" style={{ animationDelay: "80ms" }}>
                DevMatch reads the shape of your work, ranks people by real compatibility, and opens conversations with the context already attached.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center animate-slide-up" style={{ animationDelay: "140ms" }}>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-transform hover:-translate-y-0.5"
                >
                  <Github className="h-4 w-4" />
                  Start with GitHub
                </Link>
                <a
                  href="#story"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Read the product flow
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                {proofPoints.map((point) => (
                  <div key={point.label} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:bg-white/[0.05]">
                    <div className="text-2xl font-black tracking-tight text-white">{point.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">{point.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:pl-6">
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl animate-fade-in">
                <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-pink-500/20 blur-2xl sm:block" />
                <div className="absolute -bottom-5 left-8 hidden h-20 w-20 rounded-full bg-emerald-500/20 blur-2xl sm:block" />

                <div className="rounded-[1.4rem] border border-white/8 bg-[#0b1020]/95 p-4">
                  <div className="flex items-center justify-between border-b border-white/6 pb-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Live match deck</div>
                      <div className="mt-1 text-lg font-semibold text-white">Three profiles worth opening</div>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Updated 2 min ago
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-pink-400/15 bg-gradient-to-br from-pink-500/10 to-white/[0.02] p-5 transition-transform duration-300 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-pink-200/70">Top match</div>
                          <div className="mt-2 text-xl font-semibold text-white">Ari Chen</div>
                          <div className="text-sm text-muted-foreground">TypeScript • React • product-minded</div>
                        </div>
                        <div className="rounded-2xl border border-pink-400/20 bg-pink-400/10 px-3 py-2 text-right">
                          <div className="text-2xl font-black text-white">92</div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-pink-100/70">score</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {signalCards.map((card) => (
                          <div key={card.title} className={`rounded-xl border border-white/6 bg-gradient-to-r ${card.accent} px-3 py-3`}>
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-medium text-white">{card.title}</div>
                                <div className="text-xs text-muted-foreground">{card.note}</div>
                              </div>
                              <div className="text-right text-sm font-semibold text-white">{card.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 p-4 transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-[0.22em]">Chat ready</span>
                        </div>
                        <div className="mt-3 text-sm leading-6 text-muted-foreground">
                          Conversation opens with the reason for the match, so the first message feels specific instead of awkward.
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Signal view</div>
                            <div className="mt-1 text-base font-semibold text-white">What the app is actually reading</div>
                          </div>
                          <Star className="h-5 w-5 text-amber-300" />
                        </div>
                        <div className="mt-4 space-y-3">
                          {[
                            ["Repo cadence", "Strong"],
                            ["Language overlap", "High"],
                            ["Activity window", "This week"],
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                              <span className="text-sm text-muted-foreground">{label}</span>
                              <span className="text-sm font-medium text-white">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">Why it feels different</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A simple path from GitHub profile to first message.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              The page is intentionally paced like a product walkthrough, not a feature dump: connect, inspect the signal, then talk to someone with context.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {storySteps.map((step, index) => (
              <article
                key={step.step}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] ${
                  index === 0 ? "lg:col-span-5" : index === 1 ? "lg:col-span-4 lg:mt-10" : "lg:col-span-3 lg:mt-4"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">Step {step.step}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-[1.75rem] border border-pink-400/15 bg-gradient-to-br from-pink-500/12 to-white/[0.03] p-6 shadow-lg shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/15 bg-pink-400/10 px-3 py-1 text-xs font-medium text-pink-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Intentional by default
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">More selective than a directory, less noisy than a feed.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  The interface is built to make fewer, stronger choices visible first. That is the difference between a list of users and a product people return to.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featureCards.map((card) => (
                  <article
                    key={card.title}
                    className={`group rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] ${card.size}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-black/20 text-emerald-300 transition-transform duration-300 group-hover:scale-105">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Product-first landing page</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Built to feel like a product people would actually use.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  The layout stays dark and professional, but the composition is intentionally less symmetrical, with stronger visual hierarchy and varied component sizes.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-400/35 hover:bg-emerald-400/15"
              >
                <Github className="h-4 w-4" />
                Try DevMatch
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}