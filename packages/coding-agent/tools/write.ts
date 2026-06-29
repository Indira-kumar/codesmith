import { writeFile } from "node:fs";
import { promisify } from "node:util";

const writeFileAsync = promisify(writeFile);

export const write = async (path: string, content: string) => {
  try {
    await writeFileAsync(path, content);
    return "write successfull";
  } catch {
    return "write failed";
  }
};
