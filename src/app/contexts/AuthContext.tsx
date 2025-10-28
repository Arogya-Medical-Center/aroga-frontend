'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'doctor' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  picture?: string;
}

// Role-based permissions
const ROLE_PERMISSIONS = {
  doctor: {
    canAccessAll: true,
    allowedRoutes: ['/dashboard', '/patient-registration', '/patient-profile', '/BMICalculator', '/drug-inventory', '/appointments', '/calendar']
  },
  admin: {
    canAccessAll: false,
    allowedRoutes: ['/patient-registration', '/drug-inventory']
  }
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasAccess: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    
    if (storedUser && authToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    
    // Mark initial load as complete after a short delay
    setTimeout(() => setInitialLoad(false), 100);
  }, []);

  // Redirect logic based on authentication state
  useEffect(() => {
    if (isLoading || initialLoad) return;

    const isAuthPage = pathname?.startsWith('/auth');
    const isDashboardPage = pathname?.startsWith('/dashboard');

    // If logged in and on auth page, redirect to dashboard
    if (user && isAuthPage) {
      // Both doctor and admin go to admin dashboard
      router.push('/dashboard/admin');
    }

    // If not logged in and on dashboard page, redirect to login
    if (!user && isDashboardPage) {
      router.push('/auth/login/doctor');
    }

    // Check if user has permission to access current page
    if (user && pathname && user.role === 'admin') {
      const hasAccess = ROLE_PERMISSIONS.admin.allowedRoutes.some(route => 
        pathname.includes(route)
      );
      
      if (!hasAccess && !isAuthPage) {
        // Redirect admin to patient registration if accessing unauthorized page
        router.push('/patient-registration');
      }
    }
  }, [user, pathname, isLoading, initialLoad, router]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Frontend-only validation (for demo purposes)
      // In production, this should be done by backend
      if (!email || !password) {
        return false;
      }

      // Create mock user based on role
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        role: role,
      };

      // Generate mock auth token
      const mockToken = btoa(JSON.stringify({ userId: mockUser.id, role: role, exp: Date.now() + 24 * 60 * 60 * 1000 }));

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', mockToken);
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/auth/login/doctor');
  };

  const hasAccess = (route: string): boolean => {
    if (!user) return false;
    
    // Doctors have access to all routes
    if (user.role === 'doctor') {
      return true;
    }
    
    // Admins only have access to specific routes
    if (user.role === 'admin') {
      return ROLE_PERMISSIONS.admin.allowedRoutes.some(allowedRoute => 
        route.includes(allowedRoute)
      );
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
