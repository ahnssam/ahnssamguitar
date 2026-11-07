// 기타 놀이터 공통 (2026-11-07 목업 → 2026-11-08 메뉴에 열림)
// 광고는 아직 안 붙였다. 붙이기 전에는 광고 자리를 아예 안 보이고(전면 광고도 건너뜀), 주소에 ?ads=1 을 붙이면 회색 상자로 자리를 볼 수 있다.
// 실제로 붙일 때 adSlot() 안만 AdSense(또는 카카오 애드핏) 코드로 바꾸고 ADS_ON 을 true 로.
(function () {
    const SB_URL = 'https://qpcbrqgqylxkgdwoflku.supabase.co';
    const SB_KEY = 'sb_publishable_5rr-OZ7Sqjk1nXn59R7XnQ_HInATuSV';
    const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

    // 광고 자리: kind = 'r300'(300×250) | 'r320'(320×100) | 'wide'(728×90, 폰에선 320×100)
    const SIZE = { r300: '300×250', r320: '320×100', wide: '728×90' };
    const ADS_ON = /[?&]ads=1\b/.test(location.search);
    const adSlot = (kind = 'r300', note = '') => !ADS_ON ? '' :
        `<div class="ad ${kind}"><span class="tag">광고</span><div class="box"><b>광고 자리</b><small>${SIZE[kind]} · Google AdSense / 카카오 애드핏</small>${note ? `<small>${esc(note)}</small>` : ''}</div></div>`;

    // 결과를 보여 주기 직전 전면 광고(목업). 실제로는 AdSense 'H5 게임 광고'의 adBreak({type:'next'}) 자리 —
    // 광고를 띄울지·언제 닫힐지는 구글이 정한다(우리가 '광고를 봐야 결과'로 막으면 안 됨)
    function interstitial(done) {
        if (!ADS_ON) return done();
        const el = document.createElement('div');
        el.className = 'inter';
        el.innerHTML = `<div class="in"><div class="top"><span>결과 보기 전 전면 광고 (목업)</span><button class="x" disabled>3</button></div>${adSlot('r300', '실제: AdSense 게임 광고(adBreak)')}<p>실제 광고에서는 닫기 버튼과 시간을 구글이 정해요</p></div>`;
        document.body.appendChild(el);
        const x = el.querySelector('.x');
        let n = 3;
        const t = setInterval(() => {
            n--;
            if (n > 0) { x.textContent = n; return; }
            clearInterval(t);
            x.disabled = false; x.textContent = '결과 보기 ✕';
        }, 1000);
        x.addEventListener('click', () => { el.remove(); done(); });
    }

    function toast(msg) {
        const t = document.createElement('div');
        t.className = 'toast'; t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1800);
    }

    async function share(title, text) {
        const url = location.href.split('#')[0];
        try {
            if (navigator.share) { await navigator.share({ title, text, url }); return; }
        } catch (e) { if (e && e.name === 'AbortError') return; }
        try { await navigator.clipboard.writeText(`${text}\n${url}`); toast('링크를 복사했어요'); }
        catch (e) { prompt('이 링크를 복사해 주세요', url); }
    }

    // 사이트 악보 목록 (메인과 같은 DB 함수). 공개한 곡 = 바로 구매 상세 페이지
    async function catalog() {
        const r = await fetch(SB_URL + '/rest/v1/rpc/sheet_catalog', { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: '{}' });
        if (!r.ok) throw new Error('catalog ' + r.status);
        return r.json();
    }
    async function previews() {
        const r = await fetch(SB_URL + '/rest/v1/sheets?select=id,title,artist,style,kind,preview_path,updated_at,cover_path&published=eq.true&preview_path=not.is.null', { headers: { apikey: SB_KEY } });
        if (!r.ok) throw new Error('previews ' + r.status);
        return r.json();
    }
    // 놀이터 기록 함수(db/play_stats.sql). 아직 적용 전이거나 실패하면 throw — 부르는 쪽에서 조용히 숨긴다
    async function rpc(name, body) {
        const r = await fetch(SB_URL + '/rest/v1/rpc/' + name, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
        if (!r.ok) throw new Error(name + ' ' + r.status);
        const t = await r.text();
        return t ? JSON.parse(t) : null;
    }
    // 브라우저에 남기는 작은 기억(최근에 낸 문제 등). 막혀 있어도 게임은 그대로
    const mem = {
        get(k, d) { try { const v = localStorage.getItem('play.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem('play.' + k, JSON.stringify(v)); } catch (e) {} },
    };
    const pvUrl = s => SB_URL + '/storage/v1/object/public/sheet-previews/' + encodeURIComponent(s.preview_path) + '?v=' + encodeURIComponent(s.updated_at || '');
    const cvUrl = s => s.cover_path ? SB_URL + '/storage/v1/object/public/sheet-covers/' + encodeURIComponent(s.cover_path) + '?v=' + encodeURIComponent(s.updated_at || '') : '';
    const STYLE = { acoustic: '통기타', electric: '일렉기타', fingerstyle: '핑거스타일', solo: '기타솔로', chord: '코드악보', bass: '베이스' };
    // 제목 뒤 "(2021 편곡)" 같은 표시는 빼고 같은 곡으로 본다
    const baseTitle = t => String(t || '').normalize('NFC').replace(/\s*\((?:\d{4}|쉬운|[^)]*)\s*편곡\)\s*$/, '').trim();
    const IS_APP = window.matchMedia && matchMedia('(display-mode: standalone)').matches;

    // 결과 화면 '이 곡 악보' 줄
    const recRow = s => `<a href="../tab-detail.html?id=${encodeURIComponent(s.id)}"><span class="cv"${cvUrl(s) ? ` style="background-image:url('${esc(cvUrl(s))}')"` : ''}>${cvUrl(s) ? '' : '<i class="fas fa-music"></i>'}</span>`
        + `<span class="mt"><b>${esc(s.title)}</b><small>${esc(s.artist || '')} · ${STYLE[s.style] || ''}</small></span>${IS_APP ? '' : `<span class="pr">${s.price ? Number(s.price).toLocaleString() + '원' : '악보 보기'}</span>`}</a>`;

    window.PLAY = { esc, shuffle, adSlot, interstitial, toast, share, catalog, previews, rpc, mem, pvUrl, cvUrl, STYLE, baseTitle, recRow, IS_APP };
})();
