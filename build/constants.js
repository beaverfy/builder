"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_COMMAND = exports.CONFIG_FILE = exports.LOG_FOLDER = exports.BUILD_FOLDER = exports.BASE_FOLDER = void 0;
exports.BASE_FOLDER = "builder";
exports.BUILD_FOLDER = `${exports.BASE_FOLDER}/builds`;
exports.LOG_FOLDER = `${exports.BASE_FOLDER}/logs`;
exports.CONFIG_FILE = "builder.yaml";
exports.BUILD_COMMAND = "npx build";
