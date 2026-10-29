// js/database.js - 亞丁大陸百科全書：掉落寶典、道具來源查詢與怪物圖鑑系統

let dbSearchState = {
  mode: "items", // "items" | "monsters" | "maps"
  query: "",
  category: "all",
  cachedItemIndex: null,
  cachedMobIndex: null,
  cachedMapIndex: null
};

// 構建全域反向索引 (Lazy build & Cache)
function buildAdenDatabaseIndexes() {
  if (dbSearchState.cachedItemIndex && dbSearchState.cachedMobIndex && dbSearchState.cachedMapIndex) {
    return;
  }

  const itemIndex = {};
  const mobIndex = {};
  const mapIndex = {};

  if (typeof DB === "undefined") return;

  // 1. 遍歷地圖與怪物掉落
  for (let mapId in DB.maps) {
    const map = DB.maps[mapId];
    if (!map) continue;

    mapIndex[mapId] = {
      id: mapId,
      name: map.name,
      reqLv: map.reqLv || 1,
      maxMobs: map.maxMobs || 28,
      monsters: [],
      allDrops: {}
    };

    if (map.monsters && Array.isArray(map.monsters)) {
      for (const mob of map.monsters) {
        mapIndex[mapId].monsters.push(mob.name);

        if (!mobIndex[mob.name]) {
          mobIndex[mob.name] = {
            ...mob,
            maps: []
          };
        }
        if (!mobIndex[mob.name].maps.some(m => m.id === mapId)) {
          mobIndex[mob.name].maps.push({ id: mapId, name: map.name, reqLv: map.reqLv || 1 });
        }

        if (mob.drops && Array.isArray(mob.drops)) {
          for (const drop of mob.drops) {
            const iName = drop.item;
            if (!iName) continue;

            // 記錄地圖掉落物
            mapIndex[mapId].allDrops[iName] = Math.max(mapIndex[mapId].allDrops[iName] || 0, drop.chance || 0);

            // 記錄道具來源
            if (!itemIndex[iName]) {
              itemIndex[iName] = {
                name: iName,
                itemData: (DB.items && DB.items[iName]) ? DB.items[iName] : null,
                drops: [],
                shops: []
              };
            }
            itemIndex[iName].drops.push({
              mobName: mob.name,
              mobLevel: mob.level || 1,
              isBoss: !!(mob.isBoss || (typeof BOSS_NAMES !== 'undefined' && BOSS_NAMES.includes(mob.name))),
              undead: !!mob.undead,
              chance: drop.chance,
              min: drop.min,
              max: drop.max,
              count: drop.count || 1,
              mapId: mapId,
              mapName: map.name,
              reqLv: map.reqLv || 1
            });
          }
        }
      }
    }
  }

  // 2. 遍歷村莊 NPC 商店
  if (DB.villages) {
    for (let vId in DB.villages) {
      const v = DB.villages[vId];
      if (!v || !v.shops) continue;

      for (const s of v.shops) {
        if (!s.items || !Array.isArray(s.items)) continue;

        for (const iName of s.items) {
          if (!itemIndex[iName]) {
            itemIndex[iName] = {
              name: iName,
              itemData: (DB.items && DB.items[iName]) ? DB.items[iName] : null,
              drops: [],
              shops: []
            };
          }
          itemIndex[iName].shops.push({
            villageId: vId,
            villageName: v.name,
            shopTitle: s.title,
            desc: s.desc || "",
            price: (DB.items && DB.items[iName] && DB.items[iName].price) ? DB.items[iName].price : 0
          });
        }
      }
    }
  }

  // 3. 補齊所有在 DB.items 中但暫無怪物或商店的道具（讓玩家依然能查到數值）
  if (DB.items) {
    for (let iName in DB.items) {
      if (!itemIndex[iName]) {
        itemIndex[iName] = {
          name: iName,
          itemData: DB.items[iName],
          drops: [],
          shops: []
        };
      }
    }
  }

  // 對每個道具的掉落清單依機率高到低排序
  for (let iName in itemIndex) {
    itemIndex[iName].drops.sort((a, b) => (b.chance || 0) - (a.chance || 0));
  }

  dbSearchState.cachedItemIndex = itemIndex;
  dbSearchState.cachedMobIndex = mobIndex;
  dbSearchState.cachedMapIndex = mapIndex;
}

