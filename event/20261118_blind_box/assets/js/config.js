/*
 * 拆盲盒活動的「設計面」設定：圖片槽、音效、文案、動畫時間。換圖只改這裡（或同檔名覆蓋）。
 * 獎項、規則、次數等「內容」由後台提供（格式見 ../shared/unbox-3d/js/store.js），defaultContent 是 mock。
 * 程式本體在 ../shared/unbox-3d/（與拆卡包共用）；色票在 assets/css/theme.css。
 */
window.EVENT_CONFIG = {
  type: 'blind-box',
  storageKey: 'event_20261118_blind_box',
  openMs: 1800,
  perOpenLimits: { min: 1, max: 5 },
  mockResetOpens: 10,
  /* 3D 正面與盒蓋貼圖的材質：金屬感越高顏色越暗，交付正式圖後依實際效果微調 */
  material: { metalness: 0.2, roughness: 0.35 },

  /* 換皮：skins.<名稱> = { css: '色票覆寫檔', images: { 只列跟預設不同的圖片槽 }, sounds: {}, strings: {} }，
     網址 ?skin=<名稱> 臨時切換，skin 決定預設皮。交付路徑以 skins/<名稱>/ 為基準。 */
  skin: 'default',
  skins: {},

  images: {
    stageBg: 'assets/img/scene/stage-bg.svg',
    infoBg: 'assets/img/scene/info-bg.svg',
    title: {
      en: 'assets/img/title/title-en.svg',
      ko: 'assets/img/title/title-ko.svg',
      th: 'assets/img/title/title-th.svg',
      zh: 'assets/img/title/title-zh.svg'
    },
    periodBadge: 'assets/img/ui/period-badge.svg',
    chancesBadge: 'assets/img/ui/chances-badge.svg',
    btnPrimary: 'assets/img/ui/btn-primary.svg',
    btnArrow: 'assets/img/ui/btn-arrow.svg',
    tickerBar: 'assets/img/ui/ticker-bar.svg',
    cardFrame: 'assets/img/ui/card-frame.svg',
    cardTitle: 'assets/img/ui/card-title.svg',
    footerDeco: 'assets/img/scene/footer-deco.svg',
    soundOn: 'assets/img/icon/icon-sound-on.svg',
    soundOff: 'assets/img/icon/icon-sound-off.svg',
    share: 'assets/img/icon/icon-share.svg',
    rotateHint: 'assets/img/icon/icon-rotate.svg',
    /* 3D 盲盒：正面可給 1～6 張（盲盒通常同一款）；側面與盒蓋側邊會乘上 --ev-3d-item-N 色票 */
    boxFront: ['assets/img/3d/box-front.svg'],
    boxSide: 'assets/img/3d/box-side.svg',
    boxLid: 'assets/img/3d/box-lid.svg',
    boxLidSide: 'assets/img/3d/box-lid-side.svg',
    /* 揭曉 */
    revealRays: 'assets/img/reveal/reveal-rays.svg',
    rewardBack: 'assets/img/reveal/reward-back.svg',
    rewardFrameCommon: 'assets/img/reveal/reward-frame-common.svg',
    rewardFrameRare: 'assets/img/reveal/reward-frame-rare.svg',
    rewardFrameEpic: 'assets/img/reveal/reward-frame-epic.svg',
    rewardFrameLegendary: 'assets/img/reveal/reward-frame-legendary.svg'
  },

  /* 吉祥物（熊北）：站在選中盒子後方中央，下半身被盒子擋住。每個狀態一段循環動態，全部共用同一張基準幀且長度相同（loopMs），
     程式在一輪結束時才切換。mock 暫用官方參考靜態圖縮成 400×500（loopMs 0＝立即切換），動態交付後改這裡。
     狀態：idle（挑選）、anticipate（已選定／開封中）、celebrate（揭曉有稀有以上）、lose（只開到普通）。 */
  mascot: {
    poster: 'assets/img/mascot/mock-idle.webp',
    loopMs: 0,
    idle: ['assets/img/mascot/mock-idle.webp'],
    anticipate: 'assets/img/mascot/mock-anticipate.webp',
    celebrate: 'assets/img/mascot/mock-celebrate.webp',
    lose: 'assets/img/mascot/mock-lose.webp'
  },

  /* 進站 loading 等這些圖（第一屏）載完；3D 貼圖另外等 */
  loadingImages: ['stageBg', 'title', 'periodBadge', 'chancesBadge', 'btnPrimary', 'btnArrow', 'tickerBar', 'share', 'soundOn'],

  /* 音效：留空時用 Web Audio 合成；交付音檔後填路徑即改播音檔 */
  soundLevels: { click: 0.9, move: 0.6, tear: 1, flip: 0.9, reveal: 1.2, reward: 1.4 },
  sounds: { click: '', move: '', tear: '', flip: '', reveal: '', reward: '' },

  /* 換圖標籤（mock）：檔名與交付尺寸 */
  assetSpecs: {
    stageBg: 'stage-bg · 750×1000',
    infoBg: 'info-bg · 750×750 tile',
    title: 'title-{locale} · 690×240',
    periodBadge: 'period-badge · 480×64',
    chancesBadge: 'chances-badge · 360×88',
    btnPrimary: 'btn-primary · 400×110',
    btnArrow: 'btn-arrow · 96×96',
    tickerBar: 'ticker-bar · 690×64',
    cardFrame: 'card-frame · 120×120 (9-slice 40)',
    cardTitle: 'card-title · 400×72',
    footerDeco: 'footer-deco · 750×160',
    sound: 'icon-sound-on/off · 64×64',
    share: 'icon-share · 64×64',
    rotateHint: 'icon-rotate · 160×160',
    boxFront: 'box-front · 512×512',
    boxSide: 'box-side · 512×512',
    boxLid: 'box-lid · 512×512',
    boxLidSide: 'box-lid-side · 512×80',
    revealRays: 'reveal-rays · 750×750',
    rewardBack: 'reward-back · 600×900',
    rewardFrame: 'reward-frame-{common,rare,epic,legendary} · 600×900',
    mascot: 'mascot-{state} · 400×500 (2000ms loop)',
    sharePreview: 'share-preview.png · 1200×630 (og:image)'
  },

  /* 活動文案（en/ko/th 必填；zh 只供內部預覽） */
  strings: {
    'title.alt': { en: 'Blind Box', ko: '랜덤박스', th: 'กล่องสุ่ม', zh: '拆盲盒' },
    'scene.aria': { en: 'Blind boxes. Drag to rotate.', ko: '랜덤박스. 드래그해서 돌려 보세요.', th: 'กล่องสุ่ม ลากเพื่อหมุน', zh: '可拖曳旋轉的 3D 選擇區' },
    'pick.label': { en: 'Box {n}', ko: '박스 {n}', th: 'กล่อง {n}', zh: '盲盒 {n}' },
    'chances.before': { en: 'Boxes left', ko: '남은 박스', th: 'กล่องคงเหลือ', zh: '剩餘盲盒' },
    'chances.after': { en: '', ko: '개', th: 'กล่อง', zh: '個' },
    'action.choose': { en: 'Choose this box', ko: '이 박스 선택', th: 'เลือกกล่องนี้', zh: '選擇這個盲盒' },
    'action.open': { en: 'Open the box', ko: '박스 열기', th: 'เปิดกล่อง', zh: '打開盲盒' },
    'status.ready': { en: 'Ready to reveal your surprise?', ko: '서프라이즈를 확인할 준비가 되셨나요?', th: 'พร้อมเปิดดูเซอร์ไพรส์หรือยัง?', zh: '準備好揭開驚喜了嗎？' },
    'status.opening': { en: 'Your surprise is coming…', ko: '곧 서프라이즈가 공개됩니다…', th: 'เซอร์ไพรส์กำลังจะเผยแล้ว…', zh: '驚喜即將揭曉…' },
    'reveal.title': { en: 'Box opened!', ko: '박스 오픈!', th: 'เปิดกล่องแล้ว!', zh: '盲盒打開了！' },
    'rarity.legendary': { en: 'Secret', ko: '시크릿', th: 'ซีเคร็ต', zh: '隱藏款' },
    'toast.noChances': { en: 'No boxes left', ko: '남은 박스가 없습니다', th: 'ไม่มีกล่องเหลือแล้ว', zh: '盲盒已用完' },
    'records.empty': { en: 'No boxes opened yet. Give it a try!', ko: '아직 기록이 없습니다. 박스를 열어 보세요!', th: 'ยังไม่มีประวัติ ลองเปิดกล่องดูสิ!', zh: '還沒有紀錄，開一盒試試手氣。' },
    'share.text': { en: 'Pick a blind box and reveal your surprise!', ko: '랜덤박스를 골라 서프라이즈를 확인하세요!', th: 'เลือกกล่องสุ่มแล้วเปิดดูเซอร์ไพรส์กันเลย!', zh: '來拆盲盒揭開驚喜！' }
  },

  /* mock 假資料（後台沒提供 EVENT_CONTENT 時使用）。文字欄位皆為 { en, ko, th, zh }，ko/th 留空時前台顯示 en。 */
  defaultContent: {
    updatedAt: 'mock-2026-11-18',
    period: '2026/11/18 – 2026/12/31',
    freeOpens: 3,
    perOpen: 1,
    prizes: [
      { name: { en: '50 Points', ko: '50 포인트', th: '50 คะแนน', zh: '積分 ×50' }, icon: '../20261111_lucky_wheel/assets/img/icon-points.svg', rarity: 'common', weight: 40 },
      { name: { en: '20 Coins', ko: '코인 20개', th: '20 เหรียญ', zh: '金幣 ×20' }, icon: '../20261111_lucky_wheel/assets/img/icon-coin.svg', rarity: 'common', weight: 30 },
      { name: { en: '3 Free Spins', ko: '무료 스핀 3회', th: 'ฟรีสปิน 3 ครั้ง', zh: '免費旋轉 ×3' }, icon: '../20261111_lucky_wheel/assets/img/icon-spin.svg', rarity: 'rare', weight: 16 },
      { name: { en: '10% Deposit Bonus', ko: '충전 보너스 10%', th: 'โบนัสเติมเงิน 10%', zh: '儲值加碼 10%' }, icon: '../20261111_lucky_wheel/assets/img/icon-bonus.svg', rarity: 'rare', weight: 8 },
      { name: { en: 'Mystery Gift', ko: '미스터리 선물', th: 'ของขวัญปริศนา', zh: '神秘禮物' }, icon: '../20261111_lucky_wheel/assets/img/icon-gift.svg', rarity: 'epic', weight: 5 },
      { name: { en: 'Cash 888', ko: '현금 888', th: 'เงินสด 888', zh: '現金 888 元' }, icon: '../20261111_lucky_wheel/assets/img/icon-cash.svg', rarity: 'legendary', weight: 2 }
    ],
    winners: [
      { name: 'pl***88', prize: 5 }, { name: 'ka***21', prize: 4 }, { name: 'so***07', prize: 3 },
      { name: 'ni***55', prize: 2 }, { name: 'ja***19', prize: 4 }, { name: 'ar***33', prize: 3 }
    ],
    rulesTitle: { en: 'Event Rules', ko: '이벤트 규칙', th: 'กติกากิจกรรม', zh: '活動規則' },
    rules: {
      en: [
        'Event period: 2026/11/18 – 2026/12/31.',
        'Each member gets 3 free blind boxes during the event period.',
        'Each box contains 1 prize. Prizes are credited within 24 hours.',
        'Bonus prizes require 5x turnover before withdrawal.',
        'The organizer reserves the right to modify, suspend, or interpret this event.'
      ],
      ko: [
        '이벤트 기간: 2026/11/18 – 2026/12/31.',
        '이벤트 기간 동안 회원당 무료 랜덤박스 3개를 받을 수 있습니다.',
        '박스 1개에 상품 1개가 들어 있으며, 상품은 24시간 이내에 지급됩니다.',
        '보너스 상품은 출금 전 5배 롤링이 필요합니다.',
        '주최 측은 이벤트를 변경, 중단 및 최종 해석할 권리를 보유합니다.'
      ],
      th: [
        'ระยะเวลากิจกรรม: 2026/11/18 – 2026/12/31',
        'สมาชิกแต่ละท่านได้รับกล่องสุ่มฟรี 3 กล่องตลอดระยะเวลากิจกรรม',
        'แต่ละกล่องมีรางวัล 1 ชิ้น รางวัลจะถูกโอนเข้าบัญชีภายใน 24 ชั่วโมง',
        'รางวัลโบนัสต้องทำยอดเทิร์นโอเวอร์ 5 เท่าก่อนถอน',
        'ผู้จัดขอสงวนสิทธิ์ในการแก้ไข ระงับ และตีความกิจกรรมนี้'
      ],
      zh: [
        '活動期間：2026/11/18 – 2026/12/31。',
        '活動期間每位會員可獲得 3 個免費盲盒。',
        '每盒含 1 個獎品，獎項於 24 小時內發放至會員帳戶。',
        '加碼類獎項需完成 5 倍流水方可提領。',
        '主辦方保留活動修改、暫停及最終解釋之權利。'
      ]
    }
  }
};
