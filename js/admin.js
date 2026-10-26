// js/admin.js - GM 控制台、怪物生態自訂與帳號管理
async function renderAdminTab() {
  const expElem = document.getElementById("gm-exp-rate");
  if (expElem) expElem.value = gmSettings.expRate;
  const dropElem = document.getElementById("gm-drop-rate");
  if (dropElem) dropElem.value = gmSettings.dropRate;
  const goldElem = document.getElementById("gm-gold-rate");
  if (goldElem) goldElem.value = gmSettings.goldRate;

  const gmMapSel = document.getElementById("gm-map-select");
  if (gmMapSel) {
    gmMapSel.innerHTML = "";
    for (let mapKey in DB.maps) {
      const opt = document.createElement("option");
      opt.value = mapKey;
      opt.innerText = DB.maps[mapKey].name;
      gmMapSel.appendChild(opt);
    }
    gmMapSel.value = gameState.currentMap;
  }

  renderGMMonsterSettings();
  await renderGMAccountsTable();
}

function renderGMMonsterSettings() {
  const gmMapSel = document.getElementById("gm-map-select");
  if (!gmMapSel) return;
  const mapKey = gmMapSel.value;
  const cfg = getMapConfig(mapKey);

  const container = document.getElementById("gm-mob-species-list");
  if (!container) return;
  container.innerHTML = "";

  const mapData = DB.maps[mapKey];
  if (!mapData || !mapData.monsters) return;

  function updateSumDisplay() {
    let sum = 0;
    mapData.monsters.forEach(m => {
      const input = document.getElementById(`gm-species-${mapKey}-${m.name}`);
      sum += input ? Math.max(0, parseInt(input.value) || 0) : 0;
    });
    const totalDisp = document.getElementById("gm-map-total-display");
    if (totalDisp) totalDisp.innerText = `${sum} 隻`;
  }

  mapData.monsters.forEach(m => {
    const isBoss = m.isBoss || BOSS_NAMES.includes(m.name);
    const defaultCount = isBoss ? 1 : 8;
    const currentCount = (cfg.speciesCounts && cfg.speciesCounts[m.name] !== undefined) ? cfg.speciesCounts[m.name] : defaultCount;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.fontSize = "12px";
    row.style.padding = "4px 0";
    row.innerHTML = `
      <span style="color:${isBoss ? '#f472b6; font-weight:bold;' : '#e2e8f0;'}">
        ${isBoss ? '👑 ' : ''}${m.name} (Lv.${m.level})
      </span>
      <div style="display:flex; align-items:center; gap:4px;">
        生成數量：<input type="number" id="gm-species-${mapKey}-${m.name}" value="${currentCount}" min="0" max="100" style="width:60px; text-align:center;"> 隻
      </div>
    `;
    container.appendChild(row);

    const inputElem = row.querySelector("input");
    if (inputElem) {
      inputElem.addEventListener("input", updateSumDisplay);
    }
  });

  updateSumDisplay();
}

function saveGMMonsterSettings() {
  const gmMapSel = document.getElementById("gm-map-select");
  if (!gmMapSel) return;
  const mapKey = gmMapSel.value;

  const mapData = DB.maps[mapKey];
  if (!mapData || !mapData.monsters) return;

  const species = {};
  let calculatedTotal = 0;
  mapData.monsters.forEach(m => {
    const input = document.getElementById(`gm-species-${mapKey}-${m.name}`);
    const isBoss = m.isBoss || BOSS_NAMES.includes(m.name);
    const count = input ? Math.max(0, parseInt(input.value) || 0) : (isBoss ? 1 : 8);
    species[m.name] = count;
    calculatedTotal += count;
  });

  if (!gmSettings.customMapConfigs) {
    gmSettings.customMapConfigs = {};
  }

  gmSettings.customMapConfigs[mapKey] = {
    totalMobs: calculatedTotal,
    speciesCounts: species
  };

  localStorage.setItem("lineage_gm_settings", JSON.stringify(gmSettings));

  // 如果目前玩家就在這張地圖，立即清場重刷
  if (gameState.currentMap === mapKey) {
    initWorldMobs();
    if (typeof renderRadar === "function") renderRadar();
  }

  alert(`【${DB.maps[mapKey].name}】怪物生態更新完成！\n地圖怪物總數：${calculatedTotal} 隻`);
  log(`👑 GM 調整了【${DB.maps[mapKey].name}】怪物生態，目前全圖精準常駐 ${calculatedTotal} 隻怪物！`, "sys");
}

