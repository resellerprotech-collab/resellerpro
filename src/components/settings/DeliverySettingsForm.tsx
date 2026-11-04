'use client'

import { useState } from 'react'
import {
  Truck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Trash2,
  MapPin,
  Eye,
  EyeOff,
  PackageCheck,
  Sparkles,
  FlaskConical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  saveShiprocketSettingsAction,
  updatePickupLocationAction,
  disconnectShiprocketAction,
  toggleTestModeAction,
} from '@/app/(dashboard)/settings/delivery/actions'
import { toast } from '@/lib/toast'

interface PickupLocation {
  id?: number
  pickup_location: string
  address: string
  city: string
  state: string
  pin_code: string | number
  phone: string
}

interface Props {
  initialConfig: {
    isConnected: boolean
    isTestMode?: boolean
    email: string
    pickupLocation: string
    availablePickupLocations: PickupLocation[]
  } | null
  isEligible?: boolean
}

export function DeliverySettingsForm({ initialConfig, isEligible = true }: Props) {
  const [isConnected, setIsConnected] = useState(initialConfig?.isConnected || false)
  const [isTestMode, setIsTestMode] = useState(initialConfig?.isTestMode || false)
  const [email, setEmail] = useState(initialConfig?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pickupLocation, setPickupLocation] = useState(initialConfig?.pickupLocation || '')
  const [locations, setLocations] = useState<PickupLocation[]>(
    initialConfig?.availablePickupLocations || []
  )

  const [loading, setLoading] = useState(false)
  const [savingLocation, setSavingLocation] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [togglingTestMode, setTogglingTestMode] = useState(false)

  // Toggle Sandbox Test Mode
  async function handleToggleTestMode() {
    try {
      setTogglingTestMode(true)
      const nextState = !isTestMode
      const res = await toggleTestModeAction(nextState)

      if (res.success) {
        setIsTestMode(nextState)
        setIsConnected(nextState || Boolean(email))
        if (nextState) {
          toast.success('🧪 Developer Sandbox Active! You can now test 1-click order dispatches with zero cost.')
        } else {
          toast.info('Sandbox deactivated. Real Shiprocket credentials active.')
        }
      } else {
        toast.error('Failed to change sandbox mode.')
      }
    } catch (err: any) {
      toast.error('Error toggling sandbox test mode.')
    } finally {
      setTogglingTestMode(false)
    }
  }

  // Handle Connect
  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (!password) {
      toast.error('Please enter your Shiprocket password.')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.set('email', email)
      formData.set('password', password)
      if (pickupLocation) formData.set('pickupLocation', pickupLocation)

      const res = await saveShiprocketSettingsAction(formData)

      if (res.success) {
        setIsConnected(true)
        setIsTestMode(false)
        if (res.locations && res.locations.length > 0) {
          setLocations(res.locations as PickupLocation[])
        }
        if (res.selectedPickup) {
          setPickupLocation(res.selectedPickup)
        }
        setPassword('')
        toast.success('Connected to Shiprocket successfully!')
      } else {
        toast.error(res.message || 'Failed to authenticate with Shiprocket.')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Pickup Location change
  async function handleLocationChange(newLocation: string) {
    try {
      setSavingLocation(true)
      setPickupLocation(newLocation)
      const res = await updatePickupLocationAction(newLocation)
      if (res.success) {
        toast.success(`Default pickup location set to "${newLocation}"`)
      } else {
        toast.error(res.message || 'Failed to update pickup location.')
      }
    } catch (err: any) {
      toast.error('Error changing pickup location.')
    } finally {
      setSavingLocation(false)
    }
  }

  // Handle Disconnect
  async function handleDisconnect() {
    if (!confirm('Are you sure you want to disconnect your Shiprocket account?')) {
      return
    }

    try {
      setDisconnecting(true)
      const res = await disconnectShiprocketAction()
      if (res.success) {
        setIsConnected(false)
        setIsTestMode(false)
        setPassword('')
        setLocations([])
        setPickupLocation('')
        toast.success('Shiprocket account disconnected.')
      } else {
        toast.error('Failed to disconnect account.')
      }
    } catch (err: any) {
      toast.error('Error disconnecting account.')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sandbox Test Mode Banner */}
      <div className="rounded-xl border bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-foreground">
                  Developer Sandbox Test Mode
                </h4>
                {isTestMode ? (
                  <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0 h-4">
                    Active (Test Free)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-[10px]">
                    Off (Live Couriers)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Test 1-click dispatches, AWB numbers, and shipping labels risk-free without deducting any real money from Shiprocket.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={isTestMode ? "default" : "outline"}
            size="sm"
            onClick={handleToggleTestMode}
            disabled={togglingTestMode}
            className={`text-xs ${
              isTestMode
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            {togglingTestMode ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <FlaskConical className="h-3.5 w-3.5 mr-1.5" />
            )}
            {isTestMode ? 'Turn Off Sandbox' : 'Enable Sandbox Mode'}
          </Button>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
              }`}
            >
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-foreground">
                  Shiprocket Courier Automation
                </h3>
                {isConnected ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not Connected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isTestMode
                  ? 'Active in Sandbox Mode. Orders can be dispatched for testing with zero fees.'
                  : isConnected
                  ? `Connected as ${email}. Orders will be dispatched through your live Shiprocket account.`
                  : 'Connect your free Shiprocket account to automate doorstep courier pickups and shipping labels.'}
              </p>
            </div>
          </div>

          {isConnected && !isTestMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              {disconnecting ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1.5" />
              )}
              Disconnect
            </Button>
          )}
        </div>
      </div>

      {/* Connected State or Test Mode: Warehouse Management */}
      {isConnected ? (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h4 className="font-semibold text-base text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Pickup Warehouse / Address
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Select which pickup address delivery boys should arrive at to collect your packages.
            </p>
          </div>

          {locations.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {locations.map((loc) => {
                const isSelected = pickupLocation === loc.pickup_location
                return (
                  <div
                    key={loc.pickup_location}
                    onClick={() => handleLocationChange(loc.pickup_location)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-slate-300 dark:hover:border-slate-700 bg-background'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground flex items-center gap-1.5">
                          {loc.pickup_location}
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-4">
                              Default
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                          {loc.address}, {loc.city}, {loc.state} - {loc.pin_code}
                        </p>
                        {loc.phone && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Phone: {loc.phone}
                          </p>
                        )}
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-sm">
              <p className="font-medium">No pickup locations found in your Shiprocket account.</p>
              <p className="text-xs mt-1">
                Please log into your Shiprocket dashboard and add at least one pickup address under{' '}
                <strong>Settings → Pickup Address</strong>.
              </p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-muted/50 border text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How dispatch works:</p>
            <p>1. Open any order in <strong>Orders → Order Details</strong>.</p>
            <p>2. Click <strong>"1-Click Dispatch via Shiprocket"</strong>.</p>
            <p>3. ResellerPro books the courier, assigns the tracking code, and generates your shipping label PDF instantly.</p>
          </div>
        </div>
      ) : (
        /* Not Connected State: Login Form */
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h4 className="font-semibold text-base text-foreground">
              Connect Live Shiprocket Account
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your Shiprocket account credentials to link your live courier account. All credentials are encrypted with AES-256 military-grade encryption.
            </p>
          </div>

          <form onSubmit={handleConnect} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="shiprocket-email">Shiprocket Email</Label>
              <Input
                id="shiprocket-email"
                type="email"
                placeholder="seller@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiprocket-password">Shiprocket Password</Label>
              <div className="relative">
                <Input
                  id="shiprocket-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Authenticating & Connecting...
                </>
              ) : (
                <>
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Connect Shiprocket
                </>
              )}
            </Button>
          </form>

          {/* Educational Quick Guide */}
          <div className="border-t pt-6 space-y-3">
            <h5 className="font-medium text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Don't have a Shiprocket account yet?
            </h5>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>
                You can click the <strong>"Enable Sandbox Mode"</strong> button above to test everything right now with zero setup.
              </li>
              <li>
                Or visit{' '}
                <a
                  href="https://app.shiprocket.in/register"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-medium inline-flex items-center gap-0.5"
                >
                  Shiprocket Registration <ExternalLink className="h-3 w-3" />
                </a>{' '}
                to create a free seller account and add your real pickup address.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
