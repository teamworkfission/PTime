import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export const EmployerDashboard: React.FC = () => {
  const { user, signOut } = useAuth()

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Jobs Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Job Posts
            </h2>
            <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
            <p className="text-gray-600 text-sm">Currently hiring</p>
            <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Manage Jobs
            </button>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              New Applications
            </h2>
            <div className="text-3xl font-bold text-orange-600 mb-2">18</div>
            <p className="text-gray-600 text-sm">Awaiting review</p>
            <button className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
              Review Applications
            </button>
          </div>

          {/* Hired Workers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hired This Month
            </h2>
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <p className="text-gray-600 text-sm">Workers hired</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              View Workers
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium text-gray-900">Post New Job</div>
              <div className="text-sm text-gray-600">Create a new job listing</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">Browse Workers</div>
              <div className="text-sm text-gray-600">Find qualified candidates</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Track hiring metrics</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">💳</div>
              <div className="font-medium text-gray-900">Billing</div>
              <div className="text-sm text-gray-600">Manage payments</div>
            </button>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Job Posts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Weekend Server Position</p>
                  <p className="text-sm text-gray-600">5 applications • Posted 2 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Event Setup Assistant</p>
                  <p className="text-sm text-gray-600">12 applications • Posted 1 week ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  In Progress
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Warehouse Helper</p>
                  <p className="text-sm text-gray-600">Position filled • Posted 2 weeks ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
