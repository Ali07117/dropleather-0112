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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.warn('🔄 [ACCOUNT DETAILS] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS] Fetching from Supabase');
      
      // Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .schema('api')
        .from('user_profiles')
        .select('email, full_name, phone')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        throw new Error(`Failed to fetch user profile: ${userError.message}`);
      }

      // Fetch seller profile
      const { data: sellerProfile, error: sellerError } = await supabase
        .schema('api')
        .from('seller_profiles')
        .select('company_name, business_address, country, state_province, city, zip_code, phone_number')
        .eq('id', session.user.id)
        .single();

      if (sellerError) {
        throw new Error(`Failed to fetch seller profile: ${sellerError.message}`);
      }

      // Transform data to match AccountDetails interface
      const accountData: AccountDetails = {
        personal: {
          name: userProfile.full_name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || ''
        },
        business: {
          company_name: sellerProfile.company_name || '',
          registration_number: '', // Not in current schema
          business_address: (typeof sellerProfile.business_address === 'object' && sellerProfile.business_address?.street) 
            ? sellerProfile.business_address.street 
            : '',
          state_province: sellerProfile.state_province || '',
          city: sellerProfile.city || '',
          zip_code: sellerProfile.zip_code || '',
          country: sellerProfile.country || 'US'
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.warn('🔄 [ACCOUNT DETAILS UPDATE] No valid session, redirecting to auth');
        window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                               encodeURIComponent(window.location.href);
        throw new Error('Authentication required');
      }

      console.log('👤 [ACCOUNT DETAILS UPDATE] Updating in Supabase');

      // Update user profile if personal info changed
      if (updateData.personal) {
        const userUpdates: any = {};
        if (updateData.personal.name !== undefined) userUpdates.full_name = updateData.personal.name;
        if (updateData.personal.phone !== undefined) userUpdates.phone = updateData.personal.phone;
        
        if (Object.keys(userUpdates).length > 0) {
          userUpdates.updated_at = new Date().toISOString();
          
          const { error: userError } = await supabase
            .schema('api')
            .from('user_profiles')
            .update(userUpdates)
            .eq('id', session.user.id);

          if (userError) {
            throw new Error(`Failed to update user profile: ${userError.message}`);
          }
        }
      }

      // Update seller profile if business info changed
      if (updateData.business) {
        const businessUpdates: any = {};
        if (updateData.business.company_name !== undefined) businessUpdates.company_name = updateData.business.company_name;
        if (updateData.business.business_address !== undefined) {
          businessUpdates.business_address = { street: updateData.business.business_address };
        }
        if (updateData.business.state_province !== undefined) businessUpdates.state_province = updateData.business.state_province;
        if (updateData.business.city !== undefined) businessUpdates.city = updateData.business.city;
        if (updateData.business.zip_code !== undefined) businessUpdates.zip_code = updateData.business.zip_code;
        if (updateData.business.country !== undefined) businessUpdates.country = updateData.business.country;
        
        if (Object.keys(businessUpdates).length > 0) {
          businessUpdates.updated_at = new Date().toISOString();
          
          const { error: sellerError } = await supabase
            .schema('api')
            .from('seller_profiles')
            .update(businessUpdates)
            .eq('id', session.user.id);

          if (sellerError) {
            throw new Error(`Failed to update seller profile: ${sellerError.message}`);
          }
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