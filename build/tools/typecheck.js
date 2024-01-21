"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTypecheck = void 0;
const cli_tools_1 = require("@react-native-community/cli-tools");
const child_process_1 = require("child_process");
function runTypecheck(settings, logStream) {
    return new Promise((resolve) => {
        var _a, _b, _c, _d, _e;
        const closeProcess = typeof ((_a = settings === null || settings === void 0 ? void 0 : settings.checks) === null || _a === void 0 ? void 0 : _a.continueOnFailure) === "boolean"
            ? !((_b = settings === null || settings === void 0 ? void 0 : settings.checks) === null || _b === void 0 ? void 0 : _b.continueOnFailure)
            : true;
        const typecheckLoader = (0, cli_tools_1.getLoader)();
        const typecheckCommand = typeof ((_c = settings === null || settings === void 0 ? void 0 : settings.checks) === null || _c === void 0 ? void 0 : _c.typecheckCommand) === "string"
            ? (_d = settings === null || settings === void 0 ? void 0 : settings.checks) === null || _d === void 0 ? void 0 : _d.typecheckCommand
            : `npx tsc --noEmit`;
        typecheckLoader.start("Running typechecks");
        const typecheckArgs = typecheckCommand.split(" ");
        const typecheckProcess = (0, child_process_1.spawn)(typecheckArgs[0], typecheckArgs.slice(1));
        (_e = typecheckProcess.stdout) === null || _e === void 0 ? void 0 : _e.on("data", (data) => {
            const output = data.toString();
            logStream.log(output); // Write to log file
        });
        typecheckProcess.on("exit", (code, signal) => {
            if (code === 0) {
                typecheckLoader.succeed(`Typecheck succeeded`);
            }
            else {
                typecheckLoader.fail(`Typecheck failed, check the logs for more details: ${logStream.fileName}`);
                logStream.log(`✖ Typecheck ended with signal ${signal} and code ${code}, you can try typechecking the app yourself with \`${typecheckCommand}\`\n`);
                if (closeProcess)
                    process.exit(0);
            }
            resolve();
        });
        typecheckProcess.on("error", (err) => {
            logStream.log(`✖ Typecheck ended with error: ${err}, you can try typechecking the app yourself with \`${typecheckCommand}\`\n`);
            typecheckLoader.fail(`Typecheck failed, check the logs for more details: ${logStream.fileName}`);
            if (closeProcess)
                process.exit(0);
            else
                resolve();
        });
    });
}
exports.runTypecheck = runTypecheck;
