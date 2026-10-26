// js/character.js - 角色管理、創角配點與【進入世界】黑屏自癒修復版

const ADEN_CLASS_DATA = {
  prince: {
    name: "王族",
    base: { str: 13, dex: 10, con: 10, int: 10, wis: 11, cha: 12 },
    bonusPoints: 9,
    initWeapon: "短劍",
    initArmor: "皮背心"
  },
  knight: {
    name: "騎士",
    base: { str: 16, dex: 12, con: 14, int: 8, wis: 9, cha: 12 },
    bonusPoints: 4,
    initWeapon: "短劍",
    initArmor: "皮背心"
  },
  elf: {
    name: "妖精",
    base: { str: 11, dex: 12, con: 12, int: 12, wis: 12, cha: 9 },
    bonusPoints: 7,
    initWeapon: "獵人之弓",
    initArmor: "皮背心"
  },
  mage: {
    name: "法師",
    base: { str: 8, dex: 7, con: 12, int: 12, wis: 12, cha: 8 },
    bonusPoints: 16,
    initWeapon: "短劍",
    initArmor: "皮背心"
  }
};

const CharCreator = {
  currentClass: "prince",
  stats: { str: 13, dex: 10, con: 10, int: 10, wis: 11, cha: 12 },
  remainPoints: 9
};

function resolveClassPreset(clsKey) {
  if (!clsKey) return ADEN_CLASS_DATA.prince;
  const k = String(clsKey).trim().toLowerCase();
  if (k === "王族" || k === "prince") return ADEN_CLASS_DATA.prince;
  if (k === "騎士" || k === "knight") return ADEN_CLASS_DATA.knight;
  if (k === "妖精" || k === "elf") return ADEN_CLASS_DATA.elf;
  if (k === "法師" || k === "mage" || k === "wizard") return ADEN_CLASS_DATA.mage;
  return ADEN_CLASS_DATA[k] || ADEN_CLASS_DATA.prince;
}

// ---------------- 1. 深度資料清洗與裝備欄位初始化 ----------------
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
      if (char.equipped[slot] === undefined) {
        char.equipped[slot] = null;
      } else if (typeof char.equipped[slot] === "string") {
        char.equipped[slot] = {
          uid: (typeof generateUid === "function" ? generateUid() : "eq_" + Date.now()),
          name: char.equipped[slot],
          enchant: 0
        };
      }
    }
  }

  if (!Array.isArray(char.inventory)) {
    char.inventory = [];
  }

  // 🚨 新手初始背包補給：若背包無任何道具，自動發放冒險初期物資
  if (char.inventory.length === 0 && (!char.level || char.level <= 5)) {
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
    char.inventory.push(...starterPack);
  }

  if (!Array.isArray(char.storage)) {
    char.storage = [];
  }

  return char;
}
window.sanitizeInventoryAndEquipped = sanitizeInventoryAndEquipped;

function sanitizeCharacterData(char) {
  if (!char) return null;

  if (typeof char === "string") {
    try { char = JSON.parse(char); } catch (e) { return null; }
  }
  if (typeof char !== "object") return null;

  if (!char.name) char.name = "亞丁冒險者";
  if (!char.charClass) char.charClass = "prince";
  if (!char.level || isNaN(char.level)) char.level = 1;
  if (!char.exp || isNaN(char.exp)) char.exp = 0;
  if (char.gold === undefined || isNaN(char.gold)) char.gold = 5000;
  if (!char.ac && char.ac !== 0) char.ac = 10;

  const preset = resolveClassPreset(char.charClass);

  if (!char.stats || typeof char.stats !== "object") {
    char.stats = { ...preset.base };
  } else {
    for (let k in preset.base) {
      if (char.stats[k] === undefined || isNaN(char.stats[k])) {
        char.stats[k] = preset.base[k];
      }
    }
  }

  const baseHp = 25 + (char.stats.con * 2);
  const baseMp = 10 + (char.stats.wis);
  if (!char.maxHp || isNaN(char.maxHp)) char.maxHp = baseHp;
  if (!char.hp || isNaN(char.hp)) char.hp = char.maxHp;
  if (!char.maxMp || isNaN(char.maxMp)) char.maxMp = baseMp;
  if (!char.mp || isNaN(char.mp)) char.mp = char.maxMp;

  if (!char.buffs || typeof char.buffs !== "object") {
    char.buffs = { green: 0, brave: 0 };
  }

  if (!Array.isArray(char.skills)) {
    char.skills = [];
  }

  if (!char.botSettings || typeof char.botSettings !== "object") {
    char.botSettings = {
      weightLimit: 50,
      storeRules: [],
      sellRules: [],
      buyRules: [
        { item: "紅色藥水", targetCount: 80 },
        { item: "瞬間移動卷軸", targetCount: 20 },
        { item: "傳送回家的卷軸", targetCount: 5 }
      ]
    };
  }

  if (!char.potionThresholds || typeof char.potionThresholds !== "object") {
    char.potionThresholds = {
      "紅色藥水": 70,
      "澄色藥水": 35,
      "白色藥水": 15
    };
  }

  sanitizeInventoryAndEquipped(char);
  return char;
}

// ---------------- 2. 【進入世界】核心切換 (具備 DOM 自動解套自癒技術) ----------------
function selectChar(index) {
  console.log("🎮 正在執行【進入世界】，選擇角色索引:", index);

  try {
    // A. 帳號快取自動恢復
    if (!currentUser) {
      const remembered = localStorage.getItem("lineage_remembered_user") || "cyok73";
      const localAcc = localStorage.getItem("lineage_acc_" + remembered);
      if (localAcc) {
        try { currentUser = JSON.parse(localAcc); } catch (e) { }
      }
      if (!currentUser) {
        currentUser = { username: remembered, roleLevel: 1, characters: [] };
      }
    }

    if (typeof currentUser.characters === "string") {
      try { currentUser.characters = JSON.parse(currentUser.characters); } catch (e) { currentUser.characters = []; }
    }
    if (!Array.isArray(currentUser.characters)) {
      currentUser.characters = [];
    }

    currentUser.characters = currentUser.characters.map(c => {
      if (typeof c === "string") {
        try { return JSON.parse(c); } catch (e) { return null; }
      }
      return c;
    }).filter(Boolean);

    const targetIdx = parseInt(index) || 0;
    let selectedRaw = currentUser.characters[targetIdx];

    if (!selectedRaw) {
      alert("⚠️ 查無該角色資料！請重新建立角色。");
      showCreateCharBox();
      return;
    }

    // B. 清洗並綁定當前角色
    currentChar = sanitizeCharacterData(selectedRaw);
    currentUser.characters[targetIdx] = currentChar;
    window.currentChar = currentChar;

    if (currentChar.botSettings) {
      gameState.botSettings = JSON.parse(JSON.stringify(currentChar.botSettings));
    }
    if (currentChar.potionThresholds) {
      gameState.potionThresholds = JSON.parse(JSON.stringify(currentChar.potionThresholds));
    }
    if (typeof DB !== "undefined" && DB.maps && !DB.maps[gameState.currentMap]) {
      gameState.currentMap = "talking_island";
    }

    // 🚨 核心邏輯：讀取上次下線前的掛機與地圖座標狀態
    if (currentChar.savedState) {
      gameState.currentMap = currentChar.savedState.currentMap || "talking_island";

      if (currentChar.savedState.isRunning) {
        gameState.isRunning = true;
        gameState.botStatus = "running";
        gameState.inVillage = false;
        gameState.playerX = currentChar.savedState.playerX || 1200;
        gameState.playerY = currentChar.savedState.playerY || 800;
        console.log("🔄 檢測到上次為掛機狀態下線，準備自動恢復野外掛機！");
      } else {
        gameState.isRunning = false;
        gameState.botStatus = "village";
        gameState.inVillage = true;
        console.log("🏛️ 檢測到上次已停止掛機，於村莊安全區登入。");
      }
    } else {
      gameState.isRunning = false;
      gameState.botStatus = "village";
      gameState.inVillage = true;
    }

    // C. 🚨 核心黑屏自癒：檢測 #view-game 是否被意外包在 #view-auth 內，自動移至 body！
    const viewAuth = document.getElementById("view-auth");
    const viewGame = document.getElementById("view-game") || document.getElementById("game-main-screen");

    if (viewAuth && viewGame && viewAuth.contains(viewGame)) {
      console.warn("⚠️ 檢測到 #view-game 被錯誤巢狀包裹在 #view-auth 內部！正在自動修復解套移至 body...");
      document.body.appendChild(viewGame);
    }

    // D. 強制切換畫面 (多重隱藏與展示)
    const authElements = ["view-auth", "box-login", "box-create-char", "box-select-char", "character-select-screen"];
    authElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove("active");
        el.style.setProperty("display", "none", "important");
      }
    });

    if (viewGame) {
      viewGame.classList.add("active");
      viewGame.style.setProperty("display", "flex", "important");
      viewGame.style.setProperty("visibility", "visible", "important");
      viewGame.style.setProperty("opacity", "1", "important");
    }

    // 確保戰鬥子分頁也是打開的
    const tabBattle = document.getElementById("tab-battle");
    if (tabBattle) {
      tabBattle.classList.add("active");
      tabBattle.style.setProperty("display", "flex", "important");
    }

    // E. 頂部資訊更新
    const headerInfo = document.getElementById("header-user-info");
    if (headerInfo) {
      const className = resolveClassPreset(currentChar.charClass)?.name || currentChar.charClass;
      headerInfo.innerText = `| 角色: ${currentChar.name} (${className}) [${currentUser.roleLevel === 2 ? '👑GM' : '玩家'}]`;
    }

    const adminNavBtn = document.getElementById("btn-nav-admin");
    if (adminNavBtn) {
      adminNavBtn.style.display = (currentUser.roleLevel >= 2) ? "inline-flex" : "none";
    }

    // F. 安全依序執行渲染
    if (typeof window.loadGMSettings === "function") {
      try { window.loadGMSettings(); } catch (e) { }
    }
    if (typeof window.initWorldMobs === "function") {
      try { window.initWorldMobs(); } catch (e) { }
    }
    if (typeof window.initGameUI === "function") {
      try { window.initGameUI(); } catch (e) { }
    }
    if (typeof window.renderRadar === "function") {
      try { window.renderRadar(); } catch (e) { }
    }
    if (typeof window.calculateOfflineGains === "function") {
      try { window.calculateOfflineGains(); } catch (e) { }
    }

    if (typeof window.switchTab === "function") {
      window.switchTab("battle");
    }

    // 若判斷為恢復掛機狀態，直接呼叫確保計時器與按鈕標籤同步
    if (gameState.isRunning && gameState.botStatus === "running") {
      setTimeout(() => {
        if (typeof ensureWorldTickTimer === "function") ensureWorldTickTimer();
        const btn = document.getElementById("toggle-btn");
        if (btn) {
          btn.className = "btn btn-danger";
          btn.innerText = "⏹ 停止掛機";
        }
        const tag = document.getElementById("battle-mode-tag");
        if (tag) tag.innerText = "[野外巡航中]";
        log("🔄 歡迎回到戰場！已自動恢復野外離線前掛機狀態！", "sys");
      }, 300);
    }

    console.log("🎉【進入世界】成功！畫面已成功展示！");
  } catch (fatalError) {
    console.error("💥 點擊進入世界時發生錯誤:", fatalError);
    alert("進入世界時發生錯誤：\n" + fatalError.message);
  }
}

