"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Upload, Mail, Twitter } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<"method" | "details">("method")
  const [authMethod, setAuthMethod] = useState<"email" | "twitter" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null as File | null,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profileImage: file })
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate account creation and store in localStorage
    const userData = {
      name: formData.name,
      email: formData.email,
      xp: 0,
      authMethod,
      profileImage: previewUrl,
    }
    localStorage.setItem("apeInUser", JSON.stringify(userData))
    router.push("/profile")
  }

  const handleTwitterAuth = () => {
    setAuthMethod("twitter")
    setStep("details")
  }

  const handleEmailAuth = () => {
    setAuthMethod("email")
    setStep("details")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ApeIn
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {step === "method" ? "Choose your path" : "Create your Status Card"}
          </p>
        </div>

        {step === "method" ? (
          /* Auth Method Selection */
          <div className="space-y-4">
            <Button
              onClick={handleTwitterAuth}
              size="lg"
              className="w-full h-16 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Twitter className="mr-2 h-5 w-5" />
              Continue with X
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={handleEmailAuth}
              size="lg"
              variant="outline"
              className="w-full h-16 text-lg font-bold border-2 bg-transparent"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Email
            </Button>
          </div>
        ) : (
          /* Profile Details Form */
          <Card className="p-6 border-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-border">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Upload Photo</span>
                  </Button>
                </Label>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 text-lg"
                />
              </div>

              {/* Email Input (only for email auth) */}
              {authMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 text-lg"
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold pulse-glow">
                Create Status Card
              </Button>

              {/* Back Button */}
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep("method")} className="w-full">
                Back
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
