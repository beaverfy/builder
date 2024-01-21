import { load as loadYAML } from "js-yaml";
import { Configuration } from "../types";
import { readFileSync } from "fs";
import { CONFIG_FILE } from "../constants";

export function getConfiguration() {
  const settingsFileContent = readFileSync(
    `${process.cwd()}/${CONFIG_FILE}`,
    "utf8"
  );

  return loadYAML(settingsFileContent, {
    json: true,
  }) as Configuration;
}
