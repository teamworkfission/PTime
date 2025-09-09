# AddressLookup Component

## Overview
The `AddressLookup` component provides Google Maps Places API integration for address autocomplete and auto-fill functionality.

## Features
- **Real-time address suggestions** as user types
- **Auto-fill address fields** when address is selected
- **US address restriction** for consistency
- **Error handling** and loading states
- **Clean, accessible UI** with search icon

## Usage

```tsx
import { AddressLookup } from '../common/AddressLookup';
import { ParsedAddress } from '../../types/google-maps';

const handleAddressSelect = (address: ParsedAddress) => {
  console.log('Selected address:', address);
  // Auto-fill your form fields here
};

<AddressLookup
  onAddressSelect={handleAddressSelect}
  placeholder="Start typing your address..."
  disabled={false}
/>
```

## ParsedAddress Interface

The component returns a `ParsedAddress` object with:

```typescript
{
  street: string;        // e.g., "123 Main Street"
  city: string;          // e.g., "New York"
  county: string;        // e.g., "New York County"
  state: string;         // e.g., "NY"
  zipcode: string;       // e.g., "10001"
  formatted_address: string;  // Full address from Google
  place_id: string;      // Google Places ID
  lat: number;           // Latitude
  lng: number;           // Longitude
}
```

## Integration Requirements

1. **Google Maps API Key** must be added to `index.html`
2. **Places library** must be loaded (`&libraries=places`)
3. **Callback function** `initGoogleMaps` must be defined

## Current Setup

The component is integrated in:
- ✅ **BusinessRegistrationForm** - Auto-fills business address fields
- ✅ **Google Maps API** loaded in `index.html` with API key
- ✅ **TypeScript types** defined in `google-maps.ts`

## Error Handling

- Shows loading state while Google Maps API loads
- Handles missing address components gracefully
- Clears form errors when valid address is selected
- Provides console warnings for debugging
