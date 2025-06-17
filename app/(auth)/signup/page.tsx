"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, AlertCircle } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { signInWithGitHub, signUpWithEmail } from "@/lib/auth"

interface ValidationErrors {
  email?: string
  password?: string
  stackOverflow?: string
}

const commonValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format",
  },
  password: {
    minLength: 8,
    message: "Password must be at least 8 characters",
  },
}

const validateForm = (formData: any, rules: any) => {
  const errors: ValidationErrors = {}

  for (const field in rules) {
    const value = formData[field]
    const fieldRules = rules[field]

    if (fieldRules.required && !value) {
      errors[field] = `${field} is required`
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || `Invalid ${field}`
    }

    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.minLength} characters`
    }

    if (fieldRules.custom) {
      const customError = fieldRules.custom(value)
      if (customError) {
        errors[field] = customError
      }
    }
  }

  return errors
}

export default function SignupPage() {
  const router = useRouter()
  const { playSound } = useSound()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    stackOverflow: "",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      termsAccepted: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData, {
      email: commonValidationRules.email,
      password: commonValidationRules.password,
      stackOverflow: {
        pattern: /^[a-zA-Z0-9-_]+$/,
        custom: (value: string) => {
          if (value && value.length < 3) {
            return "Username must be at least 3 characters"
          }
          return null
        },
      },
    })

    setErrors(validationErrors)

    if (!formData.termsAccepted) {
      playSound("error")
      toast({
        title: "Terms required",
        description: "You must accept the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(validationErrors).length > 0) {
      playSound("error")
      return
    }

    setIsLoading(true)
    playSound("medium")

    try {
      await signUpWithEmail(formData.email, formData.password, formData.email.split("@")[0])
      playSound("success")
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      })
    } catch (error: any) {
      playSound("error")
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred while creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubSignup = async () => {
    setIsLoading(true)
    playSound("medium")

    try {
      await signInWithGitHub()
    } catch (error: any) {
      playSound("error")
      toast({
        title: "GitHub signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border border-gray-800 bg-black/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">Join DevMatch to find your perfect coding partner</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full bg-gray-800 hover:bg-gray-700 text-white gap-2 group relative overflow-hidden"
          onClick={handleGitHubSignup}
          disabled={isLoading}
        >
          <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
          <Github className="h-5 w-5" />
          <span className="relative z-10">Sign up with GitHub</span>
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
            <Label htmlFor="password" className="text-code-green">
              Password
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="stackOverflow" className="text-code-green">
              Stack Overflow Username (Optional)
            </Label>
            <Input
              id="stackOverflow"
              name="stackOverflow"
              type="text"
              placeholder="your_username"
              className="bg-gray-900 border-gray-700 focus:border-primary-teal focus:ring-primary-teal"
              value={formData.stackOverflow}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
              className="border-primary-teal data-[state=checked]:bg-primary-teal data-[state=checked]:text-white"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the{" "}
              <Link href="#" className="text-primary-teal hover:underline" onClick={() => playSound("high")}>
                terms and conditions
              </Link>
            </label>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden"
            disabled={isLoading}
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
            <span className="relative z-10">{isLoading ? "Creating account..." : "Create account"}</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-teal hover:underline" onClick={() => playSound("high")}>
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
