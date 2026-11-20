# 美術交付勾選表：拆盲盒・中東神燈寶藏（Arabian Nights）（20261118_blind_box）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `docs/DESIGN_TASKS.md`，提示詞看 `docs/GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261118_blind_box/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 `assets/js/config.js` 路徑（最後一列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261118_blind_box/docs/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。出現 `docs/DESIGN_TASKS.md` 第一節「禁止元素」任一項即退回。

## A. 靜態圖（29）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B01 | title-en | 690×240 | `assets/images/title/blind_box_IMG013_title-en.webp` | afcb737 | ☐ | P0 |
| ☑ | B02 | title-ko | 690×240 | `assets/images/title/blind_box_IMG014_title-ko.webp` | afcb737 | ☐ | P0 |
| ☑ | B03 | title-th | 690×240 | `assets/images/title/blind_box_IMG016_title-th.webp` | afcb737 | ☐ | P0 |
| ☐ | B04 | stage-bg | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P0 |
| ☑ | B05 | chest-front | 640×400 | `assets/3d/textures/blind_box_3D001_chest-front.webp` | afcb737 | ☐ | P0 |
| ☑ | B06 | chest-side | 512×320 | `assets/3d/textures/blind_box_3D004_chest-side.webp` | afcb737 | ☐ | P0 |
| ☑ | B07 | chest-lid | 512×512 | `assets/3d/textures/blind_box_3D003_chest-lid.webp` | afcb737 | ☐ | P0 |
| ☐ | B08 | chest-lid-end | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P0 |
| ☑ | B09 | btn-primary | 900×270 | `assets/images/ui/blind_box_IMG017_btn-primary.webp` | afcb737 | ☐ | P0 |
| ☑ | B10 | reward-back | 600×900 | `assets/images/reveal/blind_box_IMG004_reward-back.svg` | afcb737 | ☐ | P1 |
| ☑ | B11 | reward-frame-common | 600×900 | `assets/images/reveal/blind_box_IMG005_reward-frame-common.svg` | afcb737 | ☐ | P1 |
| ☑ | B12 | reward-frame-rare | 600×900 | `assets/images/reveal/blind_box_IMG008_reward-frame-rare.svg` | afcb737 | ☐ | P1 |
| ☑ | B13 | reward-frame-epic | 600×900 | `assets/images/reveal/blind_box_IMG006_reward-frame-epic.svg` | afcb737 | ☐ | P1 |
| ☑ | B14 | reward-frame-legendary | 600×900 | `assets/images/reveal/blind_box_IMG007_reward-frame-legendary.svg` | afcb737 | ☐ | P1 |
| ☐ | B15 | reveal-rays | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | B16 | period-badge | 900×150 | `assets/images/ui/blind_box_IMG023_period-badge.webp` | afcb737 | ☐ | P1 |
| ☑ | B17 | chances-badge | 630×210 | `assets/images/ui/blind_box_IMG020_chances-badge.webp` | afcb737 | ☐ | P1 |
| ☑ | B18 | ticker-bar | 1000×180 | `assets/images/ui/blind_box_IMG024_ticker-bar.webp` | afcb737 | ☐ | P1 |
| ☑ | B19 | card-frame | 120×120 | `assets/images/ui/blind_box_IMG018_card-frame.svg` | afcb737 | ☐ | P1 |
| ☑ | B20 | card-title | 400×72 | `assets/images/ui/blind_box_IMG019_card-title.svg` | afcb737 | ☐ | P1 |
| ☑ | B21 | info-bg | 750×750 | `assets/images/scene/blind_box_IMG010_info-bg.svg` | afcb737 | ☐ | P1 |
| ☑ | B22 | share-preview | 1200×630 | `assets/images/share/blind_box_IMG012_share-preview.jpg` | afcb737 | ☐ | P1 |
| ☐ | B23 | btn-arrow | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | B24 | icon-sound-on | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | B25 | icon-sound-off | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☐ | B26 | icon-share | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P2 |
| ☑ | B27 | icon-rotate | 160×160 | `assets/images/icons/blind_box_IMG001_icon-rotate.svg` | afcb737 | ☐ | P2 |
| ☑ | B28 | icon-tap | 160×160 | `assets/images/icons/blind_box_IMG002_icon-tap.svg` | afcb737 | ☐ | P2 |
| ☑ | B29 | footer-deco | 750×160 | `assets/images/scene/blind_box_IMG009_footer-deco.svg` | afcb737 | ☐ | P2 |

