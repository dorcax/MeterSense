import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  FileBarChart, 
  Wrench,
  Cog,
  Activity,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLogout } from "@/utils/logout";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Utility Area", path: "/utility", icon: Building2 },
  { title: "Reports", path: "/reports", icon: FileBarChart },
  { title: "Maintenance Cost", path: "/maintenance", icon: Wrench },
  { title: "Equipment", path: "/equipment", icon: Cog },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const logout = useLogout();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isCollapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300",
          "w-64 lg:translate-x-0",
          isCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">MeterSense</h1>
                <p className="text-xs text-muted-foreground">IoT Monitoring</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsCollapsed(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-primary glow-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span className={cn("font-medium", isActive && "text-primary")}>
                    {item.title}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </NavLink>
              );
            })}
            <Button onClick={logout} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Logout
      </Button>
          </nav>

          {/* Status indicator */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xs text-muted-foreground">All devices online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
