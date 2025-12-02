'use client'

import { useState } from 'react';
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
const MockPersonalInfoSection = ({ data, onChange }: { data: Record<string, string>; onChange: (field: string, value: string) => void }) => {
  const [showPasswordSuccess] = useState(false);
  const [showEmailSuccess] = useState(false);
  const [pendingEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);


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
        <div className="w-[72px] h-[72px] rounded-full bg-[#f5a300] flex items-center justify-center">
          <span className="text-[#fff3cc] font-[500] text-[35px] font-[Inter]">A</span>
          {/* <span className="text-[#fff3cc] font-[600] text-[35px] font-[Inter]">👤</span> */}
        </div>
        <div className="flex flex-col gap-[8px]">
          <div>
            <h3 className="font-[Inter] text-[14px] font-[600] text-[#242529]">Profile Picture</h3>
            <p className="font-[Inter] font-[500] text-[12px] text-[#505154]">We only support PNGs, JPEGs and GIFs under 10MB</p>
          </div>
          <Button className=" bg-[#266DF0] hover:bg-[#215BC4] gap-[6px] rounded-[8px] cursor-pointer px-[8px] py-[4px] text-[#FFFFFF] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center w-[123px]">
            <Camera className="p-[0px] m-[0px]" />
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
                className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 h-6 px-2 text-xs font-geist text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(true)}
                // onClick={() => alert('🎨 DESIGN MODE: Edit Email clicked!')}
              >
                Edit
              </Button>
            </div>
            {open && (
        <div
          className="fixed inset-0 bg-black/20 flex justify-center  z-50"
          onClick={() => setOpen(false)} // click outside to close
        >
          {/* Popup Box */}
          <div className='bg-[#e5e5e5] h-[195px] p-[3px] rounded-[16px] mt-[100px]' style={{ boxShadow: "rgba(255, 255, 255, 0) 0px 0px 0px 1px inset, rgba(28, 40, 64, 0.12) 0px 8px 28px -6px, rgba(28, 40, 64, 0.16) 0px 18px 88px -4px",}}>
          <div
            className="bg-[#fefefe] rounded-[14px] border border-[#d5d5d5]"
            style={{ width: "800px", height: "189px" }}
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <div className="p-[8px] flex justify-between items-center border-b border-b-[#ededed]">
              <h2 className="text-[#242529] font-[500] font-[Inter] text-[14px] leading-[20px] py-[2px] px-[4px]">Change email address</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-[black] font-[Inter] text-[14px] py-[5px] px-[7px] hover:rounded-[3px] hover:bg-[#fbfbfb] cursor-pointer font-400"
              >
                X
              </button>
            </div>
            <div className='px-[16px] pt-[16px] pb-[24px] flex flex-col gap-[4px]'>
              <p className='text-[#0000008C] text-[12px] font-[Inter] font-[500]'>New Email Address</p>
              <input className='h-[34px] min-h-[34px] avtive:border-[#3B82F6] font-[Inter] text-[14px] text-[#242529] font-[500] outline-none focus:border-blue-500 focus:outline-none focus:ring-0" w-[100%] outline-none rounded-[10px] px-[10px] border border-[#ededed]' type="email" placeholder='Enter New Email Address' name="" id="" />

            </div>
            <div className='h-[44px] min-h-[44px] flex justify-between items-center pl-[12px] pr-[8px] max-h-[44px] border-t border-t-[#ededed]'>
                <div></div>
                <div className='flex items-center gap-[6px]'>
                  <button className='bg-[#FFFFFF] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer pl-[8px] pr-[6px] py-[4px] text-[#242529] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center' onClick={() => setOpen(false)}>Cancel <div className='px-[3px] h-[16px] text-[10px] rounded-[4px] border border: 1px solid rgba(80, 81, 84, 0.05); font-[400] flex items-center justify-center text-center'>ESC</div></button>
                  <button className='bg-[#266DF0] border border-[#2262d8] hover:bg-[#215BC4] gap-[6px] rounded-[8px] cursor-pointer px-[8px] py-[4px] text-[#FFFFFF] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center w-[182px]'>Change email address <div className='rounded-[4px] h-[16px] w-[14px] px-[3px] border border-[#4683f2] border-[1px]'></div></button>
                </div>
            </div>
          </div>
          </div>
        </div>
      )}
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
                className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 h-6 px-2 text-xs font-geist text-gray-500 hover:text-gray-700"
                onClick={() => setOpen2(true)}
                // onClick={() => alert('🎨 DESIGN MODE: Edit Password clicked!')}
              >
                Edit
              </Button>
            </div>
            {open2 && (
        <div
          className="fixed inset-0 bg-black/20 flex justify-center h-auto  z-50"
          onClick={() => setOpen2(false)} // click outside to close
        >
          {/* Popup Box */}
          <div className='bg-[#e5e5e5] h-fit  p-[3px] rounded-[16px] mt-[100px]' style={{ boxShadow: "rgba(255, 255, 255, 0) 0px 0px 0px 1px inset, rgba(28, 40, 64, 0.12) 0px 8px 28px -6px, rgba(28, 40, 64, 0.16) 0px 18px 88px -4px",}}>
          <div
            className="bg-[#fefefe] rounded-[14px] border border-[#d5d5d5]"
            style={{ width: "800px" }}
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <div className="p-[8px] flex justify-between items-center border-b border-b-[#ededed]">
              <h2 className="text-[#242529] font-[500] font-[Inter] text-[14px] leading-[20px] py-[2px] px-[4px]">Change password</h2>

              <button
                onClick={() => setOpen2(false)}
                className="text-[black] font-[Inter] text-[14px] py-[5px] px-[7px] hover:rounded-[3px] hover:bg-[#fbfbfb] cursor-pointer font-400"
              >
                X
              </button>
            </div>
            <div className='space-y-[16px]'>
            <div className='px-[16px] pt-[16px] flex flex-col gap-[4px]'>
              <p className='text-[#0000008C] text-[12px] font-[Inter] font-[500]'>Current Password</p>
              <input className='h-[34px] min-h-[34px] avtive:border-[#3B82F6] font-[Inter] text-[14px] text-[#242529] font-[500] outline-none focus:border-blue-500 focus:outline-none focus:ring-0" w-[100%] outline-none rounded-[10px] px-[10px] border border-[#ededed]' type="text" placeholder='Enter current password' name="" id="" />
            </div>
            <div className='px-[16px] flex flex-col gap-[4px]'>
              <p className='text-[#0000008C] text-[12px] font-[Inter] font-[500]'>New Password</p>
              <input className='h-[34px] min-h-[34px] avtive:border-[#3B82F6] font-[Inter] text-[14px] text-[#242529] font-[500] outline-none focus:border-blue-500 focus:outline-none focus:ring-0" w-[100%] outline-none rounded-[10px] px-[10px] border border-[#ededed]' type="text" placeholder='Enter new password' name="" id="" />
            </div>
            <div className='px-[16px] flex flex-col gap-[4px]'>
              <p className='text-[#0000008C] text-[12px] font-[Inter] font-[500]'>Confirm New Password</p>
              <input className='h-[34px] min-h-[34px] avtive:border-[#3B82F6] font-[Inter] text-[14px] text-[#242529] font-[500] outline-none focus:border-blue-500 focus:outline-none focus:ring-0" w-[100%] outline-none rounded-[10px] px-[10px] border border-[#ededed]' type="text" placeholder='Confirm new password' name="" id="" />
            </div>
            </div>
            <div className='h-[44px] mt-[16px] min-h-[44px] flex justify-between items-center pl-[12px] pr-[8px] max-h-[44px] border-t border-t-[#ededed]'>
                <div></div>
                <div className='flex items-center gap-[6px]'>
                  <button className='bg-[#FFFFFF] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer pl-[8px] pr-[6px] py-[4px] text-[#242529] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center' onClick={() => setOpen2(false)}>Cancel <div className='px-[3px] h-[16px] text-[10px] rounded-[4px] border border: 1px solid rgba(80, 81, 84, 0.05); font-[400] flex items-center justify-center text-center'>ESC</div></button>
                  <button className='bg-[#266DF0] border border-[#2262d8] hover:bg-[#215BC4] gap-[6px] rounded-[8px] cursor-pointer px-[8px] py-[4px] text-[#FFFFFF] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center'>Change password <div className='rounded-[4px] h-[16px] w-[14px] px-[3px] border border-[#4683f2] border-[1px]'></div></button>
                </div>
            </div>
          </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

// EXACT COPY of BusinessInfoSection with mock data
const MockBusinessInfoSection = ({ data, onChange }: { data: Record<string, string>; onChange: (field: string, value: string) => void }) => {
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
const MockAccountDetailsForm = ({ setHasChanges }: { setHasChanges: (value: boolean) => void }) => {
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
  // const formRef = useRef<HTMLFormElement>(null);
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
            
            <MockAccountDetailsForm setHasChanges={setHasChanges} />
          </div>
        </div>
      </div>
    </>
  );
}