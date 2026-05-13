// app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, ArrowRight, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  OAuthSignin: "Error constructing an authorization URL.",
  OAuthCallback: "Error handling the OAuth callback.",
  OAuthCreateAccount: "Could not create a provider account.",
  EmailCreateAccount: "Could not create an email provider account.",
  Callback: "Error in the OAuth callback handler.",
  OAuthAccountNotLinked: "This email is already associated with another account.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An unexpected authentication error occurred.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";
  const message = errorMessages[errorType] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dm-bg-deep)] p-6">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-xl bg-[var(--dm-accent-muted)] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7 text-[var(--dm-accent)]" />
        </div>

        <h1 className="text-heading-xl mb-3">Authentication Error</h1>
        <p className="text-body-lg mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/signin">
            <Button variant="primary" size="md">
              Try again
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="md">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--dm-bg-deep)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
