# 美術交付勾選表：拆卡包・宇宙幻象（Cosmic Illusion）（20261118_card_pack）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `DESIGN_TASKS.md`，提示詞看 `GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261118_card_pack/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 `assets/js/config.js` 路徑（最後一列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261118_card_pack/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。出現 `DESIGN_TASKS.md` 第一節「禁止元素」任一項即退回。

## 0. 角色設定圖（最先做，審核通過才做有角色的圖）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C01 | 兔比宇宙兔女郎設定圖（四視圖、比例、表情 ×4、材質、色票） | 2400×1350 | `source/character/cosmic-bunny-sheet.{png,webp}` |  | ☐ | P0 |
| ☐ | C02 | 角色說明（服裝構成、色碼） | （人工） | `source/character/README.md` |  | ☐ | P0 |

## A. 靜態圖（30）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C03 | title-en | 690×240 | `assets/img/title/title-en.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C04 | title-ko | 690×240 | `assets/img/title/title-ko.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C05 | title-th | 690×240 | `assets/img/title/title-th.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C06 | stage-bg | 750×1000 | `assets/img/scene/stage-bg.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C07 | pack-back | 512×768 | `assets/img/3d/pack-back.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C08 | pack-crimp | 512×64 | `assets/img/3d/pack-crimp.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C09 | btn-primary | 400×110 | `assets/img/ui/btn-primary.{png,webp,svg}` |  | ☐ | P0 |
| ☐ | C10 | pack-front-1 | 512×768 | `assets/img/3d/pack-front-1.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C11 | pack-front-2 | 512×768 | `assets/img/3d/pack-front-2.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C12 | pack-front-3 | 512×768 | `assets/img/3d/pack-front-3.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C13 | reward-back | 600×900 | `assets/img/reveal/reward-back.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C14 | reward-frame-common | 600×900 | `assets/img/reveal/reward-frame-common.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C15 | reward-frame-rare | 600×900 | `assets/img/reveal/reward-frame-rare.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C16 | reward-frame-epic | 600×900 | `assets/img/reveal/reward-frame-epic.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C17 | reward-frame-legendary | 600×900 | `assets/img/reveal/reward-frame-legendary.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C18 | reveal-rays | 750×750 | `assets/img/reveal/reveal-rays.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C19 | period-badge | 480×64 | `assets/img/ui/period-badge.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C20 | chances-badge | 360×88 | `assets/img/ui/chances-badge.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C21 | ticker-bar | 690×64 | `assets/img/ui/ticker-bar.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C22 | card-frame | 120×120 | `assets/img/ui/card-frame.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C23 | card-title | 400×72 | `assets/img/ui/card-title.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C24 | info-bg | 750×750 | `assets/img/scene/info-bg.{png,webp,svg}` |  | ☐ | P1 |
| ☐ | C25 | share-preview | 1200×630 | `assets/img/share/share-preview.{png,jpg}` |  | ☐ | P1 |
| ☐ | C26 | btn-arrow | 96×96 | `assets/img/ui/btn-arrow.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C27 | icon-sound-on | 64×64 | `assets/img/icon/icon-sound-on.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C28 | icon-sound-off | 64×64 | `assets/img/icon/icon-sound-off.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C29 | icon-share | 64×64 | `assets/img/icon/icon-share.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C30 | icon-rotate | 160×160 | `assets/img/icon/icon-rotate.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C31 | icon-tap | 160×160 | `assets/img/icon/icon-tap.{png,webp,svg}` |  | ☐ | P2 |
| ☐ | C32 | footer-deco | 750×160 | `assets/img/scene/footer-deco.{png,webp,svg}` |  | ☐ | P2 |

## B. 色票、音效、原始檔、設定

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C33 | 色票（`--ev-color-*`、`--ev-3d-*`、`--ev-rarity-*`） | — | `assets/css/theme.css` |  | ☐ | P0 |
| ☐ | C34 | 音效 click：按鈕（≤0.2 秒） | 選配 | `assets/audio/click.mp3` |  | ☐ | P3 |
| ☐ | C35 | 音效 move：切換選項（≤0.15 秒） | 選配 | `assets/audio/move.mp3` |  | ☐ | P3 |
| ☐ | C36 | 音效 tear：撕封條／開箱（約 0.5 秒） | 選配 | `assets/audio/tear.mp3` |  | ☐ | P3 |
| ☐ | C37 | 音效 flip：翻卡（≤0.25 秒） | 選配 | `assets/audio/flip.mp3` |  | ☐ | P3 |
| ☐ | C38 | 音效 reveal：揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | 選配 | `assets/audio/reveal.mp3` |  | ☐ | P3 |
| ☐ | C39 | 音效 reward：全部揭曉（約 1 秒） | 選配 | `assets/audio/reward.mp3` |  | ☐ | P3 |
| ☐ | C40 | 主標可編輯原始檔（三語）連結或檔案說明 | （人工） | `source/title/README.md` |  | ☐ | P3 |
| ☐ | C41 | `assets/js/config.js` 圖片路徑改成實際交付的檔名，頁面無破圖 | — | `assets/js/config.js` |  | ☐ | P2 |

## C. 吉祥物動態（暫緩：目前頁面不放，先不要做）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C42 | 吉祥物 idle（待機） | 400×500 gif≥48 暫緩 | `assets/img/mascot/idle.gif` |  | ☐ | P3 |
| ☐ | C43 | 吉祥物 anticipate（期待） | 400×500 gif≥48 暫緩 | `assets/img/mascot/anticipate.gif` |  | ☐ | P3 |
| ☐ | C44 | 吉祥物 celebrate（慶祝） | 400×500 gif≥48 暫緩 | `assets/img/mascot/celebrate.gif` |  | ☐ | P3 |
| ☐ | C45 | 吉祥物 lose（小失望） | 400×500 gif≥48 暫緩 | `assets/img/mascot/lose.gif` |  | ☐ | P3 |

## 紀錄

- 2026-11-18：第 2 版，主題改為「宇宙幻象（Cosmic Illusion）」、角色改用兔比宇宙兔女郎造型。全部為 mock 佔位圖，尚無任何交付。
