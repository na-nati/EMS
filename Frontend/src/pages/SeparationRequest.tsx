import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';

// Types
interface SeparationRequestType {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    reason: string;
    note?: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'HR Processed';
    requestedOn: string;
    processedBy?: string;
}

const initialRequests: SeparationRequestType[] = [
    {
        id: '1',
        employeeId: 'emp1',
        employeeName: 'Alex Johnson',
        department: 'Engineering',
        reason: 'Personal reasons',
        note: 'Thank you for the opportunity.',
        status: 'Pending',
        requestedOn: '2024-06-01',
    },
    {
        id: '2',
        employeeId: 'emp2',
        employeeName: 'Maria Garcia',
        department: 'Design',
        reason: 'Relocation',
        note: '',
        status: 'Approved',
        requestedOn: '2024-06-02',
    },
    {
        id: '3',
        employeeId: 'emp3',
        employeeName: 'David Kim',
        department: 'Sales',
        reason: 'New opportunity',
        note: '',
        status: 'HR Processed',
        requestedOn: '2024-05-28',
        processedBy: 'HR Admin',
    },
];

const SeparationRequest: React.FC = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<SeparationRequestType[]>(initialRequests);
    const [form, setForm] = useState({ reason: '', note: '' });
    const [submitting, setSubmitting] = useState(false);

    if (!user) return <div>Please log in to view this page.</div>;

    // Employee: submit request
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.reason.trim()) {
            alert('Reason is required');
            return;
        }
        setSubmitting(true);
        const newRequest: SeparationRequestType = {
            id: (requests.length + 1).toString(),
            employeeId: user.id,
            employeeName: `${user.firstName} ${user.lastName}`,
            department: user.department || '',
            reason: form.reason,
            note: form.note,
            status: 'Pending',
            requestedOn: new Date().toISOString().split('T')[0],
        };
        setRequests(prev => [newRequest, ...prev]);
        setForm({ reason: '', note: '' });
        setSubmitting(false);
        alert('Separation request submitted!');
    };

    // Manager: approve/reject
    const handleManagerAction = (id: string, status: 'Approved' | 'Rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        alert(`Request ${status.toLowerCase()}!`);
    };

    // HR: process settlement
    const handleHRProcess = (id: string) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'HR Processed', processedBy: `${user.firstName} ${user.lastName}` } : req));
        alert('Request marked as HR Processed!');
    };

    // Filtered views
    const employeeRequests = useMemo(() =>
        requests.filter(r => r.employeeId === user.id),
        [requests, user.id]
    );
    const managerRequests = useMemo(() =>
        requests.filter(r => r.department === user.department && r.status === 'Pending'),
        [requests, user.department]
    );
    const hrRequests = useMemo(() =>
        requests.filter(r => r.status === 'Approved'),
        [requests]
    );

    // UI by role
    return (
        <div className="space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
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
                    .input { background-color: hsl(var(--input)); }
                    .ring { border-color: hsl(var(--ring)); }
                    .hover\\:bg-primary\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
                    .hover\\:bg-muted\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
                    .font-inter { font-family: 'Inter', sans-serif; }
                `}
            </style>
            {!user && <div>Please log in to view this page.</div>}
            {user && user.role === 'employee' && (
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-xl font-semibold mb-4">Separation Request</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded-lg border border-border">
                        <div>
                            <label className="block mb-1 font-medium">Reason <span className="text-red-500">*</span></label>
                            <Input
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                placeholder="Enter reason for separation"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Note (optional)</label>
                            <Textarea
                                value={form.note}
                                onChange={e => setForm({ ...form, note: e.target.value })}
                                placeholder="Add any additional note"
                                rows={3}
                            />
                        </div>
                        <Button type="submit" className="bg-primary text-white" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </form>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Your Past Requests</h3>
                        <div className="space-y-2">
                            {employeeRequests.length === 0 && <div>No requests found.</div>}
                            {employeeRequests.map(req => (
                                <div key={req.id} className="p-3 bg-muted rounded border border-border flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{req.reason}</div>
                                        <div className="text-xs text-muted-foreground">{req.requestedOn}</div>
                                        {req.note && <div className="text-xs mt-1">Note: {req.note}</div>}
                                    </div>
                                    <Badge className={
                                        req.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                                            req.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                                                req.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-blue-500/20 text-blue-500'
                                    }>{req.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {user && user.role === 'manager' && (
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-xl font-semibold mb-4">Team Separation Requests</h2>
                    <div className="space-y-2">
                        {managerRequests.length === 0 && <div>No pending requests from your team.</div>}
                        {managerRequests.map(req => (
                            <div key={req.id} className="p-3 bg-card rounded border border-border flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{req.employeeName} ({req.department})</div>
                                    <div className="text-xs text-muted-foreground">{req.requestedOn}</div>
                                    <div className="text-sm mt-1">Reason: {req.reason}</div>
                                    {req.note && <div className="text-xs mt-1">Note: {req.note}</div>}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleManagerAction(req.id, 'Approved')}>Approve</Button>
                                    <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent" onClick={() => handleManagerAction(req.id, 'Rejected')}>Reject</Button>
                                    <Badge className={
                                        req.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                                            req.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                                                req.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-blue-500/20 text-blue-500'
                                    }>{req.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {user && user.role === 'hr' && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-xl font-semibold mb-4">Approved Separation Requests</h2>
                    <div className="space-y-2">
                        {hrRequests.length === 0 && <div>No approved requests to process.</div>}
                        {hrRequests.map(req => (
                            <div key={req.id} className="p-3 bg-card rounded border border-border flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{req.employeeName} ({req.department})</div>
                                    <div className="text-xs text-muted-foreground">{req.requestedOn}</div>
                                    <div className="text-sm mt-1">Reason: {req.reason}</div>
                                    {req.note && <div className="text-xs mt-1">Note: {req.note}</div>}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleHRProcess(req.id)}>
                                        Mark as HR Processed
                                    </Button>
                                    <Badge className={
                                        req.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                                            req.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                                                req.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-blue-500/20 text-blue-500'
                                    }>{req.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!user && <div>Not authorized to view this page.</div>}
        </div>
    );
};

export default SeparationRequest; 