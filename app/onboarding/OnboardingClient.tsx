"use client";

import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // Removed for subscription-plan style effects

// Client component for onboarding functionality
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OnboardingFormData, FormErrors } from "@/types";
import { validateName, validateDate } from "@/utils/validation";
import { OnboardingInput } from "@/components/ui/onboarding-input";
import { OnboardingButton } from "@/components/ui/onboarding-button";
import { OnboardingCheckbox } from "@/components/ui/onboarding-checkbox";
import OnboardingHearAboutCard from "@/components/onboarding/OnboardingHearAboutCard";
import { cn } from "@/lib/utils";
import { submitOnboarding, saveStep1, saveStep2, saveStep3 } from "@/app/actions/onboarding";
import { mapCategoryToAPI, onboardingAPI, formatDateForAPI } from "@/utils/onboarding-api";
import { createClientSupabase } from "@/utils/supabase/client";

const HEAR_ABOUT_OPTIONS = [
  { name: "Influencer", image: "instagram" },
  { name: "Streamer", image: "streaming" },
  { name: "Artist / Designer", image: "newsletter" },
  { name: "Public Figure", image: "news" },
  { name: "Brand / Business", image: "work" },
  { name: "Musician", image: "podcast" },
  { name: "Sports Personality", image: "sport" },
  { name: "Retailer", image: "retail" },
  { name: "Other", image: "other" },
];

