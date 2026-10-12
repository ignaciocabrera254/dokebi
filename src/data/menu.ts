import data from "./menu.json";

export type MenuItem = (typeof data.items)[number];
export const menu = data;

export const menuBajada = "Todo se fríe cuando lo pides y llega en nuestra caja amarilla.";

// Manual para no depender del ICU del runtime (mismo resultado en servidor y cliente).
export const clp = (n: number) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
export const precio = (n: number | null) => (n == null ? "[PRECIO]" : clp(n));

const precios = data.items.map((i) => i.precio).filter((p): p is number => p != null);
export const rangoPrecios = `${clp(Math.min(...precios))} - ${clp(Math.max(...precios))} CLP`;
