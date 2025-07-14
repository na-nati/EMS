import { useState } from "react"
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Filter,
  Clock,
  Send,
  Eye,
  Settings,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"

const reportCategories = [
  {
    name: "Payroll Reports",
    icon: DollarSign,
    description: "Salary summaries, tax reports, department costs",
    reports: ["Monthly Payroll", "Tax Summary", "Department Costs", "Salary Analysis"],
    color: "text-green-500",
  },
  {
    name: "Employee Reports",
    icon: Users,
    description: "Employee data, demographics, directory exports",
    reports: ["Employee Directory", "New Hires", "Separations", "Demographics"],
    color: "text-blue-500",
  },
  {
    name: "Attendance Reports",
    icon: Calendar,
    description: "Attendance tracking, time logs, department summaries",
    reports: ["Daily Attendance", "Monthly Summary", "Department Stats", "Overtime Report"],
    color: "text-purple-500",
  },
  {
    name: "Performance Reports",
    icon: TrendingUp,
    description: "Performance analytics, review summaries, ratings",
    reports: ["Performance Summary", "Department Rankings", "Review Status", "Goal Tracking"],
    color: "text-orange-500",
  },
  {
    name: "Training Reports",
    icon: FileText,
    description: "Training completion, certifications, skill development",
    reports: ["Training Completion", "Certification Tracking", "Skills Matrix", "Course Analytics"],
    color: "text-indigo-500",
  },
  {
    name: "Recruitment Reports",
    icon: BarChart3,
    description: "Hiring analytics, application tracking, source analysis",
    reports: ["Hiring Pipeline", "Source Analytics", "Time to Hire", "Application Metrics"],
    color: "text-pink-500",
  },
]

const quickReports = [
  { name: "Current Month Payroll", type: "Payroll", lastGenerated: "2024-12-15", size: "2.3 MB", status: "Ready" },
  { name: "Employee Directory", type: "Employee", lastGenerated: "2024-12-14", size: "890 KB", status: "Ready" },
  { name: "December Attendance", type: "Attendance", lastGenerated: "2024-12-13", size: "1.2 MB", status: "Ready" },
  {
    name: "Q4 Performance Summary",
    type: "Performance",
    lastGenerated: "2024-12-12",
    size: "3.1 MB",
    status: "Processing",
  },
  { name: "Training Analytics", type: "Training", lastGenerated: "2024-12-11", size: "1.8 MB", status: "Ready" },
]

const scheduledReports = [
  {
    name: "Weekly Attendance Summary",
    frequency: "Weekly",
    nextRun: "2024-12-20",
    recipients: "hr@company.com",
    status: "Active",
  },
  {
    name: "Monthly Payroll Report",
    frequency: "Monthly",
    nextRun: "2024-12-31",
    recipients: "finance@company.com",
    status: "Active",
  },
  {
    name: "Quarterly Performance Review",
    frequency: "Quarterly",
    nextRun: "2025-01-15",
    recipients: "management@company.com",
    status: "Paused",
  },
]

const reportTemplates = [
  { name: "Executive Summary", category: "Management", usage: "High", lastUsed: "2024-12-15" },
  { name: "Department Breakdown", category: "Analytics", usage: "Medium", lastUsed: "2024-12-12" },
  { name: "Compliance Report", category: "Legal", usage: "Low", lastUsed: "2024-12-08" },
  { name: "Budget Analysis", category: "Finance", usage: "High", lastUsed: "2024-12-14" },
]

export default function ReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Current Month")
  const [selectedFormat, setSelectedFormat] = useState("PDF")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

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
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Generate and download comprehensive HR reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics Dashboard
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="Current Month" className="text-foreground hover:bg-muted/50">
                Current Month
              </SelectItem>
              <SelectItem value="Last Month" className="text-foreground hover:bg-muted/50">
                Last Month
              </SelectItem>
              <SelectItem value="Current Quarter" className="text-foreground hover:bg-muted/50">
                Current Quarter
              </SelectItem>
              <SelectItem value="Last Quarter" className="text-foreground hover:bg-muted/50">
                Last Quarter
              </SelectItem>
              <SelectItem value="Current Year" className="text-foreground hover:bg-muted/50">
                Current Year
              </SelectItem>
              <SelectItem value="Custom Range" className="text-foreground hover:bg-muted/50">
                Custom Range
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="bg-background border-border">
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
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="PDF" className="text-foreground hover:bg-muted/50">
                PDF
              </SelectItem>
              <SelectItem value="Excel" className="text-foreground hover:bg-muted/50">
                Excel (XLSX)
              </SelectItem>
              <SelectItem value="CSV" className="text-foreground hover:bg-muted/50">
                CSV
              </SelectItem>
              <SelectItem value="Word" className="text-foreground hover:bg-muted/50">
                Word (DOCX)
              </SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full bg-primary hover:bg-primary/80">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <div key={index} className="bg-card p-6 rounded-xl border border-border hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {category.reports.map((report, reportIndex) => (
                  <div key={reportIndex} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm text-foreground">{report}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-border hover:bg-muted/50 bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Generate All Reports
              </Button>
            </div>
          )
        })}
      </div>

      {/* Grid Layout for Recent Reports and Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Generated Reports */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recently Generated Reports</h3>
          <div className="space-y-4">
            {quickReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.type} Report • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Generated</p>
                    <p className="text-sm font-medium text-foreground">{report.lastGenerated}</p>
                  </div>
                  <Badge
                    variant={report.status === "Ready" ? "default" : "secondary"}
                    className={
                      report.status === "Ready" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    }
                  >
                    {report.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-muted/50 bg-transparent"
                      disabled={report.status === "Processing"}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Scheduled Reports</h3>
          <div className="space-y-4">
            {scheduledReports.map((report, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <Badge
                    variant={report.status === "Active" ? "default" : "secondary"}
                    className={
                      report.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <h4 className="font-medium text-foreground text-sm">{report.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{report.frequency}</p>
                <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-muted/50 bg-transparent">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/80">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New Report
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <Badge
                  variant="secondary"
                  className={
                    template.usage === "High"
                      ? "bg-green-500/20 text-green-400"
                      : template.usage === "Medium"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                  }
                >
                  {template.usage}
                </Badge>
              </div>
              <h4 className="font-medium text-foreground text-sm">{template.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{template.category}</p>
              <p className="text-xs text-muted-foreground">Last used: {template.lastUsed}</p>
              <Button size="sm" className="w-full mt-3 bg-primary hover:bg-primary/80">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
