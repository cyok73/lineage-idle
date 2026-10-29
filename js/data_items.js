// js/data_items.js - 裝備、道具、城鎮商店與圖標對應系統
window.DB = window.DB || {};

window.DB.items = {
  "紅色藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 3.5,
    "price": 40,
    "desc": "回復 35~50 點生命值"
  },
  "澄色藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 6,
    "price": 240,
    "desc": "回復 70~90 點生命值"
  },
  "橙色藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 6,
    "price": 240,
    "desc": "回復 70~90 點生命值"
  },
  "白色藥水": {
    "type": "potion",
    "tier": "green",
    "weight": 9,
    "price": 850,
    "desc": "強力白水：回復 140~170 點生命"
  },
  "綠色藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 5,
    "price": 350,
    "desc": "一段攻速加速 (300秒)"
  },
  "勇敢藥水": {
    "type": "potion",
    "tier": "green",
    "weight": 6,
    "price": 1200,
    "desc": "騎士二段狂暴加速 (480秒)"
  },
  "藍色藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 4,
    "price": 600,
    "desc": "精神藥水：提升魔力自然回復率"
  },
  "翡翠藥水": {
    "type": "potion",
    "tier": "white",
    "weight": 3,
    "price": 150,
    "desc": "解除綠色中毒狀態"
  },
  "傳送回家的卷軸": {
    "type": "scroll",
    "tier": "scroll",
    "weight": 1.5,
    "price": 150,
    "desc": "緊急脫離回城"
  },
  "瞬間移動卷軸": {
    "type": "scroll",
    "tier": "scroll",
    "weight": 1.5,
    "price": 350,
    "desc": "隨機瞬間移動脫離戰場"
  },
  "箭": {
    "type": "ammo",
    "tier": "white",
    "weight": 0.03,
    "price": 1,
    "desc": "普通箭矢"
  },
  "銀箭": {
    "type": "ammo",
    "tier": "white",
    "material": "silver",
    "weight": 0.04,
    "price": 3,
    "desc": "銀質箭矢，對不死系追加破邪傷害"
  },
  "對武器施法的卷軸": {
    "type": "enchant_w",
    "tier": "scroll",
    "weight": 2,
    "price": 50000,
    "desc": "強化武器攻擊力 (安定值+6)"
  },
  "對防具施法的卷軸": {
    "type": "enchant_a",
    "tier": "scroll",
    "weight": 2,
    "price": 25000,
    "desc": "強化防具AC額外-1 (安定值+4)"
  },
  "精靈玉": {
    "type": "etc",
    "tier": "white",
    "weight": 0.05,
    "price": 50,
    "desc": "妖精施展專屬精靈魔法的必備自然媒介"
  },
  "魔力之石": {
    "type": "etc",
    "tier": "white",
    "weight": 0.1,
    "price": 100,
    "desc": "法師與高階正統魔法施展的必備魔力結晶"
  },
  "粗糙皮革": {
    "type": "mat",
    "tier": "mat",
    "weight": 0.5,
    "price": 20,
    "desc": "基礎防具鍛造皮革"
  },
  "狼皮": {
    "type": "mat",
    "tier": "mat",
    "weight": 0.8,
    "price": 50,
    "desc": "高級皮革材料"
  },
  "骨頭": {
    "type": "mat",
    "tier": "mat",
    "weight": 1,
    "price": 15,
    "desc": "骷髏系列裝備材料"
  },
  "鐵塊": {
    "type": "mat",
    "tier": "mat",
    "weight": 3,
    "price": 80,
    "desc": "鋼鐵兵器必備材料"
  },
  "銀原石": {
    "type": "mat",
    "tier": "mat",
    "weight": 2,
    "price": 200,
    "desc": "破邪銀質武器核心材料"
  },
  "純銀原石": {
    "type": "mat",
    "tier": "mat",
    "weight": 2.5,
    "price": 500,
    "desc": "純銀高等原石"
  },
  "黑寶石": {
    "type": "mat",
    "tier": "mat",
    "weight": 1,
    "price": 800,
    "desc": "暗黑系列稀有飾品素材"
  },
  "米索莉原石": {
    "type": "mat",
    "tier": "mat",
    "weight": 1.5,
    "price": 600,
    "desc": "精靈神兵核心原石"
  },
  "強化皮革": {
    "type": "mat",
    "tier": "mat",
    "weight": 1.2,
    "price": 250,
    "desc": "巨蟻硬甲皮革"
  },
  "溶解液": {
    "type": "etc",
    "tier": "mat",
    "weight": 1,
    "price": 100,
    "desc": "史萊姆消化黏液"
  },
  "短劍": {
    "type": "weapon",
    "tier": "white",
    "slot": "weapon",
    "small": 8,
    "large": 2,
    "safe": 6,
    "material": "iron",
    "weight": 40,
    "price": 250
  },
  "闊劍": {
    "type": "weapon",
    "tier": "white",
    "slot": "weapon",
    "small": 11,
    "large": 10,
    "safe": 6,
    "material": "iron",
    "weight": 100,
    "price": 800
  },
  "長劍": {
    "type": "weapon",
    "tier": "white",
    "slot": "weapon",
    "small": 10,
    "large": 12,
    "safe": 6,
    "material": "iron",
    "weight": 120,
    "price": 1500
  },
  "銀長劍": {
    "type": "weapon",
    "tier": "green",
    "slot": "weapon",
    "small": 8,
    "large": 12,
    "safe": 6,
    "material": "silver",
    "weight": 60,
    "price": 4000,
    "desc": "銀質不死系剋星"
  },
  "雙手劍": {
    "type": "weapon",
    "tier": "white",
    "slot": "weapon",
    "small": 12,
    "large": 18,
    "safe": 6,
    "material": "iron",
    "weight": 150,
    "price": 5000
  },
  "大馬士革刀": {
    "type": "weapon",
    "tier": "green",
    "slot": "weapon",
    "small": 10,
    "large": 11,
    "safe": 6,
    "material": "iron",
    "cannotDamage": true,
    "weight": 45,
    "price": 25000,
    "desc": "永久不壞刀神兵"
  },
  "瑟魯基之劍": {
    "type": "weapon",
    "tier": "blue",
    "slot": "weapon",
    "small": 16,
    "large": 10,
    "safe": 6,
    "material": "iron",
    "hitBonus": 1,
    "weight": 140,
    "price": 80000,
    "desc": "騎士終極單手神劍"
  },
  "獵人之弓": {
    "type": "weapon",
    "tier": "green",
    "slot": "weapon",
    "weaponType": "bow",
    "small": 3,
    "large": 3,
    "safe": 6,
    "material": "wood",
    "hitBonus": 2,
    "weight": 30,
    "price": 3500
  },
  "十字弓": {
    "type": "weapon",
    "tier": "green",
    "slot": "weapon",
    "weaponType": "bow",
    "small": 3,
    "large": 2,
    "safe": 6,
    "material": "wood",
    "hitBonus": 3,
    "extraDmg": 2,
    "weight": 50,
    "price": 12000
  },
  "皮背心": {
    "type": "armor",
    "tier": "white",
    "slot": "body",
    "ac": -1,
    "safe": 4,
    "weight": 30,
    "price": 150
  },
  "鎖子甲": {
    "type": "armor",
    "tier": "white",
    "slot": "body",
    "ac": -5,
    "safe": 4,
    "weight": 220,
    "price": 3000
  },
  "骷髏盔甲": {
    "type": "armor",
    "tier": "green",
    "slot": "body",
    "ac": -5,
    "safe": 0,
    "weight": 200,
    "price": 9000,
    "desc": "安定值0"
  },
  "精靈金屬鎧甲": {
    "type": "armor",
    "tier": "green",
    "slot": "body",
    "ac": -6,
    "safe": 6,
    "weight": 250,
    "price": 35000,
    "desc": "安定值+6"
  },
  "皮頭盔": {
    "type": "armor",
    "tier": "white",
    "slot": "head",
    "ac": -1,
    "safe": 4,
    "weight": 20,
    "price": 200
  },
  "骷髏頭盔": {
    "type": "armor",
    "tier": "green",
    "slot": "head",
    "ac": -3,
    "safe": 4,
    "weight": 50,
    "price": 5000
  },
  "抗魔法頭盔": {
    "type": "armor",
    "tier": "green",
    "slot": "head",
    "ac": -2,
    "safe": 4,
    "mrBonus": 4,
    "weight": 35,
    "price": 12000
  },
  "死騎頭盔": {
    "type": "armor",
    "tier": "blue",
    "slot": "head",
    "ac": -4,
    "safe": 4,
    "strBonus": 1,
    "weight": 60,
    "price": 150000
  },
  "木盾": {
    "type": "armor",
    "tier": "white",
    "slot": "shield",
    "ac": -1,
    "safe": 4,
    "weight": 30,
    "price": 200
  },
  "侏儒圓盾": {
    "type": "armor",
    "tier": "white",
    "slot": "shield",
    "ac": -1,
    "safe": 4,
    "weight": 40,
    "price": 120
  },
  "骷髏盾牌": {
    "type": "armor",
    "tier": "green",
    "slot": "shield",
    "ac": -3,
    "safe": 4,
    "weight": 80,
    "price": 6000
  },
  "鋼鐵盾牌": {
    "type": "armor",
    "tier": "green",
    "slot": "shield",
    "ac": -3,
    "safe": 4,
    "weight": 100,
    "price": 18000
  },
  "抗魔法斗篷": {
    "type": "armor",
    "tier": "green",
    "slot": "cloak",
    "ac": -1,
    "safe": 4,
    "mrBonus": 10,
    "weight": 20,
    "price": 8000
  },
  "保護者斗篷": {
    "type": "armor",
    "tier": "green",
    "slot": "cloak",
    "ac": -3,
    "safe": 4,
    "weight": 30,
    "price": 15000
  },
  "隱身斗篷": {
    "type": "armor",
    "tier": "red",
    "slot": "cloak",
    "ac": 0,
    "safe": 0,
    "weight": 10,
    "price": 1000000
  },
  "皮手套": {
    "type": "armor",
    "tier": "white",
    "slot": "glove",
    "ac": 0,
    "safe": 4,
    "weight": 10,
    "price": 300
  },
  "腕甲": {
    "type": "armor",
    "tier": "green",
    "slot": "glove",
    "ac": 0,
    "safe": 4,
    "hitBonus": 1,
    "weight": 15,
    "price": 8000,
    "desc": "命中+1"
  },
  "力量手套": {
    "type": "armor",
    "tier": "blue",
    "slot": "glove",
    "ac": 0,
    "safe": 4,
    "strBonus": 2,
    "weight": 18,
    "price": 200000,
    "desc": "力量 STR+2"
  },
  "塞尼斯手套": {
    "type": "armor",
    "tier": "red",
    "slot": "glove",
    "ac": -2,
    "safe": 4,
    "intBonus": 2,
    "weight": 20,
    "price": 800000,
    "desc": "智力 INT+2"
  },
  "皮長靴": {
    "type": "armor",
    "tier": "white",
    "slot": "boots",
    "ac": -2,
    "safe": 4,
    "weight": 25,
    "price": 600
  },
  "鐵高跟靴": {
    "type": "armor",
    "tier": "green",
    "slot": "boots",
    "ac": -3,
    "safe": 4,
    "weight": 50,
    "price": 5000
  },
  "敏捷魔法長靴": {
    "type": "armor",
    "tier": "blue",
    "slot": "boots",
    "ac": -2,
    "safe": 4,
    "dexBonus": 1,
    "weight": 30,
    "price": 80000,
    "desc": "敏捷 DEX+1"
  },
  "力量項鍊": {
    "type": "accessory",
    "tier": "green",
    "slot": "necklace",
    "ac": 0,
    "strBonus": 1,
    "weight": 5,
    "price": 50000,
    "desc": "力量 STR+1"
  },
  "敏捷項鍊": {
    "type": "accessory",
    "tier": "green",
    "slot": "necklace",
    "ac": 0,
    "dexBonus": 1,
    "weight": 5,
    "price": 50000,
    "desc": "敏捷 DEX+1"
  },
  "智力項鍊": {
    "type": "accessory",
    "tier": "green",
    "slot": "necklace",
    "ac": 0,
    "intBonus": 1,
    "weight": 5,
    "price": 50000,
    "desc": "智力 INT+1"
  },
  "骷髏項鍊": {
    "type": "accessory",
    "tier": "green",
    "slot": "necklace",
    "ac": -2,
    "weight": 10,
    "price": 20000,
    "desc": "防禦 AC-2"
  },
  "骷髏耳環": {
    "type": "accessory",
    "tier": "green",
    "slot": "earring",
    "ac": -1,
    "weight": 5,
    "price": 40000,
    "desc": "防禦 AC-1"
  },
  "抗魔戒指": {
    "type": "accessory",
    "tier": "green",
    "slot": "ring",
    "ac": 0,
    "mrBonus": 5,
    "weight": 3,
    "price": 25000,
    "desc": "魔防 MR+5"
  },
  "瞬間移動控制戒指": {
    "type": "accessory",
    "tier": "red",
    "slot": "ring",
    "ac": 0,
    "weight": 5,
    "price": 1500000,
    "desc": "指定傳送戒指"
  },
  "皮腰帶": {
    "type": "accessory",
    "tier": "white",
    "slot": "belt",
    "ac": 0,
    "weight": 10,
    "price": 1000
  },
  "多羅皮帶": {
    "type": "accessory",
    "tier": "green",
    "slot": "belt",
    "ac": 0,
    "weightMultiplier": 1.2,
    "weight": 15,
    "price": 60000,
    "desc": "負重上限+20%"
  },
  "歐吉皮帶": {
    "type": "accessory",
    "tier": "blue",
    "slot": "belt",
    "ac": 0,
    "weightMultiplier": 1.5,
    "weight": 20,
    "price": 450000,
    "desc": "負重上限+50%"
  },
  "棉質T恤": {
    "type": "armor",
    "tier": "white",
    "slot": "tshirt",
    "ac": 0,
    "safe": 4,
    "weight": 5,
    "price": 1000,
    "desc": "初學者棉質內衣"
  },
  "精靈T恤": {
    "type": "armor",
    "tier": "green",
    "slot": "tshirt",
    "ac": -1,
    "safe": 6,
    "weight": 5,
    "price": 30000,
    "desc": "精靈編織內衣，安定值+6"
  },
  "力量符石": {
    "type": "accessory",
    "tier": "green",
    "slot": "rune",
    "ac": 0,
    "strBonus": 1,
    "weight": 2,
    "price": 50000,
    "desc": "刻有巨力印記的古老符石 (STR+1)"
  },
  "敏捷符石": {
    "type": "accessory",
    "tier": "green",
    "slot": "rune",
    "ac": 0,
    "dexBonus": 1,
    "weight": 2,
    "price": 50000,
    "desc": "刻有疾風印記的古老符石 (DEX+1)"
  },

  // ===== 暗黑破壞神經典暗金神裝 (Unique Items) =====
  "喬丹之石 (Stone of Jordan)": {
    "type": "accessory",
    "tier": "unique",
    "slot": "ring1",
    "ac": 0,
    "allSkills": 1,
    "maxMpPercent": 25,
    "mpBonus": 20,
    "weight": 0.5,
    "price": 1500000,
    "desc": "傳奇暗金之戒：+1 全技能等級，最大魔力上限提升 25%，法力+20"
  },
  "軍帽 (Harlequin Crest 諧角之冠)": {
    "type": "armor",
    "tier": "unique",
    "slot": "head",
    "ac": -6,
    "safe": 4,
    "allSkills": 2,
    "hpBonus": 80,
    "mpBonus": 80,
    "mf": 50,
    "damageReduction": 10,
    "weight": 4,
    "price": 3000000,
    "desc": "神級暗金綠帽：+2 全技能，生命法力+80，+50% 尋寶率 (MF)，傷害減免 10%"
  },
  "泰瑞爾之力 (Tyrael's Might)": {
    "type": "armor",
    "tier": "unique",
    "slot": "body",
    "ac": -25,
    "safe": 4,
    "cannotBeFrozen": true,
    "allResist": 30,
    "strBonus": 30,
    "weight": 10,
    "price": 8000000,
    "desc": "大天使神聖戰甲：無法被冰凍，全元素抗性+30%，力量+30，超高防禦"
  },
  "巫師之刺 (Wizardspike)": {
    "type": "weapon",
    "tier": "unique",
    "slot": "weapon",
    "weaponType": "dagger",
    "dmgSmall": 18,
    "dmgLarge": 18,
    "safe": 6,
    "castRate": 50,
    "allResist": 75,
    "maxMpPercent": 15,
    "weight": 3,
    "price": 2500000,
    "desc": "傳奇骨匕：快速施法速度 +50%，全元素抗性 +75%，法力上限 +15%"
  },

  // ===== 暗黑孔位底材裝備 (Socketed Base Items) =====
  "水晶劍 [4孔]": {
    "type": "weapon",
    "tier": "socketed",
    "slot": "weapon",
    "weaponType": "sword",
    "dmgSmall": 14,
    "dmgLarge": 16,
    "safe": 6,
    "sockets": 4,
    "socketedRunes": [],
    "weight": 6,
    "price": 80000,
    "desc": "天然 4 孔底材單手劍 (符文之語精神/眼光絕佳基底)"
  },
  "幻化之刃 [5孔]": {
    "type": "weapon",
    "tier": "socketed",
    "slot": "weapon",
    "weaponType": "sword",
    "dmgSmall": 22,
    "dmgLarge": 24,
    "safe": 6,
    "sockets": 5,
    "socketedRunes": [],
    "weight": 5,
    "price": 350000,
    "desc": "天然 5 孔極速底材劍 (符文之語悔恨 Grief 最強底模)"
  },
  "法師鎧甲 [2孔]": {
    "type": "armor",
    "tier": "socketed",
    "slot": "body",
    "ac": -5,
    "safe": 4,
    "sockets": 2,
    "socketedRunes": [],
    "weight": 7,
    "price": 50000,
    "desc": "天然 2 孔輕便底材胸甲 (符文之語隱密 Stealth 初期神器底材)"
  },
  "執政官鎧甲 [3孔]": {
    "type": "armor",
    "tier": "socketed",
    "slot": "body",
    "ac": -14,
    "safe": 4,
    "sockets": 3,
    "socketedRunes": [],
    "weight": 9,
    "price": 500000,
    "desc": "天然 3 孔高防精英胸甲 (符文之語謎團 Enigma 終極底模)"
  },
  "神聖盔甲 [4孔]": {
    "type": "armor",
    "tier": "socketed",
    "slot": "body",
    "ac": -18,
    "safe": 4,
    "sockets": 4,
    "socketedRunes": [],
    "weight": 14,
    "price": 600000,
    "desc": "天然 4 孔重型板甲 (符文之語剛毅 Fortitude 頂級底材)"
  },
  "統治者大盾 [4孔]": {
    "type": "armor",
    "tier": "socketed",
    "slot": "shield",
    "ac": -8,
    "safe": 4,
    "sockets": 4,
    "socketedRunes": [],
    "weight": 10,
    "price": 300000,
    "desc": "天然 4 孔輕量精英大盾 (全職業精神盾必備底材)"
  },
  "巨神長柄 [4孔]": {
    "type": "weapon",
    "tier": "socketed",
    "slot": "weapon",
    "weaponType": "polearm",
    "dmgSmall": 28,
    "dmgLarge": 36,
    "safe": 6,
    "sockets": 4,
    "socketedRunes": [],
    "weight": 15,
    "price": 450000,
    "desc": "天然 4 孔精英長柄兵器 (傭兵眼光/無限頂級基底)"
  },
  "骨杖 [2孔]": {
    "type": "weapon",
    "tier": "socketed",
    "slot": "weapon",
    "weaponType": "wand",
    "dmgSmall": 10,
    "dmgLarge": 12,
    "safe": 6,
    "sockets": 2,
    "socketedRunes": [],
    "weight": 3,
    "price": 60000,
    "desc": "天然 2 孔死靈白骨手杖 (符文之語白骨 White 必備底模)"
  },

  // ===== 1號 ~ 33號 經典符文 (Diablo Runes) =====
  "1號 艾爾 (El)": { "type": "rune", "tier": "rune", "runeNumber": 1, "weight": 0.1, "price": 1000, "desc": "1號符文：武器命中+50 / 防具防禦+15" },
  "2號 艾德 (Eld)": { "type": "rune", "tier": "rune", "runeNumber": 2, "weight": 0.1, "price": 1500, "desc": "2號符文：武器對不死命中+75% / 防具格擋率+7%" },
  "3號 提爾 (Tir)": { "type": "rune", "tier": "rune", "runeNumber": 3, "weight": 0.1, "price": 2500, "desc": "3號符文：每殺死一名敵人獲得 +2 點法力" },
  "4號 那夫 (Nef)": { "type": "rune", "tier": "rune", "runeNumber": 4, "weight": 0.1, "price": 3500, "desc": "4號符文：武器擊退怪物 / 防具對遠程防禦+30" },
  "5號 愛斯 (Eth)": { "type": "rune", "tier": "rune", "runeNumber": 5, "weight": 0.1, "price": 5000, "desc": "5號符文：武器-25%目標防禦 / 防具法力自然回復+15%" },
  "6號 伊夫 (Ith)": { "type": "rune", "tier": "rune", "runeNumber": 6, "weight": 0.1, "price": 7000, "desc": "6號符文：武器最大傷害+9 / 防具受傷15%轉魔力" },
  "7號 塔爾 (Tal)": { "type": "rune", "tier": "rune", "runeNumber": 7, "weight": 0.1, "price": 10000, "desc": "7號符文：武器+75毒傷 / 防具毒素抗性+35%" },
  "8號 拉爾 (Ral)": { "type": "rune", "tier": "rune", "runeNumber": 8, "weight": 0.1, "price": 15000, "desc": "8號符文：武器+5~30火焰傷害 / 防具火焰抗性+35%" },
  "9號 歐特 (Ort)": { "type": "rune", "tier": "rune", "runeNumber": 9, "weight": 0.1, "price": 20000, "desc": "9號符文：武器+1~50閃電傷害 / 防具閃電抗性+35%" },
  "10號 書爾 (Thul)": { "type": "rune", "tier": "rune", "runeNumber": 10, "weight": 0.1, "price": 25000, "desc": "10號符文：武器+3~14冰冷傷害 / 防具冰冷抗性+35%" },
  "11號 安姆 (Amn)": { "type": "rune", "tier": "rune", "runeNumber": 11, "weight": 0.1, "price": 35000, "desc": "11號符文：武器每次命中偷取 7% 生命 / 防具反彈14物理傷害" },
  "12號 索爾 (Sol)": { "type": "rune", "tier": "rune", "runeNumber": 12, "weight": 0.1, "price": 45000, "desc": "12號符文：武器最小傷害+9 / 防具承受傷害減免 7 點" },
  "13號 夏 (Shael)": { "type": "rune", "tier": "rune", "runeNumber": 13, "weight": 0.1, "price": 60000, "desc": "13號符文：武器攻擊速度+20% / 防具快速打擊恢復+20%" },
  "14號 多爾 (Dol)": { "type": "rune", "tier": "rune", "runeNumber": 14, "weight": 0.1, "price": 80000, "desc": "14號符文：武器使怪物逃跑 / 防具生命回復+7" },
  "15號 海爾 (Hel)": { "type": "rune", "tier": "rune", "runeNumber": 15, "weight": 0.1, "price": 100000, "desc": "15號符文：裝備需求屬性與等級減少 20%" },
  "16號 愛歐 (Io)": { "type": "rune", "tier": "rune", "runeNumber": 16, "weight": 0.1, "price": 120000, "desc": "16號符文：體質/活力 +10" },
  "17號 盧姆 (Lum)": { "type": "rune", "tier": "rune", "runeNumber": 17, "weight": 0.1, "price": 150000, "desc": "17號符文：智力/精力 +10" },
  "18號 科 (Ko)": { "type": "rune", "tier": "rune", "runeNumber": 18, "weight": 0.1, "price": 200000, "desc": "18號符文：敏捷 DEX +10" },
  "19號 法爾 (Fal)": { "type": "rune", "tier": "rune", "runeNumber": 19, "weight": 0.1, "price": 250000, "desc": "19號符文：力量 STR +10" },
  "20號 藍姆 (Lem)": { "type": "rune", "tier": "rune", "runeNumber": 20, "weight": 0.1, "price": 350000, "desc": "20號符文：怪物金幣額外掉落 +75%" },
  "21號 普爾 (Pul)": { "type": "rune", "tier": "rune", "runeNumber": 21, "weight": 0.1, "price": 500000, "desc": "21號符文：武器對惡魔命中+75 / 防具防禦力提升+30%" },
  "22號 烏姆 (Um)": { "type": "rune", "tier": "rune", "runeNumber": 22, "weight": 0.1, "price": 750000, "desc": "22號符文：撕開傷口 25% / 防具全元素抗性+15 (盾牌+22)" },
  "23號 馬爾 (Mal)": { "type": "rune", "tier": "rune", "runeNumber": 23, "weight": 0.1, "price": 1000000, "desc": "23號符文：防止怪物自我治療 / 魔法傷害減少 7 點" },
  "24號 伊斯特 (Ist)": { "type": "rune", "tier": "rune", "runeNumber": 24, "weight": 0.1, "price": 1500000, "desc": "24號符文：尋獲魔法物品機率 (MF) +25%" },
  "25號 古爾 (Gul)": { "type": "rune", "tier": "rune", "runeNumber": 25, "weight": 0.1, "price": 2000000, "desc": "25號符文：攻擊命中率 +20% / 最大毒素抗性+5%" },
  "26號 伐克斯 (Vex)": { "type": "rune", "tier": "rune", "runeNumber": 26, "weight": 0.1, "price": 2800000, "desc": "26號符文：命中偷取 7% 法力 / 最大火焰抗性+5%" },
  "27號 歐姆 (Ohm)": { "type": "rune", "tier": "rune", "runeNumber": 27, "weight": 0.1, "price": 3800000, "desc": "27號符文：增強物理傷害 +50% / 最大冰冷抗性+5%" },
  "28號 羅 (Lo)": { "type": "rune", "tier": "rune", "runeNumber": 28, "weight": 0.1, "price": 5000000, "desc": "28號符文：致命打擊 20% (雙倍傷害) / 最大閃電抗性+5%" },
  "29號 瑟 (Sur)": { "type": "rune", "tier": "rune", "runeNumber": 29, "weight": 0.1, "price": 6500000, "desc": "29號符文：命中致盲目標 / 最大法力上限+5%" },
  "30號 貝 (Ber)": { "type": "rune", "tier": "rune", "runeNumber": 30, "weight": 0.1, "price": 9000000, "desc": "30號符文神符：20% 壓碎打擊 (CB百分比扣血) / 物理傷害減免 8%" },
  "31號 喬 (Jah)": { "type": "rune", "tier": "rune", "runeNumber": 31, "weight": 0.1, "price": 12000000, "desc": "31號符文神符：無視目標防禦力 / 最大生命上限+5%" },
  "32號 查姆 (Cham)": { "type": "rune", "tier": "rune", "runeNumber": 32, "weight": 0.1, "price": 15000000, "desc": "32號符文：命中凍結目標 / 防具無法被冰凍 (Cannot be Frozen)" },
  "33號 薩德 (Zod)": { "type": "rune", "tier": "rune", "runeNumber": 33, "weight": 0.1, "price": 20000000, "desc": "33號至尊神符：永不毀損 (Indestructible)！衝裝失敗絕不爆裝！" }
};

