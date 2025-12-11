import { 
  Gauge, 
  Thermometer, 
  Cpu, 
  Cloud, 
  MonitorSmartphone,
  ArrowRight,
  Wifi,
  Database,
  BarChart3
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Gauge,
    title: "Meter Connection",
    description: "The IoT device connects directly to your energy meters (solar inverters, grid meters, generators) via RS485, Modbus, or pulse output interfaces.",
    details: [
      "Supports multiple meter protocols",
      "Non-invasive installation",
      "Real-time data acquisition",
      "Multi-point measurement"
    ]
  },
  {
    icon: Thermometer,
    title: "Sensor Integration",
    description: "Environmental sensors continuously monitor temperature, humidity, and gas levels to provide comprehensive site conditions data.",
    details: [
      "Temperature monitoring (-40°C to +125°C)",
      "Humidity sensing (0-100% RH)",
      "Gas detection (CO2, CH4, etc.)",
      "Ambient light sensing"
    ]
  },
  {
    icon: Cpu,
    title: "Controller Processing",
    description: "An embedded microcontroller processes all incoming data, performs local calculations, and prepares data packets for transmission.",
    details: [
      "Edge computing capabilities",
      "Data aggregation & filtering",
      "Local storage buffer",
      "Alarm threshold monitoring"
    ]
  },
  {
    icon: Cloud,
    title: "Cloud Communication",
    description: "Data is securely transmitted to our cloud platform using MQTT protocol, ensuring reliable and efficient message delivery.",
    details: [
      "MQTT broker connection",
      "TLS/SSL encryption",
      "QoS level 2 guarantee",
      "Automatic reconnection"
    ]
  },
  {
    icon: MonitorSmartphone,
    title: "Application & Visualization",
    description: "Our web application receives, stores, and visualizes the data in real-time dashboards accessible from any device.",
    details: [
      "Real-time dashboards",
      "Historical data analysis",
      "Custom reporting tools",
      "Mobile-responsive design"
    ]
  }
];

const HowItWorks = () => {
  return (
    <Layout>
      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-muted-foreground text-lg">
            Our IoT solution provides end-to-end monitoring from your meters to actionable insights.
            Here's how data flows through our system.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="relative p-8 rounded-2xl border border-border bg-card gradient-card overflow-hidden">
          <div className="absolute inset-0 gradient-accent opacity-50" />
          
          <div className="relative flex flex-wrap items-center justify-center gap-4 lg:gap-8">
            {[
              { icon: Gauge, label: "Meters" },
              { icon: Thermometer, label: "Sensors" },
              { icon: Cpu, label: "Controller" },
              { icon: Wifi, label: "MQTT" },
              { icon: Database, label: "Cloud" },
              { icon: BarChart3, label: "App" },
            ].map((item, index, arr) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    "bg-secondary border-primary/30 glow-primary"
                  )}>
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-primary hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-2xl border border-border bg-card gradient-card",
                "transition-all duration-300 hover:border-primary/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-primary-foreground font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {step.details.map((detail, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="p-8 rounded-2xl border border-border bg-card gradient-card">
          <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Protocol", value: "MQTT v5.0" },
              { label: "Security", value: "TLS 1.3" },
              { label: "Database", value: "Time-series DB" },
              { label: "API", value: "REST + WebSocket" },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-lg bg-secondary/50">
                <p className="text-muted-foreground text-sm mb-1">{item.label}</p>
                <p className="font-semibold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