// ---------------- 3. 選角清單渲染 ----------------
function showCharSelectView() {
  const boxLogin = document.getElementById("box-login");
  const boxCreate = document.getElementById("box-create-char");
  const boxSelect = document.getElementById("box-select-char");

  if (boxLogin) boxLogin.style.display = "none";
  if (boxCreate) boxCreate.style.display = "none";
  if (boxSelect) boxSelect.style.display = "flex";

  const lblUser = document.getElementById("lbl-current-user");
  if (lblUser && currentUser) lblUser.innerText = currentUser.username;

  const badge = document.getElementById("lbl-role-badge");
  if (badge && currentUser) {
    if (currentUser.roleLevel === 2) {
      badge.innerText = "[👑 二級 GM]";
      badge.style.color = "#d946ef";
    } else {
      badge.innerText = "[一級 玩家]";
      badge.style.color = "#38bdf8";
    }
  }

  renderCharList();
}

function renderCharList() {
  const container = document.getElementById("char-list-container");
  if (!container) return;
  container.innerHTML = "";

  if (!currentUser) return;

  if (typeof currentUser.characters === "string") {
    try { currentUser.characters = JSON.parse(currentUser.characters); } catch (e) { currentUser.characters = []; }
  }
  if (!Array.isArray(currentUser.characters) || currentUser.characters.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#7e889b; padding:20px;">尚無冒險角色，請點擊下方按鈕創建人物。</div>`;
    return;
  }

  currentUser.characters.forEach((rawChar, idx) => {
    let c = rawChar;
    if (typeof c === "string") {
      try { c = JSON.parse(c); } catch (e) { return; }
    }
    if (!c) return;

    const card = document.createElement("div");
    card.className = "char-select-card";
    const className = resolveClassPreset(c.charClass)?.name || c.charClass || "冒險者";

    card.innerHTML = `
 <div>
 <b style="color:var(--gold, #f59e0b); font-size:14px;">${c.name || '無名氏'}</b>
 <span style="font-size:11px; margin-left:8px; color:#aaa;">Lv.${c.level || 1} ${className}</span>
 </div>
 <div style="display:flex; gap:6px;">
 <button type="button" class="btn btn-gold" style="padding:4px 12px; font-weight:bold;" onclick="selectChar(${idx})">進入世界</button>
 <button type="button" class="btn btn-danger" style="padding:4px 10px;" onclick="deleteChar(${idx})">刪除</button>
 </div>
 `;
    container.appendChild(card);
  });
}

function deleteChar(index) {
  if (confirm("確定要刪除此角色嗎？資料刪除後將無法恢復！")) {
    currentUser.characters.splice(index, 1);
    if (typeof saveAccountData === "function") saveAccountData();
    renderCharList();
  }
}

function backToCharSelect() {
  // 🚨 修復：返回選角畫面時只執行存檔，不要主動呼叫 stopLoop() 破壞掛機標記！
  if (typeof saveAccountData === "function") saveAccountData();
  currentChar = null;

  const viewGame = document.getElementById("view-game");
  const viewAuth = document.getElementById("view-auth");
  if (viewGame) {
    viewGame.classList.remove("active");
    viewGame.style.setProperty("display", "none", "important");
  }
  if (viewAuth) {
    viewAuth.classList.add("active");
    viewAuth.style.setProperty("display", "flex", "important");
  }
  showCharSelectView();
}

// ---------------- 4. 創角數值分配邏輯 ----------------
function showCreateCharBox() {
  const boxSelect = document.getElementById("box-select-char");
  const boxCreate = document.getElementById("box-create-char");
  if (boxSelect) boxSelect.style.display = "none";
  if (boxCreate) {
    boxCreate.style.display = "flex";
  }

  const clsSelect = document.getElementById("new-char-class");
  if (clsSelect) {
    clsSelect.value = "prince";
  }
  onClassSelectChange();
}

function cancelCreateChar() {
  const boxCreate = document.getElementById("box-create-char");
  if (boxCreate) boxCreate.style.display = "none";
  showCharSelectView();
}

function onClassSelectChange() {
  const clsSelect = document.getElementById("new-char-class");
  const selectedKey = clsSelect ? clsSelect.value : "prince";
  const preset = resolveClassPreset(selectedKey);

  CharCreator.currentClass = selectedKey;
  CharCreator.stats = { ...preset.base };
  CharCreator.remainPoints = preset.bonusPoints;

  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
  statKeys.forEach(k => {
    const lbl = document.getElementById(`lbl-base-${k}`);
    if (lbl && preset.base[k] !== undefined) {
      lbl.innerText = `(底質${preset.base[k]})`;
    }
  });

  renderCreateCharStats();
}

function adjustCreateStat(statKey, delta) {
  const preset = resolveClassPreset(CharCreator.currentClass);
  const baseVal = preset.base[statKey] || 10;
  const currentVal = CharCreator.stats[statKey] || baseVal;

  if (delta > 0) {
    if (CharCreator.remainPoints <= 0) {
      alert("⚠️ 自由分配點數已用盡！");
      return;
    }
    if (currentVal >= 18) {
      alert("⚠️ 天堂經典規則：單項能力值初始上限為 18 點！");
      return;
    }
    CharCreator.stats[statKey] = currentVal + 1;
    CharCreator.remainPoints -= 1;
  } else if (delta < 0) {
    if (currentVal <= baseVal) {
      return;
    }
    CharCreator.stats[statKey] = currentVal - 1;
    CharCreator.remainPoints += 1;
  }

  renderCreateCharStats();
}

function renderCreateCharStats() {
  const remainEl = document.getElementById("create-remain-points");
  if (remainEl) {
    remainEl.innerText = CharCreator.remainPoints;
    remainEl.style.color = (CharCreator.remainPoints === 0) ? "#22c55e" : "#f59e0b";
  }

  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
  statKeys.forEach(k => {
    const valEl = document.getElementById(`val-${k}`);
    if (valEl && CharCreator.stats[k] !== undefined) {
      valEl.innerText = CharCreator.stats[k];
    }
  });
}

