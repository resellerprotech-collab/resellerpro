import crypto from 'crypto'
import { compressImage } from './image-compress'

export interface CloudinaryUploadResult {
  success: boolean
  url?: string
  publicId?: string
  originalSize?: number
  compressedSize?: number
  compressionRatio?: number
  error?: string
}

/**
 * Cloudinary Upload Helper with Automated Image Compression
 * - Compresses incoming raw buffers (1MB-5MB) down to ~60-150KB WebP using Sharp before upload.
 * - Saves Cloudinary storage quota and reduces buyer page load time.
 * - Safely uploads to Cloudinary with authenticated SHA-1 signature.
 * - Injects f_auto,q_auto transformations on the returned URL for optimal edge delivery.
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  fileName?: string,
  folder: string = 'resellerpro'
): Promise<CloudinaryUploadResult> {
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
    // 🗜️ COMPRESSION STEP:
    // Compress raw image (e.g. 1MB-5MB camera photo) down to crisp ~60-150KB WebP
    const compressed = await compressImage(fileBuffer, fileName || 'upload.jpg')
    const finalBuffer = compressed.buffer
    const uploadFileName = `${(fileName || 'upload').replace(/\.[^/.]+$/, '')}.${compressed.extension}`

    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`

    // Compute SHA-1 signature for authenticated upload
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

    const formData = new FormData()
    const blob = new Blob([new Uint8Array(finalBuffer)], { type: compressed.contentType })
    formData.append('file', blob, uploadFileName)
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
      // Injects f_auto,q_auto into the delivery URL for automatic WebP/AVIF format and quality negotiation on Edge
      const optimizedUrl = data.secure_url.includes('/image/upload/') && !data.secure_url.includes('/f_auto')
        ? data.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
        : data.secure_url

      return {
        success: true,
        url: optimizedUrl,
        publicId: data.public_id,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        compressionRatio: compressed.compressionRatio,
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
