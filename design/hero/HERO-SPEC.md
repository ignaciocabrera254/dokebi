# Hero 3D — recorrido y variantes

Recorrido del pin (p = progreso 0–1; `camera-path.ts`, `HeroIntro.tsx`):

| p | fase | control |
|---|---|---|
| 0 – 0.30 | aproximación por el patio | scroll |
| 0.30 – 0.45 | zoom a la carita del letrero; guiño 0.36–0.45 | scroll |
| 0.45 – 0.90 | la cámara baja al dispositivo y entra en su pantalla hasta llenar la vista | **automático** |
| 0.90 – 0.98 | fundido a amarillo `#FFD400` sobre el canvas | automático |
| 1 | se suelta el pin, el stage se oculta y llega el bloque del H1 | — |

Mapeo p → u de la curva: `[[0,0],[.30,.50],[.38,.60],[.45,.60],[.90,1],[1,1]]`. Alto del hero: 260svh en desktop (pin de 1.6 pantallas) y 220svh en móvil (1.2), FOV 50 (horizontal) / 68 (vertical), dpr máx. 1.5. `near` 0.02 (notebook) / 0.01 (teléfono).

## Curva final y `dFill`

La curva de cámara tiene 6 puntos (u = 0, .2, .4, .6, .8, 1): inicio, dos del patio, zoom a la carita (boca + normal del letrero · 1.5), sobre el dispositivo (centro de pantalla + normal · 1.0 + 0.18 arriba) y frente a la pantalla a `dFill`. El objetivo termina en el centro de la pantalla. Todo sale de posiciones reales (`getWorldPosition` / `getWorldQuaternion`).

```
half  = tan(fov / 2)
dFill = min((altoPantalla / 2) / half, (anchoPantalla / 2) / (half · aspect)) · 0.88
```

La pantalla mide 0.32 × 0.2075 m (notebook) y 0.074 × 0.158 m (teléfono). `dFill` se recalcula al cambiar el tamaño de la ventana (`fillDistance` en `camera-path.ts`; cubierto por `tests/hero-camera.test.mjs`).

## Tramo automático (lenis)

`HeroIntro` escucha el evento `scroll` de Lenis. Con dirección hacia abajo y p entre 0.46 y 0.995 llama a `lenis.scrollTo(finDelPin, { duration: 1.5, easing: easeInOutCubic, lock: true, force: true })`. Hacia arriba, con p entre 0.46 y 0.99, devuelve el scroll a p = 0.45 (duración proporcional a la distancia, mínimo 0.45 s). Mientras dura (`auto`), la cámara toma el progreso directo, sin el suavizado de 0.12, y `html.lenis-locked` aplica `touch-action: none` para que el gesto táctil no pelee con la animación. Un temporizador de seguridad libera el estado si Lenis no avisa el final. "Saltar intro" usa el mismo tramo hacia p = 1. `?noauto` lo desactiva (capturas).

## Llegada al H1

El bloque amarillo del H1 tiene `margin-top: -100svh`, `min-height: 100svh` y `z-index` bajo el hero; su contenido está en `opacity: 0` mientras el pin dura. Al llegar a p = 1 (`html.hero-arrived`): el stage pasa a `visibility: hidden` (el bloque queda interactivo), el contenido aparece con un fade de 450 ms y el H1 se revela palabra por palabra (`title-in`). Al subir se resetea. El header pasa a negro sólido con p > 0.68.

## Variante según orientación

`matchMedia('(max-aspect-ratio: 1/1)')` en `HeroIntro`: vertical = **teléfono**, horizontal = **notebook**. Se evalúa al montar y en cada cambio; el `<Canvas key={variant}>` se remonta y el recorrido se recalcula. Solo se monta el objeto de la variante activa.

## Pantalla del dispositivo

Fondo amarillo `#FFD400` con la carita del logo del header centrada (~21 % del ancho en el notebook, ~40 % en el teléfono): `createScreenTexture` toma el `<svg>` real del logo (`header a[aria-label^='DOKEBI'] svg`), lo serializa → `Image` → canvas → `CanvasTexture` (1024×664 / 727×1553). `MeshBasicMaterial`, sin iluminación ni tone mapping.

## Ángulo y ambientación (rediseño)

Referencia de composición: `referencia-ambientacion.png` (solo composición y ambiente; el estilo sigue siendo 3D ilustrado: volúmenes simples, colores planos).

