import { useState } from "react"
import {
  Building,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  X,
  UserCheck,
  TrendingUp,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { useAuth } from "../contexts/AuthContext"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"

const recruitmentStats = [
  { name: "Open Positions", value: "24", icon: Building, color: "text-blue-500" },
  { name: "Active Applications", value: "156", icon: FileText, color: "text-green-500" },
  { name: "Interviews Scheduled", value: "32", icon: Calendar, color: "text-purple-500" },
  { name: "Pending Approvals", value: "8", icon: Clock, color: "text-orange-500" },
]

const jobPostings = [
  {
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    applications: 45,
    posted: "2024-12-01",
    deadline: "2024-12-30",
    status: "Active",
    salary: "$95k - $120k",
    views: 234,
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "New York",
    type: "Full-time",
    applications: 28,
    posted: "2024-11-25",
    deadline: "2024-12-25",
    status: "Active",
    salary: "$75k - $90k",
    views: 189,
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "New York",
    type: "Full-time",
    applications: 28,
    posted: "2024-11-25",
    deadline: "2024-12-25",
    status: "Active",
    salary: "$75k - $90k",
    views: 189,
  },
  {
    title: "Sales Representative",
    department: "Sales",
    location: "Chicago",
    type: "Full-time",
    applications: 67,
    posted: "2024-11-20",
    deadline: "2024-12-20",
    status: "Active",
    salary: "$50k - $65k + Commission",
    views: 312,
  },
  {
    title: "UX Designer",
    department: "Design",
    location: "San Francisco",
    type: "Contract",
    applications: 34,
    posted: "2024-11-15",
    deadline: "2024-12-15",
    status: "Closed",
    salary: "$80k - $95k",
    views: 156,
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin",
    type: "Full-time",
    applications: 23,
    posted: "2024-12-05",
    deadline: "2025-01-05",
    status: "Active",
    salary: "$85k - $110k",
    views: 98,
  },
]

const hiringRequests = [
  {
    position: "DevOps Engineer",
    requestedBy: "John Smith",
    department: "Engineering",
    urgency: "High",
    requestDate: "2024-12-10",
    justification: "Team expansion for new project",
    status: "Pending",
    budget: "$100k",
  },
  {
    position: "Content Writer",
    requestedBy: "Sarah Wilson",
    department: "Marketing",
    urgency: "Medium",
    requestDate: "2024-12-08",
    justification: "Content strategy scale-up",
    status: "Approved",
    budget: "$60k",
  },
  {
    position: "Data Analyst",
    requestedBy: "Mike Johnson",
    department: "Finance",
    urgency: "Low",
    requestDate: "2024-12-05",
    justification: "Analytics team enhancement",
    status: "Pending",
    budget: "$75k",
  },
  {
    position: "Product Manager",
    requestedBy: "Emily Davis",
    department: "Product",
    urgency: "High",
    requestDate: "2024-12-12",
    justification: "New product line launch",
    status: "Under Review",
    budget: "$120k",
  },
]

const interviewSchedule = [
  {
    candidate: "Alex Johnson",
    position: "Senior Software Engineer",
    interviewer: "John Smith",
    date: "2024-12-18",
    time: "10:00 AM",
    type: "Technical",
    status: "Scheduled",
  },
  {
    candidate: "Maria Garcia",
    position: "Marketing Manager",
    interviewer: "Sarah Wilson",
    date: "2024-12-18",
    time: "2:00 PM",
    type: "Behavioral",
    status: "Scheduled",
  },
  {
    candidate: "David Kim",
    position: "UX Designer",
    interviewer: "Emily Davis",
    date: "2024-12-19",
    time: "11:00 AM",
    type: "Portfolio Review",
    status: "Completed",
  },
  {
    candidate: "Lisa Chen",
    position: "Sales Representative",
    interviewer: "Mike Johnson",
    date: "2024-12-19",
    time: "3:00 PM",
    type: "Final Round",
    status: "Scheduled",
  },
]

const recruitmentMetrics = [
  { metric: "Time to Hire", value: "18 days", trend: "down", change: "-2 days" },
  { metric: "Cost per Hire", value: "$3,200", trend: "up", change: "+$200" },
  { metric: "Application Rate", value: "12.5%", trend: "up", change: "+1.2%" },
  { metric: "Offer Acceptance", value: "85%", trend: "up", change: "+5%" },
]

// Define Job type for job vacancies
interface Job {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  requirements: string;
  startDate: string;
  endDate: string;
  specification: string;
  salary: string;
  status: string;
  applications: number;
  posted: string;
  deadline: string;
  views: number;
}

// Mock data for documents
type Document = {
  id: number;
  name: string;
  status: string;
  type: string;
  requestedBy: string;
  department: string;
  date: string;
};
const initialDocuments: Document[] = [
  { id: 1, name: "Offer Letter", status: "Approved", type: "PDF", requestedBy: "John Smith", department: "Engineering", date: "2024-12-10" },
  { id: 2, name: "Resume", status: "Pending", type: "PDF", requestedBy: "Sarah Wilson", department: "Marketing", date: "2024-12-08" },
  { id: 3, name: "Contract", status: "Approved", type: "DOCX", requestedBy: "Mike Johnson", department: "Finance", date: "2024-12-05" },
]

export default function RecruitmentDashboard() {
  const { user } = useAuth();
  const userRole = user?.role;
  const userDepartment = user?.department;
  // Role helpers
  const isSuperAdmin = userRole === 'super_admin';
  const isHR = userRole === 'hr';
  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  // Add state for job vacancy modals and search
  const [jobSearch, setJobSearch] = useState("")
  // Use Job type for jobVacancies, viewJob, editJob, deleteJob, and jobForm
  const [jobVacancies, setJobVacancies] = useState<Job[]>(jobPostings as Job[])
  const [viewJob, setViewJob] = useState<Job | null>(null)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [deleteJob, setDeleteJob] = useState<Job | null>(null)
  const [createJobOpen, setCreateJobOpen] = useState(false)
  const [jobForm, setJobForm] = useState<Job>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    requirements: "",
    startDate: "",
    endDate: "",
    specification: "",
    salary: "",
    status: "Active",
    applications: 0,
    posted: "",
    deadline: "",
    views: 0,
  })

  // Add state for hiring request modal (manager)
  const [hiringRequestOpen, setHiringRequestOpen] = useState(false)
  const [hiringRequestForm, setHiringRequestForm] = useState({
    position: '',
    justification: '',
    urgency: 'Medium',
    budget: '',
  })

  // Document management state
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [docSearch, setDocSearch] = useState("")
  const [viewDoc, setViewDoc] = useState<Document | null>(null)
  const [editDoc, setEditDoc] = useState<Document | null>(null)
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)
  const [createDocOpen, setCreateDocOpen] = useState(false)
  const [docForm, setDocForm] = useState<Document>({ name: "", type: "PDF", status: "Pending", requestedBy: user?.email || "", department: userDepartment || "", date: new Date().toISOString().slice(0, 10), id: 0 })

  // Tab state
  const [tab, setTab] = useState("jobs")

  // Add state for manager hire modal
  const [showManagerHireModal, setShowManagerHireModal] = useState(false);
  const [managerHireForm, setManagerHireForm] = useState({
    title: '',
    department: userDepartment || '',
    numEmployees: 1,
    description: '',
    justification: '',
    urgency: 'Medium',
    budget: '',
  });
  // Add state for HR job posting modal
  const [showHRJobModal, setShowHRJobModal] = useState(false);
  const [hrJobForm, setHRJobForm] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    experience: '',
    requirements: '',
    startDate: '',
    endDate: '',
    specification: '',
    salary: '',
    status: 'Active',
    internal: true,
  });

  // Filter job vacancies and hiring requests based on role
  const filteredJobs = jobVacancies.filter(job => {
    if (isManager) return job.department === userDepartment;
    if (isEmployee) return job.status === "Active";
    return true; // HR and Super Admin see all
  })

  const filteredHiringRequests = hiringRequests.filter(request => {
    if (isManager) return request.department === userDepartment;
    if (isEmployee) return false;
    return true;
  });

  // Filtered documents (approved only for search)
  const filteredDocs: Document[] = documents.filter(doc =>
    doc.status === "Approved" && doc.name.toLowerCase().includes(docSearch.toLowerCase())
  )

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
          .hover\\:bg-primary\\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
          .hover\\:bg-muted\\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruitment Management</h1>
          <p className="text-muted-foreground mt-2">Manage job postings and hiring requests</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <FileText className="h-4 w-4 mr-2" />
            Applications Report
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Interview Schedule
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>


      {/* Only show stats to Super Admin and HR */}
      {(isSuperAdmin || isHR) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recruitmentStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Only show metrics to Super Admin and HR */}
      {(isSuperAdmin || isHR) && (
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recruitment Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recruitmentMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{metric.metric}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp
                      className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500 rotate-180"}`}
                    />
                    <span className={`text-xs font-medium ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabbed Interface */}
      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          {/* Only show tabs relevant to the role */}
          <TabsTrigger value="jobs">Job Vacancies</TabsTrigger>
          {(isSuperAdmin || isHR || isManager) && <TabsTrigger value="requests">Recruitment Requests</TabsTrigger>}
          {(isSuperAdmin || isHR || isManager) && <TabsTrigger value="documents">Document Management</TabsTrigger>}
        </TabsList>
        <TabsContent value="jobs">
          <div className="bg-card p-6 rounded-xl border border-border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Job Vacancies</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search job vacancies..."
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  className="w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                />
                {/* HR can create job posting with rich text */}
                {isHR && (
                  <Button className="bg-primary hover:bg-primary/80" onClick={() => setShowHRJobModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job Posting
                  </Button>
                )}
                {/* Only Super Admin, HR, and Manager can create jobs (Manager only for their department) */}
                {(isSuperAdmin || isHR || isManager) && (
                  <Button className="bg-primary hover:bg-primary/80" onClick={() => { setCreateJobOpen(true); setJobForm({ title: "", department: isManager ? userDepartment || "" : "", location: "", type: "Full-time", experience: "", requirements: "", startDate: "", endDate: "", specification: "", salary: "", status: "Active", applications: 0, posted: "", deadline: "", views: 0 }) }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isManager ? "Create Department Job" : "Create Job Vacancy"}
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-3 py-2 text-left font-medium">Title</th>
                    <th className="px-3 py-2 text-left font-medium">Department</th>
                    <th className="px-3 py-2 text-left font-medium">Location</th>
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{job.title}</td>
                        <td className="px-3 py-2">{job.department}</td>
                        <td className="px-3 py-2">{job.location}</td>
                        <td className="px-3 py-2">{job.type}</td>
                        <td className="px-3 py-2">{job.status}</td>
                        <td className="px-3 py-2 space-x-2">
                          <Button size="sm" variant="outline" className="p-1.5" onClick={() => setViewJob(job)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* Only Super Admin, HR, or Manager (for their department) can edit. Only Super Admin/HR can delete. */}
                          {(isSuperAdmin || isHR || (isManager && job.department === userDepartment)) && (
                            <Button size="sm" variant="outline" className="p-1.5" onClick={() => { setEditJob(job); setJobForm({ ...job, experience: job.experience || "", requirements: job.requirements || "", startDate: job.startDate || job.posted || "", endDate: job.endDate || job.deadline || "", specification: job.specification || "" }) }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {(isSuperAdmin || isHR) && (
                            <Button size="sm" variant="outline" className="p-1.5 text-red-500 border-red-500" onClick={() => setDeleteJob(job)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-muted-foreground">No job vacancies found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* View Job Modal */}
          {viewJob && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setViewJob(null)}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Job Vacancy Details</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Title:</span> {viewJob.title}</div>
                  <div><span className="font-medium">Department:</span> {viewJob.department}</div>
                  <div><span className="font-medium">Location:</span> {viewJob.location}</div>
                  <div><span className="font-medium">Type:</span> {viewJob.type}</div>
                  <div><span className="font-medium">Experience:</span> {viewJob.experience || "-"}</div>
                  <div><span className="font-medium">Requirements:</span> {viewJob.requirements || "-"}</div>
                  <div><span className="font-medium">Start Date:</span> {viewJob.startDate || viewJob.posted}</div>
                  <div><span className="font-medium">End Date:</span> {viewJob.endDate || viewJob.deadline}</div>
                  <div><span className="font-medium">Specification:</span> {viewJob.specification || "-"}</div>
                  <div><span className="font-medium">Salary:</span> {viewJob.salary}</div>
                  <div><span className="font-medium">Status:</span> {viewJob.status}</div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setViewJob(null)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Close</Button>
                </div>
              </div>
            </div>
          )}
          {/* Edit/Create Job Modal: department field read-only for manager */}
          {(editJob || createJobOpen) && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => { setEditJob(null); setCreateJobOpen(false) }}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">{editJob ? "Edit Job Vacancy" : "Create Job Vacancy"}</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (editJob) {
                      setJobVacancies(prev => prev.map(j => j === editJob ? { ...editJob, ...jobForm } : j))
                      setEditJob(null)
                    } else {
                      setJobVacancies(prev => [...prev, { ...jobForm, status: "Active", applications: 0, views: 0, posted: jobForm.startDate, deadline: jobForm.endDate }])
                      setCreateJobOpen(false)
                    }
                  }}
                  className="space-y-3"
                >
                  <Input value={jobForm.title} onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required className="bg-background border-border text-foreground" />
                  <Input value={jobForm.department} onChange={e => userRole === 'manager' ? undefined : setJobForm(f => ({ ...f, department: e.target.value }))} placeholder="Department" required className="bg-background border-border text-foreground" readOnly={userRole === 'manager'} />
                  <Input value={jobForm.location} onChange={e => setJobForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" required className="bg-background border-border text-foreground" />
                  <Select value={jobForm.type} onValueChange={val => setJobForm(f => ({ ...f, type: val }))}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={jobForm.experience} onChange={e => setJobForm(f => ({ ...f, experience: e.target.value }))} placeholder="Experience (e.g., 3+ years)" className="bg-background border-border text-foreground" />
                  <Input value={jobForm.requirements} onChange={e => setJobForm(f => ({ ...f, requirements: e.target.value }))} placeholder="Requirements" className="bg-background border-border text-foreground" />
                  <Input type="date" value={jobForm.startDate} onChange={e => setJobForm(f => ({ ...f, startDate: e.target.value }))} placeholder="Application Start Date" className="bg-background border-border text-foreground" required />
                  <Input type="date" value={jobForm.endDate} onChange={e => setJobForm(f => ({ ...f, endDate: e.target.value }))} placeholder="Application End Date" className="bg-background border-border text-foreground" required />
                  <Input value={jobForm.specification} onChange={e => setJobForm(f => ({ ...f, specification: e.target.value }))} placeholder="Job Specification" className="bg-background border-border text-foreground" />
                  <Input value={jobForm.salary} onChange={e => setJobForm(f => ({ ...f, salary: e.target.value }))} placeholder="Salary" className="bg-background border-border text-foreground" />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => { setEditJob(null); setCreateJobOpen(false) }} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">{editJob ? "Save" : "Create"}</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Delete Job Modal */}
          {deleteJob && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-sm relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setDeleteJob(null)}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Delete Job Vacancy</h3>
                <p className="mb-4 text-muted-foreground">Are you sure you want to delete this job vacancy?</p>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteJob(null)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                  <Button type="button" className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm" onClick={() => { setJobVacancies(prev => prev.filter(j => j !== deleteJob)); setDeleteJob(null); }}>Delete</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="requests">
          {/* Only Super Admin, HR, and Manager can see this tab */}
          {(isSuperAdmin || isHR || isManager) && (
            <div className="bg-card p-6 rounded-xl border border-border mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Hiring Requests</h3>
                {/* Manager can request new hire with rich text */}
                {isManager && (
                  <Button className="bg-primary hover:bg-primary/80" onClick={() => setShowManagerHireModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Request New Hire
                  </Button>
                )}
                {isManager && (
                  <Button className="bg-primary hover:bg-primary/80" onClick={() => setHiringRequestOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Hiring Request
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {filteredHiringRequests.map((request, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {request.requestedBy.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{request.position}</p>
                          <p className="text-xs text-muted-foreground">{request.requestedBy} • {request.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={request.urgency === 'High' ? 'destructive' : request.urgency === 'Medium' ? 'secondary' : 'default'}
                          className={request.urgency === 'High' ? 'bg-red-500/20 text-red-400' : request.urgency === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}
                        >
                          {request.urgency}
                        </Badge>
                        <Badge
                          variant={request.status === 'Approved' ? 'default' : 'secondary'}
                          className={request.status === 'Approved' ? 'bg-green-500/20 text-green-400' : request.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-foreground mb-2">{request.justification}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Budget: {request.budget}</span>
                        <span>•</span>
                        <span>{request.requestDate}</span>
                      </div>
                      <div className="flex space-x-2">
                        {/* Only Super Admin and HR can approve/reject requests */}
                        {(isSuperAdmin || isHR) && request.status === 'Pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent">
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Hiring Request Modal for Manager */}
          {hiringRequestOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setHiringRequestOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">New Hiring Request</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    // Add hiring request logic here
                    setHiringRequestOpen(false);
                  }}
                  className="space-y-3"
                >
                  <Input value={hiringRequestForm.position} onChange={e => setHiringRequestForm(f => ({ ...f, position: e.target.value }))} placeholder="Position" required className="bg-background border-border text-foreground" />
                  <Input value={hiringRequestForm.justification} onChange={e => setHiringRequestForm(f => ({ ...f, justification: e.target.value }))} placeholder="Justification" required className="bg-background border-border text-foreground" />
                  <Select value={hiringRequestForm.urgency} onValueChange={val => setHiringRequestForm(f => ({ ...f, urgency: val }))}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={hiringRequestForm.budget} onChange={e => setHiringRequestForm(f => ({ ...f, budget: e.target.value }))} placeholder="Budget" className="bg-background border-border text-foreground" />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => setHiringRequestOpen(false)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">Submit</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents">
          {/* Only Super Admin, HR, and Manager can see this tab */}
          {(isSuperAdmin || isHR || isManager) && (
            <div className="bg-card p-6 rounded-xl border border-border mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Document Management</h3>
                <Button className="bg-primary hover:bg-primary/80" onClick={() => { setCreateDocOpen(true); setDocForm({ name: "", type: "PDF", status: "Pending", requestedBy: user?.email || "", department: userDepartment || "", date: new Date().toISOString().slice(0, 10), id: 0 }) }}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isManager ? "Request Department Document" : "New Document Request"}
                </Button>
              </div>
              <Input
                placeholder="Search approved documents..."
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                className="w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2 mb-4"
              />
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-3 py-2 text-left font-medium">Name</th>
                      <th className="px-3 py-2 text-left font-medium">Type</th>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                      <th className="px-3 py-2 text-left font-medium">Requested By</th>
                      <th className="px-3 py-2 text-left font-medium">Department</th>
                      <th className="px-3 py-2 text-left font-medium">Date</th>
                      <th className="px-3 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <tr key={doc.id} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">{doc.name}</td>
                          <td className="px-3 py-2">{doc.type}</td>
                          <td className="px-3 py-2">{doc.status}</td>
                          <td className="px-3 py-2">{doc.requestedBy}</td>
                          <td className="px-3 py-2">{doc.department}</td>
                          <td className="px-3 py-2">{doc.date}</td>
                          <td className="px-3 py-2 space-x-2">
                            <Button size="sm" variant="outline" className="p-1.5" onClick={() => setViewDoc(doc)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* Only Super Admin, HR, or Manager (for their department) can edit. Only Super Admin/HR can delete. */}
                            {(isSuperAdmin || isHR || (isManager && doc.department === userDepartment)) && (
                              <Button size="sm" variant="outline" className="p-1.5" onClick={() => { setEditDoc(doc); setDocForm(doc) }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {(isSuperAdmin || isHR) && (
                              <Button size="sm" variant="outline" className="p-1.5 text-red-500 border-red-500" onClick={() => setDeleteDoc(doc)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted-foreground">No approved documents found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* View Document Modal */}
          {viewDoc && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setViewDoc(null)}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Document Details</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Name:</span> {viewDoc.name}</div>
                  <div><span className="font-medium">Type:</span> {viewDoc.type}</div>
                  <div><span className="font-medium">Status:</span> {viewDoc.status}</div>
                  <div><span className="font-medium">Requested By:</span> {viewDoc.requestedBy}</div>
                  <div><span className="font-medium">Department:</span> {viewDoc.department}</div>
                  <div><span className="font-medium">Date:</span> {viewDoc.date}</div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setViewDoc(null)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Close</Button>
                </div>
              </div>
            </div>
          )}
          {/* Create/Edit Document Modal */}
          {(editDoc || createDocOpen) && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => { setEditDoc(null); setCreateDocOpen(false) }}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">{editDoc ? "Edit Document" : "New Document Request"}</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (editDoc) {
                      setDocuments(prev => prev.map(d => d.id === editDoc.id ? { ...editDoc, ...docForm } : d))
                      setEditDoc(null)
                    } else {
                      setDocuments(prev => [...prev, { ...docForm, id: Date.now() }])
                      setCreateDocOpen(false)
                    }
                  }}
                  className="space-y-3"
                >
                  <Input value={docForm.name} onChange={e => setDocForm(f => ({ ...f, name: e.target.value }))} placeholder="Document Name" required className="bg-background border-border text-foreground" />
                  <Select value={docForm.type} onValueChange={val => setDocForm(f => ({ ...f, type: val }))}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={docForm.status} onValueChange={val => setDocForm(f => ({ ...f, status: val }))}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={docForm.requestedBy} onChange={e => setDocForm(f => ({ ...f, requestedBy: e.target.value }))} placeholder="Requested By" required className="bg-background border-border text-foreground" />
                  <Input value={docForm.department} onChange={e => setDocForm(f => ({ ...f, department: e.target.value }))} placeholder="Department" required className="bg-background border-border text-foreground" />
                  <Input type="date" value={docForm.date} onChange={e => setDocForm(f => ({ ...f, date: e.target.value }))} placeholder="Date" className="bg-background border-border text-foreground" required />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => { setEditDoc(null); setCreateDocOpen(false) }} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">{editDoc ? "Save" : "Create"}</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Delete Document Modal */}
          {deleteDoc && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-sm relative">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setDeleteDoc(null)}>
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Delete Document</h3>
                <p className="mb-4 text-muted-foreground">Are you sure you want to delete this document?</p>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteDoc(null)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                  <Button type="button" className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm" onClick={() => { setDocuments(prev => prev.filter(d => d.id !== deleteDoc.id)); setDeleteDoc(null); }}>Delete</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Interview Schedule */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Interviews</h3>
        <div className="space-y-4">
          {interviewSchedule.map((interview, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{interview.candidate}</p>
                    <p className="text-xs text-muted-foreground">{interview.position}</p>
                  </div>
                </div>
                <Badge
                  variant={interview.status === "Completed" ? "default" : "secondary"}
                  className={
                    interview.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }
                >
                  {interview.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {interview.date} at {interview.time}
                  </span>
                </div>
                <p>Interviewer: {interview.interviewer}</p>
                <p>Type: {interview.type}</p>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-muted/50 bg-transparent">
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                {interview.status === "Scheduled" && (
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/80">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Manager New Hire Modal */}
      {showManagerHireModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setShowManagerHireModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Request New Hire</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                // Add logic to submit new hire request
                setShowManagerHireModal(false);
              }}
              className="space-y-3"
            >
              <Input value={managerHireForm.title} onChange={e => setManagerHireForm(f => ({ ...f, title: e.target.value }))} placeholder="Job Title" required className="bg-background border-border text-foreground" />
              <Input value={managerHireForm.department} readOnly placeholder="Department" required className="bg-background border-border text-foreground" />
              <Input type="number" value={managerHireForm.numEmployees} onChange={e => setManagerHireForm(f => ({ ...f, numEmployees: Number(e.target.value) }))} placeholder="Number of Employees" required className="bg-background border-border text-foreground" min={1} />
              {/* Rich text editor placeholder for job description */}
              <textarea value={managerHireForm.description} onChange={e => setManagerHireForm(f => ({ ...f, description: e.target.value }))} placeholder="Job Description (Rich Text Supported)" className="bg-background border-border text-foreground h-24" />
              <Input value={managerHireForm.justification} onChange={e => setManagerHireForm(f => ({ ...f, justification: e.target.value }))} placeholder="Justification" required className="bg-background border-border text-foreground" />
              <Select value={managerHireForm.urgency} onValueChange={val => setManagerHireForm(f => ({ ...f, urgency: val }))}>
                <SelectTrigger className="w-full bg-background border-border text-foreground">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input value={managerHireForm.budget} onChange={e => setManagerHireForm(f => ({ ...f, budget: e.target.value }))} placeholder="Budget" className="bg-background border-border text-foreground" />
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowManagerHireModal(false)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Job Posting Modal */}
      {showHRJobModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-card w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setShowHRJobModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Create Job Posting</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                // Add logic to create job posting
                setShowHRJobModal(false);
              }}
              className="space-y-3"
            >
              <Input value={hrJobForm.title} onChange={e => setHRJobForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required className="bg-background border-border text-foreground" />
              <Input value={hrJobForm.department} onChange={e => setHRJobForm(f => ({ ...f, department: e.target.value }))} placeholder="Department" required className="bg-background border-border text-foreground" />
              <Select value={hrJobForm.type} onValueChange={val => setHRJobForm(f => ({ ...f, type: val }))}>
                <SelectTrigger className="w-full bg-background border-border text-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Input value={hrJobForm.experience} onChange={e => setHRJobForm(f => ({ ...f, experience: e.target.value }))} placeholder="Experience (e.g., 3+ years)" className="bg-background border-border text-foreground" />
              <Input value={hrJobForm.requirements} onChange={e => setHRJobForm(f => ({ ...f, requirements: e.target.value }))} placeholder="Requirements" className="bg-background border-border text-foreground" />
              <Input type="date" value={hrJobForm.startDate} onChange={e => setHRJobForm(f => ({ ...f, startDate: e.target.value }))} placeholder="Application Start Date" className="bg-background border-border text-foreground" required />
              <Input type="date" value={hrJobForm.endDate} onChange={e => setHRJobForm(f => ({ ...f, endDate: e.target.value }))} placeholder="Application End Date" className="bg-background border-border text-foreground" required />
              {/* Rich text editor placeholder for job specification */}
              <textarea value={hrJobForm.specification} onChange={e => setHRJobForm(f => ({ ...f, specification: e.target.value }))} placeholder="Job Specification (Rich Text Supported)" className="bg-background border-border text-foreground h-24" />
              <Input value={hrJobForm.salary} onChange={e => setHRJobForm(f => ({ ...f, salary: e.target.value }))} placeholder="Salary" className="bg-background border-border text-foreground" />
              <Select value={hrJobForm.status} onValueChange={val => setHRJobForm(f => ({ ...f, status: val }))}>
                <SelectTrigger className="w-full bg-background border-border text-foreground">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {/* Internal/External toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-foreground">Internal</label>
                <input type="checkbox" checked={hrJobForm.internal} onChange={e => setHRJobForm(f => ({ ...f, internal: e.target.checked }))} />
                <label className="text-foreground">External</label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowHRJobModal(false)} className="border-border hover:bg-muted/50 text-xs sm:text-sm">Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
