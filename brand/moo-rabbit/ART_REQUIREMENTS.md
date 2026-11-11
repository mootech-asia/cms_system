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
| 兔比定稿後：`promo/views/*.png`、`promo/views-lineup.png` | 之後所有兔比素材都改附兔比自己的四視圖 |

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

## 2. 製作物清單（共 38 項＋活動動態）

分類比照熊北（MooBear）實際素材資料夾：**主要形象／表情包／宣傳／網站影片**。檔名與資料夾一律英文。
畫布尺寸固定（方便自動核對）；透明背景一律輸出 PNG（含 alpha）。

| 熊北資料夾 | 兔比路徑 | 內容 |
|---|---|---|
| 主要形象.png | `main-image.png` | 主圖 |
| 表情包/ | `stickers/` | 總覽圖、半身貼圖、全身姿勢 |
| 宣傳/ | `promo/` | 設定圖、四視圖、視訊連線動畫、墊底圖、profile、客服形象、主視覺、橫幅、分享預覽 |
| 網站影片/ | `website-video/` | 15 秒循環影片 |

**製作順序**：先做 `promo/character-sheet.png`＋四視圖（第一階段），審核通過才做其他項目。

### main-image 主要形象（1）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| M1 | `main-image.png` | 1024×1536 | 兔比代表形象：正面全身、自信微笑、一手比讚，透明背景（對應熊北 `主要形象.png`） |

### promo 宣傳（14）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| R01 | `promo/character-sheet.png` | 1536×1024 | **設定圖（第一階段）**：左側角色資料＋色票；上排五視圖（Front / 3/4 View / Side / Back / 3/4 Rear）；中排六表情（Smile / Laugh / Focused / Listening / Thinking / Thumbs Up）；下排六細節（HUD Glasses / Headphones Glow Ring / Embroidered Logo / Zipper / Fur Texture / Paw Pad）；右下比例（兔比 150 cm、熊北 200 cm、成人 175 cm）。**標註全英文**，深藍科技背景（對應熊北 `設定.png`） |
| R02 | `promo/views/01-front.png` | 1024×1536 | 正面全身，A 字站姿，透明背景（第一階段） |
| R03 | `promo/views/02-three-quarter.png` | 1024×1536 | 四分之三側面（第一階段） |
| R04 | `promo/views/03-side.png` | 1024×1536 | 側面（第一階段） |
| R05 | `promo/views/04-back.png` | 1024×1536 | 背面：內搭帽子、尾巴、背心無標誌（第一階段） |
| R06 | `promo/video-call.gif` | 720×960，≥24 幀循環 | **視訊連線動畫**：像視訊通話中的兔比，揮手打招呼、耳朵輕晃、眨眼；頭尾無縫循環（對應熊北 `視訊連線動畫.gif`；製作方式同轉盤 GIF 的 sprite sheet＋組 GIF 腳本） |
| R07 | `promo/backdrop.png` | 1575×300 | **墊底圖**：長橫幅，兔比在右側，品牌色乾淨背景，左側留白可放字，**圖上不放文字**（對應熊北 `墊底圖.png`） |
| R08 | `promo/profile.jpg` | 512×512 | **profile 頭像**：臉與兩隻耳朵完整入鏡，置中、可裁圓，淺色乾淨背景（對應熊北 `profile.jpg`） |
| R09 | `promo/support-portrait.png` | 1280×1280 | 客服形象：戴耳機麥克風、親切微笑、上半身，淺色乾淨背景 |
| R10 | `promo/key-visual.jpg` | 1280×720 | 事業部主視覺：兔比在右側，周圍漂浮多個全像網站版面，版面依序換膚與換語系標籤（EN／KO／TH）；**左側 45% 留白、不放文字**（也是網站影片的首幀） |
| R11 | `promo/banner-copyspace.png` | 1920×1008 | 橫幅：兔比托多語系地球在右側，左側留白可放字 |
| R12 | `promo/share-preview.jpg` | 1200×630 | 網址分享預覽：兔比＋官方 MOOTECH 標誌；可放英文「MOOTECH CMS」，文案不確定就不放字 |
| R13 | `promo/views-lineup.png` | 1536×1024 | 四視圖並排一張（同大小、腳底對齊、淺灰平塗背景，無文字），方便外包與生圖附件 |
| R14 | `promo/with-moobear.png` | 1536×1024 | 兔比與熊北同框（熊北依官方四視圖，兔比 150 cm、熊北 200 cm），兩人一起比讚，透明背景 |

