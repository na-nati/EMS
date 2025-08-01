"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeIdForAssetSchema = exports.assetIdSchema = exports.assetAssignSchema = exports.assetFiltersSchema = exports.updateAssetSchema = exports.createAssetSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Create asset schema
exports.createAssetSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(200).trim(),
    serial_number: joi_1.default.string().required().max(100).trim(),
    assigned_to: joi_1.default.string().optional().hex().length(24),
    condition: joi_1.default.string().valid('New', 'Good', 'Fair', 'Damaged', 'Lost', 'Under Maintenance').default('New')
});
// Update asset schema
exports.updateAssetSchema = joi_1.default.object({
    name: joi_1.default.string().optional().max(200).trim(),
    serial_number: joi_1.default.string().optional().max(100).trim(),
    assigned_to: joi_1.default.string().optional().hex().length(24),
    condition: joi_1.default.string().valid('New', 'Good', 'Fair', 'Damaged', 'Lost', 'Under Maintenance')
});
// Asset filters schema
exports.assetFiltersSchema = joi_1.default.object({
    condition: joi_1.default.string().valid('New', 'Good', 'Fair', 'Damaged', 'Lost', 'Under Maintenance'),
    assigned: joi_1.default.string().valid('true', 'false'),
    page: joi_1.default.number().optional().integer().min(1),
    limit: joi_1.default.number().optional().integer().min(1).max(100)
});
// Asset assign schema
exports.assetAssignSchema = joi_1.default.object({
    assigned_to: joi_1.default.string().required().hex().length(24)
});
// Asset ID parameter schema
exports.assetIdSchema = joi_1.default.object({
    id: joi_1.default.string().required().hex().length(24)
});
// Employee ID parameter schema for asset queries
exports.employeeIdForAssetSchema = joi_1.default.object({
    employeeId: joi_1.default.string().required().hex().length(24)
});
