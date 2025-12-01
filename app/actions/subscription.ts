'use server';

import { createServerSupabase } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


// 🔐 SECURE SERVER ACTION: Plan selection with zero token exposure
export async function selectPlan(formData: FormData) {
  const planId = formData.get('planId') as string;
  const billingPeriod = formData.get('billingPeriod') as string;
  
  let redirectPath: string | null = null;

  
  try {

    
    // 🔐 SECURITY: All authentication happens server-side - no tokens exposed to client
    
    
    const supabase = await createServerSupabase();
    
    // For server actions, we need the access token, so use getUser() 
    // which is safe in server components according to Supabase docs
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error('❌ SERVER ACTION: No valid session found');
      redirect('/login?error=session_expired');
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.error('❌ SERVER ACTION: No access token found');
      redirect('/login?error=session_expired');
    }

    console.log('✅ SERVER ACTION: Valid session found for user:', user.email);
    

    if (planId === 'free') {
      // 🔐 Handle Free Plan Selection (Server-Side Only)
      console.log('🆓 SERVER ACTION: Processing free plan selection');
      

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
        console.error('❌ SERVER ACTION: Failed to get CSRF token');
        // const errorText = await csrfResponse.text().catch(() => 'No error text');
        throw new Error('Security token unavailable');
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken || csrfData.token;
      
      // Extract CSRF cookie from response headers
      const setCookieHeaders = csrfResponse.headers.get('set-cookie') || '';
      const csrfCookie = setCookieHeaders.match(/csrf-token=([^;]+)/)?.[1] || null;
      
      // Build headers with CSRF cookie if available
      const apiHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
        'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
        'Origin': 'https://app.dropleather.com'
      };

      // Add CSRF cookie to headers if we have it
      if (csrfCookie) {
        apiHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
      }

      // Make API call with server-side tokens (completely hidden)
      const response = await fetch('https://api.dropleather.com/v1/seller/subscription/free', {
        method: 'POST',
        headers: apiHeaders,
        credentials: 'include' // Include cookies
      });


      const data = await response.json();

      if (response.ok && data.success) {
        redirectPath = '/onboarding';
      } else {
        console.error('❌ SERVER ACTION: Free plan selection failed:', data);
        throw new Error(data.message || 'Free plan selection failed');
      }

    } else {
      // 🔐 Handle Pro/Enterprise Plans (Server-Side Stripe Checkout)
      console.log('💳 SERVER ACTION: Processing paid plan selection:', planId);
      

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
        console.error('❌ SERVER ACTION: Failed to get CSRF token for Stripe');
        throw new Error('Security token unavailable');
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken || csrfData.token;
      
      // Extract CSRF cookie from response headers for Stripe
      const setCookieHeaders = csrfResponse.headers.get('set-cookie') || '';
      const csrfCookie = setCookieHeaders.match(/csrf-token=([^;]+)/)?.[1] || null;
      


      // Build headers with CSRF cookie for Stripe
      const stripeHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // 🔐 Server-only token
        'X-CSRF-Token': csrfToken, // 🔐 Server-only CSRF token
        'Origin': 'https://app.dropleather.com'
      };

      // Add CSRF cookie to headers if we have it
      if (csrfCookie) {
        stripeHeaders['Cookie'] = `csrf-token=${csrfCookie}`;
      }

      // Create Stripe checkout session server-side (tokens hidden)
      const response = await fetch('https://api.dropleather.com/v1/seller/subscription/stripe-checkout', {
        method: 'POST',
        headers: stripeHeaders,
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          plan: planId,
          period: billingPeriod
        })
      });

      const data = await response.json();

      console.log('🔍 SERVER ACTION: About to check response', {
        responseOk: response.ok,
        dataSuccess: data.success,
        hasCheckoutUrl: !!data.data?.checkout_url,
        checkoutUrl: data.data?.checkout_url
      });

      if (response.ok && data.success && data.data?.checkout_url) {
        redirectPath = data.data.checkout_url;
      } else {
        console.error('❌ SERVER ACTION: Stripe checkout creation failed:', data);
        // Check if this is actually a success message being treated as error
        const errorMsg = data.message || 'Payment setup failed';
        throw new Error(errorMsg);
      }
    }

  } catch (error) {
    
    // Redirect with error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    redirectPath = `/subscription-plan?error=${encodeURIComponent(errorMessage)}`;
  }
  
  // 🔧 REDIRECT OUTSIDE TRY/CATCH - This is required for Next.js App Router
  if (redirectPath) {
    redirect(redirectPath);
  }
}

// 🔐 SECURE SERVER ACTION: Get current user session info (for UI display)
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    return {
      isAuthenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email
      } : null
    };
  } catch (error) {
    console.error('❌ SERVER ACTION: Failed to get current user:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}