function confirmCreateChar() {
  const nameInput = document.getElementById("new-char-name");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) {
    alert("⚠️ 請輸入角色名稱！");
    if (nameInput) nameInput.focus();
    return;
  }
  if (name.length < 2 || name.length > 12) {
    alert("⚠️ 角色名稱長度需介於 2 ~ 12 個字元！");
    if (nameInput) nameInput.focus();
    return;
  }

  if (CharCreator.remainPoints > 0) {
    alert(`⚠️ 您還有 ${CharCreator.remainPoints} 點自由點數尚未分配完畢！\n請手動點擊「+」將點數全數配完再點擊創建。`);
    return;
  }

  if (!currentUser) {
    const remembered = localStorage.getItem("lineage_remembered_user") || "cyok73";
    currentUser = { username: remembered, roleLevel: 1, characters: [] };
  }
  if (!currentUser.characters) {
    currentUser.characters = [];
  }

  const nameExists = currentUser.characters.some(c => c && c.name && c.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    alert(`⚠️ 角色名稱【${name}】已存在，請使用其他名稱！`);
    if (nameInput) nameInput.focus();
    return;
  }

  const preset = resolveClassPreset(CharCreator.currentClass);
  const clsKey = (CharCreator.currentClass === "knight" || CharCreator.currentClass === "elf" || CharCreator.currentClass === "mage")
    ? CharCreator.currentClass
    : "prince";

  const finalStats = { ...CharCreator.stats };
  const baseHp = 25 + (finalStats.con * 2);
  const baseMp = 10 + (finalStats.wis);

  const newChar = {
    name: name,
    charClass: clsKey,
    level: 1,
    exp: 0,
    gold: 5000,
    stats: finalStats,
    maxHp: baseHp, hp: baseHp,
    maxMp: baseMp, mp: baseMp,
    ac: 10,
    inventory: [
      { name: "紅色藥水", count: 80 },
      { name: "澄色藥水", count: 10 },
      { name: "傳送回家的卷軸", count: 10 },
      { name: "瞬間移動卷軸", count: 30 },
      { name: "對武器施法的卷軸", count: 2 },
      { name: "對防具施法的卷軸", count: 2 },
      { name: "箭", count: clsKey === "elf" ? 1000 : 0 },
      { name: "銀箭", count: clsKey === "elf" ? 500 : 0 }
    ],
    equipped: {
      weapon: { uid: (typeof generateUid === "function" ? generateUid() : "w_" + Date.now()), name: preset.initWeapon, enchant: 0 },
      body: { uid: (typeof generateUid === "function" ? generateUid() : "a_" + Date.now()), name: preset.initArmor, enchant: 0 },
      head: null, shield: null, cloak: null,
      glove: null, boots: null, necklace: null, earring: null, ring1: null, ring2: null, belt: null
    },
    storage: [],
    polymorph: "無變身",
    skills: [],
    buffs: { green: 0, brave: 0 },
    botSettings: {
      weightLimit: 50,
      storeRules: [],
      sellRules: [],
      buyRules: [
        { item: "紅色藥水", targetCount: 80 },
        { item: "瞬間移動卷軸", targetCount: 20 },
        { item: "傳送回家的卷軸", targetCount: 5 }
      ]
    },
    potionThresholds: {
      "紅色藥水": 70,
      "澄色藥水": 35,
      "白色藥水": 15
    }
  };

  currentUser.characters.push(newChar);
  if (typeof saveAccountData === "function") {
    saveAccountData();
  }

  alert(`🎉 恭喜！冒險者【${name}】創建成功！`);
  if (nameInput) nameInput.value = "";

  const boxCreate = document.getElementById("box-create-char");
  if (boxCreate) boxCreate.style.display = "none";
  showCharSelectView();
}

// ---------------- 5. 裝備欄位數值計算與黑紅風格渲染 ----------------
function getCalculatedStats() {
  if (!currentChar || !currentChar.stats) {
    return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, mr: 0, hpBonus: 0, mpBonus: 0 };
  }
  const base = { ...currentChar.stats };
  let mr = Math.floor((base.wis || 10) * 1.5);
  let hpBonus = 0;
  let mpBonus = 0;

  if (currentChar.equipped) {
    Object.values(currentChar.equipped).forEach(eq => {
      if (eq) {
        const itemDb = (typeof DB !== "undefined" && DB.items) ? DB.items[eq.name] : null;
        if (itemDb) {
          if (itemDb.strBonus) base.str = (base.str || 10) + itemDb.strBonus;
          if (itemDb.dexBonus) base.dex = (base.dex || 10) + itemDb.dexBonus;
          if (itemDb.conBonus) base.con = (base.con || 10) + itemDb.conBonus;
          if (itemDb.intBonus) base.int = (base.int || 10) + itemDb.intBonus;
          if (itemDb.wisBonus) base.wis = (base.wis || 10) + itemDb.wisBonus;
          if (itemDb.mrBonus) mr += itemDb.mrBonus;
          if (itemDb.hpBonus) hpBonus += itemDb.hpBonus;
          if (itemDb.mpBonus) mpBonus += itemDb.mpBonus;
        }
      }
    });
  }
  return { ...base, mr, hpBonus, mpBonus };
}

const LINEAGE_EQUIP_LAYOUT = [
  // 第 1 排 (耳環 | 頭盔 | 項鍊)
  { key: "earring", name: "耳環", icon: "👂", type: "earring" },
  { key: "head", name: "頭盔", icon: "🪖", type: "head" },
  { key: "necklace", name: "項鍊", icon: "📿", type: "necklace" },

  // 第 2 排 (內衣 | 盔甲 | 斗篷)
  { key: "tshirt", name: "內衣", icon: "👕", type: "tshirt" },
  { key: "body", name: "盔甲", icon: "🛡️", type: "body" },
  { key: "cloak", name: "斗篷", icon: "🧣", type: "cloak" },

  // 第 3 排 (手套 | 腰帶 | 盾牌)
  { key: "glove", name: "手套", icon: "🧤", type: "glove" },
  { key: "belt", name: "腰帶", icon: "🥋", type: "belt" },
  { key: "shield", name: "盾牌", icon: "🛡️", type: "shield" },

  // 第 4 排 (戒指1 | 靴子 | 戒指2)
  { key: "ring1", name: "戒指一", icon: "💍", type: "ring" },
  { key: "boots", name: "靴子", icon: "👢", type: "boots" },
  { key: "ring2", name: "戒指二", icon: "💍", type: "ring" },

  // 第 5 排 (戒指3(Lv.76) | 武器 | 戒指4(Lv.81))
  { key: "ring3", name: "戒指三", icon: "💍", type: "ring", reqLv: 76 },
  { key: "weapon", name: "武器", icon: "⚔️", type: "weapon" },
  { key: "ring4", name: "戒指四", icon: "💍", type: "ring", reqLv: 81 },

  // 第 6 排 (符石/輔助槽)
  { key: "rune", name: "符石", icon: "🔮", type: "rune", isRuneBottom: true }
];

