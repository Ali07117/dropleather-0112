'use client'

import { useState, useEffect } from 'react';
import { AccountDetails, AccountDetailsUpdateRequest, AccountDetailsResponse } from '@/types/account';

export const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAccountDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://api.dropleather.com/v1/seller/account/details', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

      const response = await fetch('https://api.dropleather.com/v1/seller/account/details', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

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