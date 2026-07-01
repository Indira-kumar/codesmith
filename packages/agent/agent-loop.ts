import { toolsList } from "../coding-agent/tools/all.ts";
import { type ToolFunctionMap } from "../coding-agent/types.ts";

export async function runAgentLoop(
  messages,
  provider,
  toolsMap: ToolFunctionMap,
) {
  while (true) {
    let { content, reasoning, toolCalls } = await provider.stream(
      messages,
      toolsList,
    );
    if (toolCalls.size == 0) return content;

    for (const tc of toolCalls.values()) {
      const args = JSON.parse(tc.args);
      const result = await executeTool(tc.name, args, toolsMap);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }
  }
}

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  toolsMap: ToolFunctionMap,
) {
  if (!toolsMap[name]) throw new Error(`Unknown tool: ${name}`);
  const func = toolsMap[name];
  return func(args);
}
