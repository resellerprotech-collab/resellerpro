import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceCheckoutService } from '@/lib/services/commerce/checkout.service'

export async function POST(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  try {
    const body = await req.json()
    const result = await CommerceCheckoutService.validateCartAndCalculate(auth.store.id, body.items || [])

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to validate cart' }, { status: 400 })
  }
}
