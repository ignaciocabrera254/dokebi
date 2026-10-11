# DOKEBI · Web — Reglas del proyecto

Web de DOKEBI, street food coreano con dos locales en Providencia, Santiago (Barrio Italia y Los Leones).
Sitio de marketing estático, muy visual, con interacciones al hacer scroll, donde el SEO es prioridad.

## Stack

- Next.js (App Router) + TypeScript, generación estática (todas las rutas pre-renderizadas).
- Tailwind CSS con los tokens de abajo definidos en la config (no usar colores ni tamaños arbitrarios fuera de ellos).
- Animaciones: GSAP + ScrollTrigger con `@gsap/react` (`useGSAP`), scroll suave con Lenis. **No se agregan en la etapa 1.**
- Hero 3D (etapa 2 en adelante): React Three Fiber + drei, cargado con `dynamic(..., { ssr: false })`.
- Fuentes autoalojadas con `next/font/google` (nunca `<link>` a Google Fonts).
- Imágenes con `next/image`.

## Reglas de arquitectura

- Server Components por defecto. Solo son componentes cliente los que necesitan interacción (filtro del menú, header que cambia al scroll, hero 3D, animaciones).
- Cada sección de la home es un componente en `src/components/sections/`.
- Los contenidos viven en datos, no en los componentes: `src/data/menu.json`, `src/data/locales.ts`, `src/data/merch.ts`, `src/data/faq.ts`, `src/data/site.ts` (links, redes, Uber Eats).
- Los archivos en `/design` son **referencia visual**. No copiar su HTML ni sus estilos inline: extraer tokens, estructura y componentes.
- Los textos entre corchetes (`[PRECIO]`, `[USUARIO]`, `[ZONA]`, etc.) son contenido pendiente: mantenerlos como placeholders visibles en los datos, no inventarlos.

## Tokens

### Color
| Token | Valor | Uso |
|---|---|---|
| `ink` | `#0A0A0A` | Negro principal, fondos oscuros, texto sobre amarillo/blanco |
| `yolk` | `#FFD400` | Amarillo de marca, CTAs, acentos |
| `paper` | `#FFFFFF` | Blanco |
| `chili` | `#E4002B` | Solo para la variante picante del smiley y llamas |
| `gray-100` | `#F2F2F2` | Fondos claros secundarios |
| `gray-200` | `#D6D6D6` | Texto secundario sobre negro |
| `gray-300` | `#BDBDBD` | Texto terciario sobre negro, eyebrows |
| `gray-400` | `#A8A8A8` | Labels de placeholders de foto |
| `gray-700` | `#3A3A3A` | Texto secundario sobre blanco |
| `gray-850` | `#1F1F1F` | Bordes sobre negro |
| `gray-900` | `#141414` / `#1B1B1B` | Superficies oscuras, rayado de placeholders |

### Tipografía
- **Display** — Anton, mayúsculas, `letter-spacing: .01em`, line-height 0.88–1. Fallback: `Impact, 'Arial Narrow Bold', sans-serif`. Clase/utility: `font-display`.
- **Texto** — Archivo 400/500/700/800. Fallback: `system-ui, -apple-system, 'Segoe UI', sans-serif`. Base del body.
- **Marker** — Permanent Marker, para notas manuscritas, etiquetas y garabatos. Fallback: `'Comic Sans MS', cursive`. Utility: `font-marker`.
- Tamaños fluidos con `clamp()`: H1 `clamp(56px, 9.6vw, 140px)`, H2 grandes `clamp(64px, 9vw, 140px)`, H2 medianos `clamp(52px, 6vw, 92px)`.

### Forma y estilo
- Botones píldora (`border-radius: 999px`), alto mínimo 48 px (56 px en CTAs grandes). Hover: `translate(-2px,-2px)`.
- Sombras duras sin blur, tipo sticker: `4px 4px 0` / `8px 8px 0` en negro, blanco o amarillo.
- Elementos levemente rotados (−6° a 4°) para el look callejero.
- Ancho máximo de contenido 1280 px, padding lateral `clamp(16px, 4vw, 40px)`.
- Doodles SVG (estrellas, coronas, garabatos, destellos) con trazo grueso, `stroke-linecap: round`.

## Accesibilidad y SEO (obligatorio)

- Un solo H1 ("Korean Street Food · Santiago"), presente en el HTML desde la carga aunque se anime después.
- Jerarquía H2/H3 como en el diseño; `aria-labelledby` en cada sección.
- Todo el contenido visible por animación debe existir en el HTML inicial.
- `prefers-reduced-motion: reduce` → sin animaciones, se muestra el estado final estático (incluido el hero: imagen fija).
- Contraste AA, foco visible, objetivos táctiles ≥ 44 px, `lang="es"`.
- Metadata API de Next: title, description, Open Graph, Twitter card, canonical `https://dokebi.cl`.
- JSON-LD schema.org: `Restaurant` para cada local con dirección, horario (`openingHoursSpecification`), `servesCuisine: "Korean"`, `priceRange`, `hasMenu`, link de pedido.
- `sitemap.ts` y `robots.ts`.
- Objetivo Lighthouse móvil: Performance ≥ 90, Accessibility 100, SEO 100.

## Forma de trabajo

- Trabajar por etapas (ver `SPEC.md`). No adelantar animaciones ni 3D en la etapa 1.
- Al terminar cada tarea: correr `npm run build` y `npm run lint`, y reportar qué quedó distinto al diseño.
- Comparar visualmente contra `/design/desktop-1440.html` y `/design/movil-390.html` (se leen como código; las capturas de pantalla del diseño ayudan a Claude Code a comparar).
