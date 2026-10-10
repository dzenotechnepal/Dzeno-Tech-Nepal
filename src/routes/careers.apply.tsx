import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, Mail, Phone, Globe, User, Building2, FileText } from "lucide-react";
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
        content: "Apply for an open role or send a general application to Dzeno Tech Nepal in Kathmandu, Nepal. Join our team of engineers and trainers.",
      },
      {
        name: "keywords",
        content: "job application Nepal, apply for software job, IT training job, developer application, internship application Nepal"
      },
      {
        property: "og:title",
        content: "Apply - Dzeno Tech Nepal Careers",
      },
      {
        property: "og:description",
        content: "Apply for an open role or send a general application to Dzeno Tech Nepal.",
      },
      {
        property: "og:image",
        content: "https://dzenotechnepal.com.np/logo.png",
      },
      {
        property: "og:url",
        content: "https://dzenotechnepal.com.np/careers/apply",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Apply - Dzeno Tech Nepal Careers",
      },
      {
        name: "twitter:description",
        content: "Apply for an open role or send a general application to Dzeno Tech Nepal.",
      },
      {
        name: "twitter:image",
        content: "https://dzenotechnepal.com.np/logo.png",
      },
    ],
    links: [
      { rel: "canonical", href: "https://dzenotechnepal.com.np/careers/apply" },
    ],
  }),
  component: CareersApplication,
});

const apiUrl =
  import.meta.env["VITE_API_URL"] ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://api.dzenotechnepal.com.np/api");

const fieldClass =
  "mt-2 h-12 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-ring transition-all duration-200 focus-visible:bg-card/60";

const selectClass =
  "mt-2 h-12 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 focus-visible:bg-card/60 cursor-pointer";

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
        title={
          <>
            Apply to <span className="text-gradient">Dzeno Tech Nepal.</span>
          </>
        }
        subtitle="Tell us what you have built, what you want to learn, and where you can make an impact."
      />

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 md:pb-32">
        <Reveal>
          <form
            onSubmit={submitApplication}
            className="rounded-3xl border border-border bg-card/40 p-7 md:p-10 shadow-lg"
          >
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-4">
              <BriefcaseBusiness className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Join our team. We're looking for passionate people who love building great software.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Information</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className={fieldClass + " pl-10"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-destructive">*</span></Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className={fieldClass + " pl-10"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+977 9800000000"
                      className={fieldClass + " pl-10"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="portfolio" className="text-sm font-medium">Portfolio / LinkedIn</Label>
                  <div className="relative mt-2">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={fieldClass + " pl-10"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Application Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="position" className="text-sm font-medium">Position <span className="text-destructive">*</span></Label>
                  <div className="relative mt-2">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="position"
                      name="position"
                      required
                      defaultValue={position}
                      placeholder="e.g., Full Stack Developer"
                      className={fieldClass + " pl-10"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="applicationType" className="text-sm font-medium">Application Type <span className="text-destructive">*</span></Label>
                  <select
                    id="applicationType"
                    name="applicationType"
                    required
                    defaultValue=""
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select application type
                    </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time / Contract">Part-time / Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="General Application">General Application</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">About You <span className="text-destructive">*</span></Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Tell us about your experience, skills, projects you've worked on, and what you're passionate about building..."
                className="mt-2 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:bg-card/60"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Share details about your technical skills, past projects, and what excites you about this role.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-accent px-8 py-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </Reveal>

        <Reveal delay={140}>
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
              <BriefcaseBusiness className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">What Happens Next</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your application goes directly to our hiring team. We review all applications and reach out to qualified candidates within 5-7 business days.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Our Culture</h3>
              <ul className="space-y-3">
                {[
                  "Collaborative environment",
                  "Continuous learning",
                  "Flexible work hours",
                  "Growth opportunities",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-2 text-sm font-semibold text-primary">Tips for Your Application</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Include your best projects in your portfolio</li>
                <li>• Be specific about your technical skills</li>
                <li>• Tell us why you're excited about Dzeno Tech</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
