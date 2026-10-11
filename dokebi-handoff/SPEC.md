# DOKEBI · Especificación de la home

Referencias: `design/desktop-1440.html`, `design/movil-390.html`, `design/smiley.html`.
`design/storyboard-hero-original.html` documenta el hero anterior (smiley gigante). **Ese hero se reemplaza** por la entrada a la tienda en 3D; se conserva como referencia de ritmo y de la transición al amarillo.

Cada sección tiene: **Contenido / estado final** (etapa 1) y **Motion** (etapa 3, salvo el hero que tiene su propio camino).

---

## Etapas

1. **Web estática.** Todas las secciones en su estado final, responsive, con datos, SEO y accesibilidad. Hero con imagen estática + H1. Sin GSAP, sin 3D.
2. **Prototipo del hero 3D.** Escena R3F con volúmenes grises, recorrido de cámara por scroll y transición al bloque amarillo. Validar sensación y rendimiento en móvil.
3. **Animaciones del resto de las secciones** (en paralelo al modelado del local en Blender).
4. **Integración del modelo final y pulido.** GLB optimizado, letrero smiley animado, carga progresiva, Lighthouse, reduced motion.

---

## Componente Smiley

SVG `viewBox="0 0 200 200"`, cara amarilla con contorno negro grueso. Props:

- `size` (px)
- `wink` — ojo izquierdo cerrado en arco
- `fangs` (default `true`) — boca abierta negra con dos colmillos blancos; si `false`, sonrisa simple
- `spicy` — cara roja (`chili`), ojos en `> <`, cejas, boca más abierta, gota de sudor y tres llamas rojas encima (anula `wink`)

Cada parte (ojos, boca, colmillos, llamas) debe ser un grupo `<g>` separado con clase/id para poder animarla después.
Se usa en: logo del header (44 px), tarjetas del menú (52 px, `spicy` según el ítem), pin de los mapas, lluvia del footer y letrero de la fachada en el hero 3D.

---

## Header

**Contenido:** Smiley 44 px + "Dokebi" en display · nav (Menú, El barrio, Locales, Merch, FAQ) · botón amarillo "Pedir →" a Uber Eats.
Móvil: logo + Pedir + botón de menú (hamburguesa con panel).

**Motion:** fijo. Transparente sobre el hero; al pasar el hero pasa a negro sólido y baja de 76 a 60 px. "Pedir" siempre visible.

---

## 1 · Hero — Entrada a la tienda (NUEVO)

**Concepto:** la web abre en la vereda frente a la fachada de DOKEBI (3D ilustrado: toon shading, contornos negros, paleta negro/amarillo/blanco). El letrero luminoso es el smiley. Al hacer scroll la cámara avanza hacia la puerta, el smiley del letrero guiña, la cámara cruza la puerta y el interior se funde con el bloque amarillo del H1.

**Estado final / etapa 1:**
- Bloque oscuro de altura de pantalla con una imagen estática de la fachada (placeholder por ahora; luego, render del modelo). Esta imagen es el LCP y el fallback del 3D.
- Eyebrows: "Barrio Italia · Los Leones" (izq.) y "Desde Seúl a Providencia" (der.).
- Indicador "baja… si te atreves" en marker amarillo con flecha dibujada.
- Botón discreto "Saltar intro" que lleva a `#titulo-principal`.
- Debajo, bloque amarillo con:
  - H1 "Korean Street Food · Santiago" (display, `clamp(56px, 9.6vw, 140px)`).
  - Bajada: "Comida que te hace sonreír, pero con colmillo. Corndogs coreanos, tteokbokki y bebidas coreanas, fritos al momento en Barrio Italia y Los Leones."
  - CTAs: "Pedir delivery" (negro, texto amarillo, sombra blanca) y "Ver el menú" (borde negro).
  - Línea: DELIVERY ★ OPCIONES VEGANAS ★ MERCH.
  - Doodles decorativos.

