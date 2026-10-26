// js/main.js - 全域狀態、日誌系統 (支援 12px~22px 字體調節) 與基礎配置
let currentUser = null;
let currentChar = null;

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const BOSS_NAMES = ["巴風特", "死亡騎士", "巨蟻女皇"];
const ALLOWED_BUY_ITEMS = [
  "紅色藥水", "橙色藥水", "白色藥水", "綠色藥水", "勇敢藥水", "翡翠藥水",
  "傳送回家的卷軸", "瞬間移動卷軸", "對武器施法的卷軸", "對防具施法的卷軸",
  "箭", "銀箭"
];

let gmSettings = {
  expRate: 1.0,
  dropRate: 1.0,
  goldRate: 1.0,
  customMapConfigs: {}
};

let gameState = {
  isRunning: false,
  loopTimer: null,
  cloudSaveTimer: null,
  currentMap: "talking_island",
  viewingVillage: "ti_village",
  inVillage: false,
  isRestocking: false,
  deathCount: 0,

  playerX: 1200,
  playerY: 800,
  patrolTarget: null,

  mobs: [],
  targetMob: null,
  lastAttackTime: 0,
  surroundingMobs: 0,
  arrowTrail: null,

  potionThresholds: {
    "紅色藥水": 70,
    "橙色藥水": 35,
    "白色藥水": 15
  },

  botSettings: {
    maxDeathLimit: 3,
    storeRules: [],
    sellRules: [],
    buyRules: [
      { item: "紅色藥水", targetCount: 80 },
      { item: "瞬間移動卷軸", targetCount: 20 },
      { item: "傳送回家的卷軸", targetCount: 5 }
    ]
  }
};

if (typeof window !== "undefined") {
  window.gameState = gameState;
  window.gmSettings = gmSettings;
}

let canvas, ctx;

function getMapConfig(mapId) {
  const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[mapId]) ? DB.maps[mapId] : ((typeof DB !== 'undefined' && DB.maps) ? DB.maps["talking_island"] : { monsters: [] });

  // 若 GM 有自訂過該地圖的各怪物數量設定
  if (gmSettings.customMapConfigs && gmSettings.customMapConfigs[mapId]) {
    const cfg = gmSettings.customMapConfigs[mapId];
    const species = cfg.speciesCounts || {};
    let total = 0;
    if (mapData.monsters) {
      mapData.monsters.forEach(m => {
        const isBoss = m.isBoss || BOSS_NAMES.includes(m.name);
        const count = (species[m.name] !== undefined) ? species[m.name] : (isBoss ? 1 : 8);
        species[m.name] = count;
        total += count;
      });
    }
    return {
      totalMobs: total,
      speciesCounts: species
    };
  }

  // 預設模式：小怪依地圖平均分配（每種約 6~8 隻，Boss 1 隻）
  const species = {};
  let total = 0;
  if (mapData.monsters) {
    const mobList = mapData.monsters;
    mobList.forEach(m => {
      const isBoss = m.isBoss || BOSS_NAMES.includes(m.name);
      let count = isBoss ? 1 : 8;
      species[m.name] = count;
      total += count;
    });
  }
  return { totalMobs: total, speciesCounts: species };
}

function generateUid() {
  return "item_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
}

function getNowTimeString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toggleMobileStats() {
  const el = document.getElementById("mobile-collapsible-stats");
  if (!el) return;
  el.style.display = (el.style.display === "none") ? "block" : "none";
}

// ======================== 戰鬥日誌核心：字體大小調節、智慧釘底、分流過濾 ========================
let currentLogFilter = "all";

// 實裝：戰鬥日誌字體大小調節 (12px ~ 22px)
function setLogFontSize(size) {
  const parsedSize = parseInt(size, 10);
  if (isNaN(parsedSize) || parsedSize < 12 || parsedSize > 22) return;

  const logBox = document.getElementById("log-box");
  if (logBox) {
    logBox.style.fontSize = parsedSize + "px";
  }

  const select = document.getElementById("log-font-size-select");
  if (select && select.value !== String(parsedSize)) {
    select.value = String(parsedSize);
  }

  // 持久化儲存使用者喜好
  localStorage.setItem("lineage_log_font_size", String(parsedSize));
}
window.setLogFontSize = setLogFontSize;

function initLogFontSize() {
  const saved = localStorage.getItem("lineage_log_font_size");
  if (saved) {
    setLogFontSize(saved);
  } else {
    setLogFontSize(13); // 預設 13px
  }
}

function appendLogMessage(logBox, rowElement) {
  const isNearBottom = (logBox.scrollHeight - logBox.scrollTop - logBox.clientHeight) <= 50;

  logBox.appendChild(rowElement);

  while (logBox.children.length > 200) {
    logBox.removeChild(logBox.firstChild);
  }

  applyFilterToLogRow(rowElement);

  if (isNearBottom) {
    requestAnimationFrame(() => {
      logBox.scrollTop = logBox.scrollHeight;
    });
  }
}

