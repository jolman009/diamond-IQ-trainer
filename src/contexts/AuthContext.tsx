import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, LoginCredentials, SignupCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Convert Supabase user to app User type
 */
function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name:
      (metadata['display_name'] as string) ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    avatarUrl: metadata['avatar_url'] as string | undefined,
  };
}

/**
 * AuthProvider
 *
 * Manages authentication state with Supabase Auth.
 * Falls back to demo mode when Supabase is not configured.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: load from localStorage
      const savedUser = localStorage.getItem('adaptive-trainer-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          localStorage.removeItem('adaptive-trainer-user');
        }
      }
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (!isSupabaseConfigured) {
        // Demo mode
        await new Promise((resolve) => setTimeout(resolve, 500));
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: credentials.email,
          name: credentials.email.split('@')[0] || 'User',
        };
        setUser(demoUser);
        localStorage.setItem('adaptive-trainer-user', JSON.stringify(demoUser));
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!isSupabaseConfigured) {
        // Demo mode: treat signup as login
        await new Promise((resolve) => setTimeout(resolve, 500));
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: credentials.email,
          name: credentials.displayName || credentials.email.split('@')[0] || 'User',
        };
        setUser(demoUser);
        localStorage.setItem('adaptive-trainer-user', JSON.stringify(demoUser));
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            display_name: credentials.displayName || credentials.email.split('@')[0],
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        throw new Error(
          'Check your email for a confirmation link to complete signup.'
        );
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);

    if (!isSupabaseConfigured) {
      // Demo mode
      setUser(null);
      localStorage.removeItem('adaptive-trainer-user');
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error('Logout error:', signOutError);
    }
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 *
 * Access auth state and methods from anywhere in the app.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
