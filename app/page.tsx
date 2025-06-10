"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, MessageSquare, Calendar, Zap, Brain, Cpu, Network } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { soundManager } from "@/lib/sounds"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const particlesContainer = document.createElement("div")
      particlesContainer.className = "particles"
      document.body.appendChild(particlesContainer)

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.left = Math.random() * 100 + "%"
        particle.style.animationDelay = Math.random() * 3 + "s"
        particle.style.animationDuration = Math.random() * 3 + 2 + "s"
        particlesContainer.appendChild(particle)
      }
    }

    createParticles()

    return () => {
      const particles = document.querySelector(".particles")
      if (particles) {
        particles.remove()
      }
    }
  }, [])

  const handleGetStarted = () => {
    soundManager.playNeuralActivation()
    router.push("/signup")
  }

  const handleLearnMore = () => {
    soundManager.playDataTransfer()
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleNavClick = (href: string) => {
    soundManager.playNavigationClick()
  }

  return (
    <div className="min-h-screen neural-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-squid-pink via-squid-teal to-ai-purple flex items-center justify-center animate-neural-pulse">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold ai-title font-mono">DevMatch</h1>
            <p className="text-xs ai-subtitle">AI-Powered Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex border-2 border-squid-pink/30 hover:border-squid-pink hover:bg-squid-pink/10 ai-interactive font-sans"
            onClick={() => handleNavClick("/login")}
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="ai-button ai-interactive" onClick={() => handleNavClick("/signup")}>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-mono">
              Find Your{" "}
              <span className="squid-title animate-mask-reveal glitch" data-text="DevMatch">
                DevMatch
              </span>
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold font-sans">AI-Powered Developer Collaboration</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-[600px] font-sans">
            Experience the future of developer collaboration. Our advanced AI analyzes your coding patterns, matches you
            with compatible developers, and creates the perfect team synergy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="squid-button squid-interactive animate-marble-bounce"
              onClick={handleGetStarted}
            >
              <Brain className="mr-2 h-5 w-5 animate-guard-march" />
              Start AI Matching
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-squid-teal/50 hover:border-squid-teal hover:bg-squid-teal/10 ai-interactive font-sans"
              onClick={handleLearnMore}
            >
              <Cpu className="mr-2 h-5 w-5" />
              Explore AI Features
            </Button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-squid-pink/20 rounded-full blur-3xl animate-hologram-glow" />
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-squid-teal/20 rounded-full blur-2xl animate-ai-breathe" />
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-ai-purple/20 rounded-full blur-xl animate-neural-pulse" />
          <div className="relative w-full max-w-[500px] aspect-square mx-auto">
            <div className="ai-card w-full h-full rounded-2xl overflow-hidden animate-ai-breathe">
              <Image
                src="/placeholder.jpg?height=500&width=500"
                alt="AI-Powered DevMatch Platform"
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 border-2 border-squid-pink rounded-2xl transform rotate-3 animate-neon-border"></div>
            <div className="absolute inset-0 border-2 border-squid-teal rounded-2xl transform -rotate-3 animate-hologram-glow"></div>
            <div className="absolute top-4 right-4 bg-squid-pink/90 text-white px-3 py-1 rounded-full text-sm font-mono animate-countdown-tick">
              AI ACTIVE
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold ai-title font-mono mb-4">Next-Generation AI Matching</h2>
          <p className="text-xl text-muted-foreground font-sans">
            Experience the future of developer collaboration with our advanced AI algorithms
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-12 w-12 text-squid-pink" />,
              title: "Neural Code Analysis",
              description: "Our AI analyzes your coding patterns, style, and preferences to find perfect matches.",
              color: "squid-pink",
            },
            {
              icon: <Network className="h-12 w-12 text-squid-teal" />,
              title: "Smart Collaboration",
              description: "AI-powered team formation based on complementary skills and project requirements.",
              color: "squid-teal",
            },
            {
              icon: <Cpu className="h-12 w-12 text-ai-purple" />,
              title: "Predictive Matching",
              description: "Machine learning algorithms predict successful collaboration outcomes.",
              color: "ai-purple",
            },
            {
              icon: <MessageSquare className="h-12 w-12 text-squid-pink" />,
              title: "AI Chat Assistant",
              description: "Intelligent conversation starter suggestions and project idea generation.",
              color: "squid-pink",
            },
            {
              icon: <Calendar className="h-12 w-12 text-squid-teal" />,
              title: "Optimal Scheduling",
              description: "AI finds the perfect time slots for team collaboration across time zones.",
              color: "squid-teal",
            },
            {
              icon: <Zap className="h-12 w-12 text-ai-purple" />,
              title: "Performance Insights",
              description: "Real-time analytics on team productivity and collaboration effectiveness.",
              color: "ai-purple",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="squid-terminal squid-interactive animate-honeycomb-reveal squid-game-hover"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 space-y-4 relative overflow-hidden">
                <div className={`bg-${feature.color}/10 p-4 rounded-lg w-fit animate-hologram-glow`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-mono">{feature.title}</h3>
                <p className="text-muted-foreground font-sans">{feature.description}</p>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-squid-pink/10 to-transparent rounded-bl-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Testimonials */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 ai-title font-mono">AI-Enhanced Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "The AI matching was incredible! It found developers who not only had complementary skills but also shared my coding philosophy. We shipped 5 projects together!",
              name: "Arpan Samanta",
              role: "AI/ML Engineer",
              aiScore: "98%",
            },
            {
              quote:
                "DevMatch's neural analysis understood my coding style better than I did. The AI suggested optimizations that improved our team efficiency by 300%.",
              name: "Arijit Ghorai",
              role: "Full Stack Developer",
              aiScore: "96%",
            },
            {
              quote:
                "The predictive matching algorithm connected me with mentors who accelerated my growth. The AI knew exactly what I needed to learn next.",
              name: "Sudip Das",
              role: "Junior Developer",
              aiScore: "94%",
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="squid-terminal squid-interactive animate-vote-reveal"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <CardContent className="p-6 space-y-4 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-squid-teal via-ai-purple to-squid-pink flex items-center justify-center animate-neural-pulse">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="ai-badge-teal text-xs px-2 py-1 rounded-full">AI MATCH: {testimonial.aiScore}</div>
                  </div>
                </div>
                <p className="italic text-muted-foreground font-sans">{testimonial.quote}</p>
                <div>
                  <p className="font-bold font-mono">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-ai-purple/20 rounded-full animate-neural-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="ai-card relative overflow-hidden rounded-2xl">
          <div className="absolute -z-10 top-1/2 left-1/4 w-[400px] h-[400px] bg-squid-pink/20 rounded-full blur-3xl animate-tension-build" />
          <div className="absolute -z-10 top-1/2 right-1/4 w-[400px] h-[400px] bg-squid-teal/20 rounded-full blur-3xl animate-heartbeat" />
          <div className="absolute -z-10 top-1/4 left-1/2 w-[300px] h-[300px] bg-ai-purple/20 rounded-full blur-2xl animate-neural-pulse" />
          <div className="p-8 md:p-12 lg:p-16 text-center space-y-8 relative">
            <h2 className="text-3xl md:text-4xl font-bold ai-title font-mono">Ready for AI-Powered Collaboration?</h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto font-sans">
              Join the next generation of developers using artificial intelligence to find perfect collaborators,
              optimize team performance, and build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="squid-button squid-interactive animate-marble-bounce"
                onClick={handleGetStarted}
              >
                <Brain className="mr-2 h-5 w-5 animate-guard-march" />
                Activate AI Matching
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-ai-purple/50 hover:border-ai-purple hover:bg-ai-purple/10 ai-interactive font-sans"
                onClick={() => soundManager.playAIProcessing()}
              >
                <Network className="mr-2 h-5 w-5" />
                View AI Demo
              </Button>
            </div>
            <div className="absolute top-4 right-4 ai-badge-purple text-xs px-3 py-1 rounded-full animate-digital-flicker">
              NEURAL NETWORK ACTIVE
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-squid-pink/30 bg-gradient-to-r from-squid-pink/5 via-squid-teal/5 to-ai-purple/5 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-squid-pink via-squid-teal to-ai-purple flex items-center justify-center animate-neural-pulse">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold ai-title font-mono">DevMatch</h3>
                  <p className="text-xs ai-subtitle">AI-Powered Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                The future of developer collaboration powered by advanced artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-mono">AI Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    Neural Matching
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-mono">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    About AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-mono">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-muted-foreground hover:text-squid-pink ai-interactive font-sans"
                  >
                    AI Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t-2 border-squid-pink/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-sans">
              © {new Date().getFullYear()} DevMatch AI. All rights reserved. Powered by Neural Networks.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-squid-pink ai-interactive">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-squid-pink ai-interactive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-squid-pink ai-interactive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
