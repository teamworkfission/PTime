import React from 'react'

interface AuthErrorProps {
  error: string | null
}

export const AuthError: React.FC<AuthErrorProps> = ({ error }) => {
  if (!error) return null

  // Map technical errors to user-friendly messages
  const getErrorMessage = (error: string) => {
    if (error === 'already_registered' || error.includes('already exists')) {
      return 'Employee already exists, please sign in.'
    }
    if (error === 'no_account' || error.includes('not found')) {
      return 'No employee found, please sign up.'
    }
    if (error === 'role_mismatch') {
      return 'This account is registered with a different role. Please contact support if you need to switch roles.'
    }
    // Handle specific role mismatch messages
    if (error.startsWith('role_mismatch_')) {
      if (error.includes('employee_is_employer')) {
        return 'You\'re registered as a business owner. Please use the "Employer / Business Owner" button to sign in.'
      }
      if (error.includes('employer_is_employee')) {
        return 'You\'re registered as an employee. Please use the "Get Started" or "I Already Have an Account" buttons to sign in.'
      }
    }
    // Default fallback for other errors
    return error
  }

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
      {getErrorMessage(error)}
    </div>
  )
}
