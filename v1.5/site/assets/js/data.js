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
      'auth.username': '사용자명',
      'auth.usernamePlaceholder': '이름을 입력해 주세요',
      'auth.password': '비밀번호',
      'auth.passwordPlaceholder': '비밀번호를 입력해 주세요',
      'auth.confirmPassword': '비밀번호 확인',
      'auth.newPassword': '새 비밀번호',
      'auth.newPasswordPlaceholder': '새 비밀번호를 입력해 주세요',
      'auth.email': '이메일',
      'auth.emailPlaceholder': '이메일을 입력해 주세요',
      'auth.realName': '실명',
      'auth.realNamePlaceholder': '실명을 입력해 주세요',
      'auth.mobile': '휴대폰 번호',
      'auth.mobilePlaceholder': '휴대폰 번호를 입력해 주세요',
      'auth.birthday': '생년월일',
      'auth.birthdayPlaceholder': '생년월일을 입력해 주세요',
      'auth.invitationCode': '초대 코드',
      'auth.invitationCodePlaceholder': '초대 코드를 입력해 주세요',
      'auth.captcha': '캡차',
      'auth.captchaPlaceholder': '캡차를 입력해 주세요',
      'auth.agreeTerms': '만 18세 이상이며 이용 약관에 동의합니다',
      'auth.remember': '기억하기',
      'auth.forgotPassword': '비밀번호를 잊으셨나요',
      'auth.forgotPasswordSent': '비밀번호 재설정을 위해 이메일을 확인해 주세요.',
      'auth.loginSuccess': '로그인 성공',
      'auth.registerSuccess': '회원가입 성공',
      'auth.resetPassword': '비밀번호 변경',
      'auth.promotionChannel': '프로모션 채널',
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
      'userCenter.accountOverview': '나의 계정',
      'userCenter.nickname': '닉네임',
      'userCenter.bankingDetails': '결제 정보',
      'userCenter.personalInfo': '개인 정보',
      'userCenter.recentTransactions': '최근 거래',
      'userCenter.viewMoreRecords': '더 많은 기록 보기',
      'userCenter.rollover.title': '롤링',
      'userCenter.rollover.remainingTurnoverAmount': '남은 유효 베팅 금액:',
      'userCenter.securityCenterPage.completeProfile': '개인 정보를 완료하세요',
      'userCenter.securityCenterPage.notSet': '미설정',
      'userCenter.securityCenterPage.set': '설정',
      'userCenter.securityCenterPage.recommendAlphaNum': '영문과 숫자 조합을 권장합니다',
      'userCenter.securityCenterPage.setTxnPasswordTip': '자금 보안을 위해 거래 비밀번호를 설정하세요',
      'userCenter.securityCenterPage.logout': '로그아웃',
      'userCenter.securityCenterPage.logoutSafely': '안전하게 로그아웃',
      'userCenter.changePassword.changeLogin': '로그인 비밀번호 변경',
      'userCenter.changePassword.changeTransaction': '거래 비밀번호 변경',
      'userCenter.depositPage.depositAmount': '입금 금액',
      'userCenter.depositPage.choosePromotion': '프로모션 선택',
      'userCenter.depositPage.promotions': '프로모션',
      'userCenter.depositPage.noPromotion': '프로모션에 참여하지 않습니다',
      'userCenter.depositPage.limitNote': '＊최소 금액: ₩ {min}、최대 금액: ₩ {max}＊',
      'userCenter.withdrawalPage.myBankAccounts': '나의 은행 계좌',
      'userCenter.withdrawalPage.emptyBankAccount': '등록된 계좌가 없습니다',
      'userCenter.withdrawalPage.addAccount': '계좌 추가',
      'userCenter.withdrawalPage.refresh': '새로고침',
      'userCenter.withdrawalPage.main': '메인',
      'userCenter.withdrawalPage.wallet': '지갑',
      'userCenter.withdrawalPage.withdrawalAmountAndPassword': '출금 금액 및 비밀번호',
      'userCenter.withdrawalPage.accountNumber': '계좌 번호',
      'userCenter.withdrawalPage.bindDate': '등록일',
      'userCenter.withdrawalPage.remainingTurnoverAmount': '*남은 유효 베팅 금액: ₩ ',
      'userCenter.withdrawalPage.requiredTurnoverAmount': '필요 유효 베팅 금액',
      'userCenter.withdrawalAmount': '출금 금액',
      'userCenter.depositAmount': '입금 금액',
      'userCenter.transactionDetails': '거래 상세',
      'userCenter.withdrawalAccount': '출금 계좌',
      'userCenter.depositAccount': '입금 계좌',
      'userCenter.transactionDescription': "송금이 완료되면 아래의 '완료' 버튼을 눌러 주세요. 궁금한 점이 있으시면 언제든지 고객센터로 문의해 주세요.",
      'userCenter.customerService': '고객센터',
      'userCenter.withdrawalPromotions': '출금 프로모션',
      'userCenter.depositPromotions': '입금 프로모션',
      'userCenter.receivedAmount': '실수령 금액',
      'userCenter.bonus': '보너스',
      'userCenter.withdrawalInfo': '출금 정보',
      'userCenter.depositInfo': '입금 정보',
      'common.gotIt': '확인',
      'common.success': '성공!',
      'common.error': '오류!',
      'common.warning': '경고',
      'common.cancel': '취소',
      'common.submit': '제출',
      'common.complete': '완료',
      'common.back': '뒤로',
      'common.detail': '상세 정보',
      'common.done': '완료',
      'common.depositSuccess': '입금이 완료되었습니다!',
      'common.withdrawalSuccess': '출금 신청이 완료되었습니다!',
      'userCenter.accountRecord.title': '계정 기록',
      'userCenter.withdrawalRecord.title': '출금 기록',
      'userCenter.common.headers.date': '날짜',
      'userCenter.common.headers.time': '시간',
      'userCenter.common.headers.status': '상태',
      'userCenter.common.headers.method': '방법',
      'userCenter.common.headers.transactionNo': '거래 번호',
      'userCenter.common.headers.datetime': '일시',
      'userCenter.common.headers.requestTime': '요청 시간',
      'userCenter.common.headers.depositAmountHeader': '입금 금액',
      'userCenter.common.headers.requestAmountHeader': '요청 금액',
      'userCenter.common.headers.paidAmountHeader': '지급 금액',
      'userCenter.common.headers.bankName': '은행명',
      'userCenter.common.headers.paidDate': '지급 일자',
      'userCenter.common.headers.bankReference': '은행 참고 번호',
      'userCenter.common.headers.depositedTime': '입금 완료 시간',
      'userCenter.common.headers.bankCharge': '은행 수수료',
      'userCenter.common.headers.promotionHeader': '프로모션',
      'userCenter.common.headers.remarkHeader': '비고',
      'userCenter.common.headers.orderNo': '주문번호',
      'userCenter.common.headers.game': '게임',
      'userCenter.common.headers.betAmount': '베팅 금액',
      'userCenter.common.headers.settlementTime': '정산 시간',
      'userCenter.common.headers.gameType': '게임 종류',
      'userCenter.common.headers.totalProfitAndLoss': '총 손익',
      'userCenter.common.headers.bonus': '보너스',
      'userCenter.common.headers.betting': '베팅',
      'userCenter.common.headers.validBet': '유효 베팅',
      'userCenter.common.headers.winAmount': '당첨 금액',
      'userCenter.common.headers.betPL': '베팅 손익',
      'userCenter.common.headers.rebate': '리베이트',
      'userCenter.common.headers.transactionType': '거래 유형',
      'userCenter.common.headers.transactionAmount': '거래 금액',
      'userCenter.common.headers.currentBalance': '현재 잔액',
      'userCenter.common.headers.content': '내용',
      'userCenter.common.headers.result': '결과',
      'userCenter.common.headers.proceed': '계속하기',
      'userCenter.common.selectList.all': '전체',
      'userCenter.common.selectList.pending': '대기',
      'userCenter.common.selectList.approved': '승인',
      'userCenter.common.selectList.rejected': '거부',
      'userCenter.common.footer.totalDepositAmount': '총 입금 금액',
      'userCenter.common.footer.totalWithdrawalAmount': '총 출금 금액',
      'userCenter.common.tags.status': '상태',
      'userCenter.common.tags.time': '시간',
      'userCenter.common.autoRefresh.in': '자동 갱신까지',
      'userCenter.common.autoRefresh.secondsShort': '초',
      'userCenter.withdrawalDetailPage.title': '출금 상세 정보',
      'userCenter.withdrawalDetailPage.activityName': '이벤트 이름',
      'userCenter.withdrawalDetailPage.depositRollover': '입금 롤오버',
      'userCenter.withdrawalDetailPage.bonusRollover': '보너스 롤오버',
      'userCenter.withdrawalDetailPage.progress': '진행 상황',
      'userCenter.withdrawalDetailPage.category.1': '입금 프로모션',
      'userCenter.withdrawalDetailPage.category.2': '일반 입금',
      'userCenter.withdrawalDetailPage.category.3': '조정',
      'userCenter.withdrawalDetailPage.category.4': '프로모션 캠페인',
      'common.confirm': '확인',
      'common.type': '유형',
      'userCenter.personalInfoPage.username': '사용자명',
      'userCenter.personalInfoPage.nicknamePlaceholder': '닉네임을 입력해 주세요',
      'userCenter.personalInfoPage.privacyCta': '개인 정보 보호에 최선을 다합니다',
      'userCenter.personalInfoPage.privacyNoteLine1': '모든 사용자 데이터는 암호화되어 개인 정보가 안전하게 보호됩니다.',
      'userCenter.personalInfoPage.privacyNoteLine2': '개인 정보 수정이 필요한 경우 고객센터로 문의해 주세요.',
      'userCenter.personalInfoPage.submit': '제출',
      'userCenter.bankingDetailsPage.emptyBankAccount': '은행 계좌 없음',
      'userCenter.bankingDetailsPage.addAccount': '계좌 추가',
      'userCenter.bankingDetailsPage.activeBankAccount': '활성 은행 계좌',
      'userCenter.bankingDetailsPage.bank': '은행',
      'userCenter.bankingDetailsPage.bankInformation': '은행 정보',
      'userCenter.bankingDetailsPage.searchABank': '은행 검색',
      'userCenter.bankingDetailsPage.enterCardNumber': '카드 번호를 입력해 주세요',
      'userCenter.bankingDetailsPage.transactionPassword': '거래 비밀번호',
      'userCenter.bankingDetailsPage.fillTransactionPassword': '거래 비밀번호를 입력해 주세요',
      'userCenter.bankingDetailsPage.chooseABank': '은행 선택',
      'userCenter.securityCenterPage.lastLogin': '마지막 로그인',
      'userCenter.securityCenterPage.time': '시간',
      'userCenter.securityCenterPage.ipAddress': 'IP 주소',
      'userCenter.securityCenterPage.securitySetting': '보안 설정',
      'userCenter.securityCenterPage.bankAccountNumber': '은행 계좌 번호',
      'userCenter.changePassword.currentPlaceholder': '현재 비밀번호를 입력해 주세요',
      'userCenter.changePassword.newPlaceholder': '새 비밀번호를 입력해 주세요',
      'userCenter.changePassword.confirmPlaceholder': '새 비밀번호 확인',
      'userCenter.changePassword.ruleHint': '6~16자의 영문과 숫자만 사용할 수 있습니다.',
      'userCenter.changePassword.ruleHintLogin': '6~16자의 영문과 숫자만 사용할 수 있습니다.',
      'userCenter.changePassword.lengthInvalid': '비밀번호 길이는 6~16자여야 합니다.',
      'userCenter.changePassword.confirmInvalid': '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      'userCenter.changePassword.patternInvalidLogin': '비밀번호는 영문과 숫자만 사용할 수 있습니다.',
      'userCenter.changePassword.success': '비밀번호가 성공적으로 변경되었습니다.',
      'common.profileUpdateSuccess': '프로필이 성공적으로 업데이트되었습니다.',
      'common.bankCardAddedSuccess': '은행 카드가 성공적으로 추가되었습니다',
      'common.search': '검색',
      'common.gameName': '게임 이름',
      'common.vendorName': '공급업체명',
      'common.readMore': '더보기',
      'common.noData': '데이터 없음',
      'common.openingGame': '새 창에서 게임을 여는 중입니다...',
      'gameType.options.vendor': '공급업체',
      'gameType.options.favorites': '즐겨찾기',
      'gameList.options.all': '전체 게임',
      'gameList.options.favorite': '즐겨찾기',
      'promotionList.categories.all': '전체',
      'promotionList.categories.slot': '슬롯',
      'promotionList.categories.live': '라이브',
      'promotionList.categories.sports': '스포츠',
      'promotionList.categories.new': '신규',
      'about.title': '회사 소개',
      'about.tabs.support': '고객센터',
      'about.tabs.notice': '공지',
      'about.tabs.about': '소개',
      'about.tabs.privacy': '개인정보',
      'about.tabs.info': '정보',
      'about.tabs.addiction': '과몰입 방지',
      'about.tabs.rules': '규정',
      'about.tabs.faq': '자주 묻는 질문',
      'navbar.top.poker': '포커',
      'navbar.top.esports': 'E-스포츠',
      'navbar.top.lottery': '로또',
      'navbar.bottom.pointmall': '포인트몰',
      'navbar.bottom.bonus': '보너스',
      'navbar.bottom.share': '공유',
      'hotGame.gameName': 'Game Name',
      'hotGame.creativeGaming': 'Creative Gaming',
      'hotGame.specialOffer': 'SPECIAL OFFER',
      'hotGame.promoDateRange': 'Thursday-Tuesday, times vary',
      'hotGame.promotion1': 'Promotion 1',
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
      'auth.username': 'Username',
      'auth.usernamePlaceholder': 'Enter your name',
      'auth.password': 'Password',
      'auth.passwordPlaceholder': 'Enter your password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.newPassword': 'New Password',
      'auth.newPasswordPlaceholder': 'Enter your new password',
      'auth.email': 'Email',
      'auth.emailPlaceholder': 'Enter your email',
      'auth.realName': 'Real Name',
      'auth.realNamePlaceholder': 'Enter your real name',
      'auth.mobile': 'Mobile Number',
      'auth.mobilePlaceholder': 'Enter your mobile number',
      'auth.birthday': 'Birthday',
      'auth.birthdayPlaceholder': 'Enter your birthday',
      'auth.invitationCode': 'Invitation Code',
      'auth.invitationCodePlaceholder': 'Enter your invitation code',
      'auth.captcha': 'Captcha',
      'auth.captchaPlaceholder': 'Enter a captcha',
      'auth.agreeTerms': 'I’m 18+ and agree to the Terms of Use',
      'auth.remember': 'Remember',
      'auth.forgotPassword': 'Forgot password',
      'auth.forgotPasswordSent': 'Please check your email to reset your password.',
      'auth.loginSuccess': 'Login successful',
      'auth.registerSuccess': 'Registration successful',
      'auth.resetPassword': 'Change Password',
      'auth.promotionChannel': 'Promotion Channel',
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
      'userCenter.accountOverview': 'Account Overview',
      'userCenter.nickname': 'Nickname',
      'userCenter.bankingDetails': 'Banking Details',
      'userCenter.personalInfo': 'Personal Info',
      'userCenter.recentTransactions': 'Recent Transactions',
      'userCenter.viewMoreRecords': 'View More Records',
      'userCenter.rollover.title': 'Rollover',
      'userCenter.rollover.remainingTurnoverAmount': 'Remaining Turnover Amount:',
      'userCenter.securityCenterPage.completeProfile': 'Complete your personal profile',
      'userCenter.securityCenterPage.notSet': 'Not Set',
      'userCenter.securityCenterPage.set': 'Set',
      'userCenter.securityCenterPage.recommendAlphaNum': 'Recommended letter and number combination',
      'userCenter.securityCenterPage.setTxnPasswordTip': 'Set a password to improve the security of fund operations',
      'userCenter.securityCenterPage.logout': 'Logout',
      'userCenter.securityCenterPage.logoutSafely': 'Logout safely',
      'userCenter.changePassword.changeLogin': 'Change Login Password',
      'userCenter.changePassword.changeTransaction': 'Change Transaction Password',
      'userCenter.depositPage.depositAmount': 'Deposit Amount',
      'userCenter.depositPage.choosePromotion': 'Choose promotion',
      'userCenter.depositPage.promotions': 'Promotions',
      'userCenter.depositPage.noPromotion': 'Do not participate in any promotions',
      'userCenter.depositPage.limitNote': 'Minimum Amount : ₩ {min}, Maximum Amount: ₩ {max}',
      'userCenter.withdrawalPage.myBankAccounts': 'My Bank Accounts',
      'userCenter.withdrawalPage.emptyBankAccount': 'Empty Bank Account',
      'userCenter.withdrawalPage.addAccount': 'Add Account',
      'userCenter.withdrawalPage.refresh': 'Refresh',
      'userCenter.withdrawalPage.main': 'Main',
      'userCenter.withdrawalPage.wallet': 'Wallet',
      'userCenter.withdrawalPage.withdrawalAmountAndPassword': 'Withdrawal Amount & Password',
      'userCenter.withdrawalPage.accountNumber': 'Account number',
      'userCenter.withdrawalPage.bindDate': 'Bind Date',
      'userCenter.withdrawalPage.remainingTurnoverAmount': '*Remaining Turnover Amount: ₩ ',
      'userCenter.withdrawalPage.requiredTurnoverAmount': 'Required Turnover Amount',
      'userCenter.withdrawalAmount': 'Withdrawal Amount',
      'userCenter.depositAmount': 'Deposit Amount',
      'userCenter.transactionDetails': 'Transaction Details',
      'userCenter.withdrawalAccount': 'Withdrawal Account',
      'userCenter.depositAccount': 'Deposit Account',
      'userCenter.transactionDescription': "Once the transfer is complete, please click the 'Complete' button below. Should you have any questions, please feel free to contact our Customer Service team.",
      'userCenter.customerService': 'Customer Service',
      'userCenter.withdrawalPromotions': 'Withdrawal Promotions',
      'userCenter.depositPromotions': 'Deposit Promotions',
      'userCenter.receivedAmount': 'Received Amount',
      'userCenter.bonus': 'Bonus',
      'userCenter.withdrawalInfo': 'Withdrawal Info',
      'userCenter.depositInfo': 'Deposit Info',
      'common.gotIt': 'Got It',
      'common.success': 'Success!',
      'common.error': 'Uh oh!',
      'common.warning': 'Warning',
      'common.cancel': 'Cancel',
      'common.submit': 'Submit',
      'common.complete': 'Complete',
      'common.back': 'Back',
      'common.detail': 'Detail',
      'common.done': 'Done',
      'common.depositSuccess': 'Deposit successful!',
      'common.withdrawalSuccess': 'Your withdrawal request has been submitted!',
      'userCenter.accountRecord.title': 'Account Record',
      'userCenter.withdrawalRecord.title': 'Withdrawal Record',
      'userCenter.common.headers.date': 'Date',
      'userCenter.common.headers.time': 'Time',
      'userCenter.common.headers.status': 'Status',
      'userCenter.common.headers.method': 'Method',
      'userCenter.common.headers.transactionNo': 'Transaction No.',
      'userCenter.common.headers.datetime': 'Date Time',
      'userCenter.common.headers.requestTime': 'Request Time',
      'userCenter.common.headers.depositAmountHeader': 'Deposit Amount',
      'userCenter.common.headers.requestAmountHeader': 'Request Amount',
      'userCenter.common.headers.paidAmountHeader': 'Paid Amount',
      'userCenter.common.headers.bankName': 'Bank Name',
      'userCenter.common.headers.paidDate': 'Paid Date',
      'userCenter.common.headers.bankReference': 'Bank Reference',
      'userCenter.common.headers.depositedTime': 'Deposit Time',
      'userCenter.common.headers.bankCharge': 'Bank Charge',
      'userCenter.common.headers.promotionHeader': 'Promotion',
      'userCenter.common.headers.remarkHeader': 'Remark',
      'userCenter.common.headers.orderNo': 'Order No',
      'userCenter.common.headers.game': 'Game',
      'userCenter.common.headers.betAmount': 'Bet Amount',
      'userCenter.common.headers.settlementTime': 'Settlement Time',
      'userCenter.common.headers.gameType': 'Game Type',
      'userCenter.common.headers.totalProfitAndLoss': 'Total P&L',
      'userCenter.common.headers.bonus': 'Bonus',
      'userCenter.common.headers.betting': 'Betting',
      'userCenter.common.headers.validBet': 'Valid Bet',
      'userCenter.common.headers.winAmount': 'Win Amount',
      'userCenter.common.headers.betPL': 'Bet P&L',
      'userCenter.common.headers.rebate': 'Rebate',
      'userCenter.common.headers.transactionType': 'Transaction Type',
      'userCenter.common.headers.transactionAmount': 'Transaction Amount',
      'userCenter.common.headers.currentBalance': 'Current Balance',
      'userCenter.common.headers.content': 'Content',
      'userCenter.common.headers.result': 'Result',
      'userCenter.common.headers.proceed': 'Proceed',
      'userCenter.common.selectList.all': 'All',
      'userCenter.common.selectList.pending': 'Pending',
      'userCenter.common.selectList.approved': 'Approved',
      'userCenter.common.selectList.rejected': 'Rejected',
      'userCenter.common.footer.totalDepositAmount': 'Total Deposit Amount',
      'userCenter.common.footer.totalWithdrawalAmount': 'Total Withdrawal Amount',
      'userCenter.common.tags.status': 'Status',
      'userCenter.common.tags.time': 'Time',
      'userCenter.common.autoRefresh.in': 'Auto refresh in',
      'userCenter.common.autoRefresh.secondsShort': 's',
      'userCenter.withdrawalDetailPage.title': 'Withdrawal Detail',
      'userCenter.withdrawalDetailPage.activityName': 'Activity Name',
      'userCenter.withdrawalDetailPage.depositRollover': 'Deposit Rollover',
      'userCenter.withdrawalDetailPage.bonusRollover': 'Bonus Rollover',
      'userCenter.withdrawalDetailPage.progress': 'Progress',
      'userCenter.withdrawalDetailPage.category.1': 'Deposit Promotion',
      'userCenter.withdrawalDetailPage.category.2': 'Regular Deposit',
      'userCenter.withdrawalDetailPage.category.3': 'Adjustment',
      'userCenter.withdrawalDetailPage.category.4': 'Promotional Campaign',
      'common.confirm': 'Confirm',
      'common.type': 'Type',
      'userCenter.personalInfoPage.username': 'Username',
      'userCenter.personalInfoPage.nicknamePlaceholder': 'Please enter your nickname',
      'userCenter.personalInfoPage.privacyCta': 'We care about your privacy',
      'userCenter.personalInfoPage.privacyNoteLine1': 'All the user data are encrypted to ensure your personal privacy is protected.',
      'userCenter.personalInfoPage.privacyNoteLine2': 'For updates to your personal info, please contact support.',
      'userCenter.personalInfoPage.submit': 'Submit',
      'userCenter.bankingDetailsPage.emptyBankAccount': 'Empty Bank Account',
      'userCenter.bankingDetailsPage.addAccount': 'Add Account',
      'userCenter.bankingDetailsPage.activeBankAccount': 'Active Bank Account',
      'userCenter.bankingDetailsPage.bank': 'Bank',
      'userCenter.bankingDetailsPage.bankInformation': 'Bank Information',
      'userCenter.bankingDetailsPage.searchABank': 'Search a Bank',
      'userCenter.bankingDetailsPage.enterCardNumber': 'Enter your card number',
      'userCenter.bankingDetailsPage.transactionPassword': 'Transaction Password',
      'userCenter.bankingDetailsPage.fillTransactionPassword': 'Please fill in the transaction password',
      'userCenter.bankingDetailsPage.chooseABank': 'Choose a Bank',
      'userCenter.securityCenterPage.lastLogin': 'Last login',
      'userCenter.securityCenterPage.time': 'Time',
      'userCenter.securityCenterPage.ipAddress': 'IP Address',
      'userCenter.securityCenterPage.securitySetting': 'Security Setting',
      'userCenter.securityCenterPage.bankAccountNumber': 'Bank Account Number',
      'userCenter.changePassword.currentPlaceholder': 'Please enter current password',
      'userCenter.changePassword.newPlaceholder': 'Please enter a new password',
      'userCenter.changePassword.confirmPlaceholder': 'Confirm new password',
      'userCenter.changePassword.ruleHint': 'Use 6-16 alphanumeric characters.',
      'userCenter.changePassword.ruleHintLogin': 'Use 6-16 alphanumeric characters.',
      'userCenter.changePassword.lengthInvalid': 'Password must be 6-16 characters.',
      'userCenter.changePassword.confirmInvalid': 'The new password and confirmation do not match.',
      'userCenter.changePassword.patternInvalidLogin': 'Password can only contain alphanumeric characters.',
      'userCenter.changePassword.success': 'Password changed successfully.',
      'common.profileUpdateSuccess': 'Profile updated successfully.',
      'common.bankCardAddedSuccess': 'Bank card added successfully',
      'common.search': 'Search',
      'common.gameName': 'Game Name',
      'common.vendorName': 'Vendor Name',
      'common.readMore': 'Read more',
      'common.noData': 'No Data',
      'common.openingGame': 'Opening the game in a new tab...',
      'gameType.options.vendor': 'Vendor',
      'gameType.options.favorites': 'Favorites',
      'gameList.options.all': 'All Games',
      'gameList.options.favorite': 'Favorite',
      'promotionList.categories.all': 'All',
      'promotionList.categories.slot': 'Slot',
      'promotionList.categories.live': 'Live',
      'promotionList.categories.sports': 'Sports',
      'promotionList.categories.new': 'New',
      'about.title': 'ABOUT US',
      'about.tabs.support': 'Support',
      'about.tabs.notice': 'Notice',
      'about.tabs.about': 'About',
      'about.tabs.privacy': 'Privacy',
      'about.tabs.info': 'Info',
      'about.tabs.addiction': 'Addiction',
      'about.tabs.rules': 'Rules',
      'about.tabs.faq': 'FAQ',
      'navbar.top.poker': 'Poker',
      'navbar.top.esports': 'Esports',
      'navbar.top.lottery': 'Lottery',
      'navbar.bottom.pointmall': 'Point Mall',
      'navbar.bottom.bonus': 'Bonus',
      'navbar.bottom.share': 'Share',
      'hotGame.gameName': 'Game Name',
      'hotGame.creativeGaming': 'Creative Gaming',
      'hotGame.specialOffer': 'SPECIAL OFFER',
      'hotGame.promoDateRange': 'Thursday-Tuesday, times vary',
      'hotGame.promotion1': 'Promotion 1',
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
    { key: 'poker', tKey: 'navbar.top.poker', url: 'game-type.html?type=poker_games', icon: 'poker.svg' },
    { key: 'esports', tKey: 'navbar.top.esports', url: 'game-type.html?type=esports_games', icon: 'esports.svg' },
    { key: 'liveCasino', tKey: 'navbar.top.liveCasino', url: 'game-type.html?type=live', icon: 'liveCasino.svg' },
    { key: 'lottery', tKey: 'navbar.top.lottery', url: 'game-type.html?type=lottery_games', icon: 'lottery.svg' },
    { key: 'slots', tKey: 'navbar.top.slots', url: 'game-type.html?type=slot', icon: 'slotGames.svg' },
    { key: 'fish', tKey: 'navbar.top.fish', url: 'game-type.html?type=fish', icon: 'fish.svg' },
  ];

  var MOBILE_BOTTOM_ITEMS = [
    { key: 'pointmall', tKey: 'navbar.bottom.pointmall', url: null, icon: 'pointmall.svg' },
    { key: 'withdrawal', tKey: 'navbar.bottom.withdrawal', url: 'withdrawal.html', icon: 'withdrawal.svg' },
    { key: 'account', tKey: 'navbar.bottom.account', url: 'account.html', icon: 'accounts.svg' },
    { key: 'bonus', tKey: 'navbar.bottom.bonus', url: 'promotion-list.html', icon: 'bonus.svg' },
    { key: 'bettingRecords', tKey: 'navbar.bottom.bettingRecords', url: 'betting-record.html', icon: 'bettingRecord.svg' },
    { key: 'share', tKey: 'navbar.bottom.share', url: null, icon: 'share.svg' },
  ];

  var BOTTOM_NAV_ITEMS = [
    { key: 'home', tKey: 'bottomNavbar.home', url: 'index.html', icon: 'nav-home.svg' },
    { key: 'deposit', tKey: 'bottomNavbar.deposit', url: 'deposit.html', icon: 'nav-deposit.svg' },
    { key: 'promotion', tKey: 'bottomNavbar.promotion', url: 'promotion-list.html', icon: 'nav-promotion.svg' },
    { key: 'member', tKey: 'bottomNavbar.member', url: 'account.html', icon: 'nav-member.svg' },
  ];

  var FOOTER_PARTNERS = [
    'YellowBat.png', 'Spinomenal.png', 'PGSoft.png', 'hacksaw.png', 'ILoveU.png',
    'KingMidas.png', 'Live88.png', 'PlayNGo.png', 'UpUpGame.png', 'TurboGames.png',
    'Winfinity.png', 'AdvantPlay.png', 'AlizeSlots.png', 'Askmeslot.png', '7mojo.png', 'YeeBet.png',
  ];

  var LANGUAGES = [
    { code: 'en', label: 'English', image: 'lang-us2.svg' },
    { code: 'ko', label: '한국어', image: 'lang-kr.png' },
  ];

  /* ---- 首頁跑馬燈中獎訊息(對照真實網站首頁截圖,目前線上就是重複同一則訊息) ---- */
  var MARQUEE_ITEMS = [
    { title: 'Congratulations For UserXXX Winning $1000' },
    { title: 'Congratulations For UserXXX Winning $1000' },
    { title: 'Congratulations For UserXXX Winning $1000' },
    { title: 'Congratulations For UserXXX Winning $1000' },
  ];

  /* ---- 首頁 Banner(對照真實網站首頁截圖,單張主視覺,無輪播) ---- */
  var BANNER_SLIDES_DESKTOP = ['banner.jpg'];
  var BANNER_SLIDES_MOBILE = ['banner-mobile.png'];

  /* ---- Hot Game 卡片(對照真實網站首頁截圖,目前線上尚未上架真實遊戲,
     全部顯示「COMING SOON」佔位圖 + 「Game Name」占位文案,逐字保留) ---- */
  var HOT_GAMES = [
    { id: 1, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
    { id: 2, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
    { id: 3, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
    { id: 4, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
    { id: 5, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
    { id: 6, name: 'Game Name', subtitle: 'Win a shore of #100,000! $40,000 to the winner', image: null },
  ];

  /* ---- Live Casino(首頁,對照真實網站首頁截圖:前 2 張大卡 + 後 4 張小卡,
     背景/人像沿用 public/images/index/mainGame 素材,廠商 Logo 沿用 mainGame/live) ---- */
  var LIVE_CASINO_CARDS = [
    { vendor: 'Pragmatic Play', logo: 'index/mainGame/live/PP.png', photo: 'index/mainGame/img-livecasino-people-1.png', size: 'large' },
    { vendor: 'Microgaming', logo: 'index/mainGame/live/MicrogamingSlot.png', photo: 'index/mainGame/img-livecasino-people-2.png', size: 'large' },
    { vendor: 'Winfinity', logo: 'footer/Winfinity.png', photo: 'index/mainGame/img-livecasino-people-3.png', size: 'small' },
    { vendor: 'Ezugi', logo: 'index/mainGame/live/EZUGI.png', photo: 'index/mainGame/img-livecasino-people-4.png', size: 'small' },
    { vendor: 'YB Live', logo: 'index/mainGame/live/YB.png', photo: 'index/mainGame/img-livecasino-people-1.png', size: 'small' },
    { vendor: 'Sexy', logo: 'index/mainGame/live/SexyCasino.png', photo: 'index/mainGame/img-livecasino-people-2.png', size: 'small' },
  ];

  /* ---- Live Sports(首頁,對照真實網站首頁截圖:「SPORTS 100%」大圖 + BTI/SABA 2 張小卡) ---- */
  var LIVE_SPORTS_HERO = { left: 'index/mainGame/live/live_sport_left.png', right: 'index/mainGame/live/live_sport_right.png' };
  var LIVE_SPORTS_CARDS = [
    { vendor: 'BTI', logo: 'index/mainGame/live/sport_BTI_big.png', photo: 'index/mainGame/live/live_sport_left.png' },
    { vendor: 'SABA Sports', logo: 'index/mainGame/live/sport_SABA_big.png', photo: 'index/mainGame/live/live_sport_right.png' },
  ];

  /* ---- Slot Games(首頁橫向卡片,對照真實網站首頁截圖「Game Name / Creative Gaming」占位文案) ---- */
  var SLOT_STRIP_IMAGES = [
    'index/hotGame/img1.png', 'index/hotGame/img2.png', 'index/hotGame/img3.png',
    'index/mainGame/img1.png', 'index/mainGame/img2.png', 'index/mainGame/img3.png', 'index/mainGame/img4.png',
  ];

  /* ---- 首頁促銷卡片(對照真實網站首頁截圖「SPECIAL OFFER / PROMOTION」樣式) ---- */
  var PROMO_HOME_CARDS = [
    { label: 'Promotion 1' }, { label: 'Promotion 1' }, { label: 'Promotion 1' },
    { label: 'Promotion 1' }, { label: 'Promotion 1' },
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
    nickname: 'meaomcao',
    player_level_id: 'VIP1',
    player_level_name: 'VIP1',
    balance: '₩1,000,000,000',
    balanceRaw: '1,000,000,000',
    point_balance: '₩1,000,000,000',
    remaining_turnover_amount: '0',
    avatar: 'index/avatar.png',
  };

  /* ---- 會員中心側欄清單(對照 components/UserSidebar.vue items) ---- */
  var USER_SIDEBAR_ITEMS = [
    { id: 'accountOverview', tKey: 'userCenter.sidebar.accountOverview', url: 'account.html', icon: 'dashboard.svg' },
    { id: 'bettingRecord', tKey: 'userCenter.sidebar.bettingRecord', url: 'betting-record.html', icon: 'bettingRecord.svg' },
    { id: 'depositRecord', tKey: 'userCenter.sidebar.depositRecord', url: 'deposit-record.html', icon: 'depositRecord.svg' },
    { id: 'profitAndLoss', tKey: 'userCenter.sidebar.profitAndLoss', url: 'profit-loss.html', icon: 'profitAndLoss.svg' },
    { id: 'withdrawalRecord', tKey: 'userCenter.sidebar.withdrawalRecord', url: 'withdrawal-record.html', icon: 'withdrawalRecord.svg' },
    { id: 'withdrawalDetail', tKey: 'userCenter.sidebar.withdrawalDetail', url: 'withdrawal-detail.html', icon: 'withdrawalDetail.svg' },
    { id: 'accountRecord', tKey: 'userCenter.sidebar.accountRecord', url: 'account-record.html', icon: 'accountRecord.svg' },
    { id: 'personalInfo', tKey: 'userCenter.sidebar.personalInfo', url: 'personal-info.html', icon: 'myAccount.svg' },
    { id: 'securityCenter', tKey: 'userCenter.sidebar.securityCenter', url: 'security.html', icon: 'securityCenter.svg' },
    { id: 'customerService', tKey: 'userCenter.sidebar.customerService', url: '', icon: 'customerService.svg' },
  ];

  /* ---- 提款頁銀行卡列表(對照 api.getBankCardList 假資料) ---- */
  var BANK_CARDS = [
    { id: 1, bankName: 'KB Bank', bankCardNumber: '110-****-1234', cardholderName: 'MEAOMCAO', bindingTime: 1755100800 },
    { id: 2, bankName: 'Shinhan Bank', bankCardNumber: '110-****-5678', cardholderName: 'MEAOMCAO', bindingTime: 1757548800 },
  ];

  /* ---- 儲值優惠(對照 api.getPromotionDeposit 假資料) ---- */
  var DEPOSIT_PROMOTIONS = [
    {
      promotion_id: 'p1',
      name: '신규 가입 첫 입금 50%',
      remark: '이 이벤트는 Evolution Gaming 및 Pragmatic Play 카지노 게임에는 적용되지 않습니다.',
      prize: { bonus_reward_type: 'percentage', percentage: { min_deposit_amount: 10000, bonus_percentage: 50, min_bonus_amount: 0, max_bonus_amount: 200000 } },
      deposit_turnover_multiplier: 3,
      bonus_turnover_multiplier: 3,
      exceed_bonus_deposit_turnover_multiplier: 3,
    },
  ];

  /* ---- 銀行清單(對照 api.getBankList 假資料) ---- */
  var BANK_LIST = ['KB Bank', 'Shinhan Bank', 'Woori Bank', 'NH Bank', 'Hana Bank'];

  /* ---- 帳戶總覽近期交易(對照 api.getAccountRecord 的假資料) ---- */
  var MOCK_TRANSACTIONS = [
    { type: 'Deposit', time: '2026-08-12 15:48:00', amount: '50,000', status: 'Approved' },
    { type: 'Withdrawal', time: '2026-08-12 10:20:00', amount: '20,000', status: 'Approved' },
    { type: 'Deposit', time: '2026-08-11 18:20:00', amount: '100,000', status: 'Pending' },
    { type: 'Withdrawal', time: '2026-08-10 09:05:00', amount: '35,000', status: 'Reject' },
  ];

  /* ---- 各紀錄頁假資料 ---- */
  var BETTING_RECORDS = [
    { id: 1, order_no: 'BT20260812001', game: 'Gates of Olympus', time: '2026-08-12 15:48:00', bet_amount: 50000, valid_bet: 50000, win_amount: 92500, result: 'WIN', pl: 42500 },
    { id: 2, order_no: 'BT20260812002', game: 'Sweet Bonanza', time: '2026-08-12 14:30:00', bet_amount: 20000, valid_bet: 20000, win_amount: 0, result: 'LOSE', pl: -20000 },
    { id: 3, order_no: 'BT20260811007', game: 'Crazy Time', time: '2026-08-11 18:20:00', bet_amount: 35000, valid_bet: 35000, win_amount: 78000, result: 'WIN', pl: 43000 },
    { id: 4, order_no: 'BT20260811003', game: 'Baccarat', time: '2026-08-11 12:15:00', bet_amount: 10000, valid_bet: 10000, win_amount: 8500, result: 'LOSE', pl: -1500 },
  ];
  var DEPOSIT_RECORDS = [
    { id: 1, transaction_number: 'DP20260812001', request_time: '2026-08-12 15:48:00', deposit_amount: 50000, request_amount: 50000, status: 'Approved', method: 'Bank Transfer', deposited_time: '2026-08-12 15:50:00' },
    { id: 2, transaction_number: 'DP20260811004', request_time: '2026-08-11 10:20:00', deposit_amount: 100000, request_amount: 100000, status: 'Pending', method: 'Bank Transfer', deposited_time: '-' },
    { id: 3, transaction_number: 'DP20260810002', request_time: '2026-08-10 09:05:00', deposit_amount: 0, request_amount: 200000, status: 'Rejected', method: 'Bank Transfer', deposited_time: '-' },
  ];
  var WITHDRAWAL_RECORDS = [
    { id: 1, transaction_number: 'WD20260812003', request_time: '2026-08-12 10:20:00', paid_amount: 20000, request_amount: 20000, status: 'Approved', bank_name: 'KB Bank', paid_date: '2026-08-12 11:00:00' },
    { id: 2, transaction_number: 'WD20260810005', request_time: '2026-08-10 09:05:00', paid_amount: 0, request_amount: 35000, status: 'Rejected', bank_name: 'KB Bank', paid_date: '-' },
  ];
  var ACCOUNT_RECORDS = [
    { id: 1, type: 'Deposit', time: '2026-08-12 15:48:00', amount: 50000, balance: 1000050000, no: 'DP20260812001', status: 'Approved' },
    { id: 2, type: 'Withdrawal', time: '2026-08-12 10:20:00', amount: -20000, balance: 999980000, no: 'WD20260812003', status: 'Approved' },
    { id: 3, type: 'Game', time: '2026-08-11 18:20:00', amount: 43000, balance: 1000043000, no: 'GM20260811007', status: 'Approved' },
    { id: 4, type: 'Bonus', time: '2026-08-11 09:00:00', amount: 25000, balance: 1000025000, no: 'BN20260811001', status: 'Approved' },
  ];
  var PROFIT_LOSS_RECORDS = [
    { id: 1, game_type: 'Slot', pnl: 22500, betting: 100000, valid_bet: 100000, win: 122500, rebate: 500 },
    { id: 2, game_type: 'Live', pnl: -8500, betting: 45000, valid_bet: 45000, win: 36500, rebate: 200 },
    { id: 3, game_type: 'Sports', pnl: 12000, betting: 30000, valid_bet: 28000, win: 42000, rebate: 0 },
    { id: 4, game_type: 'Fish', pnl: -3000, betting: 15000, valid_bet: 15000, win: 12000, rebate: 0 },
  ];
  var WITHDRAWAL_TURNOVER_TASKS = [
    { recordId: 1, createdAt: '2026-08-11 15:00:00', category: 1, itemName: '신규 가입 첫 입금 50%', depositFlowAmount: 50000, bonusFlowAmount: 25000, achieved: '45,000', target: '225,000', gameTypes: [] },
  ];


  /* ---- 遊戲廠商清單(GameProviderList.vue,對照 assets/images/index/mainGame/live 廠商 Logo 檔名) ---- */
  var GAME_VENDORS = {
    live: [
      { vendor: 'Evolution', logo: 'Evolution.png' },
      { vendor: 'SAGaming', logo: 'SAGaming.png' },
      { vendor: 'AllbetLive', logo: 'AllbetLive.png' },
      { vendor: 'SexyCasino', logo: 'SexyCasino.png' },
      { vendor: 'DreamGame', logo: 'DreamGame.png' },
      { vendor: 'WMLIVE', logo: 'WMLIVE.png' },
      { vendor: 'PrettyGaming', logo: 'PrettyGaming.png' },
      { vendor: 'HoGaming', logo: 'HoGaming.png' },
      { vendor: 'VivoGaming', logo: 'VivoGaming.png' },
      { vendor: 'BigGaming', logo: 'BigGaming.png' },
    ],
    sports: [
      { vendor: 'Saba Sports', logo: 'Saba Sports.svg' },
      { vendor: 'BTI Sports', logo: 'BTI.svg' },
      { vendor: 'PINGAPI', logo: 'sport_PINGAPI_big.png' },
    ],
    slot: [
      { vendor: 'PP', logo: 'PP.png' },
      { vendor: 'MG', logo: 'MG.png' },
      { vendor: 'PT', logo: 'PT.png' },
      { vendor: 'JDB', logo: 'JDB.png' },
      { vendor: 'CQ9', logo: 'CQ9.png' },
      { vendor: 'Joker', logo: 'Joker.png' },
      { vendor: 'RelaxGaming', logo: 'RelaxGaming.png' },
      { vendor: 'NoLimitCity', logo: 'NoLimitCity.png' },
      { vendor: 'Skywind', logo: 'Skywind.png' },
      { vendor: 'YGGDrasil', logo: 'YGGDrasil.png' },
    ],
    mini_game: [
      { vendor: 'JDB', logo: 'JDB.png' },
      { vendor: 'KingMidas', logo: 'KingMidas.png' },
      { vendor: 'FastSpin', logo: 'FastSpin.png' },
      { vendor: 'RoyalCasino', logo: 'RoyalCasino.png' },
      { vendor: 'GameArt', logo: 'GameArt.png' },
      { vendor: 'LUCKY365', logo: 'LUCKY365.png' },
    ],
    fish: [
      { vendor: 'JDB', logo: 'JDB.png' },
      { vendor: 'CQ9', logo: 'CQ9.png' },
      { vendor: 'GameArt', logo: 'GameArt.png' },
      { vendor: 'FastSpin', logo: 'FastSpin.png' },
      { vendor: 'KingMidas', logo: 'KingMidas.png' },
    ],
  };

  /* ---- 遊戲卡片假資料產生(GameList.vue,圖片重複使用 index/mainGame/other 靜態圖) ---- */
  var GAME_NAME_POOL = [
    'Gates of Olympus', 'Sweet Bonanza', 'Crazy Time', 'Lightning Roulette', 'Book of Dead',
    'Wild Bandito', 'Fortune Tiger', 'Mahjong Ways', 'Golden Empire', 'Big Bass Bonanza',
    'Starlight Princess', 'Buffalo King', 'Money Train', 'Wanted Dead or a Wild', 'Sugar Rush',
    'Fishing God', 'Dragon Fortune', 'Speed Baccarat', 'Dream Catcher', 'Extra Chilli',
  ];
  function buildGames(type, vendor, count, seed) {
    var list = [];
    var len = GAME_NAME_POOL.length;
    for (var i = 0; i < count; i++) {
      list.push({
        game_id: type + '-' + vendor.replace(/\s+/g, '') + '-' + i,
        display_name: GAME_NAME_POOL[(seed + i) % len],
        provider: vendor,
        gateway: vendor.toLowerCase().replace(/\s+/g, ''),
        desktop_icon_url: 'index/mainGame/other/slot ' + ((seed + i) % 26) + '.png',
        isFavorite: false,
      });
    }
    return list;
  }
  function buildFlatGames(type, perVendor) {
    var vendors = GAME_VENDORS[type] || [];
    var out = [];
    vendors.forEach(function (v, idx) {
      out = out.concat(buildGames(type, v.vendor, perVendor, idx * perVendor));
    });
    return out;
  }
  /* ---- 各分類的完整遊戲清單(GameList.vue「全部遊戲」/「我的最愛」頁籤共用) ---- */
  var FLAT_GAMES = {
    slot: buildFlatGames('slot', 4),
    mini_game: buildFlatGames('mini_game', 4),
    fish: buildFlatGames('fish', 4),
    hotgames: HOT_GAMES.map(function (g) {
      return {
        game_id: 'hotgames-' + g.id,
        display_name: g.name,
        provider: 'PP',
        gateway: 'pp',
        desktop_icon_url: g.image,
        isFavorite: false,
      };
    }),
  };

  /* ---- 促銷活動假資料(promotionList.vue/promotionDetail.vue,圖片重複使用 index/promotion 靜態圖) ---- */
  var PROMOTIONS = [
    {
      promotion_id: 1, category: 'new', image: 'index.png', startDate: 0, endDate: 0,
      title: { ko: '신규 가입 첫 입금 200% 보너스', en: 'New Member First Deposit 200% Bonus' },
      content: {
        ko: '<p>win10096에 처음 가입하신 회원님을 위한 특별 혜택입니다. 첫 입금 시 200% 보너스를 즉시 지급해 드립니다.</p><p>· 최소 입금 금액: ₩ 30,000<br>· 최대 보너스 금액: ₩ 500,000<br>· 유효 베팅 조건: 입금 및 보너스 합산 금액의 1배</p><p>자세한 내용은 고객센터로 문의해 주세요.</p>',
        en: '<p>A special offer for members joining win10096 for the first time. Receive an instant 200% bonus on your first deposit.</p><p>· Minimum deposit: ₩ 30,000<br>· Maximum bonus: ₩ 500,000<br>· Turnover requirement: 1x of deposit + bonus amount</p><p>Please contact customer service for more details.</p>',
      },
    },
    {
      promotion_id: 2, category: 'new', image: 'promotion2.png', startDate: 1785542400, endDate: 1788134400,
      title: { ko: '매일 출석 체크 포인트 지급', en: 'Daily Check-in Points' },
      content: {
        ko: '<p>매일 로그인 후 출석 체크만 하면 포인트가 자동으로 적립됩니다.</p><p>· 지급 시간: 매일 00:00 초기화<br>· 연속 출석 시 추가 포인트 지급</p>',
        en: '<p>Simply check in after logging in every day to automatically earn points.</p><p>· Reset time: 00:00 daily<br>· Extra points for consecutive check-ins</p>',
      },
    },
    {
      promotion_id: 3, category: 'slot', image: 'promotionDetail.png', startDate: 1785888000, endDate: 1788566400,
      title: { ko: '슬롯 롤링 캐시백 1.5%', en: 'Slot Rolling Cashback 1.5%' },
      content: {
        ko: '<p>모든 슬롯 게임 유효 베팅 금액에 대해 매주 1.5% 캐시백을 지급합니다.</p><p>· 정산 주기: 매주 월요일<br>· 최대 캐시백 금액: ₩ 1,000,000</p>',
        en: '<p>Receive a weekly 1.5% cashback on the total valid bets placed across all slot games.</p><p>· Settlement: every Monday<br>· Maximum cashback: ₩ 1,000,000</p>',
      },
    },
    {
      promotion_id: 4, category: 'slot', image: 'index.png', startDate: 0, endDate: 0,
      title: { ko: '슬롯 무료 스핀 이벤트', en: 'Slot Free Spin Event' },
      content: {
        ko: '<p>지정된 슬롯 게임에서 무료 스핀 50회를 매주 제공합니다.</p><p>· 참여 방법: 고객센터로 신청<br>· 지급 게임: 매주 변경</p>',
        en: '<p>Get 50 free spins every week on selected slot games.</p><p>· How to join: apply via customer service<br>· Featured games rotate weekly</p>',
      },
    },
    {
      promotion_id: 5, category: 'live', image: 'promotion2.png', startDate: 1784073600, endDate: 1787184000,
      title: { ko: '라이브 카지노 첫 입금 30% 보너스', en: 'Live Casino First Deposit 30% Bonus' },
      content: {
        ko: '<p>라이브 카지노 첫 입금 시 30% 보너스를 지급합니다.</p><p>· 최소 입금 금액: ₩ 50,000<br>· 최대 보너스 금액: ₩ 300,000</p>',
        en: '<p>Get a 30% bonus on your first live casino deposit.</p><p>· Minimum deposit: ₩ 50,000<br>· Maximum bonus: ₩ 300,000</p>',
      },
    },
    {
      promotion_id: 6, category: 'live', image: 'promotionDetail.png', startDate: 0, endDate: 0,
      title: { ko: '라이브 바카라 패배 리베이트', en: 'Live Baccarat Loss Rebate' },
      content: {
        ko: '<p>라이브 바카라 게임에서 발생한 손실 금액의 0.8%를 리베이트로 지급합니다.</p><p>· 정산 주기: 매일 자동 정산</p>',
        en: '<p>Receive a 0.8% rebate on losses incurred while playing live baccarat.</p><p>· Settlement: automatic, daily</p>',
      },
    },
    {
      promotion_id: 7, category: 'sports', image: 'index.png', startDate: 1787184000, endDate: 1788566400,
      title: { ko: '스포츠 베팅 프로모션', en: 'Sports Betting Promotion' },
      content: {
        ko: '<p>스포츠 단일 경기 베팅 적중 시 추가 보너스를 지급합니다.</p><p>· 대상: 배당률 1.8 이상 단일 경기<br>· 지급 방식: 적중 시 익일 자동 지급</p>',
        en: '<p>Get an extra bonus when your single-match sports bet wins.</p><p>· Applies to: single matches with odds of 1.8 or higher<br>· Payout: automatically credited the next day after a win</p>',
      },
    },
    {
      promotion_id: 8, category: 'new', image: 'promotion2.png', startDate: 0, endDate: 0,
      title: { ko: '친구 추천 이벤트', en: 'Refer a Friend Event' },
      content: {
        ko: '<p>친구를 추천하고 친구가 첫 입금을 완료하면 추천인과 피추천인 모두에게 보너스를 지급합니다.</p><p>· 지급 조건: 피추천인 첫 입금 완료 후 24시간 내<br>· 추천 횟수 제한 없음</p>',
        en: '<p>Refer a friend and once they complete their first deposit, both you and your friend receive a bonus.</p><p>· Payout condition: within 24 hours after the referred friend completes their first deposit<br>· No limit on the number of referrals</p>',
      },
    },
  ];

  var ABOUT_CONTENT = {
  "ko": {
    "support": {
      "items": [
        {
          "title": "고객센터로 문의하세요."
        }
      ]
    },
    "notice": {
      "items": [
        {
          "title": "긴급공지 - 인투88 공식 텔레그램 변경.",
          "detail": "최근 win10096을 사칭하는 사례가 증가하고 있습니다.\n \n win10096은 공식 텔레그램 채널 한 곳을 통해서만 안내를 제공합니다.\n 기존 텔레그램에 문제가 발생할 경우, 해당 채널 또는 라이브 채팅을 통해서만 공지합니다.\n \n win10096 공식 텔레그램 공지 채널:\n https://t.me/win10096cs\n \n 기존 텔레그램을 통해 연락이 되지 않는 경우, 사칭 피해를 방지하기 위해 라이브 채팅으로 문의하여 확인 후 진행해 주시기 바랍니다."
        },
        {
          "title": "입금계좌 문의방법",
          "detail": "입금 계좌 문의는 가입 후 라이브챗 또는 고객센터 텔레그램으로 문의해 주시기 바랍니다."
        }
      ]
    },
    "about": {
      "items": [
        {
          "title": "win10096 소개",
          "detail": "본 정책은 win10096(이하 “회사”)이 고객이 제공한 정보 및 데이터를 어떻게 사용하며, 해당 정보가 win10096과 고객 간에 어떻게 처리되는지를 설명합니다.\n \n 회사는 win10096(또는 웹사이트) 회원가입 양식이나 기타 방법을 통해 제공된 내용, 또는 회사가 이미 보유하고 있는 개인정보를 기반으로 고객의 개인정보를 처리합니다.\n 고객이 정보를 제출하고 사이트를 이용함으로써, 본 개인정보 처리방침에 따라 정보가 사용되는 것에 동의한 것으로 간주됩니다.\n 본 정책에 동의하지 않는 경우, 사이트를 이용하거나 개인정보를 제공하지 마시기 바랍니다."
        }
      ]
    },
    "privacy": {
      "items": [
        {
          "title": "개인 정보 보호 정책",
          "detail": "본 정책은 win10096이 귀하의 개인정보를 어떻게 수집, 사용 및 보호하는지에 대해 설명합니다.\n 또한 win10096은 공식 채널을 통해서만 안내를 제공하며, 기존 채널에 문제가 발생할 경우 본 페이지 또는 라이브 채팅을 통해서만 공지합니다."
        },
        {
          "title": "정보 수집 및 사용처",
          "detail": "회사는 다음을 포함하여 고객에 관한 정보 및 데이터를 수집, 이용 및 폐기합니다:\n \n 이메일 또는 웹사이트를 통해 제출된 모든 정보\n \n 이메일, 전화 또는 채팅을 통한 커뮤니케이션을 기록하는 기타 모든 수단\n \n 설문조사 또는 고객 설문지에 대한 응답\n \n 웹사이트와 관련된 거래 이력\n \n 트래픽 데이터, 위치 데이터, 블로그 및 기타 커뮤니케이션 데이터를 포함한 사이트 방문 관련 정보\n \n 수집된 개인정보는 다음의 목적을 위해 처리됩니다:\n \n 오프라인 및 온라인 결제를 포함한 결제 거래 처리\n \n 베팅 거래 처리\n \n 고객 계정 관리 및 회원 프로필 구축\n \n 법적 및 규제상 의무 준수\n \n 고객 조사, 설문 및 데이터 분석\n \n 이벤트, 상품 및 서비스 제공\n \n 사기, 비정상적인 베팅 행위, 자금 세탁, 보너스 악용, 공모 행위 방지 및 고객 간 부정행위 거래 모니터링"
        }
      ]
    },
    "info": {
      "items": [
        {
          "title": "추가 설명",
          "detail": "win10096은 내부 또는 외부 웹사이트의 콘텐츠나 정확성에 대해 책임을 지지 않습니다.\n \n 회사가 제공하는 모든 정보는 사실에 기반하고 있으나, 해당 정보와 관련된 오류 또는 누락에 대해서는 책임을 지지 않습니다. 또한 회사는 명백한 오류를 수정할 권리를 보유합니다.\n \n 회사는 본 이용약관을 수시로 수정, 업데이트 및 변경할 수 있는 독점적 권리를 보유합니다.\n \n 개정·업데이트·변경된 약관은 웹사이트에 게시되며, 게시 즉시 효력이 발생합니다."
        }
      ]
    },
    "addiction": {
      "items": [
        {
          "title": "게임 과몰입 방지",
          "detail": "win10096은 회원이 과도한 플레이를 예방하면서 게임을 즐길 수 있도록 장려합니다.\n 계정 관리 페이지를 통해 회원이 자신의 한계를 인식하고 책임 있는 게임 한도를 직접 설정할 수 있도록 지원합니다.\n \n 게임은 하나의 엔터테인먼트 수단이며, 감정적 또는 재정적 부담이 되어서는 안 됩니다.\n 돈을 빌리거나 다른 용도로 사용해야 할 자금을 게임에 사용하는 것은 바람직하지 않으며, 본인과 주변 사람들에게 심각한 문제를 초래할 수 있습니다.\n win10096에서 책임감 있게 게임을 즐기시길 바랍니다.\n \n 책임 있는 게임에 대해 궁금한 점이 있으시면 고객센터로 문의해 주시기 바랍니다.\n 다음과 같은 도움을 제공하고 있습니다:\n \n 자가 진단\n \n 베팅 관리\n \n 입금 한도 설정\n \n 자녀 보호\n \n 도움 및 권장 사항"
        },
        {
          "title": "자가 진단",
          "detail": "지루하거나 행복하지 않은 삶에서 벗어나기 위해 게임을 하고 있습니까?\n \n 게임에서 손실을 본 후, 잃은 돈을 되찾기 위해 가능한 한 빨리 다시 이겨야 한다고 생각한 적이 있습니까?\n \n 보통 게임을 할 때 보유 금액이 모두 소진될 때까지 계속하는 편입니까?\n \n 도박에 사용한 돈이나 시간을 숨기기 위해 거짓말을 한 적이 있습니까?\n \n 도박으로 인해 가족, 친구 또는 취미에 대한 관심을 잃은 적이 있습니까?\n \n 게임 중 돈이 없어졌을 때 절망감이나 실망감을 느끼며, 다시 빨리 게임을 해야겠다고 생각한 적이 있습니까?\n \n 도박으로 인해 우울감을 느끼거나 자살 충동을 느낀 적이 있습니까?\n 위 질문 중 대부분에 **“예”**라고 답했다면, 게임 중독일 가능성이 있습니다.\n \n 이에 대해 누군가와 이야기하거나 무료 또는 독립적인 상담을 받고 싶으신 경우,\n Gambling Therapy와 같은 전문 기관(https://www.gamblingtherapy.org/\n ) 또는 저희 고객센터로 문의해 주시기 바랍니다."
        },
        {
          "title": "배팅 관리",
          "detail": "대다수의 사람들이 도박을 하는 반면 일부 사람들에게는 도박이 문제가 될 수 있습니다.\n다음을 기억하는 데 도움이 될 수 있습니다:\n1. 도박은 즐겁게 해야하며 돈을 버는 방법으로 보지 않아야 합니다.\n2. 재정적으로 부담되지 않는 선에서 이용하시기 바랍니다.\n3. 도박에 소비하는 시간과 금액을 기록하는 습관을 가지기 바랍니다.\n4. Betfilter www.betfilter.com 또는 www.gamblock.com 같은 겜블링 사이트 접속 차단 소프트웨어를 모바일 또는 태블릿에 설치하시기 바랍니다.\n5. 게임 과몰입 문제에 대하여 상담하고 싶으신 경우, 저희에게 연락주시거나 위에 언급된 상담 단체로 연락주시기 바랍니다."
        }
      ]
    },
    "rules": {
      "items": [
        {
          "title": "규칙 및 규정",
          "detail": "저희 win10096은 양방 베팅, 베팅 관련 프로그램 사용자, 신고 및 해킹, 협박, 프로모션 악용, 조직적인 그룹 베팅 등 비정상적인 방법으로 사이트를 이용할 목적으로 가입한 회원에 대해 엄중히 처벌하고 있습니다. 명시된 규칙 및 규정을 위반하는 회원으로 판단되는 경우, win10096은 사전 경고 없이 회원의 계정을 몰수 시킬 권한이 있습니다. 회원이 win10096에 가입 후 이용을 하시는 것은, 모든 이용 약관, 규칙 및 규정을 이해하시고 동의하시는 것으로 간주됩니다."
        },
        {
          "title": "입출금 관련",
          "detail": "문의 없이 잘못된 계좌로 입금한 경우, 그로 인해 발생하는 손실에 대해 win10096은 책임지지 않습니다.\n \n 이벤트/프로모션에 별도 명시가 없는 한, 모든 시간은 GMT+8 기준으로 합니다.\n \n 입금 및 출금은 본인의 등록된 은행 정보로만 신청할 수 있으며, 타인의 정보로는 처리되지 않습니다.\n \n 은행 계좌 정보는 가족, 친척, 지인 등 제3자 명의로 등록할 수 없으며, 사이트 실제 이용자 명의와 일치해야 합니다.\n \n 가상계좌 사용은 엄격히 금지되어 있으며, 가상계좌를 통한 입·출금은 허용되지 않습니다.\n \n 본인 명의가 아닌 계좌로 입금한 경우 해당 입금은 처리될 수 없으며, win10096은 거래 처리를 위해 관련 서류를 요청할 수 있습니다.\n \n 자금 세탁 및 금융 사기를 방지하기 위해, 출금 전 입금 금액 전액을 베팅해야 합니다.\n \n 수표 또는 어음을 통한 입금은 받지 않습니다."
        }
      ]
    },
    "faq": {
      "categories": [
        {
          "title": "일반 정보",
          "items": [
            {
              "title": "win10096 소개",
              "detail": "win10096은 신뢰할 수 있고 검증된 게임을 제공하는 해외 베팅 사이트입니다. 스포츠, 슬롯 게임, 라이브 카지노부터 미니 게임까지 온라인 엔터테인먼트 트렌드를 면밀히 반영하기 위해 최선을 다하고 있습니다. 다양한 고객 로열티 프로그램과 같은 매력적인 프로모션과 보너스 등 여러 혜택을 받으며 흥미진진한 게임을 즐기실 수 있습니다."
            },
            {
              "title": "사이트에서 제공되는 게임은 공정한가요?",
              "detail": "win10096 사이트는 법적으로 등록된 회사로, 게임 결과는 절대적으로 공평하고 공정하며 사실에 근거합니다."
            },
            {
              "title": "내 개인 정보는 안전한가요?",
              "detail": "당사는 귀하의 개인정보를 최우선으로 생각합니다. win10096 은 규제와 관련 법률 및 규정 또는 법원의 명령에 관여하지 않은 제 3자와 절대 공유하지 않습니다."
            }
          ]
        },
        {
          "title": "계정 관리",
          "items": [
            {
              "title": "비밀번호는 어떻게 변경하나요?",
              "detail": "사이트 로그인 후, 정보센터 > 내 정보를 클릭하세요. \"로그인 비밀번호\" 메뉴를 통해 비밀번호 변경이 가능합니다."
            },
            {
              "title": "비밀번호를 분실했는데, 어떻게 재발급받을 수 있나요?",
              "detail": "계정 비밀번호를 분실하신 경우, \"비밀번호 찾기\" 버튼을 클릭해주세요. 회원님의 아이디와 가입시 등록하신 이메일을 입력하세요. 입력하신 정보가 올바른 경우, 이메일로 임시 비밀번호가 발송됩니다."
            }
          ]
        }
      ]
    }
  },
  "en": {
    "support": {
      "items": [
        {
          "title": "Please contact customer service."
        }
      ]
    },
    "notice": {
      "items": [
        {
          "title": "Urgent Notice - win10096 official Telegram updated.",
          "detail": "There has been an increase in impersonators pretending to be win10096.\nwin10096 provides guidance only through one official Telegram. If there is an issue with the existing Telegram, we will announce it only via this channel or live chat.\n\nOfficial win10096 Telegram announcement channel: https://t.me/win10096cs\n\nIf you cannot reach us through the previous Telegram, please contact us via live chat to verify and proceed to avoid impersonation."
        },
        {
          "title": "How to inquire about deposit account",
          "detail": "For deposit account inquiries, please register first and then contact us via live chat or the customer service Telegram."
        }
      ]
    },
    "about": {
      "items": [
        {
          "title": "About win10096",
          "detail": "This policy describes how win10096 (\"we\") uses the information and data provided by customers and how it is handled between win10096 and customers.\n\nWe process your personal information based on the provisions provided through the win10096 (or website) registration form or other methods, or based on personal information we already hold. By submitting your information and using the site, you agree to the use of your information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use the site or provide personal information."
        }
      ]
    },
    "privacy": {
      "items": [
        {
          "title": "Privacy Policy",
          "detail": "This policy explains how your personal information is collected, used, and protected by win10096. We only provide guidance via our official channels. If the existing channel has issues, announcements will be made via this page or live chat only."
        },
        {
          "title": "Data collection and usage",
          "detail": "We collect, use, and dispose of information and data about you including:\n1. Any information submitted via email or the website;\n2. Any other means that record communications via email, phone, or chat;\n3. Responses to surveys or customer questionnaires;\n4. Transaction history related to the website;\n5. Details of site visits such as traffic data, location data, blogs, and other communication data.\n\nYour personal information is processed for the following purposes:\n1. Payment transactions, including offline and online payments;\n2. Betting transactions;\n3. Managing customer accounts and building member profiles;\n4. Compliance with our legal and regulatory obligations;\n5. Customer research, surveys, and analytics;\n6. Events, products, and services;\n7. Preventing fraud, irregular betting activity, money laundering, bonus abuse, collusion, and monitoring transactions between customers for misconduct."
        }
      ]
    },
    "info": {
      "items": [
        {
          "title": "Additional Information",
          "detail": "win10096 is not responsible for the content or accuracy of internal or external websites.\nAll information provided by the company is based on facts; however, the company is not liable for errors or omissions related to the information. The company reserves the right to correct obvious errors.\nWe reserve the exclusive right to amend, update, and modify these Terms of Use from time to time.\nRevised, updated, or modified terms will be posted on the website(s) and will take effect immediately upon posting."
        }
      ]
    },
    "addiction": {
      "items": [
        {
          "title": "Responsible Gaming",
          "detail": "win10096 encourages members to enjoy gaming while preventing excessive play. We help members recognize their limits and set their own responsible gaming limits through the account management page.\nGaming is a form of entertainment and should not become an emotional or financial burden. Borrowing money or using funds for other purposes is unwise and can cause serious problems for you and those around you. We hope you enjoy games responsibly at win10096!\nIf you have questions about responsible gaming, please contact customer support. We offer help such as:\n1. Self-assessment\n2. Bet management\n3. Deposit limits\n4. Parental protection\n5. Help and suggestions"
        },
        {
          "title": "Self-assessment",
          "detail": "1. Do you play to escape from a boring or unhappy life?\n2. After losing, do you feel the urge to win back what you lost as soon as possible?\n3. When you play, do you tend to continue until all available funds are exhausted?\n4. Have you ever lied to conceal the amount of money or time spent on gambling?\n5. Have you lost interest in family, friends, or hobbies because of gambling?\n6. When you run out of money while playing, have you felt despair or disappointment and wanted to play again quickly?\n\nDo you feel depressed or suicidal due to gambling? If most of your answers are \"Yes\", you may be experiencing gambling addiction. For free and independent advice, please contact organizations such as Gambling Therapy (https://www.gamblingtherapy.org/) or contact us."
        },
        {
          "title": "Bet management",
          "detail": "While most people gamble recreationally, for some it can become a problem.\nYou may find it helpful to remember:\n1. Gambling should be fun and not seen as a way to make money.\n2. Only gamble within your financial means.\n3. Keep track of the time and money you spend on gambling.\n4. Consider installing gambling site blocking software such as Betfilter (www.betfilter.com) or Gamblock (www.gamblock.com) on your mobile or tablet.\n5. If you want to talk to someone about problem gambling, contact us or one of the organizations mentioned above."
        }
      ]
    },
    "rules": {
      "items": [
        {
          "title": "Rules and Regulations",
          "detail": "win10096 strictly penalizes members who register with the intention of using the site in abnormal ways such as arbitrage betting, using betting tools, reporting and hacking, intimidation, promotion abuse, or organized group betting. If a member is determined to have violated the stated rules and regulations, win10096 reserves the right to confiscate the member's account without prior warning. By registering and using win10096, you are considered to understand and agree to all terms, rules, and regulations."
        },
        {
          "title": "Deposits and Withdrawals",
          "detail": "- If you deposit to an incorrect account without prior verification, win10096 is not responsible for any resulting loss.\n- Unless otherwise stated in the event/promotion, all time references are based on GMT+8.\n- Deposit and withdrawal requests can only be made using the account holder’s own registered bank details; requests using another person’s details cannot be processed.\n- Bank account information cannot be registered under family, relatives, acquaintances, or any other names; it must match the actual user of the site.\n- The use of virtual accounts is strictly prohibited. Deposits or withdrawals using virtual accounts are not allowed.\n- If you deposit using an account that is not in your name, the deposit cannot be processed and win10096 may request related documents to handle the transaction.\n- To prevent money laundering and financial fraud, the deposited amount must be wagered in full before withdrawals are allowed.\n- Deposits via checks or bills are not accepted."
        }
      ]
    },
    "faq": {
      "categories": [
        {
          "title": "General Information",
          "items": [
            {
              "title": "About win10096",
              "detail": "win10096 is an overseas betting site that provides trusted and verified games. From sports, slot games, live casinos to mini games, we are doing our best to closely follow the trends of online entertainment products. You can experience exciting games while receiving various benefits such as attractive promotions and bonuses like various customer loyalty programs."
            },
            {
              "title": "Are the games provided on the site fair?",
              "detail": "The win10096 site is a legally registered company, and all game results are absolutely fair, impartial, and based on factual outcomes."
            },
            {
              "title": "Is my personal information safe?",
              "detail": "We prioritize your personal information above all else. win10096 will never share your information with any third party unless required by regulations, applicable laws and regulations, or a court order."
            }
          ]
        },
        {
          "title": "Account Management",
          "items": [
            {
              "title": "How do I change my password?",
              "detail": "After logging into the site, click Information Center > My Information. You can change your password through the “Login Password” menu."
            },
            {
              "title": "I lost my password, how can I get it reissued?",
              "detail": "If you have forgotten your account password, please click the “Forgot Password” button. Enter your username and the email address registered during signup. If the information provided is correct, a temporary password will be sent to your email."
            }
          ]
        }
      ]
    }
  }
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
    LIVE_CASINO_CARDS: LIVE_CASINO_CARDS,
    LIVE_SPORTS_HERO: LIVE_SPORTS_HERO,
    LIVE_SPORTS_CARDS: LIVE_SPORTS_CARDS,
    SLOT_STRIP_IMAGES: SLOT_STRIP_IMAGES,
    PROMO_HOME_CARDS: PROMO_HOME_CARDS,
    GAME_TYPES: GAME_TYPES,
    GAME_VENDORS: GAME_VENDORS,
    FLAT_GAMES: FLAT_GAMES,
    PROMOTIONS: PROMOTIONS,
    ABOUT_CONTENT: ABOUT_CONTENT,
    MOCK_PROFILE: MOCK_PROFILE,
    USER_SIDEBAR_ITEMS: USER_SIDEBAR_ITEMS,
    MOCK_TRANSACTIONS: MOCK_TRANSACTIONS,
    BANK_CARDS: BANK_CARDS,
    DEPOSIT_PROMOTIONS: DEPOSIT_PROMOTIONS,
    BETTING_RECORDS: BETTING_RECORDS,
    DEPOSIT_RECORDS: DEPOSIT_RECORDS,
    WITHDRAWAL_RECORDS: WITHDRAWAL_RECORDS,
    ACCOUNT_RECORDS: ACCOUNT_RECORDS,
    PROFIT_LOSS_RECORDS: PROFIT_LOSS_RECORDS,
    WITHDRAWAL_TURNOVER_TASKS: WITHDRAWAL_TURNOVER_TASKS,
    BANK_LIST: BANK_LIST,
  };
})(window);
