import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";

export function TemperatureCard() {
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
              <span className={`text-4xl font-light tabular-nums tracking-tight ${getTempColor(22.4)}`}>22.4</span>
              <span className="text-lg text-muted-foreground mb-1">°C</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border/30 mt-auto">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span>Humidity</span>
                </div>
                <span className="font-medium">45%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {getBatteryIcon(87)}
                  <span>Battery</span>
                </div>
                <span className="font-medium text-emerald-500">87%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outdoor */}
        <div className="space-y-4 pl-4 flex flex-col">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outdoor</h3>
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-light tabular-nums tracking-tight ${getTempColor(5.8)}`}>5.8</span>
              <span className="text-lg text-muted-foreground mb-1">°C</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border/30 mt-auto">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span>Humidity</span>
                </div>
                <span className="font-medium">71%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {getBatteryIcon(72)}
                  <span>Battery</span>
                </div>
                <span className="font-medium text-emerald-500">72%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}