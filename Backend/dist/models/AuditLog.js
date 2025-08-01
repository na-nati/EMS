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
exports.AuditLog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AuditLogSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    target_table: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        enum: [
            'User',
            'Employee',
            'Department',
            'LeaveRequest',
            'Payroll',
            'Salary',
            'Manager',
            'SeparationRequest',
            'Attendance',
            'PerformanceReview',
            'Document',
            'DocumentRequest',
            'Recruitment',
            'Training',
            'TrainingRequest',
            'Asset',
            'AuditLog'
        ],
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    details: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    ip_address: {
        type: String,
        trim: true,
        maxlength: 45, // IPv6 max length
    },
    user_agent: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, {
    timestamps: true,
});
// Create indexes for efficient querying and reporting
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ user_id: 1, timestamp: -1 });
AuditLogSchema.index({ target_table: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
// Compound index for comprehensive audit queries
AuditLogSchema.index({ user_id: 1, target_table: 1, timestamp: -1 });
// TTL index to automatically delete old audit logs (optional - uncomment if needed)
// AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
exports.AuditLog = mongoose_1.default.model('AuditLog', AuditLogSchema);
