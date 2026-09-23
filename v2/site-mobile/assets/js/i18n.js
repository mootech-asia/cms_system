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
    'nav.mainNav': { zh: '主導覽', en: 'Main navigation', ko: '메인 내비게이션', th: 'เมนูหลัก' },
    'game.placeholder': { zh: '遊戲名稱', en: 'Game Name', ko: '게임명', th: 'ชื่อเกม' },

    'auth.login': { zh: '登入', en: 'Login', ko: '로그인', th: 'เข้าสู่ระบบ' },
    'auth.register': { zh: '註冊', en: 'Registration', ko: '회원가입', th: 'สมัครสมาชิก' },
    'auth.signInTab': { zh: '登入', en: 'Sign in', ko: '로그인', th: 'เข้าสู่ระบบ' },
    'auth.registerTab': { zh: '註冊', en: 'Register', ko: '회원가입', th: 'สมัครสมาชิก' },
    'auth.usernamePh': { zh: '請輸入帳號', en: 'Enter your username', ko: '아이디를 입력하세요', th: 'กรอกชื่อผู้ใช้ของคุณ' },
    'auth.password': { zh: '密碼', en: 'Password', ko: '비밀번호', th: 'รหัสผ่าน' },
    'auth.passwordPh': { zh: '請輸入密碼', en: 'Enter your password', ko: '비밀번호를 입력하세요', th: 'กรอกรหัสผ่านของคุณ' },
    'auth.confirmPassword': { zh: '確認密碼', en: 'Confirm Password', ko: '비밀번호 확인', th: 'ยืนยันรหัสผ่าน' },
    'auth.confirmPasswordPh': { zh: '請再輸入一次密碼', en: 'Confirm your password', ko: '비밀번호를 다시 입력하세요', th: 'กรอกรหัสผ่านอีกครั้ง' },
    'auth.email': { zh: '電子郵件', en: 'Email', ko: '이메일', th: 'อีเมล' },
    'auth.emailPh': { zh: '請輸入電子郵件', en: 'Enter your email', ko: '이메일을 입력하세요', th: 'กรอกอีเมลของคุณ' },
    'auth.realNamePh': { zh: '請輸入真實姓名', en: 'Enter your real name', ko: '실명을 입력하세요', th: 'กรอกชื่อจริงของคุณ' },
    'auth.mobilePh': { zh: '請輸入手機號碼', en: 'Enter your mobile number', ko: '휴대폰 번호를 입력하세요', th: 'กรอกหมายเลขโทรศัพท์ของคุณ' },
    'auth.noAccount': { zh: '還沒有帳號？', en: "Don't have an account?", ko: '계정이 없으신가요?', th: 'ยังไม่มีบัญชี?' },
    'auth.haveAccount': { zh: '已經有帳號？', en: 'Already have an account?', ko: '이미 계정이 있으신가요?', th: 'มีบัญชีอยู่แล้ว?' },
    'auth.logout': { zh: '登出', en: 'Logout', ko: '로그아웃', th: 'ออกจากระบบ' },
    'auth.err.username': { zh: '帳號需為 3-16 個字元', en: 'Username must be 3-16 characters.', ko: '아이디는 3~16자로 입력하세요.', th: 'ชื่อผู้ใช้ต้องมี 3-16 ตัวอักษร' },
    'auth.err.password': { zh: '密碼需為 5-16 個字元', en: 'Length must be 5-16 characters.', ko: '비밀번호는 5~16자여야 합니다.', th: 'รหัสผ่านต้องมี 5-16 ตัวอักษร' },
    'auth.err.confirm': { zh: '兩次密碼輸入不一致', en: 'The two passwords do not match.', ko: '비밀번호가 일치하지 않습니다.', th: 'รหัสผ่านทั้งสองไม่ตรงกัน' },
    'auth.err.email': { zh: '請輸入有效的電子郵件', en: 'Please enter a valid email address.', ko: '유효한 이메일을 입력하세요.', th: 'กรุณากรอกอีเมลที่ถูกต้อง' },
    'auth.err.realname': { zh: '請輸入真實姓名', en: 'Please enter your real name.', ko: '실명을 입력하세요.', th: 'กรุณากรอกชื่อจริง' },
    'auth.err.mobile': { zh: '請輸入有效的手機號碼', en: 'Please enter a valid mobile number.', ko: '유효한 휴대폰 번호를 입력하세요.', th: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง' },

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
    'promo.viewDetails': { zh: '查看詳情', en: 'View Details', ko: '자세히 보기', th: 'ดูรายละเอียด' },

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
    'drawer.memberCenter': { zh: '會員中心', en: 'Member Center', ko: '회원 센터', th: 'ศูนย์สมาชิก' },

    'account.bound': { zh: '綁定', en: 'Bound', ko: '등록', th: 'ผูกบัญชี' },
    'account.memberNo': { zh: '會員編號', en: 'Member ID', ko: '회원 번호', th: 'หมายเลขสมาชิก' },
    'account.balance2': { zh: '帳戶餘額', en: 'Account Balance', ko: '계정 잔액', th: 'ยอดคงเหลือในบัญชี' },
    'account.bonusPoints': { zh: '紅利點數', en: 'Bonus Points', ko: '보너스 포인트', th: 'แต้มโบนัส' },
    'account.boundBanks': { zh: '已綁定銀行卡', en: 'Bound Bank Cards', ko: '등록된 은행 카드', th: 'บัตรธนาคารที่ผูกไว้' },
    'account.memberServices': { zh: '會員服務', en: 'Member Services', ko: '회원 서비스', th: 'บริการสมาชิก' },
    'account.current': { zh: '目前', en: 'Current', ko: '현재', th: 'ปัจจุบัน' },
    'account.next': { zh: '下一階', en: 'Next', ko: '다음', th: 'ถัดไป' },
    'account.tierUnranked': { zh: '未排名', en: 'Unranked', ko: '순위 없음', th: 'ไม่มีอันดับ' },
    'account.tierBronze': { zh: '銅級', en: 'Bronze', ko: '브론즈', th: 'บรอนซ์' },
    'account.rewardsProgress': { zh: '等級進度', en: 'Rewards Progress', ko: '등급 진행률', th: 'ความคืบหน้าระดับ' },

    'deposit.selectChannel': { zh: '選擇儲值通道', en: 'Select a deposit channel', ko: '입금 채널 선택', th: 'เลือกช่องทางฝากเงิน' },
    'deposit.methodCount': { zh: '種付款方式', en: 'payment methods', ko: '개의 결제 수단', th: 'วิธีชำระเงิน' },
    'deposit.methodBank': { zh: '銀行卡', en: 'Bank Card', ko: '은행 카드', th: 'บัตรธนาคาร' },
    'deposit.methodLinepay': { zh: 'LinePay', en: 'LinePay', ko: 'LinePay', th: 'LinePay' },
    'deposit.methodTrc20': { zh: 'USDT TRC20', en: 'USDT TRC20', ko: 'USDT TRC20', th: 'USDT TRC20' },
    'deposit.methodErc20': { zh: 'USDT ERC20', en: 'USDT ERC20', ko: 'USDT ERC20', th: 'USDT ERC20' },
    'deposit.amount': { zh: '儲值金額', en: 'Deposit Amount', ko: '입금 금액', th: 'จำนวนเงินฝาก' },
    'deposit.amountPh': { zh: '請輸入儲值金額', en: 'Enter deposit amount', ko: '입금 금액을 입력하세요', th: 'กรอกจำนวนเงินฝาก' },
    'deposit.next': { zh: '下一步', en: 'Next', ko: '다음', th: 'ถัดไป' },
    'deposit.back': { zh: '返回', en: 'Back', ko: '뒤로', th: 'ย้อนกลับ' },
    'deposit.transferPill': { zh: '轉帳明細', en: 'Transfer Details', ko: '이체 정보', th: 'รายละเอียดการโอน' },
    'deposit.transferAccountLabel': { zh: '收款帳戶', en: 'Deposit Account', ko: '입금 계좌', th: 'บัญชีรับเงิน' },
    'deposit.transferNote': { zh: '完成轉帳後請點擊下方「完成」按鈕。如有任何問題，歡迎聯繫客服中心。', en: 'Once the transfer is complete, please click the "Complete" button below. Should you have any questions, please contact our Customer Service team.', ko: '이체를 완료하신 후 아래 "완료" 버튼을 눌러주세요. 문의사항이 있으시면 고객센터로 연락해 주세요.', th: 'เมื่อโอนเงินเสร็จแล้ว กรุณากดปุ่ม "เสร็จสิ้น" ด้านล่าง หากมีข้อสงสัยกรุณาติดต่อฝ่ายบริการลูกค้า' },
    'deposit.complete': { zh: '完成', en: 'Complete', ko: '완료', th: 'เสร็จสิ้น' },
    'payment.successTitle': { zh: '申請已送出', en: 'Request Submitted', ko: '신청이 접수되었습니다', th: 'ส่งคำขอเรียบร้อยแล้ว' },
    'deposit.successMsg': { zh: '您的儲值申請已成功送出。', en: 'Your deposit application has been submitted.', ko: '입금 신청이 성공적으로 접수되었습니다.', th: 'คำขอฝากเงินของคุณถูกส่งเรียบร้อยแล้ว' },
    'payment.backHome': { zh: '返回首頁', en: 'Back to Home', ko: '홈으로 돌아가기', th: 'กลับหน้าแรก' },
    'deposit.viewRecord': { zh: '查看儲值紀錄', en: 'View Deposit Record', ko: '입금 내역 보기', th: 'ดูประวัติการฝากเงิน' },

    'withdrawal.bankAccounts': { zh: '銀行帳戶', en: 'Bank Accounts', ko: '은행 계좌', th: 'บัญชีธนาคาร' },
    'withdrawal.cryptoWallets': { zh: '加密貨幣錢包', en: 'Crypto Wallets', ko: '암호화폐 지갑', th: 'กระเป๋าคริปโต' },
    'withdrawal.amount': { zh: '提款金額', en: 'Withdrawal Amount', ko: '출금 금액', th: 'จำนวนเงินถอน' },
    'withdrawal.amountPh': { zh: '請輸入提款金額', en: 'Enter withdrawal amount', ko: '출금 금액을 입력하세요', th: 'กรอกจำนวนเงินถอน' },
    'withdrawal.password': { zh: '交易密碼', en: 'Transaction Password', ko: '거래 비밀번호', th: 'รหัสผ่านธุรกรรม' },
    'withdrawal.passwordPh': { zh: '請輸入交易密碼', en: 'Enter transaction password', ko: '거래 비밀번호를 입력하세요', th: 'กรอกรหัสผ่านธุรกรรม' },
    'withdrawal.submit': { zh: '送出提款申請', en: 'Submit Withdrawal Request', ko: '출금 신청하기', th: 'ส่งคำขอถอนเงิน' },
    'withdrawal.successMsg': { zh: '您的提款申請已成功送出。', en: 'Your withdrawal request has been submitted successfully.', ko: '출금 신청이 성공적으로 접수되었습니다.', th: 'คำขอถอนเงินของคุณถูกส่งเรียบร้อยแล้ว' },
    'withdrawal.viewRecord': { zh: '查看提款紀錄', en: 'View Withdrawal Record', ko: '출금 내역 보기', th: 'ดูประวัติการถอนเงิน' },
    'withdrawal.selectAccount': { zh: '請先選擇提款帳戶', en: 'Please select a withdrawal account first', ko: '먼저 출금 계좌를 선택해 주세요', th: 'กรุณาเลือกบัญชีถอนเงินก่อน' },

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

    /* withdrawal-detail（流水進度）Type/Activity Name 兩欄，v2/site 原始
       資料本身就是中文（這張表沒有跑桌機版的語系置換系統），手機版是
       全新畫面，順手用既有 i18n 機制翻掉，不把桌機版這個缺口原封不動
       搬過來，見 records.mjs 的 rolloverType()/rolloverActivity()。 */
    'rollover.0': { zh: '首存加碼100%', en: 'First Deposit +100%', ko: '첫 입금 +100%', th: 'ฝากครั้งแรก +100%' },
    'rollover.1': { zh: '週三存款贈10%', en: 'Wednesday Deposit +10%', ko: '수요일 입금 +10%', th: 'ฝากวันพุธ +10%' },
    'rollover.2': { zh: '週末返水5%', en: 'Weekend Cashback 5%', ko: '주말 캐시백 5%', th: 'แคชแบ็กวันหยุด 5%' },
    'rollover.3': { zh: '儲值滿額禮', en: 'Deposit Threshold Gift', ko: '입금 금액 달성 선물', th: 'ของขวัญยอดฝากครบกำหนด' },
    'rollover.4': { zh: 'VIP專屬彩金', en: 'VIP Exclusive Bonus', ko: 'VIP 전용 보너스', th: 'โบนัสพิเศษ VIP' },
    'rollover.5': { zh: '生日禮金', en: 'Birthday Gift', ko: '생일 선물', th: 'ของขวัญวันเกิด' },
    'rollover.6': { zh: '每日簽到禮', en: 'Daily Check-in Gift', ko: '매일 출석 선물', th: 'ของขวัญเช็คอินรายวัน' },
    'rollover.7': { zh: '邀請好友獎金', en: 'Refer-a-Friend Bonus', ko: '친구 초대 보너스', th: 'โบนัสแนะนำเพื่อน' },
    'rollover.8': { zh: '週日充值贈', en: 'Sunday Deposit Bonus', ko: '일요일 충전 보너스', th: 'โบนัสฝากวันอาทิตย์' },

    'withdrawalDetail.txnId': { zh: '交易編號', en: 'Transaction ID', ko: '거래 번호', th: 'หมายเลขธุรกรรม' },
    'withdrawalDetail.requestTime': { zh: '申請時間', en: 'Requested At', ko: '신청 시간', th: 'เวลาที่ขอ' },
    'withdrawalDetail.method': { zh: '提款方式', en: 'Withdrawal Method', ko: '출금 방법', th: 'วิธีการถอนเงิน' },
    'withdrawalDetail.status': { zh: '狀態', en: 'Status', ko: '상태', th: 'สถานะ' },

    /* Hero 輪播 4 張 slide 的文案，內容直接對齊 v2/site/assets/js/data.js
       的 BANNERS + I18N banner.* 那組既有翻譯，不是自己另外編。 */
    'banner.welcomeTitle': { zh: '儲值狂熱', en: 'Deposit Fever', ko: '충전 열풍', th: 'ฝากเงินสุดคุ้ม' },
    'banner.welcomeSub': { zh: '迎新加碼 · 快速出款 · 限時開放', en: 'New Member Bonus · Fast Withdrawals · Limited Time', ko: '신규 회원 보너스 · 빠른 출금 · 한정 기간', th: 'โบนัสสมาชิกใหม่ · ถอนเงินไว · จำกัดเวลา' },
    'banner.worldCupTitle': { zh: '榮耀之路', en: 'Road to Glory', ko: '영광의 길', th: 'เส้นทางสู่ชัยชนะ' },
    'banner.worldCupSub': { zh: '即時賠率 · 賽事中心 · 每球必爭', en: 'Live Odds · Match Center · Every Goal Counts', ko: '실시간 배당률 · 경기 센터 · 매 골이 중요합니다', th: 'อัตราต่อรองสด · ศูนย์การแข่งขัน · ทุกประตูมีความหมาย' },
    'banner.esportsTitle': { zh: '戰力升級', en: 'Power Up', ko: '전투력 업그레이드', th: 'อัปเกรดพลังการต่อสู้' },
    'banner.esportsSub': { zh: '每週遊戲返水 · 限時開放', en: 'Weekly Game Cashback · Limited Time', ko: '주간 게임 캐시백 · 한정 기간', th: 'แคชแบ็กเกมรายสัปดาห์ · จำกัดเวลา' },
    'banner.walletTitle': { zh: 'USDT 智慧錢包', en: 'USDT Smart Wallet', ko: 'USDT 스마트 지갑', th: 'กระเป๋าเงินอัจฉริยะ USDT' },
    'banner.walletSub': { zh: '快速入金 · 安全結算 · 24/7 存取', en: 'Fast Deposits · Secure Settlement · 24/7 Access', ko: '빠른 입금 · 안전한 정산 · 24/7 이용 가능', th: 'ฝากเงินไว · ชำระเงินปลอดภัย · เข้าถึงได้ตลอด 24/7' },
    'hero.prev': { zh: '上一則', en: 'Previous', ko: '이전', th: 'ก่อนหน้า' },
    'hero.next': { zh: '下一則', en: 'Next', ko: '다음', th: 'ถัดไป' },

    /* 進站公告彈窗（比照 v1.5 PromotionModal.vue，內容跟 v2/site 桌機版
       共用同一份 D.PROMO_POPUP，這裡只需要「今天不再提醒」這句 UI 文案）。 */
    'promotion.dontRemindToday': { zh: '今天不再提醒', en: "Don't remind me again today", ko: '오늘 다시 알리지 않기', th: 'ไม่ต้องแจ้งเตือนอีกวันนี้' },
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
