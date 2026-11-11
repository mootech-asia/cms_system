# GPT 素材製作指引（20261111_lucky_wheel）

給 GPT（ChatGPT 圖像生成＋Code Interpreter）照著做的步驟。規格以 `DESIGN_TASKS.md` 為準，本檔只負責「怎麼產出」。

## 使用方式

1. 開新對話，**附上 `reference/` 的四張三視圖（`bear-view-1`～`4`）＋相關貼圖＋ `mootech-logo-mark.png`**（無法上傳時用 `reference/README.md` 的公開連結），再貼上第 2 節「共通風格」。
2. 依序執行第 3 節（角色設定圖）→ 人工比對 `DESIGN_TASKS.md` 第四節驗收表 → 通過後執行第 4 節（動態）→ 第 5 節（靜態圖）。
3. 每次生成只做一項；不滿意就在同一對話要求修改，保持角色一致。
4. 產出檔名照表格命名，放進 `assets/img/`（吉祥物放 `assets/img/mascot/`），同檔名覆蓋即可上線；若副檔名不同，改 `assets/js/config.js` 的路徑。
5. 每交付一項就 commit，並在 `DELIVERY_CHECKLIST.md` 該列打勾（☐ → ☑）、填 commit hash，再執行 `python3 scripts/check_delivery.py event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md`，已打勾的列必須全部 `OK`。
6. **所有圖不得出現中文。** 需要文字的只有活動主標（英／韓／泰各一張）。

---

## 1. 參考角色設定（熊北 Mootech Bear，官方）

來源：官網 repo `mootech-asia/mootech_website` → `brand/moo-bear/01_character/character.md`。GPT 看不到圖或理解有偏差時，以這份文字為準。

| 項目 | 官方設定 |
|---|---|
| 名稱 | 熊北（Mootech Bear）；MOOTECH 網路維運夥伴、官網線上客服 |
| 風格 | 科技 × 親和 × 專業；高擬真 3D 角色渲染、C4D 質感、柔和攝影棚光 |
| 性格 | 穩重、自信、友善、專注；從容不迫 |
| 體型 | Q 版偏寫實、高大圓潤；圓肚子、寬肩、粗手臂、大而厚的掌、短腿；頭身比約 1：3 |
| 臉部 | 臉圓、臉頰肉肉、吻部短、耳朵小而圓、表情親切自信 |
| 毛髮 | 蓬鬆細緻、根根分明的白毛 `#E9EDF2` |
| 科技墨鏡 | 漸層鏡片 **橘 → 洋紅 → 紫藍**，鏡片上有 HUD 數位圖形；**深灰金屬鏡框** |
| 耳機 | 深色耳罩式，耳罩外側有**青藍與橘色**發光圓環；**角色自己的左側**有細長麥克風臂到嘴邊（正面看在畫面右邊） |
| 背心 | 深海軍藍 `#1A2233` 泡泡羽絨背心（一格一格鼓起）、正面拉鍊、**左胸 MOOTECH 標誌**；背面無標誌 |
| 標誌 | 官方 MOOTECH logo：「不可能 M」立體線框圖形，**藍綠 → 黃綠漸層**（約 `#00A0E0` → `#B0C040`）＋ MOOTECH 字標（深藍背心上字標為白色）。檔案：`reference/mootech-logo-mark.png`、`mootech-logo-horizontal-white.png`。**不可用橘色 M 或自創徽記** |
| 內搭 | **深灰色連帽衣**，帽子在背後自然垂下（帽子屬於內搭，不是背心） |
| 配色 | 毛 `#E9EDF2`、背心 `#1A2233`、科技藍 `#3DA8FF`、點綴橘 `#FF9A3C` |
| 比例 | 身高約 200cm，與 175cm 成人並排高一個頭 |
| 配件規則 | 墨鏡、耳機、背心與標誌**不可省略、不可換色** |
| 禁止事項 | 不出現國旗、國徽或其他公司標誌；不出現紅色警示、錯誤畫面；不做兇猛、露牙威嚇表情；背景不用機房、伺服器、成排螢幕 |
| 官方提示詞要點 | 每次生成都上傳三視圖當參考；表情貼圖要寫「角色佔畫面八成」，否則角色會太小 |

