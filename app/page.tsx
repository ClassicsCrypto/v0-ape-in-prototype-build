import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-pulse" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-balance">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ApeIn
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-muted-foreground">Hype the next big IP</p>
        </div>

        {/* Value prop */}
        <p className="text-lg md:text-xl text-foreground/80 max-w-lg mx-auto text-balance">
          Discover, curate, and fund the next wave of Web3 culture. Swipe to find viral concepts before they blow up.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/onboarding">
            <Button size="lg" className="text-lg px-8 py-6 font-bold bg-primary hover:bg-primary/90 pulse-glow">
              Get Started
            </Button>
          </Link>
          <Link href="/feed">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 font-bold border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              Explore Feed
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-12 max-w-xl mx-auto">
          <div className="space-y-1">
            <div className="text-3xl font-black text-primary">1.2K</div>
            <div className="text-sm text-muted-foreground">Sparks</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-secondary">850</div>
            <div className="text-sm text-muted-foreground">Curators</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-accent">42</div>
            <div className="text-sm text-muted-foreground">Funded</div>
          </div>
        </div>
      </div>
    </div>
  )
}
