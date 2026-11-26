/* admin/sales.js — 악보관리 첫 화면의 판매 탭 (2026-11-26 사용자)
   "판매가 되기 시작했으니 얼마나 팔렸는지 볼 수 있게 — 풀스코어처럼 주문 관리, 마케팅 분석, 정산 관리(일·주·월·연, 처음엔 월)"
   탭: 주문 관리 · 정산 관리 · 마케팅 분석 · 악보 관리(예전 목록). 악보관리를 열면 주문 관리부터 보인다(주소 #orders · #settle · #mkt · #sheets).
   - 주문·정산은 sheet_orders 를 바로 읽는다(운영 계정은 RLS 로 다 읽음). 회원 이메일은 sheet_admin_buyers(), 상세 보기·장바구니 숫자는
     sheet_admin_traffic() — 둘 다 db/sheet_shop_admin.sql. 함수가 아직 없으면 닉네임만 / '적용 전' 안내.
   - 매출 = 손님이 낸 금액(부가세 포함). 여러 악보 주문(반주 + 솔로·장바구니)은 정가 비율로 나눠 악보마다 매출을 잡는다(음저협 정산과 같은 규칙).
   - 결제 수수료·음저협 사용료·남는 돈은 '추정'. 수수료율은 화면에서 고치면 이 브라우저에 기억한다.
   - 숫자는 화면에만 — 이 저장소(공개)에는 판매 숫자를 넣지 않는다.
   sheets.html 이 운영 계정 확인 뒤 window.adminSales.start(sb, { edit }) 를 부른다. */
