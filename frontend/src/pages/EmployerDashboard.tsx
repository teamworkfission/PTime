import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { TabNavigation, Tab } from '../components/layout/TabNavigation'
import { ManageBusinessTab } from '../components/business/ManageBusinessTab'
import { HiringTab } from '../components/hiring/HiringTab'
import { Business, CreateBusinessDto } from '../types/business'

// Mock data for demonstration - in real implementation, this would come from API
const mockBusinesses: Business[] = [
  {
    id: '1',
    employer_id: 'mock-employer-id',
    business_name: 'Mario\'s Pizza Palace',
    business_location: '123 Main St, New York, NY 10001',
    business_type: 'Restaurant',
    employee_count: 15,
    google_maps_data: {
      lat: 40.7589,
      lng: -73.9851,
      formatted_address: '123 Main St, New York, NY 10001',
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

const tabs: Tab[] = [
  { id: 'manage-business', label: 'Manage Business', icon: '🏪' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'hiring', label: 'Job Posting and Hiring', icon: '💼' },
];

export const EmployerDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('manage-business')
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    mockBusinesses.length > 0 ? mockBusinesses[0] : null
  )

  // Mock handlers - in real implementation, these would make API calls
  const handleCreateBusiness = async (businessData: CreateBusinessDto) => {
    console.log('Creating business:', businessData)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newBusiness: Business = {
      id: Date.now().toString(),
      employer_id: user?.id || 'mock-employer-id',
      ...businessData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setBusinesses(prev => [...prev, newBusiness])
    if (!selectedBusiness) {
      setSelectedBusiness(newBusiness)
    }
  }

  const handleUpdateBusiness = async (businessId: string, businessData: Partial<CreateBusinessDto>) => {
    console.log('Updating business:', businessId, businessData)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setBusinesses(prev => prev.map(business => 
      business.id === businessId 
        ? { ...business, ...businessData, updated_at: new Date().toISOString() }
        : business
    ))
  }

  const handleDeleteBusiness = async (businessId: string) => {
    console.log('Deleting business:', businessId)
    setBusinesses(prev => prev.filter(business => business.id !== businessId))
    if (selectedBusiness?.id === businessId) {
      const remainingBusinesses = businesses.filter(business => business.id !== businessId)
      setSelectedBusiness(remainingBusinesses.length > 0 ? remainingBusinesses[0] : null)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'manage-business':
        return (
          <ManageBusinessTab
            businesses={businesses}
            onCreateBusiness={handleCreateBusiness}
            onUpdateBusiness={handleUpdateBusiness}
            onDeleteBusiness={handleDeleteBusiness}
          />
        )
      case 'schedule':
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Management</h3>
            <p className="text-gray-600">
              Schedule management functionality will be implemented here.
            </p>
          </div>
        )
      case 'hiring':
        return <HiringTab selectedBusinessId={selectedBusiness?.id} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                PTime - Employer Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected Business Info */}
        {selectedBusiness && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏪</div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedBusiness.business_name}</h2>
                  <p className="text-sm text-gray-600">{selectedBusiness.business_location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{selectedBusiness.business_type}</p>
                <p className="text-sm text-gray-600">{selectedBusiness.employee_count} employees</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 pt-6">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
