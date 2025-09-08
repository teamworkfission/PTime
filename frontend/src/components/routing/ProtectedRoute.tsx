import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/',
}) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to home with the current location as state for post-auth redirect
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user?.role !== requiredRole) {
    const dashboardPath = user?.role === 'worker' ? '/dashboard' : '/employer-dashboard'
    return <Navigate to={dashboardPath} replace />
  }

  return <>{children}</>
}
