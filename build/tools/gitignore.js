"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoFixGitIgnore = exports.checkGitIgnore = void 0;
const fs_1 = require("fs");
const constants_1 = require("../constants");
function checkGitIgnore() {
    const content = (0, fs_1.readFileSync)(`${process.cwd()}/.gitignore`);
    return content.includes(constants_1.BASE_FOLDER);
}
exports.checkGitIgnore = checkGitIgnore;
function autoFixGitIgnore() {
    const file = `${process.cwd()}/.gitignore`;
    const existingContent = (0, fs_1.readFileSync)(file);
    return (0, fs_1.writeFileSync)(file, existingContent + `\n\n# @beaverfy/builder logs and builds\n/builder`);
}
exports.autoFixGitIgnore = autoFixGitIgnore;
