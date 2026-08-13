'use client'

import React, { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/lib/toast'

/**
 * Web Audio API synthesizer for crisp, instant order chime sound
 * Works across all desktop & mobile browsers without external sound files
 */
function playNewOrderChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const now = ctx.currentTime

    // First tone (D5 - 587.33Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.3)

    // Second tone (A5 - 880.00Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.0, now + 0.15)
    gain2.gain.setValueAtTime(0.4, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.6)
  } catch (err) {
    console.warn('Audio chime warning:', err)
  }
}

export function RealtimeOrdersProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    let channel: any = null

    async function initRealtimeWebSocket() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || isSubscribedRef.current) return

      isSubscribedRef.current = true

      console.log(`📡 [WEBSOCKET REALTIME] Connecting to Supabase Realtime Channel for Reseller: ${user.id}`)

      channel = supabase
        .channel(`reseller-dashboard-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log('⚡ [WEBSOCKET REALTIME] Orders Event Received:', payload.eventType, payload)

            if (payload.eventType === 'INSERT') {
              const newOrder = payload.new
              const amountFormatted = Math.round(Number(newOrder.total_amount || 0)).toLocaleString('en-IN')
              const paymentMethodStr = (newOrder.payment_method || 'order').toUpperCase()

              // 🔊 1. Play chime sound
              playNewOrderChime()

              // 🔔 2. Show instant toast notification
              toast.success(`🎉 New Order Received! ₹${amountFormatted}`, {
                description: `Order #${newOrder.id?.slice(0, 8)} • Payment: ${paymentMethodStr} • Saved in Customers`,
                duration: 6000,
              })

              // 🔄 3. Live invalidate query caches (Orders, Customers, Stats, Analytics)
              queryClient.invalidateQueries({ queryKey: ['orders'] })
              queryClient.invalidateQueries({ queryKey: ['customers'] })
              queryClient.invalidateQueries({ queryKey: ['stats'] })
              queryClient.invalidateQueries({ queryKey: ['analytics'] })
            } else if (payload.eventType === 'UPDATE') {
              // Order status updated
              queryClient.invalidateQueries({ queryKey: ['orders'] })
              queryClient.invalidateQueries({ queryKey: ['stats'] })
              queryClient.invalidateQueries({ queryKey: ['analytics'] })
            } else if (payload.eventType === 'DELETE') {
              queryClient.invalidateQueries({ queryKey: ['orders'] })
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log('⚡ [WEBSOCKET REALTIME] Customer Event Received:', payload.eventType, payload)
            // Live update customer management tab
            queryClient.invalidateQueries({ queryKey: ['customers'] })
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'enquiries',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log('⚡ [WEBSOCKET REALTIME] Enquiry Event Received:', payload.eventType, payload)
            if (payload.eventType === 'INSERT') {
              playNewOrderChime()
              toast.info('📩 New Customer Enquiry Received!', {
                description: `${payload.new.name || 'Store Visitor'} sent a message`,
              })
            }
            queryClient.invalidateQueries({ queryKey: ['enquiries'] })
          }
        )
        .subscribe((status: string) => {
          console.log(`📡 [WEBSOCKET REALTIME] Subscription status: ${status}`)
        })
    }

    initRealtimeWebSocket()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
      isSubscribedRef.current = false
    }
  }, [queryClient, supabase])

  return <>{children}</>
}
