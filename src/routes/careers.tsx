import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import logo from '/logo.png';

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers - Build Your Future With Dzeno Tech Nepal" },
      {
        name: "description",
        content:
          "Open roles, internships, culture, and benefits at Dzeno Tech Nepal Pvt. Ltd. Apply to build software, IT services, and training with us.",
      },
      { property: "og:title", content: "Careers - Build Your Future With Dzeno" },
      {
        property: "og:description",
        content: "Open positions and internship opportunities at Dzeno Tech Nepal Pvt. Ltd.",
      },
    ],
  }),
  component: Careers,
});

const why = [
  { n: "01", title: "Real ownership", copy: "You ship work that clients depend on, not tickets in a queue." },
  { n: "02", title: "Senior mentorship", copy: "Code review and architecture guidance from people who build daily." },
  { n: "03", title: "Modern stack", copy: "Current tooling across web, cloud, data, and automation." },
  { n: "04", title: "Room to grow", copy: "Clear progression across engineering, consulting, and training tracks." },
];

const benefits = [
  "Competitive compensation",
  "Flexible, focused work culture",
  "Learning and certification support",
  "Modern equipment",
  "Team retreats and knowledge sessions",
  "Paid leave and festival holidays",
];

const openings = [
  { role: "Full-Stack Developer", type: "Full-time · Kathmandu / Hybrid", level: "Mid–Senior" },
  { role: "IT Support Engineer", type: "Full-time · On-site", level: "Junior–Mid" },
  { role: "IT Trainer (Web Development)", type: "Part-time / Contract", level: "Experienced" },
  { role: "Software Development Intern", type: "Internship · 3–6 months", level: "Entry" },
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build Future With  <span className="text-gradient">
              <span> <img src={logo} alt="dzeno logo" className="h-18 w-46" /></span>
            </span>
          </>
        }
        subtitle="We hire curious engineers and trainers who care about craft and about the people using what they build."
      >
        <div className="mt-10">
          <a
            href="#openings"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
          >
            View Opportunities
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </PageHero>

      <section className="container-x py-16 md:py-24">
        <SectionHeading
          eyebrow="Culture"
          title="Small Team. High Standards."
          description="We work in tight teams with direct client contact, short feedback loops, and time set aside for learning. No layers of process between an idea and a decision."
        />
      </section>

      <section className="container-x py-12 md:py-20">
        <SectionHeading eyebrow="Why Work With Us" title="What You Can Expect." />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {why.map((w, i) => (
            <Reveal key={w.n} delay={i * 90}>
              <div className="grid gap-3 py-7 md:grid-cols-[6rem_1fr_1.2fr] md:items-baseline md:gap-8">
                <span className="text-sm tracking-[0.2em] text-muted-foreground">{w.n}</span>
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{w.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {w.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-12 md:py-20">
        <SectionHeading eyebrow="Benefits" title="Looked After, Properly." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal as="li" key={b} delay={i * 70}>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-6 text-sm">{b}</div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="openings" className="container-x scroll-mt-28 py-16 md:py-24">
        <SectionHeading
          eyebrow="Open Positions"
          title="Current Opportunities."
          description="Roles below are editable placeholders — update them as your hiring plan changes."
        />
        <ul className="mt-12 divide-y divide-border border-y border-border">
          {openings.map((o, i) => (
            <Reveal as="li" key={o.role} delay={i * 90}>
              <Link
                to="/contact"
                className="group flex flex-col gap-3 py-7 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{o.role}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {o.type} · {o.level}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  Apply
                  <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center md:p-16">
            <div className="aurora" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Don't see your role? Send a general application.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
              Internships included. Tell us what you want to work on and what you've built.
            </p>
            <Link
              to="/contact"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Apply Now
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
