'use client'

import { useRef, useState } from 'react';
import { SiteHeader } from "@/components/site-header";
import { AccountDetailsForm, AccountDetailsFormRef } from '@/components/account/account-details-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AccountDetailsPage() {
  const formRef = useRef<AccountDetailsFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formRef.current) return;
    
    setIsLoading(true);
    try {
      await formRef.current.save();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader title="Account Details" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Page Description */}
          <div className="space-y-2">
            <p className="text-muted-foreground font-['Inter'] text-sm">
              Manage your personal and business information
            </p>
          </div>
          
          {/* Save Button Section */}
          <div className="bg-[#F9F9F9] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-['Inter'] text-sm text-gray-700">Happy with the changes? Just press save.</p>
            <Button 
              onClick={handleSave}
              disabled={isLoading || !formRef.current?.hasChanges}
              className="bg-blue-600 hover:bg-blue-700 font-['Inter'] text-sm font-medium"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
          
          <AccountDetailsForm ref={formRef} />
        </div>
      </div>
    </>
  );
}