// 渲染掉落寶典與查詢分頁核心
function renderDatabaseTab() {
  buildAdenDatabaseIndexes();

  const container = document.getElementById("tab-database");
  if (!container) return;

  const mode = dbSearchState.mode;
  const curQuery = dbSearchState.query;
  const curCat = dbSearchState.category;

  container.innerHTML = `
    <div class="db-header-panel">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <h2 style="margin:0; font-size:16px; color:#d4af37; display:flex; align-items:center; gap:8px;">
          <span>📖 亞丁大陸掉落寶典與取得途徑查詢</span>
        </h2>
        <div style="font-size:11px; color:#94a3b8;">
          收錄全大陸 17 大地圖、43 種怪物生態、160 件神裝武防卷軸與全城鎮 NPC 商店
        </div>
      </div>

      <!-- 模式切換按鈕組 -->
      <div class="db-mode-bar">
        <button type="button" class="db-mode-btn ${mode === 'items' ? 'active' : ''}" onclick="switchDBMode('items')">
          📦 查道具來源 (打什麼怪掉 / 哪裡買)
        </button>
        <button type="button" class="db-mode-btn ${mode === 'monsters' ? 'active' : ''}" onclick="switchDBMode('monsters')">
          👿 查怪物圖鑑 (怪物數值 & 掉落表)
        </button>
        <button type="button" class="db-mode-btn ${mode === 'maps' ? 'active' : ''}" onclick="switchDBMode('maps')">
          🗺️ 查練功地圖 (生態怪物 & 寶物總覽)
        </button>
      </div>

      <!-- 搜尋輸入框與即時清空 -->
      <div class="db-search-box-row">
        <div style="position:relative; flex:1;">
          <input type="text" id="db-search-input" value="${curQuery}" 
                 placeholder="${mode === 'items' ? '🔍 輸入道具名稱 (如: 喬丹之石, 謎團, 軍帽, 30號, 武卷)...' : (mode === 'monsters' ? '🔍 輸入怪物名稱 (如: 安達利爾, 督瑞爾, 墨菲斯托, 暗黑破壞神, 巴爾, 母牛之王)...' : '🔍 輸入地圖名稱 (如: 鮮血荒地, 地下墓穴, 塔拉夏古墓, 混沌避難所, 世界之石大殿)...')}" 
                 oninput="onDBSearchInput(this.value)">
          ${curQuery ? `<span class="db-search-clear" onclick="clearDBSearch()">✕</span>` : ''}
        </div>
      </div>

      <!-- 熱門關鍵字快捷標籤 -->
      <div class="db-quick-tags">
        <span style="color:#7e889b; font-size:11px;">🔥 熱門速查：</span>
        ${renderQuickTags()}
      </div>

      <!-- 道具分類篩選 (僅在道具模式下顯示) -->
      ${mode === 'items' ? renderCategoryFilterBar(curCat) : ''}
    </div>

    <!-- 查詢結果清單區 -->
    <div id="db-results-container" class="db-results-container">
      ${renderDBResults()}
    </div>
  `;
}

// 快速熱門標籤
function renderQuickTags() {
  const mode = dbSearchState.mode;
  let tags = [];
  if (mode === "items") {
    tags = ["喬丹之石 (Stone of Jordan)", "軍帽 (Harlequin Crest)", "謎團 (Enigma)", "泰瑞爾之力 (Tyrael's Might)", "巫師之刺 (Wizardspike)", "30號 貝 (Ber)", "31號 喬 (Jah)", "33號 薩德 (Zod)", "水晶劍 [4孔]", "對武器施法的卷軸", "對防具施法的卷軸", "白色藥水", "勇敢藥水"];
  } else if (mode === "monsters") {
    tags = ["安達利爾", "督瑞爾", "墨菲斯托", "暗黑破壞神", "巴爾", "母牛之王", "沉淪魔", "飢餓殭屍", "劍齒貓掠奪者", "沙漠沙蟲", "巨型毒棘蜘蛛", "攻城投石巨獸"];
  } else {
    tags = ["鮮血荒地", "石塊曠野", "地下墓穴", "碎石荒野", "遠古通道", "塔拉夏古墓", "蜘蛛森林", "崔凡克議會", "憎恨囚牢", "神魔平原", "混沌避難所", "血腥丘陵", "亞瑞特山頂", "世界之石大殿", "秘密母牛關卡"];
  }

  return tags.map(t => `
    <span class="db-tag-pill" onclick="applyDBTagQuery('${t}')">${t}</span>
  `).join("");
}

