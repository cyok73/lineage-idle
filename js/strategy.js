// js/strategy.js - 戰術 AI 核心引擎 (完全去步驟化、零彈窗 Alert 規範版)

function initBotStrategyDefaults() {
  if (!gameState.botSettings) gameState.botSettings = {};

  if (!gameState.botSettings.security) {
    gameState.botSettings.security = {
      escapeHomeHp: 20,
      escapeTeleHp: 40,
      bossAction: "teleport"
    };
  }

  if (!Array.isArray(gameState.botSettings.potions)) {
    gameState.botSettings.potions = [
      { item: "紅色藥水", hpPercent: 70 },
      { item: "橙色藥水", hpPercent: 45 },
      { item: "白色藥水", hpPercent: 20 }
    ];
  }

  if (!Array.isArray(gameState.botSettings.buffs)) {
    const oldBuffs = (typeof gameState.botSettings.buffs === "object" && gameState.botSettings.buffs) ? gameState.botSettings.buffs : {};
    gameState.botSettings.buffs = [];
    if (oldBuffs.autoCurePoison !== undefined) {
      gameState.botSettings.curePoison = oldBuffs.autoCurePoison;
    }
  }

  if (gameState.botSettings.curePoison === undefined) {
    gameState.botSettings.curePoison = true;
  }

  if (!gameState.botSettings.combat) {
    gameState.botSettings.combat = {
      targetPriority: "nearest",
      surroundCount: 3,
      surroundAction: "teleport"
    };
  }

  if (!gameState.botSettings.restockTrigger) {
    gameState.botSettings.restockTrigger = {
      noRedPot: true,
      noArrows: true,
      overweightPercent: 80,
      onDeathOrEscape: true
    };
  }

  if (!gameState.botSettings.itemRules || typeof gameState.botSettings.itemRules !== "object") {
    gameState.botSettings.itemRules = {
      "妖魔圖騰": { pick: true, autoSell: true, store: false, keep: 0, restockFromStorage: false },
      "短劍": { pick: true, autoSell: true, store: false, keep: 0, restockFromStorage: false },
      "對武器施法的卷軸": { pick: true, autoSell: false, store: true, keep: 0, restockFromStorage: false },
      "瞬間移動卷軸": { pick: true, autoSell: false, store: true, keep: 20, restockFromStorage: true },
      "傳送回家的卷軸": { pick: true, autoSell: false, store: true, keep: 5, restockFromStorage: true }
    };
  }

  if (!gameState.botSettings.pipeline) {
    gameState.botSettings.pipeline = {
      buyItems: [
        { item: "紅色藥水", targetCount: 80 },
        { item: "瞬間移動卷軸", targetCount: 20 },
        { item: "傳送回家的卷軸", targetCount: 5 }
      ],
      minGoldFloor: 0
    };
  }

  // 仿 RO 掛機技能設定 (攻擊依序、每隻怪只放一次/持續、指定怪、輔助維持、回復、逃生)
  if (!gameState.botSettings.autoSkills) {
    gameState.botSettings.autoSkills = {
      enabled: true,
      attackRules: [], // [{ id, skillName, minMpPercent: 20, mode: "once"|"always", chainSkill: "", enabled: true, targetMobs: [] }]
      buffRules: {},   // { [skillName]: { enabled: true, minMpPercent: 20 } }
      healRules: {
        enabled: true,
        skillName: "auto", // "auto" 自動依序選高級/中級/初級治癒術/生祝
        hpThreshold: 70,
        minMpPercent: 10,
        autoCurePoison: true
      },
      escapeRules: {
        enabled: true,
        skillName: "指定傳送",
        hpThreshold: 20
      }
    };
  }

  gameState.botSettings.weightLimit = gameState.botSettings.restockTrigger.overweightPercent || 80;
}

function saveStrategySettings() {
  if (currentChar) {
    currentChar.botSettings = JSON.parse(JSON.stringify(gameState.botSettings));
    if (typeof saveAccountData === "function") saveAccountData();
  }
}

function getWeightEscapeThreshold() {
  const inputElem = document.getElementById("cfg-weight-escape");
  if (inputElem && inputElem.value) {
    return parseInt(inputElem.value) || 80;
  }
  return gameState.botSettings?.restockTrigger?.overweightPercent || 80;
}

// ---------------- 戰鬥中即時 AI 邏輯 ----------------
function handleStrategyAI() {
  if (!currentChar || gameState.inVillage) return;

  initBotStrategyDefaults();

  const hpPercent = (currentChar.hp / currentChar.maxHp) * 100;
  const weightPercent = (typeof getCurrentWeightPercent === "function") ? getCurrentWeightPercent() : 0;
  const weightThreshold = getWeightEscapeThreshold();
  const sec = gameState.botSettings.security || { escapeHomeHp: 20, escapeTeleHp: 40, bossAction: "teleport" };
  const combat = gameState.botSettings.combat || { surroundCount: 3, surroundAction: "teleport" };
  const trigger = gameState.botSettings.restockTrigger || { noRedPot: true, noArrows: true };
  const now = Date.now();

  // 🎮 RO 順序 1：逃生技能優先判定 (指定傳送 / 世界樹的呼喚)
  const autoSkills = gameState.botSettings.autoSkills;
  if (autoSkills && autoSkills.escapeRules && autoSkills.escapeRules.enabled) {
    const esc = autoSkills.escapeRules;
    if (hpPercent <= (esc.hpThreshold || 20)) {
      const escSkillName = esc.skillName || "指定傳送";
      if (currentChar.skills && currentChar.skills.includes(escSkillName)) {
        const skData = (typeof DB !== "undefined" && DB.skills) ? DB.skills[escSkillName] : null;
        if (skData && (currentChar.mp || 0) >= (skData.mpCost || 0) && (typeof canUseSkill === "function" && canUseSkill(escSkillName))) {
          currentChar.mp = Math.max(0, currentChar.mp - (skData.mpCost || 0));
          if (typeof markSkillUsed === "function") markSkillUsed(escSkillName, skData.cooldown || 3000);

          if (escSkillName === "世界樹的呼喚") {
            log(`🌳【緊急逃生技能】HP 告急 (剩餘 ${hpPercent.toFixed(1)}%)！施展【世界樹的呼喚】瞬間返航母樹！`, "mob");
            triggerAutoRestock("逃生技能返村");
            return;
          } else {
            gameState.playerX = 100 + Math.random() * (WORLD_WIDTH - 200);
            gameState.playerY = 100 + Math.random() * (WORLD_HEIGHT - 200);
            gameState.targetMob = null;
            log(`⚡【緊急逃生技能】HP 告急 (剩餘 ${hpPercent.toFixed(1)}%)！施展【${escSkillName}】瞬間隨機跳躍脫離！`, "mob");
            updateLeftPanel();
            return;
          }
        }
      }
    }
  }

  // 瀕死緊急回城 (卷軸)
  if (hpPercent <= (sec.escapeHomeHp || 20) && hasItem("傳送回家的卷軸")) {
    log(`🛑【瀕死緊急回城】HP 降至 ${hpPercent.toFixed(1)}%！立即使用【傳送回家的卷軸】避難！`, "mob");
    triggerAutoRestock("瀕死緊急回城");
    return;
  }

  // 危急瞬間脫離 (卷軸)
  if (hpPercent <= (sec.escapeTeleHp || 40) && hasItem("瞬間移動卷軸")) {
    log(`⚡【危急瞬間脫離】HP 降至 ${hpPercent.toFixed(1)}%！使用【瞬間移動卷軸】隨機飛離！`, "mob");
    useItemByName("瞬間移動卷軸");
    return;
  }

  // 🎮 RO 順序 2：回復技能判定 (解毒術、治癒術自補)
  if (autoSkills && autoSkills.healRules) {
    const hr = autoSkills.healRules;
    // 2-1. 解毒術
    if (hr.autoCurePoison && currentChar.isPoisoned && currentChar.skills && currentChar.skills.includes("解毒術")) {
      const cdOk = (typeof canUseSkill === "function") ? canUseSkill("解毒術") : true;
      const skData = (typeof DB !== "undefined" && DB.skills) ? DB.skills["解毒術"] : null;
      if (cdOk && (currentChar.mp || 0) >= (skData?.mpCost || 12)) {
        useSkill("解毒術");
      }
    }

    // 2-2. 治癒術自補
    if (hr.enabled && hpPercent <= (hr.hpThreshold || 70)) {
      const curMpPercent = (currentChar.mp / Math.max(1, currentChar.maxMp)) * 100;
      if (curMpPercent >= (hr.minMpPercent || 10)) {
        const healCandidates = ["生命的祝福", "高級治癒術", "中級治癒術", "初級治癒術"];
        for (let hName of healCandidates) {
          if (currentChar.skills && currentChar.skills.includes(hName)) {
            const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[hName] : null;
            if (sk && (currentChar.mp || 0) >= (sk.mpCost || 0) && (typeof canUseSkill === "function" && canUseSkill(hName))) {
              useSkill(hName);
              break;
            }
          }
        }
      }
    }
  }

  // 🎮 RO 順序 3：輔助維持判定 (Buffs 自動維持)
  if (autoSkills && autoSkills.buffRules) {
    const bRules = autoSkills.buffRules;
    const curMpPercent = (currentChar.mp / Math.max(1, currentChar.maxMp)) * 100;

    // 妖精專屬神技：魂體轉換 (HP >= 65% 且 MP <= 70% 時自動將 HP 轉為 MP)
    if (bRules["魂體轉換"] && bRules["魂體轉換"].enabled && currentChar.skills && currentChar.skills.includes("魂體轉換")) {
      if (hpPercent >= 65 && curMpPercent <= 70 && (typeof canUseSkill === "function" && canUseSkill("魂體轉換"))) {
        useSkill("魂體轉換");
      }
    }

    // 常態 Buff 維持
    for (let bName in bRules) {
      if (bName === "魂體轉換") continue;
      const bRule = bRules[bName];
      if (!bRule || !bRule.enabled) continue;
      if (!currentChar.skills || !currentChar.skills.includes(bName)) continue;

      const minMp = bRule.minMpPercent || 20;
      if (curMpPercent < minMp) continue;

      const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[bName] : null;
      if (!sk) continue;
      if ((currentChar.mp || 0) < (sk.mpCost || 0)) continue;

      // 檢查是否冷卻完畢
      if (typeof canUseSkill === "function" && !canUseSkill(bName)) continue;

      // 檢查 Buff 是否未生效或即將到期 (剩餘 < 3 秒)
      currentChar.activeBuffs = currentChar.activeBuffs || {};
      const expireTime = currentChar.activeBuffs[bName] || 0;
      if (Date.now() >= expireTime - 3000) {
        useSkill(bName);
        currentChar.activeBuffs[bName] = Date.now() + (sk.duration || 60) * 1000;
        break; // 每次 tick 最多補一個 Buff，避免瞬間連放打斷節奏
      }
    }
  }

  // 強敵遭遇戰術
  if (sec.bossAction !== "fight") {
    const bossNear = Array.isArray(gameState.mobs) ? gameState.mobs.find(m => m.isBoss && Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) < 500) : null;
    if (bossNear) {
      if (sec.bossAction === "teleport" && hasItem("瞬間移動卷軸")) {
        useItemByName("瞬間移動卷軸");
        log(`👿【強敵遭遇戰術】雷達偵測到 Boss【${bossNear.name}】！執行瞬移避戰！`, "mob");
        return;
      } else if (sec.bossAction === "home" || !hasItem("瞬間移動卷軸")) {
        log(`👿【強敵遭遇戰術】雷達偵測到 Boss【${bossNear.name}】！執行緊急回村整補！`, "mob");
        triggerAutoRestock("強敵避難");
        return;
      }
    }
  }

  // 多怪包圍脫離
  const surroundLimit = combat.surroundCount || 3;
  if (gameState.surroundingMobs >= surroundLimit) {
    if (combat.surroundAction === "teleport" && hasItem("瞬間移動卷軸")) {
      useItemByName("瞬間移動卷軸");
      log(`⚔️【多怪包圍脫離】同時遭受 ${gameState.surroundingMobs} 隻怪夾擊！使用【瞬移卷軸】飛離！`, "sys");
      return;
    } else if (combat.surroundAction === "home" && hasItem("傳送回家的卷軸")) {
      log(`⚔️【多怪包圍脫離】遭受圍攻！使用【回家卷軸】回城！`, "sys");
      triggerAutoRestock("包圍脫離");
      return;
    }
  }

  // 自動喝水 (500ms CD)
  if (!gameState.lastPotionTime) gameState.lastPotionTime = 0;
  if (now - gameState.lastPotionTime >= 500 && Array.isArray(gameState.botSettings.potions)) {
    const sortedPots = [...gameState.botSettings.potions].sort((a, b) => a.hpPercent - b.hpPercent);
    for (let potCfg of sortedPots) {
      if (hpPercent <= potCfg.hpPercent && hasItem(potCfg.item)) {
        useItemByName(potCfg.item);
        gameState.lastPotionTime = now;
        break;
      }
    }
  }

  // 加速維持
  const buffList = gameState.botSettings.buffs;
  if (Array.isArray(buffList)) {
    buffList.forEach(b => {
      if (b.enabled && hasItem(b.item)) {
        if (b.item === "綠色藥水" && currentChar.buffs && currentChar.buffs.green <= (b.advanceSec || 5)) {
          useItemByName("綠色藥水");
        } else if (b.item === "勇敢藥水" && currentChar.charClass === "knight" && currentChar.buffs && currentChar.buffs.brave <= (b.advanceSec || 5)) {
          useItemByName("勇敢藥水");
        }
      }
    });
  }

  // 中毒解毒
  if (gameState.botSettings.curePoison && currentChar.isPoisoned && hasItem("翡翠藥水")) {
    useItemByName("翡翠藥水");
    currentChar.isPoisoned = false;
    log("🧪 處於中毒狀態，立即使用【翡翠藥水】解毒！", "sys");
  }

  // 藍色藥水 (MP 回復)
  if (gameState.botSettings.autoBluePotion) {
    const mpPercent = currentChar.maxMp > 0 ? (currentChar.mp / currentChar.maxMp) * 100 : 0;
    if (mpPercent <= (gameState.botSettings.bluePotionMp || 30) && hasItem("藍色藥水")) {
      // 藍水時效約 10 分鐘 (600秒)，加入間隔避免浪費連喝
      if (!gameState.lastBluePotionTime || now - gameState.lastBluePotionTime > 600000) {
        useItemByName("藍色藥水");
        gameState.lastBluePotionTime = now;
      }
    }
  }

  // 負重回城
  if (weightPercent >= weightThreshold) {
    log(`🏛️【負重回城】野外負重達 ${weightPercent}% (超過門檻 ${weightThreshold}%)！回村整備！`, "sys");
    triggerAutoRestock("負重超載");
    return;
  }

  // 紅水/箭矢耗盡回城
  if (trigger.noRedPot && !hasItem("紅色藥水")) {
    log("🏛️【物資耗盡】身上【紅色藥水】已歸零！自動回村補給！", "sys");
    triggerAutoRestock("紅色藥水");
    return;
  }
  const isBowEquipped = currentChar.equipped?.weapon && DB.items && DB.items[currentChar.equipped.weapon.name]?.weaponType === "bow";
  if (trigger.noArrows && isBowEquipped && !hasItem("箭") && !hasItem("銀箭")) {
    log("🏛️【箭矢耗盡】身上【箭矢】已全數耗盡！自動回村補給！", "sys");
    triggerAutoRestock("箭");
    return;
  }
}

