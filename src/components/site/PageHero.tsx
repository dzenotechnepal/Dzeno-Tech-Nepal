import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
      <div className="aurora" aria-hidden="true" />
      <div className="absolute inset-0 grid-backdrop" aria-hidden="true" />
      <div className="container-x relative">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={200}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={300}>{children}</Reveal>}
      </div>
    </section>
  );
}
