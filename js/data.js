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
    // --- 武防強化卷軸與技能書 ---
    "對武器施法的卷軸": { type: "enchant_w", tier: "scroll", weight: 2.0, price: 50000, desc: "強化武器攻擊力 (安定值+6)" },
    "對防具施法的卷軸": { type: "enchant_a", tier: "scroll", weight: 2.0, price: 25000, desc: "強化防具AC額外-1 (安定值+4)" },

    // 施法必備媒介材料
    "精靈玉": { type: "etc", tier: "white", weight: 0.05, price: 50, desc: "妖精施展專屬精靈魔法的必備自然媒介" },
    "魔力之石": { type: "etc", tier: "white", weight: 0.1, price: 100, desc: "法師與高階正統魔法施展的必備魔力結晶" },

    // 🛡️ 騎士專屬技術書 (Knight Technical Books)
    "技術書(衝擊之暈)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "衝擊之暈", desc: "習得騎士神技：衝擊之暈 (揮斬暈眩目標)" },
    "技術書(堅固防護)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "堅固防護", desc: "習得騎士防護技術：堅固防護 (自身防禦 AC-2)" },
    "技術書(反擊屏障)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 800000, skill: "反擊屏障", desc: "習得騎士終極神技：反擊屏障 (反彈近身物理攻擊)" },
    "技術書(增幅防禦)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "增幅防禦", desc: "習得騎士強化技術：增幅防禦 (盾牌 AC額外-3)" },
    "技術書(狂暴將軍)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 250000, skill: "狂暴將軍", desc: "習得騎士狂暴技術：狂暴將軍 (力量 STR+3)" },

    // 👑 王族皇家魔典 (Prince Royal Books)
    "皇家魔典(精準目標)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 30000, skill: "精準目標", desc: "習得王族鎖定技術：精準目標 (命中+5)" },
    "皇家魔典(皇家血統)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 60000, skill: "皇家血統", desc: "習得王族被動體魄：皇家血統 (HP+50)" },
    "皇家魔典(激勵士氣)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "激勵士氣", desc: "習得王族戰術光環：激勵士氣" },

    // 🏹 妖精專屬精靈水晶（共通與四大屬性共 32 招）
    // 共通精靈魔法
    "精靈水晶(魔法防禦)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "魔法防禦", desc: "習得共通精靈秘技：魔法防禦 (MR+10)" },
    "精靈水晶(心靈轉換)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 60000, skill: "心靈轉換", desc: "習得共通精靈秘技：心靈轉換 (HP 換 MP)" },
    "精靈水晶(世界樹的呼喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "世界樹的呼喚", desc: "習得共通精靈秘技：世界樹的呼喚 (瞬間返鄉)" },
    "精靈水晶(淨化精神)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 100000, skill: "淨化精神", desc: "習得共通精靈秘技：淨化精神 (WIS+2)" },
    "精靈水晶(屬性防禦)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "屬性防禦", desc: "習得共通精靈秘技：屬性防禦 (MR+15)" },
    "精靈水晶(釋放術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "釋放術", desc: "習得共通精靈秘技：釋放術 (淨化異常)" },
    "精靈水晶(魂體轉換)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 250000, skill: "魂體轉換", desc: "習得共通妖精永動神技：魂體轉換 (HP 換 15 MP)" },
    "精靈水晶(單屬性防禦)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "單屬性防禦", desc: "習得共通精靈秘技：單屬性防禦 (MR+20)" },
    // 風屬性
    "精靈水晶(風之神速)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "風之神速", desc: "習得風系精靈秘技：風之神速 (DEX+2)" },
    "精靈水晶(風之疾走)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 180000, skill: "風之疾走", desc: "習得風系精靈秘技：風之疾走 (DEX+3 / 疾走加速)" },
    "精靈水晶(暴風神射)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 220000, skill: "暴風神射", desc: "習得風系弓手核心：暴風神射 (遠程命中+6/傷害增加)" },
    "精靈水晶(風之枷鎖)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "風之枷鎖", desc: "習得風系精靈秘技：風之枷鎖 (延遲敵方攻速)" },
    "精靈水晶(暴風疾馳)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 280000, skill: "暴風疾馳", desc: "習得風系精靈秘技：暴風疾馳 (DEX+5)" },
    "精靈水晶(三重矢)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "三重矢", desc: "習得妖精王道神技：三重矢 (瞬間連續三發箭矢)" },
    "精靈水晶(風之精靈召喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "風之精靈召喚", desc: "習得上位風精靈契約召喚" },
    // 水屬性
    "精靈水晶(水之元氣)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 160000, skill: "水之元氣", desc: "習得水系精靈秘技：水之元氣 (WIS+3)" },
    "精靈水晶(生命之泉)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "生命之泉", desc: "習得水系精靈秘技：生命之泉 (甘霖急救)" },
    "精靈水晶(生命的祝福)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "生命的祝福", desc: "習得水系核心神技：生命的祝福 (全隊大補血)" },
    "精靈水晶(自然之祝福)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "生命的祝福", desc: "習得水系核心神技：生命的祝福 (同名水晶)" },
    "精靈水晶(水之防護)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 180000, skill: "水之防護", desc: "習得水系精靈秘技：水之防護 (AC-4)" },
    "精靈水晶(污濁之水)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 260000, skill: "污濁之水", desc: "習得水系精靈秘技：污濁之水 (敵方治癒減半)" },
    "精靈水晶(水之精靈召喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "水之精靈召喚", desc: "習得上位水精靈契約召喚" },
    // 地屬性
    "精靈水晶(大地防護)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "大地防護", desc: "習得地系精靈秘技：大地防護 (AC-4)" },
    "精靈水晶(大地祝福)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "大地祝福", desc: "習得地系精靈秘技：大地祝福 (全隊防禦 AC-5)" },
    "精靈水晶(大地的祝福)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "大地祝福", desc: "習得地系精靈秘技：大地祝福 (同名水晶)" },
    "精靈水晶(鋼鐵防護)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 280000, skill: "鋼鐵防護", desc: "習得地系精靈秘技：鋼鐵防護 (AC-8)" },
    "精靈水晶(體魄強健)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "體魄強健", desc: "習得地系精靈秘技：體魄強健 (STR+5)" },
    "精靈水晶(大地屏障)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "大地屏障", desc: "習得地系精靈秘技：大地屏障 (石化禁錮)" },
    "精靈水晶(大地精靈召喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "大地精靈召喚", desc: "習得上位大地精靈契約召喚" },
    "精靈水晶(地之精靈召喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "大地精靈召喚", desc: "習得上位大地精靈契約召喚" },
    // 火屬性
    "精靈水晶(火熱武器)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 100000, skill: "火熱武器", desc: "習得火系精靈秘技：火熱武器 (命中+3)" },
    "精靈水晶(烈炎氣息)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "烈炎氣息", desc: "習得火系精靈秘技：烈炎氣息 (火焰打擊)" },
    "精靈水晶(烈炎武器)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 180000, skill: "烈炎武器", desc: "習得火系近戰核心：烈炎武器 (命中+5)" },
    "精靈水晶(灼熱靈魂)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "灼熱靈魂", desc: "習得火系烈魂妖神技：灼熱靈魂 (極限傷害/STR+6)" },
    "精靈水晶(火之精靈召喚)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "火之精靈召喚", desc: "習得上位烈火精靈契約召喚" },

    // ✨ 正統一般魔法書（1～6 級共 38 招）
    // 第 1 級
    "魔法書(光術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 3000, skill: "光術", desc: "習得 1 級神聖照明魔法" },
    "魔法書(光箭術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 3000, skill: "光術", desc: "習得 1 級神聖光術 (同名書冊)" },
    "魔法書(保護罩)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 5000, skill: "保護罩", desc: "習得 1 級防護能量盾 (AC-2)" },
    "魔法書(指定傳送)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 8000, skill: "指定傳送", desc: "習得 1 級空間座標瞬移" },
    "魔法書(冰箭)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 6000, skill: "冰箭", desc: "習得 1 級寒冰穿刺之箭" },
    "魔法書(風刃)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 6000, skill: "風刃", desc: "習得 1 級疾風破空風刃" },
    "魔法書(神聖武器)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 8000, skill: "神聖武器", desc: "習得 1 級神聖兵刃附魔 (命中+1)" },
    "魔法書(解毒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 10000, skill: "解毒術", desc: "習得 1 級解毒淨化神術" },
    "魔法書(盾牌術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 8000, skill: "盾牌術", desc: "習得 1 級堅定盾牌術 (AC-2)" },
    // 第 2 級
    "魔法書(初級治癒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 12000, skill: "初級治癒術", desc: "習得 2 級神聖回復魔法" },
    "魔法書(日光術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 15000, skill: "日光術", desc: "習得 2 級白晝日光術" },
    "魔法書(火球術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 20000, skill: "火球術", desc: "習得 2 級火系爆裂球" },
    "魔法書(通暢氣脈)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 30000, skill: "通暢氣脈", desc: "習得 2 級經絡通暢術 (DEX+5)" },
    "魔法書(力量提升)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 30000, skill: "力量提升", desc: "習得 2 級肉體肌力激發 (STR+5)" },
    "魔法書(寒冰氣息)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 25000, skill: "寒冰氣息", desc: "習得 2 級極寒冰霜噴射" },
    // 第 3 級
    "魔法書(擬似勇氣)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 40000, skill: "擬似勇氣", desc: "習得 3 級神經攻速加速 (DEX+2)" },
    "魔法書(極光雷電)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "極光雷電", desc: "習得 3 級金色極光雷弧" },
    "魔法書(起死回生術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 60000, skill: "起死回生術", desc: "習得 3 級超渡不死系神術" },
    "魔法書(中級治癒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "中級治癒術", desc: "習得 3 級中度急救神術" },
    "魔法書(闇盲術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 45000, skill: "闇盲術", desc: "習得 3 級奪取視野詛咒 (命中-5)" },
    "魔法書(鎧甲護持)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 50000, skill: "鎧甲護持", desc: "習得 3 級甲冑祝福護持 (AC-3)" },
    // 第 4 級
    "魔法書(高級治癒術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "高級治癒術", desc: "習得 4 級神聖大回復術" },
    "魔法書(燃燒的火球)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 90000, skill: "燃燒的火球", desc: "習得 4 級極巨爆炎火球" },
    "魔法書(通透術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 70000, skill: "通透術", desc: "習得 4 級洞察弱點術 (命中+3)" },
    "魔法書(冥想術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 80000, skill: "冥想術", desc: "習得 4 級深度禪定 (WIS+3)" },
    "魔法書(壞物術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 75000, skill: "壞物術", desc: "習得 4 級兵刃損壞詛咒" },
    "魔法書(吸血鬼之吻)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 90000, skill: "吸血鬼之吻", desc: "習得 4 級生命汲取魔咒" },
    // 第 5 級
    "魔法書(聖潔之光)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "聖潔之光", desc: "習得 5 級聖潔淨化除咒光芒" },
    "魔法書(冰雪暴)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 180000, skill: "冰雪暴", desc: "習得 5 級廣域極寒霜暴" },
    "魔法書(沉睡之霧)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 130000, skill: "沉睡之霧", desc: "習得 5 級催眠昏睡之霧" },
    "魔法書(緩速術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 120000, skill: "緩速術", desc: "習得 5 級泥沼縛鎖遲緩" },
    "魔法書(召喚術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "召喚術", desc: "習得 5 級異界使魔契約召喚" },
    "魔法書(極道落雷)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "極道落雷", desc: "習得 5 級紫電狂雷破壞" },
    "技能書(極道落雷)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 150000, skill: "極道落雷", desc: "習得 5 級紫電狂雷破壞 (別名)" },
    // 第 6 級
    "魔法書(加速術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 200000, skill: "加速術", desc: "習得 6 級正統全速奔馳疾風魔法" },
    "魔法書(地裂術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 250000, skill: "地裂術", desc: "習得 6 級地動山搖剛石迸裂" },
    "魔法書(魔法相消術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 300000, skill: "魔法相消術", desc: "習得 6 級增益消解法術" },
    "魔法書(強力加速術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 320000, skill: "強力加速術", desc: "習得 6 級極限狂暴疾行 (DEX+6)" },
    "魔法書(魔法屏障)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 280000, skill: "魔法屏障", desc: "習得 6 級神聖反彈屏障 (MR+20)" },
    "魔法書(創造怪物)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 350000, skill: "創造怪物", desc: "習得 6 級操縱生命之泥創造怪物傀儡" },

    // 🧙‍♂️ 法師專屬高階神術 (Mage High Tier Magic)
    "魔法書(聖結界)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 500000, skill: "聖結界", desc: "法師神技：受擊傷害減免 50%" },
    "魔法書(究極光裂術)": { type: "spellbook", tier: "scroll", weight: 5.0, price: 2000000, skill: "究極光裂術", desc: "法師終極單體毀滅魔法" },

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
    // =========================================================================
    // 🛡️ 專屬騎士技術 (Knight Technical Skills)
    // =========================================================================
    "衝擊之暈": { skillId: "shock_stun", name: "衝擊之暈", school: "knight", category: "class", reqLv: 50, tier: 1, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 10000, type: "damage", power: 60, mode: "active", iconKey: "shock_stun", desc: "主動重劈打擊，對目標造成傷害並使目標陷入暈眩" },
    "堅固防護": { skillId: "solid_carriage", name: "堅固防護", school: "knight", category: "class", reqLv: 40, tier: 1, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "ac", amount: -2, duration: 300, mode: "passive", iconKey: "solid_carriage", desc: "騎士防護技術，自身防禦 AC-2" },
    "反擊屏障": { skillId: "counter_barrier", name: "反擊屏障", school: "knight", category: "class", reqLv: 60, tier: 2, mpCost: 25, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 45000, type: "buff", stat: "mr", amount: 10, duration: 200, mode: "active", iconKey: "counter_barrier", desc: "近戰防禦神技，提升魔防並有機率反彈近身攻擊" },
    "增幅防禦": { skillId: "reduction_armor", name: "增幅防禦", school: "knight", category: "class", reqLv: 45, tier: 2, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "ac", amount: -3, duration: 300, mode: "passive", iconKey: "reduction_armor", desc: "強化盾牌堅定格擋，AC額外-3" },
    "狂暴將軍": { skillId: "brave_aura", name: "狂暴將軍", school: "knight", category: "class", reqLv: 55, tier: 3, mpCost: 25, hpCost: 0, materialCost: "無", cooldown: 30000, type: "buff", stat: "str", amount: 3, duration: 180, mode: "active", iconKey: "brave_aura", desc: "激發騎士狂暴之魂，力量 STR+3" },

    // =========================================================================
    // 👑 專屬王族魔法 (Prince Royal Magic)
    // =========================================================================
    "精準目標": { skillId: "true_target", name: "精準目標", school: "prince", category: "class", reqLv: 15, tier: 1, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 20000, type: "buff", stat: "hit", amount: 5, duration: 180, mode: "active", iconKey: "true_target", desc: "王族集火目標印記，命中+5" },
    "皇家血統": { skillId: "royal_blood", name: "皇家血統", school: "prince", category: "class", reqLv: 20, tier: 1, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 30000, type: "buff", stat: "hp", amount: 50, duration: 300, mode: "passive", iconKey: "royal_blood", desc: "帝國皇族血統威嚴，HP上限+50" },
    "激勵士氣": { skillId: "brave_mental", name: "激勵士氣", school: "prince", category: "class", reqLv: 30, tier: 2, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 40000, type: "buff", stat: "hit", amount: 3, duration: 180, mode: "active", iconKey: "brave_mental", desc: "鼓舞全軍戰意，命中率提升" },

    // =========================================================================
    // 🧙‍♂️ 專屬正統高階神術 (Mage High Tier Magic)
    // =========================================================================
    "聖結界": { skillId: "immune_to_harm", name: "聖結界", school: "mage", category: "class", reqLv: 40, tier: 5, mpCost: 40, hpCost: 0, materialCost: "魔力之石 x2", cooldown: 120000, type: "buff", stat: "mr", amount: 20, duration: 300, mode: "active", iconKey: "immune_to_harm", desc: "神聖守護屏障，受擊傷害大幅減免 50%" },
    "究極光裂術": { skillId: "disintegrate", name: "究極光裂術", school: "mage", category: "class", reqLv: 50, tier: 6, mpCost: 60, hpCost: 0, materialCost: "魔力之石 x3", cooldown: 8000, type: "damage", power: 320, mode: "active", iconKey: "disintegrate", desc: "天界裁決之毀滅光芒，終極單體神術" },

    // =========================================================================
    // 🏹 專屬精靈魔法技能（共通與四大屬性共 32 招）
    // =========================================================================
    // --- 共通魔法 (8 招) ---
    "魔法防禦": { skillId: "mr_defense", name: "魔法防禦", school: "elf", category: "class", element: "common", tier: 1, reqLv: 10, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "mr", amount: 10, duration: 300, mode: "passive", iconKey: "mr_defense", desc: "精靈庇佑護體，自身魔法防禦力 MR+10" },
    "心靈轉換": { skillId: "mental_convert", name: "心靈轉換", school: "elf", category: "class", element: "common", tier: 1, reqLv: 10, mpCost: 0, hpCost: 20, mpRecovery: 8, materialCost: "無", cooldown: 2000, type: "heal", mode: "active", iconKey: "body_to_soul", desc: "初階心靈轉化，犧牲 20 HP 轉化 8 MP" },
    "世界樹的呼喚": { skillId: "teleport_mother_tree", name: "世界樹的呼喚", school: "elf", category: "class", element: "common", tier: 2, reqLv: 20, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 5000, type: "active", mode: "active", iconKey: "nature_blessing", desc: "聆聽世界樹指引，瞬間傳送返回母樹村莊" },
    "淨化精神": { skillId: "clear_mind", name: "淨化精神", school: "elf", category: "class", element: "common", tier: 2, reqLv: 20, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 30000, type: "buff", stat: "wis", amount: 2, duration: 180, mode: "active", iconKey: "meditation", desc: "洗滌精神雜念，精神 WIS+2" },
    "屬性防禦": { skillId: "resist_element", name: "屬性防禦", school: "elf", category: "class", element: "common", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "mr", amount: 15, duration: 300, mode: "passive", iconKey: "earth_skin", desc: "全元素防禦抵抗，MR+15" },
    "釋放術": { skillId: "release_magic", name: "釋放術", school: "elf", category: "class", element: "common", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 15000, type: "heal", mode: "active", iconKey: "remove_curse", desc: "釋放並淨化自然界一切異常禁錮與麻痺" },
    "魂體轉換": { skillId: "body_to_soul", name: "魂體轉換", school: "elf", category: "class", element: "common", tier: 3, reqLv: 30, mpCost: 0, hpCost: 40, mpRecovery: 15, materialCost: "無", cooldown: 2500, type: "heal", mode: "active", iconKey: "body_to_soul", desc: "妖精永動機神技，消耗 40 HP 轉換為 15 MP" },
    "單屬性防禦": { skillId: "elemental_protection", name: "單屬性防禦", school: "elf", category: "class", element: "common", tier: 4, reqLv: 40, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "mr", amount: 20, duration: 300, mode: "passive", iconKey: "earth_bless", desc: "凝聚單一特定屬性抗性屏障，MR+20" },

    // --- 風屬性（弓手遠程核心 7 招） ---
    "風之神速": { skillId: "wind_speed", name: "風之神速", school: "elf", category: "class", element: "wind", tier: 1, reqLv: 10, mpCost: 10, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 30000, type: "buff", stat: "dex", amount: 2, duration: 120, mode: "active", iconKey: "wind_walk", desc: "乘風神速，移動速度與反應大幅提升" },
    "風之疾走": { skillId: "wind_walk", name: "風之疾走", school: "elf", category: "class", element: "wind", tier: 2, reqLv: 20, mpCost: 15, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 30000, type: "buff", stat: "dex", amount: 3, duration: 180, mode: "active", iconKey: "wind_walk", desc: "風系精靈秘技，敏捷 DEX+3，移動與攻擊速度提升" },
    "暴風神射": { skillId: "storm_shot", name: "暴風神射", school: "elf", category: "class", element: "wind", tier: 3, reqLv: 30, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 40000, type: "buff", stat: "hit", amount: 6, duration: 180, mode: "active", iconKey: "storm_shot", desc: "風系弓手核心，遠程命中+6、遠程傷害提升" },
    "風之枷鎖": { skillId: "wind_shackle", name: "風之枷鎖", school: "elf", category: "class", element: "wind", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 15000, type: "buff", stat: "dex", amount: -4, duration: 60, mode: "active", iconKey: "elemental_wind", desc: "逆風漩渦束縛目標，大幅延遲目標攻速" },
    "暴風疾馳": { skillId: "storm_walk", name: "暴風疾馳", school: "elf", category: "class", element: "wind", tier: 4, reqLv: 40, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 45000, type: "buff", stat: "dex", amount: 5, duration: 180, mode: "active", iconKey: "storm_shot", desc: "暴風咆哮疾馳，獲得極致遠程攻擊頻率" },
    "三重矢": { skillId: "triple_arrow", name: "三重矢", school: "elf", category: "class", element: "wind", tier: 4, reqLv: 40, mpCost: 15, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 2000, type: "damage", power: 90, mode: "active", iconKey: "triple_arrow", desc: "妖精標誌神技，瞬間連續射出三支強烈魔法箭矢" },
    "風之精靈召喚": { skillId: "summon_wind_spirit", name: "風之精靈召喚", school: "elf", category: "class", element: "wind", tier: 5, reqLv: 50, mpCost: 35, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "hit", amount: 5, duration: 300, mode: "active", iconKey: "elemental_wind", desc: "召喚上位暴風精靈使，協同遠程傾瀉風刃" },

    // --- 水屬性（補血與輔助核心 6 招） ---
    "水之元氣": { skillId: "water_life", name: "水之元氣", school: "elf", category: "class", element: "water", tier: 1, reqLv: 10, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "wis", amount: 3, duration: 300, mode: "passive", iconKey: "water_life", desc: "純水治癒源泉，精神 WIS+3，大幅提升治癒量" },
    "生命之泉": { skillId: "nature_touch", name: "生命之泉", school: "elf", category: "class", element: "water", tier: 2, reqLv: 20, mpCost: 15, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 4000, type: "heal", power: 100, mode: "active", iconKey: "nature_blessing", desc: "甘霖湧現泉水，持續滋潤生命值" },
    "生命的祝福": { skillId: "nature_blessing", name: "生命的祝福", school: "elf", category: "class", element: "water", tier: 3, reqLv: 30, mpCost: 30, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 5000, type: "heal", power: 220, mode: "active", iconKey: "nature_blessing", desc: "聖水生命祝福，全隊大量回復生命值" },
    "水之防護": { skillId: "aqua_protect", name: "水之防護", school: "elf", category: "class", element: "water", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "ac", amount: -4, duration: 300, mode: "passive", iconKey: "elemental_water", desc: "水幕柔韌防護壁，物理防禦 AC-4" },
    "污濁之水": { skillId: "pollute_water", name: "污濁之水", school: "elf", category: "class", element: "water", tier: 4, reqLv: 40, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 20000, type: "buff", mode: "active", iconKey: "cure_poison", desc: "污染目標生命源泉，使其受到的治癒量減半" },
    "水之精靈召喚": { skillId: "summon_water_spirit", name: "水之精靈召喚", school: "elf", category: "class", element: "water", tier: 5, reqLv: 50, mpCost: 35, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "hp", amount: 150, duration: 300, mode: "active", iconKey: "elemental_water", desc: "召喚上位水之精靈使，提供強大守護治癒光環" },

    // --- 地屬性（高防禦與控制 6 招） ---
    "大地防護": { skillId: "earth_skin", name: "大地防護", school: "elf", category: "class", element: "earth", tier: 1, reqLv: 10, mpCost: 15, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "ac", amount: -4, duration: 300, mode: "passive", iconKey: "earth_skin", desc: "地系精靈護甲，自身防禦 AC-4" },
    "大地祝福": { skillId: "earth_bless", name: "大地祝福", school: "elf", category: "class", element: "earth", tier: 2, reqLv: 20, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "ac", amount: -5, duration: 300, mode: "passive", iconKey: "earth_bless", desc: "母神堅定印記，全隊物理防禦 AC-5" },
    "鋼鐵防護": { skillId: "iron_skin", name: "鋼鐵防護", school: "elf", category: "class", element: "earth", tier: 3, reqLv: 30, mpCost: 25, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "ac", amount: -8, duration: 300, mode: "passive", iconKey: "solid_carriage", desc: "全身如鋼鐵般堅固，物理防禦 AC-8" },
    "體魄強健": { skillId: "physical_enchant", name: "體魄強健", school: "elf", category: "class", element: "earth", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 60000, type: "buff", stat: "str", amount: 5, duration: 300, mode: "passive", iconKey: "physical_enchant", desc: "大地力魄灌注，力量 STR+5" },
    "大地屏障": { skillId: "earth_bind", name: "大地屏障", school: "elf", category: "class", element: "earth", tier: 4, reqLv: 40, mpCost: 30, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 20000, type: "buff", mode: "active", iconKey: "earth_skin", desc: "剛石岩牢束縛目標，使其陷入完全石化禁錮" },
    "大地精靈召喚": { skillId: "summon_earth_spirit", name: "大地精靈召喚", school: "elf", category: "class", element: "earth", tier: 5, reqLv: 50, mpCost: 35, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "ac", amount: -6, duration: 300, mode: "active", iconKey: "elemental_earth", desc: "召喚上位大地精靈使，硬化岩石裝甲 AC-6" },

    // --- 火屬性（近戰烈魂妖 5 招） ---
    "火熱武器": { skillId: "fire_weapon", name: "火熱武器", school: "elf", category: "class", element: "fire", tier: 1, reqLv: 10, mpCost: 15, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 30000, type: "buff", stat: "hit", amount: 3, duration: 180, mode: "active", iconKey: "fire_weapon", desc: "赤焰灼熱附魔，近戰命中+3" },
    "烈炎氣息": { skillId: "elemental_fire", name: "烈炎氣息", school: "elf", category: "class", element: "fire", tier: 2, reqLv: 20, mpCost: 12, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 2000, type: "damage", power: 55, mode: "active", iconKey: "elemental_fire", desc: "引導火鳳凰烈炎氣息打擊目標" },
    "烈炎武器": { skillId: "burning_weapon", name: "烈炎武器", school: "elf", category: "class", element: "fire", tier: 3, reqLv: 30, mpCost: 20, hpCost: 0, materialCost: "精靈玉 x1", cooldown: 30000, type: "buff", stat: "hit", amount: 5, duration: 180, mode: "active", iconKey: "fire_weapon", desc: "火系近戰核心，近戰攻擊力與破壞力大幅飛躍" },
    "灼熱靈魂": { skillId: "soul_of_flame", name: "灼熱靈魂", school: "elf", category: "class", element: "fire", tier: 4, reqLv: 40, mpCost: 30, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 45000, type: "buff", stat: "str", amount: 6, duration: 180, mode: "active", iconKey: "fireball", desc: "燃燒火妖靈魂戰意，近身每擊皆發揮最高極限傷害" },
    "火之精靈召喚": { skillId: "summon_fire_spirit", name: "火之精靈召喚", school: "elf", category: "class", element: "fire", tier: 5, reqLv: 50, mpCost: 35, hpCost: 0, materialCost: "精靈玉 x2", cooldown: 60000, type: "buff", stat: "hit", amount: 5, duration: 300, mode: "active", iconKey: "elemental_fire", desc: "召喚上位烈火精靈使，近身狂暴焚燒敵人" },

    // =========================================================================
    // ✨ 正統 1～6 級一般魔法技能（共 38 招，妖精可學至 6 級）
    // =========================================================================
    // --- 第 1 級一般魔法 (8 招) ---
    "光術": { skillId: "light", name: "光術", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 5, hpCost: 0, materialCost: "無", cooldown: 2000, type: "buff", duration: 300, mode: "active", iconKey: "light_arrow", desc: "引導光之神恩，照亮周圍黑暗迷霧" },
    "保護罩": { skillId: "shield", name: "保護罩", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "ac", amount: -2, duration: 300, mode: "passive", iconKey: "shield", desc: "凝結魔力能量護盾，物理防禦 AC-2" },
    "指定傳送": { skillId: "teleport", name: "指定傳送", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 3000, type: "active", mode: "active", iconKey: "energy_bolt", desc: "空間座標轉移，瞬間移動脫離險境" },
    "冰箭": { skillId: "ice_dagger", name: "冰箭", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 6, hpCost: 0, materialCost: "無", cooldown: 1500, type: "damage", power: 45, mode: "active", iconKey: "ice_dagger", desc: "凝聚尖銳寒冰之箭貫穿打擊目標" },
    "風刃": { skillId: "wind_cutter", name: "風刃", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 6, hpCost: 0, materialCost: "無", cooldown: 1500, type: "damage", power: 45, mode: "active", iconKey: "elemental_wind", desc: "揮斬疾風風刃破空打擊目標" },
    "神聖武器": { skillId: "holy_weapon", name: "神聖武器", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "hit", amount: 1, duration: 300, mode: "passive", iconKey: "bless_weapon", desc: "神聖力量附魔於武器，命中率+1" },
    "解毒術": { skillId: "cure_poison", name: "解毒術", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 12, hpCost: 0, materialCost: "無", cooldown: 5000, type: "heal", mode: "active", iconKey: "cure_poison", desc: "淨化聖潔之光，瞬間解除體內劇毒狀態" },
    "盾牌術": { skillId: "shield_magic", name: "盾牌術", circle: 1, school: "common", category: "common", reqLv: 8, tier: 1, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "ac", amount: -2, duration: 300, mode: "passive", iconKey: "reduction_armor", desc: "強化盾牌堅定壁壘，防禦 AC-2" },

    // --- 第 2 級一般魔法 (6 招) ---
    "初級治癒術": { skillId: "heal", name: "初級治癒術", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 2000, type: "heal", power: 60, mode: "active", iconKey: "heal", desc: "回復少量生命值" },
    "日光術": { skillId: "daylight", name: "日光術", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 10, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", duration: 300, mode: "active", iconKey: "light_arrow", desc: "召喚白晝日光驅散一切陰霾" },
    "火球術": { skillId: "fireball", name: "火球術", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 3000, type: "damage", power: 80, mode: "active", iconKey: "fireball", desc: "凝聚熾熱爆炎火球轟擊目標" },
    "通暢氣脈": { skillId: "physical_enchant_dex", name: "通暢氣脈", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "dex", amount: 5, duration: 300, mode: "passive", iconKey: "physical_enchant_dex", desc: "打通全身筋脈，敏捷 DEX+5" },
    "力量提升": { skillId: "physical_enchant_str", name: "力量提升", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "str", amount: 5, duration: 300, mode: "passive", iconKey: "physical_enchant", desc: "激發肉體肌力，力量 STR+5" },
    "寒冰氣息": { skillId: "ice_breath", name: "寒冰氣息", circle: 2, school: "common", category: "common", reqLv: 16, tier: 2, mpCost: 14, hpCost: 0, materialCost: "無", cooldown: 2500, type: "damage", power: 70, mode: "active", iconKey: "ice_dagger", desc: "凝結極寒冰霜噴射打擊目標" },

    // --- 第 3 級一般魔法 (6 招) ---
    "擬似勇氣": { skillId: "fake_brave", name: "擬似勇氣", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 30000, type: "buff", stat: "dex", amount: 2, duration: 120, mode: "active", iconKey: "haste", desc: "短暫激發神經加速反應，提升攻速" },
    "極光雷電": { skillId: "lightning_strike", name: "極光雷電", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 18, hpCost: 0, materialCost: "無", cooldown: 3000, type: "damage", power: 100, mode: "active", iconKey: "lightning", desc: "召喚金色極光雷弧穿擊目標" },
    "起死回生術": { skillId: "turn_undead", name: "起死回生術", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 4000, type: "damage", power: 130, mode: "active", iconKey: "disintegrate", desc: "超渡不死生物，對不死系造成毀滅打擊" },
    "中級治癒術": { skillId: "extra_heal", name: "中級治癒術", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 18, hpCost: 0, materialCost: "無", cooldown: 3000, type: "heal", power: 120, mode: "active", iconKey: "extra_heal", desc: "中度神聖治癒術，回復適量生命值" },
    "闇盲術": { skillId: "curse_blind", name: "闇盲術", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 15000, type: "buff", stat: "hit", amount: -5, duration: 60, mode: "active", iconKey: "true_target", desc: "奪取目標視野，大幅降低其攻擊命中" },
    "鎧甲護持": { skillId: "blessed_armor", name: "鎧甲護持", circle: 3, school: "common", category: "common", reqLv: 24, tier: 3, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "ac", amount: -3, duration: 300, mode: "passive", iconKey: "solid_carriage", desc: "祝福自身防具甲冑，防禦 AC-3" },

    // --- 第 4 級一般魔法 (6 招) ---
    "高級治癒術": { skillId: "greater_heal", name: "高級治癒術", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 30, hpCost: 0, materialCost: "無", cooldown: 4000, type: "heal", power: 180, mode: "active", iconKey: "greater_heal", desc: "神聖高級急救神術，大量回復生命值" },
    "燃燒的火球": { skillId: "burning_fireball", name: "燃燒的火球", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 22, hpCost: 0, materialCost: "無", cooldown: 3500, type: "damage", power: 130, mode: "active", iconKey: "fireball", desc: "極巨型熾熱火焰爆裂球轟殺目標" },
    "通透術": { skillId: "clairvoyance", name: "通透術", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "hit", amount: 3, duration: 300, mode: "passive", iconKey: "true_target", desc: "看穿目標防禦弱點，命中率+3" },
    "冥想術": { skillId: "meditation", name: "冥想術", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 15, hpCost: 0, materialCost: "無", cooldown: 60000, type: "buff", stat: "wis", amount: 3, duration: 300, mode: "passive", iconKey: "meditation", desc: "進入深度禪定冥想，精神 WIS+3" },
    "壞物術": { skillId: "weapon_break", name: "壞物術", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 20000, type: "buff", stat: "ac", amount: -2, duration: 60, mode: "active", iconKey: "shock_stun", desc: "破壞對手兵器鋒芒，削弱目標威脅" },
    "吸血鬼之吻": { skillId: "vampiric_touch", name: "吸血鬼之吻", circle: 4, school: "common", category: "common", reqLv: 32, tier: 4, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 5000, type: "damage", power: 80, mode: "active", iconKey: "cure_poison", desc: "吸取目標生命精華回復自身 HP" },

    // --- 第 5 級一般魔法 (6 招) ---
    "聖潔之光": { skillId: "remove_curse", name: "聖潔之光", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 10000, type: "heal", mode: "active", iconKey: "remove_curse", desc: "聖潔驅魔光輝，淨化詛咒、石化與麻痺狀態" },
    "冰雪暴": { skillId: "blizzard", name: "冰雪暴", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 35, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 6000, type: "damage", power: 220, mode: "active", iconKey: "blizzard", desc: "召喚廣域暴風雪極寒霜凍打擊目標" },
    "沉睡之霧": { skillId: "fog_of_sleeping", name: "沉睡之霧", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 25, hpCost: 0, materialCost: "無", cooldown: 15000, type: "buff", duration: 30, mode: "active", iconKey: "meditation", desc: "散播催眠迷霧使敵方陷入沉睡" },
    "緩速術": { skillId: "slow", name: "緩速術", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 20, hpCost: 0, materialCost: "無", cooldown: 12000, type: "buff", stat: "dex", amount: -3, duration: 60, mode: "active", iconKey: "water_life", desc: "重力泥沼縛鎖目標，大幅降低其敏捷與速度" },
    "召喚術": { skillId: "summon_monster", name: "召喚術", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 30, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 60000, type: "buff", stat: "hit", amount: 4, duration: 180, mode: "active", iconKey: "royal_blood", desc: "異界僕從使魔契約召喚，協助戰鬥" },
    "極道落雷": { skillId: "lightning", name: "極道落雷", circle: 5, school: "common", category: "common", reqLv: 40, tier: 5, mpCost: 25, hpCost: 0, materialCost: "無", cooldown: 4000, type: "damage", power: 160, mode: "active", iconKey: "lightning", desc: "召喚黑紫狂雷貫穿目標" },

    // --- 第 6 級一般魔法 (6 招) ---
    "加速術": { skillId: "haste", name: "加速術", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 25, hpCost: 0, materialCost: "無", cooldown: 45000, type: "buff", stat: "dex", amount: 4, duration: 180, mode: "active", iconKey: "haste", desc: "正統全速奔馳疾風魔法，大幅提升攻擊與移動速度" },
    "地裂術": { skillId: "earthquake", name: "地裂術", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 35, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 5000, type: "damage", power: 240, mode: "active", iconKey: "elemental_earth", desc: "地動山搖剛石迸裂，粉碎目標大地之怒" },
    "魔法相消術": { skillId: "cancel", name: "魔法相消術", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 40, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 20000, type: "buff", mode: "active", iconKey: "silence", desc: "瓦解並消除目標身上所有的增益魔法效果" },
    "強力加速術": { skillId: "greater_haste", name: "強力加速術", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 35, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 60000, type: "buff", stat: "dex", amount: 6, duration: 240, mode: "active", iconKey: "haste", desc: "極限狂暴疾行，獲得最高階速度增幅" },
    "魔法屏障": { skillId: "magic_barrier", name: "魔法屏障", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 30, hpCost: 0, materialCost: "魔力之石 x1", cooldown: 60000, type: "buff", stat: "mr", amount: 20, duration: 300, mode: "passive", iconKey: "immune_to_harm", desc: "凝聚神聖魔力反彈屏障，魔法防禦 MR+20" },
    "創造怪物": { skillId: "make_monster", name: "創造怪物", circle: 6, school: "common", category: "common", reqLv: 48, tier: 6, mpCost: 45, hpCost: 0, materialCost: "魔力之石 x2", cooldown: 60000, type: "buff", stat: "str", amount: 5, duration: 180, mode: "active", iconKey: "shock_stun", desc: "操縱生命之泥創造怪物傀儡戰隊" }
  },
  villages: {
    ti_village: {
      name: "說話之島村莊",
      shops: [
        { title: "雜貨商・潘朵拉", desc: "新手冒險藥水、回捲與普通箭矢", items: ["紅色藥水", "澄色藥水", "藍色藥水", "綠色藥水", "傳送回家的卷軸", "瞬間移動卷軸", "箭", "魔力之石"] },
        { title: "鐵匠・亞特巴", desc: "基礎鋼鐵兵器與防具", items: ["短劍", "闊劍", "皮背心", "木盾", "侏儒圓盾"] },
        { title: "技能導師・梅林", desc: "販售 1~6 級官方正統魔法書與魔力之石", items: ["魔法書(光箭術)", "魔法書(初級治癒術)", "魔法書(保護罩)", "魔法書(初級加速術)", "魔法書(解毒術)", "魔法書(火球術)", "魔法書(極道落雷)", "魔法書(高級治癒術)", "魔法書(體魄強健術)", "魔法書(加速術)", "魔法書(祝福魔法武器)", "魔法書(體力回復術)", "魔法書(聖結界)", "魔法書(究極光裂術)", "魔力之石"] }
      ]
    },
    elf_forest: {
      name: "妖精森林母樹村莊",
      shops: [
        { title: "精靈神匠・娜魯帕", desc: "妖精專屬精靈金屬鎧甲、弓箭與神兵", items: ["精靈金屬鎧甲", "獵人之弓", "十字弓", "箭", "銀箭", "銀長劍"] },
        { title: "母樹守護者・精靈使", desc: "森林天然靈藥與解毒翡翠藥水", items: ["紅色藥水", "澄色藥水", "綠色藥水", "翡翠藥水", "瞬間移動卷軸", "傳送回家的卷軸", "精靈玉"] },
        { title: "精靈導師・艾羅溫", desc: "研習妖精專屬精靈水晶與精靈玉", items: ["精靈水晶(三重矢)", "精靈水晶(魂體轉換)", "精靈水晶(風之疾走)", "精靈水晶(暴風神射)", "精靈水晶(大地的祝福)", "精靈水晶(大地防護)", "精靈水晶(烈炎武器)", "精靈水晶(自然之祝福)", "精靈水晶(屬性之火)", "精靈水晶(屬性之水)", "精靈水晶(屬性之風)", "精靈水晶(屬性之地)", "精靈水晶(水之元氣)", "精靈水晶(魔法防禦)", "精靈玉"] }
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

// ---------------- 經典天堂 1 像素圖標對應系統 (16-bit 32x32 Pixel Icons) ----------------
// ---------------- 經典天堂 1 純淨像素圖標對應系統 (16-bit 32x32 Pixel Icons, 無任何中英文字) ----------------
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
  "巴風特魔杖": { sheet: "items", c: 3, r: 1 },

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

  // 🥋 斗篷 (acc)
  "抗魔法斗篷": { sheet: "acc", c: 4, r: 4 },
  "保護者斗篷": { sheet: "acc", c: 5, r: 4 },
  "隱身斗篷": { sheet: "acc", c: 4, r: 5 },

  // 🧤 手套與靴子
  "皮手套": { sheet: "acc", c: 4, r: 5 },
  "腕甲": { sheet: "acc", c: 4, r: 5 },
  "力量手套": { sheet: "acc", c: 4, r: 5 },
  "塞尼斯手套": { sheet: "acc", c: 4, r: 5 },
  "皮長靴": { sheet: "acc", c: 0, r: 1 },
  "鐵高跟靴": { sheet: "acc", c: 0, r: 1 },
  "敏捷魔法長靴": { sheet: "acc", c: 1, r: 1 },

  // 💍 飾品配件 (acc: 6x6)
  "力量項鍊": { sheet: "acc", c: 0, r: 3 },
  "敏捷項鍊": { sheet: "acc", c: 1, r: 3 },
  "智力項鍊": { sheet: "acc", c: 2, r: 3 },
  "骷髏項鍊": { sheet: "acc", c: 3, r: 3 },
  "妖魔戰士耳環": { sheet: "acc", c: 3, r: 3 },
  "骷髏耳環": { sheet: "acc", c: 2, r: 4 },
  "抗魔戒指": { sheet: "acc", c: 4, r: 3 },
  "巨蟻女皇戒指": { sheet: "acc", c: 0, r: 4 },
  "瞬間移動控制戒指": { sheet: "acc", c: 1, r: 4 },
  "皮腰帶": { sheet: "acc", c: 5, r: 3 },
  "多羅皮帶": { sheet: "acc", c: 5, r: 4 },
  "歐吉皮帶": { sheet: "acc", c: 5, r: 4 },
  "力量符石": { sheet: "acc", c: 2, r: 5 },
  "敏捷符石": { sheet: "acc", c: 3, r: 5 },

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
  "妖魔圖騰": { sheet: "mat", c: 1, r: 4 },
  "金幣": { sheet: "mat", c: 2, r: 1 }
};

function getItemIconStyle(itemName) {
  if (!itemName) return "";
  let cleanName = itemName.replace(/^\+\d+\s*/, "").trim();

  let cfg = ITEM_SPRITE_CONFIG[cleanName];

  // 智慧配對技能書、精靈水晶與特殊秘典
  if (!cfg) {
    if (cleanName.includes("精靈水晶")) {
      if (cleanName.includes("風") || cleanName.includes("暴風") || cleanName.includes("三重矢")) {
        cfg = { sheet: "mat", c: 3, r: 0 }; // 綠色風之水晶
      } else if (cleanName.includes("水") || cleanName.includes("生命") || cleanName.includes("泉")) {
        cfg = { sheet: "mat", c: 4, r: 0 }; // 藍色水滴水晶
      } else if (cleanName.includes("地") || cleanName.includes("大地") || cleanName.includes("鋼鐵") || cleanName.includes("體魄")) {
        cfg = { sheet: "mat", c: 0, r: 1 }; // 褐色地之水晶
      } else if (cleanName.includes("火") || cleanName.includes("烈炎") || cleanName.includes("灼熱")) {
        cfg = { sheet: "mat", c: 1, r: 1 }; // 赤焰火之水晶
      } else {
        cfg = { sheet: "mat", c: 3, r: 0 };
      }
    } else if (cleanName.includes("魔法書")) {
      if (cleanName.includes("地裂") || cleanName.includes("相消") || cleanName.includes("極道落雷") || cleanName.includes("冰雪暴") || cleanName.includes("聖潔") || cleanName.includes("強力加速") || cleanName.includes("創造怪物")) {
        cfg = { sheet: "mat", c: 1, r: 0 }; // 藍皮高階魔法書
      } else {
        cfg = { sheet: "mat", c: 0, r: 0 }; // 紅皮經典魔法書
      }
    } else if (cleanName.includes("技術書") || cleanName.includes("魔典")) {
      cfg = { sheet: "mat", c: 2, r: 0 }; // 黑皮禁忌之書
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

  if (cfg.sheet === "acc") {
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

if (typeof window !== "undefined") {
  window.DB = DB;
  window.CLASS_PRESETS = CLASS_PRESETS;
  window.ITEM_SPRITE_CONFIG = ITEM_SPRITE_CONFIG;
  window.getItemIconStyle = getItemIconStyle;
  window.getItemIconHtml = getItemIconHtml;
}