import React from 'react';
import { requireAuth } from '@/lib/requireAuth';
import OnboardingClient from './OnboardingClient';

const OnboardingPage = async () => {
  // Server-side authentication check - redirects before any content is sent
  const session = await requireAuth();

  return <OnboardingClient />;
};

export default OnboardingPage;