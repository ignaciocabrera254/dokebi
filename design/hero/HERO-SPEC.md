# Hero 3D — recorrido y variantes

Recorrido por scroll (p → u en `camera-path.ts`): patio 0–0.38, guiño 0.48–0.52 (pausa), pantalla hasta 0.72, fundido amarillo 0.70–0.77, escena pausada desde 0.77 y desmontada al salir del hero. Pin de 2.8 pantallas, FOV 50 (horizontal) / 68 (vertical), dpr máx. 1.5.

## Variante según orientación

`matchMedia('(max-aspect-ratio: 1/1)')` en `HeroIntro`: vertical = **teléfono**, horizontal = **notebook**. Se evalúa al montar y en cada cambio; el `<Canvas key={variant}>` se remonta y el recorrido se recalcula. Solo se monta el objeto de la variante activa. `?debug` muestra la variante en el HUD.

## Notebook (horizontal)
Ubicación (−1.9, 1.11, 0.22), rotY 0.25. Textura `public/hero/pantalla.webp`. Puntos 4–6: pantalla + normal·1.5 (+0.3 y), ·0.55, ·0.17; objetivo = centro de pantalla (−0.008 en su up).

## Teléfono (vertical)
Misma ubicación y rotY. Cuerpo 0.08 × 0.165 × 0.008 m, `#2B2B2B`, `RoundedBox`, sobre soporte simple, inclinado −0.2 rad. Pantalla 0.074 × 0.158 m, `MeshBasicMaterial` con `public/hero/pantalla-movil.webp` (captura de la home a 390 × 844 con `/?captureHero=1`, 727 × 1553).
Puntos 0–3 iguales al notebook. Con S = centro de pantalla y sn = su normal:
- 4: S + sn·0.8 + (0, 0.2, 0), objetivo S + (0, −0.03, 0)
- 5: S + sn·0.3, objetivo S
- 6: S + sn·0.11, objetivo S

A 0.11 m con FOV 68 la vista cubre 0.148 × 0.068 m < 0.158 × 0.074: la pantalla llena el encuadre sin mostrar el borde del cuerpo. `near = 0.01` en ambas variantes. Cubierto en `tests/hero-camera.test.mjs`.
