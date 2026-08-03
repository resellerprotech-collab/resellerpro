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
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined

  try {
    const result = await CommerceProductsService.getProducts(auth.store.id, {
      category,
      search,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        limit: result.limit,
        offset: result.offset
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
