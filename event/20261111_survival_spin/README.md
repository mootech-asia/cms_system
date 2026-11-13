# Survival Spin — 生存輪盤

獨立活動入口：[index.html](./index.html)。英文、韓文、泰文以 `?lang=en`、`?lang=ko`、`?lang=th` 選擇。本站使用 mock 獎項與次數，尚未代表後台正式串接。

## 檔案用途

| 路徑 | 用途 |
|---|---|
| `index.html` | 遊戲與專屬 OG / Twitter 分享 metadata |
| `assets/js/` | 設定、轉盤、語系、分享、音效與資料介面 |
| `assets/css/event.css`、`skin.css` | 沿用的共用版型與生存輪盤色票 |
| `img/` | 遊戲正在使用的主視覺、介面、角色與社群圖 |
| `source/` | 原圖、歷史提案、動態序列與檢查資料；不代表全數已採用 |
| `tools/` | 素材組裝與輸出工具 |
| `DESIGN_TASKS.md`、`GPT_ASSET_BRIEF.md` | 美術需求與製作規格 |
| `DELIVERY_CHECKLIST.md` | 提交紀錄；人工審核與素材可用性仍須分別確認 |

## 目前採用版本

- 舞台：墨綠大廳、桃紅階梯與轉盤。
- 人物：`img/mascot/` 使用第一版桃紅面具人物（還原來源 `ba4675c`，還原提交 `e3f2143`）。六段新版分段姿勢留在 `source/guard-fullpose-v3/`，已因流暢度與邊緣問題退回，不作為遊戲使用版。
- 社群圖：[img/share-preview.jpg](./img/share-preview.jpg)，1200×630。新入口的 HTML 原始碼直接引用此圖。
- 舊文件中的「兔比工作人員造型」是先前方向；目前遊戲角色為桃紅面具人物。原交付表保留歷史審核欄，不冒填舊項目。

原版轉盤與兔比活動素材位於 [../20261111_lucky_wheel/](../20261111_lucky_wheel/)。品牌完整吉祥物包位於 [../../brand/moo-rabbit/](../../brand/moo-rabbit/)。
