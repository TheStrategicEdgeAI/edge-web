import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * A minimal AuthContext stub.
 *
 * This simplified context always returns `null` for the user and sets
 * `loading` to false.  In a production build you would integrate
 * NextAuth or another auth provider here and expose the current user
 * and loading state.  This stub allows pages like Design and Evolve
 * to render without throwing errors while still demonstrating how
 * entitlements might be checked.
 */
interface AuthContextType {
  /**
   * Currently authenticated user.  When null, no user is logged in.
   */
  user: any;
  /**
   * Whether the authentication state is still being resolved.
   */
  loading: boolean;
  /**
   * Logs out the current user.  In this stub it simply sets the user to null.
   */
  logout: () => void;
  /**
   * Logs in a user.  In this stub it stores the provided user object.
   */
  login: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  logout: () => {},
  login: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = (userData: any) => {
    // In a full implementation you would authenticate against your API
    // and store tokens/cookies as needed.  Here we simply set the user.
    setUser(userData);
    setLoading(false);
  };
  const logout = () => {
    // Clear the current user.  A real implementation would also clear
    // session cookies or inform your backend.
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}