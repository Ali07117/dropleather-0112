'use client'

import { useRef, useState } from 'react';
// Simple header for designer pages (no sidebar dependency)
const DesignerSiteHeader = ({ title = "Dashboard" }: { title?: string }) => (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b">
    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <h1 className="text-base font-medium font-sans">{title}</h1>
    </div>
  </header>
);
import { Button } from '@/components/ui/button';
import { Loader2, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { CountryCombobox } from '@/components/ui/country-combobox';
import Image from 'next/image';

// EXACT COPY of PersonalInfoSection with mock data
const MockPersonalInfoSection = ({ data, onChange }: any) => {
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Success Alerts */}
      {showPasswordSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Password changed successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your password has been updated successfully.
          </AlertDescription>
        </Alert>
      )}
      
      {showEmailSuccess && (
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Email change initiated!</AlertTitle>
          <AlertDescription className="text-blue-700">
            We&apos;ve sent confirmation emails to both your current email and {pendingEmail}. Please check both emails and click the confirmation links to complete the email change.
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
            <Label htmlFor="email" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>
              Primary Email Address
              {pendingEmail && (
                <span className="ml-2 text-orange-600 text-xs font-normal">(Unconfirmed)</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={pendingEmail || data.email}
                onChange={(e) => onChange('email', e.target.value)}
                className={`font-geist pr-16 bg-[#FBFBFB] ${pendingEmail ? 'border-orange-300 pl-10' : ''}`}
                placeholder="Your email address"
                readOnly
              />
              {pendingEmail && (
                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs font-geist text-gray-500 hover:text-gray-700"
                onClick={() => alert('🎨 DESIGN MODE: Edit Email clicked!')}
              >
                Edit
              </Button>
            </div>
            {pendingEmail && (
              <p className="text-xs text-orange-600 font-geist">
                Check your email and click the confirmation link to activate {pendingEmail}
              </p>
            )}
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
                onClick={() => alert('🎨 DESIGN MODE: Edit Password clicked!')}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EXACT COPY of BusinessInfoSection with mock data
const MockBusinessInfoSection = ({ data, onChange }: any) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold font-geist">Business Information</h2>
        <p className="text-muted-foreground font-geist text-sm">Manage the information related to your business.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-[5px]">
            <Label htmlFor="company-name" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Business Name</Label>
            <Input
              id="company-name"
              value={data.company_name}
              onChange={(e) => onChange('company_name', e.target.value)}
              placeholder="Enter your business or company name"
              className="font-geist"
            />
          </div>
          
          <div className="space-y-[5px]">
            <Label htmlFor="registration-number" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Registration Number</Label>
            <Input
              id="registration-number"
              value={data.registration_number || ''}
              onChange={(e) => onChange('registration_number', e.target.value)}
              placeholder="Enter your business registration number"
              className="font-geist"
            />
          </div>
        </div>

        <div className="space-y-[5px]">
          <Label htmlFor="business-address" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Business Address</Label>
          <GooglePlacesInput
            id="business-address"
            value={data.business_address}
            onChange={(value) => onChange('business_address', value)}
            onPlaceSelect={(place) => {
              onChange('business_address', place.address);
              onChange('city', place.city);
              onChange('state_province', place.state);
              onChange('zip_code', place.zipCode);
              onChange('country', place.country);
            }}
            placeholder="Enter your full business address"
            className="font-geist"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-[5px]">
            <Label htmlFor="state-province" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>State/Province</Label>
            <Input
              id="state-province"
              value={data.state_province}
              onChange={(e) => onChange('state_province', e.target.value)}
              placeholder="State or Province"
              className="font-geist"
            />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="city" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>City</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="font-geist"
            />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="zip-code" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Zip Code</Label>
            <Input
              id="zip-code"
              value={data.zip_code}
              onChange={(e) => onChange('zip_code', e.target.value)}
              placeholder="Zip/Postal Code"
              className="font-geist"
            />
          </div>
        </div>

        <div className="space-y-[5px]">
          <Label htmlFor="country" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c' }}>Country</Label>
          <div className="md:w-1/2">
            <CountryCombobox
              value={data.country}
              onValueChange={(value) => onChange('country', value)}
              placeholder="Select a country"
              className="w-full"
            />
          </div>
        </div>

        {/* Delete Workspace Section */}
        <div className="mt-8 border border-[#F65351] bg-transparent rounded-[7px] p-4 flex flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-geist text-sm font-medium text-black">Delete Workspace</h3>
            <p className="font-geist text-xs text-black mt-1">
              Once deleted, your workspace cannot be recovered
            </p>
          </div>
          <Button 
            className="bg-[#F65351] hover:bg-red-600 border border-[#C03634] text-white font-geist text-sm font-medium h-[32px] w-auto rounded-[9.85px] flex items-center gap-2"
            onClick={() => alert('🎨 DESIGN MODE: Delete Workspace clicked!')}
          >
            <Image 
              src="/images/trash.svg" 
              alt="Delete" 
              width={20} 
              height={20} 
            />
            Delete workspace
          </Button>
        </div>
      </div>
    </div>
  );
};

// EXACT COPY of AccountDetailsForm with mock data
const MockAccountDetailsForm = ({ hasChanges, setHasChanges }: any) => {
  const [personalData, setPersonalData] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567'
  });
  
  const [businessData, setBusinessData] = useState({
    company_name: 'Smith Fashion Co.',
    registration_number: 'REG123456789',
    business_address: '123 Fashion Street, New York, NY 10001',
    state_province: 'New York',
    city: 'New York',
    zip_code: '10001',
    country: 'US'
  });

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleBusinessChange = (field: string, value: string) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <MockPersonalInfoSection 
        data={personalData}
        onChange={handlePersonalChange}
      />
      
      <div className="border-t pt-6">
        <MockBusinessInfoSection 
          data={businessData}
          onChange={handleBusinessChange}
        />
      </div>
    </div>
  );
};

// EXACT COPY of your original page structure
export default function DesignerAccountDetailsPage() {
  const formRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      alert('🎨 DESIGN MODE: Save clicked!');
    }, 1000);
  };

  return (
    <>
      {/* DESIGN MODE BANNER */}
      <div className="bg-orange-500 text-white text-center py-2 font-bold">
        🎨 DESIGNER MODE - Account Details (EXACT COPY)
      </div>
      
      <DesignerSiteHeader title="Account Details" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className="space-y-2 mt-12 mb-8">
              <h1 className="text-2xl font-bold font-geist">Account Details</h1>
              <p className="text-muted-foreground font-geist text-sm">
                Manage your personal and business information
              </p>
            </div>
            
            {/* Save Button Section */}
            <div className="bg-[#F9F9F9] border border-[#EAEAEA] rounded-lg px-4 h-[43px] flex flex-row items-center justify-between gap-4 mb-8">
              <p className="font-geist text-sm text-gray-700">Happy with the changes? Just press save.</p>
              <Button 
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="bg-transparent hover:bg-gray-50 border border-[#696969] border-opacity-60 text-gray-900 font-geist text-sm font-medium h-[28px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
            
            <MockAccountDetailsForm hasChanges={hasChanges} setHasChanges={setHasChanges} />
          </div>
        </div>
      </div>
    </>
  );
}