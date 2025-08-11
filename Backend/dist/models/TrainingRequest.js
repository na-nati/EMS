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
exports.TrainingRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TrainingRequestSchema = new mongoose_1.Schema({
    employee_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    training_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Training',
        required: true,
    },
    progress: {
        type: String,
        enum: ['Not Started', 'Ongoing', 'Completed'],
        default: 'Not Started',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: true,
    },
    requested_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Create a compound index to ensure one training request per employee per training
TrainingRequestSchema.index({ employee_id: 1, training_id: 1 }, { unique: true });
// Create indexes for efficient querying
TrainingRequestSchema.index({ status: 1, requested_at: -1 });
TrainingRequestSchema.index({ progress: 1 });
TrainingRequestSchema.index({ employee_id: 1, status: 1 });
// Auto-update progress based on training status
TrainingRequestSchema.pre('save', function (next) {
    // If training is completed, automatically update progress to completed
    if (this.status === 'Approved') {
        // This could be enhanced with logic to check training completion
        // For now, we'll keep the manual progress tracking
    }
    next();
});
exports.TrainingRequest = mongoose_1.default.model('TrainingRequest', TrainingRequestSchema);
//# sourceMappingURL=TrainingRequest.js.map