import React, { useState } from 'react';
import {
  Users,
  Building,
  Shield,
  Activity,
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
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';


// Utility function for authenticated API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ems_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Type definitions
interface StatItem {
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
  color: string; // Add this line
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
  onSuccess?: () => void;
}

// Stats data
const stats: StatItem[] = [
  { name: 'Total Employees', value: '1,234', icon: Users, change: '+12%', changeType: 'positive', color: 'text-green-500' },
  { name: 'Departments', value: '8', icon: Building, change: '+1', changeType: 'positive', color: 'text-blue-500' },
  { name: 'Active Sessions', value: '456', icon: Activity, change: '+5%', changeType: 'positive', color: 'text-purple-500' },
  { name: 'Pending Approvals', value: '23', icon: FileText, change: '-3', changeType: 'negative', color: 'text-red-500' },
  { name: 'System Health', value: 'Good', icon: Gauge, change: 'Stable', changeType: 'positive', color: 'text-green-500' } // Added System Health stat
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

// Import HRDashboard as a named export
import { HRDashboard } from './HRDashboard';
// Refactor DashboardSwitcher to accept props
const DashboardSwitcher = ({ activeDashboard, setActiveDashboard }: { activeDashboard: string, setActiveDashboard: (role: string) => void }) => (
  <div className="flex items-center space-x-2 mb-6">
    <span className="text-sm text-[hsl(0,0%,20%)]">View as:</span>
    <div className="flex bg-muted rounded-lg p-1">
      {['super-admin', 'hr', 'manager', 'employee'].map((role) => (
        <button
          key={role}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors e  ${activeDashboard === role
            ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] shadow'
            : 'hover:bg-[hsl(0,0%,20%)] text-foreground'
            }`}
          onClick={() => setActiveDashboard(role)}
          tabIndex={0}
        >
          {role === 'super-admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

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
const CreateNewDepartmentModal: React.FC<ModalProps & { onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setError('Department name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await apiRequest('http://localhost:5001/api/departments', {
        method: 'POST',
        body: JSON.stringify({
          name: departmentName,
          description: `Department for ${departmentName}`,
        }),
      });

      console.log('Department created successfully:', data);

      // Reset form
      setDepartmentName('');
      setSelectedManager('');

      // Close modal
      onClose();
      onSuccess(); // Call the success handler

    } catch (err: any) {
      setError(err.message || 'Failed to create department');
    } finally {
      setIsLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name *</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
              placeholder="Enter department name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Manager (Optional)</label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="w-full bg-[hsl(0,0%,6%)] border border-[hsl(0,0%,15%)] rounded-md px-3 py-2 text-sm text-[hsl(0,0%,98%)] focus:outline-none focus:ring-1 focus:ring-[hsl(142,76%,36%)]"
              disabled={isLoading}
            >
              <option value="" className="bg-[hsl(0,0%,10%)]">Select manager (optional)</option>
              <option value="alex" className="bg-[hsl(0,0%,10%)]">Alex Johnson</option>
              <option value="sarah" className="bg-[hsl(0,0%,10%)]">Sarah Williams</option>
              <option value="michael" className="bg-[hsl(0,0%,10%)]">Michael Chen</option>
              <option value="robert" className="bg-[hsl(0,0%,10%)]">Robert Davis</option>
              <option value="emily" className="bg-[hsl(0,0%,10%)]">Emily Thompson</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[hsl(0,0%,15%)] rounded-md hover:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,98%)] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] rounded-md hover:bg-[hsl(142,76%,40%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${metric.status === 'excellent' ? 'bg-green-600/20 text-green-400' :
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
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('http://localhost:5001/api/departments');

      // The API returns departments directly as an array, not wrapped in a data property
      const departmentsArray = Array.isArray(data) ? data : (data.data || []);

      // Transform the data to match our Department interface
      const transformedDepartments = departmentsArray.map((dept: any) => ({
        id: dept._id,
        name: dept.name,
        employees: dept.employeeCount || 0, // Use the employeeCount from API
        manager: 'TBD' // You might want to fetch this separately
      }));

      setDepartments(transformedDepartments);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success notification
  const showSuccessNotification = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Fetch departments on component mount
  React.useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle department creation success
  const handleDepartmentCreated = () => {
    fetchDepartments(); // Refresh the list
    showSuccessNotification();
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-[hsl(0,0%,65%)]">Loading departments...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.length > 0 ? (
            departments.map(dept => (
              <div key={dept.id} className="bg-muted/30 p-4 sm:p-6 rounded-lg border border-border">
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
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-[hsl(0,0%,65%)]">
              No departments found. Create your first department!
            </div>
          )}
        </div>
      )}

      <CreateNewDepartmentModal
        isOpen={showCreateDeptModal}
        onClose={() => setShowCreateDeptModal(false)}
        onSuccess={handleDepartmentCreated}
      />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Department created successfully!
        </div>
      )}
    </div>
  );
};

// Main SuperAdminDashboard Component
export const SuperAdminDashboard = () => {
  const [showHRAccountModal, setShowHRAccountModal] = useState<boolean>(false);
  const [showSystemHealth, setShowSystemHealth] = useState<boolean>(false);
  // Add state for viewing department details
  const [viewingDept, setViewingDept] = useState<null | Department>(null);
  // Add activeDashboard state if not present
  const [activeDashboard, setActiveDashboard] = useState('super-admin');

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          :root {
            --background: 0 0% 3.9%;
            --foreground: 0 0% 98%;
            --card: 0 0% 6%;
            --card-foreground: 0 0% 98%;
            --popover: 0 0% 6%;
            --popover-foreground: 0 0% 98%;
            --primary: 142 76% 36%;
            --primary-foreground: 0 0% 98%;
            --secondary: 0 0% 14.9%;
            --secondary-foreground: 0 0% 98%;
            --muted: 0 0% 14.9%;
            --muted-foreground: 0 0% 65%;
            --accent: 0 0% 14.9%;
            --accent-foreground: 0 0% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 0 0% 98%;
            --border: 0 0% 15%;
            --input: 0 0% 15%;
            --ring: 142 76% 36%;
          }
          .bg-background { background-color: hsl(var(--background)); }
          .text-foreground { color: hsl(var(--foreground)); }
          .bg-card { background-color: hsl(var(--card)); }
          .text-card-foreground { color: hsl(var(--card-foreground)); }
          .bg-primary { background-color: hsl(var(--primary)); }
          .text-primary { color: hsl(var(--primary)); }
          .text-primary-foreground { color: hsl(var(--primary-foreground)); }
          .bg-muted { background-color: hsl(var(--muted)); }
          .text-muted-foreground { color: hsl(var(--muted-foreground)); }
          .border-border { border-color: hsl(var(--border)); }
          .hover\\:bg-primary\\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
          .hover\\:bg-muted\\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
          .font-inter { font-family: 'Inter', sans-serif; }
          .bg-yellow-500\\/20 { background-color: rgba(234, 179, 8, 0.2); }
          .text-yellow-500 { color: #eab308; }
          .bg-blue-500\\/20 { background-color: rgba(59, 130, 246, 0.2); }
          .text-blue-500 { color: #3b82f6; }
          .bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }
          .text-green-500 { color: #22c55e; }
          .bg-orange-500\\/20 { background-color: rgba(249, 115, 22, 0.2); }
          .text-orange-500 { color: #f97316; }
        `}
      </style>


      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(0,0%,98%)]">Super Admin Dashboard</h1>
            <p className="text-[hsl(0,0%,65%)] mt-2">System overview and administration controls</p>
          </div>
          <DashboardSwitcher activeDashboard={activeDashboard} setActiveDashboard={setActiveDashboard} />
        </div>
      </div>

      {activeDashboard === 'super-admin' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-card p-6 rounded-xl border border-border flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                      <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  {stat.name === 'System Health' && (
                    <Button variant="outline" size="sm" className="mt-4 border-border hover:bg-muted/50 bg-transparent text-muted-foreground" onClick={() => setShowSystemHealth(true)}>
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </Button>
                  )}
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

            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Create HR Account', icon: Users, action: () => setShowHRAccountModal(true) },
                  { name: 'System Settings', icon: Settings, action: () => { } },
                  { name: 'View Reports', icon: Activity, action: () => { } },
                  { name: 'Manage Roles', icon: Shield, action: () => { } },
                  { name: 'Create Department', icon: Building, action: () => { } },
                  { name: 'Bulk Import', icon: FileSpreadsheet, action: () => { } },
                  { name: 'Audit Settings', icon: Shield, action: () => { } },
                  { name: 'Backup System', icon: Download, action: () => { } },
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
        </>
      )}
      {activeDashboard === 'hr' && <HRDashboard />}

      {/* Modals */}


      <CreateHRAccountModal
        isOpen={showHRAccountModal}
        onClose={() => setShowHRAccountModal(false)}
      />

      <SystemHealthDetails
        isOpen={showSystemHealth}
        onClose={() => setShowSystemHealth(false)}
      />

      {viewingDept && (
        <Dialog open={!!viewingDept} onOpenChange={() => setViewingDept(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
              <Button onClick={() => setViewingDept(null)} variant="outline" size="sm" className="absolute top-4 right-4">Close</Button>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewingDept.name}</p>
              <p><strong>Manager:</strong> {viewingDept.manager}</p>
              <p><strong>Employees:</strong> {viewingDept.employees}</p>
              {/* For demo, show fake reviews, avgScore, completion */}
              <p><strong>Reviews:</strong> {20 + viewingDept.id * 5}</p>
              <p><strong>Avg Score:</strong> {(4 + (viewingDept.id % 2 ? 0.3 : 0)).toFixed(1)}/5.0</p>
              <p><strong>Completion Rate:</strong> {Math.round(((20 + viewingDept.id * 5 - (viewingDept.id % 3)) / (20 + viewingDept.id * 5)) * 100)}%</p>
              {activeDashboard === 'hr' && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="font-semibold text-primary mb-2">HR Quick Actions</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>View employee list</li>
                    <li>Assign new manager</li>
                    <li>Review department performance</li>
                    <li>Send department announcement</li>
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
