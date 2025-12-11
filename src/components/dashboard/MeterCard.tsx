import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MeterCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
}

const MeterCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend = "stable", 
  trendValue,
  status = "normal" 
}: MeterCardProps) => {
  const statusColors = {
    normal: "border-primary/20 glow-primary",
    warning: "border-warning/20 glow-warning",
    critical: "border-destructive/20",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    stable: "text-muted-foreground",
  };

  return (
    <div className={cn(
      "relative p-6 rounded-xl border bg-card gradient-card transition-all duration-300 hover:scale-[1.02]",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-lg",
          status === "normal" && "bg-primary/10",
          status === "warning" && "bg-warning/10",
          status === "critical" && "bg-destructive/10"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            status === "normal" && "text-primary",
            status === "warning" && "text-warning",
            status === "critical" && "text-destructive"
          )} />
        </div>
        {status === "normal" && (
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        )}
      </div>

      <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold font-mono">{value}</span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>

      {trendValue && (
        <div className={cn("mt-3 text-sm flex items-center gap-1", trendColors[trend])}>
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "stable" && "→"}
          <span>{trendValue}</span>
        </div>
      )}

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
        <div className={cn(
          "h-full w-full",
          status === "normal" && "gradient-primary",
          status === "warning" && "bg-warning",
          status === "critical" && "bg-destructive"
        )} style={{ opacity: 0.5 }} />
      </div>
    </div>
  );
};

export default MeterCard;
