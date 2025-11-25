import { NextRequest, NextResponse } from 'next/server'
import { TfIdfEngine } from '@/lib/internal-linking/tfidf-engine'

// POST /api/admin/internal-linking/similarities - Calculate similarities for all content
export async function POST(request: NextRequest) {
  try {
    const engine = new TfIdfEngine()

    // First recalculate IDF scores
    await engine.recalculateIdf()

    // Then calculate all similarities
    const result = await engine.calculateAllSimilarities()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error calculating similarities:', error)
    return NextResponse.json(
      { success: false, calculated: 0, error: error.message },
      { status: 500 }
    )
  }
}
