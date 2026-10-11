export const polaroids = [
  { id: "fila", src: "/images/barrio/fila-v1.webp", alt: "Escena generada de clientes frente al local amarillo de DOKEBI", foto: "Fila en Av. Italia", caption: "viernes, 8 pm", ratio: "aspect-[3/4]", pos: "-rotate-3 lg:translate-y-6" },
  { id: "mordisco", src: "/images/barrio/mordisco-v1.webp", alt: "Escena generada de un corndog con un mordisco frente a DOKEBI", foto: "Corndog en mano frente al local", caption: "el primer mordisco", ratio: "aspect-[4/5]", pos: "rotate-2" },
  { id: "delivery", src: "/images/barrio/delivery-v1.webp", alt: "Escena generada de entrega de cajas amarillas en el mostrador de DOKEBI", foto: "Entrega de cajas amarillas en el mostrador", caption: "delivery saliendo", ratio: "aspect-square", pos: "-rotate-[1.5deg] lg:translate-y-14" },
  { id: "bebidas", src: "/images/barrio/bebidas-v1.webp", alt: "Escena generada de dos latas conceptuales de soda de melón frente a DOKEBI", foto: "Soda de melón frente al local", caption: "melón soda, por favor", ratio: "aspect-[3/4]", pos: "rotate-[3.5deg] lg:translate-y-3" },
] as const;

export const colaboraciones = [
  { titulo: "[MARCA O ARTISTA] × DOKEBI", detalle: "[Qué hicieron juntos]" },
  { titulo: "[MARCA O ARTISTA] × DOKEBI", detalle: "[Qué hicieron juntos]" },
  { titulo: "[MARCA O ARTISTA] × DOKEBI", detalle: "[Qué hicieron juntos]" },
] as const;

export const eventos = [
  { fecha: "[DD MMM]", nombre: "[NOMBRE DEL EVENTO]", lugar: "Barrio Italia" },
  { fecha: "[DD MMM]", nombre: "[NOMBRE DEL EVENTO]", lugar: "Los Leones" },
  { fecha: "[DD MMM]", nombre: "[NOMBRE DEL EVENTO]", lugar: "[LUGAR]" },
] as const;

export const prensa = {
  cita: "[CITA DE PRENSA SOBRE DOKEBI]",
  medio: "La Cuarta",
  fecha: "[FECHA]",
  href: "https://www.lacuarta.com/emprendimiento/noticia/dokebi-el-sabor-tradicional-del-street-food-coreano-en-el-corazon-de-barrio-italia/3TALMX5BFRFWZPOB3ZQKIJICJI/",
};
