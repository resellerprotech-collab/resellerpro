import sharp from 'sharp'

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'auto'
}

export interface CompressedImageResult {
  buffer: Buffer
  contentType: string
  extension: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * High-performance server-side image compression using Sharp (libvips).
 * - Resizes images to max 1600x1600 (optimal for crisp Retina e-commerce displays without bloating storage)
 * - Auto-orients mobile camera EXIF orientation
 * - Strips bulky camera metadata (GPS, device models) saving 10-50KB
 * - Encodes with modern WebP at quality 80
 * - Reduces 1-5MB raw camera photos down to ~60-150KB (80-92% reduction)
 */
export async function compressImage(
  inputBuffer: Buffer,
  originalFileName: string = 'upload.jpg',
  options: CompressOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 80,
    format = 'webp',
  } = options

  const originalSize = inputBuffer.length

  try {
    const metadata = await sharp(inputBuffer).metadata()

    // 1. Preserve vector SVGs and animated GIFs
    if (metadata.format === 'svg' || metadata.format === 'gif') {
      return {
        buffer: inputBuffer,
        contentType: metadata.format === 'svg' ? 'image/svg+xml' : 'image/gif',
        extension: metadata.format,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 0,
      }
    }

    // 2. Build compression pipeline
    let pipeline = sharp(inputBuffer)
      .rotate() // Auto-orient based on EXIF
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })

    let targetExtension = 'webp'
    let targetContentType = 'image/webp'

    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true })
      targetExtension = 'jpg'
      targetContentType = 'image/jpeg'
    } else {
      // Default: WebP provides superior compression and 100% modern browser support
      pipeline = pipeline.webp({ quality, effort: 4 })
      targetExtension = 'webp'
      targetContentType = 'image/webp'
    }

    const compressedBuffer = await pipeline.toBuffer()
    const compressedSize = compressedBuffer.length
    const compressionRatio = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))

    console.log(
      `[Image Compression] ${originalFileName}: ${(originalSize / 1024).toFixed(1)} KB -> ${(compressedSize / 1024).toFixed(1)} KB (${compressionRatio}% reduction)`
    )

    return {
      buffer: compressedBuffer,
      contentType: targetContentType,
      extension: targetExtension,
      originalSize,
      compressedSize,
      compressionRatio,
    }
  } catch (error) {
    console.warn('[Image Compression Warning]: Sharp compression failed, using original buffer', error)
    const ext = originalFileName.split('.').pop()?.toLowerCase() || 'jpg'
    return {
      buffer: inputBuffer,
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      extension: ext,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
    }
  }
}
