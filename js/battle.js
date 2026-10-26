// js/battle.js - 擬真戰場主迴圈、幽靈攻擊隔離、防重疊計時器與死亡懲罰修復版

function getCurrentWeightPercent() {
  if (!currentChar) return 0;
  let currentWeight = 0;

  if (currentChar.inventory) {
    currentChar.inventory.forEach(item => {
      const dbItem = (typeof DB !== 'undefined' && DB.items) ? DB.items[item.name] : null;
      if (dbItem) currentWeight += (dbItem.weight || 0.1) * (item.count || 1);
    });
  }

  if (currentChar.equipped) {
    Object.values(currentChar.equipped).forEach(eq => {
      if (eq && typeof DB !== 'undefined' && DB.items && DB.items[eq.name]) {
        currentWeight += (DB.items[eq.name].weight || 1);
      }
    });
  }

  const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { str: 10, con: 10 });
  let maxWeight = ((stats.str || 10) * 150) + ((stats.con || 10) * 50);

  if (currentChar.equipped) {
    Object.values(currentChar.equipped).forEach(eq => {
      if (eq && typeof DB !== 'undefined' && DB.items && DB.items[eq.name]?.weightMultiplier) {
        maxWeight *= DB.items[eq.name].weightMultiplier;
      }
    });
  }

  return Math.floor((currentWeight / Math.max(1, maxWeight)) * 100);
}

// 掛機開關
function toggleLoop() {
  if (!currentChar) {
    alert("⚠️ 請先選擇角色進入遊戲！");
    return;
  }

  if (gameState.botStatus === "running" || gameState.botStatus === "finishing") {
    stopLoop();
  } else {
    startLoop();
  }
}
window.toggleLoop = toggleLoop;

function startLoop() {
  gameState.isRunning = true;
  gameState.botStatus = "running";

  const btn = document.getElementById("toggle-btn");
  if (btn) {
    btn.innerText = "⏹ 停止掛機";
    btn.className = "btn btn-danger";
    btn.onclick = toggleLoop;
  }

  const tag = document.getElementById("battle-mode-tag");
  if (tag) {
    tag.innerText = "[野外巡航中]";
  }

  log("▶ 啟動掛機！角色開始主動索敵巡邏...", "sys");

  ensureWorldTickTimer();

  if (!gameState.cloudSaveTimer) {
    gameState.cloudSaveTimer = setInterval(() => {
      if (typeof saveAccountData === 'function') saveAccountData();
    }, 15000);
  }

  // 若已經在野外，直接原地開始尋敵打怪，不執行村莊補給流水線
  if (!gameState.inVillage) {
    return;
  }

  if (typeof executeStartupPipelineSOP === "function") {
    executeStartupPipelineSOP();
  } else if (typeof executeRestockProcedure === "function") {
    executeRestockProcedure();
  } else {
    exitVillageToField();
  }
}
window.startLoop = startLoop;

function stopLoop() {
  const btn = document.getElementById("toggle-btn");
  if (btn) {
    btn.className = "btn btn-success";
    btn.innerText = "▶ 開始掛機迴圈";
  }

  if (gameState.targetMob && gameState.targetMob.currentHp > 0 && !gameState.targetMob.isDead && !gameState.inVillage) {
    gameState.botStatus = "finishing";
    gameState.isRunning = false;

    const tag = document.getElementById("battle-mode-tag");
    if (tag) tag.innerText = "[收尾戰鬥中...]";
    log(`⏹ 已發出停止指令！角色將消滅眼前的【${gameState.targetMob.name}】後進入待機狀態。`, "sys");
  } else {
    gameState.botStatus = gameState.inVillage ? "village" : "idle";
    gameState.isRunning = false;
    gameState.targetMob = null;

    const tag = document.getElementById("battle-mode-tag");
    if (tag) tag.innerText = gameState.inVillage ? "[村莊休整中]" : "[野外待機中]";
    log("⏹ 已停止掛機，角色進入原地待機防禦狀態 (怪物仍會主動攻擊，請注意安全)！", "sys");
  }

  ensureWorldTickTimer();
  if (typeof saveAccountData === 'function') saveAccountData();
}
window.stopLoop = stopLoop;

// 計時器生命週期管理：確保計時器單一實例，防止多重加速
function stopWorldTickTimer() {
  if (gameState.loopTimer) {
    clearInterval(gameState.loopTimer);
    gameState.loopTimer = null;
  }
}
window.stopWorldTickTimer = stopWorldTickTimer;

function ensureWorldTickTimer() {
  if (!gameState.loopTimer) {
    gameState.loopTimer = setInterval(gameTick, 100);
  }
}

function initGameUI() {
  canvas = document.getElementById("gameCanvas");
  if (canvas) {
    canvas.width = 960;
    canvas.height = 540;
    ctx = canvas.getContext("2d");
  }

  const mapSelect = document.getElementById("map-select");
  if (mapSelect && gameState.currentMap) {
    mapSelect.value = gameState.currentMap;
  }

  const btn = document.getElementById("toggle-btn");
  if (btn) {
    btn.innerText = (gameState.botStatus === "running") ? "⏹ 停止掛機" : "▶ 開始掛機迴圈";
    btn.className = (gameState.botStatus === "running") ? "btn btn-danger" : "btn btn-success";
    btn.onclick = toggleLoop;
  }

  const tag = document.getElementById("battle-mode-tag");
  if (tag) {
    tag.innerText = (gameState.botStatus === "running") ? "[野外巡航中]" : (gameState.inVillage ? "[村莊休整中]" : "[野外待機中]");
  }

  if (!gameState.botStatus) {
    gameState.botStatus = gameState.inVillage ? "village" : "idle";
  }

  ensureWorldTickTimer();

  updateLeftPanel();
  if (typeof renderCharTab === "function") renderCharTab();
  if (typeof renderInventoryTab === "function") renderInventoryTab();
  if (typeof renderVillageTab === "function") renderVillageTab();
  if (typeof renderStrategyTab === "function") renderStrategyTab();

  if (typeof switchTab === "function") switchTab("battle");
  if (typeof renderRadar === "function") renderRadar();

  log("歡迎回到亞丁大陸，準備好展開冒險！", "sys");
}

