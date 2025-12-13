// src/pages/Utility.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Zap,
  TrendingUp,
  TrendingDown,
  Edit3,
  Trash2,
  Plus,
  MoreHorizontal
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Trend = "up" | "down" | "stable";
type Status = "normal" | "warning" | "critical";

interface Building {
  id: number;
  name: string;
  usage: number; // current usage (kW)
  trend: Trend;
  trendValue: number; // percent change since last tick
  devices: number;
  status: Status;
  history?: number[]; // last N usage points for sparkline
}

const STORAGE_KEY = "app_buildings_v1";
const INTERVAL_TIME = 3000; // ms
const HISTORY_POINTS = 20; // sparkline length

const initialBuildings: Building[] = [
  { id: 1, name: "Main Office", usage: 45.2, trend: "up", trendValue: 8, devices: 12, status: "normal", history: [] },
  { id: 2, name: "Warehouse A", usage: 28.7, trend: "down", trendValue: 5, devices: 8, status: "normal", history: [] },
  { id: 3, name: "Production Floor", usage: 89.4, trend: "up", trendValue: 15, devices: 24, status: "warning", history: [] },
  { id: 4, name: "Server Room", usage: 32.1, trend: "stable", trendValue: 0, devices: 6, status: "normal", history: [] },
  { id: 5, name: "Cafeteria", usage: 12.8, trend: "down", trendValue: 12, devices: 5, status: "normal", history: [] },
  { id: 6, name: "Parking Garage", usage: 8.5, trend: "up", trendValue: 3, devices: 4, status: "normal", history: [] },
];

// helpers
const getStatus = (usage: number): Status => {
  if (usage > 80) return "critical";
  if (usage > 50) return "warning";
  return "normal";
};

const readBuildingsFromStorage = (): Building[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Building[];
    if (!Array.isArray(parsed)) return null;
    // ensure history exists and length is bounded
    return parsed.map(b => ({
      ...b,
      history: Array.isArray(b.history) ? b.history.slice(-HISTORY_POINTS) : [],
    }));
  } catch {
    return null;
  }
};

const writeBuildingsToStorage = (data: Building[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write buildings to storage", e);
  }
};

