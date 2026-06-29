import { readFile } from "node:fs";
import { promisify } from "node:util";

const readFileAsync = promisify(readFile);

export const read = async (path: string) => {
  if (!isValidPath(path)) return "Invalid path";
  const content = await readFileAsync(path);
  return JSON.stringify(content);
};

const isValidPath = (path: string): boolean => {
  return true;
};
