import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Dzeno Tech Nepal Pvt. Ltd." },
      {
        name: "description",
        content:
          "The terms that apply when you use the Dzeno Tech Nepal Pvt. Ltd. website and submit project inquiries.",
      },
      { property: "og:title", content: "Terms of Use — Dzeno Tech Nepal" },
      {
        property: "og:description",
        content: "Website terms, intellectual property, and engagement terms.",
      },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "Use of this website",
    copy: "Content on this site is provided for general information about our services. You agree not to misuse the site or attempt to disrupt its operation.",
  },
  {
    title: "Intellectual property",
    copy: "All branding, text, and visual material on this site belongs to Dzeno Tech Nepal Pvt. Ltd. unless stated otherwise.",
  },
  {
    title: "Inquiries and proposals",
    copy: "Submitting an inquiry does not create a contract. Scope, timelines, and fees are agreed in a separate written engagement.",
  },
  {
    title: "Limitation of liability",
    copy: "We aim to keep information accurate but make no warranty that the site is error-free or continuously available.",
  },
  {
    title: "Changes",
    copy: "These terms may be updated from time to time. Continued use of the site indicates acceptance of the current version.",
  },
];

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="These placeholder terms are a starting point — have them reviewed by your legal advisor before publishing."
      />
      <section className="container-x max-w-3xl space-y-10 pb-24 md:pb-32">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {s.copy}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