function applyGMSettings() {
  const expElem = document.getElementById("gm-exp-rate");
  const dropElem = document.getElementById("gm-drop-rate");
  const goldElem = document.getElementById("gm-gold-rate");

  const exp = expElem ? parseFloat(expElem.value) || 1.0 : 1.0;
  const drop = dropElem ? parseFloat(dropElem.value) || 1.0 : 1.0;
  const gold = goldElem ? parseFloat(goldElem.value) || 1.0 : 1.0;

  gmSettings.expRate = Math.max(0.1, exp);
  gmSettings.dropRate = Math.max(0.1, drop);
  gmSettings.goldRate = Math.max(0.1, gold);

  localStorage.setItem("lineage_gm_settings", JSON.stringify(gmSettings));
  alert(`最高權限設定成功！\n- EXP: ${gmSettings.expRate}x\n- 掉落率: ${gmSettings.dropRate}x\n- 金錢: ${gmSettings.goldRate}x`);
  log(`👑 GM 倍率已生效！EXP: ${gmSettings.expRate}x / 掉落: ${gmSettings.dropRate}x / 金幣: ${gmSettings.goldRate}x`, "sys");
}

function resetGMSettings() {
  gmSettings = { expRate: 1.0, dropRate: 1.0, goldRate: 1.0, customMapConfigs: {} };
  const expElem = document.getElementById("gm-exp-rate");
  if (expElem) expElem.value = 1.0;
  const dropElem = document.getElementById("gm-drop-rate");
  if (dropElem) dropElem.value = 1.0;
  const goldElem = document.getElementById("gm-gold-rate");
  if (goldElem) goldElem.value = 1.0;

  localStorage.removeItem("lineage_gm_settings");
  renderGMMonsterSettings();
  initWorldMobs();
  alert("已重設所有倍率與怪物數量為原版預設值！");
  log("👑 GM 倍率與地圖生態已重置為原版標準平衡。", "sys");
}

function loadGMSettings() {
  const saved = localStorage.getItem("lineage_gm_settings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      gmSettings = { ...gmSettings, ...parsed };
      if (!gmSettings.customMapConfigs) gmSettings.customMapConfigs = {};
    } catch (e) {
      gmSettings = { expRate: 1.0, dropRate: 1.0, goldRate: 1.0, customMapConfigs: {} };
    }
  }
}

async function renderGMAccountsTable() {
  const tbody = document.getElementById("gm-accounts-table-body");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">讀取雲端資料庫中...</td></tr>`;

  try {
    const { data: accounts, error } = await supabaseClient.from('game_accounts').select('*');
    if (error) throw error;

    tbody.innerHTML = "";
    (accounts || []).forEach(acc => {
      const charNames = (acc.characters || []).map(c => c.name).join(", ") || "無角色";
      const roleBadge = acc.role_level === 2
        ? `<span style="color:#d946ef; font-weight:bold;">二級 (GM)</span>`
        : `<span style="color:#38bdf8;">一級 (玩家)</span>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><b>${acc.username}</b></td>
        <td style="color:#94a3b8; font-family:monospace;">${acc.password}</td>
        <td>${roleBadge}</td>
        <td>${acc.characters ? acc.characters.length : 0} 隻 (${charNames})</td>
        <td>
          <button class="btn ${acc.role_level === 2 ? '' : 'btn-gold'}" onclick="toggleUserRole('${acc.username}', ${acc.role_level})">
            ${acc.role_level === 2 ? '降為一級玩家' : '提升為二級GM'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">無法讀取帳號列表: ${err.message}</td></tr>`;
  }
}

async function toggleUserRole(username, currentRole) {
  const newRole = (currentRole === 2) ? 1 : 2;
  const { error } = await supabaseClient
    .from('game_accounts')
    .update({ role_level: newRole })
    .eq('username', username);

  if (error) {
    alert("修改失敗: " + error.message);
    return;
  }

  if (currentUser && currentUser.username === username) {
    currentUser.roleLevel = newRole;
  }
  await renderGMAccountsTable();
  alert(`已將帳號【${username}】權限調整為：${newRole === 2 ? '二級 GM 管理員' : '一級 一般玩家'}`);
}

async function exportAccountsToExcel() {
  const { data: accounts, error } = await supabaseClient.from('game_accounts').select('*');
  if (error || !accounts || accounts.length === 0) {
    alert("目前伺服器無任何帳號資料或讀取失敗！");
    return;
  }

  let csvContent = "\uFEFF";
  csvContent += "帳號,密碼,權限等級,身分說明,最後活躍時間,人物數量,人物列表\n";

  accounts.forEach(acc => {
    const roleText = acc.role_level === 2 ? "二級 GM 管理員" : "一級 一般冒險者";
    const charCount = acc.characters ? acc.characters.length : 0;
    const charNames = (acc.characters || []).map(c => `${c.name}(Lv.${c.level})`).join(" / ") || "尚無角色";
    const regTime = acc.last_active_time || "未知";
    const safeCharNames = `"${charNames.replace(/"/g, '""')}"`;
    csvContent += `${acc.username},${acc.password},${acc.role_level || 1},${roleText},${regTime},${charCount},${safeCharNames}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Lineage_Accounts_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  log("📊 已成功匯出伺服器冒險者帳密名單 Excel 檔案！", "sys");
}