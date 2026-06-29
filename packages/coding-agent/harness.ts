import { OllamaProvider } from "../ai/ollama-provider.ts";
import { get_weather } from "./tools/weather.ts";
import { bashTool } from "./tools/bash.ts";
import { type ToolFunctionMap } from "./types.ts";
import { runAgentLoop } from "../agent/agent-loop.ts";

const SYSTEM_PROMPT =
  "You are a helpful AI assistant, you will use the tool at your disposal, and help the user with their queries";

export const toolsMap: ToolFunctionMap = {
  get_weather: (args: Record<string, unknown>) => {
    const { latitude, longitude } = args;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("get_weather requires numeric latitude and longitude");
    }

    return get_weather(latitude, longitude);
  },
  bash: (argument: Record<string, unknown>) => {
    const { args } = argument;
    if (typeof args !== "string") {
      throw new Error("bash requires string args");
    }
    return bashTool(args);
  },
};

const provider = new OllamaProvider("glm-4.7-flash");

const messages: Record<string, unknown>[] = [
  { role: "system", content: SYSTEM_PROMPT },
];

async function main() {
  messages.push({
    role: "user",
    content: "List the files in the current folder",
  });
  const result = await runAgentLoop(messages, provider, toolsMap);
  console.log(result);
}

main();
