# event — 活動頁

每個活動在這一層有自己的資料夾、入口、圖片、程式與美術文件。原版轉盤與生存輪盤已分開管理，不再把生存輪盤放在原版的 skin 子目錄裡。

## 活動列表

| 活動 | 資料夾與入口 | 主題與目前狀態 | 美術清單 |
|---|---|---|---|
| Lucky Wheel 原版轉盤 | [20261111_lucky_wheel](./20261111_lucky_wheel/) · [開啟活動](./20261111_lucky_wheel/index.html) | 百老匯舞台、兔比；已有主視覺、介面與可操作轉盤，仍有美術項目待交付 | [交付清單](./20261111_lucky_wheel/DELIVERY_CHECKLIST.md) |
| Survival Spin 生存輪盤 | [20261111_survival_spin](./20261111_survival_spin/) · [開啟活動](./20261111_survival_spin/index.html) | 墨綠／桃紅舞台、桃紅面具人物；目前使用第一版人物動態，已有專屬社群圖 | [交付清單](./20261111_survival_spin/DELIVERY_CHECKLIST.md) |

「已有素材」不等於所有交付與人工審核完成；各活動以自己的交付清單與檢查結果為準。正式站仍使用 mock 獎項資料，不代表已串接後台。

## 資料夾分類

```text
event/
├── README.md
├── 20261111_lucky_wheel/       # 原版轉盤、兔比活動素材
│   ├── index.html
│   ├── assets/{css,js,img}/
│   ├── reference/
│   ├── source/
│   └── tools/
└── 20261111_survival_spin/     # 生存輪盤、桃紅人物素材
    ├── index.html
    ├── assets/{css,js}/
    ├── img/
    ├── skin.css
    ├── source/
    └── tools/
```

兩個活動各自包含 `DESIGN_TASKS.md`（美術需求）、`GPT_ASSET_BRIEF.md`（製作規格）、`DELIVERY_CHECKLIST.md`（提交與審核）。生存輪盤沿用已驗證的轉盤程式與 CSS，存放在自己的 `assets/`，可獨立載入；後續共同行為修正需同步檢查兩個活動。

## 工作流與共通規則

- 工作流：mock up → 製作美術 → 套用 → 驗證。詳見 [event-workflow](../.claude/skills/event-workflow/SKILL.md)。
- 前台語系為 en / ko / th，預設 en；中文僅供 Ctrl+Alt+L 內部預覽，不列入分享語系。
- 獎項、規則與次數由後台提供，活動程式保留資料介面與 mock 資料。
- 素材移動或換名時同步更新 config、入口、分享 metadata、文件與交付 commit；人工審核欄不可代填。
- 核對提交：`python3 scripts/check_delivery.py event/<活動資料夾>/DELIVERY_CHECKLIST.md`。
- 新活動命名：`YYYYMMDD_event_name[_N]`，英文小寫與底線；相同日期與名稱才加 `_2` 等序號。
