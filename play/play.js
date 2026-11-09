// 기타 놀이터 공통 (2026-11-07 목업 → 2026-11-08 메뉴에 열림 → 2026-11-09 공개, AdSense 코드 준비)
(function () {
    const SB_URL = 'https://qpcbrqgqylxkgdwoflku.supabase.co';
    const SB_KEY = 'sb_publishable_5rr-OZ7Sqjk1nXn59R7XnQ_HInATuSV';
    const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const IS_APP = window.matchMedia && matchMedia('(display-mode: standalone)').matches;

    // ===== 광고 (Google AdSense) =====
    // 승인 받은 뒤 아래 값만 채우면 진짜 광고가 나온다. client 가 비어 있으면 광고 자리를 아예 안 보이고 전면 광고도 건너뛴다.
    //   client : AdSense 게시자 ID 'ca-pub-숫자16자리' (AdSense > 계정 > 계정 정보). 공개 값이라 커밋해도 된다.
    //   slots  : 디스플레이 광고 단위 ID(숫자) — AdSense > 광고 > 광고 단위별 > 디스플레이 광고. wide = 가로형(시작 화면 아래), r300 = 300×250(결과 화면)
    //   games  : 'H5 게임 광고' 승인을 따로 받으면 true → 결과 직전·월드컵 64·32·16·8강 전환 때 전면 광고(adBreak)
    //   test   : true 면 전면 광고를 시험 광고로(data-adbreak-test). 붙인 직후 확인할 때만 잠깐 켠다
    // 앱(TWA) 안에서는 광고를 안 보인다(Play 스토어에 '광고 포함' 신고를 안 했다).
    // 주소에 ?ads=1 을 붙이면 진짜 광고 대신 회색 상자로 자리만 본다.
    const ADSENSE = { client: '', slots: { wide: '', r300: '' }, games: false, test: false };
    const MOCK = /[?&]ads=1\b/.test(location.search);
    const LIVE = !MOCK && !IS_APP && /^ca-pub-\d{10,20}$/.test(ADSENSE.client);
    let adLib = LIVE ? 'loading' : 'off';   // 'loading' | 'ok' | 'fail'(광고 차단 등)
    if (LIVE) {
        const s = document.createElement('script');
        s.async = true; s.crossOrigin = 'anonymous';
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE.client;
        if (ADSENSE.games) s.setAttribute('data-ad-frequency-hint', '30s');
        if (ADSENSE.test) s.setAttribute('data-adbreak-test', 'on');
        s.onload = () => { adLib = 'ok'; };
        s.onerror = () => { adLib = 'fail'; document.querySelectorAll('.ad.live').forEach(el => el.remove()); };
        document.head.appendChild(s);
        window.adsbygoogle = window.adsbygoogle || [];
        if (ADSENSE.games) adsbygoogle.push({ preloadAdBreaks: 'on', sound: 'on' });   // = adConfig(...)
        // 화면을 innerHTML 로 새로 그리니, 새로 생긴 광고 칸을 찾아 하나씩 채운다
        const fill = () => document.querySelectorAll('.ad.live ins.adsbygoogle:not([data-filled])').forEach(ins => {
            if (!ins.isConnected || !ins.offsetWidth) return;   // 숨은 칸은 폭이 0이라 오류가 난다 — 보일 때 채움
            ins.setAttribute('data-filled', '1');
            try { adsbygoogle.push({}); } catch (e) {}
        });
        let t = 0;   // requestAnimationFrame 은 뒤에 숨은 탭에서 멈추니 setTimeout 으로
        new MutationObserver(() => { clearTimeout(t); t = setTimeout(fill, 60); })
            .observe(document.documentElement, { childList: true, subtree: true });
    }

    // 광고 자리: kind = 'r300'(300×250) | 'r320'(320×100) | 'wide'(728×90, 폰에선 320×100)
    const SIZE = { r300: '300×250', r320: '320×100', wide: '728×90' };
    const adSlot = (kind = 'r300', note = '') => {
        if (MOCK) return `<div class="ad ${kind}"><span class="tag">광고</span><div class="box"><b>광고 자리</b><small>${SIZE[kind]} · Google AdSense</small>${note ? `<small>${esc(note)}</small>` : ''}</div></div>`;
        const slot = LIVE && adLib !== 'fail' && ADSENSE.slots[kind];
        if (!slot) return '';
        const ins = kind === 'wide'
            ? `<ins class="adsbygoogle" style="display:block" data-ad-format="horizontal" data-full-width-responsive="true"`
            : `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px"`;
        return `<div class="ad live ${kind}"><span class="tag">광고</span>${ins} data-ad-client="${ADSENSE.client}" data-ad-slot="${esc(slot)}"></ins></div>`;
    };

    // 결과를 보여 주기 직전 전면 광고 = AdSense 'H5 게임 광고'의 adBreak({type:'next'}).
    // 광고를 띄울지·언제 닫힐지는 구글이 정한다(우리가 '광고를 봐야 결과'로 막으면 안 됨). 안 띄우면 바로 done.
    // 월드컵은 64강·32강·16강으로 넘어갈 때도 부른다(label 은 목업 표시, name 은 AdSense 보고서에 남는 이름)
    function interstitial(done, label = '결과 보기 전 전면 광고', name = 'result') {
        if (!MOCK) {
            if (!LIVE || !ADSENSE.games || adLib !== 'ok') return done();   // 광고 차단·로딩 중이면 기다리지 않는다
            let over = false, showing = false;
            const fin = () => { if (!over) { over = true; done(); } };
            const guard = setTimeout(() => { if (!showing) fin(); }, 2500);   // 응답이 없으면 그냥 넘어간다
            try {
                adsbygoogle.push({
                    type: 'next', name,
                    beforeAd: () => { showing = true; clearTimeout(guard); },
                    afterAd: () => {},
                    adBreakDone: () => { clearTimeout(guard); fin(); },
                });
            } catch (e) { clearTimeout(guard); fin(); }
            return;
        }
        const el = document.createElement('div');
        el.className = 'inter';
        el.innerHTML = `<div class="in"><div class="top"><span>${esc(label)} (목업)</span><button class="x" disabled>3</button></div>${adSlot('r300', '실제: AdSense 게임 광고(adBreak)')}<p>실제 광고에서는 닫기 버튼과 시간을 구글이 정해요</p></div>`;
        document.body.appendChild(el);
        const x = el.querySelector('.x');
        let n = 3;
        const t = setInterval(() => {
            n--;
            if (n > 0) { x.textContent = n; return; }
            clearInterval(t);
            x.disabled = false; x.textContent = '계속 ✕';
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
    // 사이트에 로그인해 있으면 그 열쇠(운영 계정의 댓글 지우기용). 놀이터는 로그인 없이 쓰므로 없으면 그냥 빈 값
    function userToken() {
        try {
            const s = JSON.parse(localStorage.getItem('sb-qpcbrqgqylxkgdwoflku-auth-token') || 'null');
            return s && s.access_token && (s.expires_at || 0) * 1000 > Date.now() + 10000 ? s.access_token : '';
        } catch (e) { return ''; }
    }
    // 실패하면 err.code 에 서버가 보낸 짧은 코드(예: 'fast', 'link')
    async function rpc(name, body, opt = {}) {
        const headers = { apikey: SB_KEY, 'Content-Type': 'application/json' };
        const tok = opt.auth && userToken();
        if (tok) headers.Authorization = 'Bearer ' + tok;
        const r = await fetch(SB_URL + '/rest/v1/rpc/' + name, { method: 'POST', headers, body: JSON.stringify(body || {}) });
        if (!r.ok) {
            const err = new Error(name + ' ' + r.status);
            err.status = r.status;
            try { err.code = (await r.json()).message || ''; } catch (e) { err.code = ''; }
            throw err;
        }
        const t = await r.text();
        return t ? JSON.parse(t) : null;
    }
    // 브라우저에 남기는 작은 기억(최근에 낸 문제 등). 막혀 있어도 게임은 그대로
    const mem = {
        get(k, d) { try { const v = localStorage.getItem('play.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem('play.' + k, JSON.stringify(v)); } catch (e) {} },
    };
    // ---------- 사이트 위 메뉴 (2026-11-10 사용자 요청: 놀이터에도 메인과 같은 메뉴) ----------
    // 메인·약관 페이지와 같은 모양. 로그인 버튼은 auth.js 가 .auth-slot 에 넣는다.
    // 앱(TWA) 안에서는 판매 사이트로 가는 길을 막으니(CLAUDE.md 6번) 넣지 않는다.
    function siteHeader() {
        if (IS_APP || document.querySelector('header.site-hd')) return;
        const SNS = [
            ['https://www.youtube.com/channel/UC0TC0fLj3ZahhlKcC9ebVrg', 'YouTube', '<i class="fab fa-youtube"></i>', '<i class="fab fa-youtube"></i>'],
            ['https://www.instagram.com/ahnssamguitar/', 'Instagram', '<i class="fab fa-instagram"></i>', '<i class="fab fa-instagram"></i>'],
            ['https://www.tiktok.com/@ahnssamguitar', 'TikTok', '<i class="fab fa-tiktok"></i>', '<i class="fab fa-tiktok"></i>'],
            ['https://blog.naver.com/ynlee2568', '네이버 블로그', '<b>bl</b>', '<i class="fas fa-blog"></i>'],
            ['https://cafe.naver.com/ahnsguitarforest', '네이버 카페', '<i class="fas fa-mug-hot" style="color:#5cc06b"></i>', '<i class="fas fa-mug-hot"></i>'],
        ];
        const sns = m => SNS.map(([u, l, a, b]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${l}">${m ? b : a}</a>`).join('');
        const MENU = [['/#sheets', 'TAB악보', 'fa-music'], ['/requests.html', '악보요청', 'fa-comment-dots'], ['/#books', '교본', 'fa-book'], ['/#contents', '콘텐츠', 'fab fa-youtube'], ['/play/', '놀이터', 'fa-gamepad'], ['/#contact', 'CONTACT', 'fa-envelope']];
        const ic = c => c.startsWith('fab') ? c : 'fas ' + c;
        document.body.insertAdjacentHTML('afterbegin', `<header class="site-hd"><div class="hd">
            <a class="logo" href="/"><img src="../images/logo-vertical.webp" alt="안쌤의 기타나무숲"></a>
            <nav class="nav">${MENU.map(([h, t]) => `<a href="${h}"${h === '/play/' ? ' class="on"' : ''}>${t}${h === '/play/' ? '<span class="nav-new">NEW</span>' : ''}</a>`).join('')}</nav>
            <div class="hd-right"><a class="pill-btn" href="/tools.html"><i class="fas fa-guitar"></i> 연습도구</a>
                <div class="auth-slot" style="display:inline-flex;align-items:center;"></div><span class="sns-mini">${sns(false)}</span></div>
            <div class="hd-mobile"><div class="auth-slot" style="display:inline-flex;align-items:center;"></div>
                <button type="button" class="burger" aria-label="메뉴 열기" aria-expanded="false"><i class="fas fa-bars"></i></button></div></div>
            <nav class="mnav">${MENU.map(([h, t, c]) => `<a href="${h}"${h === '/play/' ? ' class="on"' : ''}><i class="${ic(c)}"></i>${h === '/play/' ? '기타 놀이터 <span class="nav-new">NEW</span>' : t}</a>`).join('')}
                <a href="/tools.html"><i class="fas fa-guitar"></i>무료 연습도구</a><div class="mnav-sns">${sns(true)}</div></nav></header>`);
        document.body.classList.add('has-site');
        const hd = document.querySelector('header.site-hd'), b = hd.querySelector('.burger'), m = hd.querySelector('.mnav');
        const set = open => { m.classList.toggle('open', open); b.setAttribute('aria-expanded', open); b.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'; };
        b.addEventListener('click', () => set(!m.classList.contains('open')));
        m.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
        if (!document.querySelector('script[src*="auth.js"]')) {
            const s = document.createElement('script');
            s.src = '../auth.js'; s.defer = true;
            document.head.appendChild(s);
        }
    }
    siteHeader();

    // ---------- 피크 (놀이터 포인트) ----------
    // 2026-11-10 사용자 결정: 놀이터 안에서만 쓰는 포인트. 퀴즈·월드컵 한 판 끝낼 때마다 10, 하루 200까지.
    // 퀴즈 찬스(시간 멈추기·오답 2개 지우기, 30)에 쓴다. 돈 가치가 없고 악보 포인트로 바꾸지 못한다(애드센스 정책 — CLAUDE.md 10번).
    // 이 브라우저에만 저장(로그인 없이 놀이터를 하니까). 기기를 바꾸면 따로 쌓인다.
    const PICK = { per: 10, day: 200, chance: 30 };
    const pickIcon = (cls = '') => `<svg class="pki ${cls}" viewBox="0 0 20 22" aria-hidden="true"><path d="M10 21C6 17 1 10.5 1 6.5 1 3 4.5 1 10 1s9 2 9 5.5C19 10.5 14 17 10 21z"/><path class="sh" d="M5.5 5.2c1.2-1.4 3.2-1.9 5-1.9"/></svg>`;
    const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
    const picks = {
        get() {
            const w = mem.get('pick', null), t = today();
            const o = w && Number.isFinite(w.bal) ? w : { bal: 0, day: t, got: 0 };
            if (o.day !== t) { o.day = t; o.got = 0; }
            return o;
        },
        bal() { return this.get().bal; },
        // 한 판 끝: 오늘 받은 게 200이 안 되면 10 (넘치는 만큼은 안 줌). 실제로 받은 수를 돌려준다
        earn(n = PICK.per) {
            const w = this.get(), add = Math.max(0, Math.min(n, PICK.day - w.got));
            w.bal += add; w.got += add;
            mem.set('pick', w); paintPicks(add);
            return add;
        },
        spend(n = PICK.chance) {
            const w = this.get();
            if (w.bal < n) return false;
            w.bal -= n;
            mem.set('pick', w); paintPicks();
            return true;
        },
    };
    // 머리줄 오른쪽 피크 표시 (누르면 설명)
    function paintPicks(added) {
        let b = document.querySelector('.ph .pkb');
        const sp = document.querySelector('.ph .sp');
        if (!b && sp) {
            sp.insertAdjacentHTML('afterend', `<button class="pkb" type="button" title="피크 — 놀이터에서 쓰는 포인트">${pickIcon()}<b></b><span>피크</span></button>`);
            b = document.querySelector('.ph .pkb');
            b.addEventListener('click', () => toast(`피크는 퀴즈·월드컵 한 판 끝낼 때마다 ${PICK.per}씩, 하루 ${PICK.day}까지 쌓여요. 퀴즈 찬스에 써요!`));
        }
        if (!b) return;
        b.querySelector('b').textContent = picks.bal().toLocaleString();
        if (added) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    }
    paintPicks();
    // 결과 화면에 넣는 '피크 받음' 한 줄
    const pickLine = got => got
        ? `<div class="pk-got">${pickIcon()}<b>+${got} 피크!</b> <span>지금 ${picks.bal().toLocaleString()}피크 · 퀴즈 찬스에 써요</span></div>`
        : `<div class="pk-got full">${pickIcon()}<span>오늘 받을 수 있는 피크(${PICK.day})를 다 모았어요. 내일 또 와요!</span></div>`;

    const pvUrl = s => SB_URL + '/storage/v1/object/public/sheet-previews/' + encodeURIComponent(s.preview_path) + '?v=' + encodeURIComponent(s.updated_at || '');
    const cvUrl = s => s.cover_path ? SB_URL + '/storage/v1/object/public/sheet-covers/' + encodeURIComponent(s.cover_path) + '?v=' + encodeURIComponent(s.updated_at || '') : '';
    const STYLE = { acoustic: '통기타', electric: '일렉기타', fingerstyle: '핑거스타일', solo: '기타솔로', chord: '코드악보', bass: '베이스' };
    // 제목 뒤 "(2021 편곡)" 같은 표시는 빼고 같은 곡으로 본다
    const baseTitle = t => String(t || '').normalize('NFC').replace(/\s*\((?:\d{4}|쉬운|[^)]*)\s*편곡\)\s*$/, '').trim();

    // 결과 화면 '이 곡 악보' 줄
    const recRow = s => `<a href="../tab-detail.html?id=${encodeURIComponent(s.id)}"><span class="cv"${cvUrl(s) ? ` style="background-image:url('${esc(cvUrl(s))}')"` : ''}>${cvUrl(s) ? '' : '<i class="fas fa-music"></i>'}</span>`
        + `<span class="mt"><b>${esc(s.title)}</b><small>${esc(s.artist || '')} · ${STYLE[s.style] || ''}</small></span>${IS_APP ? '' : `<span class="pr">${s.price ? Number(s.price).toLocaleString() + '원' : '악보 보기'}</span>`}</a>`;

    // 썸네일 그림 (play.css 의 .thumb) — 놀이터 카드와 퀴즈쇼 첫 화면이 같이 쓴다
    function thumb(kind, opt = {}) {
        if (kind === 'tab') {
            const ys = [16, 28, 40, 52, 64, 76];
            const notes = [[48, 2, 5], [66, 2, 7], [84, 3, 5], [102, 3, 7], [120, 2, 5], [138, 1, 8], [170, 1, 7], [188, 2, 5], [206, 3, 7], [224, 3, 5], [242, 4, 7], [260, 3, 5], [278, 2, 8]];
            const svg = '<svg viewBox="0 0 300 96"><g class="ln">' + ys.map(y => `<line x1="26" y1="${y}" x2="296" y2="${y}"/>`).join('')
                + [26, 156, 296].map(x => `<line x1="${x}" y1="16" x2="${x}" y2="76" class="bar"/>`).join('') + '</g>'
                + '<text class="tb" x="8" y="33">T</text><text class="tb" x="8" y="49">A</text><text class="tb" x="8" y="65">B</text><g class="nt">'
                + notes.map(([x, st, f]) => { const y = ys[st - 1]; return `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2"/><text x="${x}" y="${y + 4}">${f}</text><line x1="${x}" y1="80" x2="${x}" y2="90" class="stem"/>`; }).join('')
                + '</g><line x1="42" y1="90" x2="144" y2="90" class="beam"/><line x1="164" y1="90" x2="284" y2="90" class="beam"/></svg>';
            return `<div class="thumb th-tab" aria-hidden="true"><span class="rays"></span><span class="timer"><i class="fas fa-stopwatch"></i> 0:30</span>
                <div class="sheet">${svg}</div><span class="bigq">?</span><span class="bub">이 노래 뭘까?</span>
                <div class="abcd"><span>A</span><span>B</span><span>C</span><span>D</span></div></div>`;
        }
        if (kind === 'artist') {
            return `<div class="thumb th-artist" aria-hidden="true"><span class="spot"></span><span class="floor"></span>
                <i class="fas fa-user singer"></i><span class="singer-q">?</span><i class="fas fa-microphone mic"></i>
                <div class="player"><div class="row"><span class="cover"><i class="fas fa-music"></i></span>
                    <span class="pm"><small>NOW PLAYING</small><b>「위잉위잉」</b><i class="who">부른 사람 ???</i></span></div>
                    <div class="prog"><i></i></div></div>
                <span class="bub">누가 불렀게?</span>
                <div class="eq"><span></span><span></span><span></span><span></span><span></span></div></div>`;
        }
        // trivia: C 코드 그림 + 문제 카드 + 전구
        const sx = [10, 20, 30, 40, 50, 60], fy = [14, 30, 46, 62, 78];
        const chord = '<svg viewBox="0 0 70 82">' + fy.slice(1).map(y => `<line x1="10" y1="${y}" x2="60" y2="${y}" class="fr"/>`).join('')
            + sx.map(x => `<line x1="${x}" y1="14" x2="${x}" y2="78" class="str"/>`).join('') + '<line x1="9" y1="14" x2="61" y2="14" class="nut"/>'
            + '<text x="10" y="10" class="op">×</text><text x="40" y="10" class="op">o</text><text x="60" y="10" class="op">o</text>'
            + [[20, 54], [30, 38], [50, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.2" class="dot"/>`).join('') + '</svg>';
        return `<div class="thumb th-trivia" aria-hidden="true"><div class="chord"><b>이 코드는?</b>${chord}</div>
            <div class="card2"><span class="qn">Q.</span><p>6번 줄 개방현,<br>무슨 음일까?</p><div class="ox"><span>E</span><span>A</span><span>D</span><span>G</span></div></div>
            <span class="bulb"><i class="fas fa-lightbulb"></i></span>${opt.count ? `<span class="cnt">${opt.count}문제</span>` : ''}</div>`;
    }

    window.PLAY = { hasLogin: () => !!userToken(), picks, PICK, pickIcon, pickLine, thumb, esc, shuffle, adSlot, interstitial, toast, share, catalog, previews, rpc, mem, pvUrl, cvUrl, STYLE, baseTitle, recRow, IS_APP };
})();
