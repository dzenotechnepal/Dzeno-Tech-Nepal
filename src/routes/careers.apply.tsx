import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/careers/apply")({
  validateSearch: (search: Record<string, unknown>) => ({
    position: typeof search["position"] === "string" ? search["position"] : "General Application",
  }),
  head: () => ({
    meta: [
      { title: "Apply - Dzeno Tech Nepal Careers" },
      {
        name: "description",
        content: "Apply for an open role or send a general application to Dzeno Tech Nepal.",
      },
    ],
  }),
  component: CareersApplication,
});

const apiUrl = import.meta.env["VITE_API_URL"] || (window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://api.dzenotechnepal.com.np/api");

const fieldClass =
  "mt-2 h-12 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-ring";

function CareersApplication() {
  const { position } = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      portfolio: formData.get("portfolio"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      applicationType: formData.get("applicationType"),
      position: formData.get("position"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${apiUrl}/submissions/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Application could not be sent");
      }

      form.reset();
      toast.success("Application received", {
        description: "Thanks. Our team will review your application and get back to you.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Application could not be sent", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={<>Apply to <span className="text-gradient">Dzeno Tech Nepal.</span></>}
        subtitle="Tell us what you have built, what you want to learn, and where you can make an impact."
      />

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 md:pb-32">
        <Reveal>
          <form onSubmit={submitApplication} className="rounded-3xl border border-border bg-card/40 p-7 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="Your name" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+977 ..." className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio / LinkedIn</Label>
                <Input id="portfolio" name="portfolio" type="url" placeholder="https://" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" required defaultValue={position} className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="applicationType">Application Type</Label>
                <select id="applicationType" name="applicationType" required defaultValue="" className="mt-2 h-12 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="" disabled>Select an application type</option>
                  <option>Full-time</option>
                  <option>Part-time / Contract</option>
                  <option>Internship</option>
                  <option>General Application</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="message">About You</Label>
              <Textarea id="message" name="message" required rows={6} placeholder="Tell us about your experience, skills, and what you would like to work on." className="mt-2 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70" />
            </div>

            <button type="submit" disabled={submitting} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60">
              {submitting ? "Sending..." : "Submit Application"}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>

        <Reveal delay={140}>
          <div className="rounded-2xl border border-border p-6">
            <BriefcaseBusiness className="size-5 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Your application goes to our hiring team.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We keep applications with the selected role and review them alongside our current openings.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
