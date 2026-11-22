import axios from "axios";

export const client = axios.create({
  baseURL: "http://192.168.31.48:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
