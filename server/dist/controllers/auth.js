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
exports.DeleteToken = exports.LoginByToken = exports.Login = exports.Register = exports.SendTokenResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const errorResponse_1 = require("../utils/errorResponse");
const User_1 = __importDefault(require("../models/User"));
const SendTokenResponse = (user, res, code) => __awaiter(void 0, void 0, void 0, function* () {
    const token = user.getSignJwt();
    res
        .status(code)
        .cookie("uid", token)
        .json({
        data: user,
        success: true,
        timestamp: Date.now(),
    });
});
exports.SendTokenResponse = SendTokenResponse;
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, profile } = req.body;
    console.log(profile, ":profile");
    if (!username || !password || !profile) {
        next(new errorResponse_1.ErrorResponse("Please provide credential", 400));
        return;
    }
    try {
        const user = yield User_1.default.create({ username, password, profile });
        (0, exports.SendTokenResponse)(user, res, 201);
    }
    catch (error) {
        next(new errorResponse_1.ErrorResponse(error.code, 500));
    }
});
exports.Register = Register;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        next(new errorResponse_1.ErrorResponse("Please provide credential", 400));
        return;
    }
    try {
        const user = yield User_1.default.findOne({ username }).select("+password");
        if (!user) {
            next(new errorResponse_1.ErrorResponse("Invalid Credential", 404));
            return;
        }
        console.log(password, ":password");
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            next(new errorResponse_1.ErrorResponse("Invalid Credential", 404));
            return;
        }
        (0, exports.SendTokenResponse)(user, res, 200);
    }
    catch (error) {
        console.log(error);
    }
});
exports.Login = Login;
const LoginByToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.cookies;
    if (!uid) {
        next(new errorResponse_1.ErrorResponse("Access denied", 400));
        return;
    }
    const decode = jsonwebtoken_1.default.verify(uid, process.env.JWT_SECRET);
    const user = yield User_1.default.findById(decode.id);
    if (!user) {
        next(new errorResponse_1.ErrorResponse("Access denied", 400));
        return;
    }
    res.status(200).json({ data: user, success: true, timestamp: Date.now() });
});
exports.LoginByToken = LoginByToken;
const DeleteToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.cookies;
    if (!uid) {
        next(new errorResponse_1.ErrorResponse("Access denied", 400));
        return;
    }
    res.cookie("uid", "").status(200).json({ data: "Logout", success: true, timestamp: Date.now() });
});
exports.DeleteToken = DeleteToken;
