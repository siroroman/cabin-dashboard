import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Flame, Plus, Minus, AlertTriangle, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { cabinApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HeaterCardProps {
  data?: any;
  lastFetch?: number;
  onActionStart?: () => void;
  onActionEnd?: () => void;
}

function fmtFetchTime(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function HeaterCard({ data, lastFetch, onActionStart, onActionEnd }: HeaterCardProps) {
  const queryClient = useQueryClient();
  const [localPower, setLocalPower] = useState<number | undefined>(data?.power_level);
  const [localStatus, setLocalStatus] = useState<string | undefined>(undefined);
  const [localState, setLocalState] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (data?.power_level !== undefined) {
      setLocalPower(data.power_level);
    }
  }, [data?.power_level]);

  useEffect(() => {
    if (data?.power !== undefined) {
      setLocalStatus(data.power.toLowerCase());
    }
  }, [data?.power]);

  useEffect(() => {
    if (data?.state !== undefined) {
      setLocalState(data.state);
    }
  }, [data?.state]);

  const applyStatus = (newData: any) => {
    queryClient.setQueryData(["/heater/status"], newData);
    if (newData?.power) setLocalStatus(newData.power.toLowerCase());
    if (newData?.state) setLocalState(newData.state);
    if (newData?.power_level !== undefined) setLocalPower(newData.power_level);
  };

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const currentStatus = localStatus || "off";
      if (currentStatus === "off") {
        setLocalStatus("on");
        setLocalState("Starting...");
      } else {
        setLocalStatus("off");
        setLocalState("Shutting down...");
      }
      onActionStart?.();
      await cabinApi.toggleHeater();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResult = await cabinApi.getHeaterStatusFresh();
      return statusResult;
    },
    onSuccess: (newData) => {
      applyStatus(newData);
      onActionEnd?.();
    },
    onError: () => {
      const prevStatus = data?.power?.toLowerCase() || "off";
      const prevState = data?.state || "Shutdown";
      setLocalStatus(prevStatus);
      setLocalState(prevState);
      onActionEnd?.();
    },
  });

  const powerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serverPowerRef = useRef<number | undefined>(data?.power_level);

  useEffect(() => {
    if (data?.power_level !== undefined) {
      serverPowerRef.current = data.power_level;
    }
  }, [data?.power_level]);

  const submitPowerChange = useCallback(async (targetLevel: number) => {
    const serverLevel = serverPowerRef.current ?? 0;
    const diff = targetLevel - serverLevel;
    if (diff === 0) return;

    onActionStart?.();
    const steps = Math.abs(diff);
    const direction = diff > 0 ? "up" : "down";
    for (let i = 0; i < steps; i++) {
      await cabinApi.adjustHeaterPower(direction);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const statusResult = await cabinApi.getHeaterStatusFresh();
      applyStatus(statusResult);
    } finally {
      onActionEnd?.();
    }
  }, [onActionStart, onActionEnd]);

  const handlePowerChange = useCallback((action: "up" | "down") => {
    setLocalPower(prev => {
      const current = prev ?? 0;
      const next = action === "up" ? Math.min(current + 1, 6) : Math.max(current - 1, 1);

      if (powerDebounceRef.current) {
        clearTimeout(powerDebounceRef.current);
      }
      powerDebounceRef.current = setTimeout(() => {
        submitPowerChange(next);
      }, 2000);

      return next;
    });
  }, [submitPowerChange]);

  useEffect(() => {
    return () => {
      if (powerDebounceRef.current) clearTimeout(powerDebounceRef.current);
    };
  }, []);

  const isBusy = false;

  const status = localStatus || "off";
  const state = localState;
  const shellTemp = data?.shell_temp;
  const hasError = state ? (state.toLowerCase().includes("error") || state === "N/A") : false;

  const getStatusColor = (s: string) => {
    const lowS = s.toLowerCase();
    if (lowS === "on" || lowS === "heating") return "text-teal";
    if (lowS === "starting" || lowS === "starting...") return "text-amber-500";
    if (lowS === "ignition") return "text-amber-500";
    if (lowS === "shutting down..." || lowS === "cooling" || lowS === "blew") return "text-teal";
    return "text-muted-foreground";
  };

  return (
    <Card className="h-full border-border transition-all overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm relative flex flex-col">
      {status !== "off" && !hasError && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 blur-3xl rounded-full -z-10" />
      )}
      
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <div className="p-2 rounded-lg bg-teal/10 text-teal">
              <Flame className="w-5 h-5" />
            </div>
            Diesel Heater
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasError ? (
              <span className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {state}
              </span>
            ) : (
              <span className={cn("text-xs font-medium uppercase tracking-wider", state ? getStatusColor(state) : "text-muted-foreground")}>
                {state ?? "--"}
              </span>
            )}
            <Switch 
              checked={status === "on" || status === "cooling"} 
              onCheckedChange={() => toggleMutation.mutate()} 
              disabled={isBusy}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex flex-col justify-between flex-1">
        {hasError ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center gap-2 h-full">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="font-medium text-destructive text-sm">System Error</p>
              <p className="text-xs text-destructive/80 mt-1">{state}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => toggleMutation.mutate()} disabled={isBusy}>
              Reset
            </Button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col h-[calc(100%-1rem)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Shell Temp</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-teal/70" />
                  <span className="text-3xl font-light tabular-nums tracking-tight">{shellTemp != null ? shellTemp : "--"}<span className="text-lg text-muted-foreground ml-1">°C</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground mb-2">Power Level</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-6 rounded-full transition-colors",
                        i < (localPower ?? 0) 
                          ? (status !== "off"
                            ? "bg-teal"
                            : "bg-muted-foreground/30")
                          : "bg-muted"
                      )} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
              <span className="text-sm font-medium">Heat Control</span>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1 border border-border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-background" 
                  onClick={() => handlePowerChange("down")} 
                  disabled={status === "off" || (localPower ?? 0) <= 1 || isBusy}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-8 text-center font-medium tabular-nums text-sm">{localPower ?? "--"}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-background" 
                  onClick={() => handlePowerChange("up")} 
                  disabled={status === "off" || (localPower ?? 0) >= 6 || isBusy}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {fmtFetchTime(lastFetch) && (
        <div className="pb-2 text-center text-[10px] text-foreground/70 tabular-nums">
          {fmtFetchTime(lastFetch)}
        </div>
      )}
    </Card>
  );
}
