import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// Assuming useAuth hook provides the current user's role and ID
import { useAuth } from "../../contexts/AuthContext";

// Mock data for employee's payslips (in a real app, this would come from an API)
const employeePayslips = [
  { month: "December 2024", amount: "$7,200", date: "2024-12-15", status: "Complete", payslipUrl: "#" },
  { month: "November 2024", amount: "$7,200", date: "2024-11-15", status: "Complete", payslipUrl: "#" },
  { month: "October 2024", amount: "$7,200", date: "2024-10-15", status: "Complete", payslipUrl: "#" },
  { month: "September 2024", amount: "$7,200", date: "2024-09-15", status: "Complete", payslipUrl: "#" },
  { month: "August 2024", amount: "$7,200", date: "2024-08-15", status: "Complete", payslipUrl: "#" },
];

export default function EmployeePayroll() {
  const [selectedMonth, setSelectedMonth] = useState("December 2024");
  useAuth(); // Get current user info

  // In a real application, you would fetch payslips specific to the logged-in employee (user.uid)
  // For this example, we're using static mock data.

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Payroll</h1>
          <p className="text-muted-foreground mt-2">View your salary slips and payroll history.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Current Payslip
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Eye className="h-4 w-4 mr-2" />
            View Current Payslip
          </Button>
        </div>
      </div>

      {/* Employee's Salary Summary (simplified) */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Month's Salary</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Month: {selectedMonth}</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {employeePayslips.find(p => p.month === selectedMonth)?.amount || "$0.00"}
            </p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48 bg-background border-border">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {employeePayslips.map((payslip) => (
                <SelectItem key={payslip.month} value={payslip.month} className="text-foreground hover:bg-muted/50">
                  {payslip.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          This is a summary of your earnings for the selected month. For a detailed breakdown, please download your payslip.
        </p>
      </div>

      {/* Employee's Payslip History */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payslip History</h3>
        <div className="space-y-4">
          {employeePayslips.map((payslip, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">{payslip.month}</p>
                <p className="text-xs text-muted-foreground">Processed on {payslip.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{payslip.amount}</p>
                  <Badge
                    variant={payslip.status === "Complete" ? "default" : "secondary"}
                    className="bg-primary/20 text-primary"
                  >
                    {payslip.status}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
