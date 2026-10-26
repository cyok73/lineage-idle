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
  "技術書(衝擊之暈)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 300000,
    "skill": "衝擊之暈",
    "desc": "習得騎士神技：衝擊之暈 (揮斬暈眩目標)"
  },
  "技術書(堅固防護)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 120000,
    "skill": "堅固防護",
    "desc": "習得騎士防護技術：堅固防護 (自身防禦 AC-2)"
  },
  "技術書(反擊屏障)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 800000,
    "skill": "反擊屏障",
    "desc": "習得騎士終極神技：反擊屏障 (反彈近身物理攻擊)"
  },
  "技術書(增幅防禦)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "增幅防禦",
    "desc": "習得騎士強化技術：增幅防禦 (盾牌 AC額外-3)"
  },
  "技術書(狂暴將軍)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 250000,
    "skill": "狂暴將軍",
    "desc": "習得騎士狂暴技術：狂暴將軍 (力量 STR+3)"
  },
  "皇家魔典(精準目標)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 30000,
    "skill": "精準目標",
    "desc": "習得王族鎖定技術：精準目標 (命中+5)"
  },
  "皇家魔典(皇家血統)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 60000,
    "skill": "皇家血統",
    "desc": "習得王族被動體魄：皇家血統 (HP+50)"
  },
  "皇家魔典(激勵士氣)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "激勵士氣",
    "desc": "習得王族戰術光環：激勵士氣"
  },
  "精靈水晶(魔法防禦)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 50000,
    "skill": "魔法防禦",
    "desc": "習得共通精靈秘技：魔法防禦 (MR+10)"
  },
  "精靈水晶(心靈轉換)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 60000,
    "skill": "心靈轉換",
    "desc": "習得共通精靈秘技：心靈轉換 (HP 換 MP)"
  },
  "精靈水晶(世界樹的呼喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "世界樹的呼喚",
    "desc": "習得共通精靈秘技：世界樹的呼喚 (瞬間返鄉)"
  },
  "精靈水晶(淨化精神)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 100000,
    "skill": "淨化精神",
    "desc": "習得共通精靈秘技：淨化精神 (WIS+2)"
  },
  "精靈水晶(屬性防禦)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 120000,
    "skill": "屬性防禦",
    "desc": "習得共通精靈秘技：屬性防禦 (MR+15)"
  },
  "精靈水晶(釋放術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 150000,
    "skill": "釋放術",
    "desc": "習得共通精靈秘技：釋放術 (淨化異常)"
  },
  "精靈水晶(魂體轉換)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 250000,
    "skill": "魂體轉換",
    "desc": "習得共通妖精永動神技：魂體轉換 (HP 換 15 MP)"
  },
  "精靈水晶(單屬性防禦)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "單屬性防禦",
    "desc": "習得共通精靈秘技：單屬性防禦 (MR+20)"
  },
  "精靈水晶(風之神速)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "風之神速",
    "desc": "習得風系精靈秘技：風之神速 (DEX+2)"
  },
  "精靈水晶(風之疾走)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 180000,
    "skill": "風之疾走",
    "desc": "習得風系精靈秘技：風之疾走 (DEX+3 / 疾走加速)"
  },
  "精靈水晶(暴風神射)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 220000,
    "skill": "暴風神射",
    "desc": "習得風系弓手核心：暴風神射 (遠程命中+6/傷害增加)"
  },
  "精靈水晶(風之枷鎖)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "風之枷鎖",
    "desc": "習得風系精靈秘技：風之枷鎖 (延遲敵方攻速)"
  },
  "精靈水晶(暴風疾馳)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 280000,
    "skill": "暴風疾馳",
    "desc": "習得風系精靈秘技：暴風疾馳 (DEX+5)"
  },
  "精靈水晶(三重矢)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 300000,
    "skill": "三重矢",
    "desc": "習得妖精王道神技：三重矢 (瞬間連續三發箭矢)"
  },
  "精靈水晶(風之精靈召喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "風之精靈召喚",
    "desc": "習得上位風精靈契約召喚"
  },
  "精靈水晶(水之元氣)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 160000,
    "skill": "水之元氣",
    "desc": "習得水系精靈秘技：水之元氣 (WIS+3)"
  },
  "精靈水晶(生命之泉)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 150000,
    "skill": "生命之泉",
    "desc": "習得水系精靈秘技：生命之泉 (甘霖急救)"
  },
  "精靈水晶(生命的祝福)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "生命的祝福",
    "desc": "習得水系核心神技：生命的祝福 (全隊大補血)"
  },
  "精靈水晶(自然之祝福)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "生命的祝福",
    "desc": "習得水系核心神技：生命的祝福 (同名水晶)"
  },
  "精靈水晶(水之防護)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 180000,
    "skill": "水之防護",
    "desc": "習得水系精靈秘技：水之防護 (AC-4)"
  },
  "精靈水晶(污濁之水)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 260000,
    "skill": "污濁之水",
    "desc": "習得水系精靈秘技：污濁之水 (敵方治癒減半)"
  },
  "精靈水晶(水之精靈召喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "水之精靈召喚",
    "desc": "習得上位水精靈契約召喚"
  },
  "精靈水晶(大地防護)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "大地防護",
    "desc": "習得地系精靈秘技：大地防護 (AC-4)"
  },
  "精靈水晶(大地祝福)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "大地祝福",
    "desc": "習得地系精靈秘技：大地祝福 (全隊防禦 AC-5)"
  },
  "精靈水晶(大地的祝福)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "大地祝福",
    "desc": "習得地系精靈秘技：大地祝福 (同名水晶)"
  },
  "精靈水晶(鋼鐵防護)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 280000,
    "skill": "鋼鐵防護",
    "desc": "習得地系精靈秘技：鋼鐵防護 (AC-8)"
  },
  "精靈水晶(體魄強健)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 150000,
    "skill": "體魄強健",
    "desc": "習得地系精靈秘技：體魄強健 (STR+5)"
  },
  "精靈水晶(大地屏障)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 300000,
    "skill": "大地屏障",
    "desc": "習得地系精靈秘技：大地屏障 (石化禁錮)"
  },
  "精靈水晶(大地精靈召喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "大地精靈召喚",
    "desc": "習得上位大地精靈契約召喚"
  },
  "精靈水晶(地之精靈召喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "大地精靈召喚",
    "desc": "習得上位大地精靈契約召喚"
  },
  "精靈水晶(火熱武器)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 100000,
    "skill": "火熱武器",
    "desc": "習得火系精靈秘技：火熱武器 (命中+3)"
  },
  "精靈水晶(烈炎氣息)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 120000,
    "skill": "烈炎氣息",
    "desc": "習得火系精靈秘技：烈炎氣息 (火焰打擊)"
  },
  "精靈水晶(烈炎武器)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 180000,
    "skill": "烈炎武器",
    "desc": "習得火系近戰核心：烈炎武器 (命中+5)"
  },
  "精靈水晶(灼熱靈魂)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 300000,
    "skill": "灼熱靈魂",
    "desc": "習得火系烈魂妖神技：灼熱靈魂 (極限傷害/STR+6)"
  },
  "精靈水晶(火之精靈召喚)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "火之精靈召喚",
    "desc": "習得上位烈火精靈契約召喚"
  },
  "魔法書(光術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 3000,
    "skill": "光術",
    "desc": "習得 1 級神聖照明魔法"
  },
  "魔法書(光箭術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 3000,
    "skill": "光術",
    "desc": "習得 1 級神聖光術 (同名書冊)"
  },
  "魔法書(保護罩)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 5000,
    "skill": "保護罩",
    "desc": "習得 1 級防護能量盾 (AC-2)"
  },
  "魔法書(指定傳送)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 8000,
    "skill": "指定傳送",
    "desc": "習得 1 級空間座標瞬移"
  },
  "魔法書(冰箭)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 6000,
    "skill": "冰箭",
    "desc": "習得 1 級寒冰穿刺之箭"
  },
  "魔法書(風刃)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 6000,
    "skill": "風刃",
    "desc": "習得 1 級疾風破空風刃"
  },
  "魔法書(神聖武器)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 8000,
    "skill": "神聖武器",
    "desc": "習得 1 級神聖兵刃附魔 (命中+1)"
  },
  "魔法書(解毒術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 10000,
    "skill": "解毒術",
    "desc": "習得 1 級解毒淨化神術"
  },
  "魔法書(盾牌術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 8000,
    "skill": "盾牌術",
    "desc": "習得 1 級堅定盾牌術 (AC-2)"
  },
  "魔法書(初級治癒術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 12000,
    "skill": "初級治癒術",
    "desc": "習得 2 級神聖回復魔法"
  },
  "魔法書(日光術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 15000,
    "skill": "日光術",
    "desc": "習得 2 級白晝日光術"
  },
  "魔法書(火球術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 20000,
    "skill": "火球術",
    "desc": "習得 2 級火系爆裂球"
  },
  "魔法書(通暢氣脈)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 30000,
    "skill": "通暢氣脈",
    "desc": "習得 2 級經絡通暢術 (DEX+5)"
  },
  "魔法書(力量提升)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 30000,
    "skill": "力量提升",
    "desc": "習得 2 級肉體肌力激發 (STR+5)"
  },
  "魔法書(寒冰氣息)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 25000,
    "skill": "寒冰氣息",
    "desc": "習得 2 級極寒冰霜噴射"
  },
  "魔法書(擬似勇氣)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 40000,
    "skill": "擬似勇氣",
    "desc": "習得 3 級神經攻速加速 (DEX+2)"
  },
  "魔法書(極光雷電)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 50000,
    "skill": "極光雷電",
    "desc": "習得 3 級金色極光雷弧"
  },
  "魔法書(起死回生術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 60000,
    "skill": "起死回生術",
    "desc": "習得 3 級超渡不死系神術"
  },
  "魔法書(中級治癒術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 50000,
    "skill": "中級治癒術",
    "desc": "習得 3 級中度急救神術"
  },
  "魔法書(闇盲術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 45000,
    "skill": "闇盲術",
    "desc": "習得 3 級奪取視野詛咒 (命中-5)"
  },
  "魔法書(鎧甲護持)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 50000,
    "skill": "鎧甲護持",
    "desc": "習得 3 級甲冑祝福護持 (AC-3)"
  },
  "魔法書(高級治癒術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "高級治癒術",
    "desc": "習得 4 級神聖大回復術"
  },
  "魔法書(燃燒的火球)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 90000,
    "skill": "燃燒的火球",
    "desc": "習得 4 級極巨爆炎火球"
  },
  "魔法書(通透術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 70000,
    "skill": "通透術",
    "desc": "習得 4 級洞察弱點術 (命中+3)"
  },
  "魔法書(冥想術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 80000,
    "skill": "冥想術",
    "desc": "習得 4 級深度禪定 (WIS+3)"
  },
  "魔法書(壞物術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 75000,
    "skill": "壞物術",
    "desc": "習得 4 級兵刃損壞詛咒"
  },
  "魔法書(吸血鬼之吻)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 90000,
    "skill": "吸血鬼之吻",
    "desc": "習得 4 級生命汲取魔咒"
  },
  "魔法書(聖潔之光)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 120000,
    "skill": "聖潔之光",
    "desc": "習得 5 級聖潔淨化除咒光芒"
  },
  "魔法書(冰雪暴)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 180000,
    "skill": "冰雪暴",
    "desc": "習得 5 級廣域極寒霜暴"
  },
  "魔法書(沉睡之霧)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 130000,
    "skill": "沉睡之霧",
    "desc": "習得 5 級催眠昏睡之霧"
  },
  "魔法書(緩速術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 120000,
    "skill": "緩速術",
    "desc": "習得 5 級泥沼縛鎖遲緩"
  },
  "魔法書(召喚術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "召喚術",
    "desc": "習得 5 級異界使魔契約召喚"
  },
  "魔法書(極道落雷)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 150000,
    "skill": "極道落雷",
    "desc": "習得 5 級紫電狂雷破壞"
  },
  "技能書(極道落雷)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 150000,
    "skill": "極道落雷",
    "desc": "習得 5 級紫電狂雷破壞 (別名)"
  },
  "魔法書(加速術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 200000,
    "skill": "加速術",
    "desc": "習得 6 級正統全速奔馳疾風魔法"
  },
  "魔法書(地裂術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 250000,
    "skill": "地裂術",
    "desc": "習得 6 級地動山搖剛石迸裂"
  },
  "魔法書(魔法相消術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 300000,
    "skill": "魔法相消術",
    "desc": "習得 6 級增益消解法術"
  },
  "魔法書(強力加速術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 320000,
    "skill": "強力加速術",
    "desc": "習得 6 級極限狂暴疾行 (DEX+6)"
  },
  "魔法書(魔法屏障)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 280000,
    "skill": "魔法屏障",
    "desc": "習得 6 級神聖反彈屏障 (MR+20)"
  },
  "魔法書(創造怪物)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 350000,
    "skill": "創造怪物",
    "desc": "習得 6 級操縱生命之泥創造怪物傀儡"
  },
  "魔法書(聖結界)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 500000,
    "skill": "聖結界",
    "desc": "法師神技：受擊傷害減免 50%"
  },
  "魔法書(究極光裂術)": {
    "type": "spellbook",
    "tier": "scroll",
    "weight": 5,
    "price": 2000000,
    "skill": "究極光裂術",
    "desc": "法師終極單體毀滅魔法"
  },
  "妖魔圖騰": {
    "type": "etc",
    "tier": "mat",
    "weight": 1,
    "price": 200,
    "desc": "燃柳村羅浮專用高價收購圖騰"
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
  "巴風特魔杖": {
    "type": "weapon",
    "tier": "blue",
    "slot": "weapon",
    "small": 2,
    "large": 3,
    "safe": 6,
    "material": "wood",
    "extraDmg": 3,
    "intBonus": 1,
    "weight": 30,
    "price": 100000
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
  "妖魔戰士耳環": {
    "type": "accessory",
    "tier": "white",
    "slot": "earring",
    "ac": 0,
    "hpBonus": 20,
    "weight": 5,
    "price": 15000,
    "desc": "生命 HP+20"
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
  "巨蟻女皇戒指": {
    "type": "accessory",
    "tier": "blue",
    "slot": "ring",
    "ac": 0,
    "hpBonus": 30,
    "weightMultiplier": 1.1,
    "weight": 5,
    "price": 300000,
    "desc": "HP+30，負重+10%"
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
  }
};

window.DB.villages = {
  "ti_village": {
    "name": "說話之島村莊",
    "shops": [
      {
        "title": "雜貨商・潘朵拉",
        "desc": "新手冒險藥水、回捲與普通箭矢",
        "items": [
          "紅色藥水",
          "澄色藥水",
          "藍色藥水",
          "綠色藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸",
          "箭",
          "魔力之石"
        ]
      },
      {
        "title": "鐵匠・亞特巴",
        "desc": "基礎鋼鐵兵器與防具",
        "items": [
          "短劍",
          "闊劍",
          "皮背心",
          "木盾",
          "侏儒圓盾"
        ]
      },
      {
        "title": "技能導師・梅林",
        "desc": "販售 1~6 級官方正統魔法書與魔力之石",
        "items": [
          "魔法書(光箭術)",
          "魔法書(初級治癒術)",
          "魔法書(保護罩)",
          "魔法書(初級加速術)",
          "魔法書(解毒術)",
          "魔法書(火球術)",
          "魔法書(極道落雷)",
          "魔法書(高級治癒術)",
          "魔法書(體魄強健術)",
          "魔法書(加速術)",
          "魔法書(祝福魔法武器)",
          "魔法書(體力回復術)",
          "魔法書(聖結界)",
          "魔法書(究極光裂術)",
          "魔力之石"
        ]
      }
    ]
  },
  "elf_forest": {
    "name": "妖精森林母樹村莊",
    "shops": [
      {
        "title": "精靈神匠・娜魯帕",
        "desc": "妖精專屬精靈金屬鎧甲、弓箭與神兵",
        "items": [
          "精靈金屬鎧甲",
          "獵人之弓",
          "十字弓",
          "箭",
          "銀箭",
          "銀長劍"
        ]
      },
      {
        "title": "母樹守護者・精靈使",
        "desc": "森林天然靈藥與解毒翡翠藥水",
        "items": [
          "紅色藥水",
          "澄色藥水",
          "綠色藥水",
          "翡翠藥水",
          "瞬間移動卷軸",
          "傳送回家的卷軸",
          "精靈玉"
        ]
      },
      {
        "title": "精靈導師・艾羅溫",
        "desc": "研習妖精專屬精靈水晶與精靈玉",
        "items": [
          "精靈水晶(三重矢)",
          "精靈水晶(魂體轉換)",
          "精靈水晶(風之疾走)",
          "精靈水晶(暴風神射)",
          "精靈水晶(大地的祝福)",
          "精靈水晶(大地防護)",
          "精靈水晶(烈炎武器)",
          "精靈水晶(自然之祝福)",
          "精靈水晶(屬性之火)",
          "精靈水晶(屬性之水)",
          "精靈水晶(屬性之風)",
          "精靈水晶(屬性之地)",
          "精靈水晶(水之元氣)",
          "精靈水晶(魔法防禦)",
          "精靈玉"
        ]
      }
    ]
  },
  "werner_village_town": {
    "name": "燃柳妖魔部落村莊",
    "shops": [
      {
        "title": "高價收購商・羅浮",
        "desc": "高價回收【妖魔圖騰】(200 金幣/個)，並販售戰備補給",
        "items": [
          "紅色藥水",
          "澄色藥水",
          "綠色藥水",
          "箭",
          "銀箭",
          "傳送回家的卷軸"
        ]
      },
      {
        "title": "部落鐵匠・都達瑪拉",
        "desc": "妖魔戰士常用兵器與皮背心",
        "items": [
          "短劍",
          "闊劍",
          "長劍",
          "皮背心",
          "木盾"
        ]
      }
    ]
  },
  "gludio_village": {
    "name": "古魯丁港口村莊",
    "shops": [
      {
        "title": "港口雜貨商・露西亞",
        "desc": "販售騎士狂暴勇水與強力白水",
        "items": [
          "紅色藥水",
          "白色藥水",
          "勇敢藥水",
          "綠色藥水",
          "藍色藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸"
        ]
      },
      {
        "title": "重裝武器坊・杜巴",
        "desc": "骷髏套裝與大馬士革刀",
        "items": [
          "長劍",
          "銀長劍",
          "大馬士革刀",
          "骷髏頭盔",
          "骷髏盾牌",
          "骷髏盔甲",
          "鎖子甲"
        ]
      }
    ]
  },
  "kent_village": {
    "name": "肯特城堡村莊",
    "shops": [
      {
        "title": "城堡雜貨商・艾莉絲",
        "desc": "妖精遠程破邪銀箭與必備補給",
        "items": [
          "紅色藥水",
          "白色藥水",
          "銀箭",
          "翡翠藥水",
          "綠色藥水",
          "勇敢藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸"
        ]
      },
      {
        "title": "城堡軍需官・克林特",
        "desc": "精靈神兵、十字弓與抗魔斗篷",
        "items": [
          "獵人之弓",
          "十字弓",
          "雙手劍",
          "抗魔法斗篷",
          "精靈金屬鎧甲"
        ]
      }
    ]
  },
  "windwood_village": {
    "name": "風木綠洲村莊",
    "shops": [
      {
        "title": "沙漠商隊・哈桑",
        "desc": "沙漠探險解毒翡翠藥水與物資",
        "items": [
          "紅色藥水",
          "澄色藥水",
          "白色藥水",
          "翡翠藥水",
          "綠色藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸",
          "箭",
          "銀箭"
        ]
      }
    ]
  },
  "giran_village": {
    "name": "奇岩商業都市中心",
    "shops": [
      {
        "title": "奇岩名譽雜貨商・馬斯克",
        "desc": "高級補給與每日限量武防卷軸",
        "items": [
          "紅色藥水",
          "白色藥水",
          "勇敢藥水",
          "藍色藥水",
          "對武器施法的卷軸",
          "對防具施法的卷軸",
          "傳送回家的卷軸",
          "瞬間移動卷軸"
        ]
      },
      {
        "title": "工坊神兵大師・莫里",
        "desc": "瑟魯基之劍、力量手套與稀世魔法書",
        "items": [
          "瑟魯基之劍",
          "大馬士革刀",
          "雙手劍",
          "力量手套",
          "魔法書(高級治癒術)",
          "魔法書(體魄強健術)"
        ]
      }
    ]
  },
  "silver_knight_village": {
    "name": "銀騎士村莊",
    "shops": [
      {
        "title": "銀騎軍需官・蘭斯洛特",
        "desc": "騎士訓練所補給與銀製裝備",
        "items": [
          "紅色藥水",
          "白色藥水",
          "勇敢藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸",
          "銀長劍",
          "力量手套"
        ]
      },
      {
        "title": "銀騎鐵匠・杜蘭",
        "desc": "銀騎士專用武器與重甲",
        "items": [
          "大馬士革刀",
          "雙手劍",
          "銀原石",
          "精靈金屬鎧甲",
          "抗魔法斗篷"
        ]
      }
    ]
  },
  "heine_village": {
    "name": "海音村莊",
    "shops": [
      {
        "title": "海音雜貨商・瑪琳",
        "desc": "水都補給與魔法書",
        "items": [
          "紅色藥水",
          "白色藥水",
          "藍色藥水",
          "翡翠藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸",
          "魔法書(高級治癒術)"
        ]
      },
      {
        "title": "海音武器坊・卡西",
        "desc": "水底探險武器與防具",
        "items": [
          "銀長劍",
          "十字弓",
          "瑟魯基之劍",
          "抗魔法斗篷",
          "精靈金屬鎧甲"
        ]
      }
    ]
  },
  "werden_village": {
    "name": "威頓村莊",
    "shops": [
      {
        "title": "威頓補給商・阿格",
        "desc": "火龍窟探險補給",
        "items": [
          "紅色藥水",
          "白色藥水",
          "勇敢藥水",
          "翡翠藥水",
          "傳送回家的卷軸",
          "瞬間移動卷軸"
        ]
      },
      {
        "title": "威頓鐵匠・凡恩",
        "desc": "抗火裝備與高階武器",
        "items": [
          "瑟魯基之劍",
          "大馬士革刀",
          "雙手劍",
          "力量手套",
          "抗魔法斗篷"
        ]
      }
    ]
  }
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
  "妖魔戰士耳環": { sheet: "acc", c: 3, r: 3 },
  "骷髏耳環": { sheet: "acc", c: 2, r: 4 },
  "抗魔戒指": { sheet: "acc", c: 4, r: 3 },
  "巨蟻女皇戒指": { sheet: "acc", c: 0, r: 4 },
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
