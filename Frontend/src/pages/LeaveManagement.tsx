import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Plus, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockLeaveRequests = [
  {
    id: '1',
    employeeName: 'John Smith',
    leaveType: 'Annual Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2024-01-01'
  },
  {
    id: '2',
    employeeName: 'Sarah Connor',
    leaveType: 'Sick Leave',
    startDate: '2024-01-10',
    endDate: '2024-01-11',
    days: 2,
    reason: 'Medical appointment',
    status: 'approved',
    appliedOn: '2024-01-08'
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    leaveType: 'Personal Leave',
    startDate: '2024-01-22',
    endDate: '2024-01-22',
    days: 1,
    reason: 'Personal matter',
    status: 'rejected',
    appliedOn: '2024-01-05'
  },
];

const LeaveManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const canManageLeaves = user?.role === 'hr' || user?.role === 'manager' || user?.role === 'super_admin';

  const filteredRequests = mockLeaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-2">
            {canManageLeaves ? 'Manage team leave requests' : 'View and apply for leave'}
          </p>
        </div>
        
        {user?.role === 'employee' && (
          <button
            onClick={() => setShowNewLeaveForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { key: 'requests', label: 'Leave Requests', count: filteredRequests.length },
            { key: 'calendar', label: 'Leave Calendar', count: null },
            { key: 'balance', label: 'Leave Balance', count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Leave Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Leave Requests List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    {canManageLeaves && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {request.employeeName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Applied on {new Date(request.appliedOn).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{request.leaveType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{request.days} days</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </span>
                      </td>
                      {canManageLeaves && (
                        <td className="px-6 py-4">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button className="bg-green-500/20 text-green-500 hover:bg-green-500/30 px-3 py-1 rounded text-xs font-medium transition-colors">
                                Approve
                              </button>
                              <button className="bg-red-500/20 text-red-500 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-medium transition-colors">
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave Balance Tab */}
      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: 'Annual Leave', used: 12, total: 25, color: 'text-blue-500' },
            { type: 'Sick Leave', used: 3, total: 10, color: 'text-red-500' },
            { type: 'Personal Leave', used: 2, total: 5, color: 'text-green-500' },
            { type: 'Maternity/Paternity', used: 0, total: 90, color: 'text-purple-500' },
          ].map((leave) => (
            <div key={leave.type} className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{leave.type}</h3>
                <Calendar className={`w-5 h-5 ${leave.color}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Used: {leave.used} days</span>
                  <span className="text-foreground">Remaining: {leave.total - leave.used} days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${leave.color.replace('text-', 'bg-').replace('-500', '-500')}`}
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: {leave.total} days
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Leave Calendar</h3>
            <p className="text-muted-foreground">
              Calendar view will be implemented with a proper date picker component
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;