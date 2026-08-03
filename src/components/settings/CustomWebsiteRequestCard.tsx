'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { submitCustomWebsiteRequest } from '@/app/actions/custom-website'
import { toast } from 'sonner'
import { useToast } from '@/hooks/use-toast'
import { Sparkles, Clock, CheckCircle2, PhoneCall, Globe, ArrowRight } from 'lucide-react'

interface CustomWebsiteRequestCardProps {
  existingRequest: {
    id: string
    status: string
    created_at: string
  } | null
  storeMode: 'standard' | 'headless'
}

export default function CustomWebsiteRequestCard({
  existingRequest,
  storeMode
}: CustomWebsiteRequestCardProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestState, setRequestState] = useState(existingRequest)
  const { toast: uiToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setRequestState(existingRequest)
  }, [existingRequest])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      const res = await submitCustomWebsiteRequest(formData)

      if (res.success) {
        toast.success("🎉 Thanks! We've received your request. Our team will contact you shortly!")
        uiToast({
          title: "🎉 Thanks!",
          description: "We've received your request. Our team will contact you shortly via phone or WhatsApp.",
        })
        setOpen(false)
        setRequestState({
          id: 'new',
          status: 'pending',
          created_at: new Date().toISOString()
        })
        router.refresh()
      } else {
        toast.error(res.message || 'Submission failed')
        uiToast({
          title: "Submission Status",
          description: res.message || 'Could not submit request',
          variant: "destructive"
        })
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Case 1: Headless is already enabled for store
  if (storeMode === 'headless') {
    return (
      <Card className="border border-indigo-500/30 bg-indigo-500/5 shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Headless Custom Website Active
                <Badge variant="default" className="bg-indigo-600">Active</Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your store is powered by an external Next.js website via ResellerPro Headless APIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Case 2: Request already submitted (Pending / Under Review)
  if (requestState) {
    const formattedDate = new Date(requestState.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    return (
      <Card className="border shadow-sm bg-muted/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">Custom Website Request</span>
                <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 capitalize">
                  {requestState.status === 'pending' ? 'Pending Review' : requestState.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>Requested On: <strong className="text-foreground">{formattedDate}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1"><PhoneCall className="h-3 w-3" /> Ekodrix team will contact you shortly</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Case 3: Standard Store - Request Custom Website Card & Modal
  return (
    <Card className="border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-500/5 via-background to-background shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg font-bold">Custom Website</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">Ekodrix Headless</Badge>
        </div>
        <CardDescription className="mt-1">
          Need a unique website for your brand? Our team will build a professionally designed custom website powered by ResellerPro.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 shadow-sm">
              Request Custom Website
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Request Custom Website
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm">
                Our team will review your request and contact you shortly. Once approved, we will discuss your requirements and begin the design process.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl bg-muted/40 border text-xs space-y-2 text-muted-foreground my-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                What happens next?
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ekodrix team calls/messages you via phone or WhatsApp.</li>
                <li>Upon approval, Headless Mode & API Keys are activated.</li>
                <li>Your products, inventory & orders remain 100% inside ResellerPro.</li>
              </ul>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
