// utils/logout.ts
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem("currentUser");
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return logout;
};
