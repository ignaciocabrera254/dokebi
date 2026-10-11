# Prompt inicial para Claude Code — Etapa 1

Copia este texto en Claude Code desde la raíz del proyecto (con este paquete ya copiado ahí):

---

Lee `CLAUDE.md`, `SPEC.md` y los archivos de `/design` (son referencia visual: no copies su HTML ni sus estilos inline).

Vamos a construir la **etapa 1**: la web estática completa, sin animaciones ni 3D.

1. Crea un proyecto Next.js (App Router, TypeScript, Tailwind, ESLint, carpeta `src/`). Configura los tokens de color, las tres fuentes con `next/font` y las utilities `font-display` y `font-marker` según `CLAUDE.md`.
2. Mueve `data/menu.json` a `src/data/` y crea los demás archivos de datos (`locales.ts`, `merch.ts`, `faq.ts`, `site.ts`) con el contenido de `SPEC.md`, manteniendo los placeholders entre corchetes.
3. Crea los componentes base: `Smiley` (con props `size`, `wink`, `fangs`, `spicy` y cada parte en un `<g>` separado), `Doodle`, `Button` (variantes del diseño) y `Section`.
4. Construye el header y las 8 secciones en orden, cada una en `src/components/sections/`, en su **estado final**, responsive según desktop 1440 y móvil 390. El hero lleva una imagen estática placeholder de la fachada + el bloque amarillo con el H1, más el botón "Saltar intro".
5. El filtro del menú (categorías + "Solo vegano") es el único componente cliente de esta etapa, junto con el menú móvil del header. Todos los productos deben estar en el HTML inicial.
6. SEO: metadata, Open Graph, JSON-LD `Restaurant` para los dos locales y `FAQPage`, `sitemap.ts` y `robots.ts`.

Trabaja sección por sección y muéstrame el avance después del header + hero antes de seguir con el resto. Al terminar, corre `npm run build` y `npm run lint`, y dame una lista de lo que quedó distinto al diseño o pendiente.
