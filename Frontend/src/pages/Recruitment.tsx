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
  MapPin,
  DollarSign,
  X,
  UserCheck,
  TrendingUp,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

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

export default function RecruitmentDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedStatus, setSelectedStatus] = useState("All Status")

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

      {/* Recruitment Stats */}
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

      {/* Recruitment Metrics */}
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

      {/* Job Postings */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Job Postings</h3>
          <div className="flex space-x-3">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48 bg-background border-border">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All Departments" className="text-foreground hover:bg-muted/50">
                  All Departments
                </SelectItem>
                <SelectItem value="Engineering" className="text-foreground hover:bg-muted/50">
                  Engineering
                </SelectItem>
                <SelectItem value="Marketing" className="text-foreground hover:bg-muted/50">
                  Marketing
                </SelectItem>
                <SelectItem value="Sales" className="text-foreground hover:bg-muted/50">
                  Sales
                </SelectItem>
                <SelectItem value="Design" className="text-foreground hover:bg-muted/50">
                  Design
                </SelectItem>
                <SelectItem value="Finance" className="text-foreground hover:bg-muted/50">
                  Finance
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 bg-background border-border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All Status" className="text-foreground hover:bg-muted/50">
                  All Status
                </SelectItem>
                <SelectItem value="Active" className="text-foreground hover:bg-muted/50">
                  Active
                </SelectItem>
                <SelectItem value="Closed" className="text-foreground hover:bg-muted/50">
                  Closed
                </SelectItem>
                <SelectItem value="Draft" className="text-foreground hover:bg-muted/50">
                  Draft
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          {jobPostings.map((job, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                      <span>{job.department}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{job.applications}</p>
                    <p className="text-xs text-muted-foreground">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{job.views}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <Badge
                    variant={job.status === "Active" ? "default" : "secondary"}
                    className={
                      job.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : job.status === "Closed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                    }
                  >
                    {job.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Posted: </span>
                  <span className="text-foreground">{job.posted}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Deadline: </span>
                  <span className="text-foreground">{job.deadline}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Days remaining: </span>
                  <span className="text-foreground">
                    {Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Layout for Hiring Requests and Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Requests */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hiring Requests from Managers</h3>
          <div className="space-y-4">
            {hiringRequests.map((request, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {request.requestedBy
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.position}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.requestedBy} • {request.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        request.urgency === "High"
                          ? "destructive"
                          : request.urgency === "Medium"
                            ? "secondary"
                            : "default"
                      }
                      className={
                        request.urgency === "High"
                          ? "bg-red-500/20 text-red-400"
                          : request.urgency === "Medium"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-blue-500/20 text-blue-400"
                      }
                    >
                      {request.urgency}
                    </Badge>
                    <Badge
                      variant={request.status === "Approved" ? "default" : "secondary"}
                      className={
                        request.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : request.status === "Pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-blue-500/20 text-blue-400"
                      }
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
                    {request.status === "Pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
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
      </div>
    </div>
  )
}
