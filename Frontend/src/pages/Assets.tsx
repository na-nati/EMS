import type React from "react"
import { useState, type SetStateAction } from "react"
import {
  Monitor,
  Laptop,
  Smartphone,
  Printer,
  Users,
  Package,
  Edit,
  Eye,
  Plus,
  Search,
  AlertTriangle,
  Calendar,
  MapPin,
  X,
  Send,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

// Types
import type { UserRole } from "../contexts/AuthContext"

interface AssetAssignment {
  employee: string
  department: string
  asset: string
  assetId: string
  assignDate: string
  status: string
  location: string
}

interface MaintenanceAlert {
  asset: string
  assetId: string
  issue: string
  priority: string
  dueDate: string
}

interface AssetRequest {
  employee: string
  department: string
  requestedAsset: string
  reason: string
  requestDate: string
  status: string
}

// Props
interface AssetsDashboardProps {
  userRole: UserRole
  currentUser?: string
}

const assetStats = [
  { name: "Total Assets", value: "2,456", icon: Package, color: "text-blue-500" },
  { name: "Assigned", value: "1,892", icon: Users, color: "text-green-500" },
  { name: "Available", value: "564", icon: Monitor, color: "text-purple-500" },
  { name: "Under Maintenance", value: "45", icon: Edit, color: "text-orange-500" },
]

const assetCategories = [
  { category: "Laptops", total: 850, assigned: 780, available: 70, maintenance: 15, icon: Laptop },
  { category: "Monitors", total: 950, assigned: 820, available: 130, maintenance: 12, icon: Monitor },
  { category: "Smartphones", total: 420, assigned: 380, available: 40, maintenance: 8, icon: Smartphone },
  { category: "Printers", total: 156, assigned: 120, available: 36, maintenance: 10, icon: Printer },
]

const initialRecentAssignments: AssetAssignment[] = [
  {
    employee: "John Smith",
    department: "Engineering",
    asset: 'MacBook Pro 16"',
    assetId: "LP-2024-0156",
    assignDate: "2024-12-10",
    status: "Active",
    location: "Office Floor 3",
  },
  {
    employee: "John Doe",
    department: "Engineering",
    asset: 'MacBook Pro 16"',
    assetId: "LP-2024-0156",
    assignDate: "2024-12-10",
    status: "Active",
    location: "Office Floor 3",
  },
  {
    employee: "Sarah Connor",
    department: "Marketing",
    asset: 'Dell Monitor 24"',
    assetId: "MN-2024-0892",
    assignDate: "2024-12-08",
    status: "Active",
    location: "Office Floor 2",
  },
  {
    employee: "Mike Johnson",
    department: "Sales",
    asset: "iPhone 15 Pro",
    assetId: "PH-2024-0234",
    assignDate: "2024-12-05",
    status: "Active",
    location: "Remote",
  },
  {
    employee: "Emily Davis",
    department: "HR",
    asset: "Surface Laptop",
    assetId: "LP-2024-0089",
    assignDate: "2024-12-03",
    status: "Returned",
    location: "Storage Room A",
  },
  {
    employee: "Robert Wilson",
    department: "Finance",
    asset: "HP Printer",
    assetId: "PR-2024-0045",
    assignDate: "2024-12-01",
    status: "Maintenance",
    location: "IT Support",
  },
]

const maintenanceAlerts: MaintenanceAlert[] = [
  {
    asset: 'MacBook Pro 13"',
    assetId: "LP-2024-0089",
    issue: "Battery replacement needed",
    priority: "High",
    dueDate: "2024-12-20",
  },
  {
    asset: "Dell Monitor",
    assetId: "MN-2024-0234",
    issue: "Screen flickering",
    priority: "Medium",
    dueDate: "2024-12-25",
  },
  { asset: "iPhone 14", assetId: "PH-2024-0156", issue: "Screen crack repair", priority: "Low", dueDate: "2024-12-30" },
]

const assetRequests: AssetRequest[] = [
  {
    employee: "Alex Johnson",
    department: "Engineering",
    requestedAsset: "MacBook Pro M3",
    reason: "Development work",
    requestDate: "2024-12-12",
    status: "Pending",
  },
  {
    employee: "Maria Garcia",
    department: "Design",
    requestedAsset: "iPad Pro",
    reason: "Design mockups",
    requestDate: "2024-12-11",
    status: "Approved",
  },
  {
    employee: "David Kim",
    department: "Sales",
    requestedAsset: "Wireless Headset",
    reason: "Client calls",
    requestDate: "2024-12-10",
    status: "Pending",
  },
]

export default function AssetsDashboard({ userRole, currentUser }: AssetsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [showAddAssetForm, setShowAddAssetForm] = useState(false)
  const [showAssignAssetForm, setShowAssignAssetForm] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)

  // Filter assignments based on role
  let filteredAssignments = initialRecentAssignments
  if (userRole === "employee" && currentUser) {
    filteredAssignments = initialRecentAssignments.filter((assignment) => assignment.employee === currentUser)
  } else {
    filteredAssignments = initialRecentAssignments.filter((assignment) => {
      const matchesSearchTerm =
        assignment.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.assetId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (selectedCategory === "Laptops" &&
          (assignment.asset.toLowerCase().includes("book") ||
            assignment.asset.toLowerCase().includes("laptop") ||
            assignment.assetId.toLowerCase().startsWith("lp"))) ||
        (selectedCategory === "Monitors" &&
          (assignment.asset.toLowerCase().includes("monitor") || assignment.assetId.toLowerCase().startsWith("mn"))) ||
        (selectedCategory === "Smartphones" &&
          (assignment.asset.toLowerCase().includes("phone") || assignment.assetId.toLowerCase().startsWith("ph"))) ||
        (selectedCategory === "Printers" &&
          (assignment.asset.toLowerCase().includes("printer") || assignment.assetId.toLowerCase().startsWith("pr")))
      const matchesStatus = selectedStatus === "All Status" || assignment.status === selectedStatus
      return matchesSearchTerm && matchesCategory && matchesStatus
    })
  }

  const handleViewAsset = (assetId: string) => {
    console.log(`Viewing asset: ${assetId}`)
    alert(`Viewing details for Asset ID: ${assetId}`)
  }

  const handleEditAsset = (assetId: string) => {
    console.log(`Editing asset: ${assetId}`)
    alert(`Editing Asset ID: ${assetId}`)
  }

  const handleScheduleMaintenance = (assetId: string) => {
    console.log(`Scheduling maintenance for: ${assetId}`)
    alert(`Scheduling maintenance for Asset ID: ${assetId}`)
  }

  const handleApproveRequest = (requestId: string) => {
    console.log(`Approving request: ${requestId}`)
    alert(`Request approved for: ${requestId}`)
  }

  const handleRejectRequest = (requestId: string) => {
    console.log(`Rejecting request: ${requestId}`)
    alert(`Request rejected for: ${requestId}`)
  }

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Adding new asset...")
    setShowAddAssetForm(false)
    alert("New asset added successfully!")
  }

  const handleAssignAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Assigning asset...")
    setShowAssignAssetForm(false)
    alert("Asset assigned successfully!")
  }

  // Helper functions for role-based UI
  const isHR = userRole === "hr"
  const isAdmin = userRole === "super_admin"
  const isEmployee = userRole === "employee"

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background min-h-screen text-foreground font-inter">
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
          
          .shadow-card {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .shadow-item {
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }
          @media (max-width: 640px) {
            .shadow-card {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Asset Management</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            {isEmployee ? "Your assigned assets" : "Track and manage company assets and equipment"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {isEmployee && (
            <Button className="bg-primary hover:bg-primary/80 text-xs sm:text-sm" onClick={() => setShowRequestForm(true)}>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Request Asset
            </Button>
          )}
          {(isHR || isAdmin) && (
            <>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent text-xs sm:text-sm">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Asset Report
              </Button>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent text-xs sm:text-sm">
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Bulk Assignment
              </Button>
              {isHR && (
                <Button className="bg-primary hover:bg-primary/80 text-xs sm:text-sm" onClick={() => setShowAssignAssetForm(true)}>
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Assign Asset
                </Button>
              )}
              <Button className="bg-primary hover:bg-primary/80 text-xs sm:text-sm" onClick={() => setShowAddAssetForm(true)}>
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Asset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Inline Add Asset Form (HR only) */}
      {isHR && showAddAssetForm && (
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card relative">
          <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Add New Asset</h3>
          <button
            onClick={() => setShowAddAssetForm(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close form"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <form onSubmit={handleAddAsset} className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="assetName" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Asset Name
                </label>
                <Input
                  id="assetName"
                  placeholder="e.g., MacBook Pro 14"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="assetId" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Asset ID
                </label>
                <Input
                  id="assetId"
                  placeholder="e.g., LP-2025-0001"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Category
                </label>
                <Select defaultValue="Laptops" name="category">
                  <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {assetCategories.map((cat) => (
                      <SelectItem key={cat.category} value={cat.category} className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                        {cat.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Status
                </label>
                <Select defaultValue="Available" name="status">
                  <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="Available" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                      Available
                    </SelectItem>
                    <SelectItem value="Assigned" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                      Assigned
                    </SelectItem>
                    <SelectItem value="Maintenance" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                Location
              </label>
              <Input
                id="location"
                placeholder="e.g., Office Floor 4 / Remote"
                className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-3 sm:mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddAssetForm(false)}
                className="border-border hover:bg-muted/50 text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">
                Add Asset
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Inline Assign Asset Form (HR only) */}
      {isHR && showAssignAssetForm && (
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card relative">
          <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Assign Asset</h3>
          <button
            onClick={() => setShowAssignAssetForm(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close form"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <form onSubmit={handleAssignAsset} className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="assignEmployee" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Employee Name
                </label>
                <Input
                  id="assignEmployee"
                  placeholder="e.g., Jane Doe"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="assignDepartment" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Department
                </label>
                <Input
                  id="assignDepartment"
                  placeholder="e.g., Marketing"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="assignAsset" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Asset Name
                </label>
                <Input
                  id="assignAsset"
                  placeholder="e.g., Dell Monitor 27"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="assignAssetId" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Asset ID
                </label>
                <Input
                  id="assignAssetId"
                  placeholder="e.g., MN-2025-0010"
                  className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="assignLocation" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                Location
              </label>
              <Input
                id="assignLocation"
                placeholder="e.g., Office Floor 1 / Remote"
                className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4 sm:mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAssignAssetForm(false)}
                className="border-border hover:bg-muted/50 text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">
                Assign Asset
              </Button>
            </div>
          </form>
        </div>
      )}

      {isEmployee && showRequestForm && (
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card relative">
          <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Request Asset</h3>
          <button
            onClick={() => setShowRequestForm(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close form"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert("Asset request submitted!")
              setShowRequestForm(false)
            }}
            className="grid gap-3 sm:gap-4 py-2 sm:py-4"
          >
            <div>
              <label htmlFor="requestedAsset" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                Requested Asset
              </label>
              <Input
                id="requestedAsset"
                placeholder="e.g., iPad Pro"
                className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="reason" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                Reason
              </label>
              <Input
                id="reason"
                placeholder="e.g., Design mockups"
                className="bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 mt-3 sm:mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestForm(false)}
                className="border-border hover:bg-muted/50 text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80 text-xs sm:text-sm">
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Asset Stats (Hidden for Employees) */}
      {!isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {assetStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-card p-4 sm:p-5 rounded-xl shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 sm:mt-2">{stat.value}</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Asset Categories (Hidden for Employees) */}
      {!isEmployee && (
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Asset Categories Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {assetCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="p-3 sm:p-4 bg-muted/30 rounded-lg shadow-item">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm sm:text-base">{category.category}</h4>
                      <p className="text-xs text-muted-foreground">Total: {category.total}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Assigned:</span>
                      <span className="text-foreground font-medium">{category.assigned}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="text-green-500 font-medium">{category.available}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Maintenance:</span>
                      <span className="text-orange-500 font-medium">{category.maintenance}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-3">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(category.assigned / category.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Asset Assignments Section */}
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">{isEmployee ? "My Assets" : "Asset Assignments"}</h3>
        {/* Search and Filters (Hidden for Employees) */}
        {!isEmployee && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets or employees..."
                  value={searchTerm}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="All Categories" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  All Categories
                </SelectItem>
                {assetCategories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category} className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground focus:ring-1 focus:ring-primary text-xs sm:text-sm py-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="All Status" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  All Status
                </SelectItem>
                <SelectItem value="Active" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  Active
                </SelectItem>
                <SelectItem value="Available" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  Available
                </SelectItem>
                <SelectItem value="Returned" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  Returned
                </SelectItem>
                <SelectItem value="Maintenance" className="text-foreground hover:bg-muted/50 text-xs sm:text-sm">
                  Maintenance
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {/* Assignments List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg shadow-item"
              >
                <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-primary">
                      {assignment.employee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground truncate">
                      {assignment.employee}{" "}
                      {!isEmployee && <span className="text-xs text-muted-foreground">({assignment.department})</span>}
                    </p>
                    <p className="text-sm text-foreground truncate">
                      {assignment.asset} <span className="text-xs text-muted-foreground">ID: {assignment.assetId}</span>
                    </p>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{assignment.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-1 sm:mt-0">
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Assigned Date</p>
                    <p className="text-sm font-medium text-foreground">{assignment.assignDate}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      assignment.status === "Active"
                        ? "bg-green-500/20 text-green-400 text-xs"
                        : assignment.status === "Returned"
                          ? "bg-blue-500/20 text-blue-400 text-xs"
                          : "bg-orange-500/20 text-orange-400 text-xs"
                    }
                  >
                    {assignment.status}
                  </Badge>
                  {isHR && (
                    <div className="flex space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-muted/50 bg-transparent p-1.5 sm:p-2"
                        onClick={() => handleViewAsset(assignment.assetId)}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-muted/50 bg-transparent p-1.5 sm:p-2"
                        onClick={() => handleEditAsset(assignment.assetId)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground text-sm">
              {isEmployee ? "You don't have any assigned assets" : "No assignments found matching your criteria."}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Alerts and Asset Requests (Hidden for Employees) */}
      {!isEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Maintenance Alerts */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-foreground">Maintenance Alerts</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {maintenanceAlerts.map((alert, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg shadow-item">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.asset}</p>
                      <p className="text-xs text-muted-foreground">ID: {alert.assetId}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        alert.priority === "High"
                          ? "bg-red-500/20 text-red-400 text-xs"
                          : alert.priority === "Medium"
                            ? "bg-orange-500/20 text-orange-400 text-xs"
                            : "bg-blue-500/20 text-blue-400 text-xs"
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground mb-2">{alert.issue}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Due: {alert.dueDate}</p>
                    </div>
                    {isHR && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-muted/50 bg-transparent text-xs sm:text-sm"
                        onClick={() => handleScheduleMaintenance(alert.assetId)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Requests */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-4">Asset Requests</h3>
            <div className="space-y-3 sm:space-y-4">
              {assetRequests.map((request, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg shadow-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {request.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.employee}</p>
                        <p className="text-xs text-muted-foreground">{request.department}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        request.status === "Approved"
                          ? "bg-green-500/20 text-green-400 text-xs"
                          : "bg-orange-500/20 text-orange-400 text-xs"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{request.requestedAsset}</p>
                  <p className="text-xs text-muted-foreground mb-2">{request.reason}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Calendar className="h-3 w-3" /> <span>{request.requestDate}</span>
                    </p>
                    {isHR && request.status === "Pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                          onClick={() => handleApproveRequest(request.requestedAsset)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent text-xs sm:text-sm"
                          onClick={() => handleRejectRequest(request.requestedAsset)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isHR && (
              <Button className="w-full mt-4 bg-primary hover:bg-primary/80 text-sm">
                <Plus className="h-4 w-4 mr-2" />
                View All Requests
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}