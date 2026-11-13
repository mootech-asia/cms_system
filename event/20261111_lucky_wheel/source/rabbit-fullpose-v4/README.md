# 兔比四個動態優化預覽

| 動作 | GIF | 透明 WebP |
|---|---|---|
| 待機 | [idle.gif](idle.gif) | [idle.webp](idle.webp) |
| 興奮：屈膝握拳期待 | [excited.gif](excited.gif) | [excited.webp](excited.webp) |
| 慶祝：開心比雙讚 | [celebration.gif](celebration.gif) | [celebration.webp](celebration.webp) |
| 再接再厲：點頭、單手比讚 | [recover.gif](recover.gif) | [recover.webp](recover.webp) |

每段 400×500、2 秒循環，附 RGBA PNG 序列及原生透明姿勢圖。每段 6 個完整關鍵姿勢，以全畫面光流補幀成 48 個影格紀錄；呼吸／回復循環含 24～25 張不同畫面，不宣稱 48 張獨立繪製姿勢。顏色與 alpha 共用位移場，沒有手腳拆件旋轉或色差去背。

逐幀尺寸、留白與共用頭尾檢查見 four-actions-checks.json；深淺背景邊緣檢視見 actions-edge-check.jpg。GIF 使用固定底色，遊戲透明格式為 WebP。

四段動作已套用原版轉盤；生成胸前字標仍需修整，不能視為完整品牌素材交付。首版再接再厲因重影已淘汰，不在本資料夾交付。

工具：tools/build_rabbit_fullpose_idle.py、tools/build_rabbit_fullpose_actions.py，需 Pillow、NumPy、opencv-python-headless。

網頁套用：待機 `idle-1.webp`、抽獎中 `spinning.webp`、中獎 `result.webp`、未中獎 `lose.webp`。皆為透明 WebP，2 秒循環。
