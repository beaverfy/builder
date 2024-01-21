"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestions = void 0;
const enquirer_1 = require("enquirer");
async function askQuestions(logStream, buildFlavors) {
    try {
        const prompts = (await (0, enquirer_1.prompt)([
            {
                message: "Which platform?",
                name: "platform",
                type: "select",
                choices: ["Android", "iOS", "All platforms"],
            },
            {
                message: "Where should we build your app?",
                name: "type",
                type: "select",
                choices: ["Local", "Cloud (EAS build)"],
            },
            {
                message: "Which build profile?",
                name: "profile",
                type: "select",
                choices: [...buildFlavors.map((e) => e[0])],
            },
        ]));
        logStream.log(`Platform selected: ${prompts.platform}\n` +
            `Build type selected: ${prompts.type}\n` +
            `Build flavor selected: ${prompts.profile} (avaiable flavors: ${buildFlavors})\n`);
        return {
            profile: prompts.profile.toLowerCase(),
            type: prompts.type == "Local" ? "local" : "cloud",
            platform: prompts.platform == "All platforms"
                ? "all"
                : prompts.platform == "Android"
                    ? "android"
                    : "ios",
        };
    }
    catch (err) {
        logStream.log(`Failed to ask questions, the user may have exited through CTRL + C: ${err}`);
        return process.exit(1);
    }
}
exports.askQuestions = askQuestions;
