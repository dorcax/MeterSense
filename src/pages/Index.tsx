import { useEffect, useState } from "react";
import { Sun, Zap, Battery, Building, Activity } from "lucide-react";
import Layout from "@/components/layout/Layout";
import MeterCard from "@/components/dashboard/MeterCard";
import EnergyChart from "@/components/dashboard/EnergyChart";
import { useRandomAlert } from "@/hooks/use-random-alert";

const INTERVAL_TIME = 5000;

const Index = () => {
  const [meters, setMeters] = useState([
    { title: "Solar Power", value: 12.5, unit: "kW", icon: Sun, trend: "up", status: "normal" },
    { title: "Grid Supply", value: 8.2, unit: "kW", icon: Zap, trend: "down", status: "normal" },
    { title: "Generator", value: 0.0, unit: "kW", icon: Battery, trend: "stable", status: "normal" },
    { title: "Building Load", value: 18.3, unit: "kW", icon: Building, trend: "up", status: "warning" },
  ]);

  // Energy chart data (in sync with meters)
  const [energyData, setEnergyData] = useState([
    {
      time: new Date().toLocaleTimeString().slice(0, 5),
      solar: meters[0].value,
      grid: meters[1].value,
      generator: meters[2].value,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newSolar = Math.max(0, meters[0].value + (Math.random() * 2 - 1));
      const newGrid = Math.max(0, meters[1].value + (Math.random() * 2 - 1));
      const newGen = Math.max(0, meters[2].value + (Math.random() * 2 - 1));
      const newBuilding = Math.max(0, meters[3].value + (Math.random() * 3 - 1.5));

      setMeters([
        { ...meters[0], value: newSolar, trend: newSolar > meters[0].value ? "up" : newSolar < meters[0].value ? "down" : "stable" },
        { ...meters[1], value: newGrid, trend: newGrid > meters[1].value ? "up" : newGrid < meters[1].value ? "down" : "stable" },
        { ...meters[2], value: newGen, trend: newGen > meters[2].value ? "up" : newGen < meters[2].value ? "down" : "stable" },
        { ...meters[3], value: newBuilding, trend: newBuilding > meters[3].value ? "up" : newBuilding < meters[3].value ? "down" : "stable" },
      ]);

      const newEntry = {
        time: new Date().toLocaleTimeString().slice(0, 5),
        solar: newSolar,
        grid: newGrid,
        generator: newGen,
      };

      setEnergyData(prev => [...prev.slice(-6), newEntry]); // keep last 7 points
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [meters]);

  useRandomAlert(10000);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time meter readings and analytics</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm">Last updated: Just now</span>
          </div>
        </div>

        {/* Meter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {meters.map((m, i) => (
            <MeterCard
              key={i}
              title={m.title}
              value={m.value.toFixed(1)}
              unit={m.unit}
              icon={m.icon}
              trend={m.trend as "up" | "down" | "stable"}
              status={m.status as "normal" | "warning" | "critical"}
            />
          ))}
        </div>

        {/* Energy Chart */}
        <EnergyChart initialData={energyData} />
      </div>
    </Layout>
  );
};

export default Index;