### stickers 表情包（22）

**半身貼圖（11）**：1024×1024 透明背景；胸像構圖，**角色佔畫面八成**，表情誇張一點方便縮小後辨識。

| # | 檔名 | 內容 |
|---|---|---|
| S01 | `stickers/s01-intro.png` | 一手朝右側攤開介紹，另一手插腰 |
| S02 | `stickers/s02-templates.png` | 胸前展開一疊發光的網站版型卡片（卡片只有色塊、沒有文字） |
| S03 | `stickers/s03-globe-languages.png` | 托著發光地球，環繞「EN」「KO」「TH」標籤 |
| S04 | `stickers/s04-tablet-thumbsup.png` | 拿全像平板（網站版面色塊＋調色盤）比讚大笑 |
| S05 | `stickers/s05-call-wave.png` | 扶耳機麥克風接聽，另一手揮手，旁邊有發光信封 |
| S06 | `stickers/s06-wave.png` | 揮手打招呼，耳朵微歪 |
| S07 | `stickers/s07-wink-thumbsup.png` | 眨眼比讚，耳朵直立 |
| S08 | `stickers/s08-thinking.png` | 托下巴思考，一隻耳朵彎折 |
| S09 | `stickers/s09-handshake.png` | 伸出兔掌握手（只露出對方的手） |
| S10 | `stickers/s10-heart-hands.png` | 雙手比愛心 |
| S11 | `stickers/s11-hug-palette.png` | 抱著發光調色盤（換膚主題） |

**全身姿勢（10）**：1024×1536 透明背景，動作同上（S01～S10 的全身版），角色完整、四周留白。

| # | 檔名 |
|---|---|
| P01 | `stickers/full-body/p01-intro.png` |
| P02 | `stickers/full-body/p02-templates.png` |
| P03 | `stickers/full-body/p03-globe-languages.png` |
| P04 | `stickers/full-body/p04-tablet-thumbsup.png` |
| P05 | `stickers/full-body/p05-call-wave.png` |
| P06 | `stickers/full-body/p06-wave.png` |
| P07 | `stickers/full-body/p07-wink-thumbsup.png` |
| P08 | `stickers/full-body/p08-thinking.png` |
| P09 | `stickers/full-body/p09-handshake.png` |
| P10 | `stickers/full-body/p10-heart-hands.png` |

**總覽圖（1）**

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| S00 | `stickers/stickers-sheet.png` | 2048×1536 | 11 張半身貼圖排成 4 欄 × 3 列（每格 512×512，最後一格留空），透明背景、無文字（對應熊北 `表情包.png`；用 Code Interpreter 把 S01～S11 拼成一張） |

### website-video 網站影片（1）

| # | 檔名 | 尺寸 | 內容 |
|---|---|---|---|
| V01 | `website-video/loop-15s.mp4` | 1280×720，15 秒 | 以 `promo/key-visual.jpg` 為首幀的圖生影片：版面面板展開、換膚、收合循環；兔比點選面板、耳朵抖動、最後比讚；**首尾畫面一致可無縫循環**；不出現文字、紅色警示（需用影片生成工具，例如即夢；熊北的網站影片也是即夢產出） |

### 活動動態（不在本表）

轉盤活動的 5 個 GIF（待機 ×3、抽獎中、發表結果）由活動資料夾管理：
規格見 `event/20261111_lucky_wheel/DESIGN_TASKS.md` 第四節，勾選見 `event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md` 的 D、E 區。

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

### 4.2 設定圖與四視圖（promo R01～R05、R13）

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

四視圖單張（R02～R05，各一張，1024×1536，透明背景）；R13 為四張並排（1536×1024、淺灰平塗背景、無文字）：

```
(CHARACTER LOCK) Using the approved Moo Rabbit turnaround sheet, render ONE full-body view: [FRONT / THREE-QUARTER / SIDE / BACK].
1024x1536, transparent background PNG, A-pose, character centered with even margins, feet near the bottom edge.
The four views must share the same scale and foot baseline.
```

