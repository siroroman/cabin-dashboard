import type { Express } from "express";
import { createServer, type Server } from "http";

const CABIN_API_URL = "https://coletta-undelusory-decennially.ngrok-free.dev";

const responseCache = new Map<string, any>();

async function proxyRequest(
  method: string,
  path: string,
  token?: string,
  body?: any,
  contentType?: string,
  skipCache?: boolean
) {
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (contentType) headers["Content-Type"] = contentType;
  else if (body && typeof body === "string") headers["Content-Type"] = "application/x-www-form-urlencoded";
  else if (body) headers["Content-Type"] = "application/json";
  if (skipCache) {
    headers["Cache-Control"] = "no-cache";
    headers["Pragma"] = "no-cache";
  }

  const res = await fetch(`${CABIN_API_URL}${path}`, {
    method,
    headers,
    body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 304) {
    if (skipCache) {
      return { status: 200, data: null };
    }
    const cached = responseCache.get(path);
    if (cached) {
      return { status: 200, data: cached };
    }
    return { status: 200, data: null };
  }

  const data = await res.json().catch(() => null);

  if (res.ok && data != null && method === "GET") {
    if (data.error) {
      if (!skipCache) {
        const cached = responseCache.get(path);
        if (cached) {
          return { status: 200, data: cached };
        }
      }
    } else {
      responseCache.set(path, data);
    }
  }

  return { status: res.status, data };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/token", async (req, res) => {
    try {
      const { username, password } = req.body;
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const result = await proxyRequest("POST", "/token", undefined, params.toString(), "application/x-www-form-urlencoded");
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/logout", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await proxyRequest("POST", "/logout", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/battery/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await proxyRequest("GET", "/battery/status", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/heater/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const fresh = req.query.fresh === "1";
      if (fresh) {
        responseCache.delete("/heater/status");
      }
      const result = await proxyRequest("GET", "/heater/status", token, undefined, undefined, fresh);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/heater/toggle", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      responseCache.delete("/heater/status");
      const result = await proxyRequest("POST", "/heater/toggle", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/heater/mode", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await proxyRequest("POST", "/heater/mode", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/heater/temperature", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const action = req.query.action as string;
      const result = await proxyRequest("POST", `/heater/temperature?action=${action}`, token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/heater/power-level", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      responseCache.delete("/heater/status");
      const action = req.query.action as string;
      const result = await proxyRequest("POST", `/heater/power-level?action=${action}`, token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mppt/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await proxyRequest("GET", "/mppt/status", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/temperature/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await proxyRequest("GET", "/temperature/status", token);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return httpServer;
}
