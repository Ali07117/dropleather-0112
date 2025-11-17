import { createContext, useContext } from 'react'

export type SubscriptionPlan = 'free' | 'professional' | 'enterprise'

interface SubscriptionContextType {
  plan: SubscriptionPlan
  isLoading: boolean
  hasFeature: (feature: string) => boolean
  canAccess: (feature: string) => boolean
  isFreePlan: boolean
  isPaidPlan: boolean
}

// Feature access mapping - Free users get NONE of these features
const FEATURE_ACCESS: Record<string, SubscriptionPlan[]> = {
  'branding': ['professional', 'enterprise'],
  'brand-lab-ai': ['professional', 'enterprise'],
  'virtual-model': ['professional', 'enterprise'],
  'private-products': ['professional', 'enterprise'],
  'integration': ['professional', 'enterprise']
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export const createSubscriptionValue = (userPlan: string): SubscriptionContextType => {
  const plan = (userPlan?.toLowerCase() || 'free') as SubscriptionPlan
  const isLoading = false

  const hasFeature = (feature: string): boolean => {
    const allowedPlans = FEATURE_ACCESS[feature]
    return allowedPlans ? allowedPlans.includes(plan) : true
  }

  const canAccess = (feature: string): boolean => {
    return hasFeature(feature)
  }

  const isFreePlan = plan === 'free'
  const isPaidPlan = plan === 'professional' || plan === 'enterprise'

  return {
    plan,
    isLoading,
    hasFeature,
    canAccess,
    isFreePlan,
    isPaidPlan
  }
}

export { SubscriptionContext, FEATURE_ACCESS }