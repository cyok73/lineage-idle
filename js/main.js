// js/main.js - 全域狀態與基礎配置
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
    storeRules: [],
    sellRules: [],
    buyRules: [
      { item: "紅色藥水", targetCount: 80 },
      { item: "瞬間移動卷軸", targetCount: 20 },
      { item: "傳送回家的卷軸", targetCount: 5 }
    ]
  }
};

let canvas, ctx;

// 地圖配置存取函式（放在最前面，避免 admin.js 與 battle.js 互相找不到）
function getMapConfig(mapId) {
  if (gmSettings.customMapConfigs && gmSettings.customMapConfigs[mapId]) {
    return gmSettings.customMapConfigs[mapId];
  }
  const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[mapId]) ? DB.maps[mapId] : (DB.maps["talking_island"] || { monsters: [] });
  const species = {};
  if (mapData.monsters) {
    mapData.monsters.forEach(m => {
      species[m.name] = (m.isBoss || BOSS_NAMES.includes(m.name)) ? 1 : 5;
    });
  }
  return { totalMobs: 28, speciesCounts: species };
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

// ======================== 戰鬥日誌核心：智慧釘底、分流過濾與 200 筆上限 ========================
let currentLogFilter = "all";

// 智慧釘底滾動函式
function appendLogMessage(logBox, rowElement) {
  // 檢查玩家目前是否停留在最底部附近（閥值 40px）
  const isNearBottom = (logBox.scrollHeight - logBox.scrollTop - logBox.clientHeight) <= 40;

  logBox.appendChild(rowElement);

  // 嚴格控制節點上限為 200 筆，避免洗頻卡死
  while (logBox.children.length > 200) {
    logBox.removeChild(logBox.firstChild);
  }

  // 套用當前分頁過濾規則
  applyFilterToLogRow(rowElement);

  // 若原本就在底部，新訊息出來時強制釘在最底端
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
  row.dataset.type = type; // 標記類型以便過濾

  const time = new Date().toTimeString().split(" ")[0];
  row.innerText = `[${time}] ${msg}`;

  appendLogMessage(logBox, row);
}

// 快速滾回底部
function scrollToLogBottom() {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  requestAnimationFrame(() => {
    logBox.scrollTop = logBox.scrollHeight;
  });
}
window.scrollToLogBottom = scrollToLogBottom;

// 清除日誌視窗
function clearLogBox() {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  logBox.innerHTML = "";
}
window.clearLogBox = clearLogBox;

// 切換日誌過濾分頁
function setLogFilter(filterType) {
  currentLogFilter = filterType;

  // 更新按鈕樣式
  document.querySelectorAll(".log-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filterType);
  });

  // 對現有日誌行進行顯隱篩選
  const logBox = document.getElementById("log-box");
  if (!logBox) return;
  Array.from(logBox.children).forEach(row => {
    applyFilterToLogRow(row);
  });

  scrollToLogBottom();
}
window.setLogFilter = setLogFilter;

// 單行過濾顯隱規則
function applyFilterToLogRow(row) {
  const type = row.dataset.type;
  if (currentLogFilter === "all") {
    row.style.display = "block";
  } else if (currentLogFilter === "battle") {
    // 普攻、受傷、回血
    row.style.display = (type === "atk" || type === "mob" || type === "heal") ? "block" : "none";
  } else if (currentLogFilter === "sys") {
    // 系統、整補、SOP
    row.style.display = (type === "sys") ? "block" : "none";
  } else if (currentLogFilter === "drop") {
    // 掉落、金幣、升級
    row.style.display = (type === "drop") ? "block" : "none";
  }
}
// 在 js/main.js 中更新 switchTab 函式：
function switchTab(tabId) {
  if (tabId === "admin" && (!currentUser || currentUser.roleLevel < 2)) {
    alert("⚠️ 您的帳號權限為【一級 一般玩家】，無權訪問 GM 控制台！");
    return;
  }

  // 1. 強制隱藏所有分頁內容
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
    el.style.setProperty("display", "none", "important");
  });
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));

  // 2. 強制展開指定分頁內容
  const targetTab = document.getElementById("tab-" + tabId);
  if (targetTab) {
    targetTab.classList.add("active");
    targetTab.style.setProperty("display", "block", "important");
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
    if (tabId === "admin" && typeof renderAdminTab === "function") renderAdminTab();
    if (tabId === "battle" && typeof renderRadar === "function") renderRadar();
  } catch (err) {
    console.warn(`⚠️ [${tabId}] 分頁渲染小提醒:`, err);
  }
}

// 頁面載入後先讀取 GM 設定與自動登入
window.addEventListener("DOMContentLoaded", () => {
  if (typeof loadGMSettings === "function") loadGMSettings();
  if (typeof checkAutoLogin === "function") checkAutoLogin();
});