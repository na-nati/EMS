import { useState } from "react"
import { Users, Plus, Search, Upload, Download, Edit, Trash2, Eye, Filter, Building, DollarSign } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Label } from "../components/ui/lable" // Corrected import path for Label
import { useAuth, type UserRole } from "../contexts/AuthContext" // Import useAuth and UserRole
import { apiRequest } from '../lib/apiClient';
import React from "react"
interface Employee {
  id: number
  employeeId: string
  name: string
  email: string
  department: string
  position: string
  status: "Active" | "Inactive" | "On Leave"
  joinDate: string
  phone: string
  salary: number
  experience: number
}

interface DashboardStats {
  totalEmployees: number
  totalDepartments: number
  statusBreakdown: {
    active: number
    inactive: number
    onLeave: number
  }
  avgSalary: number
}
type Department = {
  _id: string;
  name: string;
  description?: string;
};



const employeeStatuses = ["All Statuses", "Active", "Inactive", "On Leave"]

const Employees = () => {
  const { user, isLoading } = useAuth()
  const userRole: UserRole = user?.role || "employee"
  const [employees, setEmployees] = useState<Employee[]>([])
  const [dashboardStats,setDashboardStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = React.useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    salary: "",
    experience: "",
    joinDate: "",
  })
  const [departments, setDepartments] = useState<Department[]>([]);



React.useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const query = new URLSearchParams({
        page: "1",
        limit: "50",
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(selectedStatus !== "All Statuses" ? { employment_status: selectedStatus } : {}),
        ...(selectedDepartment !== "All Departments" ? { department: selectedDepartment } : {}),
        ...(minSalary ? { minSalary } : {}),
        ...(maxSalary ? { maxSalary } : {}),
      });

      const res = await apiRequest(`/employees?${query.toString()}`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  fetchEmployees();
}, [searchTerm, selectedStatus, selectedDepartment, minSalary, maxSalary]);

