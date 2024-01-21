import { rm } from "fs/promises";
import { BUILD_FOLDER, LOG_FOLDER } from "../constants";
import { getLoader } from "@react-native-community/cli-tools";
import { prompt } from "enquirer";
import { getConfiguration } from "./settings";
import { resolveDestinationFolder } from "./folder";
import path from "path";

export async function runCleaner() {
  const settings = getConfiguration();
  const logDirectory = `${process.cwd()}/${LOG_FOLDER}`;
  const defaultBuildDir = path.join(process.cwd(), BUILD_FOLDER);
  const resolvedPath = resolveDestinationFolder(settings);
  const buildDir =
    settings?.builds?.folder != null && typeof resolvedPath == "string"
      ? path.join(
          typeof settings?.builds?.baseFolder == "string"
            ? settings.builds.baseFolder
            : process.cwd(),
          resolvedPath
        )
      : defaultBuildDir;
  const shouldCleanLogs = (
    (await prompt({
      type: "confirm",
      message: "Clean logs?",
      name: "logs",
    })) as { logs: boolean }
  ).logs;

  if (shouldCleanLogs) {
    const logLoader = getLoader();
    logLoader.start("Cleaning logs...");
    try {
      await rm(logDirectory, { recursive: true });
      logLoader.succeed("Cleaned logs");
    } catch (err) {
      logLoader.succeed("Logs already clean");
    }
  }

  const shouldCleanBuilds = (
    (await prompt({
      type: "confirm",
      message: `Clean builds? (${resolvedPath})`,
      name: "builds",
    })) as { builds: boolean }
  ).builds;

  if (shouldCleanBuilds) {
    const buildLoader = getLoader();
    buildLoader.start("Cleaning builds...");
    try {
      await rm(buildDir, { recursive: true });
      buildLoader.succeed("Cleaned builds");
    } catch (err) {
      buildLoader.succeed("Builds already clean");
    }
  }
}
