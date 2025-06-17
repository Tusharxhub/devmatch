import { createClient } from "@/lib/supabase-middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/matches", "/chat", "/collaborations", "/settings", "/admin"]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return Response.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth pages with session
  const authRoutes = ["/login", "/signup"]
  if (authRoutes.includes(request.nextUrl.pathname) && session) {
    return Response.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
