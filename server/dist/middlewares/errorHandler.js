"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorHandler = (err, req, res, next) => {
    const code = err.statusCode;
    let msg = err.message;
    if (err.message === "11000") {
        msg = "Can't use duplicate credentails";
    }
    res.status(code).json({ data: msg, success: false, timestamp: Date.now() });
};
exports.ErrorHandler = ErrorHandler;