function renderCharTab() {
  if (!currentChar || !currentChar.stats) return;
  const stats = getCalculatedStats();
  const curLv = currentChar.level || 1;
  const maxExp = curLv * curLv * 100;
  const expPercent = Math.min(100, Math.max(0, ((currentChar.exp || 0) / maxExp) * 100));
  const hpPercent = Math.min(100, Math.max(0, ((currentChar.hp || 0) / (currentChar.maxHp || 1)) * 100));
  const mpPercent = Math.min(100, Math.max(0, ((currentChar.mp || 0) / (currentChar.maxMp || 1)) * 100));
  const weightPercent = (typeof getCurrentWeightPercent === "function") ? getCurrentWeightPercent() : 0;

  // 1. 左側儀表槽更新
  const expBar = document.getElementById("cwin-exp-bar");
  const lvExp = document.getElementById("cwin-lv-exp");
  if (expBar) expBar.style.width = `${expPercent}%`;
  if (lvExp) lvExp.innerText = `Lv. ${curLv}  ${expPercent < 10 ? '0' : ''}${expPercent.toFixed(2)}%`;

  const hpBar = document.getElementById("cwin-hp-bar");
  const hpVal = document.getElementById("cwin-hp");
  if (hpBar) hpBar.style.width = `${hpPercent}%`;
  if (hpVal) hpVal.innerText = `${currentChar.hp || 0} / ${currentChar.maxHp || 0}`;

  const mpBar = document.getElementById("cwin-mp-bar");
  const mpVal = document.getElementById("cwin-mp");
  if (mpBar) mpBar.style.width = `${mpPercent}%`;
  if (mpVal) mpVal.innerText = `${currentChar.mp || 0} / ${currentChar.maxMp || 0}`;

  const weightVal = document.getElementById("cwin-weight");
  if (weightVal) {
    weightVal.innerText = `${weightPercent}%`;
    weightVal.style.color = weightPercent >= 82 ? "#ef4444" : (weightPercent >= 50 ? "#f59e0b" : "#e2e8f0");
  }

  // 2. 六維屬性更新
  const setStat = (id, val, base) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (val > base) {
      el.innerHTML = `${val} <span style="color:#22c55e; font-size:10px;">(+${val - base})</span>`;
    } else {
      el.innerText = String(val);
    }
  };
  setStat("cwin-str", stats.str, currentChar.stats.str || 10);
  setStat("cwin-dex", stats.dex, currentChar.stats.dex || 10);
  setStat("cwin-con", stats.con, currentChar.stats.con || 10);
  setStat("cwin-int", stats.int, currentChar.stats.int || 10);
  setStat("cwin-wis", stats.wis, currentChar.stats.wis || 10);
  const chaEl = document.getElementById("cwin-cha");
  if (chaEl) chaEl.innerText = String(currentChar.stats.cha || 10);

  // 3. 魔法等級、正義與額外魔法點數
  const magicLvEl = document.getElementById("cwin-magic-lv");
  if (magicLvEl) magicLvEl.innerText = String(Math.max(1, Math.floor(curLv / 4)));

  const alignEl = document.getElementById("cwin-align");
  if (alignEl) alignEl.innerText = "32767";

  const extraSpEl = document.getElementById("cwin-extra-sp");
  if (extraSpEl) extraSpEl.innerText = String(Math.max(0, Math.floor(((stats.int || 10) - 12) / 2)));

  // 4. 四屬性防禦與迴避
  const erVal = Math.floor(curLv / 4) + Math.max(0, (stats.dex || 10) - 10);
  const erEl = document.getElementById("cwin-er");
  if (erEl) erEl.innerText = String(erVal);
  const dgEl = document.getElementById("cwin-dg");
  if (dgEl) dgEl.innerText = "0";

  // 5. 右側經典 3x5+1 裝備矩陣更新
  const matrixContainer = document.getElementById("lineage-equip-matrix");
  if (matrixContainer) {
    matrixContainer.innerHTML = "";
    if (!currentChar.equipped) currentChar.equipped = {};

    LINEAGE_EQUIP_LAYOUT.forEach(slot => {
      const slotBox = document.createElement("div");
      slotBox.className = "equip-slot-box";
      if (slot.isRuneBottom) slotBox.classList.add("slot-rune-bottom");

      const isLocked = slot.reqLv && curLv < slot.reqLv;
      const eq = !isLocked ? currentChar.equipped[slot.key] : null;
      const itemDb = (eq && typeof DB !== "undefined" && DB.items) ? DB.items[eq.name] : null;

      if (isLocked) {
        slotBox.classList.add("is-locked");
        slotBox.innerHTML = `
          <div class="slot-lock-overlay">
            <span class="lock-ico">🔒</span>
            <span class="lock-req-text">Lv.${slot.reqLv}</span>
          </div>
          <div class="slot-tag">${slot.name}</div>
        `;
        slotBox.onclick = () => {
          alert(`🔒 此戒指欄位需角色等級達到 Lv.${slot.reqLv} 始可解鎖！`);
        };
      } else if (eq) {
        const tier = itemDb?.tier || "white";
        slotBox.classList.add("has-item", `tier-${tier}`);
        const enchant = (eq.enchant !== undefined && eq.enchant > 0) ? `+${eq.enchant}` : '';

        // 視覺圖示判斷
        let itemIcon = slot.icon;
        if (slot.key === "weapon") itemIcon = (itemDb?.weaponType === "bow") ? "🏹" : "🗡️";

        slotBox.innerHTML = `
          ${enchant ? `<div class="item-enchant-badge">${enchant}</div>` : ''}
          <div class="item-visual-icon">${itemIcon}</div>
          <div class="item-name-brief">${eq.name}</div>
        `;
        slotBox.onclick = () => {
          openEquipDetailModal(slot.key);
        };
      } else {
        slotBox.innerHTML = `
          <div class="slot-watermark">${slot.icon}</div>
          <div class="slot-tag">${slot.name}</div>
        `;
        slotBox.onclick = () => {
          openEquipSelectModal(slot.key, slot.type || slot.key, slot.name);
        };
      }

      matrixContainer.appendChild(slotBox);
    });
  }

  renderPolymorphTable();
}
window.renderCharTab = renderCharTab;

// 裝備詳細與卸除彈窗
function openEquipDetailModal(slotKey) {
  if (!currentChar || !currentChar.equipped || !currentChar.equipped[slotKey]) return;
  const eq = currentChar.equipped[slotKey];
  const itemDb = (typeof DB !== "undefined" && DB.items) ? DB.items[eq.name] : null;
  const modal = document.getElementById("equip-action-modal");
  const title = document.getElementById("equip-modal-title");
  const body = document.getElementById("equip-modal-body");
  if (!modal || !title || !body) return;

  const enchant = (eq.enchant !== undefined && eq.enchant > 0) ? `+${eq.enchant} ` : '';
  title.innerText = `裝備詳情：${enchant}${eq.name}`;

  const tierColor = itemDb?.tier === "red" ? "#ef4444" : (itemDb?.tier === "blue" ? "#38bdf8" : (itemDb?.tier === "green" ? "#22c55e" : "#f1f5f9"));

  body.innerHTML = `
    <div style="background:#090a0d; border:1px solid #232730; border-radius:4px; padding:10px;">
      <div style="font-size:14px; font-weight:bold; color:${tierColor}; margin-bottom:4px;">
        ${enchant}${eq.name}
      </div>
      <div style="font-size:12px; color:#cbd5e1; display:flex; flex-direction:column; gap:3px;">
        ${itemDb?.ac !== undefined ? `<div>防禦力 (AC): <b style="color:#60a5fa;">${itemDb.ac - (eq.enchant || 0)}</b></div>` : ''}
        ${itemDb?.small !== undefined ? `<div>小型 / 大型傷害: <b>${itemDb.small + (eq.enchant || 0)} / ${itemDb.large + (eq.enchant || 0)}</b></div>` : ''}
        ${itemDb?.hitBonus ? `<div>命中加成: <b style="color:#facc15;">+${itemDb.hitBonus}</b></div>` : ''}
        ${itemDb?.strBonus ? `<div>力量 (STR): <b style="color:#22c55e;">+${itemDb.strBonus}</b></div>` : ''}
        ${itemDb?.dexBonus ? `<div>敏捷 (DEX): <b style="color:#22c55e;">+${itemDb.dexBonus}</b></div>` : ''}
        ${itemDb?.conBonus ? `<div>體質 (CON): <b style="color:#22c55e;">+${itemDb.conBonus}</b></div>` : ''}
        ${itemDb?.intBonus ? `<div>智力 (INT): <b style="color:#22c55e;">+${itemDb.intBonus}</b></div>` : ''}
        ${itemDb?.mrBonus ? `<div>抗魔 (MR): <b style="color:#a855f7;">+${itemDb.mrBonus}%</b></div>` : ''}
        <div>重量: ${itemDb?.weight || 0}</div>
        <div style="color:#94a3b8; font-size:11px; margin-top:4px;">${itemDb?.desc || ''}</div>
      </div>
    </div>
    <div style="display:flex; gap:8px; margin-top:8px;">
      <button type="button" class="btn btn-danger" style="flex:1; padding:8px;" onclick="unequipSlot('${slotKey}'); closeEquipActionModal();">卸下裝備</button>
      <button type="button" class="btn" style="flex:1; padding:8px;" onclick="closeEquipActionModal();">取消</button>
    </div>
  `;

  modal.style.display = "flex";
}
window.openEquipDetailModal = openEquipDetailModal;

