import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Zap } from "lucide-react";

interface SolarCardProps {
  data?: any;
}

export function SolarCard({ data }: SolarCardProps) {
  const chargingMode = data?.charge_state ?? "OFF"; 
  const solarPower = data?.solar_power ?? 0;
  const yieldToday = (data?.yield_today_wh ?? 0) / 1000;

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
      <div className="absolute top-0 left-0 w-full h-32 bg-amber-500/5 blur-3xl -z-10" />
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Sun className="w-5 h-5" />
            </div>
            Solar MPPT
          </CardTitle>
          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getModeColor(chargingMode)}`}>
            {chargingMode}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col flex-1 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Current Output</span>
            <div className="text-4xl font-light tabular-nums tracking-tight text-amber-500">
              {solarPower} <span className="text-xl text-amber-500/70 font-normal ml-1">W</span>
            </div>
          </div>
          
          <div className="space-y-1 text-right">
            <span className="text-sm text-muted-foreground">Total Today</span>
            <div className="text-2xl font-medium tabular-nums tracking-tight">
              {yieldToday.toFixed(1)} <span className="text-base text-muted-foreground font-normal ml-1">kWh</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-auto">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-tight font-semibold">Charging Status</span>
                <span className="text-sm font-medium">{chargingMode !== "OFF" ? "System Active" : "Idle"}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Battery Voltage</span>
              <span className="text-sm font-bold text-emerald-500">{data?.battery_voltage?.toFixed(1) ?? "--"} V</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}