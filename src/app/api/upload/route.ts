import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'cms'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // 1. Try Cloudinary Upload First (if CLOUDINARY_CLOUD_NAME is set)
    if (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      const cloudinaryResult = await uploadImageToCloudinary(buffer, fileName, folder)
      if (cloudinaryResult.success && cloudinaryResult.url) {
        return NextResponse.json({
          success: true,
          provider: 'cloudinary',
          url: cloudinaryResult.url,
          filePath: cloudinaryResult.publicId || filePath
        })
      }
      console.warn('[Upload Route] Cloudinary failed or skipped, falling back to Supabase Storage:', cloudinaryResult.error)
    }

    // 2. Fallback to Supabase Storage
    const supabase = await createAdminClient()

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'product-images')

    if (!bucketExists) {
      await supabase.storage.createBucket('product-images', { public: true })
    }

    // Upload file using Admin Client (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/png',
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('API Upload error:', uploadError)
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    // 3. Get Public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filePath
    })
  } catch (err: any) {
    console.error('API Upload Exception:', err)
    return NextResponse.json({ success: false, error: err.message || 'Server upload failed' }, { status: 500 })
  }
}
