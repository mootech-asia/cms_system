# 持步槍角色動態提案

桃紅連帽服、黑面具與單一白圓標記，黑色步槍搭配槍帶。此資料夾保留製作來源與預覽；四段 WebP 已套用至正式遊戲 `img/mascot/rifle-v1/`。

| 檔案 | 動作 |
|---|---|
| idle.gif / idle.webp | 待機：穩定持槍、輕微重心與頭部變化 |
| anticipation.gif / anticipation.webp | 期待：屈膝前傾，雙手持槍 |
| celebration.gif / celebration.webp | 慶祝：單手握拳上抬，另一手與槍帶支撐步槍 |
| disappointment.gif / disappointment.webp | 失望：低頭、垂肩，保持持槍 |

每段 400×500、48 幀、2 秒循環；首尾共用中立姿勢。原始六姿勢圖為 1536×1024（每格 512×512），未放大冒充高清。
PNG 與 WebP 保留透明度；GIF 使用深墨綠底供直接預覽。

各動作資料夾保留原始生成圖、六張關鍵姿勢、逐幀 PNG、review.jpg 與 checks.json。
採完整人物姿勢補間；三段使用 DIS，慶祝使用完整畫面對應點形變，不使用拆肢骨架。
技術檢查不代表視覺定稿，仍需檢視實際 GIF。

character-sheet.png 為造型參考；其中沿用的空手英文動作小字不適用持槍版，動作以本表與六姿勢圖為準。

慶祝 v2：移除中間幀的雙姿勢紋理混合，以單一來源紋理配合全畫面對位與細部光流修正，避免手套／槍身出現疊影。正式檔案為 `img/mascot/rifle-v1/celebration-v2.webp`；其餘三段不變。
