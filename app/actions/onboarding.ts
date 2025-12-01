'use server';

import { createServerSupabase } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


// 🔐 SECURE SERVER ACTION: Onboarding submission with zero token exposure
export async function submitOnboarding(formData: FormData) {
  console.log('🔥🔥🔥 SERVER ACTION ENTRY POINT HIT:', {
    timestamp: new Date().toISOString(),
    message: '*** submitOnboarding SERVER ACTION CALLED ***',
    hasFormData: !!formData,
    step: '1_SERVER_ACTION_ENTRY'
  });
  
  console.log('🛡️ SERVER ACTION: Onboarding submission started');
  
  let redirectPath: string | null = null;

  try {
    // 🔐 SECURITY: All authentication happens server-side - no tokens exposed to client
    const supabase = await createServerSupabase();
    
    // For server actions, we need the access token, so use getUser() 
    // which is safe in server components according to Supabase docs
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error('❌ SERVER ACTION: No valid session found for onboarding');
      redirect('/login?error=session_expired');
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.error('❌ SERVER ACTION: No access token found');
      redirect('/login?error=session_expired');
    }

    console.log('✅ SERVER ACTION: Valid session found for user:', user.email);

    // Extract form data
    const name = formData.get('name') as string;
    const day = formData.get('day') as string;
    const month = formData.get('month') as string;
    const year = formData.get('year') as string;
    const category = formData.get('category') as string;
    const hearAbout = formData.get('hearAbout') as string;
    const theme = formData.get('theme') as string;
    const emailSubscription = formData.get('emailSubscription') as string;

    console.log('📝 SERVER ACTION: Processing onboarding data for:', {
      name,
      category,
      hearAbout,
      theme,
      dateOfBirth: `${year}-${month}-${day}`,
      emailSubscription
    });


    // Get CSRF token server-side (hidden from client) with cookies
    const csrfResponse = await fetch('https://api.dropleather.com/v1/csrf-token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies in request and response
    });


    if (!csrfResponse.ok) {
      console.error('❌ SERVER ACTION: Failed to get CSRF token for onboarding');
      throw new Error('Security token unavailable');
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken || csrfData.token;


    if (!csrfToken) {
      throw new Error('No CSRF token received from API');
    }

    // Get CSRF cookie from response for API calls
    let csrfCookie = null;
    const setCookieHeader = csrfResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      const csrfCookieMatch = setCookieHeader.match(/csrf-token=([^;]+)/);
      if (csrfCookieMatch) {
        csrfCookie = csrfCookieMatch[1];
      }
    }

    // 🔐 Create request headers with server-side tokens (completely hidden)
    const apiHeaders: { [key: string]: string } = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
      'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
      'Origin': 'https://app.dropleather.com'
    };

    // Add CSRF cookie to headers if we have it
    if (csrfCookie) {
      apiHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
    }


    // 🔥🔥🔥 BEFORE API CALL DEBUG 🔥🔥🔥
    console.log('🔥 SERVER_ACTION_BEFORE_API_CALL:', {
      timestamp: new Date().toISOString(),
      message: '*** ABOUT TO CALL BACKEND API ***',
      url: 'https://api.dropleather.com/v1/seller/onboarding/complete',
      method: 'POST',
      hasAuth: !!session.access_token,
      hasCSRF: !!csrfToken,
      step: '2_BEFORE_API_CALL'
    });

    // Submit onboarding data via secure server-side API call
    const response = await fetch('https://api.dropleather.com/v1/seller/onboarding/complete', {
      method: 'POST',
      headers: apiHeaders,
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        name,
        dateOfBirth: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        category,
        hearAbout,
        theme,
        emailSubscription
      })
    });

    // 🔥🔥🔥 AFTER API CALL DEBUG 🔥🔥🔥
    console.log('🔥 SERVER_ACTION_AFTER_API_CALL:', {
      timestamp: new Date().toISOString(),
      message: '*** BACKEND API CALL COMPLETED ***',
      responseStatus: response.status,
      responseOk: response.ok,
      step: '3_AFTER_API_CALL'
    });

    const data = await response.json();
    
    console.log('🔥 SERVER_ACTION_API_RESPONSE_DATA:', {
      timestamp: new Date().toISOString(),
      data: data,
      step: '4_API_RESPONSE_PARSED'
    });


    if (response.ok && data.success) {
      console.log('✅ SERVER ACTION: Onboarding completed successfully');
      
      
      // Set redirect path (don't call redirect inside try/catch)
      redirectPath = data.redirectUrl || '/dashboard';
    } else {
      console.error('❌ SERVER ACTION: Onboarding submission failed:', data);
      
      
      throw new Error(data.message || 'Onboarding submission failed');
    }

  } catch (error) {
    console.error('❌ SERVER ACTION: Onboarding submission error:', error);
    
    
    // Set redirect path with error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    redirectPath = `/onboarding?error=${encodeURIComponent(errorMessage)}`;
  }
  
  // 🔧 REDIRECT OUTSIDE TRY/CATCH - This is required for Next.js App Router
  if (redirectPath) {
    redirect(redirectPath);
  }
}

