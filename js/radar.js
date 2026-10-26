// js/radar.js - MMORPG 高畫質角色動作引擎 (放大 1.5 倍、4 方向奔跑邁步、真實揮砍打擊與傷害飄字)

// 1. 載入高畫質 MMORPG 騎士動作圖譜 (4x4 序列：南跑、東側身跑、北背影跑、揮刀斬擊)
const knightAnimImg = new Image();
knightAnimImg.src = "assets/knight_hd_mmorpg_anim.jpg";
let isKnightAnimLoaded = false;
knightAnimImg.onload = () => {
  isKnightAnimLoaded = true;
};

// 2. 怪物圖譜載入
const monsterSheetImg = new Image();
monsterSheetImg.src = "assets/lineage_sprites.jpg";
let isMonsterSheetLoaded = false;
monsterSheetImg.onload = () => {
  isMonsterSheetLoaded = true;
};

// 怪物圖譜坐標對應表 (每一格 256x256)
const MONSTER_SPRITE_MAP = {
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

// 記錄玩家上一刻面對方向: "down" | "right" | "left" | "up"
let playerFacing = "down";

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

  // 鏡頭維持在玩家視野中央
  const camX = gameState.playerX - cw / 2;
  const camY = gameState.playerY - ch / 2;

  // 1. 繪製獵場地磚
  drawBattlefieldTerrain(cw, ch, camX, camY);

  if (gameState.inVillage) {
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 6;
    ctx.fillText("🏛️ 安全村莊和平區域 - 整備休整中", cw / 2, ch / 2);
    ctx.shadowBlur = 0;
    return;
  }

  // 2. 繪製怪物群體 (依 Y 軸排序前後深度)
  if (Array.isArray(gameState.mobs)) {
    const sortedMobs = [...gameState.mobs].sort((a, b) => a.y - b.y);

    sortedMobs.forEach(mob => {
      const screenX = mob.x - camX;
      const screenY = mob.y - camY;

      if (screenX < -70 || screenX > cw + 70 || screenY < -70 || screenY > ch + 70) return;

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

      drawMonsterSprite(mob.name, screenX, screenY, isBoss ? 56 : 38, isBoss);

      // 血條
      const barW = isBoss ? 50 : 34;
      const barH = isBoss ? 5 : 3.5;
      const barY = screenY - (isBoss ? 42 : 28);
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(screenX - barW / 2, barY, barW, barH);

      const hpPct = Math.max(0, Math.min(1, mob.currentHp / mob.hp));
      ctx.fillStyle = isBoss ? "#d946ef" : (hpPct > 0.4 ? "#ef4444" : "#dc2626");
      ctx.fillRect(screenX - barW / 2, barY, barW * hpPct, barH);

      // 名稱標籤
      ctx.font = isBoss ? "bold 12px -apple-system, sans-serif" : "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isTarget ? "#fbbf24" : (isBoss ? "#f472b6" : (mob.aggressive ? "#fca5a5" : "#e2e8f0"));
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText(isBoss ? `👑 ${mob.name}` : mob.name, screenX, barY - 4);
      ctx.shadowBlur = 0;
    });
  }

  // 3. 繪製高畫質 MMORPG 玩家角色 (放大 1.55 倍至 68px，具備 4 方向與攻擊動作)
  const px = cw / 2;
  const py = ch / 2;

  // 玩家陰影
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(px, py + 22, 28, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // 綠水/勇水加速光芒
  if (currentChar && currentChar.buffs) {
    if (currentChar.buffs.green > 0 || currentChar.buffs.brave > 0) {
      ctx.strokeStyle = currentChar.buffs.brave > 0 ? "rgba(234, 179, 8, 0.75)" : "rgba(34, 197, 94, 0.65)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(px, py + 22, 34, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 決定玩家當前朝向 Facing
  updatePlayerFacing();

  // 繪製高畫質 MMORPG 騎士精靈 (尺寸 68px = 原 44px 的 1.55 倍)
  drawPlayerHDActionSprite(px, py, 68);

  // 玩家名稱與血條
  if (currentChar) {
    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#93c5fd";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 5;
    ctx.fillText(currentChar.name, px, py - 46);

    const plHpPct = Math.max(0, Math.min(1, (currentChar.hp || 50) / (currentChar.maxHp || 50)));
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(px - 22, py - 40, 44, 4.5);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(px - 22, py - 40, 44 * plHpPct, 4.5);
    ctx.shadowBlur = 0;
  }

  // 4. 遠程彈道軌跡
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

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(toScreenX, toScreenY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. 打擊特效
  if (Array.isArray(gameState.combatEffects)) {
    const now = Date.now();
    gameState.combatEffects = gameState.combatEffects.filter(eff => now < eff.expire);
    gameState.combatEffects.forEach(eff => {
      const ex = eff.x - camX;
      const ey = eff.y - camY;

      if (eff.type === "slash") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(ex, ey, 22, -Math.PI / 4, Math.PI / 3);
        ctx.stroke();
      } else if (eff.type === "burst") {
        ctx.strokeStyle = eff.color || "#22c55e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ex, ey, 24, 0, Math.PI * 2);
        ctx.stroke();
      } else if (eff.type === "magic") {
        ctx.fillStyle = eff.color || "#38bdf8";
        ctx.beginPath();
        ctx.arc(ex, ey, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // 6. 傷害飄字
  if (Array.isArray(gameState.floatingTexts)) {
    const now = Date.now();
    gameState.floatingTexts = gameState.floatingTexts.filter(ft => now < ft.expire);
    gameState.floatingTexts.forEach(ft => {
      const progress = 1 - (ft.expire - now) / 800;
      const fx = ft.x - camX;
      const fy = ft.y - camY - (progress * 30);

      ctx.font = "bold 15px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = ft.color || "#ef4444";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, fx, fy);
      ctx.shadowBlur = 0;
    });
  }
}

// 根據玩家移動向量或攻擊目標更新朝向
function updatePlayerFacing() {
  // 若正在攻擊目標，優先面向怪物
  if (gameState.targetMob && (!gameState.targetMob.isDead && gameState.targetMob.currentHp > 0)) {
    const dx = gameState.targetMob.x - gameState.playerX;
    const dy = gameState.targetMob.y - gameState.playerY;
    if (Math.abs(dx) > Math.abs(dy)) {
      playerFacing = dx > 0 ? "right" : "left";
    } else {
      playerFacing = dy > 0 ? "down" : "up";
    }
    return;
  }

  // 移動中根據位移向量計算朝向
  if (gameState.isMoving && (gameState.moveDx !== undefined || gameState.moveDy !== undefined)) {
    const dx = gameState.moveDx || 0;
    const dy = gameState.moveDy || 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      playerFacing = dx > 0 ? "right" : "left";
    } else {
      playerFacing = dy > 0 ? "down" : "up";
    }
  }
}

// 繪製高畫質 MMORPG 規格騎士動作幀 (4x4 矩陣，每一幀 256x256)
function drawPlayerHDActionSprite(screenX, screenY, size = 68) {
  if (!isKnightAnimLoaded) {
    // 降級方塊
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(screenX - size / 4, screenY - size / 2, size / 2, size / 2);
    return;
  }

  const now = Date.now();
  let row = 0; // 0: South(Down), 1: East(Right), 2: North(Up), 3: Attack
  let col = 0;
  let flipHorizontal = false;

  // 1. 攻擊動畫優先判定 (Row 3 揮砍動作)
  if (gameState.playerAttackAnim && now < gameState.playerAttackAnim.startTime + gameState.playerAttackAnim.duration) {
    row = 3;
    const elapsed = now - gameState.playerAttackAnim.startTime;
    const progress = Math.min(1, elapsed / gameState.playerAttackAnim.duration);
    col = Math.min(3, Math.floor(progress * 4)); // 0~3 序列影格
    if (playerFacing === "left") flipHorizontal = true;
  } else {
    // 2. 奔跑/行走動作判定 (Row 0, 1, 2)
    if (playerFacing === "down") {
      row = 0;
    } else if (playerFacing === "right") {
      row = 1;
      flipHorizontal = false;
    } else if (playerFacing === "left") {
      row = 1;
      flipHorizontal = true; // 左跑採用右側身圖水平鏡像
    } else if (playerFacing === "up") {
      row = 2;
    }

    if (gameState.isMoving) {
      // 跑步邁步影格：每 120ms 切換一幀
      col = Math.floor(now / 120) % 4;
    } else {
      // 待機停下：使用第 0 幀呼吸站姿
      col = 0;
    }
  }

  const sw = 256;
  const sh = 256;
  const sx = col * sw;
  const sy = row * sh;

  // 計算行走時微幅上下踏步浮動 (Bobbing)
  const bobbing = gameState.isMoving ? Math.sin(now / 60) * 2 : 0;
  const drawX = screenX - size / 2;
  const drawY = screenY - size + 16 + bobbing;

  ctx.save();
  if (flipHorizontal) {
    // 水平翻轉朝左跑
    ctx.translate(screenX, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(knightAnimImg, sx, sy, sw, sh, -size / 2, drawY, size, size);
  } else {
    ctx.drawImage(knightAnimImg, sx, sy, sw, sh, drawX, drawY, size, size);
  }
  ctx.restore();
}

// 繪製怪物精靈
function drawMonsterSprite(name, screenX, screenY, size = 38, isBoss = false) {
  const coord = MONSTER_SPRITE_MAP[name] || MONSTER_SPRITE_MAP["哥布林"];

  if (isMonsterSheetLoaded && coord) {
    const sw = 256;
    const sh = 256;
    const sx = coord.c * sw;
    const sy = coord.r * sh;
    const drawX = screenX - size / 2;
    const drawY = screenY - size + 10;

    ctx.drawImage(monsterSheetImg, sx, sy, sw, sh, drawX, drawY, size, size);
  } else {
    ctx.fillStyle = isBoss ? "#d946ef" : "#ef4444";
    ctx.fillRect(screenX - size / 4, screenY - size / 2, size / 2, size / 2);
  }
}

// 地表氛圍繪製
function drawBattlefieldTerrain(cw, ch, camX, camY) {
  const mapKey = gameState.currentMap || "town";
  const mapCfg = window.mapData && window.mapData[mapKey];
  // Draw background image if available
  if (mapCfg && mapCfg.bg) {
    if (!mapCfg.img) {
      const img = new Image();
      img.src = mapCfg.bg;
      mapCfg.img = img;
    }
    if (mapCfg.img.complete) {
      ctx.drawImage(mapCfg.img, -camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
    } else {
      // Fallback solid color while loading
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(0, 0, cw, ch);
    }
  } else {
    // Default fallback solid color
    ctx.fillStyle = "#14241b";
    ctx.fillRect(0, 0, cw, ch);
  }

  // Draw grid lines (optional)
  let tileBase = "#14241b"; // default if needed for grid contrast
  let gridLine = "#1f3b2b";
  if (mapKey.includes("fire") || mapKey.includes("werden")) {
    tileBase = "#271212";
    gridLine = "#451a1a";
  } else if (mapKey.includes("desert") || mapKey.includes("windwood")) {
    tileBase = "#292117";
    gridLine = "#453825";
  } else if (mapKey.includes("cave") || mapKey.includes("gludio") || mapKey.includes("giran")) {
    tileBase = "#111827";
    gridLine = "#1f2937";
  }

  // Optional overlay grid for visual aid
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

  // World boundary rectangle
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(-camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
}

window.renderRadar = renderRadar;