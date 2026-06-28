import { toolsList } from "../coding-agent/tools/all.ts";
import { type ToolFunctionMap } from "../coding-agent/types.ts";

export async function runAgentLoop(
  messages,
  provider,
  toolsMap: ToolFunctionMap,
) {
  while (true) {
    let reasoning = "";
    let content = "";
    const toolCalls = new Map<
      number,
      { id: string; name: string; args: string }
    >();

    for await (const chunk of provider.stream(messages, toolsList)) {
      const delta = chunk.choices[0].delta;
      if (delta?.reasoning) reasoning += delta.reasoning;

      if (delta.content) content += delta.content;

      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          if (!toolCalls.has(tc.index))
            toolCalls.set(tc.index, { id: "", name: "", args: "" });

          const buff = toolCalls.get(tc.index)!;
          buff.id += tc.id ?? "";
          buff.name += tc.function?.name ?? "";
          buff.args += tc.function?.arguments ?? "";
        }
      }
    }

    messages.push({
      role: "assistant",
      content,
      tool_calls:
        toolCalls.size > 0
          ? [...toolCalls.values()].map((tc) => ({
              id: tc.id,
              type: "function",
              function: { name: tc.name, arguments: tc.args },
            }))
          : undefined,
    });

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
