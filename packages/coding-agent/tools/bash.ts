import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const bashTool = async (args: string) => {
  if (!isValidCommand(args)) return "Invalid Command";
  const { stdout } = await execAsync(args);
  return JSON.stringify(stdout);
};

const isValidCommand = (args: string): Boolean => {
  return true;
};