## 2. 共通風格（每次都貼在提示詞最前面）

```
STYLE LOCK — apply to every image in this conversation:
- Same universe and render quality as the attached Mootech Bear reference images:
  high-fidelity 3D character render, C4D look, fluffy detailed fur, soft studio lighting,
  chibi-realistic proportions (head:body about 1:3, tall and rounded), friendly, confident, calm personality.
- Brand colors only: fur #E9EDF2, vest navy #1A2233, tech blue #3DA8FF, energetic orange #FF9A3C.
- Event theme: bright, warm, festive modern Broadway stage; clean, simple, cheerful;
  colorful casino-style lucky wheel. Warm and comfortable overall tone. No dark nightclub mood.
- NEVER include Chinese characters anywhere. Do not add any text unless the prompt explicitly gives the exact text.
- No host / MC character, no handheld microphone, no speech bubbles.
- Never show national flags, emblems or other companies' logos; no red warning/error visuals;
  no fierce or teeth-baring expressions; no server rooms or rows of monitors.
```

---

## 3. 吉祥物角色設定圖（第一階段）

吉祥物已定名 **Moo Rabbit（兔比）**，為 MOOTECH cms_system 事業部吉祥物，整套形象由品牌包管理：
- 角色設定、共通設定（CHARACTER LOCK）與角色設定圖提示詞：`brand/moo-rabbit/ART_REQUIREMENTS.md` 第 1 節、第 4.1、4.2 節
- 輸出：`brand/moo-rabbit/01_character/turnaround-sheet.png`（1536×1024）＋四視圖單張

本活動不另做角色設定圖；品牌包的角色設定圖審核通過後，才能進入第 4 節。

---

## 4. 吉祥物動態 GIF（第二階段）

### 4.1 產出方式

每個狀態用 **sprite sheet（序列幀拼圖）** 產出，再用 4.3 的腳本切幀組成 GIF。

- Sheet 尺寸 **1024×1536**、**3 欄 × 4 列 = 12 格**，由左到右、由上到下為第 1～12 幀。
- 每格角色**同大小、同位置、腳底在同一條水平線**，只改變動作；背景**透明**。
- **幀數越多越流暢**：每個狀態至少做 2 張 sheet（24 幀）；待機可再加 ping-pong（正放＋倒放）讓循環更順。
- 第 12（或 24）幀要能銜接回第 1 幀（無縫循環）。

### 4.2 各狀態提示詞

先貼第 2 節共通風格與品牌包的 CHARACTER LOCK，再貼「共通動態規則」，最後貼該狀態的動作描述。

```
ANIMATION SPRITE SHEET RULES:
- Character: Moo Rabbit exactly as in the approved turnaround sheet and four views (attach them),
  using the CHARACTER LOCK block from brand/moo-rabbit/ART_REQUIREMENTS.md section 4.1.
- Output 1024x1536, transparent background, a 3-column x 4-row grid = 12 equal cells.
- Frames read left-to-right, top-to-bottom (frame 1 top-left, frame 12 bottom-right).
- Full body in every cell, same scale, same camera, feet on the same baseline, centered.
- Only the pose changes between frames; motion must be smooth and evenly spaced.
- Frame 12 must flow seamlessly back into frame 1 (loop).
- No text, no grid lines, no frame numbers, no background, no shadows outside the character.
```

