import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { UserDashboard } from './pages/UserDashboard'
import { EmployerDashboard } from './pages/EmployerDashboard'
import { getRoleBasedDashboard } from './utils/roleBasedRedirect'

// Component to handle authentication redirects
const AuthRedirectHandler: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && isAuthenticated && user && location.pathname === '/') {
      // If user is authenticated and on landing page, redirect to their dashboard
      navigate(getRoleBasedDashboard(user.role), { replace: true })
    }
  }, [isAuthenticated, user, loading, navigate, location.pathname])

  if (loading) {
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
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Worker Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="worker">
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
