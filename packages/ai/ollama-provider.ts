import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class OllamaProvider {
  client: OpenAI;
  model: string;

  constructor(model: string) {
    // super(model);
    this.model = model;
    this.client = new OpenAI({
      apiKey: "ollama",
      baseURL: "http://localhost:11434/v1",
    });
  }

  async stream(messages: ChatCompletionMessageParam[], tools: any[]) {
    let reasoning = "";
    let content = "";
    const toolCalls = new Map<
      number,
      { id: string; name: string; args: string }
    >();

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      tools,
      stream: true,
    });

    for await (const chunk of response) {
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
    return { content: content, reasoning: reasoning, toolCalls: toolCalls };
  }
}
