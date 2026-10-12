import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { MerchCard } from "@/components/MerchCard";
import { Button } from "@/components/ui/Button";
import { merchBajada, merchHome } from "@/data/merch";

export function Merch() {
  return (
    <Section id="merch" labelledBy="h2-merch" className="on-light bg-yolk pt-16 pb-18 md:pt-30 md:pb-34" contained={false}>
      <Doodle variant="crown" size={110} strokeWidth={5} className="absolute top-[70px] right-[5%] rotate-16 max-md:hidden" />
      <div className="px-gutter mx-auto flex w-full max-w-site flex-col gap-6 md:gap-14">
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 id="h2-merch" className="font-display m-0 text-[84px] leading-[0.88] md:text-h2-xl">Merch</h2>
          <p className="m-0 max-w-[520px] text-base font-medium md:text-[19px] md:leading-normal">
            {merchBajada}
          </p>
        </div>
        <ul className="scrollbar-none -mx-gutter px-gutter m-0 flex list-none gap-[22px] overflow-x-auto p-0 pt-5 pb-7 md:mx-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] md:gap-x-7 md:gap-y-9 md:overflow-visible md:p-0">
          {merchHome.map((m, i) => (
            <MerchCard key={m.id} item={m} index={i} className="w-[200px] flex-none md:w-auto" />
          ))}
        </ul>
        <Button href="/merch" variant="ink" size="lg" className="self-start max-md:w-full">
          Ver toda la merch
        </Button>
      </div>
    </Section>
  );
}
