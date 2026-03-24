import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun } from "lucide-react";

const MAX_OUTPUT = 860;

interface SolarCardProps {
  data?: any;
  lastFetch?: number;
}

function fmtFetchTime(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function CircularProgress({ percentage, power, size = 120, strokeWidth = 8 }: { percentage: number; power?: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--tint)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold tabular-nums">{power ?? "--"}<span className="text-xs text-muted-foreground ml-0.5">W</span></span>
      </div>
    </div>
  );
}

export function SolarCard({ data, lastFetch }: SolarCardProps) {
  const chargingMode = data?.charge_state;
  const solarPower = data?.solar_power;
  const yieldToday = data?.yield_today_wh != null ? data.yield_today_wh / 1000 : undefined;
  const percentage = solarPower != null ? Math.min((solarPower / MAX_OUTPUT) * 100, 100) : 0;

  const getModeStyle = (mode: string): React.CSSProperties => {
    if (!mode || mode === "--") return {};
    return {
      color: "var(--tint)",
      background: "color-mix(in srgb, var(--tint) 10%, transparent)",
      borderColor: "color-mix(in srgb, var(--tint) 25%, transparent)",
    };
  };

  return (
    <Card className="h-full border-border overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col relative">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className="p-2 rounded-lg bg-teal/10 text-teal">
              <Sun className="w-5 h-5" />
            </div>
            Solar MPPT
          </CardTitle>
          <div
            className="px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 border-border"
            style={getModeStyle(chargingMode ?? "")}
          >
            {chargingMode ?? "--"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col flex-1">
        <div className="flex items-center justify-around flex-1">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress percentage={solarPower != null ? percentage : 0} power={solarPower} size={140} strokeWidth={12} />
            <span className="text-xs text-muted-foreground">of {MAX_OUTPUT}W max</span>
          </div>

          <div className="flex flex-col gap-4 text-right">
            <div>
              <span className="text-xs text-muted-foreground">Total Today</span>
              <div className="text-xl font-medium tabular-nums tracking-tight">
                {yieldToday != null ? yieldToday.toFixed(1) : "--"} <span className="text-sm text-muted-foreground font-normal">kWh</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Battery Voltage</span>
              <div className="text-xl font-medium tabular-nums tracking-tight">
                {data?.battery_voltage?.toFixed(1) ?? "--"} <span className="text-sm text-muted-foreground font-normal">V</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Charge Current</span>
              <div className="text-xl font-medium tabular-nums tracking-tight">
                {data?.charging_current?.toFixed(1) ?? "--"} <span className="text-sm text-muted-foreground font-normal">A</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {fmtFetchTime(lastFetch) && (
        <div className="pb-2 text-center text-[10px] text-foreground/70 tabular-nums">
          {fmtFetchTime(lastFetch)}
        </div>
      )}
    </Card>
  );
}
