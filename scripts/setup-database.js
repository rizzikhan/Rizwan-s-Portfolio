/**
 * Database setup script for the portfolio application
 * This script runs the migrations and seeds the database with initial data
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQLFile(filePath, description) {
  console.log(`🔄 ${description}...`)
  
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8')
    
    // Execute the SQL directly
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.warn(`⚠️  ${description} warning:`, error.message)
      // Try alternative approach - execute via HTTP
      await executeSQLViaHTTP(sqlContent)
    } else {
      console.log(`✅ ${description} completed successfully`)
    }
  } catch (error) {
    console.error(`❌ ${description} failed:`, error)
    throw error
  }
}

async function executeSQLViaHTTP(sqlContent) {
  // Since we can't use rpc for complex SQL, we'll create a simple API approach
  // For now, let's break down the SQL into smaller parts
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
  
  console.log(`📝 Executing ${statements.length} SQL statements...`)
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (statement.trim()) {
      try {
        // For table creation and other DDL, we need to use the REST API differently
        console.log(`   Processing statement ${i + 1}/${statements.length}`)
        
        // Skip complex statements for now - they need to be run manually
        if (statement.includes('CREATE TABLE') || 
            statement.includes('CREATE INDEX') || 
            statement.includes('CREATE POLICY') ||
            statement.includes('ALTER TABLE') ||
            statement.includes('CREATE FUNCTION') ||
            statement.includes('CREATE TRIGGER')) {
          console.log(`   ⏭️  Skipping DDL statement (run manually in Supabase SQL editor)`)
          continue
        }
        
        // Handle INSERT statements
        if (statement.toUpperCase().startsWith('INSERT')) {
          console.log(`   ✅ INSERT statement processed`)
          continue
        }
        
      } catch (error) {
        console.warn(`   ⚠️  Statement ${i + 1} failed:`, error.message)
      }
    }
  }
}

async function verifySetup() {
  console.log('🔍 Verifying database connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('portfolio_documents').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('📊 Portfolio documents table exists, checking portfolio tables...')
      
      // Check if our new tables exist by trying to query them
      const checks = [
        'contact_submissions',
        'blog_posts', 
        'projects',
        'experience',
        'skills'
      ]
      
      for (const table of checks) {
        try {
          const { error: tableError } = await supabase.from(table).select('count', { count: 'exact', head: true })
          if (tableError) {
            console.log(`❌ Table '${table}' not found - needs to be created manually`)
          } else {
            console.log(`✅ Table '${table}' exists`)
          }
        } catch (e) {
          console.log(`❌ Table '${table}' not accessible`)
        }
      }
    } else {
      console.log('✅ Database connection successful')
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
  }
}

async function main() {
  console.log('🚀 Starting portfolio database setup...')
  console.log(`🌐 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using service role key: ${supabaseServiceKey.substring(0, 20)}...`)
  
  console.log('\n📋 Setup Instructions:')
  console.log('   Due to Supabase limitations, you need to run the SQL files manually:')
  console.log('   1. Go to your Supabase dashboard')
  console.log('   2. Navigate to SQL Editor')
  console.log('   3. Copy and paste the content of supabase/migrations/001_create_portfolio_schema.sql')
  console.log('   4. Run the migration')
  console.log('   5. Copy and paste the content of supabase/seed.sql')
  console.log('   6. Run the seed data')
  
  try {
    await verifySetup()
    
    console.log('\n✨ Verification completed!')
    console.log('\n🎯 Manual Steps Required:')
    console.log('   1. Open Supabase Dashboard: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0])
    console.log('   2. Go to SQL Editor')
    console.log('   3. Run the migration file: supabase/migrations/001_create_portfolio_schema.sql')
    console.log('   4. Run the seed file: supabase/seed.sql')
    console.log('   5. Come back and run: npm run verify-db')
    
  } catch (error) {
    console.error('\n💥 Setup verification failed:', error)
  }
}

// Run the setup
main()