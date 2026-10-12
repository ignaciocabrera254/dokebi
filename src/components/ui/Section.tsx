import type { ReactNode, Ref } from "react";

type SectionProps = {
  id: string;
  labelledBy: string;
  className?: string;
  /** Contenedor de 1280 px con gutter. `false` para secciones a sangre. */
  contained?: boolean;
  /** overflow-hidden (default). `false` si un hijo debe sobresalir. */
  clip?: boolean;
  innerClassName?: string;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
};

export function Section({
  id,
  labelledBy,
  className = "",
  contained = true,
  clip = true,
  innerClassName = "",
  ref,
  children,
}: SectionProps) {
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={`relative ${clip ? "overflow-hidden" : ""} ${className}`}>
      {contained ? (
        <div className={`px-gutter mx-auto w-full max-w-site ${innerClassName}`}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
