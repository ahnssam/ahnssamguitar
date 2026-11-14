/* 마구 누르기 놀이 공통 (2026-11-14 사용자: 시작하면 키보드를 마아아악 눌러도 괜찮은 놀이 — 기타 펑펑 · 부릉부릉 출동)
   - 시작하면 그 칸을 전체화면으로 띄우고, 누르는 키가 브라우저(새로고침·뒤로 가기·찾기 등)로 새지 않게 막는다.
   - 끄기 = ESC 를 연속으로 다섯 번 (2026-11-14 사용자). 사이에 다른 키를 누르거나 2초 넘게 쉬면 처음부터 다시 센다.
     크롬·엣지는 전체화면에서 ESC 를 페이지가 받게 잠글 수 있다(Keyboard Lock). 사파리·파이어폭스는 ESC 한 번에
     전체화면이 풀리는데, 놀이는 계속되고 다음에 아무 키나 누르면 다시 전체화면이 된다.
   - 브라우저가 끝내 못 막게 하는 것: ESC 를 2초쯤 꾹 누르기(크롬), 창 닫기(Cmd+W)·앱 바꾸기(Cmd+Tab) 같은 운영체제 단축키.
   - 휴대폰·태블릿: **뒤로 가기를 연속으로 다섯 번** (2026-11-14 사용자). 시작할 때 방문 기록을 다섯 칸 넣어 두고, 뒤로 가기로
     한 칸씩 빠질 때마다 센다. 화면을 두드리면(= 다른 키) 처음부터 다시 세고 빠진 칸을 도로 채운다.
     · 칸은 꼭 누른 직후(사용자 동작 안)에만 넣는다. 크롬은 동작 없이 넣은 칸을 뒤로 가기에서 건너뛰어 페이지를 떠나 버린다.
     · 안드로이드는 전체화면에서 첫 뒤로 가기가 전체화면만 푼다(기록은 그대로) — 그것도 한 번으로 센다.
     · 뒤로 가기는 2초 규칙 없이 '사이에 화면을 안 두드리면' 연속으로 친다(전체화면이 풀리는 첫 번이 느려서).
     구석의 끝내기 표시를 다섯 번 두드려도 꺼진다(MASH.escTap). */
