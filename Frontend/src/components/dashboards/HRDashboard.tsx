import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Briefcase,
  HardHat,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Building,
  ClipboardList
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Keep type import for type checking

// Type definitions
interface StatItem {
  name: string;
  value: string;
  icon: LucideIcon; // Changed back to LucideIcon type
  change: string;
  changeType: 'positive' | 'negative';
}

interface LeaveRequest {
  id: number;
  name: string;
  type: string;
  days: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

interface SalaryDetail {
  id: number;
  employeeName: string;
  basicPay: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  month: string;
}

interface JobVacancy {
  id: number;
  title: string;
  department: string;
  applicants: number;
  status: 'Open' | 'Closed';
}

interface TrainingRequest {
  id: number;
  employee: string;
  course: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Asset {
  id: number;
  name: string;
  assignedTo: string;
  serialNumber: string;
}

interface Document {
  id: number;
  name: string;
  employee: string;
  type: string;
  uploadDate: string;
}

interface PerformanceEvaluation {
  id: number;
  employeeName: string;
  managerName: string;
  score: number;
  date: string;
  feedback: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Mock Data
const stats: StatItem[] = [
  { name: 'Total Employees', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Pending Leaves', value: '23', icon: Calendar, change: '-5%', changeType: 'negative' },
  { name: 'This Month Payroll', value: '$2.4M', icon: DollarSign, change: '+8%', changeType: 'positive' },
  { name: 'Open Positions', value: '15', icon: UserPlus, change: '+3', changeType: 'positive' },
];

const leaveRequests: LeaveRequest[] = [
  { id: 1, name: 'John Smith', type: 'Annual Leave', days: '5 days', date: 'Dec 20-24', status: 'Pending' },
  { id: 2, name: 'Sarah Connor', type: 'Sick Leave', days: '2 days', date: 'Dec 18-19', status: 'Pending' },
  { id: 3, name: 'Mike Johnson', type: 'Personal Leave', days: '1 day', date: 'Dec 22', status: 'Pending' },
  { id: 4, name: 'Emily White', type: 'Annual Leave', days: '3 days', date: 'Jan 5-7', status: 'Approved' },
];

const employees: Employee[] = [
  { id: 1, name: 'Alice Brown', email: 'alice@example.com', department: 'Engineering', position: 'Software Engineer', status: 'Active' },
  { id: 2, name: 'Bob Green', email: 'bob@example.com', department: 'Marketing', position: 'Marketing Specialist', status: 'Active' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', department: 'HR', position: 'HR Assistant', status: 'On Leave' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', department: 'Finance', position: 'Accountant', status: 'Active' },
];

const salaryDetails: SalaryDetail[] = [
  { id: 1, employeeName: 'Alice Brown', basicPay: 5000, bonuses: 500, deductions: 100, netPay: 5400, month: 'Nov 2023' },
  { id: 2, employeeName: 'Bob Green', basicPay: 4500, bonuses: 300, deductions: 80, netPay: 4720, month: 'Nov 2023' },
  { id: 3, employeeName: 'Charlie Davis', basicPay: 3000, bonuses: 0, deductions: 50, netPay: 2950, month: 'Nov 2023' },
];

const jobVacancies: JobVacancy[] = [
  { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', applicants: 12, status: 'Open' },
  { id: 2, title: 'Product Marketing Manager', department: 'Marketing', applicants: 8, status: 'Open' },
  { id: 3, title: 'HR Recruiter', department: 'Human Resources', applicants: 5, status: 'Closed' },
];

const trainingRequests: TrainingRequest[] = [
  { id: 1, employee: 'Alice Brown', course: 'React Advanced', status: 'Pending' },
  { id: 2, employee: 'Bob Green', course: 'Digital Marketing Fundamentals', status: 'Approved' },
];

const assets: Asset[] = [
  { id: 1, name: 'MacBook Pro', assignedTo: 'Alice Brown', serialNumber: 'SN12345' },
  { id: 2, name: 'Dell Latitude', assignedTo: 'Charlie Davis', serialNumber: 'SN67890' },
];

const documents: Document[] = [
  { id: 1, name: 'Experience Letter - Alice', employee: 'Alice Brown', type: 'Experience Letter', uploadDate: '2023-10-20' },
  { id: 2, name: 'Warranty - Monitor', employee: 'N/A', type: 'Warranty', uploadDate: '2023-09-15' },
];

const performanceEvaluations: PerformanceEvaluation[] = [
  { id: 1, employeeName: 'Alice Brown', managerName: 'Alex Johnson', score: 92, date: '2023-11-01', feedback: 'Excellent performance, consistently exceeds expectations.' },
  { id: 2, employeeName: 'Bob Green', managerName: 'Sarah Williams', score: 85, date: '2023-11-05', feedback: 'Good progress, focus on improving campaign ROI.' },
];

// Reusable Modal Component
const ReusableModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modals for HR functionalities
const AddUpdateSalaryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Add/Update Employee Salary">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Employee</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Employee</option>
          {employees.map(emp => <option key={emp.id}>{emp.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Basic Pay</label>
        <input type="number" placeholder="e.g., 5000" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Bonuses</label>
        <input type="number" placeholder="e.g., 500" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Deductions</label>
        <input type="number" placeholder="e.g., 100" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Save Salary</button>
      </div>
    </div>
  </ReusableModal>
);

const MarkAttendanceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Mark Attendance">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Employee</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Employee</option>
          {employees.map(emp => <option key={emp.id}>{emp.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Date</label>
        <input type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Status</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
          <option>On Leave</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Mark Attendance</button>
      </div>
    </div>
  </ReusableModal>
);

const AddEmployeeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Add New Employee">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Full Name</label>
        <input type="text" placeholder="Employee Full Name" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Email</label>
        <input type="email" placeholder="employee@example.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Department</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Department</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Human Resources</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Position</label>
        <input type="text" placeholder="e.g., Software Engineer" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Add Employee</button>
      </div>
    </div>
  </ReusableModal>
);

const UploadJobProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Upload Job Profile">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Title</label>
        <input type="text" placeholder="e.g., Senior Software Engineer" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Department</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Department</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Human Resources</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Key Competencies</label>
        <textarea placeholder="List required skills and competencies, e.g., React, Node.js, Agile" rows={4} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Upload Profile</button>
      </div>
    </div>
  </ReusableModal>
);

const UploadDocumentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Upload Approved Document">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Document Name</label>
        <input type="text" placeholder="e.g., Experience Letter - John Doe" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Employee (if applicable)</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Employee (Optional)</option>
          {employees.map(emp => <option key={emp.id}>{emp.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Document Type</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Type</option>
          <option>Experience Letter</option>
          <option>Salary Certificate</option>
          <option>Warranty Paper</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Upload File</label>
        <input type="file" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 transition-colors" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Upload Document</button>
      </div>
    </div>
  </ReusableModal>
);

const PostJobVacancyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Create & Post Job Vacancy">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Title</label>
        <input type="text" placeholder="e.g., Marketing Manager" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Department</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Department</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Human Resources</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Description (Rich Text)</label>
        <textarea placeholder="Detailed job description, responsibilities, and qualifications..." rows={8} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Post Vacancy</button>
      </div>
    </div>
  </ReusableModal>
);

const AssignAssetModal: React.FC<ModalProps> = ({ isOpen, onClose }) => (
  <ReusableModal isOpen={isOpen} onClose={onClose} title="Assign Company Asset">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Asset Name</label>
        <input type="text" placeholder="e.g., Laptop" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Serial Number / Asset Tag</label>
        <input type="text" placeholder="e.g., SN123456789" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Assign To Employee</label>
        <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Select Employee</option>
          {employees.map(emp => <option key={emp.id}>{emp.name}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted text-foreground transition-colors">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">Assign Asset</button>
      </div>
    </div>
  </ReusableModal>
);


export function HRDashboard() { // Named export
  const [showAddSalaryModal, setShowAddSalaryModal] = useState(false);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showUploadJobProfileModal, setShowUploadJobProfileModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showPostJobVacancyModal, setShowPostJobVacancyModal] = useState(false);
  const [showAssignAssetModal, setShowAssignAssetModal] = useState(false);

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
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
          .focus\\:ring-\\[hsl\\(142\\,76\\%\\,36\\%\\)\\]:focus { ring-color: hsl(var(--primary)); }
          .hover\\:bg-\\[hsl\\(142\\,76\\%\\,40\\%\\)\\]:hover { background-color: hsl(142, 76%, 40%); }
          .hover\\:bg-\\[hsl\\(0\\,0\\%\\,10\\%\\)\\]:hover { background-color: hsl(0, 0%, 10%); }
          .hover\\:bg-\\[hsl\\(0\\,0\\%\\,20\\%\\)\\]:hover { background-color: hsl(0, 0%, 20%); }
          .text-\\[hsl\\(0\\,0\\%\\,20\\%\\)\\] { color: hsl(0, 0%, 20%); }
          .text-\\[hsl\\(0\\,0\\%\\,65\\%\\)\\] { color: hsl(0, 0%, 65%); }
          .text-\\[hsl\\(0\\,0\\%\\,98\\%\\)\\] { color: hsl(0, 0%, 98%); }
          .text-\\[hsl\\(142\\,76\\%\\,36\\%\\)\\] { color: hsl(142, 76%, 36%); }
          .text-\\[hsl\\(142\\,76\\%\\,40\\%\\)\\] { color: hsl(142, 76%, 40%); }
          .placeholder\\:text-\\[hsl\\(0\\,0\\%\\,40\\%\\)\\]::placeholder { color: hsl(0, 0%, 40%); }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
        <p className="text-muted-foreground mt-2">Human resources management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon; // Directly use the component
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
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

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <button onClick={() => setShowAddEmployeeModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <UserPlus className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Add Employee</span>
          </button>
          <button onClick={() => setShowAddSalaryModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <DollarSign className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Add/Update Salary</span>
          </button>
          <button onClick={() => setShowMarkAttendanceModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Calendar className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Mark Attendance</span>
          </button>
          <button onClick={() => setShowPostJobVacancyModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Briefcase className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Post Job Vacancy</span>
          </button>
          <button onClick={() => setShowUploadJobProfileModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <ClipboardList className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Upload Job Profile</span>
          </button>
          <button onClick={() => setShowUploadDocumentModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Upload className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Upload Document</span>
          </button>
          <button onClick={() => setShowAssignAssetModal(true)} className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <HardHat className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Assign Asset</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <FileSpreadsheet className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Bulk Import</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Building className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground text-center">Create Department</span>
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Pending Leave Requests */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pending Leave Requests</h3>
          <div className="space-y-4">
            {leaveRequests.filter(req => req.status === 'Pending').map((request) => {
              return (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.type} • {request.days}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{request.date}</p>
                    <div className="flex space-x-2 mt-1">
                      <button className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors">
                        <CheckCircle className="inline-block h-3 w-3 mr-1" /> Approve
                      </button>
                      <button className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors">
                        <XCircle className="inline-block h-3 w-3 mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {leaveRequests.filter(req => req.status === 'Pending').length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No pending leave requests.</p>
            )}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">View All Leave Records</button>
        </div>

        {/* Employee List (HR Employee Management: View all employees, Edit, Delete) */}
        <div className="bg-card p-6 rounded-xl border border-border lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Employee Directory</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  className="bg-background border border-border rounded-md pl-8 pr-3 py-1.5 text-sm w-36 sm:w-48 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-2.5" />
              </div>
              <button className="flex items-center text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted text-foreground transition-colors">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 px-4 font-medium">Name</th>
                  <th className="pb-3 px-4 font-medium">Email</th>
                  <th className="pb-3 px-4 font-medium">Department</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  return (
                    <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground">{emp.name}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{emp.email}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{emp.department}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          emp.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                          emp.status === 'On Leave' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button className="text-red-500 hover:text-red-400 text-sm flex items-center transition-colors">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payroll Summary (Payroll Management: View salary slips) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payroll Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 px-4 font-medium">Employee</th>
                  <th className="pb-3 px-4 font-medium">Net Pay</th>
                  <th className="pb-3 px-4 font-medium">Month</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.map(salary => (
                  <tr key={salary.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{salary.employeeName}</td>
                    <td className="py-3 px-4 text-sm text-foreground">${salary.netPay}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{salary.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">Generate Payroll Report</button>
        </div>

        {/* Job Vacancies (Recruitment: Create and post internal/external job vacancies) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Job Vacancies</h3>
          <div className="space-y-4">
            {jobVacancies.map(job => {
              return (
                <div key={job.id} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.department} • {job.applicants} applicants</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Open' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {job.status}
                    </span>
                    <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors">
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">Manage All Vacancies</button>
        </div>

        {/* Training & Education (Approve/reject, track progress) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Training Requests</h3>
          <div className="space-y-4">
            {trainingRequests.map(req => {
              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.employee}</p>
                    <p className="text-xs text-muted-foreground">{req.course}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400' :
                      req.status === 'Approved' ? 'bg-green-600/20 text-green-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {req.status}
                    </span>
                    {req.status === 'Pending' && (
                      <div className="flex space-x-2 mt-1">
                        <button className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors">
                          <CheckCircle className="inline-block h-3 w-3 mr-1" /> Approve
                        </button>
                        <button className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors">
                          <XCircle className="inline-block h-3 w-3 mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {trainingRequests.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No training requests.</p>
            )}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">Track All Training</button>
        </div>

        {/* Asset Management (Assign company assets) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Assigned Assets</h3>
          <div className="space-y-4">
            {assets.map(asset => {
              return (
                <div key={asset.id} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground">{asset.name}</h4>
                  <p className="text-xs text-muted-foreground">Assigned to: {asset.assignedTo}</p>
                  <p className="text-xs text-muted-foreground">S/N: {asset.serialNumber}</p>
                  <div className="flex justify-end mt-2">
                    <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors">
                      <Edit className="h-4 w-4 mr-1" /> Edit Assignment
                    </button>
                  </div>
                </div>
              );
            })}
            {assets.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No assets assigned.</p>
            )}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">View All Assets</button>
        </div>

        {/* Document Management (Upload approved documents) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded Documents</h3>
          <div className="space-y-4">
            {documents.map(doc => {
              return (
                <div key={doc.id} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">Type: {doc.type} • Employee: {doc.employee}</p>
                  <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                  <div className="flex justify-end mt-2">
                    <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </button>
                  </div>
                </div>
              );
            })}
            {documents.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No documents uploaded.</p>
            )}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">View All Documents</button>
        </div>

        {/* Performance Evaluations (View all evaluations, generate analytics) */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Evaluations</h3>
          <div className="space-y-4">
            {performanceEvaluations.map(evalu => {
              return (
                <div key={evalu.id} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground">{evalu.employeeName} ({evalu.score}%)</h4>
                  <p className="text-xs text-muted-foreground">Manager: {evalu.managerName} • Date: {evalu.date}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{evalu.feedback}</p>
                  <div className="flex justify-end mt-2">
                    <button className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors">
                      <Eye className="h-4 w-4 mr-1" /> View Full Feedback
                    </button>
                  </div>
                </div>
              );
            })}
            {performanceEvaluations.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No performance evaluations.</p>
            )}
          </div>
          <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">Generate Performance Analytics</button>
        </div>
        
        {/* Separation Requests (Process final settlements) - Placeholder */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Separation Requests</h3>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg text-muted-foreground text-sm text-center py-4">
              <p>No pending separation requests.</p>
              <p className="mt-2 text-primary">Process Final Settlements (Functionality to be implemented)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUpdateSalaryModal isOpen={showAddSalaryModal} onClose={() => setShowAddSalaryModal(false)} />
      <MarkAttendanceModal isOpen={showMarkAttendanceModal} onClose={() => setShowMarkAttendanceModal(false)} />
      <AddEmployeeModal isOpen={showAddEmployeeModal} onClose={() => setShowAddEmployeeModal(false)} />
      <UploadJobProfileModal
        isOpen={showUploadJobProfileModal}
        onClose={() => setShowUploadJobProfileModal(false)}
        title="Upload Job Profile"
      >
        {/* Empty fragment as children to satisfy ModalProps */}
        <></>
      </UploadJobProfileModal>
      <UploadDocumentModal
        isOpen={showUploadDocumentModal}
        onClose={() => setShowUploadDocumentModal(false)}
        title="Upload Approved Document"
      >
        {/* Empty fragment as children to satisfy ModalProps */}
        <></>
      </UploadDocumentModal>
      <PostJobVacancyModal
        isOpen={showPostJobVacancyModal}
        onClose={() => setShowPostJobVacancyModal(false)}
        title="Create & Post Job Vacancy"
      >
        {/* Empty fragment as children to satisfy ModalProps */}
        <></>
      </PostJobVacancyModal>
      <AssignAssetModal
        isOpen={showAssignAssetModal}
        onClose={() => setShowAssignAssetModal(false)}
        title="Assign Company Asset"
      >
        {/* Empty fragment as children to satisfy ModalProps */}
        <></>
      </AssignAssetModal>
    </div>
  );
}
