import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";

interface TemperatureCardProps {
  data?: any;
}

export function TemperatureCard({ data }: TemperatureCardProps) {
  const getBatteryIcon = (level: number) => {
    if (level > 60) return <BatteryFull className="w-4 h-4 text-emerald-500" />;
    if (level > 20) return <BatteryMedium className="w-4 h-4 text-amber-500" />;
    return <BatteryLow className="w-4 h-4 text-rose-500" />;
  };

  const getTempColor = (temp: number) => {
    if (temp < 15) return "text-blue-500";
    if (temp > 25) return "text-orange-500";
    return "text-foreground";
  };

  const indoorTemp = data?.va_temperature;
  const indoorHum = data?.va_humidity;
  const indoorBattery = data?.battery_percentage;

  return (
    <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 font-medium">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Thermometer className="w-5 h-5" />
          </div>
          Environment
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 divide-x divide-border/50 h-[calc(100%-4rem)]">
        {/* Indoor */}
        <div className="space-y-4 pr-2 flex flex-col">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Indoor</h3>
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-light tabular-nums tracking-tight ${indoorTemp != null ? getTempColor(indoorTemp) : ""}`}>
                {indoorTemp != null ? indoorTemp.toFixed(1) : "--"}
              </span>
              <span className="text-lg text-muted-foreground mb-1">°C</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border/30 mt-auto">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span>Humidity</span>
                </div>
                <span className="font-medium">{indoorHum != null ? `${indoorHum}%` : "--"}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {indoorBattery != null ? getBatteryIcon(indoorBattery) : <BatteryFull className="w-4 h-4 text-muted-foreground" />}
                  <span>Battery</span>
                </div>
                <span className={`font-medium ${indoorBattery != null ? "text-emerald-500" : ""}`}>
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
    </Card>
  );
}