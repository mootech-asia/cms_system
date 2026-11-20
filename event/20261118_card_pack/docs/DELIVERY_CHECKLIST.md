# 美術交付勾選表：拆卡包・宇宙幻象（Cosmic Illusion）（20261118_card_pack）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `docs/DESIGN_TASKS.md`，提示詞看 `docs/GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261118_card_pack/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 `assets/js/config.js` 路徑（最後一列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261118_card_pack/docs/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。出現 `docs/DESIGN_TASKS.md` 第一節「禁止元素」任一項即退回。

## 0. 角色設定圖（最先做，審核通過才做有角色的圖）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C01 | 兔比宇宙兔女郎設定圖（四視圖、比例、表情 ×4、材質、色票） | 2400×1350 | `source/images/card_pack_SRC001_character/cosmic-bunny-sheet.png` | d5de138 | ☐ | P0 |
| ☑ | C02 | 角色說明（服裝構成、色碼） | （人工） | `source/images/card_pack_SRC001_character/README.md` | d5de138 | ☐ | P0 |

## A. 靜態圖（30）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C03 | title-en | 690×240 | `assets/images/title/card_pack_IMG011_title-en.webp` | d5de138 | ☐ | P0 |
| ☑ | C04 | title-ko | 690×240 | `assets/images/title/card_pack_IMG012_title-ko.webp` | d5de138 | ☐ | P0 |
| ☑ | C05 | title-th | 690×240 | `assets/images/title/card_pack_IMG014_title-th.webp` | d5de138 | ☐ | P0 |
| ☑ | C06 | stage-bg | 750×1000 | `assets/images/scene/card_pack_IMG009_stage-bg.webp` | d5de138 | ☐ | P0 |
| ☑ | C07 | pack-back | 512×768 | `assets/3d/textures/card_pack_3D001_pack-back.webp` | d5de138 | ☐ | P0 |
| ☑ | C08 | pack-crimp | 512×64 | `assets/3d/textures/card_pack_3D003_pack-crimp.webp` | d5de138 | ☐ | P0 |
| ☑ | C09 | btn-primary | 900×270 | `assets/images/ui/card_pack_IMG015_btn-primary.webp` | d5de138 | ☐ | P0 |
| ☑ | C10 | pack-front-1 | 512×768 | `assets/3d/textures/card_pack_3D004_pack-front-1.webp` | d5de138 | ☐ | P1 |
| ☑ | C11 | pack-front-2 | 512×768 | `assets/3d/textures/card_pack_3D005_pack-front-2.webp` | d5de138 | ☐ | P1 |
| ☑ | C12 | pack-front-3 | 512×768 | `assets/3d/textures/card_pack_3D006_pack-front-3.webp` | d5de138 | ☐ | P1 |
| ☑ | C13 | reward-back | 600×900 | `assets/images/reveal/card_pack_IMG003_reward-back.webp` | d5de138 | ☐ | P1 |
| ☐ | C14 | reward-frame-common | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C15 | reward-frame-rare | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C16 | reward-frame-epic | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C17 | reward-frame-legendary | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C18 | reveal-rays | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | C19 | period-badge | 900×150 | `assets/images/ui/card_pack_IMG022_period-badge.webp` | d5de138 | ☐ | P1 |
| ☑ | C20 | chances-badge | 630×210 | `assets/images/ui/card_pack_IMG018_chances-badge.webp` | d5de138 | ☐ | P1 |
| ☑ | C21 | ticker-bar | 1000×180 | `assets/images/ui/card_pack_IMG023_ticker-bar.webp` | d5de138 | ☐ | P1 |
| ☑ | C22 | card-frame | 120×120 | `assets/images/ui/card_pack_IMG016_card-frame.svg` | d5de138 | ☐ | P1 |
| ☑ | C23 | card-title | 400×72 | `assets/images/ui/card_pack_IMG017_card-title.svg` | d5de138 | ☐ | P1 |
| ☑ | C24 | info-bg | 750×750 | `assets/images/scene/card_pack_IMG008_info-bg.svg` | d5de138 | ☐ | P1 |
| ☑ | C25 | share-preview | 1200×630 | `assets/images/share/card_pack_IMG010_share-preview.jpg` | d5de138 | ☐ | P1 |
| ☐ | C26 | btn-arrow | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | C27 | icon-sound-on | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | C28 | icon-sound-off | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | C29 | icon-share | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☑ | C30 | icon-rotate | 160×160 | `assets/images/icons/card_pack_IMG001_icon-rotate.svg` | d5de138 | ☐ | P2 |
| ☑ | C31 | icon-tap | 160×160 | `assets/images/icons/card_pack_IMG002_icon-tap.svg` | d5de138 | ☐ | P2 |
| ☑ | C32 | footer-deco | 750×160 | `assets/images/scene/card_pack_IMG007_footer-deco.svg` | d5de138 | ☐ | P2 |

