import { Link } from "@tanstack/react-router";
import { Linkedin, Facebook, Github, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="hairline-top mt-24 bg-background">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Dzeno Tech logo" width={36} height={36} loading="lazy" className="h-8 w-8" />
            <span className="font-semibold tracking-tight">Dzeno Tech Nepal Pvt. Ltd.</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We Build Technology That Moves Businesses Forward.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Github, label: "GitHub" },
              { Icon: Mail, label: "Email" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`${label} (placeholder link)`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/team", label: "Team" },
              { to: "/careers", label: "Careers" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {["Software Development", "IT Services", "IT Training"].map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline-top">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Dzeno Tech Nepal Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
