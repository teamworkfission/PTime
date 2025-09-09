import React, { useState } from 'react';
import { CreateBusinessDto, BUSINESS_TYPES, BusinessType } from '../../types/business';
import { Button } from '../common/Button';
import { AddressLookup } from '../common/AddressLookup';
import { ParsedAddress } from '../../types/google-maps';

interface BusinessRegistrationFormProps {
  onSubmit: (businessData: CreateBusinessDto) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateBusinessDto>;
}

export const BusinessRegistrationForm: React.FC<BusinessRegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<CreateBusinessDto>({
    name: initialData.name || '',
    type: initialData.type || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address_street: initialData.address_street || '',
    address_city: initialData.address_city || '',
    address_county: initialData.address_county || '',
    address_state: initialData.address_state || '',
    address_zipcode: initialData.address_zipcode || '',
    google_maps_data: initialData.google_maps_data || undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateBusinessDto, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBusinessDto, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Business type is required';
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation (all required)
    if (!formData.address_street.trim()) {
      newErrors.address_street = 'Street address is required';
    }

    if (!formData.address_city.trim()) {
      newErrors.address_city = 'City is required';
    }

    if (!formData.address_county.trim()) {
      newErrors.address_county = 'County is required';
    }

    if (!formData.address_state.trim()) {
      newErrors.address_state = 'State is required';
    }

    if (!formData.address_zipcode.trim()) {
      newErrors.address_zipcode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateBusinessDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressSelect = (address: ParsedAddress) => {
    // Auto-fill all address fields and Google Maps data
    setFormData(prev => ({
      ...prev,
      address_street: address.street,
      address_city: address.city,
      address_county: address.county,
      address_state: address.state,
      address_zipcode: address.zipcode,
      google_maps_data: {
        lat: address.lat,
        lng: address.lng,
        place_id: address.place_id,
        formatted_address: address.formatted_address,
      },
    }));

    // Clear any address-related errors when auto-filling
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.address_street;
      delete newErrors.address_city;
      delete newErrors.address_county;
      delete newErrors.address_state;
      delete newErrors.address_zipcode;
      return newErrors;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange('name')}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${errors.name 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
          placeholder="Enter your business name"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Type of Business *
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={handleInputChange('type')}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${errors.type 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
          disabled={isLoading}
        >
          <option value="">Select business type</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Business Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${errors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
            placeholder="contact@yourbusiness.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Business Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Business Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${errors.phone 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
            placeholder="(555) 123-4567"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Business Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
        
        {/* Address Lookup */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Lookup
          </label>
          <AddressLookup
            onAddressSelect={handleAddressSelect}
            placeholder="Start typing your business address..."
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Search and select your address to auto-fill the fields below
          </p>
        </div>
        
        {/* Street Address */}
        <div>
          <label htmlFor="address_street" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="address_street"
            value={formData.address_street}
            onChange={handleInputChange('address_street')}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${errors.address_street 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
            placeholder="123 Main Street"
            disabled={isLoading}
          />
          {errors.address_street && (
            <p className="mt-1 text-sm text-red-600">{errors.address_street}</p>
          )}
        </div>

        {/* City and County */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address_city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="address_city"
              value={formData.address_city}
              onChange={handleInputChange('address_city')}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
                ${errors.address_city 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }
              `}
              placeholder="City"
              disabled={isLoading}
            />
            {errors.address_city && (
              <p className="mt-1 text-sm text-red-600">{errors.address_city}</p>
            )}
          </div>

          <div>
            <label htmlFor="address_county" className="block text-sm font-medium text-gray-700 mb-2">
              County *
            </label>
            <input
              type="text"
              id="address_county"
              value={formData.address_county}
              onChange={handleInputChange('address_county')}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
                ${errors.address_county 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }
              `}
              placeholder="County"
              disabled={isLoading}
            />
            {errors.address_county && (
              <p className="mt-1 text-sm text-red-600">{errors.address_county}</p>
            )}
          </div>
        </div>

        {/* State and ZIP Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address_state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              id="address_state"
              value={formData.address_state}
              onChange={handleInputChange('address_state')}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
                ${errors.address_state 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }
              `}
              placeholder="State"
              disabled={isLoading}
            />
            {errors.address_state && (
              <p className="mt-1 text-sm text-red-600">{errors.address_state}</p>
            )}
          </div>

          <div>
            <label htmlFor="address_zipcode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="address_zipcode"
              value={formData.address_zipcode}
              onChange={handleInputChange('address_zipcode')}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
                ${errors.address_zipcode 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }
              `}
              placeholder="12345"
              disabled={isLoading}
            />
            {errors.address_zipcode && (
              <p className="mt-1 text-sm text-red-600">{errors.address_zipcode}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          📍 Use the address lookup above or manually enter address details
        </p>
      </div>


      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Register Business'}
        </Button>
      </div>
    </form>
  );
};