// 挑選背包物品穿戴彈窗
function openEquipSelectModal(slotKey, slotType, slotDisplayName) {
  if (!currentChar || !currentChar.inventory) return;
  const modal = document.getElementById("equip-action-modal");
  const title = document.getElementById("equip-modal-title");
  const body = document.getElementById("equip-modal-body");
  if (!modal || !title || !body) return;

  title.innerText = `穿戴裝備 - 【${slotDisplayName}】`;

  // 篩選背包中符合該部位的物品
  const matchingItems = [];
  currentChar.inventory.forEach((item, invIdx) => {
    const dbItem = (typeof DB !== "undefined" && DB.items) ? DB.items[item.name] : null;
    if (!dbItem) return;

    let isMatch = false;
    if (slotType === "ring") {
      isMatch = (dbItem.slot === "ring");
    } else {
      isMatch = (dbItem.slot === slotKey || dbItem.slot === slotType);
    }

    if (isMatch) {
      matchingItems.push({ item, invIdx, dbItem });
    }
  });

  if (matchingItems.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding:16px 8px; color:#94a3b8; font-size:12px;">
        🎒 背包內目前沒有可裝備於【${slotDisplayName}】的物品。<br>
        可前往各大村莊商店購買，或在野外打怪掉落取得！
      </div>
      <div style="text-align:center; margin-top:8px;">
        <button type="button" class="btn" onclick="closeEquipActionModal();">關閉</button>
      </div>
    `;
  } else {
    let listHtml = `<div style="display:flex; flex-direction:column; gap:6px; max-height:280px; overflow-y:auto;">`;
    matchingItems.forEach(({ item, invIdx, dbItem }) => {
      const enchant = (item.enchant !== undefined && item.enchant > 0) ? `+${item.enchant} ` : '';
      const tierColor = dbItem.tier === "red" ? "#ef4444" : (dbItem.tier === "blue" ? "#38bdf8" : (dbItem.tier === "green" ? "#22c55e" : "#f1f5f9"));
      listHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#0b0d12; border:1px solid #1f2430; padding:6px 10px; border-radius:4px;">
          <div>
            <div style="font-weight:bold; color:${tierColor}; font-size:12px;">${enchant}${item.name}</div>
            <div style="font-size:10px; color:#94a3b8;">${dbItem.ac !== undefined ? `AC: ${dbItem.ac - (item.enchant||0)} ` : ''}${dbItem.desc || ''}</div>
          </div>
          <button type="button" class="btn btn-success" style="padding:4px 10px; font-size:11px;" onclick="equipItemFromInventory(${invIdx}, '${slotKey}'); closeEquipActionModal();">穿戴</button>
        </div>
      `;
    });
    listHtml += `</div>`;
    listHtml += `
      <div style="text-align:right; margin-top:8px;">
        <button type="button" class="btn" onclick="closeEquipActionModal();">取消</button>
      </div>
    `;
    body.innerHTML = listHtml;
  }

  modal.style.display = "flex";
}
window.openEquipSelectModal = openEquipSelectModal;

function closeEquipActionModal() {
  const modal = document.getElementById("equip-action-modal");
  if (modal) modal.style.display = "none";
}
window.closeEquipActionModal = closeEquipActionModal;

function renderPolymorphTable() {
  const polyTbody = document.getElementById("poly-table-body");
  if (!polyTbody) return;
  polyTbody.innerHTML = "";
  if (typeof DB === "undefined" || !DB.polymorphs) return;

  DB.polymorphs.forEach(p => {
    const canUse = currentChar.level >= p.reqLv;
    const isCurrent = currentChar.polymorph === p.name;
    const tr = document.createElement("tr");
    tr.innerHTML = `
 <td style="color:${isCurrent ? 'var(--gold)' : '#fff'}; font-weight:${isCurrent ? 'bold' : 'normal'};">
 ${p.name} <span style="font-size:10px; color:#38bdf8;">${p.type || ''}</span>
 </td>
 <td>Lv.${p.reqLv}</td>
 <td>${(p.speedInterval / 1000).toFixed(2)}s</td>
 <td>
 <button type="button" class="btn ${isCurrent ? 'btn-gold' : ''}" ${canUse ? '' : 'disabled'} onclick="changePolymorph('${p.name}')">
 ${isCurrent ? '變身中' : '選擇變身'}
 </button>
 </td>
 `;
    polyTbody.appendChild(tr);
  });
}

function changePolymorph(polyName) {
  currentChar.polymorph = polyName;
  log(`已變身為【${polyName}】！攻速與射速同步提升！`, "sys");
  renderCharTab();
  updateLeftPanel();
}

// ---------------- 技能系統 ----------------
function getSkillCooldownRemaining(skillName) {
  if (!gameState.skillCooldowns) gameState.skillCooldowns = {};
  const until = gameState.skillCooldowns[skillName] || 0;
  return Math.max(0, until - Date.now());
}

function canUseSkill(skillName) {
  return getSkillCooldownRemaining(skillName) <= 0;
}

function markSkillUsed(skillName, cooldown) {
  if (!gameState.skillCooldowns) gameState.skillCooldowns = {};
  gameState.skillCooldowns[skillName] = Date.now() + (cooldown || 2000);
}

function useSkill(skillName) {
  if (!currentChar) return false;
  if (!Array.isArray(currentChar.skills) || !currentChar.skills.includes(skillName)) {
    log(`⚠️ 你尚未學會【${skillName}】。`, "sys");
    return false;
  }
  const skill = (typeof DB !== "undefined" && DB.skills) ? DB.skills[skillName] : null;
  if (!skill) {
    log(`⚠️ 技能資料缺失：${skillName}`, "sys");
    return false;
  }
  if ((currentChar.mp || 0) < skill.mpCost) {
    log(`⚠️ MP 不足，無法使用【${skillName}】（需要 ${skill.mpCost} MP）。`, "sys");
    return false;
  }
  if (!canUseSkill(skillName)) {
    const remain = Math.ceil(getSkillCooldownRemaining(skillName) / 1000);
    log(`⏳【技能冷卻中】${skillName} 需等待 ${remain} 秒。`, "sys");
    return false;
  }

  // 套用效果
  if (skill.type === "heal") {
    const before = currentChar.hp;
    currentChar.hp = Math.min(currentChar.maxHp, currentChar.hp + (skill.power || 0));
    log(`✨ 使用【${skillName}】，HP 回復 +${currentChar.hp - before}！`, "heal");
  } else if (skill.type === "damage") {
    let target = gameState.targetMob;
    if (!target) {
      const candidates = (gameState.mobs || []).filter(m => Math.hypot(m.x - gameState.playerX, m.y - gameState.playerY) < 550);
      if (candidates.length > 0) {
        candidates.sort((a, b) => Math.hypot(a.x - gameState.playerX, a.y - gameState.playerY) - Math.hypot(b.x - gameState.playerX, b.y - gameState.playerY));
        target = candidates[0];
      }
    }
    if (target) {
      target.currentHp = (target.currentHp || target.hp) - (skill.power || 0);
      log(`🔥 使用【${skillName}】命中【${target.name}】，造成 ${skill.power} 傷害！`, "atk");
      if (target.currentHp <= 0) {
        target.currentHp = 0;
        log(`💀 【${target.name}】被技能擊敗！`, "sys");
        gameState.mobs = gameState.mobs.filter(m => m !== target);
        gameState.targetMob = null;
      }
    } else {
      log(`⚠️ 周圍沒有可攻擊的目標。`, "sys");
    }
  } else if (skill.type === "buff") {
    if (!currentChar.buffs) currentChar.buffs = {};
    currentChar.buffs[skill.stat] = (currentChar.buffs[skill.stat] || 0) + (skill.amount || 0);
    log(`🛡️ 使用【${skillName}】，${skill.stat} +${skill.amount}（${skill.duration} 秒）`, "sys");
    setTimeout(() => {
      if (currentChar && currentChar.buffs) {
        currentChar.buffs[skill.stat] = Math.max(0, (currentChar.buffs[skill.stat] || 0) - (skill.amount || 0));
      }
    }, (skill.duration || 60) * 1000);
  }

  currentChar.mp = Math.max(0, (currentChar.mp || 0) - skill.mpCost);
  markSkillUsed(skillName, skill.cooldown || 2000);
  updateLeftPanel();
  if (typeof renderSkillTab === "function") renderSkillTab();
  return true;
}
window.useSkill = useSkill;

// ==========================================================================
// 天堂經典 5x5 矩陣技能欄與職業專屬技能圖示 (Lineage Skill Matrix & Icons)
// ==========================================================================

