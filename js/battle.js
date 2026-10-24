// js/battle.js - 擬真戰場主迴圈、平滑收尾暫停、野外即時自動折現與不撿取判定

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
    btn.innerText = (gameState.botStatus === "running") ? "⏹ 停止掛機" : "▶ 開始掛機迴圈";
    btn.className = (gameState.botStatus === "running") ? "btn btn-danger" : "btn btn-success";
    btn.onclick = toggleLoop;
  }

  // 確保登入時，戰鬥面板的標籤文字會對應正確的狀態
  const tag = document.getElementById("battle-mode-tag");
  if (tag) {
    tag.innerText = (gameState.botStatus === "running") ? "[野外巡航中]" : (gameState.inVillage ? "[村莊休整中]" : "[野外待機中]");
  }

  if (!gameState.botStatus) {
    gameState.botStatus = gameState.inVillage ? "village" : "idle";
  }

  log("▶ 啟動掛機！角色開始主動索敵巡邏...", "sys");

  ensureWorldTickTimer();

  if (!gameState.cloudSaveTimer) {
    gameState.cloudSaveTimer = setInterval(() => {
      if (typeof saveAccountData === 'function') saveAccountData();
    }, 15000);
  }

  // 🚨 核心防護：如果角色已經在野外掛機，絕對不要觸發回村 SOP！
  if (!gameState.inVillage) {
    return; // 直接中斷，讓下方的 gameTick() 就地接手打怪
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

  if (gameState.targetMob && gameState.targetMob.currentHp > 0 && !gameState.inVillage) {
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

function ensureWorldTickTimer() {
  if (!gameState.loopTimer) {
    gameState.loopTimer = setInterval(gameTick, 100);
  }
}

// 👈 關鍵修改：Canvas 寬高設定為 960x540
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

function flyBackToVillage() {
  gameState.inVillage = true;
  gameState.botStatus = "village";
  gameState.isRunning = false;
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

  log("手動點擊返回村莊，掛機已暫停。", "sys");
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

  const cfg = getMapConfig(gameState.currentMap);
  if (gameState.mobs.length < cfg.totalMobs) {
    spawnWorldMonsterOrCluster();
  }
  updateWorldMobsBehavior();

  handlePlayerMovementAndCombat();

  if (typeof renderRadar === "function") renderRadar();
  updateLeftPanel();
}

function initWorldMobs() {
  gameState.mobs = [];
  gameState.targetMob = null;

  if (typeof DB !== 'undefined' && DB.maps && !DB.maps[gameState.currentMap]) {
    gameState.currentMap = "talking_island";
  }

  const cfg = getMapConfig(gameState.currentMap);
  let loopCount = 0;

  while (gameState.mobs.length < cfg.totalMobs && loopCount < 80) {
    loopCount++;
    spawnWorldMonsterOrCluster();
  }
}

function spawnWorldMonsterOrCluster() {
  const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap] : ((typeof DB !== 'undefined' && DB.maps) ? DB.maps["talking_island"] : null);
  if (!mapData || !mapData.monsters || mapData.monsters.length === 0) return;

  const cfg = getMapConfig(gameState.currentMap);
  let pool = [];
  mapData.monsters.forEach(tmpl => {
    const weight = cfg.speciesCounts && cfg.speciesCounts[tmpl.name] !== undefined ? cfg.speciesCounts[tmpl.name] : 5;
    for (let w = 0; w < weight; w++) pool.push(tmpl);
  });
  if (pool.length === 0) pool = mapData.monsters;

  const angle = Math.random() * Math.PI * 2;
  const spawnDist = 200 + Math.random() * 250;

  if (isNaN(gameState.playerX)) gameState.playerX = 1200;
  if (isNaN(gameState.playerY)) gameState.playerY = 800;

  let centerX = Math.max(100, Math.min(WORLD_WIDTH - 100, gameState.playerX + Math.cos(angle) * spawnDist));
  let centerY = Math.max(100, Math.min(WORLD_HEIGHT - 100, gameState.playerY + Math.sin(angle) * spawnDist));

  const isCluster = Math.random() < 0.45;
  const count = isCluster ? (Math.floor(Math.random() * 3) + 2) : 1;

  for (let i = 0; i < count; i++) {
    if (gameState.mobs.length >= cfg.totalMobs) break;

    const template = pool[Math.floor(Math.random() * pool.length)];
    const offsetX = isCluster ? (Math.random() * 70 - 35) : 0;
    const offsetY = isCluster ? (Math.random() * 70 - 35) : 0;

    const finalX = Math.max(50, Math.min(WORLD_WIDTH - 50, centerX + offsetX));
    const finalY = Math.max(50, Math.min(WORLD_HEIGHT - 50, centerY + offsetY));

    const mob = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      currentHp: template.hp,
      x: finalX,
      y: finalY,
      isBoss: template.isBoss || BOSS_NAMES.includes(template.name),
      isAggroed: false,
      wanderTarget: { x: finalX, y: finalY },
      lastWanderTime: Date.now()
    };
    gameState.mobs.push(mob);
  }
}