// ===== 經典符文之語配方表 (Runewords) =====
window.DB.runewords = {
  "隱密 (Stealth)": {
    name: "隱密 (Stealth)",
    slot: "body",
    runes: ["7號 塔爾 (Tal)", "5號 愛斯 (Eth)"],
    reqSockets: 2,
    bonus: {
      speed: 2,
      castRate: 25,
      mpRegen: 15,
      ac: -4,
      desc: "跑速大幅加快、快速施法速度+25%、法力自然回復+15%、防禦AC-4"
    }
  },
  "精神 (Spirit)": {
    name: "精神 (Spirit)",
    slot: "weapon|shield",
    runes: ["7號 塔爾 (Tal)", "10號 書爾 (Thul)", "9號 歐特 (Ort)", "11號 安姆 (Amn)"],
    reqSockets: 4,
    bonus: {
      allSkills: 2,
      castRate: 35,
      mpBonus: 90,
      mr: 35,
      ac: -5,
      desc: "+2 所有技能等級、快速施法速度+35%、法力上限+90、魔法防禦+35%、AC-5"
    }
  },
  "眼光 (Insight)": {
    name: "眼光 (Insight)",
    slot: "weapon",
    runes: ["8號 拉爾 (Ral)", "3號 提爾 (Tir)", "7號 塔爾 (Tal)", "12號 索爾 (Sol)"],
    reqSockets: 4,
    bonus: {
      extraDmg: 45,
      hitBonus: 15,
      meditationAura: true,
      desc: "賦予冥想靈氣 (每秒大幅回復全隊法力！)、額外傷害+45、命中+15"
    }
  },
  "白骨 (White)": {
    name: "白骨 (White)",
    slot: "weapon",
    runes: ["14號 多爾 (Dol)", "16號 愛歐 (Io)"],
    reqSockets: 2,
    bonus: {
      necroSkills: 3,
      castRate: 20,
      mpBonus: 50,
      extraDmg: 20,
      desc: "+3 死靈法術技能、快速施法速度+20%、法力+50"
    }
  },
  "悔恨 (Grief)": {
    name: "悔恨 (Grief)",
    slot: "weapon",
    runes: ["5號 愛斯 (Eth)", "3號 提爾 (Tir)", "28號 羅 (Lo)", "23號 馬爾 (Mal)", "8號 拉爾 (Ral)"],
    reqSockets: 5,
    bonus: {
      extraDmg: 150,
      ignoreDefense: true,
      attackSpeed: 40,
      deadlyStrike: 20,
      desc: "近戰天花板神裝！額外物理傷害+150、100%無視目標防禦、攻速+40%、20%致命雙倍打擊"
    }
  },
  "謎團 (Enigma)": {
    name: "謎團 (Enigma)",
    slot: "body",
    runes: ["31號 喬 (Jah)", "6號 伊夫 (Ith)", "30號 貝 (Ber)"],
    reqSockets: 3,
    bonus: {
      allSkills: 2,
      unlockTeleport: true,
      mf: 90,
      damageReduction: 8,
      ac: -16,
      desc: "終極神甲！+2 全技能、全職業解鎖【傳送術】、+90% 尋寶率 (MF)、8% 物理減免、AC-16"
    }
  },
  "無限 (Infinity)": {
    name: "無限 (Infinity)",
    slot: "weapon",
    runes: ["30號 貝 (Ber)", "23號 馬爾 (Mal)", "30號 貝 (Ber)", "24號 伊斯特 (Ist)"],
    reqSockets: 4,
    bonus: {
      convictionAura: true,
      crushingBlow: 40,
      mf: 35,
      extraDmg: 60,
      desc: "破免神器！自帶審判靈氣 (破除敵怪元素抗性並降防85%)、40% 壓碎打擊削血、+35% MF"
    }
  },
  "剛毅 (Fortitude)": {
    name: "剛毅 (Fortitude)",
    slot: "body",
    runes: ["1號 艾爾 (El)", "12號 索爾 (Sol)", "14號 多爾 (Dol)", "28號 羅 (Lo)"],
    reqSockets: 4,
    bonus: {
      extraDmg: 60,
      allResist: 30,
      hpBonus: 120,
      ac: -22,
      desc: "攻守兼備神甲！傷害增幅+60、全元素抗性+30%、生命值+120、防禦AC-22"
    }
  }
};

