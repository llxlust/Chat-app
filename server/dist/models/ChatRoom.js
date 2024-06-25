"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomSchema = exports.ChatRoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ChatRoomModel = 'ChatRoom';
exports.ChatRoomSchema = new mongoose_1.default.Schema({
    log: {
        type: [{ message: String, author: { username: String, id: String }, timestamp: Number }],
        default: []
    },
    member: {
        type: [{ username: String, id: String, profile: String }],
        required: [true, "room must have member"]
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model(exports.ChatRoomModel, exports.ChatRoomSchema);
