import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- localStorage helper functions ---
interface User {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "users";

const signupUser = (user: User) => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  if (users.find(u => u.email === user.email)) {
    return { success: false, message: "Email already exists" };
  }

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
};

// --- Component ---
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupUser({ name, email, password });
    if (result.success) {
      navigate("/login"); // redirect to login after successful signup
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="flex items-center gap-2 border border-border rounded-lg p-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="border-none focus:ring-0 flex-1"
                required
              />
            </div>
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
              Sign Up
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
