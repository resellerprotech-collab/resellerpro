import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceProductsService } from '@/lib/services/commerce/products.service'

export async function GET(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || searchParams.get('query') || ''

  try {
    const result = await CommerceProductsService.getProducts(auth.store.id, {
      search: query,
      limit: 20
    })

    return NextResponse.json({
      success: true,
      query,
      data: result.products,
      total: result.total
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Search failed' }, { status: 500 })
  }
}
