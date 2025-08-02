const { createClient } = require('@supabase/supabase-js');
const { Handler } = require('@netlify/functions');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Default content
const defaultContent = require('../../lib/default-content').default;

const handler = async (event, context) => {
  try {
    // Fetch the latest active content
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...defaultContent,
          _debug: { 
            message: 'Using default content',
            error: error?.message || 'No data returned from database'
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        }
      };
    }

    // Return the content from the database
    return {
      statusCode: 200,
      body: JSON.stringify(data.content),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  } catch (error) {
    console.error('Error in content function:', error);
    console.error('Error in content function:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...defaultContent,
        _debug: { 
          error: 'Error fetching content',
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }
};

// Export the handler for Netlify Functions
exports.handler = handler;
