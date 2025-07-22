import { useState } from "react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"

import { Progress } from "../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/lable"
import { Textarea } from "../components/ui/textarea"
import { Users, Award, BarChart3, Star, ArrowUpRight, FileText, Plus, Edit, Eye, Search } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

// Mock data for self-assessments and performance reviews
const selfAssessments = [
  {
    id: 1,
    employee: "John Doe",
    period: "H2 2024",
    submittedDate: "2024-12-15",
    status: "Submitted",
    tasks: [
      { task: "Led mobile app redesign project", achievement: "Delivered 2 weeks ahead of schedule with 95% client satisfaction" },
      { task: "Mentored junior developers", achievement: "Successfully onboarded 3 new team members" }
    ],
    managerRating: null,
    managerFeedback: ""
  },
  {
    id: 2,
    employee: "Jane Smith",
    period: "H2 2024",
    submittedDate: "2024-12-10",
    status: "Rated",
    tasks: [
      { task: "Improved sales conversion rate", achievement: "Increased conversion by 23% through new strategy implementation" }
    ],
    managerRating: 85,
    managerFeedback: "Excellent performance in sales optimization. Great strategic thinking."
  }
]

const performanceReviews = [
  {
    id: 1,
    employee: "John Smith",
    employeeId: "EMP001",
    manager: "Sarah Johnson",
    period: "H2 2024",
    rating: 4.5,
    status: "Completed",
    feedback: "Excellent performance with strong leadership skills.",
    submittedDate: "2024-12-01",
    department: "Engineering"
  },
  {
    id: 2,
    employee: "Emily Davis",
    employeeId: "EMP002",
    manager: "Michael Brown",
    period: "H2 2024",
    rating: 4.2,
    status: "In Progress",
    feedback: "Good technical skills, needs improvement in communication.",
    submittedDate: "2024-11-28",
    department: "Design"
  },
  {
    id: 3,
    employee: "Alex Wilson",
    employeeId: "EMP003",
    manager: "Sarah Johnson",
    period: "H2 2024",
    rating: 3.8,
    status: "Pending",
    feedback: "Meets expectations, room for growth in project management.",
    submittedDate: "2024-11-25",
    department: "Marketing"
  },
]

const departmentPerformance = [
  { name: "Engineering", performance: 92, employees: 45, completed: 42 },
  { name: "Marketing", performance: 88, employees: 25, completed: 23 },
  { name: "Sales", performance: 85, employees: 30, completed: 28 },
  { name: "HR", performance: 95, employees: 12, completed: 12 },
]

