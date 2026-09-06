import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dzeno Tech Nepal — Technology With Purpose" },
      {
        name: "description",
        content:
          "Dzeno Tech Nepal Pvt. Ltd. is a technology company focused on software development, IT services, and IT training. Learn our mission, vision, and values.",
      },
      { property: "og:title", content: "About Dzeno Tech Nepal — Technology With Purpose" },
      {
        property: "og:description",
        content: "Who we are, our mission, vision, and the values behind our engineering work.",
      },
    ],
  }),
  component: About,
});

const values = [
  { n: "01", title: "Innovation", copy: "We explore new approaches with a bias toward what works." },
  { n: "02", title: "Integrity", copy: "Clear scope, honest timelines, transparent communication." },
  { n: "03", title: "Excellence", copy: "Quality engineering as a default, not an upgrade." },
  { n: "04", title: "Collaboration", copy: "We build with clients, sharing context and decisions." },
  { n: "05", title: "Continuous Learning", copy: "Our team keeps sharpening its craft, every project." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Technology With <span className="text-gradient">Purpose.</span>
          </>
        }
        subtitle="Dzeno Tech Nepal Pvt. Ltd. is a technology company built around three practices | software development, IT services, and IT training -  that help businesses and people use technology well."
      />

      <section className="container-x grid gap-14 py-12 md:py-20 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card/40 p-9">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Who We Are</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              We are a team of engineers, consultants, and trainers working with organisations that
              need dependable technology rather than complexity. We design and build custom
              software, keep infrastructure and support running quietly in the background, and train
              teams and students in the skills the industry actually hires for.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Every engagement starts with understanding the business problem | then we choose the
              simplest technology that solves it properly.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6">
          <Reveal delay={120}>
            <div className="rounded-3xl border border-border p-9">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Our Mission
              </p>
              <p className="mt-5 text-xl leading-snug tracking-tight md:text-2xl">
                “To make technology practical, accessible, and valuable for businesses and people.”
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="rounded-3xl border border-border p-9">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Vision</p>
              <p className="mt-5 text-xl leading-snug tracking-tight md:text-2xl">
                “To become a trusted technology partner known for innovation, reliability, and
                meaningful digital solutions.”
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <SectionHeading eyebrow="Our Values" title="What We Hold Ourselves To." />
        <div className="mt-14 divide-y divide-border border-y border-border">
          {values.map((v, i) => (
            <Reveal key={v.n} delay={i * 90}>
              <div className="grid gap-3 py-7 md:grid-cols-[6rem_1fr_1.2fr] md:items-baseline md:gap-8">
                <span className="text-sm tracking-[0.2em] text-muted-foreground">{v.n}</span>
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {v.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center md:p-16">
            <div className="aurora" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Want to know if we're the right partner?
            </h2>
            <Link
              to="/contact"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a Conversation
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
