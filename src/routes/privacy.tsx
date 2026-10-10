import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Dzeno Tech Nepal Pvt. Ltd." },
      {
        name: "description",
        content:
          "How Dzeno Tech Nepal Pvt. Ltd. collects, uses, and protects the information you share through this website. Learn about our data handling practices.",
      },
      {
        name: "keywords",
        content: "privacy policy, data protection, information security, Dzeno Tech Nepal privacy"
      },
      { property: "og:title", content: "Privacy Policy — Dzeno Tech Nepal" },
      {
        property: "og:description",
        content: "Our approach to data, inquiries, and information security." },
      {
        property: "og:url",
        content: "https://dzenotechnepal.com.np/privacy",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: "Privacy Policy — Dzeno Tech Nepal",
      },
      {
        name: "twitter:description",
        content: "Our approach to data, inquiries, and information security.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://dzenotechnepal.com.np/privacy" },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "Information we collect",
    copy: "We collect only the details you submit through our inquiry form — name, company, email, phone, service interest, budget range, and your message.",
  },
  {
    title: "How we use it",
    copy: "Your information is used to respond to your inquiry, prepare proposals, and maintain a record of our correspondence. We do not sell or rent it.",
  },
  {
    title: "Sharing",
    copy: "Information is shared only with team members involved in your engagement, or where required by applicable law.",
  },
  {
    title: "Retention and security",
    copy: "We keep inquiry records for as long as needed for business and legal purposes, protected by reasonable technical and organisational safeguards.",
  },
  {
    title: "Your choices",
    copy: "You may request access to, correction of, or deletion of the information you have shared with us at any time.",
  },
];

function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="This is a placeholder policy provided as a starting point — review it with your legal advisor before publishing."
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
