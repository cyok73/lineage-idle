// js/inventory.js - 依規格書 Master v3.1 實作五組過濾器、自訂數量存倉、商店與野外倉庫嚴格鎖定
let currentEnchantScrollIdx = null;

function isStackableItem(dbItem) {
  if (!dbItem) return false;
  return (
    dbItem.type === "potion" ||
    dbItem.type === "scroll" ||
    dbItem.type === "enchant_w" ||
    dbItem.type === "enchant_a" ||
    dbItem.type === "ammo" ||
    dbItem.type === "mat" ||
    dbItem.type === "spellbook" ||
    dbItem.type === "etc"
  );
}

function sanitizeInventoryAndEquipped(targetChar) {
  const char = targetChar || currentChar;
  if (!char || typeof char !== "object") return;

  const defaultEquipped = {
    weapon: null, body: null, head: null, shield: null, cloak: null,
    glove: null, boots: null, necklace: null, earring: null, ring1: null, ring2: null, belt: null
  };

  if (!char.equipped || typeof char.equipped !== "object") {
    char.equipped = { ...defaultEquipped };
  } else {
    for (let slot in defaultEquipped) {
      if (char.equipped[slot] === undefined) char.equipped[slot] = null;
    }
  }

  if (!Array.isArray(char.inventory)) char.inventory = [];
  if (!Array.isArray(char.storage)) char.storage = [];

  const stackedInventory = [];
  char.inventory.forEach(item => {
    if (!item || !item.name) return;
    const dbItem = DB.items ? DB.items[item.name] : null;
    if (dbItem && (dbItem.type === "weapon" || dbItem.type === "armor" || dbItem.type === "accessory")) {
      const count = item.count || 1;
      for (let k = 0; k < count; k++) {
        stackedInventory.push({
          uid: item.uid || (typeof generateUid === "function" ? generateUid() : "eq_" + Date.now() + "_" + Math.random()),
          name: item.name,
          enchant: item.enchant || 0,
          count: 1
        });
      }
    } else {
      const exist = stackedInventory.find(i => i.name === item.name);
      if (exist && isStackableItem(dbItem)) {
        exist.count = (exist.count || 1) + (item.count || 1);
      } else {
        stackedInventory.push({ ...item, count: item.count || 1, enchant: item.enchant || 0 });
      }
    }
  });

  // 🚨 新手初始背包補給：若背包無任何道具，自動發放冒險初期物資
  if (stackedInventory.length === 0 && (!char.level || char.level <= 5)) {
    const isElf = char.charClass === "elf";
    const starterPack = [
      { name: "紅色藥水", count: 80 },
      { name: "澄色藥水", count: 10 },
      { name: "傳送回家的卷軸", count: 10 },
      { name: "瞬間移動卷軸", count: 30 },
      { name: "對武器施法的卷軸", count: 2 },
      { name: "對防具施法的卷軸", count: 2 }
    ];
    if (isElf) {
      starterPack.push({ name: "箭", count: 1000 }, { name: "銀箭", count: 500 });
    }
    stackedInventory.push(...starterPack);
  }

  char.inventory = stackedInventory;
  // 嚴格清洗非對應職業之技能 (保留本職業專屬與通用正統魔法)
  if (Array.isArray(char.skills)) {
    const charCls = char.charClass || "prince";
    char.skills = char.skills.filter(sn => {
      const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[sn] : null;
      if (!sk) return false;
      if (typeof isSkillMatchClass === "function") return isSkillMatchClass(sk, charCls);
      return sk.school === charCls || sk.school === "common" || sk.category === "common" || (charCls === "mage" && sk.school === "mage");
    });
  }

  return char;
}

