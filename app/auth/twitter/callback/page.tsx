"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function TwitterCallback() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle Twitter OAuth callback - this is now handled by thirdweb internally
    // but we keep this page for backward compatibility
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (code && state === 'twitter_auth') {
      // Redirect back to the main app - thirdweb will handle the authentication
      window.location.href = '/onboarding'
    } else {
      // Handle error case - redirect to onboarding with error
      window.location.href = '/onboarding?error=auth_failed'
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold">Completing X Authentication...</h2>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
        <p className="text-sm text-muted-foreground">You will be redirected automatically.</p>
      </div>
    </div>
  )
}
