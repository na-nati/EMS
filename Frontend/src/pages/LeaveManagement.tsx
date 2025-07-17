"use client"

import { useState, type SetStateAction, useMemo } from "react"
import { Calendar, Plus, Search, CheckCircle, XCircle, Clock,  } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/lable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../contexts/AuthContext"

interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedOn: string
}

interface LeavePolicy {
  type: string
  total: number // Total annual entitlement for this leave type
  color: string // For UI representation
}

interface LeaveBalance {
  type: string
  used: number
  total: number
  remaining: number
  color: string
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "John Smith",
    leaveType: "Annual Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    appliedOn: "2024-01-01",
  },
  {
    id: "2",
    employeeName: "Sarah Connor",
    leaveType: "Sick Leave",
    startDate: "2024-01-10",
    endDate: "2024-01-11",
    days: 2,
    reason: "Medical appointment",
    status: "approved",
    appliedOn: "2024-01-08",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    leaveType: "Personal Leave",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    days: 1,
    reason: "Personal matter",
    status: "rejected",
    appliedOn: "2024-01-05",
  },
  {
    id: "4",
    employeeName: "John Smith",
    leaveType: "Sick Leave",
    startDate: "2024-02-01",
    endDate: "2024-02-01",
    days: 1,
    reason: "Flu",
    status: "pending",
    appliedOn: "2024-01-28",
  },
  {
    id: "5",
    employeeName: "Sarah Connor",
    leaveType: "Annual Leave",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    days: 5,
    reason: "Spring break",
    status: "approved",
    appliedOn: "2024-02-10",
  },
  {
    id: "6",
    employeeName: "Mike Johnson",
    leaveType: "Annual Leave",
    startDate: "2024-04-10",
    endDate: "2024-04-12",
    days: 3,
    reason: "Short trip",
    status: "pending",
    appliedOn: "2024-03-20",
  },
]

const mockLeavePolicies: LeavePolicy[] = [
  { type: "Annual Leave", total: 25, color: "text-blue-500" },
  { type: "Sick Leave", total: 10, color: "text-red-500" },
  { type: "Personal Leave", total: 5, color: "text-green-500" },
  { type: "Maternity/Paternity", total: 90, color: "text-purple-500" },
]

const calculateLeaveBalances = (
  requests: LeaveRequest[],
  policies: LeavePolicy[],
  employeeName?: string,
): LeaveBalance[] => {
  const balances: { [key: string]: { used: number; total: number; color: string } } = {}

  policies.forEach((policy) => {
    balances[policy.type] = { used: 0, total: policy.total, color: policy.color }
  })

  requests.forEach((request) => {
    const isRelevant = !employeeName || request.employeeName === employeeName
    if (isRelevant && request.status === "approved" && balances[request.leaveType]) {
      balances[request.leaveType].used += request.days
    }
  })

  return Object.keys(balances).map((type) => ({
    type,
    used: balances[type].used,
    total: balances[type].total,
    remaining: balances[type].total - balances[type].used,
    color: balances[type].color,
  }))
}