function updateLeftPanel() {
  if (!currentChar) return;

  const classTag = document.getElementById("pl-class-tag");
  if (classTag) {
    const className = (typeof resolveClassPreset === 'function' ? resolveClassPreset(currentChar.charClass)?.name : null)
      || (typeof ADEN_CLASS_DATA !== 'undefined' ? ADEN_CLASS_DATA[currentChar.charClass]?.name : null)
      || currentChar.charClass;
    classTag.innerText = className;
  }

  const plLv = document.getElementById("pl-lv");
  if (plLv) plLv.innerText = `Lv.${currentChar.level || 1}`;

  const plGold = document.getElementById("pl-gold");
  if (plGold) plGold.innerText = (currentChar.gold || 0).toLocaleString();

  const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { str: 10, dex: 10, con: 10, int: 10, wis: 10 });
  const maxHp = (currentChar.maxHp || 50) + (stats.hpBonus || 0);
  const maxMp = (currentChar.maxMp || 20) + (stats.mpBonus || 0);
  const curHp = currentChar.hp !== undefined ? currentChar.hp : maxHp;
  const curMp = currentChar.mp !== undefined ? currentChar.mp : maxMp;

  const hpPercent = Math.max(0, Math.min(100, (curHp / Math.max(1, maxHp)) * 100));
  const mpPercent = Math.max(0, Math.min(100, (curMp / Math.max(1, maxMp)) * 100));

  const hpFill = document.getElementById("bar-hp-fill");
  if (hpFill) hpFill.style.width = hpPercent + "%";
  const hpText = document.getElementById("bar-hp-text");
  if (hpText) hpText.innerText = `HP ${curHp} / ${maxHp}`;

  const mpFill = document.getElementById("bar-mp-fill");
  if (mpFill) mpFill.style.width = mpPercent + "%";
  const mpText = document.getElementById("bar-mp-text");
  if (mpText) mpText.innerText = `MP ${curMp} / ${maxMp}`;

  const curLv = currentChar.level || 1;
  const maxExp = curLv * curLv * 100;
  const curExp = currentChar.exp || 0;
  const expPercent = Math.min(100, (curExp / Math.max(1, maxExp)) * 100).toFixed(2);
  const expFill = document.getElementById("bar-exp-fill");
  if (expFill) expFill.style.width = expPercent + "%";
  const expText = document.getElementById("bar-exp-text");
  if (expText) expText.innerText = `EXP ${expPercent}%`;

  const weightPercent = getCurrentWeightPercent();
  const wFill = document.getElementById("bar-weight-fill");
  const wText = document.getElementById("bar-weight-text");
  if (wFill) {
    wFill.style.width = Math.min(100, weightPercent) + "%";
    if (weightPercent >= 82) wFill.style.backgroundColor = "#ef4444";
    else if (weightPercent >= 50) wFill.style.backgroundColor = "#f59e0b";
    else wFill.style.backgroundColor = "#3b82f6";
  }
  if (wText) {
    wText.innerText = `負重: ${weightPercent}% ${weightPercent >= 82 ? '(過重無法攻擊)' : ''}`;
  }

  let totalAc = 10 - Math.floor(((stats.dex || 10) - 10) / 2);
  if (currentChar.equipped) {
    Object.values(currentChar.equipped).forEach(eq => {
      if (eq && typeof DB !== 'undefined' && DB.items && DB.items[eq.name]) {
        const it = DB.items[eq.name];
        if (it.ac !== undefined) totalAc += (it.ac - (eq.enchant || 0));
      }
    });
  }
  const statAc = document.getElementById("stat-ac");
  if (statAc) statAc.innerText = `${totalAc} (MR: ${stats.mr || 0}%)`;

  const wpn = currentChar.equipped?.weapon;
  const wpnData = (wpn && typeof DB !== 'undefined' && DB.items) ? DB.items[wpn.name] : null;
  const isBow = wpnData && wpnData.weaponType === "bow";

  let hit = isBow
    ? Math.floor((stats.dex || 10) / 2) + Math.floor(curLv / 2)
    : Math.floor((stats.str || 10) / 2) + Math.floor(curLv / 2);

  let dmg = isBow
    ? Math.max(0, (stats.dex || 10) - 10)
    : Math.max(0, (stats.str || 10) - 10);

  if (currentChar.equipped) {
    Object.values(currentChar.equipped).forEach(eq => {
      if (eq && eq !== wpn && DB.items && DB.items[eq.name]) {
        const it = DB.items[eq.name];
        if (it.hitBonus) hit += it.hitBonus;
        if (it.extraDmg) dmg += it.extraDmg;
      }
    });
  }

  const eqWpn = document.getElementById("eq-summary-wpn");
  if (wpnData) {
    hit += (wpnData.hitBonus || 0) + (wpn.enchant || 0);
    dmg += (wpnData.extraDmg || 0) + (wpn.enchant || 0);
    if (eqWpn) eqWpn.innerText = `+${wpn.enchant} ${wpn.name}`;
  } else {
    if (eqWpn) eqWpn.innerText = "空手";
  }
  const hitDmg = document.getElementById("stat-hit-dmg");
  if (hitDmg) hitDmg.innerText = `+${hit} / +${dmg}`;

  const poly = (typeof DB !== 'undefined' && DB.polymorphs && DB.polymorphs.find(p => p.name === currentChar.polymorph)) || ((typeof DB !== 'undefined' && DB.polymorphs) ? DB.polymorphs[0] : { speedInterval: 1200 });
  let interval = poly.speedInterval;
  if (currentChar.buffs && currentChar.buffs.green > 0) interval = Math.floor(interval * 0.75);
  if (currentChar.buffs && currentChar.buffs.brave > 0) interval = Math.floor(interval * 0.85);
  const statSpd = document.getElementById("stat-speed");
  if (statSpd) statSpd.innerText = (interval / 1000).toFixed(2) + " 秒/次";

  const arrowItem = currentChar.inventory ? currentChar.inventory.find(i => i.name === "箭") : null;
  const silverArrowItem = currentChar.inventory ? currentChar.inventory.find(i => i.name === "銀箭") : null;
  const arrowCount = arrowItem ? arrowItem.count : 0;
  const silverCount = silverArrowItem ? silverArrowItem.count : 0;
  const statArr = document.getElementById("stat-arrows");
  if (statArr) statArr.innerText = `普:${arrowCount} / 銀:${silverCount}`;

  const statLoc = document.getElementById("stat-location");
  if (statLoc) {
    const curMap = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap] : ((typeof DB !== 'undefined' && DB.maps) ? DB.maps["talking_island"] : null);
    statLoc.innerText = gameState.inVillage
      ? (typeof DB !== 'undefined' && DB.villages && DB.villages[gameState.viewingVillage]?.name || "村莊")
      : (curMap?.name || "未知獵場");
  }

  const armorsCount = Object.keys(currentChar.equipped || {}).filter(k => k !== "weapon" && currentChar.equipped[k]).length;
  const eqArmors = document.getElementById("eq-summary-armors");
  if (eqArmors) eqArmors.innerText = `${armorsCount} 件`;

  const buffTexts = [];
  if (currentChar.buffs && currentChar.buffs.green > 0) buffTexts.push(`綠水(${currentChar.buffs.green}s)`);
  if (currentChar.buffs && currentChar.buffs.brave > 0) buffTexts.push(`勇水(${currentChar.buffs.brave}s)`);
  const statBuffs = document.getElementById("stat-buffs");
  if (statBuffs) statBuffs.innerText = buffTexts.length > 0 ? buffTexts.join(" ") : "無";

  const surroundInfo = document.getElementById("stat-surround-info");
  if (surroundInfo) {
    surroundInfo.innerText = `${gameState.surroundingMobs || 0} 隻 / ${gameState.targetMob ? gameState.targetMob.name : "無"}`;
  }
}
window.updateLeftPanel = updateLeftPanel;

