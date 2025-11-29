import React from 'react';
import { HearAboutProps } from '@/types';
import { cn } from '@/utils/cn';

const OnboardingHearAboutCard: React.FC<HearAboutProps> = ({
  name,
  image,
  isSelected = false,
  isAnySelected = false,
  theme = 'light',
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'py-3 sm:py-4 px-3 sm:px-5 w-full sm:w-[184px] h-20 sm:h-[88px] rounded-2xl sm:rounded-3xl flex flex-col gap-2 sm:gap-[15px] border transition-all duration-300 focus:outline-none',
        isSelected 
          ? theme === 'dark'
            ? 'border-white bg-primary/5'
            : 'border-black bg-primary/5'
          : isAnySelected
            ? theme === 'dark'
              ? 'border-gray-500 bg-gray-800 opacity-50'
              : 'border-gray-300 bg-gray-100 opacity-50'
            : theme === 'dark'
              ? 'border-gray-400 hover:border-gray-300'
              : 'border-gray-lighter hover:border-primary'
      )}
      aria-pressed={isSelected}
    >
      <img 
        className={cn("w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-300",
          theme === 'dark' ? "filter invert" : ""
        )}
        src={`/images/${image}.svg`} 
        alt={`${name} icon`}
      />
      <p className={cn("font-geist font-medium text-xs sm:text-[14px] leading-tight sm:leading-normal text-left not-italic transition-colors duration-300",
        theme === 'dark' ? 'text-white' : 'text-black'
      )} style={{ fontStyle: 'normal' }}>
        {name}
      </p>
    </button>
  );
};

export default OnboardingHearAboutCard;