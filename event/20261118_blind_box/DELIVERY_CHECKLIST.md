# 美術交付勾選表：拆盲盒・中東神燈寶藏（Arabian Nights）（20261118_blind_box）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `DESIGN_TASKS.md`，提示詞看 `GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261118_blind_box/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 `assets/js/config.js` 路徑（最後一列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261118_blind_box/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。出現 `DESIGN_TASKS.md` 第一節「禁止元素」任一項即退回。

## A. 靜態圖（29）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B01 | title-en | 690×240 | `assets/img/title/title-en.{png,webp,svg}` | 5844c7b | ☐ | P0 |
| ☑ | B02 | title-ko | 690×240 | `assets/img/title/title-ko.{png,webp,svg}` | 5844c7b | ☐ | P0 |
| ☑ | B03 | title-th | 690×240 | `assets/img/title/title-th.{png,webp,svg}` | 5844c7b | ☐ | P0 |
| ☑ | B04 | stage-bg | 750×1000 | `assets/img/scene/stage-bg.{png,webp,svg}` | 8fc24f9 | ☐ | P0 |
| ☑ | B05 | chest-front | 640×400 | `assets/img/3d/chest-front.{png,webp,svg}` | 8e26e5e | ☐ | P0 |
| ☑ | B06 | chest-side | 512×320 | `assets/img/3d/chest-side.{png,webp,svg}` | 8e26e5e | ☐ | P0 |
| ☑ | B07 | chest-lid | 512×512 | `assets/img/3d/chest-lid.{png,webp,svg}` | 8e26e5e | ☐ | P0 |
| ☑ | B08 | chest-lid-end | 512×256 | `assets/img/3d/chest-lid-end.{png,webp,svg}` | bc5fb9b | ☐ | P0 |
| ☑ | B09 | btn-primary | 900×270 | `assets/img/ui/btn-primary.{png,webp,svg}` | aaa6c24 | ☐ | P0 |
| ☑ | B10 | reward-back | 600×900 | `assets/img/reveal/reward-back.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B11 | reward-frame-common | 600×900 | `assets/img/reveal/reward-frame-common.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B12 | reward-frame-rare | 600×900 | `assets/img/reveal/reward-frame-rare.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B13 | reward-frame-epic | 600×900 | `assets/img/reveal/reward-frame-epic.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B14 | reward-frame-legendary | 600×900 | `assets/img/reveal/reward-frame-legendary.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B15 | reveal-rays | 750×750 | `assets/img/reveal/reveal-rays.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B16 | period-badge | 900×150 | `assets/img/ui/period-badge.{png,webp,svg}` | 8e26e5e | ☐ | P1 |
| ☑ | B17 | chances-badge | 630×210 | `assets/img/ui/chances-badge.{png,webp,svg}` | aaa6c24 | ☐ | P1 |
| ☑ | B18 | ticker-bar | 1000×180 | `assets/img/ui/ticker-bar.{png,webp,svg}` | aaa6c24 | ☐ | P1 |
| ☑ | B19 | card-frame | 120×120 | `assets/img/ui/card-frame.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B20 | card-title | 400×72 | `assets/img/ui/card-title.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B21 | info-bg | 750×750 | `assets/img/scene/info-bg.{png,webp,svg}` | bc5fb9b | ☐ | P1 |
| ☑ | B22 | share-preview | 1200×630 | `assets/img/share/share-preview.{png,jpg}` | bc5fb9b | ☐ | P1 |
| ☑ | B23 | btn-arrow | 192×192 | `assets/img/ui/btn-arrow.{png,webp,svg}` | aaa6c24 | ☐ | P2 |
| ☑ | B24 | icon-sound-on | 64×64 | `assets/img/icon/icon-sound-on.{png,webp,svg}` | bc5fb9b | ☐ | P2 |
| ☑ | B25 | icon-sound-off | 64×64 | `assets/img/icon/icon-sound-off.{png,webp,svg}` | bc5fb9b | ☐ | P2 |
| ☑ | B26 | icon-share | 64×64 | `assets/img/icon/icon-share.{png,webp,svg}` | bc5fb9b | ☐ | P2 |
| ☑ | B27 | icon-rotate | 160×160 | `assets/img/icon/icon-rotate.{png,webp,svg}` | bc5fb9b | ☐ | P2 |
| ☑ | B28 | icon-tap | 160×160 | `assets/img/icon/icon-tap.{png,webp,svg}` | bc5fb9b | ☐ | P2 |
| ☑ | B29 | footer-deco | 750×160 | `assets/img/scene/footer-deco.{png,webp,svg}` | bc5fb9b | ☐ | P2 |

