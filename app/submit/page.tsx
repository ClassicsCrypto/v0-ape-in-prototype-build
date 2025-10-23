"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, ArrowLeft, ImageIcon, Video } from "lucide-react"
import { xpSystem } from "@/lib/xp-system"
import Link from "next/link"

export default function SubmitSparkPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: null as File | null,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, media: file })
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Determine media type
      if (file.type.startsWith("image/")) {
        setMediaType("image")
      } else if (file.type.startsWith("video/")) {
        setMediaType("video")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Award XP for submitting idea
    const xpGained = xpSystem.awardXP('SUBMIT_IDEA')

    // Create spark object
    const spark = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      mediaUrl: previewUrl,
      mediaType,
      createdAt: new Date().toISOString(),
      hypes: 0,
      wipes: 0,
      boostedXP: 0,
      creatorId: 'current-user', // In real app, this would be the actual user ID
    }

    // Get existing sparks from localStorage
    const existingSparks = JSON.parse(localStorage.getItem("apeInSparks") || "[]")
    existingSparks.push(spark)
    localStorage.setItem("apeInSparks", JSON.stringify(existingSparks))

    // Show success message with XP gained
    alert(`Spark submitted successfully! You earned ${xpGained} XP.`)

    // Redirect to feed
    router.push("/feed")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Submit Spark
            </span>
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 border-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Upload */}
            <div className="space-y-4">
              <Label htmlFor="media" className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Visual Content
              </Label>

              {previewUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary">
                  {mediaType === "image" ? (
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Spark preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={previewUrl} controls className="w-full h-full object-cover" />
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreviewUrl(null)
                      setFormData({ ...formData, media: null })
                      setMediaType(null)
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="media"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    required
                  />
                  <Label htmlFor="media" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold">Upload Image or Video</p>
                        <p className="text-sm text-muted-foreground">Max 15 seconds for videos</p>
                      </div>
                      <div className="flex gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-xs">JPG, PNG</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span className="text-xs">MP4, MOV</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-bold">
                Spark Title
              </Label>
              <Input
                id="title"
                placeholder="Give your idea a catchy name..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-12 text-lg"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-bold">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your vision in a few sentences..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="text-lg resize-none"
              />
              <p className="text-xs text-muted-foreground">Keep it concise - curators swipe fast!</p>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold pulse-glow">
              <Sparkles className="mr-2 h-5 w-5" />
              Submit to Hype Feed
            </Button>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            Your Spark will be added to the Hype Feed where curators can discover and signal their interest. The more
            Hypes you get, the higher your chances of getting funded!
          </p>
        </Card>
      </div>
    </div>
  )
}
