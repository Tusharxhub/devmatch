// app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Github, Zap, ArrowRight, Loader2, Code2, Users, Shield } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSignIn(provider: string) {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="min-h-screen flex bg-[var(--dm-bg-deep)]">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--dm-accent)]/5 via-transparent to-[var(--dm-cyan)]/5" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--dm-text-faint) 1px, transparent 1px), linear-gradient(90deg, var(--dm-text-faint) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 max-w-md p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--dm-accent)] flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Dev<span className="text-[var(--dm-accent)]">Match</span>
            </span>
          </div>

          <h1 className="text-display-sm mb-4">
            Build with developers who
            <br />
            <span className="gradient-text-accent">match your pace</span>
          </h1>

          <p className="text-body-lg mb-10 max-w-sm">
            GitHub-powered matching. No profiles to fill. Connect with collaborators based on real engineering signals.
          </p>

          <div className="space-y-4">
            {[
              { icon: Code2, text: "GitHub-native intelligence" },
              { icon: Users, text: "Multi-factor matching engine" },
              { icon: Shield, text: "Enterprise-grade security" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-[var(--dm-text-secondary)]">
                <div className="w-7 h-7 rounded-md bg-[var(--dm-bg-surface)] border border-[var(--dm-border)] flex items-center justify-center">
                  <item.icon className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Sign In */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-9 h-9 rounded-lg bg-[var(--dm-accent)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">
              Dev<span className="text-[var(--dm-accent)]">Match</span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-heading-xl mb-2">Welcome back</h2>
            <p className="text-body-md">Sign in to continue to DevMatch</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-[var(--radius-md)] bg-[var(--dm-accent-muted)] border border-[rgba(230,57,86,0.2)] text-sm text-[var(--dm-accent)]">
              {error === "OAuthAccountNotLinked"
                ? "This email is already linked to another account."
                : "Authentication failed. Please try again."}
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={loading === "github" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
              onClick={() => handleSignIn("github")}
              disabled={!!loading}
            >
              Continue with GitHub
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon={
                loading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )
              }
              onClick={() => handleSignIn("google")}
              disabled={!!loading}
            >
              Continue with Google
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--dm-text-faint)]">
              By continuing, you agree to DevMatch&apos;s{" "}
              <a href="#" className="text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)] underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)] underline">
                Privacy Policy
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--dm-bg-deep)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
