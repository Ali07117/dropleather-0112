"use client";

import React, { useState } from 'react';
import { selectPlan } from '@/app/actions/subscription';
import SubscriptionPricingFeature from './SubscriptionPricingFeature';
import { SubscriptionButton } from '@/components/ui/subscription-button';
import { SubscriptionCard, SubscriptionCardContent, SubscriptionCardDescription, SubscriptionCardHeader, SubscriptionCardTitle } from '@/components/ui/subscription-card';
import { SubscriptionBadge } from '@/components/ui/subscription-badge';
import { PricingPlan } from '@/types';

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for testing the market and getting started with minimal investment.',
    price: { monthly: 0, yearly: 0 },
    features: [
      { name: 'Premium Leather Products', included: true },
      { name: 'Your Logo on Every Product', included: false, details: 'Professional brand placement on all items' },
      { name: 'Personalized Packaging', included: false, details: 'Branded boxes, tissue paper, and presentation materials' },
      { name: 'Personalized Dust Bag', included: false, details: 'Elegant dust bags with your brand logo' },
      { name: 'Personalized Hang Tags', included: false, details: 'Custom hang tags with your brand information' },
      { name: 'Create Your Own Products', included: false },
      { name: 'Create Your Own Packaging', included: false },
      { name: 'Personalized Ribbon', included: false, details: 'Custom ribbon with your brand colors and logo' },
      { name: 'Personalized Wrapping Paper', included: false, details: 'Custom wrapping paper with your brand design' },
      { name: 'AI Fashion Model', included: false, details: 'AI-powered model photos for product listings' },
      { name: '360° Branding Views', included: false, details: 'Interactive 360-degree product photography' },
      { name: '24/7 Support', included: true }
    ]
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    description: 'The perfect balance for growing brands that want access to premium features.',
    price: { monthly: 24, yearly: 299 },
    originalPrice: { monthly: 49, yearly: 588 },
    features: [
      { name: 'Premium Leather Products', included: true },
      { name: 'Your Logo on Every Product', included: true, details: 'Professional brand placement on all items' },
      { name: 'Personalized Packaging', included: true, details: 'Branded boxes, tissue paper, and presentation materials' },
      { name: 'Personalized Dust Bag', included: true, details: 'Elegant dust bags with your brand logo' },
      { name: 'Personalized Hang Tags', included: true, details: 'Custom hang tags with your brand information' },
      { name: 'Create Your Own Products', included: false },
      { name: 'Create Your Own Packaging', included: false },
      { name: 'Personalized Ribbon', included: false, details: 'Custom ribbon with your brand colors and logo' },
      { name: 'Personalized Wrapping Paper', included: false, details: 'Custom wrapping paper with your brand design' },
      { name: 'AI Fashion Model', included: true, details: 'AI-powered model photos for product listings' },
      { name: '360° Branding Views', included: true, details: 'Interactive 360-degree product photography' },
      { name: '24/7 Support', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Complete white-label solution for established brands wanting full control.',
    price: { monthly: 49, yearly: 599 },
    originalPrice: { monthly: 99, yearly: 1188 },
    features: [
      { name: 'Premium Leather Products', included: true },
      { name: 'Your Logo on Every Product', included: true, details: 'Professional brand placement on all items' },
      { name: 'Personalized Packaging', included: true, details: 'Branded boxes, tissue paper, and presentation materials' },
      { name: 'Personalized Dust Bag', included: true, details: 'Elegant dust bags with your brand logo' },
      { name: 'Personalized Hang Tags', included: true, details: 'Custom hang tags with your brand information' },
      { name: 'Create Your Own Products', included: true },
      { name: 'Create Your Own Packaging', included: true },
      { name: 'Personalized Ribbon', included: true, details: 'Custom ribbon with your brand colors and logo' },
      { name: 'Personalized Wrapping Paper', included: true, details: 'Custom wrapping paper with your brand design' },
      { name: 'AI Fashion Model', included: true, details: 'AI-powered model photos for product listings' },
      { name: '360° Branding Views', included: true, details: 'Interactive 360-degree product photography' },
      { name: '24/7 Support', included: true }
    ]
  }
];

interface SubscriptionPricingCardProps {
  billingPeriod?: 'monthly' | 'yearly';
  currency?: 'USD' | 'EUR';
  onPlanSelect?: (planId: string) => void;
}

