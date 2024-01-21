"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCleaner = void 0;
const promises_1 = require("fs/promises");
const constants_1 = require("../constants");
const cli_tools_1 = require("@react-native-community/cli-tools");
const enquirer_1 = require("enquirer");
const settings_1 = require("./settings");
const folder_1 = require("./folder");
const path_1 = __importDefault(require("path"));
async function runCleaner() {
    var _a, _b;
    const settings = (0, settings_1.getConfiguration)();
    const logDirectory = `${process.cwd()}/${constants_1.LOG_FOLDER}`;
    const defaultBuildDir = path_1.default.join(process.cwd(), constants_1.BUILD_FOLDER);
    const resolvedPath = (0, folder_1.resolveDestinationFolder)(settings);
    const buildDir = ((_a = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _a === void 0 ? void 0 : _a.folder) != null && typeof resolvedPath == "string"
        ? path_1.default.join(typeof ((_b = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _b === void 0 ? void 0 : _b.baseFolder) == "string"
            ? settings.builds.baseFolder
            : process.cwd(), resolvedPath)
        : defaultBuildDir;
    const shouldCleanLogs = (await (0, enquirer_1.prompt)({
        type: "confirm",
        message: "Clean logs?",
        name: "logs",
    })).logs;
    if (shouldCleanLogs) {
        const logLoader = (0, cli_tools_1.getLoader)();
        logLoader.start("Cleaning logs...");
        try {
            await (0, promises_1.rm)(logDirectory, { recursive: true });
            logLoader.succeed("Cleaned logs");
        }
        catch (err) {
            logLoader.succeed("Logs already clean");
        }
    }
    const shouldCleanBuilds = (await (0, enquirer_1.prompt)({
        type: "confirm",
        message: `Clean builds? (${resolvedPath})`,
        name: "builds",
    })).builds;
    if (shouldCleanBuilds) {
        const buildLoader = (0, cli_tools_1.getLoader)();
        buildLoader.start("Cleaning builds...");
        try {
            await (0, promises_1.rm)(buildDir, { recursive: true });
            buildLoader.succeed("Cleaned builds");
        }
        catch (err) {
            buildLoader.succeed("Builds already clean");
        }
    }
}
exports.runCleaner = runCleaner;
