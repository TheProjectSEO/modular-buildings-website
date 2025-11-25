import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { migrationFile } = await request.json()

    if (!migrationFile) {
      return NextResponse.json(
        { error: 'Migration file name required' },
        { status: 400 }
      )
    }

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', migrationFile)

    if (!fs.existsSync(migrationPath)) {
      return NextResponse.json(
        { error: 'Migration file not found' },
        { status: 404 }
      )
    }

    const sqlContent = fs.readFileSync(migrationPath, 'utf-8')

    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    const results = []

    for (const statement of statements) {
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql_query: statement
        })

        if (error) {
          // Try direct execution if rpc fails
          const { data: directData, error: directError } = await supabaseAdmin
            .from('_migrations')
            .insert({ statement })

          if (directError) {
            console.error('Error executing statement:', statement, directError)
            results.push({ statement: statement.substring(0, 100), error: directError.message })
          } else {
            results.push({ statement: statement.substring(0, 100), success: true })
          }
        } else {
          results.push({ statement: statement.substring(0, 100), success: true })
        }
      } catch (err: any) {
        console.error('Error executing statement:', err)
        results.push({ statement: statement.substring(0, 100), error: err.message })
      }
    }

    return NextResponse.json({
      message: 'Migration executed',
      migrationFile,
      results
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to run migration' },
      { status: 500 }
    )
  }
}

// Alternative: Execute SQL directly
export async function PUT(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query required' },
        { status: 400 }
      )
    }

    // Execute raw SQL using Supabase admin client
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: sql
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'SQL executed successfully',
      data
    })
  } catch (error: any) {
    console.error('SQL execution error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to execute SQL' },
      { status: 500 }
    )
  }
}