**Motion (etapas 2 y 4):**
- Pin de 2–3 pantallas como máximo. GSAP ScrollTrigger con scrub controla el avance de la cámara sobre una `CatmullRomCurve3`.
- 0–60 %: avance por la vereda hacia la fachada. ~50 %: el smiley del letrero guiña.
- 60–85 %: la cámara cruza la puerta.
- 85–100 %: fade del canvas al amarillo; el H1 entra palabra por palabra (translateY + leve skew) y los doodles se dibujan (stroke-dashoffset).
- Al terminar, desmontar la escena para liberar memoria.
- Móvil: recorrido más corto, menor resolución de render (`dpr` máx. 1.5).
- Reduced motion: solo imagen fija + bloque amarillo, sin pin.
- Presupuesto: GLB < 3 MB (Draco/meshopt, texturas WebP/KTX2, iluminación horneada).

---

## 2 · Cómo se arma un corndog

**Contenido:** etiqueta marker "paso a paso" · H2 "Cómo se arma un corndog" · lista de capas:
- 00 **Base.** Salchicha vegana, pastel de arroz (tteok) o mixto, en palito.
- 01 **Masa.** Masa de arroz que queda elástica al freír.
- 02 **Panko.** Pan rallado japonés para el crunch.
- 03 **Papas.** Cubos de papa o camote que se fríen pegados a la masa.
- 04 **Toppings.** Azúcar, queso en polvo o [TOPPING].
- 05 **Salsa.** Ketchup, mostaza, mayo picante o [SALSA].

Indicador "Capa 05 / 05" con barra de progreso. A la derecha, ilustración del corndog sobre círculo amarillo, con corona dibujada y "¡crunch!" en marker. Estado final: capa 05 activa (fondo amarillo, `aria-current="step"`).

**Motion:** pin de ~5 pantallas (reducir en móvil). El corndog baja desde arriba; cada tramo de scroll suma una capa, la lista resalta la capa activa y la barra avanza 01/05… 05/05.

---

## 3 · Menú

**Contenido:** fondo negro · H2 "Menú" amarillo · bajada "Todo frito al momento y servido en nuestra caja amarilla. 35 productos, de los corndogs a las bebidas coreanas." · chips de categoría (Todo, Corndogs, Pollo y brochetas, Para picar, Para compartir, Bebidas) · toggle "Solo vegano" (píldora blanca rotada, estrella) · franja "Elige el relleno de tu corndog" con los rellenos · fila con scroll horizontal de tarjetas tipo caja amarilla: foto, smiley en la esquina (`spicy` si es picante), nombre, descripción, precio, etiqueta "Picante" y/o etiqueta vegana · contador "N productos · desliza →" · estado vacío.

Datos: `src/data/menu.json` (incluido en este paquete). Precios en CLP como número; formatear `$6.550`. Precio `null` → mostrar `[PRECIO]`.

Filtro: componente cliente. El HTML inicial debe incluir **todos** los productos (SEO); el filtro solo oculta/muestra.

**Motion:** las cajas entran desde la derecha como bandejas sobre el mesón (stagger 80 ms, leve rotación que se endereza). Al cambiar de categoría salen hacia la izquierda y entran las nuevas.

---

## 4 · El barrio

**Contenido:** H2 "El barrio" · bajada "Nacimos en la calle y ahí seguimos: Barrio Italia, Los Leones y todo lo que pasa entre medio. Colabs, eventos y la fila de siempre." · 4 fotos tipo polaroid rotadas con caption en marker:
- Fila en Av. Italia — "viernes, 8 pm"
- Corndog en mano, mural detrás — "el primer mordisco"
- Cajas amarillas en la vereda — "delivery saliendo"
- Bebidas coreanas en Los Leones — "melón soda, por favor"

Tres tarjetas: **Colaboraciones**, **Eventos** (lista de fecha `[DD MMM]` + `[NOMBRE DEL EVENTO]` + lugar) y **En la prensa** (con "Leer la nota").

**Motion:** parallax de fotos a 3 velocidades (0.85 / 1 / 1.15) con leve rotación; doodles que se dibujan al entrar; tarjetas suben con fade.

---

## 5 · Locales

**Contenido:** círculo amarillo rotado con H2 "Dos locales" centrado arriba. Dos mitades:

