// js/data_monsters.js - 暗黑破壞神五大章節怪物與經典首領獵場資料庫
window.DB = window.DB || {};

const D2_BOSS_LIST = ["安達利爾", "督瑞爾", "墨菲斯托", "暗黑破壞神", "巴爾", "母牛之王", "科力克", "塔力克", "馬道克"];
window.BOSS_NAMES = D2_BOSS_LIST;

window.DB.maps = {
  // ========================================================
  // Act 1 羅格營地 (Lv 1 ~ 18)
  // ========================================================
  "blood_moor": {
    name: "鮮血荒地 (Lv 1~6)",
    chapter: "Act 1",
    reqLv: 1,
    maxMobs: 28,
    monsters: [
      {
        name: "沉淪魔",
        level: 2,
        hp: 35,
        ac: 10,
        aggressive: false,
        undead: false,
        exp: 15,
        drops: [
          { item: "金幣", min: 15, max: 40, chance: 0.9 },
          { item: "短劍", chance: 0.08 },
          { item: "紅色藥水", count: 2, chance: 0.35 },
          { item: "1號 艾爾 (El)", chance: 0.05 },
          { item: "2號 艾德 (Eld)", chance: 0.04 }
        ]
      },
      {
        name: "飢餓殭屍",
        level: 4,
        hp: 65,
        ac: 9,
        aggressive: true,
        undead: true,
        exp: 28,
        drops: [
          { item: "金幣", min: 25, max: 60, chance: 0.9 },
          { item: "皮背心", chance: 0.06 },
          { item: "澄色藥水", chance: 0.25 },
          { item: "3號 提爾 (Tir)", chance: 0.04 },
          { item: "對防具施法的卷軸", chance: 0.02 }
        ]
      },
      {
        name: "沉淪魔巫師",
        level: 6,
        hp: 95,
        ac: 8,
        aggressive: true,
        undead: false,
        exp: 48,
        drops: [
          { item: "金幣", min: 40, max: 100, chance: 0.9 },
          { item: "水晶劍 [4孔]", chance: 0.03 },
          { item: "藍色藥水", count: 2, chance: 0.3 },
          { item: "5號 愛斯 (Eth)", chance: 0.04 },
          { item: "7號 塔爾 (Tal)", chance: 0.03 }
        ]
      }
    ]
  },

  "stony_field": {
    name: "石塊曠野 (Lv 6~12)",
    chapter: "Act 1",
    reqLv: 6,
    maxMobs: 30,
    monsters: [
      {
        name: "月亮一族羊頭怪",
        level: 8,
        hp: 130,
        ac: 7,
        aggressive: true,
        undead: false,
        exp: 75,
        drops: [
          { item: "金幣", min: 60, max: 140, chance: 0.9 },
          { item: "紅色藥水", count: 3, chance: 0.4 },
          { item: "法師鎧甲 [2孔]", chance: 0.04 },
          { item: "7號 塔爾 (Tal)", chance: 0.04 },
          { item: "8號 拉爾 (Ral)", chance: 0.03 }
        ]
      },
      {
        name: "骷髏弓箭手",
        level: 10,
        hp: 110,
        ac: 8,
        aggressive: true,
        undead: true,
        exp: 88,
        drops: [
          { item: "金幣", min: 70, max: 160, chance: 0.9 },
          { item: "銀箭", count: 50, chance: 0.5 },
          { item: "瞬間移動卷軸", count: 2, chance: 0.25 },
          { item: "9號 歐特 (Ort)", chance: 0.03 },
          { item: "10號 書爾 (Thul)", chance: 0.02 }
        ]
      },
      {
        name: "利爪蝮蛇",
        level: 12,
        hp: 170,
        ac: 6,
        aggressive: true,
        undead: false,
        exp: 120,
        drops: [
          { item: "金幣", min: 90, max: 200, chance: 0.9 },
          { item: "澄色藥水", count: 3, chance: 0.35 },
          { item: "綠色藥水", chance: 0.2 },
          { item: "11號 安姆 (Amn)", chance: 0.02 },
          { item: "對武器施法的卷軸", chance: 0.03 }
        ]
      }
    ]
  },

  "catacombs": {
    name: "地下墓穴 (Lv 12~18)",
    chapter: "Act 1",
    reqLv: 12,
    maxMobs: 30,
    monsters: [
      {
        name: "拜血者女妖",
        level: 14,
        hp: 220,
        ac: 5,
        aggressive: true,
        undead: false,
        exp: 165,
        drops: [
          { item: "金幣", min: 120, max: 260, chance: 0.9 },
          { item: "澄色藥水", count: 3, chance: 0.4 },
          { item: "12號 索爾 (Sol)", chance: 0.03 },
          { item: "法師鎧甲 [2孔]", chance: 0.04 }
        ]
      },
      {
        name: "黑暗女槍手",
        level: 16,
        hp: 260,
        ac: 4,
        aggressive: true,
        undead: false,
        exp: 210,
        drops: [
          { item: "金幣", min: 150, max: 320, chance: 0.9 },
          { item: "勇敢藥水", chance: 0.25 },
          { item: "水晶劍 [4孔]", chance: 0.04 },
          { item: "對防具施法的卷軸", chance: 0.04 }
        ]
      },
      {
        name: "安達利爾",
        level: 20,
        hp: 2800,
        ac: -2,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 2800,
        drops: [
          { item: "金幣", min: 5000, max: 12000, chance: 1.0 },
          { item: "喬丹之石 (Stone of Jordan)", chance: 0.06 },
          { item: "水晶劍 [4孔]", chance: 0.25 },
          { item: "法師鎧甲 [2孔]", chance: 0.3 },
          { item: "對武器施法的卷軸", count: 2, chance: 0.4 },
          { item: "對防具施法的卷軸", count: 3, chance: 0.5 },
          { item: "12號 索爾 (Sol)", chance: 0.2 },
          { item: "11號 安姆 (Amn)", chance: 0.25 }
        ]
      }
    ]
  },

  // ========================================================
  // Act 2 魯高因沙漠 (Lv 18 ~ 28)
  // ========================================================
  "rocky_waste": {
    name: "碎石荒野 (Lv 18~22)",
    chapter: "Act 2",
    reqLv: 18,
    maxMobs: 30,
    monsters: [
      {
        name: "劍齒貓掠奪者",
        level: 19,
        hp: 310,
        ac: 4,
        aggressive: true,
        undead: false,
        exp: 280,
        drops: [
          { item: "金幣", min: 180, max: 380, chance: 0.9 },
          { item: "澄色藥水", count: 3, chance: 0.4 },
          { item: "巨神長柄 [4孔]", chance: 0.03 },
          { item: "10號 書爾 (Thul)", chance: 0.04 }
        ]
      },
      {
        name: "沙漠沙蟲",
        level: 21,
        hp: 360,
        ac: 3,
        aggressive: true,
        undead: false,
        exp: 330,
        drops: [
          { item: "金幣", min: 200, max: 450, chance: 0.9 },
          { item: "白色藥水", count: 2, chance: 0.3 },
          { item: "13號 夏 (Shael)", chance: 0.03 },
          { item: "對武器施法的卷軸", chance: 0.03 }
        ]
      }
    ]
  },

  "ancient_tunnels": {
    name: "遠古通道 (Lv 22~26)",
    chapter: "Act 2",
    reqLv: 22,
    maxMobs: 30,
    monsters: [
      {
        name: "枯骨木乃伊",
        level: 23,
        hp: 440,
        ac: 2,
        aggressive: true,
        undead: true,
        exp: 420,
        drops: [
          { item: "金幣", min: 250, max: 550, chance: 0.9 },
          { item: "白色藥水", count: 2, chance: 0.35 },
          { item: "統治者大盾 [4孔]", chance: 0.03 },
          { item: "14號 多爾 (Dol)", chance: 0.03 }
        ]
      },
      {
        name: "死雷電金龜",
        level: 25,
        hp: 520,
        ac: 1,
        aggressive: true,
        undead: false,
        exp: 510,
        drops: [
          { item: "金幣", min: 300, max: 680, chance: 0.9 },
          { item: "白色藥水", count: 3, chance: 0.4 },
          { item: "15號 海爾 (Hel)", chance: 0.03 },
          { item: "16號 愛歐 (Io)", chance: 0.02 }
        ]
      }
    ]
  },

  "tal_rasha_tomb": {
    name: "塔拉夏古墓 (Lv 26~28)",
    chapter: "Act 2",
    reqLv: 26,
    maxMobs: 30,
    monsters: [
      {
        name: "燃燒幽靈",
        level: 27,
        hp: 600,
        ac: 0,
        aggressive: true,
        undead: true,
        exp: 650,
        drops: [
          { item: "金幣", min: 400, max: 800, chance: 0.9 },
          { item: "白色藥水", count: 3, chance: 0.4 },
          { item: "巨神長柄 [4孔]", chance: 0.04 },
          { item: "17號 盧姆 (Lum)", chance: 0.02 }
        ]
      },
      {
        name: "督瑞爾",
        level: 30,
        hp: 6500,
        ac: -6,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 6800,
        drops: [
          { item: "金幣", min: 12000, max: 25000, chance: 1.0 },
          { item: "喬丹之石 (Stone of Jordan)", chance: 0.08 },
          { item: "巨神長柄 [4孔]", chance: 0.3 },
          { item: "統治者大盾 [4孔]", chance: 0.3 },
          { item: "17號 盧姆 (Lum)", chance: 0.2 },
          { item: "18號 科 (Ko)", chance: 0.15 },
          { item: "對武器施法的卷軸", count: 3, chance: 0.5 },
          { item: "對防具施法的卷軸", count: 4, chance: 0.6 }
        ]
      }
    ]
  },

  // ========================================================
  // Act 3 庫拉斯特叢林 (Lv 28 ~ 36)
  // ========================================================
  "spider_forest": {
    name: "蜘蛛森林 (Lv 28~31)",
    chapter: "Act 3",
    reqLv: 28,
    maxMobs: 32,
    monsters: [
      {
        name: "叢林小矮人巫師",
        level: 29,
        hp: 720,
        ac: -1,
        aggressive: true,
        undead: false,
        exp: 820,
        drops: [
          { item: "金幣", min: 450, max: 950, chance: 0.9 },
          { item: "白色藥水", count: 3, chance: 0.45 },
          { item: "骨杖 [2孔]", chance: 0.04 },
          { item: "18號 科 (Ko)", chance: 0.03 }
        ]
      },
      {
        name: "巨型毒棘蜘蛛",
        level: 31,
        hp: 850,
        ac: -2,
        aggressive: true,
        undead: false,
        exp: 980,
        drops: [
          { item: "金幣", min: 550, max: 1100, chance: 0.9 },
          { item: "翡翠藥水", count: 2, chance: 0.3 },
          { item: "19號 法爾 (Fal)", chance: 0.02 },
          { item: "20號 藍姆 (Lem)", chance: 0.02 }
        ]
      }
    ]
  },

  "travincal": {
    name: "崔凡克議會 (Lv 31~34)",
    chapter: "Act 3",
    reqLv: 31,
    maxMobs: 32,
    monsters: [
      {
        name: "狂熱狂信徒",
        level: 32,
        hp: 960,
        ac: -3,
        aggressive: true,
        undead: false,
        exp: 1200,
        drops: [
          { item: "金幣", min: 650, max: 1400, chance: 0.9 },
          { item: "白色藥水", count: 3, chance: 0.5 },
          { item: "幻化之刃 [5孔]", chance: 0.03 },
          { item: "21號 普爾 (Pul)", chance: 0.02 }
        ]
      },
      {
        name: "瘸子議會長老",
        level: 34,
        hp: 1250,
        ac: -4,
        aggressive: true,
        undead: false,
        exp: 1600,
        drops: [
          { item: "金幣", min: 900, max: 2000, chance: 0.9 },
          { item: "白色藥水", count: 4, chance: 0.5 },
          { item: "勇敢藥水", count: 2, chance: 0.3 },
          { item: "22號 烏姆 (Um)", chance: 0.02 },
          { item: "23號 馬爾 (Mal)", chance: 0.015 }
        ]
      }
    ]
  },

  "durance_of_hate": {
    name: "憎恨囚牢 (Lv 34~36)",
    chapter: "Act 3",
    reqLv: 34,
    maxMobs: 32,
    monsters: [
      {
        name: "冥河娃娃自爆兵",
        level: 35,
        hp: 1100,
        ac: -3,
        aggressive: true,
        undead: true,
        exp: 1800,
        drops: [
          { item: "金幣", min: 800, max: 1800, chance: 0.9 },
          { item: "執政官鎧甲 [3孔]", chance: 0.03 },
          { item: "23號 馬爾 (Mal)", chance: 0.02 }
        ]
      },
      {
        name: "墨菲斯托",
        level: 38,
        hp: 11000,
        ac: -10,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 13500,
        drops: [
          { item: "金幣", min: 25000, max: 50000, chance: 1.0 },
          { item: "軍帽 (Harlequin Crest 諧角之冠)", chance: 0.08 },
          { item: "巫師之刺 (Wizardspike)", chance: 0.09 },
          { item: "執政官鎧甲 [3孔]", chance: 0.25 },
          { item: "23號 馬爾 (Mal)", chance: 0.2 },
          { item: "24號 伊斯特 (Ist)", chance: 0.15 },
          { item: "對武器施法的卷軸", count: 4, chance: 0.6 },
          { item: "對防具施法的卷軸", count: 5, chance: 0.7 }
        ]
      }
    ]
  },

  // ========================================================
  // Act 4 群魔堡壘 (Lv 36 ~ 45)
  // ========================================================
  "plains_of_despair": {
    name: "神魔平原 (Lv 36~40)",
    chapter: "Act 4",
    reqLv: 36,
    maxMobs: 32,
    monsters: [
      {
        name: "絕望冥火狂犬",
        level: 37,
        hp: 1450,
        ac: -5,
        aggressive: true,
        undead: false,
        exp: 2200,
        drops: [
          { item: "金幣", min: 1100, max: 2400, chance: 0.9 },
          { item: "白色藥水", count: 4, chance: 0.5 },
          { item: "24號 伊斯特 (Ist)", chance: 0.02 },
          { item: "25號 古爾 (Gul)", chance: 0.015 }
        ]
      },
      {
        name: "墮落罪惡熾天使",
        level: 39,
        hp: 1750,
        ac: -6,
        aggressive: true,
        undead: false,
        exp: 2800,
        drops: [
          { item: "金幣", min: 1400, max: 3000, chance: 0.9 },
          { item: "神聖盔甲 [4孔]", chance: 0.03 },
          { item: "26號 伐克斯 (Vex)", chance: 0.015 },
          { item: "27號 歐姆 (Ohm)", chance: 0.01 }
        ]
      }
    ]
  },

  "chaos_sanctuary": {
    name: "混沌避難所 (Lv 40~45)",
    chapter: "Act 4",
    reqLv: 40,
    maxMobs: 35,
    monsters: [
      {
        name: "遺忘末日騎士",
        level: 41,
        hp: 2100,
        ac: -8,
        aggressive: true,
        undead: true,
        exp: 3600,
        drops: [
          { item: "金幣", min: 1800, max: 3800, chance: 0.9 },
          { item: "白色藥水", count: 5, chance: 0.5 },
          { item: "幻化之刃 [5孔]", chance: 0.04 },
          { item: "27號 歐姆 (Ohm)", chance: 0.02 },
          { item: "28號 羅 (Lo)", chance: 0.015 }
        ]
      },
      {
        name: "暗黑破壞神",
        level: 46,
        hp: 18000,
        ac: -14,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 26000,
        drops: [
          { item: "金幣", min: 40000, max: 80000, chance: 1.0 },
          { item: "軍帽 (Harlequin Crest 諧角之冠)", chance: 0.12 },
          { item: "喬丹之石 (Stone of Jordan)", chance: 0.1 },
          { item: "巫師之刺 (Wizardspike)", chance: 0.15 },
          { item: "神聖盔甲 [4孔]", chance: 0.3 },
          { item: "28號 羅 (Lo)", chance: 0.15 },
          { item: "30號 貝 (Ber)", chance: 0.08 },
          { item: "對武器施法的卷軸", count: 5, chance: 0.7 },
          { item: "對防具施法的卷軸", count: 6, chance: 0.8 }
        ]
      }
    ]
  },

  // ========================================================
  // Act 5 哈洛加斯 (Lv 45 ~ 60+)
  // ========================================================
  "bloody_foothills": {
    name: "血腥丘陵 (Lv 45~50)",
    chapter: "Act 5",
    reqLv: 45,
    maxMobs: 35,
    monsters: [
      {
        name: "攻城投石巨獸",
        level: 46,
        hp: 2600,
        ac: -10,
        aggressive: true,
        undead: false,
        exp: 4800,
        drops: [
          { item: "金幣", min: 2500, max: 5500, chance: 0.9 },
          { item: "白色藥水", count: 5, chance: 0.5 },
          { item: "執政官鎧甲 [3孔]", chance: 0.04 },
          { item: "28號 羅 (Lo)", chance: 0.02 },
          { item: "29號 瑟 (Sur)", chance: 0.015 }
        ]
      },
      {
        name: "督軍山克",
        level: 49,
        hp: 5500,
        ac: -12,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 9500,
        drops: [
          { item: "金幣", min: 15000, max: 35000, chance: 1.0 },
          { item: "執政官鎧甲 [3孔]", chance: 0.2 },
          { item: "30號 貝 (Ber)", chance: 0.06 },
          { item: "對武器施法的卷軸", count: 3, chance: 0.5 }
        ]
      }
    ]
  },

  "arreat_summit": {
    name: "亞瑞特山頂 (Lv 50~55)",
    chapter: "Act 5",
    reqLv: 50,
    maxMobs: 20,
    monsters: [
      {
        name: "守護者・科力克",
        level: 52,
        hp: 8500,
        ac: -14,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 15000,
        drops: [
          { item: "金幣", min: 20000, max: 45000, chance: 1.0 },
          { item: "幻化之刃 [5孔]", chance: 0.15 },
          { item: "30號 貝 (Ber)", chance: 0.08 },
          { item: "31號 喬 (Jah)", chance: 0.06 }
        ]
      },
      {
        name: "守護者・塔力克",
        level: 52,
        hp: 8500,
        ac: -14,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 15000,
        drops: [
          { item: "金幣", min: 20000, max: 45000, chance: 1.0 },
          { item: "統治者大盾 [4孔]", chance: 0.15 },
          { item: "31號 喬 (Jah)", chance: 0.07 }
        ]
      },
      {
        name: "守護者・馬道克",
        level: 52,
        hp: 8500,
        ac: -14,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 15000,
        drops: [
          { item: "金幣", min: 20000, max: 45000, chance: 1.0 },
          { item: "神聖盔甲 [4孔]", chance: 0.15 },
          { item: "32號 查姆 (Cham)", chance: 0.05 }
        ]
      }
    ]
  },

  "worldstone_chamber": {
    name: "世界之石大殿 (Lv 55~60+)",
    chapter: "Act 5",
    reqLv: 55,
    maxMobs: 36,
    monsters: [
      {
        name: "毀滅之爪恐懼僕從",
        level: 56,
        hp: 3800,
        ac: -15,
        aggressive: true,
        undead: false,
        exp: 7500,
        drops: [
          { item: "金幣", min: 4000, max: 8800, chance: 0.95 },
          { item: "白色藥水", count: 6, chance: 0.6 },
          { item: "30號 貝 (Ber)", chance: 0.03 },
          { item: "31號 喬 (Jah)", chance: 0.025 }
        ]
      },
      {
        name: "巴爾",
        level: 60,
        hp: 32000,
        ac: -20,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 55000,
        drops: [
          { item: "金幣", min: 80000, max: 200000, chance: 1.0 },
          { item: "泰瑞爾之力 (Tyrael's Might)", chance: 0.08 },
          { item: "軍帽 (Harlequin Crest 諧角之冠)", chance: 0.18 },
          { item: "喬丹之石 (Stone of Jordan)", chance: 0.16 },
          { item: "巫師之刺 (Wizardspike)", chance: 0.2 },
          { item: "33號 薩德 (Zod)", chance: 0.05 },
          { item: "31號 喬 (Jah)", chance: 0.12 },
          { item: "30號 貝 (Ber)", chance: 0.15 },
          { item: "對武器施法的卷軸", count: 8, chance: 0.8 },
          { item: "對防具施法的卷軸", count: 8, chance: 0.9 }
        ]
      }
    ]
  },

  "secret_cow_level": {
    name: "秘密母牛關卡 (Lv 60+ 隱藏)",
    chapter: "Secret",
    reqLv: 60,
    maxMobs: 40,
    monsters: [
      {
        name: "地獄長戟母牛",
        level: 62,
        hp: 4200,
        ac: -16,
        aggressive: true,
        undead: false,
        exp: 9200,
        drops: [
          { item: "金幣", min: 6000, max: 15000, chance: 0.98 },
          { item: "白色藥水", count: 8, chance: 0.7 },
          { item: "幻化之刃 [5孔]", chance: 0.06 },
          { item: "執政官鎧甲 [3孔]", chance: 0.06 },
          { item: "30號 貝 (Ber)", chance: 0.04 },
          { item: "31號 喬 (Jah)", chance: 0.035 },
          { item: "33號 薩德 (Zod)", chance: 0.02 }
        ]
      },
      {
        name: "母牛之王",
        level: 65,
        hp: 40000,
        ac: -22,
        isBoss: true,
        aggressive: true,
        undead: false,
        exp: 80000,
        drops: [
          { item: "金幣", min: 100000, max: 300000, chance: 1.0 },
          { item: "泰瑞爾之力 (Tyrael's Might)", chance: 0.15 },
          { item: "33號 薩德 (Zod)", chance: 0.1 },
          { item: "31號 喬 (Jah)", chance: 0.2 },
          { item: "30號 貝 (Ber)", chance: 0.25 },
          { item: "對武器施法的卷軸", count: 10, chance: 1.0 },
          { item: "對防具施法的卷軸", count: 10, chance: 1.0 }
        ]
      }
    ]
  }
};

