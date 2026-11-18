# GPT 素材製作指引（20261118_card_pack，拆卡包・宇宙幻象（Cosmic Illusion））

規格以 `DESIGN_TASKS.md` 為準，本檔只負責「怎麼產出」。

## 使用方式

1. 開新對話，先貼第 1 節 STYLE LOCK；附上目前頁面截圖（390 寬）讓 GPT 看版面。
2. **先做角色設定圖（第 2 節）並交給我們審核**；通過後把設定圖附在每一張有角色的圖的對話裡。
3. 之後照優先級：P0 → 整頁截圖確認方向 → P1 → P2 → P3。每次只做一項。
- 檔名照表命名，放進 `DESIGN_TASKS.md`「素材分類規則」指定的子資料夾；副檔名不同就刪掉同名 `.svg` 並改 `assets/js/config.js` 路徑。
- 每交付一項就 commit，在 `DELIVERY_CHECKLIST.md` 該列打勾填 commit，執行 `python3 scripts/check_delivery.py event/20261118_card_pack/DELIVERY_CHECKLIST.md`，已打勾列必須全部 OK。
- GPT 原生尺寸（1024×1024／1024×1536／1536×1024）與目標不同時，用 Code Interpreter 等比縮放後置中裁切。

## 1. STYLE LOCK（每次都貼在提示詞最前面）

```
STYLE LOCK — apply to every image in this conversation:
- Event: "Card Pack Opening" mobile web campaign. Theme: COSMIC ILLUSION — a dreamy magic stage floating in space:
  nebula gradients of deep space navy (#0D0B2E), nebula violet (#5B2A86), neon magenta (#D94FD8), star cyan (#3FD8FF),
  star gold (#FFD36B) and holographic white. Glowing, luminous and BRIGHT — not horror, not cold mechanical sci-fi.
- One consistent light source: soft key light from the upper front-left.
- NO text, letters, numbers or logos anywhere unless the item explicitly asks for a title. NO Chinese characters.
- NO ground shadows (the program adds them). Flat textures stay flat: no perspective, no shadow.
```

## 2. 角色設定圖：兔比・宇宙兔女郎（P0-A，最先做）

附上官方兔比參考（`brand/moo-rabbit/`）與現有 3D 形象截圖，再貼：
```
Character turnaround sheet, 2400x1350, clean light background. The official Moo Rabbit mascot (keep its face, ears, fur,
chibi proportions and signature accessories exactly as in the reference) in a new COSMIC STAGE HOST outfit: a short cape or
tailcoat with a nebula gradient, a glowing nebula-coloured bow tie, a star hair clip on one ear, holographic gloves, holding
a fan of glowing cards. Wholesome, family-friendly, cute and confident; NOT sexualised — no leotard/bodysuit, no fishnets,
no emphasis on body curves, and NOT the classic magazine bunny costume (no black satin corset + white collar + cuffs +
bow tie + cotton tail combination, no rabbit-head logo). Include: front, three-quarter, side and back views; a height
comparison next to the original Moo Rabbit; four expressions (happy, surprised, wink, excited); close-ups of cape, bow tie,
gloves and hair clip; a colour palette strip. No text other than none at all.
```
交付 `source/character/cosmic-bunny-sheet.png`＋`source/character/README.md`（服裝構成、色碼），**等我們審核通過再往下做**。

## 3. 3D 貼圖（攤平的平面圖，滿版、不留白邊、不畫陰影）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `pack-front-1` | 1024×1536 → 512×768 | `Flat front artwork of a sealed collectible card pack wrapper, full bleed, portrait 2:3. Holographic nebula foil (violet, magenta, cyan) with stars and a planet ring. In the centre: the approved COSMIC BUNNY variant of the Moo Rabbit mascot (attach the approved character sheet) holding a fan of glowing cards. Keep the top and bottom 6% free of key details. No text, no shadow, no perspective — a flat print-ready wrapper face.` |
| `pack-front-2` | 1024×1536 → 512×768 | `Same series, cyan + violet colourway; the cosmic bunny sitting on a crescent moon and winking. Same rules.` |
| `pack-front-3` | 1024×1536 → 512×768 | `Same series, magenta + gold colourway; no character — a giant glowing constellation card inside a galaxy swirl. Same rules.` |
| `pack-back` | 1024×1536 → 512×768 | `Flat back side of the same wrapper: deep space background with a star map and constellation lines, a rounded panel area and barcode-like abstract stripes. Absolutely no readable text or numbers.` |
| `pack-crimp` | 1536×1024 → 512×64（取中間橫條） | `Flat seamless horizontal strip of a heat-sealed crimped foil edge, fine vertical serrated ridges, light grey-white metallic, faint dashed tear line. Crop the middle band to 512×64.` |

## 4. 場景與主標（P0）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `stage-bg` | 1024×1536 → 750×1000 | `Mobile background, portrait. A bright cosmic magic stage in one-point perspective: nebula sky with distant planets and rings in the upper half, a glossy starlight glass floor extending toward the viewer in the lower half with subtle perspective lines and reflections, a glowing ring of light on the floor around the lower-middle area. Empty — no products, no characters, no text.` |
| `title-en` | 1536×1024 → 690×240 | `Custom logo lettering that reads exactly "CARD PACK" on a transparent background: 全息虹彩金屬字, 星芒閃光，可在一個字母加上行星光環或流星 (render in English description). Wide horizontal layout, centred, generous padding.` |
| `title-ko` | 同上 | 同上，文字改為 `카드팩 오픈`（韓文字形各自設計） |
| `title-th` | 同上 | 同上，文字改為 `เปิดซองการ์ด`（泰文上下標上下各留 ≥24px） |
| `btn-primary` | 1536×1024 → 400×110 | `A wide pill-shaped game button on transparent background in the theme colours, soft top highlight, slight bottom thickness. No text.` |

## 5. 揭曉、版面元件、圖示（P1／P2）

照 `DESIGN_TASKS.md` 第三節每列的描述與尺寸，提示詞開頭固定加 STYLE LOCK，結尾加 `transparent background, no text`。重點：
- `reward-frame-*` 中間至少 85% 完全透明；四張同構圖、不同材質：普通＝銀色星塵；稀有＝藍色星雲；超稀有＝紫色銀河漩渦；最高級＝金色超新星爆發＋光環角飾。
- `reveal-rays` 必須正方形、中心對稱（會旋轉）、白／淡色半透明。
- `card-frame` 是九宮格，裝飾只放四角。`info-bg` 四邊要能無縫拼接。
- `share-preview` 輸出 PNG 或 JPG。

## 6. 交付前自查

- 尺寸、檔名、分類資料夾對嗎？3D 貼圖是滿版平面、沒有陰影與透視？
- 有沒有任何字（主標以外）、中文？主標拼字正確、泰文上下標沒被裁？
- 有沒有出現第一節「禁止元素」？
- `reward-frame-*` 中間是真的透明，不是棋盤格？放進頁面截圖：第一屏（360×640、390×844）＋揭曉畫面（四種稀有度）。

## Refinement delivery 20261118

Preserve the approved rabbit identity. Create an obsidian, platinum and moonstone secret foil pack, matching sealed side texture, a mysterious rabbit card back, and a clean reward card front. Keep variable prize names and rarity text out of artwork. Source PNGs are retained under source/secret; web delivery uses separate WebP files. Synthesized foil and secret chime masters live under source/audio; MP3 is used on the page.
