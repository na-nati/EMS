import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  Shield, 
  Activity, 
  TrendingUp, 
  FileText,
  PlusCircle,
  Download,
  Eye,
  Settings,
  FileSpreadsheet,
  Search,
  Filter,
  ChevronDown,
  Gauge
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Type definitions
interface StatItem {
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
}

interface AuditLog {
  id: number;
  action: string;
  user: string;
  target: string;
  time: string;
  ip: string;
}

interface Department {
  id: number;
  name: string;
  employees: number;
  manager: string;
}

interface HealthMetric {
  name: string;
  value: string;
  status: 'excellent' | 'good' | 'warning';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Stats data
const stats: StatItem[] = [
  { name: 'Total Employees', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Departments', value: '8', icon: Building, change: '+1', changeType: 'positive' },
  { name: 'Active Sessions', value: '456', icon: Activity, change: '+5%', changeType: 'positive' },
  { name: 'Pending Approvals', value: '23', icon: FileText, change: '-3', changeType: 'negative' },
  { name: 'System Health', value: 'Good', icon: Gauge, change: 'Stable', changeType: 'positive' } // Added System Health stat
];

// Audit logs data
const auditLogs: AuditLog[] = [
  { id: 1, action: 'HR account created', user: 'Super Admin', target: 'Jane Doe (HR)', time: '2 minutes ago', ip: '192.168.1.5' },
  { id: 2, action: 'Role permissions updated', user: 'Super Admin', target: 'Payroll Module', time: '15 minutes ago', ip: '192.168.1.5' },
  { id: 3, action: 'Department created', user: 'HR Manager', target: 'IT Department', time: '1 hour ago', ip: '192.168.1.12' },
  { id: 4, action: 'User deleted', user: 'HR Manager', target: 'John Smith', time: '3 hours ago', ip: '192.168.1.8' },
  { id: 5, action: 'System backup completed', user: 'System', target: 'Database Backup', time: '4 hours ago', ip: '192.168.1.1' },
  { id: 6, action: 'Security settings updated', user: 'Super Admin', target: 'Password Policy', time: '6 hours ago', ip: '192.168.1.5' },
  { id: 7, action: 'Bulk import completed', user: 'HR Manager', target: '25 employees', time: '8 hours ago', ip: '192.168.1.8' },
  { id: 8, action: 'Audit log exported', user: 'Super Admin', target: 'audit_log_2023-10-15.csv', time: '10 hours ago', ip: '192.168.1.5' },
];

// Departments data
const departments: Department[] = [
  { id: 1, name: 'Engineering', employees: 42, manager: 'Alex Johnson' },
  { id: 2, name: 'Marketing', employees: 18, manager: 'Sarah Williams' },
  { id: 3, name: 'Human Resources', employees: 12, manager: 'Michael Chen' },
  { id: 4, name: 'Finance', employees: 9, manager: 'Robert Davis' },
  { id: 5, name: 'Operations', employees: 27, manager: 'Emily Thompson' },
];

// Dashboard Switcher Component
const DashboardSwitcher = () => {
  const [activeDashboard, setActiveDashboard] = useState<string>('super-admin');
  
  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-sm text-[hsl(0,0%,20%)]">View as:</span>
      <div className="flex bg-muted rounded-lg p-1">
        <button 
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeDashboard === 'super-admin' 
              ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)]' 
              : 'hover:bg-[hsl(0,0%,20%)]'
          }`}
          onClick={() => setActiveDashboard('super-admin')}
        >
          Super Admin
        </button>
        <button 
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeDashboard === 'hr' 
              ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)]' 
              : 'hover:bg-[hsl(0,0%,20%)]'
          }`}
          onClick={() => setActiveDashboard('hr')}
        >
          HR
        </button>
        <button 
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeDashboard === 'manager' 
              ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)]' 
              : 'hover:bg-[hsl(0,0%,20%)]'
          }`}
          onClick={() => setActiveDashboard('manager')}
        >
          Manager
        </button>
        <button 
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeDashboard === 'employee' 
              ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)]' 
              : 'hover:bg-[hsl(0,0%,20%)]'
          }`}
          onClick={() => setActiveDashboard('employee')}
        >
          Employee
        </button>
      </div>
    </div>
  );
};

