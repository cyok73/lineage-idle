// js/radar.js - 2.5D 天堂經典復古視覺戰場渲染引擎 (具體人物跑動、怪物造型、斬擊特效與傷害飄字)

// 預載人物與怪物精靈圖譜
const spriteSheetImg = new Image();
spriteSheetImg.src = "assets/lineage_sprites.jpg";
let isSpriteSheetLoaded = false;
spriteSheetImg.onload = () => {
  isSpriteSheetLoaded = true;
};

// 4x4 精靈圖譜坐標對應表 (每一格 256x256，Row 0~3, Col 0~3)
const SPRITE_MAP = {
  // 職業角色 (Row 0)
  knight: { c: 0, r: 0 },
  elf: { c: 1, r: 0 },
  mage: { c: 2, r: 0 },
  prince: { c: 3, r: 0 },

  // 變身造型
  "死亡騎士": { c: 2, r: 3 }, // 烈焰死騎
  "骷髏": { c: 2, r: 1 },
  "妖魔弓箭手": { c: 1, r: 1 },
  "黑暗妖精弓箭手": { c: 1, r: 0 },

  // 經典怪物 (Row 1)
  "哥布林": { c: 0, r: 1 },
  "妖魔": { c: 1, r: 1 },
  "都達瑪拉妖魔": { c: 1, r: 1 },
  "甘地妖魔": { c: 1, r: 1 },
  "妖魔鬥士": { c: 1, r: 1 },
  "骷髏斧手": { c: 2, r: 1 },
  "骷髏弓箭手": { c: 2, r: 1 },
  "狼人": { c: 3, r: 1 },
  "妖精狼人": { c: 3, r: 1 },

  // 地監怪物 (Row 2)
  "殭屍": { c: 0, r: 2 },
  "食屍鬼": { c: 1, r: 2 },
  "工蟻": { c: 2, r: 2 },
  "巨蟻": { c: 2, r: 2 },
  "兵蟻": { c: 2, r: 2 },
  "白螞蟻": { c: 2, r: 2 },
  "巨蟻護衛": { c: 2, r: 2 },
  "巨蟻女皇": { c: 2, r: 2 },
  "石頭高崙": { c: 3, r: 2 },
  "鋼鐵高崙": { c: 3, r: 2 },
  "史萊姆": { c: 0, r: 1 },

  // 首領怪物 (Row 3)
  "巴風特": { c: 0, r: 3 },
  "塞尼斯": { c: 2, r: 0 },
  "巴拉卡斯": { c: 2, r: 3 }
};

