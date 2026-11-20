# 新活動素材範本

新活動從「玩法」繼承素材槽位，再交付新主題素材。不要複製淘汰版本或把舊主題素材當成新圖交付。

```bash
# 可選 lucky_wheel、survival_spin、card_pack、blind_box 的現有資料夾。
python3 scripts/event-assets.py init --from 20261118_card_pack --name 20261201_winter_pack
python3 scripts/event-assets.py catalog
python3 scripts/event-assets.py check
```

`init` 只複製入口、程式與樣式，根據所選玩法的實際素材表產生待製作清單；不複製舊圖、音樂、音效或原稿。缺少素材時檢查會失敗，交付後才可發布。初始化後請更新日期、活動文案、mock 設定與主題色票，並在 event/README.md 登記新入口。

```text
YYYYMMDD_event_name/
├── index.html
├── README.md
├── assets/
│   ├── images/             場景、三語主標、介面、角色、分享圖
│   ├── music/              可循環背景音樂
│   ├── sounds/             點擊、選擇、開啟、揭曉、領獎等音效
│   ├── effects/            光暈、風沙、星光、體積粒子等特效貼圖
│   ├── 3d/                 textures/ 貼圖；models/ 僅有模型實檔時建立
│   ├── css/                結構與主題色票
│   └── js/                 素材槽位、內容設定及活動程式
├── source/
│   ├── images/             可編輯原圖、角色設定、三語主標、字型授權
│   ├── music/              背景音樂母帶、來源與授權
│   ├── sounds/             音效母帶、錄音與授權
│   ├── effects/            特效分層檔、序列幀、粒子來源
│   └── 3d/                 貼圖原稿、模型／UV／骨架來源（依需求）
└── docs/
    └── ASSETS.md            每項素材的編號、用途、規格與待交付核對表
```

每個素材分類的 README 是製作指引，沒有內容的模型子目錄、靜音檔及假圖片不建立。所有活動共用 `event/ASSET_MANIFEST.json` 這一份素材登錄資料；`docs/ASSETS.md` 與分類製作指引可重新產生。

## 命名與素材槽位

- 正式檔：`event_name_IMG001_stage-bg.webp`、`event_name_BGM001_bgm.mp3`、`event_name_SFX001_select.mp3`、`event_name_VFX001_atmosphere.webp`、`event_name_3D001_pack-front.webp`。
- 編號在活動及分類內唯一，保留既有號碼；新增只接續編號，不為排序而換號。
- 原稿包：`source/<分類>/event_name_SRC001_用途/`。同一動畫或分層作品的內部檔名維持關聯，避免拆散序列幀。
- 多個程式槽位可共用同一實體檔，素材表列出所有用途，不為每個槽位複製圖片。
- 共用按鈕、跨活動獎項圖與音效要列為依賴。改成專屬主題時，新增自己名下素材並更新 config，避免直接覆蓋其他活動。

## 換圖即換主題的邊界

同玩法且維持畫布、透明區、定位錨點、3D 各面比例和動畫時長時，覆蓋素材表對應檔案即可換圖；色票在 config 所引用的 theme.css／skin.css，文案在 config／i18n。三語主標必須各自製作，按鈕與動態獎項文字不得烘焙進圖。

卡包與寶箱目前由 `shared/unbox-3d/js/scene.js` 建立幾何，未使用外部 GLB 模型。改變輪廓、UV、動畫骨架或玩法要改程式並驗證，不能只換一張圖。

## 防遺漏驗收

1. 先逐列檢查 ASSETS.md，三語主標、loading、零次數／未中獎、分享預覽、操作音效與角色各狀態不可漏列。
2. 原稿與正式交付分開；正式圖片按實際展示尺寸輸出，保留透明、紋理和安全邊界。音樂可循環、音效不得削波；授權跟原稿一起交付。
3. 完成交付時更新 manifest 的尺寸、時間、SHA-256 與狀態，再重產清單並執行 check；不要以空檔繞過缺項檢查。
4. 實際驗證 en／ko／th、手機／桌機、初始／操作／結果／次數用完、慢網路及載圖失敗；確認不破壞共用活動。
5. 更新入口 JS／CSS 版本碼；不要保留 alternatives、快取、測試截圖、一次性匯出及重複壓縮檔。舊版本由 Git 歷史找回。
