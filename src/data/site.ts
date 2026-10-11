const ubereats = "https://www.ubereats.com/cl/store/dokebi-providencia/rYDa6_ZzUDK76ZOCxcTVFQ";

export const site = {
  url: "https://dokebi.cl",
  name: "DOKEBI",
  description:
    "Korean Street Food en Santiago: corndogs coreanos, tteokbokki y bebidas coreanas, fritos al momento en Barrio Italia y Los Leones. Delivery y opciones veganas.",
  // ponytail: ambos locales apuntan a la tienda de Providencia hasta tener el link de Los Leones.
  ubereats,
  nav: [
    { href: "/#menu", label: "Menú" },
    { href: "/#barrio", label: "El barrio" },
    { href: "/#locales", label: "Locales" },
    { href: "/#merch", label: "Merch" },
    { href: "/#faq", label: "FAQ" },
  ],
  social: [
    { id: "instagram", label: "Instagram", handle: "@[USUARIO]", href: "#" },
    { id: "tiktok", label: "TikTok", handle: "@[USUARIO]", href: "#" },
  ],
  merchLink: "#", // [LINK "Lo quiero": ¿tienda, Instagram, WhatsApp?]
  deliveryApps: "[Y OTRAS APPS]",
  deliveryZone: "[ZONA]",
} as const;
