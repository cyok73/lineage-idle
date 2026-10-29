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
// 暗黑五大章節怪物圖譜坐標與視覺映射表 (Row 0~3, Col 0~3)
const MONSTER_SPRITE_MAP = {
  // === Act 1 羅格營地區域 ===
  "沉淪魔": { c: 0, r: 1, tint: "#ef4444", horns: true, scale: 0.95 },
  "飢餓殭屍": { c: 0, r: 2, tint: "#84cc16", scale: 1.05 },
  "沉淪魔巫師": { c: 1, r: 1, tint: "#f97316", staffFlame: true, scale: 1.1 },
  "月亮一族羊頭怪": { c: 3, r: 1, tint: "#b45309", horns: true, scale: 1.15 },
  "骷髏弓箭手": { c: 2, r: 1, tint: "#f8fafc", bow: true, scale: 1.0 },
  "利爪蝮蛇": { c: 2, r: 2, tint: "#10b981", snake: true, scale: 1.1 },
  "拜血者女妖": { c: 2, r: 0, tint: "#c084fc", wings: true, scale: 1.1 },
  "黑暗女槍手": { c: 1, r: 0, tint: "#f43f5e", spear: true, scale: 1.05 },
  "安達利爾": { c: 2, r: 0, isActBoss: true, tint: "#22c55e", bossKey: "andariel", scale: 1.6 },

  // === Act 2 魯高因沙漠區域 ===
  "劍齒貓掠奪者": { c: 3, r: 1, tint: "#f59e0b", scale: 1.1 },
  "沙漠沙蟲": { c: 2, r: 2, tint: "#d97706", scale: 1.25 },
  "枯骨木乃伊": { c: 1, r: 2, tint: "#cbd5e1", scale: 1.1 },
  "死雷電金龜": { c: 2, r: 2, tint: "#38bdf8", electric: true, scale: 1.15 },
  "燃燒幽靈": { c: 2, r: 0, tint: "#06b6d4", ghostly: true, scale: 1.1 },
  "督瑞爾": { c: 0, r: 3, isActBoss: true, tint: "#38bdf8", bossKey: "duriel", scale: 1.7 },

  // === Act 3 庫拉斯特叢林 ===
  "叢林小矮人巫師": { c: 0, r: 1, tint: "#15803d", mask: true, scale: 0.9 },
  "巨型毒棘蜘蛛": { c: 2, r: 2, tint: "#059669", poisonLegs: true, scale: 1.3 },
  "狂熱狂信徒": { c: 1, r: 1, tint: "#dc2626", frenzy: true, scale: 1.05 },
  "瘸子議會長老": { c: 2, r: 0, tint: "#f59e0b", council: true, scale: 1.2 },
  "冥河娃娃自爆兵": { c: 0, r: 1, tint: "#e2e8f0", explosive: true, scale: 0.85 },
  "墨菲斯托": { c: 2, r: 3, isActBoss: true, tint: "#60a5fa", bossKey: "mephisto", scale: 1.8 },

  // === Act 4 群魔堡壘 ===
  "絕望冥火狂犬": { c: 3, r: 1, tint: "#ea580c", hellhound: true, scale: 1.15 },
  "墮落罪惡熾天使": { c: 2, r: 0, tint: "#7c3aed", wings: true, darkFire: true, scale: 1.25 },
  "遺忘末日騎士": { c: 1, r: 3, tint: "#f43f5e", doomKnight: true, scale: 1.25 },
  "暗黑破壞神": { c: 0, r: 3, isActBoss: true, tint: "#ef4444", bossKey: "diablo", scale: 2.0 },

  // === Act 5 哈洛加斯 ===
  "攻城投石巨獸": { c: 3, r: 2, tint: "#64748b", scale: 1.35 },
  "督軍山克": { c: 1, r: 1, tint: "#b91c1c", scale: 1.25 },
  "守護者・科力克": { c: 0, r: 0, tint: "#eab308", ancient: true, scale: 1.25 },
  "守護者・塔力克": { c: 0, r: 0, tint: "#eab308", ancient: true, scale: 1.25 },
  "守護者・馬道克": { c: 0, r: 0, tint: "#eab308", ancient: true, scale: 1.25 },
  "毀滅之爪恐懼僕從": { c: 3, r: 1, tint: "#881337", scale: 1.35 },
  "巴爾": { c: 2, r: 3, isActBoss: true, tint: "#9333ea", bossKey: "baal", scale: 1.9 },

  // === 隱藏秘密關卡 ===
  "地獄長戟母牛": { c: 1, r: 1, tint: "#f1f5f9", cow: true, scale: 1.2 },
  "母牛之王": { c: 1, r: 1, isActBoss: true, tint: "#facc15", cowKing: true, bossKey: "cow_king", scale: 1.6 },

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

  // 3.5 繪製 8 人傭兵追隨者小隊 (Mercenaries Party)
  if (currentChar && Array.isArray(currentChar.mercenaries)) {
    currentChar.mercenaries.forEach(merc => {
      if (merc.currentHp <= 0 || merc.x === undefined) return;
      const mx = merc.x - camX;
      const my = merc.y - camY;

      // 靈氣圈 (Aura effect under feet)
      if (merc.aura === "might") {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.75)"; // 金色力量光環
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(mx, my + 14, 22, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (merc.aura === "holy_freeze") {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.75)"; // 冰藍神聖冰凍光環
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(mx, my + 14, 22, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (merc.aura === "prayer") {
        ctx.strokeStyle = "rgba(34, 197, 94, 0.75)"; // 翡翠祈禱光環
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(mx, my + 14, 22, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 傭兵本體陰影
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(mx, my + 14, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 傭兵精靈/標記圓形
      ctx.fillStyle = merc.type === "desert_guard" ? "#f59e0b" : (merc.type === "rogue" ? "#38bdf8" : (merc.type === "iron_wolf" ? "#a855f7" : "#ef4444"));
      ctx.beginPath();
      ctx.arc(mx, my, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 傭兵兵種圖標文字
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      const typeChar = merc.type === "desert_guard" ? "槍" : (merc.type === "rogue" ? "弓" : (merc.type === "iron_wolf" ? "法" : "蠻"));
      ctx.fillText(typeChar, mx, my + 4);

      // 傭兵血條
      const mercHpPct = Math.max(0, Math.min(1, merc.currentHp / merc.maxHp));
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(mx - 16, my - 22, 32, 4);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(mx - 16, my - 22, 32 * mercHpPct, 4);

      // 傭兵名稱標籤
      ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText(`[傭兵] ${merc.name.split(" ")[0]}`, mx, my - 26);
      ctx.shadowBlur = 0;
    });
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

// 繪製暗黑五大經典職業精靈 (野蠻人、魔法使、聖騎士、死靈法師、亞馬遜)
function drawPlayerHDActionSprite(screenX, screenY, size = 68) {
  const cls = (currentChar && currentChar.charClass) || "barbarian";
  const now = Date.now();
  let row = 0; // 0: South(Down), 1: East(Right), 2: North(Up), 3: Attack
  let col = 0;
  let flipHorizontal = false;

  // 1. 攻擊動畫判定
  if (gameState.playerAttackAnim && now < gameState.playerAttackAnim.startTime + gameState.playerAttackAnim.duration) {
    row = 3;
    const elapsed = now - gameState.playerAttackAnim.startTime;
    const progress = Math.min(1, elapsed / gameState.playerAttackAnim.duration);
    col = Math.min(3, Math.floor(progress * 4));
    if (playerFacing === "left") flipHorizontal = true;
  } else {
    // 2. 跑步/行走動作判定
    if (playerFacing === "down") {
      row = 0;
    } else if (playerFacing === "right") {
      row = 1;
      flipHorizontal = false;
    } else if (playerFacing === "left") {
      row = 1;
      flipHorizontal = true;
    } else if (playerFacing === "up") {
      row = 2;
    }

    if (gameState.isMoving) {
      col = Math.floor(now / 120) % 4;
    } else {
      col = 0;
    }
  }

  const sw = 256;
  const sh = 256;
  const sx = col * sw;
  const sy = row * sh;

  const bobbing = gameState.isMoving ? Math.sin(now / 60) * 2 : 0;
  const drawX = screenX - size / 2;
  const drawY = screenY - size + 16 + bobbing;

  // ===== A. 職業腳底專屬靈氣特效 (Class Floor Auras) =====
  if (cls === "barbarian") {
    // 狂暴戰鬥狂熱光環：暗紅烈焰氣環與火星
    const flameSize = 26 + Math.sin(now / 180) * 3;
    ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 22, flameSize, flameSize * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(220, 38, 38, 0.2)";
    ctx.fill();
  } else if (cls === "sorceress") {
    // 元素秘術法陣光環：紫藍元素光暈
    const arcRadius = 26 + Math.cos(now / 200) * 2;
    ctx.strokeStyle = "rgba(168, 85, 247, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 22, arcRadius, arcRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (cls === "paladin") {
    // 專注/狂熱神聖光環：金黃聖光帶 8 芒刻痕
    const rot = (now / 600) % (Math.PI * 2);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 22, 28, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (let r = 0; r < 8; r++) {
      const a = rot + (r * Math.PI) / 4;
      const rx1 = screenX + Math.cos(a) * 20;
      const ry1 = screenY + 22 + Math.sin(a) * 8;
      const rx2 = screenX + Math.cos(a) * 32;
      const ry2 = screenY + 22 + Math.sin(a) * 14;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }
  } else if (cls === "necromancer") {
    // 死靈瘴氣光環：暗毒幽魂綠霧
    ctx.strokeStyle = "rgba(16, 185, 129, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 22, 26, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(5, 150, 105, 0.25)";
    ctx.fill();
  } else if (cls === "amazon") {
    // 風行者靈敏風環：翡翠風之軌跡
    const wPulse = 26 + Math.sin(now / 140) * 4;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 22, wPulse, wPulse * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ===== B. 繪製精靈動作本體 =====
  ctx.save();
  if (flipHorizontal) {
    ctx.translate(screenX, 0);
    ctx.scale(-1, 1);
    if (isKnightAnimLoaded) {
      ctx.drawImage(knightAnimImg, sx, sy, sw, sh, -size / 2, drawY, size, size);
    } else {
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(-size / 4, drawY + size / 4, size / 2, size / 2);
    }
  } else {
    if (isKnightAnimLoaded) {
      ctx.drawImage(knightAnimImg, sx, sy, sw, sh, drawX, drawY, size, size);
    } else {
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(drawX + size / 4, drawY + size / 4, size / 2, size / 2);
    }
  }
  ctx.restore();

  // ===== C. 職業外觀專屬特徵與武器配備 (Class Unique Overlays) =====
  if (cls === "barbarian") {
    // 牛角狂戰鐵盔 (頭頂雙紅角)
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.moveTo(screenX - 10, drawY + 16);
    ctx.lineTo(screenX - 16, drawY + 6);
    ctx.lineTo(screenX - 8, drawY + 14);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(screenX + 10, drawY + 16);
    ctx.lineTo(screenX + 16, drawY + 6);
    ctx.lineTo(screenX + 8, drawY + 14);
    ctx.fill();

    // 雙持狂暴戰斧
    const axW = flipHorizontal ? screenX - 22 : screenX + 22;
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(axW, drawY + 36, 10, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
  } else if (cls === "sorceress") {
    // 元素使者法杖與水晶寶珠
    const stX = flipHorizontal ? screenX - 20 : screenX + 20;
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(stX, drawY + 48);
    ctx.lineTo(stX, drawY + 12);
    ctx.stroke();

    const orbGlow = ctx.createRadialGradient(stX, drawY + 10, 1, stX, drawY + 10, 8);
    orbGlow.addColorStop(0, "#ffffff");
    orbGlow.addColorStop(0.5, "#38bdf8");
    orbGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(stX, drawY + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // 三顆環繞法師旋轉的元素法球 (冰、火、電)
    const orbs = [
      { color: "#38bdf8", ang: (now / 350) },
      { color: "#f97316", ang: (now / 350) + (Math.PI * 2 / 3) },
      { color: "#c084fc", ang: (now / 350) + (Math.PI * 4 / 3) }
    ];
    orbs.forEach(ob => {
      const ox = screenX + Math.cos(ob.ang) * 26;
      const oy = (drawY + 32) + Math.sin(ob.ang) * 14;
      ctx.fillStyle = ob.color;
      ctx.beginPath();
      ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (cls === "paladin") {
    // 聖騎士十字聖盾 (左手金邊銀盾與十字紋章)
    const shX = flipHorizontal ? screenX + 18 : screenX - 18;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(shX - 6, drawY + 28, 12, 18);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(shX - 6, drawY + 28, 12, 18);
    // 聖盾金色十字
    ctx.fillStyle = "#facc15";
    ctx.fillRect(shX - 1.5, drawY + 30, 3, 14);
    ctx.fillRect(shX - 5, drawY + 34, 10, 3);
  } else if (cls === "necromancer") {
    // 死靈骨杖
    const wandX = flipHorizontal ? screenX - 18 : screenX + 18;
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wandX, drawY + 45);
    ctx.lineTo(wandX, drawY + 18);
    ctx.stroke();

    // 漂浮幽魂光點 (2 隻小綠骷髏光點環繞)
    for (let s = 0; s < 2; s++) {
      const sang = (now / 400) + (s * Math.PI);
      const sx = screenX + Math.cos(sang) * 24;
      const sy = (drawY + 26) + Math.sin(sang) * 12;
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (cls === "amazon") {
    // 亞馬遜戰鬥長弓
    const bowX = flipHorizontal ? screenX - 20 : screenX + 20;
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bowX, drawY + 34, 16, -Math.PI / 2.2, Math.PI / 2.2, flipHorizontal);
    ctx.stroke();

    // 弓弦
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bowX, drawY + 18);
    ctx.lineTo(bowX, drawY + 50);
    ctx.stroke();
  }

  // ===== D. 職業頭頂身分標籤 (Class Badge) =====
  const classTitles = {
    barbarian: "🪓 [野蠻人]",
    sorceress: "🔮 [魔法使]",
    paladin: "🛡️ [聖騎士]",
    necromancer: "💀 [死靈法師]",
    amazon: "🏹 [亞馬遜]"
  };
  const title = classTitles[cls] || "⚔️ [冒險者]";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = (cls === "barbarian") ? "#f87171" :
    (cls === "sorceress") ? "#c084fc" :
    (cls === "paladin") ? "#fde047" :
    (cls === "necromancer") ? "#6ee7b7" : "#7dd3fc";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 4;
  ctx.fillText(title, screenX, drawY - 4);
  ctx.shadowBlur = 0;
}

// 繪製暗黑風格怪物精靈 (支援首領特效與巨型 Boss 渲染)
function drawMonsterSprite(name, screenX, screenY, size = 38, isBoss = false) {
  const coord = MONSTER_SPRITE_MAP[name] || MONSTER_SPRITE_MAP["沉淪魔"] || { c: 0, r: 1 };
  const actualSize = size * (coord.scale || 1.0);

  // 首領專屬腳底巨型惡魔召喚法陣
  if (isBoss || coord.isActBoss) {
    const now = Date.now();
    const rot = (now / 800) % (Math.PI * 2);
    const bossAuraColor = coord.bossKey === "andariel" ? "rgba(34, 197, 94, 0.65)" :
      coord.bossKey === "duriel" ? "rgba(56, 189, 248, 0.75)" :
      coord.bossKey === "mephisto" ? "rgba(96, 165, 250, 0.75)" :
      coord.bossKey === "diablo" ? "rgba(239, 68, 68, 0.85)" :
      coord.bossKey === "baal" ? "rgba(168, 85, 247, 0.85)" : "rgba(245, 158, 11, 0.75)";

    ctx.strokeStyle = bossAuraColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 14, actualSize * 0.6, actualSize * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 旋轉符文星芒
    for (let p = 0; p < 5; p++) {
      const a = rot + (p * Math.PI * 2) / 5;
      const px = screenX + Math.cos(a) * actualSize * 0.55;
      const py = screenY + 14 + Math.sin(a) * actualSize * 0.22;
      ctx.fillStyle = bossAuraColor;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (isMonsterSheetLoaded && coord) {
    const sw = 256;
    const sh = 256;
    const sx = coord.c * sw;
    const sy = coord.r * sh;
    const drawX = screenX - actualSize / 2;
    const drawY = screenY - actualSize + 10;

    ctx.drawImage(monsterSheetImg, sx, sy, sw, sh, drawX, drawY, actualSize, actualSize);

    // 怪物特色覆蓋 (如沉淪魔雙角、閃電金龜火花)
    if (coord.horns) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(screenX - 6, drawY + 10);
      ctx.lineTo(screenX - 10, drawY + 2);
      ctx.lineTo(screenX - 4, drawY + 8);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(screenX + 6, drawY + 10);
      ctx.lineTo(screenX + 10, drawY + 2);
      ctx.lineTo(screenX + 4, drawY + 8);
      ctx.fill();
    } else if (coord.electric) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(screenX - 8, drawY + 16);
      ctx.lineTo(screenX - 2, drawY + 8);
      ctx.lineTo(screenX + 4, drawY + 14);
      ctx.lineTo(screenX + 10, drawY + 6);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = isBoss ? "#d946ef" : "#ef4444";
    ctx.fillRect(screenX - actualSize / 4, screenY - actualSize / 2, actualSize / 2, actualSize / 2);
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
  if (!ctx) {
    if (!canvas) canvas = document.getElementById("gameCanvas");
    if (canvas) ctx = canvas.getContext("2d");
  }
  if (!ctx) return;

  const mapKey = gameState.currentMap || "blood_moor";
  const mapCfg = (window.mapData && window.mapData[mapKey]) || window.mapData["blood_moor"] || {
    name: "鮮血荒地",
    theme: "blood_moor",
    tileBase: "#1a1815"
  };
  const theme = mapCfg.theme || "blood_moor";
  const tileBase = mapCfg.tileBase || "#1a1815";

  // 清除 Canvas CSS 背景，確保由專屬暗黑程序化繪圖引擎全權掌控
  if (canvas && canvas.style) {
    if (canvas.style.backgroundImage && canvas.style.backgroundImage !== "none") {
      canvas.style.backgroundImage = "none";
    }
  }

  // --- 高解析暗黑破壞神五大章節專屬程序化世界場景生成 ---
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

    // 2. 五大章節專屬主題地形刻畫
    if (theme === "blood_moor") {
      // ========== Act 1 鮮血荒地：泥濘荒野、枯草叢、血泊、防禦木柵、營火 ==========
      // 泥濘路徑
      for (let p = 0; p < 3; p++) {
        oc.strokeStyle = "#2b231c";
        oc.lineWidth = 45 + rand() * 20;
        oc.lineCap = "round";
        oc.beginPath();
        let px = rand() * offW, py = (p / 3) * offH + rand() * 120;
        oc.moveTo(px, py);
        for (let seg = 0; seg < 5; seg++) {
          px += (rand() - 0.45) * 500;
          py += (rand() - 0.5) * 300;
          oc.lineTo(px, py);
        }
        oc.stroke();
      }

      // 枯草斑塊
      for (let i = 0; i < 160; i++) {
        const gx = rand() * offW, gy = rand() * offH, gr = 16 + rand() * 28;
        oc.fillStyle = (rand() < 0.6) ? "rgba(70, 50, 30, 0.25)" : "rgba(45, 60, 35, 0.2)";
        oc.beginPath();
        oc.ellipse(gx, gy, gr, gr * 0.55, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

      // 暗紅血泊 (鮮血荒地標誌性血池)
      for (let i = 0; i < 30; i++) {
        const bx = rand() * offW, by = rand() * offH, br = 18 + rand() * 32;
        oc.fillStyle = "rgba(136, 19, 55, 0.35)";
        oc.beginPath();
        oc.ellipse(bx, by, br, br * 0.45, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
        oc.strokeStyle = "rgba(159, 18, 57, 0.5)";
        oc.lineWidth = 1.5;
        oc.stroke();
      }

      // 羅格營地防禦木樁與尖刺拒馬
      for (let i = 0; i < 35; i++) {
        const sx = rand() * offW, sy = rand() * offH;
        oc.fillStyle = "#3e2716";
        oc.fillRect(sx - 3, sy - 14, 6, 16);
        oc.fillStyle = "#1c1917";
        oc.beginPath();
        oc.moveTo(sx - 4, sy - 14);
        oc.lineTo(sx, sy - 22);
        oc.lineTo(sx + 4, sy - 14);
        oc.fill();
      }

      // 營地營火 (橘黃火光光暈)
      for (let i = 0; i < 14; i++) {
        const fx = 120 + rand() * (offW - 240), fy = 120 + rand() * (offH - 240);
        const grad = oc.createRadialGradient(fx, fy, 4, fx, fy, 90);
        grad.addColorStop(0, "rgba(249, 115, 22, 0.4)");
        grad.addColorStop(0.5, "rgba(234, 88, 12, 0.15)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        oc.fillStyle = grad;
        oc.beginPath();
        oc.arc(fx, fy, 90, 0, Math.PI * 2);
        oc.fill();

        // 灰燼與火堆
        oc.fillStyle = "#1c1917";
        oc.fillRect(fx - 6, fy - 2, 12, 5);
        oc.fillStyle = "#ef4444";
        oc.beginPath();
        oc.arc(fx, fy - 4, 3.5, 0, Math.PI * 2);
        oc.fill();
      }

    } else if (theme === "stony_field") {
      // ========== Act 1 石塊曠野：冷冽石原、發光石柱群 (巨石陣)、古老符文 ==========
      // 鋪設碎石板原
      for (let i = 0; i < 120; i++) {
        const rx = rand() * offW, ry = rand() * offH, rw = 25 + rand() * 45;
        oc.fillStyle = "rgba(45, 50, 48, 0.35)";
        oc.beginPath();
        oc.ellipse(rx, ry, rw, rw * 0.5, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

      // 經典 Cairn Stones 巨石陣 (發光神秘藍芒巨石柱)
      const stoneClusters = [
        { cx: offW * 0.25, cy: offH * 0.3 },
        { cx: offW * 0.75, cy: offH * 0.4 },
        { cx: offW * 0.5, cy: offH * 0.7 }
      ];
      stoneClusters.forEach(cluster => {
        // 巨石陣圓環
        oc.strokeStyle = "rgba(56, 189, 248, 0.25)";
        oc.lineWidth = 2;
        oc.beginPath();
        oc.arc(cluster.cx, cluster.cy, 90, 0, Math.PI * 2);
        oc.stroke();

        // 環繞 5 根巨石柱
        for (let s = 0; s < 5; s++) {
          const ang = (s * Math.PI * 2) / 5;
          const sx = cluster.cx + Math.cos(ang) * 90;
          const sy = cluster.cy + Math.sin(ang) * 90;

          // 巨石陰影
          oc.fillStyle = "rgba(0, 0, 0, 0.5)";
          oc.beginPath();
          oc.ellipse(sx + 4, sy + 10, 16, 7, 0, 0, Math.PI * 2);
          oc.fill();

          // 巨石本體
          oc.fillStyle = "#475569";
          oc.beginPath();
          oc.moveTo(sx - 10, sy + 8);
          oc.lineTo(sx - 8, sy - 28);
          oc.lineTo(sx + 8, sy - 32);
          oc.lineTo(sx + 10, sy + 8);
          oc.closePath();
          oc.fill();

          // 符文發光刻紋 (藍白神聖光暈)
          oc.strokeStyle = "#38bdf8";
          oc.lineWidth = 2;
          oc.beginPath();
          oc.moveTo(sx, sy - 24);
          oc.lineTo(sx, sy - 6);
          oc.stroke();

          const rGrad = oc.createRadialGradient(sx, sy - 14, 2, sx, sy - 14, 45);
          rGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
          rGrad.addColorStop(1, "rgba(0,0,0,0)");
          oc.fillStyle = rGrad;
          oc.beginPath();
          oc.arc(sx, sy - 14, 45, 0, Math.PI * 2);
          oc.fill();
        }
      });

      // 枯死扭曲黑木
      for (let i = 0; i < 40; i++) {
        const tx = rand() * offW, ty = rand() * offH;
        oc.fillStyle = "#1e293b";
        oc.fillRect(tx - 3, ty - 18, 6, 20);
        oc.strokeStyle = "#1e293b";
        oc.lineWidth = 2;
        oc.beginPath();
        oc.moveTo(tx, ty - 16);
        oc.lineTo(tx - 12, ty - 26);
        oc.moveTo(tx, ty - 12);
        oc.lineTo(tx + 14, ty - 22);
        oc.stroke();
      }

    } else if (theme === "catacombs" || theme === "cave") {
      // ========== Act 1 地下墓穴：哥德石磚、刑具鐵鍊、毒霧風口、血祭祭壇 ==========
      const tileSize = 52;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          const noise = (rand() - 0.5) * 12;
          oc.fillStyle = `rgb(${Math.round(24 + noise)},${Math.round(24 + noise)},${Math.round(30 + noise)})`;
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(0, 0, 0, 0.6)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 安達利爾毒霧通風口 (翠綠毒霧光暈)
      for (let i = 0; i < 24; i++) {
        const vx = 80 + rand() * (offW - 160), vy = 80 + rand() * (offH - 160);
        const vGrad = oc.createRadialGradient(vx, vy, 4, vx, vy, 60);
        vGrad.addColorStop(0, "rgba(34, 197, 94, 0.4)");
        vGrad.addColorStop(0.6, "rgba(22, 101, 52, 0.15)");
        vGrad.addColorStop(1, "rgba(0,0,0,0)");
        oc.fillStyle = vGrad;
        oc.beginPath();
        oc.arc(vx, vy, 60, 0, Math.PI * 2);
        oc.fill();

        // 鐵格柵蓋
        oc.strokeStyle = "#334155";
        oc.lineWidth = 2;
        oc.strokeRect(vx - 8, vy - 8, 16, 16);
      }

      // 地下墓穴骨骸與鐵鍊
      for (let i = 0; i < 45; i++) {
        const bx = rand() * offW, by = rand() * offH;
        oc.fillStyle = "#cbd5e1";
        oc.beginPath();
        oc.arc(bx, by, 4, 0, Math.PI * 2);
        oc.fill();
        oc.fillStyle = "#0f172a";
        oc.fillRect(bx - 2, by - 1, 1.5, 2);
        oc.fillRect(bx + 0.5, by - 1, 1.5, 2);
      }

    } else if (theme === "rocky_waste" || theme === "desert") {
      // ========== Act 2 碎石荒野：烈日沙漠波紋、巨型沙蟲骸骨、砂岩遺跡柱 ==========
      for (let i = 0; i < 60; i++) {
        const dx = rand() * offW, dy = rand() * offH, dw = 60 + rand() * 100;
        oc.fillStyle = "rgba(120, 85, 45, 0.28)";
        oc.beginPath();
        oc.ellipse(dx, dy, dw, dw * 0.2, rand() * 0.3, 0, Math.PI * 2);
        oc.fill();
      }

      // 巨型沙蟲與巨獸肋骨
      for (let i = 0; i < 28; i++) {
        const bx = rand() * offW, by = rand() * offH;
        oc.strokeStyle = "#fef08a";
        oc.lineWidth = 3.5;
        oc.beginPath();
        oc.arc(bx, by, 22 + rand() * 12, Math.PI * 0.8, Math.PI * 1.8);
        oc.stroke();
      }

      // 殘破砂岩神殿柱基
      for (let i = 0; i < 30; i++) {
        const px = rand() * offW, py = rand() * offH;
        oc.fillStyle = "#92400e";
        oc.fillRect(px - 10, py - 18, 20, 20);
        oc.fillStyle = "#78350f";
        oc.fillRect(px - 12, py + 2, 24, 6);
      }

    } else if (theme === "ancient_tunnels") {
      // ========== Act 2 遠古通道：地下砂岩古墓磚、古埃及陶甕、石棺 ==========
      const tileSize = 50;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#2b2117" : "#35291d";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(0,0,0,0.5)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 石棺
      for (let i = 0; i < 20; i++) {
        const sx = rand() * offW, sy = rand() * offH;
        oc.fillStyle = "#453223";
        oc.fillRect(sx - 14, sy - 24, 28, 48);
        oc.strokeStyle = "#ca8a04";
        oc.lineWidth = 1.5;
        oc.strokeRect(sx - 12, sy - 22, 24, 44);
      }

    } else if (theme === "tal_rasha_tomb") {
      // ========== Act 2 塔拉夏古墓 (督瑞爾)：皇家暗曜石磚、赫拉迪姆符文、寒冰侵蝕 ==========
      const tileSize = 55;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#21161d" : "#2b1c26";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(234, 179, 8, 0.15)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 督瑞爾寒霜冰環侵蝕
      for (let i = 0; i < 35; i++) {
        const fx = rand() * offW, fy = rand() * offH;
        oc.fillStyle = "rgba(56, 189, 248, 0.18)";
        oc.beginPath();
        oc.ellipse(fx, fy, 35, 18, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

    } else if (theme === "spider_forest" || theme === "dark_forest") {
      // ========== Act 3 蜘蛛森林：庫拉斯特深林沼澤、巨型蛛網、古樹藤蔓 ==========
      for (let i = 0; i < 50; i++) {
        const wx = rand() * offW, wy = rand() * offH;
        oc.fillStyle = "rgba(10, 40, 20, 0.35)";
        oc.beginPath();
        oc.ellipse(wx, wy, 40 + rand() * 60, 25, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

      // 巨型蜘蛛網 (橫跨樹林的白色蛛絲)
      for (let i = 0; i < 28; i++) {
        const webX = rand() * offW, webY = rand() * offH;
        oc.strokeStyle = "rgba(241, 245, 249, 0.35)";
        oc.lineWidth = 1.2;
        oc.beginPath();
        oc.arc(webX, webY, 32, 0, Math.PI * 1.5);
        oc.stroke();
        for (let rad = 0; rad < 6; rad++) {
          const a = (rad * Math.PI) / 3;
          oc.beginPath();
          oc.moveTo(webX, webY);
          oc.lineTo(webX + Math.cos(a) * 32, webY + Math.sin(a) * 32);
          oc.stroke();
        }
      }

      // 扭曲雨林巨樹
      for (let i = 0; i < 50; i++) {
        const tx = rand() * offW, ty = rand() * offH, tr = 22 + rand() * 18;
        oc.fillStyle = "#0f172a";
        oc.fillRect(tx - 4, ty, 8, tr * 0.7);
        oc.fillStyle = "#064e3b";
        oc.beginPath();
        oc.arc(tx, ty, tr, 0, Math.PI * 2);
        oc.fill();
      }

    } else if (theme === "travincal" || theme === "temple") {
      // ========== Act 3 崔凡克議會：薩卡蘭姆神廟大理石地磚、金色鑲邊、受腐蝕噴泉 ==========
      const tileSize = 56;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#272a38" : "#303445";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(245, 158, 11, 0.3)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 議會石柱與神聖火盆
      for (let i = 0; i < 20; i++) {
        const px = rand() * offW, py = rand() * offH;
        oc.fillStyle = "#e2e8f0";
        oc.beginPath();
        oc.arc(px, py, 14, 0, Math.PI * 2);
        oc.fill();
        oc.fillStyle = "#b45309";
        oc.beginPath();
        oc.arc(px, py, 10, 0, Math.PI * 2);
        oc.fill();
      }

    } else if (theme === "durance_of_hate") {
      // ========== Act 3 憎恨囚牢 (墨菲斯托)：血海池沼、血石磚、骨骸王座、電弧柱 ==========
      const tileSize = 52;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#240e15" : "#30131c";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(159, 18, 57, 0.4)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 鮮血運河
      for (let i = 0; i < 3; i++) {
        oc.strokeStyle = "rgba(190, 18, 60, 0.65)";
        oc.lineWidth = 36;
        oc.beginPath();
        let lx = rand() * offW, ly = (i / 3) * offH;
        oc.moveTo(lx, ly);
        for (let s = 0; s < 5; s++) {
          lx += (rand() - 0.5) * 400;
          ly += (rand() - 0.4) * 300;
          oc.lineTo(lx, ly);
        }
        oc.stroke();
      }

    } else if (theme === "plains_of_despair" || theme === "hell") {
      // ========== Act 4 神魔平原：地獄黑曜石荒原、熾熱地核熔岩裂隙、硫磺尖刺 ==========
      for (let i = 0; i < 20; i++) {
        let lx = rand() * offW, ly = rand() * offH;
        oc.strokeStyle = "rgba(239, 68, 68, 0.65)";
        oc.lineWidth = 12;
        oc.beginPath();
        oc.moveTo(lx, ly);
        for (let s = 0; s < 6; s++) {
          lx += (rand() - 0.48) * 80;
          ly += (rand() - 0.48) * 80;
          oc.lineTo(lx, ly);
        }
        oc.stroke();
        oc.strokeStyle = "#fef08a";
        oc.lineWidth = 3;
        oc.stroke();
      }

    } else if (theme === "chaos_sanctuary" || theme === "boss") {
      // ========== Act 4 混沌避難所 (暗黑破壞神)：群魔堡壘黑曜石大殿、巨型五芒星血祭陣、五大封印 ==========
      const tileSize = 60;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#1a080a" : "#240c0f";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(239, 68, 68, 0.35)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 中心震撼巨型血色惡魔召喚五芒星陣 (直徑 480px！)
      const mx = offW / 2, my = offH / 2;
      const mGrad = oc.createRadialGradient(mx, my, 20, mx, my, 260);
      mGrad.addColorStop(0, "rgba(220, 38, 38, 0.55)");
      mGrad.addColorStop(0.6, "rgba(185, 28, 28, 0.25)");
      mGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      oc.fillStyle = mGrad;
      oc.beginPath();
      oc.arc(mx, my, 260, 0, Math.PI * 2);
      oc.fill();

      // 五芒星刻痕
      oc.strokeStyle = "#ef4444";
      oc.lineWidth = 3;
      oc.beginPath();
      for (let p = 0; p < 5; p++) {
        const ang = (p * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = mx + Math.cos(ang) * 190;
        const py = my + Math.sin(ang) * 190;
        if (p === 0) oc.moveTo(px, py);
        else oc.lineTo(px, py);
      }
      oc.closePath();
      oc.stroke();

    } else if (theme === "bloody_foothills" || theme === "snow") {
      // ========== Act 5 血腥丘陵：哈洛加斯凍土、戰壕拒馬、投石機彈坑、雪地血跡 ==========
      for (let i = 0; i < 70; i++) {
        const sx = rand() * offW, sy = rand() * offH, sr = 30 + rand() * 50;
        oc.fillStyle = "rgba(203, 213, 225, 0.2)";
        oc.beginPath();
        oc.ellipse(sx, sy, sr, sr * 0.5, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

      // 雪地血跡
      for (let i = 0; i < 25; i++) {
        const bx = rand() * offW, by = rand() * offH;
        oc.fillStyle = "rgba(185, 28, 28, 0.4)";
        oc.beginPath();
        oc.ellipse(bx, by, 16 + rand() * 20, 10, rand() * Math.PI, 0, Math.PI * 2);
        oc.fill();
      }

      // 戰壕與木拒馬
      for (let i = 0; i < 30; i++) {
        const rx = rand() * offW, ry = rand() * offH;
        oc.fillStyle = "#334155";
        oc.fillRect(rx - 15, ry - 6, 30, 8);
      }

    } else if (theme === "arreat_summit" || theme === "mountain") {
      // ========== Act 5 亞瑞特山頂：山頂冰岩峭壁、遠古三野蠻人黃金雕像、祭壇 ==========
      const tileSize = 60;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#1b1f29" : "#242938";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(148, 163, 184, 0.2)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 遠古三野蠻人雕像 (科力克、塔力克、馬道克)
      const summitCenter = { x: offW / 2, y: offH / 2 };
      const ancients = [
        { x: summitCenter.x - 120, y: summitCenter.y - 40, name: "科力克" },
        { x: summitCenter.x, y: summitCenter.y - 100, name: "塔力克" },
        { x: summitCenter.x + 120, y: summitCenter.y - 40, name: "馬道克" }
      ];
      ancients.forEach(anc => {
        // 黃金雕像底座
        oc.fillStyle = "#78350f";
        oc.fillRect(anc.x - 18, anc.y, 36, 16);
        // 黃金雕像身形
        oc.fillStyle = "#eab308";
        oc.beginPath();
        oc.arc(anc.x, anc.y - 20, 16, 0, Math.PI * 2);
        oc.fill();
        oc.strokeStyle = "#fef08a";
        oc.lineWidth = 2;
        oc.stroke();
      });

    } else if (theme === "worldstone_chamber") {
      // ========== Act 5 世界之石大殿 (巴爾)：毀滅水晶王座、腐蝕觸鬚、虛空裂痕 ==========
      const tileSize = 55;
      const cols = Math.ceil(offW / tileSize);
      const rows = Math.ceil(offH / tileSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = c * tileSize, ty = r * tileSize;
          oc.fillStyle = (rand() < 0.5) ? "#1f0b18" : "#2b1022";
          oc.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          oc.strokeStyle = "rgba(217, 70, 239, 0.25)";
          oc.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // 世界之石深紅晶體核心光芒 (巨大深紅發光水晶)
      const cx = offW / 2, cy = 180;
      const cGrad = oc.createRadialGradient(cx, cy, 30, cx, cy, 350);
      cGrad.addColorStop(0, "rgba(225, 29, 72, 0.7)");
      cGrad.addColorStop(0.5, "rgba(159, 18, 57, 0.3)");
      cGrad.addColorStop(1, "rgba(0,0,0,0)");
      oc.fillStyle = cGrad;
      oc.beginPath();
      oc.arc(cx, cy, 350, 0, Math.PI * 2);
      oc.fill();

    } else if (theme === "cow_level") {
      // ========== 秘密母牛關卡：翠綠農場草地、木圍欄、乾草堆 ==========
      for (let i = 0; i < 80; i++) {
        const fx = rand() * offW, fy = rand() * offH;
        oc.fillStyle = "#ca8a04";
        oc.fillRect(fx - 12, fy - 8, 24, 16);
      }
    } else {
      // 預設荒野
      for (let i = 0; i < 100; i++) {
        const gx = rand() * offW, gy = rand() * offH;
        oc.fillStyle = "rgba(40, 50, 40, 0.3)";
        oc.beginPath();
        oc.arc(gx, gy, 20, 0, Math.PI * 2);
        oc.fill();
      }
    }

    window._terrainCache = offCanvas;
  }

  // 繪製生成好的世界高畫質地表
  if (window._terrainCache) {
    ctx.drawImage(window._terrainCache, -camX, -camY, WORLD_WIDTH, WORLD_HEIGHT);
  }

  // --- 3. 動態環境光影粒子特效 (每幀賦予戰場氛圍) ---
  const time = Date.now() * 0.001;
  if (theme === "chaos_sanctuary" || theme === "plains_of_despair" || theme === "boss") {
    // 混沌避難所升騰火星
    for (let i = 0; i < 18; i++) {
      const fx = ((Math.sin(time * 0.4 + i * 1.7) * 0.5 + 0.5) * cw);
      const fy = (ch - ((time * 45 + i * 75) % ch));
      ctx.fillStyle = `rgba(251, 146, 60, ${0.4 + Math.sin(time * 2 + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === "bloody_foothills" || theme === "arreat_summit" || theme === "snow") {
    // 亞瑞特暴風雪飄雪
    for (let i = 0; i < 24; i++) {
      const sx = ((Math.cos(time * 0.5 + i * 2.1) * 0.5 + 0.5) * cw) + Math.sin(time + i) * 20;
      const sy = ((time * 60 + i * 45) % ch);
      ctx.fillStyle = "rgba(241, 245, 249, 0.65)";
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === "catacombs" || theme === "blood_moor") {
    // 羅格荒地飄落血霧微塵
    for (let i = 0; i < 10; i++) {
      const mx = ((Math.sin(time * 0.3 + i * 1.5) * 0.5 + 0.5) * cw);
      const my = ((time * 30 + i * 50) % ch);
      ctx.fillStyle = "rgba(225, 29, 72, 0.35)";
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

window.renderRadar = renderRadar;
