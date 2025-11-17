'use client'

import { AccountDetailsForm } from '@/components/account/account-details-form';

export default function AccountDetailsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <h1 className="text-2xl font-semibold">Account Details</h1>
            <p className="text-muted-foreground">Manage your personal and business information</p>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1 md:gap-8 md:p-6">
          <AccountDetailsForm />
        </main>
      </div>
    </div>
  );
}