// Create HR Account Modal Component
const CreateHRAccountModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create HR Account</h3>
          <button onClick={onClose} className="text-[hsl(0,0%,65%)] hover:text-[hsl(0,0%,98%)]">
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]">
              <option className="bg-[hsl(0,0%,10%)]">Select department</option>
              <option className="bg-[hsl(0,0%,10%)]">Human Resources</option>
              <option className="bg-[hsl(0,0%,10%)]">Payroll</option>
              <option className="bg-[hsl(0,0%,10%)]">Recruitment</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[hsl(0,0%,15%)] rounded-md hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors"
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md hover:bg-[hsl(142,76%,40%)] transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create New Department Modal Component
const CreateNewDepartmentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Department</h3>
          <button onClick={onClose} className="text-[hsl(0,0%,65%)] hover:text-[hsl(0,0%,98%)]">
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name</label>
            <input 
              type="text" 
              className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
              placeholder="Enter department name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manager</label>
            <select className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]">
              <option className="bg-[hsl(0,0%,10%)]">Select manager</option>
              <option className="bg-[hsl(0,0%,10%)]">Alex Johnson</option>
              <option className="bg-[hsl(0,0%,10%)]">Sarah Williams</option>
              <option className="bg-[hsl(0,0%,10%)]">Michael Chen</option>
              <option className="bg-[hsl(0,0%,10%)]">Robert Davis</option>
              <option className="bg-[hsl(0,0%,10%)]">Emily Thompson</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[hsl(0,0%,15%)] rounded-md hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md hover:bg-[hsl(142,76%,40%)] transition-colors">
              Create Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// System Health Details Component
