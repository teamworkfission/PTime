export type UserRole = 'worker' | 'employer'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export interface GoogleAuthData {
  role: UserRole
}
