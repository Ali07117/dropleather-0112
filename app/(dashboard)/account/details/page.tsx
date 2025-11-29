'use client'

import { useRef, useState } from 'react';
import { SiteHeader } from "@/components/site-header";
import { AccountDetailsForm, AccountDetailsFormRef } from '@/components/account/account-details-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AccountDetailsPage() {
  const formRef = useRef<AccountDetailsFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    if (!formRef.current) return;
    
    setIsLoading(true);
    try {
      await formRef.current.save();
      setHasChanges(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader title="Account Details" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className="space-y-2 mt-12 mb-8">
              <h1 className="text-2xl font-bold font-geist">Account Details</h1>
              <p className="text-muted-foreground font-geist text-sm">
                Manage your personal and business information
              </p>
            </div>
            
            {/* Save Button Section */}
            <div className="bg-[#F9F9F9] border border-[#EAEAEA] rounded-lg px-4 h-[43px] flex flex-row items-center justify-between gap-4 mb-8">
              <p className="font-geist text-sm text-gray-700">Happy with the changes? Just press save.</p>
              <Button 
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="bg-transparent hover:bg-gray-50 border border-[#696969] border-opacity-60 text-gray-900 font-geist text-sm font-medium h-[28px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
            
            <AccountDetailsForm ref={formRef} hasChanges={hasChanges} setHasChanges={setHasChanges} />
          </div>
        </div>
      </div>
    </>
  );
}