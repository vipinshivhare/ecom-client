import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const API = axios.create({
  baseURL: API_BASE_URL,
});

delete API.defaults.headers.common["Authorization"];

export default API;
