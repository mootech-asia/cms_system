# 兔比動態優化 V2：呼吸首段

沿用 reference/rabbit-turnaround.png 已採用的角色方向與 assets/img/mascot/base-frame.png，對照 reference/RABBIT_REVIEW.md。先前完整品牌包的正式多視圖仍另行追蹤，本段不代表品牌包已交付。

既有角色以固定 96% 比例置入 400×500 畫布，只在輸出基準幀時處理一次留白；動畫過程不做整體縮放。胸肩局部起伏、頭部跟隨，y≥365 的下半身保持逐像素固定。保留官方配色標記、眼鏡、耳機與服裝；影子烘焙在每張 RGBA 幀。

輸出：idle-breathe-v2.gif（暖褐底預覽）、idle-breathe-v2.webp（透明）、48 張 idle-breathe-frames 原始幀、base-frame.png、breath-keyframes.jpg。48 幀／2000ms、頭尾相同；最小透明留白 14px，未裁切。驗證見 breath-checks.json、browser-checks.json。

此為局部形變的單段動態提案，不是新生高解析 3D 動畫。未替換遊戲原角色，另外五段兔比動態及完整品牌包未包含在本次提交。沒有建立預覽頁，GIF 於對話直接呈現。
