import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TABLES } from '../lib/supabase'
import { AuthState, User, UserRole, GoogleAuthData } from '../types/auth'

interface AuthContextType extends AuthState {
  signUpWithGoogle: (data: GoogleAuthData) => Promise<{ error: Error | null }>
  signInWithGoogle: (data: GoogleAuthData) => Promise<{ error: Error | null }>
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
          // Get auth intent from localStorage
          const authIntent = localStorage.getItem('auth_intent')
          const authRole = localStorage.getItem('auth_role') as UserRole
          
          // Check if profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from(TABLES.USER_PROFILES)
            .select('*')
            .eq('email', session.user.email!)
            .maybeSingle() // Use maybeSingle to handle 0 rows gracefully

          // Handle profile lookup errors
          if (profileError) {
            console.error('Error checking existing profile:', profileError)
            localStorage.removeItem('auth_intent')
            localStorage.removeItem('auth_role')
            await supabase.auth.signOut()
            setUser(null)
            setPendingRole(null)
            setLoading(false)
            window.dispatchEvent(new CustomEvent('auth-error', { 
              detail: { message: `Profile lookup failed: ${profileError.message}` }
            }))
            return
          }

          if (authIntent === 'signup') {
            // User trying to sign up
            if (existingProfile) {
              // User already exists - show error and sign out
              localStorage.removeItem('auth_intent')
              localStorage.removeItem('auth_role')
              await supabase.auth.signOut()
              setUser(null)
              setPendingRole(null)
              setLoading(false)
              // This error will be handled by the forms
              window.dispatchEvent(new CustomEvent('auth-error', { 
                detail: { message: 'User already exists. Please use sign in instead.' }
              }))
              return
            } else {
              // New user - create profile
              const { error: insertError } = await supabase
                .from(TABLES.USER_PROFILES)
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email!,
                    user_type: authRole,
                  },
                ])

              if (insertError) {
                console.error('Error creating user profile:', insertError)
                localStorage.removeItem('auth_intent')
                localStorage.removeItem('auth_role')
                await supabase.auth.signOut()
                setUser(null)
                setPendingRole(null)
                setLoading(false)
                // Dispatch error event for better user feedback
                window.dispatchEvent(new CustomEvent('auth-error', { 
                  detail: { message: `Failed to create profile: ${insertError.message}` }
                }))
                return
              }
            }
          } else if (authIntent === 'signin') {
            // User trying to sign in
            if (!existingProfile) {
              // User doesn't exist - show error and sign out
              localStorage.removeItem('auth_intent')
              localStorage.removeItem('auth_role')
              await supabase.auth.signOut()
              setUser(null)
              setPendingRole(null)
              setLoading(false)
              // This error will be handled by the forms
              window.dispatchEvent(new CustomEvent('auth-error', { 
                detail: { message: 'Account was not found. Please sign up first.' }
              }))
              return
            }
          }

          // Clear auth intent after processing
          localStorage.removeItem('auth_intent')
          localStorage.removeItem('auth_role')
          
          await fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setPendingRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [pendingRole])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle to handle 0 rows gracefully

      if (error) {
        console.error('Error fetching user profile:', error)
        // On errors, sign out to prevent auth state inconsistency
        await supabase.auth.signOut()
        setUser(null)
        setPendingRole(null)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          role: data.user_type as UserRole,
          createdAt: data.created_at,
        })
      } else {
        // No profile found for authenticated user
        console.warn('User profile not found, user may need to complete registration')
        await supabase.auth.signOut()
        setUser(null)
        setPendingRole(null)
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error)
      // On unexpected errors, sign out to prevent auth state inconsistency
      await supabase.auth.signOut()
      setUser(null)
      setPendingRole(null)
    }
  }

  const signUpWithGoogle = async (googleAuthData: GoogleAuthData) => {
    try {
      setLoading(true)
      setPendingRole(googleAuthData.role)
      
      // Store signup intent in localStorage to validate after OAuth callback
      localStorage.setItem('auth_intent', 'signup')
      localStorage.setItem('auth_role', googleAuthData.role)
      
      // Start Google OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000'
        }
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (googleAuthData: GoogleAuthData) => {
    try {
      setLoading(true)
      setPendingRole(googleAuthData.role)
      
      // Store signin intent in localStorage to validate after OAuth callback
      localStorage.setItem('auth_intent', 'signin')
      localStorage.setItem('auth_role', googleAuthData.role)
      
      // Start Google OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000'
        }
      })

      if (error) {
        return { error }
      }

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
    signUpWithGoogle,
    signInWithGoogle,
    signOut,
    setUserRole,
    pendingRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