function triggerAutoRestock(reasonItem = "") {
  if (hasItem("傳送回家的卷軸")) {
    consumeScrollWithoutStopping("傳送回家的卷軸");
  }
  gameState.inVillage = true;
  gameState.isRestocking = true;
  gameState.restockReasonItem = reasonItem;
  gameState.targetMob = null;
  gameState.surroundingMobs = 0;
  if (Array.isArray(gameState.mobs)) {
    gameState.mobs.forEach(m => m.isAggroed = false);
  }

  const tag = document.getElementById("battle-mode-tag");
  if (tag) tag.innerText = "[村莊整補中...]";

  if (typeof updateLeftPanel === "function") updateLeftPanel();
  if (typeof renderRadar === "function") renderRadar();

  setTimeout(() => {
    executePipelineSOP(false);
  }, 600);
}

function consumeScrollWithoutStopping(scrollName) {
  if (!currentChar || !currentChar.inventory) return false;
  if (isScrollCooldownItem && isScrollCooldownItem(scrollName) && !canUseScroll(scrollName)) {
    return false;
  }
  const idx = currentChar.inventory.findIndex(i => i.name === scrollName && (i.count || 1) > 0);
  if (idx !== -1) {
    currentChar.inventory[idx].count--;
    if (currentChar.inventory[idx].count <= 0) currentChar.inventory.splice(idx, 1);
    if (typeof markScrollUsed === "function") markScrollUsed(scrollName);
    return true;
  }
  return false;
}

// ---------------- 完全去步驟化流水線 (零 Alert 阻斷) ----------------
function executeStartupPipelineSOP() {
  executePipelineSOP(true);
}
window.executeStartupPipelineSOP = executeStartupPipelineSOP;

function executeRestockProcedure() {
  executePipelineSOP(false);
}
window.executeRestockProcedure = executeRestockProcedure;

function executePipelineSOP(isStartup = false) {
  initBotStrategyDefaults();
  const rules = gameState.botSettings.itemRules || {};
  const pipe = gameState.botSettings.pipeline || { buyItems: [], minGoldFloor: 0 };
  const reason = gameState.restockReasonItem;

  // 📜 自然流暢去步驟化日誌
  log("🔄 啟動掛機循環，開始執行回城出發整備...", "sys");

  // 【清包變賣】
  log("📦【清包變賣】正在變賣指定戰利品...", "sys");
  let totalEarn = 0;

  if (currentChar && Array.isArray(currentChar.inventory)) {
    for (let i = currentChar.inventory.length - 1; i >= 0; i--) {
      const item = currentChar.inventory[i];
      if (rules[item.name]?.autoSell) {
        const dbItem = (typeof DB !== "undefined" && DB.items && DB.items[item.name]) ? DB.items[item.name] : {};
        const unitPrice = Math.max(1, Math.floor((dbItem.price || 10) * 0.4));
        const earn = unitPrice * (item.count || 1);
        totalEarn += earn;
        currentChar.gold += earn;
        currentChar.inventory.splice(i, 1);
      }
    }
  }

  if (totalEarn > 0) {
    log(`💰 成功變賣戰利品，獲得 ${totalEarn.toLocaleString()} 金幣。`, "drop");
  }

  // 【存倉整備】
  log("🏦【存倉整備】正在將指定物資存入個人倉庫...", "sys");
  let storeLogs = [];

  if (currentChar && Array.isArray(currentChar.inventory)) {
    for (let name in rules) {
      const r = rules[name];
      if (r.store) {
        const itemIdx = currentChar.inventory.findIndex(i => i.name === name);
        if (itemIdx !== -1) {
          const invItem = currentChar.inventory[itemIdx];
          const keep = Math.max(0, r.keep || 0);
          const currentCount = invItem.count || 1;
          const depositCount = currentCount - keep;

          if (depositCount > 0) {
            if (typeof depositItemDirectlyToStorage === "function") {
              depositItemDirectlyToStorage({ ...invItem, count: depositCount });
            }
            invItem.count = keep;
            if (invItem.count <= 0) {
              currentChar.inventory.splice(itemIdx, 1);
            }
            storeLogs.push(`【${name}】x${depositCount}（身上保留設定：${keep} 個）`);
          }
        }
      }
    }
  }

  if (storeLogs.length > 0) {
    log(`📥 存入倉庫：${storeLogs.join("、")}。`, "sys");
  }

  // 【倉庫補給】
  let storageRestockLogs = [];
  if (currentChar && Array.isArray(currentChar.storage)) {
    for (let name in rules) {
      const r = rules[name];
      if (r.store && r.restockFromStorage) {
        const keep = Math.max(0, r.keep || 0);
        const invItem = currentChar.inventory.find(i => i.name === name);
        const currentCount = invItem ? invItem.count : 0;
        const need = keep - currentCount;

        if (need > 0) {
          const sIdx = currentChar.storage.findIndex(s => s.name === name);
          if (sIdx !== -1) {
            const sItem = currentChar.storage[sIdx];
            const withdrawCount = Math.min(need, sItem.count || 1);
            if (typeof addItemToInventory === "function") {
              addItemToInventory(name, withdrawCount);
            }
            sItem.count = (sItem.count || 1) - withdrawCount;
            if (sItem.count <= 0) currentChar.storage.splice(sIdx, 1);
            storageRestockLogs.push(`【${name}】x${withdrawCount}（補足保留數 ${keep} 個）`);
          }
        }
      }
    }
  }

  if (storageRestockLogs.length > 0) {
    log(`📤 倉庫補給：從個人倉庫領取${storageRestockLogs.join("、")}。`, "sys");
  }

  // 【物資採買】
  log("🛒【物資採買】前往雜貨商補齊所需物資...", "sys");
  let buyLogs = [];
  let isGoldExhausted = false;

  if (pipe.buyItems && pipe.buyItems.length > 0 && currentChar) {
    const minGold = pipe.minGoldFloor || 0;

    pipe.buyItems.forEach(rule => {
      const dbItem = (typeof DB !== "undefined" && DB.items && DB.items[rule.item]) ? DB.items[rule.item] : null;
      if (!dbItem) return;

      const currentItem = currentChar.inventory ? currentChar.inventory.find(i => i.name === rule.item) : null;
      const currentCount = currentItem ? currentItem.count : 0;
      const needCount = rule.targetCount - currentCount;

      if (needCount > 0) {
        const totalCost = needCount * dbItem.price;
        if (currentChar.gold - totalCost >= minGold) {
          currentChar.gold -= totalCost;
          if (typeof addItemToInventory === "function") addItemToInventory(rule.item, needCount);
          buyLogs.push(`【${rule.item}】x${needCount}`);
        } else {
          const availableGold = Math.max(0, currentChar.gold - minGold);
          const affordable = Math.floor(availableGold / dbItem.price);
          if (affordable > 0) {
            currentChar.gold -= affordable * dbItem.price;
            if (typeof addItemToInventory === "function") addItemToInventory(rule.item, affordable);
            buyLogs.push(`【${rule.item}】x${affordable}`);
          } else {
            isGoldExhausted = true;
          }
        }
      }
    });
  }

  if (buyLogs.length > 0) {
    log(`🎒 成功補給：${buyLogs.join("、")}。`, "drop");
  }

  if (isGoldExhausted) {
    log("⚠️ 金幣不足，已盡量採買或跳過本次補給。", "sys");
  }

  // 滿血滿魔恢復
  if (currentChar) {
    currentChar.hp = currentChar.maxHp;
    currentChar.mp = currentChar.maxMp;
  }

  if (typeof updateLeftPanel === "function") updateLeftPanel();
  if (typeof renderInventoryTab === "function") renderInventoryTab();
  if (typeof renderStorageTab === "function") renderStorageTab();

  // 【負重檢查】(無彈窗，純日誌與安全中斷)
  const currentWeight = (typeof getCurrentWeightPercent === "function") ? getCurrentWeightPercent() : 0;
  const maxAllowedWeight = getWeightEscapeThreshold();

  if (currentWeight >= maxAllowedWeight) {
    log(`🛑【安全中斷】整備後負重達 ${currentWeight}%（已超過設定上限）！已暫停掛機，請手動清理負重。`, "mob");
    if (typeof stopLoop === "function") stopLoop();
    gameState.isRestocking = false;
    gameState.restockReasonItem = null;
    return;
  }

  // 檢查是否因金幣不足無法補齊關鍵物資
  if (reason && reason !== "負重超載" && reason !== "瀕死緊急回城" && reason !== "強敵避難" && reason !== "包圍脫離" && reason !== "手動撕回家卷") {
    if (isGoldExhausted || !hasItem(reason)) {
      log(`🛑【安全中斷】金幣不足無法補齊基礎物資【${reason}】，已暫停掛機！`, "mob");
      if (typeof stopLoop === "function") stopLoop();
      gameState.isRestocking = false;
      gameState.restockReasonItem = null;
      return;
    }
  }

  log(`⚖️【負重檢查】目前負重 ${currentWeight}%，狀態良好！`, "sys");

  // 【重返獵場】
  const curMapName = (typeof DB !== "undefined" && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap].name : "說話之島地表";
  log(`🚀【重返獵場】出發前往【${curMapName}】，開始自動打怪！`, "sys");

  gameState.isRestocking = false;
  gameState.restockReasonItem = null;

  setTimeout(() => {
    if (gameState.isRunning && typeof exitVillageToField === "function") {
      exitVillageToField();
    }
  }, 1000);
}

