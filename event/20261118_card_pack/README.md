# 拆卡包（20261118_card_pack）

六包卡包環形排列，左右拖曳或用箭頭挑選 → 選定後沿封條橫滑或按按鈕撕開 → 每包一張卡，點擊翻開 → 返回挑選。
次數、規則、紀錄、跑馬燈、分享、音效、三語系、換圖標籤與內部面板比照 `20261111_lucky_wheel`。

- 入口：`index.html`（免建置）
- 設定與換圖：`assets/js/config.js`；色票：`assets/css/theme.css`
- 共用程式：`../shared/unbox-3d/`（與拆盲盒共用，說明見該資料夾 README）
- 美術：`DESIGN_TASKS.md`（需求）、`GPT_ASSET_BRIEF.md`（製作步驟與提示詞）、`DELIVERY_CHECKLIST.md`（交付勾選）
- 內部面板：畫面同一位置連點三下（每下間隔 ≤0.5 秒，點在按鈕上不算）：每次獎品數預覽、重設次數（10）、換圖標籤開關
- 中文預覽：Ctrl+Alt+L（Mac：Control+Option+L）

已套用宇宙卡包／神燈寶箱美術、三語主標、UI、分享圖與六種音效。獎項、次數與紀錄仍為 mock，尚未串接正式後台。可編輯主標與字型授權位於 `source/title/`。
