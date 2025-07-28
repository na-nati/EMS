import { useState, useMemo } from 'react';
import {
    FileText,
    Eye,
    Edit,
    Plus,
    Search,
    Trash2,
    Download,
    CheckCircle,
    AlertCircle,
    Send,
    MessageSquare,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable'; // Corrected typo here if 'lable' was intentional
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Textarea } from '../components/ui/textarea'; // Assuming you have a Textarea component

// --- Mock Data ---

// Mock Users Map (id -> user info) - Updated with role and department
const mockUsers: { [key: string]: { id: string; name: string; role: string; department?: string } } = {
    'emp123': { id: 'emp123', name: 'Alice Johnson', role: 'employee', department: 'Sales' },
    'emp456': { id: 'emp456', name: 'Bob Smith', role: 'employee', department: 'Marketing' },
    'emp789': { id: 'emp789', name: 'Charlie Brown', role: 'employee', department: 'Sales' },
    'hr001': { id: 'hr001', name: 'HR Admin', role: 'hr' },
    'man001': { id: 'man001', name: 'Manager Sales', role: 'manager', department: 'Sales' },
    'man002': { id: 'man002', name: 'Manager Marketing', role: 'manager', department: 'Marketing' },
    'sup001': { id: 'sup001', name: 'Super Admin', role: 'super_admin' },
};

// Fixed document types
const documentTypes = [
    'Experience Letter',
    'Contract',
    'Termination Letter',
    'Offer Letter',
    'Payslip',
    'Other',
];

// Mock Documents Data
const initialMockDocuments = [
    {
        id: 1,
        name: 'Experience Letter - Alice Johnson.pdf',
        type: 'Experience Letter',
        employee_id: 'emp123',
        uploaded_by: 'hr001',
        uploadDate: '2024-12-15',
        status: 'Approved',
        size: '2.4 MB',
        department: 'Sales'
    },
    {
        id: 2,
        name: 'Contract - Bob Smith.pdf',
        type: 'Contract',
        employee_id: 'emp456',
        uploaded_by: 'hr001',
        uploadDate: '2024-12-14',
        status: 'Pending',
        size: '1.1 MB',
        department: 'Marketing'
    },
    {
        id: 3,
        name: 'Offer Letter - Charlie Brown.pdf',
        type: 'Offer Letter',
        employee_id: 'emp789',
        uploaded_by: 'hr001',
        uploadDate: '2024-12-10',
        status: 'Approved',
        size: '0.8 MB',
        department: 'Sales'
    }
];

// Mock Document Requests Data
const initialMockRequests = [
    {
        id: 101,
        employee_id: 'emp123',
        document_type: 'Payslip',
        request_date: '2025-01-20',
        status: 'Pending',
        hr_notes: '',
        fulfillment_document_id: null,
    },
    {
        id: 102,
        employee_id: 'emp456',
        document_type: 'Experience Letter',
        request_date: '2025-01-18',
        status: 'Fulfilled',
        hr_notes: 'Uploaded on 2025-01-22',
        fulfillment_document_id: 2, // Linking to a mock document (ID 2: Contract - Bob Smith.pdf for demonstration)
    },
];

