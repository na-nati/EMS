"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectdb = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.CONNECTION_STRING);
        console.log("MongoDB connected:", conn.connection.host, conn.connection.name);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectdb;
//# sourceMappingURL=dbconnection.js.map