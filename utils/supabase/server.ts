import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createServerSupabase() {
  try {
    // Fetch Supabase config
    const configResponse = await fetch('https://api.dropleather.com/v1/config/supabase')
    if (!configResponse.ok) throw new Error('Failed to fetch config')
    
    const { config } = await configResponse.json()
    
    // Create server client with proper cookie handling
    const cookieStore = await cookies()
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, {
              ...options,
              domain: '.dropleather.com',
              secure: true,
              sameSite: 'lax'
            })
          } catch (error) {
            // Handle cookie set errors in server components
            console.warn('Failed to set cookie:', name, error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', {
              ...options,
              maxAge: 0,
              domain: '.dropleather.com',
              secure: true,
              sameSite: 'lax'
            })
          } catch (error) {
            // Handle cookie remove errors in server components
            console.warn('Failed to remove cookie:', name, error)
          }
        },
      },
    })

    return supabase
  } catch (error) {
    throw error
  }
}