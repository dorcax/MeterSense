import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Fuel,
  Gauge,
  Activity,
  Zap,
  Clock,
  Thermometer,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

/* ------------------------------ CONSTANTS ------------------------------ */

const GENERATOR = {
  model: "CAT C15 Generator",
  capacity: "500 kVA",
  fuelType: "Diesel",
  status: "Running",
  runtime: "1,245 hrs",
  efficiency: 92,
  temperature: 78,
};

const LOAD_SPLIT = [
  { name: "Building A", value: 35, color: "hsl(var(--primary))" },
  { name: "Building B", value: 25, color: "hsl(var(--success))" },
  { name: "Building C", value: 20, color: "hsl(var(--warning))" },
  { name: "Common Areas", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Reserve", value: 8, color: "hsl(var(--muted-foreground))" },
];

const DAILY_FUEL_USAGE = [
  { day: "Mon", usage: 120 },
  { day: "Tue", usage: 145 },
  { day: "Wed", usage: 132 },
  { day: "Thu", usage: 158 },
  { day: "Fri", usage: 140 },
  { day: "Sat", usage: 95 },
  { day: "Sun", usage: 88 },
];

const INITIAL_FUEL_HISTORY = [
  { time: "00:00", level: 100 },
  { time: "04:00", level: 92 },
  { time: "08:00", level: 78 },
  { time: "12:00", level: 65 },
  { time: "16:00", level: 52 },
  { time: "20:00", level: 45 },
  { time: "Now", level: 38 },
];

/* ------------------------------ COMPONENT ------------------------------ */

const Equipment = () => {
  const FUEL_CAPACITY = 1000; // liters
  const avgDailyUsage =
    DAILY_FUEL_USAGE.reduce((sum, d) => sum + d.usage, 0) / DAILY_FUEL_USAGE.length;

  const [fuelLiters, setFuelLiters] = useState(FUEL_CAPACITY);
  const [fuelPercent, setFuelPercent] = useState(100);
  const [fuelHistory, setFuelHistory] = useState(INITIAL_FUEL_HISTORY);

  /* -------------------- Fuel Consumption Simulation -------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setFuelLiters((prevFuel) => {
        const consumption = Math.random() * 5; // 0–5L
        const updatedFuel = Math.max(prevFuel - consumption, 0);
        const updatedPercent = (updatedFuel / FUEL_CAPACITY) * 100;

        setFuelPercent(updatedPercent);

        setFuelHistory((prev) => {
          const updated = [
            ...prev.slice(-9), // keep last 9, push new
            { time: "Now", level: updatedPercent },
          ];

          // Replace previous "Now" with timestamps if needed
          return updated.map((item, idx) => ({
            ...item,
            time: idx === updated.length - 1 ? "Now" : item.time,
          }));
        });

        return updatedFuel;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------------------ Computed ------------------------------ */

  const daysRemaining = Math.floor(fuelLiters / avgDailyUsage);

  const fuelColor =
    fuelPercent > 50
      ? "hsl(var(--success))"
      : fuelPercent > 25
        ? "hsl(var(--warning))"
        : "hsl(var(--destructive))";

  /* ------------------------------ Render ------------------------------ */

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground mt-1">
            Generator monitoring and fuel management
          </p>
        </div>

        {/* Generator Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                {GENERATOR.model}
              </CardTitle>

              <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                {GENERATOR.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                ["Capacity", GENERATOR.capacity],
                ["Fuel Type", GENERATOR.fuelType],
                ["Runtime", GENERATOR.runtime],
                [
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" /> Efficiency
                  </span>,
                  <span className="text-success">{GENERATOR.efficiency}%</span>,
                ],
                [
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> Temperature
                  </span>,
                  <span className="text-warning">{GENERATOR.temperature}°C</span>,
                ],
              ].map(([label, value], i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Load Split */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generator Operating Load Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie
                      data={LOAD_SPLIT}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {LOAD_SPLIT.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                      }}
                      formatter={(value) => [`${value}%`, "Load"]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {LOAD_SPLIT.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-bold ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Fuel Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fuel className="h-5 w-5 text-warning" />
                Daily Fuel Usage (Liters)
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DAILY_FUEL_USAGE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                      }}
                      formatter={(v) => [`${v}L`, "Fuel Used"]}
                    />
                    <Bar dataKey="usage" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fuel Remaining */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fuel Tank Gauge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fuel Tank Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx={64}
                      cy={64}
                      r={56}
                      stroke="hsl(var(--border))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx={64}
                      cy={64}
                      r={56}
                      stroke={fuelColor}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(fuelPercent / 100) * 352} 352`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Fuel className="h-6 w-6 text-warning mb-1" />
                    <span className="text-2xl font-bold">{fuelPercent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{fuelLiters.toFixed(0)}L / {FUEL_CAPACITY}L</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Daily Usage</span>
                  <span className="font-medium">{avgDailyUsage.toFixed(0)}L</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Days Remaining</span>
                  <span className={`font-bold ${daysRemaining < 3 ? "text-destructive" : "text-success"}`}>
                    {daysRemaining} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Fuel Level History
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fuelHistory}>
                    <defs>
                      <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                      }}
                      // formatter={(value) => [`${value.toFixed(0)}%`, "Fuel Level"]}
                      formatter={(value) => {
                        const num = typeof value === "number" ? value : Number(value) || 0;
                        return [`${num.toFixed(0)}%`, "Fuel Level"];
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="level"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      fill="url(#fuelGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Equipment;
