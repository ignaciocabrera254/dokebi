import { site } from "./site";

export const faq = [
  {
    q: "¿Qué es un corndog coreano?",
    a: "Un snack callejero de Corea: salchicha, mozzarella (o las dos) en un palito, cubiertas con masa, panko y a veces cubos de papa, y fritas al momento. Se terminan con azúcar y salsas. Crujiente por fuera, elástico por dentro.",
  },
  {
    q: "¿Tienen opciones veganas?",
    a: "Sí, tenemos opciones veganas. Corndogs con salchicha vegana, pastel de arroz o mixto, en tres coberturas: camote, ramen y quinoa. Además: mandu y tteokkochi. Usa el filtro «Solo vegano» del menú para verlos todos.",
  },
  {
    q: "¿Hacen delivery?",
    a: `Sí, por Uber Eats ${site.deliveryApps}. Toca «Pedir» y elige el local más cercano. Zona de reparto: ${site.deliveryZone}.`,
  },
] as const;
