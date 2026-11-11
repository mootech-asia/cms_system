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

  images: {
    stageBg: 'assets/img/stage-bg.svg',
    stageBgDesktop: 'assets/img/stage-bg-desktop.svg',
    infoBg: 'assets/img/info-bg.svg',
    stageFloor: 'assets/img/stage-floor.svg',
    title: {
      en: 'assets/img/title-en.svg',
      ko: 'assets/img/title-ko.svg',
      th: 'assets/img/title-th.svg',
      zh: 'assets/img/title-zh.svg'
    },
    spotlight: 'assets/img/spotlight.svg',
    wheelFrame: 'assets/img/wheel-frame.svg',
    wheelGloss: 'assets/img/wheel-gloss.svg',
    pointer: 'assets/img/pointer.svg',
    btnGo: 'assets/img/btn-go.svg',
    btnPrimary: 'assets/img/btn-primary.svg',
    modalBg: 'assets/img/modal-bg.svg',
    soundOn: 'assets/img/icon-sound-on.svg',
    soundOff: 'assets/img/icon-sound-off.svg',
    share: 'assets/img/icon-share.svg',
    periodBadge: 'assets/img/period-badge.svg',
    chancesBadge: 'assets/img/chances-badge.svg',
    cardFrame: 'assets/img/card-frame.svg',
    cardTitle: 'assets/img/card-title.svg',
    footerDeco: 'assets/img/footer-deco.svg'
  },

  /* 吉祥物：每個狀態一個循環 GIF；idle 會在多張之間輪播。 */
  mascot: {
    idle: [
      'assets/img/mascot/idle-1.gif',
      'assets/img/mascot/idle-2.gif',
      'assets/img/mascot/idle-3.gif'
    ],
    spinning: 'assets/img/mascot/spinning.gif',
    result: 'assets/img/mascot/result.gif'
  },

  /* 音效：留空時用 Web Audio 即時合成鼓聲；交付音檔後填路徑即改播音檔。 */
  sounds: {
    drumroll: '',
    win: '',
    lose: ''
  },

  /* 換圖標籤（mock 用）：顯示在元素旁的檔名與交付尺寸，可由 mock 工具列關閉。 */
  assetSpecs: {
    stageBg: 'stage-bg · 750×1000',
    stageBgDesktop: 'stage-bg-desktop · 1920×1000 (>=768px)',
    infoBg: 'info-bg · 750×750 tile',
    share: 'icon-share · 64×64',
    periodBadge: 'period-badge · 480×64',
    chancesBadge: 'chances-badge · 360×88',
    cardFrame: 'card-frame · 120×120 (9-slice 40)',
    cardTitle: 'card-title · 400×72',
    footerDeco: 'footer-deco · 750×160',
    stageFloor: 'stage-floor · 750×140',
    title: 'title-{locale} · 690×240',
    spotlight: 'spotlight · 260×900',
    wheelFrame: 'wheel-frame · 680×680',
    pointer: 'pointer · 120×160',
    btnGo: 'btn-go · 200×200',
    wheelGloss: 'wheel-gloss · 600×600',
    mascot: 'mascot-{state}\n400×500 GIF',
    modalBg: 'modal-bg · 600×760',
    btnPrimary: 'btn-primary · 400×110',
    sound: 'icon-sound-on/off · 64×64',
    sharePreview: 'share-preview.png · 1200×630 (og:image)'
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
