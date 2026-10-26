// js/supabase.js - 雲端儲存與離線結算 (確保戰術巨集一起寫入雲端)
const SUPABASE_URL = "https://sjawgbilaodthdjneqxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_MpcIodusDohvggm2DWpe1Q_Ejv424D6";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveAccountData() {
  if (!currentUser) return;
  // 同步當前的掛機設定與藥水閥值到角色存檔內
  if (currentChar) {
    currentChar.botSettings = JSON.parse(JSON.stringify(gameState.botSettings));
    currentChar.potionThresholds = JSON.parse(JSON.stringify(gameState.potionThresholds));

    // 🚨 同步掛機/地圖/座標狀態，確保 F5/登出後可恢復掛機
    if (!currentChar.savedState) currentChar.savedState = {};
    currentChar.savedState.isRunning = !!gameState.isRunning;
    currentChar.savedState.botStatus = gameState.botStatus || (gameState.inVillage ? "village" : "idle");
    currentChar.savedState.inVillage = !!gameState.inVillage;
    currentChar.savedState.currentMap = gameState.currentMap || "talking_island";
    currentChar.savedState.playerX = gameState.playerX || 1200;
    currentChar.savedState.playerY = gameState.playerY || 800;
  }

  // 同步角色陣列
  if (currentChar && Array.isArray(currentUser.characters)) {
    const idx = currentUser.characters.findIndex(c => c && c.name === currentChar.name);
    if (idx !== -1) currentUser.characters[idx] = currentChar;
  }

  // 本地備份，避免雲端延遲時丟失
  try {
    localStorage.setItem("lineage_acc_" + currentUser.username, JSON.stringify(currentUser));
  } catch (err) { }
  try {
    const { error } = await supabaseClient
      .from('game_accounts')
      .upsert({
        username: currentUser.username,
        password: currentUser.password,
        role_level: currentUser.roleLevel || 1,
        characters: currentUser.characters,
        last_active_time: new Date().toISOString()
      }, { onConflict: 'username' });

    if (error) console.error("雲端存檔失敗:", error.message);
  } catch (err) {
    console.error("存檔異常:", err);
  }
}

function logout() {
  try {
    if (typeof saveAccountData === "function") saveAccountData();
  } catch (e) { }
  localStorage.removeItem("lineage_remembered_user");
  currentUser = null;
  currentChar = null;
  const boxLogin = document.getElementById("box-login");
  const boxSelect = document.getElementById("box-select-char");
  const boxCreate = document.getElementById("box-create-char");
  const viewGame = document.getElementById("view-game");
  const viewAuth = document.getElementById("view-auth");
  if (boxSelect) boxSelect.style.display = "none";
  if (boxCreate) boxCreate.style.display = "none";
  if (boxLogin) boxLogin.style.display = "flex";
  if (viewGame) {
    viewGame.classList.remove("active");
    viewGame.style.setProperty("display", "none", "important");
  }
  if (viewAuth) {
    viewAuth.classList.add("active");
    viewAuth.style.setProperty("display", "flex", "important");
  }
  const userElem = document.getElementById("login-user");
  const passElem = document.getElementById("login-pass");
  if (userElem) userElem.value = "";
  if (passElem) passElem.value = "";
}
window.logout = logout;

async function checkAutoLogin() {
  try {
    const rememberedUser = localStorage.getItem("lineage_remembered_user");
    if (rememberedUser) {
      const { data, error } = await supabaseClient
        .from('game_accounts')
        .select('*')
        .eq('username', rememberedUser)
        .maybeSingle();

      if (data && !error) {
        currentUser = {
          username: data.username,
          password: data.password,
          roleLevel: data.role_level,
          characters: data.characters || [],
          lastActiveTime: data.last_active_time
        };
        showCharSelectView();
      }
    }
  } catch (err) {
    console.error("自動登入異常:", err);
  }
}