// 🔐 SECURE SERVER ACTION: Get onboarding status (for UI display)
export async function getOnboardingStatus() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isAuthenticated: false, status: null };
    }
    
    // Get session for access token  
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { isAuthenticated: false, status: null };
    }

    // Get onboarding status server-side (tokens hidden)
    const response = await fetch('https://api.dropleather.com/v1/seller/onboarding/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        status: data.data || null
      };
    } else {
      return { isAuthenticated: true, status: null };
    }
  } catch (error) {
    console.error('❌ SERVER ACTION: Failed to get onboarding status:', error);
    return { isAuthenticated: false, status: null };
  }
}

// 🔐 SECURE SERVER ACTION: Save Step 1 (Personal Information) - COPY FROM WORKING SUBSCRIPTION ACTION
export async function saveStep1(formData: FormData) {

  try {
    // 🔐 SECURITY: All authentication happens server-side - no tokens exposed to client
    const supabase = await createServerSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error('❌ SERVER ACTION: No valid session found for step 1');
      redirect('/login?error=session_expired');
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.error('❌ SERVER ACTION: No access token found for step 1');
      redirect('/login?error=session_expired');
    }

    console.log('✅ SERVER ACTION: Valid session found for user:', user.email);

    // Extract form data
    const full_name = formData.get('full_name') as string;
    const date_of_birth = formData.get('date_of_birth') as string;
    const email_subscription = formData.get('email_subscription') as string;

    console.log('📝 SERVER ACTION: Processing step 1 data for:', {
      full_name,
      date_of_birth,
      email_subscription
    });

    // Get CSRF token server-side (hidden from client) with cookies
    const csrfResponse = await fetch('https://api.dropleather.com/v1/csrf-token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies in request and response
    });

    if (!csrfResponse.ok) {
      console.error('❌ SERVER ACTION: Failed to get CSRF token for step 1');
      throw new Error('Security token unavailable');
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken || csrfData.token;

    if (!csrfToken) {
      throw new Error('No CSRF token received from API');
    }

    // Get CSRF cookie from response for API calls
    let csrfCookie = null;
    const setCookieHeader = csrfResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      const csrfCookieMatch = setCookieHeader.match(/csrf-token=([^;]+)/);
      if (csrfCookieMatch) {
        csrfCookie = csrfCookieMatch[1];
      }
    }

    // 🔐 Create request headers with server-side tokens (completely hidden)
    const apiHeaders: { [key: string]: string } = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
      'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
      'Origin': 'https://app.dropleather.com'
    };

    // Add CSRF cookie to headers if we have it
    if (csrfCookie) {
      apiHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
    }

    // Submit step 1 data via secure server-side API call
    const response = await fetch('https://api.dropleather.com/v1/seller/onboarding/step1', {
      method: 'POST',
      headers: apiHeaders,
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        full_name,
        date_of_birth,
        email_subscription
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ SERVER ACTION: Step 1 completed successfully');
      return { success: true };
    } else {
      console.error('❌ SERVER ACTION: Step 1 submission failed:', data);
      throw new Error(data.message || 'Step 1 submission failed');
    }

  } catch (error) {
    console.error('❌ SERVER ACTION: Step 1 submission error:', error);
    throw error;
  }
}