window.DB.villages = {
  "rogue_encampment": {
    "name": "羅格營地 (Act 1)",
    "shops": [
      {
        "title": "修女・阿卡拉 (藥水與卷軸)",
        "desc": "販售天堂藥水、生命藥水與回城瞬間卷軸",
        "items": [
          "紅色藥水",
          "澄色藥水",
          "藍色藥水",
          "綠色藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸",
          "箭",
          "銀箭"
        ]
      },
      {
        "title": "盲眼鐵匠・恰西 (兵器與孔位底材)",
        "desc": "販售普通武器防具與天然孔位底材",
        "items": [
          "短劍",
          "闊劍",
          "皮背心",
          "水晶劍 [4孔]",
          "法師鎧甲 [2孔]"
        ]
      },
      {
        "title": "賭徒商人・基德 (符文與神裝試煉)",
        "desc": "流通初階符文與對武器防具施法卷軸",
        "items": [
          "1號 艾爾 (El)",
          "2號 艾德 (Eld)",
          "3號 提爾 (Tir)",
          "5號 愛斯 (Eth)",
          "7號 塔爾 (Tal)",
          "8號 拉爾 (Ral)",
          "對武器施法的卷軸",
          "對防具施法的卷軸"
        ]
      }
    ]
  },
  "lut_gholein": {
    "name": "魯高因 (Act 2)",
    "shops": [
      {
        "title": "法師・卓格南 (高階魔力藥劑)",
        "desc": "強效魔力藥劑與沙漠解毒藥劑",
        "items": ["白色藥水", "藍色藥水", "綠色藥水", "勇敢藥水", "傳送回家的卷軸", "瞬間移動卷軸"]
      },
      {
        "title": "鐵匠・法拉 (重甲與長柄兵刃)",
        "desc": "提供巨神長柄孔位與堅固盾甲",
        "items": ["水晶劍 [4孔]", "巨神長柄 [4孔]", "統治者大盾 [4孔]", "對武器施法的卷軸", "對防具施法的卷軸"]
      }
    ]
  },
  "kurast_docks": {
    "name": "庫拉斯特海港 (Act 3)",
    "shops": [
      {
        "title": "奧瑪斯之廬 (神秘藥鋪)",
        "desc": "提供戰鬥所需全套強力藥水與瞬移道具",
        "items": ["白色藥水", "藍色藥水", "勇敢藥水", "瞬間移動卷軸"]
      },
      {
        "title": "鐵匠・赫拉鐵力 (符文鑲嵌)",
        "desc": "販售中階符文與精英孔位胸甲",
        "items": ["執政官鎧甲 [3孔]", "幻化之刃 [5孔]", "骨杖 [2孔]", "對武器施法的卷軸", "對防具施法的卷軸"]
      }
    ]
  },
  "pandemonium_fortress": {
    "name": "群魔堡壘 (Act 4)",
    "shops": [
      {
        "title": "聖堂巫女・賈梅拉",
        "desc": "提供神聖庇護藥水與強效補給",
        "items": ["白色藥水", "勇敢藥水", "傳送回家的卷軸", "瞬間移動卷軸"]
      },
      {
        "title": "神聖鐵砧・海爾布",
        "desc": "神聖盔甲 4 孔與高階武防卷軸",
        "items": ["神聖盔甲 [4孔]", "統治者大盾 [4孔]", "對武器施法的卷軸", "對防具施法的卷軸"]
      }
    ]
  },
  "harrogath": {
    "name": "哈洛加斯 (Act 5)",
    "shops": [
      {
        "title": "長老醫者・瑪拉",
        "desc": "亞瑞特聖山補給站，生命魔力完全回復",
        "items": ["白色藥水", "勇敢藥水", "瞬間移動卷軸", "傳送回家的卷軸"]
      },
      {
        "title": "神匠・拉蘇克",
        "desc": "為英雄提供至尊神兵與防具強化卷軸",
        "items": ["幻化之刃 [5孔]", "執政官鎧甲 [3孔]", "對武器施法的卷軸", "對防具施法的卷軸"]
      }
    ]
  },
};

