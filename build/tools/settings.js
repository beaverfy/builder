"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = void 0;
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const constants_1 = require("../constants");
function getConfiguration() {
    const settingsFileContent = (0, fs_1.readFileSync)(`${process.cwd()}/${constants_1.CONFIG_FILE}`, "utf8");
    return (0, js_yaml_1.load)(settingsFileContent, {
        json: true,
    });
}
exports.getConfiguration = getConfiguration;
