"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle } from "lucide-react"
import { soundManager } from "@/lib/sounds"

interface AdminAccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminAccessDialog({ open, onOpenChange }: AdminAccessDialogProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === "0000") {
      soundManager.playSuccessSound()
      onOpenChange(false)
      setPassword("")
      router.push("/admin")
    } else {
      soundManager.playErrorSound()
      setError("Invalid password. Please try again.")
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    soundManager.playButtonClick()
    setPassword("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-squid-pink/20 bg-squid-white">
        <DialogHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-squid-pink/10 flex items-center justify-center mb-4 animate-glow-pink">
            <Shield className="h-6 w-6 text-squid-pink" />
          </div>
          <DialogTitle className="text-xl font-bold text-squid-pink">Admin Access Required</DialogTitle>
          <DialogDescription>Enter the 4-digit admin password to access the dashboard</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter 4-digit password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={4}
              className="text-center text-lg tracking-widest border-squid-pink/30 focus:border-squid-pink squid-focus"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-squid-pink/30 hover:border-squid-pink hover:bg-squid-pink/10 squid-interactive"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={password.length !== 4 || isLoading}
              className="squid-button squid-interactive"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Access Admin Dashboard"
              )}
            </Button>
          </DialogFooter>
        </form>

        <div className="text-xs text-center text-muted-foreground mt-4">
          Hint: The password is a 4-digit number starting with 0
        </div>
      </DialogContent>
    </Dialog>
  )
}
