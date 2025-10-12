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
    // This is critical for handling chunked cookies properly
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Log session status for debugging
    if (user) {
      console.log('🔄 Middleware - Session refreshed for user:', user.email);
    }

    return response;
  } catch (error) {
    console.error('❌ Middleware - Error updating session:', error);
    return response;
  }
}