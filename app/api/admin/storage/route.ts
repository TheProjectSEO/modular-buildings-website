import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { initializeMediaBucket, MEDIA_BUCKET, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/storage'

/**
 * GET - Check storage bucket status
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // List buckets
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const mediaBucket = buckets?.find(b => b.name === MEDIA_BUCKET)

    return NextResponse.json({
      buckets: buckets?.map(b => ({
        name: b.name,
        public: b.public,
        created_at: b.created_at
      })),
      mediaBucket: mediaBucket ? {
        exists: true,
        name: mediaBucket.name,
        public: mediaBucket.public,
        created_at: mediaBucket.created_at
      } : {
        exists: false
      },
      config: {
        bucketName: MEDIA_BUCKET,
        allowedTypes: ALLOWED_FILE_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        maxFileSizeMB: MAX_FILE_SIZE / (1024 * 1024)
      }
    })
  } catch (error) {
    console.error('Storage status error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST - Initialize/create the media bucket
 */
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const result = await initializeMediaBucket(supabase)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.created
        ? `Media bucket "${MEDIA_BUCKET}" created successfully`
        : `Media bucket "${MEDIA_BUCKET}" already exists`,
      created: result.created
    })
  } catch (error) {
    console.error('Storage init error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