const SKILL_ICONS = {
  // 衝擊之暈 (Shock Stun) - 雙劍交鋒衝擊波與電弧
  shock_stun: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#451a03" fill-opacity="0.6"/>
      <path d="M10 10 L32 32 L26 38 L4 16 Z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>
      <path d="M54 10 L32 32 L38 38 L60 16 Z" fill="#cbd5e1" stroke="#f8fafc" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="7" fill="#fef08a"/>
      <path d="M32 14 L35 25 L46 20 L38 32 L50 35 L37 38 L42 49 L32 40 L22 49 L27 38 L14 35 L26 32 L18 20 L29 25 Z" fill="#fbbf24"/>
      <path d="M30 4 L34 16 L28 22 L32 30" stroke="#67e8f9" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  // 堅固防護 (Solid Carriage) - 重裝堅石塔盾
  solid_carriage: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 12 L50 12 L46 44 L32 56 L18 44 Z" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <path d="M20 16 L44 16 L41 41 L32 50 L23 41 Z" fill="#334155" stroke="#d4af37" stroke-width="1.5"/>
      <path d="M32 16 L32 50 M20 28 L44 28" stroke="#d4af37" stroke-width="2.5"/>
      <circle cx="32" cy="28" r="4.5" fill="#fbbf24"/>
      <circle cx="23" cy="19" r="2" fill="#94a3b8"/>
      <circle cx="41" cy="19" r="2" fill="#94a3b8"/>
    </svg>
  `,

  // 反擊屏障 (Counter Barrier) - 紫光騎士反擊力場
  counter_barrier: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="26" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="5 3" fill="#581c87" fill-opacity="0.4"/>
      <path d="M32 10 L48 22 L42 46 L32 54 L22 46 L16 22 Z" fill="#7e22ce" stroke="#d8b4fe" stroke-width="2"/>
      <path d="M32 16 L42 25 L38 42 L32 47 L26 42 L22 25 Z" fill="#a855f7"/>
      <path d="M28 22 L36 34 M36 22 L28 34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="28" r="3.5" fill="#fef08a"/>
    </svg>
  `,

  // 增幅防禦 (Reduction Armor) - 鋼鐵板甲重裝護胸
  reduction_armor: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12 L32 18 L44 12 L50 24 L46 44 L32 54 L18 44 L14 24 Z" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M24 16 L32 20 L40 16 L44 26 L40 40 L32 47 L24 40 L20 26 Z" fill="#475569" stroke="#d4af37" stroke-width="1.5"/>
      <path d="M32 20 L32 47" stroke="#d4af37" stroke-width="2"/>
      <path d="M22 28 L42 28 M24 34 L40 34" stroke="#64748b" stroke-width="1.5"/>
      <circle cx="32" cy="28" r="3" fill="#fbbf24"/>
    </svg>
  `,

  // 狂暴將軍 (Brave Aura) - 烈火戰刃握於鐵拳
  brave_aura: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 54 C20 40 16 30 26 18 C30 24 32 14 36 8 C42 20 48 24 46 36 C52 30 50 44 44 54 Z" fill="#dc2626"/>
      <path d="M28 52 C26 42 24 34 30 24 C33 28 34 20 37 14 C40 24 44 28 42 38 C46 34 44 44 40 52 Z" fill="#f59e0b"/>
      <path d="M32 16 L32 46" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <rect x="25" y="46" width="14" height="4" rx="1" fill="#475569" stroke="#cbd5e1"/>
      <rect x="30" y="50" width="4" height="8" rx="1" fill="#78350f"/>
    </svg>
  `,

  // 三重矢 (Triple Arrow) - 妖精三道翠綠疾光箭
  triple_arrow: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-30 32 32)">
        <line x1="8" y1="32" x2="52" y2="32" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>
        <polygon points="56,32 44,26 48,32 44,38" fill="#86efac"/>
        <line x1="12" y1="28" x2="8" y2="32" stroke="#22c55e" stroke-width="2"/>
        <line x1="12" y1="36" x2="8" y2="32" stroke="#22c55e" stroke-width="2"/>
        <line x1="12" y1="18" x2="48" y2="18" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="52,18 42,13 45,18 42,23" fill="#bbf7d0"/>
        <line x1="12" y1="46" x2="48" y2="46" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="52,46 42,41 45,46 42,51" fill="#bbf7d0"/>
      </g>
      <circle cx="48" cy="18" r="3" fill="#fef08a"/>
      <circle cx="56" cy="30" r="2.5" fill="#fef08a"/>
    </svg>
  `,

  // 屬性之火 (Elemental Fire) - 火鳳凰展開熾炎雙翼
  elemental_fire: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 14 C28 24 12 28 8 44 C18 42 22 48 32 58 C42 48 46 42 56 44 C52 28 36 24 32 14 Z" fill="#b91c1c"/>
      <path d="M32 20 C29 28 18 32 14 42 C22 40 25 44 32 52 C39 44 42 40 50 42 C46 32 35 28 32 20 Z" fill="#ea580c"/>
      <path d="M32 26 C30 32 24 36 20 42 C26 40 28 42 32 48 C36 42 38 40 44 42 C40 36 34 32 32 26 Z" fill="#facc15"/>
      <circle cx="32" cy="30" r="2.5" fill="#ffffff"/>
    </svg>
  `,

  // 屬性之水 (Elemental Water) - 水藍聖十字漩渦
  elemental_water: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="25" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8 4" fill="#0c4a6e" fill-opacity="0.4"/>
      <circle cx="32" cy="32" r="18" stroke="#0ea5e9" stroke-width="2"/>
      <path d="M32 12 L32 52 M12 32 L52 32" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="6" fill="#38bdf8"/>
      <circle cx="32" cy="32" r="3" fill="#ffffff"/>
      <circle cx="20" cy="20" r="2" fill="#bae6fd"/>
      <circle cx="44" cy="44" r="2" fill="#bae6fd"/>
    </svg>
  `,

  // 屬性之風 (Elemental Wind) - 疾風雙刃螺旋
  elemental_wind: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10 C46 10 54 22 54 32 C54 36 50 36 48 32 C44 24 38 18 32 18 C22 18 16 26 18 34 C20 40 28 44 34 42 C38 40 40 36 38 34" stroke="#34d399" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M32 54 C18 54 10 42 10 32 C10 28 14 28 16 32 C20 40 26 46 32 46 C42 46 48 38 46 30 C44 24 36 20 30 22 C26 24 24 28 26 30" stroke="#6ee7b7" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="4" fill="#a7f3d0"/>
    </svg>
  `,

  // 屬性之地 (Elemental Earth) - 浮空剛石稜柱
  elemental_earth: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 52,22 44,48 32,56 20,48 12,22" fill="#14532d" stroke="#22c55e" stroke-width="2.5"/>
      <polygon points="32,14 46,24 40,44 32,50 24,44 18,24" fill="#16a34a"/>
      <polygon points="32,18 40,26 36,40 32,44 28,40 24,26" fill="#4ade80"/>
      <line x1="32" y1="18" x2="32" y2="44" stroke="#bbf7d0" stroke-width="2"/>
      <circle cx="48" cy="16" r="2.5" fill="#86efac"/>
      <circle cx="16" cy="46" r="2.5" fill="#86efac"/>
    </svg>
  `,

  // 自然之祝福 (Nature Blessing) - 妖精世界樹聖葉星光
  nature_blessing: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10 C20 22 14 36 22 48 C28 54 40 54 48 44 C52 34 46 20 32 10 Z" fill="#15803d" stroke="#86efac" stroke-width="2"/>
      <path d="M22 48 Q32 34 38 18" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
      <path d="M28 36 Q34 32 42 34" stroke="#fef08a" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="38" cy="18" r="3" fill="#fef08a"/>
      <circle cx="18" cy="24" r="1.5" fill="#fef08a"/>
      <circle cx="48" cy="38" r="2" fill="#fef08a"/>
    </svg>
  `,

  // 初級治癒術 (Heal) - 柔光治癒之手與生命光點
  heal: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="24" r="10" fill="#22c55e" fill-opacity="0.8"/>
      <circle cx="32" cy="24" r="5" fill="#fef08a"/>
      <path d="M14 48 C14 38 22 34 30 38 L32 40 L34 38 C42 34 50 38 50 48 Z" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>
      <path d="M18 48 C18 40 24 38 32 44 C40 38 46 40 46 48 Z" fill="#d97706"/>
      <line x1="32" y1="8" x2="32" y2="14" stroke="#86efac" stroke-width="2"/>
      <line x1="22" y1="14" x2="26" y2="18" stroke="#86efac" stroke-width="2"/>
      <line x1="42" y1="14" x2="38" y2="18" stroke="#86efac" stroke-width="2"/>
    </svg>
  `,

  // 魔法飛彈 (Energy Bolt) - 藍光秘術星弧飛彈
  energy_bolt: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q28 42 46 18" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="48" cy="16" r="8" fill="#38bdf8"/>
      <circle cx="48" cy="16" r="4" fill="#ffffff"/>
      <polygon points="48,6 51,13 58,16 51,19 48,26 45,19 38,16 45,13" fill="#f0f9ff"/>
      <circle cx="28" cy="34" r="3" fill="#7dd3fc"/>
      <circle cx="16" cy="44" r="2" fill="#bae6fd"/>
    </svg>
  `,

  // 光箭術 (Light Arrow) - 耀眼破魔銀光之箭
  light_arrow: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="54" x2="52" y2="12" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
      <polygon points="56,8 42,12 46,18 52,14" fill="#fef08a"/>
      <circle cx="52" cy="12" r="6" fill="#fef08a" fill-opacity="0.6"/>
      <line x1="16" y1="52" x2="12" y2="44" stroke="#94a3b8" stroke-width="2"/>
      <line x1="20" y1="56" x2="12" y2="48" stroke="#94a3b8" stroke-width="2"/>
    </svg>
  `,

  // 初級加速術 (Haste) - 疾走雷電法杖
  haste: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="52" x2="44" y2="16" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>
      <circle cx="44" cy="16" r="7" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>
      <path d="M42 6 L46 14 L52 14 L46 20 L48 28 L40 22 L34 26 L38 18 L34 12 L42 12 Z" fill="#67e8f9"/>
      <line x1="12" y1="36" x2="28" y2="36" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="8" y1="42" x2="24" y2="42" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // 火球術 (Fireball) - 熾熱滾燙爆裂火球
  fireball: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="30" r="18" fill="#b91c1c"/>
      <circle cx="36" cy="30" r="14" fill="#ea580c"/>
      <circle cx="36" cy="30" r="9" fill="#facc15"/>
      <circle cx="36" cy="30" r="4" fill="#ffffff"/>
      <path d="M12 52 C18 42 22 36 26 38" stroke="#ea580c" stroke-width="4" stroke-linecap="round"/>
      <path d="M8 44 C16 38 20 32 24 34" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      <circle cx="16" cy="22" r="2" fill="#fef08a"/>
      <circle cx="50" cy="48" r="2" fill="#fef08a"/>
    </svg>
  `,

  // 初級體力回復術 (Extra Heal) - 雙掌翡翠生命光環
  extra_heal: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 2"/>
      <circle cx="32" cy="32" r="14" fill="#15803d" fill-opacity="0.6"/>
      <path d="M28 20 L36 20 L36 28 L44 28 L44 36 L36 36 L36 44 L28 44 L28 36 L20 36 L20 28 L28 28 Z" fill="#86efac"/>
      <circle cx="32" cy="32" r="3" fill="#ffffff"/>
    </svg>
  `,

  // 極道落雷 (Lightning) - 烏雲與狂暴暗紫落雷
  lightning: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20 C16 14 24 10 32 12 C38 8 50 12 50 20 C54 22 56 28 50 32 C44 34 16 34 16 20 Z" fill="#334155"/>
      <polygon points="36,22 24,36 32,36 26,54 44,34 34,34" fill="#c084fc" stroke="#f3e8ff" stroke-width="1.5"/>
      <circle cx="28" cy="48" r="2" fill="#67e8f9"/>
      <circle cx="42" cy="40" r="1.5" fill="#67e8f9"/>
    </svg>
  `,

  // 高級治癒術 (Greater Heal) - 天使羽翼守護聖十字
  greater_heal: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 38 C24 24 10 20 8 36 C14 38 22 42 32 50 Z" fill="#fef08a" fill-opacity="0.8"/>
      <path d="M32 38 C40 24 54 20 56 36 C50 38 42 42 32 50 Z" fill="#fef08a" fill-opacity="0.8"/>
      <path d="M29 14 L35 14 L35 23 L44 23 L44 29 L35 29 L35 44 L29 44 L29 29 L20 29 L20 23 L29 23 Z" fill="#fbbf24" stroke="#fef08a" stroke-width="1.5"/>
      <circle cx="32" cy="26" r="4" fill="#ffffff"/>
      <circle cx="32" cy="8" r="3" fill="#fef08a"/>
    </svg>
  `,

  // 體魄強健術 (Physical Enchant) - 雄渾金色肌肉力魄
  physical_enchant: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="25" fill="#78350f" fill-opacity="0.5" stroke="#f59e0b" stroke-width="2"/>
      <path d="M24 16 L32 20 L40 16 L48 24 L42 46 L32 52 L22 46 L16 24 Z" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>
      <path d="M24 28 C28 32 36 32 40 28 M32 32 L32 46" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="2" fill="#fff"/>
      <circle cx="40" cy="24" r="2" fill="#fff"/>
    </svg>
  `,

  // 聖結界 (Immune to Harm) - 神聖八芒水晶護盾
  immune_to_harm: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 48,14 56,30 50,48 32,56 14,48 8,30 16,14" fill="#1e1b4b" stroke="#818cf8" stroke-width="3"/>
      <polygon points="32,14 44,18 50,30 46,44 32,50 18,44 14,30 20,18" fill="#312e81" stroke="#a5b4fc" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="8" fill="#c7d2fe"/>
      <circle cx="32" cy="32" r="4" fill="#ffffff"/>
      <line x1="32" y1="14" x2="32" y2="50" stroke="#c7d2fe" stroke-width="1.5"/>
      <line x1="14" y1="32" x2="50" y2="32" stroke="#c7d2fe" stroke-width="1.5"/>
    </svg>
  `,

  // 究極光裂術 (Disintegrate) - 終極神聖天罰烈芒
  disintegrate: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="32" y1="4" x2="32" y2="52" stroke="#fef08a" stroke-width="6" stroke-linecap="round"/>
      <line x1="32" y1="4" x2="32" y2="52" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="32" cy="52" rx="20" ry="6" fill="#f59e0b"/>
      <ellipse cx="32" cy="52" rx="14" ry="4" fill="#fef08a"/>
      <ellipse cx="32" cy="52" rx="6" ry="2" fill="#ffffff"/>
      <line x1="18" y1="36" x2="46" y2="36" stroke="#fef08a" stroke-width="2"/>
      <line x1="22" y1="24" x2="42" y2="24" stroke="#fef08a" stroke-width="2"/>
    </svg>
  `,

  // 精準目標 (True Target) - 獵鷹十字鎖定準星
  true_target: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="#ef4444" stroke-width="2.5" fill="#7f1d1d" fill-opacity="0.3"/>
      <circle cx="32" cy="32" r="14" stroke="#f87171" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="4" fill="#ef4444"/>
      <line x1="32" y1="6" x2="32" y2="22" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="32" y1="42" x2="32" y2="58" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="6" y1="32" x2="22" y2="32" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="42" y1="32" x2="58" y2="32" stroke="#ef4444" stroke-width="2.5"/>
    </svg>
  `,

  // 皇家血統 (Royal Blood) - 帝國王者黃金皇冠
  royal_blood: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 44 L16 22 L26 32 L32 16 L38 32 L48 22 L52 44 Z" fill="#b45309" stroke="#fbbf24" stroke-width="2.5"/>
      <path d="M16 44 L19 26 L26 34 L32 20 L38 34 L45 26 L48 44 Z" fill="#f59e0b"/>
      <rect x="12" y="44" width="40" height="6" rx="2" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="16" cy="22" r="3" fill="#38bdf8"/>
      <circle cx="32" cy="16" r="3.5" fill="#ef4444"/>
      <circle cx="48" cy="22" r="3" fill="#38bdf8"/>
      <circle cx="26" cy="47" r="1.5" fill="#fff"/>
      <circle cx="32" cy="47" r="1.5" fill="#fff"/>
      <circle cx="38" cy="47" r="1.5" fill="#fff"/>
    </svg>
  `,

  // 激勵士氣 (Brave Mental) - 王族戰旗與號角金光
  brave_mental: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="10" x2="16" y2="54" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 12 L46 20 L38 28 L46 36 L16 42 Z" fill="#b91c1c" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="26" cy="26" r="5" fill="#fbbf24"/>
      <polygon points="16,8 14,12 18,12" fill="#fbbf24"/>
      <path d="M48 20 C54 24 54 32 48 36" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
      <path d="M52 16 C60 22 60 34 52 40" stroke="#fef08a" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `
};

function getSkillIconSvg(iconKey) {
  if (SKILL_ICONS && SKILL_ICONS[iconKey]) {
    return SKILL_ICONS[iconKey];
  }
  return `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" fill="#334155"/><text x="32" y="38" font-size="20" text-anchor="middle" fill="#d4af37">✨</text></svg>`;
}

