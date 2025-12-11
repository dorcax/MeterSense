import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Calendar
} from "lucide-react";
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
  Cell
} from "recharts";

const initialMaintenanceItems = [
  { id: 1, equipment: "Generator Unit A", task: "Oil Change & Filter Replacement", status: "due", dueDate: "Dec 15, 2024", cost: 450, priority: "high" },
  { id: 2, equipment: "Solar Panel Array", task: "Panel Cleaning & Inspection", status: "scheduled", dueDate: "Dec 20, 2024", cost: 200, priority: "medium" },
  { id: 3, equipment: "Inverter System", task: "Firmware Update & Calibration", status: "completed", dueDate: "Dec 5, 2024", cost: 150, priority: "low" },
  { id: 4, equipment: "Building A Meter", task: "Sensor Replacement", status: "due", dueDate: "Dec 12, 2024", cost: 320, priority: "high" },
  { id: 5, equipment: "Generator Unit B", task: "Coolant System Service", status: "scheduled", dueDate: "Dec 25, 2024", cost: 380, priority: "medium" },
  { id: 6, equipment: "Battery Storage", task: "Cell Testing & Balancing", status: "completed", dueDate: "Dec 3, 2024", cost: 275, priority: "low" },
];

const initialMonthlyCostData = [
  { category: "Generator", cost: 830 },
  { category: "Solar", cost: 200 },
  { category: "Inverter", cost: 150 },
  { category: "Meters", cost: 320 },
  { category: "Battery", cost: 275 },
];

const initialCostDistribution = [
  { name: "Labor", value: 45, color: "hsl(var(--primary))" },
  { name: "Parts", value: 35, color: "hsl(var(--success))" },
  { name: "Service Fee", value: 20, color: "hsl(var(--warning))" },
];

const MaintenanceCost = () => {
  const [maintenanceItems, setMaintenanceItems] = useState(initialMaintenanceItems);
  const [monthlyCostData, setMonthlyCostData] = useState(initialMonthlyCostData);
  const [costDistribution, setCostDistribution] = useState(initialCostDistribution);

  // Simulate live updates for costs
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthlyCostData(prev => prev.map(item => ({
        ...item,
        cost: Math.max(0, item.cost + (Math.random() * 50 - 25))
      })));
      setMaintenanceItems(prev => prev.map(item => ({
        ...item,
        cost: Math.max(0, item.cost + (Math.random() * 20 - 10))
      })));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const totalMonthlyCost = monthlyCostData.reduce((sum, item) => sum + item.cost, 0);
  const dueCount = maintenanceItems.filter(item => item.status === "due").length;
  const scheduledCount = maintenanceItems.filter(item => item.status === "scheduled").length;
  const completedCount = maintenanceItems.filter(item => item.status === "completed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "due": return <Badge variant="destructive" className="gap-1 animate-pulse"><AlertTriangle className="h-3 w-3" /> Due</Badge>;
      case "scheduled": return <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning border-warning/30"><Clock className="h-3 w-3 animate-spin" /> Scheduled</Badge>;
      case "completed": return <Badge variant="secondary" className="gap-1 bg-success/20 text-success border-success/30"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive font-semibold";
      case "medium": return "text-warning font-medium";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const calculateProgress = (priority: string) => {
    switch(priority) {
      case "high": return 90;
      case "medium": return 60;
      case "low": return 30;
      default: return 0;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Maintenance Cost</h1>
          <p className="text-muted-foreground mt-1">Track maintenance schedules and associated costs</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
                  <p className="text-2xl font-bold text-primary">${totalMonthlyCost.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Due Now</p>
                  <p className="text-2xl font-bold text-destructive">{dueCount}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-warning">{scheduledCount}</p>
                </div>
                <Calendar className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{completedCount}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost by Category */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Cost by Equipment Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: number) => [`$${value}`, "Cost"]}/>
                    <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Cost Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={costDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {costDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: number) => [`${value}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 ml-4">
                  {costDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Items List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{item.equipment}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.task}</p>
                    <Progress value={calculateProgress(item.priority)} className="h-2 mt-2 rounded-full" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {item.dueDate} • Priority: <span className={getPriorityColor(item.priority)}>{item.priority}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">${item.cost}</p>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MaintenanceCost;
