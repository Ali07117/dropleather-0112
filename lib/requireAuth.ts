import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

export async function requireAuth() {
  try {
    // Fetch Supabase config
    const configResponse = await fetch('https://api.dropleather.com/v1/config/supabase')
    if (!configResponse.ok) throw new Error('Failed to fetch config')

    const { config } = await configResponse.json()

    // Create server client
    const cookieStore = await cookies()
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const { data: user, error } = await supabase.auth.getClaims()

    if (!user || error) {
      // Redirect to auth service, same as middleware
      const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.dropleather.com'
      redirect(`${authServiceUrl}/login`)
    }

    return user
  } catch {
    // On any error, redirect to auth service
    const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.dropleather.com'
    redirect(`${authServiceUrl}/login`)
  }
}