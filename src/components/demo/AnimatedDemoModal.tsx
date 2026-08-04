'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X, Copy, CheckCircle2, Package, Play, Pause, ArrowRight, MessageSquare,
  Users, Phone, MapPin, ShoppingCart, Truck, TrendingUp, Sparkles, Send, Clock,
  Volume2, VolumeX, SkipBack, SkipForward, Maximize, Minimize, Store, Check,
  Globe, ShieldCheck, ShoppingBag, CreditCard, ChevronRight, Eye, BarChart3, Award,
  PackageCheck, Plus
} from 'lucide-react'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

// 5 Storyboard Scenes with precise durations
const VIDEO_SCENES = [
  { id: 1, step: 'Step 1', name: 'Create Account', title: '1. Create Account & Set Store Name', duration: 5500 },
  { id: 2, step: 'Step 2', name: 'Add Products & Launch', title: '2. Add Products & Instant Store Launch', duration: 6500 },
  { id: 3, step: 'Step 3', name: 'Customer Self-Checkout', title: '3. Customer Self-Checkout', duration: 6000 },
  { id: 4, step: 'Step 4', name: 'Order Notification & Tracking', title: '4. Order Alert & Live WhatsApp Tracking', duration: 6000 },
  { id: 5, step: 'Step 5', name: 'Analytics & Scale', title: '5. Analytics & Custom White-Label Domain', duration: 5500 },
]

