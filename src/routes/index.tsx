import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, ServerCog, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import heroVisual from "@/assets/hero-visual.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dzeno Tech Nepal — We Build Technology That Moves Businesses Forward" },
      {
        name: "description",
        content:
          "Dzeno Tech Nepal delivers innovative software development, reliable IT services, and practical IT training for businesses ready to grow digitally.",
      },
      {
        property: "og:title",
        content: "Dzeno Tech Nepal — Technology That Moves Businesses Forward",
      },
      {
        property: "og:description",
        content:
          "Software development, IT services, and IT training from a modern technology partner in Nepal.",
      },
    ],
  }),
  component: Home,
});

const services = [
  {
    n: "01",
    Icon: Code2,
    title: "Software Development",
    copy: "Custom web and software solutions built for performance, scalability, and real business requirements.",
  },
  {
    n: "02",
    Icon: ServerCog,
    title: "IT Services",
    copy: "Reliable technology solutions, technical support, consulting, infrastructure, and digital services.",
  },
  {
    n: "03",
    Icon: GraduationCap,
    title: "IT Training",
    copy: "Practical, industry-focused training designed to develop real technical skills.",
  },
];

const values = [
  { n: "01", title: "Innovation", copy: "We look for better ways to solve real problems, not trends." },
  { n: "02", title: "Reliability", copy: "Systems that hold up, timelines that are respected." },
  { n: "03", title: "Expertise", copy: "Deep technical craft applied with practical judgement." },
  { n: "04", title: "Partnership", copy: "We work alongside your team, not at a distance from it." },
];

const techCategories = [
  "Web Technologies",
  "Cloud",
  "Databases",
  "Artificial Intelligence",
  "Automation",
  "DevOps",
  "Cybersecurity",
  "Data & Analytics",
];

const process = [
  { n: "01", title: "Discover", copy: "Understand goals and requirements." },
  { n: "02", title: "Design", copy: "Create practical user experiences and solutions." },
  { n: "03", title: "Build", copy: "Develop, test, and refine the product." },
  { n: "04", title: "Launch & Support", copy: "Deploy and continuously improve." },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "20+", label: "Technology Solutions" },
  { value: "10+", label: "Industry Areas" },
  { value: "99%", label: "Commitment to Quality" },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-44">
        <div className="aurora" aria-hidden="true" />
        <div className="absolute inset-0 grid-backdrop" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Dzeno Tech Nepal Pvt. Ltd.
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.04] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                We Build Technology That{" "}
                <span className="text-gradient">Moves Businesses Forward.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Dzeno Tech delivers innovative software, reliable IT services, and practical
                technology training designed to help businesses grow in a digital world.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
                >
                  Start a Project
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-accent"
                >
                  Explore Our Services
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative float-slow">
              <div className="glow-ring overflow-hidden rounded-3xl border border-border">
                <img
                  src={heroVisual}
                  alt="Abstract network of glowing connected nodes representing digital systems"
                  width={1280}
                  height={1280}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="glass-panel absolute -bottom-6 left-4 rounded-2xl px-5 py-4 sm:left-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Engineering focus
                </p>
                <p className="mt-1.5 text-sm font-medium">Software · Cloud · AI · Security</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow="Services"
          title="Technology, Built Around Your Goals."
          description="Three practices, one standard of engineering. We shape each engagement around the outcome you need."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <Link
                to="/services"
                className="group flex h-full flex-col rounded-3xl border border-border bg-card/40 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:glow-ring"
              >
                <div className="flex items-start justify-between">
                  <s.Icon className="size-7 text-primary" strokeWidth={1.5} />
                  <span className="text-xs tracking-[0.2em] text-muted-foreground">{s.n}</span>
                </div>
                <h3 className="mt-10 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.copy}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Learn More
                  <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY DZENO */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Why Dzeno" title="Technology Should Create Possibilities." />
          <div className="mt-16 divide-y divide-border border-y border-border">
            {values.map((v, i) => (
              <Reveal key={v.n} delay={i * 100}>
                <div className="group grid gap-3 py-8 md:grid-cols-[6rem_1fr_1.2fr] md:items-baseline md:gap-8">
                  <span className="text-sm tracking-[0.2em] text-muted-foreground">{v.n}</span>
                  <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-gradient md:text-4xl">
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {v.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Technology"
            title="Built With Modern Technology."
            description="We choose tools that keep systems fast, secure, and maintainable years after launch."
          />
        </div>
        <div className="relative mt-14 overflow-hidden py-2">
          <div className="marquee-track gap-4">
            {[...techCategories, ...techCategories].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="whitespace-nowrap rounded-full border border-border bg-card/40 px-7 py-3.5 text-sm text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="Process" title="From Idea to Impact." />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-3 hidden h-px bg-gradient-accent opacity-40 md:block"
            aria-hidden="true"
          />
          {process.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 140} className="relative">
              <span
                className="block size-2.5 rounded-full bg-gradient-accent md:mt-2"
                aria-hidden="true"
              />
              <p className="mt-6 text-sm tracking-[0.2em] text-muted-foreground">{p.n}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* STATS */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-10 rounded-3xl border border-border bg-card/40 p-10 sm:grid-cols-2 lg:grid-cols-4 md:p-14">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <p className="text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="text-gradient">{s.value}</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Note: these figures are editable placeholders, not verified claims — update them with your
          own numbers.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-28 md:py-40">
        <div className="aurora" aria-hidden="true" />
        <div className="container-x relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
              Have an Idea? <span className="text-gradient">Let's Build It.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Tell us what you're trying to achieve. We'll help turn your idea into a practical
              technology solution.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                Start a Conversation
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-primary hover:bg-accent"
              >
                Contact Dzeno Tech
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
