// js/mapData.js - Map configurations for background rendering and terrain themes
// Keys MUST match the map keys in DB.maps (data_monsters.js)
window.mapData = {
  // === 話島區域 ===
  "talking_island": {
    name: "話島東郊果園",
    theme: "forest",
    bg: "assets/maps/field_bg.jpg",
    tileBase: "#224726",
    gridLine: "#2d5e33",
    grassColor: "rgba(46,160,56,0.35)",
    treeDensity: 0.08,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "ti_cave_1f": {
    name: "話島地監 1F",
    theme: "cave",
    tileBase: "#222733",
    gridLine: "#2e3646",
    wallColor: "rgba(70,80,110,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "ti_cave_2f": {
    name: "話島地監 2F",
    theme: "cave",
    tileBase: "#1c212c",
    gridLine: "#283040",
    wallColor: "rgba(65,75,105,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "ti_boss_room": {
    name: "話島首領密室",
    theme: "boss",
    tileBase: "#28151a",
    gridLine: "#3d1e26",
    wallColor: "rgba(160,30,40,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 燃柳村區域 ===
  "werner_village_field": {
    name: "燃柳村妖魔森林",
    theme: "dark_forest",
    tileBase: "#1c2e1f",
    gridLine: "#29452e",
    grassColor: "rgba(30,100,40,0.3)",
    treeDensity: 0.12,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 風木沙漠 ===
  "windwood_desert": {
    name: "風木南部沙漠",
    theme: "desert",
    tileBase: "#6b5437",
    gridLine: "#856945",
    grassColor: "rgba(220,185,110,0.25)",
    treeDensity: 0.02,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 古魯丁地監 ===
  "gludio_1f": {
    name: "古魯丁地監 1F",
    theme: "cave",
    tileBase: "#222733",
    gridLine: "#2e3646",
    wallColor: "rgba(70,80,110,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_2f": {
    name: "古魯丁地監 2F",
    theme: "cave",
    tileBase: "#1f2430",
    gridLine: "#2a3243",
    wallColor: "rgba(65,75,105,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_3f": {
    name: "古魯丁地監 3F",
    theme: "cave",
    tileBase: "#1d212c",
    gridLine: "#272e3d",
    wallColor: "rgba(60,70,100,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_4f": {
    name: "古魯丁地監 4F",
    theme: "dungeon",
    tileBase: "#1b202c",
    gridLine: "#262e3f",
    wallColor: "rgba(55,65,95,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_5f": {
    name: "古魯丁地監 5F",
    theme: "dungeon",
    tileBase: "#191e29",
    gridLine: "#232a3a",
    wallColor: "rgba(50,60,90,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_6f": {
    name: "古魯丁地監 6F",
    theme: "dungeon",
    tileBase: "#171b26",
    gridLine: "#212736",
    wallColor: "rgba(45,55,85,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "gludio_7f": {
    name: "古監 7F 死騎巢穴",
    theme: "boss",
    tileBase: "#2a1418",
    gridLine: "#421d23",
    wallColor: "rgba(180,30,40,0.35)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 巨蟻洞穴 ===
  "ant_nest_1f": {
    name: "巨蟻洞穴 1F",
    theme: "ant_cave",
    tileBase: "#3d2e20",
    gridLine: "#543f2c",
    wallColor: "rgba(120,80,45,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "ant_nest_2f": {
    name: "巨蟻洞穴 2F",
    theme: "ant_cave",
    tileBase: "#37281a",
    gridLine: "#4d3824",
    wallColor: "rgba(110,70,40,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 奇岩地監 ===
  "giran_1f": {
    name: "奇岩地監 1F",
    theme: "dungeon",
    tileBase: "#1c2331",
    gridLine: "#293448",
    wallColor: "rgba(65,80,120,0.3)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },
  "giran_4f": {
    name: "奇岩地監 4F 典獄司",
    theme: "boss",
    tileBase: "#241830",
    gridLine: "#38254b",
    wallColor: "rgba(110,40,150,0.35)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 銀騎士訓練場 ===
  "silver_knight_field": {
    name: "銀騎士訓練場",
    theme: "field",
    bg: "assets/maps/town_bg.jpg",
    tileBase: "#234a26",
    gridLine: "#316435",
    grassColor: "rgba(50,160,60,0.3)",
    treeDensity: 0.06,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 海音水底地監 ===
  "heine_water_dungeon": {
    name: "海音水底地監",
    theme: "water",
    tileBase: "#0e2b3d",
    gridLine: "#15425e",
    wallColor: "rgba(30,110,160,0.35)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  },

  // === 威頓火龍窟 ===
  "werden_fire_dragon": {
    name: "威頓火龍窟",
    theme: "fire",
    tileBase: "#361815",
    gridLine: "#54231e",
    wallColor: "rgba(220,60,30,0.35)",
    treeDensity: 0,
    bounds: { x: 0, y: 0, width: 2400, height: 1600 }
  }
};
