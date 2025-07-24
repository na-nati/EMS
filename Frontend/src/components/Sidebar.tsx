import { useState } from 'react';
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
  Building,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'hr', 'manager', 'employee'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: ['hr', 'manager','super_admin'] },
  { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['super_admin', 'hr', 'employee', 'manager'] },
  { name: 'Attendance', href: '/attendance', icon: Calendar, roles: ['hr', 'manager', 'employee', 'super_admin'] },
  { name: 'Leave Management', href: '/leave', icon: FileText, roles: ['hr', 'manager', 'employee'] },
  { name: 'Performance', href: '/performance', icon: ClipboardCheck, roles: ['super_admin', 'hr', 'manager', 'employee'] },
  { name: 'Training', href: '/training', icon: GraduationCap, roles: ['hr', 'super_admin'] },
  { name: 'Training Programs', href: '/training-emp', icon: GraduationCap, roles: ['employee'] },
  { name: 'Assets', href: '/assets', icon: Monitor, roles: ['super_admin', 'hr', 'employee'] },
  { name: 'Recruitment', href: '/recruitment', icon: Building, roles: ['super_admin', 'hr', 'manager'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['super_admin', 'hr','employee'] },
  { name: 'Separation Request', href: '/separation-request', icon: FileText, roles: ['employee', 'manager', 'hr'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['super_admin', 'hr', 'manager'] },
  
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-4 text-white fixed top-0 left-0 z-50"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-[hsl(0,0%,6%)]  transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 ">
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
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)} // Close sidebar on mobile nav
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
          <div className="p-4 ">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-[hsl(142,76%,36%)] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
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
      </div>
    </>
  );
};
