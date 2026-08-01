import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, shopSlug, storeUserId } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    let targetUserId = storeUserId
    if (!targetUserId && shopSlug) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('shop_slug', shopSlug)
        .single()

      if (profile) {
        targetUserId = profile.id
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Store merchant not found' },
        { status: 404 }
      )
    }

    const cleanEmail = email.trim()
    const namePart = cleanEmail.split('@')[0]

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        user_id: targetUserId,
        customer_name: `VIP Circle: ${namePart}`,
        phone: cleanEmail,
        message: `🎉 New VIP Circle Newsletter Subscriber: ${cleanEmail}`,
        source: 'newsletter',
        status: 'new',
        priority: 'medium',
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting newsletter subscription:', error)
      return NextResponse.json(
        { error: 'Failed to record newsletter subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to VIP Circle!',
      data
    })
  } catch (err: any) {
    console.error('Newsletter API error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
