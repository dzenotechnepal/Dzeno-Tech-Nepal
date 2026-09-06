import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Dzeno Tech Nepal — Let's Talk About Your Next Project" },
      {
        name: "description",
        content:
          "Tell Dzeno Tech Nepal about your software, IT services, or training project. Share your requirements and budget and we'll respond with next steps.",
      },
      { property: "og:title", content: "Contact Dzeno Tech Nepal" },
      {
        property: "og:description",
        content: "Send a project inquiry to Dzeno Tech Nepal Pvt. Ltd.",
      },
    ],
  }),
  component: Contact,
});

const services = ["Software Development", "IT Services", "IT Training", "Not sure yet"];
const budgets = [
  "Under NPR 50,000",
  "NPR 50,000 – 1,00,000",
  "NPR 1,00,000 – 2,00,000",
  "Above NPR 2,00,000",
  "To be discussed",
];

const details = [
  { Icon: Mail, label: "Email", value: "dzenotechnepal77@gmail.com" },
  { Icon: Phone, label: "Phone", value: "+977- 9744621447" },
  { Icon: MapPin, label: "Address", value: "Kathmandu, Nepal" },
];

const fieldClass =
  "mt-2 h-12 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-ring";

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let's Talk About Your <span className="text-gradient">Next Project.</span>
          </>
        }
        subtitle="Share a few details and we'll come back with a practical recommendation, timeline, and next steps."
      />

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 md:pb-32">
        <Reveal>
          <form
            className="rounded-3xl border border-border bg-card/40 p-7 md:p-10"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              const form = e.currentTarget;
              setTimeout(() => {
                setSubmitting(false);
                form.reset();
                toast.success("Inquiry received", {
                  description: "Thanks — we'll get back to you shortly.",
                });
              }, 600);
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="Your name" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" placeholder="Company name" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+977 ..."
                  className={fieldClass}
                />
              </div>
              <div>
                <Label htmlFor="service">Service Required</Label>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="budget">Project Budget</Label>
                <select
                  id="budget"
                  name="budget"
                  defaultValue=""
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What are you trying to achieve?"
                className="mt-2 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Inquiry"}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>

        <Reveal delay={140}>
          <div className="space-y-4">
            {details.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Icon className="size-4 text-primary" />
                  <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
                </div>
                <p className="mt-3 text-sm">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-border p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Social</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {["LinkedIn", "Facebook", "GitHub", "Instagram"].map((s) => (
                  <a
                    key={s}
                    href="https://www.linkedin.com/company/dzeno-tech-nepal/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
            <p className="px-1 text-xs text-muted-foreground">
              Contact details and social links are editable placeholders.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
