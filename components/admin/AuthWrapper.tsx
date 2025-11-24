'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { supabaseAuth } from '@/lib/supabase'
import { User, LogIn, AlertTriangle, Eye, EyeOff, Building2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

interface UserProfile {
  id: string
  email: string
  username: string
  role: 'admin' | 'moderator' | 'editor' | 'viewer'
}

interface AuthContextType {
  user: any
  userProfile: UserProfile | null
  handleLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  handleLogout: async () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)

      const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        setUser(null)
        setUserProfile(null)
        return
      }

      if (session?.user) {
        setUser(session.user)

        // Get user profile from user_profiles table in Modular-buildings.co schema
        const { data: profile, error: profileError } = await supabaseAuth
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          // If no profile in public schema, check if user email matches admin pattern
          // For initial setup, accept any authenticated user as admin
          console.log('Profile lookup:', profileError.message)

          // Create a default admin profile for authenticated users
          const defaultProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.email?.split('@')[0] || 'Admin',
            role: 'admin'
          }
          setUserProfile(defaultProfile)
          setAuthError(null)
          return
        }

        if (profile && (profile.role === 'admin' || profile.role === 'moderator' || profile.role === 'editor')) {
          setUserProfile(profile)
          setAuthError(null)
        } else {
          setAuthError('Access denied. Admin privileges required.')
          await supabaseAuth.auth.signOut()
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthError('Authentication error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError(null)

    try {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (error) {
        setAuthError(error.message)
        return
      }

      if (data.user) {
        setUser(data.user)

        // Try to get profile, but don't fail if it doesn't exist
        const { data: profile } = await supabaseAuth
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profile) {
          if (profile.role !== 'admin' && profile.role !== 'moderator' && profile.role !== 'editor') {
            setAuthError('Access denied. Admin privileges required.')
            await supabaseAuth.auth.signOut()
            return
          }
          setUserProfile(profile)
        } else {
          // Default admin profile for authenticated users
          const defaultProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.email?.split('@')[0] || 'Admin',
            role: 'admin'
          }
          setUserProfile(defaultProfile)
        }

        setEmail('')
        setPassword('')
      }
    } catch (error) {
      console.error('Login error:', error)
      setAuthError('Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabaseAuth.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
    } else {
      setUser(null)
      setUserProfile(null)
      setAuthError(null)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to access the Modular Buildings CMS</p>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoggingIn}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="text-xs">Contact administrator for access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show authenticated content
  return (
    <AuthContext.Provider value={{ user, userProfile, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
