# event — 活動頁

每個活動在這一層有自己的資料夾、入口、圖片、程式與美術文件。原版轉盤與生存輪盤已分開管理，不再把生存輪盤放在原版的 skin 子目錄裡。

## 活動列表

| 活動 | 資料夾與入口 | 主題與目前狀態 | 美術清單 |
|---|---|---|---|
| Lucky Wheel 原版轉盤 | [20261111_lucky_wheel](./20261111_lucky_wheel/) · [開啟活動](./20261111_lucky_wheel/index.html) | 百老匯舞台、兔比；已有主視覺、介面與可操作轉盤，仍有美術項目待交付 | [交付清單](20261111_lucky_wheel/docs/DELIVERY_CHECKLIST.md) |
| Survival Spin 生存輪盤 | [20261111_survival_spin](./20261111_survival_spin/) · [開啟活動](./20261111_survival_spin/index.html) | 墨綠／桃紅舞台、桃紅面具人物；目前使用第一版人物動態，已有專屬社群圖 | [交付清單](20261111_survival_spin/docs/DELIVERY_CHECKLIST.md) |
| 3D 拆卡包 | [20261118_card_pack](./20261118_card_pack/) · [開啟活動](./20261118_card_pack/index.html) | mock（美術主題：宇宙魔法卡包）；20 包環形可拖曳轉圈、點選任一包即選擇、卡包 1.5 倍；環形選包、撕封條、逐張翻卡；en/ko/th、次數、規則、紀錄、分享已比照轉盤；已套用主題美術 | [交付清單](20261118_card_pack/docs/DELIVERY_CHECKLIST.md) |
| 3D 拆盲盒 | [20261118_blind_box](./20261118_blind_box/) · [開啟活動](./20261118_blind_box/index.html) | mock（美術主題：奇幻沙漠與神燈精靈）；六個圓拱蓋寶箱環形可拖曳轉圈、點選任一箱即選擇、開箱為掀蓋；環形選盒、開蓋、翻開獎品卡；en/ko/th、次數、規則、紀錄、分享已比照轉盤；已套用主題美術 | [交付清單](20261118_blind_box/docs/DELIVERY_CHECKLIST.md) |

「已有素材」不等於所有交付與人工審核完成；各活動以自己的交付清單與檢查結果為準。正式站仍使用 mock 獎項資料，不代表已串接後台。

## 資料夾分類

```text
event/
├── 20261111_lucky_wheel/
├── 20261111_survival_spin/
├── 20261118_card_pack/
├── 20261118_blind_box/
└── shared/  共用程式、樣式與素材

每個活動統一：
├── index.html
├── README.md
├── assets/{css,js,img,audio}/  僅目前使用的交付檔
├── docs/                     規格、交付表、搬移索引
├── source/                   現行原稿
├── tools/                    現行製作工具
└── alternatives/             未使用與廢棄版本，保留原相對層級
```

拆卡包與拆盲盒共用 `shared/unbox-3d/` 的程式與版面，各活動只放自己的設定、色票與素材；換主題＝換圖＋色票（或 `skins/<名稱>/`），說明見 [shared/unbox-3d/README.md](./shared/unbox-3d/README.md)。修改共用程式時兩個活動都要驗證。

兩個活動各自包含 `DESIGN_TASKS.md`（美術需求）、`GPT_ASSET_BRIEF.md`（製作規格）、`DELIVERY_CHECKLIST.md`（提交與審核）。生存輪盤沿用已驗證的轉盤程式與 CSS，存放在自己的 `assets/`，可獨立載入；後續共同行為修正需同步檢查兩個活動。

## 工作流與共通規則

- 工作流：mock up → 製作美術 → 套用 → 驗證。詳見 [event-workflow](../.claude/skills/event-workflow/SKILL.md)。
- 前台語系為 en / ko / th，預設 en；中文僅供 Ctrl+Alt+L 內部預覽，不列入分享語系。
- 獎項、規則與次數由後台提供，活動程式保留資料介面與 mock 資料。
- 素材移動或換名時同步更新 config、入口、分享 metadata、文件與交付 commit；人工審核欄不可代填。
- 核對提交：`python3 scripts/check_delivery.py event/<活動資料夾>/docs/DELIVERY_CHECKLIST.md`。
- 新活動命名：`YYYYMMDD_event_name[_N]`，英文小寫與底線；相同日期與名稱才加 `_2` 等序號。

### 轉盤角色換圖規格

幸運轉盤與生存轉盤共用角色容器規格：4:5 畫布，`width: 81%`、`right: -36%`、`bottom: calc(100% - 38px)`。Skin 不覆寫角色尺寸或定位。更換視覺僅替換對應動作圖片；素材須在相同比例畫布中維持一致的站位、腳底基準與動作安全區，不靠修改版面配合新圖。

## 主題 loading

四個活動入口均使用專屬進站設計：百老匯燈泡徽章、生存機械閘門、宇宙紫晶星儀、沙漠神燈。共用樣式在 `shared/loading/loading.css`；`source/` 下的美術審閱頁不屬於活動入口。

## 桌機捲軸

四個活動入口共用 `shared/css/desktop-scrollbars.css`。桌機（hover + fine pointer）隱藏頁面與內部捲動區的捲軸外觀，保留 wheel／觸控板／鍵盤捲動；不使用 overflow:hidden 鎖住內容。新增活動入口應引用同一份樣式。

### 共用輔助按鈕

所有活動的分享、音效與左右切換使用 [共用亮面圓角按鈕](shared/buttons/README.md)，主題只換色；既定位置與點擊區保留。只有明確指定額外設計時才例外。

## 統一目錄規格

每款活動使用 `index.html`、`README.md`、`assets/{css,js,img,audio}`、`docs`、`source`、`tools`、`alternatives`。未使用資源移至 alternatives（備選），原稿維持 source；每次搬移記錄於該活動 `docs/FILE_MIGRATION.json`。`shared/` 為跨活動共用模組。原版轉盤的 `survival.html` 與舊社群預覽圖保留作公開網址相容入口。

舊版 Lucky Wheel 的 `survival.html` 與 `skins/survival/img/share-preview.jpg` 是既有公開分享連結的相容入口，仍有用途，保留於原路徑。
