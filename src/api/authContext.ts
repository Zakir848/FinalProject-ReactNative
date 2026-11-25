import axios from "axios";
import { getToken } from "./authStorage";

export const client = axios.create({
  baseURL: "http://192.168.31.48:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
