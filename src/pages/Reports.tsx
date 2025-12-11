import { useEffect, useState } from "react";
import { FileBarChart, Download, Calendar, Filter, TrendingUp, TrendingDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface MonthlyData {
  month: string;
  solar: number;
  grid: number;
  generator: number;
}

interface CostTrend {
  month: string;
  cost: number;
}

interface SourceDistribution {
  name: string;
  value: number;
  color: string;
}

const initialMonthlyData: MonthlyData[] = [
  { month: "Jan", solar: 4200, grid: 2800, generator: 400 },
  { month: "Feb", solar: 4800, grid: 2400, generator: 300 },
  { month: "Mar", solar: 5500, grid: 2100, generator: 200 },
  { month: "Apr", solar: 6200, grid: 1800, generator: 100 },
  { month: "May", solar: 7100, grid: 1500, generator: 50 },
  { month: "Jun", solar: 7800, grid: 1200, generator: 0 },
];

const initialSourceDistribution: SourceDistribution[] = [
  { name: "Solar", value: 58, color: "hsl(174, 72%, 52%)" },
  { name: "Grid", value: 35, color: "hsl(38, 92%, 50%)" },
  { name: "Generator", value: 7, color: "hsl(0, 72%, 51%)" },
];

const initialCostTrend: CostTrend[] = [
  { month: "Jan", cost: 1250 },
  { month: "Feb", cost: 1180 },
  { month: "Mar", cost: 1050 },
  { month: "Apr", cost: 920 },
  { month: "May", cost: 780 },
  { month: "Jun", cost: 650 },
];


const INTERVAL_TIME = 1000;

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(initialMonthlyData);
  const [sourceDistribution, setSourceDistribution] = useState<SourceDistribution[]>(initialSourceDistribution);
  const [costTrend, setCostTrend] = useState<CostTrend[]>(initialCostTrend);

  // Simulate live updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthlyData(prev => 
        prev.map(month => ({
          ...month,
          solar: Math.max(0, month.solar + (Math.random() * 200 - 100)),
          grid: Math.max(0, month.grid + (Math.random() * 100 - 50)),
          generator: Math.max(0, month.generator + (Math.random() * 50 - 25)),
        }))
      );

      setSourceDistribution(prev => {
        const total = prev.reduce((acc, s) => acc + s.value, 0);
        return prev.map(s => ({
          ...s,
          value: Math.max(0, s.value + (Math.random() * 4 - 2))
        }));
      });

      setCostTrend(prev =>
        prev.map(month => ({
          ...month,
          cost: Math.max(0, month.cost + (Math.random() * 100 - 50))
        }))
      );
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, []);

  // Calculate summary stats
  const totalGeneration = monthlyData.reduce((acc, m) => acc + m.solar + m.grid + m.generator, 0);
  const gridConsumption = monthlyData.reduce((acc, m) => acc + m.grid, 0);
  const totalCost = costTrend.reduce((acc, c) => acc + c.cost, 0);
  const carbonSaved = totalGeneration * 0.0005; // simulated metric

  // Utility to get trend arrow and color
  const getTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: <TrendingUp className="h-4 w-4" />, color: "text-success", label: `+${((current - previous) / previous * 100).toFixed(1)}%` };
    if (current < previous) return { icon: <TrendingDown className="h-4 w-4" />, color: "text-destructive", label: `${((current - previous) / previous * 100).toFixed(1)}%` };
    return { icon: null, color: "text-muted-foreground", label: "0%" };
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Detailed analytics and usage reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <p className="text-muted-foreground text-sm mb-2">Total Generation</p>
            <p className="text-2xl font-bold font-mono text-gradient">{totalGeneration.toLocaleString()} kWh</p>
            <p className="text-xs text-success mt-1">{getTrend(totalGeneration, totalGeneration * 0.88).label} from last month</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <p className="text-muted-foreground text-sm mb-2">Grid Consumption</p>
            <p className="text-2xl font-bold font-mono text-warning">{gridConsumption.toLocaleString()} kWh</p>
            <p className="text-xs text-success mt-1">{getTrend(gridConsumption, gridConsumption * 1.18).label} from last month</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <p className="text-muted-foreground text-sm mb-2">Total Cost</p>
            <p className="text-2xl font-bold font-mono">${totalCost.toLocaleString()}</p>
            <p className="text-xs text-success mt-1">{getTrend(totalCost, totalCost * 1.22).label} from last month</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <p className="text-muted-foreground text-sm mb-2">Carbon Saved</p>
            <p className="text-2xl font-bold font-mono text-success">{carbonSaved.toFixed(2)} tons</p>
            <p className="text-xs text-success mt-1">↑ 15% from last month</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Energy by Source */}
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <div className="flex items-center gap-2 mb-6">
              <FileBarChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Monthly Energy by Source</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }}
                  />
                  <Bar dataKey="solar" fill="hsl(174, 72%, 52%)" radius={[4,4,0,0]} />
                  <Bar dataKey="grid" fill="hsl(38, 92%, 50%)" radius={[4,4,0,0]} />
                  <Bar dataKey="generator" fill="hsl(0, 72%, 51%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Energy Source Distribution */}
          <div className="p-6 rounded-xl border border-border bg-card gradient-card">
            <h3 className="text-lg font-semibold mb-6">Energy Source Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {sourceDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}: {item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Trend */}
        <div className="p-6 rounded-xl border border-border bg-card gradient-card">
          <h3 className="text-lg font-semibold mb-6">Monthly Cost Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }}
                  formatter={(value) => [`$${value}`, "Cost"]}
                />
                <Line type="monotone" dataKey="cost" stroke="hsl(174, 72%, 52%)" strokeWidth={3} dot={{ fill: "hsl(174, 72%, 52%)", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
