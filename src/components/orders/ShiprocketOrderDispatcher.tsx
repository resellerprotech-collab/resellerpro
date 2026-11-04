'use client'

import { useState } from 'react'
import {
  Truck,
  PackageCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
  Copy,
  RefreshCw,
  Sparkles,
  Settings,
  Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { dispatchShiprocketOrderAction } from '@/app/(dashboard)/orders/shipping-actions'
import { toast } from '@/lib/toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  orderId: string
  orderNumber: string | number
  status: string
  courierService?: string | null
  trackingNumber?: string | null
  shippingLabelUrl?: string | null
  isShiprocketConnected: boolean
  pickupLocationName?: string | null
}

export function ShiprocketOrderDispatcher({
  orderId,
  orderNumber,
  status,
  courierService,
  trackingNumber,
  shippingLabelUrl,
  isShiprocketConnected,
  pickupLocationName,
}: Props) {
  const router = useRouter()
  const [dispatching, setDispatching] = useState(false)
  const [weight, setWeight] = useState('0.5')
  const [copiedAwb, setCopiedAwb] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const isShipped = status === 'shipped' || status === 'delivered'
  const isShiprocketShipment =
    (courierService || '').toLowerCase().includes('shiprocket') || Boolean(trackingNumber)

  async function handleDispatch() {
    try {
      setDispatching(true)
      const parsedWeight = parseFloat(weight) || 0.5

      const res = await dispatchShiprocketOrderAction(orderId, {
        weight: parsedWeight,
      })

      if (res.success) {
        toast.success(res.message || 'Shipment created successfully!')
        if (res.labelUrl) {
          window.open(res.labelUrl, '_blank')
        }
        router.refresh()
      } else {
        toast.error(res.message || 'Failed to dispatch order via Shiprocket.')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error communicating with Shiprocket.')
    } finally {
      setDispatching(false)
    }
  }

  function copyTracking() {
    if (!trackingNumber) return
    navigator.clipboard.writeText(trackingNumber)
    setCopiedAwb(true)
    toast.success('AWB code copied to clipboard!')
    setTimeout(() => setCopiedAwb(false), 2000)
  }

  // Case 1: Order is already shipped with tracking info
  if (isShipped && trackingNumber) {
    const trackingUrl = `https://shiprocket.co/tracking/${trackingNumber}`

    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Shiprocket Dispatch
              </p>
              <p className="text-xs text-muted-foreground">
                {courierService || 'Courier Partner Assigned'}
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Shipped
          </Badge>
        </div>

        {/* Tracking Details */}
        <div className="p-3 bg-muted/40 rounded-lg border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">AWB Tracking Code:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-foreground">
                {trackingNumber}
              </span>
              <button
                type="button"
                onClick={copyTracking}
                className="text-muted-foreground hover:text-foreground p-1 rounded"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {courierService && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Courier Partner:</span>
              <span className="font-medium text-foreground">{courierService}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {shippingLabelUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              asChild
            >
              <a href={shippingLabelUrl} target="_blank" rel="noreferrer">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Print Shipping Label
              </a>
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            className="flex-1 text-xs"
            asChild
          >
            <a href={trackingUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Track Package
            </a>
          </Button>
        </div>
      </div>
    )
  }

  // Case 2: Shiprocket NOT connected
  if (!isShiprocketConnected) {
    return (
      <div className="rounded-xl border border-dashed border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mt-0.5">
            <Truck className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Automate Doorstep Courier Pickup
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect your free Shiprocket account to dispatch this order with 1-click. Delivery boy arrives at your door and AWB tracking is generated automatically.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full text-xs font-medium" asChild>
          <Link href="/settings/delivery">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Connect Shiprocket in Settings
          </Link>
        </Button>
      </div>
    )
  }

  // Case 3: Ready to Dispatch via Shiprocket (Order is pending/processing)
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
              1-Click Shiprocket Pickup
            </p>
            <p className="text-xs text-muted-foreground">
              Pickup from: <strong className="text-foreground">{pickupLocationName || 'Primary Warehouse'}</strong>
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
          <Sparkles className="h-2.5 w-2.5 mr-1 text-primary" /> Auto Dispatch
        </Badge>
      </div>

      {/* Package Specs */}
      <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Scale className="h-3 w-3" /> Parcel Weight:
          </span>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={dispatching}
              className="h-6 w-16 text-right text-xs py-0 px-1 font-mono"
            />
            <span className="text-muted-foreground font-mono">kg</span>
          </div>
        </div>
      </div>

      {/* Dispatch Button */}
      <Button
        onClick={handleDispatch}
        disabled={dispatching}
        className="w-full text-xs font-semibold shadow-xs"
        size="sm"
      >
        {dispatching ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
            Booking Courier & Generating Label...
          </>
        ) : (
          <>
            <PackageCheck className="h-4 w-4 mr-1.5" />
            Dispatch via Shiprocket
          </>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        Assigns best courier, schedules doorstep pickup, and generates printable AWB label.
      </p>
    </div>
  )
}

