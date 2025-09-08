import { UserRole } from '../types/auth'

export const getRoleBasedDashboard = (role: UserRole): string => {
  switch (role) {
    case 'worker':
      return '/dashboard'
    case 'employer':
      return '/employer-dashboard'
    default:
      return '/dashboard'
  }
}

export const getAuthRedirectPath = (intendedRole: UserRole, userRole: UserRole): string => {
  // If the user is accessing through the correct role, redirect to their dashboard
  if (intendedRole === userRole) {
    return getRoleBasedDashboard(userRole)
  }
  
  // If there's a role mismatch, redirect to their actual role dashboard
  return getRoleBasedDashboard(userRole)
}
