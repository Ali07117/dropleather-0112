'use client'

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
  data: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Sora'] mb-2">Personal Information</h2>
        <p className="text-muted-foreground font-['Inter'] text-sm mb-6">
          Your personal details and contact information
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-['Sora'] text-sm font-medium">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="font-['Inter']"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="font-['Sora'] text-sm font-medium">Primary Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              disabled
              className="bg-gray-50 font-['Inter']"
              placeholder="Your email address"
            />
            <p className="text-xs text-muted-foreground font-['Inter']">
              Email cannot be changed here. Contact support to update your email.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-['Sora'] text-sm font-medium">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="font-['Inter']"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-password" className="font-['Sora'] text-sm font-medium">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            disabled
            placeholder="••••••••"
            className="md:w-1/2 bg-gray-50 font-['Inter']"
          />
          <p className="text-xs text-muted-foreground font-['Inter']">
            To change your password, please use the forgot password option on the login page.
          </p>
        </div>
      </div>
    </div>
  );
}