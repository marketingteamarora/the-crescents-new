import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            try {
              await cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          async remove(name: string, options: CookieOptions) {
            try {
              await cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              console.error('Error removing cookie:', error)
            }
          },
        },
      }
    )
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication error:', userError?.message || 'No user found')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    if (!content) {
      console.error('No content provided in request')
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    console.log(`Deactivating existing content for user: ${user.id}`)
    // First, deactivate all active content for this user
    const { error: deactivateError } = await supabase
      .from('landing_page_content')
      .update({ 
        is_active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (deactivateError) {
      console.error('Error deactivating content:', deactivateError)
      return NextResponse.json(
        { 
          error: 'Failed to deactivate existing content',
          details: deactivateError.message 
        },
        { status: 500 }
      )
    }

    console.log(`Inserting new content for user: ${user.id}`)
    // Then insert the new active content
    const { data, error: insertError } = await supabase
      .from('landing_page_content')
      .insert([{
        content,
        user_id: user.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting content:', insertError)
      return NextResponse.json(
        { 
          error: 'Failed to save content',
          details: insertError.message 
        },
        { status: 500 }
      )
    }

    console.log('Content saved successfully:', data.id)
    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      content: data
    })

  } catch (error) {
    console.error('Unexpected error in save-content API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
