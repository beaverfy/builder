import { readFileSync, writeFileSync } from "fs";
import { BASE_FOLDER } from "../constants";

export function checkGitIgnore() {
  const content = readFileSync(`${process.cwd()}/.gitignore`);
  return content.includes(BASE_FOLDER);
}

export function autoFixGitIgnore() {
  const file = `${process.cwd()}/.gitignore`;
  const existingContent = readFileSync(file);
  return writeFileSync(
    file,
    existingContent + `\n\n# @beaverfy/builder logs and builds\n/builder`
  );
}