## B. 色票、音效、原始檔、設定

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C33 | 色票（`--ev-color-*`、`--ev-3d-*`、`--ev-rarity-*`） | — | `assets/css/theme.css` | 12a243f | ☐ | P0 |
| ☑ | C34 | 音效 click：按鈕（≤0.2 秒） | 選配 | `assets/sounds/card_pack_SFX001_click.mp3` | d5de138 | ☐ | P3 |
| ☑ | C35 | 音效 move：切換選項（0.25 秒） | 選配 | `assets/sounds/card_pack_SFX006_move.mp3` | d5de138 | ☐ | P3 |
| ☑ | C36 | 音效 tear：撕封條（0.385 秒，雙錄音分離撕裂聲） | 選配 | `assets/sounds/card_pack_SFX012_tear.wav` | fd04307 | ☐ | P3 |
| ☑ | C37 | 音效 flip：翻卡（0.3 秒） | 選配 | `assets/sounds/card_pack_SFX005_flip.mp3` | d5de138 | ☐ | P3 |
| ☐ | C38 | 音效 reveal：揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | C39 | 音效 reward：全部揭曉（約 1 秒） | 選配 | `assets/sounds/card_pack_SFX009_reward.mp3` | d5de138 | ☐ | P3 |
| ☑ | C40 | 主標可編輯原始檔（三語）連結或檔案說明 | （人工） | `source/images/card_pack_SRC006_title/README.md` | d5de138 | ☐ | P3 |
| ☑ | C41 | `assets/js/config.js` 圖片路徑改成實際交付的檔名，頁面無破圖 | — | `assets/js/config.js` | b0ee2bc | ☐ | P2 |

## C. 吉祥物動態（暫緩：目前頁面不放，先不要做）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C42 | 吉祥物 idle（待機） | 400×500 gif≥48 暫緩 | `assets/img/mascot/idle.gif` |  | ☐ | P3 |
| ☐ | C43 | 吉祥物 anticipate（期待） | 400×500 gif≥48 暫緩 | `assets/img/mascot/anticipate.gif` |  | ☐ | P3 |
| ☐ | C44 | 吉祥物 celebrate（慶祝） | 400×500 gif≥48 暫緩 | `assets/img/mascot/celebrate.gif` |  | ☐ | P3 |
| ☐ | C45 | 吉祥物 lose（小失望） | 400×500 gif≥48 暫緩 | `assets/img/mascot/lose.gif` |  | ☐ | P3 |

