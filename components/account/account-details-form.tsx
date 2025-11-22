'use client'

import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useAccountDetails } from '@/hooks/useAccountDetails';
import { PersonalInfoSection } from './personal-info-section';
import { BusinessInfoSection } from './business-info-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { AccountDetailsUpdateRequest } from '@/types/account';

export interface AccountDetailsFormRef {
  save: () => Promise<void>;
  isUpdating: boolean;
}

interface AccountDetailsFormProps {
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
}

export const AccountDetailsForm = forwardRef<AccountDetailsFormRef, AccountDetailsFormProps>(({ hasChanges, setHasChanges }, ref) => {
  const { accountDetails, isLoading, error, isUpdating, updateAccountDetails } = useAccountDetails();
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [businessData, setBusinessData] = useState({
    company_name: '',
    registration_number: '',
    business_address: '',
    state_province: '',
    city: '',
    zip_code: '',
    country: 'US'
  });

  // Update local state when account details are loaded
  React.useEffect(() => {
    if (accountDetails) {
      setPersonalData({
        name: accountDetails.personal.name || '',
        email: accountDetails.personal.email || '',
        phone: accountDetails.personal.phone || ''
      });
      setBusinessData({
        company_name: accountDetails.business.company_name || '',
        registration_number: accountDetails.business.registration_number || '',
        business_address: accountDetails.business.business_address || '',
        state_province: accountDetails.business.state_province || '',
        city: accountDetails.business.city || '',
        zip_code: accountDetails.business.zip_code || '',
        country: accountDetails.business.country || 'US'
      });
    }
  }, [accountDetails]);

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleBusinessChange = (field: string, value: string) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = useCallback(async () => {
    if (!accountDetails) return;

    const updateRequest: AccountDetailsUpdateRequest = {};

    // Check for personal info changes
    if (personalData.name !== (accountDetails.personal.name || '') ||
        personalData.phone !== (accountDetails.personal.phone || '')) {
      updateRequest.personal = {};
      if (personalData.name !== (accountDetails.personal.name || '')) {
        updateRequest.personal.name = personalData.name;
      }
      if (personalData.phone !== (accountDetails.personal.phone || '')) {
        updateRequest.personal.phone = personalData.phone || null;
      }
    }

    // Check for business info changes
    if (businessData.company_name !== (accountDetails.business.company_name || '') ||
        businessData.registration_number !== (accountDetails.business.registration_number || '') ||
        businessData.business_address !== (accountDetails.business.business_address || '') ||
        businessData.state_province !== (accountDetails.business.state_province || '') ||
        businessData.city !== (accountDetails.business.city || '') ||
        businessData.zip_code !== (accountDetails.business.zip_code || '') ||
        businessData.country !== (accountDetails.business.country || 'US')) {
      updateRequest.business = {};
      if (businessData.company_name !== (accountDetails.business.company_name || '')) {
        updateRequest.business.company_name = businessData.company_name || null;
      }
      if (businessData.registration_number !== (accountDetails.business.registration_number || '')) {
        updateRequest.business.registration_number = businessData.registration_number || null;
      }
      if (businessData.business_address !== (accountDetails.business.business_address || '')) {
        updateRequest.business.business_address = businessData.business_address || null;
      }
      if (businessData.state_province !== (accountDetails.business.state_province || '')) {
        updateRequest.business.state_province = businessData.state_province || null;
      }
      if (businessData.city !== (accountDetails.business.city || '')) {
        updateRequest.business.city = businessData.city || null;
      }
      if (businessData.zip_code !== (accountDetails.business.zip_code || '')) {
        updateRequest.business.zip_code = businessData.zip_code || null;
      }
      if (businessData.country !== (accountDetails.business.country || 'US')) {
        updateRequest.business.country = businessData.country;
      }
    }

    const result = await updateAccountDetails(updateRequest);
    if (result.success) {
      setHasChanges(false);
    }
  }, [accountDetails, personalData, businessData, updateAccountDetails]);

  // Expose save function and state to parent component
  useImperativeHandle(ref, () => ({
    save: handleSave,
    isUpdating
  }), [handleSave, isUpdating]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading account details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PersonalInfoSection 
        data={personalData}
        onChange={handlePersonalChange}
      />
      
      <div className="border-t pt-6">
        <BusinessInfoSection 
          data={businessData}
          onChange={handleBusinessChange}
        />
      </div>

    </div>
  );
});

AccountDetailsForm.displayName = 'AccountDetailsForm';