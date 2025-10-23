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
    if (!configResponse.ok) {
      throw new Error(`Failed to fetch config: ${configResponse.status} ${configResponse.statusText}`)
    }

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
      // DEBUG: Show what went wrong instead of redirecting
      throw new Error(`Session check failed: ${JSON.stringify({
        hasSession: !!session,
        sessionError: error?.message,
        sessionUserId: session?.user?.id,
        availableCookies: Array.from(cookieStore.getAll()).map(c => c.name)
      })}`)
    }

    // Check user role from user_profiles
    const { data: userProfile, error: userError } = await supabase
      .schema('api')
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single()

    if (userError || !userProfile) {
      throw new Error(`User profile check failed: ${JSON.stringify({
        userError: userError?.message,
        hasUserProfile: !!userProfile,
        userId: session.user.id,
        userEmail: session.user.email
      })}`)
    }

    if (userProfile.role !== 'seller' || !userProfile.is_active) {
      throw new Error(`Access denied: ${JSON.stringify({
        role: userProfile.role,
        isActive: userProfile.is_active,
        userId: session.user.id,
        userEmail: session.user.email,
        requiredRole: 'seller',
        requiredActive: true
      })}`)
    }

    // Fetch seller display data from seller_profiles
    const { data: profile, error: profileError } = await supabase
      .schema('api')
      .from('seller_profiles')
      .select('name, email, subscription_plan')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error(`Seller profile check failed: ${JSON.stringify({
        profileError: profileError?.message,
        hasProfile: !!profile,
        userId: session.user.id,
        userEmail: session.user.email
      })}`)
    }

    return { session, profile }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('🔍 [SELLER AUTH DEBUG]', errorMessage)
    // For now, throw the error to see it on the page instead of redirecting
    throw error
  }
}