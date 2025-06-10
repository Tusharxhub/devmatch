import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
        <span className="font-medium">Back</span>
      </Link>

      <div className="w-full max-w-md">
        <Card className="border-pink-500/20">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center mb-4">
              <Github className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Join DevMatch to find your perfect coding partner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button className="w-full bg-[#24292e] hover:bg-[#24292e]/90 text-white">
                <Github className="mr-2 h-5 w-5" />
                Sign up with GitHub
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" disabled>
                Email & Password Coming Soon
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-pink-500 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DevMatch. All rights reserved.
      </div>
    </div>
  )
}
