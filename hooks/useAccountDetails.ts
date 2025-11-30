'use client'

import { useState, useEffect } from 'react';
import { AccountDetails, AccountDetailsUpdateRequest } from '@/types/account';
import { createClientSupabase } from '@/utils/supabase/client';

export const useAccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAccountDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = await createClientSupabase();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('🔄 [ACCOUNT DETAILS] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS] Fetching from Supabase');
      
      // Fetch user profile (email only - phone is in seller_profiles)
      const { data: userProfile, error: profileError } = await supabase
        .schema('api')
        .from('user_profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }

      // Fetch seller profile
      const { data: sellerProfile, error: sellerError } = await supabase
        .schema('api')
        .from('seller_profiles')
        .select('name, company_name, business_address, business_registration_number, business_country, country, state_province, city, zip_code, phone_number')
        .eq('id', user.id)
        .single();

      if (sellerError) {
        throw new Error(`Failed to fetch seller profile: ${sellerError.message}`);
      }

      // Transform data to match AccountDetails interface
      const accountData: AccountDetails = {
        personal: {
          name: sellerProfile.name || '',
          email: userProfile.email || '',
          phone: sellerProfile.phone_number || ''
        },
        business: {
          company_name: sellerProfile.company_name || '',
          registration_number: sellerProfile.business_registration_number || '',
          business_address: (typeof sellerProfile.business_address === 'object' && sellerProfile.business_address?.street) 
            ? sellerProfile.business_address.street 
            : '',
          state_province: sellerProfile.state_province || '',
          city: sellerProfile.city || '',
          zip_code: sellerProfile.zip_code || '',
          country: sellerProfile.business_country || sellerProfile.country || 'US'
        },
        updated_at: new Date().toISOString()
      };

      setAccountDetails(accountData);
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Handle auth errors by redirecting to login
      if (err instanceof Error && (err.message.includes('Authentication') || err.message.includes('JWT'))) {
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' + encodeURIComponent(window.location.href);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountDetails = async (updateData: AccountDetailsUpdateRequest) => {
    try {
      setIsUpdating(true);
      setError(null);

      const supabase = await createClientSupabase();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('🔄 [ACCOUNT DETAILS UPDATE] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS UPDATE] Updating in Supabase');

      // All personal info (name and phone) goes to seller_profiles
      // No need to update user_profiles table

      // Update seller profile if personal name or business info changed
      const sellerUpdates: any = {};
      
      // Handle personal data (name and phone)
      if (updateData.personal?.name !== undefined) {
        sellerUpdates.name = updateData.personal.name;
      }
      if (updateData.personal?.phone !== undefined) {
        sellerUpdates.phone_number = updateData.personal.phone;
      }
      
      // Handle business data
      if (updateData.business) {
        if (updateData.business.company_name !== undefined) sellerUpdates.company_name = updateData.business.company_name;
        if (updateData.business.registration_number !== undefined) sellerUpdates.business_registration_number = updateData.business.registration_number;
        if (updateData.business.business_address !== undefined) {
          sellerUpdates.business_address = { street: updateData.business.business_address };
        }
        if (updateData.business.state_province !== undefined) sellerUpdates.state_province = updateData.business.state_province;
        if (updateData.business.city !== undefined) sellerUpdates.city = updateData.business.city;
        if (updateData.business.zip_code !== undefined) sellerUpdates.zip_code = updateData.business.zip_code;
        if (updateData.business.country !== undefined) {
          sellerUpdates.business_country = updateData.business.country;
          sellerUpdates.country = updateData.business.country; // Keep both for compatibility
        }
      }
      
      if (Object.keys(sellerUpdates).length > 0) {
        sellerUpdates.updated_at = new Date().toISOString();
        
        const { error: sellerError } = await supabase
          .schema('api')
          .from('seller_profiles')
          .update(sellerUpdates)
          .eq('id', user.id);

        if (sellerError) {
          throw new Error(`Failed to update seller profile: ${sellerError.message}`);
        }
      }

      // Refresh account details after successful update
      await fetchAccountDetails();
      
      return { success: true, message: 'Account updated successfully' };
    } catch (err) {
      console.error('Error updating account details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Handle auth errors
      if (err instanceof Error && (err.message.includes('Authentication') || err.message.includes('JWT'))) {
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' + encodeURIComponent(window.location.href);
      }
      
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