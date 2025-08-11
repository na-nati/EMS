import mongoose, { Document } from 'mongoose';
export interface IAsset extends Document {
    name: string;
    serial_number: string;
    assigned_to?: mongoose.Schema.Types.ObjectId;
    assigned_at?: Date;
    condition: 'New' | 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Under Maintenance';
}
export declare const Asset: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}, {}> & IAsset & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Asset.d.ts.map