import { useState } from "react"
import { DollarSign, Download, Edit, Eye, Calculator, TrendingUp, Users, Calendar } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

const payrollSummary = [
  { name: "Total Payroll", value: "$2,450,000", icon: DollarSign, change: "+8%", changeType: "positive" },
  { name: "Employees Paid", value: "1,198", icon: Users, change: "+2%", changeType: "positive" },
  { name: "Average Salary", value: "$85,420", icon: Calculator, change: "+5%", changeType: "positive" },
  { name: "Processing Status", value: "Complete", icon: Calendar, change: "100%", changeType: "positive" },
]

const departmentPayroll = [
  { department: "Engineering", employees: 450, totalCost: "$1,125,000", avgSalary: "$95,000", status: "Processed" },
  { department: "Sales", employees: 280, totalCost: "$672,000", avgSalary: "$78,500", status: "Processed" },
  { department: "Marketing", employees: 120, totalCost: "$312,000", avgSalary: "$85,200", status: "Processed" },
  { department: "HR", employees: 45, totalCost: "$135,000", avgSalary: "$82,000", status: "Processed" },
  { department: "Finance", employees: 35, totalCost: "$122,500", avgSalary: "$95,500", status: "Processing" },
]

const recentPayrolls = [
  { month: "December 2024", status: "Processing", amount: "$2,450,000", date: "2024-12-15" },
  { month: "November 2024", status: "Complete", amount: "$2,380,000", date: "2024-11-15" },
  { month: "October 2024", status: "Complete", amount: "$2,420,000", date: "2024-10-15" },
  { month: "September 2024", status: "Complete", amount: "$2,350,000", date: "2024-09-15" },
]

export default function PayrollDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("December 2024")

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
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">Manage employee salaries and payroll processing</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Calculator className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Edit className="h-4 w-4 mr-2" />
            Update Salaries
          </Button>
        </div>
      </div>

      {/* Payroll Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollSummary.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp
                  className={`h-4 w-4 mr-1 ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`}
                />
                <span
                  className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Department Payroll Breakdown */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Department Payroll Breakdown</h3>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {recentPayrolls.map((payroll) => (
                <SelectItem key={payroll.month} value={payroll.month} className="text-foreground hover:bg-muted/50">
                  {payroll.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {departmentPayroll.map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{dept.department}</p>
                  <p className="text-xs text-muted-foreground">{dept.employees} employees</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-right">
                <div>
                  <p className="text-sm font-medium text-foreground">{dept.totalCost}</p>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{dept.avgSalary}</p>
                  <p className="text-xs text-muted-foreground">Avg Salary</p>
                </div>
                <Badge
                  variant={dept.status === "Processed" ? "default" : "secondary"}
                  className="bg-primary/20 text-primary"
                >
                  {dept.status}
                </Badge>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payroll History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payroll History</h3>
          <div className="space-y-4">
            {recentPayrolls.map((payroll, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{payroll.month}</p>
                  <p className="text-xs text-muted-foreground">Processed on {payroll.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{payroll.amount}</p>
                    <Badge
                      variant={payroll.status === "Complete" ? "default" : "secondary"}
                      className="bg-primary/20 text-primary"
                    >
                      {payroll.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50 bg-transparent">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Payroll for Current Month
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Bulk Salary Updates
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Tax Reports
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50 bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              Payroll Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50 bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              Employee Salary Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
