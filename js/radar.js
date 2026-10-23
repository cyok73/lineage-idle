// js/radar.js - 16:9 廣角戰場雷達繪製模組
function renderRadar() {
  if (!ctx || !canvas) {
    canvas = document.getElementById("gameCanvas");
    if (canvas) ctx = canvas.getContext("2d");
    if (!ctx) return;
  }

  // Canvas 內部繪圖解析度固定為 960x540（16:9）。
  // 顯示寬高只交由 style.css 控制，避免 JS 的 inline !important 覆蓋 CSS，
  // 造成雷達被限制成正方形或視窗縮放時寬高比例不一致。
  if (canvas.width !== 960) canvas.width = 960;
  if (canvas.height !== 540) canvas.height = 540;

  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  if (isNaN(gameState.playerX)) gameState.playerX = 1200;
  if (isNaN(gameState.playerY)) gameState.playerY = 800;

  // 鏡頭中心點維持在玩家座標，根據 16:9 畫布尺寸轉換視圖
  const camX = gameState.playerX - cw / 2;
  const camY = gameState.playerY - ch / 2;

  // 繪製背景網格 (每格 50px，保持 1:1 正方形網格不變形)
  ctx.strokeStyle = "#131a24";
  ctx.lineWidth = 1;
  const startX = -(camX % 50);
  const startY = -(camY % 50);
  for (let x = startX; x < cw; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
  }
  for (let y = startY; y < ch; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
  }

  ctx.strokeStyle = "#334155";
  ctx.strokeRect(-camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);

  if (gameState.inVillage) {
    ctx.fillStyle = "rgba(46, 204, 113, 0.12)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#2ecc71";
    ctx.font = "bold 16px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏛️ 安全村莊和平區域 - 整備採買中", cw / 2, ch / 2);
    return;
  }

  if (gameState.arrowTrail && Date.now() < gameState.arrowTrail.expire) {
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.arrowTrail.fromX - camX, gameState.arrowTrail.fromY - camY);
    ctx.lineTo(gameState.arrowTrail.toX - camX, gameState.arrowTrail.toY - camY);
    ctx.stroke();
  }

  if (Array.isArray(gameState.mobs)) {
    gameState.mobs.forEach(mob => {
      const screenX = mob.x - camX;
      const screenY = mob.y - camY;

      // 適應 16:9 寬螢幕的可視邊界剔除
      if (screenX < -80 || screenX > cw + 80 || screenY < -80 || screenY > ch + 80) return;

      const isTarget = (gameState.targetMob === mob);
      const radius = mob.isBoss ? 10 : 6.5;

      ctx.fillStyle = mob.isBoss ? "#d946ef" : (mob.aggressive ? "#ef4444" : "#22c55e");
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fill();

      if (isTarget) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(screenX - 18, screenY - (mob.isBoss ? 20 : 15), 36, 4);
      ctx.fillStyle = mob.isBoss ? "#d946ef" : "#ef4444";
      const hpW = Math.max(0, (mob.currentHp / mob.hp) * 36);
      ctx.fillRect(screenX - 18, screenY - (mob.isBoss ? 20 : 15), hpW, 4);

      ctx.font = mob.isBoss ? "bold 12px -apple-system, sans-serif" : "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isTarget ? "#fbbf24" : (mob.isBoss ? "#f472b6" : (mob.aggressive ? "#f87171" : "#cbd5e1"));
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 3;
      ctx.fillText(mob.isBoss ? `👑 ${mob.name}` : mob.name, screenX, screenY - (mob.isBoss ? 24 : 19));
      ctx.shadowBlur = 0;
    });
  }

  const px = cw / 2;
  const py = ch / 2;
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (currentChar) {
    ctx.font = "bold 12px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText(currentChar.name, px, py - 14);
    ctx.shadowBlur = 0;
  }
}