import { useState, useMemo } from "react" // Import useMemo for filtering
import { GraduationCap, Users, CheckCircle, Clock, BookOpen, Award, Plus, Eye, Download, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"


// --- Data Definitions ---
const trainingStats = [
  { name: "Active Programs", value: "24", icon: GraduationCap, color: "text-blue-500" },
  { name: "Enrolled Employees", value: "456", icon: Users, color: "text-green-500" },
  { name: "Completed Courses", value: "1,248", icon: CheckCircle, color: "text-purple-500" },
  { name: "Pending Requests", value: "18", icon: Clock, color: "text-orange-500" },
]

// Added 'id' for better key management and easier state updates
const initialTrainingPrograms = [
  {
    id: "prog001",
    name: "React.js Fundamentals",
    category: "Technical",
    duration: "40 hours",
    enrolled: 25,
    completed: 18,
    instructor: "John Tech",
    status: "Active",
    startDate: "2024-01-15",
  },
  {
    id: "prog002",
    name: "Leadership Development",
    category: "Management",
    duration: "60 hours",
    enrolled: 15,
    completed: 12,
    instructor: "Sarah Lead",
    status: "Active",
    startDate: "2024-02-01",
  },
  {
    id: "prog003",
    name: "Digital Marketing",
    category: "Marketing",
    duration: "30 hours",
    enrolled: 20,
    completed: 20,
    instructor: "Mike Digital",
    status: "Completed",
    startDate: "2024-01-10",
  },
  {
    id: "prog004",
    name: "Data Analytics",
    category: "Technical",
    duration: "50 hours",
    enrolled: 18,
    completed: 8,
    instructor: "Anna Data",
    status: "Active",
    startDate: "2024-02-15",
  },
  {
    id: "prog005",
    name: "Project Management Certification",
    category: "Management",
    duration: "80 hours",
    enrolled: 12,
    completed: 5,
    instructor: "David PM",
    status: "Active",
    startDate: "2024-03-01",
  },
  {
    id: "prog006",
    name: "UI/UX Design Principles",
    category: "Design",
    duration: "35 hours",
    enrolled: 22,
    completed: 15,
    instructor: "Emma Design",
    status: "Active",
    startDate: "2024-02-20",
  },
]

// Added 'id' for unique identification
const initialTrainingRequests = [
  {
    id: "treq001",
    employee: "Robert Wilson",
    department: "Engineering",
    course: "Advanced Python Programming",
    reason: "Career development",
    requestDate: "2024-12-10",
    cost: "$1,200",
    status: "Pending",
  },
  {
    id: "treq002",
    employee: "Lisa Anderson",
    department: "Marketing",
    course: "Google Analytics Certification",
    reason: "Skill enhancement",
    requestDate: "2024-12-08",
    cost: "$300",
    status: "Approved",
  },
  {
    id: "treq003",
    employee: "James Brown",
    department: "Sales",
    course: "Negotiation Skills Workshop",
    reason: "Performance improvement",
    requestDate: "2024-12-12",
    cost: "$800",
    status: "Pending",
  },
  {
    id: "treq004",
    employee: "Maria Garcia",
    department: "HR",
    course: "Conflict Resolution Training",
    reason: "Team management",
    requestDate: "2024-12-09",
    cost: "$450",
    status: "Pending",
  },
  {
    id: "treq005",
    employee: "Alex Johnson",
    department: "Finance",
    course: "Financial Modeling Advanced",
    reason: "Skill upgrade",
    requestDate: "2024-12-11",
    cost: "$950",
    status: "Approved",
  },
]

const upcomingCertifications = [
  { name: "AWS Cloud Practitioner", employees: 8, deadline: "2024-12-30" },
  { name: "PMP Certification", employees: 5, deadline: "2025-01-15" },
  { name: "Google Ads Certification", employees: 12, deadline: "2024-12-25" },
  { name: "Scrum Master Certification", employees: 6, deadline: "2025-01-20" },
]

// --- Main Component ---
export default function TrainingDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [programs] = useState(initialTrainingPrograms); // Manage programs in state
  const [requests, setRequests] = useState(initialTrainingRequests); // Manage requests in state

  // Filtered training programs based on selected filters
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesCategory = selectedCategory === "All Categories" || program.category === selectedCategory;
      const matchesStatus = selectedStatus === "All Status" || program.status === selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }, [programs, selectedCategory, selectedStatus]);

  // Handler for approving a training request
  const handleApproveRequest = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
    // Replaced toast.success with alert
    alert(`Training request ${id} approved!`);
    // In a real app, you'd send this update to a backend
  };

  // Handler for rejecting a training request
  const handleRejectRequest = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
    // Replaced toast.error with alert
    alert(`Training request ${id} rejected.`);
    // In a real app, you'd send this update to a backend
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
      {/* Note: In a real project, this would be in tailwind.config.js, not inline style */}
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
          /* Custom colors for badges */
          .bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }
          .text-green-400 { color: #4ade80; }
          .bg-orange-500\\/20 { background-color: rgba(249, 115, 22, 0.2); }
          .text-orange-400 { color: #fb923c; }
          .bg-blue-500\\/20 { background-color: rgba(59, 130, 246, 0.2); }
          .text-blue-400 { color: #60a5fa; }
        `}
      </style>

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training & Education</h1>
          <p className="text-muted-foreground mt-2">Manage employee learning and development programs</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Training Report
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>
      </div>

      {/* --- Training Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainingStats.map((stat) => {
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

      {/* --- Training Programs --- */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-foreground">Training Programs</h3>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All Categories" className="text-foreground hover:bg-muted/50">
                  All Categories
                </SelectItem>
                <SelectItem value="Technical" className="text-foreground hover:bg-muted/50">
                  Technical
                </SelectItem>
                <SelectItem value="Management" className="text-foreground hover:bg-muted/50">
                  Management
                </SelectItem>
                <SelectItem value="Marketing" className="text-foreground hover:bg-muted/50">
                  Marketing
                </SelectItem>
                <SelectItem value="Design" className="text-foreground hover:bg-muted/50">
                  Design
                </SelectItem>
                <SelectItem value="Soft Skills" className="text-foreground hover:bg-muted/50">
                  Soft Skills
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All Status" className="text-foreground hover:bg-muted/50">
                  All Status
                </SelectItem>
                <SelectItem value="Active" className="text-foreground hover:bg-muted/50">
                  Active
                </SelectItem>
                <SelectItem value="Completed" className="text-foreground hover:bg-muted/50">
                  Completed
                </SelectItem>
                <SelectItem value="Upcoming" className="text-foreground hover:bg-muted/50">
                  Upcoming
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div key={program.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground">{program.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {program.category} • {program.duration} • Instructor: {program.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Badge
                      className={
                        program.status === "Active"
                          ? "bg-primary/20 text-primary"
                          : program.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                      }
                    >
                      {program.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium text-foreground">{program.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                    <p className="text-sm font-medium text-foreground">{program.enrolled} employees</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    {/* Replaced Progress component with a custom div-based progress bar */}
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(program.completed / program.enrolled) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-foreground mt-1">
                      {program.completed}/{program.enrolled}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">No training programs found for the selected criteria.</div>
          )}
        </div>
      </div>

      {/* --- Grid Layout for Training Requests and Certifications --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Requests */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Training Requests</h3>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0 flex-grow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {request.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.employee}</p>
                      <p className="text-xs text-muted-foreground">{request.department}</p>
                      <p className="text-sm text-foreground font-semibold mt-1">{request.course}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-right min-w-[70px]">
                      <p className="text-sm font-medium text-foreground">{request.cost}</p>
                      <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                    </div>
                    <Badge
                      className={
                        request.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : request.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-orange-500/20 text-orange-400"
                      }
                    >
                      {request.status}
                    </Badge>
                    <div className="flex space-x-2">
                      {request.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                            onClick={() => handleRejectRequest(request.id)}
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
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8">No training requests found.</div>
            )}
          </div>
        </div>

        {/* Upcoming Certifications */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Certifications</h3>
          <div className="space-y-4">
            {upcomingCertifications.length > 0 ? (
              upcomingCertifications.map((cert, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {cert.employees} enrolled
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground text-base">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Deadline: {cert.deadline}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-border hover:bg-muted/50 bg-transparent"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8">No upcoming certifications.</div>
            )}
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Certification
          </Button>
        </div>
      </div>
    </div>
  )
}