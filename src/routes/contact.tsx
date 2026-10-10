import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Building2, MessageSquare } from "lucide-react";
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
          "Tell Dzeno Tech Nepal about your software, IT services, or training project. Share your requirements and we'll respond with next steps. Located in Kathmandu, Nepal.",
      },
      {
        name: "keywords",
        content: "contact Dzeno Tech Nepal, software development inquiry, IT services Nepal, IT training Nepal, project consultation, technology partner Nepal"
      },
      { property: "og:title", content: "Contact Dzeno Tech Nepal" },
      {
        property: "og:description", content: "Send a project inquiry to Dzeno Tech Nepal Pvt. Ltd." },
      {
        property: "og:image",
        content: "https://dzenotechnepal.com.np/logo.png",
      },
      {
        property: "og:url",
        content: "https://dzenotechnepal.com.np/contact",
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
        content: "Contact Dzeno Tech Nepal",
      },
      {
        name: "twitter:description",
        content: "Send a project inquiry to Dzeno Tech Nepal Pvt. Ltd.",
      },
      {
        name: "twitter:image",
        content: "https://dzenotechnepal.com.np/logo.png",
      },
    ],
    links: [
      { rel: "canonical", href: "https://dzenotechnepal.com.np/contact" },
    ],
  }),
  component: Contact,
});

const services = [
  "Software Development",
  "IT Services",
  "IT Training",
  "Social Media Management",
  "Digital Marketing",
  "SEO & Content Marketing",
  "Website Development",
  "Mobile App Development",
  "Cloud Solutions",
  "Not sure yet"
];

const details = [
  { Icon: Mail, label: "Email", value: "dzenotechnepal77@gmail.com" },
  { Icon: Phone, label: "Phone", value: "+977- 9744621447" },
  { Icon: MapPin, label: "Address", value: "Kathmandu, Nepal" },
];

const fieldClass =
  "mt-2 h-12 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-ring transition-all duration-200 focus-visible:bg-card/60";

const selectClass =
  "mt-2 h-12 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 focus-visible:bg-card/60 cursor-pointer";

const apiUrl =
  import.meta.env["VITE_API_URL"] ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://api.dzenotechnepal.com.np/api");

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
            className="rounded-3xl border border-border bg-card/40 p-7 md:p-10 shadow-lg"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);

              const form = e.currentTarget;
              const formData = new FormData(form);
              const payload = {
                name: formData.get("name"),
                company: formData.get("company"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                service: formData.get("service"),
                message: formData.get("message"),
              };

              try {
                const response = await fetch(`${apiUrl}/submissions/contact`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();

                if (response.ok && result.success) {
                  form.reset();

                  toast.success("Inquiry received", {
                    description: "Thanks — we'll get back to you shortly.",
                  });
                } else {
                  toast.error("Something went wrong", {
                    description: result.message || "Please try again later.",
                  });
                }
              } catch (error) {
                console.error(error);

                toast.error("Unable to send inquiry", {
                  description: "Please check your internet connection and try again.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-4">
              <MessageSquare className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Tell us about your project. We'll respond within 24 hours.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                  <div className="relative mt-2">
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                  <div className="relative mt-2">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your company"
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
                      placeholder="john@company.com"
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
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project Details</h3>
              <div>
                <Label htmlFor="service" className="text-sm font-medium">Service Required <span className="text-destructive">*</span></Label>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
                  className={selectClass}
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
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">Project Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Describe your project requirements, goals, and any specific features you need..."
                className="mt-2 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:bg-card/60"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                The more details you provide, the better we can understand your needs.
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
                  Send Inquiry
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </Reveal>

        <Reveal delay={140}>
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Get in Touch</h3>
              <div className="space-y-4">
                {details.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "LinkedIn", url: "https://www.linkedin.com/company/dzeno-tech-nepal/" },
                  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61594519552480" },
                  { name: "Instagram", url: "https://www.instagram.com/dzenotechnepal" },
                  { name: "TikTok", url: "https://www.tiktok.com/@dzenotechnepal" },
                  { name: "GitHub", url: "https://github.com/dzenotechnepal" },
                  { name: "GitLab", url: "https://gitlab.com/dzenotechnepal" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-2 text-sm font-semibold text-primary">Office Hours</h3>
              <p className="text-sm text-muted-foreground">
                Sunday - Friday: 10:00 AM - 6:00 PM
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Saturday: Closed
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
