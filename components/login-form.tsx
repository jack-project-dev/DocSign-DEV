"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Hardcoded credentials check
    if (username === "jackson" && password === "Jack@123") {
      // Store auth state
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)

      // Clear any previous document data
      localStorage.removeItem("documentName")
      localStorage.removeItem("documentUploaded")
      localStorage.removeItem("signatureUrl")
      localStorage.removeItem("signatureUploaded")

      router.push("/upload-document")
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid username or password. Try jackson/Jack@123",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access DocSign</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jackson"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-muted-foreground">Hint: Username: jackson, Password: Jack@123</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
