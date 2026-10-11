import { faq } from "@/data/faq";
import { horario, locales, type Local } from "@/data/locales";
import { rangoPrecios } from "@/data/menu";
import { site } from "@/data/site";

const restaurant = (l: Local) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${site.url}/#${l.id}`,
  name: `DOKEBI ${l.nombre}`,
  url: site.url,
  servesCuisine: "Korean",
  priceRange: rangoPrecios,
  hasMenu: `${site.url}/#menu`,
  address: {
    "@type": "PostalAddress",
    streetAddress: l.detalle ? `${l.calle}, ${l.detalle}` : l.calle,
    addressLocality: l.comuna,
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
  hasMap: l.mapsUrl,
  openingHoursSpecification: horario.flatMap((h) =>
    h.ranges.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens,
      closes,
    })),
  ),
  potentialAction: { "@type": "OrderAction", target: l.ubereats },
});

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const jsonLd = [...locales.map(restaurant), faqPage];
