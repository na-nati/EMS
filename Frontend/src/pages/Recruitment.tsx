import { useState } from 'react';
import {
  Building,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  Search,
  Trash2,
  MapPin,
  DollarSign,
  Briefcase,
  Send,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

// Mock Data
const recruitmentStats = [
  { name: 'Open Positions', value: '24', icon: Building, color: 'text-blue-500' },
  { name: 'Active Applications', value: '156', icon: FileText, color: 'text-green-500' },
  { name: 'Interviews Scheduled', value: '32', icon: Calendar, color: 'text-purple-500' },
  { name: 'Pending Approvals', value: '8', icon: Clock, color: 'text-orange-500' },
];

const mockJobPostings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    applications: 45,
    posted: '2024-12-01',
    deadline: '2024-12-30',
    applicationStart: '2024-12-01',
    applicationEnd: '2024-12-30',
    status: 'Active',
    salary: '$95k - $120k',
    experience: '5+ years',
    requirements: 'React, Node.js, TypeScript, AWS',
    description: 'We are looking for a senior software engineer to join our growing team...',
    benefits: 'Health insurance, 401k, Remote work'
  },
  {
    id: 2,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New York',
    type: 'Full-time',
    applications: 28,
    posted: '2024-11-25',
    deadline: '2024-12-25',
    applicationStart: '2024-11-25',
    applicationEnd: '2024-12-25',
    status: 'Active',
    salary: '$75k - $90k',
    experience: '3+ years',
    requirements: 'Digital Marketing, SEO, Analytics',
    description: 'Lead our marketing initiatives and drive brand growth...',
    benefits: 'Health insurance, Bonus structure, Office perks'
  }
];

const mockHiringRequests = [
  {
    id: 1,
    position: 'DevOps Engineer',
    requestedBy: 'John Smith',
    department: 'Engineering',
    urgency: 'High',
    requestDate: '2024-12-10',
    justification: 'Team expansion for new project',
    numberOfEmployees: 2,
    expectedSalary: '$80k - $100k',
    skills: 'Docker, Kubernetes, AWS',
    status: 'Pending'
  },
  {
    id: 2,
    position: 'Content Writer',
    requestedBy: 'Sarah Wilson',
    department: 'Marketing',
    urgency: 'Medium',
    requestDate: '2024-12-08',
    justification: 'Content strategy scale-up',
    numberOfEmployees: 1,
    expectedSalary: '$45k - $60k',
    skills: 'SEO Writing, Content Strategy',
    status: 'Approved'
  }
];

const mockDocuments = [
  {
    id: 1,
    name: 'Resume - Alice Johnson.pdf',
    type: 'Resume',
    applicant: 'Alice Johnson',
    position: 'Senior Software Engineer',
    uploadDate: '2024-12-15',
    status: 'Approved',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Cover Letter - Bob Smith.pdf',
    type: 'Cover Letter',
    applicant: 'Bob Smith',
    position: 'Marketing Manager',
    uploadDate: '2024-12-14',
    status: 'Pending',
    size: '1.1 MB'
  }
];

