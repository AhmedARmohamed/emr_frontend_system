import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials } from '../types';
import keycloak from '../services/keycloak';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    initKeycloak();
  }, []);

  const initKeycloak = async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      });

      setKeycloakInitialized(true);

      if (authenticated) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      toast.error('Authentication service unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await keycloak.loadUserProfile();
      const token = keycloak.tokenParsed;
      
      const user: User = {
        id: profile.id || '',
        username: profile.username || '',
        email: profile.email || '',
        role: token?.roles?.[0] || 'USER',
      };

      setUser(user);
      
      // Store token for API calls
      if (keycloak.token) {
        localStorage.setItem('authToken', keycloak.token);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const login = async (credentials?: LoginCredentials) => {
    try {
      setIsLoading(true);
      await keycloak.login({
        redirectUri: window.location.origin,
      });
    } catch (error: any) {
      toast.error('Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      await keycloak.logout({
        redirectUri: window.location.origin,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Set up token refresh
  useEffect(() => {
    if (keycloakInitialized && keycloak.authenticated) {
      const updateToken = () => {
        keycloak.updateToken(30).then((refreshed) => {
          if (refreshed) {
            localStorage.setItem('authToken', keycloak.token!);
          }
        }).catch(() => {
          console.error('Failed to refresh token');
          logout();
        });
      };

      // Refresh token every 30 seconds
      const interval = setInterval(updateToken, 30000);
      return () => clearInterval(interval);
    }
  }, [keycloakInitialized]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading: isLoading || !keycloakInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};