## B. 色票、音效、原始檔、設定

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B30 | 色票（`--ev-color-*`、`--ev-3d-*`、`--ev-rarity-*`） | — | `assets/css/theme.css` | afcb737 | ☐ | P0 |
| ☐ | B31 | 音效 click：按鈕（≤0.2 秒） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | B32 | 音效 move：切換選項（0.25 秒） | 選配 | `assets/sounds/blind_box_SFX003_move.mp3` | afcb737 | ☐ | P3 |
| ☑ | B33 | 音效 tear：開箱（11677.wav 原檔） | 選配 | `assets/sounds/blind_box_SFX004_open.wav` | afcb737 | ☐ | P3 |
| ☐ | B34 | 音效 flip：翻卡（≤0.25 秒） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B35 | 音效 reveal：揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B36 | 音效 reward：全部揭曉（約 1 秒） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | B37 | 主標可編輯原始檔（三語）連結或檔案說明 | （人工） | `source/images/blind_box_SRC006_title/README.md` | afcb737 | ☐ | P3 |
| ☑ | B38 | `assets/js/config.js` 圖片路徑改成實際交付的檔名，頁面無破圖 | — | `assets/js/config.js` | afcb737 | ☐ | P2 |

## C. 吉祥物動態（暫緩：目前頁面不放，先不要做）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B39 | 吉祥物 idle（待機） | 400×500 gif≥48 暫緩 | `assets/img/mascot/idle.gif` |  | ☐ | P3 |
| ☐ | B40 | 吉祥物 anticipate（期待） | 400×500 gif≥48 暫緩 | `assets/img/mascot/anticipate.gif` |  | ☐ | P3 |
| ☐ | B41 | 吉祥物 celebrate（慶祝） | 400×500 gif≥48 暫緩 | `assets/img/mascot/celebrate.gif` |  | ☐ | P3 |
| ☐ | B42 | 吉祥物 lose（小失望） | 400×500 gif≥48 暫緩 | `assets/img/mascot/lose.gif` |  | ☐ | P3 |

## D. 背景音樂與新增特效音（規格見 `docs/AUDIO_REQUEST.md`，風格嚴格對齊本主題）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B50 | 背景音樂 bgm（完整曲目、頭尾交叉淡化循環） | （人工） | `assets/music/blind_box_BGM001_bgm.mp3` | afcb737 | ☐ | P3 |
| ☑ | B51 | 特效音 select：點選一個寶箱＝選定（≤0.4 秒） | 選配 | `assets/sounds/blind_box_SFX008_select.mp3` | afcb737 | ☐ | P3 |
| ☑ | B52 | 特效音 reveal-common：揭曉：{r}（0.5–0.8 秒） | 選配 | `assets/sounds/blind_box_SFX005_reveal-basic.wav` | afcb737 | ☐ | P3 |
| ☑ | B53 | 特效音 reveal-rare：揭曉：稀有（寶物出現在台座上）（0.7–1.0 秒） | 選配 | `assets/sounds/blind_box_SFX005_reveal-basic.wav` | afcb737 | ☐ | P3 |
| ☑ | B54 | 特效音 reveal-epic：揭曉：超稀有（寶物出現在台座上）（0.9–1.3 秒） | 選配 | `assets/sounds/blind_box_SFX006_reveal-epic.mp3` | afcb737 | ☐ | P3 |
| ☑ | B55 | 特效音 reveal-legendary：揭曉：最高級（Secret 隱藏款，寶物出現在台座上）（1.5–2.0 秒） | 選配 | `assets/sounds/blind_box_SFX007_reveal-legendary.mp3` | afcb737 | ☐ | P3 |
| ☐ | B56 | 特效音 collect：收下獎勵（關閉揭曉）（≤0.8 秒） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | B57 | 特效音 error：次數用完、尚無獎項（≤0.3 秒） | 選配 | `assets/sounds/blind_box_SFX002_error.mp3` | afcb737 | ☐ | P3 |
| ☐ | B58 | 本批音訊母帶與製作說明（11 個特效音及 BGM） | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |

## 紀錄

- 2026-11-18：第 2 版，主題改為「中東神燈寶藏（Arabian Nights）」、盲盒改為寶箱（3D 外型改成圓拱蓋寶箱）。全部為 mock 佔位圖，尚無任何交付。

- 2026-11-18：本批美術已提交於 bc5fb9b，替換正式圖片槽並接入六種音效。提交勾不代表品牌最終審核；角色基準已由使用者確認，細小標誌仍待品牌校對。

## 主視覺強化版

