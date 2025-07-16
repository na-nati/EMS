import { useState } from 'react';
import { Calendar, Clock, FileText, User, TrendingUp, Star, Bell, Download, Upload,  CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
}

interface MyRequest {
  id: string;
  type: 'leave' | 'expense' | 'document' | 'training';
  title: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  amount?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const leaveBalances: LeaveBalance[] = [
  { type: 'Annual Leave', used: 8, total: 25, color: 'text-blue-500' },
  { type: 'Sick Leave', used: 2, total: 10, color: 'text-red-500' },
  { type: 'Personal Leave', used: 1, total: 5, color: 'text-green-500' },
  { type: 'Emergency Leave', used: 0, total: 3, color: 'text-orange-500' },
];

const myRequests: MyRequest[] = [
  { id: '1', type: 'leave', title: 'Annual Leave Request', date: '2024-01-10', status: 'approved' },
  { id: '2', type: 'expense', title: 'Travel Expense', date: '2024-01-08', status: 'pending', amount: '$450' },
  { id: '3', type: 'document', title: 'Experience Certificate', date: '2024-01-05', status: 'approved' },
  { id: '4', type: 'training', title: 'React Training Course', date: '2024-01-03', status: 'rejected' },
];

const notifications: Notification[] = [
  { id: '1', title: 'Leave Request Approved', message: 'Your annual leave request has been approved by your manager', time: '2 hours ago', type: 'success', read: false },
  { id: '2', title: 'Training Reminder', message: 'React fundamentals training starts tomorrow at 10 AM', time: '5 hours ago', type: 'info', read: false },
  { id: '3', title: 'Expense Report Due', message: 'Please submit your monthly expense report by Friday', time: '1 day ago', type: 'warning', read: true },
];

const Employee = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showExpenseReport, setShowExpenseReport] = useState(false);

  const employeeStats = [
    { title: 'Leave Balance', value: '17 days', icon: Calendar, color: 'text-blue-500', subtitle: 'Remaining this year' },
    { title: 'Pending Requests', value: '3', icon: Clock, color: 'text-orange-500', subtitle: 'Awaiting approval' },
    { title: 'Performance Score', value: '4.8/5', icon: Star, color: 'text-green-500', subtitle: 'Last review' },
    { title: 'Training Progress', value: '75%', icon: TrendingUp, color: 'text-purple-500', subtitle: '3 of 4 completed' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-500/20 text-green-500',
      pending: 'bg-orange-500/20 text-orange-500',
      rejected: 'bg-red-500/20 text-red-500',
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getRequestIcon = (type: string) => {
    const icons = {
      leave: Calendar,
      expense: FileText,
      document: FileText,
      training: TrendingUp,
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: Bell,
      success: CheckCircle,
      warning: AlertCircle,
    };
    const Icon = icons[type as keyof typeof icons] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your overview</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showLeaveRequest} onOpenChange={setShowLeaveRequest}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" placeholder="Enter reason for leave..." />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowLeaveRequest(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Submit Request</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showExpenseReport} onOpenChange={setShowExpenseReport}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Submit Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Expense Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expenseType">Expense Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter expense description..." />
                </div>
                <div>
                  <Label htmlFor="receipt">Receipt Upload</Label>
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Drop receipt here or click to browse</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowExpenseReport(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Submit Report</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employeeStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave Balance</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Expense Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Payslip
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Leave request approved', time: '2 hours ago', type: 'success' },
                    { action: 'Expense report submitted', time: '1 day ago', type: 'info' },
                    { action: 'Training completed', time: '3 days ago', type: 'success' },
                    { action: 'Profile updated', time: '1 week ago', type: 'info' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leave Balance Tab */}
        <TabsContent value="leave" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveBalances.map((leave) => (
              <Card key={leave.type}>
                <CardContent className="p-6">
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
                        className={`h-2 rounded-full ${leave.color.replace('text-', 'bg-')}`}
                        style={{ width: `${(leave.used / leave.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total: {leave.total} days
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Annual Leave', dates: 'Dec 20-24, 2023', days: 5, status: 'approved' },
                  { type: 'Sick Leave', dates: 'Nov 15-16, 2023', days: 2, status: 'approved' },
                  { type: 'Personal Leave', dates: 'Oct 10, 2023', days: 1, status: 'approved' },
                ].map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{leave.type}</p>
                      <p className="text-xs text-muted-foreground">{leave.dates} • {leave.days} days</p>
                    </div>
                    <Badge className={getStatusBadge(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getRequestIcon(request.type)}
                        <div>
                          <p className="font-medium text-foreground">{request.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {new Date(request.date).toLocaleDateString()}
                            {request.amount && ` • ${request.amount}`}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Employment Letter', date: '2024-01-01', size: '245 KB' },
                  { name: 'Payslip - December 2023', date: '2023-12-31', size: '128 KB' },
                  { name: 'Tax Certificate', date: '2023-12-01', size: '198 KB' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date} • {doc.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Experience Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Salary Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  No Objection Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Relieving Letter
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`border border-border rounded-lg p-4 ${!notification.read ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employee;