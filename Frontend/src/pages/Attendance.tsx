

import { useState, type SetStateAction } from "react"
import {
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Download,
  Plus,
  Search,
  Eye,
  BarChart3,
  Activity,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/lable" // Corrected import from 'lable' to 'label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../contexts/AuthContext"




interface AttendanceRecord {
  id: string
  employeeName: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  totalHours: number
  status: "present" | "absent" | "late" | "partial"
  department: string
}

interface ActivityLog {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  type: "mark" | "correct" | "view" | "export"
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "John Doe",
    employeeId: "EMP001",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:30",
    totalHours: 8.5,
    status: "present",
    department: "Engineering",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    date: "2024-01-15",
    checkIn: "09:15",
    checkOut: "17:30",
    totalHours: 8.25,
    status: "late",
    department: "Design",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    employeeId: "EMP003",
    date: "2024-01-15",
    checkIn: "",
    checkOut: "",
    totalHours: 0,
    status: "absent",
    department: "Marketing",
  },
  {
    id: "4",
    employeeName: "Sarah Wilson",
    employeeId: "EMP004",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "15:00",
    totalHours: 6,
    status: "partial",
    department: "HR",
  },
  {
    id: "5",
    employeeName: "Team Manager",
    employeeId: "EMP005",
    date: "2024-01-15",
    checkIn: "08:45",
    checkOut: "17:15",
    totalHours: 8.5,
    status: "present",
    department: "Engineering",
  },
  {
    id: "6",
    employeeName: "HR Manager",
    employeeId: "EMP006",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "18:00",
    totalHours: 9,
    status: "present",
    department: "Human Resources",
  },
  {
    id: "7",
    employeeName: "John Doe",
    employeeId: "EMP001", // Same ID as EMP001 for testing employee view
    date: "2024-01-14",
    checkIn: "09:05",
    checkOut: "17:35",
    totalHours: 8.5,
    status: "present",
    department: "Engineering",
  },
  // Manually added record for daily overview testing
  {
    id: "8",
    employeeName: "Alice Wonderland",
    employeeId: "EMP007",
    date: new Date().toISOString().split("T")[0], // Set to current date for daily overview
    checkIn: "08:30",
    checkOut: "17:00",
    totalHours: 8.5,
    status: "present",
    department: "Marketing",
  },
  {
    id: "9",
    employeeName: "Bob Builder",
    employeeId: "EMP008",
    date: new Date().toISOString().split("T")[0], // Set to current date for daily overview
    checkIn: "09:00",
    checkOut: "17:30",
    totalHours: 8.5,
    status: "present",
    department: "Construction",
  },
  {
    id: "10",
    employeeName: "Charlie Brown",
    employeeId: "EMP009",
    date: new Date().toISOString().split("T")[0], // Set to current date for daily overview
    checkIn: "09:00",
    checkOut: "17:30",
    totalHours: 8.5,
    status: "present",
    department: "Marketing",
  },
]

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15 10:30:00",
    user: "HR Manager",
    action: "Marked attendance",
    details: "Marked John Doe as Present for 2024-01-15",
    type: "mark",
  },
  {
    id: "2",
    timestamp: "2024-01-15 09:45:00",
    user: "HR Manager",
    action: "Corrected attendance",
    details: "Updated check-in time for Jane Smith from 09:30 to 09:15",
    type: "correct",
  },
  {
    id: "3",
    timestamp: "2024-01-15 08:00:00",
    user: "Team Manager",
    action: "Viewed team report",
    details: "Accessed Engineering team attendance for 2024-01-15",
    type: "view",
  },
  {
    id: "4",
    timestamp: "2024-01-14 17:30:00",
    user: "Super Admin",
    action: "Generated system report",
    details: "Exported full attendance report for January 2024",
    type: "export",
  },
]

