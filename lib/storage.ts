import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Storage bucket configuration
export const MEDIA_BUCKET = 'media'

// Allowed file types for upload
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'application/pdf'
] as const

// Max file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024

export type AllowedFileType = typeof ALLOWED_FILE_TYPES[number]

/**
 * Initialize the media storage bucket
 * Creates the bucket if it doesn't exist
 */
export async function initializeMediaBucket(supabase: SupabaseClient): Promise<{
  success: boolean
  error?: string
  created?: boolean
}> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return { success: false, error: listError.message }
    }

    const bucketExists = buckets?.some(bucket => bucket.name === MEDIA_BUCKET)

    if (bucketExists) {
      return { success: true, created: false }
    }

    // Create public bucket for media files
    const { error: createError } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      allowedMimeTypes: [...ALLOWED_FILE_TYPES],
      fileSizeLimit: MAX_FILE_SIZE
    })

    if (createError) {
      // Ignore "already exists" errors
      if (createError.message.includes('already exists')) {
        return { success: true, created: false }
      }
      console.error('Error creating bucket:', createError)
      return { success: false, error: createError.message }
    }

    return { success: true, created: true }
  } catch (error) {
    console.error('Error initializing media bucket:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Validate a file for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)) {
    return {
      valid: false,
      error: `File type "${file.type}" not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}

/**
 * Generate a unique, safe file name
 */
export function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || ''
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .substring(0, 50) // Limit length
    .toLowerCase()

  return `${baseName}-${timestamp}-${random}.${extension}`
}

/**
 * Get public URL for a file in the media bucket
 */
export function getMediaPublicUrl(
  supabase: SupabaseClient,
  filePath: string
): string {
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Upload a file to the media bucket
 */
export async function uploadToMediaBucket(
  supabase: SupabaseClient,
  file: File | Buffer,
  fileName: string,
  contentType: string
): Promise<{
  success: boolean
  path?: string
  publicUrl?: string
  error?: string
}> {
  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(fileName, file, {
        contentType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { success: false, error: error.message }
    }

    const publicUrl = getMediaPublicUrl(supabase, data.path)

    return {
      success: true,
      path: data.path,
      publicUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from the media bucket
 */
export async function deleteFromMediaBucket(
  supabase: SupabaseClient,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Extract storage path from a public URL
 */
export function extractStoragePath(publicUrl: string): string | null {
  const bucketPattern = `/${MEDIA_BUCKET}/`
  const index = publicUrl.indexOf(bucketPattern)

  if (index === -1) {
    return null
  }

  return publicUrl.substring(index + bucketPattern.length)
}

/**
 * Get file extension from file name or MIME type
 */
export function getFileExtension(fileName: string, mimeType?: string): string {
  // Try to get from file name first
  const fromName = fileName.split('.').pop()?.toLowerCase()
  if (fromName) return fromName

  // Fall back to MIME type mapping
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'application/pdf': 'pdf'
  }

  return mimeType ? mimeToExt[mimeType] || 'bin' : 'bin'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