## D. 背景音樂與新增特效音（規格見 `docs/AUDIO_REQUEST.md`，風格嚴格對齊本主題）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C56 | 背景音樂 bgm（使用者上傳原檔、循環播放） | （人工） | `assets/music/card_pack_BGM001_bgm.wav` | b599985 | ☐ | P3 |
| ☑ | C57 | 特效音 select：點選一包＝選定（≤0.4 秒） | 選配 | `assets/sounds/card_pack_SFX011_select.mp3` | d5de138 | ☐ | P3 |
| ☑ | C58 | 特效音 reveal-common：揭曉：普通（0.5–0.8 秒） | 選配 | `assets/sounds/card_pack_SFX008_reveal-basic.wav` | b599985 | ☐ | P3 |
| ☑ | C59 | 特效音 reveal-rare：揭曉：稀有（0.7–1.0 秒） | 選配 | `assets/sounds/card_pack_SFX008_reveal-basic.wav` | b599985 | ☐ | P3 |
| ☑ | C60 | 特效音 reveal-epic：揭曉：超稀有（0.9–1.3 秒） | 選配 | `assets/sounds/card_pack_SFX007_reveal-3026.wav` | d5de138 | ☐ | P3 |
| ☑ | C61 | 特效音 reveal-legendary：揭曉：最高級（Legendary）（1.5–2.0 秒） | 選配 | `assets/sounds/card_pack_SFX007_reveal-3026.wav` | d5de138 | ☐ | P3 |
| ☑ | C62 | 特效音 collect：收下獎勵（關閉揭曉）（≤0.8 秒） | 選配 | `assets/sounds/card_pack_SFX002_collect.mp3` | d5de138 | ☐ | P3 |
| ☑ | C63 | 特效音 error：次數用完、尚無獎項（≤0.3 秒） | 選配 | `assets/sounds/card_pack_SFX004_error.mp3` | d5de138 | ☐ | P3 |
| ☐ | C64 | 本批音訊母帶與製作說明（12 個特效音及 BGM） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |

## 紀錄

- 2026-11-18：第 2 版，主題改為「宇宙幻象（Cosmic Illusion）」、角色改用兔比宇宙兔女郎造型。全部為 mock 佔位圖，尚無任何交付。

- 2026-11-18：本批美術已提交於 bc5fb9b，替換正式圖片槽並接入六種音效。提交勾不代表品牌最終審核；角色基準已由使用者確認，細小標誌仍待品牌校對。

## 主視覺強化版

英／韓／泰使用各自藝術字，中文僅內部預覽；舊版可編輯 SVG 保留於 source/images/card_pack_SRC006_title。新藝術字為透明點陣圖，原始 PNG 並非可編輯文字或分層檔。

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C46 | 宇宙神奇魔幻卡包 | 690×240 | `assets/images/title/card_pack_IMG013_title-main.webp` | d5de138 | ☐ | P0 |
| ☑ | C47 | 新主標原圖 | 2126×740 | `source/images/card_pack_SRC006_title/title-main-original.png` | d5de138 | ☐ | P3 |

## 三語藝術字與卡片精緻化

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C48 | 主標 en 點陣原圖 | （人工） | `source/images/card_pack_SRC006_title/title-en-original.png` | d5de138 | ☐ | P1 |
| ☑ | C49 | 主標 ko 點陣原圖 | （人工） | `source/images/card_pack_SRC006_title/title-ko-original.png` | d5de138 | ☐ | P1 |
| ☑ | C50 | 主標 th 點陣原圖 | （人工） | `source/images/card_pack_SRC006_title/title-th-original.png` | d5de138 | ☐ | P1 |
| ☑ | C51 | 星雲雕花卡面 | 600×900 | `assets/images/reveal/card_pack_IMG004_reward-front.webp` | d5de138 | ☐ | P1 |
| ☑ | C52 | 卡面點陣原圖 | （人工） | `source/images/card_pack_SRC003_reveal/reward-front-original.png` | d5de138 | ☐ | P1 |
| ☑ | C53 | 卡背點陣原圖 | （人工） | `source/images/card_pack_SRC003_reveal/reward-back-original.png` | d5de138 | ☐ | P1 |

footer-deco 與前版 UI 圖片留存交付紀錄；目前頁面由各主題 CSS 呈現面板並停用波浪頁尾。卡片舊 reward-frame 圖片留存但目前改用 reward-front 與程式稀有度光色。

