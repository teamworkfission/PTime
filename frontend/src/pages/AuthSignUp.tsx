import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UnifiedAuthForm } from '../components/auth/UnifiedAuthForm'
import { UserRole } from '../types/auth'
import { useAuth } from '../contexts/AuthContext'
import { getRoleBasedDashboard } from '../utils/roleBasedRedirect'

export const AuthSignUp: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { status, me } = useAuth()
  const [role, setRole] = useState<UserRole>('employee')

  useEffect(() => {
    // Get role from URL parameter, default to 'employee'
    const roleParam = searchParams.get('role') as UserRole
    if (roleParam === 'employee' || roleParam === 'employer') {
      setRole(roleParam)
    } else {
      // If invalid role parameter, default to employee
      setRole('employee')
    }
  }, [searchParams])

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (status === 'authenticated' && me) {
      navigate(getRoleBasedDashboard(me.role), { replace: true })
    }
  }, [status, me, navigate])

  const handleAuthSuccess = () => {
    // Success will be handled by AuthContext and redirect automatically
    // This is called when the OAuth flow initiates successfully
  }

  const getRoleDisplayName = (role: UserRole) => {
    return role === 'employee' ? 'Employee' : 'Employer'
  }

  const getRoleDescription = (role: UserRole) => {
    return role === 'employee' 
      ? 'Find part-time gig work that fits your schedule'
      : 'Post jobs and find qualified employees for your business'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-2xl font-bold text-primary-900 mb-2">PTime</h1>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Your {getRoleDisplayName(role)} Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getRoleDescription(role)}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <UnifiedAuthForm
            role={role}
            mode="signup"
            onSuccess={handleAuthSuccess}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate(`/auth/signin?role=${role}`)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Role Switch */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Looking to {role === 'employee' ? 'hire employees' : 'find work'}?
          </p>
          <button
            onClick={() => {
              const newRole = role === 'employee' ? 'employer' : 'employee'
              navigate(`/auth/signup?role=${newRole}`)
            }}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Create {getRoleDisplayName(role === 'employee' ? 'employer' : 'employee')} Account
          </button>
        </div>
      </div>
    </div>
  )
}
