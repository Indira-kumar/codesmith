import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
config();

console.log("key: ", process.env["ANTHROPIC_API_KEY"]);

const client = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const events = client.messages.stream({
  model: "claude-haiku-3-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Say I am the master 5 times" }],
  stream: true,
});

for await (const event of events) {
  console.log(event);
}
