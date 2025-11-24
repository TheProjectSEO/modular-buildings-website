import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Allowed file types for upload
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'application/pdf'
]

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Storage bucket name
const BUCKET_NAME = 'media'

/**
 * Ensure the media bucket exists
 */
async function ensureBucket(supabase: ReturnType<typeof createClient<any, any, any>>) {
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)

  if (!bucketExists) {
    // Create public bucket for media files
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ALLOWED_TYPES,
      fileSizeLimit: MAX_FILE_SIZE
    })

    if (error && !error.message.includes('already exists')) {
      console.error('Error creating bucket:', error)
      throw new Error(`Failed to create storage bucket: ${error.message}`)
    }
  }
}

/**
 * Generate a unique file name to prevent collisions
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || ''
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .substring(0, 50) // Limit length

  return `${baseName}-${timestamp}-${random}.${extension}`
}

/**
 * Get image dimensions from file buffer
 */
async function getImageDimensions(buffer: Buffer, mimeType: string): Promise<{ width?: number; height?: number }> {
  // Only process images (not SVG which is text-based)
  if (!mimeType.startsWith('image/') || mimeType === 'image/svg+xml') {
    return {}
  }

  try {
    // Simple dimension extraction from common image formats
    // For PNG
    if (mimeType === 'image/png') {
      if (buffer.length > 24) {
        const width = buffer.readUInt32BE(16)
        const height = buffer.readUInt32BE(20)
        return { width, height }
      }
    }

    // For JPEG/JPG
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      let offset = 2
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break
        const marker = buffer[offset + 1]
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5)
          const width = buffer.readUInt16BE(offset + 7)
          return { width, height }
        }
        const length = buffer.readUInt16BE(offset + 2)
        offset += 2 + length
      }
    }

    // For GIF
    if (mimeType === 'image/gif') {
      if (buffer.length > 10) {
        const width = buffer.readUInt16LE(6)
        const height = buffer.readUInt16LE(8)
        return { width, height }
      }
    }

    // For WebP
    if (mimeType === 'image/webp') {
      if (buffer.length > 30) {
        // Check for VP8 chunk
        const vp8Index = buffer.indexOf('VP8 ')
        if (vp8Index !== -1 && buffer.length > vp8Index + 14) {
          const width = (buffer.readUInt16LE(vp8Index + 10) & 0x3fff)
          const height = (buffer.readUInt16LE(vp8Index + 12) & 0x3fff)
          if (width && height) return { width, height }
        }
        // Check for VP8L (lossless)
        const vp8lIndex = buffer.indexOf('VP8L')
        if (vp8lIndex !== -1 && buffer.length > vp8lIndex + 9) {
          const bits = buffer.readUInt32LE(vp8lIndex + 5)
          const width = (bits & 0x3fff) + 1
          const height = ((bits >> 14) & 0x3fff) + 1
          if (width && height) return { width, height }
        }
      }
    }
  } catch (error) {
    console.error('Error getting image dimensions:', error)
  }

  return {}
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    // Create Supabase client (storage doesn't use custom schema)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Also create client for database operations with custom schema
    const supabaseDb = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'Modular-buildings.co'
      }
    })

    // Ensure bucket exists
    await ensureBucket(supabase)

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const pageId = formData.get('page_id') as string | null
    const altText = formData.get('alt_text') as string | null
    const caption = formData.get('caption') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Generate unique file name
    const uniqueFileName = generateUniqueFileName(file.name)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get image dimensions if applicable
    const dimensions = await getImageDimensions(buffer, file.type)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFileName)

    const publicUrl = urlData.publicUrl

    // Insert media record into database
    const { data: mediaRecord, error: dbError } = await supabaseDb
      .from('media')
      .insert({
        page_id: pageId || null,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        alt_text: altText || null,
        caption: caption || null,
        width: dimensions.width || null,
        height: dimensions.height || null,
        metadata: {
          original_name: file.name,
          storage_path: uploadData.path,
          uploaded_at: new Date().toISOString()
        }
      })
      .select('*, page:pages(id, title, slug)')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to clean up the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([uniqueFileName])
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: mediaRecord
    })
  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * DELETE handler to remove media from storage and database
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('id')

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID required' },
        { status: 400 }
      )
    }

    // Create clients
    const supabase = createClient(supabaseUrl, supabaseKey)
    const supabaseDb = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'Modular-buildings.co'
      }
    })

    // Get the media record first to get the storage path
    const { data: mediaRecord, error: fetchError } = await supabaseDb
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .single()

    if (fetchError || !mediaRecord) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Extract storage path from URL or metadata
    let storagePath = mediaRecord.metadata?.storage_path

    if (!storagePath && mediaRecord.file_url) {
      // Try to extract from URL
      const urlParts = mediaRecord.file_url.split(`/${BUCKET_NAME}/`)
      if (urlParts.length > 1) {
        storagePath = urlParts[1]
      }
    }

    // Delete from storage if we have a path
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        // Continue to delete database record even if storage delete fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabaseDb
      .from('media')
      .delete()
      .eq('id', mediaId)

    if (dbError) {
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    console.error('Delete handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