## 主題冊頁裝飾

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C54 | 神燈／星盤冊頁裝飾 | 900×300 | `assets/images/ui/card_pack_IMG019_folio-header.webp` | d5de138 | ☐ | P1 |
| ☑ | C55 | 冊頁裝飾點陣原稿 | （人工） | `source/images/card_pack_SRC007_ui/folio-header-original.png` | d5de138 | ☐ | P1 |

## 主題雕刻控制與環境效果

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C65 | 環境體積貼圖 | 640×454 | `assets/effects/card_pack_VFX001_atmosphere.webp` | d5de138 | ☐ | P1 |
| ☑ | C66 | 環境體積原稿 | （人工） | `source/images/card_pack_SRC004_scene/atmosphere-original.png` | d5de138 | ☐ | P1 |
| ☑ | C67 | btn-primary 控制元件原稿 | （人工） | `source/images/card_pack_SRC007_ui/btn-primary-original.png` | d5de138 | ☐ | P1 |
| ☑ | C68 | chances-badge 控制元件原稿 | （人工） | `source/images/card_pack_SRC007_ui/chances-badge-original.png` | d5de138 | ☐ | P1 |
| ☑ | C69 | btn-arrow 控制元件原稿 | （人工） | `source/images/card_pack_SRC007_ui/btn-arrow-original.png` | d5de138 | ☐ | P1 |
| ☑ | C70 | ticker-bar 控制元件原稿 | （人工） | `source/images/card_pack_SRC007_ui/ticker-bar-original.png` | d5de138 | ☐ | P1 |

壓縮與主題新版提交於 aaa6c24；原稿保留，交付 WebP 的尺寸／alpha 維持，審核欄尚未由品牌確認。
- 2026-11-18：新增 D 節（背景音樂、選定／四種稀有度揭曉／收下／錯誤特效音），依 `docs/AUDIO_REQUEST.md` 製作；B 節既有 6 個特效音之後依同一份需求重做覆蓋。

## refine2 新素材與可編輯原稿

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | C71 | pack-contents | 256×384 | `assets/3d/textures/card_pack_3D002_pack-contents.webp` | d5de138 | ☐ | P1 |
| ☑ | C72 | panel-frame | 768×768 | `assets/images/ui/card_pack_IMG021_panel-frame.webp` | d5de138 | ☐ | P1 |
| ☑ | C73 | star-glint | 192×192 | `assets/effects/card_pack_VFX004_star-glint.webp` | d5de138 | ☐ | P1 |
| ☑ | C74 | tool-medallion | 160×160 | `assets/images/ui/card_pack_IMG024_tool-medallion.webp` | d5de138 | ☐ | P1 |
| ☑ | C75 | pack-contents-refined-original | （人工） | `source/3d/card_pack_SRC001_3d/pack-contents-refined-original.png` | d5de138 | ☐ | P1 |
| ☑ | C76 | pack-crimp-refined-original | （人工） | `source/3d/card_pack_SRC001_3d/pack-crimp-refined-original.png` | d5de138 | ☐ | P1 |
| ☐ | C77 | bgm-score | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C78 | bgm | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C79 | loudness | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | C80 | soundfont-copyright | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | C81 | reward-back-refined-original | （人工） | `source/images/card_pack_SRC003_reveal/reward-back-refined-original.png` | d5de138 | ☐ | P1 |
| ☑ | C82 | panel-frame-refined-original | （人工） | `source/images/card_pack_SRC007_ui/panel-frame-refined-original.png` | d5de138 | ☐ | P1 |
| ☑ | C83 | period-badge-refined-original | （人工） | `source/images/card_pack_SRC007_ui/period-badge-refined-original.png` | d5de138 | ☐ | P1 |
| ☑ | C84 | star-glint-refined-original | （人工） | `source/images/card_pack_SRC007_ui/star-glint-refined-original.png` | d5de138 | ☐ | P1 |
| ☑ | C85 | tool-medallion-refined-original | （人工） | `source/images/card_pack_SRC007_ui/tool-medallion-refined-original.png` | d5de138 | ☐ | P1 |

