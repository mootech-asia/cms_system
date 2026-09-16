/* 掃描目標清單。新增版本/資料夾時只要在這裡加一筆設定即可。 */
module.exports = {
  sites: [
    {
      key: 'v2-site',
      dir: 'v2/site',
      localeStorageKey: 'win100-locale',
      locales: ['zh', 'en', 'ko', 'th'],
      /* 前台預設只公開 en/ko/th（zh 要在 studio 開關才會出現在切換器），
         但仍是可被啟用的真實內容，稽核時強制打開四語系一起檢查。 */
      extraLocalStorage: { 'win100-public-config': JSON.stringify({ publicLocales: ['zh', 'en', 'ko', 'th'] }) },
      /* ui-kit.html 是給工程/設計參考用的元件型錄頁，本來就不是玩家會
         看到的內容，不列入稽核範圍。 */
      excludePages: ['ui-kit.html'],
    },
    {
      key: 'v3-site',
      dir: 'v3/site',
      localeStorageKey: 'cms-v3:locale',
      locales: ['zh', 'en', 'ko', 'th'],
      excludePages: ['ui-kit.html'],
    },
    {
      key: 'v3-site-mobile',
      dir: 'v3/site-mobile',
      localeStorageKey: 'cms-v3:locale',
      locales: ['zh', 'en', 'ko', 'th'],
      excludePages: ['ui-kit.html'],
    },
  ],

  /* 元素 class 名稱只要包含以下任一子字串，其文字節點／屬性值視為
     「專有名詞」（遊戲名稱、廠商/供應商名稱、球隊名、帳號、金額、銀行
     資訊等）：不論是否含中文、是否跨語系相同，一律略過不通報。
     這份清單來自逐一讀 site.js 裡動態產生卡片/清單的 render function，
     新增卡片樣板時要記得補列對應 class。 */
  properNounClassHints: [
    'gcard-title', 'gcard-provider',
    'game-listing-card-name', 'game-listing-card-provider',
    'mini-game-card-name', 'vnd-name', 'vnd-provider-badge',
    'match-card-team-name', 'match-card-team-code', 'match-card-league',
    'sup-panel-h',
    'header-account-id-value', 'balance-num', 'pi-val', 'pi-username',
    'mobile-account-name', 'acct-balance-value', 'acct-member-value',
    'promotion-detail-subtitle',
    /* 銀行/錢包卡片：品牌名稱、遮罩後的戶名、動態金額，皆非翻譯內容 */
    'bank-logo', 'bound-pill', 'bound-name', 'wd-stat-value',
    /* 帳號/暱稱、交易編號、錢包地址、日期輸入格式樣板：資料值非文案 */
    'acct-name', 'acct-panel-row', 'rt-mono', 'rb-daterange-input',
    'dd-panel-link', 'rec-date-text',
    /* v3：預先烘焙、預設 display:none 的遊戲彈窗，真正顯示前一定會被
       openGameModal() 用 tr() 產生的內容整個覆蓋，靜態掃描抓到的只是
       尚未被覆蓋的初始佔位內容。同一數字每秒遞減的倒數文字亦非文案。 */
    'modal-bg', 'rec-refresh',
  ],

  /* 純數字/代碼/品牌名一類、本來就該跨語系不變的短字串，直接用完整
     字串比對排除（同上，不論中英文都不通報）。 */
  ignoreExactText: [
    'VIP1', 'UTC', 'AG', 'PT', 'EVO', 'PP', '+82', '100%', 'WIN100',
    'USDT TRC20', 'USDT ERC20', 'TRC20', 'ERC20',
  ],

  /* 命中以下任一 pattern 的字串直接跳過（遮罩戶名、動態金額等本來就
     不該被翻譯字典覆蓋的內容）。 */
  ignoreTextPatterns: [
    /[＊*]{2,}/, // 遮罩過的帳號/戶名，例如 M＊＊＊＊＊＊＊
    /^amount\s*:/i, // 動態金額模板
    /^:\s*\S/, // 標籤/值拆成兩個文字節點後，冒號+值的那一段（值本身不翻譯）
  ],
};
