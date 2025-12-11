import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface MeterCardProps {
  title: string;
  value: number | string;
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
  status = "normal",
}: MeterCardProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Smooth transition for value changes
    const timeout = setTimeout(() => setDisplayValue(value), 200);
    return () => clearTimeout(timeout);
  }, [value]);

  const statusColors = {
    normal: "border-primary/20 glow-primary",
    warning: "border-warning/20 glow-warning",
    critical: "border-destructive/20 glow-destructive",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    stable: "text-muted-foreground",
  };

  const trendSymbols = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border bg-card gradient-card transition-all duration-300 hover:scale-[1.02] shadow-md",
        statusColors[status]
      )}
      aria-label={`${title}: ${displayValue}${unit}, status: ${status}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-lg transition-colors duration-300",
            status === "normal" && "bg-primary/10",
            status === "warning" && "bg-warning/10",
            status === "critical" && "bg-destructive/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6 transition-colors duration-300",
              status === "normal" && "text-primary",
              status === "warning" && "text-warning",
              status === "critical" && "text-destructive"
            )}
          />
        </div>
        {status === "normal" && (
          <div className="w-2 h-2 rounded-full bg-success animate-pulse mt-1" />
        )}
        {status === "warning" && (
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse mt-1" />
        )}
        {status === "critical" && (
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse mt-1" />
        )}
      </div>

      <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>

      <div className="flex items-baseline gap-2 transition-all duration-300">
        <span className="text-3xl font-bold font-mono">{displayValue}</span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>

      {trendValue && (
        <div
          className={cn(
            "mt-3 text-sm flex items-center gap-1 transition-all duration-300",
            trendColors[trend]
          )}
        >
          <span
            className={cn(
              "transition-transform duration-300",
              trend === "up" && "animate-bounce",
              trend === "down" && "animate-bounce-reverse"
            )}
          >
            {trendSymbols[trend]}
          </span>
          <span>{trendValue}</span>
        </div>
      )}

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
        <div
          className={cn(
            "h-full w-full transition-colors duration-300",
            status === "normal" && "gradient-primary",
            status === "warning" && "bg-warning",
            status === "critical" && "bg-destructive"
          )}
          style={{ opacity: 0.5 }}
        />
      </div>
    </div>
  );
};

export default MeterCard;
