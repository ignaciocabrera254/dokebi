# Pantalla del notebook

`pantalla.webp` es una captura real de la home (1024 × 664, 38 KB), no un dibujo del H1. `pantalla-captura.jpg` conserva la captura original.

Para actualizarla cuando cambie el hero:

1. Abrir la web en `/?captureHero=1`, viewport 1024 × 664, scroll al inicio.
2. Esperar que carguen las fuentes y aparezca la barra con `dokebi.cl`. Este modo usa el mismo header y bloque amarillo de la home y oculta la intro.
3. Capturar únicamente ese viewport, con el cursor fuera del contenido.
4. Convertir la captura a WebP y guardar `public/hero/pantalla.webp`.

El material de la pantalla es MeshBasicMaterial, sRGB, sin tone mapping ni iluminación.
