import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                PTime - Worker Dashboard
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
          {/* Available Jobs Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Jobs
            </h2>
            <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
            <p className="text-gray-600 text-sm">New opportunities near you</p>
            <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Browse Jobs
            </button>
          </div>

          {/* My Applications Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Applications
            </h2>
            <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
            <p className="text-gray-600 text-sm">Pending applications</p>
            <button className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
              View Applications
            </button>
          </div>

          {/* Earnings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              This Month's Earnings
            </h2>
            <div className="text-3xl font-bold text-green-600 mb-2">$1,250</div>
            <p className="text-gray-600 text-sm">From 8 completed jobs</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              View Earnings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Applied to "Weekend Server Position"</p>
                  <p className="text-sm text-gray-600">Downtown Restaurant</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Completed "Event Setup Assistant"</p>
                  <p className="text-sm text-gray-600">Conference Center</p>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Received payment for "Warehouse Helper"</p>
                  <p className="text-sm text-gray-600">$150.00</p>
                </div>
                <span className="text-sm text-gray-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
