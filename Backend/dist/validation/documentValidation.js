"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDocumentSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    doc_type: joi_1.default.string().required(),
    employee_id: joi_1.default.string().required(),
    file_url: joi_1.default.string().uri().required(),
});
