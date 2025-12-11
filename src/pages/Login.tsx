import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- localStorage helper ---
interface User {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const loginUser = (email: string, password: string) => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: "Invalid email or password" };
};

// --- Component ---
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser(email, password);
    if (result.success) {
      navigate("/"); // redirect to protected page
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex items-center gap-2 border border-border rounded-lg p-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="border-none focus:ring-0 flex-1"
                required
              />
            </div>
            <div className="flex items-center gap-2 border border-border rounded-lg p-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="border-none focus:ring-0 flex-1"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Login
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign Up</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
