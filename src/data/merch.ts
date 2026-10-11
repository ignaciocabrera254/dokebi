export type MerchItem = {
  id: string;
  nombre: string;
  categoria: (typeof categorias)[number]["id"];
  /** Ruta bajo public/merch/, ej. "/merch/gorro-negro.webp". null = placeholder. */
  foto: string | null;
  /** Texto ya formateado, ej. "$12.990". null = [PRECIO]. */
  precio: string | null;
};

export const categorias = [
  { id: "poleras", label: "Poleras" },
  { id: "gorros", label: "Gorros" },
  { id: "totes", label: "Tote bags" },
  { id: "stickers", label: "Stickers" },
  { id: "pines", label: "Pines" },
] as const;

// Agregar productos aquí: aparecen solos en /merch (tab de su categoría).
export const merch: readonly MerchItem[] = [
  { id: "polera", nombre: "Polera Dokebi", categoria: "poleras", foto: "/merch/poleras/polera-v1.webp", precio: "$24.990" }, // FICTICIO
  { id: "gorro-1", nombre: "Gorro Dokebi burdeo", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-burdeo-600.webp", precio: "$19.990" },
  { id: "gorro-2", nombre: "Gorro Dokebi oliva", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-oliva-600.webp", precio: "$19.990" },
  { id: "gorro-3", nombre: "Gorro Dokebi verde", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-verde-600.webp", precio: "$19.990" },
  { id: "gorro-4", nombre: "Gorro Dokebi lila", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-lila-600.webp", precio: "$19.990" },
  { id: "gorro-5", nombre: "Gorro Dokebi negro", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-negro-600.webp", precio: "$19.990" },
  { id: "gorro-6", nombre: "Gorro Dokebi azul-gris", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-azul-gris-600.webp", precio: "$19.990" },
  { id: "gorro-7", nombre: "Gorro Dokebi beige", categoria: "gorros", foto: "/merch/gorros/gorro-dokebi-beige-600.webp", precio: "$19.990" },
  { id: "tote", nombre: "Tote bag", categoria: "totes", foto: "/merch/totebag/totebag.webp", precio: "$12.990" }, // FICTICIO
  { id: "stickers", nombre: "Pack de stickers", categoria: "stickers", foto: "/merch/stickers/stickers-v1.webp", precio: "$4.990" }, // FICTICIO
  { id: "pin-1", nombre: "Pin smiley amarillo", categoria: "pines", foto: "/merch/pines/pin-smiley-amarillo-v1.webp", precio: "$3.990" }, // FICTICIO
  { id: "pin-2", nombre: "Pin corazón verde", categoria: "pines", foto: "/merch/pines/pin-corazon-verde-v1.webp", precio: "$3.990" }, // FICTICIO
  { id: "pin-3", nombre: "Pin llama azul", categoria: "pines", foto: "/merch/pines/pin-llama-azul-v1.webp", precio: "$3.990" }, // FICTICIO
  { id: "pin-4", nombre: "Pin corazón rojo", categoria: "pines", foto: "/merch/pines/pin-corazon-rojo-v1.webp", precio: "$3.990" }, // FICTICIO
  { id: "pin-5", nombre: "Pin Dokebi Santiago, Seoul", categoria: "pines", foto: "/merch/pines/pin-dokebi-seoul-v1.webp", precio: "$3.990" }, // FICTICIO
  { id: "pin-6", nombre: "Pin Just Be Happy", categoria: "pines", foto: "/merch/pines/pin-just-be-happy-v1.webp", precio: "$3.990" }, // FICTICIO
];

// La home muestra el primer producto de estas categorías (solo estas, aunque /merch tenga más).
const categoriasHome = ["poleras", "gorros", "totes", "stickers", "pines"];
export const merchHome = categoriasHome
  .map((c) => merch.find((m) => m.categoria === c))
  .filter((m): m is MerchItem => !!m);
