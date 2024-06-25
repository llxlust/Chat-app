"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post("/register", auth_1.Register);
router.post("/login", auth_1.Login);
router.post("/loginByToken", auth_1.LoginByToken);
router.delete("/logout", auth_1.DeleteToken);
exports.default = router;