## B. 色票、音效、原始檔、設定

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B30 | 色票（`--ev-color-*`、`--ev-3d-*`、`--ev-rarity-*`） | — | `assets/css/theme.css` | 035fd1d | ☐ | P0 |
| ☑ | B31 | 音效 click：按鈕（≤0.2 秒） | 選配 | `assets/audio/click.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B32 | 音效 move：切換選項（0.25 秒） | 選配 | `assets/audio/move.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B33 | 音效 tear：開箱（open.mp3，1.1 秒） | 選配 | `assets/audio/open.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B34 | 音效 flip：翻卡（≤0.25 秒） | 選配 | `assets/audio/flip.mp3` | bc5fb9b | ☐ | P3 |
| ☑ | B35 | 音效 reveal：揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | 選配 | `assets/audio/reveal.mp3` | bc5fb9b | ☐ | P3 |
| ☑ | B36 | 音效 reward：全部揭曉（約 1 秒） | 選配 | `assets/audio/reward.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B37 | 主標可編輯原始檔（三語）連結或檔案說明 | （人工） | `source/title/README.md` | 5844c7b | ☐ | P3 |
| ☑ | B38 | `assets/js/config.js` 圖片路徑改成實際交付的檔名，頁面無破圖 | — | `assets/js/config.js` | 8ab3f80 | ☐ | P2 |

## C. 吉祥物動態（暫緩：目前頁面不放，先不要做）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B39 | 吉祥物 idle（待機） | 400×500 gif≥48 暫緩 | `assets/img/mascot/idle.gif` |  | ☐ | P3 |
| ☐ | B40 | 吉祥物 anticipate（期待） | 400×500 gif≥48 暫緩 | `assets/img/mascot/anticipate.gif` |  | ☐ | P3 |
| ☐ | B41 | 吉祥物 celebrate（慶祝） | 400×500 gif≥48 暫緩 | `assets/img/mascot/celebrate.gif` |  | ☐ | P3 |
| ☐ | B42 | 吉祥物 lose（小失望） | 400×500 gif≥48 暫緩 | `assets/img/mascot/lose.gif` |  | ☐ | P3 |

## D. 背景音樂與新增特效音（規格見 `AUDIO_REQUEST.md`，風格嚴格對齊本主題）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B50 | 背景音樂 bgm（60–90 秒無縫循環） | （人工） | `assets/audio/bgm.mp3` | 2d65268 | ☐ | P3 |
| ☑ | B51 | 特效音 select：點選一個寶箱＝選定（≤0.4 秒） | 選配 | `assets/audio/select.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B52 | 特效音 reveal-common：揭曉：{r}（0.5–0.8 秒） | 選配 | `assets/audio/reveal-common.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B53 | 特效音 reveal-rare：揭曉：稀有（寶物出現在台座上）（0.7–1.0 秒） | 選配 | `assets/audio/reveal-rare.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B54 | 特效音 reveal-epic：揭曉：超稀有（寶物出現在台座上）（0.9–1.3 秒） | 選配 | `assets/audio/reveal-epic.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B55 | 特效音 reveal-legendary：揭曉：最高級（Secret 隱藏款，寶物出現在台座上）（1.5–2.0 秒） | 選配 | `assets/audio/reveal-legendary.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B56 | 特效音 collect：收下獎勵（關閉揭曉）（≤0.8 秒） | 選配 | `assets/audio/collect.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B57 | 特效音 error：次數用完、尚無獎項（≤0.3 秒） | 選配 | `assets/audio/error.mp3` | 4dc5bce | ☐ | P3 |
| ☑ | B58 | 本批音訊母帶與製作說明（11 個特效音及 BGM） | （人工） | `source/audio/README.md` | 4dc5bce | ☐ | P3 |

## 紀錄

- 2026-11-18：第 2 版，主題改為「中東神燈寶藏（Arabian Nights）」、盲盒改為寶箱（3D 外型改成圓拱蓋寶箱）。全部為 mock 佔位圖，尚無任何交付。

- 2026-11-18：本批美術已提交於 bc5fb9b，替換正式圖片槽並接入六種音效。提交勾不代表品牌最終審核；角色基準已由使用者確認，細小標誌仍待品牌校對。

## 主視覺強化版

