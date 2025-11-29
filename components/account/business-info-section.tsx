'use client'

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { CountryCombobox } from '@/components/ui/country-combobox';
import Image from 'next/image';

interface BusinessInfoSectionProps {
  data: {
    company_name: string;
    registration_number?: string;
    business_address: string;
    state_province: string;
    city: string;
    zip_code: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
}


export function BusinessInfoSection({ data, onChange }: BusinessInfoSectionProps) {
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
              // Auto-fill other fields when address is selected
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
}