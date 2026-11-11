# event — 活動頁

每個活動一個獨立資料夾，免建置純 HTML+CSS+JS，直接以靜態檔部署。

## 資料夾命名規則

```
YYYYMMDD_event_name[_N]
```

- `YYYYMMDD`：活動建立日期（例：`20261111`）。
- `event_name`：英文小寫、單字以底線分隔（例：`lucky_wheel`）。
- `_N`：日期與名稱都相同時才加，從 `_2` 開始編號（例：`20261111_lucky_wheel_2`）。

## 活動列表

| 資料夾 | 類型 | 狀態 |
|---|---|---|
| [`20261111_lucky_wheel`](./20261111_lucky_wheel/) | 轉盤抽獎 | mock up（佔位圖，待設計替換） |

## 單一活動資料夾結構

```
20261111_lucky_wheel/
├── index.html
├── DESIGN_TASKS.md        # 設計需求任務清單（要交付哪些圖、尺寸、規格）
└── assets/
    ├── css/event.css
    ├── js/config.js       # 換圖、改獎項、改機率只改這裡
    ├── js/wheel.js
    └── img/               # 設計稿以「同檔名覆蓋」或改 config.js 路徑的方式替換
```
