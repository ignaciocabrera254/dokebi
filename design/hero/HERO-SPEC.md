# Hero 3D — recorrido y variantes

Recorrido por scroll (p → u en `camera-path.ts`): patio 0–0.38, guiño 0.48–0.52 (pausa), pantalla hasta 0.72, fundido amarillo 0.70–0.77, escena pausada desde 0.77 y desmontada al salir del hero. Pin de 177svh (154svh en móvil), FOV 50 (horizontal) / 68 (vertical), dpr máx. 1.5. Tiempos y empalme con el H1 sin cambios.

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

## Variante según orientación

`matchMedia('(max-aspect-ratio: 1/1)')` en `HeroIntro`: vertical = **teléfono**, horizontal = **notebook**. Se evalúa al montar y en cada cambio; el `<Canvas key={variant}>` se remonta y el recorrido se recalcula. Solo se monta el objeto de la variante activa. `?debug` muestra la variante en el HUD.

## Notebook (horizontal)
Ubicación (−1.9, 1.11, 0.33), rotY −0.35. Textura `public/hero/pantalla.webp`. Puntos 4–6: pantalla + normal·1.5 (+0.3 y), ·0.55, ·0.17; objetivo = centro de pantalla (−0.008 en su up).

## Teléfono (vertical)
Misma ubicación y rotY. Cuerpo 0.08 × 0.165 × 0.008 m, `#2B2B2B`, `RoundedBox`, sobre soporte simple, inclinado −0.2 rad. Pantalla 0.074 × 0.158 m, `MeshBasicMaterial` con `public/hero/pantalla-movil.webp` (captura de la home a 390 × 844 con `/?captureHero=1`, 727 × 1553).
Puntos 0–3 iguales al notebook. Con S = centro de pantalla y sn = su normal:
- 4: S + sn·0.8 + (0, 0.2, 0), objetivo S + (0, −0.03, 0)
- 5: S + sn·0.3, objetivo S
- 6: S + sn·0.11, objetivo S

A 0.11 m con FOV 68 la vista cubre 0.148 × 0.068 m < 0.158 × 0.074: la pantalla llena el encuadre sin mostrar el borde del cuerpo. `near = 0.01` en ambas variantes. Cubierto en `tests/hero-camera.test.mjs`.
