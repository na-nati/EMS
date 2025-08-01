import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';


// ✅ Exported so it can be used in other files
export type UserRole = 'super_admin' | 'hr' | 'manager' | 'employee';

// User interface to match backend
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user && data.token) {
        // If backend returns only name, split it
        let userObj = data.user;
        if (!userObj.firstName && userObj.name) {
          const [firstName, ...rest] = userObj.name.split(' ');
          userObj.firstName = firstName;
          userObj.lastName = rest.join(' ');
        }
        setUser(userObj);
        localStorage.setItem('ems_user', JSON.stringify(userObj));
        localStorage.setItem('ems_token', data.token);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ems_user');
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('ems_token');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setUser(data.data);
          localStorage.setItem('ems_user', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
