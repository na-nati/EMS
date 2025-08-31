import mongoose, { Document } from 'mongoose';
export interface ICompany extends Document {
    name: string;
    domain?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    isActive: boolean;
}
export declare const Company: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}, {}> & ICompany & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Company.d.ts.map