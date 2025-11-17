'use client'

import { useState, useEffect } from 'react';
import { AccountDetails, AccountDetailsUpdateRequest, AccountDetailsResponse } from '@/types/account';
import { getCurrentSession } from '@/utils/supabase/client';

export const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAccountDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current session with access token (same pattern as products showcase)
      const session = await getCurrentSession();

      if (!session?.access_token) {
        console.warn('🔄 [ACCOUNT DETAILS] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS] Making authenticated API request');

      const response = await fetch('https://api.dropleather.com/v1/seller/account/details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.warn('🔄 [ACCOUNT DETAILS] Unexpected 401, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch account details: ${response.status}`);
      }

      const data: AccountDetailsResponse = await response.json();
      
      if (data.success && data.data) {
        setAccountDetails(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch account details');
      }
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountDetails = async (updateData: AccountDetailsUpdateRequest) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Get current session with access token
      const session = await getCurrentSession();

      if (!session?.access_token) {
        console.warn('🔄 [ACCOUNT DETAILS UPDATE] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS UPDATE] Making authenticated API request');

      const response = await fetch('https://api.dropleather.com/v1/seller/account/details', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        console.warn('🔄 [ACCOUNT DETAILS UPDATE] Unexpected 401, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error(`Failed to update account details: ${response.status}`);
      }

      const data: AccountDetailsResponse = await response.json();
      
      if (data.success && data.data) {
        setAccountDetails(data.data);
        return { success: true, message: data.message || 'Account updated successfully' };
      } else {
        throw new Error(data.message || 'Failed to update account details');
      }
    } catch (err) {
      console.error('Error updating account details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  return {
    accountDetails,
    isLoading,
    error,
    isUpdating,
    updateAccountDetails,
    refetch: fetchAccountDetails
  };
};