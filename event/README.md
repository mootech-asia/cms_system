# Event 活動與素材總覽

四款活動使用相同素材分類與命名規格。正式交付、可編輯原稿和共用資源分開存放；不保留淘汰版本、快取及舊測試輸出，歷史版本由 Git 回溯。

| 活動 | 入口 | 素材編號／用途／規格 |
|---|---|---|
| Lucky Wheel 幸運轉盤 | [20261111_lucky_wheel](20261111_lucky_wheel/index.html) | [素材清單](20261111_lucky_wheel/docs/ASSETS.md) |
| Survival Spin 生存輪盤 | [20261111_survival_spin](20261111_survival_spin/index.html) | [素材清單](20261111_survival_spin/docs/ASSETS.md) |
| Cosmic Magic Card Pack 宇宙卡包 | [20261118_card_pack](20261118_card_pack/index.html) | [素材清單](20261118_card_pack/docs/ASSETS.md) |
| Desert Treasure Blind Box 沙漠寶箱 | [20261118_blind_box](20261118_blind_box/index.html) | [素材清單](20261118_blind_box/docs/ASSETS.md) |
| Shared 共用素材 | 按鈕、耗盡狀態徽章、批次計數提示音 | [共用清單](shared/docs/ASSETS.md) |

正式站的獎項、次數與紀錄仍使用 mock 資料，尚未串接正式後台。美術交付和人工審核狀態另見各活動 docs/DELIVERY_CHECKLIST.md；歷史淘汰列不再當成現行交付需求。

## 統一資料夾結構

```text
event/
├── YYYYMMDD_event_name/
│   ├── index.html
│   ├── README.md
│   ├── assets/
│   │   ├── images/     IMG：場景、三語主標、UI、角色、分享圖
│   │   ├── music/      BGM：背景音樂
│   │   ├── sounds/     SFX：操作、開啟、揭曉、領獎音效
│   │   ├── effects/    VFX：粒子、風沙、光暈、反光貼圖
│   │   ├── 3d/         3D：textures 貼圖、models 模型（有實檔才建子目錄）
│   │   ├── css/        結構與主題色票
│   │   └── js/         config 素材槽位、資料與玩法
│   ├── source/         同五類的可編輯原稿、母帶、角色序列與授權
│   └── docs/ASSETS.md  編號、用途、規格、引用與換圖驗收
├── shared/             共用引擎、元件、素材與原稿
├── _template/          新活動製作標準與建立方法
└── ASSET_MANIFEST.json 唯一素材登錄資料，清單由此產生
```

正式檔名以活動名稱開頭，例如 `card_pack_3D001_pack-back.webp`。IMG／BGM／SFX／VFX／3D 各自編號；既有號碼不重排。原稿包用 `活動名稱_SRC編號_用途`，序列幀／分層圖內部檔名維持關聯。

五類目錄的 README 是素材製作指引；未使用的類別明確標為不適用，不建立假圖、靜音檔、空模型或空子目錄。現行兩款 3D 活動的幾何由 `shared/unbox-3d/js/scene.js` 即時生成，交付的是各面貼圖，沒有 GLB／FBX 檔。

## 新建活動與換主題

完整規格見 [新活動範本](_template/README.md)。

```bash
python3 scripts/event-assets.py init --from 20261118_card_pack --name 20261201_winter_pack
python3 scripts/event-assets.py catalog
python3 scripts/event-assets.py check
node scripts/check-event-structure.cjs
```

建立工具繼承所選玩法的完整素材槽位，產生待製作清單，不複製舊主題美術。檢查工具會攔截缺檔、額外未登錄素材、無引用素材、編號／命名錯誤、尺寸或指紋不符及快取廢檔。

同玩法與相同尺寸、透明區、錨點、UV、動畫時長下，替換素材表對應圖檔即可換圖；色票在 config 引用的 CSS，文案由 config／i18n 控制。三語主標各自製作，按鈕、日期、次數與獎項文字維持 DOM 疊字。改模型輪廓、骨架或玩法仍需工程修改及驗證。

共用資源不複製到每個活動。素材清單列出跨活動的借用依賴；新主題可在 config 改用專屬素材。兩個轉盤目前各自保留玩法程式；卡包／寶箱共用 unbox-3d 引擎。共享修改需回歸兩個活動。

## 相容入口與共用介面

Lucky Wheel 的 `survival.html` 和 `skins/survival/img/share-preview.jpg` 是既有公開分享連結，保留作轉址／社群圖相容用途，屬有用資源。

四款活動共用 `shared/buttons/buttons.css`、`shared/loading/loading.css`、`shared/records/`、`shared/event-runtime.js` 與 `shared/css/desktop-scrollbars.css`。分享、音效及導覽按鈕共用一套可換色素材；回到頂部、紀錄分頁與生命週期暫停沿用既有程式。
