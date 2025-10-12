import { createBrowserClient } from '@supabase/ssr';

export async function createClientSupabase() {
  // Get Supabase config from backend
  const configResponse = await fetch('https://api.dropleather.com/v1/config/supabase');
  const { config } = await configResponse.json();

  return createBrowserClient(
    config.url,
    config.anonKey,
    {
      // CRITICAL: Browser client handles cookies automatically
      // including chunked cookies (.0, .1 parts) for large sessions
      cookies: {
        getAll() {
          return document.cookie
            .split('; ')
            .map(cookie => {
              const [name, ...value] = cookie.split('=');
              return { name, value: value.join('=') };
            });
        },
        setAll(cookiesToSet) {
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
}