# 共用活動輔助按鈕

所有 event 引用 `buttons.css`，分享、音效及左右方向鍵使用同一家族，除非明確另行指定設計。保留現有按鈕 ID、ARIA 狀態、尺寸與座標；樣式只替換視覺層。

`body[data-event-controls]`：pink（預設）、gold、cosmic、desert。新主題用 `--ev-control-tint` 調色，不複製樣式表。音效圖由原本 `aria-pressed` 狀態切換，主要 CTA 維持原主題。

分享及音效使用 Survival Spin 原始交付 WebP，原稿位於 `event/20261111_survival_spin/source/ui/`。方向鍵底框以同素材延伸生成，原稿保留在 `source/frame-original.png`，網頁用 128px WebP；箭頭由 CSS 疊加，可保持小尺寸清晰。
