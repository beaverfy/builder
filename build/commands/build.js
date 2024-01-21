"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_tools_1 = require("@react-native-community/cli-tools");
const child_process_1 = require("child_process");
const enquirer_1 = require("enquirer");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../tools/logger");
const folder_1 = require("../tools/folder");
const gitignore_1 = require("../tools/gitignore");
const settings_1 = require("../tools/settings");
const constants_1 = require("../constants");
const questions_1 = require("../tools/questions");
const typecheck_1 = require("../tools/typecheck");
async function Build() {
    var _a, _b, _c, _d, _e, _f;
    const Loader = (0, cli_tools_1.getLoader)();
    const logStream = new logger_1.Logger();
    const settings = (0, settings_1.getConfiguration)();
    const isInGitIgnore = (0, gitignore_1.checkGitIgnore)();
    logStream.log(`Reading configuration: ${JSON.stringify(settings)}\n`);
    const easPath = typeof ((_a = settings === null || settings === void 0 ? void 0 : settings.eas) === null || _a === void 0 ? void 0 : _a.file) == "string"
        ? (_b = settings === null || settings === void 0 ? void 0 : settings.eas) === null || _b === void 0 ? void 0 : _b.file
        : path_1.default.join(__dirname, "eas.json").replace("builder/build/", "");
    const easFile = (await (0, promises_1.readFile)(easPath, { encoding: "utf-8" }).then((content) => JSON.parse(content)));
    const defaultDestFolder = path_1.default.join(process.cwd(), constants_1.BUILD_FOLDER);
    const resolvedPath = (0, folder_1.resolveDestinationFolder)(settings);
    if (resolvedPath == null)
        logStream.log(`resolvedPath from "settings.builds" is null, falling back to default (builder/builds), make sure the path is correct`);
    const destFolder = ((_c = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _c === void 0 ? void 0 : _c.folder) != null && typeof resolvedPath == "string"
        ? path_1.default.join(typeof ((_d = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _d === void 0 ? void 0 : _d.baseFolder) == "string"
            ? settings.builds.baseFolder
            : process.cwd(), resolvedPath)
        : defaultDestFolder;
    logStream.log(`Builds will be moved to: ${destFolder}`);
    const buildProfiles = Object.keys(easFile.build).map((e) => [
        e.slice(0, 1).toUpperCase() + e.slice(1, e.length),
        e,
    ]);
    if (!isInGitIgnore) {
        const gitignore = (await (0, enquirer_1.prompt)({
            message: '"/builder" isn\'t in the .gitignore, would you like to add it?',
            name: "autofix",
            type: "confirm",
        })).autofix;
        if (gitignore == true) {
            try {
                (0, gitignore_1.autoFixGitIgnore)();
            }
            catch (err) {
                logStream.log(`Couldn't fix .gitignore: ${err}`);
            }
        }
    }
    let buildOptions = {
        //@ts-expect-error will be defined later
        platform: null,
        //@ts-expect-error will be defined later
        profile: null,
        //@ts-expect-error will be defined later
        type: null,
    };
    if ((settings === null || settings === void 0 ? void 0 : settings.default) != null && typeof settings.default == "object") {
        const useDefaults = (await (0, enquirer_1.prompt)({
            message: "Would you like to use your default configuration?",
            name: "defaults",
            type: "confirm",
        })).defaults;
        if (useDefaults) {
            if (!buildProfiles.map((e) => e[1]).includes(settings.default.profile))
                return console.error(`\`default.profile\` (${settings.default.profile}) is not a valid profile (not in eas.json)`);
            buildOptions = settings.default;
        }
        else {
            const results = await (0, questions_1.askQuestions)(logStream, buildProfiles);
            buildOptions = results;
        }
    }
    else {
        const results = await (0, questions_1.askQuestions)(logStream, buildProfiles);
        buildOptions = results;
    }
    if (((_e = settings === null || settings === void 0 ? void 0 : settings.checks) === null || _e === void 0 ? void 0 : _e.typecheck) == true) {
        await (0, typecheck_1.runTypecheck)(settings, logStream);
    }
    Loader.start(buildOptions.type == "local"
        ? `We're building your ${buildOptions.platform == "android"
            ? "android "
            : buildOptions.platform == "ios"
                ? "iOS "
                : ""}app ${buildOptions.type == "local" ? "on your PC" : "on the cloud"}`
        : `We're compressing and uploading your ${buildOptions.platform == "android"
            ? "android "
            : buildOptions.platform == "ios"
                ? "iOS "
                : ""}app to EAS build`);
    //@ts-expect-error it's never ever
    const selectedProfile = buildProfiles.find((e) => e[1] === buildOptions.profile)[1];
    const command = `npx eas build --non-interactive --profile=${selectedProfile} --platform=${buildOptions.platform} ${buildOptions.type == "local" ? "--local" : "--no-wait"}`;
    const buildArgs = command.split(" ");
    const buildProcess = (0, child_process_1.spawn)(buildArgs[0], buildArgs.slice(1));
    (_f = buildProcess.stdout) === null || _f === void 0 ? void 0 : _f.on("data", (data) => {
        const output = data.toString();
        logStream.log(output); // Write to log file
        if (output.includes("START_BUILD")) {
            Loader.start("Starting build");
        }
        else if (output.includes("INSTALL_DEPENDENCIES")) {
            Loader.start("Installing dependencies");
        }
        else if (output.includes("RUN_EXPO_DOCTOR")) {
            Loader.start("Running Expo Doctor");
        }
        else if (output.includes("PREBUILD")) {
            Loader.start("Prebuilding");
        }
        else if (output.includes("RUN_GRADLEW")) {
            Loader.start("Building app with gradle");
        }
    });
    buildProcess.on("exit", (code, signal) => {
        var _a;
        if (code === 0) {
            Loader.start(`Moving file to ${destFolder}`);
            if ((0, folder_1.getBuildFromString)(logStream.getData()) != null) {
                const result = (0, folder_1.moveBuildToFolder)(logStream.getData(), destFolder, logStream, typeof ((_a = settings === null || settings === void 0 ? void 0 : settings.builds) === null || _a === void 0 ? void 0 : _a.forceCopy) == "boolean"
                    ? settings.builds.forceCopy
                    : false);
                if (result.moved == true) {
                    Loader.succeed(`Build completed successfully! File moved to ${result.filePath}`);
                }
                else {
                    Loader.fail(`Failed to move build to ${destFolder}`);
                }
            }
            else {
                if ((0, folder_1.getURLfromString)(logStream.getData()) != null) {
                    const url = (0, folder_1.getURLfromString)(logStream.getData());
                    Loader.succeed(`Build uploaded successfully! You can view your build here: ${url}`);
                }
                else {
                    Loader.fail(`Couldn't find a URL to view or a file to move`);
                }
            }
        }
        else {
            Loader.fail(`Build failed, check the logs for more details: ${logStream.fileName}`);
            logStream.log(`✖ Process ended with signal ${signal} and code ${code}, you can try building the app yourself with \`${command}\``);
        }
    });
    buildProcess.on("error", (err) => {
        logStream.log(`✖ Process ended with error: ${err}, you can try building the app yourself with \`${command}\``);
        Loader.fail(`Couldn't start build, check the logs for more details: ${logStream.fileName}`);
    });
}
exports.default = Build;
