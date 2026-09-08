import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { studio } from "@/data/mock";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Atelier Verde studio" },
      { name: "description", content: "Sign in to your interior design studio workspace." },
      { property: "og:title", content: "Log in — Atelier Verde studio" },
      { property: "og:description", content: "Sign in to your interior design studio workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-4.5" />
          </span>
          <span className="font-bold">{studio.name}</span>
        </div>
        <div>
          <p className="text-3xl font-extrabold leading-tight">Lead to handover, in one workspace.</p>
          <p className="mt-4 max-w-md text-sm text-sidebar-foreground/70">
            Quotations, floor plans, VR walkthroughs, approvals, procurement and accounts — all connected to the project.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/50">Sample workspace with demo content.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="px-6 py-2">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Log in to continue to your studio.</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="you@studio.in" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="h-11" />
              </div>
              <Button asChild className="h-11 w-full">
                <Link to="/dashboard">Log in</Link>
              </Button>
              <Button variant="outline" className="h-11 w-full" type="button">
                Continue with Google
              </Button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground">
              New to Atelier Verde?{" "}
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