const Recruitment = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showJobForm, setShowJobForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  // Update state initializations to allow storing the relevant object
  const [showDocumentModal, setShowDocumentModal] = useState<null | typeof mockDocuments[0]>(null);
  const [editingJob, setEditingJob] = useState<null | typeof mockJobPostings[0]>(null);
  const [viewingJob, setViewingJob] = useState<null | typeof mockJobPostings[0]>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    experience: '',
    requirements: '',
    description: '',
    benefits: '',
    applicationStart: '',
    applicationEnd: ''
  });
  const [requestFormData, setRequestFormData] = useState({
    position: '',
    department: user?.department || '',
    numberOfEmployees: 1,
    urgency: 'Medium',
    justification: '',
    expectedSalary: '',
    skills: ''
  });
  const [hiringRequests, setHiringRequests] = useState(mockHiringRequests);
  const [jobPostings, setJobPostings] = useState(mockJobPostings);
  // Add state for viewing a hiring request
  const [viewingRequest, setViewingRequest] = useState<null | typeof mockHiringRequests[0]>(null);
  // Add state for document management
  const [documents, setDocuments] = useState(mockDocuments);
  const [documentSearch, setDocumentSearch] = useState('');
  const [documentStatus, setDocumentStatus] = useState('All');
  const [editingDocument, setEditingDocument] = useState<null | typeof mockDocuments[0]>(null);
  const [addingDocument, setAddingDocument] = useState(false);

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(documentSearch.toLowerCase()) ||
      doc.applicant.toLowerCase().includes(documentSearch.toLowerCase()) ||
      doc.position.toLowerCase().includes(documentSearch.toLowerCase());
    const matchesStatus = documentStatus === 'All' || doc.status === documentStatus;
    return matchesSearch && matchesStatus;
  });

  // Role-based data filtering
  const getFilteredData = () => {
    let jobs = jobPostings;
    let requests = hiringRequests;

    if (user?.role === 'manager') {
      // Manager sees only their department
      jobs = jobs.filter(job => job.department === user.department);
      requests = requests.filter(req => req.department === user.department);
    }

    // Apply search and filters
    if (searchTerm) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'All Departments') {
      jobs = jobs.filter(job => job.department === selectedDepartment);
    }

    if (selectedStatus !== 'All Status') {
      jobs = jobs.filter(job => job.status === selectedStatus);
    }

    return { jobs, requests };
  };

  const { jobs: filteredJobs, requests: filteredRequests } = getFilteredData();

  const handleCreateJob = () => {
    console.log('Creating job with data:', jobFormData);
    setShowJobForm(false);
    setJobFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      experience: '',
      requirements: '',
      description: '',
      benefits: '',
      applicationStart: '',
      applicationEnd: ''
    });
  };

  const handleCreateRequest = () => {
    console.log('Creating hiring request:', requestFormData);
    setShowRequestForm(false);
    setRequestFormData({
      position: '',
      department: user?.department || '',
      numberOfEmployees: 1,
      urgency: 'Medium',
      justification: '',
      expectedSalary: '',
      skills: ''
    });
  };

  const getPageTitle = () => {
    if (user?.role === 'manager') return 'Recruitment Requests';
    if (user?.role === 'hr') return 'Recruitment Management';
    return 'Recruitment';
  };

  const getPageDescription = () => {
    if (user?.role === 'manager') return 'Request new hires for your department';
    if (user?.role === 'hr') return 'Manage job postings and hiring requests';
    return 'View job opportunities and recruitment information';
  };

  const renderManagerActions = () => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/80">
            <Send className="h-4 w-4 mr-2" />
            Request New Hire
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Request New Hire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position Title</Label>
                <Input
                  id="position"
                  value={requestFormData.position}
                  onChange={(e) => setRequestFormData({ ...requestFormData, position: e.target.value })}
                  placeholder="e.g., Senior Developer"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  min="1"
                  value={requestFormData.numberOfEmployees}
                  onChange={(e) => setRequestFormData({ ...requestFormData, numberOfEmployees: parseInt(e.target.value) })}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={requestFormData.urgency} onValueChange={(value) => setRequestFormData({ ...requestFormData, urgency: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expectedSalary">Expected Salary Range</Label>
                <Input
                  id="expectedSalary"
                  value={requestFormData.expectedSalary}
                  onChange={(e) => setRequestFormData({ ...requestFormData, expectedSalary: e.target.value })}
                  placeholder="e.g., $70k - $90k"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="skills">Required Skills & Qualifications</Label>
              <Textarea
                id="skills"
                value={requestFormData.skills}
                onChange={(e) => setRequestFormData({ ...requestFormData, skills: e.target.value })}
                placeholder="List key skills, experience, and qualifications required..."
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="justification">Business Justification</Label>
              <Textarea
                id="justification"
                value={requestFormData.justification}
                onChange={(e) => setRequestFormData({ ...requestFormData, justification: e.target.value })}
                placeholder="Explain why this hire is necessary..."
                className="bg-background border-border text-foreground"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowRequestForm(false)} className="border-border hover:bg-muted/50">
              Cancel
            </Button>
            <Button onClick={handleCreateRequest} className="bg-primary hover:bg-primary/80">
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="outline" className="border-border hover:bg-muted/50">
        <Eye className="h-4 w-4 mr-2" />
        My Requests
      </Button>
    </div>
  );

  const renderHRActions = () => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Create Job Vacancy</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={jobFormData.department} onValueChange={(value) => setJobFormData({ ...jobFormData, department: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={jobFormData.location}
                  onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                  placeholder="e.g., Remote, New York"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="type">Employment Type</Label>
                <Select value={jobFormData.type} onValueChange={(value) => setJobFormData({ ...jobFormData, type: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience Required</Label>
                <Input
                  id="experience"
                  value={jobFormData.experience}
                  onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                  placeholder="e.g., 3-5 years"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={jobFormData.salary}
                  onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                  placeholder="e.g., $70k - $90k"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Key Requirements</Label>
                <Input
                  id="requirements"
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  placeholder="e.g., React, Node.js, 5+ years"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicationStart">Application Start Date</Label>
                <Input
                  id="applicationStart"
                  type="date"
                  value={jobFormData.applicationStart}
                  onChange={(e) => setJobFormData({ ...jobFormData, applicationStart: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="applicationEnd">Application End Date</Label>
                <Input
                  id="applicationEnd"
                  type="date"
                  value={jobFormData.applicationEnd}
                  onChange={(e) => setJobFormData({ ...jobFormData, applicationEnd: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Job Description (Rich Text)</Label>
              <Textarea
                id="description"
                value={jobFormData.description}
                onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                placeholder="Detailed job description, responsibilities, and company information..."
                className="bg-background border-border text-foreground"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea
                id="benefits"
                value={jobFormData.benefits}
                onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                placeholder="Health insurance, retirement plans, vacation policy, etc..."
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowJobForm(false)} className="border-border hover:bg-muted/50">
              Cancel
            </Button>
            <Button variant="outline" className="border-border hover:bg-muted/50">
              Save as Draft
            </Button>
            <Button onClick={handleCreateJob} className="bg-primary hover:bg-primary/80">
              Post Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="outline" className="border-border hover:bg-muted/50">
        <FileText className="h-4 w-4 mr-2" />
        Applications Report
      </Button>
      <Button variant="outline" className="border-border hover:bg-muted/50">
        <Calendar className="h-4 w-4 mr-2" />
        Interview Schedule
      </Button>
    </div>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Please log in to access recruitment</h2>
          <p className="text-muted-foreground">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">{getPageDescription()}</p>
        </div>
        {user.role === 'manager' && renderManagerActions()}
        {user.role === 'hr' && renderHRActions()}
      </div>

      {/* Stats (HR and Manager) */}
      {(user.role === 'hr' || user.role === 'manager') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recruitmentStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-card border-border">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/30">
          <TabsTrigger
            value="overview"
            className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            Overview
          </TabsTrigger>
          {user.role === 'hr' && (
            <TabsTrigger
              value="jobs"
              className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              Job Postings
            </TabsTrigger>
          )}
          <TabsTrigger
            value="requests"
            className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            {user.role === 'manager' ? 'My Requests' : 'Hiring Requests'}
          </TabsTrigger>
          {user.role === 'hr' && (
            <TabsTrigger
              value="documents"
              className="text-sm data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              Documents
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs, positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-32 bg-background border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Postings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {user.role === 'manager' ? 'Department Job Openings' : 'Active Job Postings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No job postings found</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Building className="h-4 w-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location} • {job.type}</span>
                            </div>
                          </div>
                          <Badge
                            variant={job.status === 'Active' ? 'default' : 'secondary'}
                            className="ml-2"
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-foreground">{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-foreground">{job.applications}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setViewingJob(job)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.role === 'hr' && (
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingJob(job)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setJobPostings(prev => prev.filter(j => j.id !== job.id))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:block">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{job.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{job.department}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{job.type}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{job.salary}</span>
                                <span>•</span>
                                <span>{job.experience}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-center">
                              <p className="text-sm font-medium text-foreground">{job.applications}</p>
                              <p className="text-xs text-muted-foreground">Applications</p>
                            </div>
                            <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setViewingJob(job)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.role === 'hr' && (
                                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingJob(job)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setJobPostings(prev => prev.filter(j => j.id !== job.id))}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border text-xs">
                          <div>
                            <span className="text-muted-foreground">Posted: </span>
                            <span className="text-foreground">{job.posted}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline: </span>
                            <span className="text-foreground">{job.deadline || job.applicationEnd}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Requirements: </span>
                            <span className="text-foreground">{job.requirements}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Postings Tab (HR Only) */}
        {user.role === 'hr' && (
          <TabsContent value="jobs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Manage Job Postings</CardTitle>
                  <Button
                    onClick={() => setShowJobForm(true)}
                    className="bg-primary hover:bg-primary/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 px-4 font-medium">Position</th>
                        <th className="pb-3 px-4 font-medium">Department</th>
                        <th className="pb-3 px-4 font-medium">Applications</th>
                        <th className="pb-3 px-4 font-medium">Status</th>
                        <th className="pb-3 px-4 font-medium">Deadline</th>
                        <th className="pb-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map(job => (
                        <tr key={job.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-foreground">{job.title}</div>
                              <div className="text-sm text-muted-foreground">{job.location} • {job.type}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground">{job.department}</td>
                          <td className="py-3 px-4 text-foreground">{job.applications}</td>
                          <td className="py-3 px-4">
                            <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-foreground">{job.deadline || job.applicationEnd}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingJob(job)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setJobPostings(prev => prev.filter(j => j.id !== job.id))}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Hiring Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">
                  {user.role === 'manager' ? 'My Hiring Requests' : 'Hiring Requests from Managers'}
                </CardTitle>
                {user.role === 'manager' && (
                  <Button
                    onClick={() => setShowRequestForm(true)}
                    className="bg-primary hover:bg-primary/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hiring requests found</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{request.position}</h3>
                            <p className="text-sm text-muted-foreground">by {request.requestedBy}</p>
                            <p className="text-sm text-muted-foreground">{request.department}</p>
                          </div>
                          <Badge
                            variant={
                              request.urgency === 'High' ? 'destructive' :
                                request.urgency === 'Medium' ? 'secondary' :
                                  'default'
                            }
                          >
                            {request.urgency}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Needed:</strong> {request.numberOfEmployees} employee(s)</p>
                          <p><strong>Budget:</strong> {request.expectedSalary}</p>
                          <p className="mt-2">{request.justification}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                          <div className="flex gap-2">
                            {user.role === 'hr' && request.status === 'Pending' && (
                              <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 flex items-center justify-center gap-1"
                                  style={{ minWidth: 100 }}
                                  onClick={() => setHiringRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r))}
                                >
                                  <CheckCircle className="h-4 w-4" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50 font-semibold flex-1 flex items-center justify-center gap-1"
                                  style={{ minWidth: 100 }}
                                  onClick={() => setHiringRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'Rejected' } : r))}
                                >
                                  <AlertCircle className="h-4 w-4 bg-red-500 text-white" /> Reject
                                </Button>
                              </div>
                            )}
                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setViewingRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {request.requestedBy.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{request.position}</h3>
                            <p className="text-sm text-muted-foreground">
                              Requested by {request.requestedBy} • {request.department}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.numberOfEmployees} employee(s) • {request.expectedSalary}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                              {request.justification}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Badge
                              variant={
                                request.urgency === 'High' ? 'destructive' :
                                  request.urgency === 'Medium' ? 'secondary' :
                                    'default'
                              }
                            >
                              {request.urgency}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{request.requestDate}</p>
                          </div>
                          <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                          <div className="flex space-x-2">
                            {user.role === 'hr' && request.status === 'Pending' && (
                              <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 flex items-center justify-center gap-1"
                                  style={{ minWidth: 100 }}
                                  onClick={() => setHiringRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r))}
                                >
                                  <CheckCircle className="h-4 w-4" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50 font-semibold flex-1 flex items-center justify-center gap-1"
                                  style={{ minWidth: 100 }}
                                  onClick={() => setHiringRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'Rejected' } : r))}
                                >
                                  <AlertCircle className="h-4 w-4" /> Reject
                                </Button>
                              </div>
                            )}
                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setViewingRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab (HR Only) */}
        {user.role === 'hr' && (
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-foreground">Application Documents</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search documents..."
                        value={documentSearch}
                        onChange={e => setDocumentSearch(e.target.value)}
                        className="pl-10 w-full sm:w-64 bg-background border-border text-foreground"
                      />
                    </div>
                    <Select value={documentStatus} onValueChange={setDocumentStatus}>
                      <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-primary hover:bg-primary/80" onClick={() => setAddingDocument(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Document
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map(doc => (
                    <div key={doc.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Applicant: {doc.applicant}</p>
                            <p>Position: {doc.position}</p>
                            <p>Type: {doc.type} • Size: {doc.size}</p>
                            <p>Uploaded: {doc.uploadDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <Badge
                          variant={doc.status === 'Approved' ? 'default' : doc.status === 'Rejected' ? 'destructive' : 'secondary'}
                          className="flex-shrink-0"
                        >
                          {doc.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setShowDocumentModal(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingDocument(doc)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      {showDocumentModal && (
        <Dialog open={!!showDocumentModal} onOpenChange={() => setShowDocumentModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Name:</strong> {showDocumentModal.name}</p>
              <p><strong>Applicant:</strong> {showDocumentModal.applicant}</p>
              <p><strong>Position:</strong> {showDocumentModal.position}</p>
              <p><strong>Type:</strong> {showDocumentModal.type}</p>
              <p><strong>Status:</strong> {showDocumentModal.status}</p>
              <p><strong>Size:</strong> {showDocumentModal.size}</p>
              <p><strong>Uploaded:</strong> {showDocumentModal.uploadDate}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDocumentModal(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {viewingJob && (
        <Dialog open={!!viewingJob} onOpenChange={() => setViewingJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Title:</strong> {viewingJob.title}</p>
              <p><strong>Department:</strong> {viewingJob.department}</p>
              <p><strong>Location:</strong> {viewingJob.location}</p>
              <p><strong>Type:</strong> {viewingJob.type}</p>
              <p><strong>Salary:</strong> {viewingJob.salary}</p>
              <p><strong>Experience:</strong> {viewingJob.experience}</p>
              <p><strong>Requirements:</strong> {viewingJob.requirements}</p>
              <p><strong>Description:</strong> {viewingJob.description}</p>
              <p><strong>Benefits:</strong> {viewingJob.benefits}</p>
              <p><strong>Applications:</strong> {viewingJob.applications}</p>
              <p><strong>Status:</strong> {viewingJob.status}</p>
              <p><strong>Posted:</strong> {viewingJob.posted}</p>
              <p><strong>Deadline:</strong> {viewingJob.deadline || viewingJob.applicationEnd}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewingJob(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {editingJob && (
        <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <EditJobForm job={editingJob} onCancel={() => setEditingJob(null)} onSave={() => setEditingJob(null)} />
          </DialogContent>
        </Dialog>
      )}
      {viewingRequest && (
        <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hiring Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${viewingRequest.status === 'Rejected' ? 'text-red-600' : 'text-foreground'}`}>{viewingRequest.position}</span>
                <Badge variant={viewingRequest.status === 'Approved' ? 'default' : viewingRequest.status === 'Rejected' ? 'destructive' : 'secondary'}>
                  {viewingRequest.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Requested by <span className="font-medium text-foreground">{viewingRequest.requestedBy}</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Department:</span> <span className={viewingRequest.status === 'Rejected' ? 'text-red-600' : 'text-foreground'}>{viewingRequest.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Urgency:</span> <span>{viewingRequest.urgency}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Requested on:</span> <span>{viewingRequest.requestDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Employees Needed:</span> <span>{viewingRequest.numberOfEmployees}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Salary:</span> <span>{viewingRequest.expectedSalary}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Skills:</span> <span>{viewingRequest.skills}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-muted-foreground">Justification:</span>
                <p className={`mt-1 ${viewingRequest.status === 'Rejected' ? 'text-red-600' : 'text-foreground'}`}>{viewingRequest.justification}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewingRequest(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {addingDocument && (
        <Dialog open={addingDocument} onOpenChange={setAddingDocument}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Document</DialogTitle>
            </DialogHeader>
            <DocumentForm
              onCancel={() => setAddingDocument(false)}
              onSave={doc => {
                setDocuments(prev => [...prev, { ...doc, id: Date.now(), status: 'Pending', uploadDate: new Date().toISOString().slice(0, 10) }]);
                setAddingDocument(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      {editingDocument && (
        <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
            </DialogHeader>
            <DocumentForm
              doc={editingDocument}
              onCancel={() => setEditingDocument(null)}
              onSave={doc => {
                setDocuments(prev => prev.map(d => d.id === editingDocument.id ? { ...d, ...doc } : d));
                setEditingDocument(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

function EditJobForm({ job, onCancel, onSave }: { job: typeof mockJobPostings[0], onCancel: () => void, onSave: (job: typeof mockJobPostings[0]) => void }) {
  const [form, setForm] = useState({ ...job });
  const departmentOptions = [
    'Engineering', 'Marketing', 'Sales', 'Design', 'Finance', 'HR', 'Human Resources'
  ];
  const typeOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance'
  ];
  return (
    <form className="space-y-4 max-h-[70vh] overflow-y-auto" onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Senior Software Engineer" className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={form.department} onValueChange={value => setForm({ ...form, department: value })}>
            <SelectTrigger className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g., Remote, New York" className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <Label htmlFor="type">Employment Type</Label>
          <Select value={form.type} onValueChange={value => setForm({ ...form, type: value })}>
            <SelectTrigger className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salary">Salary Range</Label>
          <Input id="salary" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g., $70k - $90k" className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <Label htmlFor="experience">Experience Required</Label>
          <Input id="experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g., 3-5 years" className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="requirements">Key Requirements</Label>
          <Input id="requirements" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="e.g., React, Node.js, 5+ years" className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed job description, responsibilities, and company information..." className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none" rows={4} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="benefits">Benefits & Perks</Label>
          <Textarea id="benefits" value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} placeholder="Health insurance, retirement plans, vacation policy, etc..." className="mt-1 bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none" rows={2} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11 border-border hover:bg-muted/50 bg-transparent">Cancel</Button>
        <Button type="submit" className="flex-1 h-11 bg-primary hover:bg-primary/80">Save</Button>
      </div>
    </form>
  );
}

function DocumentForm({ doc, onCancel, onSave }: { doc?: typeof mockDocuments[0], onCancel: () => void, onSave: (doc: any) => void }) {
  const [form, setForm] = useState(doc ? { ...doc } : { name: '', type: '', applicant: '', position: '', size: '', status: 'Pending' });
  return (
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <Label htmlFor="name">Document Name</Label>
      <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Resume - John Doe.pdf" />
      <Label htmlFor="type">Type</Label>
      <Input id="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g., Resume, Cover Letter" />
      <Label htmlFor="applicant">Applicant</Label>
      <Input id="applicant" value={form.applicant} onChange={e => setForm({ ...form, applicant: e.target.value })} placeholder="e.g., John Doe" />
      <Label htmlFor="position">Position</Label>
      <Input id="position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="e.g., Software Engineer" />
      <Label htmlFor="size">File Size</Label>
      <Input id="size" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g., 2.4 MB" />
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11 border-border hover:bg-muted/50 bg-transparent">Cancel</Button>
        <Button type="submit" className="flex-1 h-11 bg-primary hover:bg-primary/80">Save</Button>
      </div>
    </form>
  );
}

export default Recruitment;