export function AnimatedDemoModal({ open, onClose }: DemoModalProps) {
  const totalScenes = VIDEO_SCENES.length
  const [currentScene, setCurrentScene] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [copiedUrl, setCopiedUrl] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize and manage audio playback
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/resellerpro-demo-audio.mp3')
      audio.loop = true
      audio.volume = 0.3
      audioRef.current = audio
    }

    const audio = audioRef.current

    if (open && isPlaying && !isMuted) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn('[DEMO-AUDIO] Autoplay notice:', err.message))
      }
    } else {
      audio.pause()
    }

    return () => {
      if (!open || !audioRef.current) {
        audio?.pause()
      }
    }
  }, [open, isPlaying, isMuted])

  // Progress timer (updates progress from 0 to 100)
  useEffect(() => {
    if (!open || !isPlaying) return

    const intervalTime = 50
    const duration = VIDEO_SCENES[currentScene]?.duration || 5500
    const increment = (100 / (duration / intervalTime)) * playbackSpeed

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return Math.min(100, prev + increment)
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [open, isPlaying, currentScene, playbackSpeed])

  // Handle scene transition cleanly when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      if (currentScene < totalScenes - 1) {
        setCurrentScene((prevScene) => prevScene + 1)
        setProgress(0)
      } else {
        setIsPlaying(false)
      }
    }
  }, [progress, isPlaying, currentScene, totalScenes])

  // Reset cleanly when modal opens
  useEffect(() => {
    if (open) {
      setCurrentScene(0)
      setProgress(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      setProgress(0)
      setCurrentScene(0)
    }
  }, [open])

  // Toggle Fullscreen mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  // Handle Scene Navigation
  const handleSceneChange = (index: number) => {
    setCurrentScene(index)
    setProgress(0)
    setIsPlaying(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://royalfashion.resellerpro.in')
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[92vh] max-h-[820px] p-0 gap-0 bg-background border-border text-foreground overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <VisuallyHidden>
          <DialogTitle>ResellerPro Interactive Storefront Demo</DialogTitle>
        </VisuallyHidden>

        {/* ── TOP HEADER WITH REAL LOGO ── */}
        <div className="bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="ResellerPro Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-foreground tracking-wide">ResellerPro</span>
                <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider">
                  Interactive Demo
                </Badge>
              </div>
            </div>
          </div>

          {/* Steps Navigation Bar */}
          <div className="hidden lg:flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            {VIDEO_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentScene === idx
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                }`}
              >
                <span className="text-[10px] opacity-75 font-mono">0{scene.id}</span>
                <span>{scene.name}</span>
              </button>
            ))}
          </div>

          {/* Controls: Audio & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-muted text-foreground hover:bg-accent transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary animate-pulse" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Close demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── MAIN SCENE VIEWPORT CONTAINER ── */}
        <div ref={containerRef} className="relative flex-1 bg-background flex flex-col justify-between overflow-hidden select-none">
          
          <div className="relative flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-4xl h-full flex flex-col justify-center items-center"
              >
                {currentScene === 0 && <Scene1Signup progress={progress} />}
                {currentScene === 1 && <Scene2AddProducts progress={progress} onCopyLink={handleCopyLink} copiedUrl={copiedUrl} />}
                {currentScene === 2 && <Scene3CustomerCheckout progress={progress} />}
                {currentScene === 3 && <Scene4OrderNotification progress={progress} />}
                {currentScene === 4 && <Scene5AnalyticsFinal onClose={onClose} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── BOTTOM VIDEO PLAYER CONTROL BAR ── */}
          <div className="bg-card/90 backdrop-blur-md border-t border-border p-4 space-y-3 flex-shrink-0 z-30">
            
            {/* Timeline Progress Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex gap-1.5 h-1.5 bg-muted rounded-full overflow-hidden p-0.5">
                {VIDEO_SCENES.map((scene, idx) => {
                  let barWidth = '0%'
                  if (idx < currentScene) barWidth = '100%'
                  else if (idx === currentScene) barWidth = `${progress}%`

                  return (
                    <div
                      key={scene.id}
                      onClick={() => handleSceneChange(idx)}
                      className="flex-1 bg-muted rounded-full overflow-hidden cursor-pointer relative h-full group"
                      title={scene.name}
                    >
                      <div
                        className="h-full bg-primary transition-all duration-75"
                        style={{ width: barWidth }}
                      />
                    </div>
                  )
                })}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground min-w-[50px] text-right font-medium">
                0{currentScene + 1} / 0{totalScenes}
              </span>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground font-extrabold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                  {VIDEO_SCENES[currentScene].step}
                </Badge>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {VIDEO_SCENES[currentScene].title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleSceneChange(Math.max(0, currentScene - 1))}
                  disabled={currentScene === 0}
                  className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-primary-foreground" /> : <Play className="w-4 h-4 fill-primary-foreground" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => handleSceneChange(Math.min(totalScenes - 1, currentScene + 1))}
                  disabled={currentScene === totalScenes - 1}
                  className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                  className="px-2.5 py-1.5 rounded-xl bg-muted text-foreground text-xs font-mono font-bold hover:bg-accent transition-colors"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors hidden sm:block"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCENE 1: CREATE ACCOUNT & STORE NAME (Masked Phone)
 * ───────────────────────────────────────────────────────────── */
function Scene1Signup({ progress }: { progress: number }) {
  const isTyping = progress > 15
  const isOtpVerified = progress > 55
  const isCompleted = progress > 80

  return (
    <Card className="w-full max-w-lg mx-auto border-2 border-border shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center space-y-2 mb-6">
          <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
            Step 1: 10-Second Registration
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Create Account & Store Name</h3>
          <p className="text-xs text-muted-foreground">Setup your reseller business profile in 10 seconds</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Store / Business Name</span>
              {isTyping && <span className="text-[10px] text-green-600 font-mono flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Available</span>}
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-semibold text-foreground flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span>{isTyping ? 'Royal Fashion' : ''}</span>
              {!isTyping && <span className="w-2 h-4 bg-primary animate-pulse" />}
            </div>
          </div>

          {/* Masked Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">WhatsApp Mobile Number</label>
            <div className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-mono text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              <span>+91 {progress > 30 ? '98*** ***10' : ''}</span>
            </div>
          </div>

          {isOtpVerified && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-xs flex items-center justify-between font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Instant OTP Verified</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </motion.div>
          )}

          <Button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCompleted ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-primary text-primary-foreground shadow-lg'}`}>
            {isCompleted ? (
              <>
                <Check className="w-4 h-4" />
                <span>Store Created! Opening Dashboard...</span>
              </>
            ) : (
              <>
                <span>Launch My Store</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCENE 2: ADD PRODUCTS & INSTANT STORE LAUNCH (Interactive Items)
 * ───────────────────────────────────────────────────────────── */
function Scene2AddProducts({ progress, onCopyLink, copiedUrl }: { progress: number; onCopyLink: () => void; copiedUrl: boolean }) {
  const p1 = progress > 15
  const p2 = progress > 30
  const p3 = progress > 45
  const p4 = progress > 60

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <Card className="border-2 border-border p-6 space-y-5 text-left shadow-xl">
        <CardContent className="p-0 space-y-4">
          <div className="space-y-1">
            <Badge className="bg-primary text-primary-foreground text-xs">
              Step 2: Catalog & Store URL
            </Badge>
            <h3 className="text-xl font-bold text-foreground">Add Products & Share Link</h3>
            <p className="text-xs text-muted-foreground">Select products, set your margin, and get your live store URL instantly.</p>
          </div>

          {/* Animated Selected Products List */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Catalog Selection</span>
              <span className="text-primary font-bold">4 Products Live</span>
            </div>

            {[
              { name: 'Designer Silk Saree', price: '₹1,499', active: p1 },
              { name: 'Embroidered Kurti Set', price: '₹999', active: p2 },
              { name: 'Cotton Anarkali Suit', price: '₹1,299', active: p3 },
              { name: 'Handcrafted Lehenga', price: '₹2,499', active: p4 },
            ].map((prod, i) => (
              <div key={i} className="flex items-center justify-between bg-muted p-2 rounded-xl border border-border text-xs">
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${prod.active ? 'bg-green-600 text-white' : 'bg-background text-muted-foreground'}`}>
                    {prod.active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </div>
                  <span className="font-semibold text-foreground truncate">{prod.name}</span>
                </div>
                <span className="font-bold text-primary">{prod.price}</span>
              </div>
            ))}
          </div>

          {/* Live Store URL Box */}
          <div className="bg-muted rounded-2xl p-3 border border-border space-y-1.5">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your Live Store Address</div>
            <div className="flex items-center justify-between gap-2 bg-background p-2 rounded-xl border border-border">
              <div className="flex items-center gap-2 text-primary font-bold text-xs truncate">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span>royalfashion.resellerpro.in</span>
              </div>
              <Button onClick={onCopyLink} size="sm" variant="outline" className="text-xs font-semibold flex items-center gap-1 flex-shrink-0 h-7 px-2">
                <Copy className="w-3 h-3" />
                <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Frame Preview */}
      <div className="flex justify-center">
        <div className="w-[270px] h-[460px] bg-card rounded-[36px] border-4 border-border shadow-2xl p-3 flex flex-col relative overflow-hidden">
          <div className="p-3 rounded-2xl bg-primary text-primary-foreground flex items-center justify-between">
            <div className="font-bold text-xs">Royal Fashion</div>
            <ShoppingCart className="w-4 h-4" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 flex-1 overflow-hidden">
            {[
              { name: 'Designer Saree', price: '₹1,499', active: p1 },
              { name: 'Kurti Set', price: '₹999', active: p2 },
              { name: 'Anarkali Suit', price: '₹1,299', active: p3 },
              { name: 'Lehenga', price: '₹2,499', active: p4 },
            ].map((p, i) => (
              <div key={i} className={`rounded-xl p-2 border text-left space-y-1 transition-all ${p.active ? 'bg-muted border-primary/40 shadow-sm' : 'bg-background/50 border-border opacity-40'}`}>
                <div className="w-full h-14 bg-background rounded-lg" />
                <div className="text-[10px] font-semibold text-foreground truncate">{p.name}</div>
                <div className="text-[11px] font-bold text-primary">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCENE 3: CUSTOMER SELF-CHECKOUT (Masked Phone)
 * ───────────────────────────────────────────────────────────── */
function Scene3CustomerCheckout({ progress }: { progress: number }) {
  const isFilled = progress > 45
  const isPlaced = progress > 80

  return (
    <Card className="w-full max-w-3xl border-2 border-border shadow-2xl">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground text-base">Customer Self-Checkout</h3>
              <p className="text-xs text-muted-foreground">Customers select items, fill shipping details & place order directly</p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground text-xs">
            Step 3: Direct Order
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
          <div className="bg-muted rounded-2xl p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Customer Cart</span>
              <span className="text-primary font-bold">Total: ₹2,498</span>
            </div>

            {[
              { name: 'Designer Saree', price: '₹1,499' },
              { name: 'Kurti Set', price: '₹999' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-background p-2.5 rounded-xl border border-border">
                <div className="w-9 h-9 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{item.name}</div>
                  <div className="text-[11px] text-muted-foreground">Qty: 1</div>
                </div>
                <div className="text-xs font-bold text-primary">{item.price}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted rounded-2xl p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">Delivery Shipping Info</div>

            <div className="space-y-2 text-xs">
              <div className="bg-background px-3 py-2 rounded-xl border border-border text-foreground">
                <span className="text-muted-foreground text-[10px] block">Customer Name</span>
                <span className="font-semibold">{isFilled ? 'Ananya Sharma' : 'Typing name...'}</span>
              </div>

              {/* Masked Customer Phone */}
              <div className="bg-background px-3 py-2 rounded-xl border border-border text-foreground">
                <span className="text-muted-foreground text-[10px] block">Phone Number</span>
                <span className="font-mono text-green-600 font-bold">{isFilled ? '+91 98*** ***10' : 'Typing phone...'}</span>
              </div>

              <div className="bg-background px-3 py-2 rounded-xl border border-border text-foreground flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Payment Option</span>
                  <span className="font-semibold text-green-600">Cash on Delivery (COD)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>

            <Button className={`w-full py-2.5 rounded-xl font-bold text-xs ${isPlaced ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary text-primary-foreground'}`}>
              {isPlaced ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Order Placed Successfully!
                </span>
              ) : (
                'Place Order Now'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCENE 4: ORDERS & LIVE WHATSAPP TRACKING (Masked Phone)
 * ───────────────────────────────────────────────────────────── */
function Scene4OrderNotification({ progress }: { progress: number }) {
  const isDispatched = progress > 40
  const isDelivered = progress > 75

  return (
    <Card className="w-full max-w-4xl border-2 border-border shadow-2xl text-left">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <Badge className="bg-primary text-primary-foreground text-xs mb-1">
              Step 4: Live Order Alert #ORD-9821
            </Badge>
            <h3 className="text-xl font-bold text-foreground">Receive Order & Automatic WhatsApp Updates</h3>
          </div>
          <Badge className={`text-xs px-3 py-1 font-bold flex items-center gap-1 ${isDelivered ? 'bg-green-500/20 text-green-600 border-green-500/40' : isDispatched ? 'bg-primary/20 text-primary border-primary/40' : 'bg-amber-500/20 text-amber-600 border-amber-500/40'}`}>
            {isDelivered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>Delivered</span>
              </>
            ) : isDispatched ? (
              <>
                <PackageCheck className="w-3.5 h-3.5 text-primary" />
                <span>Shipped / Dispatched</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Order Received</span>
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-2xl p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">CRM Order Log</div>

            <div className="bg-background p-3 rounded-xl border border-border space-y-2 text-xs">
              <div className="flex justify-between text-foreground font-semibold">
                <span>Ananya (+91 98*** ***10)</span>
                <span className="text-primary font-bold">₹2,498</span>
              </div>
              <div className="text-muted-foreground text-[11px]">Items: Saree + Kurti Set</div>
              <div className="text-muted-foreground text-[10px]">Bengaluru, PIN: 560001</div>
            </div>

            <Button className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>1-Click Dispatched</span>
            </Button>
          </div>

          <div className="bg-muted rounded-2xl p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Automated WhatsApp Message</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-foreground space-y-1">
                <div className="font-semibold text-green-600">Order Confirmed!</div>
                <p className="text-[11px]">Hi Ananya, your order #ORD-9821 is confirmed at Royal Fashion.</p>
              </div>

              {isDispatched && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-foreground space-y-1">
                  <div className="font-semibold text-green-600">Dispatched & Live Tracking!</div>
                  <div className="text-[11px] font-mono text-primary bg-background p-2 rounded border border-border">
                    Track Live: https://resellerpro.in/track/ORD-9821
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCENE 5: ANALYTICS & FINAL CTA WITH REAL LOGO & START NOW
 * ───────────────────────────────────────────────────────────── */
function Scene5AnalyticsFinal({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center px-4">
      {/* Real ResellerPro Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.3 }}
        className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 mt-2 sm:mt-4"
      >
        <Image
          src="/logo.svg"
          alt="ResellerPro Logo"
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Badge className="mb-3 bg-primary text-primary-foreground px-6 py-1.5 text-xs sm:text-sm">
          Complete Reseller E-Commerce OS
        </Badge>

        <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
          Grow Your Reselling Business 3x Faster!
        </h1>
        <p className="text-xs sm:text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
          Join 1,000+ resellers managed by <span className="text-primary font-bold">ResellerPro</span>
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {[
          { icon: Clock, label: '10x Faster', desc: 'Order processing' },
          { icon: CheckCircle2, label: 'Self-Checkout', desc: 'Direct cart' },
          { icon: TrendingUp, label: '2-3x Growth', desc: 'Avg revenue' },
          { icon: Award, label: 'White-Label', desc: 'Custom domain' }
        ].map((benefit) => {
          const Icon = benefit.icon
          return (
            <Card key={benefit.label} className="border border-border">
              <CardContent className="p-3 text-center">
                <Icon className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="font-bold text-xs mb-0.5">{benefit.label}</div>
                <div className="text-[10px] text-muted-foreground">{benefit.desc}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* START NOW CTA BUTTON */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} className="mt-4">
        <Link href="/signup" onClick={onClose}>
          <Button className="text-base sm:text-xl px-8 py-6 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all font-black rounded-xl group h-auto">
            Start Free Trial Now
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block ml-2"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </Button>
        </Link>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> No Credit Card
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> 10 Free Orders
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Cancel Anytime
        </div>
      </div>
    </div>
  )
}
