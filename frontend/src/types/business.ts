export interface Business {
  id: string;
  employer_id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  // Structured address fields
  address_street: string;
  address_city: string;
  address_county: string;
  address_state: string;
  address_zipcode: string;
  // Optional Google Maps data for precise location
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessDto {
  name: string;
  type: string;
  email?: string;
  phone?: string;
  // Structured address fields (all required)
  address_street: string;
  address_city: string;
  address_county: string;
  address_state: string;
  address_zipcode: string;
  // Optional Google Maps data for precise location
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
}

export interface UpdateBusinessDto {
  name?: string;
  type?: string;
  email?: string;
  phone?: string;
  // Structured address fields
  address_street?: string;
  address_city?: string;
  address_county?: string;
  address_state?: string;
  address_zipcode?: string;
  // Optional Google Maps data for precise location
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
}

export const BUSINESS_TYPES = [
  'Restaurant',
  'Retail',
  'Warehouse',
  'Office',
  'Healthcare',
  'Construction',
  'Manufacturing',
  'Hospitality',
  'Other'
] as const;

export type BusinessType = typeof BUSINESS_TYPES[number];