function exitVillageToField() {
  const mapSelect = document.getElementById("map-select");
  const selectedMap = mapSelect ? mapSelect.value : gameState.currentMap;
  if (gameState.currentMap !== selectedMap) {
    gameState.currentMap = selectedMap;
    initWorldMobs();
    log(`正式前往獵場：${(typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap] || { name: "獵場" }).name}！`, "sys");
  }

  gameState.inVillage = false;
  gameState.isRestocking = false;
  gameState.playerX = 600 + Math.random() * 800;
  gameState.playerY = 400 + Math.random() * 600;

  ensureWorldTickTimer();
  const tag = document.getElementById("battle-mode-tag");
  if (tag) tag.innerText = (gameState.botStatus === "running") ? "[野外巡航中]" : "[野外待機中]";
  updateLeftPanel();
  if (typeof renderRadar === "function") renderRadar();
}

// 完善死亡流程：掉落經驗值懲罰與自動續掛判定
function handlePlayerDeath(killerMob) {
  gameState.deathCount = (gameState.deathCount || 0) + 1;
  const curLv = currentChar.level || 1;
  const maxExp = curLv * curLv * 100;
  const lostExp = Math.floor(maxExp * 0.05); // 扣除當前等級 5% 經驗值

  currentChar.exp = Math.max(0, (currentChar.exp || 0) - lostExp);
  log(`💀 體力不支倒下！已被【${killerMob ? killerMob.name : "未知怪物"}】擊敗！失去 ${lostExp} 點經驗值 (5%)。`, "mob");

  // 回復 30% 生命值送回村莊安全區
  currentChar.hp = Math.floor(currentChar.maxHp * 0.3);

  const maxLimit = gameState.botSettings?.maxDeathLimit || 3;
  if (gameState.deathCount >= maxLimit) {
    log(`🛑 今日累積死亡已達 ${gameState.deathCount}/${maxLimit} 次上限！已自動停止掛機，留置村莊安全區。`, "sys");
    flyBackToVillage();
  } else {
    log(`⚠️ 角色於神殿復活 (累計死亡 ${gameState.deathCount}/${maxLimit} 次)！正在安全區補血整備...`, "sys");
    flyBackToVillage();

    // 依規格書：若掛機啟動中且未達上限，在村莊補滿血後自動重返戰場
    if (gameState.isRunning) {
      setTimeout(() => {
        if (!currentChar) return;
        currentChar.hp = currentChar.maxHp;
        log("✨ 體力已在神殿完全恢復！自動重返獵場繼續巡航掛機！", "sys");
        exitVillageToField();
      }, 3000);
    }
  }
}

function flyBackToVillage() {
  gameState.inVillage = true;
  gameState.botStatus = "village";
  gameState.targetMob = null;
  gameState.surroundingMobs = 0;
  if (Array.isArray(gameState.mobs)) {
    gameState.mobs.forEach(m => m.isAggroed = false);
  }

  const btn = document.getElementById("toggle-btn");
  if (btn) {
    btn.className = "btn btn-success";
    btn.innerText = "▶ 開始掛機迴圈";
  }
  const tag = document.getElementById("battle-mode-tag");
  if (tag) tag.innerText = "[村莊休整中]";

  log("已回到村莊安全區休整。", "sys");
  updateLeftPanel();
  if (typeof renderRadar === "function") renderRadar();
}

function gameTick() {
  if (!currentChar) return;

  if (Math.random() < 0.1) {
    if (currentChar.buffs && currentChar.buffs.green > 0) currentChar.buffs.green--;
    if (currentChar.buffs && currentChar.buffs.brave > 0) currentChar.buffs.brave--;
  }

  if (gameState.inVillage && gameState.isRestocking) {
    if (typeof executeRestockProcedure === "function") executeRestockProcedure();
    return;
  }

  if (typeof handleStrategyAI === "function") handleStrategyAI();
  if (gameState.inVillage) return;

  // 處理怪物重生佇列（小怪 10 秒 / Boss 30 分鐘冷卻）
  processRespawnQueue();

  updateWorldMobsBehavior();

  handlePlayerMovementAndCombat();

  if (typeof renderRadar === "function") renderRadar();
  updateLeftPanel();
}

