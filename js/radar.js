// js/radar.js - 16:9 廣角戰場雷達繪製模組
function renderRadar() {
  if (!ctx || !canvas) {
    canvas = document.getElementById("gameCanvas");
    if (canvas) ctx = canvas.getContext("2d");
    if (!ctx) return;
  }

  // 保持畫布內部為 960x540 (標準 16:9)
  if (canvas.width !== 960 || canvas.height !== 540) {
    canvas.width = 960;
    canvas.height = 540;
  }

  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  if (isNaN(gameState.playerX)) gameState.playerX = 1200;
  if (isNaN(gameState.playerY)) gameState.playerY = 800;

  // 鏡頭鎖定在玩家中心
  const camX = gameState.playerX - cw / 2;
  const camY = gameState.playerY - ch / 2;

  // 繪製背景網格 (每格 50px)
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

  // 地圖世界邊界框
  ctx.strokeStyle = "#334155";
  ctx.strokeRect(-camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);

  // 安全村莊狀態展示
  if (gameState.inVillage) {
    ctx.fillStyle = "rgba(46, 204, 113, 0.12)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#2ecc71";
    ctx.font = "bold 16px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏛️ 安全村莊和平區域 - 整備採買中", cw / 2, ch / 2);
    return;
  }

  // 箭矢彈道軌跡
  if (gameState.arrowTrail && Date.now() < gameState.arrowTrail.expire) {
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.arrowTrail.fromX - camX, gameState.arrowTrail.fromY - camY);
    ctx.lineTo(gameState.arrowTrail.toX - camX, gameState.arrowTrail.toY - camY);
    ctx.stroke();
  }

  // 怪物繪製
  if (Array.isArray(gameState.mobs)) {
    gameState.mobs.forEach(mob => {
      const screenX = mob.x - camX;
      const screenY = mob.y - camY;

      // 剔除不在視野內的怪物
      if (screenX < -80 || screenX > cw + 80 || screenY < -80 || screenY > ch + 80) return;

      const isTarget = (gameState.targetMob === mob);
      const radius = mob.isBoss ? 10 : 6.5;

      ctx.fillStyle = mob.isBoss ? "#d946ef" : (mob.aggressive ? "#ef4444" : "#22c55e");
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 鎖定金色光圈
      if (isTarget) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 血條底色與生命條
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(screenX - 18, screenY - (mob.isBoss ? 20 : 15), 36, 4);
      ctx.fillStyle = mob.isBoss ? "#d946ef" : "#ef4444";
      const hpW = Math.max(0, (mob.currentHp / mob.hp) * 36);
      ctx.fillRect(screenX - 18, screenY - (mob.isBoss ? 20 : 15), hpW, 4);

      // 怪物名稱標籤
      ctx.font = mob.isBoss ? "bold 12px -apple-system, sans-serif" : "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isTarget ? "#fbbf24" : (mob.isBoss ? "#f472b6" : (mob.aggressive ? "#f87171" : "#cbd5e1"));
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 3;
      ctx.fillText(mob.isBoss ? `👑 ${mob.name}` : mob.name, screenX, screenY - (mob.isBoss ? 24 : 19));
      ctx.shadowBlur = 0;
    });
  }

  // 玩家自己 (位於中心點)
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