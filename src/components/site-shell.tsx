import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";

import { studio } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/gallery" },
  { label: "Pricing", to: "/pricing" },
  { label: "Help", to: "/help" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4.5" />
            </span>
            <span className="truncate text-base font-bold">{studio.name}</span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <Button key={l.to} asChild variant="ghost" size="sm">
                  <Link to={l.to}>{l.label}</Link>
                </Button>
              ))}
            </nav>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">Open studio</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
                <nav className="flex flex-col gap-1 p-3">
                  {[
                    ...links,
                    { label: "Log in", to: "/login" },
                    { label: "Sign up", to: "/signup" },
                  ].map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-accent"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="min-w-0">
            <p className="text-sm font-bold">{studio.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{studio.tagline}</p>
          </div>
          <FooterCol
            title="Product"
            items={["Dashboard", "2D Planner", "3D / VR Studio", "Procurement"]}
          />
          <FooterCol title="Studio" items={["Pricing", "Gallery", "Help Center", "Profile"]} />
          <FooterCol
            title="Contact"
            items={["hello@atelierverde.in", "+91 98450 00000", "Bengaluru, India"]}
          />
        </div>
        <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          Sample content for demonstration. © 2026 {studio.name}.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="truncate text-sm">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
