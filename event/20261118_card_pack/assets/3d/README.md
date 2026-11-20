# 20261118_card_pack · 3D 物件與貼圖

完整編號、用途、尺寸與程式引用見 [素材製作清單](../../docs/ASSETS.md)。

- `3D001` — `card_pack_3D001_pack-back.webp`：3D 卡包貼圖：pack-back；512×768。
- `3D002` — `card_pack_3D002_pack-contents.webp`：3D 卡包貼圖：pack-contents；256×384。
- `3D003` — `card_pack_3D003_pack-crimp.webp`：3D 卡包貼圖：pack-crimp；512×64。
- `3D004` — `card_pack_3D004_pack-front-1.webp`：3D 卡包貼圖：pack-front-1；512×768。
- `3D005` — `card_pack_3D005_pack-front-2.webp`：3D 卡包貼圖：pack-front-2；512×768。
- `3D006` — `card_pack_3D006_pack-front-3.webp`：3D 卡包貼圖：pack-front-3；512×768。
- `3D007` — `card_pack_3D007_pack-side.webp`：3D 卡包貼圖：pack-side；128×512。
- `3D008` — `card_pack_3D008_secret-pack.webp`：3D 卡包貼圖：secret-pack；512×768。
- `3D009` — `card_pack_3D009_secret-side.webp`：3D 卡包貼圖：secret-side；128×512。

卡包／寶箱使用 `event/shared/unbox-3d/js/scene.js` 即時生成幾何，現行無 GLB／FBX 模型檔。`textures/` 是包裝各面貼圖；更換同型主題只換貼圖。若改模型輪廓、UV 或骨架，需同步修改程式並驗證，不屬於單純換圖。模型原始檔歸 `source/3d/`，網頁交付模型歸本目錄 `models/`（有實檔才建子目錄）。
