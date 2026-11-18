# GPT 素材製作指引（20261118_blind_box，拆盲盒・中東神燈寶藏（Arabian Nights））

規格以 `DESIGN_TASKS.md` 為準，本檔只負責「怎麼產出」。

## 使用方式

1. 開新對話，先貼第 1 節 STYLE LOCK；附上目前頁面截圖（390 寬）讓 GPT 看版面。
2. 照優先級：P0 → 整頁截圖確認方向 → P1 → P2 → P3。每次只做一項。
- 檔名照表命名，放進 `DESIGN_TASKS.md`「素材分類規則」指定的子資料夾；副檔名不同就刪掉同名 `.svg` 並改 `assets/js/config.js` 路徑。
- 每交付一項就 commit，在 `DELIVERY_CHECKLIST.md` 該列打勾填 commit，執行 `python3 scripts/check_delivery.py event/20261118_blind_box/DELIVERY_CHECKLIST.md`，已打勾列必須全部 OK。
- GPT 原生尺寸（1024×1024／1024×1536／1536×1024）與目標不同時，用 Code Interpreter 等比縮放後置中裁切。

## 1. STYLE LOCK（每次都貼在提示詞最前面）

```
STYLE LOCK — apply to every image in this conversation:
- Event: "Blind Box" mobile web campaign. Theme: ARABIAN NIGHTS TREASURE — a desert-night palace courtyard, brass magic lamps,
  arabesque patterns, mosaic tiles, pierced metal lanterns, gems and gold coins. Midnight indigo (#1B1446), desert gold (#E8C48A),
  brass (#D4A537), turquoise (#2BB5A7), ruby (#C2334D), lantern amber (#FFB547). Warm, rich, mysterious but BRIGHT.
- Folk-tale "One Thousand and One Nights" motifs only: NOT Disney's Aladdin (no Genie, no Aladdin/Jasmine/Jafar/Abu/Iago,
  no flying carpet with a face, no Agrabah palace, no tiger-head cave, no title lettering). No Arabic script, no religious symbols.
- One consistent light source: soft key light from the upper front-left.
- NO text, letters, numbers or logos anywhere unless the item explicitly asks for a title. NO Chinese characters.
- NO ground shadows (the program adds them). Flat textures stay flat: no perspective, no shadow.
```

## 2. 3D 貼圖（攤平的平面圖，滿版、不留白邊、不畫陰影）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `chest-front` | 1536×1024 → 512×320 | `Flat front face of an ornate Arabian-nights treasure chest, full bleed, 16:10. Dark wood with brass trims and corner plates, arabesque engravings, a few gems, and in the centre a lock plate shaped like a brass magic oil lamp. No text, no shadow, no perspective — a flat texture.` |
| `chest-side` | 1536×1024 → 512×320 | `Flat side/back texture for the same chest: light honey wood planks, brass corner trims and a band of arabesque pattern; low-contrast, no central motif (it gets stretched and tinted).` |
| `chest-lid` | 1024×1024 → 512×512 | `Flat unrolled texture for the arched lid of the same chest: brass straps running from bottom edge to top edge, arabesque carving and gems in between; the BOTTOM edge meets the chest front, the TOP edge meets the back, so put the richest ornament near the bottom.` |
| `chest-lid-end` | 1024×1024 → 512×256 | `A half-disc (semicircle) end piece for the arched lid: flat edge at the bottom, dome at the top, brass rim with a radiating arabesque pattern; transparent outside the semicircle.` |

## 3. 場景與主標（P0）

| 檔名 | GPT 原生 → 目標 | 提示詞 |
|---|---|---|
| `stage-bg` | 1024×1536 → 750×1000 | `Mobile background, portrait. An Arabian-nights palace courtyard at night in one-point perspective: starry sky, distant dunes and a row of horseshoe arches with hanging pierced-brass lanterns in the upper half; a glossy mosaic-tile floor extending toward the viewer in the lower half with perspective, and a warm pool of lantern light on the floor around the lower-middle area. Empty — no chests, no people, no text, no religious symbols.` |
| `title-en` | 1536×1024 → 690×240 | `Custom logo lettering that reads exactly "BLIND BOX" on a transparent background: 黃銅鎏金立體字＋阿拉伯花紋雕刻，可在字旁加一盞冒出魔法煙霧的神燈 (render in English description). Wide horizontal layout, centred, generous padding.` |
| `title-ko` | 同上 | 同上，文字改為 `랜덤박스`（韓文字形各自設計） |
| `title-th` | 同上 | 同上，文字改為 `กล่องสุ่ม`（泰文上下標上下各留 ≥24px） |
| `btn-primary` | 1536×1024 → 400×110 | `A wide pill-shaped game button on transparent background in the theme colours, soft top highlight, slight bottom thickness. No text.` |

## 4. 揭曉、版面元件、圖示（P1／P2）

照 `DESIGN_TASKS.md` 第三節每列的描述與尺寸，提示詞開頭固定加 STYLE LOCK，結尾加 `transparent background, no text`。重點：
- `reward-frame-*` 中間至少 85% 完全透明；四張同構圖、不同材質：普通＝黃銅；稀有＝綠松石鑲邊；超稀有＝紅寶石與金絲花紋；最高級（Secret）＝金色神燈紋章＋寶石滿鑲＋魔法煙霧角飾。
- `reveal-rays` 必須正方形、中心對稱（會旋轉）、白／淡色半透明。
- `card-frame` 是九宮格，裝飾只放四角。`info-bg` 四邊要能無縫拼接。
- `share-preview` 輸出 PNG 或 JPG。

## 5. 交付前自查

- 尺寸、檔名、分類資料夾對嗎？3D 貼圖是滿版平面、沒有陰影與透視？
- 有沒有任何字（主標以外）、中文？主標拼字正確、泰文上下標沒被裁？
- 有沒有出現第一節「禁止元素」？
- `reward-frame-*` 中間是真的透明，不是棋盤格？放進頁面截圖：第一屏（360×640、390×844）＋揭曉畫面（四種稀有度）。

## Refinement delivery 20261118

Use the existing 750×1000 stage as registration reference. Deliver separate full-canvas RGBA curtain/lantern, arcade/columns, and foreground tiled floor images, plus a full opaque night desert background. Keep the original camera, horizon, lighting and object anchors. No UI or prize chests in these layers. Preserve source PNGs in source/scene/layers and resize once to 750×1000 WebP.

Reward vortex: warm volumetric gold sand from the approved dust material, transparent 4×4 sheet of 16 evolving frames, fixed camera and consistent center; no white wire arcs or opaque grey background. Source sheet and extracted frames retained under source/reveal; 1280×1280 WebP atlas, 320px per frame, alpha crossfade between frames.
