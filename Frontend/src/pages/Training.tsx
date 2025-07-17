import { useState, useMemo } from "react";
import { GraduationCap, Users, CheckCircle, Clock, BookOpen, Award, Plus, Eye, Download, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input"; // Assuming you have an Input component
import { Textarea } from "../components/ui/textarea"; // Assuming you have a Textarea component

// --- Data Definitions ---
const trainingStats = [
  { name: "Active Programs", value: "24", icon: GraduationCap, color: "text-blue-500" },
  { name: "Enrolled Employees", value: "456", icon: Users, color: "text-green-500" },
  { name: "Completed Courses", value: "1,248", icon: CheckCircle, color: "text-purple-500" },
  { name: "Pending Requests", value: "18", icon: Clock, color: "text-orange-500" },
];

// Training programs data
const initialTrainingPrograms = [
  {
    id: "prog001",
    name: "React.js Fundamentals",
    category: "Technical",
    duration: "40 hours",
    enrolled: 25,
    completed: 18,
    instructor: "John Tech",
    status: "Active",
    startDate: "2024-01-15",
    currentUserEnrolled: false,
  },
  {
    id: "prog002",
    name: "Leadership Development",
    category: "Management",
    duration: "60 hours",
    enrolled: 15,
    completed: 12,
    instructor: "Sarah Lead",
    status: "Active",
    startDate: "2024-02-01",
    currentUserEnrolled: false,
  },
  {
    id: "prog003",
    name: "Digital Marketing",
    category: "Marketing",
    duration: "30 hours",
    enrolled: 20,
    completed: 20,
    instructor: "Mike Digital",
    status: "Completed",
    startDate: "2024-01-10",
    currentUserEnrolled: false,
  },
  {
    id: "prog004",
    name: "Data Analytics",
    category: "Technical",
    duration: "50 hours",
    enrolled: 18,
    completed: 8,
    instructor: "Anna Data",
    status: "Active",
    startDate: "2024-02-15",
    currentUserEnrolled: false,
  },
  {
    id: "prog005",
    name: "Project Management Certification",
    category: "Management",
    duration: "80 hours",
    enrolled: 12,
    completed: 5,
    instructor: "David PM",
    status: "Active",
    startDate: "2024-03-01",
    currentUserEnrolled: false,
  },
  {
    id: "prog006",
    name: "UI/UX Design Principles",
    category: "Design",
    duration: "35 hours",
    enrolled: 22,
    completed: 15,
    instructor: "Emma Design",
    status: "Active",
    startDate: "2024-02-20",
    currentUserEnrolled: false,
  },
];

// Training requests data
const initialTrainingRequests = [
  {
    id: "treq001",
    employee: "Robert Wilson",
    department: "Engineering",
    course: "Advanced Python Programming",
    reason: "Career development",
    requestDate: "2024-12-10",
    cost: "$1,200",
    status: "Pending",
    currentUser: true,
  },
  {
    id: "treq002",
    employee: "Lisa Anderson",
    department: "Marketing",
    course: "Google Analytics Certification",
    reason: "Skill enhancement",
    requestDate: "2024-12-08",
    cost: "$300",
    status: "Approved",
    currentUser: false,
  },
  {
    id: "treq003",
    employee: "James Brown",
    department: "Sales",
    course: "Negotiation Skills Workshop",
    reason: "Performance improvement",
    requestDate: "2024-12-12",
    cost: "$800",
    status: "Pending",
    currentUser: false,
  },
  {
    id: "treq004",
    employee: "Maria Garcia",
    department: "HR",
    course: "Conflict Resolution Training",
    reason: "Team management",
    requestDate: "2024-12-09",
    cost: "$450",
    status: "Pending",
    currentUser: false,
  },
  {
    id: "treq005",
    employee: "Alex Johnson",
    department: "Finance",
    course: "Financial Modeling Advanced",
    reason: "Skill upgrade",
    requestDate: "2024-12-11",
    cost: "$950",
    status: "Approved",
    currentUser: false,
  },
];

const upcomingCertifications = [
  { name: "AWS Cloud Practitioner", employees: 8, deadline: "2024-12-30" },
  { name: "PMP Certification", employees: 5, deadline: "2025-01-15" },
  { name: "Google Ads Certification", employees: 12, deadline: "2024-12-25" },
  { name: "Scrum Master Certification", employees: 6, deadline: "2025-01-20" },
];

// --- Main Component ---
import type { UserRole } from '../contexts/AuthContext'

interface TrainingDashboardProps {
  userRole: UserRole;
  currentUser?: string;
}

export default function TrainingEmp({ userRole, currentUser = "Robert Wilson" }: TrainingDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [programs, setPrograms] = useState(initialTrainingPrograms);
  const [requests, setRequests] = useState(initialTrainingRequests);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [addProgramModalOpen, setAddProgramModalOpen] = useState(false); // State for Add Program modal

  const [newRequestData, setNewRequestData] = useState({
    course: "",
    reason: "",
    cost: ""
  });

  const [newProgramData, setNewProgramData] = useState({ // State for new program form
    name: "",
    category: "",
    duration: "",
    instructor: "",
    startDate: "",
    status: "Active" // Default status for new programs
  });

  // Filtered training programs based on selected filters and role
  const filteredPrograms = useMemo(() => {
    let result = [...programs];

    if (userRole === 'employee') {
      // Employees see only active programs
      result = result.filter(program => program.status === "Active");
    } else if (userRole === 'hr' || userRole === 'super_admin') { // HR and Admin can filter and see all statuses
      result = result.filter(program => {
        const matchesCategory = selectedCategory === "All Categories" || program.category === selectedCategory;
        const matchesStatus = selectedStatus === "All Status" || program.status === selectedStatus;
        return matchesCategory && matchesStatus;
      });
    }
    
    return result;
  }, [programs, selectedCategory, selectedStatus, userRole]);

  // Filter requests based on role and currentUser
  const filteredRequests = useMemo(() => {
    if (userRole === 'employee') {
      return requests.filter(req => req.employee === currentUser); // Filter by current user's name
    }
    // HR and Admin roles see all requests
    return requests;
  }, [requests, userRole, currentUser]);

  // Handler for approving a training request (HR/Admin only)
  const handleApproveRequest = (id: string) => {
    if (userRole === 'hr' || userRole === 'super_admin') {
      setRequests(prevRequests =>
        prevRequests.map(req => req.id === id ? { ...req, status: "Approved" } : req)
      );
      alert(`Training request ${id} approved!`);
    }
  };

  // Handler for rejecting a training request (HR/Admin only)
  const handleRejectRequest = (id: string) => {
    if (userRole === 'hr' || userRole === 'super_admin') {
      setRequests(prevRequests =>
        prevRequests.map(req => req.id === id ? { ...req, status: "Rejected" } : req)
      );
      alert(`Training request ${id} rejected.`);
    }
  };

  // Handler for canceling a training request (Employee only)
  const handleCancelRequest = (id: string) => {
    if (userRole === 'employee') {
      setRequests(prevRequests =>
        prevRequests.map(req => req.id === id ? { ...req, status: "Cancelled" } : req)
      );
      alert(`Training request ${id} cancelled.`);
    }
  };

  // Handler for requesting a new training (Employee only)
  const handleNewRequestSubmit = () => {
    if (!newRequestData.course.trim()) {
      alert("Course name is required for a new request.");
      return;
    }
    
    const newRequest = {
      id: `treq${Date.now()}-${Math.floor(Math.random() * 1000)}`, // More unique ID
      employee: currentUser,
      department: "Unknown", // Placeholder, ideally derived from user profile
      course: newRequestData.course,
      reason: newRequestData.reason || "Professional development",
      requestDate: new Date().toISOString().split('T')[0],
      cost: newRequestData.cost || "$0",
      status: "Pending",
      currentUser: true 
    };
    
    setRequests(prev => [...prev, newRequest]);
    setNewRequestModalOpen(false);
    setNewRequestData({ course: "", reason: "", cost: "" });
    alert("Training request submitted!");
  };

  // Handler for enrolling in a program (Employee only)
  const handleEnrollInProgram = (programId: string) => {
    if (userRole === 'employee') {
      setPrograms(prev => 
        prev.map(prog => 
          prog.id === programId 
            ? { ...prog, enrolled: prog.enrolled + 1, currentUserEnrolled: true } 
            : prog
        )
      );
      alert("Enrollment successful!");
    }
  };

  // Handler for adding a new program (HR/Admin only)
  const handleAddProgramSubmit = () => {
    if (userRole === 'hr' || userRole === 'super_admin') {
      if (!newProgramData.name.trim() || !newProgramData.category.trim() || !newProgramData.duration.trim() || !newProgramData.instructor.trim() || !newProgramData.startDate.trim()) {
        alert("Please fill in all required fields for the new program.");
        return;
      }

      const newProgram = {
        id: `prog${Date.now()}-${Math.floor(Math.random() * 1000)}`, // More unique ID
        name: newProgramData.name,
        category: newProgramData.category,
        duration: newProgramData.duration,
        enrolled: 0,
        completed: 0,
        instructor: newProgramData.instructor,
        status: newProgramData.status,
        startDate: newProgramData.startDate,
        currentUserEnrolled: false,
      };
      
      setPrograms(prev => [...prev, newProgram]);
      setAddProgramModalOpen(false);
      setNewProgramData({ // Reset form
        name: "",
        category: "",
        duration: "",
        instructor: "",
        startDate: "",
        status: "Active"
      });
      alert("New training program added!");
    }
  };

  // New Request Modal Component
  const renderNewRequestModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl border border-border w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">New Training Request</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setNewRequestModalOpen(false)}
            className="text-muted-foreground hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Course Name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              className="w-full bg-background border-border text-foreground"
              value={newRequestData.course}
              onChange={(e) => setNewRequestData({...newRequestData, course: e.target.value})}
              placeholder="e.g., Advanced Python Programming"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Reason</label>
            <Textarea
              className="w-full bg-background border-border text-foreground"
              value={newRequestData.reason}
              onChange={(e) => setNewRequestData({...newRequestData, reason: e.target.value})}
              placeholder="Why do you need this training? (Optional)"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Estimated Cost</label>
            <Input
              type="text"
              className="w-full bg-background border-border text-foreground"
              value={newRequestData.cost}
              onChange={(e) => setNewRequestData({...newRequestData, cost: e.target.value})}
              placeholder="$0 (Optional)"
            />
          </div>
          
          <Button 
            className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground"
            onClick={handleNewRequestSubmit}
            disabled={!newRequestData.course.trim()}
          >
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );

  // Add Program Modal Component (for HR/Admin)
  const renderAddProgramModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl border border-border w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Training Program</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setAddProgramModalOpen(false)}
            className="text-muted-foreground hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Program Name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              className="w-full bg-background border-border text-foreground"
              value={newProgramData.name}
              onChange={(e) => setNewProgramData({...newProgramData, name: e.target.value})}
              placeholder="e.g., Data Science Fundamentals"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Category <span className="text-red-500">*</span></label>
            <Select value={newProgramData.category} onValueChange={(value) => setNewProgramData({...newProgramData, category: value})}>
              <SelectTrigger className="w-full bg-background border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {/* The problematic SelectItem with value="" has been removed */}
                <SelectItem value="Technical" className="text-foreground hover:bg-muted/50">Technical</SelectItem>
                <SelectItem value="Management" className="text-foreground hover:bg-muted/50">Management</SelectItem>
                <SelectItem value="Marketing" className="text-foreground hover:bg-muted/50">Marketing</SelectItem>
                <SelectItem value="Design" className="text-foreground hover:bg-muted/50">Design</SelectItem>
                <SelectItem value="Soft Skills" className="text-foreground hover:bg-muted/50">Soft Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Duration <span className="text-red-500">*</span></label>
            <Input
              type="text"
              className="w-full bg-background border-border text-foreground"
              value={newProgramData.duration}
              onChange={(e) => setNewProgramData({...newProgramData, duration: e.target.value})}
              placeholder="e.g., 40 hours or 2 weeks"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Instructor <span className="text-red-500">*</span></label>
            <Input
              type="text"
              className="w-full bg-background border-border text-foreground"
              value={newProgramData.instructor}
              onChange={(e) => setNewProgramData({...newProgramData, instructor: e.target.value})}
              placeholder="e.g., Jane Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Start Date <span className="text-red-500">*</span></label>
            <Input
              type="date"
              className="w-full bg-background border-border text-foreground"
              value={newProgramData.startDate}
              onChange={(e) => setNewProgramData({...newProgramData, startDate: e.target.value})}
              required
            />
          </div>
          
          <Button 
            className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground"
            onClick={handleAddProgramSubmit}
            disabled={!newProgramData.name.trim() || !newProgramData.category.trim() || !newProgramData.duration.trim() || !newProgramData.instructor.trim() || !newProgramData.startDate.trim()}
          >
            Add Program
          </Button>
        </div>
      </div>
    </div>
  );

  // Style section for custom colors and font
  const styleContent = `
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
    /* Custom colors for badges */
    .bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }
    .text-green-400 { color: #4ade80; }
    .bg-orange-500\\/20 { background-color: rgba(249, 115, 22, 0.2); }
    .text-orange-400 { color: #fb923c; }
    .bg-blue-500\\/20 { background-color: rgba(59, 130, 246, 0.2); }
    .text-blue-400 { color: #60a5fa; }
    .bg-red-500\\/20 { background-color: rgba(239, 68, 68, 0.2); }
    .text-red-400 { color: #f87171; }
  `;

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      <style>{styleContent}</style>
      
      {/* Modals */}
      {newRequestModalOpen && renderNewRequestModal()}
      {addProgramModalOpen && renderAddProgramModal()}

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training & Education</h1>
          <p className="text-muted-foreground mt-2">
            {userRole === 'employee' 
              ? "Manage your learning and development" 
              : "Manage employee learning and development programs"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {userRole === 'employee' ? (
            <>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                My Training Report
              </Button>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <Award className="h-4 w-4 mr-2" />
                My Certifications
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
                onClick={() => setNewRequestModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Training
              </Button>
            </>
          ) : ( // Applies to HR and Admin roles
            <>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Training Report
              </Button>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <Award className="h-4 w-4 mr-2" />
                Certifications
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
                onClick={() => setAddProgramModalOpen(true)} // Open Add Program modal
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            </>
          )}
        </div>
      </div>

      {/* --- Training Stats (HR/Admin only) --- */}
      {(userRole === 'hr' || userRole === 'super_admin') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainingStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Training Programs --- */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            {userRole === 'employee' ? "Available Training Programs" : "Training Programs"}
          </h3>
          
          {(userRole === 'hr' || userRole === 'super_admin') && (
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All Categories" className="text-foreground hover:bg-muted/50">
                    All Categories
                  </SelectItem>
                  <SelectItem value="Technical" className="text-foreground hover:bg-muted/50">
                    Technical
                  </SelectItem>
                  <SelectItem value="Management" className="text-foreground hover:bg-muted/50">
                    Management
                  </SelectItem>
                  <SelectItem value="Marketing" className="text-foreground hover:bg-muted/50">
                    Marketing
                  </SelectItem>
                  <SelectItem value="Design" className="text-foreground hover:bg-muted/50">
                    Design
                  </SelectItem>
                  <SelectItem value="Soft Skills" className="text-foreground hover:bg-muted/50">
                    Soft Skills
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All Status" className="text-foreground hover:bg-muted/50">
                    All Status
                  </SelectItem>
                  <SelectItem value="Active" className="text-foreground hover:bg-muted/50">
                    Active
                  </SelectItem>
                  <SelectItem value="Completed" className="text-foreground hover:bg-muted/50">
                    Completed
                  </SelectItem>
                  <SelectItem value="Upcoming" className="text-foreground hover:bg-muted/50">
                    Upcoming
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div key={program.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground">{program.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {program.category} • {program.duration} • Instructor: {program.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Badge
                      className={
                        program.status === "Active"
                          ? "bg-primary/20 text-primary"
                          : program.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                      }
                    >
                      {program.status}
                    </Badge>
                    
                    {userRole === 'employee' ? (
                      program.currentUserEnrolled ? (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          Enrolled
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/80 text-primary-foreground"
                          onClick={() => handleEnrollInProgram(program.id)}
                        >
                          Enroll Now
                        </Button>
                      )
                    ) : ( // HR and Admin roles see view details button
                      <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium text-foreground">{program.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                    <p className="text-sm font-medium text-foreground">{program.enrolled} employees</p>
                  </div>
                 
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">
              {userRole === 'employee' 
                ? "No available training programs at this time." 
                : "No training programs found for the selected criteria."}
            </div>
          )}
        </div>
      </div>

      {/* --- Grid Layout for Training Requests and Certifications --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Requests */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {userRole === 'employee' ? "My Training Requests" : "Training Requests"}
          </h3>
          
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0 flex-grow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {request.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.employee}</p>
                      <p className="text-xs text-muted-foreground">{request.department}</p>
                      <p className="text-sm text-foreground font-semibold mt-1">{request.course}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-right min-w-[70px]">
                      <p className="text-sm font-medium text-foreground">{request.cost}</p>
                      <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                    </div>
                    <Badge
                      className={
                        request.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : request.status === "Rejected" || request.status === "Cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-orange-500/20 text-orange-400"
                      }
                    >
                      {request.status}
                    </Badge>
                    <div className="flex space-x-2">
                      {(userRole === 'hr' || userRole === 'super_admin') && request.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {userRole === 'employee' && request.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8">
                {userRole === 'employee' 
                  ? "You haven't submitted any training requests." 
                  : "No training requests found."}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Certifications */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {userRole === 'employee' ? "My Upcoming Certifications" : "Upcoming Certifications"}
          </h3>
          <div className="space-y-4">
            {upcomingCertifications.length > 0 ? (
              upcomingCertifications.map((cert, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {cert.employees} enrolled
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground text-base">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Deadline: {cert.deadline}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-border hover:bg-muted/50 bg-transparent"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8">
                {userRole === 'employee' 
                  ? "You have no upcoming certifications." 
                  : "No upcoming certifications."}
              </div>
            )}
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            {userRole === 'employee' ? "Request Certification" : "Schedule Certification"}
          </Button>
        </div>
      </div>
    </div>
  );
}