import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Utility from "./pages/Utility";
import Reports from "./pages/Reports";
import MaintenanceCost from "./pages/MaintenanceCost";
import Equipment from "./pages/Equipment";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./ProtectedRoute";
import Index from "./pages/Index";
import { UnprotectedRoute } from "./UnProtectedRoute";
import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/utility"
              element={
                <PrivateRoute>
                  <Utility />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <PrivateRoute>
                  <MaintenanceCost />
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <PrivateRoute>
                  <Equipment />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<UnprotectedRoute><Login /></UnprotectedRoute>} />
            <Route path="/signup" element={<UnprotectedRoute><Signup /></UnprotectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    <HotToaster position="top-right" reverseOrder={false} />
  </>
);

export default App;
