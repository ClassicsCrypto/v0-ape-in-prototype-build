"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Mail, Twitter, Zap, CheckCircle, Wallet } from "lucide-react"
import { ThirdwebSocialAuth } from "@/components/thirdweb-social-auth"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<"method" | "details" | "wallet">("method")
  const [authMethod, setAuthMethod] = useState<"email" | "twitter" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null as File | null,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Always start with social auth selection
  // Reset state on component mount to ensure clean start
  useEffect(() => {
    // Clear any existing user data to ensure fresh onboarding
    localStorage.removeItem("apeInUser")
    setStep("method")
    setAuthMethod(null)
    setFormData({
      name: "",
      email: "",
      profileImage: null,
    })
    setPreviewUrl(null)
    setIsCreatingWallet(false)
    setWalletCreated(false)
    setXpEarned(0)
    setIsAuthenticating(false)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profileImage: file })
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
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
          /* Social Auth Selection */
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Choose Your Sign-In Method</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Select either Google or X to create your account. You can only choose one option.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-3">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Earn XP for Signing Up
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Connect with Google or X</span>
                    <span className="font-bold text-primary">+50 XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thirdweb Social Auth */}
            <ThirdwebSocialAuth 
              onXpEarned={(xp) => {
                setXpEarned(xp);
              }}
              onAuthSuccess={(method, userData) => {
                setAuthMethod(method as "email" | "twitter");
                setStep("details");
              }}
              forceShowButtons={true}
            />
          </div>
        ) : step === "details" ? (
          /* Simple Profile Creation */
          <Card className="p-6 border-2">
            <div className="space-y-6">
              {/* XP Reward Display */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-bold text-primary">Gain +50 XP</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create your account to start earning XP
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Choose Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  This name will be checked for availability
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={async () => {
                  // Simulate name check and account creation
                  if (formData.name.trim()) {
                    // Calculate XP earned
                    let totalXp = 100 // Base XP for profile completion
                    if (authMethod === "twitter") {
                      totalXp += 50 // Extra XP for X connection
                    }
                    
                    setXpEarned(totalXp)
                    setStep("wallet")
                    
                    // Simulate smart wallet creation
                    setIsCreatingWallet(true)
                    
                    // Simulate wallet creation delay
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    
                    // Generate a mock wallet address
                    const mockWalletAddress = `0x${Math.random().toString(16).substr(2, 40)}`
                    
                    // Store user data with wallet info
                    const userData = {
                      name: formData.name,
                      email: formData.email,
                      xp: totalXp,
                      authMethod,
                      profileImage: previewUrl,
                      walletAddress: mockWalletAddress,
                      smartWalletCreated: true,
                      createdAt: new Date().toISOString(),
                    }
                    
                    localStorage.setItem("apeInUser", JSON.stringify(userData))
                    setWalletCreated(true)
                    setIsCreatingWallet(false)
                    
                    // Auto redirect after showing success
                    setTimeout(() => {
                      router.push("/profile")
                    }, 3000)
                  }
                }}
                size="lg" 
                className="w-full h-12 text-lg font-bold pulse-glow"
                disabled={!formData.name.trim()}
              >
                Create Account
              </Button>

              {/* Back Button */}
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep("method")} className="w-full">
                Back to Sign-In Options
              </Button>
            </div>
          </Card>
        ) : (
          /* Account Creation Success */
          <Card className="p-8 border-2">
            <div className="text-center space-y-6">
              {isCreatingWallet ? (
                <>
                  <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <h3 className="text-xl font-bold">Creating Your Account</h3>
                  <p className="text-muted-foreground">
                    Setting up your account and profile...
                  </p>
                </>
              ) : walletCreated ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600">Account Created Successfully!</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="font-bold">XP Earned</span>
                      </div>
                      <div className="text-2xl font-black text-primary">+50 XP</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-blue-800">Account Ready</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Your account is ready to start discovering and creating sparks
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your feed in 3 seconds...
                  </p>
                </>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
