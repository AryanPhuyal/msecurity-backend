"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var PORT = process.env.PORT;
var JWT_SECRET = process.env.JWT_SECRET;
exports.default = {
    PORT: PORT,
    JWT_SECRET: JWT_SECRET,
};
//# sourceMappingURL=dotenv.js.map