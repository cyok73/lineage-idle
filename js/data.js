// js/data.js - 《亞丁之息》規格書 Master v3.1 完整地圖、怪物、11 大裝備欄位與城鎮商店資料庫
const DB = {
  maps: {
    // 7.1 說話之島
    talking_island: {
      name: "話島東郊果園 (Lv 1~8)", maxMobs: 28, reqLv: 1,
      monsters: [
        { name: "侏儒", level: 3, hp: 22, ac: 10, size: "small", aggressive: false, undead: false, exp: 12, drops: [{ item: "金幣", min: 10, max: 25, chance: 0.9 }, { item: "侏儒圓盾", chance: 0.05 }, { item: "短劍", chance: 0.06 }] },
        { name: "哥布林", level: 4, hp: 28, ac: 9, size: "small", aggressive: false, undead: false, exp: 18, drops: [{ item: "金幣", min: 12, max: 30, chance: 0.85 }, { item: "粗糙皮革", chance: 0.25 }, { item: "皮背心", chance: 0.04 }] },
        { name: "妖精狼人", level: 7, hp: 55, ac: 6, size: "small", aggressive: true, undead: false, exp: 58, drops: [{ item: "金幣", min: 25, max: 50, chance: 0.85 }, { item: "狼皮", chance: 0.2 }, { item: "紅色藥水", count: 2, chance: 0.35 }] }
      ]
    },
    ti_cave_1f: {
      name: "話島地監 1F (Lv 8~14)", maxMobs: 28, reqLv: 8,
      monsters: [
        { name: "史萊姆", level: 6, hp: 45, ac: 8, size: "small", aggressive: false, undead: false, hardSkin: true, exp: 40, drops: [{ item: "金幣", min: 15, max: 35, chance: 0.9 }, { item: "溶解液", chance: 0.15 }] },
        { name: "骷髏", level: 9, hp: 70, ac: 5, size: "small", aggressive: true, undead: true, exp: 75, drops: [{ item: "金幣", min: 30, max: 65, chance: 0.85 }, { item: "骷髏頭盔", chance: 0.04 }, { item: "骨頭", chance: 0.3 }] },
        { name: "狼人", level: 10, hp: 85, ac: 4, size: "small", aggressive: true, undead: false, exp: 95, drops: [{ item: "金幣", min: 40, max: 80, chance: 0.85 }, { item: "澄色藥水", chance: 0.25 }] }
      ]
    },
    ti_cave_2f: {
      name: "話島地監 2F (Lv 14~18)", maxMobs: 28, reqLv: 14,
      monsters: [
        { name: "骷髏斧手", level: 13, hp: 110, ac: 2, size: "small", aggressive: true, undead: true, exp: 155, drops: [{ item: "金幣", min: 50, max: 120, chance: 0.85 }, { item: "骷髏盾牌", chance: 0.05 }, { item: "闊劍", chance: 0.05 }, { item: "對防具施法的卷軸", chance: 0.03 }] },
        { name: "骷髏弓箭手", level: 14, hp: 95, ac: 3, size: "small", aggressive: true, undead: true, exp: 170, drops: [{ item: "金幣", min: 60, max: 140, chance: 0.85 }, { item: "獵人之弓", chance: 0.05 }, { item: "箭", count: 100, chance: 0.4 }, { item: "銀原石", chance: 0.08 }] },
        { name: "食屍鬼", level: 16, hp: 140, ac: 0, size: "small", aggressive: true, undead: true, poison: true, exp: 230, drops: [{ item: "金幣", min: 80, max: 150, chance: 0.85 }, { item: "對武器施法的卷軸", chance: 0.03 }] }
      ]
    },
    ti_boss_room: {
      name: "話島首領密室 (Lv 35 Boss)", maxMobs: 10, reqLv: 25, isBossMap: true,
      monsters: [
        { name: "骷髏斧手", level: 13, hp: 110, ac: 2, size: "small", aggressive: true, undead: true, exp: 155, drops: [{ item: "金幣", min: 50, max: 120, chance: 0.85 }] },
        { name: "巴風特", level: 35, hp: 4500, ac: -15, size: "large", aggressive: true, undead: false, isBoss: true, exp: 3500, drops: [{ item: "金幣", min: 5000, max: 15000, chance: 1.0 }, { item: "巴風特魔杖", chance: 0.08 }, { item: "對武器施法的卷軸", count: 2, chance: 0.5 }, { item: "對防具施法的卷軸", count: 2, chance: 0.5 }, { item: "魔法書(火球術)", chance: 0.15 }] }
      ]
    },

    // 燃柳村妖魔森林
    werner_village_field: {
      name: "燃柳村妖魔森林 (Lv 12~16)", maxMobs: 28, reqLv: 12,
      monsters: [
        { name: "甘地妖魔", level: 13, hp: 120, ac: 3, size: "small", aggressive: false, undead: false, exp: 170, drops: [{ item: "金幣", min: 60, max: 200, chance: 0.85 }, { item: "妖魔圖騰", chance: 0.5 }] },
        { name: "都達瑪拉妖魔", level: 14, hp: 130, ac: 2, size: "small", aggressive: true, undead: false, poison: true, exp: 197, drops: [{ item: "金幣", min: 70, max: 240, chance: 0.85 }, { item: "妖魔圖騰", chance: 0.5 }, { item: "翡翠藥水", chance: 0.2 }] },
        { name: "妖魔鬥士", level: 15, hp: 160, ac: 1, size: "small", aggressive: true, undead: false, exp: 226, drops: [{ item: "金幣", min: 90, max: 300, chance: 0.9 }, { item: "妖魔圖騰", chance: 0.5 }, { item: "綠色藥水", count: 1, chance: 0.15 }, { item: "闊劍", chance: 0.05 }] }
      ]
    },

    // 風木沙漠
    windwood_desert: {
      name: "風木南部沙漠 (Lv 16~22)", maxMobs: 28, reqLv: 16,
      monsters: [
        { name: "巨蟻", level: 16, hp: 150, ac: 0, size: "small", aggressive: false, undead: false, exp: 257, drops: [{ item: "金幣", min: 100, max: 320, chance: 0.9 }, { item: "紅色藥水", count: 2, chance: 0.3 }] },
        { name: "蠍子", level: 18, hp: 190, ac: -2, size: "small", aggressive: true, undead: false, poison: true, exp: 325, drops: [{ item: "金幣", min: 130, max: 400, chance: 0.9 }, { item: "翡翠藥水", count: 1, chance: 0.35 }] }
      ]
    },

    // 7.2 古魯丁地監
    gludio_1f: {
      name: "古魯丁地監 1F (Lv 18~23)", maxMobs: 28, reqLv: 18,
      monsters: [
        { name: "殭屍", level: 15, hp: 130, ac: 4, size: "small", aggressive: false, undead: true, hardSkin: true, exp: 210, drops: [{ item: "金幣", min: 50, max: 160, chance: 0.85 }, { item: "鐵塊", chance: 0.2 }] },
        { name: "骷髏槍兵", level: 17, hp: 145, ac: 2, size: "small", aggressive: true, undead: true, exp: 260, drops: [{ item: "金幣", min: 70, max: 200, chance: 0.85 }, { item: "骷髏盔甲", chance: 0.04 }] }
      ]
    },
    gludio_2f: {
      name: "古魯丁地監 2F (Lv 22~27)", maxMobs: 28, reqLv: 22,
      monsters: [
        { name: "食屍鬼", level: 21, hp: 210, ac: -1, size: "small", aggressive: true, undead: true, poison: true, exp: 420, drops: [{ item: "金幣", min: 90, max: 260, chance: 0.85 }, { item: "對防具施法的卷軸", chance: 0.04 }] },
        { name: "骷髏鬥士", level: 23, hp: 230, ac: -2, size: "small", aggressive: true, undead: true, exp: 490, drops: [{ item: "金幣", min: 110, max: 310, chance: 0.85 }, { item: "銀原石", chance: 0.15 }, { item: "長劍", chance: 0.04 }] },
        { name: "地獄犬", level: 25, hp: 260, ac: -3, size: "small", aggressive: true, undead: false, exp: 580, drops: [{ item: "金幣", min: 130, max: 350, chance: 0.85 }, { item: "勇敢藥水", count: 1, chance: 0.2 }] }
      ]
    },
    gludio_3f: {
      name: "古魯丁地監 3F (Lv 26~31)", maxMobs: 28, reqLv: 26,
      monsters: [
        { name: "骷髏警衛", level: 27, hp: 300, ac: -5, size: "small", aggressive: true, undead: true, exp: 690, drops: [{ item: "金幣", min: 150, max: 400, chance: 0.85 }, { item: "鎖子甲", chance: 0.03 }, { item: "對防具施法的卷軸", chance: 0.05 }] },
        { name: "歐克法師", level: 28, hp: 260, ac: -2, size: "small", aggressive: true, undead: false, exp: 730, drops: [{ item: "金幣", min: 160, max: 430, chance: 0.85 }, { item: "藍色藥水", count: 1, chance: 0.25 }, { item: "魔法書(極道落雷)", chance: 0.03 }] },
        { name: "食人妖精", level: 30, hp: 420, ac: -6, size: "large", aggressive: true, undead: false, exp: 880, drops: [{ item: "金幣", min: 200, max: 550, chance: 0.9 }, { item: "雙手劍", chance: 0.04 }, { item: "對武器施法的卷軸", chance: 0.05 }] }
      ]
    },
    gludio_4f: {
      name: "古魯丁地監 4F 菁英房 (Lv 30~35)", maxMobs: 26, reqLv: 30,
      monsters: [
        { name: "食人妖精首領", level: 33, hp: 550, ac: -8, size: "large", aggressive: true, undead: false, exp: 1100, drops: [{ item: "金幣", min: 300, max: 800, chance: 0.9 }, { item: "雙手劍", chance: 0.06 }, { item: "對武器施法的卷軸", chance: 0.07 }] },
        { name: "骷髏突擊兵", level: 32, hp: 360, ac: -7, size: "small", aggressive: true, undead: true, exp: 980, drops: [{ item: "金幣", min: 250, max: 700, chance: 0.85 }, { item: "對防具施法的卷軸", chance: 0.07 }] },
        { name: "卡斯帕", level: 38, hp: 1800, ac: -18, size: "small", aggressive: true, undead: false, isBoss: true, exp: 2800, drops: [{ item: "金幣", min: 3000, max: 8000, chance: 1.0 }, { item: "魔法書(聖結界)", chance: 0.06 }, { item: "對武器施法的卷軸", chance: 0.4 }, { item: "對防具施法的卷軸", chance: 0.4 }] },
        { name: "巴土瑟", level: 38, hp: 1800, ac: -18, size: "small", aggressive: true, undead: false, isBoss: true, exp: 2800, drops: [{ item: "金幣", min: 3000, max: 8000, chance: 1.0 }, { item: "魔法書(聖結界)", chance: 0.06 }, { item: "對武器施法的卷軸", chance: 0.4 }] }
      ]
    },
    gludio_5f: {
      name: "古魯丁地監 5F (Lv 33~37)", maxMobs: 26, reqLv: 33,
      monsters: [
        { name: "莫妮亞", level: 34, hp: 410, ac: -8, size: "small", aggressive: true, undead: false, exp: 1200, drops: [{ item: "金幣", min: 280, max: 750, chance: 0.85 }, { item: "黑寶石", chance: 0.1 }] },
        { name: "黑暗骷髏", level: 36, hp: 460, ac: -10, size: "small", aggressive: true, undead: true, exp: 1350, drops: [{ item: "金幣", min: 320, max: 850, chance: 0.9 }, { item: "抗魔法斗篷", chance: 0.04 }, { item: "對武器施法的卷軸", chance: 0.07 }] }
      ]
    },
    gludio_6f: {
      name: "古魯丁地監 6F (Lv 36~40)", maxMobs: 24, reqLv: 36,
      monsters: [
        { name: "深淵魔犬", level: 38, hp: 520, ac: -12, size: "small", aggressive: true, undead: false, exp: 1550, drops: [{ item: "金幣", min: 350, max: 950, chance: 0.9 }, { item: "綠色藥水", count: 3, chance: 0.4 }] },
        { name: "魔導骷髏", level: 39, hp: 480, ac: -11, size: "small", aggressive: true, undead: true, exp: 1650, drops: [{ item: "金幣", min: 380, max: 1000, chance: 0.9 }, { item: "魔法書(高級治癒術)", chance: 0.05 }, { item: "對防具施法的卷軸", chance: 0.08 }] }
      ]
    },
    gludio_7f: {
      name: "古監 7F 死騎巢穴 (Lv 40+)", maxMobs: 20, reqLv: 40, isBossMap: true,
      monsters: [
        { name: "地監死靈戰士", level: 41, hp: 620, ac: -16, size: "small", aggressive: true, undead: true, exp: 1850, drops: [{ item: "金幣", min: 450, max: 1200, chance: 0.9 }, { item: "大馬士革刀", chance: 0.03 }, { item: "精靈金屬鎧甲", chance: 0.03 }] },
        { name: "暗黑騎士團衛兵", level: 43, hp: 700, ac: -18, size: "small", aggressive: true, undead: false, exp: 2100, drops: [{ item: "金幣", min: 500, max: 1400, chance: 0.9 }, { item: "純銀原石", chance: 0.15 }, { item: "對防具施法的卷軸", chance: 0.08 }] },
        { name: "死亡騎士", level: 55, hp: 18000, ac: -45, size: "small", aggressive: true, undead: true, isBoss: true, exp: 18000, drops: [{ item: "金幣", min: 25000, max: 70000, chance: 1.0 }, { item: "瑟魯基之劍", chance: 0.15 }, { item: "隱身斗篷", chance: 0.08 }, { item: "死騎頭盔", chance: 0.05 }, { item: "對武器施法的卷軸", count: 3, chance: 0.8 }, { item: "對防具施法的卷軸", count: 3, chance: 0.8 }] }
      ]
    },

    // 7.3 巨蟻洞穴
    ant_nest_1f: {
      name: "巨蟻洞穴 1F 群聚層 (Lv 32~37)", maxMobs: 28, reqLv: 32,
      monsters: [
        { name: "工蟻", level: 30, hp: 310, ac: -3, size: "small", aggressive: false, undead: false, exp: 880, drops: [{ item: "金幣", min: 180, max: 500, chance: 0.85 }, { item: "強化皮革", chance: 0.2 }] },
        { name: "巨蟻", level: 32, hp: 340, ac: -4, size: "small", aggressive: true, undead: false, hardSkin: true, exp: 980, drops: [{ item: "金幣", min: 220, max: 600, chance: 0.9 }] },
        { name: "兵蟻", level: 35, hp: 430, ac: -8, size: "small", aggressive: true, undead: false, exp: 1250, drops: [{ item: "金幣", min: 280, max: 750, chance: 0.9 }, { item: "米索莉原石", chance: 0.15 }] }
      ]
    },
    ant_nest_2f: {
      name: "巨蟻洞穴 2F 產卵房 (Lv 36~42)", maxMobs: 24, reqLv: 36, isBossMap: true,
      monsters: [
        { name: "白螞蟻", level: 37, hp: 490, ac: -11, size: "small", aggressive: true, undead: false, hardSkin: true, exp: 1450, drops: [{ item: "金幣", min: 320, max: 850, chance: 0.9 }, { item: "對防具施法的卷軸", chance: 0.07 }] },
        { name: "巨蟻護衛", level: 40, hp: 600, ac: -15, size: "large", aggressive: true, undead: false, exp: 1750, drops: [{ item: "金幣", min: 400, max: 1050, chance: 0.9 }, { item: "對武器施法的卷軸", chance: 0.07 }] },
        { name: "巨蟻女皇", level: 48, hp: 12000, ac: -35, size: "large", aggressive: true, undead: false, isBoss: true, exp: 11000, drops: [{ item: "金幣", min: 12000, max: 40000, chance: 1.0 }, { item: "巨蟻女皇戒指", chance: 0.08 }, { item: "對武器施法的卷軸", count: 2, chance: 0.6 }, { item: "對防具施法的卷軸", count: 2, chance: 0.6 }] }
      ]
    },

    // 7.4 奇岩地監
    giran_1f: {
      name: "奇岩地監 1F (Lv 40~45)", maxMobs: 28, reqLv: 40, isTimeLimit: true,
      monsters: [
        { name: "逃亡的死刑犯", level: 41, hp: 580, ac: -12, size: "small", aggressive: true, undead: false, exp: 1950, drops: [{ item: "金幣", min: 450, max: 1200, chance: 0.95 }, { item: "鎖子甲", chance: 0.05 }, { item: "對武器施法的卷軸", chance: 0.08 }] },
        { name: "貪婪的狂戰士", level: 43, hp: 650, ac: -14, size: "small", aggressive: true, undead: false, exp: 2200, drops: [{ item: "金幣", min: 550, max: 1400, chance: 0.95 }, { item: "大馬士革刀", chance: 0.04 }, { item: "勇敢藥水", count: 2, chance: 0.3 }] }
      ]
    },
    giran_4f: {
      name: "奇岩地監 4F 典獄司 (Lv 52~55)", maxMobs: 20, reqLv: 52, isBossMap: true, isTimeLimit: true,
      monsters: [
        { name: "暗黑死刑劊子手", level: 52, hp: 1100, ac: -26, size: "large", aggressive: true, undead: false, exp: 3800, drops: [{ item: "金幣", min: 1000, max: 2800, chance: 0.95 }, { item: "瑟魯基之劍", chance: 0.05 }, { item: "對防具施法的卷軸", chance: 0.1 }] },
        { name: "監獄典獄長", level: 54, hp: 3200, ac: -32, size: "large", aggressive: true, undead: false, isBoss: true, exp: 6800, drops: [{ item: "金幣", min: 5000, max: 15000, chance: 1.0 }, { item: "力量手套", chance: 0.08 }, { item: "對武器施法的卷軸", count: 2, chance: 0.6 }] },
        { name: "塞尼斯", level: 60, hp: 25000, ac: -50, size: "small", aggressive: true, undead: false, isBoss: true, exp: 28000, drops: [{ item: "金幣", min: 50000, max: 150000, chance: 1.0 }, { item: "魔法書(究極光裂術)", chance: 0.05 }, { item: "塞尼斯手套", chance: 0.04 }, { item: "對武器施法的卷軸", count: 5, chance: 1.0 }, { item: "對防具施法的卷軸", count: 5, chance: 1.0 }] }
      ]
    }
  },

  // 11 大裝備部位與完整道具資料庫 (確保全包在 items 物件內，絕無外部游離冒號)
  items: {
    // --- 消耗品 ---
    "紅色藥水": { type: "potion", tier: "white", weight: 3.5, price: 40, desc: "回復 35~50 點生命值" },
    "澄色藥水": { type: "potion", tier: "white", weight: 6.0, price: 240, desc: "回復 70~90 點生命值" },
    "橙色藥水": { type: "potion", tier: "white", weight: 6.0, price: 240, desc: "回復 70~90 點生命值" },
    "白色藥水": { type: "potion", tier: "green", weight: 9.0, price: 850, desc: "強力白水：回復 140~170 點生命" },
    "綠色藥水": { type: "potion", tier: "white", weight: 5.0, price: 350, desc: "一段攻速加速 (300秒)" },
    "勇敢藥水": { type: "potion", tier: "green", weight: 6.0, price: 1200, desc: "騎士二段狂暴加速 (480秒)" },
    "藍色藥水": { type: "potion", tier: "white", weight: 4.0, price: 600, desc: "精神藥水：提升魔力自然回復率" },
    "翡翠藥水": { type: "potion", tier: "white", weight: 3.0, price: 150, desc: "解除綠色中毒狀態" },
    "傳送回家的卷軸": { type: "scroll", tier: "scroll", weight: 1.5, price: 150, desc: "緊急脫離回城" },
    "瞬間移動卷軸": { type: "scroll", tier: "scroll", weight: 1.5, price: 350, desc: "隨機瞬間移動脫離戰場" },
    "箭": { type: "ammo", tier: "white", weight: 0.03, price: 1, desc: "普通箭矢" },
    "銀箭": { type: "ammo", tier: "white", material: "silver", weight: 0.04, price: 3, desc: "銀質箭矢，對不死系追加破邪傷害" },

    // --- 武防強化卷軸與技能書 ---
    "對武器施法的卷軸": { type: "enchant_w", tier: "scroll", weight: 2.0, price: 50000, desc: "強化武器攻擊力 (安定值+6)" },
    "對防具施法的卷軸": { type: "enchant_a", tier: "scroll", weight: 2.0, price: 25000, desc: "強化防具AC額外-1 (安定值+4)" },
    // 騎士技術書
    "技術書(衝擊之暈)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 60000, skill: "衝擊之暈", desc: "習得騎士專屬技術：衝擊之暈" },
    "技術書(堅固防護)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 40000, skill: "堅固防護", desc: "習得騎士被動防護：堅固防護 (AC-2)" },
    "技術書(反擊屏障)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "反擊屏障", desc: "習得騎士神技：反擊屏障" },
    "技術書(增幅防禦)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "增幅防禦", desc: "習得騎士被動技術：增幅防禦 (AC-3)" },
    "技術書(狂暴將軍)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "狂暴將軍", desc: "習得騎士主動技術：狂暴將軍 (STR+3)" },
    // 妖精精靈水晶
    "精靈水晶(三重矢)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 250000, skill: "三重矢", desc: "習得妖精標誌神技：三重矢" },
    "精靈水晶(屬性之火)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 35000, skill: "屬性之火", desc: "習得精靈火系魔法：屬性之火" },
    "精靈水晶(屬性之水)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 35000, skill: "屬性之水", desc: "習得精靈水系魔法：屬性之水" },
    "精靈水晶(屬性之風)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "屬性之風", desc: "習得精靈風系魔法：屬性之風" },
    "精靈水晶(屬性之地)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "屬性之地", desc: "習得精靈地系魔法：屬性之地" },
    "精靈水晶(自然之祝福)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "自然之祝福", desc: "習得精靈被動印記：自然之祝福 (DEX+3)" },
    // 法師正統魔法書
    "魔法書(初級治癒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 5000, skill: "初級治癒術", desc: "習得一級神聖回復魔法" },
    "魔法書(魔法飛彈)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 3000, skill: "魔法飛彈", desc: "習得一級秘術飛彈" },
    "魔法書(光箭術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 10000, skill: "光箭術", desc: "習得二級光箭術" },
    "魔法書(初級加速術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 20000, skill: "初級加速術", desc: "習得二級敏捷加速魔法" },
    "魔法書(火球術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 30000, skill: "火球術", desc: "習得三級火系爆裂魔法" },
    "魔法書(初級體力回復術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 40000, skill: "初級體力回復術", desc: "習得三級體力回復術" },
    "魔法書(極道落雷)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "極道落雷", desc: "習得四級範圍雷電魔法" },
    "魔法書(高級治癒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "高級治癒術", desc: "習得四級單體急救神術" },
    "魔法書(體魄強健術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "體魄強健術", desc: "習得五級強化魔法 (力量 STR+5)" },
    "魔法書(聖結界)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 500000, skill: "聖結界", desc: "法師神技：受擊傷害減免 50%" },
    "魔法書(究極光裂術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 2000000, skill: "究極光裂術", desc: "法師終極單體毀滅魔法" },
    // 王族皇家魔典
    "皇家魔典(精準目標)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 30000, skill: "精準目標", desc: "習得王族鎖定技術：精準目標 (命中+5)" },
    "皇家魔典(皇家血統)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 60000, skill: "皇家血統", desc: "習得王族被動體魄：皇家血統 (HP+50)" },
    "皇家魔典(激勵士氣)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "激勵士氣", desc: "習得王族戰術光環：激勵士氣" },

    // --- 材料與收購產物 ---
    "妖魔圖騰": { type: "etc", tier: "mat", weight: 1.0, price: 200, desc: "燃柳村羅浮專用高價收購圖騰" },
    "粗糙皮革": { type: "mat", tier: "mat", weight: 0.5, price: 20, desc: "基礎防具鍛造皮革" },
    "狼皮": { type: "mat", tier: "mat", weight: 0.8, price: 50, desc: "高級皮革材料" },
    "骨頭": { type: "mat", tier: "mat", weight: 1.0, price: 15, desc: "骷髏系列裝備材料" },
    "鐵塊": { type: "mat", tier: "mat", weight: 3.0, price: 80, desc: "鋼鐵兵器必備材料" },
    "銀原石": { type: "mat", tier: "mat", weight: 2.0, price: 200, desc: "破邪銀質武器核心材料" },
    "純銀原石": { type: "mat", tier: "mat", weight: 2.5, price: 500, desc: "純銀高等原石" },
    "黑寶石": { type: "mat", tier: "mat", weight: 1.0, price: 800, desc: "暗黑系列稀有飾品素材" },
    "米索莉原石": { type: "mat", tier: "mat", weight: 1.5, price: 600, desc: "精靈神兵核心原石" },
    "強化皮革": { type: "mat", tier: "mat", weight: 1.2, price: 250, desc: "巨蟻硬甲皮革" },
    "溶解液": { type: "etc", tier: "mat", weight: 1.0, price: 100, desc: "史萊姆消化黏液" },

    // --- 武器 (Weapon) ---
    "短劍": { type: "weapon", tier: "white", slot: "weapon", small: 8, large: 2, safe: 6, material: "iron", weight: 40, price: 250 },
    "闊劍": { type: "weapon", tier: "white", slot: "weapon", small: 11, large: 10, safe: 6, material: "iron", weight: 100, price: 800 },
    "長劍": { type: "weapon", tier: "white", slot: "weapon", small: 10, large: 12, safe: 6, material: "iron", weight: 120, price: 1500 },
    "銀長劍": { type: "weapon", tier: "green", slot: "weapon", small: 8, large: 12, safe: 6, material: "silver", weight: 60, price: 4000, desc: "銀質不死系剋星" },
    "雙手劍": { type: "weapon", tier: "white", slot: "weapon", small: 12, large: 18, safe: 6, material: "iron", weight: 150, price: 5000 },
    "大馬士革刀": { type: "weapon", tier: "green", slot: "weapon", small: 10, large: 11, safe: 6, material: "iron", cannotDamage: true, weight: 45, price: 25000, desc: "永久不壞刀神兵" },
    "瑟魯基之劍": { type: "weapon", tier: "blue", slot: "weapon", small: 16, large: 10, safe: 6, material: "iron", hitBonus: 1, weight: 140, price: 80000, desc: "騎士終極單手神劍" },
    "獵人之弓": { type: "weapon", tier: "green", slot: "weapon", weaponType: "bow", small: 3, large: 3, safe: 6, material: "wood", hitBonus: 2, weight: 30, price: 3500 },
    "十字弓": { type: "weapon", tier: "green", slot: "weapon", weaponType: "bow", small: 3, large: 2, safe: 6, material: "wood", hitBonus: 3, extraDmg: 2, weight: 50, price: 12000 },
    "巴風特魔杖": { type: "weapon", tier: "blue", slot: "weapon", small: 2, large: 3, safe: 6, material: "wood", extraDmg: 3, intBonus: 1, weight: 30, price: 100000 },

    // --- 盔甲 (Body) ---
    "皮背心": { type: "armor", tier: "white", slot: "body", ac: -1, safe: 4, weight: 30, price: 150 },
    "鎖子甲": { type: "armor", tier: "white", slot: "body", ac: -5, safe: 4, weight: 220, price: 3000 },
    "骷髏盔甲": { type: "armor", tier: "green", slot: "body", ac: -5, safe: 0, weight: 200, price: 9000, desc: "安定值0" },
    "精靈金屬鎧甲": { type: "armor", tier: "green", slot: "body", ac: -6, safe: 6, weight: 250, price: 35000, desc: "安定值+6" },

    // --- 頭盔 (Head) ---
    "皮頭盔": { type: "armor", tier: "white", slot: "head", ac: -1, safe: 4, weight: 20, price: 200 },
    "骷髏頭盔": { type: "armor", tier: "green", slot: "head", ac: -3, safe: 4, weight: 50, price: 5000 },
    "抗魔法頭盔": { type: "armor", tier: "green", slot: "head", ac: -2, safe: 4, mrBonus: 4, weight: 35, price: 12000 },
    "死騎頭盔": { type: "armor", tier: "blue", slot: "head", ac: -4, safe: 4, strBonus: 1, weight: 60, price: 150000 },

    // --- 盾牌 (Shield) ---
    "木盾": { type: "armor", tier: "white", slot: "shield", ac: -1, safe: 4, weight: 30, price: 200 },
    "侏儒圓盾": { type: "armor", tier: "white", slot: "shield", ac: -1, safe: 4, weight: 40, price: 120 },
    "骷髏盾牌": { type: "armor", tier: "green", slot: "shield", ac: -3, safe: 4, weight: 80, price: 6000 },
    "鋼鐵盾牌": { type: "armor", tier: "green", slot: "shield", ac: -3, safe: 4, weight: 100, price: 18000 },

    // --- 斗篷 (Cloak) ---
    "抗魔法斗篷": { type: "armor", tier: "green", slot: "cloak", ac: -1, safe: 4, mrBonus: 10, weight: 20, price: 8000 },
    "保護者斗篷": { type: "armor", tier: "green", slot: "cloak", ac: -3, safe: 4, weight: 30, price: 15000 },
    "隱身斗篷": { type: "armor", tier: "red", slot: "cloak", ac: 0, safe: 0, weight: 10, price: 1000000 },

    // --- 手套 (Glove) ---
    "皮手套": { type: "armor", tier: "white", slot: "glove", ac: 0, safe: 4, weight: 10, price: 300 },
    "腕甲": { type: "armor", tier: "green", slot: "glove", ac: 0, safe: 4, hitBonus: 1, weight: 15, price: 8000, desc: "命中+1" },
    "力量手套": { type: "armor", tier: "blue", slot: "glove", ac: 0, safe: 4, strBonus: 2, weight: 18, price: 200000, desc: "力量 STR+2" },
    "塞尼斯手套": { type: "armor", tier: "red", slot: "glove", ac: -2, safe: 4, intBonus: 2, weight: 20, price: 800000, desc: "智力 INT+2" },

    // --- 靴子 (Boots) ---
    "皮長靴": { type: "armor", tier: "white", slot: "boots", ac: -2, safe: 4, weight: 25, price: 600 },
    "鐵高跟靴": { type: "armor", tier: "green", slot: "boots", ac: -3, safe: 4, weight: 50, price: 5000 },
    "敏捷魔法長靴": { type: "armor", tier: "blue", slot: "boots", ac: -2, safe: 4, dexBonus: 1, weight: 30, price: 80000, desc: "敏捷 DEX+1" },

    // --- 項鍊 (Necklace) ---
    "力量項鍊": { type: "accessory", tier: "green", slot: "necklace", ac: 0, strBonus: 1, weight: 5, price: 50000, desc: "力量 STR+1" },
    "敏捷項鍊": { type: "accessory", tier: "green", slot: "necklace", ac: 0, dexBonus: 1, weight: 5, price: 50000, desc: "敏捷 DEX+1" },
    "智力項鍊": { type: "accessory", tier: "green", slot: "necklace", ac: 0, intBonus: 1, weight: 5, price: 50000, desc: "智力 INT+1" },
    "骷髏項鍊": { type: "accessory", tier: "green", slot: "necklace", ac: -2, weight: 10, price: 20000, desc: "防禦 AC-2" },

    // --- 耳環 (Earrings) ---
    "妖魔戰士耳環": { type: "accessory", tier: "white", slot: "earring", ac: 0, hpBonus: 20, weight: 5, price: 15000, desc: "生命 HP+20" },
    "骷髏耳環": { type: "accessory", tier: "green", slot: "earring", ac: -1, weight: 5, price: 40000, desc: "防禦 AC-1" },

    // --- 戒指 (Ring - 雙槽位通用) ---
    "抗魔戒指": { type: "accessory", tier: "green", slot: "ring", ac: 0, mrBonus: 5, weight: 3, price: 25000, desc: "魔防 MR+5" },
    "巨蟻女皇戒指": { type: "accessory", tier: "blue", slot: "ring", ac: 0, hpBonus: 30, weightMultiplier: 1.1, weight: 5, price: 300000, desc: "HP+30，負重+10%" },
    "瞬間移動控制戒指": { type: "accessory", tier: "red", slot: "ring", ac: 0, weight: 5, price: 1500000, desc: "指定傳送戒指" },

    // --- 腰帶 (Belt) ---
    "皮腰帶": { type: "accessory", tier: "white", slot: "belt", ac: 0, weight: 10, price: 1000 },
    "多羅皮帶": { type: "accessory", tier: "green", slot: "belt", ac: 0, weightMultiplier: 1.2, weight: 15, price: 60000, desc: "負重上限+20%" },
    "歐吉皮帶": { type: "accessory", tier: "blue", slot: "belt", ac: 0, weightMultiplier: 1.5, weight: 20, price: 450000, desc: "負重上限+50%" },

    // --- 內衣 (T-Shirt) ---
    "棉質T恤": { type: "armor", tier: "white", slot: "tshirt", ac: 0, safe: 4, weight: 5, price: 1000, desc: "初學者棉質內衣" },
    "精靈T恤": { type: "armor", tier: "green", slot: "tshirt", ac: -1, safe: 6, weight: 5, price: 30000, desc: "精靈編織內衣，安定值+6" },

    // --- 符石與徽章 (Rune) ---
    "力量符石": { type: "accessory", tier: "green", slot: "rune", ac: 0, strBonus: 1, weight: 2, price: 50000, desc: "刻有巨力印記的古老符石 (STR+1)" },
    "敏捷符石": { type: "accessory", tier: "green", slot: "rune", ac: 0, dexBonus: 1, weight: 2, price: 50000, desc: "刻有疾風印記的古老符石 (DEX+1)" }
  },

  polymorphs: [
    { name: "無變身", reqLv: 1, speedInterval: 1200, type: "通用" },
    { name: "骷髏", reqLv: 10, speedInterval: 1050, type: "近戰" },
    { name: "妖魔弓箭手", reqLv: 15, speedInterval: 980, type: "遠程弓" },
    { name: "死亡騎士", reqLv: 52, speedInterval: 680, type: "近戰極速" },
    { name: "黑暗妖精弓箭手", reqLv: 52, speedInterval: 680, type: "遠程極速" }
  ],

    silver_knight_field: {
      name: "銀騎士訓練場 (Lv 30~40)", maxMobs: 26, reqLv: 30,
      monsters: [
        { name: "銀騎士", level: 32, hp: 360, ac: -6, size: "small", aggressive: true, undead: false, exp: 950, drops: [{ item: "金幣", min: 250, max: 700, chance: 0.9 }, { item: "銀原石", chance: 0.2 }, { item: "銀長劍", chance: 0.04 }] },
        { name: "黑暗精靈", level: 35, hp: 420, ac: -8, size: "small", aggressive: true, undead: false, exp: 1150, drops: [{ item: "金幣", min: 300, max: 800, chance: 0.9 }, { item: "抗魔法斗篷", chance: 0.04 }, { item: "對防具施法的卷軸", chance: 0.06 }] },
        { name: "銀騎守衛", level: 38, hp: 520, ac: -10, size: "small", aggressive: true, undead: false, exp: 1400, drops: [{ item: "金幣", min: 350, max: 900, chance: 0.9 }, { item: "力量手套", chance: 0.05 }, { item: "對武器施法的卷軸", chance: 0.06 }] }
      ]
    },
    heine_water_dungeon: {
      name: "海音水底地監 (Lv 40~50)", maxMobs: 24, reqLv: 40,
      monsters: [
        { name: "水元素", level: 40, hp: 600, ac: -12, size: "small", aggressive: true, undead: false, exp: 1700, drops: [{ item: "金幣", min: 400, max: 1000, chance: 0.9 }, { item: "藍色藥水", count: 1, chance: 0.25 }] },
        { name: "海龍", level: 45, hp: 900, ac: -16, size: "large", aggressive: true, undead: false, exp: 2300, drops: [{ item: "金幣", min: 600, max: 1500, chance: 0.9 }, { item: "瑟魯基之劍", chance: 0.03 }, { item: "魔法書(高級治癒術)", chance: 0.05 }] },
        { name: "深海魔獸", level: 48, hp: 1100, ac: -18, size: "large", aggressive: true, undead: false, exp: 2800, drops: [{ item: "金幣", min: 700, max: 1800, chance: 0.9 }, { item: "抗魔法斗篷", chance: 0.04 }, { item: "對防具施法的卷軸", chance: 0.07 }] }
      ]
    },
    werden_fire_dragon: {
      name: "威頓火龍窟 (Lv 50+)", maxMobs: 20, reqLv: 50, isBossMap: true,
      monsters: [
        { name: "火蜥蜴", level: 50, hp: 1200, ac: -20, size: "small", aggressive: true, undead: false, exp: 3200, drops: [{ item: "金幣", min: 800, max: 2000, chance: 0.9 }, { item: "翡翠藥水", count: 2, chance: 0.3 }] },
        { name: "火焰魔人", level: 55, hp: 1800, ac: -24, size: "large", aggressive: true, undead: false, exp: 4200, drops: [{ item: "金幣", min: 1000, max: 2500, chance: 0.9 }, { item: "力量手套", chance: 0.05 }, { item: "對武器施法的卷軸", chance: 0.08 }] },
        { name: "巴拉卡斯", level: 70, hp: 30000, ac: -60, size: "large", aggressive: true, undead: false, isBoss: true, exp: 30000, drops: [{ item: "金幣", min: 50000, max: 120000, chance: 1.0 }, { item: "瑟魯基之劍", chance: 0.2 }, { item: "力量手套", chance: 0.1 }, { item: "對武器施法的卷軸", count: 3, chance: 0.9 }, { item: "對防具施法的卷軸", count: 3, chance: 0.9 }] }
      ]
    },
  skills: {
    // 🛡️ 騎士技術 (Knight)
    "衝擊之暈": { name: "衝擊之暈", school: "knight", tier: 1, mpCost: 15, cooldown: 10000, type: "damage", power: 60, mode: "active", iconKey: "shock_stun", desc: "主動重劈打擊，對目標造成傷害並使目標陷入暈眩" },
    "堅固防護": { name: "堅固防護", school: "knight", tier: 1, mpCost: 20, cooldown: 60000, type: "buff", stat: "ac", amount: -2, duration: 300, mode: "passive", iconKey: "solid_carriage", desc: "騎士防護技術，自身防禦 AC-2" },
    "反擊屏障": { name: "反擊屏障", school: "knight", tier: 2, mpCost: 25, cooldown: 45000, type: "buff", stat: "mr", amount: 10, duration: 200, mode: "active", iconKey: "counter_barrier", desc: "近戰防禦神技，提升魔防並有機率反彈近身攻擊" },
    "增幅防禦": { name: "增幅防禦", school: "knight", tier: 2, mpCost: 20, cooldown: 60000, type: "buff", stat: "ac", amount: -3, duration: 300, mode: "passive", iconKey: "reduction_armor", desc: "強化盾牌堅定格擋，AC額外-3" },
    "狂暴將軍": { name: "狂暴將軍", school: "knight", tier: 3, mpCost: 25, cooldown: 30000, type: "buff", stat: "str", amount: 3, duration: 180, mode: "active", iconKey: "brave_aura", desc: "激發騎士狂暴之魂，力量 STR+3" },

    // 🏹 精靈魔法 (Elf)
    "三重矢": { name: "三重矢", school: "elf", tier: 3, mpCost: 15, cooldown: 2500, type: "damage", power: 90, mode: "active", iconKey: "triple_arrow", desc: "妖精標誌神技，瞬間連續射出三支強烈魔法箭矢" },
    "屬性之火": { name: "屬性之火", school: "elf", tier: 1, mpCost: 10, cooldown: 2000, type: "damage", power: 40, mode: "active", iconKey: "elemental_fire", desc: "引導火鳳凰烈焰之力，造成強烈火屬性傷害" },
    "屬性之水": { name: "屬性之水", school: "elf", tier: 1, mpCost: 10, cooldown: 2000, type: "damage", power: 40, mode: "active", iconKey: "elemental_water", desc: "凝聚神聖水元素漩渦打擊目標" },
    "屬性之風": { name: "屬性之風", school: "elf", tier: 2, mpCost: 12, cooldown: 2000, type: "damage", power: 55, mode: "active", iconKey: "elemental_wind", desc: "召喚銳利疾風風刃破空打擊" },
    "屬性之地": { name: "屬性之地", school: "elf", tier: 2, mpCost: 12, cooldown: 2000, type: "damage", power: 55, mode: "active", iconKey: "elemental_earth", desc: "引動大地剛石結晶重壓目標" },
    "自然之祝福": { name: "自然之祝福", school: "elf", tier: 3, mpCost: 20, cooldown: 30000, type: "buff", stat: "dex", amount: 3, duration: 180, mode: "passive", iconKey: "nature_blessing", desc: "自然精靈永恆印記，敏捷 DEX+3" },

    // 🧙‍♂️ 正統魔法 (Mage)
    "初級治癒術": { name: "初級治癒術", school: "normal", tier: 1, mpCost: 10, cooldown: 2000, type: "heal", power: 60, mode: "active", iconKey: "heal", desc: "回復少量生命值" },
    "魔法飛彈": { name: "魔法飛彈", school: "normal", tier: 1, mpCost: 8, cooldown: 1500, type: "damage", power: 30, mode: "active", iconKey: "energy_bolt", desc: "基礎單體秘術飛彈攻擊" },
    "光箭術": { name: "光箭術", school: "normal", tier: 2, mpCost: 12, cooldown: 2000, type: "damage", power: 50, mode: "active", iconKey: "light_arrow", desc: "光屬性單體破魔箭矢打擊" },
    "初級加速術": { name: "初級加速術", school: "normal", tier: 2, mpCost: 15, cooldown: 30000, type: "buff", stat: "dex", amount: 2, duration: 120, mode: "active", iconKey: "haste", desc: "疾行雷電祝福，DEX+2" },
    "火球術": { name: "火球術", school: "normal", tier: 3, mpCost: 15, cooldown: 3000, type: "damage", power: 80, mode: "active", iconKey: "fireball", desc: "凝聚熾熱爆炎火球轟擊目標" },
    "初級體力回復術": { name: "初級體力回復術", school: "normal", tier: 3, mpCost: 18, cooldown: 5000, type: "heal", power: 120, mode: "active", iconKey: "extra_heal", desc: "中度體力回復術" },
    "極道落雷": { name: "極道落雷", school: "normal", tier: 4, mpCost: 25, cooldown: 4000, type: "damage", power: 140, mode: "active", iconKey: "lightning", desc: "召喚黑紫狂雷貫穿目標" },
    "高級治癒術": { name: "高級治癒術", school: "normal", tier: 4, mpCost: 30, cooldown: 5000, type: "heal", power: 180, mode: "active", iconKey: "greater_heal", desc: "神聖高級急救神術，大量回復生命值" },
    "體魄強健術": { name: "體魄強健術", school: "normal", tier: 5, mpCost: 20, cooldown: 60000, type: "buff", stat: "str", amount: 5, duration: 300, mode: "passive", iconKey: "physical_enchant", desc: "肌肉力量爆發，STR+5" },
    "聖結界": { name: "聖結界", school: "normal", tier: 5, mpCost: 40, cooldown: 120000, type: "buff", stat: "mr", amount: 20, duration: 300, mode: "active", iconKey: "immune_to_harm", desc: "神聖守護屏障，受擊傷害大幅減免" },
    "究極光裂術": { name: "究極光裂術", school: "normal", tier: 6, mpCost: 60, cooldown: 8000, type: "damage", power: 320, mode: "active", iconKey: "disintegrate", desc: "天界裁決之毀滅光芒，終極單體神術" },

    // 👑 王族魔法 (Prince)
    "精準目標": { name: "精準目標", school: "prince", tier: 1, mpCost: 10, cooldown: 20000, type: "buff", stat: "hit", amount: 5, duration: 180, mode: "active", iconKey: "true_target", desc: "王族集火目標印記，命中+5" },
    "皇家血統": { name: "皇家血統", school: "prince", tier: 1, mpCost: 15, cooldown: 30000, type: "buff", stat: "hp", amount: 50, duration: 300, mode: "passive", iconKey: "royal_blood", desc: "帝國皇族血統威嚴，HP上限+50" },
    "激勵士氣": { name: "激勵士氣", school: "prince", tier: 2, mpCost: 15, cooldown: 40000, type: "buff", stat: "hit", amount: 3, duration: 180, mode: "active", iconKey: "brave_mental", desc: "鼓舞全軍戰意，命中率提升" }
  },
  villages: {
    ti_village: {
      name: "說話之島村莊",
      shops: [
        { title: "雜貨商・潘朵拉", desc: "新手冒險藥水、回捲與普通箭矢", items: ["紅色藥水", "澄色藥水", "藍色藥水", "綠色藥水", "傳送回家的卷軸", "瞬間移動卷軸", "箭"] },
        { title: "鐵匠・亞特巴", desc: "基礎鋼鐵兵器與防具", items: ["短劍", "闊劍", "皮背心", "木盾", "侏儒圓盾"] },
        { title: "技能導師・梅林", desc: "販售官方魔法書，使用後可學習技能", items: ["魔法書(火球術)", "魔法書(極道落雷)", "魔法書(高級治癒術)", "魔法書(體魄強健術)", "魔法書(聖結界)", "魔法書(究極光裂術)"] }
      ]
    },
    elf_forest: {
      name: "妖精森林母樹村莊",
      shops: [
        { title: "精靈神匠・娜魯帕", desc: "妖精專屬精靈金屬鎧甲、弓箭與神兵", items: ["精靈金屬鎧甲", "獵人之弓", "十字弓", "箭", "銀箭", "銀長劍"] },
        { title: "母樹守護者・精靈使", desc: "森林天然靈藥與解毒翡翠藥水", items: ["紅色藥水", "澄色藥水", "綠色藥水", "翡翠藥水", "瞬間移動卷軸", "傳送回家的卷軸"] }
      ]
    },
    werner_village_town: {
      name: "燃柳妖魔部落村莊",
      shops: [
        { title: "高價收購商・羅浮", desc: "高價回收【妖魔圖騰】(200 金幣/個)，並販售戰備補給", items: ["紅色藥水", "澄色藥水", "綠色藥水", "箭", "銀箭", "傳送回家的卷軸"] },
        { title: "部落鐵匠・都達瑪拉", desc: "妖魔戰士常用兵器與皮背心", items: ["短劍", "闊劍", "長劍", "皮背心", "木盾"] }
      ]
    },
    gludio_village: {
      name: "古魯丁港口村莊",
      shops: [
        { title: "港口雜貨商・露西亞", desc: "販售騎士狂暴勇水與強力白水", items: ["紅色藥水", "白色藥水", "勇敢藥水", "綠色藥水", "藍色藥水", "傳送回家的卷軸", "瞬間移動卷軸"] },
        { title: "重裝武器坊・杜巴", desc: "骷髏套裝與大馬士革刀", items: ["長劍", "銀長劍", "大馬士革刀", "骷髏頭盔", "骷髏盾牌", "骷髏盔甲", "鎖子甲"] }
      ]
    },
    kent_village: {
      name: "肯特城堡村莊",
      shops: [
        { title: "城堡雜貨商・艾莉絲", desc: "妖精遠程破邪銀箭與必備補給", items: ["紅色藥水", "白色藥水", "銀箭", "翡翠藥水", "綠色藥水", "勇敢藥水", "傳送回家的卷軸", "瞬間移動卷軸"] },
        { title: "城堡軍需官・克林特", desc: "精靈神兵、十字弓與抗魔斗篷", items: ["獵人之弓", "十字弓", "雙手劍", "抗魔法斗篷", "精靈金屬鎧甲"] }
      ]
    },
    windwood_village: {
      name: "風木綠洲村莊",
      shops: [
        { title: "沙漠商隊・哈桑", desc: "沙漠探險解毒翡翠藥水與物資", items: ["紅色藥水", "澄色藥水", "白色藥水", "翡翠藥水", "綠色藥水", "傳送回家的卷軸", "瞬間移動卷軸", "箭", "銀箭"] }
      ]
    },
    giran_village: {
      name: "奇岩商業都市中心",
      shops: [
        { title: "奇岩名譽雜貨商・馬斯克", desc: "高級補給與每日限量武防卷軸", items: ["紅色藥水", "白色藥水", "勇敢藥水", "藍色藥水", "對武器施法的卷軸", "對防具施法的卷軸", "傳送回家的卷軸", "瞬間移動卷軸"] },
        { title: "工坊神兵大師・莫里", desc: "瑟魯基之劍、力量手套與稀世魔法書", items: ["瑟魯基之劍", "大馬士革刀", "雙手劍", "力量手套", "魔法書(高級治癒術)", "魔法書(體魄強健術)"] }
      ]
    },
     silver_knight_village: {
       name: "銀騎士村莊",
       shops: [
         { title: "銀騎軍需官・蘭斯洛特", desc: "騎士訓練所補給與銀製裝備", items: ["紅色藥水", "白色藥水", "勇敢藥水", "傳送回家的卷軸", "瞬間移動卷軸", "銀長劍", "力量手套"] },
         { title: "銀騎鐵匠・杜蘭", desc: "銀騎士專用武器與重甲", items: ["大馬士革刀", "雙手劍", "銀原石", "精靈金屬鎧甲", "抗魔法斗篷"] }
       ]
     },
     heine_village: {
       name: "海音村莊",
       shops: [
         { title: "海音雜貨商・瑪琳", desc: "水都補給與魔法書", items: ["紅色藥水", "白色藥水", "藍色藥水", "翡翠藥水", "傳送回家的卷軸", "瞬間移動卷軸", "魔法書(高級治癒術)"] },
         { title: "海音武器坊・卡西", desc: "水底探險武器與防具", items: ["銀長劍", "十字弓", "瑟魯基之劍", "抗魔法斗篷", "精靈金屬鎧甲"] }
       ]
     },
     werden_village: {
       name: "威頓村莊",
       shops: [
         { title: "威頓補給商・阿格", desc: "火龍窟探險補給", items: ["紅色藥水", "白色藥水", "勇敢藥水", "翡翠藥水", "傳送回家的卷軸", "瞬間移動卷軸"] },
         { title: "威頓鐵匠・凡恩", desc: "抗火裝備與高階武器", items: ["瑟魯基之劍", "大馬士革刀", "雙手劍", "力量手套", "抗魔法斗篷"] }
       ]
     }
  }
};

const CLASS_PRESETS = {
  prince: { name: "王族", base: { str: 13, dex: 10, con: 10, int: 10, wis: 11, cha: 12 }, bonusPoints: 9, hpMod: [12, 16], mpMod: [2, 4] },
  knight: { name: "騎士", base: { str: 16, dex: 12, con: 14, int: 8, wis: 9, cha: 12 }, bonusPoints: 4, hpMod: [18, 24], mpMod: [1, 2] },
  elf: { name: "妖精", base: { str: 11, dex: 12, con: 12, int: 12, wis: 12, cha: 9 }, bonusPoints: 7, hpMod: [10, 15], mpMod: [4, 6] },
  mage: { name: "法師", base: { str: 8, dex: 7, con: 12, int: 12, wis: 12, cha: 8 }, bonusPoints: 16, hpMod: [6, 10], mpMod: [8, 12] }
};

if (typeof window !== "undefined") {
  window.DB = DB;
  window.CLASS_PRESETS = CLASS_PRESETS;
}