// 怪物重生冷卻佇列
if (!gameState.respawnQueue) {
  gameState.respawnQueue = [];
}

function processRespawnQueue() {
  if (!gameState.respawnQueue || gameState.respawnQueue.length === 0) return;
  const cfg = getMapConfig(gameState.currentMap);
  const now = Date.now();

  // 若場上怪物已達到上限，暫緩生成
  if (gameState.mobs.length >= cfg.totalMobs) return;

  for (let i = 0; i < gameState.respawnQueue.length; i++) {
    const item = gameState.respawnQueue[i];
    if (gameState.mobs.length >= cfg.totalMobs) break;

    // 檢查地圖是否一致以及冷卻時間是否到達
    if (item.mapId === gameState.currentMap && now >= item.respawnTime) {
      spawnSingleMonster(item.template);
      gameState.respawnQueue.splice(i, 1);
      i--;
    }
  }
}

function initWorldMobs() {
  gameState.mobs = [];
  gameState.targetMob = null;
  gameState.respawnQueue = []; // 清空前一張地圖的重生佇列

  if (typeof DB !== 'undefined' && DB.maps && !DB.maps[gameState.currentMap]) {
    gameState.currentMap = "talking_island";
  }

  const cfg = getMapConfig(gameState.currentMap);
  const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap] : ((typeof DB !== 'undefined' && DB.maps) ? DB.maps["talking_island"] : null);
  if (!mapData || !mapData.monsters || mapData.monsters.length === 0) return;

  // 依照每一種怪物設定的指定數量，精準生成到地圖上
  mapData.monsters.forEach(tmpl => {
    const isBoss = tmpl.isBoss || BOSS_NAMES.includes(tmpl.name);
    const targetCount = (cfg.speciesCounts && cfg.speciesCounts[tmpl.name] !== undefined)
      ? cfg.speciesCounts[tmpl.name]
      : (isBoss ? 1 : 8);

    for (let i = 0; i < targetCount; i++) {
      spawnSingleMonster(tmpl);
    }
  });
}

function spawnSingleMonster(template) {
  if (!template) return;

  const angle = Math.random() * Math.PI * 2;
  const spawnDist = 180 + Math.random() * 320;

  if (isNaN(gameState.playerX)) gameState.playerX = 1200;
  if (isNaN(gameState.playerY)) gameState.playerY = 800;

  const finalX = Math.max(60, Math.min(WORLD_WIDTH - 60, gameState.playerX + Math.cos(angle) * spawnDist));
  const finalY = Math.max(60, Math.min(WORLD_HEIGHT - 60, gameState.playerY + Math.sin(angle) * spawnDist));

  const isBossMob = template.isBoss || BOSS_NAMES.includes(template.name);
  const mob = {
    ...template,
    id: Math.random().toString(36).substr(2, 9),
    currentHp: template.hp,
    x: finalX,
    y: finalY,
    isBoss: isBossMob,
    isAggroed: false,
    isDead: false,
    wanderTarget: { x: finalX, y: finalY },
    lastWanderTime: Date.now()
  };
  gameState.mobs.push(mob);

  if (isBossMob) {
    log(`⚠️【首領降臨】${template.name} 已現身於獵場中！`, "sys");
  }
}

// 怪物行為更新：嚴格隔離已死亡怪物的幽靈反擊
function updateWorldMobsBehavior() {
  const now = Date.now();
  gameState.mobs.forEach(mob => {
    // 🚨 幽靈防護：若怪物已死亡或 HP 歸零，立刻停止一切移動與攻擊！
    if (mob.isDead || mob.currentHp <= 0) return;

    const distToPlayer = Math.hypot(mob.x - gameState.playerX, mob.y - gameState.playerY);

    if (mob.aggressive && distToPlayer <= 180) mob.isAggroed = true;

    if (mob.isAggroed) {
      if (distToPlayer > 30) {
        mob.x += ((gameState.playerX - mob.x) / distToPlayer) * 2.0;
        mob.y += ((gameState.playerY - mob.y) / distToPlayer) * 2.0;
      } else {
        if (Math.random() < 0.12) {
          const mobDmg = Math.max(1, Math.floor(mob.level * 1.6 - (10 - currentChar.ac) * 0.45));
          currentChar.hp = Math.max(0, currentChar.hp - mobDmg);
          log(`${mob.name} 攻擊命中！受到 ${mobDmg} 點傷害。`, "mob");
          if (currentChar.hp <= 0) {
            handlePlayerDeath(mob);
          }
        }
      }
    } else {
      if (now - mob.lastWanderTime > 3500 + Math.random() * 2500) {
        mob.lastWanderTime = now;
        mob.wanderTarget = {
          x: Math.max(50, Math.min(WORLD_WIDTH - 50, mob.x + (Math.random() * 140 - 70))),
          y: Math.max(50, Math.min(WORLD_HEIGHT - 50, mob.y + (Math.random() * 140 - 70)))
        };
      }
      const distToWander = Math.hypot(mob.wanderTarget.x - mob.x, mob.wanderTarget.y - mob.y);
      if (distToWander > 5) {
        mob.x += ((mob.wanderTarget.x - mob.x) / distToWander) * 0.7;
        mob.y += ((mob.wanderTarget.y - mob.y) / distToWander) * 0.7;
      }
    }
  });

  gameState.surroundingMobs = gameState.mobs.filter(m =>
    !m.isDead && m.currentHp > 0 && m.isAggroed && Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) <= 45
  ).length;
}

