# Moo Rabbit（兔比）美術需求

> cms_system 事業部吉祥物，比照熊北（Mootech Bear）製作一整套形象素材。
> 交付後在 [`DELIVERY_CHECKLIST.md`](DELIVERY_CHECKLIST.md) 打勾並填 commit，再執行
> `python3 scripts/check_delivery.py brand/moo-rabbit/DELIVERY_CHECKLIST.md`，已打勾的列必須全部 `OK`。

## 0. 參考素材（每次生成都要附上）

| 檔案 | 用途 |
|---|---|
| `event/20261111_lucky_wheel/reference/bear-view-1-front.png`～`bear-view-4-back.png` | 熊北四視圖（官方唯一依據） |
| `event/20261111_lucky_wheel/reference/bear-sticker-*.webp`、`bear-pose-intro.webp` | 熊北貼圖與全身姿勢的構圖、動作幅度、渲染質感 |
| `event/20261111_lucky_wheel/reference/mootech-logo-*.png` | 背心左胸的官方 MOOTECH 標誌 |
| 兔比定稿後：`01_character/views/*.png` | 之後所有兔比素材都改附兔比自己的四視圖 |

公開連結前綴：`https://mootech-asia.github.io/cms_system/event/20261111_lucky_wheel/reference/`

---

## 1. 角色設定

| 項目 | 設定 |
|---|---|
| 名稱 | Moo Rabbit（中文：兔比；圖上只能出現英文 Moo Rabbit） |
| 身分 | MOOTECH cms_system 事業部吉祥物：CMS 網站系統、版型設計、換膚、多語系 |
| 象徵 | 兔子靈巧敏捷，象徵 CMS 快速建站、靈活換膚、多語系一鍵上線 |
| 性格 | 靈巧、細心、有活力、友善；和熊北一樣自信、不幼稚 |
| 體型 | Q 版偏寫實，頭身比約 1：3（耳朵另計）；比熊北纖細但同樣圓潤，圓肚子、短腿 |
| 身高 | 約 150 cm（不含耳朵）；與熊北 200 cm、成人 175 cm 並排 |
| 臉部 | 臉圓、臉頰肉肉、吻部短、表情親切自信 |
| 耳朵 | 長耳直立是辨識重點，情緒主要靠耳朵表現（豎起、彎折、抖動）；耳內淡粉色 |
| 毛髮 | 蓬鬆細緻、根根分明的白毛 `#E9EDF2`；鼻子、耳內、掌心肉墊淡粉色（色碼於角色設定圖標出） |
| 手腳 | 兔掌，無利爪，掌心有粉色肉墊；能清楚比讚、比愛心、握手 |
| 尾巴 | 短而蓬鬆的圓尾巴（背面可見） |

### 招牌配件（與熊北完全相同，不可省略、不可換色）

| 配件 | 規格 |
|---|---|
| 科技墨鏡 | 漸層鏡片 橘 → 洋紅 → 紫藍，鏡片上有 HUD 數位圖形；深灰金屬鏡框 |
| 耳機 | 深色耳罩式，耳罩外側有青藍與橘色發光圓環；**角色自己的左側**有細長麥克風臂到嘴邊；頭帶與長耳朵合理共存（耳朵從頭帶兩側穿出） |
| 背心 | 深海軍藍 `#1A2233` 泡泡羽絨背心（一格一格鼓起）、正面拉鍊、**左胸官方 MOOTECH 標誌**（「不可能 M」藍綠 → 黃綠漸層圖形＋白色字標；不是橘色 M）；背面無標誌 |
| 內搭 | 深灰色連帽衣，帽子在背後自然垂下 |

### 配色

| 用途 | 色碼 |
|---|---|
| 毛色 | `#E9EDF2` |
| 背心深藍 | `#1A2233` |
| 科技藍 | `#3DA8FF` |
| 點綴橘 | `#FF9A3C` |
| 耳內／鼻子／肉墊粉 | 由角色設定圖提案並標出色碼 |

### 禁止事項（沿用熊北＋本事業部規則）

- 不出現國旗、國徽或其他公司標誌
- 不出現紅色警示、錯誤畫面等「系統不穩定」的聯想
- 不做兇猛、露牙威嚇、攻擊性的表情
- 背景不使用機房、伺服器、成排螢幕
- **任何圖都不得出現中文**；需要文字時只用英文／韓文／泰文，並在提示詞中寫出確切文字

---

## 2. 製作物清單（共 34 項＋活動動態）

畫布尺寸固定（方便自動核對）。透明背景一律輸出 PNG（含 alpha）。

