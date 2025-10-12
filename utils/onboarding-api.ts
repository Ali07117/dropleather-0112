/**
 * Onboarding API utilities
 * Handles communication with the backend onboarding endpoints
 */

import { ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.dropleather.com';

/**
 * Get authentication token from cookies
 */
function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('seller_session_token=')
  );
  
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    console.log('🔐 Found seller session token:', token ? 'present' : 'missing');
    return token;
  }
  
  console.log('🔐 No seller session token found in cookies');
  return null;
}

/**
 * Get CSRF token from cookies
 */
function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith('csrf-token=')
  );
  
  if (csrfCookie) {
    const token = csrfCookie.split('=')[1];
    console.log('🔐 Found CSRF token:', token ? 'present' : 'missing');
    return token;
  }
  
  console.log('🔐 No CSRF token found in cookies');
  return null;
}

/**
 * Make authenticated API request via the Next.js API route
 */
async function makeAuthenticatedRequest(
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<ApiResponse> {
  console.log(`🔐 Making ${method} request to ${endpoint}`);
  
  // Check for session cookies first
  const sessionCookie = getAuthToken();
  const existingCSRF = getCSRFToken();
  
  console.log('🔐 ONBOARDING_COOKIES_CHECK:', {
    hasSessionCookie: !!sessionCookie,
    hasCSRFCookie: !!existingCSRF
  });
  
  // First, get CSRF token if it's a POST request
  let csrfToken = null;
  if (method === 'POST') {
    try {
      console.log('🔐 Fetching CSRF token for POST request');
      
      const csrfResponse = await fetch(`${API_BASE}/v1/csrf-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('🔐 CSRF Response:', {
        status: csrfResponse.status,
        ok: csrfResponse.ok
      });

      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json();
        csrfToken = csrfData.csrfToken || csrfData.token;
        console.log('🔐 CSRF token fetched successfully');
        
      } else {
        console.error('🔐 CSRF fetch failed:', csrfResponse.status);
      }
    } catch (error) {
      console.error('🔐 Failed to fetch CSRF token:', error);
    }
  }

  // Get Supabase access token for authorization
  const getSupabaseAccessToken = async () => {
    // Use SSR-compatible client that can read chunked cookies
    const { createClientSupabase } = await import('@/utils/supabase/client');
    const supabase = await createClientSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // Get access token for authorization
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) {
    throw new Error('No authentication token available');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'Origin': 'https://app.dropleather.com'
  };

  // Add CSRF token for POST requests
  if (method === 'POST' && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }


  const response = await fetch(`${API_BASE}/v1/seller/onboarding${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });


  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    
    
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log('🔐 ONBOARDING_API_SUCCESS:', {
    success: responseData.success,
    hasData: !!responseData.data
  });

  return responseData;
}

/**
 * Onboarding API functions
 */
export const onboardingAPI = {
  /**
   * Get current onboarding status and progress
   */
  async getStatus(): Promise<ApiResponse<{
    progress: {
      step1_completed: boolean;
      step2_completed: boolean;
      step3_completed: boolean;
      onboarding_completed: boolean;
    };
    currentData: {
      full_name: string;
      date_of_birth: string;
      brand_status: string;
      seller_category: string;
    };
    subscription: {
      subscription_plan: string | null;
      subscription_active: boolean;
      subscription_period: string | null;
    };
  }>> {
    return makeAuthenticatedRequest('/status');
  },

  /**
   * Save Step 1: Personal Information
   */
  async saveStep1(data: {
    full_name: string;
    date_of_birth: string; // YYYY-MM-DD format
  }): Promise<ApiResponse> {
    return makeAuthenticatedRequest('/step1', 'POST', data);
  },

  /**
   * Save Step 2: Brand Status
   */
  async saveStep2(data: {
    brand_status: 'new' | 'established';
  }): Promise<ApiResponse> {
    return makeAuthenticatedRequest('/step2', 'POST', data);
  },

  /**
   * Save Step 3: Seller Category
   */
  async saveStep3(data: {
    seller_category: string;
  }): Promise<ApiResponse> {
    return makeAuthenticatedRequest('/step3', 'POST', data);
  },

  /**
   * Complete onboarding process
   */
  async complete(): Promise<ApiResponse> {
    return makeAuthenticatedRequest('/complete', 'POST');
  }
};

/**
 * Utility function to convert form date to API format
 */
export function formatDateForAPI(day: string, month: string, year: string): string {
  if (!day || !month || !year) {
    throw new Error('Invalid date');
  }

  // Convert month name to number
  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1) {
    throw new Error('Invalid month');
  }

  // Format as YYYY-MM-DD
  const formattedMonth = monthIndex.toString().padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Map frontend category names to backend values
 */
export function mapCategoryToAPI(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Influencer': 'influencer',
    'Streamer': 'streamer',
    'Artist / Designer': 'artist_designer',
    'Public Figure': 'public_figure',
    'Brand / Business': 'brand_business',
    'Musician': 'musician',
    'Sports Personality': 'sports_personality',
    'Retailer': 'retailer',
    'Other': 'other'
  };

  return categoryMap[category] || 'other';
}