// 道具分類篩選列
function renderCategoryFilterBar(curCat) {
  const cats = [
    { key: "all", label: "全部道具" },
    { key: "weapon", label: "🗡️ 武器兵器" },
    { key: "armor", label: "🛡️ 防具裝備" },
    { key: "scroll", label: "📜 武防卷軸" },
    { key: "potion", label: "🧪 藥水消耗" },
    { key: "skill", label: "📖 魔法法書/水晶" },
    { key: "material", label: "💎 鑄造材料" }
  ];

  return `
    <div class="db-cat-filter-bar">
      ${cats.map(c => `
        <button type="button" class="db-cat-pill ${curCat === c.key ? 'active' : ''}" onclick="setDBCategory('${c.key}')">
          ${c.label}
        </button>
      `).join("")}
    </div>
  `;
}

// 搜尋輸入事件防抖處理
let dbSearchTimer = null;
function onDBSearchInput(val) {
  clearTimeout(dbSearchTimer);
  dbSearchTimer = setTimeout(() => {
    dbSearchState.query = val.trim();
    const cont = document.getElementById("db-results-container");
    if (cont) {
      cont.innerHTML = renderDBResults();
    }
  }, 120);
}

function clearDBSearch() {
  dbSearchState.query = "";
  renderDatabaseTab();
}

function applyDBTagQuery(tag) {
  dbSearchState.query = tag;
  const input = document.getElementById("db-search-input");
  if (input) input.value = tag;
  const cont = document.getElementById("db-results-container");
  if (cont) {
    cont.innerHTML = renderDBResults();
  }
}

function switchDBMode(newMode) {
  dbSearchState.mode = newMode;
  dbSearchState.query = "";
  renderDatabaseTab();
}

function setDBCategory(cat) {
  dbSearchState.category = cat;
  renderDatabaseTab();
}

// 判斷道具分類
function getItemCategoryKey(itemName, itemData) {
  if (!itemData) {
    if (itemName.includes("卷軸")) return "scroll";
    if (itemName.includes("魔法書") || itemName.includes("精靈水晶")) return "skill";
    if (itemName.includes("藥水")) return "potion";
    return "material";
  }
  const t = itemData.type || "";
  if (t === "weapon") return "weapon";
  if (["armor", "helm", "cloak", "glove", "boots", "shield", "amulet", "ring", "belt"].includes(t)) return "armor";
  if (t.startsWith("enchant_") || t === "scroll") return "scroll";
  if (t === "potion" || itemName.includes("藥水") || itemName.includes("箭")) return "potion";
  if (t === "spellbook" || itemName.includes("魔法書") || itemName.includes("精靈水晶")) return "skill";
  return "material";
}

// 渲染查詢結果核心
function renderDBResults() {
  const mode = dbSearchState.mode;
  if (mode === "items") {
    return renderItemResults();
  } else if (mode === "monsters") {
    return renderMonsterResults();
  } else {
    return renderMapResults();
  }
}

