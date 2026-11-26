/* cart.js — TAB악보 장바구니 (2026-11-26 사용자: '장바구니 시스템도 넣자')
   auth.js · checkout.js 다음에 넣는다(메인·악보 상세·구매 내역). window.ahnssamCart
   - 담은 악보는 이 브라우저(localStorage ahnssam_cart)에만 — 로그인하지 않아도 담을 수 있다. 개인 정보 없음.
   - 담긴 게 있으면 오른쪽 아래에 장바구니 단추(숫자). 누르면 오른쪽에서 장바구니 창.
   - 금액은 서버(sheet_cart_quote, db/sheet_shop_admin.sql)가 계산 — 같은 곡 반주 + 기타솔로 묶음 할인(곡마다 500원),
     로그인했으면 이미 산 악보 표시·이미 산 짝 할인까지. 결제는 checkout.js 의 buy(여러 개) 그대로(회원·비회원).
   - 한 번에 10개 · 1만원까지(토스 계약: 한 번 결제 1만원 이하). 넘으면 몇 개만 골라(체크) 나눠서 결제.
   - 결제가 끝나 purchases.html 이 승인에 성공하면 산 악보는 장바구니에서 뺀다(paid() — checkout.js 가 sessionStorage ahnssam_paying 에 적어 둠).
   - 마케팅 분석: 담을 때 sheet_track(악보, 'cart') — 같은 브라우저의 같은 악보는 하루 한 번만 센다.
     시험하는 브라우저는 localStorage ahnssam_notrack = '1' 이면 안 센다(상세 보기도).
   - 설치한 앱(Google Play) 안에서는 디지털 상품을 팔지 않아서 장바구니도 안 보인다.
*/
(function () {
    'use strict';
    const KEY = 'ahnssam_cart', MAX = 10, LIMIT = 10000;
    const IS_APP = !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    const STYLE = { acoustic: ['통기타', '#cf9a68'], electric: ['일렉기타', '#42a854'], fingerstyle: ['핑거스타일', '#eaac14'], solo: ['기타솔로', '#52a6f2'],
        chord: ['코드악보', '#f06a6e'], bass: ['베이스', '#a98cf2'], other: ['악보', '#8a9a90'] };
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const won = n => (Number(n) || 0).toLocaleString() + '원';
    const isId = v => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);

    // ---------- 담은 목록 (이 브라우저) ----------
    function read() {
        try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a.filter(x => x && isId(x.id)) : []; } catch (e) { return []; }
    }
    function write(list) {
        try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30))); } catch (e) {}
        fire();
    }
    const ids = () => read().map(x => x.id);
    const has = id => ids().includes(id);
    function fire() {
        paintFab();
        try { window.dispatchEvent(new CustomEvent('ahnssam-cart-change', { detail: { ids: ids() } })); } catch (e) {}
    }
    // 담기 — 반환 { added: [...], full: true/false }
    function add(list) {
        const cur = read(), now = Date.now(), added = [];
        [].concat(list).filter(isId).forEach(id => {
            if (cur.some(x => x.id === id)) return;
            if (cur.length >= MAX) return;
            cur.push({ id, at: now }); added.push(id);
        });
        const full = [].concat(list).filter(isId).some(id => !cur.some(x => x.id === id));
        if (added.length) { write(cur); added.forEach(id => track(id, 'cart')); }
        return { added, full };
    }
    function remove(list) {
        const out = new Set([].concat(list));
        write(read().filter(x => !out.has(x.id)));
    }
    function clear() { write([]); }

    // ---------- 마케팅 분석 숫자 (상세 보기 · 장바구니) — 같은 브라우저의 같은 악보는 하루 한 번 ----------
    const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);   // 한국 날짜
    function track(id, kind) {
        if (!isId(id) || (kind !== 'view' && kind !== 'cart')) return;
        if (navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent || '')) return;
        try { if (localStorage.getItem('ahnssam_notrack') === '1') return; } catch (e) {}   // 시험하는 브라우저(Claude 확인용)는 안 셈
        const k = 'ahnssam_seen_' + kind, day = today();
        let seen = {};
        try { seen = JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) {}
        if (!seen || seen.d !== day) seen = { d: day, ids: [] };
        if (seen.ids.includes(id)) return;
        seen.ids.push(id);
        try { localStorage.setItem(k, JSON.stringify(seen)); } catch (e) {}
        sbReady().then(sb => sb && sb.rpc('sheet_track', { p_sheet: id, p_kind: kind })).catch(() => {});
    }

    // ---------- 서버 ----------
    function sbReady() {
        const C = window.ahnssamCheckout, A = () => window.ahnssamAuth;
        const p = C && C.ready ? C.ready() : Promise.resolve();
        return p.then(() => (A() && A().supabase) || null);
    }
    let quoteMissing = false;   // 서버 함수가 아직 없음(SQL 적용 전)
    async function quote(list) {
        const sb = await sbReady();
        if (!sb) throw new Error('잠시 뒤 다시 시도해 주세요.');
        const { data, error } = await sb.rpc('sheet_cart_quote', { p_sheet_ids: list });
        if (error) {
            if (/sheet_cart_quote|PGRST202|does not exist/i.test(error.message + ' ' + error.code)) quoteMissing = true;
            throw error;
        }
        return data;
    }

    // ---------- 모양 ----------
    function css() {
        if (document.getElementById('ac-css')) return;
        const st = document.createElement('style');
        st.id = 'ac-css';
        st.textContent = `
.ac-fab{position:fixed;right:18px;bottom:18px;z-index:2400;display:none;align-items:center;gap:8px;border:0;border-radius:28px;padding:12px 18px 12px 16px;background:#2a6b4a;color:#fff;font:700 14.5px 'Noto Sans KR',sans-serif;box-shadow:0 8px 24px rgba(20,60,40,.32);cursor:pointer;transition:transform .15s}
.ac-fab.show{display:inline-flex}.ac-fab:hover{transform:translateY(-2px)}
.ac-fab i{font-size:17px}.ac-fab b{min-width:22px;height:22px;border-radius:11px;background:#ffd84d;color:#3a2c00;font-size:12.5px;display:inline-grid;place-items:center;padding:0 6px}
.ac-fab.pop{animation:acPop .45s}@keyframes acPop{30%{transform:scale(1.15)}60%{transform:scale(.95)}}
.ac-back{position:fixed;inset:0;z-index:2500;background:rgba(15,25,20,.45);opacity:0;transition:opacity .2s}
.ac-back.open{opacity:1}
.ac-dr{position:fixed;top:0;right:0;bottom:0;z-index:2501;width:min(420px,100%);background:#fff;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;font-family:'Noto Sans KR',sans-serif;color:#1a1a1a;box-shadow:-8px 0 30px rgba(0,0,0,.18)}
.ac-dr.open{transform:none}
.ac-hd{display:flex;align-items:center;gap:8px;padding:18px 18px 14px;border-bottom:1px solid #eef1ef}
.ac-hd h3{font-size:18px;font-weight:900;color:#2a6b4a;margin:0}.ac-hd small{color:#888;font-size:13px}
.ac-hd .x{margin-left:auto;border:0;background:none;font-size:20px;color:#888;cursor:pointer;padding:4px 6px}
.ac-bd{flex:1;overflow:auto;padding:6px 18px 12px}
.ac-row{display:flex;gap:11px;align-items:center;padding:12px 0;border-bottom:1px solid #f1f3f2}
.ac-row input{width:18px;height:18px;accent-color:#2a6b4a;flex:none}
.ac-th{width:48px;height:48px;border-radius:8px;flex:none;background:var(--c);display:grid;place-items:center;color:#fff;font-size:10.5px;font-weight:800;overflow:hidden;position:relative;text-align:center;line-height:1.15}
.ac-th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ac-tx{flex:1;min-width:0}.ac-tx a{display:block;font-weight:700;font-size:14px;color:#1a1a1a;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ac-tx a:hover{text-decoration:underline}
.ac-tx small{display:block;font-size:12px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ac-tx .st{display:inline-block;font-size:11px;font-weight:700;border-radius:8px;padding:1px 7px;margin-top:3px;background:#fdecea;color:#c0392b}
.ac-tx .st.own{background:#eef6f1;color:#1f8a52}
.ac-pr{font-weight:700;font-size:14px;white-space:nowrap}
.ac-row.off .ac-pr,.ac-row.off .ac-tx a{color:#aaa}.ac-row.off .ac-th{filter:grayscale(1);opacity:.6}
.ac-rm{border:0;background:none;color:#bbb;font-size:15px;cursor:pointer;padding:6px 2px}.ac-rm:hover{color:#c0392b}
.ac-empty{text-align:center;color:#888;padding:60px 10px}.ac-empty i{font-size:34px;color:#cfe3d7;display:block;margin-bottom:12px}
.ac-empty a{display:inline-block;margin-top:14px;color:#2a6b4a;font-weight:700;border:1.5px solid #b5e6c8;border-radius:20px;padding:8px 16px;text-decoration:none}
.ac-ft{border-top:1px solid #eef1ef;padding:14px 18px 18px;background:#fbfcfb}
.ac-ln{display:flex;justify-content:space-between;font-size:13.5px;color:#555;margin:3px 0}
.ac-ln.off span:last-child{color:#d9480f;font-weight:700}
.ac-ln.sum{font-size:17px;color:#1a1a1a;font-weight:900;margin-top:8px}.ac-ln.sum span:last-child{color:#2a6b4a}
.ac-warn{background:#fff4e0;color:#8a5a00;border-radius:10px;padding:9px 11px;font-size:12.5px;line-height:1.5;margin:10px 0 0}
.ac-go{display:block;width:100%;margin-top:12px;border:0;border-radius:26px;padding:14px;background:#2a6b4a;color:#fff;font:700 15.5px 'Noto Sans KR',sans-serif;cursor:pointer}
.ac-go:disabled{opacity:.45;cursor:default}.ac-go:not(:disabled):hover{background:#3a8a5c}
.ac-note{font-size:11.5px;color:#999;line-height:1.55;margin-top:10px}
.ac-sel{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#666;padding:10px 0 4px}
.ac-sel button{border:0;background:none;color:#2a6b4a;font:inherit;font-weight:700;cursor:pointer;padding:0;margin-left:auto}
@media (max-width:520px){.ac-fab{right:12px;bottom:12px;padding:11px 15px 11px 14px}}
@media (prefers-reduced-motion:reduce){.ac-dr,.ac-back,.ac-fab{transition:none}.ac-fab.pop{animation:none}}`;
        document.head.appendChild(st);
    }

    // ---------- 오른쪽 아래 단추 ----------
    let fab = null;
    function paintFab(pop) {
        if (IS_APP || !document.body) return;
        css();
        if (!fab) {
            fab = document.createElement('button');
            fab.type = 'button'; fab.className = 'ac-fab'; fab.setAttribute('aria-label', '장바구니 열기');
            fab.addEventListener('click', () => open());
            document.body.appendChild(fab);
        }
        const n = read().length;
        fab.innerHTML = `<i class="fas fa-cart-shopping"></i>장바구니 <b>${n}</b>`;
        fab.classList.toggle('show', n > 0 && !(dr && dr.classList.contains('open')));
        if (pop) { fab.classList.remove('pop'); void fab.offsetWidth; fab.classList.add('pop'); }
    }

    // ---------- 장바구니 창 ----------
    let back = null, dr = null, Q = null, pick = null, lastFocus = null;
    function coverUrl(sb, it) {
        if (!sb) return '';
        if (it.cover_path) return sb.storage.from('sheet-covers').getPublicUrl(it.cover_path).data.publicUrl;
        return '';
    }
    async function open() {
        if (IS_APP) return;
        css();
        lastFocus = document.activeElement;
        if (!dr) {
            back = document.createElement('div'); back.className = 'ac-back';
            dr = document.createElement('aside'); dr.className = 'ac-dr'; dr.setAttribute('role', 'dialog'); dr.setAttribute('aria-label', '장바구니');
            back.addEventListener('click', close);
            dr.addEventListener('click', onClick);
            dr.addEventListener('change', onChange);
            document.addEventListener('keydown', e => { if (e.key === 'Escape' && dr.classList.contains('open') && !document.querySelector('.gb-back')) close(); });
            document.body.append(back, dr);
        }
        back.hidden = false; dr.hidden = false;
        requestAnimationFrame(() => { back.classList.add('open'); dr.classList.add('open'); });
        paintFab();
        pick = null; Q = null;
        draw('<p class="ac-empty"><i class="fas fa-spinner fa-spin"></i>불러오는 중…</p>');
        await refresh();
        const x = dr.querySelector('.x'); if (x) x.focus();
    }
    function close() {
        if (!dr) return;
        back.classList.remove('open'); dr.classList.remove('open');
        setTimeout(() => { if (!dr.classList.contains('open')) { back.hidden = true; dr.hidden = true; } }, 260);
        paintFab();
        if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
    }
    const head = n => `<div class="ac-hd"><h3><i class="fas fa-cart-shopping"></i> 장바구니</h3><small>${n ? n + '개' : ''}</small><button class="x" type="button" data-x aria-label="닫기"><i class="fas fa-xmark"></i></button></div>`;
    function draw(body, foot) {
        dr.innerHTML = head(read().length) + `<div class="ac-bd">${body}</div>` + (foot ? `<div class="ac-ft">${foot}</div>` : '');
    }
    async function refresh() {
        const list = ids();
        if (!list.length) {
            draw('<p class="ac-empty"><i class="fas fa-cart-shopping"></i>장바구니가 비어 있어요.<br>악보 페이지에서 \'장바구니 담기\'를 눌러 보세요.<br><a href="/#sheets">악보 둘러보기</a></p>');
            return;
        }
        try { Q = await quote(list); }
        catch (e) {
            draw(`<p class="ac-empty"><i class="fas fa-triangle-exclamation"></i>${quoteMissing ? '장바구니를 준비하고 있어요. 조금만 기다려 주세요.' : '장바구니를 불러오지 못했어요.<br>잠시 뒤 다시 열어 주세요.'}</p>`);
            return;
        }
        // 담긴 순서 그대로. 살 수 있는 것만 처음에 골라 둔다(1만원이 넘으면 앞에서부터 1만원까지)
        if (!pick) {
            pick = new Set(); let tot = 0;
            Q.items.filter(it => it.st === 'ok').forEach(it => { if (tot + it.price <= LIMIT + 500) { pick.add(it.id); tot += it.price; } });
        }
        Q.items.forEach(it => { if (it.st !== 'ok') pick.delete(it.id); });
        await paint();
    }
    let paintSeq = 0;
    async function paint() {
        const seq = ++paintSeq;
        const sb = await sbReady();
        const sel = Q.items.filter(it => it.st === 'ok' && pick.has(it.id)).map(it => it.id);
        let T = { sum: 0, set_off: 0, credit: 0, total: 0 };
        if (sel.length) {
            const okAll = Q.items.filter(it => it.st === 'ok').map(it => it.id);
            try { T = sel.length === okAll.length ? Q : await quote(sel); } catch (e) { T = Q; }
        }
        if (seq !== paintSeq) return;
        const okN = Q.items.filter(it => it.st === 'ok').length;
        const rows = Q.items.map(it => {
            const s = STYLE[it.style] || STYLE.other, off = it.st !== 'ok';
            const cv = coverUrl(sb, it);
            const stTxt = it.st === 'owned' ? '<span class="st own">이미 구매함 · 구매 내역에서 받기</span>' : it.st === 'gone' ? '<span class="st">지금은 판매하지 않는 악보예요</span>' : '';
            return `<div class="ac-row${off ? ' off' : ''}">
                <input type="checkbox" data-pick="${it.id}"${!off && pick.has(it.id) ? ' checked' : ''}${off ? ' disabled' : ''} aria-label="이번에 구매">
                <span class="ac-th" style="--c:${s[1]}">${esc(s[0])}${cv ? `<img src="${esc(cv)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>
                <span class="ac-tx"><a href="/tab-detail.html?id=${encodeURIComponent(it.id)}">${esc(it.title || '악보')}</a>
                    <small>${esc([it.kind === 'original' ? '안쌤 자작곡' : it.artist, s[0]].filter(Boolean).join(' · '))}</small>${stTxt}</span>
                <span class="ac-pr">${it.price ? won(it.price) : ''}</span>
                <button type="button" class="ac-rm" data-rm="${it.id}" aria-label="빼기"><i class="fas fa-xmark"></i></button></div>`;
        }).join('');
        const over = T.total > LIMIT;
        const selBar = okN > 1 ? `<div class="ac-sel"><span>이번에 살 악보를 골라요 (${sel.length}/${okN})</span><button type="button" data-all>${sel.length === okN ? '모두 빼기' : '모두 고르기'}</button></div>` : '';
        const foot = `
            <div class="ac-ln"><span>악보 ${sel.length}개</span><span>${won(T.sum)}</span></div>
            ${T.set_off ? `<div class="ac-ln off"><span>반주 + 기타솔로 묶음 할인</span><span>−${won(T.set_off)}</span></div>` : ''}
            ${T.credit ? `<div class="ac-ln off"><span>이미 산 짝과 묶음 할인</span><span>−${won(T.credit)}</span></div>` : ''}
            <div class="ac-ln sum"><span>결제 금액</span><span>${won(T.total)}</span></div>
            ${over ? `<p class="ac-warn"><i class="fas fa-circle-info"></i> 한 번에 <b>1만원까지</b> 결제할 수 있어요. 몇 개를 빼고 먼저 결제한 뒤, 남은 악보는 다음에 결제해 주세요.</p>` : ''}
            <button type="button" class="ac-go" data-go${!sel.length || over ? ' disabled' : ''}><i class="fas fa-credit-card"></i> ${sel.length ? `${sel.length}개 구매하기` : '살 악보를 골라 주세요'}</button>
            <p class="ac-note">한 번에 10개 · 1만원까지 결제할 수 있어요. 같은 곡의 반주와 기타솔로를 함께 사면 500원 할인돼요.${Q.member ? '' : ' 로그인하면 이미 산 악보를 알려 주고, 이미 산 짝과 묶음 할인도 받아요.'}<br>결제 즉시 PDF로 받는 디지털 상품이에요 · 다운로드 유효기간: 구매일로부터 1년</p>`;
        draw(selBar + rows, foot);
    }
    function onChange(e) {
        const c = e.target.closest('[data-pick]'); if (!c || !Q) return;
        if (c.checked) pick.add(c.dataset.pick); else pick.delete(c.dataset.pick);
        paint();
    }
    async function onClick(e) {
        if (e.target.closest('[data-x]')) { close(); return; }
        const rm = e.target.closest('[data-rm]');
        if (rm) { remove(rm.dataset.rm); if (pick) pick.delete(rm.dataset.rm); await refresh(); return; }
        if (e.target.closest('[data-all]') && Q) {
            const ok = Q.items.filter(it => it.st === 'ok').map(it => it.id);
            if (ok.every(id => pick.has(id))) pick.clear(); else ok.forEach(id => pick.add(id));
            paint(); return;
        }
        const go = e.target.closest('[data-go]');
        if (go && !go.disabled && Q) {
            const sel = Q.items.filter(it => it.st === 'ok' && pick.has(it.id)).map(it => it.id);
            const C = window.ahnssamCheckout;
            if (!sel.length || !C) return;
            go.disabled = true; go.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 결제창 여는 중';
            const r = await C.buy(sel);
            if (r && r.status === 'redirect') return;
            if (r && r.status === 'login') { close(); return; }
            Q = null; await refresh();   // 이미 샀거나(owned) 취소 — 다시 계산
        }
    }

    // ---------- 결제가 끝났을 때: 산 악보는 장바구니에서 뺀다 (purchases.html 이 승인 성공 뒤에 부름) ----------
    function paid() {
        let list = null;
        try { list = JSON.parse(sessionStorage.getItem('ahnssam_paying') || 'null'); } catch (e) {}
        if (Array.isArray(list)) remove(list);
        try { sessionStorage.removeItem('ahnssam_paying'); } catch (e) {}
    }

    // 다른 창에서 담거나 빼면 이 창도 따라간다
    window.addEventListener('storage', e => { if (e.key === KEY) fire(); });
    const boot = () => paintFab();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();

    window.ahnssamCart = { ids, has, paid, add: (l) => { const r = add(l); if (r.added.length) paintFab(true); return r; }, remove, clear, open, close, track, MAX, LIMIT, IS_APP };
})();
