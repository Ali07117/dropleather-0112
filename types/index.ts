// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: string;
  label?: string;
  error?: string;
  labelColor?: string;
}

export interface HearAboutProps {
  name: string;
  image: string;
  isSelected?: boolean;
  isAnySelected?: boolean;
  theme?: 'dark' | 'light';
  onClick?: () => void;
}

export interface PricingOptionProps {
  text?: string;
  available: 'add' | 'remove';
  option: string;
  i?: string;
}

// Form Types
export interface OnboardingFormData {
  name: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  brandStage: 'new' | 'established';
  hearAbout: string[];
  theme: 'dark' | 'light';
  agreeToMarketing?: boolean;
}

// Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  originalPrice?: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: PricingFeature[];
  popular?: boolean;
}

export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
  details?: string;
}