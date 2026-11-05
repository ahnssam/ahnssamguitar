/* checkout.js — TAB악보 결제 (토스페이먼츠 결제창)
   어느 페이지에서든 auth.js 다음에 넣고 window.ahnssamCheckout.buy(악보id) 로 부른다.
   (지금 상세 페이지, 나중에 새 메인 시안에서도 같은 함수를 쓴다)
   흐름: 주문 만들기(create_sheet_order) → 토스 결제창 → purchases.html 로 돌아와 승인(toss-confirm)
*/
(function () {
    'use strict';

    // 토스 개발자센터 > API 키 > 'API 개별 연동 키'의 클라이언트 키 (공개돼도 되는 키)
    // test_ck_… 인 동안은 실제 돈이 빠지지 않고, 결제 승인·PDF 는 운영 계정만 (서버에서 막음)
    const TOSS_CLIENT_KEY = 'test_ck_c19w1q40Vjj4RvsrxDKF76oVbAlUAm3HXq';
    const TOSS_SDK = 'https://js.tosspayments.com/v2/standard';
    const ADMIN_EMAIL = 'steveq2568@gmail.com';
    const RETURN_KEY = 'ahnssam_pay_sheet';   // 결제 실패·취소 때 돌아갈 악보

    const isTest = () => TOSS_CLIENT_KEY.startsWith('test_');
    const auth = () => window.ahnssamAuth;
    const session = () => (auth() && auth().getSession()) || null;
    const isAdmin = () => String((session() && session().user.email) || '').toLowerCase() === ADMIN_EMAIL;
    // 결제창을 열 수 있는지 — 토스 심사 때 누구나 결제창 연동을 확인할 수 있게 테스트 키여도 연다
    const canPay = () => !!TOSS_CLIENT_KEY;
    // 결제창은 열리지만 실제 구매는 안 되는 상태 (테스트 키 + 운영 계정 아님).
    // 테스트 결제라 돈이 안 빠지고, 승인 서버(toss-confirm)가 운영 계정만 승인해서 PDF 도 안 나간다.
    const trialOnly = () => isTest() && !isAdmin();

    // 로그인 상태가 정해질 때까지 기다린다 (auth.js 가 SDK 를 늦게 불러올 수 있어서)
    let settled = false;
    window.addEventListener('ahnssam-auth-settled', () => { settled = true; });
    function ready() {
        if (settled || (auth() && auth().supabase && session())) return Promise.resolve();
        return new Promise(resolve => {
            const done = () => { clearTimeout(t); resolve(); };
            const t = setTimeout(done, 8000);
            window.addEventListener('ahnssam-auth-settled', done, { once: true });
        });
    }

    let sdkPromise = null;
    function loadSdk() {
        if (window.TossPayments) return Promise.resolve();
        if (!sdkPromise) {
            sdkPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = TOSS_SDK;
                s.onload = resolve;
                s.onerror = () => { sdkPromise = null; reject(new Error('결제창을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.')); };
                document.head.appendChild(s);
            });
        }
        return sdkPromise;
    }

    const ERR = {
        auth_required: '로그인한 뒤 구매할 수 있어요.',
        sheet_not_found: '지금은 판매하지 않는 악보예요.',
        sheet_no_pdf: '악보 파일을 준비하고 있어요. 조금만 기다려 주세요.',
        sheet_no_price: '가격이 정해지지 않은 악보예요.',
        already_purchased: '이미 구매한 악보예요. 구매한 악보에서 내려받을 수 있어요.',
        not_same_song: '같은 곡의 악보만 함께 살 수 있어요.',
    };
    const errText = e => {
        const m = String((e && e.message) || e || '');
        const key = Object.keys(ERR).find(k => m.includes(k));
        return key ? ERR[key] : (m || '문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.');
    };

    // 구매하기 — 성공하면 토스 결제창으로 넘어가고, 결제가 끝나면 purchases.html 로 돌아온다.
    // sheetId 는 악보 하나, 또는 같은 곡의 악보 여러 개(반주 + 기타솔로 — 함께 사면 서버가 500원 깎는다)
    async function buy(sheetId) {
        const ids = [].concat(sheetId);
        await ready();
        if (!session()) { auth() && auth().openLogin(); return { status: 'login' }; }
        if (!canPay()) { alert('지금은 결제를 준비하고 있어요. 조금만 기다려 주세요!'); return { status: 'closed' }; }

        const { data, error } = await auth().supabase.rpc('create_sheet_order', { p_sheet_ids: ids });   // db/sheet_bundles.sql
        if (error) {
            if (String(error.message).includes('already_purchased')) return { status: 'owned' };
            alert(errText(error));
            return { status: 'error' };
        }
        try { sessionStorage.setItem(RETURN_KEY, ids[0]); } catch (e) {}

        try {
            await loadSdk();
            const user = session().user;
            const profile = auth().getProfile && auth().getProfile();
            const payment = window.TossPayments(TOSS_CLIENT_KEY).payment({ customerKey: user.id });
            const back = window.location.origin + '/purchases.html';
            await payment.requestPayment({
                method: 'CARD',   // 카드 + 간편결제(토스페이·카카오페이 등 계약된 것) 통합 결제창
                amount: { currency: 'KRW', value: data.amount },
                orderId: data.order_id,
                orderName: data.order_name,
                successUrl: back,
                failUrl: back,
                customerEmail: user.email || undefined,
                customerName: (profile && profile.nickname) || undefined,
                card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false },
            });
            return { status: 'redirect' };
        } catch (e) {
            // 결제창을 그냥 닫은 경우는 조용히
            if (e && (e.code === 'USER_CANCEL' || e.code === 'PAY_PROCESS_CANCELED')) return { status: 'cancel' };
            alert(errText(e));
            return { status: 'error' };
        }
    }

    // 산 악보 PDF 내려받기 — 1분짜리 링크를 만들어 바로 받는다.
    // 파일 이름: 곡제목_아티스트_악보나무숲.pdf. 아티스트 칸이 빈 곡은 자작곡(안쌤 곡)이라 '안큐'.
    //   같은 곡의 여러 악보(반주·솔로)는 part 를 곡제목 뒤에 [기타솔로]처럼 붙여 이름이 겹치지 않게.
    //   제목·아티스트 속 _ 는 구분자와 헷갈리지 않게 빈칸으로.
    async function download(sheetId, title, artist, part) {
        await ready();
        if (!session()) { auth() && auth().openLogin(); return false; }
        const clean = v => String(v || '').replace(/[\\/:*?"<>|_]+/g, ' ').replace(/\s+/g, ' ').trim();
        const t = clean(title) || '악보', a = clean(artist) || '안큐', pt = clean(part);
        const name = [t + (pt ? ' [' + pt + ']' : ''), a, '악보나무숲'].filter(Boolean).join('_') + '.pdf';
        const { data, error } = await auth().supabase.storage.from('sheet-pdfs')
            .createSignedUrl(sheetId + '.pdf', 60, { download: name });
        if (error || !data) { alert('파일을 내려받지 못했어요. 구매한 계정으로 로그인했는지 확인해 주세요.'); return false; }
        window.location.href = data.signedUrl;
        return true;
    }

    async function myPurchases() {
        await ready();
        if (!session()) return [];
        const { data, error } = await auth().supabase.rpc('my_sheet_purchases');
        if (error) throw error;
        return data || [];
    }

    // 결제창에서 돌아왔을 때 승인 요청 (purchases.html 에서 부름)
    async function confirm(paymentKey, orderId, amount) {
        await ready();
        const { data, error } = await auth().supabase.functions.invoke('toss-confirm', {
            body: { paymentKey, orderId, amount: Number(amount) },
        });
        if (error) {
            let detail = {};
            try { detail = await error.context.json(); } catch (e) {}
            return { ok: false, ...detail };
        }
        return data;
    }

    function returnSheet() {
        try { return sessionStorage.getItem(RETURN_KEY); } catch (e) { return null; }
    }

    window.ahnssamCheckout = { ready, buy, download, myPurchases, confirm, canPay, trialOnly, isTest, isAdmin, returnSheet };
})();
