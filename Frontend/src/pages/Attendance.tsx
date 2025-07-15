import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Users, CheckCircle, XCircle, Edit, Download, Plus, Search, Eye, BarChart3, } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'partial';
  department: string;
}

const mockAttendanceData: AttendanceRecord[] = [
  { id: '1', employeeName: 'John Doe', employeeId: 'EMP001', date: '2024-01-15', checkIn: '09:00', checkOut: '17:30', totalHours: 8.5, status: 'present', department: 'Engineering' },
  { id: '2', employeeName: 'Jane Smith', employeeId: 'EMP002', date: '2024-01-15', checkIn: '09:15', checkOut: '17:30', totalHours: 8.25, status: 'late', department: 'Design' },
  { id: '3', employeeName: 'Mike Johnson', employeeId: 'EMP003', date: '2024-01-15', checkIn: '', checkOut: '', totalHours: 0, status: 'absent', department: 'Marketing' },
  { id: '4', employeeName: 'Sarah Wilson', employeeId: 'EMP004', date: '2024-01-15', checkIn: '09:00', checkOut: '15:00', totalHours: 6, status: 'partial', department: 'HR' },
  { id: '5', employeeName: 'Team Manager', employeeId: 'EMP005', date: '2024-01-15', checkIn: '08:45', checkOut: '17:15', totalHours: 8.5, status: 'present', department: 'Engineering' },
  { id: '6', employeeName: 'HR Manager', employeeId: 'EMP006', date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', totalHours: 9, status: 'present', department: 'Human Resources' },
  { id: '7', employeeName: 'John Doe', employeeId: 'EMP007', date: '2024-01-15', checkIn: '08:30', checkOut: '17:00', totalHours: 8.5, status: 'present', department: 'Engineering' },
];

const Attendance = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showCorrectAttendance, setShowCorrectAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Role-based data filtering
  const getFilteredData = () => {
    if (user?.role === 'employee') {
      // Employee can only see their own attendance
      return mockAttendanceData.filter(record => record.employeeName === `${user.firstName} ${user.lastName}`);
    } else if (user?.role === 'manager') {
      // Manager can see their team's attendance (same department)
      return mockAttendanceData.filter(record => record.department === user.department);
    }
    // HR and Super Admin can see all records
    return mockAttendanceData;
  };

  const filteredData = getFilteredData().filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStats = () => {
    const data = getFilteredData();
    const todayData = data.filter(r => r.date === selectedDate);
    const totalEmployees = new Set(data.map(r => r.employeeId)).size;
    const presentToday = todayData.filter(r => r.status === 'present').length;
    const lateToday = todayData.filter(r => r.status === 'late').length;
    const absentToday = todayData.filter(r => r.status === 'absent').length;

    return [
      { title: user?.role === 'employee' ? 'My Status' : 'Total Employees', value: user?.role === 'employee' ? 'Present' : totalEmployees.toString(), icon: Users, color: 'text-blue-500' },
      { title: 'Present Today', value: presentToday.toString(), icon: CheckCircle, color: 'text-green-500' },
      { title: 'Late Arrivals', value: lateToday.toString(), icon: Clock, color: 'text-orange-500' },
      { title: 'Absent Today', value: absentToday.toString(), icon: XCircle, color: 'text-red-500' },
    ];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-500/20 text-green-500',
      late: 'bg-orange-500/20 text-orange-500',
      absent: 'bg-red-500/20 text-red-500',
      partial: 'bg-blue-500/20 text-blue-500',
    };
    return variants[status as keyof typeof variants] || variants.present;
  };

  //const canMarkAttendance = user?.role === 'hr';
  const canViewAnalytics = user?.role === 'super_admin' || user?.role === 'hr';
  const canCorrectDiscrepancies = user?.role === 'hr';

  const renderRoleSpecificActions = () => {
    if (user?.role === 'employee') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View My History
          </Button>
        </div>
      );
    }

    if (user?.role === 'manager') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Team Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      );
    }

    if (user?.role === 'hr') {
      return (
        <div className="flex space-x-2">
          <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Mark Employee Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAttendanceData.map((record) => (
                        <SelectItem key={record.employeeId} value={record.employeeId}>
                          {record.employeeName} ({record.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" defaultValue={selectedDate} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check In</Label>
                    <Input id="checkIn" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check Out</Label>
                    <Input id="checkOut" type="time" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowMarkAttendance(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Mark Attendance</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCorrectAttendance} onOpenChange={setShowCorrectAttendance}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Correct Discrepancy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Correct Attendance Discrepancy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAttendanceData.map((record) => (
                        <SelectItem key={record.employeeId} value={record.employeeId}>
                          {record.employeeName} ({record.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" defaultValue={selectedDate} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newCheckIn">Corrected Check In</Label>
                    <Input id="newCheckIn" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="newCheckOut">Corrected Check Out</Label>
                    <Input id="newCheckOut" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Correction Reason</Label>
                  <Input id="reason" placeholder="Enter reason for correction..." />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowCorrectAttendance(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Apply Correction</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    if (user?.role === 'super_admin') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Dashboard
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            System Reports
          </Button>
        </div>
      );
    }

    return null;
  };

  const getTabsList = () => {
    const tabs = [
      { value: 'overview', label: user?.role === 'employee' ? 'My Attendance' : 'Daily Overview' },
      { value: 'records', label: 'Attendance Records' },
    ];

    if (canViewAnalytics) {
      tabs.push({ value: 'analytics', label: 'Analytics' });
    }

    return tabs;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'employee' && 'View your attendance history'}
            {user?.role === 'manager' && 'Monitor your team\'s attendance'}
            {user?.role === 'hr' && 'Manage employee attendance records'}
            {user?.role === 'super_admin' && 'System-wide attendance analytics'}
          </p>
        </div>
        {renderRoleSpecificActions()}
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getAttendanceStats().map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className={`grid w-full grid-cols-${getTabsList().length}`}>
          {getTabsList().map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            {(user?.role === 'manager' || user?.role === 'hr' || user?.role === 'super_admin') && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Employee</th>
                      {(user?.role === 'hr' || user?.role === 'super_admin') && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Check In</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Check Out</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Hours</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      {canCorrectDiscrepancies && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredData
                      .filter(record => record.date === selectedDate)
                      .map((record) => (
                        <tr key={record.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-foreground">{record.employeeName}</div>
                              <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                            </div>
                          </td>
                          {(user?.role === 'hr' || user?.role === 'super_admin') && (
                            <td className="px-6 py-4 text-sm text-foreground">{record.department}</td>
                          )}
                          <td className="px-6 py-4 text-sm text-foreground">{record.checkIn || '--'}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{record.checkOut || '--'}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{record.totalHours}h</td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusBadge(record.status)} capitalize`}>
                              {record.status}
                            </Badge>
                          </td>
                          {canCorrectDiscrepancies && (
                            <td className="px-6 py-4">
                              <Button size="sm" variant="ghost" onClick={() => setShowCorrectAttendance(true)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {user?.role === 'employee' ? 'My Attendance History' : 'Employee Attendance Records'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-foreground">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()} • {record.employeeId}
                          {(user?.role === 'hr' || user?.role === 'super_admin') && ` • ${record.department}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.checkIn} - {record.checkOut || 'Not checked out'}</p>
                        <p className="text-xs text-muted-foreground">{record.totalHours} hours</p>
                      </div>
                      <Badge className={`${getStatusBadge(record.status)} capitalize`}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab (HR and Super Admin only) */}
        {canViewAnalytics && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Engineering', 'Design', 'Marketing', 'HR'].map((dept) => {
                      const deptData = filteredData.filter(r => r.department === dept);
                      const presentCount = deptData.filter(r => r.status === 'present').length;
                      const totalCount = deptData.length;
                      const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

                      return (
                        <div key={dept} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{dept}</span>
                            <span>{presentCount}/{totalCount} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Average Attendance Rate</span>
                      <span className="text-lg font-bold text-green-500">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Late Arrivals This Week</span>
                      <span className="text-lg font-bold text-orange-500">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Perfect Attendance</span>
                      <span className="text-lg font-bold text-blue-500">23 employees</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Attendance;