import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Get Supabase config from backend
    const configResponse = await fetch('https://api.dropleather.com/v1/config/supabase');
    const { config } = await configResponse.json();

    const supabase = createServerClient(
      config.url,
      config.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set cookies on the request (for further server-side processing)
            request.cookies.set(name, value);
            
            // Set cookies on the response (for browser)
            response.cookies.set(name, value, {
              ...options,
              domain: '.dropleather.com',
              secure: true,
              sameSite: 'lax'
            });
          });
        },
      },
    }
  );

    // IMPORTANT: This will refresh expired tokens and create new session cookies
    // Using getClaims() instead of getUser() as per Supabase official docs
    // getClaims() automatically refreshes expired tokens and validates JWT signature
    const {
      data: user,
    } = await supabase.auth.getClaims();

    // Log session status for debugging
    if (user) {
      console.log('🔄 Middleware - Session refreshed for user:', user.claims?.email || user.claims?.sub);
    }

    return response;
  } catch (error) {
    console.error('❌ Middleware - Error updating session:', error);
    return response;
  }
}