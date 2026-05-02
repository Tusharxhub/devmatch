// app/auth/error/page.tsx
"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, GitBranch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected error occurred during authentication.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-8">
          {errorMessages[error || "Default"] || errorMessages.Default}
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <GitBranch className="w-8 h-8 animate-pulse text-muted-foreground" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
