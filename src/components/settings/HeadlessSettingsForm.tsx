'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateHeadlessSettings, generateNewApiKey } from '@/app/(dashboard)/settings/headless/actions'
import { toast } from 'sonner'
import { Copy, RefreshCw, Key, Globe, ShieldCheck, AlertTriangle, Sparkles, AlertCircle } from 'lucide-react'

interface HeadlessSettingsFormProps {
  initialStoreMode: 'standard' | 'headless'
  initialConnectedDomain: string | null
  apiKeyPrefix: string | null
}

export default function HeadlessSettingsForm({
  initialStoreMode,
  initialConnectedDomain,
  apiKeyPrefix
}: HeadlessSettingsFormProps) {
  const [storeMode, setStoreMode] = useState<'standard' | 'headless'>(initialStoreMode)
  const [connectedDomain, setConnectedDomain] = useState(initialConnectedDomain || '')
  const [prefix, setPrefix] = useState(apiKeyPrefix || null)
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const isHeadless = storeMode === 'headless'

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('store_mode', storeMode)
    formData.append('connected_domain', connectedDomain)

    setLoading(true)
    const res = await updateHeadlessSettings(formData)
    setLoading(false)

    if (res.success) {
      toast.success('Connected domain updated')
    } else {
      toast.error(res.message)
    }
  }

  const executeRegenerateKey = async () => {
    setConfirmModalOpen(false)
    setGenerating(true)
    const res = await generateNewApiKey()
    setGenerating(false)

    if (res.success && res.apiKey) {
      setNewlyGeneratedKey(res.apiKey)
      if (res.apiKeyPrefix) setPrefix(res.apiKeyPrefix)
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Mode Status Overview Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              Store Presentation Mode
            </CardTitle>
            <CardDescription className="mt-1">
              Choose between built-in storefront or external Next.js custom website mode.
            </CardDescription>
          </div>
          <Badge variant={isHeadless ? "default" : "secondary"} className="text-sm px-3 py-1 font-semibold">
            {isHeadless ? 'Headless Mode Active' : 'Standard Store Mode'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Headless Store Mode Status</Label>
              <p className="text-sm text-muted-foreground">
                {isHeadless
                  ? 'Headless Mode is enabled and active for your store account.'
                  : 'Headless Mode must be requested and approved by Ekodrix Admin.'}
              </p>
            </div>
            <Switch
              checked={isHeadless}
              disabled={true}
            />
          </div>

          {isHeadless && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-sm flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Visual Store Builders Hidden</span>
                When Headless Mode is enabled, Hero Builder, Homepage Builder, and Theme controls are hidden from your dashboard sidebar. All inventory, products, orders, and CRM remain inside ResellerPro.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Headless API Key & Domain Settings */}
      {isHeadless && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* API Key Management */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                Store API Key
              </CardTitle>
              <CardDescription>
                Use this API Key in your custom Next.js website environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {newlyGeneratedKey ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    New Secret API Key (Copy Now)
                  </div>
                  <div className="font-mono text-xs break-all bg-background p-2.5 rounded-md border flex items-center justify-between gap-2">
                    <span className="select-all font-bold text-foreground">{newlyGeneratedKey}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(newlyGeneratedKey)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This key will only be shown once. Keep it secret!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Current API Key Prefix</Label>
                  <div className="flex items-center gap-2 font-mono text-sm bg-muted p-2.5 rounded-lg border">
                    <span className="text-muted-foreground">{prefix ? `${prefix}********************` : 'No API Key Generated'}</span>
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setConfirmModalOpen(true)
                }}
                disabled={generating}
              >
                <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                {prefix ? 'Regenerate API Key' : 'Generate API Key'}
              </Button>
            </CardContent>
          </Card>

          {/* Connected Domain Management */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Connected External Domain
              </CardTitle>
              <CardDescription>
                Specify the domain of your custom Next.js storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveDomain} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="https://mystore.com"
                    value={connectedDomain}
                    onChange={(e) => setConnectedDomain(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Save Connected Domain
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Confirmation Modal for Regenerating API Key */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Regenerate Store API Key?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Are you sure you want to regenerate your store&apos;s API Key? Your existing API Key will <strong className="text-destructive font-semibold">immediately stop working</strong>, and any connected Next.js custom website will be unable to fetch products or place orders until updated with the new key.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={(e) => { e.preventDefault(); executeRegenerateKey(); }} className="bg-amber-600 hover:bg-amber-700 text-white">
              Regenerate API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
