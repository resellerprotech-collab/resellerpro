import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceStoreService } from '@/lib/services/commerce/store.service'

export async function GET(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  const storeDetails = await CommerceStoreService.getStoreById(auth.store.id)

  return NextResponse.json({
    success: true,
    store: storeDetails
  })
}
