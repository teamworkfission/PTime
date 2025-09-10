import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { useAuth } from '../contexts/AuthContext'
import { getRoleBasedDashboard } from '../utils/roleBasedRedirect'

export const LandingPage: React.FC = () => {
  const { status, me } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="relative px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-900">PTime</h1>
            <span className="ml-2 text-sm text-gray-600">Employee Gig Platform</span>
          </div>
          
          {status === 'authenticated' && me ? (
            <Button
              onClick={() => navigate(getRoleBasedDashboard(me.role))}
              className="hidden sm:block"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate('/auth/signup?role=employer')}
              className="hidden sm:block"
            >
              Employer / Business Owner
            </Button>
          )}
          
          {/* Mobile buttons */}
          {status === 'authenticated' && me ? (
            <button
              onClick={() => navigate(getRoleBasedDashboard(me.role))}
              className="sm:hidden text-primary-600 text-sm font-medium"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth/signup?role=employer')}
              className="sm:hidden text-primary-600 text-sm font-medium"
            >
              For Employers
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center py-12 lg:py-20">
          <div className="lg:col-span-7">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Find Your Next{' '}
              <span className="text-primary-600">Part-Time Job</span>{' '}
              Today
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              Connect with local businesses looking for flexible employees. From weekend shifts to 
              event help, find gig work that fits your schedule and skills.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/auth/signup?role=employee')}
                className="text-lg px-8 py-4"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth/signin?role=employee')}
                className="text-lg px-8 py-4"
              >
                I Already Have an Account
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Flexible schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Weekly payments</span>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-5">
            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍💼</div>
                  <p className="text-primary-700 font-medium">
                    Thousands of jobs waiting for you
                  </p>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="text-2xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                <div className="text-2xl font-bold text-green-600">$18/hr</div>
                <div className="text-sm text-gray-600">Average Pay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How PTime Works
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Create your profile, browse jobs, and start earning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h4>
              <p className="text-gray-600">
                Set up your profile with skills, availability, and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Find Jobs</h4>
              <p className="text-gray-600">
                Browse available gigs in your area that match your skills
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Get Paid</h4>
              <p className="text-gray-600">
                Complete work and receive payment directly to your account
              </p>
            </div>
          </div>
        </div>

        {/* Business CTA Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Need Employees for Your Business?
            </h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Post jobs and find qualified employees for temporary, part-time, and seasonal positions.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth/signup?role=employer')}
              className="bg-white text-primary-600 border-white hover:bg-primary-50 text-lg px-8 py-4"
            >
              Post Your First Job
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">PTime</h4>
            <p className="text-gray-400 mb-8">
              Connecting gig employees with local businesses
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
