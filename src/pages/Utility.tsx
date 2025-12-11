import { Building2, Zap, TrendingUp, TrendingDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const buildings = [
  { 
    id: 1, 
    name: "Main Office", 
    usage: 45.2, 
    trend: "up", 
    trendValue: 8,
    devices: 12,
    status: "normal" 
  },
  { 
    id: 2, 
    name: "Warehouse A", 
    usage: 28.7, 
    trend: "down", 
    trendValue: 5,
    devices: 8,
    status: "normal" 
  },
  { 
    id: 3, 
    name: "Production Floor", 
    usage: 89.4, 
    trend: "up", 
    trendValue: 15,
    devices: 24,
    status: "warning" 
  },
  { 
    id: 4, 
    name: "Server Room", 
    usage: 32.1, 
    trend: "stable", 
    trendValue: 0,
    devices: 6,
    status: "normal" 
  },
  { 
    id: 5, 
    name: "Cafeteria", 
    usage: 12.8, 
    trend: "down", 
    trendValue: 12,
    devices: 5,
    status: "normal" 
  },
  { 
    id: 6, 
    name: "Parking Garage", 
    usage: 8.5, 
    trend: "up", 
    trendValue: 3,
    devices: 4,
    status: "normal" 
  },
];

const Utility = () => {
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
            <p className="text-4xl font-bold font-mono">{totalUsage.toFixed(1)} <span className="text-lg text-muted-foreground">kW</span></p>
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
          {buildings.map((building, index) => (
            <div 
              key={building.id}
              className={cn(
                "p-6 rounded-xl border bg-card gradient-card transition-all duration-300 hover:scale-[1.02]",
                building.status === "normal" ? "border-border" : "border-warning/50 glow-warning"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg",
                    building.status === "normal" ? "bg-primary/10" : "bg-warning/10"
                  )}>
                    <Building2 className={cn(
                      "h-6 w-6",
                      building.status === "normal" ? "text-primary" : "text-warning"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{building.name}</h3>
                    <p className="text-sm text-muted-foreground">{building.devices} devices</p>
                  </div>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  building.status === "normal" ? "bg-success" : "bg-warning",
                  "animate-pulse"
                )} />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono">{building.usage}</span>
                    <span className="text-muted-foreground">kW</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-sm",
                    building.trend === "up" ? "text-destructive" : 
                    building.trend === "down" ? "text-success" : "text-muted-foreground"
                  )}>
                    {building.trend === "up" && <TrendingUp className="h-4 w-4" />}
                    {building.trend === "down" && <TrendingDown className="h-4 w-4" />}
                    <span>
                      {building.trend === "stable" ? "No change" : 
                       `${building.trend === "up" ? "+" : "-"}${building.trendValue}% from last week`}
                    </span>
                  </div>
                </div>

                {/* Usage bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Usage</span>
                    <span>{((building.usage / totalUsage) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        building.status === "normal" ? "gradient-primary" : "bg-warning"
                      )}
                      style={{ width: `${(building.usage / 100) * 100}%` }}
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
