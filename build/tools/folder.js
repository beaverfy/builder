"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDestinationFolder = exports.moveBuildToFolder = exports.getURLfromString = exports.getBuildFromString = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const mv_1 = __importDefault(require("mv"));
function getBuildFromString(str) {
    // Define a regular expression to match APK or AAB file paths
    const regex = /build artifacts in (\S+\.(apk|aab))/;
    // Find all matches in the build output
    const matches = str.match(regex);
    // Check if there is a match
    if (matches && matches.length >= 2) {
        const filePath = matches[1]; // Use index 1 to get the first capturing group
        return filePath;
    }
    else {
        return null;
    }
}
exports.getBuildFromString = getBuildFromString;
function getURLfromString(str) {
    // Define a regular expression to match APK or AAB file paths
    const regex = /https?:\/\/[^\s]+/g;
    // Find all matches in the build output
    const matches = str.match(regex);
    // Check if there is a match
    if (matches && matches.length >= 2) {
        const lastFilePath = matches[matches.length - 1];
        return lastFilePath;
    }
    else {
        return null;
    }
}
exports.getURLfromString = getURLfromString;
function moveBuildToFolder(content, destFolder, log, forceCopy) {
    const fileName = getBuildFromString(content);
    if (!fileName)
        return {
            moved: false,
            filePath: null,
        };
    const directoryExists = (0, fs_1.existsSync)(destFolder);
    if (!directoryExists)
        (0, fs_1.mkdirSync)(destFolder, { recursive: true });
    const filePath = path_1.default.join(destFolder, fileName.replace(destFolder, "").replace(process.cwd(), ""));
    log.log(`Moving file to ${filePath} (${fileName})`);
    if (forceCopy) {
        (0, mv_1.default)(fileName, filePath, {}, () => { });
    }
    else {
        (0, fs_1.renameSync)(fileName, filePath);
    }
    return {
        moved: true,
        filePath,
    };
}
exports.moveBuildToFolder = moveBuildToFolder;
function resolveDestinationFolder(settings) {
    var _a, _b, _c;
    if (((_a = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _a === void 0 ? void 0 : _a.folder) == null)
        return null;
    switch (typeof settings.builds.folder) {
        case "string":
            return settings.builds.folder;
        case "object":
            if (((_b = settings.builds.folder) === null || _b === void 0 ? void 0 : _b.env) != null &&
                process.env[settings.builds.folder.env] != null) {
                return process.env[settings.builds.folder.env];
            }
            else {
                throw Error(`Builder Error: Couldn't find "${(_c = settings.builds.folder.env) !== null && _c !== void 0 ? _c : "null"}" in the environment variables, try using dotenv-cli with this command`);
            }
        default:
            return null;
    }
}
exports.resolveDestinationFolder = resolveDestinationFolder;