// 🔐 SECURE SERVER ACTION: Save Step 2 (Brand Status)
export async function saveStep2(formData: FormData) {
  console.log('🔐 SERVER ACTION: Step 2 save started');
  
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      throw new Error('Authentication required');
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No access token found');
    }

    const brand_status = formData.get('brand_status') as string;

    // Get CSRF token server-side
    const csrfResponse = await fetch('https://api.dropleather.com/v1/csrf-token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!csrfResponse.ok) {
      throw new Error('Security token unavailable');
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken || csrfData.token;

    if (!csrfToken) {
      throw new Error('No CSRF token received from API');
    }

    // Get CSRF cookie from response for API calls
    let csrfCookie = null;
    const setCookieHeader = csrfResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      const csrfCookieMatch = setCookieHeader.match(/csrf-token=([^;]+)/);
      if (csrfCookieMatch) {
        csrfCookie = csrfCookieMatch[1];
      }
    }

    // 🔐 Create request headers with server-side tokens (completely hidden)
    const apiHeaders: { [key: string]: string } = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
      'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
      'Origin': 'https://app.dropleather.com'
    };

    // Add CSRF cookie to headers if we have it
    if (csrfCookie) {
      apiHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
    }

    // Submit step 2 data
    const response = await fetch('https://api.dropleather.com/v1/seller/onboarding/step2', {
      method: 'POST',
      headers: apiHeaders,
      credentials: 'include',
      body: JSON.stringify({
        brand_status
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save step 2');
    }

    console.log('✅ SERVER ACTION: Step 2 saved successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ SERVER ACTION: Step 2 error:', error);
    throw error;
  }
}

// 🔐 SECURE SERVER ACTION: Save Step 3 (Category)
export async function saveStep3(formData: FormData) {
  console.log('🔐 SERVER ACTION: Step 3 save started');
  
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      throw new Error('Authentication required');
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No access token found');
    }

    const seller_category = formData.get('seller_category') as string;

    // Get CSRF token server-side
    const csrfResponse = await fetch('https://api.dropleather.com/v1/csrf-token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!csrfResponse.ok) {
      throw new Error('Security token unavailable');
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken || csrfData.token;

    if (!csrfToken) {
      throw new Error('No CSRF token received from API');
    }

    // Get CSRF cookie from response for API calls
    let csrfCookie = null;
    const setCookieHeader = csrfResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      const csrfCookieMatch = setCookieHeader.match(/csrf-token=([^;]+)/);
      if (csrfCookieMatch) {
        csrfCookie = csrfCookieMatch[1];
      }
    }

    // 🔐 Create request headers with server-side tokens (completely hidden)
    const apiHeaders: { [key: string]: string } = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
      'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
      'Origin': 'https://app.dropleather.com'
    };

    // Add CSRF cookie to headers if we have it
    if (csrfCookie) {
      apiHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
    }

    // Submit step 3 data
    const response = await fetch('https://api.dropleather.com/v1/seller/onboarding/step3', {
      method: 'POST',
      headers: apiHeaders,
      credentials: 'include',
      body: JSON.stringify({
        seller_category
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save step 3');
    }

    console.log('✅ SERVER ACTION: Step 3 saved successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ SERVER ACTION: Step 3 error:', error);
    throw error;
  }
}