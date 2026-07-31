# cms_system

CMS 生成系統的統一預覽 repo。整合 `cms_system_v2`、`cms_system_v3` 兩個交付版型，
每個版本都是完全獨立、免建置的純 HTML+CSS+JS 靜態站，不依賴任何前端框架
（無 Vue／Nuxt／Tailwind／PrimeVue 殘留）。

## 目錄結構

```
cms_system/
├── index.html       # 統一首頁，四個入口：v2 前台/設計後台、v3 前台/設計後台
├── v2/
│   ├── site/         # WIN100 前台（純 HTML+CSS+JS）
│   └── studio/        # 設計後台（純 HTML+CSS+JS，iframe 預覽 site/，localStorage 同步）
└── v3/
    ├── site/         # 前台（純 HTML+CSS+JS）
    └── studio/        # 設計後台（同上）
```

## 開發規範

見 [`CLAUDE.md`](./CLAUDE.md)。

## GitHub Pages

https://mootech-asia.github.io/cms_system/