// ---------------- 候選道具清單 ----------------
function getAllCandidateItems() {
  const candidates = [];
  const addedNames = new Set();
  const bagMap = new Map();

  if (currentChar && Array.isArray(currentChar.inventory)) {
    currentChar.inventory.forEach(i => {
      if (!i || !i.name) return;
      bagMap.set(i.name, (bagMap.get(i.name) || 0) + (i.count || 1));
    });
  }

  const mapDropsSet = new Set();
  const curMapData = (typeof DB !== "undefined" && DB.maps && DB.maps[gameState.currentMap])
    ? DB.maps[gameState.currentMap]
    : ((typeof DB !== "undefined" && DB.maps) ? DB.maps["talking_island"] : null);

  if (curMapData && curMapData.monsters) {
    curMapData.monsters.forEach(m => {
      if (m.drops) {
        m.drops.forEach(d => {
          if (d.item && d.item !== "金幣") mapDropsSet.add(d.item);
        });
      }
    });
  }

  bagMap.forEach((count, name) => {
    candidates.push({
      name: name,
      inBag: true,
      count: count,
      source: `🎒 背包 x${count}`,
      dbItem: (typeof DB !== "undefined" && DB.items && DB.items[name]) ? DB.items[name] : {}
    });
    addedNames.add(name);
  });

  mapDropsSet.forEach(name => {
    if (!addedNames.has(name)) {
      candidates.push({
        name: name,
        inBag: false,
        count: 0,
        source: `🗺️ 獵場`,
        dbItem: (typeof DB !== "undefined" && DB.items && DB.items[name]) ? DB.items[name] : {}
      });
      addedNames.add(name);
    }
  });

  const rules = gameState.botSettings?.itemRules || {};
  for (let name in rules) {
    if (!addedNames.has(name) && name) {
      candidates.push({
        name: name,
        inBag: false,
        count: 0,
        source: `⚙️ 自訂`,
        dbItem: (typeof DB !== "undefined" && DB.items && DB.items[name]) ? DB.items[name] : {}
      });
      addedNames.add(name);
    }
  }

  return candidates;
}

