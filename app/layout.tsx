import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { SupabaseProvider } from "@/components/supabase-provider"
import { SoundProvider } from "@/components/sound-provider"
import { WebSocketProvider } from "@/components/websocket-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevMatch - Connect with Developers",
  description: "Find your perfect development partner",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <SoundProvider>
              <WebSocketProvider>{children}</WebSocketProvider>
            </SoundProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
