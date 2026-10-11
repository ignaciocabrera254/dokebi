import type { Local } from "@/data/locales";
import { direccion } from "@/data/locales";

/** Imagen estática que enlaza a Google Maps (sin carga de terceros). Pin smiley. */
export function LocalMap({ local }: { local: Local }) {
  const dark = local.tema === "dark";
  const pin = dark ? { x: 266, y: 96 } : { x: 280, y: 76 };
  return (
    <a
      href={local.mapsUrl}
      target="_blank"
      rel="noopener"
      aria-label={`Ver ${direccion(local)} en Google Maps`}
      className={`relative block overflow-hidden rounded-lg border-2 ${dark ? "border-[#2A2A2A]" : "border-ink"}`}
    >
      <svg role="img" aria-label={`Mapa ilustrativo de ${local.calle}`} viewBox="0 0 560 260" preserveAspectRatio="xMidYMid slice" className="block h-[180px] w-full md:h-[260px]">
        {dark ? (
          <>
            <rect width="560" height="260" fill="#161616" />
            <path d="M0 60 L560 40 M0 150 L560 135 M0 230 L560 220 M90 0 L110 260 M420 0 L440 260" stroke="#2C2C2C" strokeWidth="10" />
            <path d="M230 0 L300 260" stroke="#FFF" strokeWidth="16" />
            <text x="318" y="236" fill="#FFF" fontFamily="Archivo, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">AV. ITALIA</text>
          </>
        ) : (
          <>
            <rect width="560" height="260" fill="#F2F2F2" />
            <path d="M60 0 L70 260 M180 0 L186 260 M440 0 L452 260 M0 40 L560 30 M0 220 L560 214" stroke="#D9D9D9" strokeWidth="10" />
            <path d="M0 140 L560 120" stroke="#0A0A0A" strokeWidth="16" />
            <path d="M318 0 L326 260" stroke="#0A0A0A" strokeWidth="8" />
            <text x="20" y="168" fill="#0A0A0A" fontFamily="Archivo, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">AV. PROVIDENCIA</text>
            <text x="336" y="246" fill="#0A0A0A" fontFamily="Archivo, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2">LOS LEONES</text>
          </>
        )}
        <g className="map-pin" transform={`translate(${pin.x} ${pin.y})`}>
          <path d="M0 36 l0 -14" stroke={dark ? "#FFD400" : "#0A0A0A"} strokeWidth="4" />
          <circle r="24" fill="#FFD400" stroke="#0A0A0A" strokeWidth="4" />
          <circle cx="-9" cy="-6" r="3.5" fill="#0A0A0A" />
          <circle cx="9" cy="-6" r="3.5" fill="#0A0A0A" />
          <path d="M-12 5 Q0 17 12 5" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </svg>
      <span className={`absolute bottom-2.5 left-3 text-[11px] font-bold tracking-[0.08em] uppercase ${dark ? "text-gray-400" : "text-gray-700"}`}>
        Ver en Google Maps ↗
      </span>
    </a>
  );
}
