# 桃紅面具人物動態研究

最新方向：桃紅連帽連身服、黑色全罩面具、單一白圓標記的人形工作人員。

- `guard-original.png`：生成的角色基準原圖。
- `body-layer.png`：以同一基準圖生成的去手臂軀幹層，供手臂活動後露出的區域使用。
- `frames/<state>/frame_001.png`～`frame_048.png`：400×500 RGBA 序列，包含半透明接地影。
- `../guard-review/`：六段 GIF、動態 WebP、共用基準幀及預覽頁。
- `../../tools/build_guard.py`：分層關節旋轉、衣料局部位移、陰影合成與編碼。鏡頭固定，不做整體縮放。

GIF 為 48 幀／2000ms、無限循環、disposal=2，六段共用色盤與基準姿勢；WebP 保留半透明。GIF 的二值透明不能完整表現柔和影子，請同時在預覽頁切換 WebP 檢視。

WebP 編碼器可能合併相同的停留幀，但累積播放時間保持 2000ms；PNG／GIF 頭尾像素一致，WebP 有損編碼的頭尾以 alpha 預乘後平均差 <1.5/255 檢查。實測幀數與差異列在 `../guard-review/audit.json`。

重新製作：在 repo 根目錄執行 `python3 event/20261111_lucky_wheel/skins/survival/tools/build_guard.py`。已有的 48 幀序列及非空 WebP 會重用；修改動作或源圖後，先移開受影響狀態的序列資料夾與 WebP，再執行。原始生成檔保留不覆寫。

這批為獨立動態研究，尚未替換遊戲內兔比，也不代表舊兔比四視圖及正式整頁驗收已交付。
