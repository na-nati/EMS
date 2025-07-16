import { useState, type SetStateAction } from "react"
import { Users, Plus, Search, Upload, Download, Edit, Trash2, Eye, Filter, Building } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

const employees = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2022-01-15",
    phone: "+1-555-0123",
  },
  {
    id: 2,
    name: "Sarah Connor",
    email: "sarah.connor@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    joinDate: "2021-03-22",
    phone: "+1-555-0124",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Sales",
    position: "Sales Representative",
    status: "Active",
    joinDate: "2023-05-10",
    phone: "+1-555-0125",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "HR",
    position: "HR Specialist",
    status: "Inactive",
    joinDate: "2020-08-05",
    phone: "+1-555-0126",
  },
]

const departments = ["All Departments", "Engineering", "Marketing", "Sales", "HR", "Finance"]

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All Departments" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen text-foreground font-inter">
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee records and departments</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-foreground">1,234</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">1,198</p>
            </div>
            <div className="h-8 w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <Building className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New This Month</p>
              <p className="text-2xl font-bold text-foreground">15</p>
            </div>
            <Plus className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Employee Directory</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-foreground hover:bg-muted/50">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                  <p className="text-xs text-muted-foreground">{employee.phone}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-foreground">{employee.position}</p>
                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                </div>
                <Badge
                  variant={employee.status === "Active" ? "default" : "secondary"}
                  className={
                    employee.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                  }
                >
                  {employee.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0 flex-wrap justify-end sm:justify-start">
                <span className="text-xs text-muted-foreground flex-shrink-0">Joined: {employee.joinDate}</span>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Employees
