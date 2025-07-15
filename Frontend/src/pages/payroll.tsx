import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Download, Edit, Eye, Calculator, TrendingUp, Users,  Plus, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'processing';
  department: string;
}

const mockPayrollData: PayrollRecord[] = [
  { id: '1', employeeName: 'John Doe', employeeId: 'EMP001', basicSalary: 50000, bonus: 5000, deductions: 2000, netSalary: 53000, month: 'January', year: 2024, status: 'paid', department: 'Engineering' },
  { id: '2', employeeName: 'Jane Smith', employeeId: 'EMP002', basicSalary: 45000, bonus: 3000, deductions: 1800, netSalary: 46200, month: 'January', year: 2024, status: 'paid', department: 'Design' },
  { id: '3', employeeName: 'Mike Johnson', employeeId: 'EMP003', basicSalary: 40000, bonus: 2000, deductions: 1500, netSalary: 40500, month: 'January', year: 2024, status: 'processing', department: 'Marketing' },
  { id: '4', employeeName: 'Sarah Wilson', employeeId: 'EMP004', basicSalary: 55000, bonus: 4000, deductions: 2200, netSalary: 56800, month: 'January', year: 2024, status: 'paid', department: 'HR' },
  { id: '5', employeeName: 'Team Manager', employeeId: 'EMP005', basicSalary: 75000, bonus: 7500, deductions: 3000, netSalary: 79500, month: 'January', year: 2024, status: 'paid', department: 'Engineering' },
  { id: '6', employeeName: 'HR Manager', employeeId: 'EMP006', basicSalary: 70000, bonus: 6000, deductions: 2800, netSalary: 73200, month: 'January', year: 2024, status: 'paid', department: 'Human Resources' },
];

