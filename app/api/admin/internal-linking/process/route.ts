import { NextRequest, NextResponse } from 'next/server'
import { TfIdfEngine } from '@/lib/internal-linking/tfidf-engine'

// POST /api/admin/internal-linking/process - Process a batch of pending content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const batchSize = body.batchSize || 10

    const engine = new TfIdfEngine(batchSize)
    const result = await engine.processBatch()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error processing batch:', error)
    return NextResponse.json(
      { success: false, processed: 0, remaining: 0, error: error.message },
      { status: 500 }
    )
  }
}