function processLootFilter(itemName, count = 1) {
  const dbItem = DB.items[itemName];
  if (!dbItem) {
    addItemToInventory(itemName, count);
    return;
  }

  const tier = dbItem.tier || "white";
  const group1Mode = document.getElementById("cfg-filter-group1")?.value || "autosell_on_heavy";

  if (tier === "white" && (dbItem.type === "weapon" || dbItem.type === "armor")) {
    if (group1Mode === "always_sell" || (group1Mode === "autosell_on_heavy" && getCurrentWeightPercent() >= 75)) {
      const unitPrice = Math.max(1, Math.floor(dbItem.price * 0.4));
      const totalEarn = unitPrice * count;
      currentChar.gold += totalEarn;
      log(`💰【組1 過濾】拾獲普通裝備【${itemName}】，已就地自動折現獲得 ${totalEarn} 金幣！`, "drop");
      return;
    }
    addItemToInventory(itemName, count);
    log(`✨ 拾獲普通裝備：${itemName} x${count}`, "drop");
    return;
  }

  if (tier === "green") {
    addItemToInventory(itemName, count);
    log(`🟢【組2 良品】獲得綠色裝備【${itemName}】！(已標記回村優先存倉)`, "drop");
    return;
  }

  if (tier === "blue" || tier === "red") {
    depositItemDirectlyToStorage({ uid: generateUid(), name: itemName, count: count, enchant: 0 });
    log(`🔥【全服廣播】驚世神兵降世！恭喜獲得【${itemName}】！(已自動安全存入倉庫)`, "drop");
    alert(`🎉 恭喜擊殺強大頭目，獲得稀世珍寶：【${itemName}】！\n已由系統第一時間保護性直送個人倉庫！`);
    saveAccountData();
    return;
  }

  addItemToInventory(itemName, count);
  log(`✨ 獲得戰利品：${itemName} x${count}`, "drop");
}

function depositItemDirectlyToStorage(itemObj) {
  if (!currentChar.storage) currentChar.storage = [];
  const dbItem = DB.items[itemObj.name];
  if (isStackableItem(dbItem)) {
    const exist = currentChar.storage.find(s => s.name === itemObj.name);
    if (exist) exist.count = (exist.count || 1) + (itemObj.count || 1);
    else currentChar.storage.push(itemObj);
  } else {
    currentChar.storage.push(itemObj);
  }
}

function addItemToInventory(name, count = 1) {
  const dbItem = DB.items[name];
  const stackable = isStackableItem(dbItem);

  if (stackable) {
    const exist = currentChar.inventory.find(i => i.name === name);
    if (exist) {
      exist.count = (exist.count || 1) + count;
    } else {
      currentChar.inventory.push({ name, count, enchant: 0 });
    }
  } else {
    for (let i = 0; i < count; i++) {
      currentChar.inventory.push({ uid: generateUid(), name, count: 1, enchant: 0 });
    }
  }

  if (typeof updateStrategySelects === "function") {
    updateStrategySelects();
  }
}

function hasItem(name) {
  return currentChar.inventory.some(i => i.name === name && (i.count || 1) > 0);
}

function isScrollCooldownItem(name) {
  return name === "瞬間移動卷軸" || name === "傳送回家的卷軸";
}

function getScrollCooldownRemaining(name) {
  if (!gameState.scrollCooldowns) gameState.scrollCooldowns = {};
  const until = gameState.scrollCooldowns[name] || 0;
  return Math.max(0, until - Date.now());
}

function canUseScroll(name) {
  return getScrollCooldownRemaining(name) <= 0;
}

function markScrollUsed(name) {
  if (!gameState.scrollCooldowns) gameState.scrollCooldowns = {};
  gameState.scrollCooldowns[name] = Date.now() + 2000;
}

function useItemByName(name) {
  if (isScrollCooldownItem(name) && !canUseScroll(name)) {
    const remain = Math.ceil(getScrollCooldownRemaining(name) / 1000);
    log(`⏳【卷軸冷卻中】${name} 需等待 ${remain} 秒後才能再次使用。`, "sys");
    return false;
  }
  const idx = currentChar.inventory.findIndex(i => i.name === name && (i.count || 1) > 0);
  if (idx !== -1) {
    useItemByIndex(idx);
    return true;
  }
  return false;
}