// ---------------- 經典天堂 1 像素圖標對應系統 ----------------
const ITEM_SPRITE_CONFIG = {
  // ⚔️ 武器 (items: 6x6)
  "短劍": { sheet: "items", c: 2, r: 0 },
  "闊劍": { sheet: "items", c: 1, r: 0 },
  "長劍": { sheet: "items", c: 0, r: 0 },
  "銀長劍": { sheet: "items", c: 0, r: 0 },
  "雙手劍": { sheet: "items", c: 3, r: 0 },
  "大馬士革刀": { sheet: "items", c: 3, r: 0 },
  "瑟魯基之劍": { sheet: "items", c: 1, r: 0 },
  "獵人之弓": { sheet: "items", c: 4, r: 0 },
  "十字弓": { sheet: "items", c: 0, r: 1 },

  // 🏹 箭矢與彈藥
  "箭": { sheet: "items", c: 1, r: 1 },
  "銀箭": { sheet: "items", c: 2, r: 1 },

  // 🛡️ 盔甲防具 (items: 6x6)
  "皮背心": { sheet: "items", c: 3, r: 2 },
  "鎖子甲": { sheet: "items", c: 2, r: 2 },
  "骷髏盔甲": { sheet: "items", c: 4, r: 2 },
  "精靈金屬鎧甲": { sheet: "items", c: 1, r: 2 },
  "棉質T恤": { sheet: "items", c: 5, r: 2 },
  "精靈T恤": { sheet: "items", c: 5, r: 2 },

  // 🪖 頭盔
  "皮頭盔": { sheet: "items", c: 3, r: 3 },
  "骷髏頭盔": { sheet: "acc", c: 3, r: 1 },
  "抗魔法頭盔": { sheet: "items", c: 0, r: 3 },
  "死騎頭盔": { sheet: "items", c: 2, r: 3 },

  // 🛡️ 盾牌
  "木盾": { sheet: "items", c: 5, r: 3 },
  "侏儒圓盾": { sheet: "items", c: 0, r: 4 },
  "骷髏盾牌": { sheet: "items", c: 1, r: 4 },
  "鋼鐵盾牌": { sheet: "items", c: 4, r: 3 },

  // 🥋 斗篷 (專屬高畫質斗篷：紫金抗魔、聖白保護、暗影隱身)
  "抗魔法斗篷": { sheet: "cng", c: 0, r: 0 },
  "保護者斗篷": { sheet: "cng", c: 1, r: 0 },
  "隱身斗篷": { sheet: "cng", c: 2, r: 0 },

  // 🧤 手套與靴子 (專屬高畫質手套：皮手套、力量手套、塞尼斯魔能手套)
  "皮手套": { sheet: "cng", c: 0, r: 1 },
  "腕甲": { sheet: "cng", c: 1, r: 1 },
  "力量手套": { sheet: "cng", c: 3, r: 1 },
  "塞尼斯手套": { sheet: "cng", c: 2, r: 1 },
  "皮長靴": { sheet: "cng", c: 0, r: 2 },
  "鐵高跟靴": { sheet: "cng", c: 1, r: 2 },
  "敏捷魔法長靴": { sheet: "cng", c: 2, r: 2 },

  // 💍 飾品配件 (acc: 6x6)
  "力量項鍊": { sheet: "acc", c: 0, r: 3 },
  "敏捷項鍊": { sheet: "acc", c: 1, r: 3 },
  "智力項鍊": { sheet: "acc", c: 2, r: 3 },
  "骷髏項鍊": { sheet: "acc", c: 3, r: 3 },
  "骷髏耳環": { sheet: "acc", c: 2, r: 4 },
  "抗魔戒指": { sheet: "acc", c: 4, r: 3 },
  "瞬間移動控制戒指": { sheet: "acc", c: 1, r: 4 },
  "皮腰帶": { sheet: "acc", c: 5, r: 3 },
  "多羅皮帶": { sheet: "cng", c: 1, r: 3 },
  "歐吉皮帶": { sheet: "cng", c: 2, r: 3 },
  "力量符石": { sheet: "cng", c: 1, r: 5 },
  "敏捷符石": { sheet: "cng", c: 0, r: 5 },

  // 🧪 藥水與卷軸
  "紅色藥水": { sheet: "items", c: 2, r: 4 },
  "澄色藥水": { sheet: "items", c: 0, r: 5 },
  "橙色藥水": { sheet: "items", c: 0, r: 5 },
  "白色藥水": { sheet: "items", c: 1, r: 5 },
  "綠色藥水": { sheet: "items", c: 4, r: 4 },
  "勇敢藥水": { sheet: "acc", c: 0, r: 0 },
  "藍色藥水": { sheet: "acc", c: 1, r: 0 },
  "翡翠藥水": { sheet: "acc", c: 2, r: 0 },
  "傳送回家的卷軸": { sheet: "items", c: 3, r: 5 },
  "瞬間移動卷軸": { sheet: "items", c: 3, r: 5 },
  "對武器施法的卷軸": { sheet: "items", c: 2, r: 5 },
  "對防具施法的卷軸": { sheet: "items", c: 3, r: 5 },
  "精靈玉": { sheet: "items", c: 4, r: 5 },
  "魔力之石": { sheet: "items", c: 5, r: 5 },

  // 🪵 原料材料 (materials: 5x5)
  "粗糙皮革": { sheet: "mat", c: 4, r: 2 },
  "強化皮革": { sheet: "mat", c: 4, r: 2 },
  "狼皮": { sheet: "mat", c: 3, r: 1 },
  "骨頭": { sheet: "mat", c: 4, r: 1 },
  "鐵塊": { sheet: "mat", c: 0, r: 2 },
  "銀原石": { sheet: "mat", c: 1, r: 2 },
  "純銀原石": { sheet: "mat", c: 1, r: 2 },
  "黑寶石": { sheet: "mat", c: 2, r: 2 },
  "米索莉原石": { sheet: "mat", c: 3, r: 2 },
  "溶解液": { sheet: "mat", c: 0, r: 4 },
  "金幣": { sheet: "mat", c: 2, r: 1 }
};

