import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/lable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';

// Mock Users Map (id -> user info)
const mockUsers: { [id: string]: { id: string; name: string } } = {
    'emp123': { id: 'emp123', name: 'Alice Johnson' },
    'emp456': { id: 'emp456', name: 'Bob Smith' },
    'hr001': { id: 'hr001', name: 'HR Admin' },
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

// Mock Data
const mockDocuments = [
    {
        id: 1,
        name: 'Experience Letter - Alice Johnson.pdf',
        type: 'Experience Letter',
        employee_id: 'emp123',
        uploaded_by: 'hr001',
        uploadDate: '2024-12-15',
        status: 'Approved',
        size: '2.4 MB'
    },
    {
        id: 2,
        name: 'Contract - Bob Smith.pdf',
        type: 'Contract',
        employee_id: 'emp456',
        uploaded_by: 'hr001',
        uploadDate: '2024-12-14',
        status: 'Pending',
        size: '1.1 MB'
    }
];

function DocumentForm({ doc, onCancel, onSave, employees, uploaderId }: { doc?: typeof mockDocuments[0], onCancel: () => void, onSave: (doc: any) => void, employees: { id: string, name: string }[], uploaderId: string }) {
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

const Documents = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [documents, setDocuments] = useState(mockDocuments);
    const [documentSearch, setDocumentSearch] = useState('');
    const [documentStatus, setDocumentStatus] = useState('All');
    const [showDocumentModal, setShowDocumentModal] = useState<null | typeof mockDocuments[0]>(null);
    const [editingDocument, setEditingDocument] = useState<null | typeof mockDocuments[0]>(null);
    const [addingDocument, setAddingDocument] = useState(false);

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

    // Only HR can upload
    const isHR = user.role === 'hr';

    // Employees list for HR to select
    const employees = Object.values(mockUsers).filter(u => u.id.startsWith('emp'));

    // Filtered documents
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch =
            doc.name.toLowerCase().includes(documentSearch.toLowerCase());
        const matchesStatus = documentStatus === 'All' || doc.status === documentStatus;
        // Employees only see their own documents
        if (user.role === 'employee') {
            return matchesSearch && matchesStatus && doc.employee_id === user.id;
        }
        // HR and super_admin see all
        return matchesSearch && matchesStatus;
    });

    // Mock download handler
    const handleDownload = (doc: typeof mockDocuments[0]) => {
        toast({ title: 'Download', description: `Pretend downloading: ${doc.name}` });
    };

    // Only allow delete for HR
    const canDelete = isHR;
    // Only allow edit/approve/reject for HR
    const canEdit = isHR;
    const canApproveReject = isHR;

    // Approve/Reject handlers (HR only)
    const handleStatusChange = (docId: number, status: 'Approved' | 'Rejected') => {
        if (!isHR) return;
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status } : d));
        toast({ title: `Document ${status}`, description: `Document has been ${status.toLowerCase()}.` });
    };

    return (
        <div className="space-y-6 p-4 sm:p-6 bg-background min-h-screen text-foreground font-inter">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Application Documents</h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">{isHR ? 'Manage, review, and organize all recruitment-related documents.' : 'Track the status of your uploaded application documents.'}</p>
                </div>
                {isHR && (
                    <Button className="bg-primary hover:bg-primary/80" onClick={() => setAddingDocument(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Document
                    </Button>
                )}
            </div>
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
                        {filteredDocuments.map(doc => (
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
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                    <Badge
                                        variant={doc.status === 'Approved' ? 'default' : doc.status === 'Rejected' ? 'destructive' : 'secondary'}
                                        className="flex-shrink-0"
                                    >
                                        {doc.status}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setShowDocumentModal(doc)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {canEdit && (
                                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => setEditingDocument(doc)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" className="border-border hover:bg-muted/50" onClick={() => handleDownload(doc)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        {canDelete && (
                                            <Button size="sm" variant="outline" className="border-border hover:bg-muted/50 text-red-500 hover:text-red-400" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {canApproveReject && doc.status === 'Pending' && (
                                            <>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => handleStatusChange(doc.id, 'Approved')}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 font-semibold" onClick={() => handleStatusChange(doc.id, 'Rejected')}>
                                                    <AlertCircle className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredDocuments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No documents found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {showDocumentModal && (
                <Dialog open={!!showDocumentModal} onOpenChange={() => setShowDocumentModal(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Document Details</DialogTitle>
                        </DialogHeader>
                        <div>
                            <p><strong>Name:</strong> {showDocumentModal.name}</p>
                            <p><strong>Employee:</strong> {mockUsers[showDocumentModal.employee_id]?.name || showDocumentModal.employee_id}</p>
                            <p><strong>Uploaded By:</strong> {mockUsers[showDocumentModal.uploaded_by]?.name || showDocumentModal.uploaded_by}</p>
                            <p><strong>Type:</strong> {showDocumentModal.type}</p>
                            <p><strong>Status:</strong> {showDocumentModal.status}</p>
                            <p><strong>Size:</strong> {showDocumentModal.size}</p>
                            <p><strong>Uploaded:</strong> {showDocumentModal.uploadDate}</p>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setShowDocumentModal(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {isHR && addingDocument && (
                <Dialog open={addingDocument} onOpenChange={setAddingDocument}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm
                            employees={employees}
                            uploaderId={user.id}
                            onCancel={() => setAddingDocument(false)}
                            onSave={doc => {
                                setDocuments(prev => [...prev, { ...doc, id: Date.now(), status: 'Pending', uploadDate: new Date().toISOString().slice(0, 10), uploaded_by: user.id }]);
                                setAddingDocument(false);
                                toast({ title: 'Document Added', description: 'Document has been added and is pending review.' });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
            {isHR && editingDocument && (
                <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Document</DialogTitle>
                        </DialogHeader>
                        <DocumentForm
                            doc={editingDocument}
                            employees={employees}
                            uploaderId={user.id}
                            onCancel={() => setEditingDocument(null)}
                            onSave={doc => {
                                setDocuments(prev => prev.map(d => d.id === editingDocument.id ? { ...d, ...doc } : d));
                                setEditingDocument(null);
                                toast({ title: 'Document Updated', description: 'Document details have been updated.' });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Documents;