英／韓／泰使用各自藝術字，中文僅內部預覽；舊版可編輯 SVG 保留於 source/title。新藝術字為透明點陣圖，原始 PNG 並非可編輯文字或分層檔。

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B43 | 沙漠精靈的贈禮 | 690×240 | `assets/img/title/title-main.webp` | aaa6c24 | ☐ | P0 |
| ☑ | B44 | 新主標原圖 | 2128×739 | `source/title/title-main-original.png` | 3554392 | ☐ | P3 |

## 三語藝術字與卡片精緻化

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B45 | 主標 en 點陣原圖 | （人工） | `source/title/title-en-original.png` | 5844c7b | ☐ | P1 |
| ☑ | B46 | 主標 ko 點陣原圖 | （人工） | `source/title/title-ko-original.png` | 5844c7b | ☐ | P1 |
| ☑ | B47 | 主標 th 點陣原圖 | （人工） | `source/title/title-th-original.png` | 5844c7b | ☐ | P1 |

footer-deco 與前版 UI 圖片留存交付紀錄；目前頁面由各主題 CSS 呈現面板並停用波浪頁尾。卡片舊 reward-frame 圖片留存但目前改用 reward-front 與程式稀有度光色。

## 主題冊頁裝飾

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B48 | 神燈／星盤冊頁裝飾 | 900×300 | `assets/img/ui/folio-header.webp` | aaa6c24 | ☐ | P1 |
| ☑ | B49 | 冊頁裝飾點陣原稿 | （人工） | `source/ui/folio-header-original.png` | 483b784 | ☐ | P1 |

## 主題雕刻控制與環境效果

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B59 | 環境體積貼圖 | 900×300 | `assets/img/scene/atmosphere.webp` | aaa6c24 | ☐ | P1 |
| ☑ | B60 | 環境體積原稿 | （人工） | `source/scene/atmosphere-original.png` | aaa6c24 | ☐ | P1 |
| ☑ | B61 | 連續黃銅拱頂 | 900×300 | `assets/img/ui/panel-crown.webp` | aaa6c24 | ☐ | P1 |
| ☑ | B62 | 黃銅拱頂原稿 | （人工） | `source/ui/panel-crown-original.png` | aaa6c24 | ☐ | P1 |
| ☑ | B63 | btn-primary 控制元件原稿 | （人工） | `source/ui/btn-primary-original.png` | aaa6c24 | ☐ | P1 |
| ☑ | B64 | chances-badge 控制元件原稿 | （人工） | `source/ui/chances-badge-original.png` | aaa6c24 | ☐ | P1 |
| ☑ | B65 | btn-arrow 控制元件原稿 | （人工） | `source/ui/btn-arrow-original.png` | aaa6c24 | ☐ | P1 |
| ☑ | B66 | ticker-bar 控制元件原稿 | （人工） | `source/ui/ticker-bar-original.png` | aaa6c24 | ☐ | P1 |

壓縮與主題新版提交於 aaa6c24；原稿保留，交付 WebP 的尺寸／alpha 維持，審核欄尚未由品牌確認。
- 2026-11-18：新增 D 節（背景音樂、選定／四種稀有度揭曉／收下／錯誤特效音），依 `AUDIO_REQUEST.md` 製作；B 節既有 6 個特效音之後依同一份需求重做覆蓋。

## refine2 新素材與可編輯原稿

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B67 | chest-interior | 512×352 | `assets/img/3d/chest-interior.webp` | 8e26e5e | ☐ | P1 |
| ☑ | B68 | tool-medallion | 160×160 | `assets/img/ui/tool-medallion.webp` | 8e26e5e | ☐ | P1 |
| ☑ | B69 | chest-front-refined-original | （人工） | `source/3d/chest-front-refined-original.png` | 8e26e5e | ☐ | P1 |
| ☑ | B70 | chest-interior-refined-original | （人工） | `source/3d/chest-interior-refined-original.png` | 8e26e5e | ☐ | P1 |
| ☑ | B71 | chest-lid-refined-original | （人工） | `source/3d/chest-lid-refined-original.png` | 8e26e5e | ☐ | P1 |
| ☑ | B72 | chest-side-refined-original | （人工） | `source/3d/chest-side-refined-original.png` | 8e26e5e | ☐ | P1 |
| ☑ | B73 | bgm-score | （人工） | `source/audio/bgm-score.json` | 8e26e5e | ☐ | P1 |
| ☑ | B74 | bgm | （人工） | `source/audio/bgm.wav` | 8e26e5e | ☐ | P1 |
| ☑ | B75 | loudness | （人工） | `source/audio/loudness.json` | 8e26e5e | ☐ | P1 |
| ☑ | B76 | soundfont-copyright | （人工） | `source/audio/soundfont-copyright.txt` | 8e26e5e | ☐ | P1 |
| ☑ | B77 | period-badge-refined-original | （人工） | `source/ui/period-badge-refined-original.png` | 8e26e5e | ☐ | P1 |
| ☑ | B78 | tool-medallion-refined-original | （人工） | `source/ui/tool-medallion-refined-original.png` | 8e26e5e | ☐ | P1 |

