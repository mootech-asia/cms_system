# Lucky Wheel — 原版轉盤

活動入口：[index.html](./index.html)。語系：`?lang=en`、`?lang=ko`、`?lang=th`。

這個資料夾管理百老匯舞台風格的原版轉盤與兔比活動素材。生存輪盤已獨立到 [../20261111_survival_spin/](../20261111_survival_spin/)，桃紅人物與相關來源檔在該處維護。

- `assets/`：本活動的程式、樣式與遊戲使用圖片。
- `source/`、`tools/`：原圖、製作工具、動態與歷史檢查資料。
- `reference/`：官方品牌參考與已採用的兔比設定。
- [DESIGN_TASKS.md](./DESIGN_TASKS.md)、[GPT_ASSET_BRIEF.md](./GPT_ASSET_BRIEF.md)：美術需求與製作規格。
- [DELIVERY_CHECKLIST.md](./DELIVERY_CHECKLIST.md)：提交狀態與人工審核；已有素材不等於全部通過審核。

主視覺與介面素材已套用，活動仍使用 mock 資料。兔比下一輪先優化四段：待機、興奮、慶祝、再接再厲；每段需有足夠中間姿勢、透明邊緣檢查與 GIF 預覽。四段之後再做完整吉祥物設定；15 秒影片不做。

`survival.html`、入口的 `?skin=survival` 轉址與 `skins/survival/img/share-preview.jpg` 僅保留舊連結相容用途，不是第二份生存輪盤。

## 兔比動態優化進度

[四段動態預覽與透明素材](./source/rabbit-fullpose-v4/README.md)：待機、興奮、慶祝、再接再厲。已套用原版轉盤，胸前字標仍需修整。

## 載入與動畫交付

首屏只等待目前語系及舞台必要素材，角色先顯示 `optimized/poster.webp`，動畫在畫面可操作後載入。`config.js` 的角色路徑使用各角色目錄下的 `optimized/` 網頁交付檔；原動畫保留作為來源。執行 `python3 scripts/optimize_event_mascots.py` 可重建交付檔，保留原尺寸、透明背景與循環時長。

## 主題進站畫面（20261118-loading1）

百老匯：天鵝絨幕布、皇冠黃銅燈泡徽章、中央百分比、雙層鍍金進度槽。

| 素材 | 尺寸 | 用途 |
|---|---|---|
| `assets/img/loading-emblem.webp` | 480×480 RGBA | 中央專屬器物；無文字，按240px顯示；原稿保留 `source/loading/emblem-original.png` |

共用樣式位於 `event/shared/loading/loading.css`，HTML 的 `data-theme` 在應用程式啟動前指定主題。實際圖片完成數驅動進度；失敗仍計為已處理，維持10秒截止退場，不用假進度或強迫等待。三語文案獨立於圖片，減少動態模式停止裝飾動畫。