| | Barrio Italia (fondo negro) | Los Leones (fondo blanco) |
|---|---|---|
| Dirección | Av. Italia 1187, local 2, Providencia | Av. Providencia 2345, Providencia |
| Lunes | Cerrado | Cerrado |
| Mar–Jue | 13:00–15:30 · 16:30–20:30 | 13:00–15:30 · 16:30–20:30 |
| Viernes | 13:00–15:30 · 16:30–21:00 | 13:00–15:30 · 16:30–21:00 |
| Sábado | 13:00–15:30 · 16:30–21:30 | 13:00–15:30 · 16:30–21:30 |
| Domingo | 13:00–15:30 · 16:30–19:00 | 13:00–15:30 · 16:30–19:00 |

Colación: cerrado de 15:30 a 16:30. Botones "Cómo llegar" (Google Maps) y "Pedir delivery".
Mapa: reemplazar el ilustrativo por embed de Google Maps con carga diferida (o imagen estática que enlaza a Maps, con pin smiley).

**Motion:** cada mitad entra desde su lado; hover/focus expande una mitad al 55 %; el pin smiley rebota una vez.

---

## 6 · Merch

**Contenido:** H2 "Merch" · productos tipo sticker (tarjeta blanca redondeada, contorno y sombra dura, rotados): Polera Dokebi, Gorro con colmillos, Tote bag, Pack de stickers, Llavero smiley. Cada uno con foto, `[PRECIO]` y "Lo quiero".

**Motion:** "se pegan" al entrar (escala 1.15 → 1 con la sombra asentándose). Hover: la esquina se levanta y gira 2°.

---

## 7 · FAQ

**Contenido:** H2 "Preguntas frecuentes" con garabato · acordeones nativos `<details>` (el primero abierto):
- **¿Qué es un corndog coreano?** Un snack callejero de Corea: salchicha, mozzarella (o las dos) en un palito, cubiertas con masa, panko y a veces cubos de papa, y fritas al momento. Se terminan con azúcar y salsas. Crujiente por fuera, elástico por dentro.
- **¿Tienen opciones veganas?** Sí, tenemos menú vegano. Corndogs con salchicha vegana, pastel de arroz o mixto, en seis coberturas: papa, camote, Doritos chili, queso vegano, ramen y quinoa. Además: nuggets, mandu, to kkochi y ramyeon vegano. Usa el filtro «Solo vegano» del menú para verlos todos.
- **¿Hacen delivery?** Sí, por Uber Eats [Y OTRAS APPS]. Toca «Pedir» y elige el local más cercano. Zona de reparto: [ZONA].

Agregar JSON-LD `FAQPage`.

**Motion:** sin scroll-jacking, fade simple al entrar.

---

## 8 · Footer

**Contenido:** H2 "¿Te dio hambre?" amarillo · "Pide delivery o pásate por Barrio Italia o Los Leones." · CTA "Pedir ahora →" · columnas Locales (`<address>`), Redes (Instagram @[USUARIO], TikTok @[USUARIO]), Explora (links ancla) · "© 2026 DOKEBI · Korean Street Food · Santiago de Chile" + "sonríe, pero con colmillo" en marker · lluvia de smileys (posiciones estáticas en etapa 1).

**Motion:** al llegar al final, los smileys caen con física simple y se apilan; algunos guiñan. Cargar la librería de física solo cuando el footer entra al viewport.

---

## Global

- `prefers-reduced-motion`: todo pasa al estado final estático.
- Doodles: componente `<Doodle variant="star|crown|squiggle|sparkle">` con `pathLength=400` para animar el trazo.

## Contenido pendiente (pedir al cliente)

- Fotos reales: productos del menú, barrio, merch, fachada.
- `[TOPPING]`, `[SALSA]`, precios de merch y de "Queso Vegano" / "Doritos Chili Vegano".
- Colaboraciones, eventos, notas de prensa.
- Usuarios de Instagram y TikTok.
- Otras apps de delivery y zona de reparto.
- **Link de Uber Eats de Los Leones**: hoy ambos locales apuntan a la tienda de Providencia.
- Link real de "Lo quiero" del merch (¿tienda, Instagram, WhatsApp?).
