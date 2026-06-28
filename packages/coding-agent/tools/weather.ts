import axios from "axios";

const axios_client = axios.create();
export const get_weather = async (latitude: number, longitude: number) => {
  const response = await axios_client.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`,
  );
  return response;
};