## 主題 loading（20261118-loading1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | L01 | 主題 loading 器物 | 480×480 | `assets/img/ui/loading-emblem.webp` | 84ae6d5 | ☐ | P1 |
| ☑ | L02 | Loading 原稿 | （人工） | `source/loading/emblem-original.png` | 84ae6d5 | ☐ | P1 |


## 場景分層交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | B73 | wind-flowers | 450×450 | `assets/img/scene/wind-flowers.webp` | 8fc24f9 | ☐ | P3 |
| ☑ | B74 | wind-palm | 400×320 | `assets/img/scene/wind-palm.webp` | 8fc24f9 | ☐ | P3 |


## 互動與環境精修交付

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | B75 | 沙塵連續圖集 | 1280×1280 | `assets/img/reveal/sand-vortex-atlas.webp` | c6f8443 | ☐ | P3 |
| ☑ | B76 | 沙塵圖集原稿 | （人工） | `source/reveal/sand-vortex-sheet-original.png` | c6f8443 | ☐ | P3 |
| ☑ | B77 | desert 景深圖層 | 750×1000 | `assets/img/scene/layers/desert.webp` | c6f8443 | ☐ | P3 |
| ☑ | B78 | floor 景深圖層 | 750×1000 | `assets/img/scene/layers/floor.webp` | c6f8443 | ☐ | P3 |
| ☑ | B79 | columns 景深圖層 | 750×1000 | `assets/img/scene/layers/columns.webp` | c6f8443 | ☐ | P3 |
| ☑ | B80 | curtain 景深圖層 | 750×1000 | `assets/img/scene/layers/curtain.webp` | c6f8443 | ☐ | P3 |
| ☑ | B81 | desert 原稿 | （人工） | `source/scene/layers/desert-original.png` | c6f8443 | ☐ | P3 |
| ☑ | B82 | floor 原稿 | （人工） | `source/scene/layers/floor-original.png` | c6f8443 | ☐ | P3 |
| ☑ | B83 | columns 原稿 | （人工） | `source/scene/layers/columns-original.png` | c6f8443 | ☐ | P3 |
| ☑ | B84 | curtain 原稿 | （人工） | `source/scene/layers/curtain-original.png` | c6f8443 | ☐ | P3 |


## Hover／風動／舊版開獎相容

| 提交 | ID | 圖片槽 | 尺寸 | 交付路徑 | commit | 審核 | 優先級 |
|---|---|---|---|---|---|---|---|
| ☑ | B85 | 舊版 renderer 沙塵退回圖 | 320×320 | `assets/img/reveal/sand-vortex-poster.webp` | 2a36ceb | ☐ | P3 |

- 2026-11-18：套用使用者上傳音訊包（4dc5bce）；MP3 原檔與 WAV 母帶均保留。四級揭曉使用獨立音檔，舊 reveal 不再預載。卡包 hover 與隱藏包提示音維持既有版本；提交不代表主觀聽感終審。


## 2026-11-19 主題改版交付

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | N01 | open-desert | 750×1125 | `assets/img/scene/open-desert.webp` | 578aa12 | ☐ | P0 |
| ☑ | N02 | spirit-poster | 400×500 | `assets/img/mascot/spirit/poster.webp` | 578aa12 | ☐ | P3 |
| ☑ | N03 | spirit-idle | 400×500 | `assets/img/mascot/spirit/idle.webp` | 578aa12 | ☐ | P3 |
| ☑ | N04 | spirit-excited | 400×500 | `assets/img/mascot/spirit/excited.webp` | 578aa12 | ☐ | P3 |
| ☑ | N05 | spirit-encourage | 400×500 | `assets/img/mascot/spirit/encourage.webp` | 578aa12 | ☐ | P3 |
| ☑ | N06 | character-sheet | 1536×1024 | `source/desert-spirit/character-sheet.png` | 578aa12 | ☐ | P0 |

舊柱廊／布簾／宮殿地磚保留為歷史原稿，當前 config 不再載入。動態原始幀、2 秒循環與透明邊界驗證見 `source/desert-spirit/motion-checks.json`。