### 01_character 角色設定（5）— 第一階段，通過才做後續

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| 01 | `01_character/turnaround-sheet.png` | 1536×1024 | 角色設定圖：左側角色資料＋色票；上排五視圖（Front / 3/4 View / Side / Back / 3/4 Rear）；中排六表情（Smile / Laugh / Focused / Listening / Thinking / Thumbs Up）；下排六細節（HUD Glasses / Headphones Glow Ring / Embroidered Logo / Zipper / Fur Texture / Paw Pad）；右下比例（兔比 150 cm、熊北 200 cm、成人 175 cm）。**標註全英文**，深藍科技背景 |
| 02 | `01_character/views/01-front.png` | 1024×1536 | 正面全身，標準 A 字站姿，透明背景 |
| 03 | `01_character/views/02-three-quarter.png` | 1024×1536 | 四分之三側面 |
| 04 | `01_character/views/03-side.png` | 1024×1536 | 側面 |
| 05 | `01_character/views/04-back.png` | 1024×1536 | 背面（內搭帽子、尾巴、背心無標誌） |

四張單張必須同大小、腳底對齊、同一個角色。

### 02_poses 全身姿勢（10）— 1024×1536 透明背景

動作沿用熊北十種姿勢（系列一致），道具改成 cms_system 主題（P02～P04）。

| # | 檔名 | 熊北對應 | 兔比動作 |
|---|---|---|---|
| P01 | `02_poses/p01-intro.png` | P01 介紹 | 側身站立，一隻手朝畫面右側攤開介紹，另一手插腰，自信微笑 |
| P02 | `02_poses/p02-templates.png` | P02 守護盾牌 | 雙手在胸前展開一疊半透明青藍色發光的網站版型卡片（扇形排開，卡片上只有版面色塊、沒有文字） |
| P03 | `02_poses/p03-globe-languages.png` | P03 捧地球 | 單手托著漂浮發光地球，周圍環繞三個發光標籤「EN」「KO」「TH」，抬頭微笑 |
| P04 | `02_poses/p04-tablet-thumbsup.png` | P04 平板比讚 | 一手拿半透明全像平板（畫面是網站版面色塊與調色盤），另一手比讚，開心大笑 |
| P05 | `02_poses/p05-call-wave.png` | P05 接聽揮手 | 一手扶耳機麥克風像在接聽，另一手揮手，旁邊漂浮發光信封圖示 |
| P06 | `02_poses/p06-wave.png` | P06 揮手打招呼 | 面向鏡頭揮手打招呼，耳朵微微歪向一側 |
| P07 | `02_poses/p07-thinking.png` | P07 思考 | 一手托下巴思考，一隻耳朵彎折 |
| P08 | `02_poses/p08-wink-thumbsup.png` | P08 眨眼比讚 | 眨眼比讚，耳朵直立 |
| P09 | `02_poses/p09-handshake.png` | P09 握手 | 伸出兔掌握手（只露出對方的手，不畫第二個角色的臉） |
| P10 | `02_poses/p10-heart-hands.png` | P10 比愛心 | 雙手在胸前比愛心 |

### 03_stickers 半身貼圖（11）— 1024×1024 透明背景

胸像構圖，**角色佔畫面八成**，表情誇張一點方便縮小後辨識。

| # | 檔名 | 內容 |
|---|---|---|
| S01 | `03_stickers/s01-intro.png` | 同 P01 半身 |
| S02 | `03_stickers/s02-templates.png` | 同 P02 半身 |
| S03 | `03_stickers/s03-globe-languages.png` | 同 P03 半身 |
| S04 | `03_stickers/s04-tablet-thumbsup.png` | 同 P04 半身 |
| S05 | `03_stickers/s05-call-wave.png` | 同 P05 半身 |
| S06 | `03_stickers/s06-wave.png` | 同 P06 半身 |
| S07 | `03_stickers/s07-wink-thumbsup.png` | 同 P08 半身 |
| S08 | `03_stickers/s08-thinking.png` | 同 P07 半身 |
| S09 | `03_stickers/s09-handshake.png` | 同 P09 半身 |
| S10 | `03_stickers/s10-heart-hands.png` | 同 P10 半身 |
| S11 | `03_stickers/s11-hug-palette.png` | 抱著發光的調色盤（換膚主題；熊北 S11 是抱愛心） |

### 04_key-visual 事業部主視覺（2）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| K01 | `04_key-visual/k01-key-visual.jpg` | 1280×720 | 兔比在右側，周圍漂浮多個全像網站版面，版面依序換膚（不同配色）與換語系標籤（EN／KO／TH）；**左側 45% 留白可放字，圖上不放任何文字** |
| K02（暫緩） | `04_key-visual/k02-loop-15s.mp4` | 1280×720，15 秒 | 以 K01 為首幀的圖生影片：版面面板展開、換膚、收合循環；兔比點選面板、耳朵抖動、最後比讚；**首尾畫面一致可無縫循環**；不出現文字、紅色警示（需用影片生成工具，例如即夢／Runway） |

