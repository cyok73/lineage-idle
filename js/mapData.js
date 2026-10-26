// js/mapData.js - Map configurations for background rendering and terrain themes
// Keys MUST match the map keys in DB.maps (data_monsters.js)
window.mapData = {
  // === 話島區域 ===
  "talking_island": {
    name: "話島東郊果園",
    theme: "forest",
    bg: "assets/maps/field_bg.jpg",
    tileBase: "#14241b",
    gridLine: "#1f3b2b",
    grassColor: "rgba(34,139,34,0.12)",
    treeDensity: 0.06,
    bounds: { x: 0, y: 0, width: 2000, height: 2000 }
  },
  "ti_cave_1f": {
    name: "話島地監 1F",
    theme: "cave",
    tileBase: "#111418",
    gridLine: "#1c2028",
    wallColor: "rgba(60,60,80,0.15)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1600, height: 1600 }
  },
  "ti_cave_2f": {
    name: "話島地監 2F",
    theme: "cave",
    tileBase: "#0e1115",
    gridLine: "#181c24",
    wallColor: "rgba(50,50,75,0.18)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1600, height: 1600 }
  },
  "ti_boss_room": {
    name: "話島首領密室",
    theme: "boss",
    tileBase: "#1a0a0a",
    gridLine: "#2d1414",
    wallColor: "rgba(120,20,20,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1200, height: 1200 }
  },

  // === 燃柳村區域 ===
  "werner_village_field": {
    name: "燃柳村妖魔森林",
    theme: "dark_forest",
    tileBase: "#101a10",
    gridLine: "#1a2d1a",
    grassColor: "rgba(20,80,20,0.15)",
    treeDensity: 0.1,
    bounds: { x: 0, y: 0, width: 2400, height: 2000 }
  },

  // === 風木沙漠 ===
  "windwood_desert": {
    name: "風木南部沙漠",
    theme: "desert",
    tileBase: "#292117",
    gridLine: "#453825",
    grassColor: "rgba(180,150,80,0.08)",
    treeDensity: 0.02,
    bounds: { x: 0, y: 0, width: 2400, height: 2000 }
  },

  // === 古魯丁地監 ===
  "gludio_1f": {
    name: "古魯丁地監 1F",
    theme: "dungeon",
    tileBase: "#111827",
    gridLine: "#1f2937",
    wallColor: "rgba(40,50,80,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1800, height: 1600 }
  },
  "gludio_2f": {
    name: "古魯丁地監 2F",
    theme: "dungeon",
    tileBase: "#0f1522",
    gridLine: "#1a2535",
    wallColor: "rgba(35,45,75,0.14)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1800, height: 1600 }
  },
  "gludio_3f": {
    name: "古魯丁地監 3F",
    theme: "dungeon",
    tileBase: "#0d1220",
    gridLine: "#182030",
    wallColor: "rgba(30,40,70,0.16)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 1800, height: 1600 }
  },
  "gludio_4f": {
    name: "古魯丁地監 4F",
    theme: "dungeon",
    tileBase: "#0b101d",
    gridLine: "#151e2c",
    wallColor: "rgba(25,35,65,0.18)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2000, height: 1800 }
  },
  "gludio_5f": {
    name: "古魯丁地監 5F",
    theme: "dungeon",
    tileBase: "#090e1a",
    gridLine: "#121c28",
    wallColor: "rgba(20,30,60,0.2)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2000, height: 1800 }
  },
  "gludio_6f": {
    name: "古魯丁地監 6F",
    theme: "dungeon",
    tileBase: "#080c18",
    gridLine: "#101a25",
    wallColor: "rgba(18,25,55,0.22)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2000, height: 1800 }
  },
  "gludio_7f": {
    name: "古監 7F 死騎巢穴",
    theme: "boss",
    tileBase: "#120808",
    gridLine: "#221212",
    wallColor: "rgba(100,15,15,0.15)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2200, height: 2000 }
  },

  // === 巨蟻洞穴 ===
  "ant_nest_1f": {
    name: "巨蟻洞穴 1F",
    theme: "cave",
    tileBase: "#161210",
    gridLine: "#261e18",
    wallColor: "rgba(80,60,40,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2000, height: 1800 }
  },
  "ant_nest_2f": {
    name: "巨蟻洞穴 2F",
    theme: "cave",
    tileBase: "#13100d",
    gridLine: "#221a14",
    wallColor: "rgba(70,50,35,0.15)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2000, height: 1800 }
  },

  // === 奇岩地監 ===
  "giran_1f": {
    name: "奇岩地監 1F",
    theme: "dungeon",
    tileBase: "#101520",
    gridLine: "#1a2535",
    wallColor: "rgba(40,55,90,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2200, height: 2000 }
  },
  "giran_4f": {
    name: "奇岩地監 4F 典獄司",
    theme: "boss",
    tileBase: "#0d0a18",
    gridLine: "#181428",
    wallColor: "rgba(60,30,100,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2200, height: 2000 }
  },

  // === 銀騎士訓練場 ===
  "silver_knight_field": {
    name: "銀騎士訓練場",
    theme: "field",
    bg: "assets/maps/town_bg.jpg",
    tileBase: "#121a14",
    gridLine: "#1e2d20",
    grassColor: "rgba(40,120,50,0.1)",
    treeDensity: 0.04,
    bounds: { x: 0, y: 0, width: 2400, height: 2000 }
  },

  // === 海音水底地監 ===
  "heine_water_dungeon": {
    name: "海音水底地監",
    theme: "water",
    tileBase: "#081820",
    gridLine: "#0e2835",
    wallColor: "rgba(20,80,120,0.12)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2200, height: 2000 }
  },

  // === 威頓火龍窟 ===
  "werden_fire_dragon": {
    name: "威頓火龍窟",
    theme: "fire",
    tileBase: "#271212",
    gridLine: "#451a1a",
    wallColor: "rgba(180,40,20,0.1)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 2200 }
  }
};
