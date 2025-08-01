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
exports.Recruitment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RecruitmentSchema = new mongoose_1.Schema({
    requested_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job_title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    requirements: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    openings: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    status: {
        type: String,
        enum: ['Draft', 'Posted', 'In Progress', 'Closed', 'Cancelled'],
        default: 'Draft',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Create indexes for efficient querying
RecruitmentSchema.index({ status: 1, created_at: -1 });
RecruitmentSchema.index({ requested_by: 1 });
RecruitmentSchema.index({ job_title: 1 });
// Validate that openings is a positive number
RecruitmentSchema.pre('save', function (next) {
    if (this.openings <= 0) {
        next(new Error('Number of openings must be greater than 0'));
    }
    next();
});
exports.Recruitment = mongoose_1.default.model('Recruitment', RecruitmentSchema);