### 05_support 客服介面（3）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| C01 | `05_support/c01-avatar-round.png` | 512×512 | 圓形頭像用正方形原圖（臉與耳朵完整入鏡，使用時裁圓） |
| C02 | `05_support/c02-support-portrait.png` | 1280×1280 | 客服形象原圖：戴耳機麥克風、親切微笑、上半身，淺色乾淨背景 |
| C03 | `05_support/c03-video-call-vertical.png` | 720×960 | 視訊畫面直式：像視訊通話中的兔比，揮手打招呼 |

### 06_social 社群分享（3）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| M01 | `06_social/m01-banner-long.png` | 1575×300 | 長橫幅：兔比在右側，左側留白可放字，**圖上不放文字** |
| M02 | `06_social/m02-banner-copyspace.png` | 1920×1008 | 橫幅：兔比托多語系地球（同 P03）在右側，左側留白可放字 |
| M03 | `06_social/m03-share-preview.jpg` | 1200×630 | 網址分享預覽：兔比＋官方 MOOTECH 標誌，可放英文「MOOTECH CMS」（若不確定文案就不放字） |

### 07_motion 活動動態

目前的轉盤活動 GIF（待機 ×3、抽獎中、發表結果）由活動資料夾管理：
規格見 `event/20261111_lucky_wheel/DESIGN_TASKS.md` 第四節，勾選見 `event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md` 的 D、E 區。
日後新活動的動態也照「活動資料夾管理、品牌包只列索引」的方式。

---

## 3. 驗收（每張都要過）

- [ ] 與熊北四視圖並排，渲染品質、光線、毛髮質感像同一系列
- [ ] 配件四項（墨鏡、耳機＋左側麥克風、背心＋官方標誌、深灰連帽內搭）都在且沒換色
- [ ] 頭身比約 1：3、耳朵與頭帶關係正確
- [ ] 沒有中文、沒有多餘文字、沒有其他公司標誌
- [ ] 尺寸與檔名和本表一致；透明背景真的透明（不是白底或棋盤格圖案）
- [ ] 第二階段起，每張都附上兔比四視圖當參考，角色前後一致

---

## 4. GPT 提示詞

### 4.1 共通設定（每張都先貼這段）

```
CHARACTER LOCK — Moo Rabbit, sibling mascot of the attached Mootech Bear. Match the bear's
universe exactly: high-fidelity 3D character render, C4D look, fluffy finely detailed fur,
soft studio lighting, chibi-realistic proportions (head:body about 1:3, ears excluded).

Moo Rabbit: white rabbit, fur #E9EDF2, soft pink inner ears, nose and paw pads, long upright ears
(the signature feature; ears pass naturally on both sides of the headphone band), round face,
chubby cheeks, short muzzle, short fluffy round tail, rabbit paws without claws.
Personality: nimble, attentive, energetic, friendly and confident (not childish).

Accessories identical to the bear, never omitted or recolored:
- tech sunglasses: dark grey metal frame, gradient lenses orange -> magenta -> purple-blue, HUD graphics on the lenses
- dark over-ear headphones with glowing cyan-blue and orange rings, thin mic boom on the CHARACTER'S OWN LEFT side
- deep navy #1A2233 quilted puffer vest, front zipper, the official MOOTECH logo on the left chest
  (attached logo: "impossible M" line mark with a cyan-to-lime gradient + white MOOTECH wordmark; never an orange M); no logo on the back
- dark grey hoodie worn under the vest, hood hanging at the back

Never: Chinese characters, any text not explicitly given, national flags or emblems, other companies' logos,
red warning/error visuals, fierce or teeth-baring faces, server rooms or rows of monitors.
```

### 4.2 角色設定圖與四視圖（01）

```
(CHARACTER LOCK) Create a professional 3D CHARACTER TURNAROUND SHEET, 1536x1024, dark navy tech background.
ALL LABELS IN ENGLISH ONLY.
- Top-left: MOOTECH logo + "CHARACTER TURNAROUND SHEET". Top-right: "Moo Rabbit | 3D Character Design".
- Left panel "Character Profile": Name: Moo Rabbit / Style: Tech x Friendly x Professional /
  Proportion: Chibi-realistic, head:body 1:3 / Personality: Nimble, Attentive, Energetic, Friendly / Usage: Brand mascot, UI, Motion, 3D.
- Left panel "Color Palette": #E9EDF2, #1A2233, #3DA8FF, #FF9A3C and the pink you chose (write its hex).
- Top row: Front / 3/4 View / Side / Back / 3/4 Rear, full body, same size, feet aligned, A-pose.
- Middle row "Expression Set": Smile / Laugh / Focused / Listening / Thinking / Thumbs Up.
- Bottom row "Details": HUD Glasses / Headphones Glow Ring / Embroidered Logo / Zipper / Fur Texture / Paw Pad.
- Bottom-right "Scale": Moo Rabbit 150 cm (ears excluded) next to Mootech Bear 200 cm and a 175 cm human silhouette.
The same character in every view, not different characters.
```

