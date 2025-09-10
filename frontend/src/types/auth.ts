export type UserRole = 'employee' | 'employer'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface GoogleAuthData {
  role: UserRole
  mode?: 'signin' | 'signup'
}
