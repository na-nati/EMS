import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Monitor,
  BarChart3,
  LogOut,
  Building
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'hr', 'manager', 'employee'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: [ 'hr', 'manager'] },
  { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['super_admin', 'hr', 'employee'] },
  { name: 'Attendance', href: '/attendance', icon: Calendar, roles: [ 'hr', 'manager', 'employee'] },
  { name: 'Leave Management', href: '/leave', icon: FileText, roles: [ 'hr', 'manager', 'employee'] },
  { name: 'Performance', href: '/performance', icon: ClipboardCheck, roles: ['super_admin', 'hr', 'manager', 'employee'] },
  { name: 'Training', href: '/training', icon: GraduationCap, roles: ['hr','super_admin'] },
  { name: 'Training Programs', href: '/training-emp', icon: GraduationCap, roles: ['employee'] },
  { name: 'Assets', href: '/assets', icon: Monitor, roles: ['super_admin', 'hr', 'employee'] },
  { name: 'Recruitment', href: '/recruitment', icon: Building, roles: ['super_admin', 'hr', 'manager'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['super_admin', 'hr', 'manager'] },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="flex flex-col w-64 bg-[hsl(0,0%,6%)] border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[hsl(142,76%,36%)] rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">EMS</h1>
            <p className="text-xs text-gray-400">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-[hsl(142,76%,36%)] rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};