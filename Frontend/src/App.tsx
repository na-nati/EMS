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
import Payroll from "./pages/Payroll";
import AttendanceDashboard from "./pages/Attendance";
import PerformanceDashboard from "./pages/performance";
import TrainingDashboard from "./pages/Training";
import AssetsDashboard from "./pages/Assets";
import Report from "./pages/Report";
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
                <ProtectedRoute>
                  <Payroll />
                </ProtectedRoute>
              }
            />``
            
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
                  <TrainingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr', 'employee']}>
                  <AssetsDashboard />
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
                  <Report />
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
  <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{title}</h1>
      <p className="text-lg text-gray-600">This page is under development. Please check back later!</p>
      <div className="mt-6">
        {/* Simple loading animation */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  </div>
);
export default App;
