import { get_weather } from "./weather";

export const toolsList = [
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
