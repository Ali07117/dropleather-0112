'use client'

import React from 'react'
import { SubscriptionContext, createSubscriptionValue, SubscriptionPlan } from '@/hooks/useSubscription'

interface SubscriptionProviderProps {
  children: React.ReactNode
  userPlan: string
}

export function SubscriptionProvider({ children, userPlan }: SubscriptionProviderProps) {
  const value = createSubscriptionValue(userPlan)

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}