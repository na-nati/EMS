import { Calendar, DollarSign, Clock, Award, TrendingUp, FileText } from "lucide-react"

const stats = [
  { name: "Leave Balance", value: "18 days", icon: Calendar, change: "-2 days", changeType: "neutral" },
  { name: "This Month Salary", value: "$4,500", icon: DollarSign, change: "+$200", changeType: "positive" },
  { name: "Hours This Week", value: "42h", icon: Clock, change: "+2h", changeType: "positive" },
  { name: "Performance Score", value: "92%", icon: Award, change: "+5%", changeType: "positive" },
]

export const EmployeeDashboard = () => {
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-foreground font-inter">
      {/* Tailwind CSS configuration for custom colors and font */}
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">Here's your personal dashboard overview</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border shadow-sm">
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
                <TrendingUp
                  className={`h-4 w-4 mr-1 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>
      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { activity: "Leave request approved", date: "2 hours ago", type: "success" },
              { activity: "Performance review completed", date: "1 day ago", type: "info" },
              { activity: "Training session attended", date: "3 days ago", type: "success" },
              { activity: "Document uploaded", date: "1 week ago", type: "info" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${item.type === "success" ? "bg-green-500" : "bg-blue-500"}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Apply Leave", icon: Calendar },
              { name: "View Payslip", icon: DollarSign },
              { name: "Clock In/Out", icon: Clock },
              { name: "Request Document", icon: FileText },
            ].map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.name}
                  className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm font-medium text-foreground">{action.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
