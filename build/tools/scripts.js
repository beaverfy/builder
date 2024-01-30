"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addScript = exports.checkScript = void 0;
const fs_1 = require("fs");
const constants_1 = require("../constants");
function checkScript() {
    const packageLocation = `${process.cwd()}/package.json`;
    const hasPackage = (0, fs_1.existsSync)(packageLocation);
    if (!hasPackage)
        return null;
    const content = (0, fs_1.readFileSync)(packageLocation, { encoding: "utf8" });
    return content.includes(constants_1.BUILD_COMMAND);
}
exports.checkScript = checkScript;
function addScript(log) {
    const packageLocation = `${process.cwd()}/package.json`;
    const content = (0, fs_1.readFileSync)(packageLocation, { encoding: "utf8" });
    const parsed = JSON.parse(content);
    const writeFile = () => (0, fs_1.writeFileSync)(packageLocation, JSON.stringify(parsed), {
        encoding: "utf8",
    });
    if ((parsed === null || parsed === void 0 ? void 0 : parsed.scripts) == null) {
        // no scripts defined
        parsed.scripts = {
            build: constants_1.BUILD_COMMAND,
        };
        writeFile();
        return {
            message: "Added the build script",
        };
    }
    else {
        if (typeof parsed.scripts != "object") {
            log.log(`Couldn't add script as "package.scripts" isn't an object`);
            return {
                message: '"package.scripts" isn\'t an object',
            };
        }
        if (Object.values(parsed.scripts).find((e) => e.includes(constants_1.BUILD_COMMAND))) {
            log.log(`Couldn't add script as "package.scripts" isn't an object`);
            return {
                message: "Already found a build script",
            };
        }
        else {
            parsed.scripts = Object.assign(Object.assign({}, parsed.scripts), { build: constants_1.BUILD_COMMAND });
            writeFile();
            return {
                message: "Added the build script",
            };
        }
    }
}
exports.addScript = addScript;