// ---------------- 介面渲染（去步驟化語調） ----------------
function renderStrategyTab() {
  initBotStrategyDefaults();
  const tab = document.getElementById("tab-strategy");
  if (!tab) return;

  const sec = gameState.botSettings.security || { escapeHomeHp: 20, escapeTeleHp: 40, bossAction: "teleport" };
  const combat = gameState.botSettings.combat || { targetPriority: "nearest", surroundCount: 3, surroundAction: "teleport" };
  const trigger = gameState.botSettings.restockTrigger || { noRedPot: true, noArrows: true, overweightPercent: 80, onDeathOrEscape: true };
  const pipe = gameState.botSettings.pipeline || { buyItems: [], minGoldFloor: 0 };

  tab.innerHTML = `
    <!-- 🎮 RO 經典掛機技能設定面板 -->
    ${renderAutoSkillsSection()}

    <!-- 1. 🚨 生命維安 -->
    <div class="bot-section" style="border:1px solid #ef4444; background:rgba(30,20,20,0.85); margin-bottom:12px;">
      <div class="bot-section-title" style="color:#ef4444; font-size:14px; font-weight:bold; margin-bottom:4px;">
        🚨 1. 生命維安與緊急避險（最高優先級）
      </div>
      <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">⚠️ 最高優先級：判定優先於一切攻擊與巡邏走位，防止意外陣亡導致經驗與裝備損失。</div>

      <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span>🛑 <b>瀕死緊急回城</b>：當 HP &le; <input type="number" value="${sec.escapeHomeHp}" style="width:48px; text-align:center;" onchange="updateSecSetting('escapeHomeHp', this.value)"> % 時，立即使用【傳送回家的卷軸】</span>
      </div>
      <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span>⚡ <b>危急瞬間脫離</b>：當 HP &le; <input type="number" value="${sec.escapeTeleHp}" style="width:48px; text-align:center;" onchange="updateSecSetting('escapeTeleHp', this.value)"> % 時，使用【瞬間移動卷軸】隨機飛離戰場</span>
      </div>
      <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center;">
        <span>👿 <b>強敵遭遇戰術</b>：雷達偵測範圍內遭遇 Boss 級怪物時：</span>
        <select onchange="updateSecSetting('bossAction', this.value)" style="background:#0f172a; color:#fff; border:1px solid #475569;">
          <option value="fight" ${sec.bossAction === "fight" ? "selected" : ""}>正面迎戰（死鬥到底）</option>
          <option value="teleport" ${sec.bossAction === "teleport" ? "selected" : ""}>瞬移避戰（隨機飛走）</option>
          <option value="home" ${sec.bossAction === "home" ? "selected" : ""}>緊急回村（避難整補）</option>
        </select>
      </div>
    </div>

    <!-- 2. 🧪 動態喝水與加速 -->
    <div class="bot-section" style="border:1px solid #22c55e; background:rgba(20,30,20,0.85); margin-bottom:12px;">
      <div class="bot-section-title" style="color:#22c55e; font-size:14px; font-weight:bold; margin-bottom:4px;">
        🧪 2. 動態喝水與加速狀態維護
      </div>
      <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">日常續航核心。支援動態新增多組階梯喝水門檻 (500ms CD) 與狀態藥水排程。</div>

      <div style="margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <b>💧 自動飲用恢復藥水（階梯補充）</b>
          <button type="button" class="btn btn-gold" style="padding:2px 8px; font-size:11px;" onclick="addPotionTier()">➕ 增加藥水組</button>
        </div>
        <div id="potion-tier-list"></div>
        
        <div style="border-top:1px dashed #334155; margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <input type="checkbox" id="chk-auto-blue" ${gameState.botSettings.autoBluePotion ? "checked" : ""} onchange="updateBluePotion(this.checked)">
            <label for="chk-auto-blue">當 MP &le; <input type="number" value="${gameState.botSettings.bluePotionMp || 30}" style="width:40px; text-align:center;" onchange="updateBluePotionMp(this.value)"> % 時，自動使用【藍色藥水】</label>
          </div>
        </div>
      </div>

      <div style="background:#1e293b; padding:8px 10px; border-radius:4px; font-size:12px; display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b>⚡ 持續維持加速效果（常態維持 Buff）</b>
          <button type="button" class="btn btn-gold" style="padding:2px 8px; font-size:11px;" onclick="addBuffGroup()">➕ 增加狀態組</button>
        </div>
        <div id="buff-group-list"></div>
        <div style="border-top:1px dashed #334155; padding-top:6px; margin-top:2px;">
          <input type="checkbox" id="chk-cure-poison" ${gameState.botSettings.curePoison ? "checked" : ""} onchange="updateCurePoison(this.checked)">
          <label for="chk-cure-poison">☑️ 處於中毒狀態時，立即使用【翡翠藥水】解毒</label>
        </div>
      </div>
    </div>

    <!-- 3. ⚔️ 索敵與包圍 -->
    <div class="bot-section" style="border:1px solid #38bdf8; background:rgba(20,25,35,0.85); margin-bottom:12px;">
      <div class="bot-section-title" style="color:#38bdf8; font-size:14px; font-weight:bold; margin-bottom:4px;">
        ⚔️ 3. 戰場索敵與被圍攻處置
      </div>
      <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span>🎯 <b>索敵目標偏好</b>：目標鎖定優先級：</span>
        <select onchange="updateCombatSetting('targetPriority', this.value)" style="background:#0f172a; color:#fff; border:1px solid #475569;">
          <option value="nearest" ${combat.targetPriority === "nearest" ? "selected" : ""}>距離最近優先（減少走位耗時）</option>
          <option value="aggressive_first" ${combat.targetPriority === "aggressive_first" ? "selected" : ""}>主動怪優先（防止累積圍毆）</option>
          <option value="passive_first" ${combat.targetPriority === "passive_first" ? "selected" : ""}>被動怪優先（穩定安全農怪）</option>
        </select>
      </div>
      <div class="setting-item" style="display:flex; justify-content:space-between; align-items:center;">
        <span>🛡️ <b>多怪包圍脫離</b>：同時遭受 &ge; <input type="number" value="${combat.surroundCount || 3}" style="width:40px; text-align:center;" onchange="updateCombatSetting('surroundCount', this.value)"> 隻怪物圍攻時：</span>
        <select onchange="updateCombatSetting('surroundAction', this.value)" style="background:#0f172a; color:#fff; border:1px solid #475569;">
          <option value="teleport" ${combat.surroundAction === "teleport" ? "selected" : ""}>使用【瞬間移動卷軸】飛離</option>
          <option value="home" ${combat.surroundAction === "home" ? "selected" : ""}>使用【傳送回家的卷軸】回城</option>
        </select>
      </div>
    </div>

    <!-- 4. 🏛️ 物資補給、道具處理與自動回城 (全面去步驟化) -->
    <div class="bot-section" style="border:1px solid var(--gold); background:rgba(30,25,15,0.85);">
      <div class="bot-section-title" style="color:var(--gold); font-size:14px; font-weight:bold; margin-bottom:4px;">
        🏛️ 4. 物資補給、道具處理與自動回城（全自動循環關鍵）
      </div>

      <!-- 4-1. 觸發回城機制 -->
      <div style="background:#1e293b; padding:8px 10px; border-radius:4px; font-size:12px; margin-bottom:12px;">
        <b>4-1. 觸發回城機制：</b>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:6px;">
          <div><input type="checkbox" id="trig-no-pot" ${trigger.noRedPot ? "checked" : ""} onchange="updateTriggerSetting('noRedPot', this.checked)"> <label for="trig-no-pot">☑️ 身上【紅色藥水】歸零時，自動回村補給</label></div>
          <div><input type="checkbox" id="trig-no-arr" ${trigger.noArrows ? "checked" : ""} onchange="updateTriggerSetting('noArrows', this.checked)"> <label for="trig-no-arr">☑️ 身上【箭矢】（普通箭與銀箭皆為 0）時，自動回村補給</label></div>
          <div><input type="checkbox" id="trig-heavy" checked disabled> <label>☑️ 身上負重達到 <input type="number" id="cfg-weight-escape" value="${trigger.overweightPercent || 80}" style="width:45px; text-align:center;" onchange="updateTriggerSetting('overweightPercent', this.value)"> % 時，自動回村補給</label></div>
          <div><input type="checkbox" id="trig-death" ${trigger.onDeathOrEscape ? "checked" : ""} onchange="updateTriggerSetting('onDeathOrEscape', this.checked)"> <label for="trig-death">☑️ 死亡復活、逃生回城後，順便執行存倉與變賣</label></div>
        </div>
      </div>

      <!-- 4-2. 集中管理表格：【道具處理一覽】 -->
      <div style="background:#151d2a; border:1px solid #334155; padding:10px; border-radius:4px; margin-bottom:12px;">
        <div style="font-weight:bold; color:var(--gold); font-size:13px; margin-bottom:2px;">▼ 道具處理一覽（集中設定：撿不撿、撿到就賣、存倉保留、從倉庫補給）</div>
        <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">💡 註：每個道具一列；「撿到就賣」與「存倉」為互斥選項，不可同時勾選。已設定者優先置頂。</div>
        
        <div style="display:flex; gap:6px; margin-bottom:8px;">
          <input type="text" id="matrix-search-input" placeholder="🔍 [搜尋道具名稱或地圖掉落物...]" style="flex:1; padding:5px 8px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px;" oninput="renderItemMatrixTable()">
        </div>

        <div style="max-height:280px; overflow-y:auto; border:1px solid #222d3d; border-radius:4px; background:#090d16;">
          <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:center;">
            <thead>
              <tr style="background:#1e293b; color:var(--gold); border-bottom:1px solid #334155; position:sticky; top:0; z-index:5;">
                <th style="padding:6px 8px; text-align:left; width:160px;">道具名稱</th>
                <th style="padding:6px 4px; width:45px;">撿取</th>
                <th style="padding:6px 4px; width:95px;">撿到就賣</th>
                <th style="padding:6px 8px; width:160px;">存倉（保留）</th>
                <th style="padding:6px 4px; width:90px;">從倉庫補給</th>
              </tr>
            </thead>
            <tbody id="item-matrix-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 4-3. 物資補給採買 -->
      <div style="background:#151d2a; border:1px solid #334155; padding:10px; border-radius:4px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
          <span style="font-weight:bold; color:#22c55e; font-size:13px;">【物資補給】：前往雜貨商補齊消耗品至指定數量</span>
          <span style="font-size:11px; color:#aaa;">預算限制：採買後身上金幣不得低於 <input type="number" id="cfg-min-gold" value="${pipe.minGoldFloor || 0}" style="width:65px; text-align:center;" onchange="updateMinGoldFloor(this.value)"> 金幣</span>
        </div>
        <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">前往雜貨商自動補足物資至設定數量（避免破產）。</div>
        <div style="display:flex; gap:6px; margin-bottom:6px;">
          <select id="select-add-buy-item" style="flex:1; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:4px;"></select>
          <span style="font-size:11px; align-self:center;">補足至</span>
          <input type="number" id="input-add-buy-qty" value="80" style="width:55px; text-align:center;" placeholder="數量">
          <button type="button" class="btn btn-gold" onclick="addNewBuyItem()">➕ 加入採買清單</button>
        </div>
        <div id="buy-items-list-container"></div>
      </div>

      <!-- 安全防護說明 (去步驟化) -->
      <div style="font-size:11px; color:#94a3b8; background:#0f172a; padding:8px 12px; border-radius:4px; display:flex; flex-direction:column; gap:4px; border:1px solid #334155;">
        <div>⚠️ <b>【過重安全防護】</b>：回城整備後若負重仍超過上限 (${trigger.overweightPercent || 80}%)，或金幣不足無法補齊物資，自動暫停掛機。</div>
        <div>🚀 <b>【重返獵場】</b>：整備完成後，自動出發返回指定獵場巡邏打怪。</div>
      </div>
    </div>
  `;

  renderPotionTiersList();
  renderBuffGroupsList();
  renderItemMatrixTable();
  renderBuyItemsList();
}

function renderItemMatrixTable() {
  const tbody = document.getElementById("item-matrix-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchText = (document.getElementById("matrix-search-input")?.value || "").trim().toLowerCase();
  const rules = gameState.botSettings.itemRules || {};
  const candidates = getAllCandidateItems();

  candidates.sort((a, b) => {
    const rA = rules[a.name];
    const rB = rules[b.name];
    const aModified = rA && (rA.pick === false || rA.autoSell || rA.store || rA.restockFromStorage || (rA.keep && rA.keep > 0));
    const bModified = rB && (rB.pick === false || rB.autoSell || rB.store || rB.restockFromStorage || (rB.keep && rB.keep > 0));

    if (aModified !== bModified) return bModified ? 1 : -1;
    if (a.inBag !== b.inBag) return b.inBag ? 1 : -1;
    return a.name.localeCompare(b.name, "zh-Hant");
  });

  candidates.forEach(itemData => {
    const itemName = itemData.name;
    if (searchText && !itemName.toLowerCase().includes(searchText)) return;

    const r = rules[itemName] || { pick: true, autoSell: false, store: false, keep: 0, restockFromStorage: false };
    const dbItem = itemData.dbItem || {};
    const priceText = dbItem.price ? `(${Math.max(1, Math.floor(dbItem.price * 0.4))}元)` : "";

    const isNotPicked = (r.pick === false);
    const isAutoSell = !!r.autoSell;
    const isStore = !!r.store;

    const pickChecked = !isNotPicked ? "checked" : "";
    let sellDisabled = isNotPicked || isStore;
    let sellTitle = isNotPicked ? "不撿取已禁用" : (isStore ? "(已設定存倉鎖定)" : "");

    let storeDisabled = isNotPicked || isAutoSell;
    let storeTitle = isNotPicked ? "不撿取已禁用" : (isAutoSell ? "(已設定撿到就賣鎖定)" : "");

    let restockDisabled = isNotPicked || isAutoSell || !isStore;

    const row = document.createElement("tr");
    row.style.borderBottom = "1px solid #1e293b";

    const badgeColor = itemData.inBag ? "#22c55e" : (itemData.isDrop ? "#38bdf8" : "#94a3b8");

    row.innerHTML = `
      <td style="padding:6px 8px; text-align:left;">
        <span style="font-weight:bold; color:${isNotPicked ? '#64748b' : '#e2e8f0'};">${itemName}</span>
        <span style="font-size:10px; color:${badgeColor}; margin-left:4px;">${itemData.source}</span>
      </td>
      <td style="padding:6px 4px;">
        <input type="checkbox" ${pickChecked} onchange="handleMatrixChange('${itemName}', 'pick', this.checked)">
      </td>
      <td style="padding:6px 4px;">
        <input type="checkbox" ${isAutoSell ? "checked" : ""} ${sellDisabled ? "disabled" : ""} title="${sellTitle}" onchange="handleMatrixChange('${itemName}', 'autoSell', this.checked)">
        <span style="font-size:10px; color:${sellDisabled ? '#475569' : '#f59e0b'};">${priceText}</span>
      </td>
      <td style="padding:6px 8px;">
        <div style="display:inline-flex; align-items:center; gap:4px;">
          <input type="checkbox" ${isStore ? "checked" : ""} ${storeDisabled ? "disabled" : ""} title="${storeTitle}" onchange="handleMatrixChange('${itemName}', 'store', this.checked)">
          <span style="font-size:11px; color:${storeDisabled ? '#475569' : '#cbd5e1'};">保留</span>
          <input type="number" value="${r.keep || 0}" min="0" max="9999" style="width:40px; text-align:center; padding:1px 2px;" ${storeDisabled || !isStore ? "disabled" : ""} onchange="handleMatrixChange('${itemName}', 'keep', this.value)">
        </div>
      </td>
      <td style="padding:6px 4px;">
        <input type="checkbox" ${r.restockFromStorage ? "checked" : ""} ${restockDisabled ? "disabled" : ""} onchange="handleMatrixChange('${itemName}', 'restockFromStorage', this.checked)">
      </td>
    `;
    tbody.appendChild(row);
  });
}

function handleMatrixChange(itemName, field, value) {
  if (!gameState.botSettings.itemRules) gameState.botSettings.itemRules = {};
  if (!gameState.botSettings.itemRules[itemName]) {
    gameState.botSettings.itemRules[itemName] = { pick: true, autoSell: false, store: false, keep: 0, restockFromStorage: false };
  }
  const rule = gameState.botSettings.itemRules[itemName];

  if (field === "pick") {
    rule.pick = value;
    if (!value) {
      rule.autoSell = false;
      rule.store = false;
      rule.restockFromStorage = false;
    }
  } else if (field === "autoSell") {
    rule.autoSell = value;
    if (value) {
      rule.store = false;
      rule.restockFromStorage = false;
    }
  } else if (field === "store") {
    rule.store = value;
    if (value) {
      rule.autoSell = false;
    } else {
      rule.restockFromStorage = false;
    }
  } else if (field === "keep") {
    rule.keep = Math.max(0, parseInt(value) || 0);
  } else if (field === "restockFromStorage") {
    rule.restockFromStorage = value;
  }

  saveStrategySettings();
  renderItemMatrixTable();
}

function renderBuyItemsList() {
  const container = document.getElementById("buy-items-list-container");
  const select = document.getElementById("select-add-buy-item");
  if (!container) return;

  container.innerHTML = "";
  const pipe = gameState.botSettings.pipeline;

  if (select) {
    select.innerHTML = `<option value="">選擇補給物資...</option>`;
    if (typeof DB !== "undefined" && DB.items) {
      for (let name in DB.items) {
        const it = DB.items[name];
        if (it.type === "potion" || it.type === "scroll" || it.type === "ammo") {
          select.innerHTML += `<option value="${name}">${name} (${it.price || 50} 金幣)</option>`;
        }
      }
    }
  }

  if (Array.isArray(pipe.buyItems)) {
    pipe.buyItems.forEach((b, idx) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#0f172a; padding:4px 8px; border-radius:4px; margin-bottom:4px; font-size:12px;";
      row.innerHTML = `
        <span>【<b>${b.item}</b>】補足至 <input type="number" value="${b.targetCount}" style="width:55px; text-align:center;" onchange="updateBuyRuleTargetCount(${idx}, this.value)"> 瓶/個</span>
        <button type="button" class="bot-del-btn" onclick="removePipelineBuyItem(${idx})">✕</button>
      `;
      container.appendChild(row);
    });
  }
}

