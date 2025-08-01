"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AssetSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    serial_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
    },
    assigned_to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    assigned_at: {
        type: Date,
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Damaged', 'Lost', 'Under Maintenance'],
        default: 'New',
        required: true,
    },
}, {
    timestamps: true,
});
// Create indexes for efficient querying
AssetSchema.index({ assigned_to: 1 });
AssetSchema.index({ condition: 1 });
AssetSchema.index({ serial_number: 1 });
// Auto-update assigned_at when asset is assigned
AssetSchema.pre('save', function (next) {
    if (this.assigned_to && !this.assigned_at) {
        this.assigned_at = new Date();
    }
    // If asset is unassigned, clear assigned_at
    if (!this.assigned_to) {
        this.assigned_at = undefined;
    }
    next();
});
// Validate that assigned_at is set when asset is assigned
AssetSchema.pre('save', function (next) {
    if (this.assigned_to && !this.assigned_at) {
        next(new Error('Assigned date must be set when asset is assigned to an employee'));
    }
    next();
});
exports.Asset = mongoose_1.default.model('Asset', AssetSchema);
