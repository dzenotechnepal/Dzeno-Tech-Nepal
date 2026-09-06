import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import softwareImg from "@/assets/service-software.jpg";
import itImg from "@/assets/service-it.jpg";
import trainingImg from "@/assets/service-training.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Software Development, IT Services & IT Training | Dzeno Tech" },
      {
        name: "description",
        content:
          "Custom software, business applications, APIs, IT consulting, infrastructure, cloud solutions, and project-based IT training from Dzeno Tech Nepal.",
      },
      { property: "og:title", content: "Services — Dzeno Tech Nepal" },
      {
        property: "og:description",
        content:
          "Software development, IT services, and IT training built around real business requirements.",
      },
    ],
  }),
  component: Services,
});

const blocks = [
  {
    n: "01",
    title: "Software Development",
    copy: "We design and build web and business software that fits the way your organisation actually works — engineered for performance, scale, and long-term maintenance.",
    items: [
      "Custom web applications",
      "Business software",
      "APIs and integrations",
      "Software maintenance",
    ],
    image: softwareImg,
    alt: "Abstract layered software interface panels glowing in blue and violet",
  },
  {
    n: "02",
    title: "IT Services",
    copy: "Practical technology operations and advisory work: the infrastructure, support, and modernisation that keeps a business running and moving forward.",
    items: [
      "IT consulting",
      "Technical support",
      "Infrastructure",
      "Digital transformation",
      "Cloud and technology solutions",
    ],
    image: itImg,
    alt: "Abstract cloud and server infrastructure with glowing data light trails",
  },
  {
    n: "03",
    title: "IT Training",
    copy: "Industry-focused training programmes that move people from theory to shipping real work, taught by practitioners who build software daily.",
    items: [
      "Programming",
      "Web development",
      "Software technologies",
      "Practical project-based learning",
    ],
    image: trainingImg,
    alt: "Abstract knowledge graph connected to translucent code panels",
  },
];

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Technology, Built Around <span className="text-gradient">Your Goals.</span>
          </>
        }
        subtitle="Three practices that work together | build the product, run the technology, grow the skills."
      />

      <div className="container-x space-y-24 pb-10 md:space-y-36">
        {blocks.map((b, i) => (
          <section
            key={b.n}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            aria-labelledby={`service-${b.n}`}
          >
            <Reveal className={i % 2 === 1 ? "lg:order-2" : undefined}>
              <div className="glow-ring overflow-hidden rounded-3xl border border-border">
                <img
                  src={b.image}
                  alt={b.alt}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-sm tracking-[0.2em] text-muted-foreground">{b.n}</p>
              <h2
                id={`service-${b.n}`}
                className="mt-4 text-3xl font-semibold leading-tight md:text-5xl"
              >
                {b.title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {b.copy}
              </p>
              <ul className="mt-8 space-y-3">
                {b.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-sm md:text-base">
                    <Check className="size-4 shrink-0 text-primary" />
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-primary hover:bg-accent"
              >
                Discuss this service
                <ArrowRight className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="container-x py-24 md:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center md:p-16">
            <div className="aurora" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Not sure which service you need?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
              Describe the outcome you're after and we'll recommend the right approach.
            </p>
            <Link
              to="/contact"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a Project
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
