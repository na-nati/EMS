"use client"

import type React from "react"

import { useState, type SetStateAction } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/lable"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  DollarSign,
  Download,
  Edit,
  Eye,
  Calculator,
  TrendingUp,
  Users,
  Plus,
  FileText,
  AlertCircle,
  Trash2,
  Search,
  Clock,
  Menu,
} from "lucide-react"

interface PayrollRecord {
  id: string
  employeeName: string
  employeeId: string
  basicSalary: number
  bonus: number
  deductions: number
  netSalary: number
  month: string
  year: number
  status: "paid" | "pending" | "processing"
  department: string
}

interface PayrollAuditLog {
  timestamp: string
  user: string
  action: string
  status: "Success" | "Failed"
}

const mockPayrollData: PayrollRecord[] = [
  {
    id: "1",
    employeeName: "John Doe",
    employeeId: "EMP001",
    basicSalary: 50000,
    bonus: 5000,
    deductions: 2000,
    netSalary: 53000,
    month: "January",
    year: 2024,
    status: "paid",
    department: "Engineering",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    basicSalary: 45000,
    bonus: 3000,
    deductions: 1800,
    netSalary: 46200,
    month: "January",
    year: 2024,
    status: "paid",
    department: "Design",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    employeeId: "EMP003",
    basicSalary: 40000,
    bonus: 2000,
    deductions: 1500,
    netSalary: 40500,
    month: "January",
    year: 2024,
    status: "processing",
    department: "Marketing",
  },
  {
    id: "4",
    employeeName: "Sarah Wilson",
    employeeId: "EMP004",
    basicSalary: 55000,
    bonus: 4000,
    deductions: 2200,
    netSalary: 56800,
    month: "January",
    year: 2024,
    status: "paid",
    department: "HR",
  },
  {
    id: "5",
    employeeName: "Team Manager",
    employeeId: "EMP005",
    basicSalary: 75000,
    bonus: 7500,
    deductions: 3000,
    netSalary: 79500,
    month: "January",
    year: 2024,
    status: "paid",
    department: "Engineering",
  },
  {
    id: "6",
    employeeName: "HR Manager",
    employeeId: "EMP006",
    basicSalary: 70000,
    bonus: 6000,
    deductions: 2800,
    netSalary: 73200,
    month: "January",
    year: 2024,
    status: "paid",
    department: "Human Resources",
  },
]

const mockPayrollAuditLogs: PayrollAuditLog[] = [
  { timestamp: "2024-01-16 10:00 AM", user: "HR Manager", action: "Added salary for John Doe", status: "Success" },
  { timestamp: "2024-01-16 09:30 AM", user: "HR Manager", action: "Updated salary for Jane Smith", status: "Success" },
  {
    timestamp: "2024-01-15 02:00 PM",
    user: "HR Manager",
    action: "Generated monthly payroll report",
    status: "Success",
  },
  {
    timestamp: "2024-01-14 11:00 AM",
    user: "HR Manager",
    action: "Attempted to delete record (denied)",
    status: "Failed",
  },
  {
    timestamp: "2024-01-13 09:00 AM",
    user: "Super Admin",
    action: "Viewed all payroll records",
    status: "Success",
  },
]

const departments = ["Engineering", "Design", "Marketing", "HR", "Human Resources"]

