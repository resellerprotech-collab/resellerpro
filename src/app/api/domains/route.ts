import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addDomainToVercel, verifyDomainOnVercel, removeDomainFromVercel, cleanDomain } from '@/lib/domains/vercel'

/**
 * POST /api/domains
 * Attach custom domain for ₹999 subscribers
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { domain } = body

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Domain name is required' }, { status: 400 })
    }

    const cleanName = cleanDomain(domain)
    if (!cleanName || cleanName.length < 3) {
      return NextResponse.json({ error: 'Please enter a valid domain name (e.g. mystore.com)' }, { status: 400 })
    }

    // 1. Verify User Subscription Plan
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('status, plan:subscription_plans(name, display_name, price)')
      .eq('user_id', user.id)
      .maybeSingle()

    const planName = ((subscription as any)?.plan?.name || '').toLowerCase()
    const isPro = planName.includes('pro') || planName.includes('premium') || (subscription as any)?.plan?.price >= 999

    if (!isPro && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        error: 'Custom white-label domains require the ₹999 Pro Subscription. Please upgrade your plan to unlock.',
        requiresUpgrade: true,
      }, { status: 403 })
    }

    // 2. Check if domain is already claimed by another user in Database
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_domain', cleanName)
      .neq('id', user.id)
      .maybeSingle()

    if (existingProfile) {
      return NextResponse.json({ error: 'This domain is already registered to another ResellerPro account.' }, { status: 409 })
    }

    // 3. Add Domain to Vercel Infrastructure
    const vercelResult = await addDomainToVercel(cleanName)
    if (!vercelResult.success) {
      return NextResponse.json({ error: vercelResult.error || 'Failed to configure domain on server infrastructure' }, { status: 500 })
    }

    // 4. Update Profile in Database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        custom_domain: cleanName,
        custom_domain_status: 'pending',
        custom_domain_verified_at: null,
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      domain: cleanName,
      status: 'pending',
      dnsInstructions: {
        aRecord: { type: 'A', name: '@', value: '76.76.21.21' },
        cnameRecord: { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
      },
    })
  } catch (err: any) {
    console.error('Domain register error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/domains
 * Check verification and SSL status of reseller custom domain
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('custom_domain, custom_domain_status, custom_domain_verified_at, shop_slug')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.custom_domain) {
      return NextResponse.json({ hasDomain: false, shopSlug: profile?.shop_slug || '' })
    }

    // Check status on Vercel
    const vercelCheck = await verifyDomainOnVercel(profile.custom_domain)

    if (vercelCheck.verified && profile.custom_domain_status !== 'active') {
      await supabase
        .from('profiles')
        .update({
          custom_domain_status: 'active',
          custom_domain_verified_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      hasDomain: true,
      domain: profile.custom_domain,
      status: vercelCheck.verified ? 'active' : profile.custom_domain_status || 'pending',
      verifiedAt: profile.custom_domain_verified_at,
      shopSlug: profile.shop_slug,
      dnsInstructions: {
        aRecord: { type: 'A', name: '@', value: '76.76.21.21' },
        cnameRecord: { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/domains
 * Detach custom domain from profile
 */
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('custom_domain')
      .eq('id', user.id)
      .single()

    if (profile?.custom_domain) {
      await removeDomainFromVercel(profile.custom_domain)
      await supabase
        .from('profiles')
        .update({
          custom_domain: null,
          custom_domain_status: 'pending',
          custom_domain_verified_at: null,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
