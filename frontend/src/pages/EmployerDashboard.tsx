import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { DashboardCard } from '../components/layout/DashboardCard'
import { ResponsiveContainer, ResponsiveGrid } from '../components/layout/ResponsiveContainer'
import { ManageBusinessTab } from '../components/business/ManageBusinessTab'
import { HiringTab } from '../components/hiring/HiringTab'
import { Business, CreateBusinessDto } from '../types/business'
import { businessService } from '../services/business.service'

export const EmployerDashboard: React.FC = () => {
  const { me, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState<'overview' | 'manage-business' | 'schedule' | 'hiring'>('overview')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [businessError, setBusinessError] = useState<string | null>(null)

  // Load businesses on component mount and when me changes
  useEffect(() => {
    if (me?.role === 'employer') {
      loadBusinesses()
    }
  }, [me])

  const loadBusinesses = async () => {
    try {
      setIsLoadingBusinesses(true)
      setBusinessError(null)
      const businessData = await businessService.fetchBusinesses()
      setBusinesses(businessData)
      
      // Set first business as selected if none selected
      if (!selectedBusiness && businessData.length > 0) {
        setSelectedBusiness(businessData[0])
      }
    } catch (error) {
      console.error('Error loading businesses:', error)
      setBusinessError(error instanceof Error ? error.message : 'Failed to load businesses')
    } finally {
      setIsLoadingBusinesses(false)
    }
  }

  const handleCreateBusiness = async (businessData: CreateBusinessDto) => {
    try {
      const newBusiness = await businessService.createBusiness(businessData)
      setBusinesses(prev => [...prev, newBusiness])
      
      if (!selectedBusiness) {
        setSelectedBusiness(newBusiness)
      }
    } catch (error) {
      console.error('Error creating business:', error)
      throw error // Re-throw so the form can handle the error
    }
  }

  const handleUpdateBusiness = async (businessId: string, businessData: Partial<CreateBusinessDto>) => {
    try {
      const updatedBusiness = await businessService.updateBusiness(businessId, businessData)
      setBusinesses(prev => prev.map(business => 
        business.id === businessId ? updatedBusiness : business
      ))
      
      if (selectedBusiness?.id === businessId) {
        setSelectedBusiness(updatedBusiness)
      }
    } catch (error) {
      console.error('Error updating business:', error)
      throw error // Re-throw so the form can handle the error
    }
  }

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      await businessService.deleteBusiness(businessId)
      setBusinesses(prev => prev.filter(business => business.id !== businessId))
      
      if (selectedBusiness?.id === businessId) {
        const remainingBusinesses = businesses.filter(business => business.id !== businessId)
        setSelectedBusiness(remainingBusinesses.length > 0 ? remainingBusinesses[0] : null)
      }
    } catch (error) {
      console.error('Error deleting business:', error)
      throw error // Re-throw so the component can handle the error
    }
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection()
      case 'manage-business':
        if (isLoadingBusinesses) {
          return (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading businesses...</p>
            </div>
          )
        }

        if (businessError) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Businesses</h3>
              <p className="text-red-600 mb-4">{businessError}</p>
              <button
                onClick={loadBusinesses}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          )
        }

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

  const renderOverviewSection = () => {
    // Show loading state for overview while businesses are loading
    if (isLoadingBusinesses) {
      return (
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <div className="text-center py-6 sm:py-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your businesses, schedule employees, and handle hiring all in one place.
            </p>
          </div>

          {/* Loading State */}
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to your Dashboard
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your businesses, schedule employees, and handle hiring all in one place.
          </p>
        </div>

        {/* Error State */}
        {businessError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">Error loading businesses</p>
                <p className="text-sm text-red-600">{businessError}</p>
              </div>
              <button
                onClick={loadBusinesses}
                className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

      {/* Main Dashboard Cards */}
      <ResponsiveGrid className="lg:grid-cols-3">
        <DashboardCard
          icon="🏪"
          title="Manage Business"
          description="Register and manage your business locations for operations"
          onClick={() => setActiveSection('manage-business')}
          isActive={activeSection === 'manage-business'}
          stats={{
            primary: { value: businesses.length, label: 'Businesses' },
            secondary: businesses.length > 0 ? { 
              value: businesses.length, // Number of businesses instead of employee count 
              label: 'Total Employees' 
            } : undefined
          }}
          badge={businesses.length === 0 ? { text: 'Setup Required', color: 'orange' } : undefined}
        />

        <DashboardCard
          icon="📅"
          title="Schedule"
          description="Manage employee schedules and shift assignments"
          onClick={() => setActiveSection('schedule')}
          isActive={activeSection === 'schedule'}
          stats={{
            primary: { value: '0', label: 'Active Schedules' },
            secondary: { value: '0', label: 'This Week' }
          }}
          badge={{ text: 'Coming Soon', color: 'blue' }}
        />

        <DashboardCard
          icon="💼"
          title="Job Posting and Hiring"
          description="Post jobs, review applications, and hire qualified employees"
          onClick={() => setActiveSection('hiring')}
          isActive={activeSection === 'hiring'}
          stats={{
            primary: { value: '5', label: 'Active Jobs' },
            secondary: { value: '18', label: 'Applications' }
          }}
          badge={{ text: 'Active', color: 'green' }}
        />
      </ResponsiveGrid>

      {/* Quick Stats Section */}
      {businesses.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">
                {businesses.length}
              </div>
              <div className="text-sm text-gray-600">Business{businesses.length !== 1 ? 'es' : ''}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">5</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">18</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Hired This Month</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">New application received</p>
                  <p className="text-xs sm:text-sm text-gray-600">Weekend Server Position • 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📝</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Job post published</p>
                  <p className="text-xs sm:text-sm text-gray-600">Event Setup Assistant • 1 day ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">👥</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Employee hired</p>
                  <p className="text-xs sm:text-sm text-gray-600">Warehouse Helper position • 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <ResponsiveContainer>
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              {activeSection !== 'overview' && (
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
                  aria-label="Back to overview"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                PTime - Employer Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, {me?.email}
              </span>
              <button
                onClick={signOut}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      {/* Main Content */}
      <main className="pb-6 sm:pb-8">
        <ResponsiveContainer className="pt-6 sm:pt-8">
          {/* Selected Business Info - Only show on non-overview sections */}
          {selectedBusiness && activeSection !== 'overview' && (
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex-shrink-0">🏪</div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">{selectedBusiness.name}</h2>
                    <p className="text-sm text-gray-600 truncate">{selectedBusiness.address_street}, {selectedBusiness.address_city}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-gray-900">{selectedBusiness.type}</p>
                  <p className="text-sm text-gray-600">{selectedBusiness.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Section Content */}
          <div className={`
            ${activeSection === 'overview' ? '' : 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8'}
          `}>
            {renderSectionContent()}
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  )
}
