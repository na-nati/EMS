import React, { useState } from 'react';
import {
  Users,
  Building,
  Activity,
  FileText,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import { HRDashboard } from './HRDashboard';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Use centralized apiRequest from lib

// Type definitions
interface StatItem {
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
}

interface Department {
  id: number;
  name: string;
  employees: number;
  manager: string;
}

// Employee Registration Trends Chart
const EmployeeRegistrationChart = () => {
  const [chartData, setChartData] = useState<{
    categories: string[];
    newRegistrations: number[];
    totalEmployees: number[];
  }>({
    categories: [],
    newRegistrations: [],
    totalEmployees: []
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        console.log('🔍 Fetching registration data from:', `${apiBaseUrl}/employees/registration-trends`);

        const response = await apiRequest(`${apiBaseUrl}/employees/registration-trends`);
        console.log('📊 Registration API Response:', response);

        // Transform API data to chart format
        const data = response.data || response;
        console.log('📈 Transformed registration data:', data);

        setChartData({
          categories: data.dates || [],
          newRegistrations: data.newRegistrations || [],
          totalEmployees: data.totalEmployees || []
        });
      } catch (error) {
        console.error('❌ Failed to fetch registration data:', error);
        // Fallback to mock data if API fails
        setChartData({
          categories: [
            "2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z", "2024-01-03T00:00:00.000Z",
            "2024-01-04T00:00:00.000Z", "2024-01-05T00:00:00.000Z", "2024-01-06T00:00:00.000Z",
            "2024-01-07T00:00:00.000Z", "2024-01-08T00:00:00.000Z", "2024-01-09T00:00:00.000Z",
            "2024-01-10T00:00:00.000Z", "2024-01-11T00:00:00.000Z", "2024-01-12T00:00:00.000Z"
          ],
          newRegistrations: [31, 40, 28, 51, 42, 109, 100, 85, 92, 78, 65, 88],
          totalEmployees: [31, 71, 99, 150, 192, 301, 401, 486, 578, 656, 721, 809]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      background: 'transparent',
      foreColor: '#ffffff',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#22c55e', '#3b82f6'],
    xaxis: {
      type: 'datetime',
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
      theme: 'dark'
    },
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    title: {
      text: 'Employee Registration Trends',
      align: 'center',
      style: {
        color: '#ffffff',
        fontSize: '16px'
      }
    }
  };

  const series = [
    {
      name: 'New Registrations',
      data: chartData.newRegistrations
    },
    {
      name: 'Total Employees',
      data: chartData.totalEmployees
    }
  ];

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-muted-foreground">Loading registration data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

// Active and Leave Employees Time Series Chart
const ActiveLeaveChart = () => {
  const [chartData, setChartData] = useState<{
    categories: string[];
    activeEmployees: number[];
    onLeave: number[];
  }>({
    categories: [],
    activeEmployees: [],
    onLeave: []
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchActiveLeaveData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        console.log('🔍 Fetching active/leave data from:', `${apiBaseUrl}/employees/active-leave-trends`);

        const response = await apiRequest(`${apiBaseUrl}/employees/active-leave-trends`);
        console.log('📊 Active/Leave API Response:', response);

        // Transform API data to chart format
        const data = response.data || response;
        console.log('📈 Transformed data:', data);

        setChartData({
          categories: data.dates || [],
          activeEmployees: data.activeEmployees || [],
          onLeave: data.onLeave || []
        });
      } catch (error) {
        console.error('❌ Failed to fetch active/leave data:', error);
        // Fallback to mock data if API fails
        setChartData({
          categories: [
            "2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z", "2024-01-03T00:00:00.000Z",
            "2024-01-04T00:00:00.000Z", "2024-01-05T00:00:00.000Z", "2024-01-06T00:00:00.000Z",
            "2024-01-07T00:00:00.000Z", "2024-01-08T00:00:00.000Z", "2024-01-09T00:00:00.000Z",
            "2024-01-10T00:00:00.000Z", "2024-01-11T00:00:00.000Z", "2024-01-12T00:00:00.000Z"
          ],
          activeEmployees: [750, 745, 748, 752, 749, 751, 753, 750, 747, 752, 755, 758],
          onLeave: [25, 30, 27, 23, 26, 24, 22, 25, 28, 23, 20, 17]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActiveLeaveData();
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      background: 'transparent',
      foreColor: '#ffffff',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#22c55e', '#f97316'],
    xaxis: {
      type: 'datetime',
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
      theme: 'dark'
    },
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    title: {
      text: 'Active vs Leave Employees',
      align: 'center',
      style: {
        color: '#ffffff',
        fontSize: '16px'
      }
    }
  };

  const series = [
    {
      name: 'Active Employees',
      data: chartData.activeEmployees
    },
    {
      name: 'On Leave',
      data: chartData.onLeave
    }
  ];

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-muted-foreground">Loading active/leave data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

// Department Distribution Pie Chart
const DepartmentDistributionChart = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        console.log('🔍 Fetching department data from:', `${apiBaseUrl}/departments`);

        const response = await apiRequest(`${apiBaseUrl}/departments`);
        console.log('📊 Department API Response:', response);

        // Transform API data to chart format
        const departmentsData = Array.isArray(response) ? response : (response.data || []);
        console.log('📈 Transformed department data:', departmentsData);

        const transformedDepartments = departmentsData.map((dept: any) => ({
          id: dept._id || dept.id,
          name: dept.name,
          employees: dept.employeeCount || 0,
          manager: dept.manager || 'N/A'
        }));

        console.log('🏢 Final department data:', transformedDepartments);
        setDepartments(transformedDepartments);
      } catch (error) {
        console.error('❌ Failed to fetch department data:', error);
        // Fallback to mock data if API fails
        setDepartments([
          { id: 1, name: 'Engineering', employees: 45, manager: 'John Doe' },
          { id: 2, name: 'Marketing', employees: 32, manager: 'Jane Smith' },
          { id: 3, name: 'Sales', employees: 28, manager: 'Mike Johnson' },
          { id: 4, name: 'HR', employees: 15, manager: 'Sarah Wilson' },
          { id: 5, name: 'Finance', employees: 12, manager: 'David Brown' },
          { id: 6, name: 'Operations', employees: 18, manager: 'Lisa Davis' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
      foreColor: '#ffffff'
    },
    labels: departments.map(dept => dept.name),
    colors: ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#ffffff'
      }
    },
    title: {
      text: 'Employees by Department',
      align: 'center',
      style: {
        color: '#ffffff',
        fontSize: '16px'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = departments.map(dept => dept.employees);

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-muted-foreground">Loading department data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

// DashboardSwitcher component
const DashboardSwitcher = ({ activeDashboard, setActiveDashboard }: { activeDashboard: string, setActiveDashboard: (role: string) => void }) => (
  <div className="flex items-center space-x-2 mb-6">
    <span className="text-sm text-[hsl(0,0%,20%)]">View as:</span>
    <div className="flex bg-muted rounded-lg p-1">
      {['super-admin', 'hr', 'manager', 'employee'].map((role) => (
        <button
          key={role}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeDashboard === role
            ? 'bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] shadow'
            : 'hover:bg-[hsl(0,0%,20%)] text-foreground'
            }`}
          onClick={() => setActiveDashboard(role)}
          tabIndex={0}
        >
          {role === 'super-admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

// Main SuperAdminDashboard Component
export const SuperAdminDashboard = () => {
  const [activeDashboard, setActiveDashboard] = useState('super-admin');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [, setLoadingStats] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // Fetch departments data for the summary section
  React.useEffect(() => {
    const fetchDepartmentsData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const response = await apiRequest(`${apiBaseUrl}/departments`);

        // Transform API data to chart format
        const departmentsData = Array.isArray(response) ? response : (response.data || []);
        const transformedDepartments = departmentsData.map((dept: any) => ({
          id: dept._id || dept.id,
          name: dept.name,
          employees: dept.employeeCount || 0,
          manager: dept.manager || 'N/A'
        }));

        setDepartments(transformedDepartments);
      } catch (error) {
        console.error('Failed to fetch department data:', error);
        // Fallback to mock data if API fails
        setDepartments([
          { id: 1, name: 'Engineering', employees: 45, manager: 'John Doe' },
          { id: 2, name: 'Marketing', employees: 32, manager: 'Jane Smith' },
          { id: 3, name: 'Sales', employees: 28, manager: 'Mike Johnson' },
          { id: 4, name: 'HR', employees: 15, manager: 'Sarah Wilson' },
          { id: 5, name: 'Finance', employees: 12, manager: 'David Brown' },
          { id: 6, name: 'Operations', employees: 18, manager: 'Lisa Davis' }
        ]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartmentsData();
  }, []);

  // Fetch dashboard stats from the backend
  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      try {
        console.log('🔍 Fetching dashboard stats from:', `${apiBaseUrl}/employees/stats/all`);

        // Use your existing apiRequest function to fetch the stats
        const response = await apiRequest(`${apiBaseUrl}/employees/stats/all`);
        console.log('📊 Dashboard Stats API Response:', response);

        // Assuming your backend returns data like: { data: { totalEmployees: 100, activeEmployees: 85, ... } }
        const { totalEmployees, totalDepartments, statusBreakdown } = response.data;
        console.log('📈 Dashboard Stats Data:', { totalEmployees, totalDepartments, statusBreakdown });

        // Build a dynamic stats array to replace the hard-coded one
        const dynamicStats: StatItem[] = [
          {
            name: 'Total Employees',
            value: totalEmployees.toLocaleString(),
            icon: Users,
            change: '+12%',
            changeType: 'positive',
            color: 'text-green-500'
          },
          {
            name: 'Active Employees',
            value: statusBreakdown.active.toLocaleString(),
            icon: Activity,
            change: '+5%',
            changeType: 'positive',
            color: 'text-purple-500'
          },
          {
            name: 'Departments',
            value: totalDepartments.toLocaleString(),
            icon: Building,
            change: '+1',
            changeType: 'positive',
            color: 'text-blue-500'
          },
          {
            name: 'HR Staff',
            value: '8', // You might want to replace this with actual HR count from your data
            icon: UserCheck,
            change: '+2',
            changeType: 'positive',
            color: 'text-yellow-500'
          },
          {
            name: 'Active Jobs',
            value: '24', // From your recruitmentStats data
            icon: Briefcase,
            change: '+3',
            changeType: 'positive',
            color: 'text-indigo-500'
          },
          {
            name: 'Pending Approvals',
            value: '23',
            icon: FileText,
            change: '-3',
            changeType: 'negative',
            color: 'text-red-500'
          },
        ];
        console.log('📊 Final Dashboard Stats:', dynamicStats);
        setStats(dynamicStats);
        setLoadingStats(false);
      } catch (err: any) {
        console.error('❌ Failed to fetch dashboard stats:', err);
        setError(err.message || 'Failed to fetch dashboard stats.');
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
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

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(0,0%,98%)]">Super Admin Dashboard</h1>
            <p className="text-[hsl(0,0%,65%)] mt-2">System overview and administration controls</p>
          </div>
          <DashboardSwitcher activeDashboard={activeDashboard} setActiveDashboard={setActiveDashboard} />
        </div>
      </div>

      {activeDashboard === 'super-admin' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
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
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeRegistrationChart />
            <ActiveLeaveChart />
          </div>

          {/* Department Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentDistributionChart />
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-[hsl(0,0%,98%)] mb-4">Department Summary</h3>
              {loadingDepartments ? (
                <div className="flex items-center justify-center h-[350px]">
                  <div className="text-muted-foreground">Loading department data...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {departments.map(dept => (
                    <div key={dept.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-[hsl(0,0%,98%)]">{dept.name}</p>
                        <p className="text-sm text-[hsl(0,0%,65%)]">Manager: {dept.manager}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[hsl(0,0%,98%)]">{dept.employees}</p>
                        <p className="text-xs text-[hsl(0,0%,65%)]">employees</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {activeDashboard === 'hr' && <HRDashboard />}
    </div>
  );
};