import { existsSync, mkdirSync, renameSync } from "fs";
import path from "path";
import { Logger } from "./logger";
import { Configuration } from "../types";
import mv from "mv";

export function getBuildFromString(str: string) {
  // Define a regular expression to match APK or AAB file paths
  const regex = /build artifacts in (\S+\.(apk|aab))/;

  // Find all matches in the build output
  const matches = str.match(regex);

  // Check if there is a match
  if (matches && matches.length >= 2) {
    const filePath = matches[1]; // Use index 1 to get the first capturing group
    return filePath;
  } else {
    return null;
  }
}

export function getURLfromString(str: string) {
  // Define a regular expression to match APK or AAB file paths
  const regex = /https?:\/\/[^\s]+/g;

  // Find all matches in the build output
  const matches = str.match(regex);

  // Check if there is a match
  if (matches && matches.length >= 2) {
    const lastFilePath = matches[matches.length - 1];
    return lastFilePath;
  } else {
    return null;
  }
}

export function moveBuildToFolder(
  content: string,
  destFolder: string,
  log: Logger,
  forceCopy: boolean
) {
  const fileName = getBuildFromString(content);
  if (!fileName)
    return {
      moved: false,
      filePath: null,
    };
  const directoryExists = existsSync(destFolder);
  if (!directoryExists) mkdirSync(destFolder, { recursive: true });
  const filePath = path.join(
    destFolder,
    fileName.replace(destFolder, "").replace(process.cwd(), "")
  );
  log.log(`Moving file to ${filePath} (${fileName})`);
  if (forceCopy) {
    mv(fileName, filePath, {}, () => {});
  } else {
    renameSync(fileName, filePath);
  }
  return {
    moved: true,
    filePath,
  };
}

export function resolveDestinationFolder(settings: Configuration | null) {
  if (settings?.builds?.folder == null) return null;
  switch (typeof settings.builds.folder) {
    case "string":
      return settings.builds.folder;
    case "object":
      if (
        settings.builds.folder?.env != null &&
        process.env[settings.builds.folder.env] != null
      ) {
        return process.env[settings.builds.folder.env];
      } else {
        throw Error(
          `Builder Error: Couldn't find "${
            settings.builds.folder.env ?? "null"
          }" in the environment variables, try using dotenv-cli with this command`
        );
      }
    default:
      return null;
  }
}
