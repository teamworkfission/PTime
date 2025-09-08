import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthState, User, UserRole, SignUpData, SignInData } from '../types/auth'

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>
  signIn: (data: SignInData) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  setUserRole: (role: UserRole) => void
  pendingRole: UserRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setPendingRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          createdAt: data.created_at,
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (signUpData: SignUpData) => {
    try {
      setLoading(true)
      
      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
      })

      if (signUpError) {
        return { error: signUpError }
      }

      if (data.user) {
        // Create user profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: signUpData.email,
              role: signUpData.role,
              first_name: signUpData.firstName,
              last_name: signUpData.lastName,
            },
          ])

        if (profileError) {
          return { error: profileError }
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (signInData: SignInData) => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      })

      if (error) {
        return { error }
      }

      // Store the role they're signing in as
      setPendingRole(signInData.role)
      
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    setUser(null)
    setPendingRole(null)
  }

  const setUserRole = (role: UserRole) => {
    setPendingRole(role)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    setUserRole,
    pendingRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