function getSkillBookItemName(skillName) {
  if (typeof DB !== "undefined" && DB.items) {
    for (let itemName in DB.items) {
      const item = DB.items[itemName];
      if (item && item.type === "spellbook" && item.skill === skillName) {
        return itemName;
      }
    }
  }
  return null;
}

let currentSkillFilter = "all";
let selectedSkillName = null;

function filterSkillCategory(cat) {
  currentSkillFilter = cat;
  const btns = document.querySelectorAll(".skill-cat-btn");
  btns.forEach(b => {
    if (b.getAttribute("data-cat") === cat) b.classList.add("active");
    else b.classList.remove("active");
  });
  renderSkillTab();
}
window.filterSkillCategory = filterSkillCategory;

function selectSkillInInspector(skillName) {
  selectedSkillName = skillName;
  renderSkillTab();
}
window.selectSkillInInspector = selectSkillInInspector;

function learnSkillByBook(skillName) {
  const bookName = getSkillBookItemName(skillName);
  if (!bookName) {
    alert("查無對應之技能書！");
    return;
  }
  if (typeof useItemByName === "function") {
    useItemByName(bookName);
  }
  renderSkillTab();
  if (typeof updateLeftPanel === "function") updateLeftPanel();
}
window.learnSkillByBook = learnSkillByBook;

function useSkillFromTab(skillName) {
  if (typeof useSkill === "function") {
    useSkill(skillName);
  }
  renderSkillTab();
}
window.useSkillFromTab = useSkillFromTab;

