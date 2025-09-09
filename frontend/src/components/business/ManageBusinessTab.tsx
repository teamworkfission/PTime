import React, { useState, useEffect } from 'react';
import { Business, CreateBusinessDto } from '../../types/business';
import { BusinessCard } from './BusinessCard';
import { BusinessRegistrationForm } from './BusinessRegistrationForm';
import { Button } from '../common/Button';

interface ManageBusinessTabProps {
  // Mock data - in real implementation, these would come from API calls
  businesses?: Business[];
  onCreateBusiness?: (businessData: CreateBusinessDto) => Promise<void>;
  onUpdateBusiness?: (businessId: string, businessData: Partial<CreateBusinessDto>) => Promise<void>;
  onDeleteBusiness?: (businessId: string) => Promise<void>;
}

export const ManageBusinessTab: React.FC<ManageBusinessTabProps> = ({
  businesses = [],
  onCreateBusiness,
  onUpdateBusiness,
  onDeleteBusiness,
}) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show registration form if no businesses exist
  useEffect(() => {
    if (businesses.length === 0 && !showRegistrationForm) {
      setShowRegistrationForm(true);
    }
  }, [businesses.length, showRegistrationForm]);

  const handleCreateBusiness = async (businessData: CreateBusinessDto) => {
    if (!onCreateBusiness) {
      console.log('Mock: Creating business:', businessData);
      setShowRegistrationForm(false);
      return;
    }

    setIsLoading(true);
    try {
      await onCreateBusiness(businessData);
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('Error creating business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setShowRegistrationForm(true);
  };

  const handleUpdateBusiness = async (businessData: CreateBusinessDto) => {
    if (!editingBusiness || !onUpdateBusiness) {
      console.log('Mock: Updating business:', editingBusiness?.id, businessData);
      setEditingBusiness(null);
      setShowRegistrationForm(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateBusiness(editingBusiness.id, businessData);
      setEditingBusiness(null);
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('Error updating business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!onDeleteBusiness) {
      console.log('Mock: Deleting business:', businessId);
      return;
    }

    try {
      await onDeleteBusiness(businessId);
      if (selectedBusiness?.id === businessId) {
        setSelectedBusiness(null);
      }
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const handleCancelForm = () => {
    setShowRegistrationForm(false);
    setEditingBusiness(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Business</h2>
          <p className="text-gray-600 mt-1">
            Register and manage your business locations for scheduling and hiring operations.
          </p>
        </div>
        {businesses.length > 0 && !showRegistrationForm && (
          <Button
            onClick={() => setShowRegistrationForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Add New Business
          </Button>
        )}
      </div>

      {/* Registration Form */}
      {showRegistrationForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingBusiness ? 'Edit Business' : 'Register New Business'}
            </h3>
            {businesses.length > 0 && (
              <button
                onClick={handleCancelForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <BusinessRegistrationForm
            onSubmit={editingBusiness ? handleUpdateBusiness : handleCreateBusiness}
            isLoading={isLoading}
            initialData={editingBusiness ? {
              name: editingBusiness.name,
              type: editingBusiness.type,
              email: editingBusiness.email,
              phone: editingBusiness.phone,
              address_street: editingBusiness.address_street,
              address_city: editingBusiness.address_city,
              address_county: editingBusiness.address_county,
              address_state: editingBusiness.address_state,
              address_zipcode: editingBusiness.address_zipcode,
              google_maps_data: editingBusiness.google_maps_data,
            } : undefined}
          />
        </div>
      )}

      {/* Businesses Grid */}
      {businesses.length > 0 && !showRegistrationForm && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Businesses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onEdit={handleEditBusiness}
                onDelete={handleDeleteBusiness}
                onSelect={setSelectedBusiness}
                isSelected={selectedBusiness?.id === business.id}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {businesses.length === 0 && !showRegistrationForm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses registered</h3>
          <p className="text-gray-600 mb-6">
            Register your first business to start scheduling employees and posting jobs.
          </p>
          <Button
            onClick={() => setShowRegistrationForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
          >
            Register Your First Business
          </Button>
        </div>
      )}

      {/* Selected Business Info */}
      {selectedBusiness && !showRegistrationForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Selected: {selectedBusiness.business_name}
              </p>
              <p className="text-sm text-blue-600">
                This business will be used as the context for scheduling and job posting operations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
