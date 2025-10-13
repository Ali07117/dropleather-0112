/**
 * Seller authentication utilities for app.dropleather.com
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

const AUTH_BASE_URL = 'https://auth.dropleather.com'

export function redirectToAuth(reason: string = 'login'): never {
  const currentUrl = encodeURIComponent(window.location.href)
  const authUrl = `${AUTH_BASE_URL}/${reason}?redirect_to=${currentUrl}`
  window.location.href = authUrl
  throw new Error('Redirecting to auth') // This will never execute but satisfies TypeScript
}

export function getAuthRedirectUrl(reason: string = 'login'): string {
  if (typeof window === 'undefined') {
    // Server-side: use a fallback URL
    return `${AUTH_BASE_URL}/${reason}?redirect_to=${encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase')}`
  }
  
  const currentUrl = encodeURIComponent(window.location.href)
  return `${AUTH_BASE_URL}/${reason}?redirect_to=${currentUrl}`
}

export function getAuthUrls() {
  return {
    login: `${AUTH_BASE_URL}/login`,
    accessDenied: `${AUTH_BASE_URL}/access-denied`,
    sessionExpired: `${AUTH_BASE_URL}/session-expired`,
  }
}

export async function requireSellerAuth() {
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

    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session || error) {
      // Redirect to auth service
      redirect(`${AUTH_BASE_URL}/login?redirect_to=${encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase')}`)
    }

    // Check user profile for seller role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, role, is_active, email')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      console.error('Failed to fetch user profile:', profileError)
      redirect(`${AUTH_BASE_URL}/access-denied?redirect_to=${encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase')}`)
    }

    if (profile.role !== 'seller' || !profile.is_active) {
      console.log('Access denied - not an active seller:', {
        role: profile.role,
        isActive: profile.is_active,
        userId: session.user.id
      })
      redirect(`${AUTH_BASE_URL}/access-denied?redirect_to=${encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase')}`)
    }

    return { session, profile }
  } catch (error) {
    console.error('Seller auth error:', error)
    redirect(`${AUTH_BASE_URL}/login?redirect_to=${encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase')}`)
  }
}