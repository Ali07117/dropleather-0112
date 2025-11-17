'use client'

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface BusinessInfoSectionProps {
  data: {
    company_name: string;
    business_address: string;
    state_province: string;
    city: string;
    zip_code: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
];

export function BusinessInfoSection({ data, onChange }: BusinessInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Sora'] mb-2">Business Information</h2>
        <p className="text-muted-foreground font-['Inter'] text-sm mb-6">
          Your business details and address information
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name" className="font-['Sora'] text-sm font-medium">Business Name</Label>
          <Input
            id="company-name"
            value={data.company_name}
            onChange={(e) => onChange('company_name', e.target.value)}
            placeholder="Enter your business or company name"
            className="font-['Inter']"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-address" className="font-['Sora'] text-sm font-medium">Business Address</Label>
          <Textarea
            id="business-address"
            value={data.business_address}
            onChange={(e) => onChange('business_address', e.target.value)}
            placeholder="Enter your full business address"
            rows={3}
            className="font-['Inter']"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state-province" className="font-['Sora'] text-sm font-medium">State/Province</Label>
            <Input
              id="state-province"
              value={data.state_province}
              onChange={(e) => onChange('state_province', e.target.value)}
              placeholder="State or Province"
              className="font-['Inter']"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="font-['Sora'] text-sm font-medium">City</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="font-['Inter']"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip-code" className="font-['Sora'] text-sm font-medium">Zip Code</Label>
            <Input
              id="zip-code"
              value={data.zip_code}
              onChange={(e) => onChange('zip_code', e.target.value)}
              placeholder="Zip/Postal Code"
              className="font-['Inter']"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="font-['Sora'] text-sm font-medium">Country</Label>
          <Select value={data.country} onValueChange={(value) => onChange('country', value)}>
            <SelectTrigger className="md:w-1/2 font-['Inter']">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Delete Workspace Section */}
        <div className="mt-8 border border-red-300 bg-red-50 rounded-lg p-4 flex flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-['Sora'] text-sm font-medium text-red-800">Delete Workspace</h3>
            <p className="font-['Inter'] text-xs text-red-600 mt-1">
              Once deleted, your workspace cannot be recovered
            </p>
          </div>
          <Button 
            className="bg-transparent hover:bg-red-50 border border-[#F65351] text-[#F65351] font-['Inter'] text-sm font-medium h-[28px] w-auto rounded-[7px] flex items-center gap-2"
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