function addNewBuyItem() {
  const select = document.getElementById("select-add-buy-item");
  const qtyInput = document.getElementById("input-add-buy-qty");
  const itemName = select ? select.value : "";
  const count = qtyInput ? (Math.max(1, parseInt(qtyInput.value) || 50)) : 50;

  if (!itemName) return;
  const pipe = gameState.botSettings.pipeline;
  if (!Array.isArray(pipe.buyItems)) pipe.buyItems = [];

  const exist = pipe.buyItems.find(b => b.item === itemName);
  if (exist) {
    exist.targetCount = count;
  } else {
    pipe.buyItems.push({ item: itemName, targetCount: count });
  }
  saveStrategySettings();
  renderBuyItemsList();
}

function updateBuyRuleTargetCount(idx, val) {
  if (Array.isArray(gameState.botSettings.pipeline.buyItems)) {
    gameState.botSettings.pipeline.buyItems[idx].targetCount = Math.max(1, parseInt(val) || 10);
    saveStrategySettings();
  }
}

function removePipelineBuyItem(idx) {
  if (Array.isArray(gameState.botSettings.pipeline.buyItems)) {
    gameState.botSettings.pipeline.buyItems.splice(idx, 1);
    saveStrategySettings();
    renderBuyItemsList();
  }
}

function updateMinGoldFloor(val) {
  gameState.botSettings.pipeline.minGoldFloor = Math.max(0, parseInt(val) || 0);
  saveStrategySettings();
  log(`已更新採買安全金幣底線為：${gameState.botSettings.pipeline.minGoldFloor} 金幣`, "sys");
}

function renderPotionTiersList() {
  const container = document.getElementById("potion-tier-list");
  if (!container) return;
  container.innerHTML = "";

  const pots = Array.isArray(gameState.botSettings.potions) ? gameState.botSettings.potions : [];
  pots.forEach((p, idx) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:4px 8px; border-radius:4px; margin-bottom:4px; font-size:12px;";
    row.innerHTML = `
      <span>當 HP &le; <input type="number" value="${p.hpPercent}" style="width:45px; text-align:center;" onchange="updatePotionTierHp(${idx}, this.value)"> % 時，自動使用【${p.item}】</span>
      ${idx > 0 ? `<button type="button" class="bot-del-btn" onclick="removePotionTier(${idx})">✕</button>` : `<span style="font-size:10px; color:#aaa;">(第 1 組預設)</span>`}
    `;
    container.appendChild(row);
  });
}

function addPotionTier() {
  const availablePots = ["紅色藥水", "澄色藥水", "橙色藥水", "白色藥水"];
  const currentItems = Array.isArray(gameState.botSettings.potions) ? gameState.botSettings.potions.map(p => p.item) : [];
  const nextPot = availablePots.find(p => !currentItems.includes(p)) || "紅色藥水";

  if (!Array.isArray(gameState.botSettings.potions)) gameState.botSettings.potions = [];
  gameState.botSettings.potions.push({ item: nextPot, hpPercent: 40 });
  saveStrategySettings();
  renderPotionTiersList();
}

function updatePotionTierHp(idx, val) {
  if (Array.isArray(gameState.botSettings.potions)) {
    gameState.botSettings.potions[idx].hpPercent = Math.max(5, Math.min(95, parseInt(val) || 50));
    saveStrategySettings();
  }
}

function removePotionTier(idx) {
  if (Array.isArray(gameState.botSettings.potions)) {
    gameState.botSettings.potions.splice(idx, 1);
    saveStrategySettings();
    renderPotionTiersList();
  }
}

