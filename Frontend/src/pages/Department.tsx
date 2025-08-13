import React, { useEffect, useState } from 'react';
import {
  PlusCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { apiRequest } from '../lib/apiClient';

// Type definitions
interface Department {
  id: number | string;
  name: string;
  employees: number;
  manager: string;
}

interface Employee {
  id: number | string;
  name: string;
  position: string;
  email: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Create New Department Modal Component
const CreateNewDepartmentModal: React.FC<ModalProps & { onSuccess: () => void }> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [departmentName, setDepartmentName] = useState('');
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [error, setError] = useState('');

  // Fetch managers when modal opens
  useEffect(() => {
    const fetchManagers = async () => {
      if (!isOpen) return;

      setIsLoadingManagers(true);
      setError('');
      try {
        const response = await apiRequest('/api/managers/managers');
        console.log('Managers API response:', response);

        // Handle the specific response format
        if (response.success && Array.isArray(response.data)) {
          setManagers(response.data);
        } else {
          console.error('Unexpected API response format');
          setError('Unexpected data format from server');
        }
      } catch (err: any) {
        console.error('Failed to fetch managers:', err);
        setError('Failed to load managers. Please try again.');
      } finally {
        setIsLoadingManagers(false);
      }
    };

    fetchManagers();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setError('Department name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const departmentData = {
        name: departmentName,
        description: `Department for ${departmentName}`,
        ...(selectedManagerId && { manager: selectedManagerId })
      };

      const response = await apiRequest('/api/departments', {
        method: 'POST',
        body: JSON.stringify(departmentData),
      });

      console.log('Department created:', response);

      // If a manager was selected, update their department assignment
      if (selectedManagerId && response._id) {
        try {
          await apiRequest(`/api/users/${selectedManagerId}/assign-department`, {
            method: 'PATCH',
            body: JSON.stringify({
              departmentId: response._id
            }),
          });
        } catch (updateError) {
          console.error('Failed to update manager department:', updateError);
          // Continue even if this fails
        }
      }

      // Reset form
      setDepartmentName('');
      setSelectedManagerId('');

      // Close modal and refresh data
      onClose();
      onSuccess();

    } catch (err: any) {
      console.error('Error creating department:', err);
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
          <h3 className="text-lg font-semibold text-foreground">Create New Department</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Department Name *</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter department name"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Manager (Optional)</label>
            {isLoadingManagers ? (
              <div className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground">
                Loading managers...
              </div>
            ) : managers.length === 0 ? (
              <div className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground">
                {error || 'No managers available'}
              </div>
            ) : (
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="">Select manager (optional)</option>
                {managers.map(manager => (
                  <option
                    key={manager._id}
                    value={manager._id}
                  >
                    {manager.firstName} {manager.lastName}
                    {manager.department ? ` (Current: ${manager.department.name})` : ''}
                  </option>
                ))}
              </select>
            )}
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
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isLoadingManagers}
            >
              {isLoading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Department Modal Component
const EditDepartmentModal: React.FC<{
  department: Department | null;
  onClose: () => void;
  onSave: (id: number, name: string, manager: string) => void
}> = ({ department, onClose, onSave }) => {
  const [name, setName] = useState(department?.name || '');
  const [manager, setManager] = useState(department?.manager || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!department) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSave(Number(department.id), name, manager);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Edit Department</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Manager</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select manager</option>
              <option value="Alex Johnson">Alex Johnson</option>
              <option value="Sarah Williams">Sarah Williams</option>
              <option value="Michael Chen">Michael Chen</option>
              <option value="Robert Davis">Robert Davis</option>
              <option value="Emily Thompson">Emily Thompson</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Employees Modal Component
const ViewEmployeesModal = ({
  department,
  onClose
}: {
  department: Department;
  onClose: () => void
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees when modal opens
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError('');
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const data = await apiRequest(`${apiBaseUrl}/employees/department/${department.id}`);

        // Defensive check to ensure we always get an array
        const employeeArray = Array.isArray(data?.data) ? data.data : [];

        // Log raw employee data here
        console.log('Raw employee data:', employeeArray);

        setEmployees(employeeArray.map((emp: any) => {
          const user = emp.user_id || {};
          const fullName =
            (user.firstName || '') + (user.lastName ? ` ${user.lastName}` : '');

          return {
            id: emp._id || emp.id,
            name: fullName.trim() || user.username || user.email || 'N/A',
            position: emp.job_profile || 'N/A',
            email: user.email || 'N/A'
          };
        }));

      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.message || 'Failed to fetch employees. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [department.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-foreground mb-4">Employees in {department.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">Manager: {department.manager}</p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading employees...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            {error}
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto pr-2">
              {employees.length > 0 ? (
                employees.map(employee => (
                  <div key={employee.id} className="bg-muted/30 p-3 rounded-md mb-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                      <p className="text-xs text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found in this department.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors font-medium shadow-sm"
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded-md transition-colors font-medium shadow-sm"
              >
                Export List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main Departments Component (only Employee Management Section)
const Departments = () => {
  const [showCreateDeptModal, setShowCreateDeptModal] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [, setShowViewEmployeesModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [, setShowEditModal] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const data = await apiRequest(`${apiBaseUrl}/departments`);

      // The API returns departments directly as an array, not wrapped in a data property
      const departmentsArray = Array.isArray(data) ? data : (data.data || []);

      // Transform the data to match our Department interface
      const transformedDepartments = departmentsArray.map((dept: any) => ({
        id: dept._id,
        name: dept.name,
        employees: dept.employeeCount || 0, // Use the employeeCount from API
        manager: dept.manager || 'N/A'      // Use the manager from API
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

  const openViewEmployeesModal = (department: Department) => {
    console.log('Opening modal for:', department);
    setSelectedDepartment(department);
    setShowViewEmployeesModal(true);
  };

  const closeViewEmployeesModal = () => {
    setShowViewEmployeesModal(false);
    setSelectedDepartment(null);
  };

  // Function to open the Edit modal
  const openEditModal = (department: Department) => {
    setDepartmentToEdit(department);
    setShowEditModal(true);
  };

  // Function to close the Edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setDepartmentToEdit(null);
  };

  // Function to handle saving department changes
  const handleSaveDepartment = async (id: number, name: string, manager: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      await apiRequest(`${apiBaseUrl}/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, manager }),
      });

      // Update the local state
      setDepartments(departments.map(dept =>
        dept.id === id ? { ...dept, name, manager } : dept
      ));

      showSuccessNotification();
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };

  return (
    <>
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
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow font-inter">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {departments.length > 0 ? (
              departments.map(dept => (
                <div key={dept.id} className="bg-card p-4 sm:p-6 rounded-lg shadow-sm hover:border hover:border-[hsl(142,76%,36%)] transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-[hsl(0,0%,98%)]">{dept.name}</h4>
                      <p className="text-sm text-[hsl(0,0%,65%)] mt-1">{dept.employees} employees</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm flex items-center text-[hsl(0,0%,98%)]">
                      <span className="text-[hsl(0,0%,65%)] mr-2">Manager:</span>
                      {dept.manager}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => openViewEmployeesModal(dept)}
                      className="text-xs bg-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,20%)] rounded px-2 py-1 text-[hsl(0,0%,98%)] transition-colors"
                    >
                      View Employees
                    </button>
                    <button
                      onClick={() => openEditModal(dept)}
                      className="text-xs bg-[hsl(0,0%,10%)] hover:bg-[hsl(0,0%,20%)] rounded px-2 py-1 text-[hsl(0,0%,98%)] transition-colors"
                    >
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

        {selectedDepartment && (
          <ViewEmployeesModal
            department={selectedDepartment}
            onClose={closeViewEmployeesModal}
          />
        )}

        {departmentToEdit && (
          <EditDepartmentModal
            department={departmentToEdit}
            onClose={closeEditModal}
            onSave={handleSaveDepartment}
          />
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            Operation completed successfully!
          </div>
        )}
      </div>
    </>
  );
};

export default Departments;