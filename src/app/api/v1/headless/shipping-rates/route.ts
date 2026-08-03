import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceCheckoutService } from '@/lib/services/commerce/checkout.service'

export async function GET(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  try {
    const rates = await CommerceCheckoutService.getShippingRates(auth.store.id)

    return NextResponse.json({
      success: true,
      data: rates
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch shipping rates' }, { status: 500 })
  }
}
