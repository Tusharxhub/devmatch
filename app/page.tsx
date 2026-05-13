import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Github,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
  Code2,
  Globe,
  Shield,
  GitBranch,
  Terminal,
  Layers,
  Cpu,
  BarChart3,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import Container from "@/components/ui/container"
import { LandingHero } from "@/components/landing/landing-client"

export const metadata: Metadata = {
  title: "DevMatch — Where Developers Build Together",
  description:
    "DevMatch analyzes your GitHub activity and connects you with collaborators who match your code style, pace, and project needs. Not a dating app. A developer collaboration ecosystem.",
}

const workflowSteps = [
  {
    step: "01",
    title: "Connect your GitHub",
    description:
      "Sign in with GitHub. DevMatch reads the shape of your work — languages, contribution cadence, project complexity, and collaboration style.",
    icon: Github,
  },
  {
    step: "02",
    title: "Get precision matches",
    description:
      "Our multi-factor engine scores compatibility across language overlap, activity patterns, experience level, and collaboration intent.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Start with context",
    description:
      "Every conversation opens with why the match exists. No cold intros — just directed, productive collaboration from message one.",
    icon: MessageSquare,
  },
]

const features = [
  {
    icon: Code2,
    title: "GitHub-native intelligence",
    description:
      "We analyze repositories, contribution patterns, language distributions, and commit velocity — not self-reported skills.",
  },
  {
    icon: BarChart3,
    title: "Multi-factor scoring",
    description:
      "Compatibility is computed across language overlap, activity similarity, experience proximity, and intent alignment. Each factor is weighted and transparent.",
  },
  {
    icon: Users,
    title: "Project collaboration",
    description:
      "Create projects, invite collaborators, manage tasks with Kanban boards, and track progress together — all within DevMatch.",
  },
  {
    icon: Globe,
    title: "Community spaces",
    description:
      "Join communities around technologies and interests. Discuss, share, and find collaborators in focused developer spaces.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "JWT authentication, RBAC, rate limiting, CSRF protection, encrypted secrets, and audit logging. Production-grade from day one.",
  },
  {
    icon: Terminal,
    title: "Real-time everything",
    description:
      "Live messaging, typing indicators, online presence, notifications — all powered by WebSocket infrastructure with Redis pub/sub.",
  },
]