// --- DocumentForm Component (unchanged, just for context) ---
function DocumentForm({ doc, onCancel, onSave, employees, uploaderId }: { doc?: typeof initialMockDocuments[0], onCancel: () => void, onSave: (doc: any) => void, employees: { id: string, name: string }[], uploaderId: string }) {
    const [form, setForm] = useState(doc ? { ...doc } : { name: '', type: documentTypes[0], employee_id: employees[0]?.id || '', size: '', status: 'Pending', uploaded_by: uploaderId });
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setForm({
                ...form,
                name: f.name,
                size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
            });
        }
    };

    return (
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <Label htmlFor="file">Upload File</Label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
            {file && (
                <div className="text-sm text-muted-foreground">Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</div>
            )}
            <Label htmlFor="name">Document Name</Label>
            <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Experience Letter - John Doe.pdf" />
            <Label htmlFor="type">Type</Label>
            <Select value={form.type} onValueChange={value => setForm({ ...form, type: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                    {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Label htmlFor="employee">Employee</Label>
            <Select value={form.employee_id} onValueChange={value => setForm({ ...form, employee_id: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                    {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Label htmlFor="size">File Size</Label>
            <Input id="size" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g., 2.4 MB" disabled />
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11 border-border hover:bg-muted/50 bg-transparent">Cancel</Button>
                <Button type="submit" className="flex-1 h-11 bg-primary hover:bg-primary/80">Save</Button>
            </div>
        </form>
    );
}

// --- Main Documents Component ---
const Documents = () => {
    // Simulate user login via AuthContext. For demonstration, we'll hardcode a user.
    // In a real app, `user` would come from your actual authentication.
    const { user: authUser } = useAuth();
    // For testing different roles, uncomment one of these lines:
    const user = authUser || mockUsers['hr001']; // Test as HR
    // const user = authUser || mockUsers['emp123']; // Test as Employee
    // const user = authUser || mockUsers['man001']; // Test as Manager
    // const user = authUser || mockUsers['sup001']; // Test as Super Admin


    const { toast } = useToast();
    const [documents, setDocuments] = useState(initialMockDocuments);
    const [requests, setRequests] = useState(initialMockRequests);
    const [documentSearch, setDocumentSearch] = useState('');
    const [documentStatus, setDocumentStatus] = useState('All');
    const [showDocumentModal, setShowDocumentModal] = useState<null | typeof initialMockDocuments[0]>(null);
    const [editingDocument, setEditingDocument] = useState<null | typeof initialMockDocuments[0]>(null);
    const [addingDocument, setAddingDocument] = useState(false);
    const [activeTab, setActiveTab] = useState('documents'); // 'documents' or 'requests'

    // New states for requests
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestType, setRequestType] = useState(documentTypes[0]);
    const [requestNotes, setRequestNotes] = useState('');
    const [fulfillingRequest, setFulfillingRequest] = useState<null | typeof initialMockRequests[0]>(null);
    const [rejectingRequest, setRejectingRequest] = useState<null | typeof initialMockRequests[0]>(null);
    const [rejectionNotes, setRejectionNotes] = useState('');


    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-foreground">Please log in to access documents</h2>
                    <p className="text-muted-foreground">You need to be authenticated to view this page.</p>
                </div>
            </div>
        );
    }

    const isEmployee = user.role === 'employee';
    const isHR = user.role === 'hr';
    const isManager = user.role === 'manager';
    const isSuperAdmin = user.role === 'super_admin';

    // Derived permissions
    const canAddDocument = isHR || isSuperAdmin;
    const canEditDocument = isHR || isSuperAdmin;
    const canDeleteDocument = isHR || isSuperAdmin;
    const canApproveRejectDocument = isHR || isSuperAdmin; // For direct document status change
    const canRequestDocument = isEmployee;
    const canFulfillRejectRequest = isHR || isSuperAdmin;


    // Employees list for HR/SuperAdmin to select for documents/requests
    const employees = useMemo(() => Object.values(mockUsers).filter(u => u.role === 'employee'), []);

    // Filtered documents
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(documentSearch.toLowerCase());
            const matchesStatus = documentStatus === 'All' || doc.status === documentStatus;

            if (isEmployee) {
                return matchesSearch && matchesStatus && doc.employee_id === user.id;
            }
            if (isManager) {
                return matchesSearch && matchesStatus && doc.department === user.department;
            }
            return matchesSearch && matchesStatus; // HR and SuperAdmin see all
        });
    }, [documents, documentSearch, documentStatus, user, isEmployee, isManager]);

    // Filtered requests
    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const employee = mockUsers[req.employee_id];
            const matchesSearch = req.document_type.toLowerCase().includes(documentSearch.toLowerCase()) ||
                employee?.name.toLowerCase().includes(documentSearch.toLowerCase());
            const matchesStatus = documentStatus === 'All' || req.status === documentStatus;

            if (isEmployee) {
                return matchesSearch && matchesStatus && req.employee_id === user.id;
            }
            if (isManager) {
                return matchesSearch && matchesStatus && employee?.department === user.department;
            }
            return matchesSearch && matchesStatus; // HR and SuperAdmin see all
        });
    }, [requests, documentSearch, documentStatus, user, isEmployee, isManager]);


    // Mock download handler
    const handleDownload = (doc: typeof initialMockDocuments[0]) => {
        toast({ title: 'Download', description: `Pretend downloading: ${doc.name}` });
    };

    // Handle Document Status Change (HR/SuperAdmin for direct document status)
    const handleDocumentStatusChange = (docId: number, status: 'Approved' | 'Rejected' | 'Pending') => {
        if (!canApproveRejectDocument) return;
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status } : d));
        toast({ title: `Document ${status}`, description: `Document status updated to ${status.toLowerCase()}.` });
    };

    // Handle Employee Request Submission
    const handleRequestDocument = () => {
        if (!user || !isEmployee) return;

        const newRequest = {
            id: Date.now(),
            employee_id: user.id,
            document_type: requestType,
            request_date: new Date().toISOString().slice(0, 10),
            status: 'Pending',
            hr_notes: requestNotes,
            fulfillment_document_id: null,
        };
        setRequests(prev => [...prev, newRequest]);
        setShowRequestForm(false);
        setRequestNotes('');
        toast({ title: 'Request Sent', description: `Your request for a ${requestType} has been sent.` });
    };

    // Handle Fulfilling a Request (HR/SuperAdmin)
    const handleFulfillRequestSave = (doc: any) => {
        if (!fulfillingRequest || (!isHR && !isSuperAdmin)) return;

        const newDoc = {
            ...doc,
            id: Date.now(),
            uploadDate: new Date().toISOString().slice(0, 10),
            uploaded_by: user.id,
            status: 'Approved', // Mark as Approved upon fulfillment
            department: mockUsers[doc.employee_id]?.department || 'N/A', // Assign department from employee
        };
        setDocuments(prev => [...prev, newDoc]);

        setRequests(prev => prev.map(req =>
            req.id === fulfillingRequest.id
                ? { ...req, status: 'Fulfilled', fulfillment_document_id: newDoc.id, hr_notes: `Document uploaded: ${newDoc.name}` }
                : req
        ));

        setFulfillingRequest(null);
        toast({ title: 'Request Fulfilled', description: `Document for request #${fulfillingRequest.id} has been uploaded and linked.` });
    };

    // Handle Rejecting a Request (HR/SuperAdmin)
    const handleRejectRequest = () => {
        if (!rejectingRequest || (!isHR && !isSuperAdmin)) return;

        setRequests(prev => prev.map(req =>
            req.id === rejectingRequest.id
                ? { ...req, status: 'Rejected', hr_notes: rejectionNotes }
                : req
        ));
        setRejectingRequest(null);
        setRejectionNotes('');
        toast({ title: 'Request Rejected', description: `Request #${rejectingRequest.id} has been rejected.` });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Fulfilled':
                return 'default';
            case 'Rejected':
                return 'destructive';
            case 'Pending':
            default:
                return 'secondary';
        }
    };


    return (
        <div className="space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
            {/* Dark Mode Styles */}
            <style>{`
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
        .hover\\:bg-primary\/80:hover { background-color: hsl(142 76% 36% / 0.8); }
        .hover\\:bg-muted\/50:hover { background-color: hsl(0 0% 14.9% / 0.5); }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Application Documents & Requests</h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        {isEmployee ? 'Request and track your application documents.' :
                            isHR ? 'Manage, review, and organize all recruitment-related documents and requests.' :
                                isManager ? 'Monitor document activity within your department.' :
                                    'Administer all documents and requests across the organization.'}
                    </p>
                </div>
                {(canAddDocument || canRequestDocument) && (
                    <div className="flex gap-2">
                        {canRequestDocument && (
                            <Button className="bg-primary hover:bg-primary/80" onClick={() => setShowRequestForm(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Request Document
                            </Button>
                        )}
                        {canAddDocument && (
                            <Button className="bg-primary hover:bg-primary/80" onClick={() => setAddingDocument(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Document
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs for Documents and Requests */}
            <div className="flex border-b border-border">
                <Button
                    variant="ghost"
                    className={`rounded-none border-b-2 ${activeTab === 'documents' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'} hover:bg-muted/50`}
                    onClick={() => setActiveTab('documents')}
                >
                    Documents
                </Button>
                {(isHR || isSuperAdmin || isManager || isEmployee) && ( // All roles can see requests relevant to them
                    <Button
                        variant="ghost"
                        className={`rounded-none border-b-2 ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'} hover:bg-muted/50`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Document Requests
                    </Button>
                )}
            </div>

            {/* --- Documents Tab Content --- */}
            {activeTab === 'documents' && (
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-foreground">Documents</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search documents..."
                                        value={documentSearch}
                                        onChange={e => setDocumentSearch(e.target.value)}
                                        className="pl-10 w-full sm:w-64 bg-background border-border text-foreground"
                                    />
                                </div>
                                <Select value={documentStatus} onValueChange={setDocumentStatus}>
                                    <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredDocuments.length > 0 ? (
                                filteredDocuments.map(doc => (
                                    <div key={doc.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>Employee: {mockUsers[doc.employee_id]?.name || doc.employee_id}</p>
                                                    <p>Uploaded By: {mockUsers[doc.uploaded_by]?.name || doc.uploaded_by}</p>
                                                    <p>Type: {doc.type} • Size: {doc.size}</p>
                                                    <p>Uploaded: {doc.uploadDate}</p>
                                                    {doc.department && <p>Department: {doc.department}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3">
                                            <Badge
                                                variant={getStatusBadgeVariant(doc.status)}
                                                className="flex-shrink-0"
                                            >
                                                {doc.status}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setShowDocumentModal(doc)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {(isEmployee && doc.status === 'Approved') || (!isEmployee) ? ( // Employees can only download approved docs
                                                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => handleDownload(doc)}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                ) : null}
                                                {canEditDocument && (
                                                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingDocument(doc)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {canDeleteDocument && (
                                                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {canApproveRejectDocument && doc.status === 'Pending' && (
                                                    <>
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => handleDocumentStatusChange(doc.id, 'Approved')}>
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 font-semibold" onClick={() => handleDocumentStatusChange(doc.id, 'Rejected')}>
                                                            <AlertCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No documents found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* --- Requests Tab Content --- */}
            {activeTab === 'requests' && (
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-foreground">Document Requests</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search requests..."
                                        value={documentSearch}
                                        onChange={e => setDocumentSearch(e.target.value)}
                                        className="pl-10 w-full sm:w-64 bg-background border-border text-foreground"
                                    />
                                </div>
                                <Select value={documentStatus} onValueChange={setDocumentStatus}>
                                    <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map(req => (
                                    <div key={req.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MessageSquare className="h-5 w-5 text-secondary-foreground" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-foreground truncate">Request for: {req.document_type}</h3>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>Requested by: {mockUsers[req.employee_id]?.name || req.employee_id} ({mockUsers[req.employee_id]?.department})</p>
                                                    <p>Request Date: {req.request_date}</p>
                                                    {req.hr_notes && <p>HR Notes: {req.hr_notes}</p>}
                                                    {req.fulfillment_document_id && (
                                                        <p>
                                                            Fulfilled by: <span className="font-semibold text-primary">{documents.find(d => d.id === req.fulfillment_document_id)?.name || 'N/A'}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3">
                                            <Badge
                                                variant={getStatusBadgeVariant(req.status)}
                                                className="flex-shrink-0"
                                            >
                                                {req.status}
                                            </Badge>
                                            <div className="flex gap-2">
                                                {canFulfillRejectRequest && req.status === 'Pending' && (
                                                    <>
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => setFulfillingRequest(req)}>
                                                            <CheckCircle className="h-4 w-4 mr-1" /> Fulfill
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 font-semibold" onClick={() => setRejectingRequest(req)}>
                                                            <AlertCircle className="h-4 w-4 mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {req.fulfillment_document_id && (isEmployee || isManager || isSuperAdmin) && (
                                                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => {
                                                        const fulfilledDoc = documents.find(d => d.id === req.fulfillment_document_id);
                                                        if (fulfilledDoc) {
                                                            setShowDocumentModal(fulfilledDoc);
                                                        } else {
                                                            toast({ title: 'Document Not Found', description: 'The linked document could not be found.', variant: 'destructive' });
                                                        }
                                                    }}>
                                                        <Eye className="h-4 w-4 mr-1" /> View Document
                                                    </Button>
                                                )}
                                                {req.fulfillment_document_id && (isEmployee || isManager || isSuperAdmin) && (
                                                    <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => {
                                                        const fulfilledDoc = documents.find(d => d.id === req.fulfillment_document_id);
                                                        if (fulfilledDoc) {
                                                            handleDownload(fulfilledDoc);
                                                        } else {
                                                            toast({ title: 'Document Not Found', description: 'The linked document could not be found.', variant: 'destructive' });
                                                        }
                                                    }}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No document requests found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Document Details Modal (View) */}
            {showDocumentModal && (
                <Dialog open={!!showDocumentModal} onOpenChange={() => setShowDocumentModal(null)}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Document Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-2 text-sm">
                            <p><strong>Name:</strong> {showDocumentModal.name}</p>
                            <p><strong>Employee:</strong> {mockUsers[showDocumentModal.employee_id]?.name || showDocumentModal.employee_id}</p>
                            <p><strong>Uploaded By:</strong> {mockUsers[showDocumentModal.uploaded_by]?.name || showDocumentModal.uploaded_by}</p>
                            <p><strong>Type:</strong> {showDocumentModal.type}</p>
                            <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(showDocumentModal.status)}>{showDocumentModal.status}</Badge></p>
                            <p><strong>Size:</strong> {showDocumentModal.size}</p>
                            <p><strong>Uploaded:</strong> {showDocumentModal.uploadDate}</p>
                            {showDocumentModal.department && <p><strong>Department:</strong> {showDocumentModal.department}</p>}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setShowDocumentModal(null)} className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Add Document Modal (HR/SuperAdmin) */}
            {canAddDocument && addingDocument && (
                <Dialog open={addingDocument} onOpenChange={setAddingDocument}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Add New Document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm
                            employees={employees}
                            uploaderId={user.id}
                            onCancel={() => setAddingDocument(false)}
                            onSave={doc => {
                                setDocuments(prev => [...prev, {
                                    ...doc,
                                    id: Date.now(),
                                    status: 'Approved', // Documents added directly by HR/SuperAdmin are approved by default
                                    uploadDate: new Date().toISOString().slice(0, 10),
                                    uploaded_by: user.id,
                                    department: mockUsers[doc.employee_id]?.department || 'N/A'
                                }]);
                                setAddingDocument(false);
                                toast({ title: 'Document Added', description: 'Document has been added.' });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Document Modal (HR/SuperAdmin) */}
            {canEditDocument && editingDocument && (
                <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Edit Document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm
                            doc={editingDocument}
                            employees={employees}
                            uploaderId={user.id}
                            onCancel={() => setEditingDocument(null)}
                            onSave={doc => {
                                setDocuments(prev => prev.map(d => d.id === editingDocument.id ? { ...d, ...doc, department: mockUsers[doc.employee_id]?.department || 'N/A' } : d));
                                setEditingDocument(null);
                                toast({ title: 'Document Updated', description: 'Document details have been updated.' });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Request Document Modal (Employee) */}
            {canRequestDocument && showRequestForm && (
                <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Request a New Document</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Label htmlFor="requestType">Document Type</Label>
                            <Select value={requestType} onValueChange={setRequestType}>
                                <SelectTrigger className="bg-background border-border text-foreground">
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {documentTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label htmlFor="requestNotes">Notes (Optional)</Label>
                            <Textarea
                                id="requestNotes"
                                value={requestNotes}
                                onChange={e => setRequestNotes(e.target.value)}
                                placeholder="Add any specific details for your request..."
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)} className="border-border hover:bg-muted/50 bg-transparent">Cancel</Button>
                            <Button type="submit" onClick={handleRequestDocument} className="bg-primary hover:bg-primary/80">
                                <Send className="h-4 w-4 mr-2" /> Send Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Fulfill Request Modal (HR/SuperAdmin) */}
            {canFulfillRejectRequest && fulfillingRequest && (
                <Dialog open={!!fulfillingRequest} onOpenChange={() => setFulfillingRequest(null)}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Fulfill Request for {mockUsers[fulfillingRequest.employee_id]?.name || fulfillingRequest.employee_id} ({fulfillingRequest.document_type})</DialogTitle>
                        </DialogHeader>
                        <DocumentForm
                            employees={employees}
                            uploaderId={user.id}
                            onCancel={() => setFulfillingRequest(null)}
                            onSave={handleFulfillRequestSave}
                            // Pre-fill form with requested type and employee
                            doc={{
                                ...fulfillingRequest,
                                name: `${fulfillingRequest.document_type} - ${mockUsers[fulfillingRequest.employee_id]?.name || ''}.pdf`,
                                type: fulfillingRequest.document_type,
                                employee_id: fulfillingRequest.employee_id,
                                size: '', // Size will be updated when file is selected
                                status: 'Approved',
                                uploaded_by: user.id,
                                uploadDate: new Date().toISOString().slice(0, 10),
                                department: mockUsers[fulfillingRequest.employee_id]?.department || 'N/A', // Assign department from employee
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Reject Request Modal (HR/SuperAdmin) */}
            {canFulfillRejectRequest && rejectingRequest && (
                <Dialog open={!!rejectingRequest} onOpenChange={() => setRejectingRequest(null)}>
                    <DialogContent className="bg-card text-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Reject Request for {mockUsers[rejectingRequest.employee_id]?.name || rejectingRequest.employee_id} ({rejectingRequest.document_type})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Label htmlFor="rejectionNotes">Reason for Rejection</Label>
                            <Textarea
                                id="rejectionNotes"
                                value={rejectionNotes}
                                onChange={e => setRejectionNotes(e.target.value)}
                                placeholder="Please provide a reason for rejecting this request."
                                className="bg-background border-border text-foreground"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setRejectingRequest(null)} className="border-border hover:bg-muted/50 bg-transparent">Cancel</Button>
                            <Button type="submit" onClick={handleRejectRequest} className="bg-destructive hover:bg-destructive/80">
                                Reject Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Documents;