import { existsSync, readFileSync, writeFileSync } from "fs";
import { BUILD_COMMAND } from "../constants";
import { Logger } from "./logger";

export function checkScript() {
  const packageLocation = `${process.cwd()}/package.json`;
  const hasPackage = existsSync(packageLocation);
  if (!hasPackage) return null;
  const content = readFileSync(packageLocation, { encoding: "utf8" });
  return content.includes(BUILD_COMMAND);
}

export function addScript(log: Logger) {
  const packageLocation = `${process.cwd()}/package.json`;
  const content = readFileSync(packageLocation, { encoding: "utf8" });
  const parsed = JSON.parse(content);
  const writeFile = () =>
    writeFileSync(packageLocation, JSON.stringify(parsed), {
      encoding: "utf8",
    });
  if (parsed?.scripts == null) {
    // no scripts defined
    parsed.scripts = {
      build: BUILD_COMMAND,
    };

    writeFile();
    return {
      message: "Added the build script",
    };
  } else {
    if (typeof parsed.scripts != "object") {
      log.log(`Couldn't add script as "package.scripts" isn't an object`);
      return {
        message: '"package.scripts" isn\'t an object',
      };
    }

    if (
      Object.values(parsed.scripts as Record<string, string>).find(
        (e: string) => e.includes(BUILD_COMMAND)
      )
    ) {
      log.log(`Couldn't add script as "package.scripts" isn't an object`);
      return {
        message: "Already found a build script",
      };
    } else {
      parsed.scripts = {
        ...parsed.scripts,
        build: BUILD_COMMAND,
      };

      writeFile();
      return {
        message: "Added the build script",
      };
    }
  }
}
