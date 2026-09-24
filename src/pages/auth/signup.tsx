import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Seo } from "@/components/seo";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ name: "Meera Nair", email: "you@studio.in" });
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/50 to-background px-4 py-12">
      <Seo
        title="Create your studio — Canvas"
        description="Set up an interior design studio workspace with a 14-day trial."
      />
      <Card className="w-full max-w-lg">
        <CardContent className="px-6 py-2">
          <h1 className="text-2xl font-bold">Create your studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            14-day trial of the full workspace. No card needed.
          </p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" className="h-11" placeholder="Meera Nair" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio">Studio name</Label>
              <Input id="studio" className="h-11" placeholder="Canvas" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email2">Work email</Label>
              <Input id="email2" type="email" className="h-11" placeholder="you@studio.in" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Team size</Label>
              <Select>
                <SelectTrigger id="size" className="h-11 w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Just me</SelectItem>
                  <SelectItem value="small">2 – 10</SelectItem>
                  <SelectItem value="large">11 – 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass2">Password</Label>
              <Input id="pass2" type="password" className="h-11" placeholder="••••••••" />
            </div>
            <Button className="h-11 sm:col-span-2" type="submit">
              Create studio
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
