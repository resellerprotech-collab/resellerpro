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

  try {
    const categories = await CommerceProductsService.getCategories(auth.store.id)

    return NextResponse.json({
      success: true,
      categories
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
