# GPT 素材製作指引：生存遊戲秀皮（survival）

> 角色製作以 `DESIGN_TASKS.md` 頂部的最新方向為準：桃紅連帽服＋黑色全罩面具人形角色，單一白圓標記；下文舊 STYLE LOCK 的面具禁用與兔比露臉設定不適用於這批角色。固定鏡頭，400×500、48 幀／2000ms，共用頭尾姿勢；陰影保留於 RGBA 幀中。動態研究原圖與序列位於 `source/guard-motion/`，可播放預覽在 `source/guard-review/`。

規格以同資料夾 `DESIGN_TASKS.md` 為準；尺寸與技術細節同預設皮（`../../GPT_ASSET_BRIEF.md`）。每次生成只做一項，依 P0 → P3 順序。

## 1. STYLE LOCK（每次都貼在提示詞最前面）

```
STYLE LOCK — "Survival Spin" mobile event, original artwork:
- Mood: a bright, high-stakes but playful survival game show. Clean, glossy, modern 3D render, mobile-game quality.
- Palette only: hot pink #E8327C, light pink #FF6FA8, deep green #06231F / #0F6B5F, mint #36B39B, cream #F3E9D2, black #1D1D1F.
- Shapes: rounded game-UI pieces with thick black outlines and pink fills, cream paper cards, ticket stubs, number tags,
  honeycomb-candy (dalgona) discs, pink staircase maze walls.
- Lighting: stage spotlight from the upper front-left, slightly pink-tinted warm white.
- STRICTLY AVOID: any film/TV title, logo or lettering style; the circle-triangle-square symbol trio in any form;
  black full-face masks; giant dolls; green tracksuits with white numbers; blood, weapons, death or elimination imagery;
  any Chinese characters. No text unless the item asks for its exact text.
```

## 2. 提示詞（P0 → P2）

