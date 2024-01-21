import { prompt } from "enquirer";
import Build from "./commands/build";
import { runCleaner } from "./tools/cleaner";

export async function CommandPicker() {
  const args = process.argv.slice(2);
  if (args.length >= 1) {
    if (args[0] == "build") {
      return Build();
    } else if (args[0] == "clean") {
      return runCleaner();
    }
  }

  const command = (
    (await prompt({
      name: "command",
      message: "What command do you want to do?",
      type: "select",
      choices: [
        {
          name: "Builder",
          value: "build",
          hint: "Build your app",
        },
        {
          name: "Cleaner",
          value: "cleaner",
          hint: "Clean logs and builds",
        },
      ],
    })) as { command: "Cleaner" | "Builder" }
  ).command;

  if (command == "Builder") {
    Build();
  } else {
    runCleaner();
  }
}

CommandPicker();
