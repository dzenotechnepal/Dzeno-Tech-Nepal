import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
