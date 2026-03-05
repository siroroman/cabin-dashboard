# Smart Home Dashboard

## Overview
A modern, responsive web dashboard for monitoring and controlling a smart home system. Built with React + Express, connecting to an external cabin API via server-side proxy.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui components
- **Backend**: Express server acting as a proxy to the external cabin API
- **External API**: `https://coletta-undelusory-decennially.ngrok-free.dev`
- **No database needed** — all data comes from the external API

## Key Files
- `client/src/pages/Dashboard.tsx` — Main dashboard with 4 cards
- `client/src/pages/Login.tsx` — Login page with auth
- `client/src/lib/api.ts` — Frontend API client (calls `/api/*` routes)
- `client/src/components/dashboard/` — Card components (Temperature, Heater, Battery, Solar)
- `client/src/components/ThemeProvider.tsx` — Light/dark mode support
- `server/routes.ts` — Express proxy routes to external cabin API
- `server/index.ts` — Express server entry point

## Features
- **Authentication**: Login via `/api/token`, bearer token stored in localStorage
- **Temperature Card**: Indoor sensor data (temp, humidity, battery) from Tuya Cloud
- **Heater Card**: Vevor Diesel heater control (toggle, power level adjustment)
- **Battery Card**: JK-BMS data (SOC, voltage, current, power, temperatures)
- **Solar Card**: Victron SmartSolar MPPT (power output, daily yield, charge state)
- **Real-time polling**: All cards refresh every 10 seconds
- **Dark/Light mode**: Toggle in header
- **Logout**: With confirmation dialog

## Heater BLE Connection
The heater uses a persistent BLE connection managed by two endpoints:
- `POST /heater/connect` — establishes the BLE connection once
- `POST /heater/disconnect` — closes the connection
All other heater endpoints (`/status`, `/toggle`, `/mode`, `/power-level`) reuse the live connection and return 503 if called without connecting first.

The Dashboard connects on mount, disconnects on unmount, and auto-reconnects on 503. HeaterCard actions (toggle, power) also handle 503 with reconnect-and-retry.

## API Proxy
All frontend requests go to `/api/*` which the Express server proxies to the external cabin API. This avoids CORS issues and keeps the external URL server-side. Server-side caching returns last good response on 304 or error responses.
