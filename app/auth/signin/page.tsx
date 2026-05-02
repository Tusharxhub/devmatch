// app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { Github, GitBranch, ArrowRight, Shield, Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Dev<span className="gradient-text">Match</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to find your perfect dev match
          </p>
        </div>

        {/* Sign in card */}
        <div className="glass-strong rounded-2xl p-8">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3">
              <Github className="w-5 h-5" />
              Continue with GitHub
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>We only request read access to your public profile and repos</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Zap className="w-4 h-4 text-violet-500 shrink-0" />
              <span>Your GitHub data is processed in the background — no waiting</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
