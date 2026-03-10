import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";

interface TemperatureCardProps {
  data?: any;
  lastFetch?: number;
}

function fmtFetchTime(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function TemperatureCard({ data, lastFetch }: TemperatureCardProps) {
  const getBatteryIcon = (level: number) => {
    if (level > 60) return <BatteryFull className="w-4 h-4 text-teal" />;
    if (level > 20) return <BatteryMedium className="w-4 h-4 text-teal" />;
    return <BatteryLow className="w-4 h-4 text-rose-500" />;
  };

  const getTempColor = (temp: number) => {
    if (temp < 15) return "text-teal";
    if (temp > 25) return "text-teal";
    return "text-foreground";
  };

  const indoorTemp = data?.va_temperature;
  const indoorHum = data?.va_humidity;
  const indoorBattery = data?.battery_percentage;

  return (
    <Card className="h-full border-border overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
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
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Indoor</h3>
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-light tabular-nums tracking-tight">
                    {indoorTemp != null ? indoorTemp.toFixed(1) : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-1">°C</span>
                </div>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-light tabular-nums tracking-tight">
                    {indoorHum != null ? indoorHum : "--"}
                  </span>
                  <span className="text-base text-muted-foreground mb-1">%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-center gap-1.5 text-sm">
                {indoorBattery != null ? getBatteryIcon(indoorBattery) : <BatteryFull className="w-4 h-4 text-muted-foreground" />}
                <span className={`font-medium ${indoorBattery != null ? "text-teal" : ""}`}>
                  {indoorBattery != null ? `${indoorBattery}%` : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Outdoor */}
        <div className="space-y-4 pl-4 flex flex-col opacity-50">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outdoor</h3>
          <div className="flex-1 flex items-center justify-center italic text-xs text-muted-foreground">
            Sensor unavailable
          </div>
        </div>
      </CardContent>
      {fmtFetchTime(lastFetch) && (
        <div className="pb-2 text-center text-[10px] text-muted-foreground/50 tabular-nums">
          {fmtFetchTime(lastFetch)}
        </div>
      )}
    </Card>
  );
}