window.MASH = (function () {
    const ESC_N = 5, ESC_GAP = 2000;
    let on = false, el = null, opt = {}, esc = 0, escAt = 0;
    let hist = 0, popSkipUntil = 0, viaBack = false, escKeyAt = -1e9, fsExitAt = -1e9;
    const COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
    const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
    function lock() { try { if (navigator.keyboard && navigator.keyboard.lock) navigator.keyboard.lock().catch(() => {}); } catch (e) {} }
    function unlock() { try { if (navigator.keyboard && navigator.keyboard.unlock) navigator.keyboard.unlock(); } catch (e) {} }
    function enter() {
        if (!el || fsEl()) return;
        const rq = el.requestFullscreen || el.webkitRequestFullscreen;
        if (!rq) return;   // 아이폰 등: 전체화면이 없으면 화면 가득 덮는 칸(.playing)으로만
        try { const p = rq.call(el, { navigationUI: 'hide' }); if (p && p.then) p.then(lock).catch(() => {}); else lock(); } catch (e) {}
    }
    function leave() {
        unlock();
        try { if (fsEl()) { const ex = document.exitFullscreen || document.webkitExitFullscreen; const p = ex && ex.call(document); if (p && p.catch) p.catch(() => {}); } } catch (e) {}
    }
    function escPress() {
        const now = performance.now();
        esc = now - escAt <= ESC_GAP ? esc + 1 : 1;
        escAt = now;
        if (opt.onEsc) opt.onEsc(esc, ESC_N);
        if (esc >= ESC_N) stop();
    }
    function escReset() { viaBack = false; if (esc) { esc = 0; if (opt.onEsc) opt.onEsc(0, ESC_N); } }
    // 방문 기록 다섯 칸(뒤로 가기 다섯 번 몫). 누른 직후에만 부른다
    function histFill() { if (!on) return; try { while (hist < ESC_N) { history.pushState({ mash: hist + 1 }, ''); hist++; } } catch (e) {} }
    function backPress(fromHistory) {
        if (fromHistory) hist = Math.max(0, hist - 1);
        esc += 1; escAt = performance.now(); viaBack = true;
        if (opt.onEsc) opt.onEsc(Math.min(esc, ESC_N), ESC_N);
        if (esc >= ESC_N || (fromHistory && hist <= 0)) stop();
    }
    function popstate() {
        if (performance.now() < popSkipUntil) { popSkipUntil = 0; return; }   // 끝낼 때 남은 칸을 우리가 뺀 것
        if (on) backPress(true);
    }
    // 전체화면이 우리 뜻과 상관없이 풀림: 휴대폰 뒤로 가기(첫 번), ESC 를 페이지에 안 주는 브라우저의 ESC — 한 번 누른 것으로 센다
    function fsChange() {
        if (!on || fsEl()) return;
        const now = performance.now();
        if (now - escKeyAt < 400) return;          // 방금 ESC 키로 이미 셌다
        fsExitAt = now;
        if (COARSE) backPress(false); else escPress();
    }
    function pointerup() { if (!on) return; histFill(); if (!fsEl()) enter(); }   // 터치는 손을 뗄 때가 '사용자 동작'
    function keydown(e) {
        if (!on) return;
        e.preventDefault(); e.stopPropagation();
        if (e.key === 'Escape') { if (!e.repeat && performance.now() - fsExitAt > 400) { escKeyAt = performance.now(); escPress(); } return; }
        escReset(); histFill();
        if (!fsEl()) enter();   // ESC 한 번에 전체화면이 풀리는 브라우저: 다음 키에 다시 전체화면
        if (opt.onKey) opt.onKey(e);
    }
    function swallow(e) { if (on) { e.preventDefault(); e.stopPropagation(); } }
    function guard(e) { if (on && opt.guard) { e.preventDefault(); e.returnValue = ''; } }
    // 2초 넘게 ESC 가 없으면 세던 것을 지운다(화면의 점도 같이)
    setInterval(() => { if (on && esc && !viaBack && performance.now() - escAt > ESC_GAP) escReset(); }, 300);
    addEventListener('keydown', keydown, true);
    addEventListener('keyup', swallow, true);
    addEventListener('keypress', swallow, true);
    addEventListener('contextmenu', swallow, true);
    addEventListener('beforeunload', guard);
    addEventListener('popstate', popstate);
    addEventListener('pointerup', pointerup, true);
    document.addEventListener('fullscreenchange', fsChange);
    document.addEventListener('webkitfullscreenchange', fsChange);
    // 놀다가 새로고침한 경우: 남아 있는 놀이용 기록 칸을 뺀다
    try { if (history.state && history.state.mash > 0) { popSkipUntil = performance.now() + 1500; history.go(-history.state.mash); } } catch (e) {}
    function start(o) {
        opt = o || {}; el = opt.el; on = true; esc = 0; escAt = 0; viaBack = false; hist = 0;
        document.documentElement.classList.add('mash-on');
        if (el) el.classList.add('playing');
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        enter();
        histFill();
    }
    function stop() {
        if (!on) return;
        on = false; esc = 0; viaBack = false;
        if (hist > 0) { const n = hist; hist = 0; popSkipUntil = performance.now() + 1500; try { history.go(-n); } catch (e) {} }
        document.documentElement.classList.remove('mash-on');
        if (el) el.classList.remove('playing');
        leave();
        const f = opt.onExit; if (f) f();
    }
    return {
        start, stop,
        escTap() { if (on) escPress(); },
        tap() { if (on) { escReset(); if (!fsEl() && !COARSE) enter(); } },   // 화면을 누른 것도 '다른 키'로 친다(터치의 전체화면·기록 채우기는 손을 뗄 때 pointerup 에서)
        get on() { return on; },
        ESC_N,
    };
})();