function renderBuffGroupsList() {
  const container = document.getElementById("buff-group-list");
  if (!container) return;
  container.innerHTML = "";

  const buffs = Array.isArray(gameState.botSettings.buffs) ? gameState.botSettings.buffs : [];
  buffs.forEach((b, idx) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;";
    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:4px;">
        <input type="checkbox" id="chk-buff-${idx}" ${b.enabled ? "checked" : ""} onchange="updateBuffItemEnabled(${idx}, this.checked)">
        <label for="chk-buff-${idx}">效果結束前 <input type="number" value="${b.advanceSec || 5}" style="width:38px; text-align:center;" onchange="updateBuffItemSec(${idx}, this.value)"> 秒，自動續喝</label>
        <select onchange="updateBuffItemName(${idx}, this.value)" style="background:#0f172a; color:#fff; border:1px solid #475569; border-radius:3px; font-size:11px; padding:2px;">
          <option value="綠色藥水" ${b.item === '綠色藥水' ? 'selected' : ''}>綠色藥水</option>
          <option value="勇敢藥水" ${b.item === '勇敢藥水' ? 'selected' : ''}>勇敢藥水</option>
          <option value="精靈餅乾" ${b.item === '精靈餅乾' ? 'selected' : ''}>精靈餅乾</option>
          <option value="惡魔之血" ${b.item === '惡魔之血' ? 'selected' : ''}>惡魔之血</option>
        </select>
      </div>
      <button type="button" class="bot-del-btn" onclick="removeBuffGroup(${idx})">✕</button>
    `;
    container.appendChild(row);
  });
}

function addBuffGroup() {
  if (!Array.isArray(gameState.botSettings.buffs)) gameState.botSettings.buffs = [];
  gameState.botSettings.buffs.push({ item: "綠色藥水", advanceSec: 5, enabled: true });
  saveStrategySettings();
  renderBuffGroupsList();
}

function updateBuffItemEnabled(idx, checked) {
  if (Array.isArray(gameState.botSettings.buffs)) {
    gameState.botSettings.buffs[idx].enabled = checked;
    saveStrategySettings();
  }
}

function updateBuffItemSec(idx, val) {
  if (Array.isArray(gameState.botSettings.buffs)) {
    gameState.botSettings.buffs[idx].advanceSec = Math.max(1, Math.min(60, parseInt(val) || 5));
    saveStrategySettings();
  }
}

function updateBuffItemName(idx, val) {
  if (Array.isArray(gameState.botSettings.buffs)) {
    gameState.botSettings.buffs[idx].item = val;
    saveStrategySettings();
  }
}

function removeBuffGroup(idx) {
  if (Array.isArray(gameState.botSettings.buffs)) {
    gameState.botSettings.buffs.splice(idx, 1);
    saveStrategySettings();
    renderBuffGroupsList();
  }
}

function updateCurePoison(checked) {
  gameState.botSettings.curePoison = checked;
  saveStrategySettings();
}

function updateSecSetting(key, val) {
  gameState.botSettings.security[key] = (key === "bossAction") ? val : (parseInt(val) || 20);
  saveStrategySettings();
}

function updateCombatSetting(key, val) {
  gameState.botSettings.combat[key] = (key === "surroundCount") ? (parseInt(val) || 3) : val;
  saveStrategySettings();
}

function updateTriggerSetting(key, val) {
  gameState.botSettings.restockTrigger[key] = (typeof val === "boolean") ? val : (parseInt(val) || 80);
  if (key === "overweightPercent") {
    gameState.botSettings.weightLimit = parseInt(val) || 80;
  }
  saveStrategySettings();
}

function updateBluePotion(checked) {
  gameState.botSettings.autoBluePotion = checked;
  saveStrategySettings();
}

function updateBluePotionMp(val) {
  gameState.botSettings.bluePotionMp = Math.max(1, Math.min(99, parseInt(val) || 30));
  saveStrategySettings();
}

// ==========================================================================
// 🎮 仙境傳說 RO 經典「掛機技能 (Auto-Skills)」核心管理函式
// ==========================================================================


// ==========================================================================
// 🎮 仙境傳說 RO 經典「掛機技能 (Auto-Skills)」完整引擎與互動核心
// 100% 像素級還原 RO 內掛介面：攻擊依序、每隻怪只放一次/持續、指定怪、
// 輔助維持、治癒回復、逃生、即時條件滿足提示
// ==========================================================================

// 取得該職業全套可選技能清單 (無論已學或未學皆可預設配置，學會後自動生效)
function getAvailableSkillsForAuto() {
  const charClass = currentChar?.charClass || "elf";
  const learned = (currentChar && Array.isArray(currentChar.skills)) ? currentChar.skills : [];
  const allDb = (typeof DB !== "undefined" && DB.skills) ? DB.skills : {};

  // 各職業經典攻擊技能池
  const classAttackMap = {
    elf: ["三重矢", "極道落雷", "烈炎氣息", "火球術", "冰箭", "風刃", "吸血鬼之吻", "地裂術"],
    mage: ["極道落雷", "火球術", "吸血鬼之吻", "地裂術", "冰雪暴", "究極光裂術", "極光雷電", "寒冰氣息", "燃燒的火球", "起死回生術"],
    knight: ["衝擊之暈"],
    prince: ["火球術", "極道落雷"]
  };

  // 各職業經典輔助技能池
  const classBuffMap = {
    elf: ["魂體轉換", "風之疾走", "暴風神射", "暴風疾馳", "通暢氣脈", "體魄強健", "神聖武器", "鎧甲護持", "淨化精神", "屬性防禦", "鋼鐵防護", "火熱武器", "烈炎武器", "灼熱靈魂"],
    mage: ["聖結界", "通暢氣脈", "體魄強健", "神聖武器", "鎧甲護持", "冥想術", "通透術", "保護罩", "盾牌術", "力量提升", "魔法屏障"],
    knight: ["堅固防護", "反擊屏障", "增幅防禦", "狂暴將軍", "擬似勇氣", "神聖武器", "鎧甲護持"],
    prince: ["精準目標", "皇家血統", "激勵士氣", "神聖武器", "鎧甲護持", "通暢氣脈", "體魄強健"]
  };

  // 各職業回復與解毒
  const healSkills = ["初級治癒術", "中級治癒術", "高級治癒術", "生命的祝福", "生命之泉", "解毒術"];
  // 各職業逃生
  const escapeSkills = ["指定傳送", "世界樹的呼喚"];

  const rawAtk = classAttackMap[charClass] || classAttackMap.elf;
  const rawBuff = classBuffMap[charClass] || classBuffMap.elf;

  // 整理攻擊技能選項 (已學會排前)
  const attackSkills = rawAtk.map(name => ({
    name,
    learned: learned.includes(name),
    data: allDb[name] || {}
  })).sort((a, b) => (b.learned ? 1 : 0) - (a.learned ? 1 : 0));

  // 整理輔助維持技能
  const buffSkills = rawBuff.map(name => ({
    name,
    learned: learned.includes(name),
    data: allDb[name] || {}
  }));

  return { attackSkills, buffSkills, healSkills, escapeSkills };
}

// 渲染 RO 經典掛機技能面板
function renderAutoSkillsSection() {
  initBotStrategyDefaults();
  const auto = gameState.botSettings.autoSkills;
  const attackRules = auto.attackRules || [];
  const { attackSkills, buffSkills, healSkills, escapeSkills } = getAvailableSkillsForAuto();

  const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) || null;
  const mapMobs = mapData?.monsters ? mapData.monsters.map(m => m.name) : ["狼人", "妖魔", "歐克", "骷髏", "地精", "高崙石頭怪"];

  const curMp = currentChar ? (currentChar.mp || 0) : 0;
  const maxMp = currentChar ? Math.max(1, currentChar.maxMp || 1) : 1;
  const curMpPercent = Math.floor((curMp / maxMp) * 100);

  // 1. 攻擊技能卡片 HTML (100% 依截圖格式與即時條件判定)
  let rulesHtml = "";
  if (attackRules.length === 0) {
    rulesHtml = `
      <div style="background:#090d16; border:1px dashed #334155; border-radius:4px; padding:16px; text-align:center; color:#94a3b8; font-size:12px;">
        <div style="color:#e2e8f0; font-weight:bold; margin-bottom:6px;">尚未設定攻擊技能規則</div>
        <div style="margin-bottom:10px;">請於下方選單選擇攻擊技能後點擊【新增規則】，或直接套用職業神技推薦套路。</div>
        <button type="button" class="btn btn-gold" style="padding:4px 14px; font-size:12px;" onclick="applyClassPresetSkills()">
          ⚡ 一鍵導入職業推薦掛機技能
        </button>
      </div>
    `;
  } else {
    attackRules.forEach((rule, idx) => {
      const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[rule.skillName] : null;
      const isEnabled = rule.enabled !== false;
      const minMp = rule.minMpPercent || 0;
      const targetDesc = (rule.targetMobs && rule.targetMobs.length > 0) ? rule.targetMobs.join("、") : "所有怪物 (通用)";
      const isOnce = (rule.mode === "once");
      const ruleLv = rule.lv || 10;
      const isLearned = currentChar && currentChar.skills && currentChar.skills.includes(rule.skillName);

      // 即時狀態判定 (依截圖中的即時提醒)
      let statusText = "✅ 條件皆滿足（優先判定施放）";
      let statusColor = "#4ade80";
      if (!isEnabled) {
        statusText = "⏸️ 規則已停用 (勾選左側方塊即可啟用)";
        statusColor = "#94a3b8";
      } else if (!isLearned) {
        statusText = `⚠️ 尚未習得【${rule.skillName}】（前往村莊向導師學習後將立即生效）`;
        statusColor = "#facc15";
      } else if (curMpPercent < minMp) {
        statusText = `目前不施放: MP ${curMpPercent}% 未達到設定門檻 ${minMp}% (目前 ${curMp}，技能消耗 ${sk ? sk.mpCost : 0})`;
        statusColor = "#f87171";
      } else if (gameState.targetMob && rule.targetMobs && rule.targetMobs.length > 0 && !rule.targetMobs.includes(gameState.targetMob.name)) {
        statusText = `目前不施放: 當前目標【${gameState.targetMob.name}】不在技能的怪物清單中`;
        statusColor = "#94a3b8";
      } else if (isOnce && gameState.targetMob && gameState.targetMob._castOnceSkills && gameState.targetMob._castOnceSkills[rule.skillName]) {
        statusText = `目前不施放: 已對目標【${gameState.targetMob.name}】完成一次施放，換新怪前不再施展`;
        statusColor = "#facc15";
      } else if (rule.skillName && typeof canUseSkill === "function" && !canUseSkill(rule.skillName)) {
        const cdSec = (typeof getSkillCooldownRemaining === "function") ? (getSkillCooldownRemaining(rule.skillName) / 1000).toFixed(1) : 1;
        statusText = `⏳ 技能冷卻中 (剩餘 ${cdSec} 秒)`;
        statusColor = "#38bdf8";
      }

      // 指定怪物標籤 Pills
      let mobsPillsHtml = "";
      if (rule.targetMobs && rule.targetMobs.length > 0) {
        mobsPillsHtml = rule.targetMobs.map(mName => `
          <span class="ro-mob-tag">
            ${mName}
            <span class="tag-close" onclick="removeMobFromAttackRule(${idx}, '${mName}')">✕</span>
          </span>
        `).join("");
      }

      // 未加入當前地圖的怪物選單
      const unselectedMobs = mapMobs.filter(m => !rule.targetMobs || !rule.targetMobs.includes(m));
      const mobOptions = unselectedMobs.map(m => `<option value="${m}">${m}</option>`).join("");

      // 連鎖技能可選選單
      const chainOptions = attackSkills.map(s => `
        <option value="${s.name}" ${rule.chainSkill === s.name ? 'selected' : ''}>
          ${s.name}
        </option>
      `).join("");

      // 技能圖標 HTML
      const iconKey = sk ? sk.iconKey : null;
      let iconHtml = "⚔️";
      if (typeof getSkillIconHtml === "function" && iconKey) {
        iconHtml = getSkillIconHtml(iconKey);
      }

      rulesHtml += `
        <div class="ro-rule-card ${isEnabled ? '' : 'disabled'}">
          <!-- 行 1：主要控制列 (勾選, 圖示, 名稱, Lv, MP門檻, 施放模式, 連招, 排序, 刪除) -->
          <div class="ro-rule-row-main">
            <div class="ro-rule-title-group">
              <input type="checkbox" id="chk-rule-${idx}" ${isEnabled ? 'checked' : ''} onchange="toggleAttackRuleEnabled(${idx}, this.checked)">
              <div class="ro-skill-mini-icon">
                ${iconHtml}
              </div>
              <label for="chk-rule-${idx}" style="cursor:pointer; font-weight:bold; color:#fff; font-size:13px;">
                ${rule.skillName}
              </label>
            </div>

            <div class="ro-rule-controls">
              

              <span style="margin-left:4px;">MP &ge;</span>
              <input type="number" min="0" max="100" value="${minMp}" style="width:40px; text-align:center;" onchange="updateAutoAttackRuleProp(${idx}, 'minMpPercent', this.value)">
              <span>%</span>

              <select onchange="updateAutoAttackRuleProp(${idx}, 'mode', this.value)" style="margin-left:4px;">
                <option value="once" ${rule.mode === 'once' ? 'selected' : ''}>每隻怪只放一次</option>
                <option value="always" ${rule.mode === 'always' ? 'selected' : ''}>持續施放 (CD好就放)</option>
              </select>

              <span style="margin-left:4px;">接著施放</span>
              <select onchange="updateAutoAttackRuleProp(${idx}, 'chainSkill', this.value)">
                <option value="">(不接)</option>
                ${chainOptions}
              </select>

              <button type="button" class="ro-btn-icon" title="上移" onclick="moveAutoAttackRule(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button type="button" class="ro-btn-icon" title="下移" onclick="moveAutoAttackRule(${idx}, 1)" ${idx === attackRules.length - 1 ? 'disabled' : ''}>▼</button>
              <button type="button" class="ro-btn-icon ro-btn-del" title="刪除規則" onclick="removeAutoAttackRule(${idx})">✕</button>
            </div>
          </div>

          <!-- 行 2：對象摘要說明 -->
          <div style="font-size:11.5px; color:#cbd5e1; padding:2px 2px 0 2px;">
            對象: <b style="color:#fde047;">${targetDesc}</b> &rarr; <span style="color:#60a5fa; font-weight:bold;">${rule.skillName}</span> <span style="color:#94a3b8; font-size:11px;">(怪物、屬性等可在下方「條件」調整)</span>
          </div>

          <!-- 行 3：即時狀態動態提示 (仿 RO 即時提示) -->
          <div class="ro-rule-status-line" style="color:${statusColor};">
            ${statusText}
          </div>

          <!-- 行 4：條件折疊清單 (只對這些怪物 / +加入怪物) -->
          <div class="ro-rule-conditions">
            <span style="color:#93c5fd; font-weight:bold;">▼ 條件 (${(rule.targetMobs && rule.targetMobs.length) ? rule.targetMobs.length : '全部'} 項，全部成立才施放)</span>
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-top:4px; width:100%;">
              <span style="color:#cbd5e1;">只對這些怪物:</span>
              ${mobsPillsHtml ? mobsPillsHtml : '<span style="color:#94a3b8; font-style:italic;">所有怪物 (未特別限定)</span>'}

              <select style="background:#1e293b; color:#fff; border:1px solid #475569; font-size:11px; padding:1px 4px; border-radius:3px;" onchange="if(this.value){addMobToAttackRule(${idx}, this.value); this.value='';}">
                <option value="">+ 加入指定怪...</option>
                ${mobOptions}
              </select>
            </div>
          </div>
        </div>
      `;
    });
  }

  // 2. 新增規則下拉選單 HTML (列出所有可用攻擊技能，已學會排前)
  const addSkillOptions = attackSkills.map(s => `
    <option value="${s.name}">
      ${s.learned ? '✓ [已習得]' : '✕ [未習得]'} ${s.name} (MP:${s.data?.mpCost || 0})
    </option>
  `).join("");

  // 新增對象選單 (所有怪物 或 當前地圖怪物)
  const targetMobSelectOptions = [
    '<option value="all">所有怪物 (通用設定)</option>',
    ...mapMobs.map(m => `<option value="${m}">特定怪物：${m}</option>`)
  ].join("");

  // 3. 輔助與設置技能維持 HTML (仿 RO 截圖)
  let buffItemsHtml = buffSkills.map(b => {
    const bName = b.name;
    const bRule = auto.buffRules[bName] || { enabled: false, minMpPercent: 20 };
    const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[bName] : null;
    const isBuffActive = currentChar && currentChar.activeBuffs && currentChar.activeBuffs[bName] && currentChar.activeBuffs[bName] > Date.now();
    const remainSec = isBuffActive ? Math.ceil((currentChar.activeBuffs[bName] - Date.now()) / 1000) : 0;
    const isLearned = b.learned;

    let iconHtml = "⚡";
    if (typeof getSkillIconHtml === "function" && sk?.iconKey) {
      iconHtml = getSkillIconHtml(sk.iconKey);
    }

    return `
      <div class="ro-buff-item ${isLearned ? '' : 'unlearned'}">
        <div style="display:flex; align-items:center; gap:6px;">
          <input type="checkbox" id="chk-buff-sk-${bName}" ${bRule.enabled ? 'checked' : ''} onchange="toggleAutoBuffSkill('${bName}', this.checked)">
          <div class="ro-skill-mini-icon" style="width:20px; height:20px;">
            ${iconHtml}
          </div>
          <label for="chk-buff-sk-${bName}" style="cursor:pointer; color:#f8fafc; font-weight:bold; font-size:12px;">
            ${bName}
          </label>
          ${isLearned ? '' : '<span style="font-size:10px; color:#facc15;">(未習得)</span>'}
        </div>
        <div style="display:flex; align-items:center; gap:4px; font-size:11px;">
          <span>MP &ge;</span>
          <input type="number" min="0" max="100" value="${bRule.minMpPercent || 20}" style="width:36px; text-align:center; background:#090d16; color:#fff; border:1px solid #475569; border-radius:2px;" onchange="updateAutoBuffMinMp('${bName}', this.value)">
          <span>%</span>
          <span style="font-size:11px; font-weight:bold; color:${isBuffActive ? '#4ade80' : '#64748b'}; min-width:28px; text-align:right;">
            ${isBuffActive ? `${remainSec}s` : '無'}
          </span>
        </div>
      </div>
    `;
  }).join("");

  // 4. 回復技能 HTML (初治/中治/高治/生祝, 解毒)
  const healRules = auto.healRules || { enabled: true, skillName: "auto", hpThreshold: 70, minMpPercent: 10, autoCurePoison: true };

  // 5. 逃生技能 HTML (指定傳送 / 世界樹的呼喚)
  const escapeRules = auto.escapeRules || { enabled: true, skillName: "指定傳送", hpThreshold: 20 };

  return `
    <div class="ro-skill-panel">
      <!-- 經典 RO 藍色頂部標題列 -->
      <div class="ro-skill-header" onclick="toggleAutoSkillsBody()" style="cursor:pointer;" title="點擊折疊/展開掛機技能">
        <h3><span>▼ 掛機技能</span></h3>
        <span class="ro-count-badge">已設定 ${attackRules.length}/20 筆（停用規則也占一筆）</span>
      </div>

      <div id="ro-skill-body">
        <!-- 區塊 1：攻擊技能 (依順序) -->
        <div style="margin-bottom:12px;">
          <div class="ro-section-subhead">
            <span>攻擊技能（依順序）</span>
          </div>
          <div class="ro-rule-list">
            ${rulesHtml}
          </div>

          <!-- 🎮 新增規則操作控制橫條 (100% 依截圖原樣打造) -->
          <div class="ro-add-bar-ro">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
              <span style="color:#cbd5e1; font-size:12px;">對</span>
              <select id="sel-add-attack-target" style="min-width:160px;">
                ${targetMobSelectOptions}
              </select>

              <select id="sel-add-attack-skill" style="min-width:180px;">
                <option value="">-- 選擇攻擊技能 --</option>
                ${addSkillOptions}
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              

              <select id="sel-add-attack-mode">
                <option value="once">每隻怪只放一次</option>
                <option value="always">持續施放</option>
              </select>

              <button type="button" class="btn btn-gold" style="padding:4px 14px; font-weight:bold; font-size:12px;" onclick="addAutoAttackRule()">
                ➕ 新增規則
              </button>

              <button type="button" class="btn" style="padding:4px 10px; font-size:11px; margin-left:auto;" onclick="applyClassPresetSkills()">
                ⚡ 一鍵導入職業推薦配置
              </button>
            </div>
          </div>

          <!-- 說明文字 (100% 還原截圖) -->
          <div class="ro-desc-text">
            同技能可新增多條，分別指定怪物與等級；依順序逢第一條符合的設定。專用規則放前面，通用規則放最後，否則通用規則會先被選中。<br>
            MP &ge; 百分比是額外施放門檻；設為 0% 仍須付得起技能的 MP 消耗。<br>
            只放一次以對鎖定目標完成施放計次；被打斷不計，未命中、抵抗或偷竊失敗仍算一次，換成新怪物可再放。範圍技也以鎖定目標計次，持續施放仍受 MP、延遲及條件限制。只用技能模式若全部一次性規則已用完，會依設定回復/逃生，不用普攻。
          </div>
        </div>

        <!-- 區塊 2：下方三大並列功能區 (輔助與設置、回復、逃生) -->
        <div class="ro-tri-grid">
          <!-- 2-1 輔助與設置技能（自動維持） -->
          <div class="ro-col-box">
            <div class="ro-col-title">輔助與設置技能 (自動維持)</div>
            <div class="ro-col-desc">
              依施放者 MP 下限與增益剩餘時間補放，不要求 HP 降低；空白 MP 下限代表不額外限制，仍需付得起實際消耗。進階條件可另設 MP 上限及 HP 條件。
            </div>
            <div class="ro-buff-grid">
              ${buffItemsHtml}
            </div>
          </div>

          <!-- 2-2 回復技能 -->
          <div class="ro-col-box">
            <div class="ro-col-title">回復技能</div>
            <div class="ro-col-desc">
              治癒術在 HP 低於門檻時反覆回復；輔助技能在效果到期後補放。兩者都需要足夠 MP，負重達 50% 時無法自然回復 MP。治癒術、復活術、光耀之堂也可加入攻擊技能；回復設定仍用於自己與隊友。
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
              <div class="ro-check-row">
                <input type="checkbox" id="chk-auto-heal" ${healRules.enabled ? 'checked' : ''} onchange="updateAutoHealSetting('enabled', this.checked)">
                <label for="chk-auto-heal">
                  <b>💖 緊急治癒 / 治癒術自補</b>
                </label>
              </div>
              <div style="padding-left:22px; font-size:11px; color:#cbd5e1; display:flex; flex-direction:column; gap:4px;">
                <div>
                  當 HP &le; <input type="number" min="10" max="95" value="${healRules.hpThreshold || 70}" style="width:40px; text-align:center; background:#090d16; color:#fff; border:1px solid #475569;" onchange="updateAutoHealSetting('hpThreshold', this.value)"> % 時自動反覆回復
                </div>
                <div>
                  保留 MP &ge; <input type="number" min="0" max="90" value="${healRules.minMpPercent || 10}" style="width:38px; text-align:center; background:#090d16; color:#fff; border:1px solid #475569;" onchange="updateAutoHealSetting('minMpPercent', this.value)"> % 才施放 (初/中/高治/生祝)
                </div>
              </div>

              <div class="ro-check-row" style="border-top:1px dashed #334155; padding-top:6px; margin-top:4px;">
                <input type="checkbox" id="chk-auto-cure-poison" ${healRules.autoCurePoison ? 'checked' : ''} onchange="updateAutoHealSetting('autoCurePoison', this.checked)">
                <label for="chk-auto-cure-poison">
                  <b>🌿 解毒 (處於中毒狀態時施放【解毒術】)</b>
                </label>
              </div>
            </div>
          </div>

          <!-- 2-3 逃生技能 -->
          <div class="ro-col-box">
            <div class="ro-col-title">逃生技能</div>
            <div class="ro-col-desc">
              瞬間移動已學會或穿戴授予技能的裝備。勾選加入逃生規則後，還要按「套用設定」；筆數已滿時請先移除其他規則。
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
              <div class="ro-check-row">
                <input type="checkbox" id="chk-auto-escape" ${escapeRules.enabled ? 'checked' : ''} onchange="updateAutoEscapeSetting('enabled', this.checked)">
                <label for="chk-auto-escape">
                  <b>🚪 緊急逃生技能</b>
                </label>
              </div>
              <div style="padding-left:22px; font-size:11px; color:#cbd5e1; display:flex; flex-direction:column; gap:6px;">
                <div>
                  當 HP &le; <input type="number" min="5" max="50" value="${escapeRules.hpThreshold || 20}" style="width:40px; text-align:center; background:#090d16; color:#fff; border:1px solid #475569;" onchange="updateAutoEscapeSetting('hpThreshold', this.value)"> % 時施展逃生技能
                </div>
                <div style="display:flex; align-items:center; gap:4px;">
                  <span>使用技能：</span>
                  <select onchange="updateAutoEscapeSetting('skillName', this.value)" style="background:#090d16; color:#fff; border:1px solid #475569; font-size:11px; padding:2px 4px;">
                    <option value="指定傳送" ${escapeRules.skillName === '指定傳送' ? 'selected' : ''}>指定傳送 (隨機飛離)</option>
                    <option value="世界樹的呼喚" ${escapeRules.skillName === '世界樹的呼喚' ? 'selected' : ''}>世界樹的呼喚 (妖精返航母樹)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最底部規範列 (100% 依截圖原文字樣) -->
        <div class="ro-order-footer">
          <b>判斷順序：</b>逃生 &rarr; 回復（與喝水的先後可在「回復」設定）&rarr; 坐下 &rarr; 輔助 &rarr; 攻擊（依清單順序，逢第一個符合條件的）&rarr; 普通攻擊。組隊時，治癒術、祝福、加速術等可以對別人使用的技能也會幫同一地圖一起掛機的隊友補。最多 20 個。MP 不足、冷卻中、武器不符時跳過；詠唱中被攻擊會中斷，已扣的 MP 不退還。
        </div>
      </div>
    </div>
  `;
}

// 切換折疊/展開掛機技能面板
function toggleAutoSkillsBody() {
  const body = document.getElementById("ro-skill-body");
  if (!body) return;
  body.style.display = (body.style.display === "none") ? "block" : "none";
}

// 🎮 新增攻擊技能規則 (支援指定怪、施放等級、模式)
function addAutoAttackRule() {
  initBotStrategyDefaults();
  const selTarget = document.getElementById("sel-add-attack-target");
  const selSkill = document.getElementById("sel-add-attack-skill");
  const selMode = document.getElementById("sel-add-attack-mode");
  const selLv = document.getElementById("sel-add-attack-lv");

  const skillName = selSkill ? selSkill.value : "";
  if (!skillName) {
    alert("⚠️ 請先於下拉選單中選擇要新增的攻擊技能！");
    return;
  }

  const targetVal = selTarget ? selTarget.value : "";
  const targetMobs = (targetVal && targetVal !== "all") ? [targetVal] : [];
  const mode = selMode ? selMode.value : "once";
  const lv = parseInt(selLv ? selLv.value : 10) || 10;

  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules.length >= 20) {
    alert("⚠️ 攻擊技能規則已達 20 筆上限！請先移除其他規則再新增。");
    return;
  }

  rules.push({
    id: "atk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    skillName: skillName,
    minMpPercent: 20,
    mode: mode,
    chainSkill: "",
    enabled: true,
    targetMobs: targetMobs
  });

  saveStrategySettings();
  renderStrategyTab();
  log(`➕ 已新增掛機攻擊技能規則：【${skillName}】${targetMobs.length ? ` (對象: ${targetMobs.join(",")})` : " (對象: 所有怪物)"}`, "sys");
}

// 切換規則開關
function toggleAttackRuleEnabled(idx, checked) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules && rules[idx]) {
    rules[idx].enabled = checked;
    saveStrategySettings();
    renderStrategyTab();
  }
}

// 移除攻擊規則
function removeAutoAttackRule(idx) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules && rules[idx]) {
    const rmName = rules[idx].skillName;
    rules.splice(idx, 1);
    saveStrategySettings();
    renderStrategyTab();
    log(`🗑️ 已移除掛機技能規則：【${rmName}】`, "sys");
  }
}

// 調整優先順序 (▲ / ▼)
function moveAutoAttackRule(idx, dir) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  const targetIdx = idx + dir;
  if (rules && targetIdx >= 0 && targetIdx < rules.length) {
    const tmp = rules[idx];
    rules[idx] = rules[targetIdx];
    rules[targetIdx] = tmp;
    saveStrategySettings();
    renderStrategyTab();
  }
}

// 更新規則屬性 (lv, minMpPercent, mode, chainSkill)
function updateAutoAttackRuleProp(idx, prop, val) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules && rules[idx]) {
    if (prop === "minMpPercent" || prop === "lv") {
      rules[idx][prop] = Math.max(0, parseInt(val) || 0);
    } else {
      rules[idx][prop] = val;
    }
    saveStrategySettings();
  }
}

// 為某條規則增加指定怪物
function addMobToAttackRule(idx, mobName) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules && rules[idx] && mobName) {
    if (!Array.isArray(rules[idx].targetMobs)) rules[idx].targetMobs = [];
    if (!rules[idx].targetMobs.includes(mobName)) {
      rules[idx].targetMobs.push(mobName);
      saveStrategySettings();
      renderStrategyTab();
    }
  }
}

// 為某條規則移除指定怪物
function removeMobFromAttackRule(idx, mobName) {
  const rules = gameState.botSettings.autoSkills.attackRules;
  if (rules && rules[idx] && Array.isArray(rules[idx].targetMobs)) {
    rules[idx].targetMobs = rules[idx].targetMobs.filter(m => m !== mobName);
    saveStrategySettings();
    renderStrategyTab();
  }
}

// 輔助技能切換
function toggleAutoBuffSkill(skillName, checked) {
  initBotStrategyDefaults();
  if (!gameState.botSettings.autoSkills.buffRules[skillName]) {
    gameState.botSettings.autoSkills.buffRules[skillName] = { enabled: checked, minMpPercent: 20 };
  } else {
    gameState.botSettings.autoSkills.buffRules[skillName].enabled = checked;
  }
  saveStrategySettings();
  renderStrategyTab();
}

// 輔助技能最低 MP 門檻
function updateAutoBuffMinMp(skillName, val) {
  initBotStrategyDefaults();
  if (!gameState.botSettings.autoSkills.buffRules[skillName]) {
    gameState.botSettings.autoSkills.buffRules[skillName] = { enabled: true, minMpPercent: 20 };
  }
  gameState.botSettings.autoSkills.buffRules[skillName].minMpPercent = Math.max(0, Math.min(100, parseInt(val) || 0));
  saveStrategySettings();
}

// 回復技能設定
function updateAutoHealSetting(prop, val) {
  initBotStrategyDefaults();
  if (prop === "hpThreshold" || prop === "minMpPercent") {
    gameState.botSettings.autoSkills.healRules[prop] = Math.max(0, Math.min(100, parseInt(val) || 50));
  } else {
    gameState.botSettings.autoSkills.healRules[prop] = val;
  }
  saveStrategySettings();
  renderStrategyTab();
}

// 逃生技能設定
function updateAutoEscapeSetting(prop, val) {
  initBotStrategyDefaults();
  if (prop === "hpThreshold") {
    gameState.botSettings.autoSkills.escapeRules[prop] = Math.max(5, Math.min(90, parseInt(val) || 20));
  } else {
    gameState.botSettings.autoSkills.escapeRules[prop] = val;
  }
  saveStrategySettings();
  renderStrategyTab();
}

// ⚡ 一鍵導入職業推薦經典神技配置
function applyClassPresetSkills() {
  initBotStrategyDefaults();
  const cClass = currentChar?.charClass || "elf";

  if (cClass === "elf") {
    gameState.botSettings.autoSkills.attackRules = [
      { id: "atk_preset_1", skillName: "三重矢", minMpPercent: 20, mode: "always", chainSkill: "", enabled: true, targetMobs: [] },
      { id: "atk_preset_2", skillName: "極道落雷", lv: 10, minMpPercent: 35, mode: "always", chainSkill: "", enabled: true, targetMobs: [] }
    ];
    gameState.botSettings.autoSkills.buffRules = {
      "魂體轉換": { enabled: true, minMpPercent: 20 },
      "風之疾走": { enabled: true, minMpPercent: 15 },
      "暴風神射": { enabled: true, minMpPercent: 20 },
      "通暢氣脈": { enabled: true, minMpPercent: 15 },
      "體魄強健": { enabled: true, minMpPercent: 15 }
    };
    gameState.botSettings.autoSkills.healRules = {
      enabled: true,
      skillName: "auto",
      hpThreshold: 70,
      minMpPercent: 10,
      autoCurePoison: true
    };
    gameState.botSettings.autoSkills.escapeRules = {
      enabled: true,
      skillName: "世界樹的呼喚",
      hpThreshold: 20
    };
  } else if (cClass === "knight") {
    gameState.botSettings.autoSkills.attackRules = [
      { id: "atk_preset_k1", skillName: "衝擊之暈", lv: 10, minMpPercent: 15, mode: "once", chainSkill: "", enabled: true, targetMobs: [] }
    ];
    gameState.botSettings.autoSkills.buffRules = {
      "堅固防護": { enabled: true, minMpPercent: 20 },
      "反擊屏障": { enabled: true, minMpPercent: 25 },
      "增幅防禦": { enabled: true, minMpPercent: 20 },
      "擬似勇氣": { enabled: true, minMpPercent: 15 }
    };
    gameState.botSettings.autoSkills.healRules = {
      enabled: true,
      skillName: "auto",
      hpThreshold: 60,
      minMpPercent: 10,
      autoCurePoison: true
    };
    gameState.botSettings.autoSkills.escapeRules = {
      enabled: true,
      skillName: "指定傳送",
      hpThreshold: 20
    };
  } else {
    // 法師 / 王族
    gameState.botSettings.autoSkills.attackRules = [
      { id: "atk_preset_m1", skillName: "極道落雷", lv: 10, minMpPercent: 30, mode: "always", chainSkill: "吸血鬼之吻", enabled: true, targetMobs: [] },
      { id: "atk_preset_m2", skillName: "火球術", lv: 10, minMpPercent: 20, mode: "always", chainSkill: "", enabled: true, targetMobs: [] }
    ];
    gameState.botSettings.autoSkills.buffRules = {
      "聖結界": { enabled: true, minMpPercent: 20 },
      "通暢氣脈": { enabled: true, minMpPercent: 15 },
      "體魄強健": { enabled: true, minMpPercent: 15 },
      "神聖武器": { enabled: true, minMpPercent: 10 },
      "鎧甲護持": { enabled: true, minMpPercent: 10 }
    };
    gameState.botSettings.autoSkills.healRules = {
      enabled: true,
      skillName: "auto",
      hpThreshold: 75,
      minMpPercent: 10,
      autoCurePoison: true
    };
    gameState.botSettings.autoSkills.escapeRules = {
      enabled: true,
      skillName: "指定傳送",
      hpThreshold: 20
    };
  }

  saveStrategySettings();
  renderStrategyTab();
  log("⚡ 已為您一鍵配置職業經典神技掛機組合！", "sys");
}

window.renderAutoSkillsSection = renderAutoSkillsSection;
window.toggleAutoSkillsBody = toggleAutoSkillsBody;
window.addAutoAttackRule = addAutoAttackRule;
window.toggleAttackRuleEnabled = toggleAttackRuleEnabled;
window.removeAutoAttackRule = removeAutoAttackRule;
window.moveAutoAttackRule = moveAutoAttackRule;
window.updateAutoAttackRuleProp = updateAutoAttackRuleProp;
window.addMobToAttackRule = addMobToAttackRule;
window.removeMobFromAttackRule = removeMobFromAttackRule;
window.toggleAutoBuffSkill = toggleAutoBuffSkill;
window.updateAutoBuffMinMp = updateAutoBuffMinMp;
window.updateAutoHealSetting = updateAutoHealSetting;
window.updateAutoEscapeSetting = updateAutoEscapeSetting;
window.applyClassPresetSkills = applyClassPresetSkills;
