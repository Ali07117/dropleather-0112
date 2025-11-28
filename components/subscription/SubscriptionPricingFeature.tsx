import React from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { PricingOptionProps } from '@/types';
import { cn } from '@/utils/cn';

const SubscriptionPricingFeature: React.FC<PricingOptionProps> = ({
  text,
  available,
  option,
  i
}) => {
  const isAvailable = available === 'add';
  const hasInfo = i === 'i';
  
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-shrink-0">
        {isAvailable ? (
          <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-[#24CB71] flex items-center justify-center">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <Image 
            src="/images/remove.svg" 
            alt="Feature not included" 
            width={16}
            height={16}
            className="w-3 h-3 lg:w-4 lg:h-4"
          />
        )}
      </div>
      
      <p 
        className={cn(
          'text-[16px] leading-normal flex-1 font-medium font-geist',
          text === '#000000' ? 'text-primary' : 'text-text-muted'
        )}
        style={text && text !== '#000000' ? { color: text } : undefined}
      >
        {option}
      </p>
      
      {hasInfo && (
        <div className="flex-shrink-0 pb-1 pl-1 flex items-center">
          <Info 
            className={cn(
              'w-3 h-3 lg:w-4 lg:h-4',
              text === '#000000' ? 'text-primary' : 'text-text-muted'
            )}
            style={text && text !== '#000000' ? { color: text } : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionPricingFeature;