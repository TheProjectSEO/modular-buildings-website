import { NextRequest, NextResponse } from 'next/server'
import { TfIdfEngine } from '@/lib/internal-linking/tfidf-engine'

// POST /api/admin/internal-linking/index - Start indexing process
export async function POST(request: NextRequest) {
  try {
    const engine = new TfIdfEngine()
    const result = await engine.startIndexing()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error starting indexing:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/admin/internal-linking/index - Get indexing stats
export async function GET(request: NextRequest) {
  try {
    const engine = new TfIdfEngine()
    const stats = await engine.getIndexStats()

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error getting index stats:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/internal-linking/index - Clear index
export async function DELETE(request: NextRequest) {
  try {
    const engine = new TfIdfEngine()
    const result = await engine.clearIndex()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error clearing index:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
