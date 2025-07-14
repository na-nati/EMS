import { useState, useMemo } from "react"
import { Clock, Users, CheckCircle, XCircle, Edit, Download, Search, CalendarDays } from "lucide-react"
import { Button } from "../components/ui/button" // Assuming these paths are correct relative to the component
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input" // Assuming you have an Input component

const attendanceStats = [
  { name: "Present Today", value: "1,156", icon: CheckCircle, color: "text-green-500" },
  { name: "Absent Today", value: "42", icon: XCircle, color: "text-red-500" },
  { name: "Late Arrivals", value: "23", icon: Clock, color: "text-orange-500" },
  { name: "Attendance Rate", value: "96.5%", icon: Users, color: "text-blue-500" },
  { name: "Pending Requests", value: "7", icon: Edit, color: "text-purple-500" }, // Added a new stat
]

const initialTodaysAttendance = [
  {
    id: "emp001",
    name: "John Smith",
    department: "Engineering",
    checkIn: "09:00 AM",
    checkOut: "-",
    status: "Present",
    hours: "8.0",
  },
  {
    id: "emp002",
    name: "Sarah Connor",
    department: "Marketing",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    status: "Present",
    hours: "8.5",
  },
  { id: "emp003", name: "Mike Johnson", department: "Sales", checkIn: "09:15 AM", checkOut: "-", status: "Late", hours: "7.5" },
  { id: "emp004", name: "Emily Davis", department: "HR", checkIn: "-", checkOut: "-", status: "Absent", hours: "0.0" },
  {
    id: "emp005",
    name: "Robert Wilson",
    department: "Finance",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    status: "Present",
    hours: "8.5",
  },
  {
    id: "emp006",
    name: "Linda Brown",
    department: "Engineering",
    checkIn: "09:30 AM",
    checkOut: "-",
    status: "Late",
    hours: "7.0",
  },
  {
    id: "emp007",
    name: "Chris Evans",
    department: "Marketing",
    checkIn: "08:50 AM",
    checkOut: "05:20 PM",
    status: "Present",
    hours: "8.5",
  },
  { id: "emp008", name: "Patricia Green", department: "HR", checkIn: "-", checkOut: "-", status: "Absent", hours: "0.0" },
]

const departmentStats = [
  { department: "Engineering", present: 445, absent: 5, rate: "98.9%" },
  { department: "Sales", present: 275, absent: 5, rate: "98.2%" },
  { department: "Marketing", present: 118, absent: 2, rate: "98.3%" },
  { department: "HR", present: 43, absent: 2, rate: "95.6%" },
  { department: "Finance", present: 34, absent: 1, rate: "97.1%" },
]

