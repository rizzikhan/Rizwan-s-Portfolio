#!/usr/bin/env tsx

/**
 * Database setup script for the portfolio application
 * This script runs the migrations and seeds the database with initial data
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

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

async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  try {
    const migrationSQL = readFileSync(
      join(process.cwd(), 'supabase', 'migrations', '001_create_portfolio_schema.sql'),
      'utf-8'
    )
    
    // Split SQL into statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec', { sql: statement })
        if (error) {
          console.warn('⚠️  Migration warning:', error.message)
        }
      }
    }
    
    console.log('✅ Migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...')
  
  try {
    const seedSQL = readFileSync(
      join(process.cwd(), 'supabase', 'seed.sql'),
      'utf-8'
    )
    
    // Split SQL into statements and execute them
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec', { sql: statement })
        if (error) {
          console.warn('⚠️  Seed warning:', error.message)
        }
      }
    }
    
    console.log('✅ Database seeded successfully')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

async function verifySetup() {
  console.log('🔍 Verifying database setup...')
  
  try {
    // Check if tables exist and have data
    const checks = [
      { table: 'contact_submissions', name: 'Contact Submissions' },
      { table: 'blog_posts', name: 'Blog Posts' },
      { table: 'projects', name: 'Projects' },
      { table: 'experience', name: 'Experience' },
      { table: 'skills', name: 'Skills' },
      { table: 'skill_categories', name: 'Skill Categories' },
    ]
    
    for (const check of checks) {
      const { count, error } = await supabase
        .from(check.table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.error(`❌ Error checking ${check.name}:`, error.message)
      } else {
        console.log(`📊 ${check.name}: ${count} records`)
      }
    }
    
    console.log('✅ Database verification completed')
  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting portfolio database setup...')
  console.log(`🌐 Supabase URL: ${supabaseUrl}`)
  
  try {
    await runMigrations()
    await seedDatabase()
    await verifySetup()
    
    console.log('\n✨ Database setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Visit your Supabase dashboard to review the tables')
    console.log('   2. Test the contact form at /contact')
    console.log('   3. Check the blog at /blog')
    console.log('   4. Access the admin dashboard (when implemented)')
    console.log('\n🎉 Your portfolio is now ready to go!')
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
main()