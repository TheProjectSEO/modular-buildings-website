import { NextRequest, NextResponse } from 'next/server'
import { TfIdfEngine } from '@/lib/internal-linking/tfidf-engine'

// GET /api/admin/internal-linking/recommendations/[pageId] - Get similar content recommendations
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '5')
    const minSimilarity = parseFloat(searchParams.get('minSimilarity') || '0.3')

    const engine = new TfIdfEngine()
    const recommendations = await engine.getSimilarContent(
      params.pageId,
      limit,
      minSimilarity
    )

    return NextResponse.json({
      pageId: params.pageId,
      recommendations,
      count: recommendations.length
    })
  } catch (error: any) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