function useItemByIndex(idx) {
  const item = currentChar.inventory[idx];
  if (!item) return;

  if (isScrollCooldownItem(item.name) && !canUseScroll(item.name)) {
    const remain = Math.ceil(getScrollCooldownRemaining(item.name) / 1000);
    log(`⏳【卷軸冷卻中】${item.name} 需等待 ${remain} 秒後才能再次使用。`, "sys");
    return;
  }

  const dbItem = DB.items[item.name];

  if (dbItem && (dbItem.type === "enchant_w" || dbItem.type === "enchant_a")) {
    openEnchantModal(idx);
    return;
  }

  if (item.name === "紅色藥水") {
    const heal = Math.floor(Math.random() * 16) + 35;
    currentChar.hp = Math.min(currentChar.maxHp, currentChar.hp + heal);
    log(`咕嚕咕嚕... 使用紅色藥水，HP +${heal}`, "heal");
  } else if (item.name === "澄色藥水" || item.name === "橙色藥水") {
    const heal = Math.floor(Math.random() * 21) + 70;
    currentChar.hp = Math.min(currentChar.maxHp, currentChar.hp + heal);
    log(`使用澄色藥水，HP +${heal}！`, "heal");
  } else if (item.name === "白色藥水") {
    const heal = Math.floor(Math.random() * 31) + 140;
    currentChar.hp = Math.min(currentChar.maxHp, currentChar.hp + heal);
    log(`使用強力白水，HP 巨幅回復 +${heal}！`, "heal");
  } else if (item.name === "綠色藥水") {
    currentChar.buffs.green = 300;
    log("使用綠色藥水，獲得一段攻速加速 300 秒！", "sys");
  } else if (item.name === "勇敢藥水") {
    currentChar.buffs.brave = 480;
    log("使用勇敢藥水，狂暴勇氣加速 480 秒！", "sys");
  } else if (item.name === "藍色藥水") {
    log("飲用精神藥水，魔力回復加速中！", "sys");
  } else if (item.name === "瞬間移動卷軸") {
    gameState.playerX = Math.floor(Math.random() * (WORLD_WIDTH - 200)) + 100;
    gameState.playerY = Math.floor(Math.random() * (WORLD_HEIGHT - 200)) + 100;
    gameState.targetMob = null;
    gameState.patrolTarget = null;
    // 只在新位置補生成一般怪，保留原有怪物與 Boss 位置
    if (typeof spawnMobsNearPlayer === "function") {
      const nearby = gameState.mobs.filter(m => Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) < 550).length;
      if (nearby < 3) spawnMobsNearPlayer(5);
    } else {
      gameState.mobs.forEach(m => m.isAggroed = false);
    }
    log("使用瞬間移動卷軸，瞬間傳送至隨機區域！", "sys");
    markScrollUsed(item.name);
  } else if (item.name === "傳送回家的卷軸") {
    markScrollUsed(item.name);
    if (gameState.isRunning) {
      triggerAutoRestock("手動撕回家卷");
    } else {
      flyBackToVillage();
    }
  } else if (dbItem && dbItem.type === "spellbook" || (item.name && /(?:魔法書|技能書|精靈水晶|技術書|皇家魔典)/.test(item.name))) {
    let skillName = (dbItem && dbItem.skill);
    if (!skillName && item.name) {
      const match = item.name.match(/(?:魔法書|技能書|精靈水晶|技術書|皇家魔典)[(（\s]?([^()）\s]+)[)）]?/);
      if (match && match[1] && typeof DB !== "undefined" && DB.skills && DB.skills[match[1]]) {
        skillName = match[1];
      }
    }

    if (skillName && typeof DB !== "undefined" && DB.skills && DB.skills[skillName]) {
      const targetSkill = DB.skills[skillName];
      const charCls = (currentChar && currentChar.charClass) || "prince";
      const isMatch = (typeof isSkillMatchClass === "function")
        ? isSkillMatchClass(targetSkill, charCls)
        : (targetSkill.school === charCls || targetSkill.school === "common" || targetSkill.category === "common" || (charCls === "mage" && targetSkill.school === "mage"));
      if (!isMatch) {
        log(`⚠️ 你的職業無法學習【${skillName}】（非本職業專屬秘笈）！`, "sys");
        return;
      }

      // 經典等級檢核
      const reqLv = (typeof getSkillReqLevelForClass === "function")
        ? getSkillReqLevelForClass(targetSkill, charCls)
        : (targetSkill.reqLv || 1);
      if ((currentChar.level || 1) < reqLv) {
        log(`⚠️ 等級不足！學習【${skillName}】需要等級達到 Lv.${reqLv}（目前角色 Lv.${currentChar.level || 1}）。`, "sys");
        return;
      }

      if (!currentChar.skills) currentChar.skills = [];
      if (!currentChar.skills.includes(skillName)) {
        currentChar.skills.push(skillName);
        log(`📖 研讀成功！學會技能【${skillName}】！`, "heal");
        if (typeof renderSkillTab === "function") renderSkillTab();
      } else {
        log(`📖 你已經學會【${skillName}】，此秘笈已無需重複研讀。`, "sys");
        return;
      }
    } else {
      log("📖 此技能秘笈無法解析。", "sys");
      return;
    }
  }

  item.count = (item.count || 1) - 1;
  if (item.count <= 0) {
    currentChar.inventory.splice(idx, 1);
  }
  updateLeftPanel();
  renderInventoryTab();
  if (typeof updateStrategySelects === "function") updateStrategySelects();
}

