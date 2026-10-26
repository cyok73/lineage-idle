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

// ===== 經典亞丁風格地表環境渲染引擎 =====
// 緩存離屏 Canvas 避免每幀重複繪製複雜世界場景
window._terrainCache = null;
window._terrainCacheKey = "";

// 簡易偽隨機 (種子固定保證場景物件位置固定不跳動)
function _seededRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function _hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h) || 1;
}

function drawBattlefieldTerrain(cw, ch, camX, camY) {
  const mapKey = gameState.currentMap || "talking_island";
  const mapCfg = (window.mapData && window.mapData[mapKey]) || {
    name: "說話之島",
    theme: "forest",
    tileBase: "#224726",
    gridLine: "#2d5e33"
  };
  const theme = mapCfg.theme || "forest";
  const tileBase = mapCfg.tileBase || "#224726";
  const gridLine = mapCfg.gridLine || "#2d5e33";

  // --- 嘗試載入並繪製自訂背景圖 (若有配置) ---
  let bgDrawn = false;
  if (mapCfg.bg) {
    if (!mapCfg._img) {
      const img = new Image();
      img.src = mapCfg.bg;
      mapCfg._img = img;
    }
    if (mapCfg._img.complete && mapCfg._img.naturalWidth > 0) {
      ctx.drawImage(mapCfg._img, -camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
      bgDrawn = true;
    }
  }

  // --- 若無背景圖或背景圖載入中，繪製高解析經典程序化場景 ---
  if (!bgDrawn) {
    const cacheKey = mapKey + "_" + WORLD_WIDTH + "_" + WORLD_HEIGHT;
    if (window._terrainCacheKey !== cacheKey || !window._terrainCache) {
      window._terrainCacheKey = cacheKey;

      const offW = WORLD_WIDTH;
      const offH = WORLD_HEIGHT;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = offW;
      offCanvas.height = offH;
      const oc = offCanvas.getContext("2d");

      // 1. 全域基底填色
      oc.fillStyle = tileBase;
      oc.fillRect(0, 0, offW, offH);

      const rand = _seededRand(_hashStr(mapKey));

      // 2. 主題專屬地表紋理與物件渲染
      if (theme === "cave" || theme === "dungeon") {
        // ========== 地監 / 洞穴：古老石板磚地面與火把燭台 ==========
        const tileSize = 48;
        const cols = Math.ceil(offW / tileSize);
        const rows = Math.ceil(offH / tileSize);

        // 鋪設立體石板磚 (每塊磚微調深淺色調與邊縫陰影)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tx = c * tileSize;
            const ty = r * tileSize;
            const noise = (rand() - 0.5) * 16;
            const rVal = Math.max(15, Math.min(60, 32 + noise));
            const gVal = Math.max(20, Math.min(65, 38 + noise));
            const bVal = Math.max(28, Math.min(80, 50 + noise));

            oc.fillStyle = `rgb(${Math.round(rVal)},${Math.round(gVal)},${Math.round(bVal)})`;
            oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);

            // 石板邊緣立體光影 (頂部高光 / 右底暗邊)
            oc.strokeStyle = "rgba(255, 255, 255, 0.05)";
            oc.lineWidth = 1;
            oc.beginPath();
            oc.moveTo(tx + 1, ty + tileSize - 1);
            oc.lineTo(tx + 1, ty + 1);
            oc.lineTo(tx + tileSize - 1, ty + 1);
            oc.stroke();

            oc.strokeStyle = "rgba(0, 0, 0, 0.45)";
            oc.beginPath();
            oc.moveTo(tx + tileSize - 1, ty + 1);
            oc.lineTo(tx + tileSize - 1, ty + tileSize - 1);
            oc.lineTo(tx + 1, ty + tileSize - 1);
            oc.stroke();

            // 隨機磚塊裂痕
            if (rand() < 0.15) {
              oc.strokeStyle = "rgba(0, 0, 0, 0.35)";
              oc.lineWidth = 1;
              oc.beginPath();
              oc.moveTo(tx + 8 + rand() * 10, ty + 6);
              oc.lineTo(tx + 20 + rand() * 12, ty + 24);
              oc.lineTo(tx + 14 + rand() * 20, ty + 38);
              oc.stroke();
            }
          }
        }

        // 散落青苔與積水斑
        for (let i = 0; i < 40; i++) {
          const px = rand() * offW;
          const py = rand() * offH;
          const pr = 12 + rand() * 24;
          oc.fillStyle = (theme === "cave")
            ? `rgba(20, 60, 40, ${0.15 + rand() * 0.15})`
            : `rgba(20, 40, 70, ${0.12 + rand() * 0.12})`;
          oc.beginPath();
          oc.ellipse(px, py, pr, pr * 0.6, rand() * Math.PI, 0, Math.PI * 2);
          oc.fill();
        }

        // 散落白骨與骷髏殘骸 (經典地下城氛圍)
        for (let i = 0; i < 45; i++) {
          const bx = rand() * offW;
          const by = rand() * offH;
          // 骷髏頭
          oc.fillStyle = "#e2d9c8";
          oc.beginPath();
          oc.arc(bx, by, 4.5, 0, Math.PI * 2);
          oc.fill();
          oc.fillStyle = "#111827";
          oc.fillRect(bx - 2, by - 1, 1.5, 2);
          oc.fillRect(bx + 0.5, by - 1, 1.5, 2);
          // 肋骨 / 碎骨
          oc.strokeStyle = "#d6cbba";
          oc.lineWidth = 1.5;
          oc.beginPath();
          oc.moveTo(bx + 4, by + 3);
          oc.lineTo(bx + 12 + rand() * 6, by + 5 + (rand() - 0.5) * 6);
          oc.stroke();
        }

        // 地牢立柱火把 (帶溫暖橘黃徑向光暈！)
        for (let i = 0; i < 28; i++) {
          const fx = 80 + rand() * (offW - 160);
          const fy = 80 + rand() * (offH - 160);

          // 火把光暈 (照亮周圍石板磚)
          const radGrad = oc.createRadialGradient(fx, fy, 4, fx, fy, 110);
          radGrad.addColorStop(0, "rgba(251, 146, 60, 0.45)");
          radGrad.addColorStop(0.4, "rgba(234, 88, 12, 0.2)");
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          oc.fillStyle = radGrad;
          oc.beginPath();
          oc.arc(fx, fy, 110, 0, Math.PI * 2);
          oc.fill();

          // 火把底座鐵台石柱
          oc.fillStyle = "#1e2430";
          oc.fillRect(fx - 4, fy, 8, 14);
          oc.fillStyle = "#0f131a";
          oc.fillRect(fx - 5, fy + 12, 10, 4);

          // 火焰本體
          oc.fillStyle = "#ea580c";
          oc.beginPath();
          oc.arc(fx, fy - 1, 5, 0, Math.PI * 2);
          oc.fill();
          oc.fillStyle = "#fef08a";
          oc.beginPath();
          oc.arc(fx, fy - 2, 2.5, 0, Math.PI * 2);
          oc.fill();
        }

      } else if (theme === "forest" || theme === "field" || theme === "dark_forest") {
        // ========== 森林 / 野外草地：鮮明草地、泥土小徑、立體大樹、彩色野花 ==========
        const isDark = (theme === "dark_forest");

        // 1. 穿梭在草地上的蜿蜒泥土小徑
        const pathCount = 3;
        for (let p = 0; p < pathCount; p++) {
          oc.strokeStyle = isDark ? "#382d22" : "#5a452e";
          oc.lineWidth = 42 + rand() * 18;
          oc.lineCap = "round";
          oc.lineJoin = "round";
          oc.beginPath();
          let px = rand() * offW;
          let py = (p / pathCount) * offH + rand() * 100;
          oc.moveTo(px, py);
          for (let seg = 0; seg < 5; seg++) {
            px += (rand() - 0.4) * 500;
            py += (rand() - 0.5) * 300;
            oc.lineTo(px, py);
          }
          oc.stroke();
        }

        // 2. 泥徑碎石與車轍微紋
        for (let i = 0; i < 200; i++) {
          const rx = rand() * offW;
          const ry = rand() * offH;
          oc.fillStyle = "rgba(70, 50, 35, 0.25)";
          oc.beginPath();
          oc.ellipse(rx, ry, 2 + rand() * 4, 1.5, rand() * Math.PI, 0, Math.PI * 2);
          oc.fill();
        }

        // 3. 綠意盎然的草地斑塊
        for (let i = 0; i < 180; i++) {
          const gx = rand() * offW;
          const gy = rand() * offH;
          const gr = 18 + rand() * 32;
          oc.fillStyle = isDark
            ? `rgba(25, 65, 30, ${0.2 + rand() * 0.15})`
            : `rgba(45, 120, 50, ${0.2 + rand() * 0.2})`;
          oc.beginPath();
          oc.ellipse(gx, gy, gr, gr * 0.6, rand() * Math.PI, 0, Math.PI * 2);
          oc.fill();
        }

        // 4. 彩色野花叢 (紅白黃藍花朵點綴草地，極度鮮活！)
        const flowerColors = ["#ef4444", "#facc15", "#ffffff", "#38bdf8", "#f472b6"];
        for (let i = 0; i < 140; i++) {
          const fx = rand() * offW;
          const fy = rand() * offH;
          const fCol = flowerColors[Math.floor(rand() * flowerColors.length)];
          // 花瓣
          oc.fillStyle = fCol;
          for (let petal = 0; petal < 4; petal++) {
            const ang = (petal * Math.PI) / 2;
            oc.beginPath();
            oc.arc(fx + Math.cos(ang) * 2.2, fy + Math.sin(ang) * 2.2, 1.6, 0, Math.PI * 2);
            oc.fill();
          }
          // 花蕊
          oc.fillStyle = "#fbbf24";
          oc.beginPath();
          oc.arc(fx, fy, 1.2, 0, Math.PI * 2);
          oc.fill();
        }

        // 5. 灰色青苔立體石塊
        for (let i = 0; i < 40; i++) {
          const rx = rand() * offW;
          const ry = rand() * offH;
          const rw = 10 + rand() * 16;
          // 石塊陰影
          oc.fillStyle = "rgba(0, 0, 0, 0.35)";
          oc.beginPath();
          oc.ellipse(rx + 2, ry + 4, rw * 0.7, rw * 0.35, 0, 0, Math.PI * 2);
          oc.fill();
          // 石塊本體
          oc.fillStyle = "#525964";
          oc.beginPath();
          oc.ellipse(rx, ry, rw * 0.6, rw * 0.4, 0, 0, Math.PI * 2);
          oc.fill();
          // 石上青苔
          oc.fillStyle = "#365314";
          oc.beginPath();
          oc.arc(rx - 2, ry - 1, rw * 0.25, 0, Math.PI * 2);
          oc.fill();
        }

        // 6. 立體茂密大樹 (雙層樹冠、樹幹木紋與深色地面投影)
        const treeCount = isDark ? 65 : 55;
        for (let i = 0; i < treeCount; i++) {
          const tx = rand() * offW;
          const ty = rand() * offH;
          const tr = 18 + rand() * 16;

          // 地面大陰影
          oc.fillStyle = "rgba(0, 0, 0, 0.35)";
          oc.beginPath();
          oc.ellipse(tx + 4, ty + tr * 0.8, tr * 1.1, tr * 0.5, 0, 0, Math.PI * 2);
          oc.fill();

          // 樹幹
          oc.fillStyle = "#3e2716";
          oc.fillRect(tx - 3, ty + tr * 0.2, 6, tr * 0.65);

          if (isDark) {
            // 枯死扭曲黑木 / 妖魔怪樹
            oc.fillStyle = "#1e3020";
            oc.beginPath();
            oc.arc(tx, ty, tr, 0, Math.PI * 2);
            oc.fill();
            oc.fillStyle = "#142217";
            oc.beginPath();
            oc.arc(tx - 3, ty - 3, tr * 0.75, 0, Math.PI * 2);
            oc.fill();
          } else {
            // 茂盛綠樹 (深底 + 亮綠頂冠)
            oc.fillStyle = "#166534";
            oc.beginPath();
            oc.arc(tx, ty, tr, 0, Math.PI * 2);
            oc.fill();

            oc.fillStyle = "#22c55e";
            oc.beginPath();
            oc.arc(tx - 3, ty - 4, tr * 0.72, 0, Math.PI * 2);
            oc.fill();

            oc.fillStyle = "#86efac";
            oc.beginPath();
            oc.arc(tx - 5, ty - 6, tr * 0.38, 0, Math.PI * 2);
            oc.fill();
          }
        }

      } else if (theme === "desert") {
        // ========== 風木沙漠：金黃沙浪、立體仙人掌、巨獸骸骨 ==========
        // 沙浪波紋
        for (let i = 0; i < 40; i++) {
          const dx = rand() * offW;
          const dy = rand() * offH;
          const dw = 50 + rand() * 90;
          oc.fillStyle = "rgba(133, 105, 69, 0.3)";
          oc.beginPath();
          oc.ellipse(dx, dy, dw, dw * 0.2, rand() * 0.5, 0, Math.PI * 2);
          oc.fill();
          oc.strokeStyle = "rgba(234, 179, 8, 0.15)";
          oc.lineWidth = 1.5;
          oc.beginPath();
          oc.ellipse(dx, dy - 2, dw * 0.85, dw * 0.14, rand() * 0.5, 0, Math.PI * 2);
          oc.stroke();
        }

        // 巨獸肋骨骸骨
        for (let i = 0; i < 20; i++) {
          const bx = rand() * offW;
          const by = rand() * offH;
          oc.strokeStyle = "#e5e0d3";
          oc.lineWidth = 3;
          oc.beginPath();
          oc.arc(bx, by, 18 + rand() * 10, Math.PI * 0.8, Math.PI * 1.8);
          oc.stroke();
        }

        // 立體枝狀仙人掌
        for (let i = 0; i < 35; i++) {
          const cx = rand() * offW;
          const cy = rand() * offH;
          // 陰影
          oc.fillStyle = "rgba(0, 0, 0, 0.25)";
          oc.beginPath();
          oc.ellipse(cx + 6, cy + 4, 12, 4, 0, 0, Math.PI * 2);
          oc.fill();
          // 主幹
          oc.fillStyle = "#2d6a4f";
          oc.fillRect(cx - 3, cy - 22, 6, 24);
          // 側臂
          oc.fillRect(cx - 9, cy - 14, 6, 3);
          oc.fillRect(cx - 9, cy - 20, 3, 8);
          oc.fillRect(cx + 3, cy - 10, 6, 3);
          oc.fillRect(cx + 6, cy - 16, 3, 8);
        }

      } else if (theme === "boss") {
        // ========== 首領密室：黑曜石磚、中心巨型血色召喚魔法陣、冥火四柱 ==========
        // 鋪設深紅黑曜石板磚
        const tileSize = 60;
        const cols = Math.ceil(offW / tileSize);
        const rows = Math.ceil(offH / tileSize);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tx = c * tileSize;
            const ty = r * tileSize;
            const n = (rand() - 0.5) * 10;
            oc.fillStyle = `rgb(${Math.round(40 + n)},${Math.round(20 + n * 0.5)},${Math.round(25 + n * 0.5)})`;
            oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
            oc.strokeStyle = "rgba(0,0,0,0.5)";
            oc.strokeRect(tx, ty, tileSize, tileSize);
          }
        }

        // 中心震撼血色惡魔召喚魔法陣 (直徑 480px！)
        const mx = offW / 2;
        const my = offH / 2;

        // 召喚陣紅光漸變
        const magicGrad = oc.createRadialGradient(mx, my, 20, mx, my, 260);
        magicGrad.addColorStop(0, "rgba(220, 38, 38, 0.45)");
        magicGrad.addColorStop(0.6, "rgba(185, 28, 28, 0.2)");
        magicGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        oc.fillStyle = magicGrad;
        oc.beginPath();
        oc.arc(mx, my, 260, 0, Math.PI * 2);
        oc.fill();

        // 雙同心外環
        oc.strokeStyle = "#ef4444";
        oc.lineWidth = 3;
        oc.beginPath();
        oc.arc(mx, my, 200, 0, Math.PI * 2);
        oc.stroke();
        oc.lineWidth = 1.5;
        oc.beginPath();
        oc.arc(mx, my, 180, 0, Math.PI * 2);
        oc.stroke();
        oc.beginPath();
        oc.arc(mx, my, 120, 0, Math.PI * 2);
        oc.stroke();

        // 五芒星刻痕
        oc.strokeStyle = "#dc2626";
        oc.lineWidth = 2.5;
        oc.beginPath();
        for (let p = 0; p < 5; p++) {
          const ang = (p * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = mx + Math.cos(ang) * 180;
          const py = my + Math.sin(ang) * 180;
          if (p === 0) oc.moveTo(px, py);
          else oc.lineTo(px, py);
        }
        oc.closePath();
        oc.stroke();

        // 四角冥火石柱 (燃燒紫色冥火)
        const corners = [
          { x: mx - 280, y: my - 240 },
          { x: mx + 280, y: my - 240 },
          { x: mx - 280, y: my + 240 },
          { x: mx + 280, y: my + 240 }
        ];
        corners.forEach(cp => {
          const pGrad = oc.createRadialGradient(cp.x, cp.y, 4, cp.x, cp.y, 120);
          pGrad.addColorStop(0, "rgba(168, 85, 247, 0.5)");
          pGrad.addColorStop(0.5, "rgba(126, 34, 206, 0.2)");
          pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          oc.fillStyle = pGrad;
          oc.beginPath();
          oc.arc(cp.x, cp.y, 120, 0, Math.PI * 2);
          oc.fill();

          oc.fillStyle = "#1e1322";
          oc.fillRect(cp.x - 6, cp.y, 12, 18);
          oc.fillStyle = "#c084fc";
          oc.beginPath();
          oc.arc(cp.x, cp.y - 2, 6, 0, Math.PI * 2);
          oc.fill();
        });

      } else if (theme === "fire") {
        // ========== 威頓火龍窟：焦黑玄武岩石板、脈動鮮明熔岩裂縫 ==========
        // 焦岩石板
        const tileSize = 50;
        const cols = Math.ceil(offW / tileSize);
        const rows = Math.ceil(offH / tileSize);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tx = c * tileSize;
            const ty = r * tileSize;
            oc.fillStyle = (rand() < 0.5) ? "#2b1412" : "#361815";
            oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          }
        }

        // 滾燙熾熱的熔岩裂隙河 (亮黃色中心 + 亮紅橙發光邊緣)
        for (let i = 0; i < 18; i++) {
          let lx = rand() * offW;
          let ly = rand() * offH;
          const segs = 6 + Math.floor(rand() * 6);

          // 外層高溫橙紅光暈
          oc.strokeStyle = "rgba(239, 68, 68, 0.6)";
          oc.lineWidth = 10;
          oc.lineCap = "round";
          oc.beginPath();
          oc.moveTo(lx, ly);
          let cx = lx, cy = ly;
          const points = [[cx, cy]];
          for (let s = 0; s < segs; s++) {
            cx += (rand() - 0.48) * 80;
            cy += (rand() - 0.48) * 80;
            points.push([cx, cy]);
            oc.lineTo(cx, cy);
          }
          oc.stroke();

          // 內層滾燙金黃岩漿核心
          oc.strokeStyle = "#fef08a";
          oc.lineWidth = 3.5;
          oc.beginPath();
          points.forEach((pt, idx) => {
            if (idx === 0) oc.moveTo(pt[0], pt[1]);
            else oc.lineTo(pt[0], pt[1]);
          });
          oc.stroke();
        }

      } else if (theme === "water") {
        // ========== 海音水底地監：沉船藍石磚、水底波光焦散、海藻水草 ==========
        const tileSize = 48;
        const cols = Math.ceil(offW / tileSize);
        const rows = Math.ceil(offH / tileSize);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tx = c * tileSize;
            const ty = r * tileSize;
            oc.fillStyle = (rand() < 0.5) ? "#0e2b3d" : "#13374d";
            oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          }
        }

        // 水光波紋網 (Caustics 折射光斑)
        for (let i = 0; i < 60; i++) {
          const cx = rand() * offW;
          const cy = rand() * offH;
          oc.strokeStyle = "rgba(56, 189, 248, 0.16)";
          oc.lineWidth = 2;
          oc.beginPath();
          oc.ellipse(cx, cy, 25 + rand() * 35, 12 + rand() * 18, rand() * Math.PI, 0, Math.PI * 2);
          oc.stroke();
        }

        // 深海長條水草
        for (let i = 0; i < 40; i++) {
          const sx = rand() * offW;
          const sy = rand() * offH;
          oc.strokeStyle = "#15803d";
          oc.lineWidth = 3;
          oc.beginPath();
          oc.moveTo(sx, sy);
          oc.quadraticCurveTo(sx + 15, sy - 20, sx - 5, sy - 40);
          oc.stroke();
        }

      } else if (theme === "ant_cave") {
        // ========== 巨蟻洞穴：黃褐黏土洞窟、蟻穴通道環紋、綠色螢光真菌 ==========
        // 泥丘紋理
        for (let i = 0; i < 70; i++) {
          const ax = rand() * offW;
          const ay = rand() * offH;
          oc.fillStyle = (rand() < 0.5) ? "#4d3824" : "#322316";
          oc.beginPath();
          oc.ellipse(ax, ay, 20 + rand() * 35, 14 + rand() * 20, rand() * Math.PI, 0, Math.PI * 2);
          oc.fill();
        }

        // 綠色螢光真菌菌斑 (洞穴自體發光生物)
        for (let i = 0; i < 35; i++) {
          const fx = rand() * offW;
          const fy = rand() * offH;
          const fGrad = oc.createRadialGradient(fx, fy, 2, fx, fy, 45);
          fGrad.addColorStop(0, "rgba(132, 204, 22, 0.45)");
          fGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          oc.fillStyle = fGrad;
          oc.beginPath();
          oc.arc(fx, fy, 45, 0, Math.PI * 2);
          oc.fill();

          oc.fillStyle = "#bef264";
          oc.beginPath();
          oc.arc(fx, fy, 3, 0, Math.PI * 2);
          oc.fill();
        }
      }

      window._terrainCache = offCanvas;
    }

    // 繪製生成好的世界高畫質地表
    if (window._terrainCache) {
      ctx.drawImage(window._terrainCache, -camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
    }
  }

  // --- 3. 戰鬥輔助細格線 (半透明 0.12，融入地表不遮擋場景) ---
  ctx.strokeStyle = gridLine;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.12;
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
  ctx.globalAlpha = 1.0;

  // --- 4. 動態環境光影粒子特效 (每幀賦予戰場生命力) ---
  const time = Date.now() * 0.001;
  if (theme === "fire") {
    // 火龍窟升騰火星
    for (let i = 0; i < 16; i++) {
      const fx = ((Math.sin(time * 0.4 + i * 1.7) * 0.5 + 0.5) * cw);
      const fy = (ch - ((time * 45 + i * 75) % ch));
      ctx.fillStyle = `rgba(251, 146, 60, ${0.4 + Math.sin(time * 2 + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === "water") {
    // 深海浮動氣泡
    for (let i = 0; i < 14; i++) {
      const bx = ((Math.cos(time * 0.3 + i * 2.3) * 0.5 + 0.5) * cw);
      const by = (ch - ((time * 30 + i * 65) % ch));
      ctx.strokeStyle = "rgba(186, 230, 253, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(bx, by, 3 + (i % 4), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme === "boss") {
    // 首領密室血色呼吸氛圍
    const pulse = (Math.sin(time * 1.8) * 0.5 + 0.5) * 0.04;
    ctx.fillStyle = `rgba(220, 38, 38, ${pulse})`;
    ctx.fillRect(0, 0, cw, ch);
  }

  // --- 5. 世界邊界石牆/暗黑邊緣線 ---
  ctx.strokeStyle = "rgba(220, 38, 38, 0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(-camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
}

window.renderRadar = renderRadar;