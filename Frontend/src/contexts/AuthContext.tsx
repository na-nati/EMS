import React, {
    createContext,
    useContext,
    useState,
    useEffect,
  } from 'react';
import type { ReactNode } from 'react';
  
  // ✅ Exported so it can be used in other files
  export type UserRole = 'super_admin' | 'hr' | 'manager' | 'employee';
  
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department: string;
  }
  
  interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
  }
  
  // Mock users
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@company.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      department: 'Administration',
    },
    {
      id: '2',
      email: 'hr@company.com',
      firstName: 'HR',
      lastName: 'Manager',
      role: 'hr',
      department: 'Human Resources',
    },
    {
      id: '3',
      email: 'manager@company.com',
      firstName: 'Team',
      lastName: 'Manager',
      role: 'manager',
      department: 'Engineering',
    },
    {
      id: '4',
      email: 'employee@company.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee',
      department: 'Engineering',
    },
  ];
  

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
  
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const foundUser = mockUsers.find(u => u.email === email);
  
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('ems_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
  
      setIsLoading(false);
      return false;
    };
  
    const logout = () => {
      setUser(null);
      localStorage.removeItem('ems_user');
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
  