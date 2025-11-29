'use client'

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CheckCircle } from 'lucide-react';
import { EmailChangeModal } from './email-change-modal';
import { PasswordChangeModal } from './password-change-modal';
import { createClientSupabase } from '@/utils/supabase/client';

interface PersonalInfoSectionProps {
  data: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // These will be passed down from parent component
  const handleEmailChange = async (newEmail: string) => {
    // TODO: Implement email change logic
    console.log('Changing email to:', newEmail);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      console.log('🔐 [PASSWORD CHANGE] Starting password change process');
      
      const supabase = await createClientSupabase();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user?.email) {
        throw new Error('Authentication required');
      }

      console.log('🔐 [PASSWORD CHANGE] Verifying current password');
      
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      console.log('🔐 [PASSWORD CHANGE] Current password verified, updating to new password');

      // Update password using Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ [PASSWORD CHANGE] Error:', updateError);
        throw new Error(updateError.message);
      }

      console.log('✅ [PASSWORD CHANGE] Password changed successfully');
      
      // Show success message
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 5000);
      
    } catch (err) {
      console.error('❌ [PASSWORD CHANGE] Failed:', err);
      throw err; // Re-throw to show error in modal
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {showPasswordSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Password changed successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your password has been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Picture Section */}
      <div className="flex items-center gap-4">
        <div className="w-[72px] h-[72px] rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xl">👤</span>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="font-geist text-sm font-medium text-black">Profile Picture</h3>
            <p className="font-geist text-xs text-gray-500">We only support PNGs, JPEGs and GIFs under 10MB</p>
          </div>
          <Button className="w-fit h-8 px-3 text-white hover:bg-[#1a5dc7] font-geist text-xs flex items-center gap-2 border" style={{ backgroundColor: '#266DF0', borderColor: '#00266B' }}>
            <Camera className="w-3 h-3" />
            Upload image
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-[5px]">
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
          
          <div className="space-y-[5px]">
            <Label htmlFor="email" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Primary Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="font-geist pr-16 bg-[#FBFBFB]"
                placeholder="Your email address"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs font-geist text-gray-500 hover:text-gray-700"
                onClick={() => setIsEmailModalOpen(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-[5px]">
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
          
          <div className="space-y-[5px]">
            <Label htmlFor="current-password" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type="password"
                value="••••••••"
                readOnly
                placeholder="••••••••"
                className="font-geist pr-16 bg-[#FBFBFB]"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs font-geist text-gray-500 hover:text-gray-700"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Change Modal */}
      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={data.email}
        onChangeEmail={handleEmailChange}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handlePasswordChange}
      />
    </div>
  );
}