import { useState, useMemo } from "react"
import { BarChart3, TrendingUp, Award, Users, Star, Eye, Download, Search, PlusCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
// import { Progress } from "@/components/ui/progress" // Removed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input" // Assuming you have an Input component

const performanceStats = [
  { name: "Avg Performance", value: "89.2/100", icon: Star, color: "text-yellow-500" },
  { name: "Top Performers", value: "156", icon: Award, color: "text-green-500" },
  { name: "Needs Improvement", value: "23", icon: TrendingUp, color: "text-orange-500" },
]

const initialPerformanceReviews = [
  {
    employee: "John Smith",
    department: "Engineering",
    manager: "Sarah Johnson",
    score: 4.5,
    status: "Complete",
    reviewDate: "2024-12-10",
    strengths: "Technical leadership, Code quality, Mentorship",
    improvements: "Communication skills in cross-functional teams",
  },
  {
    employee: "Emily Davis",
    department: "Marketing",
    manager: "Mike Wilson",
    score: 4.2,
    status: "Complete",
    reviewDate: "2024-12-08",
    strengths: "Creative thinking, Campaign management, Market analysis",
    improvements: "Data analysis for campaign optimization",
  },
  {
    employee: "Robert Brown",
    department: "Sales",
    manager: "Jennifer Lee",
    score: 3.8,
    status: "Pending", // This review is pending
    reviewDate: "2024-12-15", // Future date for a pending review
    strengths: "Client relations, Negotiation, Closing deals",
    improvements: "Time management, CRM tool proficiency",
  },
  {
    employee: "Lisa Chen",
    department: "HR",
    manager: "David Kim",
    score: 4.7,
    status: "Complete",
    reviewDate: "2024-12-05",
    strengths: "Employee engagement, Process improvement, Conflict resolution",
    improvements: "Technology adoption for HR analytics",
  },
  {
    employee: "Michael Green",
    department: "Finance",
    manager: "Sophia Rodriguez",
    score: 3.5,
    status: "Complete",
    reviewDate: "2024-12-01",
    strengths: "Financial reporting, Budget management",
    improvements: "Strategic financial planning, Cross-department collaboration",
  },
  {
    employee: "Anna Lee",
    department: "Engineering",
    manager: "Sarah Johnson",
    score: 4.1,
    status: "Complete",
    reviewDate: "2024-11-28",
    strengths: "Problem-solving, Team collaboration",
    improvements: "Project documentation",
  },
  {
    employee: "Daniel White",
    department: "Sales",
    manager: "Jennifer Lee",
    score: 3.2,
    status: "Pending", // Another pending review
    reviewDate: "2024-12-20",
    strengths: "Product knowledge, Customer service",
    improvements: "Lead generation, Sales pipeline management",
  },
]

const departmentPerformance = [
  { department: "Engineering", avgScore: 4.3, reviews: 45, completed: 42 },
  { department: "Sales", avgScore: 3.7, reviews: 38, completed: 35 }, // Adjusted avgScore for Sales
  { department: "Marketing", avgScore: 4.2, reviews: 25, completed: 23 },
  { department: "HR", avgScore: 4.5, reviews: 12, completed: 12 },
  { department: "Finance", avgScore: 4.0, reviews: 15, completed: 13 },
]

export default function PerformanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4 2024")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [reviewStatusFilter, setReviewStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered performance reviews based on selected filters and search query
  const filteredPerformanceReviews = useMemo(() => {
    let tempReviews = initialPerformanceReviews

    if (selectedDepartment !== "All Departments") {
      tempReviews = tempReviews.filter((review) => review.department === selectedDepartment)
    }

    if (reviewStatusFilter !== "All") {
      tempReviews = tempReviews.filter((review) => review.status === reviewStatusFilter)
    }

    if (searchQuery) {
      tempReviews = tempReviews.filter(
        (review) =>
          review.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.manager.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

   // Sort by review date, most recent first
return tempReviews.sort((a, b) => {
  const dateA = new Date(a.reviewDate).getTime(); // Get timestamp for date A
  const dateB = new Date(b.reviewDate).getTime(); // Get timestamp for date B
  return dateB - dateA; // Sort in descending order (most recent first)
});
}, [selectedDepartment, reviewStatusFilter, searchQuery])

  const handleViewNeedsImprovement = () => {
    setSelectedDepartment("All Departments"); // Reset department filter if set
    setReviewStatusFilter("Complete"); // Only look at completed reviews for improvement
    setSearchQuery(""); // Clear search
    // In a real app, you might also filter by score < 3.5 or similar logic
    // For now, it will simply show all "Complete" reviews, and the user can then visually identify
    // or we'd add more granular filtering here if scores were part of the status.
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
      {/* This inline style block is for demonstration. In a real project, these vars belong in tailwind.config.js */}
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
          .bg-yellow-500\\/20 { background-color: rgba(234, 179, 8, 0.2); }
          .text-yellow-500 { color: #eab308; }
          .bg-blue-500\\/20 { background-color: rgba(59, 130, 246, 0.2); }
          .text-blue-500 { color: #3b82f6; }
          .bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }
          .text-green-500 { color: #22c55e; }
          .bg-orange-500\\/20 { background-color: rgba(249, 115, 22, 0.2); }
          .text-orange-500 { color: #f97316; }
        `}
      </style>

      {/* Header Section with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Management</h1>
          <p className="text-muted-foreground mt-2">Track and analyze employee performance reviews for growth.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent" onClick={() => alert("Redirect to Performance Dashboard view")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Overall Dashboard
          </Button>
          <Button className="bg-primary hover:bg-primary/80" onClick={() => alert("Redirect to Recognition Program page")}>
            <Award className="h-4 w-4 mr-2" />
            Recognition Program
          </Button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.name === "Needs Improvement" && (
                <Button variant="outline" size="sm" className="mt-4 border-border hover:bg-muted/50 bg-transparent text-muted-foreground" onClick={handleViewNeedsImprovement}>
                  <Eye className="h-4 w-4 mr-2" /> View Employees
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Department Performance Overview */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Department Performance Overview</h3>
        <div className="space-y-6">
          {departmentPerformance.map((dept, index) => {
            const completionPercentage = (dept.completed / dept.reviews) * 100;
            return (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">{dept.reviews} total reviews</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="text-center min-w-[80px]">
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{dept.avgScore.toFixed(1)}/5.0</span>
                    </div>
                  </div>
                  <div className="text-center w-full sm:w-32">
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                    {/* Custom progress bar */}
                    <div className="h-2 w-full bg-muted rounded-full mt-2">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-foreground">
                      {Math.round(completionPercentage)}% ({dept.completed}/{dept.reviews})
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent flex-shrink-0" onClick={() => {
                    setSelectedDepartment(dept.department);
                    setReviewStatusFilter("All");
                    setSearchQuery("");
                  }}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Reviews */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Performance Reviews</h3>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee or manager..."
                className="pl-9 bg-background border-border w-full md:w-56"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full md:w-40 bg-background border-border">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Q4 2024" className="text-foreground hover:bg-muted/50">
                  Q4 2024
                </SelectItem>
                <SelectItem value="Q3 2024" className="text-foreground hover:bg-muted/50">
                  Q3 2024
                </SelectItem>
                <SelectItem value="Q2 2024" className="text-foreground hover:bg-muted/50">
                  Q2 2024
                </SelectItem>
                <SelectItem value="Q1 2024" className="text-foreground hover:bg-muted/50">
                  Q1 2024
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48 bg-background border-border">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All Departments" className="text-foreground hover:bg-muted/50">
                  All Departments
                </SelectItem>
                {/* Dynamically generated department select items */}
                {departmentPerformance.map((dept) => (
                  <SelectItem key={dept.department} value={dept.department} className="text-foreground hover:bg-muted/50">
                    {dept.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={reviewStatusFilter} onValueChange={setReviewStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="All" className="text-foreground hover:bg-muted/50">
                  All Statuses
                </SelectItem>
                <SelectItem value="Complete" className="text-foreground hover:bg-muted/50">
                  Complete
                </SelectItem>
                <SelectItem value="Pending" className="text-foreground hover:bg-muted/50">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/80 w-full md:w-auto" onClick={() => alert("Initiate New Review workflow")}>
              <PlusCircle className="h-4 w-4 mr-2" /> Initiate New Review
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {filteredPerformanceReviews.length > 0 ? (
            filteredPerformanceReviews.map((review, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {review.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.employee}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.department} • Reviewed by {review.manager}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs text-muted-foreground">Score</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-foreground">{review.score.toFixed(1)}/5.0</span>
                      </div>
                    </div>
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium text-foreground mt-1">{review.reviewDate}</p>
                    </div>
                    <Badge
                      className={`
                        ${review.status === "Complete" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"}
                        w-20 justify-center
                      `}
                    >
                      {review.status}
                    </Badge>
                    <Button size="icon" variant="outline" className="border-border hover:bg-muted/50 bg-transparent flex-shrink-0" onClick={() => alert(`Viewing full review for ${review.employee}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Strengths</p>
                    <p className="text-sm text-foreground">{review.strengths}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Areas for Improvement</p>
                    <p className="text-sm text-foreground">{review.improvements}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">No performance reviews match your criteria.</div>
          )}
        </div>
      </div>

      {/* Performance Trend Chart (Placeholder) */}
      
    </div>
  )
}