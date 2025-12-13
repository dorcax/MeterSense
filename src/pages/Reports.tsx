import { useEffect, useRef, useState } from "react";
import {
  FileBarChart,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import ExportButton from "@/components/ExportButton";

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

const INTERVAL_TIME = 2000;

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(initialMonthlyData);
  const [sourceDistribution, setSourceDistribution] = useState<SourceDistribution[]>(initialSourceDistribution);
  const [costTrend, setCostTrend] = useState<CostTrend[]>(initialCostTrend);

  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setMonthlyData((prev) =>
        prev.map((m) => ({
          ...m,
          solar: Math.max(0, Math.round(m.solar + (Math.random() * 300 - 150))),
          grid: Math.max(0, Math.round(m.grid + (Math.random() * 150 - 75))),
          generator: Math.max(0, Math.round(m.generator + (Math.random() * 40 - 20))),
        }))
      );

      setSourceDistribution((prev) =>
        prev.map((s) => ({
          ...s,
          value: Math.max(0, +(s.value + (Math.random() * 3 - 1.5)).toFixed(1)),
        }))
      );

      setCostTrend((prev) =>
        prev.map((c) => ({
          ...c,
          cost: Math.max(0, Math.round(c.cost + (Math.random() * 80 - 40))),
        }))
      );
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, []);

  const totalGeneration = monthlyData.reduce((acc, m) => acc + m.solar + m.grid + m.generator, 0);
  const gridConsumption = monthlyData.reduce((acc, m) => acc + m.grid, 0);
  const totalCost = costTrend.reduce((acc, c) => acc + c.cost, 0);
  const carbonSaved = totalGeneration * 0.00052;

  const getTrend = (current: number, base: number) => {
    const change = ((current - base) / base) * 100;
    return { up: change >= 0, value: change.toFixed(1) };
  };

  const monthNameToIndex = (month: string) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].indexOf(month);

  const filteredMonthly = monthlyData.filter((m) => {
    if (!dateRange.from || !dateRange.to) return true;
    const idx = monthNameToIndex(m.month);
    const start = dateRange.from.getMonth();
    const end = dateRange.to.getMonth();
    return idx >= start && idx <= end;
  });

  const filteredCost = costTrend.slice(0, filteredMonthly.length);

  const filteredPie =
    sourceFilter === "all"
      ? sourceDistribution
      : sourceDistribution.filter(
        (s) => s.name.toLowerCase() === sourceFilter.toLowerCase()
      );


  const barRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);




  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Detailed analytics and usage reports</p>
          </div>

          <div className="flex items-center gap-3">

            {/* Date Range */}
            {/* <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  <Calendar className="h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                    : "Date Range"}
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <DatePicker
                    mode="range"
                    selected={dateRange}
                    onSelect={(r: any) => setDateRange(r)}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover> */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  <Calendar className="h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                    : "Date Range"}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={8}
                className="p-2 w-auto max-w-[95vw] rounded-lg border bg-popover shadow-lg overflow-x-auto"
              >
                <DatePicker
                  mode="range"
                  selected={dateRange}
                  onSelect={(r: any) => setDateRange(r)}
                  numberOfMonths={
                    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2
                  }
                />
              </PopoverContent>
            </Popover>


            {/* Source Filter */}
            <Select
              onValueChange={(v) => setSourceFilter(v)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[140px] px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <Filter className="h-4 w-4 mr-2 inline-block" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="generator">Generator</SelectItem>
              </SelectContent>
            </Select>

            {/* EXPORT BUTTON */}
            <ExportButton
              datasets={{
                monthlyData,
                sourceDistribution,
                costTrend,
                filteredMonthly,
                filteredPie,
                filteredCost,
              }}
              filename="utility_report"
              chartRefs={{ barRef, pieRef, lineRef }}
            />
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Total Generation",
              value: `${totalGeneration.toLocaleString()} kWh`,
              color: "text-gradient",
              trend: getTrend(totalGeneration, totalGeneration * 0.88),
            },
            {
              title: "Grid Consumption",
              value: `${gridConsumption.toLocaleString()} kWh`,
              color: "text-warning",
              trend: getTrend(gridConsumption, gridConsumption * 1.18),
            },
            {
              title: "Total Cost",
              value: `$${totalCost.toLocaleString()}`,
              color: "text-primary",
              trend: getTrend(totalCost, totalCost * 1.22),
            },
            {
              title: "Carbon Saved",
              value: `${carbonSaved.toFixed(2)} tons`,
              color: "text-success",
              trend: { up: true, value: "15.0" },
            },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card gradient-card">
              <p className="text-muted-foreground text-sm mb-2">{item.title}</p>
              <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
              <p className="text-xs mt-1 flex items-center gap-1">
                {item.trend.up ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {item.trend.value}% from last month
              </p>
            </div>
          ))}
        </div>

        {/* MONTHLY BAR CHART */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div ref={barRef} className="p-6 rounded-xl border border-border bg-card gradient-card">
            <div className="flex items-center gap-2 mb-6">
              <FileBarChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Monthly Energy by Source</h3>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
                  <YAxis stroke="hsl(215, 20%, 55%)" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 9%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                    }}
                  />

                  <Bar dataKey="solar" fill="hsl(174, 72%, 52%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grid" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="generator" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE DISTRIBUTION */}
          <div ref={pieRef} className="p-6 rounded-xl border border-border bg-card gradient-card">
            <h3 className="text-lg font-semibold mb-6">Energy Source Distribution</h3>

            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {filteredPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 9%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {filteredPie.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COST TREND LINE CHART */}
        <div ref={lineRef} className="p-6 rounded-xl border border-border bg-card gradient-card">
          <h3 className="text-lg font-semibold mb-6">Monthly Cost Trend</h3>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
                <YAxis stroke="hsl(215, 20%, 55%)" />

                <Tooltip
                  formatter={(value) => [`$${value}`, "Cost"]}
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 9%)",
                    border: "1px solid hsl(222, 30%, 18%)",
                    borderRadius: "8px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="hsl(174, 72%, 52%)"
                  strokeWidth={3}
                  dot={{
                    fill: "hsl(174, 72%, 52%)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Reports;
