import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { Seo } from "@/components/seo";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { studio } from "@/data/mock";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ name: "Meera Nair", email });
    navigate(from, { replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Seo
        title="Log in — Canvas studio"
        description="Sign in to your interior design studio workspace."
      />

      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-4.5" />
          </span>
          <span className="font-bold">{studio.name}</span>
        </div>
        <div>
          <p className="text-3xl font-extrabold leading-tight">
            Lead to handover, in one workspace.
          </p>
          <p className="mt-4 max-w-md text-sm text-sidebar-foreground/70">
            Quotations, floor plans, VR walkthroughs, approvals, procurement and accounts — all
            connected to the project.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/50">Sample workspace with demo content.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="px-6 py-2">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Log in to continue to your studio.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@studio.in"
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="h-11 w-full" type="submit">
                Log in
              </Button>
              <Button variant="outline" className="h-11 w-full" type="button">
                Continue with Google
              </Button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground">
              New to Canvas?{" "}
              <Link to="/signup" className="font-medium text-foreground underline">
                Create a studio
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