| 檔名 | 對應參考表情 | 動作描述（貼在規則後面） |
|---|---|---|
| `mascot/idle-1.gif` | Smile | `IDLE 1: relaxed standing pose, gentle breathing (chest rises and falls), one slow blink around frames 6-7, ears sway slightly.` |
| `mascot/idle-2.gif` | Listening | `IDLE 2: tilts head toward the right as if listening, one ear twitches and folds then springs back, paw lightly touches the headphone.` |
| `mascot/idle-3.gif` | Thinking（`bear-sticker-think`）、揮手（`bear-sticker-wave`） | `IDLE 3: friendly wave with the right paw at shoulder height, then pushes the tech glasses up with one finger, returns to neutral.` |
| `mascot/spinning.gif` | Focused | `SPINNING: excited anticipation — both paws in fists close to the chest, small bouncing hops in place, ears fully upright and trembling, focused smiling face watching to the left (where the wheel is).` |
| `mascot/result.gif` | Laugh + 眨眼比讚（`bear-sticker-wink-thumbsup`） | `RESULT: jumps up with joy, open-mouth laugh, both arms raised, lands and gives a big thumbs up with a wink, small golden sparkle stars pop around (sparkles inside the cell only).` |

需要第 13～24 幀時，在同一對話追加：

```
Continue the SAME animation with frames 13-24 in a new 1024x1536 sheet (same grid, same scale and baseline).
Frame 13 continues directly from frame 12, and frame 24 must loop back into frame 1.
```

### 4.3 組成 GIF（貼給 GPT 的 Code Interpreter 執行）

把 sheet 依順序上傳後，貼上並執行下面這段（產出 400×500 GIF＋PNG 序列幀）：

```python
from PIL import Image
import os

def build_gif(sheets, out_gif, fps=24, cols=3, rows=4, size=(400, 500),
              matte=(0xFF, 0xE6, 0xCC), pingpong=False, png_dir=None):
    frames = []
    for path in sheets:
        sheet = Image.open(path).convert("RGBA")
        cw, ch = sheet.width // cols, sheet.height // rows
        for r in range(rows):
            for c in range(cols):
                cell = sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))
                scale = min(size[0] / cw, size[1] / ch)
                cell = cell.resize((round(cw * scale), round(ch * scale)), Image.LANCZOS)
                canvas = Image.new("RGBA", size, (0, 0, 0, 0))
                canvas.paste(cell, ((size[0] - cell.width) // 2, size[1] - cell.height), cell)
                frames.append(canvas)
    if pingpong:
        frames = frames + frames[-2:0:-1]
    if png_dir:
        os.makedirs(png_dir, exist_ok=True)
        for i, f in enumerate(frames, 1):
            f.save(os.path.join(png_dir, f"frame_{i:03d}.png"))
    gif_frames = []
    for f in frames:
        # GIF 只有 1-bit 透明：半透明毛邊先疊在舞台暖色 matte 上，再以 alpha 門檻決定透明
        bg = Image.new("RGBA", size, matte + (255,))
        solid = Image.alpha_composite(bg, f)
        alpha = f.getchannel("A").point(lambda a: 255 if a >= 128 else 0)
        p = solid.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=255)
        p.paste(255, mask=alpha.point(lambda a: 255 - a))
        p.info["transparency"] = 255
        gif_frames.append(p)
    gif_frames[0].save(out_gif, save_all=True, append_images=gif_frames[1:],
                       duration=round(1000 / fps), loop=0, disposal=2,
                       transparency=255, optimize=False)
    print(out_gif, len(frames), "frames")

# 範例：
# build_gif(["spinning_01-12.png", "spinning_13-24.png"], "spinning.gif", fps=24, png_dir="spinning_png")
# build_gif(["idle1_01-12.png", "idle1_13-24.png"], "idle-1.gif", fps=24, pingpong=True, png_dir="idle1_png")
```

交付：5 個 GIF（每個建議 ≤ 1.5MB；太大就把 fps 降到 18，或幀數減半）＋各自的 PNG 序列幀資料夾＋每個狀態一張「關鍵幀 vs 角色設定圖」並排比對圖。

---

