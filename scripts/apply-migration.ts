import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service role key for migrations

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'fix-schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('pg_temp.execute_sql', {
      sql: migrationSQL,
    });

    if (error) {
      console.error('Error applying migration:', error);
      process.exit(1);
    }

    console.log('Migration applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  }
}

applyMigration();