| 檔名 | 尺寸 | 生成比例 | 提示詞（接在 STYLE LOCK 後面） |
|---|---|---|---|
| `title-en.png` | 690×240 | 1536×1024 → 裁切 | `Event logo lettering, the exact text "SURVIVAL SPIN" as custom chunky rounded display letters with cream faces, thick black outline and a hot-pink 3D extrusion, a small pink-and-cream casino wheel integrated above the middle, a few ticket-stub and number-tag accents around the outside only, readable at 345px wide, transparent background.` |
| `title-ko.png` | 690×240 | 同上 | 同上，文字改為 `"서바이벌 스핀"`，字形依韓文重新設計（粗黑體骨架加圓角） |
| `title-th.png` | 690×240 | 同上 | 同上，文字改為 `"สปินเอาตัวรอด"`，上下標符號上下各留約字高 25%，交付前逐字核對 |
| `stage-bg.png` | 750×1000 | 1024×1536 | `Mobile event background: a tall deep-green game hall in one-point perspective, hot-pink and light-pink staircase maze walls receding on both sides, a large glowing countdown screen frame on the back wall (no digits), polished floor tiles with converging lines and a soft pink spotlight pool in the lower middle. Upper 60% kept clean for the title and wheel, lower 40% is the floor. No characters, no text, no wheel.` |
| `stage-floor.png` | 750×140 | 1536×1024 → 裁切 | `Front edge of the stage seen from the audience: a gentle hot-pink arc with a row of small white light dots, the bottom 20px flat solid #F3ECE0. No text.` |
| `wheel-frame.png` | 680×680 | 1024×1024 | `Lucky wheel outer rim only, front view: thick black ring with a glossy hot-pink inner band and a thin cream line, outer diameter 100%, inner opening 88% completely transparent, no light bulbs, transparent background.` |
| `wheel-stand.png` | 400×600 | 1024×1536 → 裁切 | `Game-machine style stand for a lucky wheel: black and hot-pink pole and a round perspective base plate, matching the floor perspective, no ground shadow, transparent background.` |
| `pointer.png` | 120×160 | 1024×1024 → 裁切 | `Wheel pointer: rounded hot-pink downward triangle with thick black outline and a glossy highlight, tip at bottom center, transparent background.` |
| `btn-go.png` | 200×200 | 1024×1024 | `Round arcade push button: thick black ring, glossy hot-pink dome, no text, transparent background.` |
| `spotlight.png` | 260×900 | 1024×1536 → 裁切 | `A single volumetric stage light beam, slightly pink-tinted warm white, soft feathered edges, subtle haze, fading to fully transparent at the bottom 15%, no lamp, no dark pixels, transparent background.` |
| `light-pool.png` | 600×220 | 1536×1024 → 裁切 | `A soft pink-white spotlight pool on a floor in perspective (flat wide ellipse), light only, transparent background.` |
| `stage-vignette.png` | 750×1000 | 1024×1536 | `Darkening overlay: clear oval around the upper center, edges fading to deep green #06231F at about 70% opacity, transparent background.` |
| `bulb-on.png` / `bulb-off.png` | 48×48 | 1024×1024 → 縮放 | `One small marquee bulb, front view, diameter half of the canvas: ON = pinkish-white glowing glass with soft halo fading to transparent; OFF = deep magenta glass, no glow, same size and position. Transparent background.` |
| `modal-bg.png` | 600×760 | 1024×1536 → 裁切 | `Result popup panel: cream card with thick black outline and rounded corners, a hot-pink header band at the top (empty), ticket-stub notches on the sides, fully opaque center, no text, transparent outside.` |
| `btn-primary.png` | 400×110 | 1536×1024 → 裁切 | `Wide pill game button: thick black outline, glossy hot-pink fill, no text, transparent background.` |
| `period-badge.png` / `chances-badge.png` / `ticker-bar.png` | 480×64 / 360×88 / 690×64 | 1536×1024 → 裁切 | `Rounded label bars with thick black outline and cream center for text (ticker: deep-green body with a cream label area on the left 150px), no text, transparent background.` |
| `card-frame.png` | 120×120（九宮格 40） | 1024×1024 → 縮放 | `Nine-slice card frame: cream fill, thick black outline, inner pink dashed line, rounded corners, corners fit in 40px.` |
| `card-title.png` | 400×72 | 1536×1024 → 裁切 | `Hot-pink title ribbon with black outline, dark enough center for white text, no text, transparent background.` |
| `info-bg.png` | 750×750（無縫） | 1024×1024 → 縮放 | `Seamless tile: cream #F3ECE0 background with faint pink dots and tiny ticket-stub shapes, low contrast, edges tile perfectly. No circle-triangle-square trio.` |
| `footer-deco.png` | 750×160 | 1536×1024 → 裁切 | `Footer decoration: a pink arc with small black light dots and a few number tags, transparent background.` |
| `share-preview.jpg` | 1200×630 | 1536×1024 → 裁切 | `Social preview: the SURVIVAL SPIN logo on the left, the pink casino wheel center-right, Moo Rabbit in a hot-pink staff jumpsuit cheering at the bottom right, deep-green game hall background, key content inside the central 1100x580.` |

## 3. 兔比工作人員造型（P3，最後）

1. 先出**設定圖**（正面、3/4 側、側面、背面四視圖），附上 `../../reference/` 熊北四視圖與現有兔比關鍵幀當參考：
   ```
   Moo Rabbit (same face, fur, tech sunglasses and headset as the reference) wearing a hot-pink staff jumpsuit with zipper,
   belt and cuffs, black work gloves and short boots, a round MOOTECH badge on the chest (our own logo, no other symbols),
   an "M-001" number tag on the sleeve. Face fully visible, NO mask. Ears come out through the hood or no hood.
   Four views on a plain light background, high-end 3D render matching the reference series.
   ```
2. 設定圖確認後做 6 段動態，規則同 `../../GPT_ASSET_BRIEF.md` 第 4 節（48 幀、2000ms、頭尾＝基準幀、影子畫進角色、任何一幀不可貼邊、RGBA PNG 序列幀為主交付）。

## 4. 交付前自我檢查

- [ ] 沒有禁止元素（作品名稱／標誌、○△□ 組合、面罩、娃娃、綠色運動服號碼、血腥、中文）
- [ ] 尺寸、透明區正確；同檔名 `.svg` 佔位檔已刪
- [ ] `?skin=survival` 三種狀態截圖、三語主標並排圖已附上
- [ ] 檢查腳本已打勾的列全部 OK