### 4.3 全身姿勢（stickers/full-body P01～P10）與主要形象（M1）

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
| P07 | `Winking and giving a thumbs up, ears upright.` |
| P08 | `Thinking with a paw on the chin, one ear folded.` |
| P09 | `Reaching out for a handshake; only the other person's hand and sleeve are visible, no second face.` |
| P10 | `Making a heart shape with both paws in front of the chest.` |
| M1（main-image） | `Front view, full body, confident smile, one paw giving a thumbs up, the definitive hero image of the character.` |

### 4.4 半身貼圖（stickers S01～S11）

```
(CHARACTER LOCK) Attach the four Moo Rabbit views. 1024x1024, transparent background PNG,
bust shot, the character fills about 80% of the frame, face clearly visible,
slightly exaggerated expression so it reads at small sizes. Pose: [S01～S10 用 P01～P10 同編號的英文動作；S11 用下句]
```

S11：`Hugging a glowing color palette (skin themes) with both arms, happy closed-eye smile.`

### 4.5 主視覺（promo R10）與網站影片（website-video V01）

R10：
```
(CHARACTER LOCK) 1280x720 key visual. Moo Rabbit on the right third, tapping one of several floating
holographic website layout panels; the panels show different color skins and small "EN" "KO" "TH" tags.
Bright, clean, modern tech scene in brand colors. Keep the left 45% as clean copy space. No other text.
```

V01（影片工具，以 R10 為首幀）：
```
15-second seamless loop, 1280x720. Panels unfold one by one and switch color skins; language tags flip EN -> KO -> TH;
Moo Rabbit taps panels, ears twitch, and gives a thumbs up near the end; everything returns to the first frame at 15s.
Sunglasses and headphone LEDs stay lit. No text, no red warnings.
```

### 4.6 其他宣傳素材（promo R06～R09、R11、R12、R14）與總覽圖（S00）

```
(CHARACTER LOCK) [R06 video-call.gif] Sprite sheet 1024x1536, 3x4 grid = 12 frames (make 2 sheets = 24 frames):
  vertical video-call framing of Moo Rabbit (upper body), waving hello, ears swaying, one blink; loop seamlessly; soft light background, no text.
  Assemble with the GIF script in event/20261111_lucky_wheel/GPT_ASSET_BRIEF.md 4.3 using size=(720, 960).
(CHARACTER LOCK) [R07 backdrop.png] 1575x300 long banner, Moo Rabbit on the right, clean brand-color background, left side empty for copy. No text.
(CHARACTER LOCK) [R08 profile.jpg] 512x512 square portrait for a round avatar, face and both ears fully inside a centered circle, light clean background.
(CHARACTER LOCK) [R09 support-portrait.png] 1280x1280 customer support portrait, upper body, headset mic, warm friendly smile, light clean background.
(CHARACTER LOCK) [R11 banner-copyspace.png] 1920x1008 banner, Moo Rabbit holding the language globe (as S03) on the right, left side empty for copy. No text.
(CHARACTER LOCK) [R12 share-preview.jpg] 1200x630 link preview, Moo Rabbit with the official MOOTECH logo; text exactly "MOOTECH CMS" or no text.
(CHARACTER LOCK) [R14 with-moobear.png] 1536x1024 transparent, Moo Rabbit (150 cm) and Mootech Bear (200 cm, exactly as the attached official bear views) side by side, both giving a thumbs up.
```

輸出尺寸和 GPT 原生尺寸不同時（R07～R12），用 Code Interpreter 等比縮放後置中裁切到表中的精確尺寸。

S00 總覽圖（Code Interpreter）：
```python
from PIL import Image
names = ["s01-intro", "s02-templates", "s03-globe-languages", "s04-tablet-thumbsup", "s05-call-wave", "s06-wave",
         "s07-wink-thumbsup", "s08-thinking", "s09-handshake", "s10-heart-hands", "s11-hug-palette"]
sheet = Image.new("RGBA", (2048, 1536), (0, 0, 0, 0))
for i, n in enumerate(names):
    im = Image.open(f"stickers/{n}.png").convert("RGBA").resize((512, 512), Image.LANCZOS)
    sheet.paste(im, ((i % 4) * 512, (i // 4) * 512), im)
sheet.save("stickers/stickers-sheet.png")
```
