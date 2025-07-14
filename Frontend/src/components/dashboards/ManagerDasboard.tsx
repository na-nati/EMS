import { Users, Target, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const stats = [
  { name: 'Team Members', value: '12', icon: Users, change: '+2', changeType: 'positive' },
  { name: 'Pending Reviews', value: '3', icon: Target, change: '-1', changeType: 'positive' },
  { name: 'Team Attendance', value: '92%', icon: Calendar, change: '+3%', changeType: 'positive' },
  { name: 'Projects Active', value: '8', icon: CheckCircle, change: '+2', changeType: 'positive' },
];

export const ManagerDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">Team management and performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
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

      {/* Team Performance & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Team Performance</h3>
          <div className="space-y-4">
            {[
              { name: 'John Smith', role: 'Frontend Developer', performance: 95, status: 'excellent' },
              { name: 'Sarah Connor', role: 'Backend Developer', performance: 88, status: 'good' },
              { name: 'Mike Johnson', role: 'UI Designer', performance: 92, status: 'excellent' },
              { name: 'Emily Davis', role: 'QA Engineer', performance: 85, status: 'good' },
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{member.performance}%</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'excellent' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pending Tasks</h3>
          <div className="space-y-4">
            {[
              { task: 'Review John\'s Performance', priority: 'high', due: 'Today' },
              { task: 'Approve Leave Request', priority: 'medium', due: 'Tomorrow' },
              { task: 'Team Meeting Prep', priority: 'low', due: 'Friday' },
              { task: 'Budget Review', priority: 'high', due: 'Next Week' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <p className="text-xs text-muted-foreground">Due: {item.due}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.priority === 'high' 
                    ? 'bg-red-500/20 text-red-500' 
                    : item.priority === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
