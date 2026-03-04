import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, BatteryCharging, Zap, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BatteryCardProps {
  data?: any;
}

export function BatteryCard({ data }: BatteryCardProps) {
  const soc = data?.soc;
  const voltage = data?.voltage;
  const current = data?.current;
  const rawPower = data?.power != null ? Math.abs(data.power) : undefined;
  const power = rawPower != null && current != null ? (current < 0 ? -rawPower : rawPower) : undefined;
  const temp1 = data?.temperatures?.sensor_1;
  const temp2 = data?.temperatures?.sensor_2;
  const isCharging = current != null && current > 0;

  const fmt = (v: number | undefined, decimals: number) => v != null ? v.toFixed(decimals) : "--";

  return (
    <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col relative">
       {isCharging && (
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full -z-10" />
      )}
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              {isCharging ? <BatteryCharging className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
            </div>
            Battery
          </CardTitle>
          {isCharging && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" />
              Charging
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col justify-between flex-1 space-y-6">
        <div className="space-y-2">
          <div className="flex items-end justify-between mb-1">
            <span className="text-sm text-muted-foreground">State of Charge</span>
            <span className="text-4xl font-light tabular-nums tracking-tight">{soc != null ? soc : "--"}<span className="text-xl text-muted-foreground ml-1">%</span></span>
          </div>
          <div className="relative pt-2">
            <Progress value={soc ?? 0} className="h-3 bg-muted" />
            {isCharging && (
              <div 
                className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" 
                style={{ width: `${soc ?? 0}%` }}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-4 border-t border-border/30 mt-auto">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Voltage
            </span>
            <div className="text-xl font-medium tabular-nums tracking-tight">{fmt(voltage, 1)} <span className="text-sm text-muted-foreground font-normal">V</span></div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Current
            </span>
            <div className={cn("text-xl font-medium tabular-nums tracking-tight", current != null ? (current >= 0 ? "text-emerald-500" : "text-orange-500") : "")}>
              {current != null ? (current > 0 ? `+${current.toFixed(2)}` : current.toFixed(2)) : "--"} <span className="text-sm text-muted-foreground font-normal opacity-70">A</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Power
            </span>
            <div className={cn("text-xl font-medium tabular-nums tracking-tight", power != null ? (power >= 0 ? "text-emerald-500" : "text-orange-500") : "")}>
              {power != null ? (power > 0 ? `+${power.toFixed(0)}` : power.toFixed(0)) : "--"} <span className="text-sm text-muted-foreground font-normal opacity-70">W</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" /> Temps
            </span>
            <div className="flex gap-2">
              <div className="text-sm font-medium">T1: {fmt(temp1, 1)}°C</div>
              <div className="text-sm font-medium">T2: {fmt(temp2, 1)}°C</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}