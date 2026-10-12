const ubereats = "https://www.ubereats.com/cl/store/dokebi-providencia/rYDa6_ZzUDK76ZOCxcTVFQ";

export const site = {
  url: "https://dokebi.cl",
  name: "DOKEBI",
  description:
    "Corndogs coreanos, tteokbokki y bebidas de Corea, fritos al momento en Barrio Italia y Los Leones, Providencia. Delivery y opciones veganas.",
  // ponytail: ambos locales apuntan a la tienda de Providencia hasta tener el link de Los Leones.
  ubereats,
  nav: [
    { href: "/#menu", label: "Menú" },
    { href: "/#locales", label: "Locales" },
    { href: "/#fuera-del-meson", label: "Fuera del mesón" },
    { href: "/#merch", label: "Merch" },
    { href: "/#faq", label: "FAQ" },
  ],
  social: [
    { id: "instagram", label: "Instagram", handle: "@dokebi.cl", href: "https://www.instagram.com/dokebi.cl/" },
  ],
  /** Número internacional sin "+", ej. 569XXXXXXXX. null = aún no definido. */
  whatsapp: null as string | null,
  deliveryApps: "[y otras apps]",
  deliveryZone: "[zona]",
} as const;

/** Link de WhatsApp con mensaje. Sin número aún: lleva a #locales (se compra en el local). */
let avisado = false;
export function whatsappLink(mensaje: string) {
  if (!site.whatsapp) {
    if (process.env.NODE_ENV === "development" && !avisado) {
      avisado = true;
      console.warn("[site] whatsapp es null: los botones de merch llevan a #locales.");
    }
    return { href: "/#locales", external: false };
  }
  return { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`, external: true };
}
