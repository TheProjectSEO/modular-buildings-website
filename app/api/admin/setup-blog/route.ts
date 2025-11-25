import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const results: any[] = []

    // Check if tables exist by trying to query them
    const { error: authorsError } = await supabaseAdmin
      .from('authors')
      .select('id')
      .limit(1)

    if (authorsError && authorsError.code === 'PGRST116') {
      results.push({ step: 'authors_table', status: 'creating' })

      // Tables don't exist, need to create them
      // Since we can't execute raw DDL from the client, we'll return instructions
      return NextResponse.json({
        message: 'Blog tables need to be created',
        instructions: 'Please run the migration SQL in the Supabase SQL Editor',
        migrationFile: 'supabase/migrations/20241125_create_blog_system.sql',
        results
      })
    }

    // Tables exist, check for sample data
    const { data: authors, error: authorsCheckError } = await supabaseAdmin
      .from('authors')
      .select('*')
      .limit(1)

    if (authorsCheckError) {
      results.push({
        step: 'check_authors',
        error: authorsCheckError.message
      })
    } else if (!authors || authors.length === 0) {
      // Insert sample author
      const { data: newAuthor, error: insertError } = await supabaseAdmin
        .from('authors')
        .insert({
          name: 'Mehmet Johnson',
          email: 'mehmet.johnson@karmod.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
          bio: 'Senior Construction Consultant with over 15 years of experience in modular and prefabricated building solutions.',
          social_links: {
            twitter: 'https://twitter.com/mehmetj',
            linkedin: 'https://linkedin.com/in/mehmetjohnson'
          }
        })
        .select()
        .single()

      if (insertError) {
        results.push({
          step: 'insert_sample_author',
          error: insertError.message
        })
      } else {
        results.push({
          step: 'insert_sample_author',
          status: 'created',
          author: newAuthor
        })
      }
    } else {
      results.push({
        step: 'check_authors',
        status: 'exists',
        count: authors.length
      })
    }

    // Check blog_posts table
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .limit(1)

    if (postsError) {
      results.push({
        step: 'check_blog_posts',
        error: postsError.message
      })
    } else {
      results.push({
        step: 'check_blog_posts',
        status: 'exists'
      })
    }

    return NextResponse.json({
      message: 'Blog system setup check completed',
      results,
      tablesExist: true
    })
  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to setup blog system' },
      { status: 500 }
    )
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    // Check if tables exist
    const { error: authorsError } = await supabaseAdmin
      .from('authors')
      .select('id')
      .limit(1)

    const { error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .limit(1)

    const authorsExist = !authorsError || authorsError.code !== 'PGRST116'
    const postsExist = !postsError || postsError.code !== 'PGRST116'

    if (!authorsExist || !postsExist) {
      return NextResponse.json({
        status: 'not_setup',
        message: 'Blog tables do not exist',
        instructions: 'Run POST /api/admin/setup-blog to get setup instructions',
        tables: {
          authors: authorsExist,
          blog_posts: postsExist
        }
      })
    }

    // Get counts
    const { count: authorsCount } = await supabaseAdmin
      .from('authors')
      .select('*', { count: 'exact', head: true })

    const { count: postsCount } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      status: 'ready',
      message: 'Blog system is set up',
      tables: {
        authors: authorsExist,
        blog_posts: postsExist
      },
      counts: {
        authors: authorsCount || 0,
        posts: postsCount || 0
      }
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check blog system status' },
      { status: 500 }
    )
  }
}
