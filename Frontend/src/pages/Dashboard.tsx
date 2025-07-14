import { useAuth } from '../contexts/AuthContext';
import { SuperAdminDashboard } from '../components/dashboards/SuperAdminDashboard';
import { HRDashboard } from '../components/dashboards/HRDashboard';
import { ManagerDashboard } from '../components/dashboards/ManagerDasboard';
import { EmployeeDashboard } from '../components/dashboards/EmployeeDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'hr':
        return <HRDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return renderDashboard();
};

export default Dashboard;
