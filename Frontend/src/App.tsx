import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LeaveManagement from "./pages/LeaveManagement";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import Payroll from "./pages/payroll";
import AttendanceDashboard from "./pages/Attendance";
import PerformanceDashboard from "./pages/performance";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'manager']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'employee']}>
                  <Payroll />
                </ProtectedRoute>
              }
            />
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
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'employee']}>
                  <PlaceholderPage title="Training & Education" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'employee']}>
                  <PlaceholderPage title="Asset Management" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruitment"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'manager']}>
                  <PlaceholderPage title="Recruitment" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'manager']}>
                  <PlaceholderPage title="Reports & Analytics" />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</h1>
    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Coming soon...</p>
  </div>
);

export default App;
