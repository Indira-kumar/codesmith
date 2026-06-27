import { OpenAI } from "openai";
import axios from "axios";

const client = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

const axios_client = axios.create();
const get_weather = async (latitude: number, longitude: number) => {
  const response = await axios_client.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`,
  );
  return response;
};

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get current temperature for provided coordinates in celsius.",
      parameters: {
        type: "object",
        properties: {
          latitude: { type: "number" },
          longitude: { type: "number" },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: "glm-4.7-flash",
  messages: [{ role: "user", content: "what is the temperature in paris" }],
  tools,
  stream: true,
});

for await (const event of response) {
  const delta = event.choices[0].delta;
  if (delta.content) process.stdout.write(delta.content);
  if (
    delta.tool_calls &&
    delta.tool_calls[0]?.function?.name == "get_weather" &&
    delta.tool_calls[0]?.function?.arguments
  ) {
    const args = JSON.parse(delta.tool_calls[0]?.function?.arguments);
    const response = await get_weather(args.latitude, args.longitude);
    console.log(response.data);
  }
}
