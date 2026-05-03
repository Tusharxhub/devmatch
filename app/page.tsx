import Link from "next/link"
import {
  ArrowRight,
  Github,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"
import Badge from "@/components/ui/badge"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import Container from "@/components/ui/container"

const steps = [
  {
    step: "01",
    title: "Connect GitHub",
    desc: "Sign in and let DevMatch read the shape of your work: languages, pace, and contribution style.",
  },
  {
    step: "02",
    title: "Get ranked matches",
    desc: "See developers who fit the way you build, not just a generic skill list.",
  },
  {
    step: "03",
    title: "Start with context",
    desc: "Open a chat already anchored to why the match exists, so the first message is useful.",
  },
]

const features = [
  {
    icon: Zap,
    title: "Real signals",
    desc: "We match on actual activity instead of resume keywords.",
  },
  {
    icon: MessageSquare,
    title: "Context-rich chat",
    desc: "Each conversation starts with the reason for the match.",
  },
  {
    icon: Users,
    title: "Quality over volume",
    desc: "Fewer, better collaborators with a stronger fit.",
  },
  {
    icon: Github,
    title: "GitHub-native",
    desc: "Everything stays close to the workflow developers already use.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#eaeaf0]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-8%] h-96 w-96 rounded-full bg-[rgba(255,46,99,0.06)] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[-8%] h-80 w-80 rounded-full bg-[rgba(0,255,163,0.04)] blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-line backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff2e63]">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="text-base font-semibold">DevMatch</div>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="#how"
                className="hidden rounded-lg px-4 py-2 text-sm text-[#b0b0b8] transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-[#eaeaf0] sm:inline-flex"
              >
                How it works
              </a>
              <Link href="/auth/signin">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="relative z-10">
        <section className="py-20 md:py-32">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-2xl">
                <Badge variant="success" size="md">
                  <Sparkles className="h-3.5 w-3.5" />
                  GitHub signals, not generic profiles
                </Badge>

                <h1 className="text-display-lg mt-6 leading-tight">
                  Match with developers who actually ship
                </h1>

                <p className="text-body-sm mt-6 max-w-md">
                  DevMatch analyzes your GitHub activity and connects you with collaborators who match your code style, pace, and project needs.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/auth/signin">
                    <Button variant="primary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                      <Github className="h-4 w-4" />
                      Get started
                    </Button>
                  </Link>
                  <a href="#how">
                    <Button variant="secondary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-[#ff2e63]">500+</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#9ca3af]">Developers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#00ffa3]">&lt;1s</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#9ca3af]">Match time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#eaeaf0]">Real-time</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#9ca3af]">Chat</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-[rgba(255,46,99,0.08)] blur-2xl" />
                <Card variant="featured" className="relative">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,46,99,0.2)] bg-[rgba(255,46,99,0.1)]">
                          <Users className="h-6 w-6 text-[#ff2e63]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#eaeaf0]">Alex Chen</div>
                          <div className="text-xs text-[#9ca3af]">San Francisco</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#ff2e63]">94</div>
                        <div className="text-xs text-[#9ca3af]">Match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="accent" size="sm">TypeScript</Badge>
                      <Badge variant="accent" size="sm">React</Badge>
                      <Badge variant="accent" size="sm">Node.js</Badge>
                    </div>

                    <div className="space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#b0b0b8]">Language overlap</span>
                        <span className="font-semibold text-[#00ffa3]">88%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#b0b0b8]">Active this week</span>
                        <span className="font-semibold text-[#00ffa3]">12 commits</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        <section id="how" className="border-t border-line py-20 md:py-32">
          <Container>
            <div className="mb-16">
              <Badge variant="default" size="md" className="mb-4">
                Simple process
              </Badge>
              <h2 className="text-heading-xl max-w-2xl">Three steps to your next collaboration</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step}>
                  <div className="mb-3 inline-block text-sm font-bold text-[#ff2e63] transition-colors group-hover:text-[#00ffa3]">
                    {item.step}
                  </div>
                  <Card variant="interactive" className="cursor-default">
                    <h3 className="text-heading-md mb-3">{item.title}</h3>
                    <p className="text-body-sm">{item.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-line py-20 md:py-32">
          <Container>
            <div className="mb-16">
              <Badge variant="default" size="md" className="mb-4">
                Why DevMatch
              </Badge>
              <h2 className="text-heading-xl max-w-2xl">Built for professionals who code seriously</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {features.map((item) => (
                <Card key={item.title} variant="interactive">
                  <item.icon className="h-6 w-6 text-[#ff2e63]" />
                  <h3 className="text-heading-md mt-4">{item.title}</h3>
                  <p className="text-body-sm mt-2">{item.desc}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-line py-20 md:py-32">
          <Container size="sm">
            <div className="text-center">
              <h2 className="text-display-sm">Ready to find your collaborators?</h2>
              <p className="text-body-sm mx-auto mt-4 max-w-md text-[#b0b0b8]">
                Join developers who care about quality code and direct collaboration.
              </p>
              <Link href="/auth/signin" className="mt-8 inline-block">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Get started with GitHub
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-[#9ca3af]">
        <Container>
          <p>DevMatch - Professional developer matching platform</p>
        </Container>
      </footer>
    </div>
  )
}