function updateWorldMobsBehavior() {
  const now = Date.now();
  gameState.mobs.forEach(mob => {
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
            log("💀 體力不支倒下！已被神殿救回村莊...", "sys");
            currentChar.hp = Math.floor(currentChar.maxHp * 0.3);
            flyBackToVillage();
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
    m.isAggroed && Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) <= 45
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

  if (gameState.targetMob && (!gameState.mobs.includes(gameState.targetMob) || gameState.targetMob.currentHp <= 0)) {
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
    let candidates = gameState.mobs.filter(m => Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) < 550);

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

// ---------------- 執行攻擊與掉寶 (實裝就地變賣折現與不撿取規則) ----------------
function executePlayerAttack(mob, isBow, wpnData) {
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
      log(`🏹 射出【銀箭】！神聖破邪對不死系 ${mob.name} 造成額外 +${holyBonus} 傷害！`, "atk");
    }

    const acReduction = 150 / (150 + Math.max(0, -mob.ac));
    const finalDmg = Math.max(1, Math.floor(baseDmg * acReduction));

    mob.currentHp -= finalDmg;
    log(`🏹 射出 ${arrowUsedName}！命中 ${mob.name} 造成 ${finalDmg} 點傷害。(剩餘: ${remainArrows})`, "atk");
  } else {
    mob.isAggroed = true;

    const stats = (typeof getCalculatedStats === "function") ? getCalculatedStats() : (currentChar.stats || { str: 10 });
    const curLv = currentChar.level || 1;
    const hitRating = Math.floor((stats.str || 10) / 2) + Math.floor(curLv / 2) + (wpnData ? wpnData.hitBonus || 0 : 0) + (wpn ? wpn.enchant || 0 : 0);
    const hitRate = Math.min(0.95, Math.max(0.5, 0.85 + (hitRating - (10 - mob.ac)) * 0.005));

    if (Math.random() > hitRate) {
      log(`揮擊揮空！未能擊中 ${mob.name}。`, "atk");
      return;
    }

    const diceMax = (mob.size === "large") ? (wpnData ? wpnData.large : 4) : (wpnData ? wpnData.small : 4);
    let baseDmg = Math.floor(Math.random() * diceMax) + 1;
    baseDmg += (wpn ? wpn.enchant : 0) + (wpnData ? wpnData.extraDmg || 0 : 0) + Math.max(0, (stats.str || 10) - 10);

    if (mob.undead && wpnData && wpnData.material === "silver") {
      const undeadBonus = Math.floor(Math.random() * 20) + 1;
      baseDmg += undeadBonus;
      log(`✨ 銀質武器剋制！對不死系 ${mob.name} 附加 +${undeadBonus} 破邪傷害！`, "atk");
    }

    const acReduction = 150 / (150 + Math.max(0, -mob.ac));
    const finalDmg = Math.max(1, Math.floor(baseDmg * acReduction));

    mob.currentHp -= finalDmg;
    log(`揮擊命中 ${mob.name}，造成 ${finalDmg} 點傷害！`, "atk");
  }

  // 怪物擊殺與掉寶判定
  if (mob.currentHp <= 0) {
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

    // 核心掉寶處理
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

    gameState.mobs = gameState.mobs.filter(m => m !== mob);
    gameState.targetMob = null;

    if (gameState.botStatus === "finishing") {
      gameState.botStatus = "idle";
      const tag = document.getElementById("battle-mode-tag");
      if (tag) tag.innerText = "[野外待機中]";
      log("✅ 當前目標已消滅，正式進入野外待機防禦狀態。", "sys");
    }
  }
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