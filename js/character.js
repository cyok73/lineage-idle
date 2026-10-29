// js/character.js - 角色管理、創角配點與【進入世界】黑屏自癒修復版

const ADEN_CLASS_DATA = {
  barbarian: {
    name: "野蠻人",
    base: { str: 16, dex: 13, con: 15, int: 8, wis: 8, cha: 10 },
    bonusPoints: 4,
    initWeapon: "短劍",
    initArmor: "皮背心"
  },
  sorceress: {
    name: "魔法使",
    base: { str: 9, dex: 10, con: 11, int: 16, wis: 14, cha: 10 },
    bonusPoints: 14,
    initWeapon: "法杖",
    initArmor: "皮背心"
  },
  paladin: {
    name: "聖騎士",
    base: { str: 14, dex: 12, con: 14, int: 10, wis: 12, cha: 12 },
    bonusPoints: 6,
    initWeapon: "短劍",
    initArmor: "皮背心"
  },
  necromancer: {
    name: "死靈法師",
    base: { str: 10, dex: 11, con: 13, int: 14, wis: 12, cha: 10 },
    bonusPoints: 10,
    initWeapon: "短劍",
    initArmor: "皮背心"
  },
  amazon: {
    name: "亞馬遜",
    base: { str: 12, dex: 16, con: 13, int: 10, wis: 10, cha: 9 },
    bonusPoints: 7,
    initWeapon: "獵人之弓",
    initArmor: "皮背心"
  },

};

const CharCreator = {
  currentClass: "barbarian",
  stats: { str: 16, dex: 13, con: 15, int: 8, wis: 8, cha: 10 },
  remainPoints: 4
};

