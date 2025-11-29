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
        <h2 className="text-xl font-bold font-geist mb-2">Personal Information</h2>
        <hr className="border-t border-gray-200 mb-6" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="font-geist"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Primary Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              disabled
              className="bg-gray-50 font-geist"
              placeholder="Your email address"
            />
            <p className="text-xs text-muted-foreground font-geist">
              Email cannot be changed here. Contact support to update your email.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="font-geist"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-password" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Current Password</Label>
            <Input
              id="current-password"
              type="password"
              disabled
              placeholder="••••••••"
              className="bg-gray-50 font-geist"
            />
            <p className="text-xs text-muted-foreground font-geist">
              To change your password, please use the forgot password option on the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}