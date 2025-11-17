'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Your business details and address information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Business Name</Label>
          <Input
            id="company-name"
            value={data.company_name}
            onChange={(e) => onChange('company_name', e.target.value)}
            placeholder="Enter your business or company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-address">Business Address</Label>
          <Textarea
            id="business-address"
            value={data.business_address}
            onChange={(e) => onChange('business_address', e.target.value)}
            placeholder="Enter your full business address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state-province">State/Province</Label>
            <Input
              id="state-province"
              value={data.state_province}
              onChange={(e) => onChange('state_province', e.target.value)}
              placeholder="State or Province"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip-code">Zip Code</Label>
            <Input
              id="zip-code"
              value={data.zip_code}
              onChange={(e) => onChange('zip_code', e.target.value)}
              placeholder="Zip/Postal Code"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={data.country} onValueChange={(value) => onChange('country', value)}>
            <SelectTrigger className="md:w-1/2">
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
      </CardContent>
    </Card>
  );
}