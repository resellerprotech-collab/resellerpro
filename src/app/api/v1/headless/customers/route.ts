import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceCustomersService } from '@/lib/services/commerce/customers.service'

export async function GET(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone') || undefined

  try {
    const customers = await CommerceCustomersService.getCustomers(auth.store.id, phone)

    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch customers' }, { status: 500 })
  }
}

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
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required customer fields: name, phone' },
        { status: 400 }
      )
    }

    const customer = await CommerceCustomersService.createOrUpdateCustomer(auth.store.id, body)

    return NextResponse.json({
      success: true,
      data: customer
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create customer' }, { status: 400 })
  }
}
