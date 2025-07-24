import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Import UserRole type
import type { UserRole } from "./contexts/AuthContext";

// ✅ Placeholder page component
// interface PlaceholderPageProps {
//   title: string;
// }

// const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
//   <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
//     <div className="text-center p-8 bg-white rounded-lg shadow-lg">
//       <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{title}</h1>
//       <p className="text-lg text-gray-600">
//         This page is under development. Please check back later!
//       </p>
//       <div className="mt-6">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//       </div>
//     </div>
//   </div>
// );

// ✅ Inner app that uses useAuth safely
const InnerApp = () => {
  const { user } = useAuth();

  const getFullName = () =>
    user ? `${user.firstName} ${user.lastName}` : "Unknown";

  // Ensure effectiveUserRole is always a valid UserRole
  const effectiveUserRole: UserRole = user?.role || "employee";

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route path="/payroll"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'hr', 'employee', 'manager']}>
                <Payroll />
              </ProtectedRoute>} />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <PerformanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr"]}>

                <TrainingDashboard userRole={effectiveUserRole} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training-emp"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                {/* Pass userRole and currentUser to TrainingEmp */}
                <TrainingEmp userRole={effectiveUserRole} currentUser={getFullName()} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "employee"]}>
                {/* Pass userRole and currentUser to AssetsDashboard */}
                <AssetsDashboard userRole={effectiveUserRole} currentUser={getFullName()} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Recruitment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "manager"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "hr", "employee"]}>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/separation-request"
            element={
              <ProtectedRoute allowedRoles={["employee", "manager", "hr"]}>
                <SeparationRequest />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

// ✅ Top-level App component
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp /> {/* InnerApp is now correctly wrapped */}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;