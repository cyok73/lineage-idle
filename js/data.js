// js/data.js - 資料庫整合入口
// 各模組已拆分為獨立專屬檔案以方便維護擴充：
// 1. js/data_monsters.js (怪物與獵場地圖、變身設定)
// 2. js/data_items.js (道具、11大部位裝備、城鎮商店、像素圖標系統)
// 3. js/data_skills.js (技能、精靈水晶、技術書、職業初始數值)

window.DB = window.DB || {};
if (typeof DB === "undefined") {
  var DB = window.DB;
}