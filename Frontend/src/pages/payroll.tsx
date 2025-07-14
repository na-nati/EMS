import { useAuth } from '../contexts/AuthContext';
// FIX: Changed to a default import, assuming 'payroll.tsx' contains the default exported PayrollDashboard.
// The alias 'AdminPayroll' is kept for consistency with previous versions.
import AdminPayroll from '../components/Payroll/payroll'; // This assumes payroll.tsx exports default PayrollDashboard

// FIX: Changed to a default import for EmployeePayroll.
// This assumes EmployeePayroll.tsx exports default EmployeePayroll.
import EmployeePayroll from '../components/Payroll/EmployeePayroll';

const Payroll = () => {
  const { user } = useAuth();

  const renderPayroll = () => {
    switch (user?.role) {
      case 'super_admin':
      case 'hr':
      case 'manager':
        return <AdminPayroll />; // Using the imported default component
      case 'employee':
        return <EmployeePayroll />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return renderPayroll();
};

export default Payroll;
