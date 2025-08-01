'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NetlifyTestPage() {
  const [envVars, setEnvVars] = useState({
    url: '',
    keyExists: false,
    isNetlify: false,
    isClient: false
  })
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [directApiResult, setDirectApiResult] = useState<any>(null)
  const [directApiLoading, setDirectApiLoading] = useState(false)

  useEffect(() => {
    // Set client-side flags
    setEnvVars(prev => ({
      ...prev,
      isClient: true,
      isNetlify: process.env.NETLIFY === 'true',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT FOUND',
      keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }))
  }, [])

  const testSaveContent = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error(userError?.message || 'Not authenticated')
      }

      // Test RPC call
      const { data, error } = await supabase.rpc('save_landing_page_content_v2', {
        p_content: { test: 'Netlify test ' + new Date().toISOString() },
        p_user_id: user.id
      })
      
      if (error) throw error
      setTestResult({ success: true, data })
    } catch (error: any) {
      console.error('RPC Test failed:', error)
      setTestResult({ 
        success: false, 
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectApiCall = async () => {
    setDirectApiLoading(true)
    setDirectApiResult(null)
    
    try {
      // First get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error(sessionError?.message || 'No active session')
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/save_landing_page_content_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          p_content: { test: 'Direct API test ' + new Date().toISOString() },
          p_user_id: session.user.id
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'API call failed')
      }
      
      setDirectApiResult({ success: true, data })
    } catch (error: any) {
      console.error('Direct API call failed:', error)
      setDirectApiResult({ 
        success: false, 
        error: {
          message: error.message,
          details: error.details,
          code: error.code
        }
      })
    } finally {
      setDirectApiLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Netlify Deployment Test</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-white p-4 rounded overflow-auto text-sm">
          {JSON.stringify({
            'NEXT_PUBLIC_SUPABASE_URL': envVars.url ? '•••••' + envVars.url.slice(-10) : 'NOT FOUND',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY': envVars.keyExists ? '••••••••••••••••••••••••••••••••••••••••••••••' : 'NOT FOUND',
            'NETLIFY': envVars.isNetlify,
            'NODE_ENV': process.env.NODE_ENV,
            'NEXT_PUBLIC_VERCEL_ENV': process.env.NEXT_PUBLIC_VERCEL_ENV || 'not set'
          }, null, 2)}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Test Supabase RPC</h2>
          <button
            onClick={testSaveContent}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 mb-4"
          >
            {isLoading ? 'Testing...' : 'Test RPC Call'}
          </button>
          
          {testResult && (
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-semibold">
                {testResult.success ? '✅ RPC Success!' : '❌ RPC Error'}
              </h3>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto text-xs">
                {JSON.stringify(testResult.success ? testResult.data : testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Test Direct API Call</h2>
          <button
            onClick={testDirectApiCall}
            disabled={directApiLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300 mb-4"
          >
            {directApiLoading ? 'Testing...' : 'Test Direct API'}
          </button>
          
          {directApiResult && (
            <div className={`p-4 rounded ${directApiResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-semibold">
                {directApiResult.success ? '✅ API Success!' : '❌ API Error'}
              </h3>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto text-xs">
                {JSON.stringify(directApiResult.success ? directApiResult.data : directApiResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Deploy this test page to Netlify</li>
          <li>Visit <code>/netlify-test</code> on your Netlify site</li>
          <li>Run both tests and note any errors</li>
          <li>Check the browser's console for detailed error messages</li>
          <li>Take screenshots of any errors and share them</li>
        </ol>
      </div>
    </div>
  )
}