英／韓／泰使用各自藝術字，中文僅內部預覽；舊版可編輯 SVG 保留於 source/images/blind_box_SRC006_title。新藝術字為透明點陣圖，原始 PNG 並非可編輯文字或分層檔。

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B43 | 沙漠精靈的贈禮 | 690×240 | `assets/images/title/blind_box_IMG015_title-main.webp` | afcb737 | ☐ | P0 |
| ☑ | B44 | 新主標原圖 | 2128×739 | `source/images/blind_box_SRC006_title/title-main-original.png` | afcb737 | ☐ | P3 |

## 三語藝術字與卡片精緻化

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B45 | 主標 en 點陣原圖 | （人工） | `source/images/blind_box_SRC006_title/title-en-original.png` | afcb737 | ☐ | P1 |
| ☑ | B46 | 主標 ko 點陣原圖 | （人工） | `source/images/blind_box_SRC006_title/title-ko-original.png` | afcb737 | ☐ | P1 |
| ☑ | B47 | 主標 th 點陣原圖 | （人工） | `source/images/blind_box_SRC006_title/title-th-original.png` | afcb737 | ☐ | P1 |

footer-deco 與前版 UI 圖片留存交付紀錄；目前頁面由各主題 CSS 呈現面板並停用波浪頁尾。卡片舊 reward-frame 圖片留存但目前改用 reward-front 與程式稀有度光色。

## 主題冊頁裝飾

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B48 | 神燈／星盤冊頁裝飾 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | B49 | 冊頁裝飾點陣原稿 | （人工） | `source/images/blind_box_SRC007_ui/folio-header-original.png` | afcb737 | ☐ | P1 |

## 主題雕刻控制與環境效果

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B59 | 環境體積貼圖 | 900×300 | `assets/effects/blind_box_VFX002_atmosphere.webp` | afcb737 | ☐ | P1 |
| ☑ | B60 | 環境體積原稿 | （人工） | `source/images/blind_box_SRC004_scene/atmosphere-original.png` | afcb737 | ☐ | P1 |
| ☑ | B61 | 連續黃銅拱頂 | 900×300 | `assets/images/ui/blind_box_IMG022_panel-crown.webp` | afcb737 | ☐ | P1 |
| ☑ | B62 | 黃銅拱頂原稿 | （人工） | `source/images/blind_box_SRC007_ui/panel-crown-original.png` | afcb737 | ☐ | P1 |
| ☑ | B63 | btn-primary 控制元件原稿 | （人工） | `source/images/blind_box_SRC007_ui/btn-primary-original.png` | afcb737 | ☐ | P1 |
| ☑ | B64 | chances-badge 控制元件原稿 | （人工） | `source/images/blind_box_SRC007_ui/chances-badge-original.png` | afcb737 | ☐ | P1 |
| ☐ | B65 | btn-arrow 控制元件原稿 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | B66 | ticker-bar 控制元件原稿 | （人工） | `source/images/blind_box_SRC007_ui/ticker-bar-original.png` | afcb737 | ☐ | P1 |

壓縮與主題新版提交於 aaa6c24；原稿保留，交付 WebP 的尺寸／alpha 維持，審核欄尚未由品牌確認。
- 2026-11-18：新增 D 節（背景音樂、選定／四種稀有度揭曉／收下／錯誤特效音），依 `docs/AUDIO_REQUEST.md` 製作；B 節既有 6 個特效音之後依同一份需求重做覆蓋。

## refine2 新素材與可編輯原稿

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B67 | chest-interior | 512×352 | `assets/3d/textures/blind_box_3D002_chest-interior.webp` | afcb737 | ☐ | P1 |
| ☑ | B68 | tool-medallion | 160×160 | `assets/images/ui/blind_box_IMG025_tool-medallion.webp` | afcb737 | ☐ | P1 |
| ☑ | B69 | chest-front-refined-original | （人工） | `source/3d/blind_box_SRC001_3d/chest-front-refined-original.png` | afcb737 | ☐ | P1 |
| ☑ | B70 | chest-interior-refined-original | （人工） | `source/3d/blind_box_SRC001_3d/chest-interior-refined-original.png` | afcb737 | ☐ | P1 |
| ☑ | B71 | chest-lid-refined-original | （人工） | `source/3d/blind_box_SRC001_3d/chest-lid-refined-original.png` | afcb737 | ☐ | P1 |
| ☑ | B72 | chest-side-refined-original | （人工） | `source/3d/blind_box_SRC001_3d/chest-side-refined-original.png` | afcb737 | ☐ | P1 |
| ☐ | B73 | bgm-score | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | B74 | bgm | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | B75 | loudness | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☐ | B76 | soundfont-copyright | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P1 |
| ☑ | B77 | period-badge-refined-original | （人工） | `source/images/blind_box_SRC007_ui/period-badge-refined-original.png` | afcb737 | ☐ | P1 |
| ☑ | B78 | tool-medallion-refined-original | （人工） | `source/images/blind_box_SRC007_ui/tool-medallion-refined-original.png` | afcb737 | ☐ | P1 |

