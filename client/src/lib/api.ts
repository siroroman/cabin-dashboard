import axios from "axios";

const API_BASE_URL = "https://coletta-undelusory-decennially.ngrok-free.dev";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cabinApi = {
  // Auth
  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    const response = await api.post("/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },
  logout: async () => {
    await api.post("/logout");
    localStorage.removeItem("access_token");
  },

  // Battery
  getBatteryStatus: async () => {
    const response = await api.get("/battery/status");
    return response.data;
  },

  // Heater
  getHeaterStatus: async () => {
    const response = await api.get("/heater/status");
    return response.data;
  },
  toggleHeater: async () => {
    const response = await api.post("/heater/toggle");
    return response.data;
  },
  setHeaterMode: async () => {
    const response = await api.post("/heater/mode");
    return response.data;
  },
  adjustHeaterTemp: async (action: "up" | "down") => {
    const response = await api.post(`/heater/temperature?action=${action}`);
    return response.data;
  },
  adjustHeaterPower: async (action: "up" | "down") => {
    const response = await api.post(`/heater/power-level?action=${action}`);
    return response.data;
  },

  // MPPT
  getMpptStatus: async () => {
    const response = await api.get("/mppt/status");
    return response.data;
  },

  // Temperature
  getTemperatureStatus: async () => {
    const response = await api.get("/temperature/status");
    return response.data;
  },
};