// 舊版地圖相容映射（保證舊角色存檔不會發生 undefined 地圖錯誤）
window.DB.maps["talking_island"] = window.DB.maps["blood_moor"];
window.DB.maps["ti_cave_1f"] = window.DB.maps["stony_field"];
window.DB.maps["ti_cave_2f"] = window.DB.maps["catacombs"];
window.DB.maps["ti_boss_room"] = window.DB.maps["catacombs"];
window.DB.maps["gludio_1f"] = window.DB.maps["rocky_waste"];
window.DB.maps["gludio_2f"] = window.DB.maps["ancient_tunnels"];
window.DB.maps["gludio_3f"] = window.DB.maps["tal_rasha_tomb"];
window.DB.maps["gludio_4f"] = window.DB.maps["spider_forest"];
window.DB.maps["gludio_5f"] = window.DB.maps["travincal"];
window.DB.maps["gludio_6f"] = window.DB.maps["durance_of_hate"];
window.DB.maps["gludio_7f"] = window.DB.maps["chaos_sanctuary"];
window.DB.maps["ant_nest_1f"] = window.DB.maps["rocky_waste"];
window.DB.maps["ant_nest_2f"] = window.DB.maps["ancient_tunnels"];
window.DB.maps["werner_village_field"] = window.DB.maps["spider_forest"];
window.DB.maps["windwood_desert"] = window.DB.maps["rocky_waste"];
window.DB.maps["giran_1f"] = window.DB.maps["travincal"];
window.DB.maps["giran_4f"] = window.DB.maps["durance_of_hate"];
window.DB.maps["silver_knight_field"] = window.DB.maps["bloody_foothills"];
window.DB.maps["heine_water_dungeon"] = window.DB.maps["arreat_summit"];
window.DB.maps["werden_fire_dragon"] = window.DB.maps["worldstone_chamber"];

window.DB.polymorphs = [
  { name: "無變身 (冒險本體)", reqLv: 1, speedInterval: 1200, type: "通用" },
  { name: "狂暴骷髏戰士", reqLv: 10, speedInterval: 1050, type: "近戰" },
  { name: "暗夜蘿格弓手", reqLv: 15, speedInterval: 980, type: "遠程弓" },
  { name: "黑煞末日騎士", reqLv: 45, speedInterval: 750, type: "全能" },
  { name: "暗黑毀滅化身", reqLv: 52, speedInterval: 620, type: "極速割草" }
];