function renderRadar() {
  if (!ctx || !canvas) {
    canvas = document.getElementById("gameCanvas");
    if (canvas) ctx = canvas.getContext("2d");
    if (!ctx) return;
  }

  if (canvas.width !== 960) canvas.width = 960;
  if (canvas.height !== 540) canvas.height = 540;

  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  if (isNaN(gameState.playerX)) gameState.playerX = 1200;
  if (isNaN(gameState.playerY)) gameState.playerY = 800;

  // 鏡頭鎖定玩家
  const camX = gameState.playerX - cw / 2;
  const camY = gameState.playerY - ch / 2;

  // 1. 繪製獵場地磚與自然地表
  drawBattlefieldTerrain(cw, ch, camX, camY);

  // 安全村莊休整提示
  if (gameState.inVillage) {
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 6;
    ctx.fillText("🏛️ 安全村莊和平區域 - 補給整備休養中", cw / 2, ch / 2);
    ctx.shadowBlur = 0;
    return;
  }

  // 2. 繪製怪物群體 (2.5D 精緻立體呈現)
  if (Array.isArray(gameState.mobs)) {
    // 依 Y 軸排序實現 2.5D 前後遮擋深度感 (Depth Sort)
    const sortedMobs = [...gameState.mobs].sort((a, b) => a.y - b.y);

    sortedMobs.forEach(mob => {
      const screenX = mob.x - camX;
      const screenY = mob.y - camY;

      // 視錐剔除
      if (screenX < -60 || screenX > cw + 60 || screenY < -60 || screenY > ch + 60) return;

      const isTarget = (gameState.targetMob === mob);
      const isBoss = mob.isBoss;

      // 地面陰影
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(screenX, screenY + 12, isBoss ? 26 : 16, isBoss ? 10 : 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 鎖定光圈
      if (isTarget) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 12, isBoss ? 32 : 22, isBoss ? 14 : 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 目標引導箭頭
        const nowMs = Date.now();
        const bounce = Math.sin(nowMs / 150) * 4;
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - (isBoss ? 55 : 38) + bounce);
        ctx.lineTo(screenX - 7, screenY - (isBoss ? 67 : 50) + bounce);
        ctx.lineTo(screenX + 7, screenY - (isBoss ? 67 : 50) + bounce);
        ctx.closePath();
        ctx.fill();
      }

      // 繪製怪物精靈本體
      drawEntitySprite(mob.name, screenX, screenY, isBoss ? 56 : 38, isBoss);

      // 怪物血條
      const barW = isBoss ? 50 : 34;
      const barH = isBoss ? 5 : 3.5;
      const barY = screenY - (isBoss ? 42 : 28);
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(screenX - barW / 2, barY, barW, barH);

      const hpPct = Math.max(0, Math.min(1, mob.currentHp / mob.hp));
      ctx.fillStyle = isBoss ? "#d946ef" : (hpPct > 0.4 ? "#ef4444" : "#dc2626");
      ctx.fillRect(screenX - barW / 2, barY, barW * hpPct, barH);

      // 怪物名稱標籤
      ctx.font = isBoss ? "bold 12px -apple-system, sans-serif" : "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isTarget ? "#fbbf24" : (isBoss ? "#f472b6" : (mob.aggressive ? "#fca5a5" : "#e2e8f0"));
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText(isBoss ? `👑 ${mob.name}` : mob.name, screenX, barY - 4);
      ctx.shadowBlur = 0;
    });
  }

  // 3. 繪製玩家本體 (置中於螢幕)
  const px = cw / 2;
  const py = ch / 2;

  // 玩家地面陰影
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(px, py + 14, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 玩家光環 (綠水/勇水加速光芒)
  if (currentChar && currentChar.buffs) {
    if (currentChar.buffs.green > 0 || currentChar.buffs.brave > 0) {
      ctx.strokeStyle = currentChar.buffs.brave > 0 ? "rgba(234, 179, 8, 0.6)" : "rgba(34, 197, 94, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(px, py + 14, 25, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 繪製玩家精靈 (考慮變身或職業)
  const playerSpriteKey = currentChar?.polymorph && currentChar.polymorph !== "無變身"
    ? currentChar.polymorph
    : (currentChar?.charClass || "knight");
  drawEntitySprite(playerSpriteKey, px, py, 44, false);

  // 玩家名稱與血條
  if (currentChar) {
    ctx.font = "bold 12px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText(currentChar.name, px, py - 32);

    // 玩家小血條
    const plHpPct = Math.max(0, Math.min(1, (currentChar.hp || 50) / (currentChar.maxHp || 50)));
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(px - 18, py - 27, 36, 4);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(px - 18, py - 27, 36 * plHpPct, 4);
    ctx.shadowBlur = 0;
  }

  // 4. 繪製遠程彈道 (箭矢/魔法軌跡)
  if (gameState.arrowTrail && Date.now() < gameState.arrowTrail.expire) {
    const fromScreenX = gameState.arrowTrail.fromX - camX;
    const fromScreenY = gameState.arrowTrail.fromY - camY;
    const toScreenX = gameState.arrowTrail.toX - camX;
    const toScreenY = gameState.arrowTrail.toY - camY;

    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(fromScreenX, fromScreenY);
    ctx.lineTo(toScreenX, toScreenY);
    ctx.stroke();

    // 箭頭光輝
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(toScreenX, toScreenY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. 繪製戰鬥打擊光效 (揮砍刀光、法術爆炸)
  if (Array.isArray(gameState.combatEffects)) {
    const now = Date.now();
    gameState.combatEffects = gameState.combatEffects.filter(eff => now < eff.expire);
    gameState.combatEffects.forEach(eff => {
      const ex = eff.x - camX;
      const ey = eff.y - camY;

      if (eff.type === "slash") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ex, ey, 18, -Math.PI / 4, Math.PI / 3);
        ctx.stroke();
      } else if (eff.type === "burst") {
        ctx.strokeStyle = eff.color || "#22c55e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ex, ey, 22, 0, Math.PI * 2);
        ctx.stroke();
      } else if (eff.type === "magic") {
        ctx.fillStyle = eff.color || "#38bdf8";
        ctx.beginPath();
        ctx.arc(ex, ey, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // 6. 繪製傷害飄字 (Floating Damage Numbers)
  if (Array.isArray(gameState.floatingTexts)) {
    const now = Date.now();
    gameState.floatingTexts = gameState.floatingTexts.filter(ft => now < ft.expire);
    gameState.floatingTexts.forEach(ft => {
      const progress = 1 - (ft.expire - now) / 800;
      const fx = ft.x - camX;
      const fy = ft.y - camY - (progress * 28); // 緩慢往上飄升

      ctx.font = "bold 14px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = ft.color || "#ef4444";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, fx, fy);
      ctx.shadowBlur = 0;
    });
  }
}

// 繪製實體精靈圖（若圖檔未完成或未配對，優雅降級為像素立體人偶）
function drawEntitySprite(key, screenX, screenY, size = 36, isBoss = false) {
  const coord = SPRITE_MAP[key] || SPRITE_MAP["knight"];

  if (isSpriteSheetLoaded && coord) {
    const sw = 256;
    const sh = 256;
    const sx = coord.c * sw;
    const sy = coord.r * sh;
    const drawX = screenX - size / 2;
    const drawY = screenY - size + 10;

    ctx.drawImage(spriteSheetImg, sx, sy, sw, sh, drawX, drawY, size, size);
  } else {
    // 優雅降級像素方塊人偶
    ctx.fillStyle = isBoss ? "#d946ef" : (key.includes("妖精") ? "#22c55e" : "#3b82f6");
    ctx.fillRect(screenX - size / 4, screenY - size / 2, size / 2, size / 2);
  }
}

// 繪製地表獵場氛圍（依當前地圖呈現綠野、地監石磚或火龍窟熔岩）
function drawBattlefieldTerrain(cw, ch, camX, camY) {
  const mapKey = gameState.currentMap || "talking_island";
  let tileBase = "#17202a";
  let gridLine = "#1f2937";

  if (mapKey.includes("fire") || mapKey.includes("werden")) {
    tileBase = "#271212";
    gridLine = "#451a1a";
  } else if (mapKey.includes("desert") || mapKey.includes("windwood")) {
    tileBase = "#292117";
    gridLine = "#453825";
  } else if (mapKey.includes("cave") || mapKey.includes("gludio") || mapKey.includes("giran")) {
    tileBase = "#111827";
    gridLine = "#1f2937";
  } else {
    tileBase = "#14241b"; // 話島綠郊
    gridLine = "#1f3b2b";
  }

  ctx.fillStyle = tileBase;
  ctx.fillRect(0, 0, cw, ch);

  // 繪製 2.5D 透視網格磚 (每格 48px)
  ctx.strokeStyle = gridLine;
  ctx.lineWidth = 1;
  const startX = -(camX % 48);
  const startY = -(camY % 48);

  for (let x = startX; x < cw; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ch);
    ctx.stroke();
  }
  for (let y = startY; y < ch; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }

  // 世界邊界紅線
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(-camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
}

window.renderRadar = renderRadar;