const SubscriptionPricingCard: React.FC<SubscriptionPricingCardProps> = ({ billingPeriod = 'monthly', currency = 'USD', onPlanSelect }) => {
  // 🔐 SECURITY UPGRADE: All authentication moved to server actions
  // Zero token exposure, maximum security
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  // Handle plan selection
  const handleSelectPlan = async (planId: string) => {
    if (submittingPlan) return;
    
    setSubmittingPlan(planId);

    try {
      // Use parent component's debug handler if provided
      if (onPlanSelect) {
        await onPlanSelect(planId);
      } else {
        // Fallback to original server action approach
        const formData = new FormData();
        formData.append('planId', planId);
        formData.append('billingPeriod', billingPeriod);
        await selectPlan(formData);
      }

    } catch (error) {
      console.error('❌ Plan selection failed:', error);
    } finally {
      setSubmittingPlan(null);
    }
  };

  const renderFeaturesByCategory = (features: PricingPlan['features']) => {
    const categories = {
      'Products': ['Premium Leather Products', 'Create Your Own Products', 'Create Your Own Packaging'],
      'Customization': [
        'Your Logo on Every Product',
        'Personalized Packaging',
        'Personalized Dust Bag',
        'Personalized Hang Tags',
        'Personalized Ribbon',
        'Personalized Wrapping Paper',
      ],
      'Technology': ['AI Fashion Model', '360° Branding Views'],
      'Support': ['24/7 Support']
    };

    return Object.entries(categories).map(([category, categoryFeatures]) => (
      <div key={category}>
        <h4 className="font-medium text-[16px] leading-extra mb-3 lg:mb-4 mt-4 lg:mt-5 font-geist">
          {category}
        </h4>
        {categoryFeatures.map(featureName => {
          const feature = features.find(f => f.name === featureName);
          if (!feature) return null;
          
          return (
            <SubscriptionPricingFeature
              key={feature.name}
              text={feature.name}
              available={feature.included ? 'add' : 'remove'}
              option={feature.name}
              i={feature.details ? 'i' : undefined}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
        {PRICING_PLANS.map((plan) => (
          <SubscriptionCard key={plan.id} className="w-full relative border-gray-300 shadow-none bg-[#F2F2F2] flex flex-col h-full">
            <SubscriptionCardHeader className="pb-0 px-[5px] pt-[5px]">
              {/* White inner box for plan header content */}
              <div className="bg-white rounded-[11px] p-4 sm:p-5 lg:p-[25px]">
                <SubscriptionCardTitle className="font-geist font-medium text-[18px] leading-7 tracking-tight text-[rgb(10,10,10)]">
                  {plan.name}
                </SubscriptionCardTitle>
                
                <div className="h-1"></div>
                
                <div className="relative">
                  <div className="flex items-center min-h-[32px]">
                    {plan.id === 'free' ? (
                      // Free plan - no animation
                      <>
                        <span className="font-geist font-semibold text-[24px] leading-7">
                          {currency === 'USD' ? '$' : '€'}{plan.price[billingPeriod]}
                        </span>
                        <span className="font-geist font-normal text-[16px] leading-extra pl-1 pt-1 text-[#757575]">
                          /Lifetime
                        </span>
                      </>
                    ) : (
                      // Paid plans - with animation
                      <>
                        {plan.originalPrice && (
                          <div className="relative overflow-hidden mr-2 h-[28px] flex items-center">
                            <span
                              className="font-geist font-normal text-base lg:text-[18px] leading-5 text-[#757575] line-through"
                            >
                              {currency === 'USD' ? '$' : '€'}{plan.originalPrice[billingPeriod]}
                            </span>
                          </div>
                        )}
                        <div className="relative overflow-hidden h-[28px] flex items-center">
                          <span
                            className="font-geist font-semibold text-[24px] leading-7"
                          >
                            {currency === 'USD' ? '$' : '€'}{plan.price[billingPeriod]}
                          </span>
                        </div>
                        <div className="relative overflow-hidden pl-1 pt-1 h-[28px] flex items-center">
                          <span
                            className="font-geist font-normal text-[16px] leading-extra text-[#757575]"
                          >
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <div className="absolute top-0 right-0">
                      <SubscriptionBadge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 font-geist">
                        {billingPeriod === 'monthly' ? 'First month 50% off' : '50% off yearly'}
                      </SubscriptionBadge>
                    </div>
                  )}
                </div>
                
                <SubscriptionCardDescription className="font-geist font-medium text-[16px] leading-normal text-[#757575] mt-6">
                  {plan.description}
                </SubscriptionCardDescription>
              </div>
            </SubscriptionCardHeader>
            
            <SubscriptionCardContent className="pb-[5px] px-[5px] mt-auto">
              {/* 🔐 SECURE BUTTON: Uses server action, no token exposure */}
              <SubscriptionButton
                onClick={() => handleSelectPlan(plan.id)}
                disabled={submittingPlan === plan.id}
                className="w-full h-[60px] sm:h-[70px] text-white font-geist font-medium text-[16px] sm:text-[18px] relative overflow-hidden bg-black border-0 rounded-[16px] group flex items-center justify-between px-4 sm:px-6 mt-3 sm:mt-4 transition-all duration-300"
                variant="default"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Text and Icon grouped with slide-up animation */}
                <div className="relative z-10 overflow-hidden h-[24px] flex items-center justify-between w-full">
                  {/* First set (visible initially) */}
                  <div className="flex items-center justify-between w-full transform translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
                    <span>{submittingPlan === plan.id ? 'Processing...' : 'Get started'}</span>
                    <svg 
                      width="22"
                      height="22"
                      viewBox="0 0 256 256" 
                      focusable="false" 
                      className="!w-[22px] !h-[22px]"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </g>
                    </svg>
                  </div>
                  
                  {/* Second set (slides in from below) */}
                  <div className="flex items-center justify-between w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 absolute inset-0">
                    <span>{submittingPlan === plan.id ? 'Processing...' : 'Get started'}</span>
                    <svg 
                      width="22"
                      height="22"
                      viewBox="0 0 256 256" 
                      focusable="false" 
                      className="!w-[22px] !h-[22px]"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </SubscriptionButton>
              
              <div className="space-y-1 p-4 sm:p-5 lg:p-[25px]">
                {renderFeaturesByCategory(plan.features)}
              </div>
            </SubscriptionCardContent>
          </SubscriptionCard>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPricingCard;