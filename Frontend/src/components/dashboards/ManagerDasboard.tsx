import { Users, Target, Calendar, TrendingUp, CheckCircle, UserCheck, BarChart2 } from 'lucide-react';

const stats = [
  { name: 'Team Members', value: '12', icon: Users, change: '+2', changeType: 'positive' },
  { name: 'Pending Reviews', value: '3', icon: Target, change: '-1', changeType: 'positive' },
  { name: 'Team Attendance', value: '92%', icon: Calendar, change: '+3%', changeType: 'positive' },
  { name: 'Projects Active', value: '8', icon: CheckCircle, change: '+2', changeType: 'positive' },
];

const teamAttendance = [
  { name: 'John Smith', role: 'Frontend Developer', status: 'Present', date: '2024-06-20' },
  { name: 'Sarah Connor', role: 'Backend Developer', status: 'Absent', date: '2024-06-20' },
  { name: 'Mike Johnson', role: 'UI Designer', status: 'Present', date: '2024-06-20' },
  { name: 'Emily Davis', role: 'QA Engineer', status: 'Present', date: '2024-06-20' },
];

const leaveRequests = [
  { name: 'Sarah Connor', role: 'Backend Developer', type: 'Sick Leave', from: '2024-06-18', to: '2024-06-20', status: 'Pending' },
  { name: 'Mike Johnson', role: 'UI Designer', type: 'Annual Leave', from: '2024-06-25', to: '2024-06-28', status: 'Approved' },
];

const teamPerformance = [
  { name: 'John Smith', role: 'Frontend Developer', score: 95, status: 'Excellent' },
  { name: 'Sarah Connor', role: 'Backend Developer', score: 88, status: 'Good' },
  { name: 'Mike Johnson', role: 'UI Designer', score: 92, status: 'Excellent' },
  { name: 'Emily Davis', role: 'QA Engineer', score: 85, status: 'Good' },
];

// Group teamAttendance by date
const attendanceByDate = teamAttendance.reduce((acc, curr) => {
  if (!acc[curr.date]) acc[curr.date] = [];
  acc[curr.date].push(curr);
  return acc;
}, {} as { [date: string]: typeof teamAttendance });

export const ManagerDashboard = () => {
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      <style>{`
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
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">Team management and performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
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
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                <span className="text-sm text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Attendance Card Layout */}
      <div className="bg-card p-6 rounded-xl border border-border mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Team Attendance Overview</h3>
        {/* Header row for Employee, Status */}
        <div className="hidden sm:flex items-center px-4 pb-2 bg-muted/30 rounded-t-lg font-semibold">
          <div className="flex-[2] min-w-[180px] text-xs text-muted-foreground">Employee</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Status</div>
        </div>
        <div className="space-y-8">
          {Object.entries(attendanceByDate).map(([date, members]) => (
            <div key={date}>
              <div className="mb-2 text-xs sm:text-sm font-semibold text-muted-foreground pl-2 sm:pl-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> {date}
              </div>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0 flex-[2] min-w-[180px]">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${member.status === 'Present' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-card p-6 rounded-xl border border-border mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Team Leave Requests Overview</h3>
        {/* Header row for Type, Dates, Status */}
        <div className="hidden sm:flex items-center px-4 pb-2 bg-muted/30 rounded-t-lg font-semibold">
          <div className="flex-[2] min-w-[180px] text-xs text-muted-foreground">Employee</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Type</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Dates</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Status</div>
        </div>
        <div className="space-y-4">
          {leaveRequests.map((req, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0 flex-[2] min-w-[180px]">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.role}</p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-foreground mt-1 inline-block">{req.type}</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-foreground mt-1">{req.from} - {req.to}</span>
              </div>
              <div className="flex-1 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${req.status === 'Approved' ? 'bg-green-500/20 text-green-500' : req.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'}`}>{req.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance Card Layout */}
      <div className="bg-card p-6 rounded-xl border border-border mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary" /> Team Performance Overview</h3>
        {/* Header row for Employee, Score, Status */}
        <div className="hidden sm:flex items-center px-4 pb-2 bg-muted/30 rounded-t-lg font-semibold">
          <div className="flex-[2] min-w-[180px] text-xs text-muted-foreground">Employee</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Score</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">Status</div>
        </div>
        <div className="space-y-4">
          {teamPerformance.map((member, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0 flex-[2] min-w-[180px]">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex-1 text-center flex items-center justify-center gap-1">
                <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.873 6.9-1.002L12 2.25l3.093 6.997 6.9 1.002-5 4.873 1.179 6.873z" /></svg>
                <span className="text-sm font-medium text-foreground">{member.score}/100</span>
              </div>
              <div className="flex-1 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${member.status === 'Excellent' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
