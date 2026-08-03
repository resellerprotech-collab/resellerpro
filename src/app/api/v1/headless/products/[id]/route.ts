import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceProductsService } from '@/lib/services/commerce/products.service'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  try {
    const product = await CommerceProductsService.getProductById(auth.store.id, params.id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch product' }, { status: 500 })
  }
}