## 5. 靜態圖提示詞

先貼第 2 節共通風格，再貼下列提示詞。GPT 輸出尺寸固定（1024×1024／1536×1024／1024×1536），請選最接近的比例生成，**再用 Code Interpreter 縮放／裁切到表中的精確尺寸**（等比縮放後置中裁切；去背圖用透明補邊）。

| 檔名 | 精確尺寸 | 生成比例 | 提示詞 |
|---|---|---|---|
| `stage-bg.png` | 750×1000 | 1024×1536 | `Mobile event background, bright warm modern Broadway stage: soft peach/cream back wall with a gentle radial glow in the center, red velvet curtains on both left and right edges, a scalloped red valance with gold fringe across the top. Keep the center (where a big wheel will be placed) clean and bright. No characters, no text, no wheel.` |
| `stage-floor.png` | 750×140 | 1536×1024 → 裁切 | `Front edge of a stage seen from the audience: a gentle upward arc of polished gold stage floor with a row of warm marquee light bulbs along the edge, a coral red apron below. The bottom 20px must be flat solid #FFF6EA. Put the bulbs and the arc in the upper half. No text.` |
| `title-en.png` | 690×240 | 1536×1024 → 裁切 | `Broadway marquee sign logo, rounded rectangle, gold 3D frame with glowing bulbs all around, red inner panel, the exact text "LUCKY WHEEL" as bold, rounded, 3D cream-gold lettering with highlights, letters fully inside the red panel, readable when shown at 345px wide, transparent background.`（規格見 `DESIGN_TASKS.md`「主視覺文字」） |
| `title-ko.png` | 690×240 | 同上 | 同上，文字改為 `"행운의 룰렛"`（構圖與 title-en 完全一致，只換字） |
| `title-th.png` | 690×240 | 同上 | 同上，文字改為 `"วงล้อนำโชค"`（構圖與 title-en 完全一致，只換字；泰文上下標符號上下各留約字高 25% 空間，不可被框切到） |
| `spotlight.png` | 260×900 | 1024×1536 → 裁切 | `A single stage spotlight beam on a transparent background: narrow at the top, widening downward, warm white light fading to fully transparent at the bottom. No lamp, no stage.` |
| `wheel-frame.png` | 680×680 | 1024×1024 | `Casino lucky wheel outer rim only, front view: thick glossy gold ring with bevels and highlights, outer diameter 100%, inner opening diameter 88%. The inner circle must be completely empty/transparent. Do NOT draw light bulbs (they are added in code), leave a smooth band in the middle of the ring. Transparent background.` |
| `wheel-gloss.png` | 600×600 | 1024×1024 | `A circular glossy overlay for a wheel: soft white highlight in the upper-left fading out, and a subtle warm inner shadow around the edge. Mostly transparent, no colors, no segments. Transparent background.` |
| `pointer.png` | 120×160 | 1024×1536 → 裁切 | `Lucky wheel pointer, gold rim with a red gem center, teardrop shape with the sharp tip pointing straight DOWN, centered at the bottom. Transparent background.` |
| `btn-go.png` | 200×200 | 1024×1024 | `Round casino spin button: thick gold ring, glossy red center dome with a soft highlight. NO TEXT on the button (text is added in code); keep the center darker so white text is readable. Transparent background.` |
| `modal-bg.png` | 600×760 | 1024×1536 → 裁切 | `Prize result card: cream rounded card with a gold border, a red ribbon banner across the top edge, a few small gold sparkle stars. Completely empty — NO TEXT anywhere. Transparent background outside the card.` |
| `btn-primary.png` | 400×110 | 1536×1024 → 裁切 | `Pill-shaped button, orange-to-coral gradient with a thin gold border and a soft top highlight. NO TEXT. Transparent background.` |
| `icon-sound-on.png` / `icon-sound-off.png` | 64×64 | 1024×1024 | `Round cream sound toggle icon with a gold border: (on) red speaker with sound waves / (off) grey speaker with an X. Transparent background.` |
| `icon-cash` `icon-coin` `icon-gift` `icon-spin` `icon-bonus` `icon-points` `icon-thanks`（.png） | 160×160 | 1024×1024 | `3D prize icon, same style for the whole set, bold readable at 40px, white outline, transparent background: (cash) green banknote / (coin) gold coin / (gift) red gift box with gold ribbon / (spin) purple circular arrow / (bonus) orange star badge with a percent sign / (points) teal circle with a star / (thanks) warm yellow smiley. No words.` |
| `stage-bg-desktop.png` | 1920×1000 | 1536×1024 → 放大裁切 | `Wide desktop version of the same bright warm Broadway stage background: soft peach/cream back wall with a central glow, wide red velvet curtains with folds on both sides, scalloped red valance with gold fringe across the top. Keep the central 480px column clean and bright (the wheel sits there). No characters, no text.` |
| `info-bg.png` | 750×750（無縫） | 1024×1024 → 縮小 | `Seamless tileable pattern on cream #FFF6EA: sparse small confetti strips and tiny stars in the event colors, very subtle and light so dark text on top stays readable. Edges must tile seamlessly.`（再用 Code Interpreter 檢查四邊接縫） |
| `period-badge.png` | 480×64 | 1536×1024 → 裁切 | `Horizontal gold ribbon banner with folded tails on both ends, a light cream center area for text, flat and clean. NO TEXT. Transparent background.` |
| `chances-badge.png` | 360×88 | 1536×1024 → 裁切 | `Rounded pill badge with a gold rim and a light cream center for text, small gold dots at both ends. NO TEXT. Transparent background.` |
| `card-frame.png` | 120×120（九宮格 40） | 1024×1024 → 縮小 | `Square card frame for 9-slice scaling: gold rounded border, cream center, decoration ONLY in the four corners (small red dots or stars); straight edges and the center must be plain so they can stretch. Transparent background outside the frame.` |
| `card-title.png` | 400×72 | 1536×1024 → 裁切 | `Red ribbon title banner with a thin gold outline and folded darker tails on both ends, center area dark enough for white text. NO TEXT. Transparent background.` |
| `footer-deco.png` | 750×160 | 1536×1024 → 裁切 | `Decorative page footer: a soft stage-edge arc with small gold stars along it and a few confetti strips below, warm and light. NO TEXT. Transparent background above the arc.` |
| `icon-share.png` | 64×64 | 1024×1024 | `Round cream share icon with a gold border and a red share symbol (three connected dots), same style as the sound toggle icons. Transparent background.` |
| `share-preview.png` | 1200×630（PNG） | 1536×1024 → 裁切 | `Social link preview: the LUCKY WHEEL marquee title on the left, the colorful casino wheel in the center-right, Moo Rabbit cheering at the bottom right, bright warm Broadway stage background. Keep all key content inside the central 1100x580. Only the text "LUCKY WHEEL" (and optionally "SPIN & WIN").` |

---

## 6. 交付前自我檢查（GPT 產出後逐項確認）

- [ ] `DELIVERY_CHECKLIST.md` 已打勾並填 commit；`scripts/check_delivery.py`（repo 根目錄） 沒有 FAIL

- [ ] 檔名與尺寸和 `DESIGN_TASKS.md` 完全一致
- [ ] 任何一張圖都沒有中文；除活動主標外沒有任何文字
- [ ] 去背圖四周真的透明（不是白底或棋盤格圖案）
- [ ] `wheel-frame` 中央直徑 600 的圓完全透明、沒有畫燈泡
- [ ] 吉祥物逐項通過 `DESIGN_TASKS.md` 第四節驗收表（13 項）
- [ ] 每個 GIF 頭尾無縫循環、腳底不跳動、大小 ≤ 1.5MB
- [ ] 三張活動主標構圖一致、只換字
