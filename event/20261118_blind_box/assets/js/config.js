/*
 * 拆盲盒活動的「設計面」設定：圖片槽、音效、文案、動畫時間。換圖只改這裡（或同檔名覆蓋）。
 * 獎項、規則、次數等「內容」由後台提供（格式見 ../shared/unbox-3d/js/store.js），defaultContent 是 mock。
 * 程式本體在 ../shared/unbox-3d/（與拆卡包共用）；色票在 assets/css/theme.css。
 */
window.EVENT_CONFIG = {
  type: 'blind-box',
  storageKey: 'event_20261118_blind_box',
  openMs: 1800,
  retryEmpty: { en: 'Try Again', ko: '다시 도전', th: 'ลองอีกครั้ง', zh: '再來一次' },
  perOpenLimits: { min: 1, max: 5 },
  mockResetOpens: 10,
  /* 3D 正面與盒蓋貼圖的材質：金屬感越高顏色越暗，交付正式圖後依實際效果微調 */
  material: { metalness: 0.2, roughness: 0.35 },
  /* 整個 3D 環形（包裝、間距、吉祥物）的縮放倍率 */
  sceneScale: 1,
  /* 3D 外型：'chest'＝圓拱蓋寶箱（蓋子沿後緣掀開）；不填＝方盒 */
  sceneArt: { height: 1125, horizonFromBottom: 660, horizonFraction: .5 },
  atmosphereMode: 'petals-and-sand',
  mascot: {
    poster: 'assets/img/mascot/spirit/poster.webp?v=20261119-hd-motion',
    motion: 'assets/js/spirit-motion.js?v=20261119-four-poses',
    loopMs: 2000, layout: 'hero'
  },
  shape: 'chest',

  /* 換皮：skins.<名稱> = { css: '色票覆寫檔', images: { 只列跟預設不同的圖片槽 }, sounds: {}, strings: {} }，
     網址 ?skin=<名稱> 臨時切換，skin 決定預設皮。交付路徑以 skins/<名稱>/ 為基準。 */
  skin: 'default',
  skins: {},

  images: {
    statusBadges: '../shared/unbox-3d/img/status-badges.webp?v=20261119-badge1',
    treasurePlinth: 'assets/img/ui/treasure-plinth.webp?v=20261119-plinth1',
    loadingEmblem: 'assets/img/ui/loading-emblem.webp?v=20261118-loading1',
    toolMedallion: 'assets/img/ui/tool-medallion.webp?v=20261118-refine2',
    atmosphereSprite: 'assets/img/scene/atmosphere.webp?v=20261118-refine2',
    folioHeader: 'assets/img/ui/panel-crown.webp?v=20261118-refine2',
    depthDesert: 'assets/img/scene/open-desert.webp?v=20261119-restore-spirit',
    depthFloor: 'assets/img/scene/open-desert.webp?v=20261119-restore-spirit',
    stageBg: 'assets/img/scene/open-desert.webp?v=20261119-restore-spirit',
    infoBg: 'assets/img/scene/info-bg.svg?v=20261118-refine2',
    title: {
      en: 'assets/img/title/title-en.webp?v=20261118-refine2',
      ko: 'assets/img/title/title-ko.webp?v=20261118-refine2',
      th: 'assets/img/title/title-th.webp?v=20261118-refine2',
      zh: 'assets/img/title/title-main.webp?v=20261118-refine2'
    },
    periodBadge: 'assets/img/ui/period-badge.webp?v=20261118-refine2',
    chancesBadge: 'assets/img/ui/chances-badge.webp?v=20261118-refine2',
    btnPrimary: 'assets/img/ui/btn-primary.webp?v=20261118-refine2',
    btnArrow: '../shared/buttons/img/arrow-frame.webp',
    tickerBar: 'assets/img/ui/ticker-bar.webp?v=20261118-refine2',
    cardFrame: 'assets/img/ui/card-frame.svg?v=20261118-refine2',
    cardTitle: 'assets/img/ui/card-title.svg?v=20261118-refine2',
    footerDeco: 'assets/img/scene/footer-deco.svg?v=20261118-refine2',
    soundOn: '../shared/buttons/img/icon-sound-on.webp',
    soundOff: '../shared/buttons/img/icon-sound-off.webp',
    share: '../shared/buttons/img/icon-share.webp',
    rotateHint: 'assets/img/icon/icon-rotate.svg?v=20261118-refine2',
    tapHint: 'assets/img/icon/icon-tap.svg?v=20261118-refine2',
    /* 3D 寶箱（shape: 'chest'）：正面可給 1～6 張（環上六箱依序輪流）；側面／背面保留原始黃金材質，
       拱蓋與兩端半圓保留原色。 */
    boxFront: ['assets/img/3d/chest-front.webp?v=20261118-refine2'],
    boxInterior: 'assets/img/3d/chest-interior.webp?v=20261118-refine2',
    boxSide: 'assets/img/3d/chest-side.webp?v=20261118-refine2',
    boxLid: 'assets/img/3d/chest-lid.webp?v=20261118-refine2',
    boxLidSide: 'assets/img/3d/chest-lid.webp?v=20261118-refine2',
    /* 揭曉 */
    revealRays: 'assets/img/reveal/sand-vortex.webp?v=20261119-hd-motion',
    revealVortex: 'assets/img/reveal/sand-vortex.webp?v=20261119-hd-motion',
    rewardBack: 'assets/img/reveal/reward-back.svg?v=20261118-refine2',
    rewardFrameCommon: 'assets/img/reveal/reward-frame-common.svg?v=20261118-refine2',
    rewardFrameRare: 'assets/img/reveal/reward-frame-rare.svg?v=20261118-refine2',
    rewardFrameEpic: 'assets/img/reveal/reward-frame-epic.svg?v=20261118-refine2',
    rewardFrameLegendary: 'assets/img/reveal/reward-frame-legendary.svg?v=20261118-refine2'
  },

  /* 進站 loading 等這些圖（第一屏）載完；3D 貼圖另外等 */
  loadingImages: ['depthDesert', 'depthFloor', 'loadingEmblem', 'toolMedallion', 'atmosphereSprite', 'stageBg', 'title', 'periodBadge', 'chancesBadge', 'tapHint', 'btnPrimary', 'btnArrow', 'tickerBar', 'share', 'soundOn'],

  /* 音效：名稱與規格見 docs/AUDIO_REQUEST.md；留空的用 Web Audio 合成（背景音樂沒有合成版，未交付就不播）。
     音量 0～1（bgmDuck＝開封與揭曉期間的背景音樂音量）。 */
  soundLevels: { hover: 0.7, select: 0.8, bgm: 0.35, bgmDuck: 0.1, empty: 0.85, move: 0.45, tear: 0.8, flip: 0.9, reveal: 1.2, 'reveal-common': 1, 'reveal-rare': 1, 'reveal-epic': 1, 'reveal-legendary': 1, error: 0.8 },
  sounds: { hover: '../20261111_survival_spin/assets/audio/hover.mp3', select: 'assets/audio/select.mp3?v=20261119-select-cue', empty: 'assets/audio/empty.mp3?v=20261119-seal1', move: 'assets/audio/move.mp3?v=20261119-seal1', tear: 'assets/audio/open.wav?v=20261119-rarity2', flip: '', reveal: '', bgm: 'assets/audio/bgm.mp3?v=20261119-seal1', 'reveal-common': 'assets/audio/reveal-basic.wav?v=20261119-rarity2', 'reveal-rare': 'assets/audio/reveal-basic.wav?v=20261119-rarity2', 'reveal-epic': 'assets/audio/reveal-epic.mp3?v=20261119-seal1', 'reveal-legendary': 'assets/audio/reveal-legendary.mp3?v=20261119-seal1', error: 'assets/audio/error.mp3?v=20261119-seal1' },

  /* 換圖標籤（mock）：檔名與交付尺寸 */
  assetSpecs: {
    statusBadges: 'status-badges · 1536×1024 / 2 themes',
    depthDesert: 'depth-desert · 750×1125',
    depthFloor: 'depth-floor · 750×1125',
    loadingEmblem: 'loading-emblem · 480×480',
    boxInterior: 'chest-interior · 512×352',
    toolMedallion: 'tool-medallion · 160×160',
    atmosphereSprite: 'atmosphere · 900×300',
    folioHeader: 'panel-crown · 900×300',
    stageBg: 'stage-bg · 750×1000',
    infoBg: 'info-bg · 750×750 tile',
    title: 'title-{locale} · 690×240',
    periodBadge: 'period-badge · 900×150',
    chancesBadge: 'chances-badge · 630×210',
    btnPrimary: 'btn-primary · 900×270',
    btnArrow: '../shared/buttons/img/arrow-frame.webp',
    tickerBar: 'ticker-bar · 1000×180',
    cardFrame: 'card-frame · 120×120 (9-slice 40)',
    cardTitle: 'card-title · 400×72',
    footerDeco: 'footer-deco · 750×160',
    sound: 'icon-sound-on/off · 64×64',
    share: '../shared/buttons/img/icon-share.webp',
    rotateHint: 'icon-rotate · 160×160',
    tapHint: 'icon-tap · 160×160',
    boxFront: 'chest-front · 640×400',
    boxSide: 'chest-side · 512×320',
    boxLid: 'chest-lid · 512×512',
    boxLidSide: 'chest-lid · 512×512',
    revealVortex: 'sand-vortex · 1254×1254 / 12 fps',
    rewardBack: 'reward-back · 600×900',
    rewardFrame: 'reward-frame-{common,rare,epic,legendary} · 600×900',
    sharePreview: 'share-preview.jpg · 1200×630 (og:image)'
  },

  /* 活動文案（en/ko/th 必填；zh 只供內部預覽） */
  strings: {
    'loading.scene': {"en": "Unveiling the desert treasure", "ko": "사막의 보물을 준비하고 있어요", "th": "กำลังเผยขุมทรัพย์แห่งทะเลทราย", "zh": "沙漠寶藏即將揭曉"},
    'title.alt': { en: 'Desert Genie’s Gift', ko: '사막 정령의 선물', th: 'ของขวัญจากภูตทะเลทราย', zh: '沙漠精靈的贈禮' },
    'scene.aria': { en: 'Blind boxes. Drag to rotate.', ko: '랜덤박스. 드래그해서 돌려 보세요.', th: 'กล่องสุ่ม ลากเพื่อหมุน', zh: '可拖曳旋轉的 3D 選擇區' },
    'pick.label': { en: 'Box {n}', ko: '박스 {n}', th: 'กล่อง {n}', zh: '盲盒 {n}' },
    'chances.before': { en: 'Boxes left', ko: '남은 박스', th: 'กล่องคงเหลือ', zh: '剩餘盲盒' },
    'chances.after': { en: '', ko: '개', th: 'กล่อง', zh: '個' },
    'action.choose': { en: 'Choose this box', ko: '이 박스 선택', th: 'เลือกกล่องนี้', zh: '選擇這個盲盒' },
    'action.open': { en: 'Open the box', ko: '박스 열기', th: 'เปิดกล่อง', zh: '打開盲盒' },
    'hint.swipeUp': { en: 'Swipe up', ko: '위로 밀기', th: 'ปัดขึ้น', zh: '向上滑動' },
    'hint.pick': { en: 'Tap any box to choose it', ko: '박스를 눌러 선택하세요', th: 'แตะกล่องไหนก็ได้เพื่อเลือก', zh: '點選任意一個盲盒' },
    'status.select': { en: 'Drag left or right to browse the other boxes.', ko: '좌우로 드래그해서 다른 박스도 둘러보세요.', th: 'ลากซ้ายขวาเพื่อดูกล่องอื่น', zh: '左右拖曳可以瀏覽其他盲盒' },
    'status.ready': { en: 'Swipe up on the chest, or tap below to open it.', ko: '상자를 위로 밀거나 아래 버튼을 눌러 여세요.', th: 'ปัดหีบขึ้น หรือแตะปุ่มด้านล่างเพื่อเปิด', zh: '在寶箱上向上滑動，或點下方按鈕開啟。' },
    'status.opening': { en: 'Your surprise is coming…', ko: '곧 서프라이즈가 공개됩니다…', th: 'เซอร์ไพรส์กำลังจะเผยแล้ว…', zh: '驚喜即將揭曉…' },
    'reveal.next': { en: 'Next treasure', ko: '다음 보물', th: 'สมบัติชิ้นถัดไป', zh: '下一件寶物' },
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
      { name: { en: 'Cash 888', ko: '현금 888', th: 'เงินสด 888', zh: '現金 888 元' }, icon: '../20261111_lucky_wheel/assets/img/icon-cash.svg', rarity: 'legendary', weight: 2 },
      { type: 'empty', name: { en: 'Try Again', ko: '다시 도전', th: 'ลองอีกครั้ง', zh: '再來一次' }, icon: '', weight: 15 }
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
