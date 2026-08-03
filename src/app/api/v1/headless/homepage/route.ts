import { NextRequest, NextResponse } from 'next/server'
import { authenticateHeadlessRequest } from '@/lib/auth/headless-auth'
import { CommerceHomepageService } from '@/lib/services/commerce/homepage.service'

export async function GET(req: NextRequest) {
  const auth = await authenticateHeadlessRequest(req)
  if (!auth.success || !auth.store) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.statusCode || 401 }
    )
  }

  try {
    const banners = await CommerceHomepageService.getHeroBanners(auth.store.id)
    const layout = await CommerceHomepageService.getHomepageLayout(auth.store.id)

    return NextResponse.json({
      success: true,
      data: {
        banners,
        layout
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch homepage' }, { status: 500 })
  }
}