function getItemIconStyle(itemName) {
  if (!itemName) return "";
  let cleanName = itemName.replace(/^\+\d+\s*/, "").trim();

  let cfg = ITEM_SPRITE_CONFIG[cleanName];

  // 智慧配對暗黑符文、底材與暗金神裝
  if (!cfg) {
    if (cleanName.includes("號") || cleanName.includes("符文")) {
      cfg = { sheet: "mat", c: 1, r: 5 }; // 符文專屬
    } else if (cleanName.includes("喬丹之石")) {
      cfg = { sheet: "acc", c: 4, r: 3 }; // 經典暗金戒指
    } else if (cleanName.includes("軍帽") || cleanName.includes("諧角之冠")) {
      cfg = { sheet: "items", c: 3, r: 3 }; // 經典軍帽
    } else if (cleanName.includes("泰瑞爾之力")) {
      cfg = { sheet: "items", c: 1, r: 2 }; // 天使神聖聖衣
    } else if (cleanName.includes("巫師之刺")) {
      cfg = { sheet: "items", c: 2, r: 0 }; // 骨匕
    } else if (cleanName.includes("水晶劍")) {
      cfg = { sheet: "items", c: 1, r: 0 };
    } else if (cleanName.includes("長柄")) {
      cfg = { sheet: "items", c: 3, r: 0 };
    } else if (cleanName.includes("鎧甲")) {
      cfg = { sheet: "items", c: 2, r: 2 };
    } else if (cleanName.includes("大盾")) {
      cfg = { sheet: "items", c: 4, r: 3 };
    }
  }

  // 預設Fallback
  if (!cfg) {
    cfg = { sheet: "mat", c: 2, r: 1 };
  }

  let sheetUrl = "assets/items/items_spritesheet.jpg";
  let bgSize = "600% 600%";
  let xPct = (cfg.c / 5) * 100;
  let yPct = (cfg.r / 5) * 100;

  if (cfg.sheet === "cng") {
    sheetUrl = "assets/items/cloaks_and_gloves.jpg";
    bgSize = "600% 600%";
    xPct = (cfg.c / 5) * 100;
    yPct = (cfg.r / 5) * 100;
  } else if (cfg.sheet === "acc") {
    sheetUrl = "assets/items/accessories_spritesheet.jpg";
    bgSize = "600% 600%";
    xPct = (cfg.c / 5) * 100;
    yPct = (cfg.r / 5) * 100;
  } else if (cfg.sheet === "mat") {
    sheetUrl = "assets/items/materials_spritesheet.jpg";
    bgSize = "500% 500%";
    xPct = (cfg.c / 4) * 100;
    yPct = (cfg.r / 4) * 100;
  }

  return `background-image: url('${sheetUrl}'); background-size: ${bgSize}; background-position: ${xPct.toFixed(2)}% ${yPct.toFixed(2)}%;`;
}

function getItemIconHtml(itemName, extraClass = "") {
  if (!itemName) return "";
  const style = getItemIconStyle(itemName);
  return `<span class="item-pixel-icon ${extraClass}" style="${style}" title="${itemName}"></span>`;
}


window.ITEM_SPRITE_CONFIG = ITEM_SPRITE_CONFIG;
window.getItemIconStyle = getItemIconStyle;
window.getItemIconHtml = getItemIconHtml;
