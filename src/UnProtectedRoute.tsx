// components/UnprotectedRoute.tsx
import { Navigate } from "react-router-dom";

interface UnprotectedRouteProps {
  children: JSX.Element;
}

export const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const currentUser = localStorage.getItem("currentUser");

  // If user is already logged in, redirect to dashboard ("/")
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the requested page
  return children;
};
