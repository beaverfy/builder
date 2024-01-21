import { getLoader } from "@react-native-community/cli-tools";
import { spawn } from "child_process";
import { prompt } from "enquirer";
import { readFile } from "fs/promises";
import path from "path";
import { Logger } from "../tools/logger";
import {
  getBuildFromString,
  getURLfromString,
  moveBuildToFolder,
  resolveDestinationFolder,
} from "../tools/folder";
import { autoFixGitIgnore, checkGitIgnore } from "../tools/gitignore";
import { getConfiguration } from "../tools/settings";
import { BUILD_FOLDER } from "../constants";
import { BuildConfiguration } from "../types";
import { askQuestions } from "../tools/questions";
import { runTypecheck } from "../tools/typecheck";

export default async function Build() {
  const Loader = getLoader();
  const logStream = new Logger();
  const settings = getConfiguration();
  const isInGitIgnore = checkGitIgnore();
  logStream.log(`Reading configuration: ${JSON.stringify(settings)}\n`);
  const easPath =
    typeof settings?.eas?.file == "string"
      ? settings?.eas?.file
      : path.join(__dirname, "eas.json").replace("builder/build/", "");
  const easFile = (await readFile(easPath, { encoding: "utf-8" }).then(
    (content) => JSON.parse(content)
  )) as {
    [key: string]: object;
  };

  const defaultDestFolder = path.join(process.cwd(), BUILD_FOLDER);
  const resolvedPath = resolveDestinationFolder(settings);
  if (resolvedPath == null)
    logStream.log(
      `resolvedPath from "settings.builds" is null, falling back to default (builder/builds), make sure the path is correct`
    );
  const destFolder =
    settings?.builds?.folder != null && typeof resolvedPath == "string"
      ? path.join(
          typeof settings?.builds?.baseFolder == "string"
            ? settings.builds.baseFolder
            : process.cwd(),
          resolvedPath
        )
      : defaultDestFolder;
  logStream.log(`Builds will be moved to: ${destFolder}`);

  const buildProfiles = Object.keys(easFile.build).map((e) => [
    e.slice(0, 1).toUpperCase() + e.slice(1, e.length),
    e,
  ]) as [string, string][];

  if (!isInGitIgnore) {
    const gitignore = (
      (await prompt({
        message:
          '"/builder" isn\'t in the .gitignore, would you like to add it?',
        name: "autofix",
        type: "confirm",
      })) as { autofix: boolean }
    ).autofix;

    if (gitignore == true) {
      try {
        autoFixGitIgnore();
      } catch (err) {
        logStream.log(`Couldn't fix .gitignore: ${err}`);
      }
    }
  }

  let buildOptions: BuildConfiguration = {
    //@ts-expect-error will be defined later
    platform: null,
    //@ts-expect-error will be defined later
    profile: null,
    //@ts-expect-error will be defined later
    type: null,
  };

  if (settings?.default != null && typeof settings.default == "object") {
    const useDefaults = (
      (await prompt({
        message: "Would you like to use your default configuration?",
        name: "defaults",
        type: "confirm",
      })) as { defaults: boolean }
    ).defaults;

    if (useDefaults) {
      if (!buildProfiles.map((e) => e[1]).includes(settings.default.profile))
        return console.error(
          `\`default.profile\` (${settings.default.profile}) is not a valid profile (not in eas.json)`
        );

      buildOptions = settings.default;
    } else {
      const results = await askQuestions(logStream, buildProfiles);
      buildOptions = results;
    }
  } else {
    const results = await askQuestions(logStream, buildProfiles);
    buildOptions = results;
  }

  if (settings?.checks?.typecheck == true) {
    await runTypecheck(settings, logStream);
  }

  Loader.start(
    buildOptions.type == "local"
      ? `We're building your ${
          buildOptions.platform == "android"
            ? "android "
            : buildOptions.platform == "ios"
            ? "iOS "
            : ""
        }app ${buildOptions.type == "local" ? "on your PC" : "on the cloud"}`
      : `We're compressing and uploading your ${
          buildOptions.platform == "android"
            ? "android "
            : buildOptions.platform == "ios"
            ? "iOS "
            : ""
        }app to EAS build`
  );

  //@ts-expect-error it's never ever
  const selectedProfile = buildProfiles.find(
    (e) => e[1] === buildOptions.profile
  )[1];
  const command = `npx eas build --non-interactive --profile=${selectedProfile} --platform=${
    buildOptions.platform
  } ${buildOptions.type == "local" ? "--local" : "--no-wait"}`;
  const buildArgs = command.split(" ");
  const buildProcess = spawn(buildArgs[0], buildArgs.slice(1));

  buildProcess.stdout?.on("data", (data) => {
    const output = data.toString() as string;
    logStream.log(output); // Write to log file
    if (output.includes("START_BUILD")) {
      Loader.start("Starting build");
    } else if (output.includes("INSTALL_DEPENDENCIES")) {
      Loader.start("Installing dependencies");
    } else if (output.includes("RUN_EXPO_DOCTOR")) {
      Loader.start("Running Expo Doctor");
    } else if (output.includes("PREBUILD")) {
      Loader.start("Prebuilding");
    } else if (output.includes("RUN_GRADLEW")) {
      Loader.start("Building app with gradle");
    }
  });

  buildProcess.on("exit", (code, signal) => {
    if (code === 0) {
      Loader.start(`Moving file to ${destFolder}`);
      if (getBuildFromString(logStream.getData()) != null) {
        const result = moveBuildToFolder(
          logStream.getData(),
          destFolder,
          logStream,
          typeof settings?.builds?.forceCopy == "boolean"
            ? settings.builds.forceCopy
            : false
        );
        if (result.moved == true) {
          Loader.succeed(
            `Build completed successfully! File moved to ${result.filePath}`
          );
        } else {
          Loader.fail(`Failed to move build to ${destFolder}`);
        }
      } else {
        if (getURLfromString(logStream.getData()) != null) {
          const url = getURLfromString(logStream.getData());
          Loader.succeed(
            `Build uploaded successfully! You can view your build here: ${url}`
          );
        } else {
          Loader.fail(`Couldn't find a URL to view or a file to move`);
        }
      }
    } else {
      Loader.fail(
        `Build failed, check the logs for more details: ${logStream.fileName}`
      );

      logStream.log(
        `✖ Process ended with signal ${signal} and code ${code}, you can try building the app yourself with \`${command}\``
      );
    }
  });

  buildProcess.on("error", (err) => {
    logStream.log(
      `✖ Process ended with error: ${err}, you can try building the app yourself with \`${command}\``
    );
    Loader.fail(
      `Couldn't start build, check the logs for more details: ${logStream.fileName}`
    );
  });
}
