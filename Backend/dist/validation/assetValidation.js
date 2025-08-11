"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAssetSchema = exports.updateAssetSchema = exports.createAssetSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAssetSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(2).max(100),
    serial_number: joi_1.default.string().required().min(3).max(50),
    type: joi_1.default.string().required().valid('laptop', 'desktop', 'mobile', 'tablet', 'other'),
    condition: joi_1.default.string().required().valid('excellent', 'good', 'fair', 'poor'),
    purchase_date: joi_1.default.date().required(),
    warranty_expiry: joi_1.default.date().optional(),
    assigned_to: joi_1.default.string().optional(),
    location: joi_1.default.string().optional(),
    notes: joi_1.default.string().optional().max(500)
});
exports.updateAssetSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100),
    serial_number: joi_1.default.string().min(3).max(50),
    type: joi_1.default.string().valid('laptop', 'desktop', 'mobile', 'tablet', 'other'),
    condition: joi_1.default.string().valid('excellent', 'good', 'fair', 'poor'),
    purchase_date: joi_1.default.date(),
    warranty_expiry: joi_1.default.date(),
    assigned_to: joi_1.default.string().optional(),
    location: joi_1.default.string(),
    notes: joi_1.default.string().max(500)
});
exports.assignAssetSchema = joi_1.default.object({
    assigned_to: joi_1.default.string().required()
});
//# sourceMappingURL=assetValidation.js.map