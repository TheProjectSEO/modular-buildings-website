import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration(migrationFile: string) {
  console.log(`\n🔄 Running migration: ${migrationFile}\n`)

  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', migrationFile)

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`)
    process.exit(1)
  }

  const sqlContent = fs.readFileSync(migrationPath, 'utf-8')

  // Split by semicolons but keep multi-line statements together
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && s !== '\n')

  console.log(`Found ${statements.length} SQL statements\n`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Skip comments and empty lines
    if (!statement || statement.startsWith('--')) continue

    try {
      console.log(`[${i + 1}/${statements.length}] Executing...`)
      console.log(statement.substring(0, 80) + (statement.length > 80 ? '...' : ''))

      const { error } = await supabase.rpc('exec_sql', { query: statement })

      if (error) {
        console.error(`❌ Error:`, error.message)

        // Try to continue with next statement
        if (error.message.includes('already exists')) {
          console.log('   ⚠️  Object already exists, continuing...')
        } else {
          throw error
        }
      } else {
        console.log('   ✅ Success')
      }
    } catch (error: any) {
      console.error(`\n❌ Failed to execute statement:`)
      console.error(statement)
      console.error(`\nError: ${error.message}\n`)

      // Ask if we should continue
      if (!error.message.includes('already exists')) {
        process.exit(1)
      }
    }
  }

  console.log(`\n✅ Migration completed: ${migrationFile}\n`)
}

// Run migration
const migrationFile = process.argv[2] || '20241125_create_blog_system.sql'
runMigration(migrationFile).catch(console.error)
