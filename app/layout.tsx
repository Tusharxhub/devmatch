// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevMatch — Where Developers Build Together",
    template: "%s | DevMatch",
  },
  description:
    "DevMatch is the developer collaboration ecosystem. Create deep technical profiles, match with developers who complement your skills, collaborate on projects, and build engineering teams — powered by real GitHub signals.",
  keywords: [
    "developer matching",
    "developer collaboration",
    "open source",
    "GitHub",
    "team building",
    "developer networking",
    "code collaboration",
    "find developers",
    "engineering teams",
  ],
  authors: [{ name: "DevMatch" }],
  creator: "DevMatch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devmatch.dev",
    siteName: "DevMatch",
    title: "DevMatch — Where Developers Build Together",
    description:
      "The developer collaboration ecosystem. Match with developers, collaborate on projects, and build engineering teams.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevMatch — Developer Collaboration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMatch — Where Developers Build Together",
    description:
      "Match with developers who complement your skills. Build teams. Ship together.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--dm-bg-deep)] font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--dm-bg-surface)",
                border: "1px solid var(--dm-border)",
                color: "var(--dm-text-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.8125rem",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