## 主題 loading（20261118-loading1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | L01 | 主題 loading 器物 | 480×480 | `assets/images/ui/blind_box_IMG021_loading-emblem.webp` | afcb737 | ☐ | P1 |
| ☑ | L02 | Loading 原稿 | （人工） | `source/images/blind_box_SRC002_loading/emblem-original.png` | afcb737 | ☐ | P1 |


## 場景分層交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☐ | B73 | wind-flowers | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B74 | wind-palm | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |


## 互動與環境精修交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☐ | B75 | 沙塵連續圖集 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B76 | 沙塵圖集原稿 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B77 | desert 景深圖層 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B78 | floor 景深圖層 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B79 | columns 景深圖層 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | B80 | curtain 景深圖層 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☑ | B81 | desert 原稿 | （人工） | `source/images/blind_box_SRC004_scene/layers/desert-original.png` | afcb737 | ☐ | P3 |
| ☑ | B82 | floor 原稿 | （人工） | `source/images/blind_box_SRC004_scene/layers/floor-original.png` | afcb737 | ☐ | P3 |
| ☑ | B83 | columns 原稿 | （人工） | `source/images/blind_box_SRC004_scene/layers/columns-original.png` | afcb737 | ☐ | P3 |
| ☑ | B84 | curtain 原稿 | （人工） | `source/images/blind_box_SRC004_scene/layers/curtain-original.png` | afcb737 | ☐ | P3 |


## Hover／風動／舊版開獎相容

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☐ | B85 | 舊版 renderer 沙塵退回圖 | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |

- 2026-11-18：套用使用者上傳音訊包（4dc5bce）；MP3 原檔與 WAV 母帶均保留。四級揭曉使用獨立音檔，舊 reveal 不再預載。卡包 hover 與隱藏包提示音維持既有版本；提交不代表主觀聽感終審。


## 2026-11-19 主題改版交付

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | N01 | open-desert | 750×1125 | `assets/images/scene/blind_box_IMG011_open-desert.webp` | afcb737 | ☐ | P0 |
| ☑ | N02 | spirit-poster | 1500×1875 | `assets/images/mascot/blind_box_IMG003_poster.webp` | afcb737 | ☐ | P3 |
| ☐ | N03 | spirit-idle | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | N04 | spirit-excited | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | N05 | spirit-encourage | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P3 |
| ☐ | N06 | character-sheet | 已淘汰（暫緩：歷史見 Git 00789f8） | `git:00789f8` | | ☐ | P0 |

舊版精靈影格及沙塵圖集移至備選。新版精靈由原稿繪製待機、開箱前期待、中獎慶祝與再接再厲四段動作，每秒 12 幀、各循環 2 秒。沙塵以每秒 12 幀連續流動，循環 12 秒。

| ☑ | N07 | 寶藏展示底座 | 900×291 | `assets/images/ui/blind_box_IMG026_treasure-plinth.webp` | afcb737 | ☐ | P1 |

| 提交 | ID | 素材 | 尺寸 | 路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | N08 | 主題狀態徽章 | 1536×1024 | `../shared/assets/images/shared_IMG006_status-badges.webp` | afcb737 | ☐ | P1 |

| 提交 | ID | 素材 | 尺寸 | 路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | N07 | 高解析精靈原稿 | 1254×1254 | `source/images/blind_box_SRC001_desert-spirit-hd/master.png` | afcb737 | ☐ | P3 |
| ☑ | N08 | 精靈動畫 | （人工） | `assets/js/spirit-motion.js` | afcb737 | ☐ | P3 |
| ☑ | N09 | 沙塵流場貼圖 | 1254×1254 | `assets/effects/blind_box_VFX001_sand-vortex.webp` | afcb737 | ☐ | P3 |
| ☑ | N10 | 沙塵原稿 | 1254×1254 | `source/images/blind_box_SRC003_reveal/sand-vortex-original.png` | afcb737 | ☐ | P3 |
