/*
 * 活動「設計面」設定：圖片、音效、吉祥物、動畫時間。換圖只改這裡（或同檔名覆蓋）。
 * 獎項、規則、次數等「內容」由後台提供（格式見 store.js），defaultContent 是後台
 * 沒提供時的 mock 預設值。
 *
 * 盤面不是圖片：程式依獎項數量自動畫扇區，配色取自 event.css 的 --ev-wheel-N token，
 * 第 1 個獎項的扇區中心對準正上方指針，其餘順時針排列。
 */
window.EVENT_CONFIG = {
  spinDurationMs: 5000,
  minFullTurns: 6,
  bulbCount: 24,
  idleSwapMs: 6000,
  resultHoldMs: 600,
  prizeLimits: { min: 3, max: 12 },
  mockResetSpins: 10,

  images: {
    stageBg: 'assets/img/stage-bg.webp',
    infoBg: 'assets/img/info-bg.webp',
    stageFloor: 'assets/img/stage-floor.webp',
    title: {
      en: 'assets/img/title-en.webp',
      ko: 'assets/img/title-ko.webp',
      th: 'assets/img/title-th.webp',
      zh: 'assets/img/title-zh.svg'
    },
    spotlight: 'assets/img/spotlight.svg',
    lightPool: 'assets/img/light-pool.svg',
    stageVignette: 'assets/img/stage-vignette.svg',
    bulbOn: 'assets/img/bulb-on.svg',
    bulbOff: 'assets/img/bulb-off.svg',
    wheelFrame: 'assets/img/wheel-frame.webp',
    wheelGloss: 'assets/img/wheel-gloss.svg',
    wheelStand: 'assets/img/wheel-stand.webp',
    pointer: 'assets/img/pointer.webp',
    btnGo: 'assets/img/btn-go.webp',
    btnPrimary: 'assets/img/btn-primary.webp',
    modalBg: 'assets/img/modal-bg.webp',
    soundOn: 'assets/img/icon-sound-on.webp',
    soundOff: 'assets/img/icon-sound-off.webp',
    share: 'assets/img/icon-share.webp',
    periodBadge: 'assets/img/period-badge.webp',
    chancesBadge: 'assets/img/chances-badge.webp',
    cardFrame: 'assets/img/card-frame.webp',
    cardTitle: 'assets/img/card-title.webp',
    tickerBar: 'assets/img/ticker-bar.webp',
    footerDeco: 'assets/img/footer-deco.webp',
    rotateHint: 'assets/img/icon-rotate.svg'
  },

  /* 吉祥物：每個狀態一個循環 GIF，全部共用同一張基準幀（頭尾）且長度相同（loopMs），
     程式在一輪結束時才切換，動作可以隨時無縫替換。idle 會在多張之間輪播。 */
  /* 網頁載入的是 tools/gif_to_webp.py 由交付 GIF 轉出的動態 WebP（同內容、約 1/3 大小）；
     換新素材後重跑該腳本（有 PNG 序列幀時優先用序列幀，保留半透明影子）。loopMs 必須等於 GIF 每幀時長總和（目前 48 幀 = 2000ms）。 */
  mascot: {
    loopMs: 2000,
    idle: [
      'assets/img/mascot/idle-2.webp',
      'assets/img/mascot/idle-3.webp'
    ],
    spinning: 'assets/img/mascot/spinning.webp',
    result: 'assets/img/mascot/result.webp',
    // 未中獎的「失望」動作：交付後填 mascot 資料夾裡的 lose 動態檔；留空時用 result
    lose: ''
  },

  /* 音效：留空時用 Web Audio 即時合成鼓聲；交付音檔後填路徑即改播音檔。 */
  sounds: {
    drumroll: '',
    win: '',
    lose: '',
    reward: '',
    rewardLose: ''
  },

  /* 換圖標籤（mock 用）：顯示在元素旁的檔名與交付尺寸，可由 mock 工具列關閉。 */
  assetSpecs: {
    stageBg: 'stage-bg · 750×1000',
    infoBg: 'info-bg · 750×750 tile',
    share: 'icon-share · 64×64',
    periodBadge: 'period-badge · 480×64',
    chancesBadge: 'chances-badge · 360×88',
    cardFrame: 'card-frame · 120×120 (9-slice 40)',
    cardTitle: 'card-title · 400×72',
    tickerBar: 'ticker-bar · 690×64',
    btnPrimary: 'btn-primary · 400×110',
    footerDeco: 'footer-deco · 750×160',
    stageFloor: 'stage-floor · 750×140',
    title: 'title-{locale} · 690×240',
    spotlight: 'spotlight · 260×900',
    lightPool: 'light-pool · 600×220',
    stageVignette: 'stage-vignette · 750×1000',
    bulbs: 'bulb-on / bulb-off · 48×48',
    wheelFrame: 'wheel-frame · 680×680',
    pointer: 'pointer · 120×160',
    btnGo: 'btn-go · 200×200',
    wheelGloss: 'wheel-gloss · 600×600',
    wheelStand: 'wheel-stand · 400×600',
    mascot: 'mascot-{state}\n400×500 GIF',
    modalBg: 'modal-bg · 600×760',
    sound: 'icon-sound-on/off · 64×64',
    sharePreview: 'share-preview.jpg · 1200×630 (og:image)',
    rotateHint: 'icon-rotate · 160×160'
  },

  /* mock 假資料（後台沒提供 EVENT_CONTENT 時使用）。文字欄位皆為 { en, ko, th, zh }，ko/th 留空時前台顯示 en。 */
  defaultContent: {
    period: '2026/11/11 – 2026/11/30',
    freeSpins: 3,
    prizes: [
      { name: { en: 'Cash 888', ko: '현금 888', th: 'เงินสด 888', zh: '現金 888 元' }, icon: 'assets/img/icon-cash.svg', weight: 2, isLose: false },
      { name: { en: '10 Free Spins', ko: '무료 스핀 10회', th: 'ฟรีสปิน 10 ครั้ง', zh: '免費旋轉 ×10' }, icon: 'assets/img/icon-spin.svg', weight: 15, isLose: false },
      { name: { en: '20% Deposit Bonus', ko: '충전 보너스 20%', th: 'โบนัสเติมเงิน 20%', zh: '儲值加碼 20%' }, icon: 'assets/img/icon-bonus.svg', weight: 18, isLose: false },
      { name: { en: '500 Points', ko: '500 포인트', th: '500 คะแนน', zh: '積分 ×500' }, icon: 'assets/img/icon-points.svg', weight: 20, isLose: false },
      { name: { en: '100 Coins', ko: '코인 100개', th: '100 เหรียญ', zh: '金幣 ×100' }, icon: 'assets/img/icon-coin.svg', weight: 15, isLose: false },
      { name: { en: 'Mystery Gift', ko: '미스터리 선물', th: 'ของขวัญปริศนา', zh: '神秘禮物' }, icon: 'assets/img/icon-gift.svg', weight: 5, isLose: false },
      { name: { en: 'Try Again', ko: '꽝', th: 'ลองใหม่อีกครั้ง', zh: '銘謝惠顧' }, icon: 'assets/img/icon-thanks.svg', weight: 25, isLose: true }
    ],
    winners: [
      { name: 'pl***88', prize: 0 }, { name: 'ka***21', prize: 3 }, { name: 'so***07', prize: 1 },
      { name: 'ni***55', prize: 4 }, { name: 'ja***19', prize: 2 }, { name: 'ar***33', prize: 5 }
    ],
    rulesTitle: { en: 'Event Rules', ko: '이벤트 규칙', th: 'กติกากิจกรรม', zh: '活動規則' },
    rules: {
      en: [
        'Event period: 2026/11/11 – 2026/11/30.',
        'Each member gets 3 free spins during the event period.',
        'Prizes are credited to your account within 24 hours.',
        'Bonus prizes require 5x turnover before withdrawal.',
        'The organizer reserves the right to modify, suspend, or interpret this event.'
      ],
      ko: [
        '이벤트 기간: 2026/11/11 – 2026/11/30.',
        '이벤트 기간 동안 회원당 무료 3회 참여할 수 있습니다.',
        '상품은 당첨 후 24시간 이내에 계정으로 지급됩니다.',
        '보너스 상품은 출금 전 5배 롤링이 필요합니다.',
        '주최 측은 이벤트를 변경, 중단 및 최종 해석할 권리를 보유합니다.'
      ],
      th: [
        'ระยะเวลากิจกรรม: 2026/11/11 – 2026/11/30',
        'สมาชิกแต่ละท่านได้รับสิทธิ์หมุนฟรี 3 ครั้งตลอดระยะเวลากิจกรรม',
        'รางวัลจะถูกโอนเข้าบัญชีภายใน 24 ชั่วโมงหลังได้รับรางวัล',
        'รางวัลโบนัสต้องทำยอดเทิร์นโอเวอร์ 5 เท่าก่อนถอน',
        'ผู้จัดขอสงวนสิทธิ์ในการแก้ไข ระงับ และตีความกิจกรรมนี้'
      ],
      zh: [
        '活動期間：2026/11/11 – 2026/11/30。',
        '活動期間每位會員可獲得 3 次免費抽獎機會。',
        '獎項於中獎後 24 小時內發放至會員帳戶。',
        '加碼類獎項需完成 5 倍流水方可提領。',
        '主辦方保留活動修改、暫停及最終解釋之權利。'
      ]
    }
  }
};
