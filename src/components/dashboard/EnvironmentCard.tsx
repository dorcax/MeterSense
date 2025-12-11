import { Thermometer, Droplets, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnvironmentData {
  temperature: number;
  humidity: number;
  gasLevel: number;
}

interface EnvironmentCardProps {
  data: EnvironmentData;
}

const EnvironmentCard = ({ data }: EnvironmentCardProps) => {
  const getTemperatureStatus = (temp: number) => {
    if (temp > 40) return "critical";
    if (temp > 35) return "warning";
    return "normal";
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 80 || humidity < 20) return "warning";
    return "normal";
  };

  const getGasStatus = (level: number) => {
    if (level > 500) return "critical";
    if (level > 300) return "warning";
    return "normal";
  };

  const metrics = [
    {
      label: "Temperature",
      value: `${data.temperature}°C`,
      icon: Thermometer,
      status: getTemperatureStatus(data.temperature),
      progress: Math.min((data.temperature / 50) * 100, 100),
    },
    {
      label: "Humidity",
      value: `${data.humidity}%`,
      icon: Droplets,
      status: getHumidityStatus(data.humidity),
      progress: data.humidity,
    },
    {
      label: "Gas Level",
      value: `${data.gasLevel} ppm`,
      icon: Wind,
      status: getGasStatus(data.gasLevel),
      progress: Math.min((data.gasLevel / 600) * 100, 100),
    },
  ];

  const statusColors = {
    normal: "bg-primary",
    warning: "bg-warning",
    critical: "bg-destructive",
  };

  return (
    <div className="p-6 rounded-xl border border-border bg-card gradient-card">
      <h3 className="text-lg font-semibold mb-6">Environmental Sensors</h3>
      
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className={cn(
                  "h-4 w-4",
                  metric.status === "normal" && "text-primary",
                  metric.status === "warning" && "text-warning",
                  metric.status === "critical" && "text-destructive"
                )} />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
              <span className="font-mono font-semibold">{metric.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", statusColors[metric.status])}
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentCard;
