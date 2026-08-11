/**
 * CMS_前台_v1.5 — 靜態假資料層。
 * 對照來源 cms-customer-frontend-theme-purple 的 locales/ko.json、en.json
 * (文案逐字保留)與各 store/composable 原本會打 API 拿的內容,這裡改成
 * 寫死的假資料,讓純 HTML+CSS+JS 版可以離線展示完整畫面與互動。
 * 預設語系 = ko(對照 nuxt.config.ts defaultLocale: 'ko')。
 */
(function (window) {
  'use strict';

  var I18N = {
    ko: {
      'navbar.top.hotGames': '인기 게임',
      'navbar.top.miniGames': '미니 게임',
      'navbar.top.sports': '스포츠',
      'navbar.top.liveCasino': '라이브 카지노',
      'navbar.top.slots': '슬롯',
      'navbar.top.fish': '낚시',
      'navbar.bottom.withdrawal': '출금',
      'navbar.bottom.account': '계정',
      'navbar.bottom.bettingRecords': '베팅 기록',
      'navbar.desktop.home': '홈',
      'navbar.desktop.hotGames': '인기 게임',
      'navbar.desktop.sports': '스포츠',
      'navbar.desktop.live': '라이브',
      'navbar.desktop.slots': '슬롯',
      'navbar.desktop.fish': '낚시',
      'navbar.desktop.miniGames': '미니 게임',
      'navbar.desktop.promotion': '프로모션',
      'navbar.balance': '잔액:',
      'navbar.points': '포인트:',
      'userCenter.deposit': '입금',
      'userCenter.withdrawal': '출금',
      'userCenter.myAccount': '나의 계정',
      'footer.desc': '도박은 중독성이 있을 수 있으니 책임감 있게 플레이해 주세요. 지원 방법에 대한 자세한 내용은 책임감 있는 도박 도움말 페이지를 참조하세요.',
      'footer.desc2': '이 사이트에 접속, 지속적인 사용 또는 탐색을 통해 특정 브라우저 쿠키를 사용하여 고객 경험을 개선할 수 있음을 동의합니다.',
      'footer.copyright': '저작권 © win10096 모든 권리 보유.',
      'bottomNavbar.home': '홈',
      'bottomNavbar.deposit': '입금',
      'bottomNavbar.promotion': '프로모션',
      'bottomNavbar.member': '회원센터',
      'auth.login': '로그인',
      'auth.register': '회원가입',
      'hotGame.seeAll': '전체 보기',
      'hotGame.playNow': '지금 플레이',
      'hotGame.promo': '프로모션',
      'gameType.types.hotGames': '인기 게임',
      'gameType.types.miniGames': '미니 게임',
      'gameType.types.slots': '슬롯 게임',
      'gameType.types.liveCasino': '라이브 카지노',
      'gameType.types.sports': '스포츠',
      'gameType.types.fish': '낚시',
      'common.next': '다음',
      'common.back': '이전',
      'userCenter.sidebar.gameLobby': '게임 로비',
      'userCenter.sidebar.accountOverview': '나의 계정',
      'userCenter.sidebar.bettingRecord': '베팅 기록',
      'userCenter.sidebar.depositRecord': '입금 기록',
      'userCenter.sidebar.profitAndLoss': '손익',
      'userCenter.sidebar.withdrawalRecord': '출금 기록',
      'userCenter.sidebar.withdrawalDetail': '출금 상세 정보',
      'userCenter.sidebar.accountRecord': '계정 기록',
      'userCenter.sidebar.personalInfo': '개인 정보',
      'userCenter.sidebar.securityCenter': '보안 센터',
      'userCenter.sidebar.customerService': '고객센터',
    },
    en: {
      'navbar.top.hotGames': 'Hot Games',
      'navbar.top.miniGames': 'Mini Games',
      'navbar.top.sports': 'Sports',
      'navbar.top.liveCasino': 'Live Casino',
      'navbar.top.slots': 'Slots',
      'navbar.top.fish': 'Fish',
      'navbar.bottom.withdrawal': 'Withdrawal',
      'navbar.bottom.account': 'Account',
      'navbar.bottom.bettingRecords': 'Betting Records',
      'navbar.desktop.home': 'Home',
      'navbar.desktop.hotGames': 'Hot Games',
      'navbar.desktop.sports': 'Sports',
      'navbar.desktop.live': 'Live',
      'navbar.desktop.slots': 'Slots',
      'navbar.desktop.fish': 'Fish',
      'navbar.desktop.miniGames': 'Mini Games',
      'navbar.desktop.promotion': 'Promotion',
      'navbar.balance': 'Balance:',
      'navbar.points': 'Points:',
      'userCenter.deposit': 'Deposit',
      'userCenter.withdrawal': 'Withdrawal',
      'userCenter.myAccount': 'My Account',
      'footer.desc': 'Gambling can be addictive, please play responsibly. For information on support measures, please visit our Responsible Gambling Help page.',
      'footer.desc2': 'By accessing, continuing to use or navigating throughout this site you accept that we will use certain browser cookies to improve your customer experience with us.',
      'footer.copyright': 'win10096 © All rights reserved and protected by law',
      'bottomNavbar.home': 'Home',
      'bottomNavbar.deposit': 'Deposit',
      'bottomNavbar.promotion': 'Promotion',
      'bottomNavbar.member': 'Member',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'hotGame.seeAll': 'See all',
      'hotGame.playNow': 'Play Now',
      'hotGame.promo': 'Promo',
      'gameType.types.hotGames': 'Hot Games',
      'gameType.types.miniGames': 'Mini Games',
      'gameType.types.slots': 'Slot Games',
      'gameType.types.liveCasino': 'Live Casino',
      'gameType.types.sports': 'Sports',
      'gameType.types.fish': 'Fish',
      'common.next': 'Next',
      'common.back': 'Back',
      'userCenter.sidebar.gameLobby': 'Game Lobby',
      'userCenter.sidebar.accountOverview': 'Account Overview',
      'userCenter.sidebar.bettingRecord': 'Betting Record',
      'userCenter.sidebar.depositRecord': 'Deposit Record',
      'userCenter.sidebar.profitAndLoss': 'Profit And Loss',
      'userCenter.sidebar.withdrawalRecord': 'Withdrawal Record',
      'userCenter.sidebar.withdrawalDetail': 'Withdrawal Detail',
      'userCenter.sidebar.accountRecord': 'Account Record',
      'userCenter.sidebar.personalInfo': 'Personal Info',
      'userCenter.sidebar.securityCenter': 'Security Center',
      'userCenter.sidebar.customerService': 'Customer Service',
    },
  };

  /* ---- Navbar 導覽資料(對照 components/Navbar.vue desktopNav/topItems/bottomItems) ---- */
  var DESKTOP_NAV = [
    { key: 'home', tKey: 'navbar.desktop.home', url: 'index.html' },
    { key: 'hotGames', tKey: 'navbar.desktop.hotGames', url: 'game-type.html?type=hotgames' },
    { key: 'sports', tKey: 'navbar.desktop.sports', url: 'game-type.html?type=sports' },
    { key: 'live', tKey: 'navbar.desktop.live', url: 'game-type.html?type=live' },
    { key: 'slots', tKey: 'navbar.desktop.slots', url: 'game-type.html?type=slot' },
    { key: 'fish', tKey: 'navbar.desktop.fish', url: 'game-type.html?type=fish' },
    { key: 'miniGames', tKey: 'navbar.desktop.miniGames', url: 'game-type.html?type=mini_game' },
    { key: 'promotion', tKey: 'navbar.desktop.promotion', url: 'promotion-list.html' },
  ];

  var MOBILE_TOP_ITEMS = [
    { key: 'hotGames', tKey: 'navbar.top.hotGames', url: 'game-type.html?type=hotgames', icon: 'hotGame.svg' },
    { key: 'miniGames', tKey: 'navbar.top.miniGames', url: 'game-type.html?type=mini_game', icon: 'miniGames.svg' },
    { key: 'sports', tKey: 'navbar.top.sports', url: 'game-type.html?type=sports', icon: 'sports.svg' },
    { key: 'liveCasino', tKey: 'navbar.top.liveCasino', url: 'game-type.html?type=live', icon: 'liveCasino.svg' },
    { key: 'slots', tKey: 'navbar.top.slots', url: 'game-type.html?type=slot', icon: 'slotGames.svg' },
    { key: 'fish', tKey: 'navbar.top.fish', url: 'game-type.html?type=fish', icon: 'fish.svg' },
  ];

  var MOBILE_BOTTOM_ITEMS = [
    { key: 'withdrawal', tKey: 'navbar.bottom.withdrawal', url: 'withdrawal.html', icon: 'withdrawal.svg' },
    { key: 'account', tKey: 'navbar.bottom.account', url: 'account.html', icon: 'accounts.svg' },
    { key: 'bettingRecords', tKey: 'navbar.bottom.bettingRecords', url: 'betting-record.html', icon: 'bettingRecord.svg' },
  ];

  var BOTTOM_NAV_ITEMS = [
    { key: 'home', tKey: 'bottomNavbar.home', url: 'index.html', icon: 'nav-home.svg' },
    { key: 'deposit', tKey: 'bottomNavbar.deposit', url: 'deposit.html', icon: 'nav-deposit.svg' },
    { key: 'promotion', tKey: 'bottomNavbar.promotion', url: 'promotion-list.html', icon: 'nav-promotion.svg' },
    { key: 'member', tKey: 'bottomNavbar.member', url: 'account.html', icon: 'nav-member.svg' },
  ];

  var FOOTER_PARTNERS = [
    '7mojo.png', 'APGaming.png', 'AdvantPlay.png', 'AlizeSlots.png', 'Askmeslot.png',
    'ILoveU.png', 'KingMidas.png', 'Live88.png', 'PGSoft.png', 'PlayNGo.png',
    'Spinomenal.png', 'TurboGames.png', 'UpUpGame.png', 'Winfinity.png', 'YeeBet.png',
    'YellowBat.png', 'hacksaw.png',
  ];

  var LANGUAGES = [
    { code: 'en', label: 'English', image: 'lang-us2.svg' },
    { code: 'ko', label: '한국어', image: 'lang-kr.png' },
  ];

  /* ---- 首頁跑馬燈中獎訊息(對照 v2 既有假資料風格,原始碼本身走 API) ---- */
  var MARQUEE_ITEMS = [
    { title: 'Player***123 WIN ₩8,888 at Gates of Olympus' },
    { title: 'Lucky***456 WIN ₩15,000 at Sweet Bonanza' },
    { title: 'Win***789 WIN ₩3,200 at Crazy Time' },
    { title: 'Pro***321 WIN ₩22,500 at Lightning Roulette' },
  ];

  /* ---- 首頁 Banner(對照 public/images/banner) ---- */
  var BANNER_SLIDES_DESKTOP = ['banner.jpg', 'banner-2.jpg'];
  var BANNER_SLIDES_MOBILE = ['banner-mobile.png'];

  /* ---- Hot Game 卡片(桌機/手機共用一份假資料,圖片對照 public/images/index/mainGame) ---- */
  var HOT_GAMES = [
    { id: 1, name: 'Gates of Olympus', image: 'index/mainGame/other/slot 1.png' },
    { id: 2, name: 'Sweet Bonanza', image: 'index/mainGame/other/slot 2.png' },
    { id: 3, name: 'Crazy Time', image: 'index/mainGame/other/slot 3.png' },
    { id: 4, name: 'Lightning Roulette', image: 'index/mainGame/other/slot 4.png' },
    { id: 5, name: 'Book of Dead', image: 'index/mainGame/other/slot 5.png' },
    { id: 6, name: 'Wild Bandito', image: 'index/mainGame/other/slot 6.png' },
  ];

  /* ---- 遊戲分類區(GameType.vue,對照 hotGame icon 資料) ---- */
  var GAME_TYPES = [
    { key: 'miniGames', tKey: 'gameType.types.miniGames', icon: 'icon-Maingames.png' },
    { key: 'slots', tKey: 'gameType.types.slots', icon: 'icon-Slotgame.png' },
    { key: 'liveCasino', tKey: 'gameType.types.liveCasino', icon: 'icon-Live.png' },
    { key: 'sports', tKey: 'gameType.types.sports', icon: 'icon-Sports.png' },
    { key: 'fish', tKey: 'gameType.types.fish', icon: 'icon-Fish.png' },
  ];

  /* ---- 假登入會員(對照 stores/user.js profile 結構,預設已登入以便預覽會員頁) ---- */
  var MOCK_PROFILE = {
    username: 'meaomcao',
    player_level_id: 'VIP1',
    player_level_name: 'VIP1',
    balance: '₩1,000,000,000',
    point_balance: '₩1,000,000,000',
    remaining_turnover_amount: '0',
  };

  window.WIN15_DATA = {
    I18N: I18N,
    DESKTOP_NAV: DESKTOP_NAV,
    MOBILE_TOP_ITEMS: MOBILE_TOP_ITEMS,
    MOBILE_BOTTOM_ITEMS: MOBILE_BOTTOM_ITEMS,
    BOTTOM_NAV_ITEMS: BOTTOM_NAV_ITEMS,
    FOOTER_PARTNERS: FOOTER_PARTNERS,
    LANGUAGES: LANGUAGES,
    MARQUEE_ITEMS: MARQUEE_ITEMS,
    BANNER_SLIDES_DESKTOP: BANNER_SLIDES_DESKTOP,
    BANNER_SLIDES_MOBILE: BANNER_SLIDES_MOBILE,
    HOT_GAMES: HOT_GAMES,
    GAME_TYPES: GAME_TYPES,
    MOCK_PROFILE: MOCK_PROFILE,
  };
})(window);
