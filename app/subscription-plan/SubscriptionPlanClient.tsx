'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SubscriptionPricingCard from '@/components/subscription/SubscriptionPricingCard';
import { SubscriptionButton } from '@/components/ui/subscription-button';
import { SubscriptionCard, SubscriptionCardContent, SubscriptionCardDescription, SubscriptionCardHeader, SubscriptionCardTitle } from '@/components/ui/subscription-card';
import { SubscriptionSwitch } from '@/components/ui/subscription-switch';
import { SubscriptionLabel } from '@/components/ui/subscription-label';
import { SubscriptionSelect, SubscriptionSelectContent, SubscriptionSelectItem, SubscriptionSelectTrigger, SubscriptionSelectValue } from '@/components/ui/subscription-select';
import { cn } from '@/lib/utils';

type BillingPeriod = 'monthly' | 'yearly';
type Currency = 'USD' | 'EUR';


const SubscriptionPlanClient: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<BillingPeriod>("monthly");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  


  const handlePlanToggle = (plan: BillingPeriod) => {
    setSelectedPlan(plan);
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
  };


  const handlePlanSelection = async (planId: string) => {
    try {
      if (!planId || !selectedPlan) {
        throw new Error('Missing required plan data');
      }

      const formData = new FormData();
      formData.append('planId', planId);
      formData.append('billingPeriod', selectedPlan);

      const { selectPlan } = await import('@/app/actions/subscription');
      await selectPlan(formData);

    } catch (error) {
      console.error('Plan selection error:', error);
    }
  };


  return (
    <>

      <div className="mt-4 sm:mt-6 lg:mt-8">
        <h1 className="font-geist font-semibold text-center text-[30px] sm:text-[55px] leading-tight tracking-[-0.05em]">
          <span className="text-black">Plans tailored to</span> <span className="text-[#757575]">every stage.</span>
        </h1>
        <p className="font-geist font-normal mt-2.5 text-center text-[16px] leading-normal text-gray-600">
          Whether you&apos;re testing the market or building a leather empire, <span className="hidden sm:inline"><br /></span>our flexible plans evolve with your business and branding needs.
        </p>
      </div>
      
      <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12">        
        {/* Custom Billing Period Switch */}
        <div className="relative inline-flex items-center bg-transparent border border-gray-300 rounded-lg p-1 w-48 h-12">
          {/* Background slider */}
          <div 
            className={cn(
              "absolute top-1/2 left-1 w-24 h-10 bg-[#EBEBEB] rounded-lg transition-transform duration-200 ease-in-out -translate-y-1/2",
              selectedPlan === 'yearly' ? "translate-x-[5.5rem]" : "translate-x-0"
            )}
          />
          
          {/* Monthly option */}
          <button
            onClick={() => handlePlanToggle('monthly')}
            className={cn(
              "relative z-10 w-24 h-10 flex items-center justify-center rounded-lg font-geist text-sm font-semibold transition-colors duration-200",
              selectedPlan === 'monthly' ? "text-black" : "text-gray-700"
            )}
          >
            Monthly
          </button>
          
          {/* Yearly option */}
          <button
            onClick={() => handlePlanToggle('yearly')}
            className={cn(
              "relative z-10 w-24 h-10 flex items-center justify-center rounded-lg font-geist text-sm font-semibold transition-colors duration-200",
              selectedPlan === 'yearly' ? "text-black" : "text-gray-700"
            )}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="mt-5">
        {/* Container that matches PricingCard layout */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Currency selector */}
            <div className="flex justify-end mb-4">
              <SubscriptionSelect value={selectedCurrency} onValueChange={(value: Currency) => handleCurrencySelect(value)}>
                <SubscriptionSelectTrigger className="w-full lg:w-[120px] h-12 bg-[#EBEBEB] border-[#EBEBEB] text-black p-2 [&>svg]:translate-y-2">
                  <div className="flex flex-col items-start w-full gap-2">
                    <div className="text-black font-inter text-[10px] leading-tight">CURRENCY</div>
                    <div className="text-black font-geist text-sm leading-tight font-bold">
                      {selectedCurrency === 'USD' ? '$ USD' : '€ EUR'}
                    </div>
                  </div>
                </SubscriptionSelectTrigger>
                <SubscriptionSelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SubscriptionSelectItem value="USD" className="font-geist bg-white hover:bg-gray-50">$ USD</SubscriptionSelectItem>
                  <SubscriptionSelectItem value="EUR" className="font-geist bg-white hover:bg-gray-50">€ EUR</SubscriptionSelectItem>
                </SubscriptionSelectContent>
              </SubscriptionSelect>
            </div>
          </div>
        </div>

        <SubscriptionPricingCard 
          billingPeriod={selectedPlan} 
          currency={selectedCurrency}
          onPlanSelect={handlePlanSelection}
        />
      </div>
      
      <div className="flex justify-center mt-6 sm:mt-7">
        <p className="font-normal text-[14px] leading-6 w-11/12 sm:w-4/5 text-center text-black font-geist">
          Each subscription covers one brand. If you want to launch additional brands, you&apos;ll need to upgrade your plan or subscribe separately.
        </p>
      </div>
      
      <div className="flex justify-center mt-0 mb-8 sm:mb-10">
        <p className="font-normal text-[14px] leading-6 w-11/12 sm:w-4/5 text-center text-black font-geist">
          Our{' '}
          <span className="text-[14px] font-bold leading-6 text-black underline font-geist">
            free plan includes products without branding,
          </span>
          {' '}while paid plans unlock full white-label customization.
        </p>
      </div>
      
    </>
  );
};

export default SubscriptionPlanClient;