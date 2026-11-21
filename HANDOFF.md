# cms_system — Codex／Claude 交接

更新日期：2026-11-20（Asia/Taipei）。適用本 repo 與同組專案協作；專案規則以 CLAUDE.md、AGENTS.md 與使用者最新指示為準。

## 開始前必讀

1. 先讀根目錄 `AGENTS.md`、`CLAUDE.md`，再讀本文件；素材工作另讀 [統一素材標準](docs/ASSET_STANDARD.md)、[用途清單](docs/ASSETS.md) 與根目錄 `ASSET_MANIFEST.json`。
2. 執行 `git status --short`、`git branch --show-current`、`git log -5 --oneline` 並核對遠端。先檢視未提交差異，不能把其他人的修改當成廢檔。
3. 依任務閱讀實際程式和相關子目錄規則；此交接是狀態快照，不取代 Git、設定或使用者的新指示。

## 跨 repo 導覽

| Repo | 用途 | 目前預設工作分支（2026-11-20 快照） | 交接文件 |
|---|---|---|---|
| cms_system | 多版本 CMS 預覽與四款活動 | `main` | [接手說明](https://github.com/mootech-asia/cms_system/blob/main/HANDOFF.md) |
| mootech_website | MOOTECH 官網 A～E、中英文及品牌來源 | `claude/inspiring-hypatia-rpjq0j` | [接手說明](https://github.com/mootech-asia/mootech_website/blob/claude/inspiring-hypatia-rpjq0j/HANDOFF.md) |
| bo_system | 第三方支付後台介面原型 | `claude/web-deployment-url-yvya4o` | [接手說明](https://github.com/mootech-asia/bo_system/blob/claude/web-deployment-url-yvya4o/HANDOFF.md) |
| Informatica-Administrator | Node 監控入口與設計交付頁 | `main` | [接手說明](https://github.com/mootech-asia/Informatica-Administrator/blob/main/HANDOFF.md) |

接手時重新查 `gh repo view mootech-asia/<repo> --json defaultBranchRef`；不可假設四個 repo 都以 main 作為預設分支或有相同部署設定。

## Codex／Claude 協作規則

- 使用者的新指示優先；依 repo 的現有授權工作，不把另一個 repo 的發布授權或技術選型直接套過來。
- 同一 repo 同時作業時，各用獨立 worktree／工作分支並約定負責檔案；若共用 main，必須串行提交。不得同時改同一份 manifest、共用引擎或 lockfile。
- 開工先說明本次範圍；提交前重新查看遠端與本機差異，只提交本次工作。遠端前進時先整合並重驗相關項目，不強制推送、不改寫別人的已發布提交。
- 不使用 reset／clean 或刪檔清空他人的工作；遇到不明修改先保留，透過 Git 差異判斷來源。未經使用者明確要求，不另派 subagent。
- 不修改 GitHub 環境保護、部署允許分支或審核條件來繞過發布失敗；記錄阻塞與原始錯誤。
- 不提交密碼、token、實際使用者資料或產生的資料庫。技術註解只記必要限制，工作歷程寫交接紀錄或 commit。

## 共用素材維護

- 正式素材按 images／music／sounds／effects／3d 分類；有實檔時才加 videos、fonts。新檔採專案或活動前綴＋分類編號，原稿與正式檔分離。
- `pathPolicy: contract` 是已登錄的公開／動態／品牌相容路徑，並不表示那些檔案已改成新檔名；先追引用再決定是否搬移，不複製一份圖只為了湊命名。
- manifest 是登錄來源，`docs/ASSETS.md` 是產生的清單。改素材時先驗尺寸、透明、動畫、UV／音量，再更新指紋及規格；`catalog` 不會替你自動驗收新圖或補算交付指紋。
- 同玩法換圖必須維持畫布、錨點、比例、UV、動畫時間；色票另調 CSS。更改骨架、輪廓或玩法需要工程配合。
- 四個 repo 的 `docs/ASSET_STANDARD.md`、`tools/assets.py`、`.github/workflows/asset-standard.yml` 目前內容一致。若改共用標準或 checker，需同步四份並在各 repo 驗證；單一專案細節留在自己的交接文件。

```bash
python3 tools/assets.py check
# 只有登錄資料變更時才重新產生清單：
python3 tools/assets.py catalog
# 新功能需要製作清單時：
python3 tools/assets.py brief --name feature_name
```

## 每次工作結束的交接要求

每次工作結束都更新本 repo `HANDOFF.md` 的「工作紀錄／下一步」，並同步必要的 README／入口連結；跨 repo 修改則更新各受影響 repo。記錄能由 Git、CI 或實際操作證實的事，不以聊天記憶當證據。

- 寫明做了什麼、改動檔案／功能、程式基準提交、目前分支、測試指令與結果、部署 run／失敗原因。
- 區分已完成、進行中、阻塞、未驗證與下一個可執行步驟；CI 素材檢查通過不等於業務、視覺或實機已驗收。
- 文件不放容器專屬暫存路徑或秘密。只有文件／規則變更時檢查差異與連結，不因此跑全站建置或瀏覽器；runtime 素材改動才按影響範圍做畫面及功能回歸。

交接紀錄格式：

```text
日期／負責者：
任務與狀態：已完成／進行中／阻塞
工作分支／程式提交：
修改範圍：
驗證指令與結果／CI 證據：
發布狀態／阻塞原因：
未驗證與下一步：
```

## 本 repo 結構與修改範圍

- `v1.5`～`v6`：各版本前台／設計後台，保留各自發布根目錄。框架、Tailwind、手寫 CSS 的例外以 CLAUDE.md 為準，不因整理素材而轉框架。
- `event/`：Lucky Wheel、Survival Spin、Card Pack、Blind Box 四款活動。完整入口與素材清單見 [活動總覽](event/README.md)。
- 卡包／寶箱共用 `event/shared/unbox-3d/`；兩個轉盤目前各有自己的 wheel.js，改共同行為需同步回歸兩款。
- event 有獨立 `event/ASSET_MANIFEST.json`，repo 層級 checker 委派給 `scripts/event-assets.py check`；不要在兩份 manifest 重複登錄同一活動素材。
- 改活動前讀 `.claude/skills/event-workflow/SKILL.md`；新活動從 [玩法範本](event/_template/README.md) 建立完整槽位，不複製舊主題素材當成新交付。

## 活動行為與待辦界線

- 兩款轉盤支援剩餘次數上限 10 的自動連轉、Skip、結果彙總；獎項底圖預載／解碼完成再顯示，載入失敗有備用面板，等待期間不可重複扣次數。
- 卡包／寶箱保留選擇、開啟、揭曉流程；角色、粒子、3D、操作位置與減少動態規格依現行程式及 CLAUDE.md，不重畫版面配合換圖。
- 獎項、次數與紀錄仍有 mock；正式後端需依 store.js 的 `EVENT_CONTENT`／`EVENT_RESOLVE` 介面接入，後端處理資格、扣次數與冪等，不能把 localStorage 當成正式交易憑據。
- 美術人工審核仍以各活動 DELIVERY_CHECKLIST.md 為準，不能把路徑檢查通過當成品牌終審；新角色動畫依 CLAUDE.md 的 12fps／24 幀新規格，不強制把舊素材改速充數。

## 本機與相關驗證

```bash
python3 -m http.server 8900
# 另一個 terminal，依修改範圍選擇：
python3 tools/assets.py check
python3 scripts/event-assets.py check
node scripts/check-event-structure.cjs
python3 scripts/test_event_assets.py
CHECK_BASE=http://127.0.0.1:8900 node scripts/verify-wheel-auto.cjs
CHECK_BASE=http://127.0.0.1:8900 node scripts/verify-wheel-result-art.cjs
```

Playwright 腳本需 npm 相依套件與 Chromium；以腳本內指定的瀏覽器路徑／環境變數為準。Tailwind 原始碼改動才執行 npm run build；相關發布驗證依 CLAUDE.md 的 pre-report 規則。其他互動回歸腳本位於 scripts/，不用因純文件修改無差別全跑。

## 發布與下一步

- 本 repo 依既有授權推 origin/main；發布流程 `.github/workflows/deploy-pages.yml`，素材檢查 `asset-standard.yml`。
- 原稿不加入活動首屏；Pages staging 由 `scripts/stage-pages.py` 控制，改路徑要一起查 staging、metadata 與嵌入頁。
- 下一步由實際需求決定：新主題先開完整素材清單；接後台前確認冪等與失敗回復；不要順手刪除有用途的舊路徑契約。

## 工作紀錄／下一步

- 2026-11-20：素材整理基準 [commit 0483d8e](https://github.com/mootech-asia/cms_system/commit/0483d8e2a0a2f7925aa2181b57aa09b33b91fb6d)；分支 `main`。這是程式／素材基準，不是本文件未來的最新版本號。
- 本 repo 層級登錄 1192 項素材；[素材 CI](https://github.com/mootech-asia/cms_system/actions/runs/44700770566) 已通過。 event 子清單另行管理，不重複計入上述數量。
- 已完成：跨 repo 標準、用途清單、缺檔／編號／指紋檢查與協作入口。現有 contract 路徑仍保留，沒有宣稱所有舊檔都已改名。
- 本次交接補齊：本文件、Claude 閱讀入口及每次完工更新交接的規則；本次僅修改文件，不改 runtime 或部署保護設定。
- 前一輪有相關手機／桌機與語系操作驗證；本次未重新跑 UI／實機或後端驗收。接手改 runtime 時依上述指令與影響範圍重測，不把舊結果當成新驗收。
- 2026-11-21／Claude：新增本週 Figma 修改單與交接包 `docs/handover/figma-changes-20261121-week.md`、`figma-handover-20261121-week.zip`（依 main `9d1bd00` 截圖：四款活動 390 寬 en、v3／v6 選單、v6 手機兩張新頁）。純文件，未改 runtime；v1.5／v2／v4／v5 選單入口未截圖。
