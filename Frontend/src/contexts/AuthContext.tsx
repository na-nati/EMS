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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

    // DEMO MODE: Demo logins for all roles
    if (email === "hr@company.com") {
      const demoUser = {
        id: "demo-hr",
        firstName: "Demo",
        lastName: "HR",
        email: "demo-hr@ems.com",
        role: "hr" as UserRole,
        department: "Engineering",
        position: "HR Manager"
      };
      setUser(demoUser);
      localStorage.setItem('ems_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }
    if (email === "employee@company.com") {
      const demoUser = {
        id: "demo-employee",
        firstName: "Demo",
        lastName: "Employee",
        email: "demo-employee@ems.com",
        role: "employee" as UserRole,
        department: "Marketing",
        position: "Sales Rep"
      };
      setUser(demoUser);
      localStorage.setItem('ems_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }
    if (email === "manager@company.com") {
      const demoUser = {
        id: "demo-manager",
        firstName: "Demo",
        lastName: "Manager",
        email: "demo-manager@ems.com",
        role: "manager" as UserRole,
        department: "Sales",
        position: "Sales Manager"
      };
      setUser(demoUser);
      localStorage.setItem('ems_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }
    if (email === "admin@company.com") {
      const demoUser = {
        id: "demo-admin",
        firstName: "Demo",
        lastName: "Admin",
        email: "demo-admin@ems.com",
        role: "super_admin" as UserRole,
        department: "Administration",
        position: "System Admin"
      };
      setUser(demoUser);
      localStorage.setItem('ems_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
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
