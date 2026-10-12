import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { faq } from "@/data/faq";

export function Faq() {
  return (
    <Section id="faq" labelledBy="h2-faq" className="on-light bg-paper py-16 md:py-30" innerClassName="grid items-start gap-6 md:gap-14 md:grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))]">
      <div className="flex flex-col gap-5">
        <h2 id="h2-faq" className="font-display m-0 text-[56px] leading-[0.92] md:text-h2-md">Preguntas frecuentes</h2>
        <Doodle variant="squiggle" size={200} className="max-md:hidden" />
      </div>
      <div className="border-ink flex flex-col border-t-[3px]">
        {faq.map((f, i) => (
          <details key={f.q} open={i === 0} className="border-ink border-b-[3px] py-1.5 md:py-2">
            <summary className="flex min-h-[60px] items-center justify-between gap-3 md:min-h-16 md:gap-4">
              <h3 className="font-display m-0 text-2xl leading-[1.05] md:text-3xl">{f.q}</h3>
              <span aria-hidden="true" className="plus font-display bg-yolk flex size-11 flex-none items-center justify-center rounded-full text-[26px] transition-[rotate] duration-200 motion-reduce:transition-none md:text-3xl">+</span>
            </summary>
            <p className="text-gray-700 m-0 mb-4 max-w-[620px] text-base leading-[1.55] md:mb-5 md:text-lg">{f.a.split("도깨비").flatMap((t, k) => (k ? [<span key={k} lang="ko" className="font-korean">도깨비</span>, t] : [t]))}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
