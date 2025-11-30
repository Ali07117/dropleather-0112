import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Global client instance - create once, use everywhere
let supabaseClient: SupabaseClient<any, 'public', any> | null = null;

/**
 * Professional Supabase Client with Automatic Session Management
 * - Automatic token refresh (handles 1-hour JWT expiration)
 * - Session persistence across browser refreshes
 * - Proper error handling and auth state changes
 */
export async function createClientSupabase(): Promise<SupabaseClient<any, 'public', any>> {
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    // Get Supabase config from backend
    const configResponse = await fetch('https://api.dropleather.com/v1/config/supabase');

    if (!configResponse.ok) {
      throw new Error('Failed to fetch Supabase config');
    }

    const { config } = await configResponse.json();

    // Create browser client with professional session handling
    supabaseClient = createBrowserClient(
      config.url,
      config.anonKey,
      {
        auth: {
          // CRITICAL: Enable automatic token refresh
          autoRefreshToken: true,
          // CRITICAL: Persist sessions across browser refreshes
          persistSession: true,
          // Detect session in URL (for auth redirects)
          detectSessionInUrl: true,
          // Let Supabase handle storage - will use cookies by default with SSR
        },
        // Cookie handling for SSR compatibility
        cookies: {
          getAll() {
            if (typeof document === 'undefined') return [];
            return document.cookie
              .split('; ')
              .filter(Boolean)
              .map(cookie => {
                const [name, ...value] = cookie.split('=');
                return { name, value: value.join('=') };
              });
          },
          setAll(cookiesToSet) {
            if (typeof document === 'undefined') return;
            cookiesToSet.forEach(({ name, value, options }) => {
              let cookieString = `${name}=${value}`;

              if (options?.expires) {
                cookieString += `; expires=${options.expires.toUTCString()}`;
              }
              if (options?.maxAge) {
                cookieString += `; max-age=${options.maxAge}`;
              }
              if (options?.domain) {
                cookieString += `; domain=${options.domain}`;
              }
              if (options?.path) {
                cookieString += `; path=${options.path}`;
              }
              if (options?.secure) {
                cookieString += '; secure';
              }
              if (options?.httpOnly) {
                cookieString += '; httponly';
              }
              if (options?.sameSite) {
                cookieString += `; samesite=${options.sameSite}`;
              }

              document.cookie = cookieString;
            });
          },
        },
      }
    );

    // Professional session monitoring with cross-subdomain redirect
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('🔐 [SUPABASE AUTH]', event, {
        hasSession: !!session,
        userId: session?.user?.id,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A',
        timeUntilExpiry: session?.expires_at ?
          Math.max(0, (session.expires_at * 1000) - Date.now()) : 0
      });

      // Handle authentication events
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ [SUPABASE AUTH] User signed in successfully');
          break;
        case 'SIGNED_OUT':
          console.log('👋 [SUPABASE AUTH] User signed out - redirecting to auth subdomain');
          // Redirect to auth subdomain when signed out
          if (typeof window !== 'undefined') {
            window.location.href = 'https://auth.dropleather.com/login';
          }
          break;
        case 'TOKEN_REFRESHED':
          console.log('🔄 [SUPABASE AUTH] Token refreshed automatically');
          break;
        case 'USER_UPDATED':
          console.log('📝 [SUPABASE AUTH] User data updated');
          break;
      }

      // Handle session expiration or invalid sessions
      if (!session && event !== 'SIGNED_OUT' && typeof window !== 'undefined') {
        // Check if we have expired/invalid auth cookies
        const authCookies = document.cookie.split(';').filter(cookie => 
          cookie.includes('sb-') && cookie.includes('auth-token')
        );
        
        if (authCookies.length > 0) {
          console.log('⚠️ [SUPABASE AUTH] Session expired with existing cookies - redirecting to auth subdomain');
          window.location.href = 'https://auth.dropleather.com/login';
        }
      }
    });

    console.log('✅ [SUPABASE CLIENT] Initialized with professional session handling');

    return supabaseClient;
  } catch (error) {
    console.error('❌ [SUPABASE CLIENT] Failed to initialize:', error);
    throw error;
  }
}

/**
 * Get the current user claims with automatic refresh
 */
export async function getCurrentUser() {
  const client = await createClientSupabase();
  const { data: user, error } = await client.auth.getClaims();

  if (error) {
    console.error('❌ [SUPABASE USER] Failed to get user:', error);
    return null;
  }

  return user;
}

/**
 * Check if user is authenticated with error handling
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClientSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.access_token;
  } catch (error) {
    console.error('❌ [SUPABASE AUTH] Authentication check failed:', error);
    // On authentication error, redirect to auth subdomain
    if (typeof window !== 'undefined') {
      window.location.href = 'https://auth.dropleather.com/login';
    }
    return false;
  }
}

/**
 * Handle authentication errors globally
 */
export function handleAuthError(error: any): void {
  console.error('❌ [SUPABASE AUTH] Authentication error:', error);
  
  // Common authentication error messages that should trigger redirect
  const authErrors = [
    'Invalid JWT',
    'JWT expired',
    'User not found',
    'Session not found',
    'Invalid session',
    'Authentication required'
  ];
  
  const errorMessage = error?.message || error?.error_description || String(error);
  const isAuthError = authErrors.some(errMsg => 
    errorMessage.toLowerCase().includes(errMsg.toLowerCase())
  );
  
  if (isAuthError && typeof window !== 'undefined') {
    console.log('🔄 [SUPABASE AUTH] Redirecting to auth subdomain due to authentication error');
    window.location.href = 'https://auth.dropleather.com/login';
  }
}