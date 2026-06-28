import { OpenAI } from "openai";

export class OllamaProvider {
  private client: OpenAI;
  private model: string;

  constructor(model: string) {
    this.client = new OpenAI({
      apiKey: "ollama",
      baseURL: "http://localhost:11434/v1",
    });
    this.model = model;
  }
  async *stream(messages, tools) {
    const response = this.client.chat.completions.create({
      model: this.model,
      messages,
      tools,
      stream: true,
    });
    for await (const chunk of response) {
      yield chunk;
    }
  }
}
