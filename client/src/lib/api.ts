const API_BASE = "/api";

async function request(method: string, path: string, body?: any, contentType?: string) {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (contentType) headers["Content-Type"] = contentType;
  else if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err: any = new Error(data?.detail || data?.error || "Request failed");
    err.status = res.status;
    err.response = { data };
    throw err;
  }

  return data;
}

export const cabinApi = {
  login: async (username: string, password: string) => {
    const data = await request("POST", "/token", { username, password });
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    return data;
  },
  logout: async () => {
    await request("POST", "/logout");
    localStorage.removeItem("access_token");
  },

  getBatteryStatus: () => request("GET", "/battery/status"),
  getHeaterStatus: () => request("GET", "/heater/status"),
  getHeaterStatusFresh: () => request("GET", "/heater/status?fresh=1"),
  toggleHeater: () => request("POST", "/heater/toggle"),
  setHeaterMode: () => request("POST", "/heater/mode"),
  adjustHeaterTemp: (action: "up" | "down") => request("POST", `/heater/temperature?action=${action}`),
  adjustHeaterPower: (action: "up" | "down") => request("POST", `/heater/power-level?action=${action}`),
  getMpptStatus: () => request("GET", "/mppt/status"),
  getTemperatureStatus: () => request("GET", "/temperature/status"),
  getOutdoorTemperatureStatus: () => request("GET", "/temperature/outdoor"),
};
