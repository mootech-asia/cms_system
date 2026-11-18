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
| ☐ | B01 | title-en | 690×240 | `assets/img/title/title-en.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B02 | title-ko | 690×240 | `assets/img/title/title-ko.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B03 | title-th | 690×240 | `assets/img/title/title-th.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B04 | stage-bg | 750×1000 | `assets/img/scene/stage-bg.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B05 | chest-front | 512×320 | `assets/img/3d/chest-front.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B06 | chest-side | 512×320 | `assets/img/3d/chest-side.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B07 | chest-lid | 512×512 | `assets/img/3d/chest-lid.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B08 | chest-lid-end | 512×256 | `assets/img/3d/chest-lid-end.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B09 | btn-primary | 400×110 | `assets/img/ui/btn-primary.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | B10 | reward-back | 600×900 | `assets/img/reveal/reward-back.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B11 | reward-frame-common | 600×900 | `assets/img/reveal/reward-frame-common.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B12 | reward-frame-rare | 600×900 | `assets/img/reveal/reward-frame-rare.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B13 | reward-frame-epic | 600×900 | `assets/img/reveal/reward-frame-epic.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B14 | reward-frame-legendary | 600×900 | `assets/img/reveal/reward-frame-legendary.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B15 | reveal-rays | 750×750 | `assets/img/reveal/reveal-rays.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B16 | period-badge | 480×64 | `assets/img/ui/period-badge.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B17 | chances-badge | 360×88 | `assets/img/ui/chances-badge.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B18 | ticker-bar | 690×64 | `assets/img/ui/ticker-bar.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B19 | card-frame | 120×120 | `assets/img/ui/card-frame.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B20 | card-title | 400×72 | `assets/img/ui/card-title.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B21 | info-bg | 750×750 | `assets/img/scene/info-bg.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | B22 | share-preview | 1200×630 | `assets/img/share/share-preview.{png,jpg}` |  | ☐ | P1 |
| ☐ | B23 | btn-arrow | 96×96 | `assets/img/ui/btn-arrow.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B24 | icon-sound-on | 64×64 | `assets/img/icon/icon-sound-on.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B25 | icon-sound-off | 64×64 | `assets/img/icon/icon-sound-off.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B26 | icon-share | 64×64 | `assets/img/icon/icon-share.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B27 | icon-rotate | 160×160 | `assets/img/icon/icon-rotate.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B28 | icon-tap | 160×160 | `assets/img/icon/icon-tap.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | B29 | footer-deco | 750×160 | `assets/img/scene/footer-deco.{png,webp,svg}` |  | ☐ | P2 |

## B. 色票、音效、原始檔、設定

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B30 | 色票（`--ev-color-*`、`--ev-3d-*`、`--ev-rarity-*`） | — | `assets/css/theme.css` |  | ☐ | P0 |
| ☐ | B31 | 音效 click：按鈕（≤0.2 秒） | 選配 | `assets/audio/click.mp3` |  | ☐ | P3 |
| ☐ | B32 | 音效 move：切換選項（≤0.15 秒） | 選配 | `assets/audio/move.mp3` |  | ☐ | P3 |
| ☐ | B33 | 音效 tear：撕封條／開箱（約 0.5 秒） | 選配 | `assets/audio/tear.mp3` |  | ☐ | P3 |
| ☐ | B34 | 音效 flip：翻卡（≤0.25 秒） | 選配 | `assets/audio/flip.mp3` |  | ☐ | P3 |
| ☐ | B35 | 音效 reveal：揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | 選配 | `assets/audio/reveal.mp3` |  | ☐ | P3 |
| ☐ | B36 | 音效 reward：全部揭曉（約 1 秒） | 選配 | `assets/audio/reward.mp3` |  | ☐ | P3 |
| ☐ | B37 | 主標可編輯原始檔（三語）連結或檔案說明 | （人工） | `source/title/README.md` |  | ☐ | P3 |
| ☐ | B38 | `assets/js/config.js` 圖片路徑改成實際交付的檔名，頁面無破圖 | — | `assets/js/config.js` |  | ☐ | P2 |

## C. 吉祥物動態（暫緩：目前頁面不放，先不要做）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B39 | 吉祥物 idle（待機） | 400×500 gif≥48 暫緩 | `assets/img/mascot/idle.gif` |  | ☐ | P3 |
| ☐ | B40 | 吉祥物 anticipate（期待） | 400×500 gif≥48 暫緩 | `assets/img/mascot/anticipate.gif` |  | ☐ | P3 |
| ☐ | B41 | 吉祥物 celebrate（慶祝） | 400×500 gif≥48 暫緩 | `assets/img/mascot/celebrate.gif` |  | ☐ | P3 |
| ☐ | B42 | 吉祥物 lose（小失望） | 400×500 gif≥48 暫緩 | `assets/img/mascot/lose.gif` |  | ☐ | P3 |

## 紀錄

- 2026-11-18：第 2 版，主題改為「中東神燈寶藏（Arabian Nights）」、盲盒改為寶箱（3D 外型改成圓拱蓋寶箱）。全部為 mock 佔位圖，尚無任何交付。