const Performance = () => {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("H2 2024")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showSelfAssessmentModal, setShowSelfAssessmentModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Please log in to access performance management</h2>
          <p className="text-muted-foreground">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  // Role-based data filtering
  const getFilteredData = () => {
    let data = performanceReviews
    let assessments = selfAssessments

    if (user?.role === "employee") {
      data = data.filter((review) => review.employee === `${user.firstName} ${user.lastName}`)
      assessments = assessments.filter((assessment) => assessment.employee === `${user.firstName} ${user.lastName}`)
    } else if (user?.role === "manager") {
      data = data.filter((review) => review.department === user.department)
      assessments = assessments.filter((assessment) => {
        const reviewForEmployee = performanceReviews.find(r => r.employee === assessment.employee)
        return reviewForEmployee?.department === user.department
      })
    }
    // HR can see all data

    return {
      reviews: data.filter(review =>
        review.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      assessments: assessments.filter(assessment =>
        assessment.employee.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  }

  const { reviews: filteredReviews, assessments: filteredAssessments } = getFilteredData()

  const getPerformanceStats = () => ([
    { title: "Average Rating", value: "4.2/5", icon: Star, trend: "+0.3", color: "text-yellow-500" },
    { title: "Top Performers", value: "156", icon: Award, trend: "+12", color: "text-green-500" },
    { title: "Needs Improvement", value: "23", icon: BarChart3, trend: "-2", color: "text-orange-500" },
    { title: "Total Reviews", value: "245", icon: Users, trend: "+18", color: "text-blue-500" },
  ]);

  const renderRoleSpecificActions = () => {
    if (user?.role === "employee") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showSelfAssessmentModal} onOpenChange={setShowSelfAssessmentModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Submit Self-Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border text-foreground">
              <DialogHeader>
                <DialogTitle>Submit Self-Assessment - {selectedPeriod}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select defaultValue={selectedPeriod}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="H1 2024">H1 2024</SelectItem>
                      <SelectItem value="H2 2024">H2 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tasks & Achievements</Label>
                  <div className="space-y-3 mt-2">
                    <div className="border border-border rounded-lg p-3 bg-muted/30">
                      <Label htmlFor="task1">Task 1</Label>
                      <Input
                        id="task1"
                        placeholder="Describe your main task or responsibility"
                        className="bg-background border-border text-foreground mt-1"
                      />
                      <Label htmlFor="achievement1" className="mt-2 block">Achievement</Label>
                      <Textarea
                        id="achievement1"
                        placeholder="Describe what you achieved and the impact"
                        className="bg-background border-border text-foreground mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="border border-border rounded-lg p-3 bg-muted/30">
                      <Label htmlFor="task2">Task 2</Label>
                      <Input
                        id="task2"
                        placeholder="Describe your main task or responsibility"
                        className="bg-background border-border text-foreground mt-1"
                      />
                      <Label htmlFor="achievement2" className="mt-2 block">Achievement</Label>
                      <Textarea
                        id="achievement2"
                        placeholder="Describe what you achieved and the impact"
                        className="bg-background border-border text-foreground mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2 border-border hover:bg-muted/50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Tasks
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSelfAssessmentModal(false)} className="border-border hover:bg-muted/50">
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/80">Submit Assessment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View My History
          </Button>
        </div>
      )
    }

    if (user?.role === "manager") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            Team Analytics
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Export Team Report
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
          <FileText className="w-4 h-4 mr-2" />
          Export All Data
        </Button>
        <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Analytics
        </Button>
        <Button className="bg-primary hover:bg-primary/80">
          <Award className="w-4 h-4 mr-2" />
          Recognition Program
        </Button>
      </div>
    )
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
          .hover\\:bg-primary\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
          .hover\\:bg-muted\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Performance Management</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {user?.role === "employee" && "Submit self-assessments and track your performance"}
            {user?.role === "manager" && "Rate team performance and provide feedback"}
            {user?.role === "hr" && "View all evaluations and generate analytics"}
          </p>
        </div>
        {renderRoleSpecificActions()}
      </div>
      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {getPerformanceStats().map((stat) => (
          <div key={stat.title} className="bg-card p-3 sm:p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color} flex-shrink-0 ml-2`} />
            </div>
            {stat.trend && (
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span>{stat.trend} since last period</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Main Content Sections (role-based) */}
      {(user?.role === "employee" || user?.role === "manager") && (
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 bg-background border border-border rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-primary mb-4">Self-Assessments</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {user?.role === "employee" ? "My Self-Assessments" : "Team Self-Assessments"}
          </h2>
          <div className="space-y-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{assessment.employee}</h4>
                      <Badge variant={assessment.status === "Submitted" ? "outline" : assessment.status === "Rated" ? "default" : "secondary"}>
                        {assessment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{assessment.period} • Submitted: {assessment.submittedDate}</p>
                    {assessment.managerRating && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-foreground">Manager Rating: {assessment.managerRating}%</p>
                        <p className="text-sm text-muted-foreground">{assessment.managerFeedback}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-border hover:bg-muted/50">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {user?.role === "manager" && assessment.status === "Submitted" && (
                      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-primary hover:bg-primary/80">
                            <Edit className="w-4 h-4 mr-2" />
                            Rate Performance
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card border-border text-foreground">
                          <DialogHeader>
                            <DialogTitle>Rate Performance - {assessment.employee}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Assessment Tasks & Achievements</Label>
                              <div className="space-y-3 mt-2 bg-muted/30 rounded-lg p-4">
                                {assessment.tasks.map((task, index) => (
                                  <div key={index} className="space-y-2">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">Task: {task.task}</p>
                                      <p className="text-sm text-muted-foreground">Achievement: {task.achievement}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="rating">Performance Rating (0-100%)</Label>
                              <Input
                                id="rating"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Enter rating percentage"
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="feedback">Feedback & Comments</Label>
                              <Textarea
                                id="feedback"
                                placeholder="Provide detailed feedback on performance, strengths, and areas for improvement"
                                className="bg-background border-border text-foreground"
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRatingModal(false)} className="border-border hover:bg-muted/50">
                              Cancel
                            </Button>
                            <Button className="bg-primary hover:bg-primary/80">Submit Rating</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredAssessments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {user?.role === "employee" ? "No self-assessments submitted yet." : "No team assessments to review."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Department Performance Overview (HR Only) */}
      {user?.role === "hr" && (
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 bg-background border border-border rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-primary mb-4">Department Performance Overview</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Performance metrics by department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentPerformance.map((dept) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{dept.name}</h4>
                  <Badge variant="outline" className="border-border text-foreground">
                    {dept.performance}%
                  </Badge>
                </div>
                <Progress value={dept.performance} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{dept.employees} employees</span>
                  <span>{dept.completed} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Reviews */}
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 bg-background border border-border rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-primary mb-4">Performance Reviews</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {user?.role === "employee" ? "My Performance Reviews" : "Performance Reviews"}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              {user?.role === "employee" ? "Your evaluation history and ratings" : "Employee evaluations and feedback"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {(user?.role === "manager" || user?.role === "hr") && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-48 bg-background border-border text-foreground"
                />
              </div>
            )}
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="H2 2024" className="text-foreground hover:bg-muted/50">H2 2024</SelectItem>
                <SelectItem value="H1 2024" className="text-foreground hover:bg-muted/50">H1 2024</SelectItem>
              </SelectContent>
            </Select>
            {user?.role === "hr" && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/50">All Departments</SelectItem>
                  <SelectItem value="Engineering" className="text-foreground hover:bg-muted/50">Engineering</SelectItem>
                  <SelectItem value="Design" className="text-foreground hover:bg-muted/50">Design</SelectItem>
                  <SelectItem value="Marketing" className="text-foreground hover:bg-muted/50">Marketing</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {filteredReviews
            .filter(review => selectedDepartment === "all" || review.department === selectedDepartment)
            .map((review) => (
              <div key={review.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg bg-muted/30 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{review.employee}</h4>
                    {(user?.role === "manager" || user?.role === "hr") && (
                      <span className="text-xs text-muted-foreground">({review.employeeId})</span>
                    )}
                    <Badge variant={review.status === "Completed" ? "default" : review.status === "In Progress" ? "secondary" : "outline"}>
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.manager} • {review.period}
                    {(user?.role === "manager" || user?.role === "hr") && ` • ${review.department}`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{review.feedback}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-foreground">{review.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          {filteredReviews.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No performance reviews found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Performance