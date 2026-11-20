# 20261118_blind_box · 3D 物件與貼圖

完整編號、用途、尺寸與程式引用見 [素材製作清單](../../docs/ASSETS.md)。

- `3D001` — `blind_box_3D001_chest-front.webp`：3D 寶箱貼圖：chest-front；640×400。
- `3D002` — `blind_box_3D002_chest-interior.webp`：3D 寶箱貼圖：chest-interior；512×352。
- `3D003` — `blind_box_3D003_chest-lid.webp`：3D 寶箱貼圖：chest-lid；512×512。
- `3D004` — `blind_box_3D004_chest-side.webp`：3D 寶箱貼圖：chest-side；512×320。

卡包／寶箱使用 `event/shared/unbox-3d/js/scene.js` 即時生成幾何，現行無 GLB／FBX 模型檔。`textures/` 是包裝各面貼圖；更換同型主題只換貼圖。若改模型輪廓、UV 或骨架，需同步修改程式並驗證，不屬於單純換圖。模型原始檔歸 `source/3d/`，網頁交付模型歸本目錄 `models/`（有實檔才建子目錄）。