// Tiny thin-line sparkline (SVG) — compact, no deps
const Sparkline = ({ points, width = 120, height = 28 }: { points: number[]; width?: number; height?: number; }) => {
  if (!points || points.length === 0) {
    // placeholder empty line
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
        <path d={`M0 ${height / 2} L ${width} ${height / 2}`} stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" />
      </svg>
    );
  }
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const step = width / (points.length - 1 || 1);

  const coords = points.map((v, i) => {
    const x = i * step;
    // invert y (svg y increases downward)
    const y = height - ((v - min) / range) * (height - 4) - 2; // padding 2px top/bottom
    return `${x},${y}`;
  });

  const path = `M${coords.join(" L ")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <path d={path} stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(255,255,255,0.85)" }} />
    </svg>
  );
};

const Utility = () => {
  // load & migrate if necessary
  const [buildings, setBuildings] = useState<Building[]>(() => {
    const stored = readBuildingsFromStorage();
    if (stored && stored.length > 0) {
      return stored;
    }
    // initialize history for initial data
    return initialBuildings.map(b => ({
      ...b,
      history: new Array(HISTORY_POINTS).fill(b.usage),
    }));
  });

  // toolbar state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sortOrder, setSortOrder] = useState<"none" | "high" | "low">("none");

  // modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  // form states
  const [formName, setFormName] = useState("");
  const [formDevices, setFormDevices] = useState<number>(1);
  const [formUsage, setFormUsage] = useState<number>(10);

  // persist whenever buildings changes
  useEffect(() => {
    writeBuildingsToStorage(buildings);
  }, [buildings]);

  // real-time simulation loop: update usage, trend, status, history
  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings(prev => {
        const next = prev.map(b => {
          // fluctuation -3 to +3
          const fluctuation = +(Math.random() * 6 - 3).toFixed(2);
          const newUsage = Math.max(0, +(b.usage + fluctuation).toFixed(1));
          const trend: Trend = newUsage > b.usage ? "up" : newUsage < b.usage ? "down" : "stable";
          const trendValue = b.usage === 0 ? Math.abs(Math.round(newUsage * 100)) : Math.abs(Math.round(((newUsage - b.usage) / b.usage) * 100));

          const newHistory = (b.history ?? []).slice();
          newHistory.push(newUsage);
          if (newHistory.length > HISTORY_POINTS) newHistory.shift();

          return {
            ...b,
            usage: newUsage,
            trend,
            trendValue,
            status: getStatus(newUsage),
            history: newHistory,
          };
        });
        // persist every tick too
        writeBuildingsToStorage(next);
        return next;
      });
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, []);

  // totals
  const totalUsage = useMemo(() => buildings.reduce((s, b) => s + b.usage, 0), [buildings]);
  const totalDevices = useMemo(() => buildings.reduce((s, b) => s + b.devices, 0), [buildings]);

  // toolbar: search/filter/sort pipeline
  const displayed = useMemo(() => {
    let list = buildings.slice();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(b => b.name.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      list = list.filter(b => b.status === statusFilter);
    }

    if (sortOrder === "high") list.sort((a, b) => b.usage - a.usage);
    if (sortOrder === "low") list.sort((a, b) => a.usage - b.usage);

    return list;
  }, [buildings, search, statusFilter, sortOrder]);

  // CRUD handlers
  const openAdd = () => {
    setFormName("");
    setFormDevices(1);
    setFormUsage(5);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newBuilding: Building = {
      id: Date.now(),
      name: formName || `Building ${buildings.length + 1}`,
      devices: formDevices,
      usage: +formUsage,
      trend: "stable",
      trendValue: 0,
      status: getStatus(formUsage),
      history: new Array(HISTORY_POINTS).fill(+formUsage),
    };
    setBuildings(prev => {
      const next = [...prev, newBuilding];
      writeBuildingsToStorage(next);
      return next;
    });
    setIsAddOpen(false);
  };

  const openEditModal = (b: Building) => {
    setEditingBuilding(b);
    setFormName(b.name);
    setFormDevices(b.devices);
    setFormUsage(b.usage);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingBuilding) return;
    setBuildings(prev => {
      const next = prev.map(b => b.id === editingBuilding.id ? {
        ...b,
        name: formName,
        devices: formDevices,
        usage: +formUsage,
        status: getStatus(formUsage),
        trend: "stable",
        trendValue: 0,
        history: (b.history ?? []).slice(-HISTORY_POINTS)
      } : b);
      writeBuildingsToStorage(next);
      return next;
    });
    setEditingBuilding(null);
    setIsEditOpen(false);
  };

  const openDeleteConfirm = (id: number) => {
    setToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (toDeleteId == null) return;
    setBuildings(prev => {
      const next = prev.filter(b => b.id !== toDeleteId);
      writeBuildingsToStorage(next);
      return next;
    });
    setToDeleteId(null);
    setIsDeleteOpen(false);
  };

  const pct = (value: number, total: number) => {
    if (!total) return 0;
    return Math.max(0, Math.min(100, (value / total) * 100));
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Utility Area</h1>
          <p className="text-muted-foreground mt-1">Monitor energy consumption by building</p>
        </div>

        {/* Toolbar (search/filter/sort + Add) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-44" aria-label="Filter by status">
                <span className="px-2">{statusFilter === "all" ? "All statuses" : statusFilter}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
              <SelectTrigger className="w-44" aria-label="Sort by usage">
                <span className="px-2">{sortOrder === "none" ? "Sort: none" : sortOrder === "high" ? "Sort: high → low" : "Sort: low → high"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="high">Usage: High → Low</SelectItem>
                <SelectItem value="low">Usage: Low → High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button onClick={openAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Building
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Buildings</p>
                <p className="text-2xl font-bold">{buildings.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{totalUsage.toFixed(1)} kW</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <Zap className="h-6 w-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected Devices</p>
                <p className="text-2xl font-bold">{totalDevices}</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Building2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayed.map((b, idx) => (
            <div
              key={b.id}
              className={cn(
                "p-4 rounded-xl border bg-card transition-all duration-200",
                b.status === "normal" ? "border-border" :
                b.status === "warning" ? "border-warning/40 glow-warning" :
                "border-destructive/40 glow-destructive"
              )}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-md", b.status === "normal" ? "bg-primary/8" : b.status === "warning" ? "bg-warning/10" : "bg-destructive/10")}>
                    <Building2 className={cn("h-5 w-5", b.status === "normal" ? "text-primary" : b.status === "warning" ? "text-warning" : "text-destructive")} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="text-xs text-muted-foreground">{b.devices} devices</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <button title="More" className="p-1 rounded hover:bg-muted/20 transition">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Metric + trend */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono">{b.usage.toFixed(1)}</div>
                  <div className={cn("mt-1 text-sm flex items-center gap-2", b.trend === "up" ? "text-destructive" : b.trend === "down" ? "text-success" : "text-muted-foreground")}>
                    {b.trend === "up" && <TrendingUp className="h-4 w-4" />}
                    {b.trend === "down" && <TrendingDown className="h-4 w-4" />}
                    <span>
                      {b.trend === "stable" ? "No change" : `${b.trend === "up" ? "+" : "-"}${b.trendValue}%`}
                    </span>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="ml-4">
                  <Sparkline points={(b.history && b.history.length ? b.history : new Array(HISTORY_POINTS).fill(b.usage))} width={110} height={36} />
                </div>
              </div>

              {/* Usage bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Usage</span>
                  <span>{pct(b.usage, totalUsage).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", b.status === "normal" ? "gradient-primary" : b.status === "warning" ? "bg-warning" : "bg-destructive")}
                    style={{ width: `${pct(b.usage, totalUsage)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEditModal(b)} className="flex-1 p-2 rounded-md border border-border hover:bg-muted/20 transition text-sm flex items-center justify-center gap-2">
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
                <button onClick={() => openDeleteConfirm(b.id)} className="flex-1 p-2 rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition text-sm flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Building</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleAddSubmit(e); }} className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} required />
            </div>

            <div>
              <Label>Devices</Label>
              <Input type="number" min={1} value={formDevices} onChange={(e) => setFormDevices(Number(e.target.value))} required />
            </div>

            <div>
              <Label>Initial Usage (kW)</Label>
              <Input type="number" min={0} step="0.1" value={formUsage} onChange={(e) => setFormUsage(Number(e.target.value))} required />
            </div>

            <DialogFooter>
              <Button type="submit">Add</Button>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(e); }} className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} required />
            </div>

            <div>
              <Label>Devices</Label>
              <Input type="number" min={1} value={formDevices} onChange={(e) => setFormDevices(Number(e.target.value))} required />
            </div>

            <div>
              <Label>Usage (kW)</Label>
              <Input type="number" min={0} step="0.1" value={formUsage} onChange={(e) => setFormUsage(Number(e.target.value))} required />
            </div>

            <DialogFooter>
              <Button type="submit">Save</Button>
              <Button variant="ghost" onClick={() => { setIsEditOpen(false); setEditingBuilding(null); }}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Building</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="destructive" onClick={handleDeleteConfirmed}>Delete</Button>
            <Button variant="ghost" onClick={() => { setIsDeleteOpen(false); setToDeleteId(null); }}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Utility;
