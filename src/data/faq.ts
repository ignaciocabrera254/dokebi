import { site } from "./site";

export const faq = [
  {
    q: "¿Qué es un corndog coreano?",
    a: "Un snack callejero de Corea: un relleno en palito (aquí salchicha vegana, pastel de arroz o los dos), cubierto con masa de arroz y una cobertura crujiente, frito al momento. Se termina con azúcar y salsas. Crujiente por fuera, elástico por dentro.",
  },
  {
    q: "¿Tienen opciones veganas?",
    a: "Sí, tenemos opciones veganas. Corndogs con salchicha vegana, pastel de arroz o mixto, en tres coberturas: camote, ramen y quinoa. Además: mandu y tteokkochi. Usa el filtro «Solo vegano» del menú para verlos todos.",
  },
  {
    q: "¿Hacen delivery?",
    a: `Sí, por Uber Eats ${site.deliveryApps}. Toca «Pedir» y elige el local más cercano. Zona de reparto: ${site.deliveryZone}.`,
  },
  {
    q: "¿Por qué se llaman Dokebi?",
    a: "Por los dokkaebi, los duendes traviesos del folclor coreano: les encantan las bromas, la música y la buena comida, y a veces premian a quien los trata bien. Por eso nuestra carita sonríe, pero con colmillo.",
  },
] as const;
