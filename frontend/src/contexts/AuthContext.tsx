import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TABLES } from '../lib/supabase'
import { User, UserRole, GoogleAuthData } from '../types/auth'

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated'

interface AuthContextType {
  status: AuthStatus
  me: User | null
  signUpWithGoogle: (data: GoogleAuthData) => Promise<{ error: Error | null }>
  signInWithGoogle: (data: GoogleAuthData) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
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
  const [me, setMe] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('initializing')
  const [pendingAuthData, setPendingAuthData] = useState<GoogleAuthData | null>(() => {
    // Initialize from localStorage to persist across OAuth redirects
    const stored = localStorage.getItem('supabase_pending_auth_data')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If we have pending auth data, validate against it
        if (pendingAuthData) {
          handleAuthCompletion(session.user, pendingAuthData)
          setPendingAuthData(null)
          localStorage.removeItem('supabase_pending_auth_data')
        } else {
          // No pending data - just fetch profile for existing authenticated users
          fetchUserProfile(session.user.id)
        }
      } else {
        setStatus('unauthenticated')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Handle auth completion based on pending auth data
          if (pendingAuthData) {
            await handleAuthCompletion(session.user, pendingAuthData)
            setPendingAuthData(null)
            localStorage.removeItem('supabase_pending_auth_data')
          } else {
            // Direct login without pending data
            await fetchUserProfile(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          setMe(null)
          setStatus('unauthenticated')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [pendingAuthData])

  const handleAuthCompletion = async (authUser: any, authData: GoogleAuthData) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('email', authUser.email!)
        .maybeSingle()

      if (profileError) {
        console.error('Error checking existing profile:', profileError)
        await supabase.auth.signOut()
        setStatus('unauthenticated')
        window.dispatchEvent(new CustomEvent('auth-error', { 
          detail: { message: `Profile lookup failed: ${profileError.message}` }
        }))
        return
      }

      // Handle signup mode
      if (authData.mode === 'signup') {
        if (existingProfile) {
          // User already exists - error
          await supabase.auth.signOut()
          setStatus('unauthenticated')
          window.dispatchEvent(new CustomEvent('auth-error', { 
            detail: { message: 'already_registered' }
          }))
          return
        } else {
          // Create new profile
          const { error: insertError } = await supabase
            .from(TABLES.USER_PROFILES)
            .insert([{
              id: authUser.id,
              email: authUser.email!,
              user_type: authData.role,
            }])

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            await supabase.auth.signOut()
            setStatus('unauthenticated')
            window.dispatchEvent(new CustomEvent('auth-error', { 
              detail: { message: `Failed to create profile: ${insertError.message}` }
            }))
            return
          }

          // For employees, also create entry in employees table
          if (authData.role === 'employee') {
            const { error: employeeError } = await supabase
              .from('employees')
              .insert([{
                user_id: authUser.id,
                full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Employee',
                email: authUser.email!,
              }])

            if (employeeError) {
              console.error('Error creating employee record:', employeeError)
              // Don't fail the entire signup, but log the error
              // The user can still function with just the user_profiles record
            }
          }

          // For employers, also create entry in employers table
          if (authData.role === 'employer') {
            const { error: employerError } = await supabase
              .from('employers')
              .insert([{
                user_id: authUser.id,
                display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Employer',
                email: authUser.email!,
              }])

            if (employerError) {
              console.error('Error creating employer record:', employerError)
              // Don't fail the entire signup, but log the error
              // The user can still function with just the user_profiles record
            }
          }
        }
      } 
      // Handle signin mode
      else if (authData.mode === 'signin') {
        if (!existingProfile) {
          // User doesn't exist - error
          await supabase.auth.signOut()
          setStatus('unauthenticated')
          window.dispatchEvent(new CustomEvent('auth-error', { 
            detail: { message: 'no_account' }
          }))
          return
        } else if (existingProfile.user_type !== authData.role) {
          // Role mismatch - show specific error message
          await supabase.auth.signOut()
          setStatus('unauthenticated')
          const correctRole = existingProfile.user_type
          const attemptedRole = authData.role
          window.dispatchEvent(new CustomEvent('auth-error', { 
            detail: { 
              message: `role_mismatch_${attemptedRole}_is_${correctRole}`,
              correctRole,
              attemptedRole
            }
          }))
          return
        }
      }

      // If we get here, auth was successful - fetch profile
      await fetchUserProfile(authUser.id)
    } catch (error) {
      console.error('Error in auth completion:', error)
      await supabase.auth.signOut()
      setStatus('unauthenticated')
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { message: 'Authentication failed' }
      }))
    }
  }

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user profile:', error)
        await supabase.auth.signOut()
        setStatus('unauthenticated')
        return
      }

      if (data) {
        setMe({
          id: data.id,
          email: data.email,
          role: data.user_type as UserRole,
          createdAt: data.created_at,
        })
        setStatus('authenticated')
      } else {
        console.warn('User profile not found')
        await supabase.auth.signOut()
        setStatus('unauthenticated')
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error)
      await supabase.auth.signOut()
      setStatus('unauthenticated')
    }
  }

  const signUpWithGoogle = async (googleAuthData: GoogleAuthData) => {
    try {
      const authData = { ...googleAuthData, mode: 'signup' as const }
      setPendingAuthData(authData)
      localStorage.setItem('supabase_pending_auth_data', JSON.stringify(authData))
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173',
          queryParams: {
            prompt: 'select_account'
          }
        }
      })

      if (error) {
        setPendingAuthData(null)
        localStorage.removeItem('supabase_pending_auth_data')
        return { error }
      }

      return { error: null }
    } catch (error) {
      setPendingAuthData(null)
      localStorage.removeItem('supabase_pending_auth_data')
      return { error: error as Error }
    }
  }

  const signInWithGoogle = async (googleAuthData: GoogleAuthData) => {
    try {
      const authData = { ...googleAuthData, mode: 'signin' as const }
      setPendingAuthData(authData)
      localStorage.setItem('supabase_pending_auth_data', JSON.stringify(authData))
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173',
          queryParams: {
            prompt: 'select_account'
          }
        }
      })

      if (error) {
        setPendingAuthData(null)
        localStorage.removeItem('supabase_pending_auth_data')
        return { error }
      }

      return { error: null }
    } catch (error) {
      setPendingAuthData(null)
      localStorage.removeItem('supabase_pending_auth_data')
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    // Clear any pending auth data first
    setPendingAuthData(null)
    
    // Sign out from Supabase - use 'global' scope to clear all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) {
      console.error('Error signing out:', error)
    }
    
    // Clear local state
    setMe(null)
    setStatus('unauthenticated')
    
    // Clear any cached data in localStorage
    localStorage.removeItem('oauth_provider_token')
    localStorage.removeItem('oauth_provider_refresh_token')
    localStorage.removeItem('supabase_pending_auth_data')
  }

  const value: AuthContextType = {
    status,
    me,
    signUpWithGoogle,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
