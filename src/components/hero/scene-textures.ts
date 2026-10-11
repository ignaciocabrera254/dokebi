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
  const fascia = canvasTexture(1536, 376, (ctx) => {
    ctx.fillStyle = "#FFD400"; ctx.fillRect(0, 0, 1536, 376);
    ctx.font = `190px ${getComputedStyle(document.body).getPropertyValue("--nf-anton")}, sans-serif`;
    ctx.fillStyle = "white"; ctx.shadowColor = "white"; ctx.shadowBlur = 16;
    ctx.fillText("DOKEBI", 80, 280);
    ctx.save(); ctx.translate(710, 55); ctx.scale(0.53, 0.53);
    ctx.fillStyle = "white"; ctx.strokeStyle = "white";
    for (const x of [130, 310]) { ctx.beginPath(); ctx.ellipse(x, 130, 25, 43, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.lineWidth = 22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(45, 245); ctx.quadraticCurveTo(220, 435, 395, 245); ctx.stroke();
    for (const [x, dir] of [[60, 1], [380, -1]]) { ctx.beginPath(); ctx.moveTo(x, 265); ctx.lineTo(x + dir * 50, 290); ctx.lineTo(x + dir * 20, 355); ctx.fill(); }
    ctx.restore(); ctx.shadowBlur = 0;
    ctx.font = "bold 60px sans-serif"; ctx.fillText("korean food", 1010, 155);
  });
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
  return { face, wink, fascia, menu, fridge, merch };
}
