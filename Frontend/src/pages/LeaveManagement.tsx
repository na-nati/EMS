import { useState, type SetStateAction } from "react"

import { Calendar, Plus, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/lable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
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

interface LeaveBalance {
  type: string
  used: number
  total: number
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
]

const mockLeaveBalances: LeaveBalance[] = [
  { type: "Annual Leave", used: 12, total: 25, color: "text-blue-500" },
  { type: "Sick Leave", used: 3, total: 10, color: "text-red-500" },
  { type: "Personal Leave", used: 2, total: 5, color: "text-green-500" },
  { type: "Maternity/Paternity", used: 0, total: 90, color: "text-purple-500" },
]

const LeaveManagement = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access Leave Management.</div>;
  }

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

  const canManageLeaves = user?.role === "hr" || user?.role === "manager" || user?.role === "super_admin"
  const fullName = `${user?.firstName} ${user?.lastName}`

  const filteredRequests = leaveRequests.filter((request) => {
    const isEmployee = user?.role === "employee" && request.employeeName === fullName
    const hasAccess = isEmployee || canManageLeaves
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return hasAccess && matchesSearch && matchesStatus
  })

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
    alert(`Leave request ${status}!`)
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
            {canManageLeaves ? "Manage team leave requests" : "View and apply for leave"}
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
                      <SelectItem value="Annual Leave" className="text-foreground hover:bg-muted/50">
                        Annual Leave
                      </SelectItem>
                      <SelectItem value="Sick Leave" className="text-foreground hover:bg-muted/50">
                        Sick Leave
                      </SelectItem>
                      <SelectItem value="Personal Leave" className="text-foreground hover:bg-muted/50">
                        Personal Leave
                      </SelectItem>
                      <SelectItem value="Maternity/Paternity" className="text-foreground hover:bg-muted/50">
                        Maternity/Paternity
                      </SelectItem>
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
                      onChange={(e: { target: { value: any } }) => setNewLeave({ ...newLeave, startDate: e.target.value })}
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
                      onChange={(e: { target: { value: any } }) => setNewLeave({ ...newLeave, endDate: e.target.value })}
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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 bg-muted/30">
  <TabsTrigger
    value="requests"
    className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
  >
    Leave Requests
  </TabsTrigger>

  {user.role === 'employee' && (
    <TabsTrigger
      value="calendar"
      className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    >
      Leave Calendar
    </TabsTrigger>
  )}

  {user.role === 'employee' && (
    <TabsTrigger
      value="balance"
      className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    >
      Leave Balance
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
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    {canManageLeaves && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">{request.employeeName}</div>
                        <div className="text-xs text-muted-foreground">
                          Applied on {new Date(request.appliedOn).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{request.leaveType}</td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{request.days} days</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize ml-1">{request.status}</span>
                        </Badge>
                      </td>
                      {canManageLeaves && (
                        <td className="px-4 py-3">
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveReject(request.id, "approved")}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApproveReject(request.id, "rejected")}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Balance Tab Content */}
        {user.role === 'employee' && (
        <TabsContent value="balance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockLeaveBalances.map((leave) => (
              <div key={leave.type} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{leave.type}</h3>
                  <Calendar className={`w-5 h-5 ${leave.color}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Used: {leave.used} days</span>
                    <span className="text-foreground">Remaining: {leave.total - leave.used} days</span>
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
        {user.role === 'employee' && (
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
      </Tabs>
    </div>
  )
}

export default LeaveManagement
