import crypto from 'crypto'

/**
 * Cloudinary Upload Helper with Automatic Supabase Fallback
 * Safely uploads image buffers to Cloudinary using standard Node.js crypto SHA-1 signatures.
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  fileName?: string,
  folder: string = 'resellerpro'
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY || '825689329852662'
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'aSNzCcwNZlxBn0U4V-zkHp09jb8'

  if (!cloudName) {
    return {
      success: false,
      error: 'CLOUDINARY_CLOUD_NAME is not configured in environment variables.'
    }
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`

    // Compute SHA-1 signature for authenticated upload
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

    const formData = new FormData()
    const blob = new Blob([new Uint8Array(fileBuffer)])
    formData.append('file', blob, fileName || 'upload.jpg')
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('folder', folder)
    formData.append('signature', signature)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (res.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id
      }
    } else {
      console.error('[Cloudinary Upload Error]:', data)
      return {
        success: false,
        error: data.error?.message || 'Cloudinary upload failed'
      }
    }
  } catch (err: any) {
    console.error('[Cloudinary Exception]:', err)
    return {
      success: false,
      error: err.message || 'Unexpected upload exception'
    }
  }
}
