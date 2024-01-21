import { getLoader } from "@react-native-community/cli-tools";
import { Logger } from "./logger";
import { Configuration } from "../types";
import { spawn } from "child_process";

export function runTypecheck(settings: Configuration, logStream: Logger) {
  return new Promise<void>((resolve) => {
    const closeProcess =
      typeof settings?.checks?.continueOnFailure === "boolean"
        ? !settings?.checks?.continueOnFailure
        : true;
    const typecheckLoader = getLoader();
    const typecheckCommand =
      typeof settings?.checks?.typecheckCommand === "string"
        ? settings?.checks?.typecheckCommand
        : `npx tsc --noEmit`;

    typecheckLoader.start("Running typechecks");
    const typecheckArgs = typecheckCommand.split(" ");
    const typecheckProcess = spawn(typecheckArgs[0], typecheckArgs.slice(1));

    typecheckProcess.stdout?.on("data", (data) => {
      const output = data.toString() as string;
      logStream.log(output); // Write to log file
    });

    typecheckProcess.on("exit", (code, signal) => {
      if (code === 0) {
        typecheckLoader.succeed(`Typecheck succeeded`);
      } else {
        typecheckLoader.fail(
          `Typecheck failed, check the logs for more details: ${logStream.fileName}`
        );

        logStream.log(
          `✖ Typecheck ended with signal ${signal} and code ${code}, you can try typechecking the app yourself with \`${typecheckCommand}\`\n`
        );
        if (closeProcess) process.exit(0);
      }
      resolve();
    });

    typecheckProcess.on("error", (err) => {
      logStream.log(
        `✖ Typecheck ended with error: ${err}, you can try typechecking the app yourself with \`${typecheckCommand}\`\n`
      );
      typecheckLoader.fail(
        `Typecheck failed, check the logs for more details: ${logStream.fileName}`
      );

      if (closeProcess) process.exit(0);
      else resolve();
    });
  });
}