const Payroll = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [, setShowEditSalary] = useState(false);
  //const [selectedMonth, setSelectedMonth] = useState('January');

  // Role-based data filtering
  const getFilteredData = () => {
    if (user?.role === 'employee') {
      // Employee can only see their own payroll
      return mockPayrollData.filter(record => record.employeeName === `${user.firstName} ${user.lastName}`);
    } else if (user?.role === 'manager') {
      // Manager can see team salary summaries (limited view)
      return mockPayrollData.filter(record => record.department === user.department);
    }
    // HR and Super Admin can see all records
    return mockPayrollData;
  };

  const filteredData = getFilteredData();

  const getPayrollStats = () => {
    const data = filteredData;
    const totalPayroll = data.reduce((sum, record) => sum + record.netSalary, 0);
    const averageSalary = data.length > 0 ? totalPayroll / data.length : 0;
    const pendingPayroll = data.filter(r => r.status === 'pending' || r.status === 'processing').length;

    if (user?.role === 'employee') {
      const myRecord = data[0];
      return [
        { title: 'Net Salary', value: myRecord ? `$${myRecord.netSalary.toLocaleString()}` : '$0', icon: DollarSign, color: 'text-green-500' },
        { title: 'Basic Salary', value: myRecord ? `$${myRecord.basicSalary.toLocaleString()}` : '$0', icon: Calculator, color: 'text-blue-500' },
        { title: 'Bonus', value: myRecord ? `$${myRecord.bonus.toLocaleString()}` : '$0', icon: TrendingUp, color: 'text-green-500' },
        { title: 'Deductions', value: myRecord ? `$${myRecord.deductions.toLocaleString()}` : '$0', icon: AlertCircle, color: 'text-red-500' },
      ];
    }

    return [
      { title: 'Total Payroll', value: `$${totalPayroll.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
      { title: 'Employees', value: data.length.toString(), icon: Users, color: 'text-blue-500' },
      { title: 'Average Salary', value: `$${Math.round(averageSalary).toLocaleString()}`, icon: Calculator, color: 'text-purple-500' },
      { title: 'Pending', value: pendingPayroll.toString(), icon: AlertCircle, color: 'text-orange-500' },
    ];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-500/20 text-green-500',
      pending: 'bg-orange-500/20 text-orange-500',
      processing: 'bg-blue-500/20 text-blue-500',
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const canManagePayroll = user?.role === 'hr';
  const canViewReports = user?.role === 'hr' || user?.role === 'super_admin';

  const renderRoleSpecificActions = () => {
    if (user?.role === 'employee') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Payslip
          </Button>
        </div>
      );
    }

    if (user?.role === 'manager') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Team Summary
          </Button>
        </div>
      );
    }

    if (user?.role === 'hr') {
      return (
        <div className="flex space-x-2">
          <Dialog open={showAddSalary} onOpenChange={setShowAddSalary}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Salary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Employee Salary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPayrollData.map((record) => (
                        <SelectItem key={record.employeeId} value={record.employeeId}>
                          {record.employeeName} ({record.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="basicSalary">Basic Salary</Label>
                  <Input id="basicSalary" type="number" placeholder="50000" />
                </div>
                <div>
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input id="bonus" type="number" placeholder="5000" />
                </div>
                <div>
                  <Label htmlFor="deductions">Deductions</Label>
                  <Input id="deductions" type="number" placeholder="2000" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowAddSalary(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Add Salary</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      );
    }

    if (user?.role === 'super_admin') {
      return (
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            System Statistics
          </Button>
        </div>
      );
    }

    return null;
  };

  const getTabsList = () => {
    const tabs = [
      { value: 'overview', label: user?.role === 'employee' ? 'My Payslip' : 'Payroll Overview' },
    ];

    if (user?.role !== 'employee') {
      tabs.push({ value: 'records', label: 'Payroll Records' });
    }

    if (canViewReports) {
      tabs.push({ value: 'reports', label: 'Reports' });
    }

    return tabs;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'employee' && 'View your salary breakdown and payslips'}
            {user?.role === 'manager' && 'View team salary summaries (optional)'}
            {user?.role === 'hr' && 'Manage employee salaries and payroll processing'}
            {user?.role === 'super_admin' && 'System-wide payroll statistics and monitoring'}
          </p>
        </div>
        {renderRoleSpecificActions()}
      </div>

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getPayrollStats().map((stat) => (
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
          {user?.role === 'employee' ? (
            // Employee view - their own payslip breakdown
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Month Payslip</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredData.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Basic Salary</span>
                          <span className="font-medium">${filteredData[0].basicSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Bonus</span>
                          <span className="font-medium text-green-500">+${filteredData[0].bonus.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Deductions</span>
                          <span className="font-medium text-red-500">-${filteredData[0].deductions.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between">
                            <span className="font-medium">Net Salary</span>
                            <span className="text-lg font-bold text-primary">${filteredData[0].netSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payslip History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['December 2023', 'November 2023', 'October 2023'].map((month) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">{month}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Other roles - department/system overview
            <Card>
              <CardHeader>
                <CardTitle>
                  {user?.role === 'manager' ? 'Team Payroll Summary' : 'Payroll Overview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-foreground">{record.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.employeeId} • {record.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {user?.role === 'hr' && (
                          <>
                            <div className="text-right">
                              <p className="text-sm font-medium">${record.netSalary.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Net Salary</p>
                            </div>
                            <Badge className={getStatusBadge(record.status)}>
                              {record.status}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => setShowEditSalary(true)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {user?.role === 'manager' && (
                          <div className="text-right">
                            <p className="text-sm font-medium">Summary View</p>
                            <p className="text-xs text-muted-foreground">Contact HR for details</p>
                          </div>
                        )}
                        {user?.role === 'super_admin' && (
                          <div className="text-right">
                            <p className="text-sm font-medium">${record.netSalary.toLocaleString()}</p>
                            <Badge className={getStatusBadge(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Records Tab */}
        {user?.role !== 'employee' && (
          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Payroll Records</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Employee</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Basic</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Bonus</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Deductions</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Net</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                        {canManagePayroll && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredData.map((record) => (
                        <tr key={record.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-foreground">{record.employeeName}</div>
                              <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{record.department}</td>
                          <td className="px-6 py-4 text-sm text-foreground">${record.basicSalary.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-green-500">${record.bonus.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-red-500">${record.deductions.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">${record.netSalary.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusBadge(record.status)} capitalize`}>
                              {record.status}
                            </Badge>
                          </td>
                          {canManagePayroll && (
                            <td className="px-6 py-4">
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
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
        )}

        {/* Reports Tab */}
        {canViewReports && (
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Monthly Payroll Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Tax Summary Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 mr-2" />
                    Department Cost Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payroll Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Total Monthly Cost</span>
                      <span className="text-lg font-bold text-primary">
                        ${filteredData.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Average Salary</span>
                      <span className="text-lg font-bold text-blue-500">
                        ${Math.round(filteredData.reduce((sum, r) => sum + r.netSalary, 0) / filteredData.length).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">Total Bonuses</span>
                      <span className="text-lg font-bold text-green-500">
                        ${filteredData.reduce((sum, r) => sum + r.bonus, 0).toLocaleString()}
                      </span>
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

export default Payroll;