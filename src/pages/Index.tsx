import { Sun, Zap, Battery, Building, Activity } from "lucide-react";
import Layout from "@/components/layout/Layout";
import MeterCard from "@/components/dashboard/MeterCard";
import EnvironmentCard from "@/components/dashboard/EnvironmentCard";
import EnergyChart from "@/components/dashboard/EnergyChart";

const Index = () => {
  const environmentData = {
    temperature: 32,
    humidity: 65,
    gasLevel: 180,
  };

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
          <MeterCard
            title="Solar Power"
            value="12.5"
            unit="kW"
            icon={Sun}
            trend="up"
            trendValue="+15% from yesterday"
            status="normal"
          />
          <MeterCard
            title="Grid Supply"
            value="8.2"
            unit="kW"
            icon={Zap}
            trend="down"
            trendValue="-8% from yesterday"
            status="normal"
          />
          <MeterCard
            title="Generator"
            value="0.0"
            unit="kW"
            icon={Battery}
            trend="stable"
            trendValue="Standby mode"
            status="normal"
          />
          <MeterCard
            title="Building Load"
            value="18.3"
            unit="kW"
            icon={Building}
            trend="up"
            trendValue="+5% from yesterday"
            status="warning"
          />
        </div>

        {/* Charts and Environment Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <EnergyChart />
          </div>
          <EnvironmentCard data={environmentData} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Energy Today</h3>
            <p className="text-3xl font-bold font-mono text-gradient">285.6 kWh</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Carbon Offset</h3>
            <p className="text-3xl font-bold font-mono text-success">142.8 kg</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Cost Savings</h3>
            <p className="text-3xl font-bold font-mono text-warning">$48.50</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
