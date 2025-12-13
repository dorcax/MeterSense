import { useEffect } from "react";
import toast, { ToastOptions } from "react-hot-toast";

type AlertType = "normal" | "warning" | "critical";

interface Alert {
  message: string;
  type: AlertType;
}

const alertMessages: Record<AlertType, string[]> = {
  normal: [
    "Generator running smoothly.",
    "Fuel level sufficient.",
    "All sensors operational.",
  ],
  warning: [
    "Fuel level below 50%.",
    "Temperature rising above normal.",
    "Maintenance required soon.",
  ],
  critical: [
    "Generator stopped unexpectedly!",
    "Fuel depleted!",
    "Critical temperature reached!",
  ],
};

const alertStyles: Record<AlertType, ToastOptions> = {
  normal: { style: { background: "#22c55e", color: "#fff" } },
  warning: { style: { background: "#facc15", color: "#000" } },
  critical: { style: { background: "#ef4444", color: "#fff" } },
};

export const useRandomAlert = (intervalTime = 10000) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random type
      const types: AlertType[] = ["normal", "warning", "critical"];
      const type = types[Math.floor(Math.random() * types.length)];

      // Pick a random message from that type
      const messages = alertMessages[type];
      const message = messages[Math.floor(Math.random() * messages.length)];

      // Show the toast
      toast(message, alertStyles[type]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);
};
