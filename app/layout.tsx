// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevMatch v2 — Find Your Perfect Dev Partner",
  description:
    "AI-powered developer matching platform. Connect with developers who complement your skills, share your interests, and match your experience level.",
  keywords: ["developer", "matching", "collaboration", "github", "open source"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(222 47% 6%)",
                border: "1px solid hsl(217 33% 14%)",
                color: "hsl(210 40% 98%)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
