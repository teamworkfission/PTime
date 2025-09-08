import React, { useEffect } from 'react'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { UserRole } from '../../types/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  role: UserRole
  onModeChange: (mode: 'signin' | 'signup') => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  role,
  onModeChange,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const roleTitle = role === 'worker' ? 'Gig Worker' : 'Employer'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'} as {roleTitle}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {mode === 'signin' ? (
                  <SignInForm role={role} onSuccess={onClose} />
                ) : (
                  <SignUpForm role={role} onSuccess={onClose} />
                )}

                <div className="mt-4 text-center">
                  <button
                    onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {mode === 'signin' 
                      ? `Don't have an account? Sign up as ${roleTitle.toLowerCase()}`
                      : `Already have an account? Sign in`
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
