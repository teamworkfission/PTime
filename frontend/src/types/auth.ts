export type UserRole = 'worker' | 'employer'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface SignInData {
  email: string
  password: string
  role: UserRole
}
