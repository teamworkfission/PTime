export interface Business {
  id: string;
  employer_id: string;
  business_name: string;
  business_location: string;
  business_type: string;
  employee_count: number;
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessDto {
  business_name: string;
  business_location: string;
  business_type: string;
  employee_count: number;
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
}

export interface UpdateBusinessDto {
  business_name?: string;
  business_location?: string;
  business_type?: string;
  employee_count?: number;
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
