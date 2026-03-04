import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { time: "06:00", power: 0 },
  { time: "08:00", power: 45 },
  { time: "10:00", power: 120 },
  { time: "12:00", power: 180 },
  { time: "14:00", power: 167 }, // current
  { time: "16:00", power: 0 }, // future projection
  { time: "18:00", power: 0 },
];

export function SolarCard() {
  return (
    <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-amber-500/5 blur-3xl -z-10" />
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 font-medium">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Sun className="w-5 h-5" />
          </div>
          Solar MPPT
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col flex-1">
        
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Current Output</span>
            <div className="text-4xl font-light tabular-nums tracking-tight text-amber-500">
              167 <span className="text-xl text-amber-500/70 font-normal ml-1">W</span>
            </div>
          </div>
          
          <div className="space-y-1 text-right">
            <span className="text-sm text-muted-foreground">Total Today</span>
            <div className="text-2xl font-medium tabular-nums tracking-tight">
              1.2 <span className="text-base text-muted-foreground font-normal ml-1">kWh</span>
            </div>
          </div>
        </div>

        <div className="h-[120px] w-full mt-auto rounded-xl overflow-hidden relative border border-border/30 bg-background/30">
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-medium text-amber-500/80 uppercase tracking-wider z-10">
            <ArrowUpRight className="w-3 h-3" /> Production curve
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(245, 158, 11)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(245, 158, 11)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={[0, 200]} hide />
              <Area 
                type="monotone" 
                dataKey="power" 
                stroke="rgb(245, 158, 11)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPower)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
      </CardContent>
    </Card>
  );
}