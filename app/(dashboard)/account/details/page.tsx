'use client'

import { useRef, useState } from 'react';
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
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex flex-col items-start w-full">
            <h1 className="text-2xl font-bold font-['Sora'] text-left">Account Details</h1>
            <p className="text-muted-foreground font-['Inter'] text-left mt-1">Manage your personal and business information</p>
          </div>
        </header>
        
        {/* Save Button Section */}
        <div className="px-4 sm:px-6">
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
        </div>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1 md:gap-8 md:p-6">
          <AccountDetailsForm ref={formRef} />
        </main>
      </div>
    </div>
  );
}