function resolveClassPreset(clsKey) {
  if (!clsKey) return ADEN_CLASS_DATA.barbarian;
  const k = String(clsKey).trim().toLowerCase();
  if (k === "野蠻人" || k === "barbarian" || k === "騎士" || k === "knight") return ADEN_CLASS_DATA.barbarian;
  if (k === "魔法使" || k === "sorceress" || k === "法師" || k === "mage" || k === "wizard") return ADEN_CLASS_DATA.sorceress;
  if (k === "聖騎士" || k === "paladin" || k === "王族" || k === "prince") return ADEN_CLASS_DATA.paladin;
  if (k === "死靈法師" || k === "necromancer") return ADEN_CLASS_DATA.necromancer;
  if (k === "亞馬遜" || k === "amazon" || k === "妖精" || k === "elf") return ADEN_CLASS_DATA.amazon;
  return ADEN_CLASS_DATA[k] || ADEN_CLASS_DATA.barbarian;
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
    const isRanged = (char.charClass === "amazon");
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

  if (!char.name) char.name = "聖休亞瑞冒險者";
  
  // 暗黑職業相容與自動升級遷移
  const CLASS_MIGRATION = {
    knight: "barbarian",
    prince: "paladin",
    elf: "amazon",
    mage: "sorceress",
    "騎士": "barbarian",
    "王族": "paladin",
    "妖精": "amazon",
    "法師": "sorceress"
  };
  if (CLASS_MIGRATION[char.charClass]) {
    char.charClass = CLASS_MIGRATION[char.charClass];
  }
  if (!char.charClass || !ADEN_CLASS_DATA[char.charClass]) {
    char.charClass = "barbarian";
  }

  // 暗黑五大章節獵場自動升級遷移
  const MAP_MIGRATION = {
    "talking_island": "blood_moor",
    "ti_cave_1f": "stony_field",
    "ti_cave_2f": "catacombs",
    "ti_boss_room": "catacombs",
    "gludio_1f": "rocky_waste",
    "gludio_2f": "ancient_tunnels",
    "gludio_3f": "tal_rasha_tomb",
    "gludio_4f": "spider_forest",
    "gludio_5f": "travincal",
    "gludio_6f": "durance_of_hate",
    "gludio_7f": "chaos_sanctuary",
    "ant_nest_1f": "rocky_waste",
    "ant_nest_2f": "ancient_tunnels",
    "werner_village_field": "spider_forest",
    "windwood_desert": "rocky_waste",
    "giran_1f": "travincal",
    "giran_4f": "durance_of_hate",
    "silver_knight_field": "bloody_foothills",
    "heine_water_dungeon": "arreat_summit",
    "werden_fire_dragon": "worldstone_chamber"
  };
  if (char.savedState) {
    if (char.savedState.currentMap && MAP_MIGRATION[char.savedState.currentMap]) {
      char.savedState.currentMap = MAP_MIGRATION[char.savedState.currentMap];
    }
    if (!char.savedState.currentMap || char.savedState.currentMap === "talking_island") {
      char.savedState.currentMap = "blood_moor";
    }
  }

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
  // 清洗舊版天堂技能並自動習得符合等級之暗黑神技
  if (typeof DB !== "undefined" && DB.skills) {
    const validD2Skills = Object.keys(DB.skills);
    char.skills = char.skills.filter(sn => validD2Skills.includes(sn));
    const curLv = char.level || 1;
    const curCls = char.charClass || "barbarian";
    Object.values(DB.skills).forEach(sk => {
      if (sk.school === curCls && (sk.reqLv || 1) <= curLv) {
        if (!char.skills.includes(sk.name)) {
          char.skills.push(sk.name);
        }
      }
    });
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
window.sanitizeCharacterData = sanitizeCharacterData;

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
    const MAP_MIGRATION = {
      "talking_island": "blood_moor",
      "ti_cave_1f": "stony_field",
      "ti_cave_2f": "catacombs",
      "ti_boss_room": "catacombs",
      "gludio_1f": "rocky_waste",
      "gludio_2f": "ancient_tunnels",
      "gludio_3f": "tal_rasha_tomb",
      "gludio_4f": "spider_forest",
      "gludio_5f": "travincal",
      "gludio_6f": "durance_of_hate",
      "gludio_7f": "chaos_sanctuary",
      "ant_nest_1f": "rocky_waste",
      "ant_nest_2f": "ancient_tunnels",
      "werner_village_field": "spider_forest",
      "windwood_desert": "rocky_waste",
      "giran_1f": "travincal",
      "giran_4f": "durance_of_hate",
      "silver_knight_field": "bloody_foothills",
      "heine_water_dungeon": "arreat_summit",
      "werden_fire_dragon": "worldstone_chamber"
    };

    if (typeof DB !== "undefined" && DB.maps && !DB.maps[gameState.currentMap]) {
      gameState.currentMap = "blood_moor";
    }

    // 🚨 核心邏輯：讀取上次下線前的掛機與地圖座標狀態
    if (currentChar.savedState) {
      gameState.currentMap = currentChar.savedState.currentMap || "blood_moor";
      if (MAP_MIGRATION[gameState.currentMap]) {
        gameState.currentMap = MAP_MIGRATION[gameState.currentMap];
      }

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
      gameState.currentMap = "blood_moor";
      gameState.isRunning = false;
      gameState.botStatus = "village";
      gameState.inVillage = true;
    }

    // 同步 UI 獵場與城鎮下拉選單
    const mapSelect = document.getElementById("map-select");
    if (mapSelect && gameState.currentMap) {
      mapSelect.value = gameState.currentMap;
    }
    const villageSelect = document.getElementById("village-select");
    if (villageSelect && gameState.viewingVillage) {
      villageSelect.value = gameState.viewingVillage;
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
    const classIcons = { barbarian: "🪓", sorceress: "🔮", paladin: "🛡️", necromancer: "💀", amazon: "🏹" };
    const classIcon = classIcons[c.charClass] || "⚔️";

    card.innerHTML = `
 <div>
 <b style="color:var(--gold, #f59e0b); font-size:14px;">${classIcon} ${c.name || '無名氏'}</b>
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
    clsSelect.value = "barbarian";
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
  const selectedKey = clsSelect ? clsSelect.value : "barbarian";
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
  const validClasses = ["barbarian", "sorceress", "paladin", "necromancer", "amazon"];
  const clsKey = validClasses.includes(CharCreator.currentClass) ? CharCreator.currentClass : "barbarian";

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
      { name: "箭", count: (clsKey === "amazon") ? 1000 : 0 },
      { name: "銀箭", count: (clsKey === "amazon") ? 500 : 0 }
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

        // 視覺像素圖示
        const pixelIconHtml = (typeof getItemIconHtml === "function") 
          ? getItemIconHtml(eq.name, "size-equip")
          : `<div class="item-visual-icon">${(slot.key === "weapon" && itemDb?.weaponType === "bow") ? "🏹" : slot.icon}</div>`;

        slotBox.innerHTML = `
          ${enchant ? `<div class="item-enchant-badge">${enchant}</div>` : ''}
          <div class="item-visual-container" style="display:flex; justify-content:center; align-items:center; height:42px;">${pixelIconHtml}</div>
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
  const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(eq.name, "size-lg") : "";

  body.innerHTML = `
    <div style="background:#090a0d; border:1px solid #232730; border-radius:4px; padding:12px; display:flex; gap:12px; align-items:flex-start;">
      <div style="flex-shrink:0;">${iconHtml}</div>
      <div style="flex:1;">
        <div style="font-size:15px; font-weight:bold; color:${tierColor}; margin-bottom:6px;">
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
      const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(item.name) : "";
      listHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#0b0d12; border:1px solid #1f2430; padding:6px 10px; border-radius:4px;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${iconHtml}
            <div>
              <div style="font-weight:bold; color:${tierColor}; font-size:12px;">${enchant}${item.name}</div>
              <div style="font-size:10px; color:#94a3b8;">${dbItem.ac !== undefined ? `AC: ${dbItem.ac - (item.enchant||0)} ` : ''}${dbItem.desc || ''}</div>
            </div>
          </div>
          <button type="button" class="btn btn-success" style="padding:4px 10px; font-size:11px;" onclick="equipItemFromInventory(${invIdx}, '${slotKey}'); closeEquipActionModal();">穿戴</button>
        </div>
      `;
    });
    listHtml += `</div><div style="text-align:right; margin-top:8px;"><button type="button" class="btn" onclick="closeEquipActionModal();">取消</button></div>`;
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
  const charCls = (currentChar && currentChar.charClass) || "barbarian";
  if (typeof isSkillMatchClass === "function" ? !isSkillMatchClass(skill, charCls) : (skill.school !== charCls && skill.school !== "common")) {
    log(`⚠️ 【${skillName}】非本職業技能，無法使用！`, "sys");
    return false;
  }
  if ((currentChar.mp || 0) < skill.mpCost) {
    log(`⚠️ MP 不足，無法使用【${skillName}】（需要 ${skill.mpCost} MP）。`, "sys");
    return false;
  }
  if (skill.hpCost && (currentChar.hp || 0) <= skill.hpCost) {
    log(`⚠️ HP 不足，無法使用【${skillName}】（需要 ${skill.hpCost} HP）。`, "sys");
    return false;
  }
  if (!canUseSkill(skillName)) {
    const remain = Math.ceil(getSkillCooldownRemaining(skillName) / 1000);
    log(`⏳【技能冷卻中】${skillName} 需等待 ${remain} 秒。`, "sys");
    return false;
  }

  // 扣除 HP 消耗 (若技能需要消耗生命值)
  if (skill.hpCost) {
    currentChar.hp = Math.max(1, (currentChar.hp || 0) - skill.hpCost);
  }

  // 暗黑破壞神技能釋放效果
  if (skill.type === "heal") {
    const before = currentChar.hp;
    currentChar.hp = Math.min(currentChar.maxHp, currentChar.hp + (skill.power || 50));
    log(`✨ 施展【${skillName}】，神聖生命回復 +${currentChar.hp - before}！`, "heal");
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
      const totalDmg = skill.power || 80;
      target.currentHp = (target.currentHp || target.hp) - totalDmg;
      log(`⚔️ 施展【${skillName}】猛烈命中【${target.name}】，造成 ${totalDmg} 點破壞打擊！`, "atk");
      if (target.currentHp <= 0) {
        target.currentHp = 0;
        log(`💀 【${target.name}】被技能擊倒！`, "sys");
        if (typeof handleMobDeathAndRewards === "function") {
          handleMobDeathAndRewards(target);
        }
      }
    } else {
      log(`⚠️ 周圍沒有可攻擊的目標。`, "sys");
    }
  } else if (skill.type === "buff" || skill.type === "shield") {
    if (!currentChar.buffs) currentChar.buffs = {};
    currentChar.buffs[skill.stat || "buff"] = (currentChar.buffs[skill.stat || "buff"] || 0) + (skill.amount || 10);
    log(`🛡️ 施展【${skillName}】，${skill.stat || "狀態"} +${skill.amount || 10}（持續 ${skill.duration || 120} 秒）！`, "sys");
    setTimeout(() => {
      if (currentChar && currentChar.buffs) {
        currentChar.buffs[skill.stat || "buff"] = Math.max(0, (currentChar.buffs[skill.stat || "buff"] || 0) - (skill.amount || 10));
      }
    }, (skill.duration || 120) * 1000);
  } else if (skill.type === "curse") {
    log(`💀 施展【${skillName}】，黑暗詛咒籠罩全場！`, "sys");
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


// ==========================================================================
// ⚔️ 暗黑破壞神經典五大職業專屬技能圖示向量庫 (25 大經典神技)
// ==========================================================================
const SKILL_ICONS = {
  // --- 1. 野蠻人 (Barbarian) ---
  weapon_mastery: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#1c1917" stroke="#b91c1c" stroke-width="2"/>
      <path d="M14 50 L48 16 L50 20 L18 52 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M50 14 L46 18 L52 24 L56 20 Z" fill="#dc2626"/>
      <path d="M50 50 L16 16 L20 12 L52 48 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <path d="M14 14 L18 10 L24 16 L20 20 Z" fill="#b91c1c"/>
      <circle cx="32" cy="32" r="6" fill="#ef4444" opacity="0.8"/>
    </svg>
  `,
  frenzy: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#260e0e" stroke="#dc2626" stroke-width="2"/>
      <path d="M16 46 Q32 20 48 18" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
      <path d="M18 18 Q32 20 48 46" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 40 L24 50 L14 54 Z" fill="#b91c1c"/>
      <path d="M52 40 L40 50 L50 54 Z" fill="#ea580c"/>
      <circle cx="32" cy="28" r="8" fill="#fef08a" opacity="0.6"/>
    </svg>
  `,
  battle_orders: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#1f1b14" stroke="#d97706" stroke-width="2"/>
      <path d="M18 42 L28 36 L44 48 L46 44 L30 32 L20 36 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <path d="M44 26 C48 30 48 36 44 40" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <path d="M48 20 C54 26 54 40 48 46" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <path d="M52 14 C60 22 60 44 52 52" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,
  whirlwind: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
      <path d="M32 10 A22 22 0 1 1 12 38" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <path d="M32 18 A14 14 0 1 1 20 36" stroke="#f8fafc" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M32 26 A6 6 0 1 1 28 34" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <polygon points="32,6 36,14 28,14" fill="#38bdf8"/>
    </svg>
  `,
  berserk: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
      <circle cx="32" cy="28" r="14" fill="#18181b" stroke="#71717a" stroke-width="2"/>
      <circle cx="26" cy="26" r="3.5" fill="#ef4444"/>
      <circle cx="38" cy="26" r="3.5" fill="#ef4444"/>
      <path d="M26 36 Q32 42 38 36" stroke="#fca5a5" stroke-width="2.5" fill="none"/>
      <path d="M14 22 L22 18 L20 28 Z" fill="#991b1b"/>
      <path d="M50 22 L42 18 L44 28 Z" fill="#991b1b"/>
    </svg>
  `,

  // --- 2. 魔法使 (Sorceress) ---
  teleport: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#082f49" stroke="#0284c7" stroke-width="2"/>
      <ellipse cx="32" cy="32" rx="12" ry="24" stroke="#38bdf8" stroke-width="3" fill="#0369a1" fill-opacity="0.4"/>
      <ellipse cx="32" cy="32" rx="6" ry="16" stroke="#e0f2fe" stroke-width="2" fill="#7dd3fc"/>
      <circle cx="32" cy="32" r="3" fill="#ffffff"/>
      <circle cx="18" cy="20" r="1.5" fill="#bae6fd"/>
      <circle cx="46" cy="44" r="1.5" fill="#bae6fd"/>
    </svg>
  `,
  meteor: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#431407" stroke="#ea580c" stroke-width="2"/>
      <path d="M14 14 L38 38" stroke="#f97316" stroke-width="8" stroke-linecap="round"/>
      <path d="M18 10 L34 26" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="42" cy="42" r="12" fill="#7c2d12" stroke="#ea580c" stroke-width="2"/>
      <circle cx="40" cy="40" r="8" fill="#f97316"/>
      <circle cx="38" cy="38" r="4" fill="#fef08a"/>
    </svg>
  `,
  chain_lightning: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#0c1a30" stroke="#38bdf8" stroke-width="2"/>
      <path d="M36 8 L18 28 L32 28 L22 56 L46 32 L32 32 Z" fill="#67e8f9" stroke="#e0f2fe" stroke-width="2"/>
      <path d="M44 26 L56 36 L48 42" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,
  blizzard: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#082f49" stroke="#7dd3fc" stroke-width="2"/>
      <path d="M32 12 L32 52 M12 32 L52 32 M18 18 L46 46 M18 46 L46 18" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="4" fill="#38bdf8"/>
      <circle cx="20" cy="24" r="2" fill="#ffffff"/>
      <circle cx="44" cy="40" r="2" fill="#ffffff"/>
    </svg>
  `,
  frozen_orb: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#0c2438" stroke="#0ea5e9" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="32" cy="32" r="8" fill="#bae6fd"/>
      <path d="M32 8 L32 16 M32 48 L32 56 M8 32 L16 32 M48 32 L56 32 M15 15 L21 21 M43 43 L49 49 M15 49 L21 43 M43 21 L49 15" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  energy_shield: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
      <circle cx="32" cy="32" r="20" stroke="#a5b4fc" stroke-width="3" fill="#312e81" fill-opacity="0.5"/>
      <path d="M32 18 L44 26 L40 42 L32 48 L24 42 L20 26 Z" stroke="#c7d2fe" stroke-width="2" fill="#4338ca"/>
      <circle cx="32" cy="32" r="4" fill="#ffffff"/>
    </svg>
  `,

  // --- 3. 聖騎士 (Paladin) ---
  zeal: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#2e1065" stroke="#d97706" stroke-width="2"/>
      <path d="M12 52 L36 28 M22 56 L46 32 M32 60 L56 36" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
      <path d="M36 16 L48 28 L40 32 L32 24 Z" fill="#fef08a"/>
      <circle cx="44" cy="22" r="6" fill="#fef08a" opacity="0.8"/>
    </svg>
  `,
  blessed_hammer: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#2d2006" stroke="#f59e0b" stroke-width="2"/>
      <path d="M18 46 L34 30 L38 34 L22 50 Z" fill="#b45309"/>
      <rect x="30" y="16" width="22" height="16" rx="2" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <path d="M36 24 L46 24" stroke="#78350f" stroke-width="2.5"/>
      <path d="M26 14 A20 20 0 0 1 50 38" stroke="#fef08a" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/>
    </svg>
  `,
  concentration: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#1c1917" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="32" cy="32" rx="18" ry="10" stroke="#facc15" stroke-width="3"/>
      <circle cx="32" cy="32" r="6" fill="#ca8a04"/>
      <circle cx="32" cy="32" r="2.5" fill="#fef08a"/>
      <path d="M32 12 L32 18 M32 46 L32 52 M12 32 L18 32 M46 32 L52 32" stroke="#fde047" stroke-width="2.5"/>
    </svg>
  `,
  fanaticism: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#3b0712" stroke="#e11d48" stroke-width="2"/>
      <path d="M32 12 L32 52 M18 24 L46 24" stroke="#fb7185" stroke-width="4" stroke-linecap="round"/>
      <circle cx="32" cy="24" r="8" fill="#f43f5e" opacity="0.6"/>
      <path d="M14 42 Q32 28 50 42" stroke="#fde047" stroke-width="3" fill="none"/>
    </svg>
  `,
  holy_shield: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#201a08" stroke="#facc15" stroke-width="2"/>
      <path d="M16 16 L48 16 L44 44 L32 54 L20 44 Z" fill="#ca8a04" stroke="#fde047" stroke-width="3"/>
      <path d="M32 20 L32 48 M22 28 L42 28" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `,

  // --- 4. 死靈法師 (Necromancer) ---
  raise_skeleton: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#141c14" stroke="#22c55e" stroke-width="2"/>
      <circle cx="32" cy="26" r="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <circle cx="28" cy="25" r="2.5" fill="#0f172a"/>
      <circle cx="36" cy="25" r="2.5" fill="#0f172a"/>
      <path d="M30 32 L34 32" stroke="#0f172a" stroke-width="2"/>
      <path d="M32 36 L32 54 M20 44 L44 44" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  decrepify: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#1c1024" stroke="#a855f7" stroke-width="2"/>
      <path d="M22 18 L42 18 L32 32 L42 46 L22 46 L32 32 Z" stroke="#c084fc" stroke-width="3" fill="#581c87"/>
      <circle cx="32" cy="32" r="4" fill="#f3e8ff"/>
      <path d="M26 12 L38 12 M26 52 L38 52" stroke="#a855f7" stroke-width="2.5"/>
    </svg>
  `,
  corpse_explosion: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#3f0708" stroke="#dc2626" stroke-width="2"/>
      <path d="M32 16 L36 28 L48 24 L40 34 L52 40 L38 42 L42 54 L32 44 L22 54 L26 42 L12 40 L24 34 L16 24 L28 28 Z" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
      <circle cx="32" cy="36" r="6" fill="#fef08a"/>
    </svg>
  `,
  bone_spear: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M14 50 L48 16" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 16 L38 18 L46 26 Z" fill="#f8fafc"/>
      <path d="M26 42 L22 36 M34 34 L30 28 M42 26 L38 20" stroke="#94a3b8" stroke-width="2.5"/>
    </svg>
  `,
  bone_armor: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#18181b" stroke="#71717a" stroke-width="2"/>
      <path d="M32 16 L32 48" stroke="#f8fafc" stroke-width="3"/>
      <path d="M20 22 Q32 26 44 22 M18 30 Q32 34 46 30 M20 38 Q32 42 44 38 M24 46 Q32 50 40 46" stroke="#f8fafc" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  `,

  // --- 5. 亞馬遜 (Amazon) ---
  multiple_shot: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#062817" stroke="#16a34a" stroke-width="2"/>
      <path d="M16 48 L48 16" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 48 L40 12" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 48 L52 24" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 48 L32 10" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 48 L54 32" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  guided_arrow: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#2d0607" stroke="#e11d48" stroke-width="2"/>
      <path d="M14 48 Q24 24 50 16" stroke="#f43f5e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M50 16 L40 18 L46 24 Z" fill="#fb7185"/>
      <circle cx="50" cy="16" r="4" fill="#fef08a" opacity="0.8"/>
    </svg>
  `,
  lightning_fury: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#082f49" stroke="#38bdf8" stroke-width="2"/>
      <path d="M14 50 L48 16" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <path d="M48 16 L38 18 L46 26 Z" fill="#bae6fd"/>
      <path d="M30 34 L22 26 L30 24 M38 26 L46 34 L40 36" stroke="#fef08a" stroke-width="2.5"/>
    </svg>
  `,
  valkyrie: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#2a1f0a" stroke="#eab308" stroke-width="2"/>
      <path d="M32 20 L38 34 L32 38 L26 34 Z" fill="#fde047"/>
      <path d="M16 26 Q24 22 28 32 M48 26 Q40 22 36 32" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 38 L32 54" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="32" cy="18" r="4" fill="#ffffff"/>
    </svg>
  `,
  dodge: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#111827" stroke="#6b7280" stroke-width="2"/>
      <path d="M22 22 Q28 16 34 22 Q40 28 46 22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M18 36 Q26 30 34 36 Q42 42 50 36" stroke="#e2e8f0" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <circle cx="34" cy="22" r="3" fill="#38bdf8"/>
    </svg>
  `
};

function getSkillIconHtml(iconKey) {
  if (!iconKey) return `<div class="skill-icon-fallback">?</div>`;
  const cleanKey = String(iconKey).trim().toLowerCase();
  if (SKILL_ICONS[cleanKey]) {
    return SKILL_ICONS[cleanKey];
  }
  return `<div class="skill-icon-fallback">${cleanKey.slice(0, 2).toUpperCase()}</div>`;
}
window.getSkillIconHtml = getSkillIconHtml;

function getSkillReqLevelForClass(skill, charCls) {
  if (!skill) return 1;
  return skill.reqLv || 1;
}

let selectedSkillName = null;
let skillCooldownTimer = null;

function selectSkillInInspector(skillName) {
  selectedSkillName = skillName;
  renderSkillTab();
}
window.selectSkillInInspector = selectSkillInInspector;

function getPadlockSvg() {
  return `<svg class="skill-padlock-icon" viewBox="0 0 24 24" width="22" height="22" fill="#71717a">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>`;
}

function getPadlockHtml() {
  return `<img src="assets/skills/padlock.png" alt="locked" class="skill-pixel-padlock" onerror="this.outerHTML=getPadlockSvg()">`;
}

function showSkillLockedToast(skillName, reqLv) {
  const msg = `🔒 尚未習得此技能【${skillName}】${reqLv ? ` (需求等級: Lv.${reqLv})` : ""}，達成等級後即可領悟！`;
  if (typeof addLog === "function") {
    addLog(msg, "sys");
  }
}

function isSkillMatchClass(skill, charCls) {
  if (!skill) return false;
  let cls = charCls || "barbarian";
  if (cls === "knight") cls = "barbarian";
  if (cls === "mage" || cls === "wizard") cls = "sorceress";
  if (cls === "prince") cls = "paladin";
  if (cls === "elf") cls = "amazon";
  return skill.school === cls || skill.school === "common";
}

function updateCooldownTicker() {
  const gridContainer = document.getElementById("skill-matrix-grid");
  if (!gridContainer) return;
  const slots = gridContainer.querySelectorAll(".skill-slot-box[data-skill-name]");
  let activeCdFound = false;

  slots.forEach(slot => {
    const sName = slot.getAttribute("data-skill-name");
    if (!sName) return;
    const cd = getSkillCooldownRemaining(sName);
    let cdEl = slot.querySelector(".skill-cooldown-overlay");
    if (cd > 0) {
      activeCdFound = true;
      const sec = Math.ceil(cd / 1000);
      if (!cdEl) {
        cdEl = document.createElement("div");
        cdEl.className = "skill-cooldown-overlay";
        slot.appendChild(cdEl);
      }
      cdEl.textContent = sec + "s";
    } else {
      if (cdEl) cdEl.remove();
    }
  });

  const actionBtn = document.getElementById("skill-action-button");
  if (actionBtn && selectedSkillName) {
    const curSkill = (typeof DB !== "undefined" && DB.skills) ? DB.skills[selectedSkillName] : null;
    if (curSkill && curSkill.mode !== "passive") {
      const isLearned = currentChar && Array.isArray(currentChar.skills) && currentChar.skills.includes(selectedSkillName);
      if (isLearned) {
        const cd = getSkillCooldownRemaining(selectedSkillName);
        if (cd > 0) {
          activeCdFound = true;
          actionBtn.disabled = true;
          actionBtn.textContent = `⏳ 冷卻中 (${Math.ceil(cd / 1000)} 秒)`;
        } else {
          actionBtn.disabled = false;
          actionBtn.textContent = `⚔️ 手動施放技能`;
        }
      }
    }
  }

  const tabSkills = document.getElementById("tab-skills");
  const isSkillsTabOpen = tabSkills && tabSkills.classList && tabSkills.classList.contains("active");
  if (!isSkillsTabOpen && !activeCdFound) {
    if (skillCooldownTimer) {
      clearInterval(skillCooldownTimer);
      skillCooldownTimer = null;
    }
  }
}

function startSkillCooldownTicker() {
  if (!skillCooldownTimer) {
    skillCooldownTimer = setInterval(updateCooldownTicker, 200);
  }
}

function useSkillFromTab(skillName) {
  if (typeof useSkill === "function") {
    useSkill(skillName);
  }
  startSkillCooldownTicker();
  updateCooldownTicker();
}
window.useSkillFromTab = useSkillFromTab;

function renderSkillTab() {
  const gridContainer = document.getElementById("skill-matrix-grid");
  const inspector = document.getElementById("skill-detail-inspector");
  const tabButtonsGroup = document.getElementById("skill-tab-buttons");
  const legacyTabsContainer = document.getElementById("skill-category-tabs");

  const charCls = (currentChar && currentChar.charClass) || "barbarian";

  const allSkills = (typeof DB !== "undefined" && DB.skills) ? Object.values(DB.skills) : [];
  const classSkills = allSkills.filter(sk => isSkillMatchClass(sk, charCls));

  const classTitles = {
    barbarian: "⚔️ 野蠻人專屬戰技",
    sorceress: "🔮 魔法使元素秘術",
    paladin: "🛡️ 聖騎士神聖靈氣",
    necromancer: "💀 死靈法師詛咒召喚",
    amazon: "🏹 亞馬遜弓矛射擊"
  };
  const activeClassTitle = classTitles[charCls] || "暗黑職業專屬技能";

  if (tabButtonsGroup) {
    tabButtonsGroup.innerHTML = `
      <button type="button" class="lineage-tab-btn active" style="flex:1;">
        ${activeClassTitle} (${classSkills.length})
      </button>
    `;
  }

  if (legacyTabsContainer) {
    legacyTabsContainer.innerHTML = "";
  }

  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  const learnedList = (currentChar && Array.isArray(currentChar.skills)) ? currentChar.skills : [];
  const MAX_ROW_SLOTS = 6;

  // 依修煉階層分組 (Tier 1 Lv.1~6, Tier 2 Lv.12~18, Tier 3 Lv.24~30)
  const tier1 = classSkills.filter(s => (s.tier || 1) <= 1 || (s.reqLv || 1) <= 6);
  const tier2 = classSkills.filter(s => (s.tier || 1) === 2 || ((s.reqLv || 1) > 6 && (s.reqLv || 1) <= 18));
  const tier3 = classSkills.filter(s => (s.tier || 1) >= 3 || (s.reqLv || 1) > 18);

  const rowGroups = [
    { title: "第 1 階・基礎啟蒙核心戰技", desc: "Lv. 1 ~ Lv. 6 啟蒙必備技能", skills: tier1 },
    { title: "第 2 階・進階專精殺戮技術", desc: "Lv. 12 ~ Lv. 18 專精爆發技能", skills: tier2 },
    { title: "第 3 階・終極奧義神威領域", desc: "Lv. 24 ~ Lv. 30 終極領域神技", skills: tier3 }
  ].filter(g => g.skills.length > 0);

  if (!selectedSkillName || !classSkills.some(s => s.name === selectedSkillName)) {
    selectedSkillName = classSkills.length > 0 ? classSkills[0].name : null;
  }

  rowGroups.forEach(group => {
    const rowGroupEl = document.createElement("div");
    rowGroupEl.className = "skill-row-group";

    const learnedCountInGroup = group.skills.filter(s => learnedList.includes(s.name)).length;

    rowGroupEl.innerHTML = `
      <div class="skill-row-header">
        <span class="skill-row-title">${group.title}</span>
        <span class="skill-row-meta">${group.skills.length} 項技能（已習得 ${learnedCountInGroup}/${group.skills.length}）</span>
      </div>
      <div class="skill-row-slots"></div>
    `;

    const slotsContainer = rowGroupEl.querySelector(".skill-row-slots");

    group.skills.forEach(skill => {
      const isLearned = learnedList.includes(skill.name);
      const cd = getSkillCooldownRemaining(skill.name);
      const isSelected = skill.name === selectedSkillName;
      const reqLv = getSkillReqLevelForClass(skill, charCls);
      const curCharLv = (currentChar && currentChar.level) || 1;
      const canUnlock = curCharLv >= reqLv;

      const slot = document.createElement("div");
      let stateClass = "state-unlearned";
      if (isLearned) stateClass = "state-learned";
      else if (canUnlock) stateClass = "state-can-learn";

      slot.className = `skill-slot-box ${stateClass} ${isSelected ? "selected" : ""}`;
      slot.setAttribute("data-skill-name", skill.name);
      slot.onclick = () => {
        selectSkillInInspector(skill.name);
        if (!isLearned && !canUnlock) {
          showSkillLockedToast(skill.name, reqLv);
        }
      };
      slot.title = `${skill.name} (${isLearned ? "已習得" : (canUnlock ? "可領悟習得" : `未習得 - 需求 Lv.${reqLv}`)})`;

      const isPassive = skill.mode === "passive";
      const badgeText = isPassive ? "P" : "A";
      const badgeClass = isPassive ? "badge-p" : "badge-a";

      let bottomIndicator = "";
      if (!isLearned && canUnlock) {
        bottomIndicator = `<div class="skill-learn-text">領悟</div>`;
      } else if (!isLearned && !canUnlock) {
        bottomIndicator = `<div class="skill-plus-sign">+</div>`;
      }

      let padlockHtml = "";
      if (!isLearned) {
        padlockHtml = `<div class="skill-padlock-overlay">${getPadlockHtml()}</div>`;
      }

      let cdOverlay = "";
      if (isLearned && cd > 0) {
        cdOverlay = `<div class="skill-cooldown-overlay">${Math.ceil(cd / 1000)}s</div>`;
      }

      slot.innerHTML = `
        <div class="skill-badge ${badgeClass}">${badgeText}</div>
        <div class="skill-art-container">
          ${getSkillIconHtml(skill.iconKey)}
        </div>
        ${padlockHtml}
        ${bottomIndicator}
        ${cdOverlay}
      `;

      slotsContainer.appendChild(slot);
    });

    const emptyCount = Math.max(0, MAX_ROW_SLOTS - group.skills.length);
    for (let i = 0; i < emptyCount; i++) {
      const emptySlot = document.createElement("div");
      emptySlot.className = "skill-slot-box";
      emptySlot.style.opacity = "0.15";
      emptySlot.style.cursor = "default";
      slotsContainer.appendChild(emptySlot);
    }

    gridContainer.appendChild(rowGroupEl);
  });

  // 渲染右側詳細屬性檢視器 (Inspector)
  if (inspector) {
    if (!selectedSkillName || !DB.skills[selectedSkillName]) {
      inspector.innerHTML = `<div style="color:#64748b; padding:20px; text-align:center;">請點選左側技能槽位檢視詳細屬性。</div>`;
      return;
    }

    const curSkill = DB.skills[selectedSkillName];
    const isLearned = learnedList.includes(curSkill.name);
    const cd = getSkillCooldownRemaining(curSkill.name);
    const isPassive = curSkill.mode === "passive";
    const reqLv = getSkillReqLevelForClass(curSkill, charCls);
    const curCharLv = (currentChar && currentChar.level) || 1;
    const canUnlock = curCharLv >= reqLv;

    const schoolLabels = {
      barbarian: "⚔️ 野蠻人戰術",
      sorceress: "🔮 元素秘法",
      paladin: "🛡️ 神聖靈氣",
      necromancer: "💀 詛咒召喚",
      amazon: "🏹 弓矛技巧"
    };

    let actionBtnHtml = "";
    if (!isLearned && canUnlock) {
      actionBtnHtml = `
        <button type="button" class="btn btn-gold" style="padding:10px; font-weight:bold; font-size:13px;" onclick="unlockSkillDirectly('${curSkill.name}')">
          ✨ 點擊領悟習得【${curSkill.name}】(符合等級 Lv.${reqLv})
        </button>
      `;
    } else if (isLearned && !isPassive) {
      actionBtnHtml = `
        <button id="skill-action-button" type="button" class="btn btn-gold" style="padding:10px; font-weight:bold; font-size:13px;" ${cd > 0 ? "disabled" : ""} onclick="useSkillFromTab('${curSkill.name}')">
          ${cd > 0 ? "⏳ 冷卻中 (" + Math.ceil(cd / 1000) + " 秒)" : "⚔️ 手動施放技能"}
        </button>
      `;
    } else if (isLearned && isPassive) {
      actionBtnHtml = `
        <button type="button" class="btn" disabled style="padding:10px; font-weight:bold; font-size:12px; color:#86efac; border-color:#22c55e; background:#052e16;">
          🌟 被動神技・角色數值恆常生效中
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button type="button" class="btn" disabled style="padding:10px; font-weight:bold; font-size:12px; color:#71717a; border-color:#333; background:#12141a;">
          🔒 尚未習得 (需求 Lv.${reqLv})
        </button>
      `;
    }

    let effectDesc = "";
    if (curSkill.type === "damage") {
      effectDesc = `單體破壞威力：${curSkill.power} 點打擊傷害`;
    } else if (curSkill.type === "buff" || curSkill.type === "shield") {
      effectDesc = `${(curSkill.stat || "狀態").toUpperCase()} 提升 ${curSkill.amount > 0 ? "+" + curSkill.amount : curSkill.amount}（持續 ${curSkill.duration || 120} 秒）`;
    } else {
      effectDesc = curSkill.desc || "特殊暗黑秘術效益";
    }

    inspector.innerHTML = `
      <div class="skill-insp-header">
        <div class="skill-insp-art" style="${!isLearned ? 'filter: grayscale(100%) brightness(50%);' : ''}">
          ${getSkillIconHtml(curSkill.iconKey)}
        </div>
        <div class="skill-insp-info">
          <div class="skill-insp-name">${curSkill.name}</div>
          <div class="skill-insp-tags">
            <span class="skill-tag-pill ${isPassive ? "skill-tag-passive" : "skill-tag-active"}">
              ${isPassive ? "P 被動神技" : "A 主動技能"}
            </span>
            <span class="skill-tag-pill skill-tag-school">
              ${schoolLabels[curSkill.school] || "暗黑職業技能"}
            </span>
            <span class="skill-tag-pill" style="background:${isLearned ? '#14532d' : '#3f3f46'}; color:${isLearned ? '#86efac' : '#a1a1aa'};">
              ${isLearned ? '已習得' : (canUnlock ? '可領悟' : '鎖定中')}
            </span>
          </div>
        </div>
      </div>

      <div class="skill-insp-props">
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">需求等級</span>
          <span class="insp-prop-val" style="color:var(--gold);">Lv. ${reqLv}</span>
        </div>
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">消耗 MP</span>
          <span class="insp-prop-val" style="color:#60a5fa;">MP ${curSkill.mpCost || 0}</span>
        </div>
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">冷卻時間</span>
          <span class="insp-prop-val">${curSkill.cooldown ? curSkill.cooldown / 1000 + " 秒" : "無冷卻"}</span>
        </div>
        <div class="insp-prop-row">
          <span class="insp-prop-lbl">施展型態</span>
          <span class="insp-prop-val" style="color:#f59e0b;">${isPassive ? "恆常生效" : "即時施放"}</span>
        </div>
        <div class="insp-prop-row" style="grid-column: span 2;">
          <span class="insp-prop-lbl">技能效益</span>
          <span class="insp-prop-val" style="color:#86efac;">${effectDesc}</span>
        </div>
      </div>

      <div class="skill-insp-desc">
        ${curSkill.desc || "無詳細說明"}
      </div>

      <div class="skill-insp-actions">
        ${actionBtnHtml}
      </div>
    `;
  }

  startSkillCooldownTicker();
  updateCooldownTicker();
}
window.renderSkillTab = renderSkillTab;

function unlockSkillDirectly(skillName) {
  if (!currentChar) return;
  if (!Array.isArray(currentChar.skills)) currentChar.skills = [];
  if (currentChar.skills.includes(skillName)) return;

  const sk = (typeof DB !== "undefined" && DB.skills) ? DB.skills[skillName] : null;
  if (!sk) return;
  const curLv = currentChar.level || 1;
  if (curLv < (sk.reqLv || 1)) {
    alert(`⚠️ 等級不足！學習【${skillName}】需要等級達到 Lv.${sk.reqLv || 1}`);
    return;
  }
  currentChar.skills.push(skillName);
  log(`✨ 成功領悟並解鎖暗黑神技：【${skillName}】！已可於戰鬥與戰術 AI 自動放招！`, "sys");
  renderSkillTab();
  if (typeof updateLeftPanel === "function") updateLeftPanel();
  if (typeof saveAccountData === "function") saveAccountData();
}
window.unlockSkillDirectly = unlockSkillDirectly;

// ========================================================
// 👥 暗黑破壞神 8 人傭兵追隨者系統 (Mercenary Followers)
// ========================================================
const D2_MERC_POOL = [
  {
    key: "emilio_might",
    name: "米山 (沙漠槍兵)",
    type: "desert_guard",
    act: "Act 2 魯高因",
    aura: "might",
    auraName: "力量靈氣 (+25% 全隊物理攻擊)",
    price: 10000,
    baseHp: 800,
    baseAtk: 65,
    range: 45,
    attackSpeed: 1100,
    desc: "經典必備！近戰長矛神手，自帶力量靈氣，大幅拔高主角與全隊物理輸出"
  },
  {
    key: "emilio_freeze",
    name: "瓦希德 (冰凍守衛槍兵)",
    type: "desert_guard",
    act: "Act 2 魯高因",
    aura: "holy_freeze",
    auraName: "神聖冰凍 (減速全場怪群50%)",
    price: 12000,
    baseHp: 850,
    baseAtk: 58,
    range: 45,
    attackSpeed: 1100,
    desc: "控場極品！神聖極冰領域減速周圍所有怪物，掛機安全性極致提升"
  },
  {
    key: "emilio_prayer",
    name: "拉達蒙特 (祈禱治癒槍兵)",
    type: "desert_guard",
    act: "Act 2 魯高因",
    aura: "prayer",
    auraName: "祈禱靈氣 (每秒全隊回血 25 點)",
    price: 10000,
    baseHp: 900,
    baseAtk: 55,
    range: 45,
    attackSpeed: 1200,
    desc: "永動醫者！源源不絕的生命光環，掛機再也不用擔心紅水耗盡"
  },
  {
    key: "kyoko_rogue",
    name: "京子 (羅格神射手)",
    type: "rogue",
    act: "Act 1 羅格營地",
    aura: "inner_sight",
    auraName: "內視光環 (怪物防禦-30%)",
    price: 8000,
    baseHp: 550,
    baseAtk: 52,
    range: 240,
    attackSpeed: 950,
    desc: "遠程狙擊手！後排精準穿透箭雨，持續削弱敵人防禦"
  },
  {
    key: "charsi_archer",
    name: "卡夏禁衛 (霜凍箭羅格)",
    type: "rogue",
    act: "Act 1 羅格營地",
    aura: "frost_arrow",
    auraName: "霜凍箭 (遠程冰凍減速)",
    price: 9000,
    baseHp: 580,
    baseAtk: 50,
    range: 240,
    attackSpeed: 1000,
    desc: "遠程極冰控場！在遠方射出冰霜箭矢凍結敵軍"
  },
  {
    key: "asheara_ironwolf",
    name: "艾席拉 (鐵狼風暴法師)",
    type: "iron_wolf",
    act: "Act 3 庫拉斯特",
    aura: "lightning_storm",
    auraName: "風暴雷霆 (連鎖閃電彈跳轟擊)",
    price: 15000,
    baseHp: 620,
    baseAtk: 72,
    range: 220,
    attackSpeed: 1250,
    desc: "元素法術打擊！遠程施放高階閃電電弧群體轟擊"
  },
  {
    key: "qual_kehk_barb",
    name: "夸爾凱克 (亞瑞特先鋒巨劍狂徒)",
    type: "barbarian",
    act: "Act 5 哈洛加斯",
    aura: "shout",
    auraName: "戰鬥怒吼 (全隊防禦AC-10)",
    price: 20000,
    baseHp: 1200,
    baseAtk: 85,
    range: 45,
    attackSpeed: 1150,
    desc: "近戰巨坦先鋒！手持重劍在前排硬扛首領魔王"
  },
  {
    key: "barb_berserk",
    name: "馬道克之影 (遠古守衛先祖)",
    type: "barbarian",
    act: "Act 5 哈洛加斯",
    aura: "battle_orders",
    auraName: "遠古體質 (全隊生命上限+150)",
    price: 25000,
    baseHp: 1400,
    baseAtk: 90,
    range: 45,
    attackSpeed: 1200,
    desc: "終極防線！遠古三野蠻人化身，大幅拔高全隊血量上限"
  }
];

function ensureMercenariesArray() {
  if (!currentChar) return;
  if (!Array.isArray(currentChar.mercenaries)) {
    currentChar.mercenaries = [];
  }
}

function hireMercenary(mercKey) {
  ensureMercenariesArray();
  if (currentChar.mercenaries.length >= 8) {
    alert("⚠️ 傭兵隊伍已滿員（最多 8 人）！請先解雇成員後再招募。");
    return;
  }
  const tmpl = D2_MERC_POOL.find(m => m.key === mercKey);
  if (!tmpl) return;

  if ((currentChar.gold || 0) < tmpl.price) {
    alert(`⚠️ 金幣不足！招募【${tmpl.name}】需要 ${tmpl.price.toLocaleString()} 金幣。`);
    return;
  }

  currentChar.gold -= tmpl.price;
  const newMerc = {
    uid: "merc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    key: tmpl.key,
    name: tmpl.name,
    type: tmpl.type,
    act: tmpl.act,
    aura: tmpl.aura,
    auraName: tmpl.auraName,
    baseHp: tmpl.baseHp,
    maxHp: tmpl.baseHp,
    currentHp: tmpl.baseHp,
    baseAtk: tmpl.baseAtk,
    range: tmpl.range,
    attackSpeed: tmpl.attackSpeed,
    lastAttackTime: 0,
    alive: true,
    level: currentChar.level || 1,
    x: (gameState && gameState.playerX) ? gameState.playerX + (Math.random()*40-20) : 1200,
    y: (gameState && gameState.playerY) ? gameState.playerY + (Math.random()*40-20) : 800
  };

  currentChar.mercenaries.push(newMerc);
  log(`🎉 成功雇傭追隨者：【${newMerc.name}】加入 8 人遠征軍團！自帶【${newMerc.auraName}】！`, "sys");
  renderMercenariesTab();
  if (typeof updateLeftPanel === "function") updateLeftPanel();
  if (typeof saveAccountData === "function") saveAccountData();
}
window.hireMercenary = hireMercenary;

function dismissMercenary(mercUid) {
  ensureMercenariesArray();
  const idx = currentChar.mercenaries.findIndex(m => m.uid === mercUid);
  if (idx !== -1) {
    const removed = currentChar.mercenaries.splice(idx, 1)[0];
    log(`已解除與傭兵【${removed.name}】的雇傭契約。`, "sys");
    renderMercenariesTab();
    if (typeof saveAccountData === "function") saveAccountData();
  }
}
window.dismissMercenary = dismissMercenary;

function reviveMercenary(mercUid) {
  ensureMercenariesArray();
  const merc = currentChar.mercenaries.find(m => m.uid === mercUid);
  if (!merc) return;
  const cost = 500;
  if ((currentChar.gold || 0) < cost) {
    alert(`金幣不足！復活傭兵需要 ${cost} 金幣。`);
    return;
  }
  currentChar.gold -= cost;
  merc.currentHp = merc.maxHp;
  merc.alive = true;
  log(`✨ 傭兵【${merc.name}】已於聖殿復活完畢，生命力完全恢復！`, "heal");
  renderMercenariesTab();
  if (typeof updateLeftPanel === "function") updateLeftPanel();
  if (typeof saveAccountData === "function") saveAccountData();
}
window.reviveMercenary = reviveMercenary;

function renderMercenariesTab() {
  ensureMercenariesArray();
  const countEl = document.getElementById("merc-party-count");
  if (countEl) countEl.innerText = `${currentChar.mercenaries.length} / 8`;

  const activeGrid = document.getElementById("merc-active-grid");
  if (activeGrid) {
    activeGrid.innerHTML = "";
    if (currentChar.mercenaries.length === 0) {
      activeGrid.innerHTML = `<div style="grid-column: 1 / -1; color:#94a3b8; padding:18px; text-align:center; background:#0b0d12; border:1px dashed #7f1d1d; border-radius:6px;">目前尚未雇傭任何追隨者！請至下方招募所挑選傭兵加入您的 8 人遠征軍團！</div>`;
    } else {
      currentChar.mercenaries.forEach((merc, idx) => {
        const hpPct = Math.max(0, Math.min(100, Math.floor((merc.currentHp / merc.maxHp) * 100)));
        const isDead = merc.currentHp <= 0;
        const card = document.createElement("div");
        card.className = "merc-card active-slot";
        card.style.cssText = "background:#11141c; border:1px solid #7f1d1d; border-radius:6px; padding:12px; display:flex; flex-direction:column; gap:6px;";
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:4px;">
            <b style="color:var(--gold); font-size:14px;">#${idx + 1} ${merc.name}</b>
            <span style="font-size:11px; color:#38bdf8;">Lv.${merc.level || 1}</span>
          </div>
          <div style="font-size:12px; color:#cbd5e1;">靈氣特性：<span style="color:#facc15;">${merc.auraName}</span></div>
          <div style="font-size:11px; color:#94a3b8;">基礎攻擊：<b style="color:#fff;">${merc.baseAtk}</b> | 攻擊間隔: <b>${(merc.attackSpeed/1000).toFixed(1)}s</b></div>
          <div class="bar-wrap" style="height:14px; margin:4px 0;">
            <div class="bar-fill bar-hp" style="width:${hpPct}%; background:${isDead ? '#ef4444' : '#22c55e'};"></div>
            <div class="bar-text" style="font-size:10px; line-height:14px;">HP ${merc.currentHp} / ${merc.maxHp}</div>
          </div>
          <div style="display:flex; gap:6px; margin-top:4px;">
            ${isDead ? `<button class="btn btn-gold" style="flex:1; padding:4px;" onclick="reviveMercenary('${merc.uid}')">💖 復活 (500金幣)</button>` : `<button class="btn" disabled style="flex:1; padding:4px; color:#22c55e; border-color:#22c55e;">⚔️ 出戰中</button>`}
            <button class="btn btn-danger" style="padding:4px 8px;" onclick="dismissMercenary('${merc.uid}')">解雇</button>
          </div>
        `;
        activeGrid.appendChild(card);
      });
    }
  }

  const recruitGrid = document.getElementById("merc-recruit-grid");
  if (recruitGrid) {
    recruitGrid.innerHTML = "";
    D2_MERC_POOL.forEach(tmpl => {
      const card = document.createElement("div");
      card.className = "merc-card";
      card.style.cssText = "background:#0c0f16; border:1px solid #334155; border-radius:6px; padding:10px; display:flex; flex-direction:column; gap:5px;";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b style="color:#38bdf8; font-size:13px;">${tmpl.name}</b>
          <span style="font-size:11px; color:var(--text-muted);">${tmpl.act}</span>
        </div>
        <div style="font-size:11px; color:#facc15;">靈氣：${tmpl.auraName}</div>
        <div style="font-size:11px; color:#94a3b8; line-height:1.3;">${tmpl.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:4px;">
          <span style="color:var(--gold); font-size:12px; font-weight:bold;">${tmpl.price.toLocaleString()} 金幣</span>
          <button class="btn btn-gold" style="padding:4px 10px;" onclick="hireMercenary('${tmpl.key}')">雇傭入隊</button>
        </div>
      `;
      recruitGrid.appendChild(card);
    });
  }
}
window.renderMercenariesTab = renderMercenariesTab;
window.D2_MERC_POOL = D2_MERC_POOL;
