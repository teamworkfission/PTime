// Google Maps API types for Places Autocomplete
export interface GoogleMapsPlace {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface AddressComponents {
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_2?: string;
  administrative_area_level_1?: string;
  postal_code?: string;
  country?: string;
}

export interface ParsedAddress {
  street: string;
  city: string;
  county: string;
  state: string;
  zipcode: string;
  formatted_address: string;
  place_id: string;
  lat: number;
  lng: number;
}

// Google Maps API globals
declare global {
  interface Window {
    google: typeof google;
  }
}
