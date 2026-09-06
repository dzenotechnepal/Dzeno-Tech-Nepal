import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  // { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel border-b" : "border-b border-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="Dzeno Tech logo" width={36} height={36} className="h-12 w-36" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-3.5 py-2 text-sm transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="group hidden items-center gap-2 rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] sm:inline-flex"
          >
            Let's Talk
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel border-t lg:hidden">
          <ul className="container-x flex flex-col py-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="block py-3 text-lg tracking-tight"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-accent px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Let's Talk <ArrowRight className="size-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
