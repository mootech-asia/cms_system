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

[待機首段 GIF 預覽](./source/rabbit-fullpose-v4/idle.gif) 已輸出，使用原生透明姿勢與全畫面補幀；胸前字標仍需修整，尚未替換遊戲。興奮、慶祝、再接再厲尚待製作，詳細限制見 [製作說明](./source/rabbit-fullpose-v4/README.md)。
