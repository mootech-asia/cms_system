// CMS_前台_v4 — 語系切換（vanilla，無框架、無 build）。
// 涵蓋範圍:導覽/頁尾/共用彈窗與各頁面獨有內容(會員中心表單/表格/彈窗訊息等)。
//   - 靜態 HTML 文字:加 data-i18n="key" 由 applyLocale() 掃描替換 textContent;
//     input placeholder 用 data-i18n-placeholder;aria-label 用 data-i18n-aria。
//   - site.js 動態產生的區塊(header-auth／手機選單／登入註冊彈窗／客服彈窗／
//     會員中心各頁清單與提示訊息):直接呼叫 window.CMS_I18N.t(key) 取字串,
//     渲染時就是當前語系;需要在語系切換後重新渲染的區塊要另外掛
//     cms-v4:locale-changed 監聽(見 site.js)。
(function () {
  'use strict';

  var LOCALE_KEY = 'cms-v4:locale';
  var DEFAULT_LOCALE = 'zh';
  var LOCALES = [
    { id: 'zh', label: '中文' },
    { id: 'en', label: 'English' },
    { id: 'ko', label: '한국어' },
    { id: 'th', label: 'ไทย' },
  ];

  var STRINGS = {
    'nav.lobby': { zh: '大廳', en: 'Lobby', ko: '로비', th: 'ล็อบบี้' },
    'nav.slots': { zh: '老虎機', en: 'Slots', ko: '슬롯', th: 'สล็อต' },
    'nav.live': { zh: '真人娛樂', en: 'Live Casino', ko: '라이브 카지노', th: 'คาสิโนสด' },
    'nav.electronic': { zh: '電子遊戲', en: 'Electronic Games', ko: '전자 게임', th: 'เกมอิเล็กทรอนิกส์' },
    'nav.fish': { zh: '捕魚達人', en: 'Fishing Master', ko: '낚시의 달인', th: 'เซียนยิงปลา' },
    'nav.sport': { zh: '體育', en: 'Sports', ko: '스포츠', th: 'กีฬา' },
    'nav.promotion': { zh: '優惠活動', en: 'Promotions', ko: '프로모션', th: 'โปรโมชั่น' },
    'nav.deposit': { zh: '儲值', en: 'Deposit', ko: '충전', th: 'เติมเงิน' },
    'nav.member': { zh: '會員', en: 'Account', ko: '계정', th: 'บัญชี' },
    'nav.menu': { zh: '選單', en: 'Menu', ko: '메뉴', th: 'เมนู' },

    'sidebar.overview': { zh: '帳戶總覽', en: 'Account Overview', ko: '계정 개요', th: 'ภาพรวมบัญชี' },
    'sidebar.withdrawal': { zh: '提款', en: 'Withdrawal', ko: '출금', th: 'ถอนเงิน' },
    'sidebar.bettingRecord': { zh: '投注紀錄', en: 'Betting Record', ko: '베팅 기록', th: 'บันทึกการเดิมพัน' },
    'sidebar.depositRecord': { zh: '儲值紀錄', en: 'Deposit Record', ko: '충전 기록', th: 'บันทึกการเติมเงิน' },
    'sidebar.profitLoss': { zh: '損益報表', en: 'Profit & Loss', ko: '손익 보고서', th: 'รายงานกำไรขาดทุน' },
    'sidebar.withdrawalRecord': { zh: '提款紀錄', en: 'Withdrawal Record', ko: '출금 기록', th: 'บันทึกการถอนเงิน' },
    'sidebar.withdrawalDetail': { zh: '提款明細', en: 'Withdrawal Detail', ko: '출금 상세', th: 'รายละเอียดการถอนเงิน' },
    'sidebar.accountRecord': { zh: '帳戶紀錄', en: 'Account Record', ko: '계정 기록', th: 'บันทึกบัญชี' },
    'sidebar.personalInfo': { zh: '個人資料', en: 'Personal Info', ko: '개인 정보', th: 'ข้อมูลส่วนตัว' },
    'sidebar.security': { zh: '安全中心', en: 'Security Center', ko: '보안 센터', th: 'ศูนย์ความปลอดภัย' },
    'page.changePassword': { zh: '修改登入密碼', en: 'Change Login Password', ko: '로그인 비밀번호 변경', th: 'เปลี่ยนรหัสผ่านเข้าสู่ระบบ' },

    'auth.registerNow': { zh: '立即註冊', en: 'Register Now', ko: '지금 가입', th: 'ลงทะเบียนเลย' },
    'auth.usernamePlaceholder': { zh: '用戶名', en: 'Username', ko: '사용자명', th: 'ชื่อผู้ใช้' },
    'auth.passwordPlaceholder': { zh: '密碼', en: 'Password', ko: '비밀번호', th: 'รหัสผ่าน' },
    'auth.forgot': { zh: '忘記密碼', en: 'Forgot?', ko: '비밀번호를 잊으셨나요?', th: 'ลืมรหัสผ่าน' },
    'auth.login': { zh: '登錄', en: 'Login', ko: '로그인', th: 'เข้าสู่ระบบ' },
    'auth.register': { zh: '註冊', en: 'Register', ko: '가입하기', th: 'ลงทะเบียน' },
    'auth.logout': { zh: '登出', en: 'Logout', ko: '로그아웃', th: 'ออกจากระบบ' },
    'auth.balancePrefix': { zh: '餘額：', en: 'Balance: ', ko: '잔액: ', th: 'ยอดเงิน: ' },
    'auth.pointsPrefix': { zh: '點數：', en: 'Points: ', ko: '포인트: ', th: 'พอยท์: ' },
    'auth.usernameLabel': { zh: '用戶名', en: 'Username', ko: '사용자명', th: 'ชื่อผู้ใช้' },
    'auth.usernameInputPlaceholder': { zh: '請輸入用戶名', en: 'Enter your username', ko: '사용자명을 입력하세요', th: 'กรุณากรอกชื่อผู้ใช้' },
    'auth.passwordLabel': { zh: '密碼', en: 'Password', ko: '비밀번호', th: 'รหัสผ่าน' },
    'auth.passwordInputPlaceholder': { zh: '請輸入密碼', en: 'Enter your password', ko: '비밀번호를 입력하세요', th: 'กรุณากรอกรหัสผ่าน' },
    'auth.confirmPasswordLabel': { zh: '確認密碼', en: 'Confirm Password', ko: '비밀번호 확인', th: 'ยืนยันรหัสผ่าน' },
    'auth.confirmPasswordPlaceholder': { zh: '請再次輸入密碼', en: 'Re-enter your password', ko: '비밀번호를 다시 입력하세요', th: 'กรุณากรอกรหัสผ่านอีกครั้ง' },

    'notice.message': {
      zh: '公告：系統將於今日凌晨進行例行維護，期間下注功能將暫停使用，造成不便敬請見諒。',
      en: 'Notice: The system will undergo scheduled maintenance early this morning. Betting will be temporarily unavailable during this time. We apologize for the inconvenience.',
      ko: '공지: 시스템은 오늘 새벽 정기 점검을 진행합니다. 점검 기간 동안 베팅 기능이 일시 중단되니 이용에 불편을 드려 죄송합니다.',
      th: 'ประกาศ: ระบบจะทำการปรับปรุงตามปกติในช่วงเช้าตรู่ของวันนี้ ฟังก์ชันการเดิมพันจะถูกระงับชั่วคราวในช่วงเวลาดังกล่าว ขออภัยในความไม่สะดวก',
    },
    'notice.faq': { zh: '常見問題', en: 'FAQ', ko: '자주 묻는 질문', th: 'คำถามที่พบบ่อย' },
    'notice.liveChat': { zh: '線上客服', en: 'Live Chat', ko: '실시간 상담', th: 'แชทสด' },

    'cs.title': { zh: '聯絡客服', en: 'Contact Support', ko: '고객센터 문의', th: 'ติดต่อฝ่ายบริการลูกค้า' },
    'cs.liveChatTitle': { zh: '線上客服', en: 'Live Chat', ko: '실시간 상담', th: 'แชทสด' },
    'cs.liveChatDesc': { zh: '24 小時即時支援', en: '24/7 instant support', ko: '24시간 실시간 지원', th: 'บริการด่วน 24 ชม.' },
    'cs.telegramTitle': { zh: 'Telegram 頻道', en: 'Telegram Channel', ko: 'Telegram 채널', th: 'ช่อง Telegram' },
    'cs.telegramDesc': { zh: '最新活動與公告', en: 'Latest promos & announcements', ko: '최신 이벤트 및 공지', th: 'โปรโมชันและประกาศล่าสุด' },
    'cs.emailTitle': { zh: 'Email 信箱', en: 'Email', ko: '이메일', th: 'อีเมล' },

    'footer.disclaimer1': {
      zh: '博彩可能造成成癮，請理性遊玩。如需支援資訊，請前往責任博彩協助頁面。',
      en: 'Gambling can be addictive. Please play responsibly. For support resources, please visit the responsible gambling help page.',
      ko: '도박은 중독될 수 있습니다. 책임감 있게 즐겨주세요. 지원 정보가 필요하시면 책임감 있는 게임 도움 페이지를 방문해주세요.',
      th: 'การพนันอาจก่อให้เกิดการเสพติด กรุณาเล่นอย่างมีความรับผิดชอบ หากต้องการข้อมูลช่วยเหลือ กรุณาไปที่หน้าช่วยเหลือการพนันอย่างมีความรับผิดชอบ',
    },
    'footer.disclaimer2': {
      zh: '當您存取、繼續使用或瀏覽本站，即表示您同意我們使用部分瀏覽器 Cookie，以改善您的使用體驗。',
      en: 'By accessing, continuing to use, or browsing this site, you agree to our use of certain browser cookies to improve your experience.',
      ko: '본 사이트에 접속, 계속 이용 또는 열람하시면 더 나은 이용 경험을 위해 일부 브라우저 쿠키를 사용하는 것에 동의하시는 것으로 간주됩니다.',
      th: 'การเข้าถึง ใช้งานต่อ หรือเข้าชมเว็บไซต์นี้ ถือว่าคุณยินยอมให้เราใช้คุกกี้บางส่วนของเบราว์เซอร์เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ',
    },
    'footer.copyright': {
      zh: '© 2026 Bet100 版權所有，受法律保護。本站僅供介面展示，不涉及任何實際投注行為。',
      en: '© 2026 Bet100. All rights reserved. This site is for interface demonstration purposes only and does not involve any real wagering.',
      ko: '© 2026 Bet100. 모든 권리 보유. 본 사이트는 인터페이스 시연 용도로만 제공되며, 실제 베팅 행위와는 무관합니다.',
      th: '© 2026 Bet100 สงวนสิทธิ์ทุกประการ เว็บไซต์นี้ใช้เพื่อสาธิตอินเทอร์เฟซเท่านั้น ไม่มีการพนันจริงเกิดขึ้น',
    },
    'footer.backToHub': { zh: '回到 CMS 統一預覽', en: 'Back to CMS Overview', ko: 'CMS 통합 미리보기로 돌아가기', th: 'กลับไปที่ภาพรวม CMS' },

    'vendor.title': { zh: '合作廠商', en: 'Our Partners', ko: '제휴 파트너', th: 'พันธมิตรของเรา' },

    'lang.label': { zh: '語言', en: 'Language', ko: '언어', th: 'ภาษา' },

    'common.refresh': { zh: '重新整理', en: 'Refresh', ko: '새로고침', th: 'รีเฟรช' },
    'common.viewDetail': { zh: '查看詳情', en: 'View Details', ko: '상세 보기', th: 'ดูรายละเอียด' },
    'common.back': { zh: '返回', en: 'Back', ko: '뒤로', th: 'กลับ' },
    'common.submit': { zh: '提交', en: 'Submit', ko: '제출', th: 'ส่ง' },
    'common.confirm': { zh: '確定', en: 'Confirm', ko: '확인', th: 'ยืนยัน' },
    'common.prev': { zh: '上一筆', en: 'Previous', ko: '이전', th: 'ก่อนหน้า' },
    'common.next2': { zh: '下一筆', en: 'Next', ko: '다음', th: 'ถัดไป' },
    'common.notice': { zh: '提示', en: 'Notice', ko: '안내', th: 'แจ้งเตือน' },
    'common.success': { zh: '成功', en: 'Success', ko: '성공', th: 'สำเร็จ' },

    'pay.bankCard': { zh: '銀行卡', en: 'Bank Card', ko: '은행카드', th: 'บัตรธนาคาร' },
    'pay.cryptoWallet': { zh: '加密錢包', en: 'Crypto Wallet', ko: '암호화폐 지갑', th: 'กระเป๋าเงินคริปโต' },
    'pay.linePay': { zh: 'LinePay', en: 'LinePay', ko: 'LinePay', th: 'LinePay' },

    'wd.tabWithdraw': { zh: '提款', en: 'Withdraw', ko: '출금', th: 'ถอนเงิน' },
    'wd.tabAccounts': { zh: '帳戶管理', en: 'Account Management', ko: '계정 관리', th: 'จัดการบัญชี' },
    'wd.mainWallet': { zh: '主錢包', en: 'Main Wallet', ko: '메인 지갑', th: 'กระเป๋าเงินหลัก' },
    'wd.turnoverAchievedPrefix': { zh: '*已達成流水：₩ ', en: '*Turnover Achieved: ₩ ', ko: '*달성된 유효 베팅액: ₩ ', th: '*ยอดหมุนที่ทำได้: ₩ ' },
    'wd.targetAmountPrefix': { zh: '目標金額：₩ ', en: 'Target Amount: ₩ ', ko: '목표 금액: ₩ ', th: 'จำนวนเป้าหมาย: ₩ ' },
    'wd.centralWallet': { zh: '中心錢包', en: 'Central Wallet', ko: '중앙 지갑', th: 'กระเป๋าเงินกลาง' },
    'wd.availableAmount': { zh: '可用金額', en: 'Available Amount', ko: '사용 가능 금액', th: 'จำนวนที่ใช้ได้' },
    'wd.walletInfo': { zh: '錢包資訊', en: 'Wallet Information', ko: '지갑 정보', th: 'ข้อมูลกระเป๋าเงิน' },
    'wd.selectWalletType': { zh: '請選擇錢包類型', en: 'Please select wallet type', ko: '지갑 유형을 선택해 주세요', th: 'กรุณาเลือกประเภทกระเป๋าเงิน' },
    'wd.walletAddressPlaceholder': { zh: '請輸入收款錢包地址', en: 'Please enter receiving wallet address', ko: '수신 지갑 주소를 입력해 주세요', th: 'กรุณากรอกที่อยู่กระเป๋าเงินรับเงิน' },
    'wd.bankNamePlaceholder': { zh: '銀行名稱', en: 'Bank Name', ko: '은행명', th: 'ชื่อธนาคาร' },
    'wd.holderPlaceholder': { zh: '收款人姓名', en: "Recipient's Name", ko: '수취인 이름', th: 'ชื่อผู้รับ' },
    'wd.accountPlaceholder': { zh: '銀行卡號', en: 'Bank Card Number', ko: '은행 카드 번호', th: 'หมายเลขบัตรธนาคาร' },
    'wd.fundPasswordPlaceholder': { zh: '請輸入交易密碼', en: 'Please enter transaction password', ko: '거래 비밀번호를 입력해 주세요', th: 'กรุณากรอกรหัสผ่านการทำธุรกรรม' },
    'wd.withdrawAmount': { zh: '提款金額', en: 'Withdrawal Amount', ko: '출금 금액', th: 'จำนวนถอนเงิน' },
    'wd.bankAmountNote': { zh: '* 最低金額：₩ 10,000；最高金額：₩ 9,000,000 *', en: '* Minimum: ₩ 10,000; Maximum: ₩ 9,000,000 *', ko: '* 최소 금액: ₩ 10,000; 최대 금액: ₩ 9,000,000 *', th: '* ขั้นต่ำ: ₩ 10,000; สูงสุด: ₩ 9,000,000 *' },
    'wd.cryptoAmountNote': { zh: '* 最低金額：₩ 100,000；最高金額：₩ 20,000,000 *', en: '* Minimum: ₩ 100,000; Maximum: ₩ 20,000,000 *', ko: '* 최소 금액: ₩ 100,000; 최대 금액: ₩ 20,000,000 *', th: '* ขั้นต่ำ: ₩ 100,000; สูงสุด: ₩ 20,000,000 *' },
    'wd.withdrawPassword': { zh: '提款密碼', en: 'Withdrawal Password', ko: '출금 비밀번호', th: 'รหัสผ่านถอนเงิน' },
    'wd.withdrawPasswordPlaceholder': { zh: '請輸入提款密碼', en: 'Please enter withdrawal password', ko: '출금 비밀번호를 입력해 주세요', th: 'กรุณากรอกรหัสผ่านถอนเงิน' },
    'wd.confirmWithdraw': { zh: '確認提款', en: 'Confirm Withdrawal', ko: '출금 확인', th: 'ยืนยันการถอนเงิน' },
    'wd.manageBankAccount': { zh: '銀行帳戶', en: 'Bank Account', ko: '은행 계좌', th: 'บัญชีธนาคาร' },
    'wd.registeredAccounts': { zh: '已登記提款帳戶', en: 'Registered Withdrawal Accounts', ko: '등록된 출금 계좌', th: 'บัญชีถอนเงินที่ลงทะเบียน' },
    'wd.addBankAccount': { zh: '新增銀行帳戶', en: 'Add Bank Account', ko: '은행 계좌 추가', th: 'เพิ่มบัญชีธนาคาร' },
    'wd.addCryptoWallet': { zh: '新增加密錢包地址', en: 'Add Crypto Wallet Address', ko: '암호화폐 지갑 주소 추가', th: 'เพิ่มที่อยู่กระเป๋าเงินคริปโต' },
    'wd.addAccount': { zh: '新增帳戶', en: 'Add Account', ko: '계좌 추가', th: 'เพิ่มบัญชี' },
    'wd.cryptoWalletAddressLabel': { zh: '加密錢包地址', en: 'crypto wallet address', ko: '암호화폐 지갑 주소', th: 'ที่อยู่กระเป๋าเงินคริปโต' },
    'wd.noAccountBoundOfGroup': { zh: '尚未綁定任何{group}。', en: 'No {group} bound yet.', ko: '아직 등록된 {group}가 없습니다.', th: 'ยังไม่ได้ผูก{group}' },
    'wd.noWithdrawAccountOfGroup': {
      zh: '尚未綁定{group}提款帳戶,請先至{link}',
      en: 'No {group} withdrawal account bound yet. Please {link}',
      ko: '아직 등록된 {group} 출금 계좌가 없습니다. 먼저 {link}',
      th: 'ยังไม่ได้ผูกบัญชีถอนเงิน{group} กรุณา{link}',
    },
    'wd.gotoAccounts': { zh: '前往「帳戶管理」新增', en: 'go to "Account Management" to add', ko: '"계정 관리"로 이동하여 추가', th: 'ไปที่ "จัดการบัญชี" เพื่อเพิ่ม' },
    'wd.myBankAccounts': { zh: '我的銀行帳戶', en: 'My Bank Accounts', ko: '내 은행 계좌', th: 'บัญชีธนาคารของฉัน' },
    'wd.myCryptoWallets': { zh: '我的加密錢包', en: 'My Crypto Wallets', ko: '내 암호화폐 지갑', th: 'กระเป๋าเงินคริปโตของฉัน' },
    'wd.groupBank': { zh: '銀行', en: 'bank', ko: '은행', th: 'ธนาคาร' },
    'wd.groupCrypto': { zh: '加密錢包', en: 'crypto wallet', ko: '암호화폐 지갑', th: 'กระเป๋าเงินคริปโต' },
    'wd.capReached': { zh: '已達提款帳戶數量上限（{cap} 筆），請先刪除不需要的帳戶。', en: 'Withdrawal account limit reached ({cap}). Please remove an unused account first.', ko: '출금 계좌 수 한도({cap}개)에 도달했습니다. 필요 없는 계좌를 먼저 삭제해 주세요.', th: 'ถึงขีดจำกัดบัญชีถอนเงิน ({cap} บัญชี) กรุณาลบบัญชีที่ไม่ใช้ก่อน' },
    'wd.addBankFieldsError': { zh: '請完整填寫銀行名稱、收款人姓名與銀行卡號。', en: 'Please fill in the bank name, recipient name, and bank card number.', ko: '은행명, 수취인 이름, 은행 카드 번호를 모두 입력해 주세요.', th: 'กรุณากรอกชื่อธนาคาร ชื่อผู้รับ และหมายเลขบัตรธนาคารให้ครบถ้วน' },
    'wd.addWalletFieldsError': { zh: '請填寫收款錢包地址。', en: 'Please fill in the receiving wallet address.', ko: '수신 지갑 주소를 입력해 주세요.', th: 'กรุณากรอกที่อยู่กระเป๋าเงินรับเงิน' },
    'wd.addFundPasswordError': { zh: '請輸入交易密碼。', en: 'Please enter the transaction password.', ko: '거래 비밀번호를 입력해 주세요.', th: 'กรุณากรอกรหัสผ่านการทำธุรกรรม' },
    'wd.addSuccessTitle': { zh: '新增成功', en: 'Added Successfully', ko: '추가 성공', th: 'เพิ่มสำเร็จ' },
    'wd.addSuccessMessage': { zh: '提款帳戶已新增，可於「提款」頁籤選用。', en: 'Withdrawal account added. You can select it on the "Withdraw" tab.', ko: '출금 계좌가 추가되었습니다. "출금" 탭에서 선택할 수 있습니다.', th: 'เพิ่มบัญชีถอนเงินแล้ว สามารถเลือกได้ที่แท็บ "ถอนเงิน"' },
    'wd.selectWalletTypeError': { zh: '請先選擇錢包類型。', en: 'Please select a wallet type first.', ko: '먼저 지갑 유형을 선택해 주세요.', th: 'กรุณาเลือกประเภทกระเป๋าเงินก่อน' },
    'wd.walletAddressError': { zh: '請先填寫收款錢包地址。', en: 'Please fill in the receiving wallet address first.', ko: '먼저 수신 지갑 주소를 입력해 주세요.', th: 'กรุณากรอกที่อยู่กระเป๋าเงินรับเงินก่อน' },
    'wd.withdrawPasswordError': { zh: '請先輸入提款密碼。', en: 'Please enter the withdrawal password first.', ko: '먼저 출금 비밀번호를 입력해 주세요.', th: 'กรุณากรอกรหัสผ่านถอนเงินก่อน' },
    'wd.withdrawSuccessTitle': { zh: '提款成功', en: 'Withdrawal Successful', ko: '출금 성공', th: 'ถอนเงินสำเร็จ' },
    'wd.withdrawSuccessMessage': { zh: '您的提款申請已送出，將於 1–24 小時內處理完成，請至「提款紀錄」查看進度。', en: 'Your withdrawal request has been submitted and will be processed within 1–24 hours. Please check "Withdrawal Record" for progress.', ko: '출금 신청이 제출되었습니다. 1~24시간 내에 처리됩니다. 진행 상황은 "출금 기록"에서 확인해 주세요.', th: 'ส่งคำขอถอนเงินแล้ว จะดำเนินการภายใน 1–24 ชั่วโมง กรุณาตรวจสอบความคืบหน้าที่ "บันทึกการถอนเงิน"' },

    'dp.channelA': { zh: '通道 A', en: 'Channel A', ko: '채널 A', th: 'ช่องทาง A' },
    'dp.channelB': { zh: '通道 B', en: 'Channel B', ko: '채널 B', th: 'ช่องทาง B' },
    'dp.channelC': { zh: '通道 C', en: 'Channel C', ko: '채널 C', th: 'ช่องทาง C' },
    'dp.channelD': { zh: '通道 D', en: 'Channel D', ko: '채널 D', th: 'ช่องทาง D' },
    'dp.depositAmount': { zh: '儲值金額', en: 'Deposit Amount', ko: '충전 금액', th: 'จำนวนเติมเงิน' },
    'dp.amountNote': { zh: '* 最低金額：₩ 10,000；最高金額：₩ 9,000,000 *', en: '* Minimum: ₩ 10,000; Maximum: ₩ 9,000,000 *', ko: '* 최소 금액: ₩ 10,000; 최대 금액: ₩ 9,000,000 *', th: '* ขั้นต่ำ: ₩ 10,000; สูงสุด: ₩ 9,000,000 *' },
    'dp.choosePromotion': { zh: '選擇優惠活動', en: 'Choose Promotion', ko: '프로모션 선택', th: 'เลือกโปรโมชั่น' },
    'dp.promo1': { zh: '新會員首存加碼 50%（不適用於 Evolution Gaming、Pragmatic Play 真人遊戲）', en: "New member's first deposit bonus 50% (not applicable to Evolution Gaming, Pragmatic Play live games)", ko: '신규 회원 첫 충전 보너스 50%(Evolution Gaming, Pragmatic Play 라이브 게임 미적용)', th: 'โบนัสฝากครั้งแรกสมาชิกใหม่ 50% (ไม่ใช้กับเกมสด Evolution Gaming, Pragmatic Play)' },
    'dp.noPromotion': { zh: '不使用優惠', en: 'No promotion', ko: '프로모션 사용 안 함', th: 'ไม่ใช้โปรโมชั่น' },
    'dp.confirmDeposit': { zh: '確認儲值', en: 'Confirm Deposit', ko: '충전 확인', th: 'ยืนยันการเติมเงิน' },
    'dp.successTitle': { zh: '儲值成功', en: 'Deposit Successful', ko: '충전 성공', th: 'เติมเงินสำเร็จ' },
    'dp.successMessage': { zh: '您的儲值申請已送出，請至「儲值紀錄」查看處理進度。', en: 'Your deposit request has been submitted. Please check "Deposit Record" for progress.', ko: '충전 신청이 제출되었습니다. 진행 상황은 "충전 기록"에서 확인해 주세요.', th: 'ส่งคำขอเติมเงินแล้ว กรุณาตรวจสอบความคืบหน้าที่ "บันทึกการเติมเงิน"' },
    'dp.receivingBank': { zh: '收款銀行', en: 'Receiving Bank', ko: '수취 은행', th: 'ธนาคารผู้รับ' },
    'dp.receivingAccount': { zh: '收款帳號', en: 'Receiving Account', ko: '수취 계좌', th: 'บัญชีผู้รับ' },
    'dp.depositAmountLabel': { zh: '儲值金額', en: 'Deposit Amount', ko: '충전 금액', th: 'จำนวนเติมเงิน' },
    'dp.transferNote': { zh: '完成轉帳後請點擊下方按鈕，系統將盡快為您確認入帳。', en: 'After completing the transfer, please click the button below. We will confirm your deposit as soon as possible.', ko: '송금을 완료한 후 아래 버튼을 클릭해 주세요. 최대한 빨리 입금을 확인해 드리겠습니다.', th: 'หลังจากโอนเงินแล้ว กรุณากดปุ่มด้านล่าง เราจะยืนยันการฝากเงินให้เร็วที่สุด' },
    'dp.transferDoneBtn': { zh: '我已完成轉帳', en: 'I Have Completed the Transfer', ko: '송금을 완료했습니다', th: 'ฉันโอนเงินเรียบร้อยแล้ว' },
    'dp.scanPayDesc': { zh: '請使用手機掃描下方 QR Code，或複製{label}完成付款。', en: 'Please scan the QR code below with your phone, or copy the {label} to complete payment.', ko: '휴대폰으로 아래 QR 코드를 스캔하거나 {label}을 복사하여 결제를 완료해 주세요.', th: 'กรุณาสแกน QR Code ด้านล่างด้วยมือถือ หรือคัดลอก{label}เพื่อชำระเงิน' },
    'dp.paymentUrl': { zh: '付款網址', en: 'Payment URL', ko: '결제 URL', th: 'URL การชำระเงิน' },
    'dp.receivingAddress': { zh: '收款地址', en: 'Receiving Address', ko: '수취 주소', th: 'ที่อยู่ผู้รับ' },
    'dp.copy': { zh: '複製', en: 'Copy', ko: '복사', th: 'คัดลอก' },
    'dp.copied': { zh: '已複製', en: 'Copied', ko: '복사됨', th: 'คัดลอกแล้ว' },
    'dp.qrDemoNote': { zh: '此為示意用 QR Code 與{label}，僅供介面展示。', en: 'This QR code and {label} are for interface demonstration purposes only.', ko: '이 QR 코드와 {label}은 인터페이스 시연 용도로만 제공됩니다.', th: 'QR Code และ{label}นี้ใช้เพื่อสาธิตอินเทอร์เฟซเท่านั้น' },
    'dp.paymentDoneBtn': { zh: '我已完成付款', en: 'I Have Completed the Payment', ko: '결제를 완료했습니다', th: 'ฉันชำระเงินเรียบร้อยแล้ว' },
    'dp.transferInfoTitle': { zh: '轉帳資訊', en: 'Transfer Information', ko: '송금 정보', th: 'ข้อมูลการโอนเงิน' },
    'dp.scanPayTitle': { zh: '掃碼付款', en: 'Scan to Pay', ko: 'QR 결제', th: 'สแกนเพื่อจ่าย' },

    'acct.editNickname': { zh: '編輯暱稱', en: 'Edit Nickname', ko: '닉네임 수정', th: 'แก้ไขชื่อเล่น' },
    'acct.currentBalance': { zh: '目前餘額', en: 'Current Balance', ko: '현재 잔액', th: 'ยอดเงินปัจจุบัน' },
    'acct.joinDate': { zh: '加入時間', en: 'Join Date', ko: '가입일', th: 'วันที่เข้าร่วม' },
    'acct.remainingTurnover': { zh: '剩餘打碼量', en: 'Remaining Turnover', ko: '남은 유효 베팅액', th: 'ยอดหมุนที่เหลือ' },
    'acct.levelProgress': { zh: '會員獎勵進度 · 第 27 天，03:26', en: 'Membership Rewards Progress · Day 27, 03:26', ko: '멤버십 리워드 진행률 · 27일차, 03:26', th: 'ความคืบหน้ารางวัลสมาชิก · วันที่ 27, 03:26' },
    'acct.current': { zh: '目前：', en: 'Current: ', ko: '현재: ', th: 'ปัจจุบัน: ' },
    'acct.unranked': { zh: '未排名', en: 'Unranked', ko: '순위 없음', th: 'ยังไม่มีระดับ' },
    'acct.nextLevel': { zh: '下一級：', en: 'Next Level: ', ko: '다음 등급: ', th: 'ระดับต่อไป: ' },
    'acct.bronze': { zh: '銅級', en: 'Bronze', ko: '브론즈', th: 'บรอนซ์' },
    'acct.depositNow': { zh: '立即儲值', en: 'Deposit Now', ko: '지금 충전', th: 'เติมเงินทันที' },
    'acct.requestWithdrawal': { zh: '申請提款', en: 'Request Withdrawal', ko: '출금 신청', th: 'ขอถอนเงิน' },
    'acct.bankAccounts': { zh: '銀行帳戶', en: 'Bank Accounts', ko: '은행 계좌', th: 'บัญชีธนาคาร' },
    'acct.quickLinks': { zh: '快速捷徑', en: 'Quick Links', ko: '빠른 링크', th: 'ลิงก์ด่วน' },

    'quickRail.message': { zh: '留言', en: 'Message', ko: '메시지', th: 'ข้อความ' },
    'quickRail.scan': { zh: '掃碼', en: 'Scan', ko: '스캔', th: 'สแกน' },
    'nav.menuLabel': { zh: '選單', en: 'Menu', ko: '메뉴', th: 'เมนู' },
    'mobileTabbar.ariaLabel': { zh: '快捷選單', en: 'Quick Menu', ko: '빠른 메뉴', th: 'เมนูด่วน' },

    'pi.nickname': { zh: '暱稱', en: 'Nickname', ko: '닉네임', th: 'ชื่อเล่น' },
    'pi.birthday': { zh: '生日', en: 'Birthday', ko: '생일', th: 'วันเกิด' },
    'pi.email': { zh: 'Email', en: 'Email', ko: '이메일', th: 'อีเมล' },
    'pi.realName': { zh: '真實姓名', en: 'Real Name', ko: '실명', th: 'ชื่อจริง' },
    'pi.phone': { zh: '手機號碼', en: 'Phone Number', ko: '휴대폰 번호', th: 'หมายเลขโทรศัพท์' },
    'pi.edit': { zh: '編輯', en: 'Edit', ko: '수정', th: 'แก้ไข' },

    'sec.personalInfoTitle': { zh: '個人資料', en: 'Personal Info', ko: '개인 정보', th: 'ข้อมูลส่วนตัว' },
    'sec.personalInfoDesc': { zh: '管理您的個人基本資料', en: 'Manage your basic personal information', ko: '개인 기본 정보를 관리하세요', th: 'จัดการข้อมูลส่วนตัวพื้นฐานของคุณ' },
    'sec.changeLoginPwTitle': { zh: '修改登入密碼', en: 'Change Login Password', ko: '로그인 비밀번호 변경', th: 'เปลี่ยนรหัสผ่านเข้าสู่ระบบ' },
    'sec.changeLoginPwDesc': { zh: '定期更換密碼以確保帳戶安全', en: 'Change your password regularly to keep your account secure', ko: '계정 보안을 위해 정기적으로 비밀번호를 변경하세요', th: 'เปลี่ยนรหัสผ่านเป็นประจำเพื่อความปลอดภัยของบัญชี' },
    'sec.changeFundPwTitle': { zh: '修改交易密碼', en: 'Change Transaction Password', ko: '거래 비밀번호 변경', th: 'เปลี่ยนรหัสผ่านการทำธุรกรรม' },
    'sec.changeFundPwDesc': { zh: '提款與敏感操作使用的獨立密碼', en: 'A separate password used for withdrawals and sensitive operations', ko: '출금 및 민감한 작업에 사용되는 별도의 비밀번호', th: 'รหัสผ่านแยกสำหรับการถอนเงินและการดำเนินการที่สำคัญ' },
    'sec.notSet': { zh: '未設定 ›', en: 'Not Set ›', ko: '설정되지 않음 ›', th: 'ยังไม่ตั้งค่า ›' },
    'sec.logoutTitle': { zh: '登出', en: 'Logout', ko: '로그아웃', th: 'ออกจากระบบ' },
    'sec.logoutDesc': { zh: '安全登出目前的帳戶', en: 'Securely log out of your current account', ko: '현재 계정에서 안전하게 로그아웃합니다', th: 'ออกจากระบบบัญชีปัจจุบันอย่างปลอดภัย' },

    'cp.currentPassword': { zh: '目前密碼', en: 'Current Password', ko: '현재 비밀번호', th: 'รหัสผ่านปัจจุบัน' },
    'cp.currentPasswordPlaceholder': { zh: '請輸入目前密碼', en: 'Please enter current password', ko: '현재 비밀번호를 입력해 주세요', th: 'กรุณากรอกรหัสผ่านปัจจุบัน' },
    'cp.newPassword': { zh: '新密碼', en: 'New Password', ko: '새 비밀번호', th: 'รหัสผ่านใหม่' },
    'cp.newPasswordPlaceholder': { zh: '5-16 個字元', en: '5-16 characters', ko: '5-16자', th: '5-16 ตัวอักษร' },
    'cp.confirmNewPassword': { zh: '確認新密碼', en: 'Confirm New Password', ko: '새 비밀번호 확인', th: 'ยืนยันรหัสผ่านใหม่' },
    'cp.confirmNewPasswordPlaceholder': { zh: '請再次輸入新密碼', en: 'Please re-enter new password', ko: '새 비밀번호를 다시 입력해 주세요', th: 'กรุณากรอกรหัสผ่านใหม่อีกครั้ง' },
    'cp.confirmChange': { zh: '確認修改', en: 'Confirm Change', ko: '변경 확인', th: 'ยืนยันการเปลี่ยนแปลง' },
    'cp.hint': { zh: '修改成功後將自動登出，請使用新密碼重新登入。', en: 'You will be automatically logged out after a successful change. Please log in again with your new password.', ko: '변경에 성공하면 자동으로 로그아웃됩니다. 새 비밀번호로 다시 로그인해 주세요.', th: 'ระบบจะออกจากระบบให้อัตโนมัติหลังเปลี่ยนสำเร็จ กรุณาเข้าสู่ระบบใหม่ด้วยรหัสผ่านใหม่' },

    'record.startDate': { zh: '開始日期', en: 'Start Date', ko: '시작일', th: 'วันที่เริ่มต้น' },
    'record.endDate': { zh: '結束日期', en: 'End Date', ko: '종료일', th: 'วันที่สิ้นสุด' },
    'record.to': { zh: '至', en: 'to', ko: '~', th: 'ถึง' },
    'record.search': { zh: '查詢', en: 'Search', ko: '조회', th: 'ค้นหา' },

    'record.orderNo': { zh: '訂單編號', en: 'Order No.', ko: '주문 번호', th: 'หมายเลขคำสั่ง' },
    'record.game': { zh: '遊戲', en: 'Game', ko: '게임', th: 'เกม' },
    'record.settleTime': { zh: '結算時間', en: 'Settlement Time', ko: '정산 시간', th: 'เวลาชำระบัญชี' },
    'record.betAmount': { zh: '投注金額', en: 'Bet Amount', ko: '베팅 금액', th: 'จำนวนเดิมพัน' },
    'record.validBet': { zh: '有效投注', en: 'Valid Bet', ko: '유효 베팅', th: 'เดิมพันที่นับ' },
    'record.payoutAmount': { zh: '派彩金額', en: 'Payout Amount', ko: '지급 금액', th: 'จำนวนเงินที่จ่าย' },
    'record.winLoss': { zh: '輸贏', en: 'Win/Loss', ko: '승패', th: 'ผลแพ้ชนะ' },

    'record.txNo': { zh: '交易編號', en: 'Transaction No.', ko: '거래 번호', th: 'หมายเลขธุรกรรม' },
    'record.requestTime': { zh: '申請時間', en: 'Request Time', ko: '신청 시간', th: 'เวลาที่ขอ' },
    'record.depositAmount': { zh: '儲值金額', en: 'Deposit Amount', ko: '충전 금액', th: 'จำนวนเติมเงิน' },
    'record.status': { zh: '狀態', en: 'Status', ko: '상태', th: 'สถานะ' },
    'record.method': { zh: '方式', en: 'Method', ko: '방법', th: 'วิธีการ' },
    'record.bankRef': { zh: '銀行參考碼', en: 'Bank Reference', ko: '은행 참조 번호', th: 'รหัสอ้างอิงธนาคาร' },
    'record.completeTime': { zh: '完成時間', en: 'Completion Time', ko: '완료 시간', th: 'เวลาที่เสร็จสิ้น' },
    'record.remark': { zh: '備註', en: 'Remark', ko: '비고', th: 'หมายเหตุ' },
    'record.withdrawAmount': { zh: '提款金額', en: 'Withdrawal Amount', ko: '출금 금액', th: 'จำนวนถอนเงิน' },
    'record.bankName': { zh: '銀行名稱', en: 'Bank Name', ko: '은행명', th: 'ชื่อธนาคาร' },
    'record.completeDate': { zh: '完成日期', en: 'Completion Date', ko: '완료일', th: 'วันที่เสร็จสิ้น' },

    'record.txType': { zh: '交易類型', en: 'Transaction Type', ko: '거래 유형', th: 'ประเภทธุรกรรม' },
    'record.time': { zh: '時間', en: 'Time', ko: '시간', th: 'เวลา' },
    'record.txAmount': { zh: '交易金額', en: 'Transaction Amount', ko: '거래 금액', th: 'จำนวนเงินธุรกรรม' },
    'record.currentBalance': { zh: '目前餘額', en: 'Current Balance', ko: '현재 잔액', th: 'ยอดเงินปัจจุบัน' },
    'record.content': { zh: '內容', en: 'Description', ko: '내용', th: 'รายละเอียด' },

    'record.gameType': { zh: '遊戲類型', en: 'Game Type', ko: '게임 유형', th: 'ประเภทเกม' },
    'record.totalWinLoss': { zh: '總輸贏', en: 'Total Win/Loss', ko: '총 승패', th: 'ผลแพ้ชนะทั้งหมด' },
    'record.rebate': { zh: '返水', en: 'Rebate', ko: '캐시백', th: 'เงินคืน' },

    'record.date': { zh: '日期', en: 'Date', ko: '날짜', th: 'วันที่' },
    'record.type': { zh: '類型', en: 'Type', ko: '유형', th: 'ประเภท' },
    'record.gameName': { zh: '遊戲名稱', en: 'Game Name', ko: '게임 이름', th: 'ชื่อเกม' },
    'record.activityName': { zh: '活動名稱', en: 'Activity Name', ko: '이벤트 이름', th: 'ชื่อกิจกรรม' },
    'record.depositTurnover': { zh: '儲值流水', en: 'Deposit Turnover', ko: '충전 유효 베팅액', th: 'ยอดหมุนเงินฝาก' },
    'record.bonusTurnover': { zh: '獎金流水', en: 'Bonus Turnover', ko: '보너스 유효 베팅액', th: 'ยอดหมุนโบนัส' },
    'record.progress': { zh: '進度', en: 'Progress', ko: '진행률', th: 'ความคืบหน้า' },

    'record.statusCompleted': { zh: '已完成', en: 'Completed', ko: '완료됨', th: 'เสร็จสมบูรณ์' },
    'record.statusProcessing': { zh: '處理中', en: 'Processing', ko: '처리 중', th: 'กำลังดำเนินการ' },
    'record.statusRejected': { zh: '已拒絕', en: 'Rejected', ko: '거부됨', th: 'ถูกปฏิเสธ' },

    'game.sport': { zh: '體育', en: 'Sports', ko: '스포츠', th: 'กีฬา' },
    'game.slot': { zh: '老虎機', en: 'Slots', ko: '슬롯', th: 'สล็อต' },
    'game.live': { zh: '真人娛樂', en: 'Live Casino', ko: '라이브 카지노', th: 'คาสิโนสด' },
    'game.fish': { zh: '捕魚達人', en: 'Fishing Master', ko: '낚시의 달인', th: 'เซียนยิงปลา' },

    'tx.deposit': { zh: '儲值', en: 'Deposit', ko: '충전', th: 'เติมเงิน' },
    'tx.bet': { zh: '投注', en: 'Bet', ko: '베팅', th: 'เดิมพัน' },
    'tx.payout': { zh: '派彩', en: 'Payout', ko: '지급', th: 'จ่ายเงิน' },
    'tx.withdrawal': { zh: '提款', en: 'Withdrawal', ko: '출금', th: 'ถอนเงิน' },
    'tx.bonus': { zh: '彩金', en: 'Bonus', ko: '보너스', th: 'โบนัส' },

    'acct.joinDateValue': { zh: '2025 年 8 月', en: 'August 2025', ko: '2025년 8월', th: 'สิงหาคม 2025' },

    'remark.firstDepositBonus50': { zh: '首存加碼 50%', en: 'First Deposit Bonus 50%', ko: '첫 충전 보너스 50%', th: 'โบนัสฝากครั้งแรก 50%' },
    'remark.turnoverNotMet': { zh: '打碼量未達標', en: 'Turnover requirement not met', ko: '유효 베팅액 미달성', th: 'ไม่ถึงยอดหมุนที่กำหนด' },

    'remark.firstDepositBonus100': { zh: '首存加碼100%', en: 'First Deposit Bonus 100%', ko: '첫 충전 보너스 100%', th: 'โบนัสฝากครั้งแรก 100%' },
    'remark.wedDeposit10': { zh: '週三存款贈10%', en: 'Wednesday Deposit Bonus 10%', ko: '수요일 충전 보너스 10%', th: 'โบนัสฝากวันพุธ 10%' },
    'remark.weekendRebate5': { zh: '週末返水5%', en: 'Weekend Rebate 5%', ko: '주말 캐시백 5%', th: 'เงินคืนวันหยุดสุดสัปดาห์ 5%' },
    'remark.depositFullGift': { zh: '儲值滿額禮', en: 'Deposit Milestone Gift', ko: '충전 목표 달성 선물', th: 'ของขวัญเติมเงินครบยอด' },
    'remark.vipBonus': { zh: 'VIP專屬彩金', en: 'VIP Exclusive Bonus', ko: 'VIP 전용 보너스', th: 'โบนัสพิเศษ VIP' },
    'remark.birthdayGift': { zh: '生日禮金', en: 'Birthday Gift', ko: '생일 선물', th: 'ของขวัญวันเกิด' },
    'remark.dailyCheckIn': { zh: '每日簽到禮', en: 'Daily Check-in Gift', ko: '매일 출석 선물', th: 'ของขวัญเช็คอินรายวัน' },
    'remark.referralBonus': { zh: '邀請好友獎金', en: 'Referral Bonus', ko: '친구 추천 보너스', th: 'โบนัสแนะนำเพื่อน' },
    'remark.sunDeposit': { zh: '週日充值贈', en: 'Sunday Deposit Bonus', ko: '일요일 충전 보너스', th: 'โบนัสฝากวันอาทิตย์' },

    'acctRecord.bankCardDeposit': { zh: '銀行卡儲值', en: 'Bank Card Deposit', ko: '은행 카드 충전', th: 'เติมเงินด้วยบัตรธนาคาร' },
    'acctRecord.sportsBet': { zh: '體育投注', en: 'Sports Bet', ko: '스포츠 베팅', th: 'เดิมพันกีฬา' },
    'acctRecord.sportsPayout': { zh: '體育派彩', en: 'Sports Payout', ko: '스포츠 지급', th: 'จ่ายเงินกีฬา' },
    'acctRecord.bankCardWithdrawal': { zh: '銀行卡提款', en: 'Bank Card Withdrawal', ko: '은행 카드 출금', th: 'ถอนเงินด้วยบัตรธนาคาร' },
  };

  function getLocale() {
    var saved;
    try { saved = localStorage.getItem(LOCALE_KEY); } catch (e) { saved = null; }
    return LOCALES.some(function (l) { return l.id === saved; }) ? saved : DEFAULT_LOCALE;
  }
  function setLocale(id) {
    if (!LOCALES.some(function (l) { return l.id === id; })) return;
    try { localStorage.setItem(LOCALE_KEY, id); } catch (e) {}
    applyLocale();
  }
  function t(key) {
    var entry = STRINGS[key];
    if (!entry) return key;
    var locale = getLocale();
    return entry[locale] || entry[DEFAULT_LOCALE] || key;
  }

  function applyLocale() {
    var locale = getLocale();
    document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-Hant' : locale);
    Array.prototype.slice.call(document.querySelectorAll('[data-i18n]')).forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-i18n-placeholder]')).forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-i18n-aria]')).forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    var currentLabelEls = document.querySelectorAll('[data-lang-current]');
    Array.prototype.slice.call(currentLabelEls).forEach(function (el) {
      var found = LOCALES.filter(function (l) { return l.id === locale; })[0];
      el.textContent = found ? found.label : locale;
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-lang-option]')).forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang-option') === locale);
    });
    // 讓 site.js 重繪目前已掛載的動態區塊（header-auth 等）跟著換語系；
    // 尚未開啟的彈窗/選單本來就會在下次渲染時透過 t() 取得當前語系,不需另外處理。
    document.dispatchEvent(new CustomEvent('cms-v4:locale-changed', { detail: { locale: locale } }));
  }

  function closeLangMenu(root) {
    var menu = root.querySelector('[data-lang-menu]');
    var trigger = root.querySelector('[data-lang-trigger]');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
  function initLangSwitcher() {
    Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (root) {
      var trigger = root.querySelector('[data-lang-trigger]');
      var menu = root.querySelector('[data-lang-menu]');
      if (!trigger || !menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !menu.hidden;
        // 同一頁可能有桌機/手機兩份切換器,開一個要把其他關起來。
        Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (r) { closeLangMenu(r); });
        menu.hidden = isOpen;
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
      Array.prototype.slice.call(menu.querySelectorAll('[data-lang-option]')).forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          setLocale(btn.getAttribute('data-lang-option'));
          closeLangMenu(root);
        });
      });
    });
    document.addEventListener('click', function () {
      Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (r) { closeLangMenu(r); });
    });
  }

  window.CMS_I18N = { t: t, getLocale: getLocale, setLocale: setLocale, LOCALES: LOCALES, applyLocale: applyLocale };

  document.addEventListener('DOMContentLoaded', function () {
    applyLocale();
    initLangSwitcher();
  });
})();
