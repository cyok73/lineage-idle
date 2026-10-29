// js/mapData.js - 暗黑破壞神五大章節獵場場景與地形視覺設定
// Keys MUST match the map keys in DB.maps (data_monsters.js)
window.mapData = {
  // === Act 1 羅格營地區域 ===
  "blood_moor": {
    name: "鮮血荒地",
    act: "Act 1",
    theme: "blood_moor",
    bg: null,
    tileBase: "#1a1815",
    gridLine: "#26221d",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "stony_field": {
    name: "石塊曠野",
    act: "Act 1",
    theme: "stony_field",
    bg: null,
    tileBase: "#252522",
    gridLine: "#33332e",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "catacombs": {
    name: "地下墓穴",
    act: "Act 1",
    theme: "catacombs",
    bg: null,
    tileBase: "#16161b",
    gridLine: "#24242e",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === Act 2 魯高因沙漠區域 ===
  "rocky_waste": {
    name: "碎石荒野",
    act: "Act 2",
    theme: "rocky_waste",
    bg: null,
    tileBase: "#4d3a24",
    gridLine: "#5e472c",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "ancient_tunnels": {
    name: "遠古通道",
    act: "Act 2",
    theme: "ancient_tunnels",
    bg: null,
    tileBase: "#2a2016",
    gridLine: "#382c20",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "tal_rasha_tomb": {
    name: "塔拉夏古墓",
    act: "Act 2",
    theme: "tal_rasha_tomb",
    bg: null,
    tileBase: "#1c1218",
    gridLine: "#2b1c25",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === Act 3 庫拉斯特叢林 ===
  "spider_forest": {
    name: "蜘蛛森林",
    act: "Act 3",
    theme: "spider_forest",
    bg: null,
    tileBase: "#122013",
    gridLine: "#1a2e1c",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "travincal": {
    name: "崔凡克議會",
    act: "Act 3",
    theme: "travincal",
    bg: null,
    tileBase: "#242733",
    gridLine: "#323647",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "durance_of_hate": {
    name: "憎恨囚牢",
    act: "Act 3",
    theme: "durance_of_hate",
    bg: null,
    tileBase: "#220d12",
    gridLine: "#33131b",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === Act 4 群魔堡壘 ===
  "plains_of_despair": {
    name: "神魔平原",
    act: "Act 4",
    theme: "plains_of_despair",
    bg: null,
    tileBase: "#281717",
    gridLine: "#382020",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "chaos_sanctuary": {
    name: "混沌避難所",
    act: "Act 4",
    theme: "chaos_sanctuary",
    bg: null,
    tileBase: "#1a080a",
    gridLine: "#290c0f",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === Act 5 哈洛加斯 ===
  "bloody_foothills": {
    name: "血腥丘陵",
    act: "Act 5",
    theme: "bloody_foothills",
    bg: null,
    tileBase: "#252833",
    gridLine: "#333847",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "arreat_summit": {
    name: "亞瑞特山頂",
    act: "Act 5",
    theme: "arreat_summit",
    bg: null,
    tileBase: "#1b1f29",
    gridLine: "#262b3a",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "worldstone_chamber": {
    name: "世界之石大殿",
    act: "Act 5",
    theme: "worldstone_chamber",
    bg: null,
    tileBase: "#1f0b18",
    gridLine: "#301126",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "secret_cow_level": {
    name: "秘密母牛關卡",
    act: "隱藏",
    theme: "cow_level",
    bg: null,
    tileBase: "#1d3a17",
    gridLine: "#274f1f",
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  }
};

// 舊版地圖 key 相容映射
window.mapData["talking_island"] = window.mapData["blood_moor"];
window.mapData["ti_cave_1f"] = window.mapData["stony_field"];
window.mapData["ti_cave_2f"] = window.mapData["catacombs"];
window.mapData["ti_boss_room"] = window.mapData["catacombs"];
window.mapData["gludio_1f"] = window.mapData["rocky_waste"];
window.mapData["gludio_2f"] = window.mapData["ancient_tunnels"];
window.mapData["gludio_3f"] = window.mapData["tal_rasha_tomb"];
window.mapData["gludio_4f"] = window.mapData["spider_forest"];
window.mapData["gludio_5f"] = window.mapData["travincal"];
window.mapData["giran_1f"] = window.mapData["travincal"];
window.mapData["gludio_6f"] = window.mapData["durance_of_hate"];
window.mapData["giran_4f"] = window.mapData["durance_of_hate"];
window.mapData["gludio_7f"] = window.mapData["chaos_sanctuary"];
window.mapData["ant_nest_1f"] = window.mapData["rocky_waste"];
window.mapData["ant_nest_2f"] = window.mapData["ancient_tunnels"];
window.mapData["werner_village_field"] = window.mapData["spider_forest"];
window.mapData["windwood_desert"] = window.mapData["rocky_waste"];
window.mapData["silver_knight_field"] = window.mapData["bloody_foothills"];
window.mapData["heine_water_dungeon"] = window.mapData["arreat_summit"];
window.mapData["werden_fire_dragon"] = window.mapData["worldstone_chamber"];