function handlePlayerMovementAndCombat() {
  const now = Date.now();
  const poly = (typeof DB !== 'undefined' && DB.polymorphs && DB.polymorphs.find(p => p.name === currentChar.polymorph)) || ((typeof DB !== 'undefined' && DB.polymorphs) ? DB.polymorphs[0] : { speedInterval: 1200 });
  let attackInterval = poly.speedInterval;
  if (currentChar.buffs && currentChar.buffs.green > 0) attackInterval *= 0.75;
  if (currentChar.buffs && currentChar.buffs.brave > 0) attackInterval *= 0.85;

  const wpn = currentChar.equipped?.weapon;
  const wpnData = (wpn && typeof DB !== 'undefined' && DB.items) ? DB.items[wpn.name] : null;
  const isBow = wpnData && wpnData.weaponType === "bow";
  const attackRange = isBow ? 190 : 32;

  // 目標死亡或已移出陣列時，立即清空鎖定，防止鞭屍
  if (gameState.targetMob && (!gameState.mobs.includes(gameState.targetMob) || gameState.targetMob.isDead || gameState.targetMob.currentHp <= 0)) {
    gameState.targetMob = null;
  }

  // 狀態 A：收尾戰鬥中 (打完眼前怪就待機)
  if (gameState.botStatus === "finishing") {
    if (!gameState.targetMob) {
      gameState.botStatus = "idle";
      const tag = document.getElementById("battle-mode-tag");
      if (tag) tag.innerText = "[野外待機中]";
      log("✅ 當前目標已消滅，正式進入野外待機防禦狀態。", "sys");
      return;
    }
  }

  // 狀態 B：野外待機中 (原地不動，不主動尋怪)
  if (gameState.botStatus === "idle") {
    gameState.targetMob = null;
    gameState.patrolTarget = null;
    return;
  }

  // 狀態 C：掛機巡航中 (主動尋敵)
  if (gameState.botStatus === "running" && !gameState.targetMob) {
    const priorityElem = document.getElementById("cfg-target-priority");
    const priority = priorityElem ? priorityElem.value : "nearest";
    // 嚴格只篩選存活且未死亡的怪物
    let candidates = gameState.mobs.filter(m => !m.isDead && m.currentHp > 0 && Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) < 550);

    if (candidates.length > 0) {
      if (priority === "aggressive_first") {
        candidates.sort((a, b) => (b.aggressive ? 1 : 0) - (a.aggressive ? 1 : 0));
      } else if (priority === "passive_first") {
        candidates.sort((a, b) => (a.aggressive ? 1 : 0) - (b.aggressive ? 1 : 0));
      } else {
        candidates.sort((a, b) => Math.hypot(a.x - gameState.playerX, a.y - gameState.playerY) - Math.hypot(b.x - gameState.playerX, b.y - gameState.playerY));
      }
      gameState.targetMob = candidates[0];
    }
  }

  if (gameState.targetMob) {
    const target = gameState.targetMob;
    const dist = Math.hypot(target.x - gameState.playerX, target.y - gameState.playerY);

    // 🎮 RO 順序 4：依攻擊技能清單順序優先判定施放
    if (now - gameState.lastAttackTime >= attackInterval) {
      const skillRes = checkAndExecuteAutoSkillAttack(target, dist, now);
      if (skillRes === true) {
        gameState.lastAttackTime = now;
        return;
      } else if (skillRes === "moving") {
        gameState.playerX += ((target.x - gameState.playerX) / dist) * 2.6;
        gameState.playerY += ((target.y - gameState.playerY) / dist) * 2.6;
        return;
      }
    }

    // 🎮 RO 順序 5：若無符合技能或 MP 不足 / CD 中，回退普通物理攻擊 (射箭/揮砍)
    if (dist > attackRange) {
      gameState.playerX += ((target.x - gameState.playerX) / dist) * 2.6;
      gameState.playerY += ((target.y - gameState.playerY) / dist) * 2.6;
    } else {
      if (now - gameState.lastAttackTime >= attackInterval) {
        gameState.lastAttackTime = now;
        executePlayerAttack(target, isBow, wpnData);
      }
    }
  } else if (gameState.botStatus === "running") {
    if (!gameState.patrolTarget || Math.hypot(gameState.patrolTarget.x - gameState.playerX, gameState.patrolTarget.y - gameState.playerY) < 20) {
      gameState.patrolTarget = {
        x: Math.max(100, Math.min(WORLD_WIDTH - 100, gameState.playerX + (Math.random() * 400 - 200))),
        y: Math.max(100, Math.min(WORLD_HEIGHT - 100, gameState.playerY + (Math.random() * 400 - 200)))
      };
    }
    const pDist = Math.hypot(gameState.patrolTarget.x - gameState.playerX, gameState.patrolTarget.y - gameState.playerY);
    if (pDist > 5) {
      gameState.playerX += ((gameState.patrolTarget.x - gameState.playerX) / pDist) * 1.8;
      gameState.playerY += ((gameState.patrolTarget.y - gameState.playerY) / pDist) * 1.8;
    }
  }
}