const SystemHealthDetails: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const healthMetrics: HealthMetric[] = [
    { name: 'API Response Time', value: '142ms', status: 'good' },
    { name: 'Database Uptime', value: '99.98%', status: 'excellent' },
    { name: 'Server CPU Usage', value: '32%', status: 'good' },
    { name: 'Memory Usage', value: '68%', status: 'warning' },
    { name: 'Pending Jobs', value: '24', status: 'warning' },
    { name: 'Security Threats', value: '0', status: 'excellent' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">System Health Details</h3>
          <button onClick={onClose} className="text-[hsl(0,0%,65%)] hover:text-[hsl(0,0%,98%)]">
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="bg-[hsl(0,0%,6%)] p-4 rounded-lg border border-[hsl(0,0%,15%)]">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-[hsl(0,0%,98%)]">{metric.name}</h4>
                  <p className="text-2xl font-bold mt-1 text-[hsl(0,0%,98%)]">{metric.value}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.status === 'excellent' ? 'bg-green-600/20 text-green-400' :
                  metric.status === 'good' ? 'bg-blue-600/20 text-blue-400' :
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-[hsl(0,0%,6%)] p-4 rounded-lg border border-[hsl(0,0%,15%)]">
          <h4 className="font-medium mb-2 text-[hsl(0,0%,98%)]">System Recommendations</h4>
          <ul className="text-sm space-y-1 text-[hsl(0,0%,65%)]">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Database performance is optimal
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Memory usage is higher than usual - consider optimization
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Job queue has pending items - review worker processes
            </li>
          </ul>
        </div>
        
        <div className="flex justify-end pt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md hover:bg-[hsl(142,76%,40%)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Audit Logs Section Component
const AuditLogsSection = () => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-[hsl(0,0%,98%)] mb-3 sm:mb-0">Audit Logs</h3>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md pl-8 pr-3 py-1.5 text-sm w-full sm:w-48 text-[hsl(0,0%,98%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
            />
            <Search className="h-4 w-4 text-[hsl(0,0%,65%)] absolute left-2.5 top-2.5" />
          </div>
          <button className="flex items-center text-sm border border-[hsl(0,0%,15%)] rounded-md px-3 py-1.5 hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </button>
          <button className="flex items-center text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md px-3 py-1.5 hover:bg-[hsl(142,76%,40%)] transition-colors">
            <Download className="h-4 w-4 mr-1" /> Export
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[hsl(0,0%,15%)] text-left text-sm text-[hsl(0,0%,65%)]">
              <th className="pb-3 px-4 font-medium">Action</th>
              <th className="pb-3 px-4 font-medium">Performed By</th>
              <th className="pb-3 px-4 font-medium">Target</th>
              <th className="pb-3 px-4 font-medium">Time</th>
              <th className="pb-3 px-4 font-medium">IP Address</th>
              <th className="pb-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,10%)]/30 transition-colors">
                <td className="py-3 px-4 text-sm text-[hsl(0,0%,98%)]">{log.action}</td>
                <td className="py-3 px-4 text-sm text-[hsl(0,0%,98%)]">{log.user}</td>
                <td className="py-3 px-4 text-sm text-[hsl(0,0%,98%)]">{log.target}</td>
                <td className="py-3 px-4 text-sm text-[hsl(0,0%,98%)]">{log.time}</td>
                <td className="py-3 px-4 text-sm text-[hsl(0,0%,98%)]">{log.ip}</td>
                <td className="py-3 px-4">
                  <button className="text-[hsl(142,76%,36%)] hover:text-[hsl(142,76%,40%)] flex items-center text-sm transition-colors">
                    <Eye className="h-4 w-4 mr-1" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
        <div className="text-sm text-[hsl(0,0%,65%)] mb-2 sm:mb-0">
          Showing 1 to 8 of 1,245 entries
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-[hsl(0,0%,15%)] rounded-md text-sm hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-[hsl(0,0%,15%)] rounded-md text-sm hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-[hsl(0,0%,15%)] rounded-md text-sm hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            3
          </button>
          <button className="px-3 py-1 border border-[hsl(0,0%,15%)] rounded-md text-sm hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Employee Management Section Component
const EmployeeManagementSection = () => {
  const [showCreateDeptModal, setShowCreateDeptModal] = useState<boolean>(false);
  
  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-[hsl(0,0%,98%)] mb-3 sm:mb-0">Departments & Employees</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowCreateDeptModal(true)}
            className="flex items-center text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md px-3 py-1.5 hover:bg-[hsl(142,76%,40%)] transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Create Department
          </button>
          <button className="flex items-center text-sm border border-[hsl(0,0%,15%)] rounded-md px-3 py-1.5 hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Bulk Import
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => (
          <div key={dept.id} className="bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-[hsl(0,0%,98%)]">{dept.name}</h4>
                <p className="text-sm text-[hsl(0,0%,65%)] mt-1">{dept.employees} employees</p>
              </div>
              <button className="text-[hsl(0,0%,65%)] hover:text-[hsl(0,0%,98%)] transition-colors">
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-sm flex items-center text-[hsl(0,0%,98%)]">
                <span className="text-[hsl(0,0%,65%)] mr-2">Manager:</span>
                {dept.manager}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="text-xs bg-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,20%)] rounded px-2 py-1 text-[hsl(0,0%,98%)] transition-colors">
                View Employees
              </button>
              <button className="text-xs bg-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,20%)] rounded px-2 py-1 text-[hsl(0,0%,98%)] transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <CreateNewDepartmentModal 
        isOpen={showCreateDeptModal} 
        onClose={() => setShowCreateDeptModal(false)} 
      />
    </div>
  );
};

// Main SuperAdminDashboard Component
export const SuperAdminDashboard = () => {
  const [showHRAccountModal, setShowHRAccountModal] = useState<boolean>(false);
  const [showSystemHealth, setShowSystemHealth] = useState<boolean>(false);
  
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
      

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(0,0%,98%)]">Super Admin Dashboard</h1>
            <p className="text-[hsl(0,0%,65%)] mt-2">System overview and administration controls</p>
          </div>
          <DashboardSwitcher />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSystemHealth = stat.name === 'System Health';
          
          return (
            <div 
              key={stat.name} 
              className={`bg-card p-6 rounded-xl border border-border ${
                isSystemHealth ? 'cursor-pointer hover:border-[hsl(142,76%,36%)] transition-colors' : ''
              }`}
              onClick={isSystemHealth ? () => setShowSystemHealth(true) : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(0,0%,65%)]">{stat.name}</p>
                  <p className="text-2xl font-bold text-[hsl(0,0%,98%)] mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  stat.name === 'Audit Events' ? 'bg-purple-600/20' : 'bg-[hsl(142,76%,36%)]/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.name === 'Audit Events' ? 'text-purple-400' : 'text-[hsl(142,76%,36%)]'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                )}
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                } font-medium`}>
                  {stat.change}
                </span>
                <span className="text-sm text-[hsl(0,0%,65%)] ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Management */}
      <EmployeeManagementSection />

      {/* Audit Logs & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AuditLogsSection />
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Create HR Account', icon: Users, action: () => setShowHRAccountModal(true) },
              { name: 'System Settings', icon: Settings, action: () => {} },
              { name: 'View Reports', icon: Activity, action: () => {} },
              { name: 'Manage Roles', icon: Shield, action: () => {} },
              { name: 'Create Department', icon: Building, action: () => {} },
              { name: 'Bulk Import', icon: FileSpreadsheet, action: () => {} },
              { name: 'Audit Settings', icon: Shield, action: () => {} },
              { name: 'Backup System', icon: Download, action: () => {} },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.name}
                  className="flex flex-col items-center p-4 bg-[hsl(0,0%,10%)]/30 rounded-lg hover:bg-[hsl(0,0%,10%)]/50 transition-colors"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6 text-[hsl(0,0%,98%)] mb-2" />
                  <span className="text-sm font-medium text-[hsl(0,0%,98%)] text-center">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CreateHRAccountModal 
        isOpen={showHRAccountModal} 
        onClose={() => setShowHRAccountModal(false)} 
      />
      
      <SystemHealthDetails 
        isOpen={showSystemHealth} 
        onClose={() => setShowSystemHealth(false)} 
      />
    </div>
  );
};
