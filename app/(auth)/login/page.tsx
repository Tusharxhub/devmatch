"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { validateForm, commonValidationRules, type ValidationErrors } from "@/lib/form-validation"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import { signInWithGitHub, signInWithEmail } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { playSound } = useSound()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData, {
      email: commonValidationRules.email,
      password: { required: true, minLength: 1 },
    })

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      playSound("error")
      return
    }

    setIsLoading(true)
    playSound("medium")

    try {
      await signInWithEmail(formData.email, formData.password)
      playSound("success")
      toast({
        title: "Login successful",
        description: "Welcome back to DevMatch!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      playSound("error")
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    playSound("medium")

    try {
      await signInWithGitHub()
    } catch (error: any) {
      playSound("error")
      toast({
        title: "GitHub login failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border border-gray-800 bg-black/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full bg-gray-800 hover:bg-gray-700 text-white gap-2 group relative overflow-hidden"
          onClick={handleGitHubLogin}
          disabled={isLoading}
        >
          <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
          <Github className="h-5 w-5" />
          <span className="relative z-10">Continue with GitHub</span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-code-green">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className={cn(
                "bg-gray-900 border-gray-700 focus:border-primary-teal focus:ring-primary-teal",
                errors.email && "border-red-500 focus:border-red-500",
              )}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-code-green">
                Password
              </Label>
              <Link href="#" className="text-xs text-primary-teal hover:underline" onClick={() => playSound("high")}>
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-gray-900 border-gray-700 focus:border-primary-teal focus:ring-primary-teal"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden"
            disabled={isLoading}
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
            <span className="relative z-10">{isLoading ? "Logging in..." : "Login"}</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary-teal hover:underline" onClick={() => playSound("high")}>
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