// 執行攻擊與掉寶 (加入 isDead 瞬時鎖定)
function executePlayerAttack(mob, isBow, wpnData) {
  if (mob.isDead || mob.currentHp <= 0) return;

  const weightPercent = getCurrentWeightPercent();
  if (weightPercent >= 82) {
    if (Math.random() < 0.25) {
      log(`⚠️ 背包負重達 ${weightPercent}%！嚴重超重無法攻擊！`, "mob");
    }
    return;
  }

  const wpn = currentChar.equipped?.weapon;
  let isSilverArrow = false;

  if (isBow) {
    let arrowIdx = currentChar.inventory ? currentChar.inventory.findIndex(i => i.name === "銀箭" && (i.count || 0) > 0) : -1;
    if (arrowIdx !== -1) {
      isSilverArrow = true;
    } else {
      arrowIdx = currentChar.inventory ? currentChar.inventory.findIndex(i => i.name === "箭" && (i.count || 0) > 0) : -1;
    }

    if (arrowIdx === -1) {
      if (Math.random() < 0.2) log("⚠️ 箭矢已用盡！請回城補給箭矢！", "mob");
      return;
    }

    currentChar.inventory[arrowIdx].count--;
    const remainArrows = currentChar.inventory[arrowIdx].count;
    const arrowUsedName = currentChar.inventory[arrowIdx].name;

    if (remainArrows <= 0) currentChar.inventory.splice(arrowIdx, 1);

    gameState.arrowTrail = {
      fromX: gameState.playerX,
      fromY: gameState.playerY,
      toX: mob.x,
      toY: mob.y,
      expire: Date.now() + 150
    };

    mob.isAggroed = true;

    const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { dex: 10 });
    const curLv = currentChar.level || 1;
    const hitRating = Math.floor((stats.dex || 10) / 2) + Math.floor(curLv / 2) + (wpnData ? wpnData.hitBonus || 0 : 0) + (wpn ? wpn.enchant || 0 : 0);
    const hitRate = Math.min(0.95, Math.max(0.5, 0.85 + (hitRating - (10 - mob.ac)) * 0.005));

    if (Math.random() > hitRate) {
      log(`🏹 射出 ${arrowUsedName}，但被 ${mob.name} 閃過！`, "atk");
      return;
    }

    const diceMax = (mob.size === "large") ? (wpnData ? wpnData.large : 3) : (wpnData ? wpnData.small : 3);
    let baseDmg = Math.floor(Math.random() * diceMax) + 1;
    baseDmg += (wpn ? wpn.enchant : 0) + (wpnData ? wpnData.extraDmg || 0 : 0) + Math.max(0, (stats.dex || 10) - 10);

    if (mob.undead && isSilverArrow) {
      const holyBonus = Math.floor(Math.random() * 20) + 1;
      baseDmg += holyBonus;
      log(`🏹 射出【銀箭】！神聖破邪對不死系 ${mob.name} 附加 +${holyBonus} 傷害！`, "atk");
    }

    const acReduction = 150 / (150 + Math.max(0, -mob.ac));
    const finalDmg = Math.max(1, Math.floor(baseDmg * acReduction));

    mob.currentHp -= finalDmg;
    log(`箭矢破空命中 ${mob.name}，造成 ${finalDmg} 點傷害！`, "atk");

    // 傷害飄字
    if (!gameState.floatingTexts) gameState.floatingTexts = [];
    gameState.floatingTexts.push({
      text: `-${finalDmg}`,
      color: "#fbbf24",
      x: mob.x,
      y: mob.y - 10,
      expire: Date.now() + 800
    });
  } else {
    // ⚔️ 近戰近身揮砍打擊
    mob.isAggroed = true;
    const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { str: 10 });
    const curLv = currentChar.level || 1;
    const hitRating = Math.floor((stats.str || 10) / 2) + Math.floor(curLv / 2) + (wpnData ? wpnData.hitBonus || 0 : 0) + (wpn ? wpn.enchant || 0 : 0);
    const hitRate = Math.min(0.95, Math.max(0.5, 0.85 + (hitRating - (10 - mob.ac)) * 0.005));

    if (Math.random() > hitRate) {
      log(`⚔️ 揮劍攻擊，但被 ${mob.name} 招架閃過！`, "atk");
      return;
    }

    const diceMax = (mob.size === "large") ? (wpnData ? wpnData.large : 4) : (wpnData ? wpnData.small : 4);
    let baseDmg = Math.floor(Math.random() * diceMax) + 1;
    baseDmg += (wpn ? wpn.enchant : 0) + (wpnData ? wpnData.extraDmg || 0 : 0) + Math.max(0, (stats.str || 10) - 10);

    const acReduction = 150 / (150 + Math.max(0, -mob.ac));
    const finalDmg = Math.max(1, Math.floor(baseDmg * acReduction));

    mob.currentHp -= finalDmg;
    log(`⚔️ 揮舞 ${wpn ? wpn.name : '武器'} 砍向 ${mob.name}，造成 ${finalDmg} 點傷害！`, "atk");

    // 斬擊光弧特效與飄字
    if (!gameState.combatEffects) gameState.combatEffects = [];
    gameState.combatEffects.push({
      type: "slash",
      x: mob.x,
      y: mob.y,
      expire: Date.now() + 200
    });

    if (!gameState.floatingTexts) gameState.floatingTexts = [];
    gameState.floatingTexts.push({
      text: `-${finalDmg}`,
      color: "#ef4444",
      x: mob.x,
      y: mob.y - 10,
      expire: Date.now() + 800
    });
  }

  // 怪物擊殺與掉寶判定
  if (mob.currentHp <= 0) {
    handleMobDeathAndRewards(mob);
  }
}

