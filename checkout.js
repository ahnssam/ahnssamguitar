/* checkout.js — TAB악보 결제 (토스페이먼츠 결제창)
   어느 페이지에서든 auth.js 다음에 넣고 window.ahnssamCheckout.buy(악보id) 로 부른다.
   (지금 상세 페이지, 나중에 새 메인 시안에서도 같은 함수를 쓴다)
   흐름: 주문 만들기(create_sheet_order) → 토스 결제창 → purchases.html 로 돌아와 승인(toss-confirm)
   비회원 (2026-11-11): 로그인 안 했으면 '로그인하고 구매 / 비회원으로 구매(이메일)'를 고른다.
     비회원 주문은 create_guest_sheet_order 가 만들고, 그때 받은 열쇠를 이 브라우저(localStorage)에 기억해 둔다.
     내려받기·주문 조회는 Edge Function guest-order (주문번호 + 열쇠 | 결제 키 | 이메일). db/sheet_guest_orders.sql
*/
(function () {
    'use strict';

    // 토스 개발자센터 > API 키 > 'API 개별 연동 키'의 클라이언트 키 (공개돼도 되는 키)
    // test_ck_… 인 동안은 실제 돈이 빠지지 않고, 결제 승인·PDF 는 운영 계정만 (서버에서 막음)
    const TOSS_CLIENT_KEY = 'test_ck_c19w1q40Vjj4RvsrxDKF76oVbAlUAm3HXq';
    const TOSS_SDK = 'https://js.tosspayments.com/v2/standard';
    const ADMIN_EMAIL = 'steveq2568@gmail.com';
    const RETURN_KEY = 'ahnssam_pay_sheet';   // 결제 실패·취소 때 돌아갈 악보
    const GUEST_KEY = 'ahnssam_guest_orders'; // 이 브라우저에서 비회원으로 한 주문 [{ orderId, key, email, paymentKey, at }]
    // 테스트 키일 때 비회원 구매 흐름을 점검하려면 이 브라우저에 localStorage.ahnssam_guest_test = '1'
    //   (서버는 테스트 키 동안 운영 계정 이메일로 만든 비회원 주문만 승인한다)
    const guestTest = () => { try { return localStorage.getItem('ahnssam_guest_test') === '1'; } catch (e) { return false; } };

    const isTest = () => TOSS_CLIENT_KEY.startsWith('test_');
    const auth = () => window.ahnssamAuth;
    const session = () => (auth() && auth().getSession()) || null;
    const isAdmin = () => String((session() && session().user.email) || '').toLowerCase() === ADMIN_EMAIL;
    // 결제창을 열 수 있는지 — 토스 심사 때 누구나 결제창 연동을 확인할 수 있게 테스트 키여도 연다
    const canPay = () => !!TOSS_CLIENT_KEY;
    // 결제창은 열리지만 실제 구매는 안 되는 상태 (테스트 키 + 운영 계정 아님).
    // 테스트 결제라 돈이 안 빠지고, 승인 서버(toss-confirm)가 운영 계정만 승인해서 PDF 도 안 나간다.
    const trialOnly = () => isTest() && !isAdmin() && !(guestTest() && !session());

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
        cover_not_yet: '이 악보는 12월 1일부터 사이트에서 살 수 있어요. 지금은 풀스코어에서 살 수 있어요.',
        bad_email: '이메일 주소를 다시 확인해 주세요.',
        too_many: '주문이 너무 많아요. 잠시 뒤 다시 시도해 주세요.',
    };
    const errText = e => {
        const m = String((e && e.message) || e || '');
        const key = Object.keys(ERR).find(k => m.includes(k));
        return key ? ERR[key] : (m || '문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.');
    };

    // 결제창 띄우기 (실제 구매·체험 공통)
    async function openPayment({ amount, orderId, orderName, customerKey, email, name }) {
        await loadSdk();
        const payment = window.TossPayments(TOSS_CLIENT_KEY).payment({ customerKey });
        const back = window.location.origin + '/purchases.html';
        await payment.requestPayment({
            method: 'CARD',   // 카드 + 간편결제(토스페이·카카오페이 등 계약된 것) 통합 결제창
            amount: { currency: 'KRW', value: amount },
            orderId,
            orderName,
            successUrl: back,
            failUrl: back,
            customerEmail: email || undefined,
            customerName: name || undefined,
            card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false },
        });
    }

    // 실결제 전(테스트 키) 손님용 체험 결제창 — 토스 심사 담당자처럼 로그인하지 않은 사람도 언제든 결제창까지 볼 수 있게.
    // 주문을 DB 에 만들지 않고(주문번호 TRIAL-…), 돌아오면 purchases.html 이 승인 없이 '테스트라 구매되지 않았어요'를 보여 준다.
    // 테스트 키라 돈이 빠지지 않고, 승인하지 않은 테스트 결제는 토스에서 저절로 사라진다.
    const PART = { acoustic: '통기타', electric: '일렉기타', solo: '기타솔로', fingerstyle: '핑거스타일', bass: '베이스', chord: '코드악보' };
    async function trialBuy(ids) {
        const sb = auth() && auth().supabase;
        if (!sb) { alert('결제창을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.'); return { status: 'error' }; }
        const { data: rows, error } = await sb.from('sheets').select('id, title, price, style').in('id', ids);
        if (error || !rows || rows.length !== ids.length || rows.some(r => !(r.price > 0))) {
            alert('지금은 판매하지 않는 악보예요.');
            return { status: 'error' };
        }
        // 금액·주문 이름은 서버(create_sheet_order)와 같은 규칙: 반주 + 기타솔로를 함께 사면 500원 할인
        rows.sort((a, b) => (a.style === 'solo') - (b.style === 'solo') || String(a.style).localeCompare(String(b.style)));
        const solo = rows.some(r => r.style === 'solo'), main = rows.some(r => r.style !== 'solo');
        const amount = rows.reduce((s, r) => s + r.price, 0) - (solo && main ? 500 : 0);
        const parts = rows.map(r => PART[r.style] || '악보').join(' + ');
        const orderName = String(rows[0].title).slice(0, 60) + ' TAB악보' + (rows.length > 1 || solo ? ' (' + parts + ')' : '');
        const orderId = 'TRIAL-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        try { sessionStorage.setItem(RETURN_KEY, ids[0]); } catch (e) {}
        try {
            await loadSdk();
            const s = session();
            await openPayment({
                amount, orderId, orderName,
                customerKey: s ? s.user.id : window.TossPayments.ANONYMOUS,
                email: s && s.user.email,
            });
            return { status: 'redirect' };
        } catch (e) {
            if (e && (e.code === 'USER_CANCEL' || e.code === 'PAY_PROCESS_CANCELED')) return { status: 'cancel' };
            alert(errText(e));
            return { status: 'error' };
        }
    }

    // ---------- 비회원 ----------
    function guestOrders() {
        try { const a = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
    }
    function saveGuest(o) {
        const list = guestOrders().filter(x => x.orderId !== o.orderId);
        list.unshift(o);
        try { localStorage.setItem(GUEST_KEY, JSON.stringify(list.slice(0, 50))); } catch (e) {}
    }
    function guestOrder(orderId) { return guestOrders().find(x => x.orderId === orderId) || null; }
    function rememberGuestPayment(orderId, paymentKey) {
        const o = guestOrder(orderId);
        saveGuest(Object.assign({ orderId, at: Date.now() }, o || {}, { paymentKey }));
    }
    const cred = o => o.key ? { key: o.key } : o.paymentKey ? { paymentKey: o.paymentKey } : { email: o.email };
    async function guestCall(body) {
        const sb = auth() && auth().supabase;
        if (!sb) throw new Error('잠시 뒤 다시 시도해 주세요.');
        const { data, error } = await sb.functions.invoke('guest-order', { body });
        if (error) { let d = {}; try { d = await error.context.json(); } catch (e) {} return Object.assign({ ok: false }, d); }
        return data;
    }
    // 비회원 주문 보기 — o: { orderId, key | paymentKey | email }
    function guestList(o) { return guestCall(Object.assign({ action: 'list', orderId: o.orderId }, cred(o))); }

    // 로그인 안 한 손님: 로그인하고 살지, 비회원으로 살지 (이메일)
    function askGuest() {
        if (!document.getElementById('ahnssam-guest-css')) {
            const st = document.createElement('style');
            st.id = 'ahnssam-guest-css';
            st.textContent = `.gb-back{position:fixed;inset:0;z-index:3000;background:rgba(20,30,25,.45);display:flex;align-items:center;justify-content:center;padding:16px}
                .gb{background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px 22px 20px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:'Noto Sans KR',sans-serif;color:#1a1a1a}
                .gb h3{font-size:19px;font-weight:900;color:#2a6b4a;margin:0 0 6px}.gb p{font-size:13.5px;color:#555;line-height:1.6;margin:0}
                .gb .opt{display:block;width:100%;margin-top:14px;padding:13px 14px;border-radius:12px;border:1.5px solid #b5e6c8;background:#fff;font:inherit;font-size:15px;font-weight:700;color:#2a6b4a;cursor:pointer;text-align:left}
                .gb .opt small{display:block;font-size:12.5px;font-weight:500;color:#777;margin-top:2px}.gb .opt:hover{background:#f3fbf6}
                .gb .opt.main{background:#2a6b4a;color:#fff;border-color:#2a6b4a}.gb .opt.main small{color:#d6eee0}.gb .opt.main:hover{background:#3a8a5c}
                .gb form{margin-top:14px;padding-top:14px;border-top:1px solid #eef3f0}.gb label{display:block;font-size:13px;font-weight:700;margin-bottom:6px}
                .gb input[type=email]{width:100%;box-sizing:border-box;padding:11px 12px;border:1.5px solid #cfe3d7;border-radius:10px;font:inherit;font-size:15px}
                .gb input[type=email]:focus{outline:none;border-color:#52a872}
                .gb .agree{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;font-weight:500;color:#555;line-height:1.5;margin:10px 0 0}
                .gb .agree input{margin-top:3px}.gb .err{color:#c0392b;font-size:12.5px;margin-top:6px;min-height:1em}
                .gb .acts{display:flex;gap:8px;margin-top:12px}.gb .acts button{flex:1;padding:11px;border-radius:22px;border:0;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
                .gb .acts .no{background:#f1f4f2;color:#555}.gb .acts .go{background:#2a6b4a;color:#fff}`;
            document.head.appendChild(st);
        }
        let last = '';
        try { last = (guestOrders()[0] || {}).email || ''; } catch (e) {}
        return new Promise(res => {
            const back = document.createElement('div');
            back.className = 'gb-back';
            back.innerHTML = `<div class="gb" role="dialog" aria-modal="true" aria-label="구매 방법 고르기">
                <h3>어떻게 구매할까요?</h3><p>로그인하면 구매한 악보를 언제든 '구매한 악보'에서 다시 받을 수 있어요.</p>
                <button type="button" class="opt main" data-login><i class="fas fa-right-to-bracket"></i> 로그인하고 구매<small>구글·카카오로 바로 로그인</small></button>
                <form novalidate>
                    <label for="gbEmail">비회원으로 구매 — 이메일</label>
                    <input type="email" id="gbEmail" autocomplete="email" placeholder="you@example.com" value="${String(last).replace(/"/g, '&quot;')}">
                    <label class="agree"><input type="checkbox" id="gbAgree"> <span>[필수] 주문 확인·다시 받기·문의 답변을 위해 이메일을 받는 것에 동의해요. 전자상거래법에 따라 5년 보관해요. <a href="/legal/privacy.html" target="_blank" style="color:#2a6b4a;text-decoration:underline">개인정보 처리방침</a></span></label>
                    <p style="font-size:12px;margin-top:8px">결제가 끝나면 바로 PDF를 받을 수 있어요. 나중에 다시 받을 때는 <b>주문번호와 이 이메일</b>이 필요해요.</p>
                    <div class="err" id="gbErr"></div>
                    <div class="acts"><button type="button" class="no" data-x>취소</button><button type="submit" class="go">비회원으로 결제하기</button></div>
                </form></div>`;
            const done = v => { back.remove(); document.removeEventListener('keydown', onKey); res(v); };
            const onKey = e => { if (e.key === 'Escape') done(null); };
            back.addEventListener('click', e => {
                if (e.target === back || e.target.closest('[data-x]')) done(null);
                else if (e.target.closest('[data-login]')) done({ mode: 'login' });
            });
            back.querySelector('form').addEventListener('submit', e => {
                e.preventDefault();
                const email = back.querySelector('#gbEmail').value.trim();
                const err = back.querySelector('#gbErr');
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = '이메일 주소를 확인해 주세요.'; return; }
                if (!back.querySelector('#gbAgree').checked) { err.textContent = '이메일 수집에 동의해야 비회원으로 살 수 있어요.'; return; }
                done({ mode: 'guest', email });
            });
            document.addEventListener('keydown', onKey);
            document.body.appendChild(back);
        });
    }

    async function guestBuy(ids, email) {
        const sb = auth() && auth().supabase;
        if (!sb) { alert('결제창을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.'); return { status: 'error' }; }
        const { data, error } = await sb.rpc('create_guest_sheet_order', { p_sheet_ids: ids, p_email: email });   // db/sheet_guest_orders.sql
        if (error) { alert(errText(error)); return { status: 'error' }; }
        saveGuest({ orderId: data.order_id, key: data.guest_key, email: email.toLowerCase(), at: Date.now() });
        try { sessionStorage.setItem(RETURN_KEY, ids[0]); } catch (e) {}
        try {
            await openPayment({ amount: data.amount, orderId: data.order_id, orderName: data.order_name,
                customerKey: (await loadSdk(), window.TossPayments.ANONYMOUS), email });
            return { status: 'redirect' };
        } catch (e) {
            if (e && (e.code === 'USER_CANCEL' || e.code === 'PAY_PROCESS_CANCELED')) return { status: 'cancel' };
            alert(errText(e));
            return { status: 'error' };
        }
    }

    // 구매하기 — 성공하면 토스 결제창으로 넘어가고, 결제가 끝나면 purchases.html 로 돌아온다.
    // sheetId 는 악보 하나, 또는 같은 곡의 악보 여러 개(반주 + 기타솔로 — 함께 사면 서버가 500원 깎는다)
    async function buy(sheetId) {
        const ids = [].concat(sheetId);
        await ready();
        if (!canPay()) { alert('지금은 결제를 준비하고 있어요. 조금만 기다려 주세요!'); return { status: 'closed' }; }
        // 실결제 전에는 운영 계정이 아니면 로그인 없이 체험 결제창 (실제 구매는 안 됨)
        if (trialOnly()) return trialBuy(ids);
        if (!session()) {
            const how = await askGuest();
            if (!how) return { status: 'cancel' };
            if (how.mode === 'login') { auth() && auth().openLogin(); return { status: 'login' }; }
            return guestBuy(ids, how.email);
        }

        const { data, error } = await auth().supabase.rpc('create_sheet_order', { p_sheet_ids: ids });   // db/sheet_bundles.sql
        if (error) {
            if (String(error.message).includes('already_purchased')) return { status: 'owned' };
            alert(errText(error));
            return { status: 'error' };
        }
        try { sessionStorage.setItem(RETURN_KEY, ids[0]); } catch (e) {}

        try {
            const user = session().user;
            const profile = auth().getProfile && auth().getProfile();
            await openPayment({
                amount: data.amount, orderId: data.order_id, orderName: data.order_name,
                customerKey: user.id, email: user.email, name: profile && profile.nickname,
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
    //   full 이 참이면 반주 + 기타솔로를 함께 산 사람이 덤으로 받는 합본(<반주 id>-full.pdf, db/sheet_bundle_full.sql)
    async function download(sheetId, title, artist, part, full) {
        await ready();
        if (!session()) { auth() && auth().openLogin(); return false; }
        const clean = v => String(v || '').replace(/[\\/:*?"<>|_]+/g, ' ').replace(/\s+/g, ' ').trim();
        const t = clean(title) || '악보', a = clean(artist) || '안큐', pt = clean(full ? '반주+기타솔로' : part);
        const name = [t + (pt ? ' [' + pt + ']' : ''), a, '악보나무숲'].filter(Boolean).join('_') + '.pdf';
        const { data, error } = await auth().supabase.storage.from('sheet-pdfs')
            .createSignedUrl(sheetId + (full ? '-full' : '') + '.pdf', 60, { download: name });
        if (error || !data) { alert('파일을 내려받지 못했어요. 구매한 계정으로 로그인했는지 확인해 주세요.'); return false; }
        window.location.href = data.signedUrl;
        return true;
    }

    // 비회원 주문의 PDF 내려받기 — o: { orderId, key | paymentKey | email }
    async function guestDownload(o, sheetId, title, artist, part, full) {
        const clean = v => String(v || '').replace(/[\\/:*?"<>|_]+/g, ' ').replace(/\s+/g, ' ').trim();
        const t = clean(title) || '악보', a = clean(artist) || '안큐', pt = clean(full ? '반주+기타솔로' : part);
        const name = [t + (pt ? ' [' + pt + ']' : ''), a, '악보나무숲'].filter(Boolean).join('_') + '.pdf';
        const r = await guestCall(Object.assign({ action: 'download', orderId: o.orderId, sheetId, full: !!full, name }, cred(o)));
        if (!r || !r.ok || !r.url) { alert('파일을 내려받지 못했어요. 주문번호와 이메일을 확인해 주세요.'); return false; }
        window.location.href = r.url;
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

    window.ahnssamCheckout = { ready, buy, download, myPurchases, confirm, canPay, trialOnly, isTest, isAdmin, returnSheet,
        guestOrders, guestOrder, rememberGuest: saveGuest, rememberGuestPayment, guestList, guestDownload };
})();
