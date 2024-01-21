"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.createWriteStream = void 0;
const fs_1 = require("fs");
const constants_1 = require("../constants");
function createWriteStream() {
    const logDirectory = `${process.cwd()}/${constants_1.LOG_FOLDER}`;
    const logFilePath = `${logDirectory}/build-${Date.now()}.txt`;
    // Ensure the log directory exists
    const dirInfo = (0, fs_1.existsSync)(logDirectory);
    if (!dirInfo)
        (0, fs_1.mkdirSync)(logDirectory, { recursive: true });
    return {
        stream: (0, fs_1.createWriteStream)(logFilePath, { flags: "a" }),
        fileName: logFilePath,
    };
}
exports.createWriteStream = createWriteStream;
class Logger {
    constructor() {
        this.stream = createWriteStream();
        this.data = "";
    }
    log(message) {
        this.data = this.data + message;
        return this.stream.stream.write(message);
    }
    getData() {
        return this.data;
    }
    get fileName() {
        return this.stream.fileName;
    }
}
exports.Logger = Logger;
