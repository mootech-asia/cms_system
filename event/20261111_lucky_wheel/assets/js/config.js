/*
 * 活動設定檔：換圖、改獎項、改機率都只動這個檔案。
 *
 * 轉盤方向約定（wheel-disc 圖必須照這個畫）：
 *   prizes[0] 的扇區中心在正上方（12 點鐘，指針位置），其餘依陣列順序「順時針」排列，
 *   每格角度 = 360 / prizes.length。
 *
 * showLabels：
 *   true  → 由程式把 prize.name + prize.icon 疊在扇區上（wheel-disc 只需畫底色）。
 *   false → 獎項文字、圖示已直接畫在 wheel-disc 圖裡，程式不再疊字。
 *
 * isLose：true 代表未中獎格，彈窗標題改用 loseTitle。
 *
 * weight：相對權重（不必加總為 100）。正式活動中獎結果應由後端決定，
 *   這裡的前端隨機只供 mock up 展示。
 */
window.EVENT_CONFIG = {
  title: '幸運大轉盤',
  freeSpins: 3,
  spinDurationMs: 5000,
  minFullTurns: 6,
  showLabels: true,
  winTitle: '恭喜中獎',
  loseTitle: '再接再厲',

  images: {
    bg: 'assets/img/bg.svg',
    title: 'assets/img/title.svg',
    wheelFrame: 'assets/img/wheel-frame.svg',
    wheelDisc: 'assets/img/wheel-disc.svg',
    pointer: 'assets/img/pointer.svg',
    btnGo: 'assets/img/btn-go.svg',
    btnPrimary: 'assets/img/btn-primary.svg',
    modalBg: 'assets/img/modal-bg.svg'
  },

  prizes: [
    { id: 'p1', name: '現金 888 元', icon: 'assets/img/prize-1.svg', weight: 2 },
    { id: 'p2', name: '免費旋轉 ×10', icon: 'assets/img/prize-2.svg', weight: 18 },
    { id: 'p3', name: '儲值加碼 20%', icon: 'assets/img/prize-3.svg', weight: 25 },
    { id: 'p4', name: '積分 ×500', icon: 'assets/img/prize-4.svg', weight: 30 },
    { id: 'p5', name: '銘謝惠顧', icon: 'assets/img/prize-5.svg', weight: 25, isLose: true }
  ]
};