const initialLeaveRequests = [
  {
    id: "req001",
    employeeName: "Alice Wonderland",
    department: "Marketing",
    type: "Sick Leave",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
    status: "Pending",
  },
  {
    id: "req002",
    employeeName: "Bob The Builder",
    department: "Engineering",
    type: "Annual Leave",
    startDate: "2025-07-20",
    endDate: "2025-07-25",
    status: "Pending",
  },
  {
    id: "req003",
    employeeName: "Charlie Chaplin",
    department: "Sales",
    type: "Early Exit",
    startDate: "2025-07-14",
    endDate: "2025-07-14",
    status: "Pending",
  },
]

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState("Today")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [filterStatus, setFilterStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests)

  // Filtered attendance data based on selected filters and search term
  const filteredAttendance = useMemo(() => {
    return initialTodaysAttendance.filter((employee) => {
      const matchesDepartment =
        selectedDepartment === "All Departments" || employee.department === selectedDepartment
      const matchesStatus = filterStatus === "All" || employee.status === filterStatus
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesDepartment && matchesStatus && matchesSearch
    })
  }, [selectedDepartment, filterStatus, searchTerm]) // Dependencies are correct here

  const handleApproveRequest = (id: string) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    )
    // Replaced alert() with console.log() for better practice
    console.log(`Request ${id} Approved!`);
    // In a real app, you'd send this update to a backend
  }

  const handleRejectRequest = (id: string) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    )
    // Replaced alert() with console.log() for better practice
    console.log(`Request ${id} Rejected!`);
    // In a real app, you'd send this update to a backend
  }

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
      {/* In a real project, this would be in tailwind.config.js, not inline style */}
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
          .bg-secondary { background-color: hsl(var(--secondary)); }
          .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
          .bg-muted { background-color: hsl(var(--muted)); }
          .text-muted-foreground { color: hsl(var(--muted-foreground)); }
          .border-border { border-color: hsl(var(--border)); }
          .hover\\:bg-primary\\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
          .hover\\:bg-muted\\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
          .font-inter { font-family: 'Inter', sans-serif; }
          .bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }
          .text-green-400 { color: #4ade80; }
          .bg-orange-500\\/20 { background-color: rgba(249, 115, 22, 0.2); }
          .text-orange-400 { color: #fb923c; }
          .bg-red-500\\/20 { background-color: rgba(239, 68, 68, 0.2); }
          .text-red-400 { color: #ef4444; }
          .bg-purple-500\\/20 { background-color: rgba(168, 85, 247, 0.2); }
          .text-purple-400 { color: #c084fc; }
        `}
      </style>

      {/* Header Section with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-2">Track and manage employee attendance efficiently.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            Manual Check-in
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <CalendarDays className="h-4 w-4 mr-2" />
            Manage Shifts
          </Button>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {attendanceStats.map((stat) => {
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

      {/* Department Attendance Overview */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Department Attendance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {departmentStats.map((dept, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <h4 className="font-medium text-foreground">{dept.department}</h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Present:</span>
                    <span className="text-green-500 font-medium">{dept.present}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Absent:</span>
                    <span className="text-red-500 font-medium">{dept.absent}</span>
                  </div>
                  <div className="pt-2 border-t border-border mt-3">
                    <Badge variant="default" className="w-full justify-center bg-primary/20 text-primary font-semibold">
                      {dept.rate}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Attendance Table with Filters and Search */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Attendance</h3>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                className="pl-9 bg-background border-border w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Today" className="text-foreground hover:bg-muted/50">
                  Today
                </SelectItem>
                <SelectItem value="Yesterday" className="text-foreground hover:bg-muted/50">
                  Yesterday
                </SelectItem>
                <SelectItem value="This Week" className="text-foreground hover:bg-muted/50">
                  This Week
                </SelectItem>
                <SelectItem value="This Month" className="text-foreground hover:bg-muted/50">
                  This Month
                </SelectItem>
                <SelectItem value="Custom" className="text-foreground hover:bg-muted/50">
                  Custom Range...
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
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
                <SelectItem value="HR" className="text-foreground hover:bg-muted/50">
                  HR
                </SelectItem>
                <SelectItem value="Finance" className="text-foreground hover:bg-muted/50">
                  Finance
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All" className="text-foreground hover:bg-muted/50">
                  All Statuses
                </SelectItem>
                <SelectItem value="Present" className="text-foreground hover:bg-muted/50">
                  Present
                </SelectItem>
                <SelectItem value="Late" className="text-foreground hover:bg-muted/50">
                  Late
                </SelectItem>
                <SelectItem value="Absent" className="text-foreground hover:bg-muted/50">
                  Absent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((employee) => (
              <div key={employee.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
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
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between sm:justify-end items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs text-muted-foreground">Check In</p>
                    <p className="text-sm font-medium text-foreground">{employee.checkIn}</p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs text-muted-foreground">Check Out</p>
                    <p className="text-sm font-medium text-foreground">{employee.checkOut}</p>
                  </div>
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs text-muted-foreground">Hours</p>
                    <p className="text-sm font-medium text-foreground">{employee.hours}</p>
                  </div>
                  <Badge
                    className={`
                      ${employee.status === "Present" ? "bg-green-500/20 text-green-400" : ""}
                      ${employee.status === "Late" ? "bg-orange-500/20 text-orange-400" : ""}
                      ${employee.status === "Absent" ? "bg-red-500/20 text-red-400" : ""}
                      w-20 justify-center
                    `}
                  >
                    {employee.status}
                  </Badge>
                  <Button size="icon" variant="outline" className="border-border hover:bg-muted/50 bg-transparent flex-shrink-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">No attendance records found for the selected criteria.</div>
          )}
        </div>
      </div>

      {/* Pending Leave Requests Section */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pending Leave & Correction Requests</h3>
        {leaveRequests.filter(req => req.status === "Pending").length > 0 ? (
          <div className="space-y-4">
            {leaveRequests
              .filter(req => req.status === "Pending")
              .map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-purple-400">
                        {request.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{request.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-sm">
                    <p className="text-muted-foreground">Type: <span className="font-medium text-foreground">{request.type}</span></p>
                    <p className="text-muted-foreground">Period: <span className="font-medium text-foreground">{request.startDate} to {request.endDate}</span></p>
                    <Badge className="bg-purple-500/20 text-purple-400 w-20 justify-center">
                      {request.status}
                    </Badge>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button size="sm" variant="outline" className="border-border bg-green-700/20 text-green-400 hover:bg-green-700/30" onClick={() => handleApproveRequest(request.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-border bg-red-700/20 text-red-400 hover:bg-red-700/30" onClick={() => handleRejectRequest(request.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">No pending leave or correction requests.</div>
        )}
      </div>

      {/* Attendance Trend (Placeholder for a Chart) */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Attendance Trend</h3>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg text-muted-foreground">
          {/* This would be replaced by a charting library like Recharts or Chart.js */}
          <p>Chart displaying attendance trends over time (e.g., bar chart of daily present/absent counts).</p>
        </div>
      </div>
    </div>
  )
}