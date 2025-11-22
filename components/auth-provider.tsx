'use client';

import { useEffect } from 'react';
import { createClientSupabase } from '@/utils/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Supabase client with auth state monitoring
    createClientSupabase().then(() => {
      console.log('✅ [AUTH PROVIDER] Supabase client initialized with session monitoring');
    }).catch((error) => {
      console.error('❌ [AUTH PROVIDER] Failed to initialize Supabase client:', error);
      // On initialization error, redirect to auth subdomain
      window.location.href = 'https://auth.dropleather.com/login';
    });
  }, []);

  return <>{children}</>;
}