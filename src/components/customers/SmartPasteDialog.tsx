'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { parseWhatsAppMessage, type ParsedCustomerData } from '@/lib/utils/whatsapp-parser'
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb,
  ClipboardPaste
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface SmartPasteDialogProps {
  onDataConfirmed: (data: ParsedCustomerData) => void
}

export function SmartPasteDialog({ onDataConfirmed }: SmartPasteDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [rawMessage, setRawMessage] = useState('')
  const [parsedData, setParsedData] = useState<ParsedCustomerData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleAutoClipboard() {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setRawMessage(text)
        toast({ title: 'Pasted from clipboard! 📋', description: 'Click "Extract Data" to continue.' })
      } else {
        toast({ title: 'Clipboard is empty', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Clipboard access denied', description: 'Please paste manually.', variant: 'destructive' })
    }
  }

  function handleParse() {
    if (!rawMessage.trim()) {
      toast({ title: 'Nothing to parse', variant: 'destructive' })
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      const result = parseWhatsAppMessage(rawMessage)
      setParsedData(result)
      setIsProcessing(false)
      toast({
        title: result.confidence >= 70 ? 'Data extracted! ✨' : 'Partial extraction',
        description: `${result.confidence}% confidence. Please review the fields.`,
      })
    }, 300)
  }

  function handleConfirm() {
    if (!parsedData || !parsedData.name || !parsedData.phone) {
      toast({ title: 'Missing required fields', description: 'Please fill Name and Phone number.', variant: 'destructive' })
      return
    }
    onDataConfirmed(parsedData)
    setOpen(false)
    setRawMessage('')
    setParsedData(null)
  }

  function handleReset() {
    setRawMessage('')
    setParsedData(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Smart Paste
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Smart Paste from WhatsApp
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Copy a customer message and paste here to auto-fill the form.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!parsedData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Customer Message</Label>
                <Button onClick={handleAutoClipboard} variant="ghost" size="sm" className="gap-2 text-primary">
                  <ClipboardPaste className="w-4 h-4" />
                  Auto-Paste
                </Button>
              </div>
              <Textarea
                placeholder="Paste customer's WhatsApp message here..."
                value={rawMessage}
                onChange={(e) => setRawMessage(e.target.value)}
                rows={10}
                className="font-mono text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleParse} disabled={!rawMessage.trim() || isProcessing} className="flex-1 gap-2" size="lg">
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Extracting...' : 'Extract Data'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant={parsedData.confidence >= 70 ? 'default' : 'destructive'}>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Extraction Complete ({parsedData.confidence}%)</AlertTitle>
                <AlertDescription>
                  {parsedData.missingFields.length > 0
                    ? `Missing fields: ${parsedData.missingFields.join(', ')}. Please fill them manually.`
                    : 'All key fields found! Please review.'}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={parsedData.name || ''} onChange={(e) => setParsedData({ ...parsedData, name: e.target.value })} className={parsedData.name ? 'border-green-500' : 'border-red-300'} />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input value={parsedData.phone || ''} onChange={(e) => setParsedData({ ...parsedData, phone: e.target.value })} className={parsedData.phone ? 'border-green-500' : 'border-red-300'} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address Line 1</Label>
                  <Input value={parsedData.addressLine1 || ''} onChange={(e) => setParsedData({ ...parsedData, addressLine1: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address Line 2</Label>
                  <Input value={parsedData.addressLine2 || ''} onChange={(e) => setParsedData({ ...parsedData, addressLine2: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={parsedData.city || ''} onChange={(e) => setParsedData({ ...parsedData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={parsedData.state || ''} onChange={(e) => setParsedData({ ...parsedData, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={parsedData.pincode || ''} onChange={(e) => setParsedData({ ...parsedData, pincode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input value={parsedData.email || ''} onChange={(e) => setParsedData({ ...parsedData, email: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleConfirm} className="flex-1 gap-2" size="lg" disabled={!parsedData.name || !parsedData.phone}>
                  <CheckCircle2 className="w-4 h-4" />
                  Use This Data
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg">Start Over</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}