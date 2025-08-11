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
exports.Salary = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SalarySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
        min: 0,
    },
    bonus: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    deductions: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    netSalary: {
        type: Number,
        required: false,
        min: 0,
    },
    month: {
        type: String,
        required: true,
        maxlength: 20,
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: 2100,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'processing'],
        default: 'pending',
    },
    department: {
        type: String,
        required: true,
        maxlength: 100,
    },
}, {
    timestamps: true,
});
// Auto-calculate net salary
SalarySchema.pre('save', function (next) {
    this.netSalary = this.basicSalary + this.bonus - this.deductions;
    next();
});
// Create indexes for efficient querying
SalarySchema.index({ user: 1, month: 1, year: 1 });
SalarySchema.index({ department: 1 });
SalarySchema.index({ status: 1 });
exports.Salary = mongoose_1.default.model('Salary', SalarySchema);
//# sourceMappingURL=Salary.js.map