const Payroll = () => {
  const [selectedTab, setSelectedTab] = useState("records")
  const [showAddSalary, setShowAddSalary] = useState(false)
  const [showEditSalary, setShowEditSalary] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [payrollData, setPayrollData] = useState(mockPayrollData)
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null)
  const [deletingRecord, setDeletingRecord] = useState<PayrollRecord | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    basicSalary: "",
    bonus: "",
    deductions: "",
    department: "",
    month: "January",
    year: 2024,
  })

  const { user, isLoading } = useAuth()

  const toast = ({ title, description }: { title: string; description: string }) => {
    console.log(`Toast: ${title} - ${description}`)
  }

  const getFilteredData = () => {
    let data = payrollData
    if (user?.role === "employee") {
      data = data.filter((record) => record.employeeName === `${user.firstName} ${user.lastName}`)
    } else if (user?.role === "manager") {
      data = data.filter((record) => record.department === user.department)
    }
    if (searchTerm) {
      data = data.filter(
        (record) =>
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return data
  }

  const filteredData = getFilteredData()

  const handleAddSalary = () => {
    const basicSalary = Number.parseFloat(formData.basicSalary)
    const bonus = Number.parseFloat(formData.bonus) || 0
    const deductions = Number.parseFloat(formData.deductions) || 0
    const netSalary = basicSalary + bonus - deductions
    const newRecord: PayrollRecord = {
      id: (payrollData.length + 1).toString(),
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      basicSalary,
      bonus,
      deductions,
      netSalary,
      month: formData.month,
      year: formData.year,
      status: "pending",
      department: formData.department,
    }
    setPayrollData([...payrollData, newRecord])
    setShowAddSalary(false)
    resetForm()
    toast({
      title: "Success",
      description: "Salary record added successfully",
    })
  }

  const handleEditSalary = () => {
    if (!editingRecord) return
    const basicSalary = Number.parseFloat(formData.basicSalary)
    const bonus = Number.parseFloat(formData.bonus) || 0
    const deductions = Number.parseFloat(formData.deductions) || 0
    const netSalary = basicSalary + bonus - deductions
    const updatedRecord = {
      ...editingRecord,
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      basicSalary,
      bonus,
      deductions,
      netSalary,
      department: formData.department,
      month: formData.month,
      year: formData.year,
    }
    setPayrollData(payrollData.map((record) => (record.id === editingRecord.id ? updatedRecord : record)))
    setShowEditSalary(false)
    setEditingRecord(null)
    resetForm()
    toast({
      title: "Success",
      description: "Salary record updated successfully",
    })
  }

  const handleDeleteSalary = () => {
    if (!deletingRecord) return
    setPayrollData(payrollData.filter((record) => record.id !== deletingRecord.id))
    setShowDeleteConfirm(false)
    setDeletingRecord(null)
    toast({
      title: "Success",
      description: "Salary record deleted successfully",
    })
  }

  const openEditDialog = (record: PayrollRecord) => {
    setEditingRecord(record)
    setFormData({
      employeeName: record.employeeName,
      employeeId: record.employeeId,
      basicSalary: record.basicSalary.toString(),
      bonus: record.bonus.toString(),
      deductions: record.deductions.toString(),
      department: record.department,
      month: record.month,
      year: record.year,
    })
    setShowEditSalary(true)
  }

  const openDeleteDialog = (record: PayrollRecord) => {
    setDeletingRecord(record)
    setShowDeleteConfirm(true)
  }

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      basicSalary: "",
      bonus: "",
      deductions: "",
      department: "",
      month: "January",
      year: 2024,
    })
  }

  const getPayrollStats = () => {
    const data = filteredData
    const totalPayroll = data.reduce((sum, record) => sum + record.netSalary, 0)
    const averageSalary = data.length > 0 ? totalPayroll / data.length : 0

    const pendingPayroll = data.filter((r) => r.status === "pending" || r.status === "processing").length

    if (user?.role === "employee") {
      const myRecord = data[0]
      return [
        {
          title: "Net Salary",
          value: myRecord ? `$${myRecord.netSalary.toLocaleString()}` : "$100",
          icon: DollarSign,
          color: "text-green-500",
        },
        {
          title: "Basic Salary",
          value: myRecord ? `$${myRecord.basicSalary.toLocaleString()}` : "$3000",
          icon: Calculator,
          color: "text-blue-500",
        },
        {
          title: "Bonus",
          value: myRecord ? `$${myRecord.bonus.toLocaleString()}` : "$500",
          icon: TrendingUp,
          color: "text-green-500",
        },
        {
          title: "Deductions",
          value: myRecord ? `$${myRecord.deductions.toLocaleString()}` : "$2345",
          icon: AlertCircle,
          color: "text-red-500",
        },
      ]
    }

    return [
      { title: "Total Payroll", value: `$${totalPayroll.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
      { title: "Employees", value: data.length.toString(), icon: Users, color: "text-blue-500" },
      {
        title: "Average Salary",
        value: `$${Math.round(averageSalary).toLocaleString()}`,
        icon: Calculator,
        color: "text-purple-500",
      },
      { title: "Pending", value: pendingPayroll.toString(), icon: AlertCircle, color: "text-orange-500" },
    ]
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-500/20 text-green-500",
      pending: "bg-orange-500/20 text-orange-500",
      processing: "bg-blue-500/20 text-blue-500",
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const canManagePayroll = user?.role === "hr"
  const canViewReports = user?.role === "hr" || user?.role === "super_admin"

  const MobileActionButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <Button
      onClick={onClick}
      className="w-full justify-start gap-3 h-12 text-base hover:text-green-500"
      variant="ghost"
    >
      {children}
    </Button>
  )

  const renderRoleSpecificActions = () => {
    if (user?.role === "employee") {
      return (
        <>
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Payslip
            </Button>
          </div>
          <div className="sm:hidden">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <MobileActionButton onClick={() => setShowMobileMenu(false)}>
                    <Download className="w-4 h-4" />
                    Download Payslip
                  </MobileActionButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )
    }
    if (user?.role === "manager") {
      return (
        <>
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Team Summary
            </Button>
          </div>
          <div className="sm:hidden">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <MobileActionButton onClick={() => setShowMobileMenu(false)}>
                    <Eye className="w-4 h-4" />
                    Team Summary
                  </MobileActionButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )
    }
    if (user?.role === "hr") {
      return (
        <>
          <div className="hidden sm:flex flex-col sm:flex-row gap-2">
            <Dialog open={showAddSalary} onOpenChange={setShowAddSalary}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Salary
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md mx-4 bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle>Add Employee Salary</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeName">Employee Name</Label>
                      <Input
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="EMP001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basicSalary">Basic Salary</Label>
                      <Input
                        id="basicSalary"
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                        placeholder="50000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bonus">Bonus</Label>
                      <Input
                        id="bonus"
                        type="number"
                        value={formData.bonus}
                        onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                        placeholder="5000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                      placeholder="2000"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setShowAddSalary(false)
                        resetForm()
                      }}
                      variant="outline"
                      className="flex-1 h-11"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddSalary} className="flex-1 h-11">
                      Add Salary
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
          <div className="sm:hidden">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <MobileActionButton
                    onClick={() => {
                      setShowAddSalary(true)
                      setShowMobileMenu(false)
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Salary
                  </MobileActionButton>
                  <MobileActionButton onClick={() => setShowMobileMenu(false)}>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </MobileActionButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )
    }
    if (user?.role === "super_admin") {
      return (
        <>
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              System Statistics
            </Button>
          </div>
          <div className="sm:hidden">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <MobileActionButton onClick={() => setShowMobileMenu(false)}>
                    <FileText className="w-4 h-4" />
                    System Statistics
                  </MobileActionButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )
    }
    return null
  }

  const getTabsList = () => {
    const tabs = []
    if (user?.role !== "employee") {
      tabs.push({ value: "records", label: "Payroll Records" })
    } else {
      tabs.push({ value: "records", label: "My Payslip" })
    }
    if (canViewReports) {
      tabs.push({ value: "reports", label: "Reports" })
    }
    if (user?.role === "super_admin") {
      tabs.push({ value: "audit", label: "Audit Log" })
    }
    return tabs
  }

  const MobileRecordCard = ({ record }: { record: PayrollRecord }) => (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground text-sm">{record.employeeName}</p>
            <p className="text-xs text-muted-foreground">{record.employeeId}</p>
          </div>
          <Badge className={getStatusBadge(record.status)}>{record.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Department</p>
            <p className="font-medium">{record.department}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Basic Salary</p>
            <p className="font-medium">${record.basicSalary.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bonus</p>
            <p className="font-medium text-green-600">${record.bonus.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deductions</p>
            <p className="font-medium text-red-600">${record.deductions.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-muted-foreground text-sm">Net Salary</p>
            <p className="font-bold text-lg">${record.netSalary.toLocaleString()}</p>
          </div>
          {canManagePayroll && (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEditDialog(record)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(record)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <div>Please log in to view payroll details.</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 bg-background min-h-screen text-foreground font-inter">
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
          .input { background-color: hsl(var(--input)); }
          .ring { border-color: hsl(var(--ring)); }
          .hover\\:bg-primary\\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
          .hover\\:bg-muted\\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {user?.role === "employee" && "View your salary breakdown and payslips"}
            {user?.role === "manager" && "Monitor your team's attendance"}
            {user?.role === "hr" && "Manage employee salaries and payroll processing"}
            {user?.role === "super_admin" && "System-wide payroll statistics and monitoring"}
          </p>
        </div>
        {renderRoleSpecificActions()}
      </div>
      {user?.role !== "employee" && (
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {getPayrollStats().map((stat) => (
          <div
            key={stat.title}
            className="bg-card p-3 sm:p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color} flex-shrink-0 ml-2`} />
            </div>
          </div>
        ))}
      </div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList
          className={`grid w-full ${
            getTabsList().length === 1
              ? "grid-cols-1"
              : getTabsList().length === 2
                ? "grid-cols-2"
                : getTabsList().length === 3
                  ? "grid-cols-3"
                  : "grid-cols-4"
          } h-10 sm:h-auto bg-muted/30`}
        >
          {getTabsList().map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs hover:underline sm:text-sm py-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {user?.role !== "employee" ? (
          <TabsContent value="records" className="space-y-4 sm:space-y-6">
            <div className="block sm:hidden space-y-3">
              {filteredData.map((record) => (
                <MobileRecordCard key={record.id} record={record} />
              ))}
            </div>
            <div className="hidden sm:block">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Detailed Payroll Records
                </h3>
                <div className="space-y-4">
                  {filteredData.map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {record.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{record.employeeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.employeeId} • {record.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                        <div className="text-center min-w-[70px]">
                          <p className="text-xs text-muted-foreground">Basic</p>
                          <p className="text-sm font-medium text-foreground mt-1">
                            ${record.basicSalary.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-xs text-muted-foreground">Bonus</p>
                          <p className="text-sm font-medium text-green-500 mt-1">${record.bonus.toLocaleString()}</p>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-xs text-muted-foreground">Deductions</p>
                          <p className="text-sm font-medium text-red-500 mt-1">${record.deductions.toLocaleString()}</p>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-xs text-muted-foreground">Net</p>
                          <p className="text-sm font-bold text-primary mt-1">${record.netSalary.toLocaleString()}</p>
                        </div>
                        <Badge className={`${getStatusBadge(record.status)} w-20 justify-center`}>
                          {record.status}
                        </Badge>
                        {canManagePayroll && (
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(record)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openDeleteDialog(record)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ) : (
          <TabsContent value="records" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Current Month Payslip
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {filteredData.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Basic Salary</span>
                        <span className="font-medium text-sm sm:text-base text-foreground">
                          ${filteredData[0].basicSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bonus</span>
                        <span className="font-medium text-green-500 text-sm sm:text-base">
                          +${filteredData[0].bonus.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Deductions</span>
                        <span className="font-medium text-red-500 text-sm sm:text-base">
                          -${filteredData[0].deductions.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-border pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm sm:text-base text-foreground">Net Salary</span>
                          <span className="text-base sm:text-lg font-bold text-primary">
                            ${filteredData[0].netSalary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Payslip History</h3>
                <div className="space-y-3">
                  {["December 2023", "November 2023", "October 2023"].map((month) => (
                    <div key={month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium text-foreground">{month}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-border hover:bg-muted/50 bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        )}
        {canViewReports && (
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Payroll Reports</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-muted/30 p-4 sm:p-6 rounded-lg border border-border">
                  <div className="text-center">
                    <Calculator className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-500 mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Monthly Report</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Generate monthly payroll summary
                    </p>
                    <Button size="sm" className="w-full h-9 bg-primary hover:bg-primary/80">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 sm:p-6 rounded-lg border border-border">
                  <div className="text-center">
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-green-500 mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Annual Report</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Year-end payroll analysis</p>
                    <Button size="sm" className="w-full h-9 bg-primary hover:bg-primary/80">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 sm:p-6 rounded-lg border border-border">
                  <div className="text-center">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-purple-500 mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Department Report</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Department-wise breakdown</p>
                    <Button size="sm" className="w-full h-9 bg-primary hover:bg-primary/80">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
        {user?.role === "super_admin" && (
          <TabsContent value="audit" className="space-y-4 sm:space-y-6">
            <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Payroll Audit Log</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Monitor all attendance-related activities across the system
              </p>
              <div className="space-y-3 sm:space-y-4">
                {mockPayrollAuditLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.user} • {log.timestamp}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        log.status === "Success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
      <Dialog open={showEditSalary} onOpenChange={setShowEditSalary}>
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-4 bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Edit Employee Salary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editEmployeeName">Employee Name</Label>
                <Input
                  id="editEmployeeName"
                  value={formData.employeeName}
                  onChange={(e: { target: { value: any } }) =>
                    setFormData({ ...formData, employeeName: e.target.value })
                  }
                  className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label htmlFor="editEmployeeId">Employee ID</Label>
                <Input
                  id="editEmployeeId"
                  value={formData.employeeId}
                  onChange={(e: { target: { value: any } }) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
             <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editBasicSalary">Basic Salary</Label>
                <Input
                  id="editBasicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e: { target: { value: any } }) =>
                    setFormData({ ...formData, basicSalary: e.target.value })
                  }
                  className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label htmlFor="editBonus">Bonus</Label>
                <Input
                  id="editBonus"
                  type="number"
                  value={formData.bonus}
                  onChange={(e: { target: { value: any } }) => setFormData({ ...formData, bonus: e.target.value })}
                  className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editDeductions">Deductions</Label>
              <Input
                id="editDeductions"
                type="number"
                value={formData.deductions}
                onChange={(e: { target: { value: any } }) => setFormData({ ...formData, deductions: e.target.value })}
                className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                onClick={() => {
                  setShowEditSalary(false)
                  setEditingRecord(null)
                  resetForm()
                }}
                variant="outline"
                className="flex-1 h-11 border-border hover:bg-muted/50 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleEditSalary} className="flex-1 h-11 bg-primary hover:bg-primary/80">
                Update Salary
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-4 bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the salary record for <strong>{deletingRecord?.employeeName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletingRecord(null)
                }}
                variant="outline"
                className="flex-1 h-11 border-border hover:bg-muted/50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSalary}
                variant="destructive"
                className="flex-1 h-11 bg-destructive hover:bg-destructive/80"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Payroll
