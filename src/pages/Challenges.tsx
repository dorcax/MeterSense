import { 
  Wifi, 
  Shield, 
  Zap, 
  Settings, 
  ThermometerSun,
  Clock,
  DollarSign,
  Users,
  CheckCircle2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const challenges = [
  {
    icon: Wifi,
    title: "Network Connectivity",
    description: "Remote sites may have limited or unreliable internet connectivity, affecting real-time data transmission.",
    solutions: [
      "Cellular backup connectivity (4G/LTE)",
      "Local data buffering during outages",
      "Optimized data compression",
      "Multiple communication protocols support"
    ],
    severity: "high"
  },
  {
    icon: Shield,
    title: "Security & Data Privacy",
    description: "Protecting sensitive energy data from unauthorized access and cyber threats is critical.",
    solutions: [
      "End-to-end encryption (TLS 1.3)",
      "Device authentication certificates",
      "Role-based access control",
      "Regular security audits"
    ],
    severity: "high"
  },
  {
    icon: ThermometerSun,
    title: "Environmental Conditions",
    description: "Harsh environments (extreme temperatures, humidity, dust) can affect device performance and longevity.",
    solutions: [
      "IP65/IP67 rated enclosures",
      "Wide temperature range operation",
      "Conformal coating on electronics",
      "Regular maintenance schedules"
    ],
    severity: "medium"
  },
  {
    icon: Zap,
    title: "Power Supply",
    description: "Ensuring continuous power for IoT devices, especially in locations with unreliable electricity.",
    solutions: [
      "Solar-powered backup systems",
      "Battery backup with monitoring",
      "Low-power operation modes",
      "UPS integration options"
    ],
    severity: "medium"
  },
  {
    icon: Settings,
    title: "Integration Complexity",
    description: "Different meter types, protocols, and legacy systems require flexible integration approaches.",
    solutions: [
      "Multi-protocol support (Modbus, RS485)",
      "Custom adapter development",
      "API-based integration",
      "Backward compatibility maintenance"
    ],
    severity: "medium"
  },
  {
    icon: Clock,
    title: "Data Latency",
    description: "Achieving near real-time data updates while managing bandwidth and processing constraints.",
    solutions: [
      "Edge computing for local processing",
      "Configurable update intervals",
      "Priority-based data transmission",
      "WebSocket for live updates"
    ],
    severity: "low"
  },
  {
    icon: DollarSign,
    title: "Implementation Costs",
    description: "Balancing comprehensive monitoring needs with budget constraints for hardware and infrastructure.",
    solutions: [
      "Modular system architecture",
      "Scalable deployment options",
      "ROI-focused feature prioritization",
      "Flexible pricing models"
    ],
    severity: "medium"
  },
  {
    icon: Users,
    title: "User Training",
    description: "Ensuring facility staff can effectively use and maintain the monitoring system.",
    solutions: [
      "Intuitive user interface design",
      "Comprehensive documentation",
      "Video tutorials & guides",
      "24/7 technical support"
    ],
    severity: "low"
  }
];

const severityColors = {
  high: "border-destructive/30 hover:border-destructive/50",
  medium: "border-warning/30 hover:border-warning/50",
  low: "border-primary/30 hover:border-primary/50",
};

const severityBadges = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-primary/10 text-primary",
};

const Challenges = () => {
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Implementation Challenges</h1>
          <p className="text-muted-foreground text-lg">
            Understanding and addressing common challenges is crucial for successful IoT deployment.
            Here are the key considerations and our solutions.
          </p>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-destructive/30 bg-card gradient-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">High Priority</span>
            </div>
            <p className="text-3xl font-bold font-mono">
              {challenges.filter(c => c.severity === "high").length}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-warning/30 bg-card gradient-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">Medium Priority</span>
            </div>
            <p className="text-3xl font-bold font-mono">
              {challenges.filter(c => c.severity === "medium").length}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-primary/30 bg-card gradient-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Low Priority</span>
            </div>
            <p className="text-3xl font-bold font-mono">
              {challenges.filter(c => c.severity === "low").length}
            </p>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <div 
              key={challenge.title}
              className={cn(
                "p-6 rounded-xl border bg-card gradient-card transition-all duration-300",
                severityColors[challenge.severity]
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-3 rounded-lg", severityBadges[challenge.severity])}>
                    <challenge.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full uppercase font-medium",
                      severityBadges[challenge.severity]
                    )}>
                      {challenge.severity} priority
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{challenge.description}</p>

              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Our Solutions:</p>
                {challenge.solutions.map((solution, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="p-8 rounded-2xl border border-primary/30 bg-card gradient-card text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team of experts is here to help you navigate these challenges and implement 
            a robust IoT monitoring solution tailored to your needs.
          </p>
          <button className="px-8 py-3 rounded-lg gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary">
            Contact Our Team
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Challenges;