function renderSkillTab() {
  const gridContainer = document.getElementById("skill-matrix-grid");
  const inspector = document.getElementById("skill-detail-inspector");

  // 若不在技能矩陣結構中，嘗試後備相容
  if (!gridContainer) {
    const legacyContainer = document.getElementById("skill-list-container");
    if (!legacyContainer) return;
    legacyContainer.innerHTML = "";
    const learned = (currentChar && Array.isArray(currentChar.skills)) ? currentChar.skills : [];
    if (learned.length === 0) {
      legacyContainer.innerHTML = `<div style="color:#7e889b; padding:12px;">尚未學會任何技能，使用魔法書即可學習。</div>`;
    } else {
      learned.forEach(sn => {
        const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[sn] : null;
        if (!sk) return;
        const cd = getSkillCooldownRemaining(sn);
        const card = document.createElement("div");
        card.style.cssText = "background:#0f131a; border:1px solid #2e3440; border-radius:6px; padding:8px;";
        card.innerHTML = `<div style="color:var(--gold); font-weight:bold;">${sk.name}</div><div style="font-size:11px;">MP ${sk.mpCost}</div>`;
        legacyContainer.appendChild(card);
      });
    }
    return;
  }

  gridContainer.innerHTML = "";

  if (typeof DB === "undefined" || !DB.skills) return;

  const allSkills = Object.values(DB.skills);
  const filteredSkills = allSkills.filter(sk => {
    if (currentSkillFilter === "all") return true;
    return sk.school === currentSkillFilter;
  });

  // 如果當前選取的技能不在目前過濾結果中，重設為第一個技能
  if (!selectedSkillName || !filteredSkills.some(s => s.name === selectedSkillName)) {
    selectedSkillName = filteredSkills.length > 0 ? filteredSkills[0].name : null;
  }

  // 取得角色當前背包與已學會技能
  const learnedList = (currentChar && Array.isArray(currentChar.skills)) ? currentChar.skills : [];
  const inventoryList = (currentChar && Array.isArray(currentChar.inventory)) ? currentChar.inventory : [];

  filteredSkills.forEach(skill => {
    const isLearned = learnedList.includes(skill.name);
    const bookName = getSkillBookItemName(skill.name);
    const hasBook = inventoryList.some(i => i.name === bookName && (i.count || 1) > 0);
    const cd = getSkillCooldownRemaining(skill.name);
    const isSelected = skill.name === selectedSkillName;

    const slot = document.createElement("div");
    let stateClass = "state-unlearned";
    if (isLearned) stateClass = "state-learned";
    else if (hasBook) stateClass = "state-can-learn";

    slot.className = `skill-slot-box ${stateClass} ${isSelected ? "selected" : ""}`;
    slot.onclick = () => selectSkillInInspector(skill.name);
    slot.title = `${skill.name} (${skill.mode === "passive" ? "被動技術" : "主動技能"})`;

    const isPassive = skill.mode === "passive";
    const badgeText = isPassive ? "P" : "A";
    const badgeClass = isPassive ? "badge-p" : "badge-a";

    let bottomIndicator = "";
    if (!isLearned && hasBook) {
      bottomIndicator = `<div class="skill-learn-text">學習</div>`;
    } else if (!isLearned && !hasBook) {
      bottomIndicator = `<div class="skill-plus-sign">+</div>`;
    }

    let cdOverlay = "";
    if (isLearned && cd > 0) {
      cdOverlay = `<div class="skill-cooldown-overlay">${Math.ceil(cd / 1000)}s</div>`;
    }

    slot.innerHTML = `
      <div class="skill-badge ${badgeClass}">${badgeText}</div>
      <div class="skill-art-container">
        ${getSkillIconSvg(skill.iconKey)}
      </div>
      ${bottomIndicator}
      ${cdOverlay}
    `;

    gridContainer.appendChild(slot);
  });

  // 補充空槽使視覺填滿 5 的倍數 (至少滿 25 格，與附圖 5x5 完美一致)
  const totalSlotsNeeded = Math.max(25, Math.ceil(filteredSkills.length / 5) * 5);
  const emptySlotsCount = totalSlotsNeeded - filteredSkills.length;
  for (let i = 0; i < emptySlotsCount; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "skill-slot-box";
    emptySlot.style.opacity = "0.2";
    emptySlot.style.cursor = "default";
    gridContainer.appendChild(emptySlot);
  }

  // 渲染右側詳細屬性檢視器 (Inspector)
  if (inspector) {
    if (!selectedSkillName || !DB.skills[selectedSkillName]) {
      inspector.innerHTML = `<div style="color:#64748b; padding:20px; text-align:center;">請點選左側技能槽位檢視詳細屬性。</div>`;
      return;
    }

    const curSkill = DB.skills[selectedSkillName];
    const isLearned = learnedList.includes(curSkill.name);
    const bookName = getSkillBookItemName(curSkill.name);
    const hasBook = inventoryList.some(i => i.name === bookName && (i.count || 1) > 0);
    const cd = getSkillCooldownRemaining(curSkill.name);
    const isPassive = curSkill.mode === "passive";

    const schoolLabels = {
      knight: "🛡️ 騎士技術",
      elf: "🏹 精靈魔法",
      normal: "🧙‍♂️ 正統魔法",
      prince: "👑 王族魔法"
    };

    let actionBtnHtml = "";
    if (!isLearned && hasBook) {
      actionBtnHtml = `
        <button type="button" class="btn btn-gold" style="padding:10px; font-weight:bold; font-size:13px;" onclick="learnSkillByBook('${curSkill.name}')">
          ✨ 研讀習得【${curSkill.name}】
        </button>
      `;
    } else if (isLearned && !isPassive) {
      actionBtnHtml = `
        <button type="button" class="btn btn-gold" style="padding:10px; font-weight:bold; font-size:13px;" ${cd > 0 ? "disabled" : ""} onclick="useSkillFromTab('${curSkill.name}')">
          ${cd > 0 ? "⏳ 冷卻中 (" + Math.ceil(cd / 1000) + " 秒)" : "⚔️ 手動施放技能"}
        </button>
      `;
    } else if (isLearned && isPassive) {
      actionBtnHtml = `
        <button type="button" class="btn" disabled style="padding:10px; font-weight:bold; font-size:12px; color:#86efac; border-color:#22c55e; background:#052e16;">
          🌟 被動技術・角色數值恆常生效中
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button type="button" class="btn" disabled style="padding:10px; font-weight:bold; font-size:12px; color:#71717a; border-color:#333; background:#12141a;">
          🔒 尚未習得 (缺少 ${bookName || "專屬秘笈"})
        </button>
      `;
    }

    let effectDesc = "";
    if (curSkill.type === "damage") {
      effectDesc = `單體破壞威力：${curSkill.power} 點傷害`;
    } else if (curSkill.type === "heal") {
      effectDesc = `神聖生命回復：+${curSkill.power} 點 HP`;
    } else if (curSkill.type === "buff") {
      effectDesc = `${curSkill.stat.toUpperCase()} 提升 +${curSkill.amount}（持續 ${curSkill.duration} 秒）`;
    }

    inspector.innerHTML = `
      <div class="skill-insp-header">
        <div class="skill-insp-art">
          ${getSkillIconSvg(curSkill.iconKey)}
        </div>
        <div class="skill-insp-info">
          <div class="skill-insp-name">${curSkill.name}</div>
          <div class="skill-insp-tags">
            <span class="skill-tag-pill ${isPassive ? "skill-tag-passive" : "skill-tag-active"}">
              ${isPassive ? "P 被動技術" : "A 主動技能"}
            </span>
            <span class="skill-tag-pill skill-tag-school">
              ${schoolLabels[curSkill.school] || "通用"}
            </span>
            <span class="skill-tag-pill" style="background:#27272a; color:#cbd5e1;">Tier ${curSkill.tier || 1}</span>
          </div>
        </div>
      </div>

      <div class="skill-insp-props">
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">消耗 MP</span>
          <span class="insp-prop-val" style="color:#60a5fa;">${curSkill.mpCost} 點</span>
        </div>
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">冷卻時間</span>
          <span class="insp-prop-val">${curSkill.cooldown ? curSkill.cooldown / 1000 + " 秒" : "無冷卻"}</span>
        </div>
        <div class="insp-prop-row" style="grid-column: span 2;">
          <span class="insp-prop-lbl">技能效益</span>
          <span class="insp-prop-val" style="color:#86efac;">${effectDesc}</span>
        </div>
      </div>

      <div class="skill-insp-desc">
        ${curSkill.desc || "無詳細說明"}
      </div>

      <div class="skill-insp-source">
        <div style="color:#94a3b8; font-size:11px; margin-bottom:2px;">【修煉習得來源】</div>
        <div>對應書冊：<b style="color:var(--gold);">${bookName || "官方特許導師授予"}</b></div>
        <div style="font-size:10.5px; color:#64748b; margin-top:2px;">
          ${hasBook ? "✅ 背包中已持有此書，可直接點擊下方立即學習。" : (isLearned ? "✨ 角色已完全掌握此項技能能力。" : "💡 可於各大村莊技能導師、奇岩名匠購買或野外菁英怪獲取。")}
        </div>
      </div>

      <div class="skill-insp-actions">
        ${actionBtnHtml}
      </div>
    `;
  }
}
window.renderSkillTab = renderSkillTab;