(function () {
    'use strict';
    const ADMIN_EMAIL = 'steveq2568@gmail.com';
    const STYLE = { acoustic: ['통기타', '#cf9a68'], electric: ['일렉기타', '#42a854'], fingerstyle: ['핑거스타일', '#eaac14'], solo: ['기타솔로', '#52a6f2'],
        chord: ['코드악보', '#f06a6e'], bass: ['베이스', '#a98cf2'], other: ['악보', '#8a9a90'] };
    const TRACK_FROM = '2026-11-26';   // 상세 보기·장바구니를 세기 시작한 날
    const $ = id => document.getElementById(id);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const won = n => Math.round(Number(n) || 0).toLocaleString() + '원';
    const num = n => (Number(n) || 0).toLocaleString();
    const pct = (a, b) => b ? (Math.round(a / b * 1000) / 10) + '%' : '–';
    const KST = 9 * 3600e3;
    const kday = t => new Date(Date.parse(t) + KST).toISOString().slice(0, 10);
    const today = () => new Date(Date.now() + KST).toISOString().slice(0, 10);
    const addDays = (d, n) => new Date(Date.parse(d + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10);
    const monday = d => addDays(d, -((new Date(d + 'T00:00:00Z').getUTCDay() + 6) % 7));
    const WD = ['일', '월', '화', '수', '목', '금', '토'];
    const mmdd = d => `${+d.slice(5, 7)}/${+d.slice(8, 10)}`;
    const store = { get(k, v) { try { const x = localStorage.getItem('admin.' + k); return x == null ? v : JSON.parse(x); } catch (e) { return v; } },
        set(k, v) { try { localStorage.setItem('admin.' + k, JSON.stringify(v)); } catch (e) {} } };

    let sb = null, tab = 'orders', loaded = false, loading = null;
    let SH = {};       // 악보 id → { title, artist, style, kind, price, komca_code, published }
    let O = [];        // 주문 (새것이 위)
    let BUY = {};      // 회원 id → { email, nickname }
    let buyersFn = true, traffic = null, trafficFn = true, backfilled = false;
    const ST = {
        o: { period: '30d', from: '', to: '', status: 'paid', who: 'all', test: false, q: '', page: 1, open: null },
        s: { unit: 'month', test: false, sel: null, fee: store.get('feeRate', 3.74) },
        m: { period: '30d', from: '', to: '', all: false, sort: 'views', dir: -1 },
    };

    // ---------- 모양 ----------
    function css() {
        if ($('sl-css')) return;
        const st = document.createElement('style');
        st.id = 'sl-css';
        st.textContent = `
.mtabs{display:flex;gap:4px;margin:22px 0 0;border-bottom:2px solid var(--line);overflow-x:auto}
.mtabs button{border:0;background:none;font:inherit;font-size:15px;font-weight:700;color:#8a8a8a;padding:11px 16px 10px;border-bottom:3px solid transparent;margin-bottom:-2px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:7px}
.mtabs button:hover{color:var(--ink)}.mtabs button.on{color:var(--green);border-bottom-color:var(--green)}
.mtabs button i{font-size:13px}
.sl-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0 6px}
.sl-card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:13px 15px}
.sl-card small{display:block;color:var(--sub);font-size:12.5px}.sl-card b{display:block;font-size:21px;font-weight:900;color:var(--ink);margin-top:2px;white-space:nowrap}
.sl-card em{font-style:normal;font-size:12px;color:var(--sub)}
.sl-card.hi{border-color:#bfe3cc;background:#f3faf6}.sl-card.hi b{color:var(--green)}
.sl-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:16px 0 10px}
.sl-bar .lbl{font-size:12.5px;color:var(--sub)}
.sl-bar input[type=date]{height:32px;border:1px solid var(--line);border-radius:8px;padding:0 8px;font:inherit;font-size:13px;background:#fff}
.sl-bar input[type=search]{height:34px;border:1px solid var(--line);border-radius:17px;padding:0 14px;width:230px;background:#fff}
.sl-bar label.ck{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555;cursor:pointer}
.sl-bar .sp{flex:1}
.sl-tw{overflow-x:auto;background:#fff;border:1px solid var(--line);border-radius:12px}
table.sl{width:100%;border-collapse:collapse;font-size:13.5px}
.sl th{text-align:left;font-size:12.5px;color:var(--sub);font-weight:500;padding:10px 12px;border-bottom:1px solid var(--line);background:#fafafa;white-space:nowrap}
.sl th.r,.sl td.r{text-align:right}
.sl td{padding:10px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top}
.sl tr:last-child td{border-bottom:0}
.sl tr.clk{cursor:pointer}.sl tr.clk:hover td{background:#fafcfb}
.sl tr.sel td{background:#f1f8f4}
.sl .when{white-space:nowrap}.sl .when small{display:block;color:var(--sub);font-size:11.5px}
.sl .oid{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:#777;white-space:nowrap}
.sl .it{display:flex;align-items:center;gap:6px;line-height:1.4;margin:1px 0}
.sl .it i{width:8px;height:8px;border-radius:50%;background:var(--c);flex:none}
.sl .it a{font-weight:700}.sl .it a:hover{text-decoration:underline}.sl .it small{color:var(--sub);font-size:11.5px;white-space:nowrap}
.sl .who b{display:block}.sl .who small{display:block;color:var(--sub);font-size:12px;word-break:break-all}
.sl .amt{font-weight:800;white-space:nowrap}
.sl .pm{white-space:nowrap}.sl .pm small{display:block;color:var(--sub);font-size:12px}
.tg{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;background:#eef1ef;color:#666;white-space:nowrap;margin:1px 2px 1px 0}
.tg.paid{background:#e6f5ec;color:#1f8a52}.tg.pending{background:#f1f1f1;color:#888}.tg.failed,.tg.canceled{background:#fdecea;color:#c0392b}
.tg.test{background:#fff3d6;color:#8a6200}.tg.guest{background:#eef2f8;color:#3b5b8c}.tg.adm{background:#f3ecff;color:#6b47b8}
.sl .more td{background:#fbfcfb;font-size:12.5px;color:#555}
.sl .more a{color:var(--green);font-weight:700}
.sl-empty{padding:40px;text-align:center;color:var(--sub)}
.sl-note{font-size:12px;color:var(--sub);margin:10px 2px;line-height:1.6}
.sl-note.warn{color:#8a5a00;background:#fff4e0;border-radius:10px;padding:9px 12px}
.sl-chart{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 14px 8px;margin-bottom:12px}
.sl-chart h4{font-size:13.5px;font-weight:700;margin:0 0 8px;display:flex;gap:10px;align-items:center}
.sl-chart h4 small{color:var(--sub);font-weight:500;font-size:12px}
.sl-chart svg{display:block;width:100%;height:auto;overflow:visible}
.sl-chart .lg{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#666;font-weight:500}.sl-chart .lg i{width:10px;height:10px;border-radius:3px;background:var(--c)}
.sl-two{display:grid;grid-template-columns:1.4fr 1fr;gap:12px;margin-top:12px}.sl-two>*{min-width:0}.sl td:first-child{white-space:nowrap}
.sl-box{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.sl-box h4{font-size:14px;font-weight:800;margin:0 0 10px}.sl-box h4 small{color:var(--sub);font-weight:500;font-size:12px;margin-left:6px}
.sl-rk{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f3f3f3;font-size:13px}
.sl-rk:last-child{border-bottom:0}.sl-rk .n{width:20px;color:var(--sub);font-weight:700;text-align:right}
.sl-rk .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sl-rk .t small{color:var(--sub);margin-left:5px}
.sl-rk .v{font-weight:700;white-space:nowrap}.sl-rk .v small{color:var(--sub);font-weight:500;margin-left:4px}
.sl-kv{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#555}.sl-kv b{color:var(--ink)}
.sl-fee{width:60px;height:28px;border:1px solid var(--line);border-radius:6px;text-align:right;padding:0 6px;font:inherit;font-size:13px}
.sl th button.so{border:0;background:none;font:inherit;color:inherit;cursor:pointer;padding:0;white-space:nowrap}
.sl th button.so.on{color:var(--green);font-weight:800}
.sl .bar{height:6px;border-radius:3px;background:#e6f2ea;margin-top:4px;overflow:hidden}.sl .bar span{display:block;height:100%;background:var(--green-2)}
.sl-bar .seg{max-width:100%;overflow-x:auto;scrollbar-width:none}.sl-bar .seg::-webkit-scrollbar{display:none}
@media (max-width:760px){table.sl{min-width:660px}.mtabs button{padding:10px 11px 9px;font-size:14px}.sl-sum{grid-template-columns:1fr 1fr}.sl-two{grid-template-columns:1fr}.sl-bar input[type=search]{width:100%}.sl-card b{font-size:18px}}`;
        document.head.appendChild(st);
    }

    // ---------- 데이터 ----------
    function load(force) {
        if (loading && !force) return loading;
        loading = (async () => {
            const [sr, or] = await Promise.all([
                sb.from('sheets').select('id, title, artist, style, kind, price, song_key, komca_code, published'),
                sb.from('sheet_orders').select('*').order('created_at', { ascending: false }).limit(5000),
            ]);
            if (or.error) throw or.error;
            SH = {}; (sr.data || []).forEach(s => { SH[s.id] = s; });
            O = (or.data || []).map(o => Object.assign(o, {
                ids: Array.isArray(o.sheet_ids) && o.sheet_ids.length ? o.sheet_ids : [o.sheet_id],
                at: o.approved_at || o.created_at,
            }));
            O.forEach(o => { o.day = kday(o.created_at); o.pday = kday(o.at); });
            await loadBuyers();
            loaded = true;
            backfill();
        })();
        return loading;
    }
    async function loadBuyers() {
        const ids = [...new Set(O.filter(o => o.user_id).map(o => o.user_id))];
        if (!ids.length) return;
        if (buyersFn) {
            const { data, error } = await sb.rpc('sheet_admin_buyers', { p_ids: ids });
            if (!error) { BUY = {}; (data || []).forEach(b => { BUY[b.id] = b; }); return; }
            buyersFn = false;
        }
        const { data } = await sb.from('profiles').select('id, nickname').in('id', ids);   // 함수 적용 전: 닉네임만
        BUY = {}; (data || []).forEach(b => { BUY[b.id] = { nickname: b.nickname }; });
    }
    // 예전 주문의 결제 방법(카카오페이·신한카드 …) 채우기 — toss-confirm 이 토스에서 다시 읽는다. 한 번만
    async function backfill() {
        if (backfilled) return;
        backfilled = true;
        const need = O.some(o => o.status === 'paid' && !o.is_test && o.payment_key && 'pay_detail' in o && !o.pay_detail);
        if (!need) return;
        try {
            const { data } = await sb.functions.invoke('toss-confirm', { body: { backfill: true } });
            if (data && data.filled > 0) { await load(true); render(); }
        } catch (e) {}
    }
    async function loadTraffic(from, to) {
        if (!trafficFn) return null;
        const { data, error } = await sb.rpc('sheet_admin_traffic', { p_from: from, p_to: to });
        if (error) { trafficFn = false; return null; }
        return data || [];
    }

    // 주문 하나를 악보마다 나눈 매출 (정가 비율, 나머지는 첫 악보) — 음저협 정산(sheet_sales_report)과 같은 규칙
    function split(o) {
        const ps = o.ids.map(id => (SH[id] && SH[id].price) || 0), tot = ps.reduce((a, b) => a + b, 0);
        const sh = o.ids.map((id, i) => ({ id, rev: tot ? Math.floor(o.amount * ps[i] / tot) : (i ? 0 : o.amount) }));
        const rest = o.amount - sh.reduce((a, x) => a + x.rev, 0);
        if (sh[0]) sh[0].rev += rest;
        return sh;
    }
    const isAdminBuyer = o => o.user_id && BUY[o.user_id] && String(BUY[o.user_id].email || '').toLowerCase() === ADMIN_EMAIL;
    const paidOf = test => O.filter(o => o.status === 'paid' && (test || !o.is_test));
    const sheetName = id => (SH[id] && SH[id].title) || '(지운 악보)';
    const styleOf = id => STYLE[(SH[id] && SH[id].style)] || STYLE.other;
    const itemHtml = id => { const s = styleOf(id); return `<div class="it" style="--c:${s[1]}"><i></i><a href="/tab-detail.html?id=${encodeURIComponent(id)}" target="_blank" rel="noopener">${esc(sheetName(id))}</a><small>${esc(s[0])}</small></div>`; };

    // 기간: 오늘 · 7일 · 30일 · 이번 달 · 지난달 · 올해 · 전체 · 직접
    const PERIODS = [['today', '오늘'], ['7d', '7일'], ['30d', '30일'], ['month', '이번 달'], ['lastmonth', '지난달'], ['year', '올해'], ['all', '전체']];
    function rangeOf(p) {
        const t = today(), m1 = t.slice(0, 8) + '01';
        switch (p.period) {
            case 'today': return [t, t];
            case '7d': return [addDays(t, -6), t];
            case '30d': return [addDays(t, -29), t];
            case 'month': return [m1, t];
            case 'lastmonth': { const lm = addDays(m1, -1); return [lm.slice(0, 8) + '01', lm]; }
            case 'year': return [t.slice(0, 4) + '-01-01', t];
            case 'custom': return [p.from || '2026-01-01', p.to || t];
            default: return ['2000-01-01', t];
        }
    }
    const periodSeg = (key, cur) => `<div class="seg" data-pseg="${key}">${PERIODS.map(([k, n]) => `<button data-p="${k}"${cur.period === k ? ' class="on"' : ''}>${n}</button>`).join('')}<button data-p="custom"${cur.period === 'custom' ? ' class="on"' : ''}>직접</button></div>`
        + (cur.period === 'custom' ? ` <input type="date" data-pfrom="${key}" value="${esc(cur.from || rangeOf(cur)[0])}"> ~ <input type="date" data-pto="${key}" value="${esc(cur.to || today())}">` : '');

    // ---------- 맨 위 요약 (모든 판매 탭) ----------
    function summary() {
        const P = paidOf(false), t = today(), m1 = t.slice(0, 8) + '01', w1 = monday(t);
        const lm = addDays(m1, -1), lm1 = lm.slice(0, 8) + '01';
        const sumIn = (a, b) => { const L = P.filter(o => o.pday >= a && o.pday <= b); return [L.reduce((s, o) => s + o.amount, 0), L.length]; };
        const card = (label, [v, n], hi) => `<div class="sl-card${hi ? ' hi' : ''}"><small>${label}</small><b>${won(v)}</b><em>결제 ${n}건</em></div>`;
        return `<div class="sl-sum">${card('오늘', sumIn(t, t))}${card('이번 주 <em>(월~)</em>', sumIn(w1, t))}${card(`이번 달 <em>(${+t.slice(5, 7)}월)</em>`, sumIn(m1, t), true)}${card(`지난달 <em>(${+lm.slice(5, 7)}월)</em>`, sumIn(lm1, lm))}</div>`;
    }

    // ---------- 주문 관리 ----------
    const STATUS = { paid: '결제 완료', pending: '결제 대기', failed: '결제 실패', canceled: '취소' };
    function ordersHtml() {
        const p = ST.o, [from, to] = rangeOf(p), q = p.q.trim().toLowerCase();
        let L = O.filter(o => o.day >= from && o.day <= to && (p.test || !o.is_test));
        const cnt = { paid: 0, pending: 0, failed: 0 };
        L.forEach(o => { if (o.status === 'paid') cnt.paid++; else if (o.status === 'pending') cnt.pending++; else cnt.failed++; });
        if (p.status === 'paid') L = L.filter(o => o.status === 'paid');
        else if (p.status === 'pending') L = L.filter(o => o.status === 'pending');
        else if (p.status === 'failed') L = L.filter(o => o.status === 'failed' || o.status === 'canceled');
        if (p.who === 'member') L = L.filter(o => o.user_id); else if (p.who === 'guest') L = L.filter(o => !o.user_id);
        if (q) L = L.filter(o => {
            const b = BUY[o.user_id] || {};
            return [o.order_id, o.guest_email, b.email, b.nickname, o.order_name, ...o.ids.map(sheetName)].some(v => String(v || '').toLowerCase().includes(q));
        });
        const paid = L.filter(o => o.status === 'paid'), rev = paid.reduce((s, o) => s + o.amount, 0), items = paid.reduce((s, o) => s + o.ids.length, 0);
        const PER = 30, pages = Math.max(1, Math.ceil(L.length / PER));
        if (p.page > pages) p.page = pages;
        const rows = L.slice((p.page - 1) * PER, p.page * PER).map(o => {
            const b = BUY[o.user_id] || {}, adm = isAdminBuyer(o);
            const who = o.user_id
                ? `<b>${esc(b.nickname || '(닉네임 없음)')}</b>${b.email ? `<small>${esc(b.email)}</small>` : ''}${adm ? '<span class="tg adm">운영 계정</span>' : ''}`
                : `<span class="tg guest">비회원</span><small>${esc(o.guest_email || '')}</small>`;
            const tm = new Date(Date.parse(o.created_at) + KST).toISOString();
            const open = ST.o.open === o.order_id;
            return `<tr class="clk${open ? ' sel' : ''}" data-oid="${esc(o.order_id)}">
                <td class="when">${tm.slice(0, 10).replace(/-/g, '.')}<small>${tm.slice(11, 16)} · ${WD[new Date(tm.slice(0, 10) + 'T00:00:00Z').getUTCDay()]}</small></td>
                <td>${o.ids.map(itemHtml).join('')}</td>
                <td class="who">${who}</td>
                <td class="pm">${esc(o.method || '–')}${o.pay_detail && o.pay_detail !== o.method ? `<small>${esc(o.pay_detail)}</small>` : ''}</td>
                <td class="r amt">${won(o.amount)}</td>
                <td><span class="tg ${esc(o.status)}">${STATUS[o.status] || esc(o.status)}</span>${o.is_test ? '<span class="tg test">테스트</span>' : ''}</td></tr>`
                + (open ? `<tr class="more"><td colspan="6">주문번호 <span class="oid">${esc(o.order_id)}</span> · ${esc(o.order_name)}
                    ${o.approved_at ? ` · 결제 승인 ${esc(new Date(Date.parse(o.approved_at) + KST).toISOString().slice(0, 16).replace('T', ' '))}` : ''}
                    ${o.receipt_url ? ` · <a href="${esc(o.receipt_url)}" target="_blank" rel="noopener">카드 영수증 <i class="fas fa-arrow-up-right-from-square"></i></a>` : ''}
                    ${o.fail_message ? `<br>실패 사유: ${esc(o.fail_message)}${o.fail_code ? ` (${esc(o.fail_code)})` : ''}` : ''}
                    ${o.ids.length > 1 ? `<br>악보별 매출(정가 비율): ${split(o).map(x => esc(sheetName(x.id)) + ' ' + won(x.rev)).join(' · ')}` : ''}</td></tr>` : '');
        }).join('');
        const pager = pages > 1 ? `<div class="pager">${Array.from({ length: pages }, (_, i) => `<button data-opage="${i + 1}"${i + 1 === p.page ? ' class="on"' : ''}>${i + 1}</button>`).join('')}</div>` : '';
        return `${summary()}
            <div class="sl-bar"><span class="lbl">기간</span>${periodSeg('o', p)}</div>
            <div class="sl-bar">
                <div class="seg" data-oseg="status">${[['paid', `결제 완료 ${cnt.paid}`], ['all', '전체'], ['pending', `결제 대기 ${cnt.pending}`], ['failed', `실패·취소 ${cnt.failed}`]].map(([k, n]) => `<button data-v="${k}"${p.status === k ? ' class="on"' : ''}>${n}</button>`).join('')}</div>
                <div class="seg" data-oseg="who">${[['all', '전체'], ['member', '회원'], ['guest', '비회원']].map(([k, n]) => `<button data-v="${k}"${p.who === k ? ' class="on"' : ''}>${n}</button>`).join('')}</div>
                <label class="ck"><input type="checkbox" data-otest${p.test ? ' checked' : ''}> 테스트 결제 포함</label>
                <span class="sp"></span>
                <input type="search" data-oq placeholder="주문번호·이메일·닉네임·곡명" value="${esc(p.q)}">
            </div>
            <div class="sl-bar"><span class="lbl">이 기간 ${p.status === 'paid' ? '' : '(결제 완료만) '}매출 <b style="color:var(--green)">${won(rev)}</b> · 결제 ${paid.length}건 · 악보 ${items}개${paid.length ? ` · 주문당 평균 ${won(rev / paid.length)}` : ''}</span></div>
            <div class="sl-tw"><table class="sl"><thead><tr><th>주문일시</th><th>주문 악보</th><th>구매자</th><th>결제 방법</th><th class="r">금액</th><th>상태</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="6" class="sl-empty">이 조건의 주문이 없어요</td></tr>`}</tbody></table></div>${pager}
            <p class="sl-note">줄을 누르면 주문번호·카드 영수증·실패 사유가 보여요. 결제 대기 = 결제창을 열었다가 끝내지 않은 주문이에요.${buyersFn ? '' : ' <b>회원 이메일은 서버 함수(db/sheet_shop_admin.sql) 적용 뒤에 보여요.</b>'}</p>`;
    }

    // ---------- 정산 관리 ----------
    const UNITS = [['day', '일'], ['week', '주'], ['month', '월'], ['year', '연']];
    const bkey = (d, u) => u === 'day' ? d : u === 'week' ? monday(d) : u === 'month' ? d.slice(0, 7) : d.slice(0, 4);
    function blabel(k, u, short) {
        if (u === 'day') return short ? mmdd(k) : `${+k.slice(5, 7)}월 ${+k.slice(8, 10)}일 (${WD[new Date(k + 'T00:00:00Z').getUTCDay()]})`;
        if (u === 'week') return short ? mmdd(k) : `${mmdd(k)} ~ ${mmdd(addDays(k, 6))}`;
        if (u === 'month') return short ? `${+k.slice(5, 7)}월` : `${k.slice(0, 4)}년 ${+k.slice(5, 7)}월`;
        return k + '년';
    }
    function buckets(u, P) {
        const t = today(), first = P.length ? P.reduce((m, o) => o.pday < m ? o.pday : m, t) : t, out = [];
        if (u === 'day') for (let i = 30; i >= 0; i--) out.push(addDays(t, -i));
        else if (u === 'week') for (let i = 12; i >= 0; i--) out.push(monday(addDays(t, -7 * i)));
        else if (u === 'month') {
            let y = +first.slice(0, 4), m = +first.slice(5, 7);
            const ty = +t.slice(0, 4), tm = +t.slice(5, 7);
            if ((ty - y) * 12 + tm - m > 23) { y = ty - 2; m = tm + 1; if (m > 12) { m -= 12; y++; } }
            for (; y < ty || (y === ty && m <= tm); m++) { if (m > 12) { m = 1; y++; if (y > ty) break; } out.push(`${y}-${String(m).padStart(2, '0')}`); }
            if (out.length < 6) { const pad = []; let yy = +out[0].slice(0, 4), mm = +out[0].slice(5, 7); while (pad.length + out.length < 6) { mm--; if (mm < 1) { mm = 12; yy--; } pad.unshift(`${yy}-${String(mm).padStart(2, '0')}`); } out.unshift(...pad); }
        } else for (let y = Math.min(+first.slice(0, 4), +t.slice(0, 4)); y <= +t.slice(0, 4); y++) out.push(String(y));
        return out;
    }
    // 음저협 사용료(추정): 곡·달마다 max(77원 × 다운로드, 매출 × 11%) × 92.76% — 음저협에 맡기지 않은 자작곡은 뺀다
    const managed = id => { const s = SH[id]; return !s || s.kind !== 'original' || !!(s.komca_code && String(s.komca_code).trim()); };
    function komcaOf(P) {
        const g = {};
        P.forEach(o => split(o).forEach(x => { if (!managed(x.id)) return; const k = o.pday.slice(0, 7) + '|' + x.id; (g[k] = g[k] || { dl: 0, rev: 0 }); g[k].dl++; g[k].rev += x.rev; }));
        return Object.values(g).reduce((s, v) => s + Math.max(77 * v.dl, v.rev * 0.11) * 0.9276, 0);
    }
    function settleHtml() {
        const p = ST.s, P = paidOf(p.test), u = p.unit, ks = buckets(u, P), rate = (+p.fee || 0) / 100;
        const by = {}; ks.forEach(k => { by[k] = []; });
        P.forEach(o => { const k = bkey(o.pday, u); if (by[k]) by[k].push(o); });
        if (!p.sel || !by[p.sel]) p.sel = ks[ks.length - 1];
        const row = k => {
            const L = by[k], rev = L.reduce((s, o) => s + o.amount, 0), fee = Math.round(rev * rate), km = (u === 'month' || u === 'year') ? Math.round(komcaOf(L)) : null;
            return { k, L, n: L.length, items: L.reduce((s, o) => s + o.ids.length, 0), rev, fee, dep: rev - fee, km, net: km == null ? null : rev - fee - km };
        };
        const R = ks.map(row), max = Math.max(1, ...R.map(r => r.rev));
        // 막대 그래프 (왼쪽 = 예전, 오른쪽 = 지금)
        const W = 760, H = 170, pad = 22, bw = (W - 8) / R.length, show = R.length <= 13 ? 1 : R.length <= 31 ? 3 : 4;
        const bars = R.map((r, i) => {
            const h = Math.round((H - pad - 18) * r.rev / max), x = 4 + i * bw, sel = r.k === p.sel, w = Math.min(bw * 0.68, 64);
            return `<g data-sk="${esc(r.k)}" style="cursor:pointer"><title>${esc(blabel(r.k, u))} · ${won(r.rev)} · 결제 ${r.n}건</title>
                <rect x="${x}" y="0" width="${bw}" height="${H}" fill="transparent"/>
                <rect x="${x + (bw - w) / 2}" y="${H - pad - h}" width="${w}" height="${Math.max(h, r.rev ? 2 : 0)}" rx="3" fill="${sel ? '#2a6b4a' : '#8fcaa5'}"/>
                ${r.rev && (R.length <= 13 || sel) ? `<text x="${x + bw / 2}" y="${H - pad - h - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#2a6b4a">${r.rev >= 10000 ? (Math.round(r.rev / 1000) / 10) + '만' : num(r.rev)}</text>` : ''}
                ${i % show === 0 || sel ? `<text x="${x + bw / 2}" y="${H - 5}" text-anchor="middle" font-size="11" fill="${sel ? '#2a6b4a' : '#999'}"${sel ? ' font-weight="700"' : ''}>${esc(blabel(r.k, u, true))}</text>` : ''}</g>`;
        }).join('');
        const chart = `<div class="sl-chart"><h4>${{ day: '최근 31일', week: '최근 13주', month: '달마다', year: '해마다' }[u]} 매출 <small>막대를 누르면 그 기간 자세히</small></h4>
            <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="기간별 매출 막대 그래프"><line x1="0" x2="${W}" y1="${H - pad}" y2="${H - pad}" stroke="#e6e6e6"/>${bars}</svg></div>`;
        const tbody = R.slice().reverse().map(r => `<tr class="clk${r.k === p.sel ? ' sel' : ''}" data-sk="${esc(r.k)}"><td>${esc(blabel(r.k, u))}</td><td class="r">${r.n}</td><td class="r">${r.items}</td>
            <td class="r amt">${won(r.rev)}</td><td class="r">${r.rev ? '−' + won(r.fee) : '–'}</td><td class="r">${won(r.dep)}</td>
            ${u === 'month' || u === 'year' ? `<td class="r">${r.km ? '−' + won(r.km) : '–'}</td><td class="r amt">${won(r.net)}</td>` : ''}</tr>`).join('');
        const T = R.reduce((a, r) => ({ n: a.n + r.n, items: a.items + r.items, rev: a.rev + r.rev, fee: a.fee + r.fee, dep: a.dep + r.dep, km: a.km + (r.km || 0) }), { n: 0, items: 0, rev: 0, fee: 0, dep: 0, km: 0 });
        const table = `<div class="sl-tw"><table class="sl"><thead><tr><th>기간</th><th class="r">결제</th><th class="r">악보</th><th class="r">매출</th><th class="r">결제 수수료(추정)</th><th class="r">입금 예상</th>
            ${u === 'month' || u === 'year' ? '<th class="r">음저협 사용료(추정)</th><th class="r">남는 돈(추정)</th>' : ''}</tr></thead><tbody>${tbody}
            <tr><td><b>합계</b></td><td class="r"><b>${T.n}</b></td><td class="r"><b>${T.items}</b></td><td class="r amt">${won(T.rev)}</td><td class="r">${T.rev ? '−' + won(T.fee) : '–'}</td><td class="r"><b>${won(T.dep)}</b></td>
            ${u === 'month' || u === 'year' ? `<td class="r">${T.km ? '−' + won(T.km) : '–'}</td><td class="r amt">${won(T.dep - T.km)}</td>` : ''}</tr></tbody></table></div>`;
        // 고른 기간 자세히: 많이 팔린 악보 · 결제 방법 · 회원/비회원
        const S = R.find(r => r.k === p.sel) || R[R.length - 1], per = {};
        S.L.forEach(o => split(o).forEach(x => { (per[x.id] = per[x.id] || { n: 0, rev: 0 }); per[x.id].n++; per[x.id].rev += x.rev; }));
        const top = Object.entries(per).sort((a, b) => b[1].rev - a[1].rev || b[1].n - a[1].n).slice(0, 15);
        const pm = {}; S.L.forEach(o => { const k = o.pay_detail || o.method || '알 수 없음'; pm[k] = (pm[k] || 0) + 1; });
        const mem = S.L.filter(o => o.user_id).length;
        const detail = `<div class="sl-two"><div class="sl-box"><h4>${esc(blabel(S.k, u))} 많이 팔린 악보<small>매출 순</small></h4>
            ${top.map(([id, v], i) => `<div class="sl-rk"><span class="n">${i + 1}</span><span class="t">${esc(sheetName(id))}<small>${esc(styleOf(id)[0])}</small></span><span class="v">${won(v.rev)}<small>${v.n}개</small></span></div>`).join('') || '<p class="sl-empty">이 기간에 팔린 악보가 없어요</p>'}</div>
            <div class="sl-box"><h4>${esc(blabel(S.k, u))} 결제</h4>
            <div class="sl-kv"><span>매출</span><b>${won(S.rev)}</b></div><div class="sl-kv"><span>결제</span><b>${S.n}건 · 악보 ${S.items}개</b></div>
            <div class="sl-kv"><span>회원 / 비회원</span><b>${mem} / ${S.n - mem}</b></div>
            ${Object.entries(pm).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<div class="sl-kv"><span>${esc(k)}</span><b>${n}건</b></div>`).join('')}
            <p class="sl-note">결제 수수료율 <input class="sl-fee" type="number" step="0.01" min="0" max="20" data-fee value="${esc(p.fee)}">% (추정 — 토스 상점관리자 정산 내역과 맞춰 고쳐 주세요. 이 브라우저에 기억해요)</p></div></div>`;
        return `${summary()}
            <div class="sl-bar"><span class="lbl">단위</span><div class="seg" data-sseg>${UNITS.map(([k, n]) => `<button data-u="${k}"${u === k ? ' class="on"' : ''}>${n}</button>`).join('')}</div>
                <label class="ck"><input type="checkbox" data-stest${p.test ? ' checked' : ''}> 테스트 결제 포함</label></div>
            ${chart}${table}${detail}
            <p class="sl-note">매출 = 손님이 낸 금액(부가세 포함, 결제 승인 날 기준 · 한국 시간). 여러 악보를 한 번에 산 주문은 정가 비율로 악보마다 나눠요.
            토스 정산은 거래일 + 4영업일에 들어와요. 음저협 사용료는 곡·달마다 max(77원 × 다운로드, 매출 × 11%) × 92.76%로 어림한 값이고(자작곡 중 음저협에 안 맡긴 곡은 뺌),
            계약서의 매출은 부가세·결제수수료·환불을 뺀 금액이라 실제보다 조금 크게 잡혀요. 정확한 신고 자료는 위 '음저협 정산'(악보 관리 탭)으로 받아요.</p>`;
    }

    // ---------- 마케팅 분석 ----------
    async function mktHtml() {
        const p = ST.m, [from0, to] = rangeOf(p), from = from0 < TRACK_FROM ? TRACK_FROM : from0;
        const key = from + '|' + to;
        if (!traffic || traffic.key !== key) traffic = { key, rows: await loadTraffic(from, to) };
        const T = traffic.rows, per = {};
        const get = id => (per[id] = per[id] || { views: 0, carts: 0, orders: 0, rev: 0 });
        (T || []).forEach(r => { const x = get(r.sheet_id); x.views += r.views; x.carts += r.carts; });
        const P = paidOf(false).filter(o => o.pday >= from && o.pday <= to);   // 전환율이 맞게 결제도 같은 기간(세기 시작한 날부터)
        P.forEach(o => split(o).forEach(x => { const y = get(x.id); y.orders++; y.rev += x.rev; }));
        if (p.all) Object.values(SH).filter(s => s.published).forEach(s => get(s.id));
        const tot = Object.values(per).reduce((a, x) => ({ views: a.views + x.views, carts: a.carts + x.carts, orders: a.orders + x.orders, rev: a.rev + x.rev }), { views: 0, carts: 0, orders: 0, rev: 0 });
        const conv = x => x.views ? x.orders / x.views : -1;
        const rows = Object.entries(per).sort((a, b) => {
            const va = p.sort === 'conv' ? conv(a[1]) : p.sort === 'title' ? sheetName(a[0]) : a[1][p.sort], vb = p.sort === 'conv' ? conv(b[1]) : p.sort === 'title' ? sheetName(b[0]) : b[1][p.sort];
            return (typeof va === 'string' ? va.localeCompare(vb, 'ko') : va - vb) * p.dir || b[1].views - a[1].views;
        });
        const mx = Math.max(1, ...rows.map(r => r[1].views));
        const th = (k, n) => `<th class="${k === 'title' ? '' : 'r'}"><button class="so${p.sort === k ? ' on' : ''}" data-msort="${k}">${n}${p.sort === k ? (p.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
        const body = rows.slice(0, 300).map(([id, x]) => `<tr><td>${itemHtml(id)}<div class="bar"><span style="width:${Math.round(100 * x.views / mx)}%"></span></div></td>
            <td class="r">${num(x.views)}</td><td class="r">${num(x.carts)}</td><td class="r"><b>${num(x.orders)}</b></td><td class="r">${x.views ? pct(x.orders, x.views) : '–'}</td><td class="r">${x.rev ? won(x.rev) : '–'}</td></tr>`).join('');
        // 날마다 상세 보기 · 장바구니 · 결제
        const days = []; for (let d = from; d <= to && days.length < 400; d = addDays(d, 1)) days.push(d);
        const dv = {}; days.forEach(d => { dv[d] = { v: 0, c: 0, o: 0 }; });
        (T || []).forEach(r => { if (dv[r.day]) { dv[r.day].v += r.views; dv[r.day].c += r.carts; } });
        P.forEach(o => { if (dv[o.pday]) dv[o.pday].o += o.ids.length; });
        const dmax = Math.max(1, ...days.map(d => dv[d].v)), W = 760, H = 140, pad = 20, bw = (W - 8) / Math.max(days.length, 1), every = days.length <= 14 ? 1 : days.length <= 31 ? 3 : 7;
        const g = days.map((d, i) => { const x = 4 + i * bw, v = dv[d], hv = Math.round((H - pad - 16) * v.v / dmax), hc = Math.round((H - pad - 16) * v.c / dmax), ho = Math.round((H - pad - 16) * v.o / dmax);
            return `<g><title>${esc(blabel(d, 'day'))} · 상세 보기 ${v.v} · 장바구니 ${v.c} · 결제 악보 ${v.o}</title>
                <rect x="${x + bw * 0.12}" y="${H - pad - hv}" width="${bw * 0.34}" height="${Math.max(hv, v.v ? 2 : 0)}" rx="2" fill="#8fcaa5"/>
                <rect x="${x + bw * 0.48}" y="${H - pad - hc}" width="${bw * 0.2}" height="${Math.max(hc, v.c ? 2 : 0)}" rx="2" fill="#eaac14"/>
                <rect x="${x + bw * 0.7}" y="${H - pad - ho}" width="${bw * 0.2}" height="${Math.max(ho, v.o ? 2 : 0)}" rx="2" fill="#2a6b4a"/>
                ${i % every === 0 ? `<text x="${x + bw / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="#999">${mmdd(d)}</text>` : ''}</g>`; }).join('');
        const chart = days.length > 1 ? `<div class="sl-chart"><h4>날마다 <span class="lg" style="--c:#8fcaa5"><i></i>상세 보기</span><span class="lg" style="--c:#eaac14"><i></i>장바구니</span><span class="lg" style="--c:#2a6b4a"><i></i>결제한 악보</span></h4>
            <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="날마다 상세 보기·장바구니·결제 막대 그래프"><line x1="0" x2="${W}" y1="${H - pad}" y2="${H - pad}" stroke="#e6e6e6"/>${g}</svg></div>` : '';
        const card = (l, v, hi, sub) => `<div class="sl-card${hi ? ' hi' : ''}"><small>${l}</small><b>${v}</b>${sub ? `<em>${sub}</em>` : ''}</div>`;
        return `<div class="sl-sum">${card('상세 보기', num(tot.views), false, '악보 페이지를 연 브라우저')}${card('장바구니 담기', num(tot.carts), false, tot.views ? '상세 보기의 ' + pct(tot.carts, tot.views) : '')}
                ${card('결제한 악보', num(tot.orders), true, tot.views ? '상세 보기의 ' + pct(tot.orders, tot.views) : '')}${card('매출', won(tot.rev))}</div>
            <div class="sl-bar"><span class="lbl">기간</span>${periodSeg('m', p)}<label class="ck"><input type="checkbox" data-mall${p.all ? ' checked' : ''}> 판매 중인 악보 모두 보기</label></div>
            ${T == null ? `<p class="sl-note warn"><i class="fas fa-circle-info"></i> 상세 보기·장바구니 숫자는 서버 함수(<code>db/sheet_shop_admin.sql</code>)를 적용한 뒤부터 쌓여요. 지금은 결제 숫자만 보여요.</p>` : ''}
            ${chart}
            <div class="sl-tw"><table class="sl"><thead><tr>${th('title', '악보')}${th('views', '상세 보기')}${th('carts', '장바구니')}${th('orders', '결제')}${th('conv', '전환율')}${th('rev', '매출')}</tr></thead>
            <tbody>${body || `<tr><td colspan="6" class="sl-empty">이 기간에 숫자가 없어요</td></tr>`}</tbody></table></div>
            <p class="sl-note">상세 보기 = 악보 페이지를 연 브라우저 수(같은 브라우저의 같은 악보는 하루 한 번, 검색 로봇·운영 계정은 안 셈) · 장바구니 = 장바구니에 담은 수 ·
            결제 = 결제 완료된 악보 수(테스트 결제 빼고) · 전환율 = 결제 ÷ 상세 보기. 상세 보기·장바구니는 ${TRACK_FROM.slice(5).replace('-', '월 ')}일부터 세서, 이 탭은 그날부터의 숫자만 보여요(그 전 판매는 정산 관리에서).</p>`;
    }

    // ---------- 그리기 · 탭 ----------
    async function render() {
        const pane = $('salesPane');
        if (!pane || tab === 'sheets') return;
        if (!loaded) {
            pane.innerHTML = '<p class="sl-empty"><i class="fas fa-spinner fa-spin"></i> 판매 기록을 불러오는 중…</p>';
            try { await load(); } catch (e) { pane.innerHTML = `<p class="sl-empty">판매 기록을 불러오지 못했어요.<br><small>${esc(e.message || e)}</small></p>`; return; }
        }
        const t = tab;
        const html = t === 'orders' ? ordersHtml() : t === 'settle' ? settleHtml() : await mktHtml();
        if (t !== tab) return;
        const y = window.scrollY;
        pane.innerHTML = html + `<p class="sl-note" style="text-align:right"><button class="btn" data-reload><i class="fas fa-rotate"></i> 새로고침</button></p>`;
        window.scrollTo(0, y);
    }
    function setTab(t, push) {
        tab = t;
        document.querySelectorAll('#mtabs [data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === t));
        $('sheetsPane').hidden = t !== 'sheets';
        $('salesPane').hidden = t === 'sheets';
        if (push !== false) history.replaceState(null, '', location.pathname + location.search + '#' + t);
        render();
    }
    function mount() {
        const app = $('app');
        if ($('mtabs')) return;
        const nav = document.createElement('nav');
        nav.className = 'mtabs'; nav.id = 'mtabs';
        nav.innerHTML = [['orders', 'fa-receipt', '주문 관리'], ['settle', 'fa-sack-dollar', '정산 관리'], ['mkt', 'fa-chart-column', '마케팅 분석'], ['sheets', 'fa-music', '악보 관리']]
            .map(([k, ic, n]) => `<button data-t="${k}"><i class="fas ${ic}"></i>${n}</button>`).join('');
        const pane = document.createElement('div'); pane.id = 'salesPane';
        app.prepend(nav, pane);
        nav.addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) setTab(b.dataset.t); });
        pane.addEventListener('click', onClick);
        pane.addEventListener('change', onChange);
        let tq = 0;
        pane.addEventListener('input', e => {
            if (e.target.matches('[data-oq]')) { clearTimeout(tq); const v = e.target.value; tq = setTimeout(() => { ST.o.q = v; ST.o.page = 1; render().then(() => { const i = document.querySelector('[data-oq]'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }); }, 250); }
        });
    }
    function onClick(e) {
        const P = e.target.closest('[data-pseg] [data-p]');
        if (P) { const k = P.closest('[data-pseg]').dataset.pseg, s = ST[k]; s.period = P.dataset.p; if (k === 'o') s.page = 1; render(); return; }
        const os = e.target.closest('[data-oseg] [data-v]');
        if (os) { ST.o[os.closest('[data-oseg]').dataset.oseg] = os.dataset.v; ST.o.page = 1; render(); return; }
        const pg = e.target.closest('[data-opage]'); if (pg) { ST.o.page = +pg.dataset.opage; render(); return; }
        const su = e.target.closest('[data-sseg] [data-u]'); if (su) { ST.s.unit = su.dataset.u; ST.s.sel = null; render(); return; }
        const sk = e.target.closest('[data-sk]'); if (sk) { ST.s.sel = sk.dataset.sk; render(); return; }
        const ms = e.target.closest('[data-msort]'); if (ms) { const k = ms.dataset.msort; if (ST.m.sort === k) ST.m.dir *= -1; else { ST.m.sort = k; ST.m.dir = k === 'title' ? 1 : -1; } render(); return; }
        if (e.target.closest('[data-reload]')) { loaded = false; loading = null; traffic = null; backfilled = false; render(); return; }
        const tr = e.target.closest('tr[data-oid]');
        if (tr && !e.target.closest('a')) { ST.o.open = ST.o.open === tr.dataset.oid ? null : tr.dataset.oid; render(); }
    }
    function onChange(e) {
        const t = e.target;
        if (t.matches('[data-otest]')) { ST.o.test = t.checked; ST.o.page = 1; }
        else if (t.matches('[data-stest]')) ST.s.test = t.checked;
        else if (t.matches('[data-mall]')) ST.m.all = t.checked;
        else if (t.matches('[data-fee]')) { ST.s.fee = Math.max(0, Math.min(20, +t.value || 0)); store.set('feeRate', ST.s.fee); }
        else if (t.matches('[data-pfrom]')) ST[t.dataset.pfrom].from = t.value;
        else if (t.matches('[data-pto]')) ST[t.dataset.pto].to = t.value;
        else return;
        render();
    }

    function start(client, opt) {
        sb = client;
        css();
        mount();
        const h = location.hash.slice(1);
        setTab(opt && opt.edit ? 'sheets' : (['orders', 'settle', 'mkt', 'sheets'].includes(h) ? h : 'orders'), false);
    }
    window.adminSales = { start, setTab, _st: ST };
})();
