import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Linkedin, Github, Mail } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — The People Behind Dzeno Tech Nepal" },
      {
        name: "description",
        content:
          "Meet the engineers, consultants, and trainers behind Dzeno Tech Nepal Pvt. Ltd. — the team delivering software, IT services, and training.",
      },
      { property: "og:title", content: "Team — The People Behind Dzeno" },
      {
        property: "og:description",
        content: "Engineers, consultants, and trainers building technology at Dzeno Tech Nepal.",
      },
    ],
  }),
  component: Team,
});

const team = [
  {
    name: "Team Member Name",
    role: "Founder & Technology Lead",
    copy: "Sets technical direction across engagements and works closely with clients on solution architecture.",
    image: t1,
  },
  {
    name: "Team Member Name",
    role: "Head of IT Services",
    copy: "Leads infrastructure, support, and consulting work, keeping client systems reliable day to day.",
    image: t2,
  },
  {
    name: "Team Member Name",
    role: "Senior Software Engineer",
    copy: "Builds web and business applications with a focus on performance and maintainable code.",
    image: t3,
  },
  {
    name: "Team Member Name",
    role: "Training Lead",
    copy: "Designs project-based training programmes that take learners from fundamentals to real work.",
    image: t4,
  },
];

function Team() {
  return (
    <>
      <PageHero
        eyebrow="Team"
        title={
          <>
            The People Behind <span className="text-gradient">Dzeno.</span>
          </>
        }
        subtitle="A small, senior team that stays close to the work — names and details below are editable placeholders."
      />

      <section className="container-x grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-4 md:pb-32">
        {team.map((m, i) => (
          <Reveal key={m.role} delay={i * 110}>
            <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:glow-ring">
              <div className="overflow-hidden">
                <img
                  src={m.image}
                  alt={`Portrait of ${m.role} at Dzeno Tech Nepal`}
                  width={800}
                  height={1008}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold tracking-tight">{m.name}</h2>
                <p className="mt-1 text-sm text-primary">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.copy}</p>
                <div className="mt-6 flex gap-2">
                  {[
                    { Icon: Linkedin, label: "LinkedIn" },
                    { Icon: Github, label: "GitHub" },
                    { Icon: Mail, label: "Email" },
                  ].map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={`${label} (placeholder link)`}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center md:p-16">
            <div className="aurora" aria-hidden="true" />
            <h2 className="relative text-3xl font-semibold leading-tight md:text-4xl">
              We're growing the team.
            </h2>
            <Link
              to="/careers"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              View Opportunities
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
