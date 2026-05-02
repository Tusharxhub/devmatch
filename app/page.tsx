// app/page.tsx
// Landing page — unauthenticated visitors
import Link from "next/link";
import {
  GitBranch,
  Users,
  Zap,
  MessageSquare,
  ArrowRight,
  Github,
  Code2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Github,
    title: "GitHub-Powered Profiles",
    description:
      "We analyze your repos, languages, stars, and contribution history to build a rich developer profile automatically.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description:
      "Our multi-factor algorithm scores compatibility based on shared languages, activity patterns, experience, and goals.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Chat",
    description:
      "Connect instantly with your matches through built-in messaging with online status and typing indicators.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Code2,
    title: "Background Processing",
    description:
      "Scores are precomputed by our worker service. No loading spinners — matches are instant when you need them.",
    gradient: "from-pink-500 to-rose-600",
  },
];

const stats = [
  { value: "100%", label: "Open Source" },
  { value: "4", label: "Match Factors" },
  { value: "<1s", label: "Match Lookup" },
  { value: "∞", label: "Connections" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background grid + gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/8 blur-[128px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Dev<span className="gradient-text">Match</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground ml-1 mt-1">v2</span>
          </div>
          <Link
            href="/auth/signin"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 transition-all duration-300 text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            Sign in with GitHub
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-medium mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            Powered by GitHub + AI Matching
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Find developers who
            <br />
            <span className="gradient-text">complete your stack</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            DevMatch analyzes your GitHub profile, computes compatibility scores
            against other developers, and connects you with your ideal
            collaborator, mentor, or co-founder.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/auth/signin"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                <Github className="w-5 h-5" />
                Get Started — It&apos;s Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all"
            >
              <Code2 className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-5 text-center hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-2xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sign in with GitHub and we handle the rest. Your profile is analyzed,
            matches are computed in the background, and you connect instantly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group glass rounded-2xl p-7 hover:bg-white/[0.04] transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass-strong rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Production-Grade Architecture
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Built with service separation, background workers, Redis caching, and
            real-time messaging. Not a prototype — a real system.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "⚡", label: "Next.js App", sublabel: "UI + API" },
              { icon: "🔄", label: "Worker", sublabel: "BullMQ Jobs" },
              { icon: "🗄️", label: "PostgreSQL", sublabel: "Prisma ORM" },
              { icon: "📡", label: "Redis", sublabel: "Cache + Queue" },
            ].map((svc) => (
              <div
                key={svc.label}
                className="rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-violet-500/20 transition-colors"
              >
                <div className="text-2xl mb-2">{svc.icon}</div>
                <div className="text-sm font-semibold">{svc.label}</div>
                <div className="text-xs text-muted-foreground">{svc.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3 h-3" />
            DevMatch v2
          </div>
          <div>Built with Next.js, Prisma, Redis, Docker</div>
        </div>
      </footer>
    </div>
  );
}
