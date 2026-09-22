/* v2 獨立手機版 i18n：data-i18n 屬性宣告式作法（比照 v1.5/v3/v4/v5/v6，
   不沿用 v2/site 那套「精確字串比對換字」——那套屬性覆蓋容易漏、複合
   文字節點容易斷，稽核成本高，詳見 .claude/skills/cms-scaffold）。

   語言狀態跟桌機版共用同一把 localStorage key(win100-locale)，同源
   自動同步。翻譯「內容」是獨立的一份字典（STRINGS）：nav/auth/skin 這類
   跟桌機版概念重疊的詞，ko/th 譯文直接對齊 v2/site/assets/js/data.js
   的 I18N 表（同一批詞彙，不要各講各話）；tabbar/promo/page.* 這些是
   手機版獨有的新畫面（截圖參考的 Lucky Star 版型桌機版沒有），沒有
   既有譯文可搬，自己翻。 */
(function () {
  'use strict';
  var LOCALE_KEY = 'win100-locale';
  var DEFAULT_LOCALE = 'zh';

  var STRINGS = {
    'nav.home': { zh: '首頁', en: 'Home', ko: '홈', th: 'หน้าแรก' },
    'nav.casino': { zh: '娛樂城', en: 'Casino', ko: '카지노', th: 'คาสิโน' },
    'nav.live': { zh: '真人視訊', en: 'Live games', ko: '라이브 카지노', th: 'คาสิโนสด' },
    'nav.search': { zh: '搜尋', en: 'Search', ko: '검색', th: 'ค้นหา' },
    'nav.mainNav': { zh: '主導覽', en: 'Main navigation', ko: '메인 내비게이션', th: 'เมนูหลัก' },
    'game.placeholder': { zh: '遊戲名稱', en: 'Game Name', ko: '게임명', th: 'ชื่อเกม' },

    'auth.login': { zh: '登入', en: 'Login', ko: '로그인', th: 'เข้าสู่ระบบ' },
    'auth.register': { zh: '註冊', en: 'Registration', ko: '회원가입', th: 'สมัครสมาชิก' },

    'skin.label': { zh: '外觀', en: 'Skin', ko: '스킨', th: 'ธีม' },

    'tabbar.home': { zh: '首頁', en: 'Home', ko: '홈', th: 'หน้าแรก' },
    'tabbar.freeMoney': { zh: '免費金', en: 'Free Money', ko: '무료 캐시', th: 'เงินฟรี' },
    'tabbar.casino': { zh: '娛樂城', en: 'Casino', ko: '카지노', th: 'คาสิโน' },
    'tabbar.live': { zh: '真人視訊', en: 'Live games', ko: '라이브 카지노', th: 'คาสิโนสด' },
    'tabbar.menu': { zh: '選單', en: 'Menu', ko: '메뉴', th: 'เมนู' },

    'promo.freeMoneyTitle': { zh: '免費現金', en: 'Free money', ko: '무료 캐시', th: 'เงินสดฟรี' },
    'promo.freeMoneySub': { zh: '免費彩金！', en: 'Free cash!', ko: '무료 보너스!', th: 'โบนัสฟรี!' },
    'promo.bonusTitle': { zh: '優惠活動', en: 'Promotions', ko: '프로모션', th: 'โปรโมชัน' },
    'promo.bonusSub': { zh: '與獎金', en: 'and bonuses', ko: '및 보너스', th: 'และโบนัส' },

    'section.bestGames': { zh: '精選遊戲', en: 'Best games', ko: '베스트 게임', th: 'เกมยอดนิยม' },
    'section.casino': { zh: '娛樂城', en: 'Casino', ko: '카지노', th: 'คาสิโน' },
    'section.all': { zh: '全部', en: 'All', ko: '전체보기', th: 'ทั้งหมด' },

    'page.hotGames': { zh: '熱門遊戲', en: 'Hot Games', ko: '인기 게임', th: 'เกมยอดนิยม' },
    'page.slots': { zh: '老虎機', en: 'Slots', ko: '슬롯', th: 'สล็อต' },
    'page.fish': { zh: '捕魚機', en: 'Fish', ko: '낚시 게임', th: 'เกมยิงปลา' },
    'page.miniGames': { zh: '小遊戲', en: 'Mini Games', ko: '미니게임', th: 'เกมมินิเกม' },
    'page.sport': { zh: '體育賽事', en: 'Sports', ko: '스포츠', th: 'กีฬา' },

    'page.accountOverview': { zh: '會員總覽', en: 'Account Overview', ko: '계정 개요', th: 'ภาพรวมบัญชี' },
    'page.deposit': { zh: '儲值', en: 'Deposit', ko: '입금', th: 'ฝากเงิน' },
    'page.withdrawal': { zh: '提款', en: 'Withdrawal', ko: '출금', th: 'ถอนเงิน' },
    'page.depositRecord': { zh: '儲值紀錄', en: 'Deposit Record', ko: '입금 내역', th: 'ประวัติการฝาก' },
    'page.withdrawalRecord': { zh: '提款紀錄', en: 'Withdrawal Record', ko: '출금 내역', th: 'ประวัติการถอน' },
    'page.withdrawalDetail': { zh: '提款明細', en: 'Withdrawal Detail', ko: '출금 상세', th: 'รายละเอียดการถอนเงิน' },
    'page.accountRecord': { zh: '帳戶紀錄', en: 'Account Record', ko: '계정 내역', th: 'ประวัติบัญชี' },
    'page.bettingRecord': { zh: '投注紀錄', en: 'Betting Record', ko: '베팅 내역', th: 'ประวัติการเดิมพัน' },
    'page.profitLoss': { zh: '損益報表', en: 'Profit And Loss', ko: '손익 보고서', th: 'รายงานกำไรขาดทุน' },
    'page.personalInfo': { zh: '個人資料', en: 'Personal Info', ko: '개인 정보', th: 'ข้อมูลส่วนตัว' },
    'page.security': { zh: '安全中心', en: 'Security Center', ko: '보안 센터', th: 'ศูนย์ความปลอดภัย' },
    'page.changePassword': { zh: '變更登入密碼', en: 'Change Login Password', ko: '로그인 비밀번호 변경', th: 'เปลี่ยนรหัสผ่านเข้าสู่ระบบ' },
    'page.about': { zh: '關於我們', en: 'About', ko: '회사 소개', th: 'เกี่ยวกับเรา' },
    'page.customerService': { zh: '客服中心', en: 'Customer Service', ko: '고객 지원', th: 'ฝ่ายบริการลูกค้า' },

    'account.bound': { zh: '綁定', en: 'Bound', ko: '등록', th: 'ผูกบัญชี' },
    'account.memberNo': { zh: '會員編號', en: 'Member ID', ko: '회원 번호', th: 'หมายเลขสมาชิก' },
    'account.balance2': { zh: '帳戶餘額', en: 'Account Balance', ko: '계정 잔액', th: 'ยอดคงเหลือในบัญชี' },
    'account.bonusPoints': { zh: '紅利點數', en: 'Bonus Points', ko: '보너스 포인트', th: 'แต้มโบนัส' },
    'account.boundBanks': { zh: '已綁定銀行卡', en: 'Bound Bank Cards', ko: '등록된 은행 카드', th: 'บัตรธนาคารที่ผูกไว้' },
    'account.memberServices': { zh: '會員服務', en: 'Member Services', ko: '회원 서비스', th: 'บริการสมาชิก' },

    'deposit.selectChannel': { zh: '選擇儲值通道', en: 'Select a deposit channel', ko: '입금 채널 선택', th: 'เลือกช่องทางฝากเงิน' },
    'deposit.methodCount': { zh: '種付款方式', en: 'payment methods', ko: '개의 결제 수단', th: 'วิธีชำระเงิน' },

    'withdrawal.bankAccounts': { zh: '銀行帳戶', en: 'Bank Accounts', ko: '은행 계좌', th: 'บัญชีธนาคาร' },
    'withdrawal.cryptoWallets': { zh: '加密貨幣錢包', en: 'Crypto Wallets', ko: '암호화폐 지갑', th: 'กระเป๋าคริปโต' },
    'withdrawal.amount': { zh: '提款金額', en: 'Withdrawal Amount', ko: '출금 금액', th: 'จำนวนเงินถอน' },
    'withdrawal.submit': { zh: '送出提款申請', en: 'Submit Withdrawal Request', ko: '출금 신청하기', th: 'ส่งคำขอถอนเงิน' },

    'field.account': { zh: '帳號', en: 'Username', ko: '아이디', th: 'ไอดี' },
    'field.name': { zh: '姓名', en: 'Name', ko: '이름', th: 'ชื่อ' },
    'field.phone': { zh: '手機號碼', en: 'Mobile Number', ko: '휴대폰 번호', th: 'หมายเลขโทรศัพท์' },
    'field.vipLevel': { zh: 'VIP 等級', en: 'VIP Level', ko: 'VIP 등급', th: 'ระดับ VIP' },

    'security.loginPassword': { zh: '登入密碼', en: 'Login Password', ko: '로그인 비밀번호', th: 'รหัสผ่านเข้าสู่ระบบ' },
    'security.change': { zh: '變更', en: 'Change', ko: '변경', th: 'เปลี่ยน' },
    'security.transactionPassword': { zh: '交易密碼', en: 'Transaction Password', ko: '거래 비밀번호', th: 'รหัสผ่านธุรกรรม' },
    'security.setUp': { zh: '設定', en: 'Set up', ko: '설정', th: 'ตั้งค่า' },
    'security.twoFactor': { zh: '雙重驗證', en: 'Two-Factor Authentication', ko: '2단계 인증', th: 'การยืนยันตัวตนสองขั้นตอน' },
    'security.notEnabled': { zh: '未啟用', en: 'Not enabled', ko: '미설정', th: 'ยังไม่เปิดใช้งาน' },
    'security.loginHistory': { zh: '登入紀錄', en: 'Login History', ko: '로그인 기록', th: 'ประวัติการเข้าสู่ระบบ' },
    'security.view': { zh: '查看', en: 'View', ko: '보기', th: 'ดู' },

    'changePw.current': { zh: '目前密碼', en: 'Current Password', ko: '현재 비밀번호', th: 'รหัสผ่านปัจจุบัน' },
    'changePw.new': { zh: '新密碼', en: 'New Password', ko: '새 비밀번호', th: 'รหัสผ่านใหม่' },
    'changePw.confirm': { zh: '確認新密碼', en: 'Confirm New Password', ko: '새 비밀번호 확인', th: 'ยืนยันรหัสผ่านใหม่' },
    'changePw.confirmBtn': { zh: '確認變更', en: 'Confirm Change', ko: '변경 확인', th: 'ยืนยันการเปลี่ยนแปลง' },

    'about.tabAboutUs': { zh: '關於我們', en: 'About Us', ko: '회사 소개', th: 'เกี่ยวกับเรา' },
    'about.tabAnnouncements': { zh: '公告', en: 'Announcements', ko: '공지사항', th: 'ประกาศ' },
    'about.tabFaq': { zh: '常見問題', en: 'FAQ', ko: '자주 묻는 질문', th: 'คำถามที่พบบ่อย' },
    'about.body': {
      zh: 'Lucky Star 是一個提供娛樂城、真人視訊、體育、老虎機與小遊戲的一站式平台，致力於提供安全、公平、即時的遊戲體驗與客服支援。',
      en: 'Lucky Star is a one-stop platform for casino, live games, sports, slots and mini games, committed to a safe, fair and instant gaming experience with dedicated support.',
      ko: 'Lucky Star는 카지노, 라이브 카지노, 스포츠, 슬롯, 미니게임을 제공하는 원스톱 플랫폼으로, 안전하고 공정하며 즉각적인 게임 경험과 고객 지원을 제공합니다.',
      th: 'Lucky Star คือแพลตฟอร์มครบวงจรที่มีคาสิโน คาสิโนสด กีฬา สล็อต และมินิเกม มุ่งมั่นมอบประสบการณ์การเล่นเกมที่ปลอดภัย เป็นธรรม รวดเร็ว พร้อมทีมซัพพอร์ต',
    },

    'record.deposit': { zh: '儲值', en: 'Deposit', ko: '입금', th: 'ฝากเงิน' },
    'record.withdrawal': { zh: '提款', en: 'Withdrawal', ko: '출금', th: 'ถอนเงิน' },
    'record.bet': { zh: '投注', en: 'Bet', ko: '베팅', th: 'เดิมพัน' },
    'record.payout': { zh: '派彩', en: 'Payout', ko: '지급액', th: 'จ่ายเงิน' },
    'record.bonus': { zh: '紅利', en: 'Bonus', ko: '보너스', th: 'โบนัส' },
    'record.completed': { zh: '已完成', en: 'Completed', ko: '완료', th: 'เสร็จสมบูรณ์' },
    'record.pending': { zh: '審核中', en: 'Pending', ko: '심사 중', th: 'กำลังตรวจสอบ' },
    'record.totalDeposit': { zh: '總儲值', en: 'Total Deposit', ko: '총 입금액', th: 'ยอดฝากรวม' },
    'record.totalWithdrawal': { zh: '總提款', en: 'Total Withdrawal', ko: '총 출금액', th: 'ยอดถอนรวม' },
    'record.totalBet': { zh: '總投注', en: 'Total Bet', ko: '총 베팅액', th: 'ยอดเดิมพันรวม' },
    'record.netProfit': { zh: '淨損益', en: 'Net Profit', ko: '순손익', th: 'กำไรขาดทุนสุทธิ' },
    'record.recentNotePrefix': { zh: '僅顯示最近', en: 'Showing the most recent', ko: '최근', th: 'แสดงเฉพาะ' },
    'record.recentNoteSuffix': { zh: '筆紀錄', en: 'records', ko: '건만 표시됩니다', th: 'รายการล่าสุด' },

    'withdrawalDetail.txnId': { zh: '交易編號', en: 'Transaction ID', ko: '거래 번호', th: 'หมายเลขธุรกรรม' },
    'withdrawalDetail.requestTime': { zh: '申請時間', en: 'Requested At', ko: '신청 시간', th: 'เวลาที่ขอ' },
    'withdrawalDetail.method': { zh: '提款方式', en: 'Withdrawal Method', ko: '출금 방법', th: 'วิธีการถอนเงิน' },
    'withdrawalDetail.status': { zh: '狀態', en: 'Status', ko: '상태', th: 'สถานะ' },
  };

  function currentLocale() {
    try { return localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE; } catch (e) { return DEFAULT_LOCALE; }
  }

  function t(key) {
    var row = STRINGS[key];
    if (!row) return key;
    return row[currentLocale()] || row[DEFAULT_LOCALE] || key;
  }

  function applyLocale(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
  }

  document.addEventListener('DOMContentLoaded', function () { applyLocale(document); });
  window.__v2mT = t;
  window.__v2mApplyLocale = applyLocale;
})();
