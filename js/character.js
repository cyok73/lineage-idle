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
      tabBattle.style.setProperty("display", "block", "important");
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

    // F. 安全依序執行渲染 (使用安全判定，不再發生 ReferenceError)
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
  if (typeof stopLoop === "function") stopLoop();
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

function renderCharTab() {
  if (!currentChar || !currentChar.stats) return;
  const stats = getCalculatedStats();

  const strEl = document.getElementById("attr-str");
  const dexEl = document.getElementById("attr-dex");
  const conEl = document.getElementById("attr-con");
  const intEl = document.getElementById("attr-int");
  const wisEl = document.getElementById("attr-wis");

  if (strEl) strEl.innerHTML = `${stats.str} ${stats.str > currentChar.stats.str ? `<span style="color:#22c55e; font-size:11px;">(+${stats.str - currentChar.stats.str})</span>` : ''}`;
  if (dexEl) dexEl.innerHTML = `${stats.dex} ${stats.dex > currentChar.stats.dex ? `<span style="color:#22c55e; font-size:11px;">(+${stats.dex - currentChar.stats.dex})</span>` : ''}`;
  if (conEl) conEl.innerHTML = `${stats.con} ${stats.con > currentChar.stats.con ? `<span style="color:#22c55e; font-size:11px;">(+${stats.con - currentChar.stats.con})</span>` : ''}`;
  if (intEl) intEl.innerHTML = `${stats.int} ${stats.int > currentChar.stats.int ? `<span style="color:#22c55e; font-size:11px;">(+${stats.int - currentChar.stats.int})</span>` : ''}`;
  if (wisEl) wisEl.innerHTML = `${stats.wis} ${stats.wis > currentChar.stats.wis ? `<span style="color:#22c55e; font-size:11px;">(+${stats.wis - currentChar.stats.wis})</span>` : ''}`;

  const eqContainer = document.getElementById("equip-slots-container");
  if (!eqContainer) return;
  eqContainer.innerHTML = "";

  const slotDefinitions = [
    { key: "weapon", name: "武器", icon: "⚔️" },
    { key: "body", name: "盔甲", icon: "🛡️" },
    { key: "head", name: "頭盔", icon: "🪖" },
    { key: "shield", name: "盾牌", icon: "🛡️" },
    { key: "cloak", name: "斗篷", icon: "🧣" },
    { key: "glove", name: "手套", icon: "🧤" },
    { key: "boots", name: "靴子", icon: "👢" },
    { key: "necklace", name: "項鍊", icon: "📿" },
    { key: "earring", name: "耳環", icon: "👂" },
    { key: "ring1", name: "戒指一", icon: "💍" },
    { key: "ring2", name: "戒指二", icon: "💍" },
    { key: "belt", name: "腰帶", icon: "🥋" }
  ];

  if (!currentChar.equipped) currentChar.equipped = {};

  const grid = document.createElement("div");
  grid.style.cssText = "display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:6px; margin-top:4px;";

  slotDefinitions.forEach(slot => {
    const eq = currentChar.equipped[slot.key];
    const itemDb = (eq && typeof DB !== "undefined" && DB.items) ? DB.items[eq.name] : null;

    const slotCard = document.createElement("div");
    slotCard.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f131a;
      border: 1px solid ${eq ? '#7f1d1d' : '#222834'};
      border-left: 3px solid ${eq ? '#dc2626' : '#475569'};
      border-radius: 4px;
      padding: 6px 10px;
    `;

    let titleHtml = "";
    if (eq) {
      const enchantPrefix = (eq.enchant !== undefined && eq.enchant > 0) ? `+${eq.enchant} ` : '';
      const tierColor = itemDb?.tier === "red" ? "#ef4444" : (itemDb?.tier === "blue" ? "#38bdf8" : (itemDb?.tier === "green" ? "#22c55e" : "#f1f5f9"));
      titleHtml = `
        <div style="font-size:12px; font-weight:bold; color:${tierColor};">
          ${enchantPrefix}${eq.name}
        </div>
        <div style="font-size:10px; color:#94a3b8; margin-top:1px;">
          ${itemDb?.ac !== undefined ? `AC: ${itemDb.ac - (eq.enchant || 0)} ` : ''}
          ${itemDb?.desc || ''}
        </div>
      `;
    } else {
      titleHtml = `<span style="color:#64748b; font-size:12px;">無裝備</span>`;
    }

    slotCard.innerHTML = `
      <div>
        <div style="font-size:11px; color:#cbd5e1; display:flex; align-items:center; gap:4px;">
          <span>${slot.icon}</span>
          <span style="font-weight:bold; color:#e2e8f0;">${slot.name}</span>
        </div>
        <div style="margin-top:2px;">${titleHtml}</div>
      </div>
      <div>
        ${eq ? `<button type="button" class="btn btn-danger" style="padding:2px 8px; font-size:11px;" onclick="unequipSlot('${slot.key}')">卸下</button>` : ''}
      </div>
    `;

    grid.appendChild(slotCard);
  });

  eqContainer.appendChild(grid);
  renderPolymorphTable();
}

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

// ---------------- 新增：全域存檔管理 ----------------
function saveAccountData() {
  if (!currentUser || !currentChar) return;

  // 記錄角色當下的掛機狀態、村莊狀態與座標
  if (!currentChar.savedState) currentChar.savedState = {};
  currentChar.savedState.inVillage = gameState.inVillage;
  currentChar.savedState.playerX = gameState.playerX;
  currentChar.savedState.playerY = gameState.playerY;
  currentChar.savedState.currentMap = gameState.currentMap;
  currentChar.savedState.isRunning = gameState.isRunning;
  currentChar.savedState.botStatus = gameState.botStatus;

  const idx = currentUser.characters.findIndex(c => c.name === currentChar.name);
  if (idx !== -1) {
    currentUser.characters[idx] = currentChar;
  }
  localStorage.setItem("lineage_acc_" + currentUser.username, JSON.stringify(currentUser));
}
window.saveAccountData = saveAccountData;