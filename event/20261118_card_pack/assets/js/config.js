/*
 * 拆卡包活動的「設計面」設定：圖片槽、音效、文案、動畫時間。換圖只改這裡（或同檔名覆蓋）。
 * 獎項、規則、次數等「內容」由後台提供（格式見 ../shared/unbox-3d/js/store.js），defaultContent 是 mock。
 * 程式本體在 ../shared/unbox-3d/（與拆盲盒共用）；色票在 assets/css/theme.css。
 */
window.EVENT_CONFIG = {
  type: 'card-pack',
  storageKey: 'event_20261118_card_pack',
  openMs: 1800,
  /* 每包開出幾張卡：一次只拆一包、每包 1 張 */
  perOpenLimits: { min: 1, max: 1 },
  mockResetOpens: 10,
  /* 3D 正面貼圖的材質：金屬感越高顏色越暗，交付正式圖後依實際效果微調 */
  material: { metalness: 0.2, roughness: 0.35 },
  /* 整個 3D 環形（包裝、間距、吉祥物）的縮放倍率 */
  sceneScale: 1.5,

  /* 換皮：skins.<名稱> = { css: '色票覆寫檔', images: { 只列跟預設不同的圖片槽 }, sounds: {}, strings: {} }，
     網址 ?skin=<名稱> 臨時切換，skin 決定預設皮。交付路徑以 skins/<名稱>/ 為基準。 */
  skin: 'default',
  skins: {},

  images: {
    atmosphereSprite: 'assets/img/scene/atmosphere.webp?v=20261118-jewel1',
    folioHeader: 'assets/img/ui/folio-header.webp?v=20261118-jewel1',
    stageBg: 'assets/img/scene/stage-bg.webp?v=20261118-jewel1',
    infoBg: 'assets/img/scene/info-bg.svg?v=20261118-jewel1',
    title: {
      en: 'assets/img/title/title-en.webp?v=20261118-jewel1',
      ko: 'assets/img/title/title-ko.webp?v=20261118-jewel1',
      th: 'assets/img/title/title-th.webp?v=20261118-jewel1',
      zh: 'assets/img/title/title-main.webp?v=20261118-jewel1'
    },
    periodBadge: 'assets/img/ui/period-badge.svg?v=20261118-jewel1',
    chancesBadge: 'assets/img/ui/chances-badge.webp?v=20261118-jewel1',
    btnPrimary: 'assets/img/ui/btn-primary.webp?v=20261118-jewel1',
    btnArrow: 'assets/img/ui/btn-arrow.webp?v=20261118-jewel1',
    tickerBar: 'assets/img/ui/ticker-bar.webp?v=20261118-jewel1',
    cardFrame: 'assets/img/ui/card-frame.svg?v=20261118-jewel1',
    cardTitle: 'assets/img/ui/card-title.svg?v=20261118-jewel1',
    footerDeco: 'assets/img/scene/footer-deco.svg?v=20261118-jewel1',
    soundOn: 'assets/img/icon/icon-sound-on.svg?v=20261118-jewel1',
    soundOff: 'assets/img/icon/icon-sound-off.svg?v=20261118-jewel1',
    share: 'assets/img/icon/icon-share.svg?v=20261118-jewel1',
    rotateHint: 'assets/img/icon/icon-rotate.svg?v=20261118-jewel1',
    tapHint: 'assets/img/icon/icon-tap.svg?v=20261118-jewel1',
    /* 3D 卡包：正面可給 1～6 張不同設計，環上六包依序輪流；側邊與封條會乘上 --ev-3d-item-N 色票 */
    packFront: ['assets/img/3d/pack-front-1.webp?v=20261118-jewel1', 'assets/img/3d/pack-front-2.webp?v=20261118-jewel1', 'assets/img/3d/pack-front-3.webp?v=20261118-jewel1'],
    packBack: 'assets/img/3d/pack-back.webp?v=20261118-jewel1',
    packCrimp: 'assets/img/3d/pack-crimp.svg?v=20261118-jewel1',
    /* 揭曉 */
    revealRays: 'assets/img/reveal/reveal-rays.svg?v=20261118-jewel1',
    rewardBack: 'assets/img/reveal/reward-back.webp?v=20261118-jewel1',
    rewardFrameCommon: 'assets/img/reveal/reward-front.webp?v=20261118-jewel1',
    rewardFrameRare: 'assets/img/reveal/reward-front.webp?v=20261118-jewel1',
    rewardFrameEpic: 'assets/img/reveal/reward-front.webp?v=20261118-jewel1',
    rewardFrameLegendary: 'assets/img/reveal/reward-front.webp?v=20261118-jewel1'
  },

  /* 進站 loading 等這些圖（第一屏）載完；3D 貼圖另外等 */
  loadingImages: ['atmosphereSprite', 'stageBg', 'title', 'periodBadge', 'chancesBadge', 'tapHint', 'btnPrimary', 'btnArrow', 'tickerBar', 'share', 'soundOn'],

  /* 音效：留空時用 Web Audio 合成；交付音檔後填路徑即改播音檔 */
  soundLevels: { click: 0.9, move: 0.6, tear: 1, flip: 0.9, reveal: 1.2, reward: 1.4 },
  sounds: { click: 'assets/audio/click.mp3', move: 'assets/audio/move.mp3', tear: 'assets/audio/tear.mp3', flip: 'assets/audio/flip.mp3', reveal: 'assets/audio/reveal.mp3', reward: 'assets/audio/reward.mp3' },

  /* 換圖標籤（mock）：檔名與交付尺寸 */
  assetSpecs: {
    atmosphereSprite: 'atmosphere · 640×454',
    folioHeader: 'folio-header · 900×300',
    stageBg: 'stage-bg · 750×1000',
    infoBg: 'info-bg · 750×750 tile',
    title: 'title-{locale} · 690×240',
    periodBadge: 'period-badge · 480×64',
    chancesBadge: 'chances-badge · 630×210',
    btnPrimary: 'btn-primary · 900×270',
    btnArrow: 'btn-arrow · 192×192',
    tickerBar: 'ticker-bar · 1000×180',
    cardFrame: 'card-frame · 120×120 (9-slice 40)',
    cardTitle: 'card-title · 400×72',
    footerDeco: 'footer-deco · 750×160',
    sound: 'icon-sound-on/off · 64×64',
    share: 'icon-share · 64×64',
    rotateHint: 'icon-rotate · 160×160',
    tapHint: 'icon-tap · 160×160',
    packFront: 'pack-front-1~3 · 512×768',
    packBack: 'pack-back · 512×768',
    packCrimp: 'pack-crimp · 512×64',
    revealRays: 'reveal-rays · 750×750',
    rewardBack: 'reward-back · 600×900',
    rewardFrame: 'reward-frame-{common,rare,epic,legendary} · 600×900',
    sharePreview: 'share-preview.jpg · 1200×630 (og:image)'
  },

  /* 活動文案（en/ko/th 必填；zh 只供內部預覽） */
  strings: {
    'title.alt': { en: 'Cosmic Magic Card Pack', ko: '신비한 우주 마법 카드팩', th: 'ซองการ์ดเวทมนตร์มหัศจรรย์จักรวาล', zh: '宇宙神奇魔幻卡包' },
    'scene.aria': { en: 'Card packs. Drag to rotate.', ko: '카드팩. 드래그해서 돌려 보세요.', th: 'ซองการ์ด ลากเพื่อหมุน', zh: '可拖曳旋轉的 3D 選擇區' },
    'pick.label': { en: 'Pack {n}', ko: '팩 {n}', th: 'ซอง {n}', zh: '卡包 {n}' },
    'chances.before': { en: 'Packs left', ko: '남은 카드팩', th: 'ซองคงเหลือ', zh: '剩餘卡包' },
    'chances.after': { en: '', ko: '개', th: 'ซอง', zh: '包' },
    'action.choose': { en: 'Choose this pack', ko: '이 카드팩 선택', th: 'เลือกซองนี้', zh: '選擇這包卡片' },
    'action.open': { en: 'Tear it open', ko: '카드팩 뜯기', th: 'ฉีกซอง', zh: '撕開卡包' },
    'hint.pick': { en: 'Tap any pack to choose it', ko: '카드팩을 눌러 선택하세요', th: 'แตะซองไหนก็ได้เพื่อเลือก', zh: '點選任意一包卡包' },
    'status.select': { en: 'Drag left or right to browse the other packs.', ko: '좌우로 드래그해서 다른 카드팩도 둘러보세요.', th: 'ลากซ้ายขวาเพื่อดูซองอื่น', zh: '左右拖曳可以瀏覽其他卡包' },
    'status.ready': { en: 'Swipe across the seal, or tap the button to tear it open.', ko: '봉인을 좌우로 밀거나 버튼을 눌러 뜯으세요.', th: 'ปัดผ่านรอยปิดผนึก หรือแตะปุ่มเพื่อฉีกซอง', zh: '沿著封條左右滑動，或按下方按鈕拆開' },
    'status.opening': { en: 'Seal torn. Let\'s see what you got…', ko: '봉인을 뜯었습니다. 무엇이 나왔을까요…', th: 'ฉีกซองแล้ว มาดูกันว่าได้อะไร…', zh: '封條已撕開，看看你的收藏…' },
    'reveal.title': { en: 'Pack opened!', ko: '카드팩 오픈!', th: 'เปิดซองแล้ว!', zh: '卡包打開了！' },
    'toast.noChances': { en: 'No packs left', ko: '남은 카드팩이 없습니다', th: 'ไม่มีซองเหลือแล้ว', zh: '卡包已用完' },
    'records.empty': { en: 'No packs opened yet. Give it a try!', ko: '아직 기록이 없습니다. 카드팩을 열어 보세요!', th: 'ยังไม่มีประวัติ ลองเปิดซองดูสิ!', zh: '還沒有紀錄，拆一包試試手氣。' },
    'share.text': { en: 'Open a card pack and collect rare cards!', ko: '카드팩을 열고 레어 카드를 모아 보세요!', th: 'เปิดซองการ์ดแล้วสะสมการ์ดหายากกันเลย!', zh: '來拆卡包收集稀有卡！' }
  },

  /* mock 假資料（後台沒提供 EVENT_CONTENT 時使用）。文字欄位皆為 { en, ko, th, zh }，ko/th 留空時前台顯示 en。 */
  defaultContent: {
    updatedAt: 'mock-2026-11-18',
    period: '2026/11/18 – 2026/12/31',
    freeOpens: 5,
    perOpen: 1,
    prizes: [
      { name: { en: '50 Points', ko: '50 포인트', th: '50 คะแนน', zh: '積分 ×50' }, icon: '../20261111_lucky_wheel/assets/img/icon-points.svg', rarity: 'common', weight: 40 },
      { name: { en: '20 Coins', ko: '코인 20개', th: '20 เหรียญ', zh: '金幣 ×20' }, icon: '../20261111_lucky_wheel/assets/img/icon-coin.svg', rarity: 'common', weight: 30 },
      { name: { en: '3 Free Spins', ko: '무료 스핀 3회', th: 'ฟรีสปิน 3 ครั้ง', zh: '免費旋轉 ×3' }, icon: '../20261111_lucky_wheel/assets/img/icon-spin.svg', rarity: 'rare', weight: 16 },
      { name: { en: '10% Deposit Bonus', ko: '충전 보너스 10%', th: 'โบนัสเติมเงิน 10%', zh: '儲值加碼 10%' }, icon: '../20261111_lucky_wheel/assets/img/icon-bonus.svg', rarity: 'rare', weight: 8 },
      { name: { en: 'Mystery Gift', ko: '미스터리 선물', th: 'ของขวัญปริศนา', zh: '神秘禮物' }, icon: '../20261111_lucky_wheel/assets/img/icon-gift.svg', rarity: 'epic', weight: 5 },
      { name: { en: 'Cash 888', ko: '현금 888', th: 'เงินสด 888', zh: '現金 888 元' }, icon: '../20261111_lucky_wheel/assets/img/icon-cash.svg', rarity: 'legendary', weight: 1 }
    ],
    winners: [
      { name: 'pl***88', prize: 5 }, { name: 'ka***21', prize: 4 }, { name: 'so***07', prize: 3 },
      { name: 'ni***55', prize: 2 }, { name: 'ja***19', prize: 4 }, { name: 'ar***33', prize: 3 }
    ],
    rulesTitle: { en: 'Event Rules', ko: '이벤트 규칙', th: 'กติกากิจกรรม', zh: '活動規則' },
    rules: {
      en: [
        'Event period: 2026/11/18 – 2026/12/31.',
        'Each member gets 5 free card packs during the event period.',
        'Each pack contains 1 card. Prizes are credited within 24 hours.',
        'Bonus prizes require 5x turnover before withdrawal.',
        'The organizer reserves the right to modify, suspend, or interpret this event.'
      ],
      ko: [
        '이벤트 기간: 2026/11/18 – 2026/12/31.',
        '이벤트 기간 동안 회원당 무료 카드팩 5개를 받을 수 있습니다.',
        '카드팩 1개에 카드 1장이 들어 있으며, 상품은 24시간 이내에 지급됩니다.',
        '보너스 상품은 출금 전 5배 롤링이 필요합니다.',
        '주최 측은 이벤트를 변경, 중단 및 최종 해석할 권리를 보유합니다.'
      ],
      th: [
        'ระยะเวลากิจกรรม: 2026/11/18 – 2026/12/31',
        'สมาชิกแต่ละท่านได้รับซองการ์ดฟรี 5 ซองตลอดระยะเวลากิจกรรม',
        'แต่ละซองมีการ์ด 1 ใบ รางวัลจะถูกโอนเข้าบัญชีภายใน 24 ชั่วโมง',
        'รางวัลโบนัสต้องทำยอดเทิร์นโอเวอร์ 5 เท่าก่อนถอน',
        'ผู้จัดขอสงวนสิทธิ์ในการแก้ไข ระงับ และตีความกิจกรรมนี้'
      ],
      zh: [
        '活動期間：2026/11/18 – 2026/12/31。',
        '活動期間每位會員可獲得 5 包免費卡包。',
        '每包含 1 張卡，獎項於 24 小時內發放至會員帳戶。',
        '加碼類獎項需完成 5 倍流水方可提領。',
        '主辦方保留活動修改、暫停及最終解釋之權利。'
      ]
    }
  }
};