// 在 js/supabase.js 中更新 handleLoginOrRegister 與 calculateOfflineGains：
async function handleLoginOrRegister() {
  const userElem = document.getElementById("login-user");
  const passElem = document.getElementById("login-pass");
  if (!userElem || !passElem) return;

  const user = userElem.value.trim();
  const pass = passElem.value.trim();

  // 取得登入卡片內的錯誤提示容器
  let loginErr = document.getElementById("login-error-msg");
  if (!loginErr) {
    loginErr = document.createElement("div");
    loginErr.id = "login-error-msg";
    loginErr.className = "inline-error-msg";
    userElem.parentElement.parentElement.insertBefore(loginErr, userElem.parentElement);
  }

  function showLoginError(msg) {
    loginErr.innerText = msg;
    loginErr.style.display = "block";
    log(`⚠️ 登入提示：${msg}`, "sys");
  }

  if (!user || !pass) {
    showLoginError("⚠️ 請輸入帳號與密碼！");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('game_accounts')
      .select('*')
      .eq('username', user)
      .maybeSingle();

    if (data) {
      if (data.password !== pass) {
        showLoginError("⚠️ 密碼錯誤，請重新輸入！");
        return;
      }
      currentUser = {
        username: data.username,
        password: data.password,
        roleLevel: data.role_level,
        characters: data.characters || [],
        lastActiveTime: data.last_active_time
      };
    } else {
      const isGM = (user.toLowerCase() === "cyok73");
      const newAcc = {
        username: user,
        password: pass,
        role_level: isGM ? 2 : 1,
        characters: [],
        last_active_time: new Date().toISOString()
      };
      const { error: insertError } = await supabaseClient.from('game_accounts').insert([newAcc]);
      if (insertError) throw insertError;

      currentUser = {
        username: user,
        password: pass,
        roleLevel: newAcc.role_level,
        characters: [],
        lastActiveTime: newAcc.last_active_time
      };
    }

    loginErr.style.display = "none";
    localStorage.setItem("lineage_remembered_user", user);
    showCharSelectView();
  } catch (err) {
    showLoginError("⚠️ 雲端連線失敗：" + err.message);
  }
}

// 離線收益結算：改以日誌詳細列出，不中斷遊戲
function calculateOfflineGains() {
  if (!currentUser.lastActiveTime || !currentChar) return;

  const lastTime = new Date(currentUser.lastActiveTime).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - lastTime) / (1000 * 60));

  if (diffMinutes >= 2) {
    const calcMinutes = Math.min(diffMinutes, 1440);
    const mapData = (typeof DB !== 'undefined' && DB.maps && DB.maps[gameState.currentMap]) ? DB.maps[gameState.currentMap] : (DB.maps ? DB.maps["talking_island"] : null);
    if (!mapData || !mapData.monsters) return;

    const totalKills = calcMinutes * 4;
    let earnedExp = 0;
    let earnedGold = 0;
    let droppedItems = {};

    for (let k = 0; k < totalKills; k++) {
      const mob = mapData.monsters[Math.floor(Math.random() * mapData.monsters.length)];
      earnedExp += mob.exp;

      if (mob.drops) {
        mob.drops.forEach(drop => {
          if (Math.random() <= drop.chance) {
            if (drop.item === "金幣") {
              earnedGold += Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
            } else {
              droppedItems[drop.item] = (droppedItems[drop.item] || 0) + (drop.count || 1);
            }
          }
        });
      }
    }

    currentChar.exp = (currentChar.exp || 0) + earnedExp;
    currentChar.gold = (currentChar.gold || 0) + earnedGold;

    while (currentChar.exp >= (currentChar.level * currentChar.level * 100)) {
      currentChar.exp -= (currentChar.level * currentChar.level * 100);
      currentChar.level++;
      currentChar.maxHp += 15;
      currentChar.maxMp += 5;
    }

    let lootDesc = [];
    for (let itemName in droppedItems) {
      if (typeof addItemToInventory === 'function') addItemToInventory(itemName, droppedItems[itemName]);
      lootDesc.push(`${itemName} x${droppedItems[itemName]}`);
    }

    // 🚨 依規範改為日誌輸出，禁止原生阻斷彈窗！
    log(`💤【離線修練報告】離線掛機：${Math.floor(calcMinutes / 60)}小時${calcMinutes % 60}分，討伐怪物：約${totalKills}隻，經驗值：+${earnedExp.toLocaleString()}，金幣：+${earnedGold.toLocaleString()}元。`, "sys");
    if (lootDesc.length > 0) {
      log(`✨【離線戰利品】${lootDesc.slice(0, 5).join("、")}`, "drop");
    }

    saveAccountData();
  }
}