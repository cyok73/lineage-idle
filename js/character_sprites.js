// js/character_sprites.js - 暗黑破壞神五大經典職業 2.5D 高畫質像素精靈圖程序化烘焙引擎
// (支援野蠻人、魔法使、聖騎士、死靈法師、亞馬遜；每職業 4x4 序列：南跑、側身跑、北跑、攻擊/施法)

(function (window) {
  "use strict";

  const HeroSpriteBaker = {
    cache: {}, // 快取已烘焙完成的 Canvas / Image 物件

    // 五大職業調色盤與特徵設定
    CLASS_CONFIGS: {
      barbarian: {
        name: "野蠻人",
        skin: "#e09f67",
        skinShadow: "#b46c3b",
        hair: "#78350f",
        armor: "#7f1d1d", // 暗紅狂戰厚皮甲
        armorTrim: "#ca8a04",
        cloth: "#451a03",
        weaponType: "dual_axes",
        weaponColor: "#94a3b8",
        weaponTrim: "#ef4444",
        helmType: "horns",
        bodyScale: 1.15
      },
      sorceress: {
        name: "魔法使",
        skin: "#fcd34d",
        skinShadow: "#d97706",
        hair: "#312e81",
        armor: "#581c87", // 神秘紫藍元素法袍
        armorTrim: "#38bdf8",
        cloth: "#3b0764",
        weaponType: "crystal_staff",
        weaponColor: "#78350f",
        weaponTrim: "#c084fc",
        helmType: "tiara",
        bodyScale: 0.95
      },
      paladin: {
        name: "聖騎士",
        skin: "#fed7aa",
        skinShadow: "#ea580c",
        hair: "#451a03",
        armor: "#ca8a04", // 燦金神聖全身板甲
        armorTrim: "#e2e8f0",
        cloth: "#1d4ed8",
        weaponType: "holy_mace_shield",
        weaponColor: "#facc15",
        weaponTrim: "#f8fafc",
        helmType: "winged_helm",
        bodyScale: 1.05
      },
      necromancer: {
        name: "死靈法師",
        skin: "#e2e8f0", // 慘白骨色肌膚
        skinShadow: "#94a3b8",
        hair: "#f8fafc", // 銀白長髮
        armor: "#0f172a", // 漆黑死靈骨袍
        armorTrim: "#10b981",
        cloth: "#020617",
        weaponType: "bone_wand",
        weaponColor: "#f1f5f9",
        weaponTrim: "#34d399",
        helmType: "bone_crown",
        bodyScale: 0.98
      },
      amazon: {
        name: "亞馬遜",
        skin: "#fed7aa",
        skinShadow: "#d97706",
        hair: "#eab308", // 金色高馬尾
        armor: "#991b1b", // 猩紅獵裝皮鱗甲
        armorTrim: "#ca8a04",
        cloth: "#15803d",
        weaponType: "war_bow",
        weaponColor: "#ca8a04",
        weaponTrim: "#fef08a",
        helmType: "feather_circlet",
        bodyScale: 1.0
      }
    },

    // 取得指定職業的 4x4 精靈圖 Canvas 快取 (若無則立即程序化烘焙)
    getSpriteSheet(className) {
      const cls = this.normalizeClass(className);
      if (this.cache[cls]) return this.cache[cls];

      const canvas = this.bakeClassSpritesheet(cls);
      this.cache[cls] = canvas;
      return canvas;
    },

    normalizeClass(cls) {
      if (!cls) return "barbarian";
      const k = String(cls).toLowerCase();
      if (k.includes("barb") || k.includes("野蠻") || k.includes("knight") || k.includes("騎士")) return "barbarian";
      if (k.includes("sorc") || k.includes("法師") || k.includes("mage") || k.includes("魔法")) return "sorceress";
      if (k.includes("pala") || k.includes("聖騎") || k.includes("prince") || k.includes("王族")) return "paladin";
      if (k.includes("necro") || k.includes("死靈")) return "necromancer";
      if (k.includes("ama") || k.includes("亞馬") || k.includes("elf") || k.includes("妖精")) return "amazon";
      return "barbarian";
    },

    // 烘焙 1024x1024 (4行 x 4列, 每格 256x256) 高清暗黑動作精靈圖
    bakeClassSpritesheet(cls) {
      const cfg = this.CLASS_CONFIGS[cls] || this.CLASS_CONFIGS.barbarian;
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      // 4x4 序列渲染：
      // Row 0: 面朝南方（向下正面跑動）
      // Row 1: 面朝東方（向右側面跑動，向左時引擎自動翻轉）
      // Row 2: 面朝北方（向上背面跑動）
      // Row 3: 揮砍 / 施法 / 射箭攻擊動作
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const cellX = c * 256;
          const cellY = r * 256;
          ctx.save();
          ctx.translate(cellX, cellY);
          this.drawSingleFrame(ctx, cls, cfg, r, c);
          ctx.restore();
        }
      }

      return canvas;
    },

    // 繪製單一 256x256 格子內的暗黑英雄角色
    drawSingleFrame(ctx, cls, cfg, row, col) {
      const cx = 128;
      const cy = 145; // 腳底錨點約在 y=210
      const bSc = cfg.bodyScale || 1.0;

      // 行走步伐擺動位移 (0: 站立微動, 1: 右腳前邁, 2: 轉換, 3: 左腳前邁)
      let stride = 0;
      let bob = 0;
      let armSwing = 0;

      if (row < 3) {
        // 跑步動作 (Row 0: 南, Row 1: 東, Row 2: 北)
        if (col === 1) { stride = 14; bob = -3; armSwing = 18; }
        else if (col === 2) { stride = 0; bob = 1; armSwing = 0; }
        else if (col === 3) { stride = -14; bob = -3; armSwing = -18; }
      } else {
        // 攻擊動作 (Row 3: 0蓄力, 1出擊, 2打擊爆發, 3收勢)
        if (col === 0) { bob = -2; armSwing = -24; }
        else if (col === 1) { bob = 3; armSwing = 28; }
        else if (col === 2) { bob = 4; armSwing = 36; }
        else if (col === 3) { bob = 1; armSwing = 10; }
      }

      // --- 1. 地面接觸陰影 ---
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 62, 36 * bSc, 14 * bSc, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- 2. 披風 / 背後裝飾 (背面與側面時先畫在身後) ---
      if (row === 2 || (row === 1 && col !== 1)) {
        this.drawCape(ctx, cx, cy, row, col, cfg, bSc, stride);
      }

      // --- 3. 腿部與戰靴 (Legs & Boots) ---
      this.drawLegs(ctx, cx, cy, row, col, cfg, bSc, stride);

      // --- 4. 軀幹與護甲 (Torso & Armor) ---
      this.drawTorso(ctx, cx, cy + bob, row, col, cfg, bSc);

      // --- 5. 披風 (正面跑步時垂在身後下擺) ---
      if (row === 0) {
        this.drawCape(ctx, cx, cy + bob, row, col, cfg, bSc, stride);
      }

      // --- 6. 頭部與頭盔/髮型 (Head & Helmet) ---
      this.drawHead(ctx, cx, cy + bob, row, col, cfg, bSc);

      // --- 7. 手臂與職業專屬武器 (Arms & Weapons) ---
      this.drawArmsAndWeapons(ctx, cx, cy + bob, row, col, cfg, bSc, armSwing);

      // --- 8. 攻擊幀專屬打擊火花與光效 ---
      if (row === 3 && (col === 1 || col === 2)) {
        this.drawAttackSlashFX(ctx, cx, cy + bob, col, cls, cfg);
      }
    },

    // 繪製披風與長袍下擺
    drawCape(ctx, cx, cy, row, col, cfg, bSc, stride) {
      ctx.fillStyle = cfg.cloth || "#3b0764";
      ctx.beginPath();
      if (row === 2) {
        // 背面長披風
        const sway = stride * 0.4;
        ctx.moveTo(cx - 18 * bSc, cy - 20 * bSc);
        ctx.lineTo(cx + 18 * bSc, cy - 20 * bSc);
        ctx.lineTo(cx + 26 * bSc + sway, cy + 48 * bSc);
        ctx.lineTo(cx - 26 * bSc + sway, cy + 48 * bSc);
      } else if (row === 1) {
        // 側面飄逸披風
        ctx.moveTo(cx - 12 * bSc, cy - 18 * bSc);
        ctx.lineTo(cx - 4 * bSc, cy - 18 * bSc);
        ctx.lineTo(cx - 28 * bSc, cy + 44 * bSc);
        ctx.lineTo(cx - 36 * bSc, cy + 40 * bSc);
      } else {
        // 正面露出兩側飄逸披風下角
        ctx.moveTo(cx - 20 * bSc, cy - 10 * bSc);
        ctx.lineTo(cx - 24 * bSc, cy + 42 * bSc);
        ctx.lineTo(cx - 16 * bSc, cy + 42 * bSc);
        ctx.moveTo(cx + 20 * bSc, cy - 10 * bSc);
        ctx.lineTo(cx + 24 * bSc, cy + 42 * bSc);
        ctx.lineTo(cx + 16 * bSc, cy + 42 * bSc);
      }
      ctx.closePath();
      ctx.fill();
    },

    // 繪製腿部動作
    drawLegs(ctx, cx, cy, row, col, cfg, bSc, stride) {
      ctx.lineWidth = 10 * bSc;
      ctx.lineCap = "round";

      if (row === 1) {
        // 側面奔跑步伐
        ctx.strokeStyle = cfg.skinShadow || "#78350f";
        ctx.beginPath();
        ctx.moveTo(cx - 4 * bSc, cy + 18 * bSc);
        ctx.lineTo(cx - 4 * bSc - stride, cy + 56 * bSc);
        ctx.stroke();

        ctx.strokeStyle = cfg.armorTrim || "#ca8a04";
        ctx.beginPath();
        ctx.moveTo(cx + 4 * bSc, cy + 18 * bSc);
        ctx.lineTo(cx + 4 * bSc + stride, cy + 56 * bSc);
        ctx.stroke();
      } else {
        // 正面或背面步伐
        const lOffset = stride;
        const rOffset = -stride;

        // 左腿
        ctx.strokeStyle = cfg.skinShadow || "#78350f";
        ctx.beginPath();
        ctx.moveTo(cx - 12 * bSc, cy + 18 * bSc);
        ctx.lineTo(cx - 12 * bSc, cy + 54 * bSc + lOffset * 0.4);
        ctx.stroke();

        // 右腿
        ctx.strokeStyle = cfg.armor || "#7f1d1d";
        ctx.beginPath();
        ctx.moveTo(cx + 12 * bSc, cy + 18 * bSc);
        ctx.lineTo(cx + 12 * bSc, cy + 54 * bSc + rOffset * 0.4);
        ctx.stroke();

        // 金屬護膝與戰靴
        ctx.fillStyle = cfg.armorTrim || "#ca8a04";
        ctx.fillRect(cx - 17 * bSc, cy + 46 * bSc + lOffset * 0.4, 10 * bSc, 10 * bSc);
        ctx.fillRect(cx + 7 * bSc, cy + 46 * bSc + rOffset * 0.4, 10 * bSc, 10 * bSc);
      }
    },

    // 繪製軀幹鎧甲與腰帶
    drawTorso(ctx, cx, cy, row, col, cfg, bSc) {
      // 鎧甲基底主體
      ctx.fillStyle = cfg.armor;
      ctx.beginPath();
      if (row === 1) {
        // 側面身型
        ctx.ellipse(cx, cy - 2 * bSc, 15 * bSc, 22 * bSc, 0, 0, Math.PI * 2);
      } else {
        // 正面 / 背面身型
        ctx.ellipse(cx, cy - 2 * bSc, 22 * bSc, 22 * bSc, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // 護肩與胸甲鑲邊 (Armor Pauldrons)
      ctx.fillStyle = cfg.armorTrim;
      if (row !== 1) {
        // 左肩甲
        ctx.beginPath();
        ctx.arc(cx - 22 * bSc, cy - 14 * bSc, 9 * bSc, 0, Math.PI * 2);
        ctx.fill();
        // 右肩甲
        ctx.beginPath();
        ctx.arc(cx + 22 * bSc, cy - 14 * bSc, 9 * bSc, 0, Math.PI * 2);
        ctx.fill();

        // 聖騎士胸前神聖十字徽印
        if (cfg.weaponType === "holy_mace_shield" && row === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(cx - 2.5 * bSc, cy - 12 * bSc, 5 * bSc, 18 * bSc);
          ctx.fillRect(cx - 8 * bSc, cy - 7 * bSc, 16 * bSc, 4.5 * bSc);
        }
      } else {
        // 側面單肩甲
        ctx.beginPath();
        ctx.arc(cx + 4 * bSc, cy - 14 * bSc, 10 * bSc, 0, Math.PI * 2);
        ctx.fill();
      }

      // 戰鬥腰帶 (War Belt)
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(cx - 16 * bSc, cy + 12 * bSc, 32 * bSc, 6 * bSc);
      ctx.fillStyle = cfg.armorTrim;
      ctx.fillRect(cx - 4 * bSc, cy + 11 * bSc, 8 * bSc, 8 * bSc);
    },

    // 繪製頭部、髮型、頭盔與飾品
    drawHead(ctx, cx, cy, row, col, cfg, bSc) {
      const headY = cy - 36 * bSc;
      const headR = 14 * bSc;

      // 臉部皮膚
      ctx.fillStyle = cfg.skin;
      ctx.beginPath();
      ctx.arc(cx, headY, headR, 0, Math.PI * 2);
      ctx.fill();

      // 五官與頭髮特徵
      if (row === 0) {
        // 正面：眼睛陰影
        ctx.fillStyle = cfg.skinShadow;
        ctx.fillRect(cx - 6 * bSc, headY - 1 * bSc, 4 * bSc, 3 * bSc);
        ctx.fillRect(cx + 2 * bSc, headY - 1 * bSc, 4 * bSc, 3 * bSc);
      } else if (row === 1) {
        // 側面：眼神
        ctx.fillStyle = cfg.skinShadow;
        ctx.fillRect(cx + 4 * bSc, headY - 1 * bSc, 4 * bSc, 3 * bSc);
      }

      // 髮型或頭盔專屬造型
      if (cfg.helmType === "horns") {
        // === 野蠻人：雙長紅角戰盔 ===
        ctx.fillStyle = "#451a03";
        ctx.beginPath();
        ctx.arc(cx, headY - 4 * bSc, headR * 0.95, Math.PI, 0);
        ctx.fill();

        // 巨型牛角 (雙角向外揚起)
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.moveTo(cx - 8 * bSc, headY - 6 * bSc);
        ctx.lineTo(cx - 24 * bSc, headY - 22 * bSc);
        ctx.lineTo(cx - 6 * bSc, headY - 12 * bSc);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 8 * bSc, headY - 6 * bSc);
        ctx.lineTo(cx + 24 * bSc, headY - 22 * bSc);
        ctx.lineTo(cx + 6 * bSc, headY - 12 * bSc);
        ctx.fill();
      } else if (cfg.helmType === "tiara") {
        // === 魔法使：秘術兜帽與寶石頭冠 ===
        ctx.fillStyle = cfg.armor;
        ctx.beginPath();
        ctx.arc(cx, headY - 2 * bSc, headR * 1.15, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(cx - 3 * bSc, headY - 10 * bSc, 6 * bSc, 4 * bSc);
      } else if (cfg.helmType === "winged_helm") {
        // === 聖騎士：展翼全罩聖鋼盔 ===
        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.arc(cx, headY - 2 * bSc, headR * 1.05, 0, Math.PI * 2);
        ctx.fill();
        // 金色翼羽
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(cx - 10 * bSc, headY - 4 * bSc);
        ctx.lineTo(cx - 18 * bSc, headY - 18 * bSc);
        ctx.lineTo(cx - 8 * bSc, headY - 12 * bSc);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 10 * bSc, headY - 4 * bSc);
        ctx.lineTo(cx + 18 * bSc, headY - 18 * bSc);
        ctx.lineTo(cx + 8 * bSc, headY - 12 * bSc);
        ctx.fill();
      } else if (cfg.helmType === "bone_crown") {
        // === 死靈法師：白骨王冠與長白髮 ===
        ctx.fillStyle = cfg.hair;
        ctx.fillRect(cx - 14 * bSc, headY - 6 * bSc, 6 * bSc, 26 * bSc);
        ctx.fillRect(cx + 8 * bSc, headY - 6 * bSc, 6 * bSc, 26 * bSc);
        // 骨刺王冠
        ctx.fillStyle = "#f1f5f9";
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i * 5 * bSc - 2, headY - 10 * bSc);
          ctx.lineTo(cx + i * 5 * bSc, headY - (16 + Math.abs(i) * 2) * bSc);
          ctx.lineTo(cx + i * 5 * bSc + 2, headY - 10 * bSc);
          ctx.fill();
        }
      } else if (cfg.helmType === "feather_circlet") {
        // === 亞馬遜：羽冠金髮高馬尾 ===
        ctx.fillStyle = cfg.hair;
        ctx.beginPath();
        ctx.arc(cx, headY - 4 * bSc, headR * 1.05, 0, Math.PI * 2);
        ctx.fill();
        // 高馬尾辮 (側面或跑動時隨風揚起)
        ctx.beginPath();
        ctx.ellipse(cx - 14 * bSc, headY - 8 * bSc, 10 * bSc, 18 * bSc, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // 紅色戰鬥羽冠
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(cx - 3 * bSc, headY - 12 * bSc);
        ctx.lineTo(cx - 14 * bSc, headY - 26 * bSc);
        ctx.lineTo(cx + 2 * bSc, headY - 15 * bSc);
        ctx.fill();
      }
    },

    // 繪製手臂、動作姿態與職業專屬武器
    drawArmsAndWeapons(ctx, cx, cy, row, col, cfg, bSc, armSwing) {
      const type = cfg.weaponType;

      if (type === "dual_axes") {
        // === 野蠻人：雙持重戰斧 ===
        const axAngle = (row === 3) ? (armSwing * 0.05 + Math.PI / 3) : (armSwing * 0.02);

        // 左手戰斧
        ctx.save();
        ctx.translate(cx - 24 * bSc, cy - 6 * bSc);
        ctx.rotate(-axAngle);
        this.drawAxe(ctx, bSc, cfg.weaponColor, cfg.weaponTrim);
        ctx.restore();

        // 右手戰斧
        ctx.save();
        ctx.translate(cx + 24 * bSc, cy - 6 * bSc);
        ctx.rotate(axAngle);
        this.drawAxe(ctx, bSc, cfg.weaponColor, cfg.weaponTrim);
        ctx.restore();

      } else if (type === "crystal_staff") {
        // === 魔法使：法杖與旋轉秘術法球 ===
        const stfAngle = (row === 3) ? -0.4 : 0.1;
        ctx.save();
        ctx.translate(cx + 22 * bSc, cy - 4 * bSc);
        ctx.rotate(stfAngle);

        // 法杖木柄
        ctx.strokeStyle = cfg.weaponColor;
        ctx.lineWidth = 4 * bSc;
        ctx.beginPath();
        ctx.moveTo(0, 36 * bSc);
        ctx.lineTo(0, -42 * bSc);
        ctx.stroke();

        // 頂部水晶法球 (閃爍輝光)
        const orbGlow = ctx.createRadialGradient(0, -42 * bSc, 2, 0, -42 * bSc, 14 * bSc);
        orbGlow.addColorStop(0, "#f8fafc");
        orbGlow.addColorStop(0.4, cfg.weaponTrim);
        orbGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = orbGlow;
        ctx.beginPath();
        ctx.arc(0, -42 * bSc, 14 * bSc, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (type === "holy_mace_shield") {
        // === 聖騎士：金十字聖盾 + 戰錘 ===
        // 左手聖盾 (Kite Shield)
        const shX = cx - 22 * bSc;
        const shY = cy - 2 * bSc;
        ctx.fillStyle = "#1e3a8a";
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3 * bSc;
        ctx.beginPath();
        ctx.moveTo(shX - 12 * bSc, shY - 18 * bSc);
        ctx.lineTo(shX + 12 * bSc, shY - 18 * bSc);
        ctx.lineTo(shX + 10 * bSc, shY + 14 * bSc);
        ctx.lineTo(shX, shY + 24 * bSc);
        ctx.lineTo(shX - 10 * bSc, shY + 14 * bSc);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 盾面神聖金十字
        ctx.fillStyle = "#facc15";
        ctx.fillRect(shX - 2 * bSc, shY - 12 * bSc, 4 * bSc, 26 * bSc);
        ctx.fillRect(shX - 8 * bSc, shY - 6 * bSc, 16 * bSc, 4 * bSc);

        // 右手戰錘 (Mace)
        const mcX = cx + 24 * bSc;
        const mcY = cy - 2 * bSc;
        const mcAngle = (row === 3) ? (armSwing * 0.04) : 0;
        ctx.save();
        ctx.translate(mcX, mcY);
        ctx.rotate(mcAngle);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 4 * bSc;
        ctx.beginPath();
        ctx.moveTo(0, 18 * bSc);
        ctx.lineTo(0, -28 * bSc);
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-6 * bSc, -32 * bSc, 12 * bSc, 10 * bSc);
        ctx.restore();

      } else if (type === "bone_wand") {
        // === 死靈法師：白骨節杖與幽魂浮靈 ===
        const wandAngle = (row === 3) ? -0.35 : 0;
        ctx.save();
        ctx.translate(cx + 22 * bSc, cy - 4 * bSc);
        ctx.rotate(wandAngle);

        ctx.strokeStyle = cfg.weaponColor;
        ctx.lineWidth = 3.5 * bSc;
        ctx.beginPath();
        ctx.moveTo(0, 24 * bSc);
        ctx.lineTo(0, -32 * bSc);
        ctx.stroke();

        // 骨節杖頂端微型骷髏面
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(0, -32 * bSc, 6 * bSc, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#10b981";
        ctx.fillRect(-2 * bSc, -34 * bSc, 1.5 * bSc, 2 * bSc);
        ctx.fillRect(1 * bSc, -34 * bSc, 1.5 * bSc, 2 * bSc);
        ctx.restore();

      } else if (type === "war_bow") {
        // === 亞馬遜：黃金戰鬥長弓 ===
        const bowX = cx + 22 * bSc;
        const bowY = cy - 4 * bSc;
        ctx.save();
        ctx.translate(bowX, bowY);

        // 彎曲長弓弓身
        ctx.strokeStyle = cfg.weaponColor;
        ctx.lineWidth = 3.5 * bSc;
        ctx.beginPath();
        ctx.arc(0, 0, 32 * bSc, -Math.PI / 2.3, Math.PI / 2.3);
        ctx.stroke();

        // 弓弦
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.2 * bSc;
        ctx.beginPath();
        const pull = (row === 3) ? -12 * bSc : 0;
        ctx.moveTo(Math.cos(-Math.PI / 2.3) * 32 * bSc, Math.sin(-Math.PI / 2.3) * 32 * bSc);
        ctx.lineTo(pull, 0);
        ctx.lineTo(Math.cos(Math.PI / 2.3) * 32 * bSc, Math.sin(Math.PI / 2.3) * 32 * bSc);
        ctx.stroke();

        // 攻擊幀拉滿搭箭
        if (row === 3) {
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 2 * bSc;
          ctx.beginPath();
          ctx.moveTo(pull - 4 * bSc, 0);
          ctx.lineTo(24 * bSc, 0);
          ctx.stroke();
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.moveTo(24 * bSc, -3 * bSc);
          ctx.lineTo(30 * bSc, 0);
          ctx.lineTo(24 * bSc, 3 * bSc);
          ctx.fill();
        }
        ctx.restore();
      }
    },

    // 繪製單把重戰斧
    drawAxe(ctx, bSc, bladeColor, trimColor) {
      // 斧柄
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 4 * bSc;
      ctx.beginPath();
      ctx.moveTo(0, 24 * bSc);
      ctx.lineTo(0, -32 * bSc);
      ctx.stroke();

      // 雙刃斧面
      ctx.fillStyle = bladeColor;
      ctx.beginPath();
      ctx.arc(-8 * bSc, -20 * bSc, 14 * bSc, -Math.PI / 2, Math.PI / 2, true);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8 * bSc, -20 * bSc, 14 * bSc, -Math.PI / 2, Math.PI / 2, false);
      ctx.fill();

      // 斧刃符文暗紅光
      ctx.strokeStyle = trimColor;
      ctx.lineWidth = 1.5 * bSc;
      ctx.beginPath();
      ctx.arc(-8 * bSc, -20 * bSc, 14 * bSc, -Math.PI / 2.4, Math.PI / 2.4, true);
      ctx.stroke();
    },

    // 攻擊幀專屬揮砍、法術彈道與斬擊光效
    drawAttackSlashFX(ctx, cx, cy, col, cls, cfg) {
      ctx.save();
      if (cls === "barbarian") {
        // 暗紅狂暴雙重半月弧光
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx + 8, cy - 8, 48, -Math.PI / 3, Math.PI / 2);
        ctx.stroke();
      } else if (cls === "sorceress") {
        // 秘術奧術電光法陣爆裂
        ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx + 28, cy - 38, 22, 0, Math.PI * 2);
        ctx.stroke();
      } else if (cls === "paladin") {
        // 神聖正義金光斬
        ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(cx + 12, cy - 45);
        ctx.lineTo(cx + 45, cy + 18);
        ctx.stroke();
      } else if (cls === "necromancer") {
        // 幽魂白骨幽綠詛咒霧
        ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        ctx.beginPath();
        ctx.arc(cx + 32, cy - 20, 18, 0, Math.PI * 2);
        ctx.fill();
      } else if (cls === "amazon") {
        // 多重箭疾射光束
        ctx.strokeStyle = "rgba(254, 240, 138, 0.95)";
        ctx.lineWidth = 2.5;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + 26, cy - 6 + i * 6);
          ctx.lineTo(cx + 70, cy - 6 + i * 16);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  };

  window.HeroSpriteBaker = HeroSpriteBaker;

})(typeof window !== "undefined" ? window : global);
