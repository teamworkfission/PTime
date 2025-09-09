import React, { useState } from 'react';
import { CreateBusinessDto, BUSINESS_TYPES, BusinessType } from '../../types/business';
import { Button } from '../common/Button';

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
    business_name: initialData.business_name || '',
    business_location: initialData.business_location || '',
    business_type: initialData.business_type || '',
    employee_count: initialData.employee_count || 1,
    google_maps_data: initialData.google_maps_data || undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateBusinessDto, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBusinessDto, string>> = {};

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required';
    }

    if (!formData.business_location.trim()) {
      newErrors.business_location = 'Business location is required';
    }

    if (!formData.business_type) {
      newErrors.business_type = 'Business type is required';
    }

    if (formData.employee_count < 1 || formData.employee_count > 10000) {
      newErrors.employee_count = 'Employee count must be between 1 and 10,000';
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
    const value = field === 'employee_count' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationSelect = (location: string, mapsData?: CreateBusinessDto['google_maps_data']) => {
    setFormData(prev => ({
      ...prev,
      business_location: location,
      google_maps_data: mapsData,
    }));
    
    if (errors.business_location) {
      setErrors(prev => ({ ...prev, business_location: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Name */}
      <div>
        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name *
        </label>
        <input
          type="text"
          id="business_name"
          value={formData.business_name}
          onChange={handleInputChange('business_name')}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${errors.business_name 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
          placeholder="Enter your business name"
          disabled={isLoading}
        />
        {errors.business_name && (
          <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
        )}
      </div>

      {/* Business Location */}
      <div>
        <label htmlFor="business_location" className="block text-sm font-medium text-gray-700 mb-2">
          Business Location *
        </label>
        <div className="relative">
          <input
            type="text"
            id="business_location"
            value={formData.business_location}
            onChange={handleInputChange('business_location')}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${errors.business_location 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
            placeholder="Enter business address"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-2">
            <span className="text-gray-400 text-sm">📍</span>
          </div>
        </div>
        {errors.business_location && (
          <p className="mt-1 text-sm text-red-600">{errors.business_location}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Google Maps integration will be added for accurate location selection
        </p>
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
          Type of Business *
        </label>
        <select
          id="business_type"
          value={formData.business_type}
          onChange={handleInputChange('business_type')}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${errors.business_type 
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
        {errors.business_type && (
          <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>
        )}
      </div>

      {/* Number of Employees */}
      <div>
        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Employees *
        </label>
        <input
          type="number"
          id="employee_count"
          min="1"
          max="10000"
          value={formData.employee_count}
          onChange={handleInputChange('employee_count')}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${errors.employee_count 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
          placeholder="1"
          disabled={isLoading}
        />
        {errors.employee_count && (
          <p className="mt-1 text-sm text-red-600">{errors.employee_count}</p>
        )}
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