function equipItemFromInventory(invIdx, preferredSlot = null) {
  const item = currentChar.inventory[invIdx];
  if (!item) return;
  const dbItem = DB.items ? DB.items[item.name] : null;
  if (!dbItem || !dbItem.slot) return;

  if (!currentChar.equipped) {
    currentChar.equipped = {
      weapon: null, body: null, head: null, shield: null, cloak: null,
      glove: null, boots: null, necklace: null, earring: null, ring1: null, ring2: null, ring3: null, ring4: null, belt: null, tshirt: null, rune: null
    };
  }

  let targetSlot = preferredSlot || dbItem.slot;

  // 戒指智慧分配 (ring1 -> ring2 -> ring3(Lv76) -> ring4(Lv81))
  if (dbItem.slot === "ring" && !preferredSlot) {
    if (!currentChar.equipped.ring1) {
      targetSlot = "ring1";
    } else if (!currentChar.equipped.ring2) {
      targetSlot = "ring2";
    } else if ((currentChar.level || 1) >= 76 && !currentChar.equipped.ring3) {
      targetSlot = "ring3";
    } else if ((currentChar.level || 1) >= 81 && !currentChar.equipped.ring4) {
      targetSlot = "ring4";
    } else {
      targetSlot = "ring1";
    }
  }

  if (targetSlot === "ring3" && (currentChar.level || 1) < 76) {
    alert("⚠️ 戒指欄位三需角色等級達到 Lv.76 始可解鎖！");
    return;
  }
  if (targetSlot === "ring4" && (currentChar.level || 1) < 81) {
    alert("⚠️ 戒指欄位四需角色等級達到 Lv.81 始可解鎖！");
    return;
  }

  // 雙手武器卸除盾牌檢查
  if (targetSlot === "weapon" && dbItem.weaponType === "bow") {
    if (currentChar.equipped.shield) {
      const oldShield = currentChar.equipped.shield;
      currentChar.equipped.shield = null;
      currentChar.inventory.push(oldShield);
      log(`弓為雙手武器，已自動卸下盾牌【${oldShield.name}】放回背包。`, "sys");
    }
  }

  // 若穿盾牌而當前拿弓，則卸下弓
  if (targetSlot === "shield" && currentChar.equipped.weapon) {
    const curWpn = DB.items ? DB.items[currentChar.equipped.weapon.name] : null;
    if (curWpn && curWpn.weaponType === "bow") {
      const oldBow = currentChar.equipped.weapon;
      currentChar.equipped.weapon = null;
      currentChar.inventory.push(oldBow);
      log(`裝備盾牌需空出副手，已自動卸下弓箭【${oldBow.name}】放回背包。`, "sys");
    }
  }

  const oldEquipped = currentChar.equipped[targetSlot];
  currentChar.inventory.splice(invIdx, 1);

  if (oldEquipped) {
    currentChar.inventory.push(oldEquipped);
    log(`卸下了原先的 ${oldEquipped.name}，放回背包。`, "sys");
  }

  currentChar.equipped[targetSlot] = item;
  log(`成功裝備了【+${item.enchant || 0} ${item.name}】！`, "sys");

  // 即時連動左側數值面板與角色裝備狀態
  updateLeftPanel();
  renderInventoryTab();
  if (typeof renderCharTab === "function") renderCharTab();
  if (typeof updateStrategySelects === "function") updateStrategySelects();
  if (typeof saveAccountData === "function") saveAccountData();
}
window.equipItemFromInventory = equipItemFromInventory;

function unequipSlot(slot) {
  if (!currentChar.equipped || !currentChar.equipped[slot]) return;

  const eq = currentChar.equipped[slot];
  currentChar.inventory.push(eq);
  currentChar.equipped[slot] = null;
  log(`卸下了【+${eq.enchant || 0} ${eq.name}】，已回到背包！`, "sys");

  updateLeftPanel();
  renderInventoryTab();
  if (typeof renderCharTab === "function") renderCharTab();
  if (typeof updateStrategySelects === "function") updateStrategySelects();
  if (typeof saveAccountData === "function") saveAccountData();
}
window.unequipSlot = unequipSlot;

