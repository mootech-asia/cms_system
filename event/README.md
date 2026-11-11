# event — 活動頁

每個活動一個獨立資料夾，免建置純 HTML+CSS+JS，直接以靜態檔部署。

## 資料夾命名規則

```
YYYYMMDD_event_name[_N]
```

- `YYYYMMDD`：活動建立日期（例：`20261111`）。
- `event_name`：英文小寫、單字以底線分隔（例：`lucky_wheel`）。
- `_N`：日期與名稱都相同時才加，從 `_2` 開始編號（例：`20261111_lucky_wheel_2`）。

## 工作流

每個活動都照 **mock up → 製作美術圖 → 套用** 進行，完整步驟、規格與常見問題見
[`.claude/skills/event-workflow/SKILL.md`](../.claude/skills/event-workflow/SKILL.md)（Claude 做活動時會自動載入）。
範本活動：`20261111_lucky_wheel/`。

## 共通規則

- 前台語系只有 **en / ko / th**（預設 en），畫面與交付圖檔不得出現中文。
- 中文僅供內部編輯預覽：按 **Ctrl+Alt+L**（Mac：Control+Option+L）切換，不在語系選單內。
- 瀏覽器分頁標題（`<title>`）一律英文。
- 獎項、規則等內容由我們的後台提供；活動頁只保留空位與資料格式。
- 吉祥物 Moo Rabbit（兔比，cms_system 事業部）的整套形象在 [`../brand/moo-rabbit/`](../brand/moo-rabbit/)；活動只放該活動用的動態。
- 交付勾選表一律用 `python3 scripts/check_delivery.py <勾選表>` 核對。

## 活動列表

| 資料夾 | 類型 | 狀態 |
|---|---|---|
| [`20261111_lucky_wheel`](./20261111_lucky_wheel/) | 轉盤抽獎 | mock up（佔位圖，待美術依 `DESIGN_TASKS.md` 替換） |

## 單一活動資料夾結構

```
20261111_lucky_wheel/
├── index.html
├── DESIGN_TASKS.md        # 美術製作需求單（規格與驗收）
├── GPT_ASSET_BRIEF.md     # 交給 GPT 產素材的步驟、提示詞與組 GIF 腳本
├── DELIVERY_CHECKLIST.md  # 交付勾選表（提交狀態）
├── reference/             # 吉祥物角色設計參考圖
└── assets/
    ├── css/event.css      # token（含轉盤扇區色票）
    ├── js/config.js       # 圖片／音效／吉祥物路徑、動畫時間、mock 預設內容
    ├── js/i18n.js         # en / ko / th（＋ zh 內部預覽）
    ├── js/store.js        # 後台資料格式與讀取
    ├── js/sound.js        # 鼓聲（未交付音檔時即時合成）
    ├── js/wheel.js
    └── img/               # 同檔名覆蓋即可換圖
```
