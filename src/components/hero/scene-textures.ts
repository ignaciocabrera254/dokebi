import { CanvasTexture, SRGBColorSpace } from "three";

export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const family = (name: string) => `${getComputedStyle(document.body).getPropertyValue(name)}, sans-serif`;
const fonts = () => ({ display: family("--nf-anton"), korean: family("--nf-korean"), marker: family("--nf-marker") });

// The physical sign uses a thin smile and fangs at its corners.
export function drawFace(ctx: CanvasRenderingContext2D, wink = false) {
  ctx.clearRect(0, 0, 512, 512);
  ctx.fillStyle = "#E2B200";
  ctx.beginPath(); ctx.arc(256, 256, 250, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#FFD400";
  ctx.beginPath(); ctx.arc(256, 256, 230, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = ctx.strokeStyle = "#161616";
  ctx.lineCap = ctx.lineJoin = "round";
  ctx.lineWidth = 14;
  ctx.beginPath();
  if (wink) { ctx.moveTo(178, 202); ctx.quadraticCurveTo(205, 170, 232, 202); ctx.stroke(); }
  else { ctx.ellipse(205, 195, 17, 32, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(307, 195, 17, 32, 0, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(132, 262); ctx.quadraticCurveTo(256, 420, 380, 262); ctx.stroke();
  for (const [x, direction] of [[150, 1], [362, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, 292); ctx.lineTo(x + 30 * direction, 310); ctx.lineTo(x + 11 * direction, 340); ctx.closePath();
    ctx.fillStyle = "white"; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  }
}

export function createSceneTextures() {
  const face = canvasTexture(512, 512, (ctx) => drawFace(ctx));
  const wink = canvasTexture(512, 512, (ctx) => drawFace(ctx, true));
  // Fondo amarillo liso; las letras van aparte (solo alfa) para apilarlas en capas 3D en la escena.
  const drawFascia = (ctx: CanvasRenderingContext2D) => { ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, 1536, 376); };
  const drawFasciaText = (ctx: CanvasRenderingContext2D) => {
    const { display, marker } = fonts();
    ctx.clearRect(0, 0, 1536, 376);
    ctx.fillStyle = ctx.strokeStyle = "#FFFFFF";
    ctx.font = `190px ${display}`; ctx.fillText("DOKEBI", 80, 280);
    ctx.save(); ctx.translate(710, 55); ctx.scale(0.53, 0.53);
    for (const x of [130, 310]) { ctx.beginPath(); ctx.ellipse(x, 130, 25, 43, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.lineWidth = 22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(45, 245); ctx.quadraticCurveTo(220, 435, 395, 245); ctx.stroke();
    for (const [x, dir] of [[60, 1], [380, -1]]) { ctx.beginPath(); ctx.moveTo(x, 265); ctx.lineTo(x + dir * 50, 290); ctx.lineTo(x + dir * 20, 355); ctx.fill(); }
    ctx.restore();
    ctx.font = `italic bold 64px ${marker}`;
    ctx.save(); ctx.translate(1010, 175); ctx.rotate(-0.06); ctx.fillText("korean food", 0, 0); ctx.restore();
  };
  const fasciaText = canvasTexture(1536, 376, drawFasciaText);
  const fascia = canvasTexture(1536, 376, drawFascia);
  const menu = canvasTexture(384, 384, (ctx) => {
    ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, 384, 384);
    ctx.fillStyle = "#0A0A0A"; ctx.font = "bold 48px sans-serif"; ctx.fillText("DOKEBI", 85, 57);
    for (let i = 0; i < 6; i++) {
      const x = 42 + (i % 2) * 180; const y = 94 + Math.floor(i / 2) * 95;
      ctx.fillStyle = i % 2 ? "#D99A45" : "#E8563A";
      ctx.beginPath(); ctx.roundRect(x, y, 110, 35, 18); ctx.fill();
      ctx.fillStyle = "#0A0A0A"; ctx.fillRect(x, y + 50, 96, 5);
    }
  });
  const fridge = canvasTexture(256, 512, (ctx) => {
    ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, 256, 512);
    for (let y = 8; y < 140; y += 40) for (let x = 8; x < 240; x += 40) { ctx.drawImage(face.image, x, y, 32, 32); }
    ctx.fillStyle = "#1D2A33"; ctx.fillRect(10, 150, 236, 352);
    const colors = ["#e8463a", "#3a8fe8", "#f2c200", "#36b37e"];
    for (let row = 0; row < 5; row++) for (let col = 0; col < 6; col++) {
      ctx.fillStyle = colors[(row + col) % colors.length]; ctx.fillRect(20 + col * 37, 173 + row * 65, 22, 44);
    }
  });
  const merch = canvasTexture(256, 512, (ctx) => {
    ctx.fillStyle = "#EFE2B8"; ctx.fillRect(0, 0, 256, 512);
    const colors = ["#6b6b3a", "#6a4a6e", "#7a6a4a", "#3f4a3a"];
    for (let i = 0; i < 4; i++) {
      const x = 65 + (i % 2) * 120; const y = 75 + Math.floor(i / 2) * 110;
      ctx.fillStyle = colors[i]; ctx.beginPath(); ctx.arc(x, y, 40, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 40, y, 85, 12);
    }
    ctx.strokeStyle = "#BDB18C"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(128, 300, 38, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#F7F0D8"; ctx.fillRect(40, 290, 176, 200);
    for (let i = 0; i < 9; i++) ctx.drawImage(face.image, 56 + (i % 3) * 53, 320 + Math.floor(i / 3) * 53, 40, 40);
  });
  const menuHot = canvasTexture(512, 576, drawMenuHot);
  const menuTteok = canvasTexture(512, 576, drawMenuTteok);
  const neon = canvasTexture(256, 768, drawNeon);
  const glow = canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, "rgba(255,255,255,0.45)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  });
  const wood = canvasTexture(128, 512, (ctx) => {
    ctx.fillStyle = "#7A4E2C"; ctx.fillRect(0, 0, 128, 512);
    for (let x = 0; x < 128; x += 16) { ctx.fillStyle = x % 32 ? "#6A4224" : "#8A5A34"; ctx.fillRect(x, 0, 14, 512); }
  });
  // Los textos coreanos esperan a que la fuente local esté lista y se redibujan una vez.
  const redraw: [typeof menuHot, (ctx: CanvasRenderingContext2D) => void][] = [[fascia, drawFascia], [fasciaText, drawFasciaText], [menuHot, drawMenuHot], [menuTteok, drawMenuTteok], [neon, drawNeon]];
  const { korean, display } = fonts();
  void Promise.all([document.fonts.load(`40px ${korean}`, "도깨비핫도그떡볶이"), document.fonts.load(`40px ${display}`)]).then(() => {
    for (const [texture, draw] of redraw) { draw((texture.image as HTMLCanvasElement).getContext("2d")!); texture.needsUpdate = true; }
  });
  return { face, wink, fascia, fasciaText, menu, fridge, merch, menuHot, menuTteok, neon, glow, wood };
}

function smile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 100, size / 100);
  ctx.fillStyle = ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineWidth = 9;
  for (const ex of [34, 66]) { ctx.beginPath(); ctx.ellipse(ex, 32, 6, 11, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(14, 56); ctx.quadraticCurveTo(50, 98, 86, 56); ctx.stroke();
  ctx.restore();
}
function badge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = "#FFD400"; ctx.strokeStyle = "#0A0A0A"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  smile(ctx, x - r * 0.62, y - r * 0.62, r * 1.24, "#0A0A0A");
}
function menuHeader(ctx: CanvasRenderingContext2D, ko: string, en: string) {
  const f = fonts();
  ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, 512, 576);
  ctx.fillStyle = "#0A0A0A"; ctx.font = `54px ${f.display}`; ctx.fillText("DOKEBI", 40, 78);
  smile(ctx, 200, 38, 44, "#0A0A0A");
  ctx.font = `76px ${f.korean}`; ctx.fillText(ko, 40, 170);
  ctx.font = `bold 26px ${f.display}`; ctx.fillText(en, 42, 208);
}
function drawMenuHot(ctx: CanvasRenderingContext2D) {
  menuHeader(ctx, "핫도그", "KOREAN CORNDOG");
  const f = fonts();
  const items = [["PANKO", "#D98A3D", "#E8563A"], ["DOKEBI SEÚL", "#E0642B", "#FFD400"], ["CAMOTE", "#C9772F", "#8E3FA8"]];
  items.forEach(([name, body, sauce], i) => {
    const x = 90 + i * 165;
    ctx.fillStyle = "#E8D2A0"; ctx.fillRect(x - 5, 440, 10, 70); // palito
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(x - 34, 250, 68, 220, 34); ctx.fill();
    ctx.strokeStyle = "#0A0A0A"; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = sauce; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath();
    for (let k = 0; k < 6; k++) { ctx.lineTo(x + (k % 2 ? 22 : -22), 280 + k * 30); }
    ctx.stroke();
    ctx.fillStyle = "#0A0A0A"; ctx.font = `bold 21px ${f.display}`; ctx.textAlign = "center"; ctx.fillText(name, x, 548); ctx.textAlign = "left";
  });
  badge(ctx, 450, 60, 32);
}
function drawMenuTteok(ctx: CanvasRenderingContext2D) {
  menuHeader(ctx, "떡볶이", "TTEOKBOKKI");
  ctx.fillStyle = "#0A0A0A"; ctx.beginPath(); ctx.ellipse(256, 400, 200, 130, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#C2351C"; ctx.beginPath(); ctx.ellipse(256, 394, 178, 108, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#F0D9B0"; ctx.strokeStyle = "#8E2412"; ctx.lineWidth = 4;
  for (let i = 0; i < 13; i++) {
    const a = i * 2.4; const x = 256 + Math.cos(a) * (40 + (i % 4) * 28), y = 394 + Math.sin(a) * (22 + (i % 4) * 18);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.roundRect(-26, -9, 52, 18, 9); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(300, 372, 34, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#FFB400"; ctx.beginPath(); ctx.arc(300, 372, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#0A0A0A"; ctx.fillRect(448, 392, 60, 12); // mango de la sartén
  badge(ctx, 440, 252, 30);
}
function drawNeon(ctx: CanvasRenderingContext2D) {
  const f = fonts();
  ctx.fillStyle = "#140A06"; ctx.fillRect(0, 0, 256, 768);
  ctx.strokeStyle = "#FF7A1A"; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 236, 748);
  ctx.textAlign = "center"; ctx.font = `150px ${f.korean}`;
  ctx.shadowColor = "#FF6A00"; ctx.shadowBlur = 28; ctx.fillStyle = "#FFD9A8";
  ["도", "깨", "비"].forEach((c, i) => ctx.fillText(c, 128, 170 + i * 170));
  ctx.shadowBlur = 0; ctx.textAlign = "left";
  ctx.shadowColor = "#FF6A00"; ctx.shadowBlur = 20; smile(ctx, 78, 640, 100, "#FFD9A8"); ctx.shadowBlur = 0;
}

/** Pantalla del dispositivo: amarillo con la carita del logo del header (mismo SVG) centrada. ~21 % del ancho en el notebook, ~40 % en el teléfono. */
export function createScreenTexture(phone: boolean) {
  const [w, h] = phone ? [727, 1553] : [1024, 664];
  const texture = canvasTexture(w, h, (ctx) => { ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, w, h); });
  const logo = document.querySelector("header a[aria-label^='DOKEBI'] svg");
  if (!logo) return texture;
  const size = Math.round(w * (phone ? 0.4 : 0.21));
  const svg = logo.cloneNode(true) as SVGElement;
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  const image = new Image();
  image.onload = () => {
    const ctx = (texture.image as HTMLCanvasElement).getContext("2d")!;
    ctx.drawImage(image, (w - size) / 2, (h - size) / 2, size, size);
    texture.needsUpdate = true;
  };
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  return texture;
}
