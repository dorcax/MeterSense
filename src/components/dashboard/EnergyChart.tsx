import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", solar: 0, grid: 45, generator: 10 },
  { time: "04:00", solar: 0, grid: 38, generator: 8 },
  { time: "08:00", solar: 85, grid: 25, generator: 0 },
  { time: "12:00", solar: 150, grid: 15, generator: 0 },
  { time: "16:00", solar: 120, grid: 20, generator: 0 },
  { time: "20:00", solar: 20, grid: 55, generator: 5 },
  { time: "24:00", solar: 0, grid: 48, generator: 12 },
];

const EnergyChart = () => {
  return (
    <div className="p-6 rounded-xl border border-border bg-card gradient-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Energy Production</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Solar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">Grid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Generator</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 72%, 52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174, 72%, 52%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(222, 47%, 9%)", 
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 96%)"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="solar" 
              stroke="hsl(174, 72%, 52%)" 
              fill="url(#solarGradient)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="grid" 
              stroke="hsl(38, 92%, 50%)" 
              fill="url(#gridGradient)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="generator" 
              stroke="hsl(0, 72%, 51%)" 
              fill="url(#genGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