const stats = [
  { value: "4", suffix: "factors", label: "Matching dimensions" },
  { value: "<1", suffix: "s", label: "Match computation" },
  { value: "100", suffix: "%", label: "Open architecture" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--dm-bg-deep)] text-[var(--dm-text-primary)]">
      {/* ─── Background Atmosphere ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[rgba(230,57,86,0.04)] blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[rgba(45,212,160,0.03)] blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] h-[300px] w-[300px] rounded-full bg-[rgba(79,184,201,0.02)] blur-[100px]" />
      </div>

      {/* ─── Header ─── */}
      <header className="relative z-20 border-b border-[var(--dm-border)]">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dm-accent)] transition-shadow duration-300 group-hover:shadow-[0_0_16px_rgba(230,57,86,0.3)]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-base font-bold tracking-tight">
                Dev<span className="text-[var(--dm-accent)]">Match</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {["How it works", "Features", "Ecosystem"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="px-3.5 py-2 text-sm text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] transition-colors rounded-[var(--radius-md)] hover:bg-[var(--dm-bg-hover)]"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="primary" size="sm" icon={<Github className="h-4 w-4" />}>
                  Sign in with GitHub
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="relative z-10">
        {/* ─── HERO SECTION ─── */}
        <LandingHero />

        {/* ─── Stats bar ─── */}
        <section className="relative z-10 border-y border-[var(--dm-border)] bg-[var(--dm-bg-base)]">
          <Container>
            <div className="grid grid-cols-3 divide-x divide-[var(--dm-border)]">
              {stats.map((stat) => (
                <div key={stat.label} className="py-8 sm:py-10 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-[var(--dm-text-primary)]">
                      {stat.value}
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-[var(--dm-accent)]">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm text-[var(--dm-text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <Container>
            <div className="mb-16 sm:mb-20">
              <Badge variant="default" size="md" className="mb-5">
                <Layers className="h-3 w-3" />
                Process
              </Badge>
              <h2 className="text-display-sm max-w-xl">
                Three steps to your next
                <br />
                <span className="gradient-text-accent">collaboration</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {workflowSteps.map((item, i) => (
                <div key={item.step} className="group">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-label text-[var(--dm-accent)] font-mono">
                      {item.step}
                    </span>
                    <div className="h-px flex-1 bg-[var(--dm-border)]" />
                  </div>
                  <Card variant="interactive" padding="lg">
                    <item.icon className="h-6 w-6 text-[var(--dm-accent)] mb-5" />
                    <h3 className="text-heading-lg mb-3">{item.title}</h3>
                    <p className="text-body-md">{item.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" className="py-24 sm:py-32 border-t border-[var(--dm-border)]">
          <Container>
            <div className="mb-16 sm:mb-20 max-w-2xl">
              <Badge variant="default" size="md" className="mb-5">
                <Sparkles className="h-3 w-3" />
                Platform
              </Badge>
              <h2 className="text-display-sm mb-5">
                Built for developers who{" "}
                <span className="gradient-text-accent">ship seriously</span>
              </h2>
              <p className="text-body-lg max-w-xl">
                DevMatch is not a social network. It&apos;s engineering infrastructure for
                developer collaboration — matching, projects, communities, and real-time
                communication in one ecosystem.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={feature.title} variant="interactive" padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--dm-accent-muted)] flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-[var(--dm-accent)]" />
                    </div>
                  </div>
                  <h3 className="text-heading-md mb-2.5">{feature.title}</h3>
                  <p className="text-body-md">{feature.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ─── ECOSYSTEM ─── */}
        <section id="ecosystem" className="py-24 sm:py-32 border-t border-[var(--dm-border)]">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="info" size="md" className="mb-5">
                  <BookOpen className="h-3 w-3" />
                  Ecosystem
                </Badge>
                <h2 className="text-display-sm mb-6">
                  More than matching.
                  <br />
                  <span className="gradient-text-cool">A complete ecosystem.</span>
                </h2>
                <p className="text-body-lg mb-8 max-w-md">
                  DevMatch combines the best of GitHub, Discord, LinkedIn, and IndieHackers into a
                  single developer-first platform.
                </p>

                <div className="space-y-4">
                  {[
                    { label: "Deep technical profiles", desc: "GitHub-synced, portfolio-grade developer profiles" },
                    { label: "Project collaboration", desc: "Kanban boards, task management, activity feeds" },
                    { label: "Community spaces", desc: "Topic-based communities with discussions and moderation" },
                    { label: "Real-time messaging", desc: "Direct messages with typing indicators and presence" },
                    { label: "Developer feed", desc: "Updates, achievements, and collaboration requests" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3 group cursor-default">
                      <ChevronRight className="h-5 w-5 text-[var(--dm-accent)] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-[var(--dm-text-primary)]">
                          {item.label}
                        </div>
                        <div className="text-body-sm">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side — abstract visualization */}
              <div className="relative">
                <div className="absolute -inset-8 rounded-3xl bg-[rgba(230,57,86,0.03)] blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    { icon: GitBranch, label: "Projects", value: "∞", color: "var(--dm-accent)" },
                    { icon: Users, label: "Communities", value: "Open", color: "var(--dm-green)" },
                    { icon: MessageSquare, label: "Messages", value: "Real-time", color: "var(--dm-cyan)" },
                    { icon: BarChart3, label: "Analytics", value: "Deep", color: "var(--dm-amber)" },
                  ].map((item) => (
                    <Card key={item.label} variant="default" padding="lg" className="text-center">
                      <item.icon className="h-6 w-6 mx-auto mb-3" style={{ color: item.color }} />
                      <div className="text-xl font-bold font-display mb-1" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-xs text-[var(--dm-text-muted)]">{item.label}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-24 sm:py-32 border-t border-[var(--dm-border)]">
          <Container size="narrow">
            <div className="text-center">
              <h2 className="text-display-sm mb-5">
                Ready to find your
                <br />
                <span className="gradient-text-accent">collaborators?</span>
              </h2>
              <p className="text-body-lg mx-auto max-w-md mb-8">
                Join developers who value quality code, directed collaboration, and building
                together.
              </p>
              <Link href="/auth/signin">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Github className="h-4.5 w-4.5" />}
                  className="mx-auto"
                >
                  Get started with GitHub
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--dm-border)] py-12">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--dm-accent)]">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-sm font-bold">
                Dev<span className="text-[var(--dm-accent)]">Match</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--dm-text-muted)]">
              <a href="#" className="hover:text-[var(--dm-text-primary)] transition-colors">
                About
              </a>
              <a href="#" className="hover:text-[var(--dm-text-primary)] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[var(--dm-text-primary)] transition-colors">
                Terms
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--dm-text-primary)] transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-[var(--dm-text-faint)]">
              © {new Date().getFullYear()} DevMatch. Engineer your network.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}