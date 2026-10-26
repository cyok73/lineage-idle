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

function renderSkillTab() {
  const container = document.getElementById("skill-list-container");
  if (!container) return;
  container.innerHTML = "";

  const learned = (currentChar && Array.isArray(currentChar.skills)) ? currentChar.skills : [];
  if (learned.length === 0) {
    container.innerHTML = `<div style="color:#7e889b; padding:12px;">尚未學會任何技能，使用魔法書即可學習。</div>`;
  } else {
    learned.forEach(skillName => {
      const skill = (typeof DB !== "undefined" && DB.skills) ? DB.skills[skillName] : null;
      if (!skill) return;
      const cd = getSkillCooldownRemaining(skillName);
      const card = document.createElement("div");
      card.style.cssText = "background:#0f131a; border:1px solid #2e3440; border-radius:6px; padding:8px; display:flex; flex-direction:column; gap:4px;";
      card.innerHTML = `
        <div style="font-weight:bold; color:var(--gold); font-size:13px;">${skill.name}</div>
        <div style="font-size:11px; color:#94a3b8;">${skill.desc || ""}</div>
        <div style="font-size:11px; color:#38bdf8;">MP ${skill.mpCost} ｜ 冷卻 ${Math.ceil((skill.cooldown||0)/1000)}s</div>
        <button class="btn btn-gold" ${cd > 0 ? "disabled" : ""} onclick="useSkill('${skill.name}')">
          ${cd > 0 ? "冷卻中 " + Math.ceil(cd/1000) + "s" : "使用"}
        </button>
      `;
      container.appendChild(card);
    });
  }

  // 裝備欄位已移至人物狀態分頁，避免重複顯示
}