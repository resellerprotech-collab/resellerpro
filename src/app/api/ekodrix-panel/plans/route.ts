import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyEkodrixAuth } from '@/lib/ekodrix-auth'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

// GET: Fetch all subscription plans for Ekodrix Admin Panel
export async function GET() {
  try {
    await verifyEkodrixAuth()
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error: any) {
    console.error('Ekodrix plans GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Update a subscription plan dynamically
export async function PATCH(request: Request) {
  try {
    await verifyEkodrixAuth()
    const supabase = await createAdminClient()

    const body = await request.json()
    const {
      id,
      display_name,
      price,
      offer_price,
      order_limit,
      tag_line,
      features,
      is_active
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (display_name !== undefined) updatePayload.display_name = display_name
    if (price !== undefined) updatePayload.price = Number(price)
    if (offer_price !== undefined) updatePayload.offer_price = offer_price === null || offer_price === '' ? null : Number(offer_price)
    if (order_limit !== undefined) updatePayload.order_limit = order_limit === null || order_limit === '' ? null : Number(order_limit)
    if (tag_line !== undefined) updatePayload.tag_line = tag_line
    if (features !== undefined) updatePayload.features = Array.isArray(features) ? features : []
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active)

    const { data, error } = await supabase
      .from('subscription_plans')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    // Revalidate customer billing & subscription pages so changes reflect live instantly
    try {
      revalidatePath('/billing')
      revalidatePath('/settings/subscription')
    } catch (e) {
      console.warn('Revalidate warning:', e)
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Plan "${data.display_name || data.name}" updated successfully!`
    })
  } catch (error: any) {
    console.error('Ekodrix plans PATCH error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
