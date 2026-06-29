import { exec } from "node:child_process";
import { promisify } from "node:util";
import { split } from "shlex";
const execAsync = promisify(exec);
const ALLOWED_COMMANDS = new Set([
  "ls",
  "cat",
  "echo",
  "pwd",
  "grep",
  "find",
  "wc",
  "head",
  "tail",
]);
const SHELL_OPERATORS = new Set(["&&", "||", "|", ";", "&", ">", "<", ">>"]);

export const bashTool = async (args: string) => {
  if (!isValidCommand(args)) return "Invalid Command";
  const { stdout } = await execAsync(args);
  return JSON.stringify(stdout);
};

const isValidCommand = (args: string): boolean => {
  let tokens: string[];
  try {
    tokens = split(args);
  } catch {
    return false;
  }

  if (!ALLOWED_COMMANDS.has(tokens[0])) return false;
  if (SHELL_OPERATORS.intersection(new Set(tokens.slice(1))).size > 0)
    return false;
  return true;
};
