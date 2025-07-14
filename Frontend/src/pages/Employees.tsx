import { useState } from 'react';
import { Users, Plus, Search, Upload, Download, Edit, Trash2, Eye, Filter, UserPlus, DollarSign, Calendar, TrendingUp, type LucideIcon } from 'lucide-react';

// Assuming these are shadcn/ui components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// --- Interfaces ---
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive'; // Changed from 'Active' | 'On Leave' | 'Terminated' based on mock data
  joinDate: string;
}

interface StatItem {
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
}

// --- Mock Data ---
const employees: Employee[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2022-01-15', phone: '+1-555-0123' },
  { id: 2, name: 'Sarah Connor', email: 'sarah.connor@company.com', department: 'Marketing', position: 'Marketing Manager', status: 'Active', joinDate: '2021-03-22', phone: '+1-555-0124' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Sales', position: 'Sales Representative', status: 'Active', joinDate: '2023-05-10', phone: '+1-555-0125' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@company.com', department: 'HR', position: 'HR Specialist', status: 'Inactive', joinDate: '2020-08-05', phone: '+1-555-0126' },
];

const stats: StatItem[] = [
  { name: 'Total Employees', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Pending Leaves', value: '23', icon: Calendar, change: '-5%', changeType: 'negative' },
  { name: 'This Month Payroll', value: '$2.4M', icon: DollarSign, change: '+8%', changeType: 'positive' },
  { name: 'Open Positions', value: '15', icon: UserPlus, change: '+3', changeType: 'positive' },
];

const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

// --- Employees Component ---
const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      {/* Tailwind CSS configuration for custom colors and font - REMOVE THIS IF YOU HAVE GLOBAL CSS */}
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
          /* Specific HSL colors for consistency based on previous iterations */
          .text-hsl\\(0\\,\\ 0\\%\\,\\ 65\\%\\) { color: hsl(0, 0%, 65%); }
          .text-green-500 { color: hsl(142 76% 36%); } /* Approximate primary green */
          .text-red-500 { color: hsl(0 62.8% 30.6%); } /* Approximate destructive red */
          .bg-primary\\/10 { background-color: hsla(142, 76%, 36%, 0.1); }
          .bg-green-500\\/20 { background-color: hsla(142, 76%, 36%, 0.2); }
          .bg-yellow-500\\/20 { background-color: hsla(48, 96%, 45%, 0.2); } /* Assuming yellow for secondary status */
          .bg-red-500\\/20 { background-color: hsla(0, 62.8%, 30.6%, 0.2); }

          /* Font from Google Fonts */
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee records and departments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            // Card styling adjusted to match image (no border)
            <div key={stat.name} className="bg-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className={`h-4 w-4 mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search - Wrapped in a div to maintain card-like appearance */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Employee Directory</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> {/* Adjusted color */}
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            // Removed individual item borders
            <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50">
              <div className="flex items-center space-x-4">
                {/* Avatar with initials */}
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border">
                  <span className="text-sm font-medium text-primary">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {/* Employee Name & Contact */}
                <div>
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                  <p className="text-xs text-muted-foreground">{employee.phone}</p>
                </div>
                {/* Position & Department */}
                <div>
                  <p className="text-sm font-medium text-foreground">{employee.position}</p>
                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                </div>
                {/* Status Badge */}
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Joined: {employee.joinDate}</span>
                <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors" title="View Profile">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-primary hover:text-green-700 text-sm flex items-center transition-colors">
                                          <Edit className="h-4 w-4 mr-1" /> Edit
                                        </button>
                                        <button className="text-red-500 hover:text-red-400 text-sm flex items-center transition-colors">
                                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                                        </button>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No employees found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;