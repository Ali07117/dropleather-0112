import React from 'react';
import { requireAuth } from '@/lib/requireAuth';
import SubscriptionPlanClient from './SubscriptionPlanClient';
import '../subscription.css';

const SubscriptionPlanPage = async () => {
  // Server-side authentication check - redirects before any content is sent
  const session = await requireAuth();

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-16 min-h-screen py-8">
      <SubscriptionPlanClient />
    </div>
  );
};

export default SubscriptionPlanPage;