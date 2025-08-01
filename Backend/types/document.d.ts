import { ObjectId } from 'mongoose';

export interface IDocument {
  employee_id: ObjectId;
  doc_type: string;
  file_url: string;
  uploaded_by: ObjectId;
  uploaded_at: Date;
  status: 'Approved' | 'Pending' | 'Rejected';
} 