import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Barrio } from "@/components/sections/Barrio";
import { Corndog } from "@/components/sections/Corndog";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Locales } from "@/components/sections/Locales";
import { PorQueDokebi } from "@/components/sections/PorQueDokebi";
import { Menu } from "@/components/sections/Menu";
import { Merch } from "@/components/sections/Merch";
import { menu } from "@/data/menu";
import { jsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <Header immersive />
      <main>
        <Hero />
        <Menu />
        <Corndog rellenos={menu.rellenosCorndog} />
        <Locales />
        <PorQueDokebi />
        <Barrio />
        <Merch />
        <Faq />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // "<" escapado para que ningún texto de los datos cierre el <script>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
