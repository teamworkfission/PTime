import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { UserDashboard } from './pages/UserDashboard'
import { EmployerDashboard } from './pages/EmployerDashboard'
import { AuthSignUp } from './pages/AuthSignUp'
import { AuthSignIn } from './pages/AuthSignIn'

// Component to handle authentication redirects
const AuthRedirectHandler: React.FC = () => {
  const { status, me } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (status === 'authenticated' && me) {
      // Handle OAuth return redirects and wrong dashboard redirects
      if (location.pathname === '/' && location.search === '') {
        // This is likely an OAuth return redirect - send user to their dashboard
        const dashboardPath = me.role === 'employee' ? '/dashboard' : '/employer-dashboard'
        navigate(dashboardPath, { replace: true })
      }
      else if (me.role === 'employer' && location.pathname === '/dashboard') {
        navigate('/employer-dashboard', { replace: true })
      }
      else if (me.role === 'employee' && location.pathname === '/employer-dashboard') {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [status, me, navigate, location.pathname, location.search])

  // Show loading screen while auth status is initializing
  if (status === 'initializing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}

const AppRoutes: React.FC = () => {
  const { status } = useAuth()

  // Don't render routes until auth status is determined (prevent flicker)
  if (status === 'initializing') {
    return null
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Pages */}
      <Route path="/auth/signup" element={<AuthSignUp />} />
      <Route path="/auth/signin" element={<AuthSignIn />} />
      
      {/* Employee Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="employee">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Employer Dashboard */}
      <Route
        path="/employer-dashboard"
        element={
          <ProtectedRoute requiredRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AuthRedirectHandler />
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