const LeaveManagement = () => {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState("requests")
  const [showNewLeaveForm, setShowNewLeaveForm] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [newLeave, setNewLeave] = useState({
    leaveType: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)

  // Refined roles for performing actions (approve/reject)
  const canPerformActions = user?.role === "manager" || user?.role === "super_admin"
  // Roles that can view manager/HR dashboards and all requests
  const canViewAllRequests = user?.role === "hr" || user?.role === "manager" || user?.role === "super_admin"
  const isHRorAdmin = user?.role === "hr" || user?.role === "super_admin"
  const fullName = `${user?.firstName} ${user?.lastName}`

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      const isEmployee = user?.role === "employee" && request.employeeName === fullName
      // HR and Managers can see all requests, employees only their own
      const hasAccess = isEmployee || canViewAllRequests
      const matchesSearch =
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || request.status === statusFilter
      return hasAccess && matchesSearch && matchesStatus
    })
  }, [leaveRequests, user?.role, fullName, canViewAllRequests, searchTerm, statusFilter])

  const employeeLeaveBalances = useMemo(() => {
    return calculateLeaveBalances(leaveRequests, mockLeavePolicies, fullName)
  }, [leaveRequests, fullName])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      default:
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleApplyLeave = () => {
    if (!newLeave.leaveType || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert("Please fill in all fields")
      return
    }
    const start = new Date(newLeave.startDate)
    const end = new Date(newLeave.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end day
    const newRequest: LeaveRequest = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: fullName,
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: diffDays,
      reason: newLeave.reason,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    }
    setLeaveRequests((prev) => [...prev, newRequest])
    setNewLeave({ leaveType: "Annual Leave", startDate: "", endDate: "", reason: "" })
    setShowNewLeaveForm(false)
    alert("Leave request submitted successfully!")
  }

  const handleApproveReject = (id: string, status: "approved" | "rejected") => {
    setLeaveRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: status } : req)))
    setShowApprovalModal(false)
    setSelectedRequest(null)
    alert(`Leave request ${status}!`)
  }

  const openApprovalModal = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setShowApprovalModal(true)
  }

  if (!user) {
    return <div>Please log in to access Leave Management.</div>
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {canViewAllRequests ? "Manage team leave requests" : "View and apply for leave"}
          </p>
        </div>
        {user?.role === "employee" && (
          <Dialog open={showNewLeaveForm} onOpenChange={setShowNewLeaveForm}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border text-foreground">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leaveType" className="block mb-1">
                    Leave Type
                  </Label>
                  <Select
                    value={newLeave.leaveType}
                    onValueChange={(value: any) => setNewLeave({ ...newLeave, leaveType: value })}
                  >
                    <SelectTrigger id="leaveType" className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {mockLeavePolicies.map((policy) => (
                        <SelectItem key={policy.type} value={policy.type} className="text-foreground hover:bg-muted/50">
                          {policy.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="block mb-1">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e: { target: { value: any } }) =>
                        setNewLeave({ ...newLeave, startDate: e.target.value })
                      }
                      className="w-full bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="block mb-1">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e: { target: { value: any } }) =>
                        setNewLeave({ ...newLeave, endDate: e.target.value })
                      }
                      className="w-full bg-background border-border text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason" className="block mb-1">
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    value={newLeave.reason}
                    onChange={(e: { target: { value: any } }) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    rows={4}
                    placeholder="Reason for leave"
                    className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
                <Button
                  onClick={() => setShowNewLeaveForm(false)}
                  variant="outline"
                  className="flex-1 sm:flex-none border-border hover:bg-muted/50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleApplyLeave} className="flex-1 sm:flex-none bg-primary hover:bg-primary/80">
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full justify-start gap-2 bg-muted/30 p-1 rounded-lg overflow-x-auto">
          <TabsTrigger
            value="requests"
            className="flex-shrink-0 hover:underline hover:text-green-500 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Leave Requests
          </TabsTrigger>
          {user.role === "employee" && (
            <TabsTrigger
              value="calendar"
              className="flex-shrink-0 hover:underline hover:text-green-500 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Leave Calendar
            </TabsTrigger>
          )}
          {user.role === "employee" && (
            <TabsTrigger
              value="balance"
              className="flex-shrink-0 text-sm hover:underline hover:text-green-500 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Leave Balance
            </TabsTrigger>
          )}
          {(user.role === "manager" || user.role === "super_admin") && ( // Only managers and super_admins see this
            <TabsTrigger
              value="manager-dashboard"
              className="flex-shrink-0  hover:underline hover:text-green-500 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Manager Dashboard
            </TabsTrigger>
          )}
          {isHRorAdmin && (
            <TabsTrigger
              value="hr-dashboard"
              className="flex-shrink-0 hover:underline hover:text-green-500 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              HR Dashboard
            </TabsTrigger>
          )}
        </TabsList>
        {/* Requests Tab Content */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-auto bg-background border-border text-foreground">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-foreground hover:bg-muted/50">
                  All Status
                </SelectItem>
                <SelectItem value="pending" className="text-foreground hover:bg-muted/50">
                  Pending
                </SelectItem>
                <SelectItem value="approved" className="text-foreground hover:bg-muted/50">
                  Approved
                </SelectItem>
                <SelectItem value="rejected" className="text-foreground hover:bg-muted/50">
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Table */}
{/* Leave Requests Overview */}
<div className="bg-card rounded-xl border border-border overflow-hidden">
 

  {/* Header Row */}
  <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3  border-border text-sm font-medium text-muted-foreground uppercase tracking-wider bg-muted/20">
    <div className="col-span-2">Employee</div>
    <div>Dates</div>
    <div>Leave Type</div>
    <div>Status</div>
  </div>

  {/* Requests List */}
  <div className="p-4 space-y-4">
    {filteredRequests.map((request) => {
      const isPending = request.status === "pending";
      return (
        <div
          key={request.id}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center bg-muted/30 rounded-lg p-4 border border-border"
        >
          {/* Employee Info */}
          <div className="col-span-2">
            <p className="text-sm font-medium text-foreground">{request.employeeName}</p>
            <p className="text-xs text-muted-foreground">
              Applied on {new Date(request.appliedOn).toLocaleDateString()}
            </p>
          </div>

          {/* Dates */}
          <div>
            <p className="text-sm text-foreground">
              {new Date(request.startDate).toLocaleDateString()} –{" "}
              {new Date(request.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">{request.days} days</p>
          </div>

          {/* Leave Type */}
          <div className="text-sm text-foreground capitalize">{request.leaveType}</div>

          {/* Status + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge className={getStatusColor(request.status)}>
              {getStatusIcon(request.status)}
              <span className="capitalize ml-1">{request.status}</span>
            </Badge>

            {canPerformActions && isPending && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => openApprovalModal(request)}
              >
                Review
              </Button>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>


        </TabsContent>
        {/* Balance Tab Content */}
        {user.role === "employee" && (
          <TabsContent value="balance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employeeLeaveBalances.map((leave) => (
                <div key={leave.type} className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">{leave.type}</h3>
                    <Calendar className={`w-5 h-5 ${leave.color}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Used: {leave.used} days</span>
                      <span className="text-foreground">Remaining: {leave.remaining} days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${leave.color.replace("text-", "bg-")}`}
                        style={{ width: `${(leave.used / leave.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Total: {leave.total} days</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
        {/* Calendar Tab Content */}
        {user.role === "employee" && (
          <TabsContent value="calendar" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Leave Calendar</h3>
                <p className="text-muted-foreground">
                  Calendar view will be implemented with a proper date picker component
                </p>
              </div>
            </div>
          </TabsContent>
        )}
        {(user.role === "manager" || user.role === "super_admin") && (
          <TabsContent value="manager-dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Requests</h3>
                <p className="text-4xl font-bold text-foreground">
                  {leaveRequests.filter((req) => req.status === "pending").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Requests awaiting your review</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Approved Requests</h3>
                <p className="text-4xl font-bold text-green-500">
                  {leaveRequests.filter((req) => req.status === "approved").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Leaves approved this period</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Rejected Requests</h3>
                <p className="text-4xl font-bold text-red-500">
                  {leaveRequests.filter((req) => req.status === "rejected").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Leaves rejected this period</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Approved Leaves</h3>
              {leaveRequests
                .filter((req) => req.status === "approved" && new Date(req.startDate) >= new Date())
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5) // Show next 5 upcoming leaves
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.leaveType} from {new Date(request.startDate).toLocaleDateString()} to{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize ml-1">{request.status}</span>
                    </Badge>
                  </div>
                ))}
              {leaveRequests.filter((req) => req.status === "approved" && new Date(req.startDate) >= new Date())
                .length === 0 && <p className="text-muted-foreground text-center py-4">No upcoming approved leaves.</p>}
            </div>
          </TabsContent>
        )}
        {isHRorAdmin && (
          <TabsContent value="hr-dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Pending</h3>
                <p className="text-4xl font-bold text-foreground">
                  {leaveRequests.filter((req) => req.status === "pending").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All pending requests</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Approved</h3>
                <p className="text-4xl font-bold text-green-500">
                  {leaveRequests.filter((req) => req.status === "approved").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All approved leaves</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Rejected</h3>
                <p className="text-4xl font-bold text-red-500">
                  {leaveRequests.filter((req) => req.status === "rejected").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All rejected leaves</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave Utilization Overview</h3>
              <div className="space-y-4">
                {calculateLeaveBalances(leaveRequests, mockLeavePolicies).map((balance) => (
                  <div key={balance.type} className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{balance.type}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Used: {balance.used} days</span>
                      <span className="w-16 h-2 rounded-full bg-muted">
                        <span
                          className={`block h-full rounded-full ${balance.color.replace("text-", "bg-")}`}
                          style={{ width: `${(balance.used / balance.total) * 100}%` }}
                        />
                      </span>
                      <span>Total: {balance.total} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Approval/Rejection Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>
              Review the details of this leave request and decide to approve or reject it.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee Name</p>
                <p className="text-base font-medium text-foreground">{selectedRequest.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leave Type</p>
                <p className="text-base font-medium text-foreground">{selectedRequest.leaveType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dates</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(selectedRequest.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedRequest.endDate).toLocaleDateString()} ({selectedRequest.days} days)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="text-base font-medium text-foreground">{selectedRequest.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applied On</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(selectedRequest.appliedOn).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
            <Button
              onClick={() => setShowApprovalModal(false)}
              variant="outline"
              className="flex-1 sm:flex-none border-border hover:bg-muted/50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleApproveReject(selectedRequest.id, "rejected")}
              variant="outline"
              className="flex-1 sm:flex-none border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              Reject
            </Button>
            <Button
              onClick={() => selectedRequest && handleApproveReject(selectedRequest.id, "approved")}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeaveManagement
