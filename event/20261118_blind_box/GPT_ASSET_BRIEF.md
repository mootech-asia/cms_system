# GPT 素材製作指引（20261118_blind_box，拆盲盒）

給 GPT（ChatGPT 圖像生成＋Code Interpreter）照著做的步驟。規格以 `DESIGN_TASKS.md` 為準，本檔只負責「怎麼產出」。

## 使用方式

1. 開新對話，先貼第 1 節 STYLE LOCK；附上目前頁面截圖（360 或 390 寬）讓 GPT 看版面。
2. 依優先級做：P0 全部到位 → 整頁截圖確認方向 → P1 → P2 → P3。每次只做一項，不滿意在同一對話修改，保持風格一致。
3. 檔名照表命名，放進 `DESIGN_TASKS.md`「素材分類規則」指定的子資料夾（`assets/img/scene|title|3d|reveal|ui|icon|mascot|share/`）；副檔名不同就刪掉同名 `.svg` 並改 `assets/js/config.js` 路徑。
4. 每交付一項就 commit，在 `DELIVERY_CHECKLIST.md` 該列打勾填 commit，執行 `python3 scripts/check_delivery.py event/20261118_blind_box/DELIVERY_CHECKLIST.md`，已打勾列必須全部 OK。
5. **所有圖不得出現中文；除了主標，所有圖都不放文字。**
6. GPT 原生尺寸（1024×1024／1024×1536／1536×1024）與目標不同時，用 Code Interpreter 等比縮放後置中裁切到目標尺寸（下表有寫建議原生尺寸）。

## 1. STYLE LOCK（每次都貼在提示詞最前面）

```
STYLE LOCK — apply to every image in this conversation:
- Event: "Blind Box" mobile web campaign. Theme: pearl-and-lavender prism collection — soft holographic gradients of
  white, pearl, lavender (#a5b8ff, #c9a5ef), mint (#8ed6c5) and peach (#f2c18f), deep navy accents (#29394f).
  Clean, bright, premium collectible feel. No dark nightclub mood, no neon clutter.
- One consistent light source: soft key light from the upper front-left.
- NO text, letters, numbers or logos anywhere unless the item explicitly asks for a title.
- NO Chinese characters. NO ground shadows (the program adds them).
- Do not imitate any existing trading-card game, toy brand or franchise (names, logos, characters, card layouts).
```

## 2. 3D 包裝貼圖（P0／P1）

包裝的立體、打光、透視都由程式做；這裡要的是**攤平的平面貼圖**，滿版、不留白邊、不畫陰影。

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `box-front` | 1024×1024 → 512×512 | `Flat front face artwork of a collectible blind box, full bleed square. Pearl white box with a soft lavender-to-mint holographic gradient, a large stylized question-mark emblem in deep navy with a pearl outline, thin inset border, small sparkles. No text, no numbers, no shadow, no perspective — a flat print-ready box face.` |
| `box-side` | 1024×1024 → 512×512 | `Flat seamless pattern for the side of the same blind box, full bleed square: very light grey-white background with a sparse pattern of small faint question marks and sparkles. Mostly light, low contrast (the program tints it). No text, no shadow.` |
| `box-lid` | 1024×1024 → 512×512 | `Flat top face of the blind box lid, full bleed square: pearl white with a thin lavender inset border and a central four-point star seal emblem. No text, no shadow, no perspective.` |
| `box-lid-side` | 1536×1024 → 512×80（取中間橫條） | `Flat seamless horizontal band for the rim of the box lid: light pearl with one thin lavender stripe near the bottom edge. Full bleed, no shadow.` 用 Code Interpreter 裁中間一條再縮到 512×80。 |

## 3. 場景與主標（P0）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `stage-bg` | 1024×1536 → 750×1000（等比縮放後裁上下） | `Mobile background, portrait. A bright 3D showroom seen in one-point perspective: a clean pearl-lavender back wall in the upper half, a glossy floor extending toward the viewer in the lower half with subtle perspective grid lines converging to the center, a soft circular pool of light on the floor around the lower-middle area. Side walls angle inward slightly. Empty space — no products, no people, no text.` |
| `title-en` | 1536×1024 → 690×240（去背後裁切） | `Custom logo lettering that reads exactly "BLIND BOX" on a transparent background. Chunky rounded display letters with pearl-holographic fill, deep navy outline, soft 3D bevel and a few sparkles integrated into the letters (the O shaped like a small gift box). Wide horizontal layout, centered, generous padding.` |
| `title-ko` | 同上 | 同上，文字改為 `랜덤박스`（韓文字形各自設計，不是英文版換字） |
| `title-th` | 同上 | 同上，文字改為 `กล่องสุ่ม`（泰文上下標上下各留 ≥24px） |
| `btn-primary` | 1536×1024 → 400×110 | `A wide pill-shaped game button on transparent background, deep navy (#29394f) with a soft top highlight and a subtle pearl rim, slight bottom thickness. No text.` |

## 4. 揭曉與版面元件（P1）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `reward-back` | 1024×1536 → 600×900 | `Back side of a premium collectible prize card, portrait 2:3, rounded corners on transparent background. Deep navy with pearl-lavender foil border, concentric holographic rings and a central four-point star emblem. No text.` |
| `reward-frame-common` | 1024×1536 → 600×900 | `Ornamental card frame overlay, portrait 2:3, transparent center (at least 85% of the area fully transparent), silver-grey brushed metal border with small corner ornaments. No text.` |
| `reward-frame-rare` | 同上 | 同上，改 `polished blue metal border with a few sparkles` |
| `reward-frame-epic` | 同上 | 同上，改 `purple holographic border with light streaks` |
| `reward-frame-legendary` | 同上 | 同上，改 `gold border with strong glow, crown-like top ornament and corner gems` （Secret 隱藏款，要明顯比其他三張華麗） |
| `reveal-rays` | 1024×1024 → 750×750 | `Radial light rays burst, white on transparent background, perfectly centered and rotationally symmetric, bright center fading to fully transparent edges. No color.` |
| `period-badge` | 1536×1024 → 480×64 | `Slim horizontal ribbon banner, pearl white center area for text, lavender ribbon tails at both ends, transparent background. No text.` |
| `chances-badge` | 1536×1024 → 360×88 | `Small rounded label plate, pearl white center, thin lilac rim, transparent background. No text.` |
| `ticker-bar` | 1536×1024 → 690×64 | `Long slim pill bar, translucent deep navy, the left 22% is a lavender tab, transparent background. No text.` |
| `card-frame` | 1024×1024 → 120×120 | `Nine-slice friendly rounded card frame, white center, thin lilac border, simple corner ornaments only in the corners. No text.` |
| `card-title` | 1536×1024 → 400×72 | `Ribbon title banner, lavender-to-navy gradient, pointed ends, transparent background. No text.` |
| `info-bg` | 1024×1024 → 750×750 | `Seamless tileable subtle pattern, pale lavender-grey with tiny sparkles and dots, very low contrast.` 用 Code Interpreter 檢查四邊可無縫拼接。 |
| `share-preview` | 1536×1024 → 1200×630 | 英文主標＋三個包裝並排的主視覺，背景同 stage-bg；**輸出 PNG 或 JPG**。 |

## 5. 圖示與裝飾（P2）

| 檔名 | 目標 | 提示詞 |
|---|---|---|
| `btn-arrow` | 96×96 | `Round button with a right-pointing chevron, pearl white with navy chevron, soft shadow inside the circle only, transparent background.` |
| `icon-sound-on` / `icon-sound-off` / `icon-share` | 64×64 ×3 | 同一套圓形小按鈕：喇叭＋聲波／喇叭＋叉號／分享三點，navy 線條、珍珠白底。 |
| `icon-rotate` | 160×160 | `Upright smartphone outline with a curved rotation arrow, white lines, transparent background.` |
| `footer-deco` | 750×160 | `Soft pearl-lavender wave with scattered sparkles, transparent top, for the bottom of a page.` |

## 6. 吉祥物 兔比 Moo Rabbit（暫緩：目前頁面不放，先不要做）

規格見 `DESIGN_TASKS.md` 第四節。角色形象以品牌包為準：`brand/moo-rabbit/`（cms_system 事業部品牌包）；現有動態參考 `event/20261111_lucky_wheel/assets/img/mascot/`；每次生成都附上三視圖／設定圖，並附官方 MOOTECH logo。
製作流程沿用 `event/20261111_lucky_wheel/GPT_ASSET_BRIEF.md` 的吉祥物章節（sprite sheet 3×4 → 組 48 幀 GIF、共用 base-frame、交付前檢查），只換成下表的動作：

| 狀態 | 提示詞重點（英文） |
|---|---|
| `base-frame` | `Full-body standing pose, facing the viewer, both paws resting lightly in front at waist height (they will sit just above the top edge of a product in front of the character), friendly smile. 400×500 transparent canvas, feet on a baseline 12px above the bottom, soft contact shadow under the feet.` |
| `idle` | `Gentle breathing and a slow head tilt, glancing left and right at the packages, small blink. Starts and ends exactly on base-frame.` |
| `anticipate` | `Leans forward with excitement, rubs paws together, ears/eyes perk up, tiny bounce. Starts and ends on base-frame.` |
| `celebrate` | `Throws both arms up and cheers, sparkles around the head, one happy hop. Starts and ends on base-frame.` |
| `lose` | `Small cute disappointment: shoulders drop, a little pout and head shake, then a reassuring smile. Not sad or crying. Starts and ends on base-frame.` |

提醒：畫面上包裝會擋住角色腰部以下，表演要集中在上半身；鏡頭固定，角色不可縮放；影子畫在素材裡。

## 7. 交付前自查

- 尺寸、檔名、透明區對嗎？3D 貼圖是滿版平面、沒有陰影與透視？
- 圖上有沒有任何字（主標以外）？有沒有中文？主標拼字正確、泰文上下標沒被裁？
- `reward-frame-*` 中間是真的透明，不是棋盤格？
- 放進頁面後截圖：第一屏（360×640、390×844）＋揭曉畫面（四種稀有度）。
