import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const { shopSlug } = await req.json()

    if (!shopSlug || typeof shopSlug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'shopSlug parameter is required' },
        { status: 400 }
      )
    }

    // Revalidate layout and all sub-routes under the target storefront
    revalidatePath(`/store/${shopSlug}`, 'layout')
    revalidatePath(`/store/${shopSlug}`)
    revalidatePath(`/store/${shopSlug}/shop`)

    return NextResponse.json({
      success: true,
      message: `Successfully revalidated storefront cache for /store/${shopSlug}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error revalidating store:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to revalidate storefront' },
      { status: 500 }
    )
  }
}
