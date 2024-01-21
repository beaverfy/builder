"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPicker = void 0;
const enquirer_1 = require("enquirer");
const build_1 = __importDefault(require("./commands/build"));
const cleaner_1 = require("./tools/cleaner");
async function CommandPicker() {
    const args = process.argv.slice(2);
    if (args.length >= 1) {
        if (args[0] == "build") {
            return (0, build_1.default)();
        }
        else if (args[0] == "clean") {
            return (0, cleaner_1.runCleaner)();
        }
    }
    const command = (await (0, enquirer_1.prompt)({
        name: "command",
        message: "What command do you want to do?",
        type: "select",
        choices: [
            {
                name: "Builder",
                value: "build",
                hint: "Build your app",
            },
            {
                name: "Cleaner",
                value: "cleaner",
                hint: "Clean logs and builds",
            },
        ],
    })).command;
    if (command == "Builder") {
        (0, build_1.default)();
    }
    else {
        (0, cleaner_1.runCleaner)();
    }
}
exports.CommandPicker = CommandPicker;
CommandPicker();
