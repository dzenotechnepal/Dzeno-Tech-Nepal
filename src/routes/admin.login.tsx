import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    // Already logged in – redirect to admin
    window.location.href = "/admin";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      window.location.href = "/admin";
    } else {
      toast.error(result.error);
    }
  }

  const demoAccounts = [
    { email: "ceo@dzenotechnepal.com", label: "CEO (Super Admin)" },
    { email: "manager@dzenotechnepal.com", label: "Manager" },
    { email: "hr@dzenotechnepal.com", label: "HR" },
    { email: "dev@dzenotechnepal.com", label: "Developer" },
    { email: "trainer@dzenotechnepal.com", label: "Trainer" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-background to-indigo-50 dark:from-violet-950 dark:via-background dark:to-indigo-950 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
            <span className="text-lg font-bold">DT</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dzeno Tech Nepal — Internal Dashboard
          </p>
        </div>

        {/* Login card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Sign in to your account</CardTitle>
            <CardDescription className="text-xs">
              Use your assigned admin credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@dzenotechnepal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 text-sm"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 pr-9 text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="bg-muted/40">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Demo accounts (password: password123)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-1">
              {demoAccounts.map((acc) => (
                <li key={acc.email}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword("password123");
                    }}
                    className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-background transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-foreground">{acc.label}</span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                      {acc.email}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to main site
          </Link>
        </p>
      </div>
    </div>
  );
}
