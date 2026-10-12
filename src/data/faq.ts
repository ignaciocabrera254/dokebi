import { site } from "./site";

// 도깨비 se envuelve en <span lang="ko"> al renderizar (Faq.tsx); el JSON-LD usa el texto plano.
export const faq = [
  {
    q: "¿Qué es un corndog coreano?",
    a: "Un snack callejero de Corea: un relleno en palito (aquí, salchicha vegana, pastel de arroz o los dos) cubierto de masa de arroz y una capa crujiente, frito al momento. Se termina con azúcar y salsas. Crujiente por fuera, elástico por dentro.",
  },
  {
    q: "¿Por qué le ponen azúcar al corndog?",
    a: "Así se comen en Corea: el azúcar se derrite con el calor y contrasta con lo salado de la masa y las salsas.",
  },
  {
    q: "¿Tienen opciones veganas?",
    a: "Sí. Los tres rellenos son veganos y puedes combinarlos con cobertura de camote, ramen o quinoa. El mandu y el tteokkochi también son veganos. Activa «Solo vegano» en el menú para verlos todos.",
  },
  {
    q: "¿Hacen delivery?",
    a: `Sí, por Uber Eats ${site.deliveryApps}. Toca «Pedir» y elige el local más cercano. Repartimos en ${site.deliveryZone}.`,
  },
  {
    q: "¿Por qué se llaman Dokebi?",
    a: "Por los 도깨비 (dokkaebi), los duendes traviesos del folclor coreano. Como ellos, nuestra comida es para pasarlo bien, pero tiene su colmillo.",
  },
] as const;
