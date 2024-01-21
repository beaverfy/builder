import {
  mkdirSync,
  existsSync,
  createWriteStream as fsCreateWriteStream,
} from "fs";
import { LOG_FOLDER } from "../constants";

export function createWriteStream() {
  const logDirectory = `${process.cwd()}/${LOG_FOLDER}`;
  const logFilePath = `${logDirectory}/build-${Date.now()}.txt`;
  // Ensure the log directory exists
  const dirInfo = existsSync(logDirectory);
  if (!dirInfo) mkdirSync(logDirectory, { recursive: true });
  return {
    stream: fsCreateWriteStream(logFilePath, { flags: "a" }),
    fileName: logFilePath,
  };
}

export class Logger {
  public stream = createWriteStream();
  public data = "";

  log(message: string) {
    this.data = this.data + message;
    return this.stream.stream.write(message);
  }

  getData() {
    return this.data;
  }

  get fileName() {
    return this.stream.fileName;
  }
}
