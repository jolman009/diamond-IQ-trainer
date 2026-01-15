/**
 * Auth Types
 *
 * Represents user authentication state.
 * In M7, this will connect to Supabase.
 * For now, it's a local demo with localStorage persistence.
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
