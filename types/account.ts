export interface PersonalInfo {
  name: string;
  email: string;
  phone: string | null;
}

export interface BusinessInfo {
  company_name: string | null;
  registration_number: string | null;
  business_address: string | null;
  state_province: string | null;
  city: string | null;
  zip_code: string | null;
  country: string;
}

export interface AccountDetails {
  personal: PersonalInfo;
  business: BusinessInfo;
  updated_at: string;
}

export interface AccountDetailsUpdateRequest {
  personal?: Partial<PersonalInfo>;
  business?: Partial<BusinessInfo>;
}

export interface AccountDetailsResponse {
  success: boolean;
  data?: AccountDetails;
  message?: string;
}