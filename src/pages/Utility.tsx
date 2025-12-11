import { useEffect, useState } from "react";
import { Building2, Zap, TrendingUp, TrendingDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

interface Building {
  id: number;
  name: string;
  usage: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  devices: number;
  status: "normal" | "warning" | "critical";
}


const initialBuildings: Building[] = [
  { id: 1, name: "Main Office", usage: 45.2, trend: "up", trendValue: 8, devices: 12, status: "normal" },
  { id: 2, name: "Warehouse A", usage: 28.7, trend: "down", trendValue: 5, devices: 8, status: "normal" },
  { id: 3, name: "Production Floor", usage: 89.4, trend: "up", trendValue: 15, devices: 24, status: "warning" },
  { id: 4, name: "Server Room", usage: 32.1, trend: "stable", trendValue: 0, devices: 6, status: "normal" },
  { id: 5, name: "Cafeteria", usage: 12.8, trend: "down", trendValue: 12, devices: 5, status: "normal" },
  { id: 6, name: "Parking Garage", usage: 8.5, trend: "up", trendValue: 3, devices: 4, status: "normal" },
];

const INTERVAL_TIME = 3000;

const Utility = () => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);

  // Function to calculate status based on usage
  const getStatus = (usage: number): "normal" | "warning" | "critical" => {
    if (usage > 80) return "critical";
    if (usage > 50) return "warning";
    return "normal";
  };

  // Simulate real-time updates for building usage
  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings(prev =>
        prev.map(b => {
          const fluctuation = (Math.random() * 6 - 3); // -3 to +3 kW
          const newUsage = Math.max(0, b.usage + fluctuation);

          const trend: "up" | "down" | "stable" =
            newUsage > b.usage ? "up" : newUsage < b.usage ? "down" : "stable";

          const trendValue = Math.abs(Math.round(((newUsage - b.usage) / b.usage) * 100));

          return {
            ...b,
            usage: newUsage,
            trend,
            trendValue,
            status: getStatus(newUsage),
          };
        })
      );
    }, INTERVAL_TIME); // update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const totalUsage = buildings.reduce((acc, b) => acc + b.usage, 0);
  const totalDevices = buildings.reduce((acc, b) => acc + b.devices, 0);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Utility Area</h1>
          <p className="text-muted-foreground mt-1">Monitor energy consumption by building</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground">Total Buildings</span>
            </div>
            <p className="text-4xl font-bold font-mono">{buildings.length}</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <span className="text-muted-foreground">Total Usage</span>
            </div>
            <p className="text-4xl font-bold font-mono">
              {totalUsage.toFixed(1)} <span className="text-lg text-muted-foreground">kW</span>
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Building2 className="h-6 w-6 text-success" />
              </div>
              <span className="text-muted-foreground">Connected Devices</span>
            </div>
            <p className="text-4xl font-bold font-mono">{totalDevices}</p>
          </div>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {buildings.map((b, idx) => (
            <div
              key={b.id}
              className={cn(
                "p-6 rounded-xl border bg-card gradient-card transition-all duration-300 hover:scale-[1.02]",
                b.status === "normal"
                  ? "border-border"
                  : b.status === "warning"
                  ? "border-warning/50 glow-warning"
                  : "border-destructive/50 glow-destructive"
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      b.status === "normal"
                        ? "bg-primary/10"
                        : b.status === "warning"
                        ? "bg-warning/10"
                        : "bg-destructive/10"
                    )}
                  >
                    <Building2
                      className={cn(
                        "h-6 w-6",
                        b.status === "normal"
                          ? "text-primary"
                          : b.status === "warning"
                          ? "text-warning"
                          : "text-destructive"
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.devices} devices</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    b.status === "normal"
                      ? "bg-success"
                      : b.status === "warning"
                      ? "bg-warning"
                      : "bg-destructive"
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono">{b.usage.toFixed(1)}</span>
                    <span className="text-muted-foreground">kW</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-sm",
                      b.trend === "up"
                        ? "text-destructive"
                        : b.trend === "down"
                        ? "text-success"
                        : "text-muted-foreground"
                    )}
                  >
                    {b.trend === "up" && <TrendingUp className="h-4 w-4" />}
                    {b.trend === "down" && <TrendingDown className="h-4 w-4" />}
                    <span>
                      {b.trend === "stable"
                        ? "No change"
                        : `${b.trend === "up" ? "+" : "-"}${b.trendValue}% from last update`}
                    </span>
                  </div>
                </div>

                {/* Usage bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Usage</span>
                    <span>{((b.usage / totalUsage) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        b.status === "normal"
                          ? "gradient-primary"
                          : b.status === "warning"
                          ? "bg-warning"
                          : "bg-destructive"
                      )}
                      style={{ width: `${(b.usage / totalUsage) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Utility;