function log(msg, type = "atk") {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;

  const row = document.createElement("div");
  row.className = `log-row log-${type}`;
  row.dataset.type = type;

  const time = new Date().toTimeString().split(" ")[0];
  row.innerText = `[${time}] ${msg}`;

  appendLogMessage(logBox, row);
}
window.log = log;

function scrollToLogBottom() {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  requestAnimationFrame(() => {
    logBox.scrollTop = logBox.scrollHeight;
  });
}
window.scrollToLogBottom = scrollToLogBottom;

function clearLogBox() {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  logBox.innerHTML = "";
}
window.clearLogBox = clearLogBox;

function setLogFilter(filterType) {
  currentLogFilter = filterType;

  document.querySelectorAll(".log-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filterType);
  });

  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  Array.from(logBox.children).forEach(row => {
    applyFilterToLogRow(row);
  });

  scrollToLogBottom();
}
window.setLogFilter = setLogFilter;

function applyFilterToLogRow(row) {
  const type = row.dataset.type;
  if (currentLogFilter === "all") {
    row.style.display = "block";
  } else if (currentLogFilter === "battle") {
    row.style.display = (type === "atk" || type === "mob" || type === "heal") ? "block" : "none";
  } else if (currentLogFilter === "sys") {
    row.style.display = (type === "sys") ? "block" : "none";
  } else if (currentLogFilter === "drop") {
    row.style.display = (type === "drop") ? "block" : "none";
  }
}

function switchTab(tabId) {
  if (tabId === "admin" && (!currentUser || currentUser.roleLevel < 2)) {
    alert("⚠️ 您的帳號權限為【一級 一般玩家】，無權訪問 GM 控制台！");
    return;
  }

  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
    el.style.setProperty("display", "none", "important");
  });
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));

  // 2. 強制展開指定分頁內容
  const targetTab = document.getElementById("tab-" + tabId);
  if (targetTab) {
    targetTab.classList.add("active");
    if (tabId === "battle") {
      targetTab.style.setProperty("display", "flex", "important");
    } else {
      targetTab.style.setProperty("display", "block", "important");
    }
  }

  const btn = Array.from(document.querySelectorAll(".nav-btn")).find(b => b.getAttribute("onclick")?.includes(`'${tabId}'`));
  if (btn) btn.classList.add("active");

  // 3. 獨立容錯執行渲染
  try {
    if (tabId === "char" && typeof renderCharTab === "function") renderCharTab();
    if (tabId === "inventory" && typeof renderInventoryTab === "function") renderInventoryTab();
    if (tabId === "village" && typeof renderVillageTab === "function") renderVillageTab();
    if (tabId === "storage" && typeof renderStorageTab === "function") renderStorageTab();
    if (tabId === "strategy" && typeof renderStrategyTab === "function") renderStrategyTab();
    if (tabId === "skills" && typeof renderSkillTab === "function") renderSkillTab();
    if (tabId === "admin" && typeof renderAdminTab === "function") renderAdminTab();
    if (tabId === "database" && typeof renderDatabaseTab === "function") renderDatabaseTab();
    if (tabId === "battle" && typeof renderRadar === "function") renderRadar();
  } catch (err) {
    console.warn(`⚠️ [${tabId}] 分頁渲染小提醒:`, err);
  }
}
window.switchTab = switchTab;


// ---------------- 全域角色與掛機狀態持久化 ----------------
function saveAccountData() {
  if (!currentUser || !currentChar) return;

  if (!currentChar.savedState) currentChar.savedState = {};
  currentChar.savedState.isRunning = !!gameState.isRunning;
  currentChar.savedState.botStatus = gameState.botStatus || (gameState.inVillage ? "village" : "idle");
  currentChar.savedState.inVillage = !!gameState.inVillage;
  currentChar.savedState.currentMap = gameState.currentMap || "talking_island";
  currentChar.savedState.playerX = gameState.playerX || 1200;
  currentChar.savedState.playerY = gameState.playerY || 800;
  currentChar.savedState.deathCount = gameState.deathCount || 0;

  if (Array.isArray(currentUser.characters)) {
    const idx = currentUser.characters.findIndex(c => c && c.name === currentChar.name);
    if (idx !== -1) {
      currentUser.characters[idx] = currentChar;
    }
  }

  try {
    localStorage.setItem("lineage_acc_" + currentUser.username, JSON.stringify(currentUser));
  } catch (err) {
    console.error("存檔失敗:", err);
  }
}
window.saveAccountData = saveAccountData;

// 頁面載入後讀取設定與日誌字體
window.addEventListener("DOMContentLoaded", () => {
  if (typeof loadGMSettings === "function") loadGMSettings();
  if (typeof checkAutoLogin === "function") checkAutoLogin();
  initLogFontSize();
});

// 監聽重整與分頁關閉事件，確保 F5 與背景切換時狀態不丟失
window.addEventListener("beforeunload", () => {
  if (typeof saveAccountData === "function") saveAccountData();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (typeof saveAccountData === "function") saveAccountData();
  }
});