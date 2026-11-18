# 活動桌機捲軸

使用者原話：「每一個活動在pc都會有scroll bar 幫我強制隱藏」。

四個正式活動入口（Lucky Wheel、Survival Spin、Card Pack、Blind Box）引用同一份 `event/shared/css/desktop-scrollbars.css`。桌機 hover + fine pointer 條件下以標準 scrollbar-width 及 WebKit scrollbar 樣式隱藏頁面與後代元素的捲軸外觀；沒有加入 overflow:hidden 或取消滾輪事件。

驗證：Chromium 1440×900 與 600×700 桌機四頁均套用隱藏樣式；實際 wheel 及 PageDown 都能向下捲至規則／紀錄。390×844 觸控模擬仍為原本的 scrollbar-width:auto。[原始結果](checks.json)、[輸出](checks.log)。內部彈窗同受共用選擇器涵蓋，但本次捲動操作驗證限主頁，不宣稱逐一驗證所有彈窗長內容。

主對話已檢視四頁桌機捲至下方的實際截圖：

- [Lucky Wheel](20261111_lucky_wheel-desktop.webp)
- [Survival Spin](20261111_survival_spin-desktop.webp)
- [Card Pack](20261118_card_pack-desktop.webp)
- [Blind Box](20261118_blind_box-desktop.webp)

沒有改變活動美術與文字；source 美術審閱頁不是正式活動入口。舊 survival.html 會轉址到正式 Survival Spin。Firefox／Safari 實機及實體觸控板未驗證。
