# Hero 3D

`npm run test:hero` (Node 22.18+ o 24) verifica el mapeo de scroll, la pausa 0.48–0.52, los puntos paramétricos sincronizados y la posición final respecto de la pantalla inclinada.

## Revisión en navegador

- `/`: imagen inicial → patio → guiño → notebook → amarillo → H1.
- `/?debug`: OrbitControls y recorrido visible. Desmarcar **Cámara libre** y usar **Progreso → Ir** para revisar 0, 0.38, 0.48, 0.52, 0.60, 0.72, 0.80 y 1.
- `/?reducedMotion`: forzar la misma rama que `prefers-reduced-motion` para QA, sin pin, canvas ni Lenis. La preferencia real del sistema también se escucha en vivo.
- `/?captureHero=1`: captura de la web para la textura del notebook.

Comprobar desktop (1440 × 900) y móvil (390 × 844), Saltar intro con teclado, retorno hacia arriba y navegación a /merch y de vuelta. En la rama normal la escena se desmonta desde p=0.81 y se reconstruye al volver a subir. `data-scene` y `data-progress` en `.hero-intro` permiten comprobarlo desde el DOM.

`npm run build:webpack` usa webpack si el entorno impide a Turbopack abrir su puerto interno para compilar CSS. Ambos compiladores usan la configuración estándar de Tailwind/PostCSS.
