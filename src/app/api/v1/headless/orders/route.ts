import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceOrdersService } from '@/lib/services/commerce/orders.service'

export async function POST(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  try {
    const payload = await req.json()
    if (!payload.customer_name || !payload.customer_phone || !payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields: customer_name, customer_phone, items' },
        { status: 400 }
      )
    }

    const order = await CommerceOrdersService.createOrder(auth.store.id, payload)

    return NextResponse.json({
      success: true,
      order
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to place order' }, { status: 400 })
  }
}