// 抽取共用的怪物擊殺與掉寶結算
function handleMobDeathAndRewards(mob) {
  if (!mob || mob.isDead) return;
  mob.currentHp = 0;
  mob.isDead = true; // 🚨 核心防護：第一時間標記死亡，徹底阻斷反擊與重複結算

  const finalExp = Math.max(1, Math.floor(mob.exp * gmSettings.expRate));
  currentChar.exp = (currentChar.exp || 0) + finalExp;
  log(`討伐了 ${mob.name}！獲得 ${finalExp} 經驗值。`, "drop");

  const curLv = currentChar.level || 1;
  const maxExp = curLv * curLv * 100;
  if (currentChar.exp >= maxExp) {
    currentChar.level = curLv + 1;
    currentChar.exp -= maxExp;
    const preset = (typeof resolveClassPreset === 'function' ? resolveClassPreset(currentChar.charClass) : null) || ((typeof CLASS_PRESETS !== 'undefined') ? CLASS_PRESETS[currentChar.charClass] : null);
    const hpRange = preset?.hpMod || [12, 18];
    const mpRange = preset?.mpMod || [2, 4];
    const addHp = Math.floor(Math.random() * (hpRange[1] - hpRange[0])) + hpRange[0];
    const addMp = Math.floor(Math.random() * (mpRange[1] - mpRange[0])) + mpRange[0];
    currentChar.maxHp = (currentChar.maxHp || 50) + addHp;
    currentChar.hp = currentChar.maxHp;
    currentChar.maxMp = (currentChar.maxMp || 20) + addMp;
    currentChar.mp = currentChar.maxMp;
    log(`🎉 升級！恭喜達到 Lv.${currentChar.level} (HP+${addHp}, MP+${addMp})`, "sys");

    if (typeof saveAccountData === 'function') saveAccountData();
  }

  // 掉寶結算
  if (mob.drops) {
    mob.drops.forEach(drop => {
      const effectiveChance = Math.min(1.0, drop.chance * gmSettings.dropRate);
      if (Math.random() <= effectiveChance) {
        if (drop.item === "金幣") {
          const rawGold = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
          const finalGold = Math.floor(rawGold * gmSettings.goldRate);
          currentChar.gold = (currentChar.gold || 0) + finalGold;
          log(`拾獲金幣 x${finalGold}`, "drop");
        } else {
          const count = drop.count || 1;
          const itemRules = gameState.botSettings?.itemRules || {};
          const rule = itemRules[drop.item] || { pick: true, autoSell: false };

          if (rule.pick === false) return;

          if (rule.autoSell) {
            const itemDb = (typeof DB !== 'undefined' && DB.items) ? DB.items[drop.item] : null;
            const unitPrice = Math.max(1, Math.floor((itemDb ? itemDb.price : 10) * 0.4));
            const earnGold = unitPrice * count;
            currentChar.gold = (currentChar.gold || 0) + earnGold;
            log(`[掉落] 💰 自動折現：討伐【${mob.name}】掉落【${drop.item}】x${count}，已就地自動變賣獲得 ${earnGold} 金幣！（不佔負重）`, "drop");
            return;
          }

          if (typeof addItemToInventory === "function") {
            addItemToInventory(drop.item, count);
            log(`✨ 拾獲寶物：${drop.item} x${count}`, "drop");
          }
        }
      }
    });
  }

  // 將該怪移出陣列，清空鎖定
  gameState.mobs = gameState.mobs.filter(m => m !== mob);
  if (gameState.targetMob === mob) gameState.targetMob = null;

  // 加入怪物重生冷卻佇列：小怪 10 秒 (10,000ms)，Boss 首領 30 分鐘 (1,800,000ms)
  const isBossMob = mob.isBoss || BOSS_NAMES.includes(mob.name);
  const respawnDelay = isBossMob ? 30 * 60 * 1000 : 10 * 1000;

  if (!gameState.respawnQueue) gameState.respawnQueue = [];
  gameState.respawnQueue.push({
    mapId: gameState.currentMap,
    template: {
      name: mob.name,
      level: mob.level,
      hp: mob.hp,
      ac: mob.ac,
      size: mob.size,
      aggressive: mob.aggressive,
      undead: mob.undead,
      hardSkin: mob.hardSkin,
      poison: mob.poison,
      isBoss: mob.isBoss,
      exp: mob.exp,
      drops: mob.drops
    },
    respawnTime: Date.now() + respawnDelay
  });

  if (isBossMob) {
    log(`⏳【首領討伐】${mob.name} 已被擊敗！預計將於 30 分鐘後重生。`, "sys");
  }

  if (gameState.botStatus === "finishing") {
    gameState.botStatus = "idle";
    const tag = document.getElementById("battle-mode-tag");
    if (tag) tag.innerText = "[野外待機中]";
    log("✅ 當前目標已消滅，正式進入野外待機防禦狀態。", "sys");
  }
}

