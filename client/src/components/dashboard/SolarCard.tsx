import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun } from "lucide-react";

const MAX_OUTPUT = 860;

interface SolarCardProps {
  data?: any;
}

function CircularProgress({ percentage, size = 120, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  const getColor = (pct: number) => {
    if (pct < 20) return { stroke: "#ef4444" };
    if (pct < 50) return { stroke: "#f59e0b" };
    return { stroke: "#22c55e" };
  };

  const colors = getColor(percentage);

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
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">{Math.round(percentage)}<span className="text-sm text-muted-foreground">%</span></span>
      </div>
    </div>
  );
}

export function SolarCard({ data }: SolarCardProps) {
  const chargingMode = data?.charge_state;
  const solarPower = data?.solar_power;
  const yieldToday = data?.yield_today_wh != null ? data.yield_today_wh / 1000 : undefined;
  const percentage = solarPower != null ? Math.min((solarPower / MAX_OUTPUT) * 100, 100) : 0;

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "BULK": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "ABSORPTION": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "FLOAT": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-muted-foreground bg-muted/50 border-border/50";
    }
  };

  return (
    <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col relative">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Sun className="w-5 h-5" />
            </div>
            Solar MPPT
          </CardTitle>
          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getModeColor(chargingMode ?? "")}`}>
            {chargingMode ?? "--"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col flex-1">
        <div className="flex items-center justify-around flex-1">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress percentage={solarPower != null ? percentage : 0} />
            <div className="text-center">
              <div className="text-2xl font-light tabular-nums tracking-tight text-amber-500">
                {solarPower != null ? solarPower : "--"} <span className="text-base text-amber-500/70 font-normal">W</span>
              </div>
              <span className="text-xs text-muted-foreground">of {MAX_OUTPUT}W max</span>
            </div>
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
              <div className="text-xl font-medium tabular-nums tracking-tight text-emerald-500">
                {data?.battery_voltage?.toFixed(1) ?? "--"} <span className="text-sm text-emerald-500/70 font-normal">V</span>
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
    </Card>
  );
}
