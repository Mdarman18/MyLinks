import axios from "axios";
export const userUrl = axios.create({
  baseURL: "http://localhost:4400/api/user",
});
