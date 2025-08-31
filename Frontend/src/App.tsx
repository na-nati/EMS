import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LeaveManagement from "./pages/LeaveManagement";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import Payroll from "./pages/Payrolls";
import AttendanceDashboard from "./pages/Attendance";
import PerformanceDashboard from "./pages/performance";
import TrainingDashboard from "./pages/Training";
import AssetsDashboard from "./pages/Assets";
import Report from "./pages/Report";
import Employee from "./pages/Employee";
import TrainingEmp from "./pages/TrainingEmp";
import Recruitment from "./pages/Recruitment";
import Documents from "./pages/Documents";
import SeparationRequest from "./pages/SeparationRequest";
import Departments from "./pages/Department";
import LandingPage from "./pages/LandingPage";
import Pricing from "./pages/Pricing";

// Import UserRole type
import type { UserRole } from "./contexts/AuthContext";

const InnerApp = () => {
  const { user } = useAuth();

  const getFullName = () =>
    user ? `${user.firstName} ${user.lastName}` : "Unknown";

  // Ensure effectiveUserRole is always a valid UserRole
  const effectiveUserRole: UserRole = user?.role || "employee";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes wrapped in Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route
            path="employees"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="departments"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll"
            element={
              <ProtectedRoute
                allowedRoles={["super_admin", "hr", "employee", "manager"]}
              >
                <Payroll />
              </ProtectedRoute>
            }
          />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="performance" element={<PerformanceDashboard />} />
          <Route
            path="training"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr"]}>
                <TrainingDashboard userRole={effectiveUserRole} />
              </ProtectedRoute>
            }
          />
          <Route
            path="training-emp"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <TrainingEmp
                  userRole={effectiveUserRole}
                  currentUser={getFullName()}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="assets"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "employee"]}>
                <AssetsDashboard
                  userRole={effectiveUserRole}
                  currentUser={getFullName()}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruitment"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Recruitment />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "employee"]}>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="separation-request"
            element={
              <ProtectedRoute allowedRoles={["employee", "manager", "hr"]}>
                <SeparationRequest />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// ✅ Top-level App component
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;