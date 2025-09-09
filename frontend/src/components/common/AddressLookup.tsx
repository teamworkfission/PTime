import React, { useRef, useEffect, useState } from 'react';
import { GoogleMapsPlace, ParsedAddress, AddressComponents } from '../../types/google-maps';

interface AddressLookupProps {
  onAddressSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBQ3856ZkeBkr9AueiYq75fOenxmk8PiG4';

export const AddressLookup: React.FC<AddressLookupProps> = ({
  onAddressSelect,
  placeholder = "Start typing your business address...",
  className = "",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        initializeAutocomplete();
        return;
      }

      // Check if script is already being loaded
      if (isLoading) return;

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Script exists but may not be loaded yet, wait for it
        const checkLoaded = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsLoaded(true);
            initializeAutocomplete();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Load Google Maps script
      setIsLoading(true);
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoading(false);
          setIsLoaded(true);
          initializeAutocomplete();
        };
        
        script.onerror = () => {
          setIsLoading(false);
          console.error('Failed to load Google Maps API');
        };
        
        document.head.appendChild(script);
      } catch (error) {
        setIsLoading(false);
        console.error('Error loading Google Maps API:', error);
      }
    };

    loadGoogleMaps();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'us' }, // Restrict to US addresses
      fields: ['place_id', 'formatted_address', 'address_components', 'geometry'],
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace() as GoogleMapsPlace;
      
      if (!place.address_components || !place.geometry) {
        console.warn('No valid address components found');
        return;
      }

      const parsedAddress = parseAddressComponents(place);
      onAddressSelect(parsedAddress);
      
      // Clear the input after selection
      if (inputRef.current) {
        inputRef.current.value = place.formatted_address || '';
      }
    });
  };

  const parseAddressComponents = (place: GoogleMapsPlace): ParsedAddress => {
    const components: AddressComponents = {};
    
    // Parse address components
    place.address_components.forEach((component) => {
      const componentType = component.types[0];
      
      switch (componentType) {
        case 'street_number':
          components.street_number = component.long_name;
          break;
        case 'route':
          components.route = component.long_name;
          break;
        case 'locality':
          components.locality = component.long_name;
          break;
        case 'administrative_area_level_2':
          components.administrative_area_level_2 = component.long_name;
          break;
        case 'administrative_area_level_1':
          components.administrative_area_level_1 = component.short_name;
          break;
        case 'postal_code':
          components.postal_code = component.long_name;
          break;
        case 'country':
          components.country = component.long_name;
          break;
      }
    });

    // Construct the parsed address
    const street = [components.street_number, components.route]
      .filter(Boolean)
      .join(' ') || '';

    return {
      street: street,
      city: components.locality || '',
      county: components.administrative_area_level_2 || '',
      state: components.administrative_area_level_1 || '',
      zipcode: components.postal_code || '',
      formatted_address: place.formatted_address || '',
      place_id: place.place_id || '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
  };

  if (isLoading || !isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          placeholder={isLoading ? "Loading Google Maps..." : "Initializing address lookup..."}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          disabled
        />
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
          ${disabled 
            ? 'bg-gray-50 border-gray-200 text-gray-500' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
        `}
      />
      <div className="absolute right-3 top-2.5">
        <span className="text-gray-400 text-sm">🔍</span>
      </div>
    </div>
  );
};