// 1. 渲染道具取得途徑卡片
function renderItemResults() {
  const index = dbSearchState.cachedItemIndex;
  if (!index) return `<div class="db-no-data">資料索引加載中...</div>`;

  const query = dbSearchState.query.toLowerCase();
  const category = dbSearchState.category;

  // 取得過濾後的道具名單
  let list = Object.values(index).filter(entry => {
    const iName = entry.name.toLowerCase();
    const cat = getItemCategoryKey(entry.name, entry.itemData);
    if (category !== "all" && cat !== category) return false;

    if (!query) return true;

    // 模糊搜尋支援：道具名、描述、掉落怪、地圖、村莊
    if (iName.includes(query)) return true;
    if (entry.itemData?.desc && entry.itemData.desc.toLowerCase().includes(query)) return true;
    if (entry.drops.some(d => d.mobName.toLowerCase().includes(query) || d.mapName.toLowerCase().includes(query))) return true;
    if (entry.shops.some(s => s.villageName.toLowerCase().includes(query) || s.shopTitle.toLowerCase().includes(query))) return true;
    return false;
  });

  // 優先排序：有掉落物或商店的排前面
  list.sort((a, b) => {
    const aSources = (a.drops.length * 2) + a.shops.length;
    const bSources = (b.drops.length * 2) + b.shops.length;
    return bSources - aSources;
  });

  if (list.length === 0) {
    return `
      <div class="db-no-data">
        🔍 查無符合【${dbSearchState.query}】的道具資料。<br>
        <span style="font-size:11px; color:#64748b; margin-top:4px; display:inline-block;">可嘗試切換分類為「全部道具」，或使用更簡短的關鍵字搜尋。</span>
      </div>
    `;
  }

  // 限制一次渲染上限以防長列表卡頓
  const maxRender = 60;
  const totalCount = list.length;
  const displayList = list.slice(0, maxRender);

  let html = `
    <div style="font-size:11.5px; color:#93c5fd; margin-bottom:8px; display:flex; justify-content:space-between;">
      <span>共找到 <b>${totalCount}</b> 項相關道具 (顯示前 ${displayList.length} 筆)</span>
      <span style="color:#64748b;">點擊【📍 切換前往獵場】可直接轉移打寶！</span>
    </div>
    <div class="db-cards-grid">
  `;

  displayList.forEach(entry => {
    const item = entry.itemData;
    const iName = entry.name;
    const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(iName, "size-lg") : "📦";

    // 取得品質色
    let tierClass = "tier-white";
    if (item?.tier === "blue") tierClass = "tier-blue";
    if (item?.tier === "red" || item?.tier === "purple") tierClass = "tier-purple";
    if (item?.tier === "gold") tierClass = "tier-gold";
    if (item?.tier === "scroll") tierClass = "tier-scroll";

    // 道具基本屬性字串
    const attrBadges = [];
    if (item) {
      if (item.type === "weapon") {
        attrBadges.push(`小怪:${item.small || 0} / 大怪:${item.large || 0}`);
        if (item.hitBonus) attrBadges.push(`命中+${item.hitBonus}`);
        if (item.extraDmg) attrBadges.push(`額外傷害+${item.extraDmg}`);
        attrBadges.push(`安定:${item.safe || 6}`);
        attrBadges.push(`材質:${item.material || '鐵'}`);
      } else if (item.ac !== undefined) {
        attrBadges.push(`防禦:${item.ac}`);
        if (item.mr) attrBadges.push(`魔防+${item.mr}%`);
        attrBadges.push(`安定:${item.safe !== undefined ? item.safe : 4}`);
      }
      if (item.weight) attrBadges.push(`重量:${item.weight}`);
      if (item.price) attrBadges.push(`原價: ${item.price.toLocaleString()} 金幣`);
    }

    // 怪物掉落途徑表格
    let dropsHtml = "";
    if (entry.drops && entry.drops.length > 0) {
      dropsHtml = `
        <div class="db-source-subhead db-subhead-drop">
          <span>🔴 怪物掉落來源 (${entry.drops.length} 種怪物會掉落)</span>
        </div>
        <div class="db-drop-table-wrap">
          <table class="db-table">
            <thead>
              <tr>
                <th>出沒怪物</th>
                <th>等級</th>
                <th>所在獵場地圖</th>
                <th>掉落機率</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${entry.drops.map(d => {
                const percentStr = (d.chance >= 0.01) ? `${(d.chance * 100).toFixed(1)}%` : `${(d.chance * 100).toFixed(3)}%`;
                return `
                  <tr>
                    <td>
                      <b style="color:${d.isBoss ? '#f59e0b' : '#f1f5f9'}; cursor:pointer;" onclick="jumpToMonsterSearch('${d.mobName}')" title="點擊查看此怪物圖鑑">
                        ${d.isBoss ? '👑 ' : ''}${d.mobName}
                      </b>
                      ${d.undead ? '<span class="db-undead-tag">不死系</span>' : ''}
                    </td>
                    <td>Lv.${d.mobLevel}</td>
                    <td>
                      <span style="color:#38bdf8;">${d.mapName}</span>
                    </td>
                    <td>
                      <span class="db-rate-badge ${d.chance >= 0.1 ? 'rate-high' : (d.chance >= 0.03 ? 'rate-med' : 'rate-low')}">
                        ${percentStr}
                      </span>
                      ${d.count > 1 ? `<span style="font-size:10px; color:#cbd5e1;">(x${d.count})</span>` : ''}
                    </td>
                    <td>
                      <button type="button" class="db-action-btn" onclick="teleportToHuntingGround('${d.mapId}', '${d.mapName}')" title="將掛機地圖切換至此處">
                        📍 前往獵場
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      dropsHtml = `
        <div class="db-source-empty">
          <span>⚠️ 暫無野外怪物直接掉落（可能為商店專售或任務合成道具）</span>
        </div>
      `;
    }

    // 商店購買途徑表格
    let shopsHtml = "";
    if (entry.shops && entry.shops.length > 0) {
      shopsHtml = `
        <div class="db-source-subhead db-subhead-shop">
          <span>🟢 村莊 NPC 商店販售 (${entry.shops.length} 間商鋪有售)</span>
        </div>
        <div class="db-shop-list">
          ${entry.shops.map(s => `
            <div class="db-shop-item">
              <div>
                <b style="color:#4ade80;">${s.villageName}</b>
                <span style="color:#94a3b8; font-size:11px; margin-left:4px;">${s.shopTitle}</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="color:#fde047; font-weight:bold; font-size:12px;">💰 ${s.price.toLocaleString()} 金幣</span>
                <button type="button" class="db-action-btn" onclick="goToVillageShop('${s.villageId}')">
                  🏛️ 前往村莊
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    html += `
      <div class="db-card ${tierClass}">
        <!-- 頂部道具標頭 -->
        <div class="db-card-header">
          <div class="db-card-icon-title">
            <div class="db-icon-frame">
              ${iconHtml}
            </div>
            <div>
              <div class="db-card-title">${iName}</div>
              <div class="db-card-desc">${item?.desc || '經典亞丁道具'}</div>
            </div>
          </div>
          <div class="db-badges-wrap">
            ${attrBadges.map(b => `<span class="db-spec-badge">${b}</span>`).join("")}
          </div>
        </div>

        <!-- 來源主體 (怪物掉落 + 商店購買) -->
        <div class="db-card-body">
          ${dropsHtml}
          ${shopsHtml}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

// 2. 渲染怪物圖鑑與掉落清單
function renderMonsterResults() {
  const index = dbSearchState.cachedMobIndex;
  if (!index) return `<div class="db-no-data">資料索引加載中...</div>`;

  const query = dbSearchState.query.toLowerCase();
  let list = Object.values(index).filter(mob => {
    if (!query) return true;
    if (mob.name.toLowerCase().includes(query)) return true;
    if (mob.maps && mob.maps.some(m => m.name.toLowerCase().includes(query))) return true;
    if (mob.drops && mob.drops.some(d => d.item.toLowerCase().includes(query))) return true;
    return false;
  });

  list.sort((a, b) => (b.level || 0) - (a.level || 0));

  if (list.length === 0) {
    return `<div class="db-no-data">🔍 查無符合【${dbSearchState.query}】的怪物生態資料。</div>`;
  }

  let html = `
    <div style="font-size:11.5px; color:#93c5fd; margin-bottom:8px;">
      共找到 <b>${list.length}</b> 隻怪物生態記錄
    </div>
    <div class="db-mob-grid">
  `;

  list.forEach(mob => {
    const isBoss = !!(mob.isBoss || (typeof BOSS_NAMES !== 'undefined' && BOSS_NAMES.includes(mob.name)));

    html += `
      <div class="db-mob-card ${isBoss ? 'mob-boss' : ''}">
        <!-- 怪物標題與基本數值 -->
        <div class="db-mob-head">
          <div>
            <span class="db-mob-name">${isBoss ? '👑 [王級首領] ' : ''}${mob.name}</span>
            <span style="font-size:11px; color:#aaa; margin-left:6px;">Lv.${mob.level}</span>
          </div>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${mob.undead ? '<span class="db-undead-tag">不死系</span>' : ''}
            ${mob.aggressive ? '<span class="db-aggro-tag">主動攻擊</span>' : '<span class="db-passive-tag">被動</span>'}
            ${mob.poison ? '<span class="db-poison-tag">劇毒</span>' : ''}
          </div>
        </div>

        <!-- 數值列 -->
        <div class="db-mob-stats-row">
          <span>HP: <b>${mob.hp}</b></span>
          <span>AC: <b>${mob.ac}</b></span>
          <span>EXP: <b>${mob.exp}</b></span>
          <span>體型: <b>${mob.size === 'large' ? '大型怪' : '小型怪'}</b></span>
        </div>

        <!-- 出沒獵場 -->
        <div style="font-size:11px; color:#cbd5e1; margin-bottom:6px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:4px;">
          <span>出沒地圖：${mob.maps.map(m => `<span style="color:#38bdf8;">${m.name}</span>`).join("、")}</span>
          ${mob.maps[0] ? `
            <button type="button" class="db-action-btn" onclick="teleportToHuntingGround('${mob.maps[0].id}', '${mob.maps[0].name}')">
              📍 前往打怪
            </button>
          ` : ''}
        </div>

        <!-- 完整掉落清單 -->
        <div class="db-mob-drops-wrap">
          <div style="font-size:11px; font-weight:bold; color:#fde047; margin-bottom:4px;">💰 掉落寶物一覽表：</div>
          <div class="db-mob-drop-chips">
            ${(mob.drops && mob.drops.length > 0) ? mob.drops.map(d => {
              const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(d.item) : "";
              const percentStr = (d.chance >= 0.01) ? `${(d.chance * 100).toFixed(1)}%` : `${(d.chance * 100).toFixed(2)}%`;
              return `
                <div class="db-mob-drop-chip" onclick="jumpToItemSearch('${d.item}')" title="點擊反查此道具在全大陸的取得來源">
                  ${iconHtml}
                  <span>${d.item}</span>
                  <span class="chip-rate">${percentStr}</span>
                </div>
              `;
            }).join("") : '<span style="color:#64748b; font-size:11px;">無特殊掉落物</span>'}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

// 3. 渲染練功地圖生態總覽
function renderMapResults() {
  const mapIdx = dbSearchState.cachedMapIndex;
  const mobIdx = dbSearchState.cachedMobIndex;
  if (!mapIdx) return `<div class="db-no-data">資料索引加載中...</div>`;

  const query = dbSearchState.query.toLowerCase();
  let list = Object.values(mapIdx).filter(m => {
    if (!query) return true;
    if (m.name.toLowerCase().includes(query)) return true;
    if (m.monsters.some(mon => mon.toLowerCase().includes(query))) return true;
    if (Object.keys(m.allDrops).some(drop => drop.toLowerCase().includes(query))) return true;
    return false;
  });

  list.sort((a, b) => a.reqLv - b.reqLv);

  if (list.length === 0) {
    return `<div class="db-no-data">🔍 查無符合【${dbSearchState.query}】的練功地圖。</div>`;
  }

  let html = `
    <div style="font-size:11.5px; color:#93c5fd; margin-bottom:8px;">
      收錄全大陸 <b>${list.length}</b> 大熱門獵場
    </div>
    <div class="db-map-grid">
  `;

  list.forEach(m => {
    const isCurrent = (gameState.currentMap === m.id);

    html += `
      <div class="db-map-card ${isCurrent ? 'map-current' : ''}">
        <div class="db-map-header">
          <div>
            <span class="db-map-title">${m.name}</span>
            <span style="font-size:11px; color:#aaa; margin-left:6px;">(建議等級: Lv.${m.reqLv}+)</span>
            ${isCurrent ? '<span style="background:#22c55e; color:#fff; font-size:10px; padding:1px 6px; border-radius:10px; margin-left:6px;">目前所在</span>' : ''}
          </div>
          <button type="button" class="btn btn-gold" style="padding:2px 10px; font-size:11px;" onclick="teleportToHuntingGround('${m.id}', '${m.name}')">
            📍 前往此獵場
          </button>
        </div>

        <!-- 該地圖怪物名冊 -->
        <div style="margin:6px 0; font-size:11.5px;">
          <b style="color:#60a5fa;">出沒怪物：</b>
          ${m.monsters.map(monName => {
            const mobData = mobIdx[monName];
            const isBoss = mobData?.isBoss || (typeof BOSS_NAMES !== 'undefined' && BOSS_NAMES.includes(monName));
            return `
              <span class="db-tag-pill" onclick="jumpToMonsterSearch('${monName}')">
                ${isBoss ? '👑 ' : ''}${monName} (Lv.${mobData?.level || '?'})
              </span>
            `;
          }).join(" ")}
        </div>

        <!-- 該地圖核心寶物掉落總覽 -->
        <div style="margin-top:6px;">
          <b style="color:#fde047; font-size:11.5px;">✨ 本區域可獲得寶物總覽：</b>
          <div class="db-mob-drop-chips" style="margin-top:4px;">
            ${Object.keys(m.allDrops).map(iName => {
              const iconHtml = (typeof getItemIconHtml === "function") ? getItemIconHtml(iName) : "";
              return `
                <div class="db-mob-drop-chip" onclick="jumpToItemSearch('${iName}')">
                  ${iconHtml}
                  <span>${iName}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

// 快速點擊跳轉輔助
function jumpToItemSearch(itemName) {
  dbSearchState.mode = "items";
  dbSearchState.query = itemName;
  renderDatabaseTab();
}

function jumpToMonsterSearch(mobName) {
  dbSearchState.mode = "monsters";
  dbSearchState.query = mobName;
  renderDatabaseTab();
}

// 快捷操作：直接切換當前掛機獵場地圖
function teleportToHuntingGround(mapId, mapName) {
  if (!mapId) return;
  gameState.currentMap = mapId;

  // 若存在地圖下拉選單，同步切換
  const mapSelect = document.getElementById("map-select");
  if (mapSelect) mapSelect.value = mapId;

  if (typeof initWorldMobs === "function") initWorldMobs();
  if (typeof updateLeftPanel === "function") updateLeftPanel();

  log(`🚀【掉落寶典傳送】已為您切換獵場至【${mapName}】！準備展開打寶！`, "sys");

  // 切回戰場分頁
  if (typeof switchTab === "function") {
    switchTab("battle");
  }
}

// 快捷操作：跳轉至指定村莊商店
function goToVillageShop(villageId) {
  if (!villageId) return;
  gameState.viewingVillage = villageId;

  const vSelect = document.getElementById("village-select");
  if (vSelect) vSelect.value = villageId;

  if (typeof renderVillageTab === "function") renderVillageTab();
  if (typeof switchTab === "function") {
    switchTab("village");
  }
}

window.renderDatabaseTab = renderDatabaseTab;
window.switchDBMode = switchDBMode;
window.setDBCategory = setDBCategory;
window.onDBSearchInput = onDBSearchInput;
window.clearDBSearch = clearDBSearch;
window.applyDBTagQuery = applyDBTagQuery;
window.jumpToItemSearch = jumpToItemSearch;
window.jumpToMonsterSearch = jumpToMonsterSearch;
window.teleportToHuntingGround = teleportToHuntingGround;
window.goToVillageShop = goToVillageShop;

window.dbSearchState = dbSearchState;