function openEnchantModal(scrollInvIdx) {
  currentEnchantScrollIdx = scrollInvIdx;
  const scrollItem = currentChar.inventory[scrollInvIdx];
  if (!scrollItem) return;

  const dbScroll = DB.items[scrollItem.name];
  const isWeaponScroll = (dbScroll.type === "enchant_w");

  const modal = document.getElementById("modal-enchant");
  const title = document.getElementById("enchant-modal-title");
  const listContainer = document.getElementById("enchant-target-list");

  title.innerText = `✨ 使用【${scrollItem.name}】(剩餘 ${scrollItem.count} 張)`;
  listContainer.innerHTML = "";

  const candidates = [];
  for (let slot in currentChar.equipped) {
    const eq = currentChar.equipped[slot];
    if (eq) {
      const dbEq = DB.items[eq.name];
      if ((isWeaponScroll && dbEq.type === "weapon") || (!isWeaponScroll && dbEq.type === "armor")) {
        candidates.push({ source: "equipped", slot: slot, item: eq, label: `[穿戴中] +${eq.enchant || 0} ${eq.name}` });
      }
    }
  }

  currentChar.inventory.forEach((invItem, idx) => {
    const dbEq = DB.items[invItem.name];
    if (dbEq && ((isWeaponScroll && dbEq.type === "weapon") || (!isWeaponScroll && dbEq.type === "armor"))) {
      candidates.push({ source: "inventory", invIdx: idx, item: invItem, label: `[背包] +${invItem.enchant || 0} ${invItem.name}` });
    }
  });

  if (candidates.length === 0) {
    listContainer.innerHTML = `<div style="color:#f87171; padding:12px; text-align:center;">身上沒有可施法強化的${isWeaponScroll ? '武器' : '防具'}！</div>`;
  } else {
    candidates.forEach(cand => {
      const dbEq = DB.items[cand.item.name];
      const safeVal = (dbEq.safe !== undefined) ? dbEq.safe : (isWeaponScroll ? 6 : 4);
      const isOverSafe = (cand.item.enchant || 0) >= safeVal;

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "6px 8px";
      row.style.borderBottom = "1px solid #222";

      const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(cand.item.name) : "";
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          ${iconHtml}
          <div>
            <b style="color:${isOverSafe ? '#f87171' : '#fff'};">${cand.label}</b>
            <div style="font-size:10px; color:#aaa;">安定值: +${safeVal} ${isOverSafe ? '<span style="color:#ef4444; font-weight:bold;">(過安定值！失敗直接蒸發爆裝)</span>' : '<span style="color:#22c55e;">(100% 安定強化)</span>'}</div>
          </div>
        </div>
        <button class="btn ${isOverSafe ? 'btn-danger' : 'btn-gold'}" onclick="executeEnchantTarget('${cand.source}', '${cand.slot || cand.invIdx}')">施法強化</button>
      `;
      listContainer.appendChild(row);
    });
  }

  modal.style.display = "flex";
}

function closeEnchantModal() {
  document.getElementById("modal-enchant").style.display = "none";
  currentEnchantScrollIdx = null;
}

function executeEnchantTarget(source, key) {
  if (currentEnchantScrollIdx === null) return;
  const scrollItem = currentChar.inventory[currentEnchantScrollIdx];
  if (!scrollItem || (scrollItem.count || 1) <= 0) {
    alert("卷軸不足！");
    closeEnchantModal();
    return;
  }

  let targetItem = (source === "equipped") ? currentChar.equipped[key] : currentChar.inventory[parseInt(key)];
  if (!targetItem) {
    alert("找不到目標裝備！");
    closeEnchantModal();
    return;
  }

  const dbItem = DB.items[targetItem.name];
  const dbScroll = DB.items[scrollItem.name];
  const isWeapon = (dbScroll.type === "enchant_w");
  const safeVal = (dbItem.safe !== undefined) ? dbItem.safe : (isWeapon ? 6 : 4);
  const currentEnchant = targetItem.enchant || 0;

  scrollItem.count--;
  if (scrollItem.count <= 0) {
    currentChar.inventory.splice(currentEnchantScrollIdx, 1);
  }

  if (currentEnchant < safeVal) {
    targetItem.enchant = currentEnchant + 1;
    log(`✨ 卷軸散發出銀色的光芒！【+${targetItem.enchant} ${targetItem.name}】強化成功！`, "drop");
  } else {
    const diff = currentEnchant - safeVal;
    let successRate = 0.35;
    if (diff === 1) successRate = 0.25;
    else if (diff === 2) successRate = 0.15;
    else if (diff >= 3) successRate = 0.08;

    if (Math.random() < successRate) {
      targetItem.enchant = currentEnchant + 1;
      log(`🔥 神奇的光芒籠罩！【+${targetItem.enchant} ${targetItem.name}】突破極限強化成功！！`, "drop");
      if (targetItem.enchant >= 8) {
        log(`📢【世界廣播】狂賀！玩家 ${currentUser.username} 成功突破鍛造出神兵【+${targetItem.enchant} ${targetItem.name}】！`, "sys");
      }
    } else {
      log(`💥 產生了強烈的銀色光芒後化為烏有！【+${currentEnchant} ${targetItem.name}】化為灰燼爆碎損毀！`, "mob");
      if (source === "equipped") {
        currentChar.equipped[key] = null;
      } else {
        const itemIdx = currentChar.inventory.indexOf(targetItem);
        if (itemIdx !== -1) currentChar.inventory.splice(itemIdx, 1);
      }
    }
  }

  closeEnchantModal();
  updateLeftPanel();
  renderInventoryTab();
  renderCharTab();
  saveAccountData();
}

function renderInventoryTab() {
  const tbody = document.getElementById("inv-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!currentChar || currentChar.inventory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#7e889b; padding:12px;">背包空空如也</td></tr>`;
    return;
  }

  currentChar.inventory.forEach((item, idx) => {
    const dbItem = DB.items[item.name] || {};
    const tr = document.createElement("tr");

    let actionBtn = "";
    if (dbItem.type === "weapon" || dbItem.type === "armor" || dbItem.type === "accessory") {
      actionBtn = `<button class="btn btn-success" onclick="equipItemFromInventory(${idx})">裝備</button>`;
    } else if (dbItem.type === "potion" || dbItem.type === "scroll" || dbItem.type === "spellbook") {
      actionBtn = `<button class="btn" onclick="useItemByIndex(${idx})">使用</button>`;
    } else if (dbItem.type === "enchant_w" || dbItem.type === "enchant_a") {
      actionBtn = `<button class="btn btn-gold" onclick="useItemByIndex(${idx})">✨ 點卷軸</button>`;
    }

    if (gameState.inVillage) {
      const maxCount = item.count || 1;
      actionBtn += `
        <div style="display:inline-flex; align-items:center; gap:4px; margin-left:6px;">
          <input type="number" id="inv-sell-qty-${idx}" value="1" min="1" max="${maxCount}" style="width:48px; text-align:center;">
          <button class="btn" style="padding:2px 5px; font-size:10px;" onclick="document.getElementById('inv-sell-qty-${idx}').value=${maxCount}">MAX</button>
          <button class="btn btn-gold" onclick="sellItemCustomQty(${idx})">出售</button>
        </div>
      `;
    }

    const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(item.name) : "";
    tr.innerHTML = `
      <td style="color:${tierColor}; font-weight:${dbItem.tier === 'blue' || dbItem.tier === 'red' ? 'bold' : 'normal'};">
        <div style="display:flex; align-items:center; gap:8px;">
          ${iconHtml}
          <span>${item.enchant !== undefined && item.enchant > 0 ? '+' + item.enchant : ''} ${item.name}</span>
        </div>
      </td>
      <td>${item.count || 1}</td>
      <td style="color:#aaa; font-size:11px;">${dbItem.desc || '重量: ' + (dbItem.weight || 1)}</td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

function sellItemCustomQty(idx) {
  const item = currentChar.inventory[idx];
  if (!item) return;

  const input = document.getElementById(`inv-sell-qty-${idx}`);
  const maxCount = item.count || 1;
  const sellCount = input ? Math.min(maxCount, Math.max(1, parseInt(input.value) || 1)) : 1;

  const dbItem = DB.items[item.name];
  const unitPrice = Math.max(1, Math.floor((dbItem ? dbItem.price : 10) * 0.4));
  const totalEarn = unitPrice * sellCount;

  currentChar.gold += totalEarn;
  item.count = maxCount - sellCount;

  if (item.count <= 0) currentChar.inventory.splice(idx, 1);

  log(`出售了【${item.name}】x${sellCount}，共獲得 ${totalEarn} 金幣！`, "drop");
  updateLeftPanel();
  renderInventoryTab();
  if (typeof updateStrategySelects === "function") updateStrategySelects();
}

function renderVillageTab() {
  const villageData = DB.villages[gameState.viewingVillage] || DB.villages["ti_village"];
  const nameEl = document.getElementById("current-village-name");
  if (nameEl) nameEl.innerText = villageData.name;

  const locEl = document.getElementById("village-location-indicator");
  if (locEl) locEl.innerText = gameState.inVillage ? "(已在村莊中)" : "(遠端檢視中)";

  const container = document.getElementById("village-npc-container");
  if (!container) return;
  container.innerHTML = "";

  villageData.shops.forEach((shop, sIdx) => {
    const shopBox = document.createElement("div");
    shopBox.className = "bot-section";
    let rowsHtml = "";

    shop.items.forEach((itemName, iIdx) => {
      const dbItem = DB.items[itemName];
      if (dbItem) {
        let defaultQty = (itemName === "箭" || itemName === "銀箭") ? 500 : (itemName.includes("水") ? 50 : 1);
        const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(itemName) : "";
        rowsHtml += `
          <div class="bot-item-row" style="padding:6px 8px; border-bottom:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${iconHtml}
              <span class="bot-item-name" style="font-weight:bold;">${itemName} <span style="color:#f59e0b; font-size:11px;">(${dbItem.price} 金幣)</span></span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <input type="number" id="${inputId}" value="${defaultQty}" min="1" max="9999" style="width:65px; text-align:center;">
              <button class="btn btn-gold" onclick="buyItemFromShop('${itemName}', '${inputId}')">購買</button>
            </div>
          </div>
        `;
      }
    });

    shopBox.innerHTML = `
      <div class="bot-section-title" style="color:var(--gold); font-size:14px; margin-bottom:4px;">${shop.title}</div>
      <p style="font-size:11px; color:#aaa; margin-bottom:8px;">${shop.desc}</p>
      <div class="bot-item-list">${rowsHtml}</div>
    `;
    container.appendChild(shopBox);
  });
}

function viewOtherVillage() {
  gameState.viewingVillage = document.getElementById("village-select").value;
  renderVillageTab();
}

// 在 js/inventory.js 中替換 buyItemFromShop 與存取倉庫函式：
function buyItemFromShop(itemName, inputId) {
  const dbItem = (typeof DB !== 'undefined' && DB.items) ? DB.items[itemName] : null;
  if (!dbItem) return;

  const countInput = document.getElementById(inputId);
  const count = countInput ? Math.max(1, parseInt(countInput.value) || 1) : 1;
  const totalCost = dbItem.price * count;

  if (currentChar.gold < totalCost) {
    // 🚨 依規範改為日誌警告，不彈窗
    log(`⚠️ 金幣不足，已盡量採買或跳過本次補給。（購買【${itemName}】x${count} 需 ${totalCost} 金幣，持有 ${currentChar.gold} 金幣）`, "sys");
    return;
  }

  currentChar.gold -= totalCost;
  addItemToInventory(itemName, count);
  log(`🛒 在商店購買了【${itemName}】x${count}，共花費 ${totalCost} 金幣！`, "drop");

  updateLeftPanel();
  renderInventoryTab();
  renderVillageTab();
}

function depositToStorageCustom(invIdx) {
  if (!gameState.inVillage) {
    log("⚠️ 此處為野外危險區域，倉庫已被嚴格鎖定！請先回村。", "sys");
    return;
  }

  const item = currentChar.inventory[invIdx];
  if (!item) return;

  const maxCount = item.count || 1;
  const input = document.getElementById(`storage-dep-qty-${invIdx}`);
  const depCount = input ? Math.min(maxCount, Math.max(1, parseInt(input.value) || 1)) : 1;

  depositItemDirectlyToStorage({ ...item, count: depCount });

  item.count = maxCount - depCount;
  if (item.count <= 0) {
    currentChar.inventory.splice(invIdx, 1);
  }

  log(`📦 已將【${item.name}】x${depCount} 存入個人倉庫！`, "sys");
  renderStorageTab();
  updateLeftPanel();
  if (typeof updateStrategySelects === "function") updateStrategySelects();
}

function withdrawFromStorageCustom(storageIdx) {
  if (!gameState.inVillage) {
    log("⚠️ 此處為野外危險區域，倉庫已被嚴格鎖定！請先回村。", "sys");
    return;
  }

  const item = currentChar.storage[storageIdx];
  if (!item) return;

  if (currentChar.gold < 30) {
    log("⚠️ 領取手續費不足 30 金幣！", "sys");
    return;
  }

  const maxCount = item.count || 1;
  const input = document.getElementById(`storage-wit-qty-${storageIdx}`);
  const witCount = input ? Math.min(maxCount, Math.max(1, parseInt(input.value) || 1)) : 1;

  currentChar.gold -= 30;
  addItemToInventory(item.name, witCount);

  item.count = maxCount - witCount;
  if (item.count <= 0) {
    currentChar.storage.splice(storageIdx, 1);
  }

  log(`📦 已從倉庫取出【${item.name}】x${witCount} (手續費 30 金幣)`, "sys");
  renderStorageTab();
  updateLeftPanel();
}

// ---------------- 渲染個人倉庫介面 ----------------
function renderStorageTab() {
  const depositBody = document.getElementById("storage-deposit-body");
  const storageBody = document.getElementById("storage-table-body");
  const warning = document.getElementById("storage-warning");
  const mainContent = document.getElementById("storage-main-content");
  const lockStatus = document.getElementById("storage-lock-status");

  if (!depositBody || !storageBody) return;

  // 判定是否在村莊安全區，若在野外則鎖定倉庫
  if (!gameState.inVillage) {
    if (warning) warning.style.display = "block";
    if (mainContent) mainContent.style.display = "none";
    if (lockStatus) {
      lockStatus.innerText = "野外區域：已上鎖，無法存取";
      lockStatus.style.color = "var(--red)";
    }
    return;
  }

  if (warning) warning.style.display = "none";
  if (mainContent) mainContent.style.display = "block";
  if (lockStatus) {
    lockStatus.innerText = "安全區：可隨時存取";
    lockStatus.style.color = "var(--green)";
  }

  // 1. 渲染【個人倉庫內】的物品列表
  storageBody.innerHTML = "";
  if (!currentChar.storage || currentChar.storage.length === 0) {
    storageBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#7e889b; padding:12px;">倉庫目前沒有存放任何物品</td></tr>`;
  } else {
    currentChar.storage.forEach((item, idx) => {
      const dbItem = DB.items[item.name] || {};
      const maxCount = item.count || 1;
      const tierColor = dbItem.tier === "red" ? "#ef4444" : (dbItem.tier === "blue" ? "#38bdf8" : (dbItem.tier === "green" ? "#22c55e" : "#e2e8f0"));

      const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(item.name) : "";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:${tierColor}; font-weight:${dbItem.tier === 'blue' || dbItem.tier === 'red' ? 'bold' : 'normal'};">
          <div style="display:flex; align-items:center; gap:8px;">
            ${iconHtml}
            <span>${item.enchant !== undefined && item.enchant > 0 ? '+' + item.enchant : ''} ${item.name}</span>
          </div>
        </td>
        <td>${maxCount}</td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:4px;">
            <input type="number" id="storage-wit-qty-${idx}" value="1" min="1" max="${maxCount}" style="width:48px; text-align:center;">
            <button class="btn" style="padding:2px 5px; font-size:10px;" onclick="document.getElementById('storage-wit-qty-${idx}').value=${maxCount}">MAX</button>
            <button class="btn btn-gold" onclick="withdrawFromStorageCustom(${idx})">取出 (30金幣)</button>
          </div>
        </td>
      `;
      storageBody.appendChild(tr);
    });
  }

  // 2. 渲染【背包中可存入倉庫】的物品列表
  depositBody.innerHTML = "";
  if (!currentChar.inventory || currentChar.inventory.length === 0) {
    depositBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#7e889b; padding:12px;">背包空空如也</td></tr>`;
  } else {
    currentChar.inventory.forEach((item, idx) => {
      const dbItem = DB.items[item.name] || {};
      const maxCount = item.count || 1;
      const tierColor = dbItem.tier === "red" ? "#ef4444" : (dbItem.tier === "blue" ? "#38bdf8" : (dbItem.tier === "green" ? "#22c55e" : "#e2e8f0"));
      const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(item.name) : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:${tierColor}; font-weight:${dbItem.tier === 'blue' || dbItem.tier === 'red' ? 'bold' : 'normal'};">
          <div style="display:flex; align-items:center; gap:8px;">
            ${iconHtml}
            <span>${item.enchant !== undefined && item.enchant > 0 ? '+' + item.enchant : ''} ${item.name}</span>
          </div>
        </td>
        <td>${maxCount}</td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:4px;">
            <input type="number" id="storage-dep-qty-${idx}" value="1" min="1" max="${maxCount}" style="width:48px; text-align:center;">
            <button class="btn" style="padding:2px 5px; font-size:10px;" onclick="document.getElementById('storage-dep-qty-${idx}').value=${maxCount}">MAX</button>
            <button class="btn btn-gold" onclick="depositToStorageCustom(${idx})">存入</button>
          </div>
        </td>
      `;
      depositBody.appendChild(tr);
    });
  }
}