四視圖單張（各一張，1024×1536，透明背景）：

```
(CHARACTER LOCK) Using the approved Moo Rabbit turnaround sheet, render ONE full-body view: [FRONT / THREE-QUARTER / SIDE / BACK].
1024x1536, transparent background PNG, A-pose, character centered with even margins, feet near the bottom edge.
The four views must share the same scale and foot baseline.
```

### 4.3 全身姿勢（02）

```
(CHARACTER LOCK) Attach the four Moo Rabbit views. 1024x1536, transparent background PNG,
full body, character complete with margins on all sides. Pose: [見下表英文動作]
```

| # | 英文動作 |
|---|---|
| P01 | `Standing sideways, one paw open toward the right side of the frame as if introducing content, the other paw on the hip, confident smile.` |
| P02 | `Holding a fan of translucent glowing cyan website layout cards in front of the chest (cards show only colored layout blocks, no text).` |
| P03 | `One paw holding a weightless glowing globe; three glowing tags "EN", "KO", "TH" orbit the globe; looking up at it with a smile.` |
| P04 | `One paw holding a translucent holographic tablet showing colored website layout blocks and a color palette, the other paw giving a big thumbs up, laughing.` |
| P05 | `One paw touching the headset mic as if answering a call, the other paw waving; a small glowing envelope icon floats nearby.` |
| P06 | `Facing the camera and waving hello, ears slightly tilted to one side.` |
| P07 | `Thinking with a paw on the chin, one ear folded.` |
| P08 | `Winking and giving a thumbs up, ears upright.` |
| P09 | `Reaching out for a handshake; only the other person's hand and sleeve are visible, no second face.` |
| P10 | `Making a heart shape with both paws in front of the chest.` |

### 4.4 半身貼圖（03）

```
(CHARACTER LOCK) Attach the four Moo Rabbit views. 1024x1024, transparent background PNG,
bust shot, the character fills about 80% of the frame, face clearly visible,
slightly exaggerated expression so it reads at small sizes. Pose: [同 P 表英文動作；S11 用下句]
```

S11：`Hugging a glowing color palette (skin themes) with both arms, happy closed-eye smile.`

### 4.5 事業部主視覺（04）

K01：
```
(CHARACTER LOCK) 1280x720 key visual. Moo Rabbit on the right third, tapping one of several floating
holographic website layout panels; the panels show different color skins and small "EN" "KO" "TH" tags.
Bright, clean, modern tech scene in brand colors. Keep the left 45% as clean copy space. No other text.
```

K02（影片工具，以 K01 為首幀）：
```
15-second seamless loop, 1280x720. Panels unfold one by one and switch color skins; language tags flip EN -> KO -> TH;
Moo Rabbit taps panels, ears twitch, and gives a thumbs up near the end; everything returns to the first frame at 15s.
Sunglasses and headphone LEDs stay lit. No text, no red warnings.
```

### 4.6 客服介面（05）與社群分享（06）

```
(CHARACTER LOCK) [C01] 512x512 square portrait for a round avatar, face and both ears fully inside a centered circle, light clean background.
(CHARACTER LOCK) [C02] 1280x1280 customer support portrait, upper body, headset mic, warm friendly smile, light clean background.
(CHARACTER LOCK) [C03] 720x960 vertical video-call frame, Moo Rabbit waving hello as if on a video call, soft office-free background.
(CHARACTER LOCK) [M01] 1575x300 long banner, Moo Rabbit on the right, clean brand-color background, left side empty for copy. No text.
(CHARACTER LOCK) [M02] 1920x1008 banner, Moo Rabbit holding the language globe (as P03) on the right, left side empty for copy. No text.
(CHARACTER LOCK) [M03] 1200x630 link preview, Moo Rabbit with the official MOOTECH logo; text exactly "MOOTECH CMS" or no text.
```

輸出尺寸和 GPT 原生尺寸不同時（C01、C02、C03、M01、M02、M03、K01），用 Code Interpreter 等比縮放後置中裁切到表中的精確尺寸。
