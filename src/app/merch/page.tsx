import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MerchTabs } from "@/components/MerchTabs";
import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { categorias, merch, merchBajada } from "@/data/merch";

export const metadata: Metadata = {
  title: "Merch · DOKEBI",
  description: "Toda la merch de DOKEBI: poleras, gorros, tote bags, stickers y más. Disponible en Barrio Italia y Los Leones.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  return (
    <>
      <Header />
      <main>
        <Section id="merch" labelledBy="h1-merch" className="on-light bg-yolk pt-12 pb-24 md:pt-20 md:pb-34" innerClassName="flex flex-col gap-8 md:gap-14">
          <Doodle variant="crown" size={110} className="absolute top-16 right-[5%] rotate-16 max-md:hidden" />
          <Link href="/" className="inline-flex min-h-11 items-center self-start text-base font-bold underline">← Volver al inicio</Link>
          <div className="flex flex-col gap-3 md:gap-4">
            <h1 id="h1-merch" className="font-display m-0 text-[84px] leading-[0.88] md:text-h2-xl">Merch</h1>
            <p className="m-0 max-w-[520px] text-base font-medium md:text-[19px] md:leading-normal">
              {merchBajada}
            </p>
          </div>
          <MerchTabs categorias={categorias} items={merch} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
