import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { OrderSuccessClient } from './OrderSuccessClient'
import type { ShopTheme } from '@/types'

interface Props {
  params: { shopSlug: string; orderId: string }
}

export default async function OrderSuccessPage({ params }: Props) {
  const { shopSlug, orderId } = params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_slug', shopSlug)
    .single()

  if (!profile) return notFound()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .eq('user_id', profile.id)
    .single()

  if (!order) return notFound()

  // Ensure each order item has its product image attached
  if (order.order_items && order.order_items.length > 0) {
    const missingProductIds = order.order_items
      .filter((item: any) => !item.product_image && item.product_id)
      .map((item: any) => item.product_id)

    if (missingProductIds.length > 0) {
      const { data: prods } = await supabase
        .from('products')
        .select('id, image_url, images')
        .in('id', missingProductIds)

      if (prods && prods.length > 0) {
        const prodMap = new Map<string, string>()
        prods.forEach((p: any) => {
          let img = p.image_url
          if (!img && Array.isArray(p.images) && p.images.length > 0) {
            img = p.images[0]
          } else if (!img && typeof p.images === 'string' && p.images.trim()) {
            try {
              const parsed = JSON.parse(p.images)
              if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0]
            } catch {}
          }
          if (img) prodMap.set(p.id, img)
        })

        order.order_items = order.order_items.map((item: any) => ({
          ...item,
          product_image: item.product_image || prodMap.get(item.product_id) || null,
        }))
      }
    }
  }

  const theme = profile.shop_theme as ShopTheme | null

  return (
    <OrderSuccessClient
      order={order}
      profile={profile}
      theme={theme}
      shopSlug={shopSlug}
    />
  )
}
