import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Flame, Plus, Minus, AlertTriangle, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaterCard() {
  const [status, setStatus] = useState<"off" | "heating" | "starting" | "blew">("heating");
  const [power, setPower] = useState(4);
  const [hasError, setHasError] = useState(false);

  const increasePower = () => setPower(Math.min(10, power + 1));
  const decreasePower = () => setPower(Math.max(1, power - 1));

  const getStatusColor = (s: typeof status) => {
    switch(s) {
      case "heating": return "text-orange-500";
      case "starting": return "text-amber-500";
      case "blew": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("h-full border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm relative flex flex-col", status !== "off" ? "border-orange-500/20" : "")}>
      {status !== "off" && !hasError && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -z-10" />
      )}
      
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className={cn("p-2 rounded-lg transition-colors", status !== "off" ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground")}>
              <Flame className="w-5 h-5" />
            </div>
            Diesel Heater
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasError ? (
              <span className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Error
              </span>
            ) : (
              <span className={cn("text-xs font-medium uppercase tracking-wider", getStatusColor(status))}>
                {status}
              </span>
            )}
            <Switch checked={status !== "off"} onCheckedChange={(checked) => setStatus(checked ? "starting" : "off")} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex flex-col justify-between flex-1">
        {hasError ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center gap-2 h-full">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="font-medium text-destructive text-sm">Fuel Pump Failure</p>
              <p className="text-xs text-destructive/80 mt-1">Please check the fuel line and try again.</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setHasError(false)}>
              Dismiss Error
            </Button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col h-[calc(100%-1rem)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Core Temp</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-orange-500/70" />
                  <span className="text-3xl font-light tabular-nums tracking-tight">185<span className="text-lg text-muted-foreground ml-1">°C</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground mb-2">Power Level</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-6 rounded-full transition-colors",
                        i < power 
                          ? (status !== "off" ? "bg-orange-500" : "bg-muted-foreground/30") 
                          : "bg-muted"
                      )} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30 flex items-center justify-between mt-auto">
              <span className="text-sm font-medium">Heat Control</span>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1 border border-border/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-background" 
                  onClick={decreasePower} 
                  disabled={status === "off" || power <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-8 text-center font-medium tabular-nums text-sm">{power}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-background" 
                  onClick={increasePower} 
                  disabled={status === "off" || power >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}