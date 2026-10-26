// js/data_monsters.js - 怪物與獵場地圖資料庫 (含經典變身名單)
window.DB = window.DB || {};

window.DB.maps = {
  "talking_island": {
    "name": "話島東郊果園 (Lv 1~8)",
    "maxMobs": 28,
    "reqLv": 1,
    "monsters": [
      {
        "name": "侏儒",
        "level": 3,
        "hp": 22,
        "ac": 10,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "exp": 12,
        "drops": [
          {
            "item": "金幣",
            "min": 10,
            "max": 25,
            "chance": 0.9
          },
          {
            "item": "侏儒圓盾",
            "chance": 0.05
          },
          {
            "item": "短劍",
            "chance": 0.06
          }
        ]
      },
      {
        "name": "哥布林",
        "level": 4,
        "hp": 28,
        "ac": 9,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "exp": 18,
        "drops": [
          {
            "item": "金幣",
            "min": 12,
            "max": 30,
            "chance": 0.85
          },
          {
            "item": "粗糙皮革",
            "chance": 0.25
          },
          {
            "item": "皮背心",
            "chance": 0.04
          }
        ]
      },
      {
        "name": "妖精狼人",
        "level": 7,
        "hp": 55,
        "ac": 6,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 58,
        "drops": [
          {
            "item": "金幣",
            "min": 25,
            "max": 50,
            "chance": 0.85
          },
          {
            "item": "狼皮",
            "chance": 0.2
          },
          {
            "item": "紅色藥水",
            "count": 2,
            "chance": 0.35
          }
        ]
      }
    ]
  },
  "ti_cave_1f": {
    "name": "話島地監 1F (Lv 8~14)",
    "maxMobs": 28,
    "reqLv": 8,
    "monsters": [
      {
        "name": "史萊姆",
        "level": 6,
        "hp": 45,
        "ac": 8,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "hardSkin": true,
        "exp": 40,
        "drops": [
          {
            "item": "金幣",
            "min": 15,
            "max": 35,
            "chance": 0.9
          },
          {
            "item": "溶解液",
            "chance": 0.15
          }
        ]
      },
      {
        "name": "骷髏",
        "level": 9,
        "hp": 70,
        "ac": 5,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 75,
        "drops": [
          {
            "item": "金幣",
            "min": 30,
            "max": 65,
            "chance": 0.85
          },
          {
            "item": "骷髏頭盔",
            "chance": 0.04
          },
          {
            "item": "骨頭",
            "chance": 0.3
          }
        ]
      },
      {
        "name": "狼人",
        "level": 10,
        "hp": 85,
        "ac": 4,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 95,
        "drops": [
          {
            "item": "金幣",
            "min": 40,
            "max": 80,
            "chance": 0.85
          },
          {
            "item": "澄色藥水",
            "chance": 0.25
          }
        ]
      }
    ]
  },
  "ti_cave_2f": {
    "name": "話島地監 2F (Lv 14~18)",
    "maxMobs": 28,
    "reqLv": 14,
    "monsters": [
      {
        "name": "骷髏斧手",
        "level": 13,
        "hp": 110,
        "ac": 2,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 155,
        "drops": [
          {
            "item": "金幣",
            "min": 50,
            "max": 120,
            "chance": 0.85
          },
          {
            "item": "骷髏盾牌",
            "chance": 0.05
          },
          {
            "item": "闊劍",
            "chance": 0.05
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.03
          }
        ]
      },
      {
        "name": "骷髏弓箭手",
        "level": 14,
        "hp": 95,
        "ac": 3,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 170,
        "drops": [
          {
            "item": "金幣",
            "min": 60,
            "max": 140,
            "chance": 0.85
          },
          {
            "item": "獵人之弓",
            "chance": 0.05
          },
          {
            "item": "箭",
            "count": 100,
            "chance": 0.4
          },
          {
            "item": "銀原石",
            "chance": 0.08
          }
        ]
      },
      {
        "name": "食屍鬼",
        "level": 16,
        "hp": 140,
        "ac": 0,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "poison": true,
        "exp": 230,
        "drops": [
          {
            "item": "金幣",
            "min": 80,
            "max": 150,
            "chance": 0.85
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.03
          }
        ]
      }
    ]
  },
  "ti_boss_room": {
    "name": "話島首領密室 (Lv 35 Boss)",
    "maxMobs": 10,
    "reqLv": 25,
    "isBossMap": true,
    "monsters": [
      {
        "name": "骷髏斧手",
        "level": 13,
        "hp": 110,
        "ac": 2,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 155,
        "drops": [
          {
            "item": "金幣",
            "min": 50,
            "max": 120,
            "chance": 0.85
          }
        ]
      },
      {
        "name": "巴風特",
        "level": 35,
        "hp": 4500,
        "ac": -15,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 3500,
        "drops": [
          {
            "item": "金幣",
            "min": 5000,
            "max": 15000,
            "chance": 1
          },
          {
            "item": "巴風特魔杖",
            "chance": 0.08
          },
          {
            "item": "對武器施法的卷軸",
            "count": 2,
            "chance": 0.5
          },
          {
            "item": "對防具施法的卷軸",
            "count": 2,
            "chance": 0.5
          },
          {
            "item": "魔法書(火球術)",
            "chance": 0.15
          }
        ]
      }
    ]
  },
  "werner_village_field": {
    "name": "燃柳村妖魔森林 (Lv 12~16)",
    "maxMobs": 28,
    "reqLv": 12,
    "monsters": [
      {
        "name": "甘地妖魔",
        "level": 13,
        "hp": 120,
        "ac": 3,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "exp": 170,
        "drops": [
          {
            "item": "金幣",
            "min": 60,
            "max": 200,
            "chance": 0.85
          },
          {
            "item": "妖魔圖騰",
            "chance": 0.5
          }
        ]
      },
      {
        "name": "都達瑪拉妖魔",
        "level": 14,
        "hp": 130,
        "ac": 2,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "poison": true,
        "exp": 197,
        "drops": [
          {
            "item": "金幣",
            "min": 70,
            "max": 240,
            "chance": 0.85
          },
          {
            "item": "妖魔圖騰",
            "chance": 0.5
          },
          {
            "item": "翡翠藥水",
            "chance": 0.2
          }
        ]
      },
      {
        "name": "妖魔鬥士",
        "level": 15,
        "hp": 160,
        "ac": 1,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 226,
        "drops": [
          {
            "item": "金幣",
            "min": 90,
            "max": 300,
            "chance": 0.9
          },
          {
            "item": "妖魔圖騰",
            "chance": 0.5
          },
          {
            "item": "綠色藥水",
            "count": 1,
            "chance": 0.15
          },
          {
            "item": "闊劍",
            "chance": 0.05
          }
        ]
      }
    ]
  },
  "windwood_desert": {
    "name": "風木南部沙漠 (Lv 16~22)",
    "maxMobs": 28,
    "reqLv": 16,
    "monsters": [
      {
        "name": "巨蟻",
        "level": 16,
        "hp": 150,
        "ac": 0,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "exp": 257,
        "drops": [
          {
            "item": "金幣",
            "min": 100,
            "max": 320,
            "chance": 0.9
          },
          {
            "item": "紅色藥水",
            "count": 2,
            "chance": 0.3
          }
        ]
      },
      {
        "name": "蠍子",
        "level": 18,
        "hp": 190,
        "ac": -2,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "poison": true,
        "exp": 325,
        "drops": [
          {
            "item": "金幣",
            "min": 130,
            "max": 400,
            "chance": 0.9
          },
          {
            "item": "翡翠藥水",
            "count": 1,
            "chance": 0.35
          }
        ]
      }
    ]
  },
  "gludio_1f": {
    "name": "古魯丁地監 1F (Lv 18~23)",
    "maxMobs": 28,
    "reqLv": 18,
    "monsters": [
      {
        "name": "殭屍",
        "level": 15,
        "hp": 130,
        "ac": 4,
        "size": "small",
        "aggressive": false,
        "undead": true,
        "hardSkin": true,
        "exp": 210,
        "drops": [
          {
            "item": "金幣",
            "min": 50,
            "max": 160,
            "chance": 0.85
          },
          {
            "item": "鐵塊",
            "chance": 0.2
          }
        ]
      },
      {
        "name": "骷髏槍兵",
        "level": 17,
        "hp": 145,
        "ac": 2,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 260,
        "drops": [
          {
            "item": "金幣",
            "min": 70,
            "max": 200,
            "chance": 0.85
          },
          {
            "item": "骷髏盔甲",
            "chance": 0.04
          }
        ]
      }
    ]
  },
  "gludio_2f": {
    "name": "古魯丁地監 2F (Lv 22~27)",
    "maxMobs": 28,
    "reqLv": 22,
    "monsters": [
      {
        "name": "食屍鬼",
        "level": 21,
        "hp": 210,
        "ac": -1,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "poison": true,
        "exp": 420,
        "drops": [
          {
            "item": "金幣",
            "min": 90,
            "max": 260,
            "chance": 0.85
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.04
          }
        ]
      },
      {
        "name": "骷髏鬥士",
        "level": 23,
        "hp": 230,
        "ac": -2,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 490,
        "drops": [
          {
            "item": "金幣",
            "min": 110,
            "max": 310,
            "chance": 0.85
          },
          {
            "item": "銀原石",
            "chance": 0.15
          },
          {
            "item": "長劍",
            "chance": 0.04
          }
        ]
      },
      {
        "name": "地獄犬",
        "level": 25,
        "hp": 260,
        "ac": -3,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 580,
        "drops": [
          {
            "item": "金幣",
            "min": 130,
            "max": 350,
            "chance": 0.85
          },
          {
            "item": "勇敢藥水",
            "count": 1,
            "chance": 0.2
          }
        ]
      }
    ]
  },
  "gludio_3f": {
    "name": "古魯丁地監 3F (Lv 26~31)",
    "maxMobs": 28,
    "reqLv": 26,
    "monsters": [
      {
        "name": "骷髏警衛",
        "level": 27,
        "hp": 300,
        "ac": -5,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 690,
        "drops": [
          {
            "item": "金幣",
            "min": 150,
            "max": 400,
            "chance": 0.85
          },
          {
            "item": "鎖子甲",
            "chance": 0.03
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.05
          }
        ]
      },
      {
        "name": "歐克法師",
        "level": 28,
        "hp": 260,
        "ac": -2,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 730,
        "drops": [
          {
            "item": "金幣",
            "min": 160,
            "max": 430,
            "chance": 0.85
          },
          {
            "item": "藍色藥水",
            "count": 1,
            "chance": 0.25
          },
          {
            "item": "魔法書(極道落雷)",
            "chance": 0.03
          }
        ]
      },
      {
        "name": "食人妖精",
        "level": 30,
        "hp": 420,
        "ac": -6,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 880,
        "drops": [
          {
            "item": "金幣",
            "min": 200,
            "max": 550,
            "chance": 0.9
          },
          {
            "item": "雙手劍",
            "chance": 0.04
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.05
          }
        ]
      }
    ]
  },
  "gludio_4f": {
    "name": "古魯丁地監 4F 菁英房 (Lv 30~35)",
    "maxMobs": 26,
    "reqLv": 30,
    "monsters": [
      {
        "name": "食人妖精首領",
        "level": 33,
        "hp": 550,
        "ac": -8,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 1100,
        "drops": [
          {
            "item": "金幣",
            "min": 300,
            "max": 800,
            "chance": 0.9
          },
          {
            "item": "雙手劍",
            "chance": 0.06
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.07
          }
        ]
      },
      {
        "name": "骷髏突擊兵",
        "level": 32,
        "hp": 360,
        "ac": -7,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 980,
        "drops": [
          {
            "item": "金幣",
            "min": 250,
            "max": 700,
            "chance": 0.85
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.07
          }
        ]
      },
      {
        "name": "卡斯帕",
        "level": 38,
        "hp": 1800,
        "ac": -18,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 2800,
        "drops": [
          {
            "item": "金幣",
            "min": 3000,
            "max": 8000,
            "chance": 1
          },
          {
            "item": "魔法書(聖結界)",
            "chance": 0.06
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.4
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.4
          }
        ]
      },
      {
        "name": "巴土瑟",
        "level": 38,
        "hp": 1800,
        "ac": -18,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 2800,
        "drops": [
          {
            "item": "金幣",
            "min": 3000,
            "max": 8000,
            "chance": 1
          },
          {
            "item": "魔法書(聖結界)",
            "chance": 0.06
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.4
          }
        ]
      }
    ]
  },
  "gludio_5f": {
    "name": "古魯丁地監 5F (Lv 33~37)",
    "maxMobs": 26,
    "reqLv": 33,
    "monsters": [
      {
        "name": "莫妮亞",
        "level": 34,
        "hp": 410,
        "ac": -8,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1200,
        "drops": [
          {
            "item": "金幣",
            "min": 280,
            "max": 750,
            "chance": 0.85
          },
          {
            "item": "黑寶石",
            "chance": 0.1
          }
        ]
      },
      {
        "name": "黑暗骷髏",
        "level": 36,
        "hp": 460,
        "ac": -10,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 1350,
        "drops": [
          {
            "item": "金幣",
            "min": 320,
            "max": 850,
            "chance": 0.9
          },
          {
            "item": "抗魔法斗篷",
            "chance": 0.04
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.07
          }
        ]
      }
    ]
  },
  "gludio_6f": {
    "name": "古魯丁地監 6F (Lv 36~40)",
    "maxMobs": 24,
    "reqLv": 36,
    "monsters": [
      {
        "name": "深淵魔犬",
        "level": 38,
        "hp": 520,
        "ac": -12,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1550,
        "drops": [
          {
            "item": "金幣",
            "min": 350,
            "max": 950,
            "chance": 0.9
          },
          {
            "item": "綠色藥水",
            "count": 3,
            "chance": 0.4
          }
        ]
      },
      {
        "name": "魔導骷髏",
        "level": 39,
        "hp": 480,
        "ac": -11,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 1650,
        "drops": [
          {
            "item": "金幣",
            "min": 380,
            "max": 1000,
            "chance": 0.9
          },
          {
            "item": "魔法書(高級治癒術)",
            "chance": 0.05
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.08
          }
        ]
      }
    ]
  },
  "gludio_7f": {
    "name": "古監 7F 死騎巢穴 (Lv 40+)",
    "maxMobs": 20,
    "reqLv": 40,
    "isBossMap": true,
    "monsters": [
      {
        "name": "地監死靈戰士",
        "level": 41,
        "hp": 620,
        "ac": -16,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "exp": 1850,
        "drops": [
          {
            "item": "金幣",
            "min": 450,
            "max": 1200,
            "chance": 0.9
          },
          {
            "item": "大馬士革刀",
            "chance": 0.03
          },
          {
            "item": "精靈金屬鎧甲",
            "chance": 0.03
          }
        ]
      },
      {
        "name": "暗黑騎士團衛兵",
        "level": 43,
        "hp": 700,
        "ac": -18,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 2100,
        "drops": [
          {
            "item": "金幣",
            "min": 500,
            "max": 1400,
            "chance": 0.9
          },
          {
            "item": "純銀原石",
            "chance": 0.15
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.08
          }
        ]
      },
      {
        "name": "死亡騎士",
        "level": 55,
        "hp": 18000,
        "ac": -45,
        "size": "small",
        "aggressive": true,
        "undead": true,
        "isBoss": true,
        "exp": 18000,
        "drops": [
          {
            "item": "金幣",
            "min": 25000,
            "max": 70000,
            "chance": 1
          },
          {
            "item": "瑟魯基之劍",
            "chance": 0.15
          },
          {
            "item": "隱身斗篷",
            "chance": 0.08
          },
          {
            "item": "死騎頭盔",
            "chance": 0.05
          },
          {
            "item": "對武器施法的卷軸",
            "count": 3,
            "chance": 0.8
          },
          {
            "item": "對防具施法的卷軸",
            "count": 3,
            "chance": 0.8
          }
        ]
      }
    ]
  },
  "ant_nest_1f": {
    "name": "巨蟻洞穴 1F 群聚層 (Lv 32~37)",
    "maxMobs": 28,
    "reqLv": 32,
    "monsters": [
      {
        "name": "工蟻",
        "level": 30,
        "hp": 310,
        "ac": -3,
        "size": "small",
        "aggressive": false,
        "undead": false,
        "exp": 880,
        "drops": [
          {
            "item": "金幣",
            "min": 180,
            "max": 500,
            "chance": 0.85
          },
          {
            "item": "強化皮革",
            "chance": 0.2
          }
        ]
      },
      {
        "name": "巨蟻",
        "level": 32,
        "hp": 340,
        "ac": -4,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "hardSkin": true,
        "exp": 980,
        "drops": [
          {
            "item": "金幣",
            "min": 220,
            "max": 600,
            "chance": 0.9
          }
        ]
      },
      {
        "name": "兵蟻",
        "level": 35,
        "hp": 430,
        "ac": -8,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1250,
        "drops": [
          {
            "item": "金幣",
            "min": 280,
            "max": 750,
            "chance": 0.9
          },
          {
            "item": "米索莉原石",
            "chance": 0.15
          }
        ]
      }
    ]
  },
  "ant_nest_2f": {
    "name": "巨蟻洞穴 2F 產卵房 (Lv 36~42)",
    "maxMobs": 24,
    "reqLv": 36,
    "isBossMap": true,
    "monsters": [
      {
        "name": "白螞蟻",
        "level": 37,
        "hp": 490,
        "ac": -11,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "hardSkin": true,
        "exp": 1450,
        "drops": [
          {
            "item": "金幣",
            "min": 320,
            "max": 850,
            "chance": 0.9
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.07
          }
        ]
      },
      {
        "name": "巨蟻護衛",
        "level": 40,
        "hp": 600,
        "ac": -15,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 1750,
        "drops": [
          {
            "item": "金幣",
            "min": 400,
            "max": 1050,
            "chance": 0.9
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.07
          }
        ]
      },
      {
        "name": "巨蟻女皇",
        "level": 48,
        "hp": 12000,
        "ac": -35,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 11000,
        "drops": [
          {
            "item": "金幣",
            "min": 12000,
            "max": 40000,
            "chance": 1
          },
          {
            "item": "巨蟻女皇戒指",
            "chance": 0.08
          },
          {
            "item": "對武器施法的卷軸",
            "count": 2,
            "chance": 0.6
          },
          {
            "item": "對防具施法的卷軸",
            "count": 2,
            "chance": 0.6
          }
        ]
      }
    ]
  },
  "giran_1f": {
    "name": "奇岩地監 1F (Lv 40~45)",
    "maxMobs": 28,
    "reqLv": 40,
    "isTimeLimit": true,
    "monsters": [
      {
        "name": "逃亡的死刑犯",
        "level": 41,
        "hp": 580,
        "ac": -12,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1950,
        "drops": [
          {
            "item": "金幣",
            "min": 450,
            "max": 1200,
            "chance": 0.95
          },
          {
            "item": "鎖子甲",
            "chance": 0.05
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.08
          }
        ]
      },
      {
        "name": "貪婪的狂戰士",
        "level": 43,
        "hp": 650,
        "ac": -14,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 2200,
        "drops": [
          {
            "item": "金幣",
            "min": 550,
            "max": 1400,
            "chance": 0.95
          },
          {
            "item": "大馬士革刀",
            "chance": 0.04
          },
          {
            "item": "勇敢藥水",
            "count": 2,
            "chance": 0.3
          }
        ]
      }
    ]
  },
  "giran_4f": {
    "name": "奇岩地監 4F 典獄司 (Lv 52~55)",
    "maxMobs": 20,
    "reqLv": 52,
    "isBossMap": true,
    "isTimeLimit": true,
    "monsters": [
      {
        "name": "暗黑死刑劊子手",
        "level": 52,
        "hp": 1100,
        "ac": -26,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 3800,
        "drops": [
          {
            "item": "金幣",
            "min": 1000,
            "max": 2800,
            "chance": 0.95
          },
          {
            "item": "瑟魯基之劍",
            "chance": 0.05
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.1
          }
        ]
      },
      {
        "name": "監獄典獄長",
        "level": 54,
        "hp": 3200,
        "ac": -32,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 6800,
        "drops": [
          {
            "item": "金幣",
            "min": 5000,
            "max": 15000,
            "chance": 1
          },
          {
            "item": "力量手套",
            "chance": 0.08
          },
          {
            "item": "對武器施法的卷軸",
            "count": 2,
            "chance": 0.6
          }
        ]
      },
      {
        "name": "塞尼斯",
        "level": 60,
        "hp": 25000,
        "ac": -50,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 28000,
        "drops": [
          {
            "item": "金幣",
            "min": 50000,
            "max": 150000,
            "chance": 1
          },
          {
            "item": "魔法書(究極光裂術)",
            "chance": 0.05
          },
          {
            "item": "塞尼斯手套",
            "chance": 0.04
          },
          {
            "item": "對武器施法的卷軸",
            "count": 5,
            "chance": 1
          },
          {
            "item": "對防具施法的卷軸",
            "count": 5,
            "chance": 1
          }
        ]
      }
    ]
  },
  "silver_knight_field": {
    "name": "銀騎士訓練場 (Lv 30~40)",
    "maxMobs": 26,
    "reqLv": 30,
    "monsters": [
      {
        "name": "銀騎士",
        "level": 32,
        "hp": 360,
        "ac": -6,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 950,
        "drops": [
          {
            "item": "金幣",
            "min": 250,
            "max": 700,
            "chance": 0.9
          },
          {
            "item": "銀原石",
            "chance": 0.2
          },
          {
            "item": "銀長劍",
            "chance": 0.04
          }
        ]
      },
      {
        "name": "黑暗精靈",
        "level": 35,
        "hp": 420,
        "ac": -8,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1150,
        "drops": [
          {
            "item": "金幣",
            "min": 300,
            "max": 800,
            "chance": 0.9
          },
          {
            "item": "抗魔法斗篷",
            "chance": 0.04
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.06
          }
        ]
      },
      {
        "name": "銀騎守衛",
        "level": 38,
        "hp": 520,
        "ac": -10,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1400,
        "drops": [
          {
            "item": "金幣",
            "min": 350,
            "max": 900,
            "chance": 0.9
          },
          {
            "item": "力量手套",
            "chance": 0.05
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.06
          }
        ]
      }
    ]
  },
  "heine_water_dungeon": {
    "name": "海音水底地監 (Lv 40~50)",
    "maxMobs": 24,
    "reqLv": 40,
    "monsters": [
      {
        "name": "水元素",
        "level": 40,
        "hp": 600,
        "ac": -12,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 1700,
        "drops": [
          {
            "item": "金幣",
            "min": 400,
            "max": 1000,
            "chance": 0.9
          },
          {
            "item": "藍色藥水",
            "count": 1,
            "chance": 0.25
          }
        ]
      },
      {
        "name": "海龍",
        "level": 45,
        "hp": 900,
        "ac": -16,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 2300,
        "drops": [
          {
            "item": "金幣",
            "min": 600,
            "max": 1500,
            "chance": 0.9
          },
          {
            "item": "瑟魯基之劍",
            "chance": 0.03
          },
          {
            "item": "魔法書(高級治癒術)",
            "chance": 0.05
          }
        ]
      },
      {
        "name": "深海魔獸",
        "level": 48,
        "hp": 1100,
        "ac": -18,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 2800,
        "drops": [
          {
            "item": "金幣",
            "min": 700,
            "max": 1800,
            "chance": 0.9
          },
          {
            "item": "抗魔法斗篷",
            "chance": 0.04
          },
          {
            "item": "對防具施法的卷軸",
            "chance": 0.07
          }
        ]
      }
    ]
  },
  "werden_fire_dragon": {
    "name": "威頓火龍窟 (Lv 50+)",
    "maxMobs": 20,
    "reqLv": 50,
    "isBossMap": true,
    "monsters": [
      {
        "name": "火蜥蜴",
        "level": 50,
        "hp": 1200,
        "ac": -20,
        "size": "small",
        "aggressive": true,
        "undead": false,
        "exp": 3200,
        "drops": [
          {
            "item": "金幣",
            "min": 800,
            "max": 2000,
            "chance": 0.9
          },
          {
            "item": "翡翠藥水",
            "count": 2,
            "chance": 0.3
          }
        ]
      },
      {
        "name": "火焰魔人",
        "level": 55,
        "hp": 1800,
        "ac": -24,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "exp": 4200,
        "drops": [
          {
            "item": "金幣",
            "min": 1000,
            "max": 2500,
            "chance": 0.9
          },
          {
            "item": "力量手套",
            "chance": 0.05
          },
          {
            "item": "對武器施法的卷軸",
            "chance": 0.08
          }
        ]
      },
      {
        "name": "巴拉卡斯",
        "level": 70,
        "hp": 30000,
        "ac": -60,
        "size": "large",
        "aggressive": true,
        "undead": false,
        "isBoss": true,
        "exp": 30000,
        "drops": [
          {
            "item": "金幣",
            "min": 50000,
            "max": 120000,
            "chance": 1
          },
          {
            "item": "瑟魯基之劍",
            "chance": 0.2
          },
          {
            "item": "力量手套",
            "chance": 0.1
          },
          {
            "item": "對武器施法的卷軸",
            "count": 3,
            "chance": 0.9
          },
          {
            "item": "對防具施法的卷軸",
            "count": 3,
            "chance": 0.9
          }
        ]
      }
    ]
  }
};

window.DB.polymorphs = [
  {
    "name": "無變身",
    "reqLv": 1,
    "speedInterval": 1200,
    "type": "通用"
  },
  {
    "name": "骷髏",
    "reqLv": 10,
    "speedInterval": 1050,
    "type": "近戰"
  },
  {
    "name": "妖魔弓箭手",
    "reqLv": 15,
    "speedInterval": 980,
    "type": "遠程弓"
  },
  {
    "name": "死亡騎士",
    "reqLv": 52,
    "speedInterval": 680,
    "type": "近戰極速"
  },
  {
    "name": "黑暗妖精弓箭手",
    "reqLv": 52,
    "speedInterval": 680,
    "type": "遠程極速"
  }
];