React.useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await apiRequest('/departments');
      setDepartments(res); // res should be your array of departments
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  fetchDepartments();
}, []);

  React.useEffect(() => {
  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    try {
      console.log("🔍 Fetching dashboard stats from:", `${apiBaseUrl}/employees/stats/all`);

      // Use your existing apiRequest function to fetch the stats
      const response = await apiRequest(`${apiBaseUrl}/employees/stats/all`);
      console.log("📊 Dashboard Stats API Response:", response);

      // Assuming your backend returns data like: { data: { totalEmployees, totalDepartments, statusBreakdown, avgSalary } }
      if (response?.data) {
        setDashboardStats(response.data); // ✅ save to state
        console.log("📈 Dashboard Stats Data:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  fetchDashboardStats();
}, []);


  // Permissions based on user role
  const isAdmin = userRole === "super_admin"
  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const canAdd = isHR || isAdmin // Only HR and Admin can add employees
  const canEdit = isHR || isAdmin
  const canDelete = isHR || isAdmin 
  const canViewDetails = isAdmin || isHR || isManager || userRole === "employee" // All roles can view details
  const canImportExport = isAdmin || isHR
  const canViewSalary = isAdmin || isHR


  // Map backend employees to your Employee type
const mappedEmployees: Employee[] = employees.map((emp: any) => ({
  id: emp._id,
  employeeId: emp.employee_code,
  name: emp.user_id ? `${emp.user_id.firstName} ${emp.user_id.lastName}` : "Unknown",
  email: emp.user_id?.email || "",
  department: emp.department_id?.name || "Unknown",
  position: emp.job_profile,
  status: emp.employment_status,
  joinDate: emp.joining_date,
  phone: emp.phone_number,
  salary: emp.salary_id?.netSalary || 0,
  experience: 0,
}));


// Filter employees based on search + filters
const filteredEmployees = mappedEmployees.filter((employee) => {
  const search = searchTerm.toLowerCase();
  const matchesSearch =
    employee.name.toLowerCase().includes(search) ||
    employee.email.toLowerCase().includes(search) ||
    employee.employeeId.toLowerCase().includes(search);

  const matchesDepartment =
    selectedDepartment === "All Departments" ||
    employee.department === selectedDepartment;

  const matchesStatus =
    selectedStatus === "All Statuses" || employee.status === selectedStatus;

  const matchesMinSalary = minSalary === "" || employee.salary >= Number(minSalary);
  const matchesMaxSalary = maxSalary === "" || employee.salary <= Number(maxSalary);

  return matchesSearch && matchesDepartment && matchesStatus && matchesMinSalary && matchesMaxSalary;
});

  const resetForm = () => {
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      department: "",
      position: "",
      phone: "",
      salary: "",
      experience: "",
      joinDate: "",
    })
  }

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      status: "Active", // Default status for new employees
      joinDate: formData.joinDate,
      phone: formData.phone,
      salary: Number(formData.salary),
      experience: Number(formData.experience),
    }
    setEmployees([...employees, newEmployee])
    setShowAddModal(false)
    resetForm()
  }

  const handleEditEmployee = () => {
    if (!selectedEmployee) return
    const updatedEmployee = {
      ...selectedEmployee,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      phone: formData.phone,
      salary: Number(formData.salary),
      experience: Number(formData.experience),
      joinDate: formData.joinDate,
    }
    setEmployees(employees.map((emp) => (emp.id === selectedEmployee.id ? updatedEmployee : emp)))
    setShowEditModal(false)
    setSelectedEmployee(null)
    resetForm()
  }

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id))
    setShowDeleteModal(false)
    setSelectedEmployee(null)
  }

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      salary: employee.salary.toString(),
      experience: employee.experience.toString(),
      joinDate: employee.joinDate,
    })
    setShowEditModal(true)
  }

  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowViewModal(true)
  }

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDeleteModal(true)
  }

  const handleApplyMoreFilters = () => {
    // Filters are already applied via state changes in the input fields
    setShowMoreFiltersModal(false)
  }
  const handleDepartmentChange = async (departmentId: string) => {
  setSelectedDepartment(departmentId);

  try {
    const res = await apiRequest(`/employees/department/${departmentId}`);
    // res should be { success: true, data: [...] }
    if (res.success) {
      const mapped = res.data.map((emp: any) => ({
        id: emp._id,
        employeeId: emp.employee_code,
        name: emp.user_id ? `${emp.user_id.firstName} ${emp.user_id.lastName}` : "Unknown",
        email: emp.user_id?.email || "",
        department: emp.department_id?.name || "Unknown",
        position: emp.job_profile,
        status: emp.employment_status,
        joinDate: emp.joining_date,
        phone: emp.phone_number,
        salary: emp.salary_id?.netSalary || 0,
        experience: 0,
      }));
      setEmployees(mapped);
    }
  } catch (err) {
    console.error("Failed to fetch employees by department:", err);
  }
};


  const handleClearMoreFilters = () => {
    setSelectedStatus("All Statuses")
    setMinSalary("")
    setMaxSalary("")
    setShowMoreFiltersModal(false)
  }

  if (isLoading) {
    return <div className="text-center mt-10 text-muted-foreground">Loading...</div>
  }
  if (!user) {
    return <div className="text-center mt-10 text-destructive">Unauthorized access. Please log in.</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground">
      {/* Tailwind CSS configuration for custom colors */}
      <style>
        {`
          :root {
            --background: 0 0% 3.9%;
            --foreground: 0 0% 98%;
            --card: 0 0% 6%;
            --card-foreground: 0 0% 98%;
            --primary: 142 76% 36%;
            --primary-foreground: 0 0% 98%;
            --muted: 0 0% 14.9%;
            --muted-foreground: 0 0% 65%;
            --border: 0 0% 15%;
          }
          .bg-background { background-color: hsl(var(--background)); }
          .text-foreground { color: hsl(var(--foreground)); }
          .bg-card { background-color: hsl(var(--card)); }
          .bg-primary { background-color: hsl(var(--primary)); }
          .text-primary { color: hsl(var(--primary)); }
          .text-primary-foreground { color: hsl(var(--primary-foreground)); }
          .bg-muted { background-color: hsl(var(--muted)); }
          .text-muted-foreground { color: hsl(var(--muted-foreground)); }
          .border-border { border-color: hsl(var(--border)); }
        `}
      </style>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee records and departments</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {canImportExport && (
            <Button variant="outline" className="hover:bg-muted/50 bg-transparent shadow-sm">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          )}
          {canAdd && (
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/80 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card text-foreground shadow-lg">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="EMP001"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
  <Label htmlFor="department">Department</Label>
  <Select
    value={formData.department}
    onValueChange={(value) => setFormData({ ...formData, department: value })}
  >
    <SelectTrigger className="bg-background">
      <SelectValue placeholder="Select department" />
    </SelectTrigger>
    <SelectContent className="bg-card">
      {departments.map((dept) => (
        <SelectItem key={dept._id} value={dept._id}>
          {dept.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Software Engineer"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        placeholder="75000"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience (Years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="5"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1-555-0123"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="hover:bg-muted/50 shadow-sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} className="bg-primary hover:bg-primary/80 shadow-sm">
                    Add Employee
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {loadingStats ? '...' : dashboardStats?.totalEmployees || employees.length}
              </p>
            </div>
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {loadingStats ? '...' : dashboardStats?.statusBreakdown.active || employees.filter((e) => e.status === "Active").length}
              </p>
            </div>
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departments</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {loadingStats ? '...' : dashboardStats?.totalDepartments || new Set(employees.map((e) => e.department)).size}
              </p>
            </div>
            <Building className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Salary</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                ${loadingStats ? '...' : 
                  Math.round(dashboardStats?.avgSalary || 
                  employees.reduce((sum, e) => sum + e.salary, 0) / employees.length).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
        </div>
      </div>
      {/* Employee Directory */}
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Employee Directory</h3>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
<Select
  value={selectedDepartment}
  onValueChange={(val) => setSelectedDepartment(val)}
>
  <SelectTrigger className="w-full sm:w-48 bg-background">
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent className="bg-card">
    <SelectItem value="All Departments">All Departments</SelectItem>
    {departments.map((dept) => (
      <SelectItem key={dept._id} value={dept._id}>
        {dept.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>




            <Dialog open={showMoreFiltersModal} onOpenChange={setShowMoreFiltersModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hover:bg-muted/50 bg-transparent shadow-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card text-foreground shadow-lg">
                <DialogHeader>
                  <DialogTitle>More Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="filterStatus">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {employeeStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="minSalary">Min Salary</Label>
                    <Input
                      id="minSalary"
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="e.g., 30000"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSalary">Max Salary</Label>
                    <Input
                      id="maxSalary"
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="e.g., 100000"
                      className="bg-background"
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClearMoreFilters}
                    className="hover:bg-muted/50 bg-transparent shadow-sm"
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={handleApplyMoreFilters} className="bg-primary hover:bg-primary/80 shadow-sm">
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {canImportExport && (
              <Button variant="outline" className="hover:bg-muted/50 bg-transparent shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="p-4 rounded-lg bg-muted/30 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                  </div>
                </div>
                <Badge
                  variant={employee.status === "Active" ? "default" : "secondary"}
                  className={
                    employee.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }
                >
                  {employee.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Position:</span>
                  <p className="text-foreground">{employee.position}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <p className="text-foreground">{employee.department}</p>
                </div>
                {canViewSalary && (
                  <div>
                    <span className="text-muted-foreground">Salary:</span>
                    <p className="text-foreground">${employee.salary.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <p className="text-foreground">{employee.experience} years</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                {canViewDetails && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openViewModal(employee)}
                    className="hover:bg-muted/50 shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(employee)}
                    className="hover:bg-muted/50 shadow-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteModal(employee)}
                    className="hover:bg-muted/50 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Desktop Table View */}
        <div className="hidden lg:block space-y-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.employeeId} • {employee.department}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="text-center min-w-[70px]">
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="text-sm font-medium text-foreground mt-1">{employee.position}</p>
                </div>
                {canViewSalary && (
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm font-medium text-foreground mt-1">${employee.salary.toLocaleString()}</p>
                  </div>
                )}
                <div className="text-center min-w-[70px]">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-medium text-foreground mt-1">{employee.experience} years</p>
                </div>
                <Badge
                  className={`${
                    employee.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  } w-20 justify-center`}
                >
                  {employee.status}
                </Badge>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  {canViewDetails && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openViewModal(employee)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(employee)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(employee)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Edit Employee Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl bg-card text-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editEmployeeId">Employee ID</Label>
                <Input
                  id="editEmployeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDepartment">Department</Label>
                <Select
  value={selectedDepartment}
  onValueChange={(val) => handleDepartmentChange(val)}
>
  <SelectTrigger className="w-full sm:w-48 bg-background">
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent className="bg-card">
    {departments.map((dept) => (
      <SelectItem key={dept._id} value={dept._id}>
        {dept.name} {/* <-- Render the department name */}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

              </div>
              <div>
                <Label htmlFor="editPosition">Position</Label>
                <Input
                  id="editPosition"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editSalary">Salary</Label>
                <Input
                  id="editSalary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="editExperience">Experience (Years)</Label>
                <Input
                  id="editExperience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="editJoinDate">Join Date</Label>
                <Input
                  id="editJoinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                resetForm()
                setSelectedEmployee(null)
              }}
              className="hover:bg-muted/50 shadow-sm"
            >
              Cancel
            </Button>
            <Button onClick={handleEditEmployee} className="bg-primary hover:bg-primary/80 shadow-sm">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl bg-card text-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                  <p className="text-foreground">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground">{selectedEmployee.name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{selectedEmployee.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p className="text-foreground">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Position</label>
                  <p className="text-foreground">{selectedEmployee.position}</p>
                </div>
              </div>
              {canViewSalary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Salary</label>
                    <p className="text-foreground">${selectedEmployee.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="text-foreground">{selectedEmployee.experience} years</p>
                  </div>
                </div>
              )}
              {!canViewSalary && ( // Display experience if salary is hidden
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="text-foreground">{selectedEmployee.experience} years</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <p className="text-foreground">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge
                    variant={selectedEmployee.status === "Active" ? "default" : "secondary"}
                    className={
                      selectedEmployee.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }
                  >
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowViewModal(false)
                setSelectedEmployee(null)
              }}
              className="hover:bg-muted/50 shadow-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md bg-card text-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{selectedEmployee?.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedEmployee(null)
              }}
              className="hover:bg-muted/50 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              className="bg-destructive hover:bg-destructive/80 shadow-sm"
            >
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Employees