const Attendance = () => {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [showMarkAttendance, setShowMarkAttendance] = useState(false)
  const [showCorrectAttendance, setShowCorrectAttendance] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceData)
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs)
  const { user, isLoading } = useAuth();


  if (isLoading) {
    return <div className="p-4 text-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 text-foreground">Please log in to view attendance.</div>;
  }

  // Simple form state for HR
  const [markForm, setMarkForm] = useState({
    employeeId: "",
    status: "present" as AttendanceRecord["status"],
    checkIn: "09:00",
    checkOut: "17:30",
  })

  // Role-based data filtering
  const getFilteredData = () => {
    let data = attendanceRecords

    if (user?.role === "employee") {
      data = data.filter((record) => record.employeeName === `${user.firstName} ${user.lastName}`)
    } else if (user?.role === "manager") {
      data = data.filter((record) => record.department === user.department)
    }
    // HR and Super Admin can see all records

    return data.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
  const filteredData = getFilteredData()

  const getAttendanceStats = () => {
    const data = filteredData
    const todayData = data.filter((r) => r.date === selectedDate)
    const totalEmployees = new Set(data.map((r) => r.employeeId)).size
    const presentToday = todayData.filter((r) => r.status === "present").length
    const lateToday = todayData.filter((r) => r.status === "late").length
    const absentToday = todayData.filter((r) => r.status === "absent").length

    if (user?.role === "employee") {
      const myTodayRecord = todayData.find((r) => r.employeeName === `${user.firstName} ${user.lastName}`)
      return [
        {
          title: "My Status Today",
          value: myTodayRecord?.status
            ? myTodayRecord.status.charAt(0).toUpperCase() + myTodayRecord.status.slice(1)
            : "N/A",
          icon: Users,
          color:
            myTodayRecord?.status === "present"
              ? "text-green-500"
              : myTodayRecord?.status === "late"
                ? "text-orange-500"
                : "text-red-500",
        },
        {
          title: "Check In",
          value: myTodayRecord?.checkIn || "--:--",
          icon: Clock,
          color: "text-blue-500",
        },
        {
          title: "Check Out",
          value: myTodayRecord?.checkOut || "--:--",
          icon: Clock,
          color: "text-purple-500",
        },
        {
          title: "Total Hours",
          value: myTodayRecord?.totalHours ? `${myTodayRecord.totalHours}h` : "0h",
          icon: BarChart3,
          color: "text-yellow-500",
        },
      ]
    }

    return [
      { title: "Total Employees", value: totalEmployees.toString(), icon: Users, color: "text-blue-500" },
      { title: "Present Today", value: presentToday.toString(), icon: CheckCircle, color: "text-green-500" },
      { title: "Late Arrivals", value: lateToday.toString(), icon: Clock, color: "text-orange-500" },
      { title: "Absent Today", value: absentToday.toString(), icon: XCircle, color: "text-red-500" },
    ]
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "bg-green-500/20 text-green-500",
      late: "bg-orange-500/20 text-orange-500",
      absent: "bg-red-500/20 text-red-500",
      partial: "bg-blue-500/20 text-blue-500",
    }
    return variants[status as keyof typeof variants] || variants.present
  }

  const getActivityBadge = (type: string) => {
    const variants = {
      mark: "bg-blue-500/20 text-blue-500",
      correct: "bg-orange-500/20 text-orange-500",
      view: "bg-green-500/20 text-green-500",
      export: "bg-purple-500/20 text-purple-500",
    }
    return variants[type as keyof typeof variants] || variants.view
  }

  const canViewAnalytics = user?.role === "super_admin" || user?.role === "hr"
  const canCorrectDiscrepancies = user?.role === "hr"

  const handleSimpleMarkAttendance = () => {
    const selectedEmployee = mockAttendanceData.find((emp) => emp.employeeId === markForm.employeeId)
    if (selectedEmployee) {
      console.log("Marking attendance:", {
        employee: selectedEmployee.employeeName,
        status: markForm.status,
        checkIn: markForm.checkIn,
        checkOut: markForm.checkOut,
        date: selectedDate,
      })
      setShowMarkAttendance(false)
      setMarkForm({ employeeId: "", status: "present", checkIn: "09:00", checkOut: "17:30" })
    }
  }

  const renderRoleSpecificActions = () => {
    if (user?.role === "employee") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">View My History</span>
            <span className="sm:hidden">History</span>
          </Button>
        </div>
      )
    }
    if (user?.role === "manager") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Team Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      )
    }
    if (user?.role === "hr") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Simple Mark Attendance Dialog */}
          <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Mark Attendance</span>
                <span className="sm:hidden">Mark</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md bg-card border-border text-foreground mx-auto">
              <DialogHeader>
                <DialogTitle>Quick Mark Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Select Employee</Label>
                  <Select
                    value={markForm.employeeId}
                    onValueChange={(value) => setMarkForm({ ...markForm, employeeId: value })}
                  >
                    <SelectTrigger id="employee" className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {mockAttendanceData.map((record) => (
                        <SelectItem
                          key={record.employeeId}
                          value={record.employeeId}
                          className="text-foreground hover:bg-muted/50"
                        >
                          {record.employeeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={markForm.status}
                    onValueChange={(value: AttendanceRecord["status"]) => setMarkForm({ ...markForm, status: value })}
                  >
                    <SelectTrigger id="status" className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="present" className="text-foreground hover:bg-muted/50">
                        Present
                      </SelectItem>
                      <SelectItem value="late" className="text-foreground hover:bg-muted/50">
                        Late
                      </SelectItem>
                      <SelectItem value="absent" className="text-foreground hover:bg-muted/50">
                        Absent
                      </SelectItem>
                      <SelectItem value="partial" className="text-foreground hover:bg-muted/50">
                        Partial Day
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {markForm.status !== "absent" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check In</Label>
                      <Input
                        id="checkIn"
                        type="time"
                        value={markForm.checkIn}
                        onChange={(e) => setMarkForm({ ...markForm, checkIn: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check Out</Label>
                      <Input
                        id="checkOut"
                        type="time"
                        value={markForm.checkOut}
                        onChange={(e) => setMarkForm({ ...markForm, checkOut: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button
                  onClick={() => setShowMarkAttendance(false)}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted/50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSimpleMarkAttendance}
                  className="flex-1 bg-primary hover:bg-primary/80"
                  disabled={!markForm.employeeId}
                >
                  Mark Attendance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showCorrectAttendance} onOpenChange={setShowCorrectAttendance}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Correct</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md bg-card border-border text-foreground mx-auto">
              <DialogHeader>
                <DialogTitle>Correct Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger id="employee" className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {mockAttendanceData.map((record) => (
                        <SelectItem
                          key={record.employeeId}
                          value={record.employeeId}
                          className="text-foreground hover:bg-muted/50"
                        >
                          {record.employeeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newCheckIn">New Check In</Label>
                    <Input id="newCheckIn" type="time" className="bg-background border-border text-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="newCheckOut">New Check Out</Label>
                    <Input id="newCheckOut" type="time" className="bg-background border-border text-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Why are you making this correction?"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button
                  onClick={() => setShowCorrectAttendance(false)}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted/50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/80">Apply Correction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )
    }
    if (user?.role === "super_admin") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Reports</span>
            <span className="sm:hidden">Reports</span>
          </Button>
        </div>
      )
    }
    return null
  }

  const getTabsList = () => {
    const tabs = [{ value: "overview", label: user?.role === "employee" ? "My Attendance" : "Daily Overview" }]
    tabs.push({ value: "records", label: "Records" })
    if (canViewAnalytics) {
      tabs.push({ value: "analytics", label: "Analytics" })
    }
    if (user?.role === "super_admin") {
      tabs.push({ value: "activity", label: "Activity" })
    }
    return tabs
  }

  if (!user) {
    return <div className="p-4 text-foreground">Please log in to view attendance.</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Custom CSS for design system */}
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {user?.role === "employee" && "View your attendance history"}
            {user?.role === "manager" && "Monitor your team's attendance"}
            {user?.role === "hr" && "Manage employee attendance records"}
            {user?.role === "super_admin" && "System-wide attendance analytics"}
          </p>
        </div>
        <div className="shrink-0">{renderRoleSpecificActions()}</div>
      </div>
      {/* Attendance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {getAttendanceStats().map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-card p-3 sm:p-4 lg:p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color} shrink-0`} />
              </div>
            </div>
          )
        })}
      </div>
      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList
          className="grid w-full bg-muted/30"
          style={{ gridTemplateColumns: `repeat(${getTabsList().length}, 1fr)` }}
        >
          {getTabsList().map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs sm:text-sm  hover:underline hover:text-green-500 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <Label htmlFor="date" className="block mb-1 text-sm">
                Select Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setSelectedDate(e.target.value)}
                className="w-full sm:w-40 bg-background border-border text-foreground"
              />
            </div>
            {(user?.role === "manager" || user?.role === "hr" || user?.role === "super_admin") && (
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
  {/* Header */}
  <div className="hidden sm:flex items-center justify-between p-4 bg-muted/30 rounded-t-xl border-b border-border text-xs font-medium text-muted-foreground uppercase">
    <div className="min-w-[220px]">Employee</div>
    <div className="flex gap-6 flex-wrap sm:flex-nowrap min-w-[260px]">
      <div>Check In</div>
      <div>Check Out</div>
      <div className="hidden md:block">Hours</div>
    </div>
    <div className="min-w-[100px]">Status</div>
    <div>Actions</div>
  </div>

  {/* Cards list */}
  <div className="space-y-4 p-4">
    {filteredData
      .filter((record) => record.date === selectedDate)
      .map((record) => {
        const statusClasses = getStatusBadge(record.status);
        return (
          <div
            key={record.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/40 transition"
          >
            {/* Left section: Employee info */}
            <div className="flex items-center space-x-4 mb-3 sm:mb-0 min-w-[220px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{record.employeeName}</p>
                <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                {(user?.role === "hr" || user?.role === "super_admin") && (
                  <p className="text-xs text-muted-foreground">{record.department}</p>
                )}
              </div>
            </div>

            {/* Middle section: Check In / Check Out / Hours */}
            <div className="flex gap-6 flex-wrap sm:flex-nowrap mb-3 sm:mb-0 text-sm text-foreground min-w-[260px]">
              <div>
                <p className="text-xs text-muted-foreground">Check In</p>
                <p>{record.checkIn || "--:--"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check Out</p>
                <p>{record.checkOut || "--:--"}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-muted-foreground">Hours</p>
                <p>{record.totalHours}h</p>
              </div>
            </div>

            {/* Status badge */}
            <div className="min-w-[100px]">
              <Badge className={`${statusClasses} capitalize text-xs`}>
                {record.status}
              </Badge>
            </div>

            {/* Actions */}
            {canCorrectDiscrepancies && (
              <div className="mt-3 sm:mt-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCorrectAttendance(true)}
                  className="text-muted-foreground hover:bg-muted/50 hover:text-foreground p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
  </div>
</div>

        </TabsContent>
        {/* Records Tab */}
        <TabsContent value="records" className="space-y-4 sm:space-y-6">
          <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {user?.role === "employee" ? "My Attendance History" : "Employee Attendance Records"}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {filteredData.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{record.employeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()} • {record.employeeId}
                        {(user?.role === "hr" || user?.role === "super_admin") && ` • ${record.department}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-foreground">
                        {record.checkIn} - {record.checkOut || "Not checked out"}
                      </p>
                      <p className="text-xs text-muted-foreground">{record.totalHours} hours</p>
                    </div>
                    <Badge className={`${getStatusBadge(record.status)} capitalize text-xs`}>{record.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        {/* Analytics Tab (HR and Super Admin only) */}
        {canViewAnalytics && (
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Department-wise Attendance</h3>
                <div className="space-y-4">
                  {["Engineering", "Design", "Marketing", "HR"].map((dept) => {
                    const deptData = filteredData.filter((r) => r.department === dept)
                    const presentCount = deptData.filter((r) => r.status === "present").length
                    const totalCount = deptData.length
                    const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0
                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{dept}</span>
                          <span className="text-foreground">
                            {presentCount}/{totalCount} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Average Attendance Rate</span>
                    <span className="text-lg font-bold text-green-500">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Late Arrivals This Week</span>
                    <span className="text-lg font-bold text-orange-500">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Perfect Attendance</span>
                    <span className="text-lg font-bold text-blue-500">23 employees</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
        {/* Activity Tab (Super Admin only) */}
        {user?.role === "super_admin" && (
          <TabsContent value="activity" className="space-y-4 sm:space-y-6">
            <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">System Activity Log</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Monitor all attendance-related activities across the system
              </p>
              <div className="space-y-3 sm:space-y-4">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg gap-3"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground break-words">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.user} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getActivityBadge(log.type)} capitalize text-xs shrink-0`}>{log.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default Attendance