## 主題 loading（20261118-loading1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | L01 | 主題 loading 器物 | 480×480 | `assets/images/ui/card_pack_IMG020_loading-emblem.webp` | d5de138 | ☐ | P1 |
| ☑ | L02 | Loading 原稿 | （人工） | `source/images/card_pack_SRC002_loading/emblem-original.png` | d5de138 | ☐ | P1 |
| ☑ | L03 | 月兔卡背原稿 | （人工） | `source/images/card_pack_SRC003_reveal/reward-back-rabbit-original.png` | d5de138 | ☐ | P1 |


## 場景分層交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | C73 | pack-side | 128×512 | `assets/3d/textures/card_pack_3D007_pack-side.webp` | d5de138 | ☐ | P3 |
| ☑ | C74 | magic-circle | 640×640 | `assets/effects/card_pack_VFX002_magic-circle.webp` | d5de138 | ☐ | P3 |


## 互動與環境精修交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | C75 | 隱藏包裝正面 | 512×768 | `assets/3d/textures/card_pack_3D008_secret-pack.webp` | d5de138 | ☐ | P3 |
| ☑ | C76 | 隱藏包裝側面 | 128×512 | `assets/3d/textures/card_pack_3D009_secret-side.webp` | d5de138 | ☐ | P3 |
| ☑ | C77 | 隱藏卡背 | 600×900 | `assets/images/reveal/card_pack_IMG005_secret-back.webp` | d5de138 | ☐ | P3 |
| ☑ | C78 | 隱藏卡正面 | 600×900 | `assets/images/reveal/card_pack_IMG006_secret-front.webp` | d5de138 | ☐ | P3 |
| ☐ | C79 | 鋁箔撕裂音效 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | C80 | 隱藏提示音效 | （人工） | `assets/sounds/card_pack_SFX010_secret.mp3` | d5de138 | ☐ | P3 |
| ☑ | C81 | secret-pack 原稿 | （人工） | `source/images/card_pack_SRC005_secret/secret-pack-original.png` | d5de138 | ☐ | P3 |
| ☑ | C82 | secret-back 原稿 | （人工） | `source/images/card_pack_SRC005_secret/secret-back-original.png` | d5de138 | ☐ | P3 |
| ☑ | C83 | secret-front 原稿 | （人工） | `source/images/card_pack_SRC005_secret/secret-front-original.png` | d5de138 | ☐ | P3 |


## Hover／風動／舊版開獎相容

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | C84 | Spin 共用 hover 音效 | （人工） | `../20261111_survival_spin/assets/sounds/survival_spin_SFX002_hover.mp3` | d5de138 | ☐ | P3 |

- 2026-11-18：套用使用者上傳音訊包（4dc5bce）；MP3 原檔與 WAV 母帶均保留。四級揭曉使用獨立音檔，舊 reveal 不再預載。卡包 hover 與隱藏包提示音維持既有版本；提交不代表主觀聽感終審。


## 2026-11-19 主題改版交付

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | N01 | utility-frame | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |

| ☑ | N02 | 星雲揭曉光暈 | 900×900 | `assets/effects/card_pack_VFX003_reveal-aura.webp` | d5de138 | ☐ | P1 |

| 提交 | ID | 素材 | 尺寸 | 路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|

- 2026-11-19（33bd8bf）：隱藏卡包同時展開三張卡背，按 Reveal 依序逐張翻開，第三張後回到扇形總覽並可點卡查看。390／360px 實際開包驗證通過；三張 EPIC+、一次扣次、錯誤回傳退回次數與普通卡包音效回歸通過。實機觸控尚未驗證。