const MONTHS = [
  "Month", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    dateOfBirth: { day: '', month: '', year: '' },
    brandStage: 'new',
    hearAbout: [],
    theme: 'light',
    agreeToMarketing: true
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [placeholderText, setPlaceholderText] = useState('William');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stepsSaved, setStepsSaved] = useState({
    step1: false,
    step2: false,
    step3: false
  });



  // Add subscription status tracking
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: 'checking' | 'free' | 'pro' | 'enterprise' | 'none';
    message: string;
    data?: unknown;
  }>({ status: 'checking', message: 'Checking subscription status...' });


  // Dynamic steps based on subscription: Free = 2 steps (theme + personal), Paid = 4 steps (all)
  const totalSteps = subscriptionStatus?.status === 'free' ? 2 : 4;
  
  // Debug subscription status
  console.log('🔍 ONBOARDING_DEBUG:', {
    subscriptionStatus: subscriptionStatus.status,
    totalSteps,
    currentStep
  });

  const navigateToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(totalSteps - 1, step)));
  };

  const nextStep = () => navigateToStep(currentStep + 1);
  const prevStep = () => navigateToStep(currentStep - 1);

  // Create professional click sound using Web Audio API
  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Create oscillator for the main click tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure the sound (similar to modern UI click sounds)
      oscillator.type = 'sine'; // Smooth sine wave
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Start at 1000Hz
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05); // Drop to 600Hz
      
      // Volume envelope (quick attack, smooth decay)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // Smooth decay
      
      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
    } catch (_error) {
      // Silently fail if Web Audio API is not supported
      console.log('Audio not supported');
    }
  };

  const handleContinueWithSound = () => {
    playClickSound();
    nextStep();
  };

  const handleBackWithSound = () => {
    playClickSound();
    prevStep();
  };

  const handleNextWithSound = async () => {
    playClickSound();
    
    // 🔐 SECURITY UPGRADE: Use server action for final step (onboarding submission)
    if (currentStep === totalSteps - 1) {
      if (!validateCurrentStep()) {
        return;
      }
      
      setIsLoading(true);
      
      // Create form data for secure server action
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('day', formData.dateOfBirth.day);
      submitFormData.append('month', formData.dateOfBirth.month);
      submitFormData.append('year', formData.dateOfBirth.year);
      submitFormData.append('category', mapCategoryToAPI(formData.hearAbout[0] || 'Other'));
      submitFormData.append('hearAbout', formData.hearAbout[0] || 'Other');
      submitFormData.append('theme', formData.theme);
      
      
      // Add email subscription preference
      submitFormData.append('emailSubscription', formData.agreeToMarketing ? 'YES' : 'NO');
      
      // Call secure server action - all authentication happens server-side
      try {
        await submitOnboarding(submitFormData);
      } catch (error) {
        // Only catch real errors, not NEXT_REDIRECT
        if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
          console.error('Onboarding error:', error);
          setErrors({ general: 'Onboarding submission failed. Please try again.' });
        }
        // If it's NEXT_REDIRECT, let it bubble up naturally
      }
      
      // This line will never be reached if redirect is successful
      setIsLoading(false);
    } else {
      // For non-final steps, use regular navigation
      handleStepNavigation();
    }
  };

  const handleThemeSelect = (theme: 'dark' | 'light') => {
    setFormData(prev => ({ ...prev, theme }));
  };

  // Authentication check - TEMPORARILY PUBLIC FOR TESTING
  useEffect(() => {
    const testSupabaseRpcValidation = async () => {
      try {
        // Use SSR-compatible client that can read chunked cookies
        const supabase = await createClientSupabase();
        const { data: user } = await supabase.auth.getClaims();
        
        // Authentication is required - middleware should handle redirects
        if (!user) {
          // Server-side requireAuth() already handles redirects, no need for client-side redirect
          console.log('No session found, but server-side auth should handle this');
          return;
        }

        // If we have a session, get onboarding status including subscription info
        const statusData = await onboardingAPI.getStatus();
        const subscriptionPlan = statusData.data?.subscription?.subscription_plan;

          // Check subscription status
          if (subscriptionPlan === 'free') {
            setSubscriptionStatus({
              status: 'free',
              message: 'Free subscription plan detected.',
              data: { 
                subscription_plan: subscriptionPlan,
                subscription_active: statusData.data?.subscription?.subscription_active
              }
            });
          } else if (subscriptionPlan === 'professional') {
            setSubscriptionStatus({
              status: 'pro',
              message: 'Professional subscription plan detected.',
              data: { subscription_plan: subscriptionPlan }
            });
          } else if (subscriptionPlan === 'enterprise') {
            setSubscriptionStatus({
              status: 'enterprise',
              message: 'Enterprise subscription plan detected.',
              data: { subscription_plan: subscriptionPlan }
            });
          } else {
            setSubscriptionStatus({
              status: 'none',
              message: 'No subscription plan selected.',
              data: { subscription_plan: subscriptionPlan || null }
            });
          }
      } catch (error) {
        console.error('Authentication validation failed:', error);
      }
    };

    testSupabaseRpcValidation();
  }, []);

  // Simple typing animation for placeholder
  useEffect(() => {
    if (currentStep === 1 && !formData.name && !isInputFocused) {
      const timeouts: NodeJS.Timeout[] = [];
      
      const animateText = () => {
        const sequence = [
          // Type William
          { text: 'W', delay: 500 },
          { text: 'Wi', delay: 650 },
          { text: 'Wil', delay: 800 },
          { text: 'Will', delay: 950 },
          { text: 'Willi', delay: 1100 },
          { text: 'Willia', delay: 1250 },
          { text: 'William', delay: 1400 },
          
          // Wait 2.5s then delete (1.5s deletion)
          { text: 'Willia', delay: 3900 },
          { text: 'Willi', delay: 4150 },
          { text: 'Will', delay: 4400 },
          { text: 'Wil', delay: 4650 },
          { text: 'Wi', delay: 4900 },
          { text: 'W', delay: 5150 },
          { text: '', delay: 5400 },
          
          // Wait 2.5s then type Amelia
          { text: 'A', delay: 7900 },
          { text: 'Am', delay: 8050 },
          { text: 'Ame', delay: 8200 },
          { text: 'Amel', delay: 8350 },
          { text: 'Ameli', delay: 8500 },
          { text: 'Amelia', delay: 8650 },
          
          // Wait 2.5s then delete (1.5s deletion)
          { text: 'Ameli', delay: 11150 },
          { text: 'Amel', delay: 11400 },
          { text: 'Ame', delay: 11650 },
          { text: 'Am', delay: 11900 },
          { text: 'A', delay: 12150 },
          { text: '', delay: 12400 },
          
          // Wait 2.5s then show William
          { text: 'William', delay: 14900 },
        ];
        
        sequence.forEach(({ text, delay }) => {
          const timeout = setTimeout(() => {
            setPlaceholderText(text || 'William');
          }, delay);
          timeouts.push(timeout);
        });
        
        // Restart after 10 seconds
        const restartTimeout = setTimeout(animateText, 24900);
        timeouts.push(restartTimeout);
      };
      
      animateText();
      
      // Cleanup
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        setPlaceholderText('William');
      };
    }
  }, [currentStep, formData.name, isInputFocused]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, spaces, hyphens, and apostrophes
    const filteredValue = value.replace(/[^a-zA-Z\s'-]/g, '');
    setFormData(prev => ({ ...prev, name: filteredValue }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleDateChange = (field: 'day' | 'month' | 'year') => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value = e.target.value;
    
    if (field === 'day') {
      // Only allow numbers for day field
      value = value.replace(/[^0-9]/g, '');
      // Limit to 2 digits
      if (value.length > 2) value = value.slice(0, 2);
    } else if (field === 'year') {
      // Only allow numbers for year field
      value = value.replace(/[^0-9]/g, '');
      // Limit to 4 digits
      if (value.length > 4) value = value.slice(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [field]: value }
    }));
    if (errors.dateOfBirth) {
      setErrors(prev => ({ ...prev, dateOfBirth: undefined }));
    }
  };

  const handleDayBlur = () => {
    const day = formData.dateOfBirth.day;
    if (day && day.length === 1) {
      const dayNum = parseInt(day);
      if (dayNum >= 1 && dayNum <= 9) {
        // Auto-format single digit to 01, 02, etc. only for valid range 1-9
        const formattedDay = day.padStart(2, '0');
        setFormData(prev => ({
          ...prev,
          dateOfBirth: { ...prev.dateOfBirth, day: formattedDay }
        }));
      }
    }
  };

  const handleBrandStageChange = (stage: 'new' | 'established') => {
    setFormData(prev => ({ ...prev, brandStage: stage }));
  };

  const handleHearAboutToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      hearAbout: prev.hearAbout.includes(option) ? [] : [option]
    }));
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        const nameError = validateName(formData.name);
        const dateError = validateDate(
          formData.dateOfBirth.day,
          formData.dateOfBirth.month,
          formData.dateOfBirth.year
        );
        if (nameError) stepErrors.name = nameError;
        if (dateError) stepErrors.dateOfBirth = dateError;
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Load existing onboarding data on component mount
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        
        const response = await onboardingAPI.getStatus();
        
        
        if (response.success && response.data) {
          const { progress, currentData } = response.data;
          
          // Update form data with existing information
          if (currentData.full_name) {
            setFormData(prev => ({ ...prev, name: currentData.full_name }));
          }
          
          if (currentData.date_of_birth) {
            const date = new Date(currentData.date_of_birth);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear().toString();
            
            setFormData(prev => ({
              ...prev,
              dateOfBirth: { day, month, year }
            }));
          }
          
          if (currentData.brand_status && currentData.brand_status !== 'pending') {
            setFormData(prev => ({ ...prev, brandStage: currentData.brand_status as 'new' | 'established' }));
          }
          
          if (currentData.seller_category && currentData.seller_category !== 'pending') {
            // Map API category back to frontend display name
            const categoryDisplayMap: { [key: string]: string } = {
              'influencer': 'Influencer',
              'streamer': 'Streamer',
              'content_creator': 'Artist / Designer',
              'business': 'Brand / Business',
              'other': 'Other'
            };
            const displayCategory = categoryDisplayMap[currentData.seller_category] || 'Other';
            setFormData(prev => ({ ...prev, hearAbout: [displayCategory] }));
          }
          
          // Update saved steps status
          setStepsSaved({
            step1: progress.step1_completed,
            step2: progress.step2_completed,
            step3: progress.step3_completed
          });
          
          // If already completed, redirect to dashboard
          if (progress.onboarding_completed) {
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load onboarding status:', error);
      }
    };

    loadOnboardingStatus();
  }, [router]);

  // Save data when progressing from specific steps using secure server actions
  const saveStepData = async (step: number): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      switch (step) {
        case 1: // Save personal information
          if (!stepsSaved.step1) {
            
            const dateString = formatDateForAPI(
              formData.dateOfBirth.day,
              formData.dateOfBirth.month,
              formData.dateOfBirth.year
            );
            
            
            // Create FormData for server action
            const step1FormData = new FormData();
            step1FormData.append('full_name', formData.name);
            step1FormData.append('date_of_birth', dateString);
            step1FormData.append('email_subscription', formData.agreeToMarketing ? 'YES' : 'NO');
            
            
            // Use secure server action instead of client API call
            const response = await saveStep1(step1FormData);
            
            
            if (response.success) {
              setStepsSaved(prev => ({ ...prev, step1: true }));
            } else {
              throw new Error('Failed to save step 1');
            }
          } else {
          }
          break;
          
        case 2: // Save brand status
          if (!stepsSaved.step2) {
            // Create FormData for server action
            const step2FormData = new FormData();
            step2FormData.append('brand_status', formData.brandStage);
            
            // Use secure server action instead of client API call
            const response = await saveStep2(step2FormData);
            
            if (response.success) {
              setStepsSaved(prev => ({ ...prev, step2: true }));
            } else {
              throw new Error('Failed to save step 2');
            }
          }
          break;
          
        case 3: // Save category and complete onboarding
          // Save step 3 data if not already saved
          if (!stepsSaved.step3) {
            const category = mapCategoryToAPI(formData.hearAbout[0] || 'Other');
            
            // Create FormData for server action
            const step3FormData = new FormData();
            step3FormData.append('seller_category', category);
            
            // Use secure server action instead of client API call
            const response = await saveStep3(step3FormData);
            
            if (response.success) {
              setStepsSaved(prev => ({ ...prev, step3: true }));
            } else {
              throw new Error('Failed to save step 3');
            }
          }
          
          // Always complete the onboarding process when on final step
          const completeResponse = await onboardingAPI.complete();
          
          if (completeResponse.success) {
            router.push('/dashboard?onboarding=completed');
            return true;
          } else {
            throw new Error(completeResponse.error || 'Failed to complete onboarding');
          }
          break;
      }
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save progress';
      
      console.error(`Failed to save step ${step}:`, error);
      setErrors({ general: errorMsg });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepNavigation = async () => {
    const validationResult = validateCurrentStep();

    if (!validationResult) {
      return;
    }

    // For free users, complete onboarding after step 1 (personal info)
    if (subscriptionStatus?.status === 'free' && currentStep === 1) {
      const saved = await saveStepData(currentStep);

      if (saved) {
        // Complete onboarding for free users
        setIsLoading(true);

        try {
          const completeResponse = await onboardingAPI.complete();
          
          if (completeResponse.success) {
            router.push('/dashboard?onboarding=completed&plan=free');
            return;
          } else {
            console.error('Failed to complete onboarding:', completeResponse);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error completing free user onboarding:', error);
          setIsLoading(false);
        }
      }
      return;
    }

    // Save data when leaving certain steps (for paid users)
    if (currentStep === 1 || currentStep === 2 || currentStep === 3) {
      const saved = await saveStepData(currentStep);
      if (!saved && currentStep !== 3) {
        // Don't proceed if save failed (except for final step which redirects)
        return;
      }
    }

    // Only proceed to next step if not the final step
    if (currentStep < totalSteps - 1) {
      nextStep();
    }
  };

  return (
    <div className={cn("onboarding-page relative min-h-screen transition-colors duration-300", 
      formData.theme === 'dark' ? 'bg-black' : 'bg-white'
    )}>


      {/* Pagination Dots */}
      <div className="fixed bottom-6 sm:bottom-15 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 z-10">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 transition-all duration-300 rounded",
              currentStep === i
                ? formData.theme === 'dark'
                  ? "w-9 bg-white rounded-full"
                  : "w-9 bg-black rounded-full"
                : formData.theme === 'dark' 
                  ? "w-2 bg-white rounded-full"
                  : "w-2 bg-black/60 rounded-full"
            )}
          />
        ))}
      </div>

      <div className={cn("min-h-screen w-screen px-2.5", 
        currentStep === 1 || currentStep === 2 || currentStep === 3 
          ? "flex flex-col pt-8 sm:flex sm:items-center sm:justify-center sm:pt-0" 
          : "flex items-center justify-center"
      )}>
        {/* Step 1: Choose Style */}
        <div className={cn("w-full h-full", currentStep === 0 ? "flex flex-col items-center justify-center px-4" : "hidden")}>
          <div className="flex flex-col items-center">
            <h1 className={cn("font-geist font-semibold text-[56px] leading-none mb-8 text-center transition-colors duration-300",
              formData.theme === 'dark' ? 'text-white' : 'text-black'
            )} style={{ letterSpacing: '-0.05em' }}>
              Choose <span className="text-[#757575]">your style</span>
            </h1>
            
            <div className="flex flex-row gap-3 sm:gap-4 mb-8 justify-center">
              <button
                type="button"
                onClick={() => handleThemeSelect('dark')}
                className={cn(
                  "w-[145px] sm:w-64 h-[111px] sm:h-41 rounded-2xl cursor-pointer overflow-hidden border-2 transition-all duration-300 bg-white",
                  formData.theme === 'dark' ? "border-primary" : "border-gray-border hover:border-primary"
                )}
              >
                <div
                  className="h-3/5 w-full bg-cover"
                  style={{ backgroundImage: "url('/images/blackbg.svg')" }}
                />
                <div className="h-2/5 w-full px-3 sm:px-4 border-t py-2 sm:py-2.5">
                  <p className="font-geist text-primary text-xl sm:text-2xl font-medium">Dark</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleThemeSelect('light')}
                className={cn(
                  "w-[145px] sm:w-64 h-[111px] sm:h-41 rounded-2xl cursor-pointer overflow-hidden border-2 transition-all duration-300 bg-white",
                  formData.theme === 'light' ? "border-primary" : "border-gray-border hover:border-primary"
                )}
              >
                <div
                  className="h-3/5 w-full bg-cover"
                  style={{ backgroundImage: "url('/images/whitebg.svg')" }}
                />
                <div className="h-2/5 w-full px-3 sm:px-4 border-t py-2 sm:py-2.5">
                  <p className="font-geist text-primary text-xl sm:text-2xl font-medium">Light</p>
                </div>
              </button>
            </div>

            <div className="w-full flex justify-center">
              <OnboardingButton
                onClick={async () => {
                  playClickSound();
                  await handleStepNavigation();
                }}
                disabled={isLoading}
                className={cn("h-[36px] text-[14px] transition-all duration-300 relative overflow-hidden group",
                  "bg-black text-white dark:bg-white dark:text-black font-geist font-medium rounded-[10px]",
                  isLoading ? "opacity-50 cursor-not-allowed" : "",
                  formData.theme === 'dark' ? "!bg-white !text-black" : ""
                )}
              >
                {/* Simple overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{isLoading ? 'Processing...' : 'Continue'}</span>
              </OnboardingButton>
            </div>
          </div>
        </div>

        {/* Step 2: Personal Information */}
        <div className={cn("w-full max-w-lg mx-auto px-4", currentStep === 1 ? "block" : "hidden")}>
          <h1 className={cn("font-geist font-bold text-[30px] text-left sm:text-center leading-full mb-7 transition-colors duration-300",
            formData.theme === 'dark' ? 'text-white' : 'text-primary'
          )}>
            Let&apos;s get to know you better
          </h1>

          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-start gap-1 mt-1 mb-4">
              <img 
                className="w-4 h-4 mt-0.5 flex-shrink-0 filter-red" 
                src="/images/helper.svg" 
                alt="Error icon"
                style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(97%) contrast(107%)' }}
              />
              <p className="text-sm text-error font-inter" role="alert">
                {errors.general}
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className={cn("text-sm font-medium block mb-1 transition-colors duration-300 font-geist",
                formData.theme === 'dark' ? 'text-white' : 'text-primary'
              )}>
                What&apos;s your name?
              </label>
              <OnboardingInput
                type="text"
                placeholder={placeholderText}
                value={formData.name}
                onChange={handleNameChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className={cn("w-full h-10",
                  formData.theme === 'dark' 
                    ? "border-white text-white focus:border-white placeholder:text-white/60 bg-transparent" 
                    : "border-gray-300 text-primary focus:border-primary"
                )}
              />
              {errors.name && (
                <div className="flex items-start gap-1 mt-1">
                  <img 
                    className="w-4 h-4 mt-0.5 flex-shrink-0 filter-red" 
                    src="/images/helper.svg" 
                    alt="Error icon"
                    style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(97%) contrast(107%)' }}
                  />
                  <p className="text-sm text-error font-inter" role="alert">
                    {errors.name}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className={cn("text-sm font-medium block mb-1 transition-colors duration-300 font-geist",
                formData.theme === 'dark' ? 'text-white' : 'text-primary'
              )}>
                What&apos;s your date of birth?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  value={formData.dateOfBirth.day}
                  onChange={handleDateChange('day')}
                  onBlur={handleDayBlur}
                  className={cn(
                    "w-20 px-3 border rounded-sm h-10 text-base sm:text-sm outline-none bg-transparent transition-colors duration-300 font-geist",
                    formData.theme === 'dark' 
                      ? "border-white text-white focus:border-white placeholder:text-white/60" 
                      : "border-gray-light text-black focus:border-primary placeholder:text-primary/60"
                  )}
                />
                
                <div className="relative flex-1">
                  <select
                    value={formData.dateOfBirth.month}
                    onChange={handleDateChange('month')}
                    className={cn(
                      "appearance-none w-full px-3 border rounded-sm h-10 text-base sm:text-sm outline-none bg-transparent transition-colors duration-300 font-geist",
                      formData.theme === 'dark' 
                        ? "border-white text-white focus:border-white" 
                        : "border-gray-light text-black focus:border-primary"
                    )}
                  >
                    {MONTHS.map((month, index) => (
                      <option 
                        key={index} 
                        value={index === 0 ? '' : month}
                        className="text-black bg-white"
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                  <Image
                    src="/images/montharrow.svg"
                    alt="Dropdown arrow"
                    width={12}
                    height={12}
                    className={cn("absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300",
                      formData.theme === 'dark' ? "filter invert" : ""
                    )}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="YYYY"
                  maxLength={4}
                  value={formData.dateOfBirth.year}
                  onChange={handleDateChange('year')}
                  className={cn(
                    "w-20 px-3 border rounded-sm h-10 text-base sm:text-sm outline-none bg-transparent transition-colors duration-300 font-geist",
                    formData.theme === 'dark' 
                      ? "border-white text-white focus:border-white placeholder:text-white/60" 
                      : "border-gray-light text-black focus:border-primary placeholder:text-primary/60"
                  )}
                />
              </div>
              {errors.dateOfBirth && (
                <div className="flex items-start gap-1 mt-1">
                  <img 
                    className="w-4 h-4 mt-0.5 flex-shrink-0 filter-red" 
                    src="/images/helper.svg" 
                    alt="Error icon"
                    style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(97%) contrast(107%)' }}
                  />
                  <p className="text-sm text-error font-inter" role="alert">
                    {errors.dateOfBirth}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-[10px] mt-7">
            <OnboardingButton
              onClick={handleBackWithSound}
              variant="outline"
              className={cn("h-[36px] transition-colors duration-300",
                formData.theme === 'dark' 
                  ? "!bg-transparent !text-white !border-white hover:!bg-white hover:!text-black" 
                  : ""
              )}
            >
              <span className="font-geist">Back</span>
            </OnboardingButton>
            
            <OnboardingButton
              onClick={handleNextWithSound}
              disabled={isLoading}
              className={cn("h-[36px] text-[14px] transition-all duration-300 relative overflow-hidden group",
                "bg-black text-white dark:bg-white dark:text-black font-geist font-medium rounded-[10px]",
                isLoading ? "opacity-50 cursor-not-allowed" : "",
                formData.theme === 'dark' ? "!bg-white !text-black" : ""
              )}
            >
              {/* Simple overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{isLoading ? 'Saving...' : 'Next'}</span>
            </OnboardingButton>
          </div>

          <div className="mt-6">
            <div className="flex items-start gap-3">
              <OnboardingCheckbox
                id="agreeToMarketing"
                checked={formData.agreeToMarketing || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToMarketing: checked as boolean }))}
                className={cn("mt-1 transition-colors duration-300",
                  formData.theme === 'dark' 
                    ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-black" 
                    : "border-gray-light data-[state=checked]:bg-primary data-[state=checked]:text-white"
                )}
              />
              <label htmlFor="agreeToMarketing" className="flex-1 cursor-pointer">
                <p className={cn("font-inter text-xs font-normal leading-tight transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white' : ''
                )} style={formData.theme === 'light' ? { color: 'var(--gray-alpha-150)' } : {}}>
                  I want to receive updates, special offers, and promotional emails.
                </p>
                <p className={cn("font-inter text-xs font-normal leading-tight mt-1 transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white' : ''
                )} style={formData.theme === 'light' ? { color: 'var(--gray-alpha-150)' } : {}}>
                  I understand that I can opt out at any time.
                </p>
              </label>
            </div>
          </div>

        </div>

        {/* Step 3: Brand Stage */}
        <div className={cn("w-full max-w-lg mx-auto px-4", 
          currentStep === 2 && subscriptionStatus?.status !== 'free' ? "block" : "hidden"
        )}>
          <h1 className={cn("font-geist font-bold text-[30px] text-left sm:text-center leading-full mb-6 transition-colors duration-300",
            formData.theme === 'dark' ? 'text-white' : 'text-primary'
          )}>
            What stage is your brand at?
          </h1>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleBrandStageChange('new')}
              className={cn(
                "w-full relative h-18 border rounded-lg flex items-center gap-2.5 p-4 transition-all duration-300",
                formData.brandStage === 'new' 
                  ? formData.theme === 'dark'
                    ? "border-white bg-primary/5"
                    : "border-primary bg-primary/5"
                  : formData.theme === 'dark' 
                    ? "border-gray-400 hover:border-gray-300" 
                    : "border-gray-lighter hover:border-primary"
              )}
            >
              <Image 
                src="/images/brandstage.svg" 
                alt="Brand stage" 
                width={24} 
                height={24} 
                className={cn("transition-all duration-300",
                  formData.theme === 'dark' ? "filter invert" : ""
                )}
              />
              <div className="flex-1 text-left">
                <p className={cn("font-geist font-bold text-sm leading-5 transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white' : 'text-primary'
                )}>New Brand</p>
                <p className={cn("font-inter font-normal text-xs leading-4 transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                )}>
                  You&apos;re just starting out or still building your identity.
                </p>
              </div>
              <div className={cn(
                "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300",
                formData.theme === 'dark'
                  ? "border-gray-400"
                  : "border-gray-300"
              )}>
                {formData.brandStage === 'new' && (
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    formData.theme === 'dark' ? "bg-white" : "bg-black"
                  )} />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleBrandStageChange('established')}
              className={cn(
                "w-full relative h-18 border rounded-lg flex items-center gap-2.5 p-4 transition-all duration-300",
                formData.brandStage === 'established' 
                  ? formData.theme === 'dark'
                    ? "border-white bg-primary/5"
                    : "border-primary bg-primary/5"
                  : formData.theme === 'dark' 
                    ? "border-gray-400 hover:border-gray-300" 
                    : "border-gray-lighter hover:border-primary"
              )}
            >
              <Image 
                src="/images/space-rocket.svg" 
                alt="Brand stage" 
                width={24} 
                height={24} 
                className={cn("transition-all duration-300",
                  formData.theme === 'dark' ? "filter invert" : ""
                )}
              />
              <div className="flex-1 text-left">
                <p className={cn("font-geist font-bold text-sm leading-5 transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white' : 'text-primary'
                )}>Established Brand</p>
                <p className={cn("font-inter font-normal text-xs leading-4 transition-colors duration-300",
                  formData.theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                )}>
                  Already active with an audience or customers.
                </p>
              </div>
              <div className={cn(
                "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300",
                formData.theme === 'dark'
                  ? "border-gray-400"
                  : "border-gray-300"
              )}>
                {formData.brandStage === 'established' && (
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    formData.theme === 'dark' ? "bg-white" : "bg-black"
                  )} />
                )}
              </div>
            </button>
          </div>

          <div className="w-full max-w-lg flex gap-[10px] mt-7">
            <OnboardingButton
              onClick={handleBackWithSound}
              variant="outline"
              className={cn("px-2.5 py-2 h-9 transition-colors duration-300",
                formData.theme === 'dark' 
                  ? "!bg-transparent !text-white !border-white hover:!bg-white hover:!text-black" 
                  : ""
              )}
            >
              <span className="font-geist">Back</span>
            </OnboardingButton>
            
            <OnboardingButton
              onClick={handleNextWithSound}
              disabled={isLoading}
              className={cn("h-[36px] text-[14px] transition-all duration-300 relative overflow-hidden group",
                "bg-black text-white dark:bg-white dark:text-black font-geist font-medium rounded-[10px]",
                isLoading ? "opacity-50 cursor-not-allowed" : "",
                formData.theme === 'dark' ? "!bg-white !text-black" : ""
              )}
            >
              {/* Simple overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{isLoading ? 'Saving...' : 'Continue'}</span>
            </OnboardingButton>
          </div>
        </div>

        {/* Step 4: How did you hear about us */}
        <div className={cn("px-4 sm:px-5", 
          currentStep === 3 && subscriptionStatus?.status !== 'free' ? "block" : "hidden"
        )}>
          <h1 className={cn("font-geist font-bold text-2xl sm:text-[30px] text-left sm:text-center leading-full mb-6 transition-colors duration-300",
            formData.theme === 'dark' ? 'text-white' : 'text-primary'
          )}>
            Which category best describes you?
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-2.5 mt-6">
            {HEAR_ABOUT_OPTIONS.map((option) => (
              <OnboardingHearAboutCard
                key={option.name}
                name={option.name}
                image={option.image}
                isSelected={formData.hearAbout.includes(option.name)}
                isAnySelected={formData.hearAbout.length > 0}
                theme={formData.theme}
                onClick={() => handleHearAboutToggle(option.name)}
              />
            ))}
          </div>
          
          <div className="flex gap-[10px] mt-7">
            <OnboardingButton
              onClick={handleBackWithSound}
              variant="outline"
              className={cn("px-2.5 py-2 h-9 transition-colors duration-300",
                formData.theme === 'dark' 
                  ? "!bg-transparent !text-white !border-white hover:!bg-white hover:!text-black" 
                  : ""
              )}
            >
              <span className="font-geist">Back</span>
            </OnboardingButton>
            
            <OnboardingButton
              onClick={handleNextWithSound}
              disabled={isLoading || formData.hearAbout.length === 0}
              className={cn("h-[36px] text-[14px] transition-all duration-300 relative overflow-hidden group",
                "bg-black text-white dark:bg-white dark:text-black font-geist font-medium rounded-[10px]",
                (isLoading || formData.hearAbout.length === 0) ? "opacity-50 cursor-not-allowed" : "",
                formData.theme === 'dark' ? "!bg-white !text-black" : ""
              )}
            >
              {/* Simple overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{isLoading ? 'Completing...' : 'Complete Onboarding'}</span>
            </OnboardingButton>
          </div>
        </div>
      </div>


    </div>
  );
};

export default OnboardingPage;