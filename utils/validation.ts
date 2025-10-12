import { FormErrors, PasswordStrength } from '@/types';

// Email validation
export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
};

// Password validation
export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (password.startsWith(' ') || password.endsWith(' ')) {
    return 'Password cannot begin or end with a space';
  }
  return undefined;
};

// Password strength calculation (matching existing UI)
export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  return { score, feedback };
};

// Name validation
export const validateName = (name: string): string | undefined => {
  if (!name.trim()) return 'Name is required';
  const trimmedName = name.trim();
  if (trimmedName.length < 2) return 'Name must be at least 2 characters';
  // Only allow alphabets, spaces, hyphens, and apostrophes (common in names)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) return 'Name should contain only letters';
  // Check for minimum 2 words (full name requirement)
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) return 'Please enter your full name';
  return undefined;
};

// Date validation
export const validateDate = (day: string, month: string, year: string): string | undefined => {
  if (!day || !month || !year) return 'Please complete your date of birth';
  
  const dayNum = parseInt(day);
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  const minimumYear = currentYear - 18; // Must be at least 18 years old
  const oldestAllowedYear = currentYear - 100; // Max 100 years old
  
  if (dayNum < 1 || dayNum > 31) return 'Please enter a valid date of birth';
  if (yearNum < oldestAllowedYear) return 'Please enter a valid date of birth';
  if (yearNum > minimumYear) return 'You must be at least 18 years old to register';
  
  return undefined;
};

// Generic form validation
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validationRules: Record<keyof T, (value: any) => string | undefined>
): FormErrors => {
  const errors: FormErrors = {};
  
  for (const [field, validator] of Object.entries(validationRules)) {
    const error = validator(formData[field as keyof T]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};