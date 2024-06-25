"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, code) {
        super(message);
        this.statusCode = code;
    }
}
exports.ErrorResponse = ErrorResponse;
