import React from 'react';

interface HiringTabProps {
  selectedBusinessId?: string;
}

export const HiringTab: React.FC<HiringTabProps> = ({ selectedBusinessId }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Job Posting and Hiring</h2>
        <p className="text-gray-600 mt-1">
          Manage job postings, review applications, and hire employees for your business.
        </p>
      </div>

      {/* Business Selection Notice */}
      {!selectedBusinessId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Please select a business first
              </p>
              <p className="text-sm text-yellow-600">
                Go to the "Manage Business" tab to register or select a business before posting jobs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedBusinessId ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Jobs Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Job Posts
              </h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
              <p className="text-gray-600 text-sm">Currently hiring</p>
              <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                Manage Jobs
              </button>
            </div>

            {/* Applications Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                New Applications
              </h3>
              <div className="text-3xl font-bold text-orange-600 mb-2">18</div>
              <p className="text-gray-600 text-sm">Awaiting review</p>
              <button className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                Review Applications
              </button>
            </div>

            {/* Hired Employees Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hired This Month
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <p className="text-gray-600 text-sm">Employees hired</p>
              <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                View Employees
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium text-gray-900">Post New Job</div>
                <div className="text-sm text-gray-600">Create a new job listing</div>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium text-gray-900">Browse Employees</div>
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
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job Posts</h3>
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
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to start hiring?</h3>
          <p className="text-gray-600 mb-6">
            Once you select a business, you'll be able to post jobs and manage applications.
          </p>
        </div>
      )}
    </div>
  );
};
