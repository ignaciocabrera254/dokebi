import { site } from "./site";

const comida = [
  ["13:00", "15:30"],
  ["16:30", "20:30"],
] as const;

type Range = readonly [string, string];

export type HorarioGrupo = {
  label: string;
  days: readonly string[];
  ranges: readonly Range[];
};

const tarde = (cierre: string): readonly Range[] => [
  ["13:00", "15:30"],
  ["16:30", cierre],
];

// Mismo horario en ambos locales (por ahora).
export const horario: readonly HorarioGrupo[] = [
  { label: "Lunes", days: ["Monday"], ranges: [] },
  { label: "Mar – Jue", days: ["Tuesday", "Wednesday", "Thursday"], ranges: comida },
  { label: "Viernes", days: ["Friday"], ranges: tarde("21:00") },
  { label: "Sábado", days: ["Saturday"], ranges: tarde("21:30") },
  { label: "Domingo", days: ["Sunday"], ranges: tarde("19:00") },
];

export const colacion = "Cerrado de 15:30 a 16:30";

export type Local = {
  id: string;
  nombre: string;
  calle: string;
  detalle?: string;
  comuna: string;
  ciudad: string;
  tema: "dark" | "light";
  mapsUrl: string;
  ubereats: string;
};

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const locales: readonly Local[] = [
  {
    id: "barrio-italia",
    nombre: "Barrio Italia",
    calle: "Av. Italia 1187",
    detalle: "local 2",
    comuna: "Providencia",
    ciudad: "Santiago",
    tema: "dark",
    mapsUrl: maps("Av. Italia 1187, Providencia, Santiago"),
    ubereats: site.ubereats,
  },
  {
    id: "los-leones",
    nombre: "Los Leones",
    calle: "Av. Providencia 2345",
    comuna: "Providencia",
    ciudad: "Santiago",
    tema: "light",
    mapsUrl: maps("Av. Providencia 2345, Providencia, Santiago"),
    ubereats: site.ubereats,
  },
];

export const direccion = (l: Local) => (l.detalle ? `${l.calle}, ${l.detalle}` : l.calle);