// 🎮 RO 掛機技能攻擊優先判定核心
function checkAndExecuteAutoSkillAttack(target, dist, now) {
  if (!currentChar || !target || target.isDead || target.currentHp <= 0) return false;

  const autoSkills = gameState.botSettings?.autoSkills;
  if (!autoSkills || autoSkills.enabled === false) return false;

  const attackRules = autoSkills.attackRules;
  if (!Array.isArray(attackRules) || attackRules.length === 0) return false;

  const curMp = currentChar.mp || 0;
  const maxMp = Math.max(1, currentChar.maxMp || 20);
  const curMpPercent = (curMp / maxMp) * 100;

  for (let rule of attackRules) {
    if (rule.enabled === false) continue;

    // 怪物條件檢測
    if (Array.isArray(rule.targetMobs) && rule.targetMobs.length > 0) {
      if (!rule.targetMobs.includes(target.name)) continue;
    }

    // MP 門檻檢測
    const minMp = rule.minMpPercent || 0;
    if (curMpPercent < minMp) continue;

    // 每隻怪只放一次檢測
    if (rule.mode === "once") {
      if (target._castOnceSkills && target._castOnceSkills[rule.skillName]) {
        continue;
      }
    }

    // 技能資料與習得判定
    const skill = (typeof DB !== "undefined" && DB.skills) ? DB.skills[rule.skillName] : null;
    if (!skill) continue;
    if (!currentChar.skills || !currentChar.skills.includes(rule.skillName)) continue;

    // MP 實際消耗檢測
    if (curMp < (skill.mpCost || 0)) continue;

    // 施法材料消耗檢測 (精靈玉 / 魔力之石)
    let materialItem = null;
    let materialReq = 0;
    if (skill.materialCost && skill.materialCost !== "無") {
      const match = skill.materialCost.match(/(精靈玉|魔力之石)\s*x?(\d+)?/);
      if (match) {
        materialItem = match[1];
        materialReq = parseInt(match[2]) || 1;
        const hasMat = currentChar.inventory && currentChar.inventory.some(i => i.name === materialItem && (i.count || 1) >= materialReq);
        if (!hasMat) continue;
      }
    }

    // 技能冷卻檢測 (若 CD 中則依規範跳過判定下一條)
    if (typeof canUseSkill === "function" && !canUseSkill(rule.skillName)) {
      continue;
    }

    // 施法距離檢查 (衝擊之暈等近戰技能為 32，遠程法術/三重矢為 190)
    const isMeleeSkill = (rule.skillName === "衝擊之暈");
    const skillRange = isMeleeSkill ? 32 : 190;
    if (dist > skillRange) {
      return "moving";
    }

    // 🌟 條件完全符合！執行技能施放！
    currentChar.mp = Math.max(0, curMp - (skill.mpCost || 0));

    // 扣除材料
    if (materialItem && materialReq > 0 && currentChar.inventory) {
      const matIdx = currentChar.inventory.findIndex(i => i.name === materialItem);
      if (matIdx !== -1) {
        currentChar.inventory[matIdx].count = (currentChar.inventory[matIdx].count || 1) - materialReq;
        if (currentChar.inventory[matIdx].count <= 0) {
          currentChar.inventory.splice(matIdx, 1);
        }
      }
    }

    // 標記每隻怪只放一次
    if (rule.mode === "once") {
      if (!target._castOnceSkills) target._castOnceSkills = {};
      target._castOnceSkills[rule.skillName] = true;
    }

    // 記錄冷卻時間
    if (typeof markSkillUsed === "function") {
      markSkillUsed(rule.skillName, skill.cooldown || 2000);
    }

    target.isAggroed = true;

    // 計算傷害與視覺特效
    let skillDamage = 0;
    const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { int: 10, dex: 10, str: 10 });
    const curLv = currentChar.level || 1;

    if (rule.skillName === "三重矢") {
      // 妖精三重矢：連續三發射擊
      let arrowUsed = "魔法箭";
      if (currentChar.inventory) {
        const arrowIdx = currentChar.inventory.findIndex(i => (i.name === "銀箭" || i.name === "箭") && (i.count || 0) > 0);
        if (arrowIdx !== -1) {
          arrowUsed = currentChar.inventory[arrowIdx].name;
          currentChar.inventory[arrowIdx].count--;
          if (currentChar.inventory[arrowIdx].count <= 0) currentChar.inventory.splice(arrowIdx, 1);
        }
      }

      gameState.arrowTrail = {
        fromX: gameState.playerX,
        fromY: gameState.playerY,
        toX: target.x,
        toY: target.y,
        expire: Date.now() + 200
      };

      const wpn = currentChar.equipped?.weapon;
      const wpnData = (wpn && typeof DB !== 'undefined' && DB.items) ? DB.items[wpn.name] : null;
      const baseShot = Math.floor((stats.dex || 10) * 1.5) + (wpn?.enchant || 0) * 2 + (wpnData?.extraDmg || 0);
      skillDamage = Math.max(30, Math.floor((baseShot + (skill.power || 90)) * 1.1));

      log(`🏹✨【三重矢】破空連發！對【${target.name}】連續射出三支破邪強矢，造成 ${skillDamage} 點爆發傷害！`, "atk");

      if (!gameState.combatEffects) gameState.combatEffects = [];
      gameState.combatEffects.push({
        type: "burst",
        x: target.x,
        y: target.y,
        color: "#22c55e",
        expire: Date.now() + 250
      });

      if (!gameState.floatingTexts) gameState.floatingTexts = [];
      gameState.floatingTexts.push({
        text: `CRIT -${skillDamage}!`,
        color: "#4ade80",
        x: target.x,
        y: target.y - 12,
        expire: Date.now() + 900
      });
    } else {
      // 魔法攻擊或戰士重擊
      const intBonus = Math.floor((stats.int || 10) * 2.2);
      const basePwr = skill.power || 60;
      const acReduction = 150 / (150 + Math.max(0, -target.ac));
      skillDamage = Math.max(10, Math.floor((basePwr + intBonus + curLv) * acReduction));

      gameState.arrowTrail = {
        fromX: gameState.playerX,
        fromY: gameState.playerY,
        toX: target.x,
        toY: target.y,
        expire: Date.now() + 180
      };

      log(`⚡✨ 施展【${rule.skillName}】！一道強烈魔法衝擊命中【${target.name}】，造成 ${skillDamage} 點魔法打擊傷害！`, "atk");

      if (!gameState.combatEffects) gameState.combatEffects = [];
      gameState.combatEffects.push({
        type: "magic",
        x: target.x,
        y: target.y,
        color: "#38bdf8",
        expire: Date.now() + 250
      });

      if (!gameState.floatingTexts) gameState.floatingTexts = [];
      gameState.floatingTexts.push({
        text: `-${skillDamage}`,
        color: "#60a5fa",
        x: target.x,
        y: target.y - 12,
        expire: Date.now() + 850
      });
    }

    target.currentHp -= skillDamage;

    // 怪物擊殺判定
    if (target.currentHp <= 0) {
      handleMobDeathAndRewards(target);
    }

    // 連招施放 (chainSkill)
    if (rule.chainSkill && target.currentHp > 0 && !target.isDead) {
      const chainSk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[rule.chainSkill] : null;
      if (chainSk && currentChar.skills.includes(rule.chainSkill) && curMp >= (chainSk.mpCost || 0) && (typeof canUseSkill === "function" && canUseSkill(rule.chainSkill))) {
        setTimeout(() => {
          if (target && target.currentHp > 0 && !target.isDead) {
            currentChar.mp = Math.max(0, (currentChar.mp || 0) - (chainSk.mpCost || 0));
            markSkillUsed(rule.chainSkill, chainSk.cooldown || 2000);
            const chainDmg = Math.max(15, Math.floor((chainSk.power || 50) + (stats.int || 10) * 1.5));
            target.currentHp -= chainDmg;
            log(`🔗⚡【接著施放】連鎖施展【${rule.chainSkill}】追加命中【${target.name}】，造成 ${chainDmg} 傷害！`, "atk");
            if (target.currentHp <= 0) {
              handleMobDeathAndRewards(target);
            }
            updateLeftPanel();
          }
        }, 300);
      }
    }

    updateLeftPanel();
    return true;
  }

  return false;
}

function onMapSelectChange() {
  const mapSelect = document.getElementById("map-select");
  if (!mapSelect) return;
  gameState.currentMap = mapSelect.value;
  initWorldMobs();
  const curName = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap].name : "話島獵場";
  log(`已切換前往獵場：${curName}！`, "sys");
  updateLeftPanel();
  if (typeof renderStrategyTab === 'function') renderStrategyTab();
}