- **Cámara inicial**: tres cuartos desde la izquierda, a la altura de los ojos y mirando un poco hacia arriba: posición (−4.2, 1.5, 6.9), objetivo (0.4, 2.4, 0) (`START` / `START_TARGET`). Más lejos que el punto sugerido (−6.5, 1.55, 9.5) porque con FOV 50 el local quedaba pequeño frente a la referencia.
- **Recorrido**: `createCameraPath(screen, orientation, variante, mouth, normal)`. La boca de la carita y su normal salen del mesh real del letrero (`getWorldPosition`/`getWorldQuaternion` en `HeroCanvas`), igual que la pantalla. Puntos: inicio → (−4.3, 1.6, 5.4) → (−4.4, 1.9, 3.5) → boca + normal·1.5 → dispositivo (notebook 1.5/0.55/0.17 m; teléfono 0.8/0.3/0.11 m).
- **Letrero redondo** rotY −0.45 (mira al ángulo de entrada), guiño y oscilación igual que antes. **Notebook/teléfono** rotY −0.35, en el extremo izquierdo del mesón (frente al muro del merch).
- **Archivos**: `HeroCanvas.tsx` (escena, luces, cámara), `Kiosk.tsx` (local), `Ambience.tsx` (patio, piso), `Effects.tsx` (Bloom + viñeta, carga perezosa solo en desktop), `parts.tsx` (Box, Panel, Instanced, Glows), `scene-textures.ts` (canvas).
- **Local**: letrero con relieve (capas) y brillo, "korean food"; muro izquierdo con merch colgado; muro derecho con dos paneles (핫도그 · KOREAN CORNDOG con Panko / Dokebi Seúl / Camote, 떡볶이 · TTEOKBOKKI con sartén); mesón con bandeja de corndogs, sartén con vapor animado (6 sprites), torres de vasos (instanciadas) y palillero; interior con repisas y snacks, cajas amarillas, campana, refri con caritas, riel con focos encendidos.
- **Patio**: primer plano con borde de mesa y silla cortados; 3 quitasoles verde oscuro con mesas y sillas; 3 guirnaldas (ampolletas instanciadas + halos); 4 maceteros con plantas low-poly (hojas como planos cruzados instanciados); 2 bancas; 5 faroles de piso; pilar de madera con letrero vertical de neón 도깨비 + carita.
- **Fuente coreana**: los textos de canvas (paneles, neón) usan Black Han Sans (subset local `src/fonts/BlackHanSans-dokkaebi.woff2` con 도깨비 인기 핫도그 떡볶이); las texturas se redibujan una vez cuando la fuente carga.
- **Iluminación**: ambiente azul oscuro (hemisférica + direccional fría) y 4 luces puntuales cálidas (interior del local, frente del local, guirnaldas del patio, neón). El resto del brillo es emisivo (colores HDR `HOT`/`NEON`) o sprites/puntos aditivos. Fondo y niebla `#080B14`.
- **Desktop** (`notebook`): piso `MeshReflectorMaterial` (512 px, `mixStrength` 0.7, `mirror` 0.35), `Bloom` (umbral 0.85, mipmapBlur) y `Vignette`, `multisampling` 4. **Móvil** (`telefono`): piso liso, sin postprocesado, brillo con halos aditivos, `antialias` nativo.
- **Imagen estática (LCP)**: `public/hero/fachada.webp` (1920×1080) y `fachada-movil.webp` (780×1688), render del primer cuadro (`?debug&follow&clean`), servidas con `<picture>` + `getImageProps`. Hay que regenerarlas si cambia la escena o la cámara inicial.

## Presupuesto

Objetivo: 60 fps en un notebook medio y 30+ en un celular de gama media. Medido (variante móvil, 390×844, `?debug`): 81 draw calls, ~10.7k triángulos, 74 geometrías, 10 texturas. Ampolletas, vasos, hojas, snacks, vigas y faroles van instanciados; los halos son un solo `Points`. Por frame solo se actualizan la cámara, el vapor y el guiño. No se midieron fps en dispositivos reales.

## Depuración

`?debug` muestra el HUD y la cámara libre; `?debug&follow` usa la cámara del recorrido; `&clean` oculta la línea del recorrido. En debug, `window.__heroProgress.current` permite fijar el progreso y `window.__heroInfo()` devuelve `renderer.info`.

## Dispositivos

- **Notebook (horizontal)**: ubicación (−1.9, 1.11, 0.33), rotY −0.35, pantalla 0.32 × 0.2075 m. `?debug` muestra la variante en el HUD.
- **Teléfono (vertical)**: misma ubicación y rotY. Cuerpo 0.08 × 0.165 × 0.008 m, `#2B2B2B`, `RoundedBox`, sobre soporte simple, inclinado −0.2 rad; pantalla 0.074 × 0.158 m.
- Las dos variantes comparten la curva de 6 puntos (arriba); solo cambian el FOV y el tamaño de pantalla que entran en `dFill`.
