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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const db_1 = __importDefault(require("./configs/db"));
const errorHandler_1 = require("./middlewares/errorHandler");
const constant_1 = require("./utils/constant");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const chatroom_1 = __importDefault(require("./routes/chatroom"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_1 = __importDefault(require("cookie"));
const errorResponse_1 = require("./utils/errorResponse");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || undefined;
if (!PORT) {
    process.exit(1);
}
void (0, db_1.default)();
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use((0, cors_1.default)(corsOption));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(`/api/${constant_1.Version.V1}/auth`, auth_1.default);
app.use(`/api/${constant_1.Version.V1}/chat`, chatroom_1.default);
app.use(`/api/${constant_1.Version.V1}/user`, user_1.default);
const server = app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
exports.io = new socket_io_1.Server(server, {
    cookie: true,
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
exports.io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieString = socket.handshake.headers.cookie;
    if (!cookieString) {
        next(new errorResponse_1.ErrorResponse("Not authorize", 403));
        return;
    }
    const cookies = cookie_1.default.parse(cookieString);
    const cookie = cookies.uid;
    if (!cookie) {
        next(new errorResponse_1.ErrorResponse("Not authorize", 403));
        return;
    }
    next();
})).on("connection", (socket) => {
    socket.on("join_room", (data) => {
        console.log("aaaa");
        console.log("join chat: " + data);
        socket.join(data);
    });
    //   socket.on("send_message",async (data:IData) => {
    //     console.log(data, ":send_message_data");
    //     socket
    //       .to(data.roomID)
    //       .emit("recive_message", {
    //         message: data.msg,
    //         from: { id: data.from.id, username: data.from.username },
    //       });
    //   });
});
app.use(errorHandler_1.ErrorHandler);
