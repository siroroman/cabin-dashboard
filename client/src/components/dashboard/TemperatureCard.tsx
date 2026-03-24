import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";

interface TemperatureCardProps {
  data?: any;
  lastFetch?: number;
  outdoorData?: any;
  outdoorLastFetch?: number;
}

function fmtFetchTime(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function TemperatureCard({ data, lastFetch, outdoorData, outdoorLastFetch }: TemperatureCardProps) {
  const getBatteryIcon = (level: number) => {
    if (level > 60) return <BatteryFull className="w-3.5 h-3.5 text-teal" />;
    if (level > 20) return <BatteryMedium className="w-3.5 h-3.5 text-teal" />;
    return <BatteryLow className="w-3.5 h-3.5 text-rose-500" />;
  };

  const getTempColor = (temp: number) => {
    if (temp < 15) return "text-teal";
    if (temp > 25) return "text-teal";
    return "text-foreground";
  };

  const indoorTemp = data?.va_temperature;
  const indoorHum = data?.va_humidity;
  const indoorBattery = data?.battery_percentage;

  const outdoorTemp = outdoorData?.va_temperature;
  const outdoorHum = outdoorData?.va_humidity;
  const outdoorBattery = outdoorData?.battery_percentage;

  return (
    <Card className="h-full border-border overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-6 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 font-medium">
          <div className="p-2 rounded-lg bg-teal/10 text-teal">
            <Thermometer className="w-5 h-5" />
          </div>
          Environment
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 divide-x divide-border flex-1">
        {/* Indoor */}
        <div className="space-y-4 pr-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Indoor</h3>
            <div className="flex items-center gap-1 text-teal">
              {indoorBattery != null ? getBatteryIcon(indoorBattery) : <BatteryFull className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">{indoorBattery != null ? `${indoorBattery}%` : "--"}</span>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-teal flex-shrink-0" />
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-light tabular-nums tracking-tight">
                    {indoorTemp != null ? indoorTemp.toFixed(1) : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-0.5">°C</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal flex-shrink-0" />
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-light tabular-nums tracking-tight">
                    {indoorHum != null ? indoorHum : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-0.5">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outdoor */}
        <div className="space-y-4 pl-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outdoor</h3>
            <div className="flex items-center gap-1 text-teal">
              {outdoorBattery != null ? getBatteryIcon(outdoorBattery) : <BatteryFull className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">{outdoorBattery != null ? `${outdoorBattery}%` : "--"}</span>
            </div>
          </div>
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-teal flex-shrink-0" />
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-light tabular-nums tracking-tight">
                    {outdoorTemp != null ? outdoorTemp.toFixed(1) : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-0.5">°C</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal flex-shrink-0" />
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-light tabular-nums tracking-tight">
                    {outdoorHum != null ? outdoorHum : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-0.5">%</span>
                </div>
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