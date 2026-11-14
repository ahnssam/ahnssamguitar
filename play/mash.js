/* 마구 누르기 놀이 공통 (2026-11-14 사용자: 시작하면 키보드를 마아아악 눌러도 괜찮은 놀이 — 기타 펑펑 · 부릉부릉 출동)
   - 시작하면 그 칸을 전체화면으로 띄우고, 누르는 키가 브라우저(새로고침·뒤로 가기·찾기 등)로 새지 않게 막는다.
   - 끄기 = ESC 를 연속으로 다섯 번 (2026-11-14 사용자). 사이에 다른 키를 누르거나 2초 넘게 쉬면 처음부터 다시 센다.
     크롬·엣지는 전체화면에서 ESC 를 페이지가 받게 잠글 수 있다(Keyboard Lock). 사파리·파이어폭스는 ESC 한 번에
     전체화면이 풀리는데, 놀이는 계속되고 다음에 아무 키나 누르면 다시 전체화면이 된다.
   - 브라우저가 끝내 못 막게 하는 것: ESC 를 2초쯤 꾹 누르기(크롬), 창 닫기(Cmd+W)·앱 바꾸기(Cmd+Tab) 같은 운영체제 단축키.
   - 키보드가 없는 기기(휴대폰·태블릿)는 구석의 끝내기 표시를 다섯 번 두드리면 꺼진다(MASH.escTap). */
window.MASH = (function () {
    const ESC_N = 5, ESC_GAP = 2000;
    let on = false, el = null, opt = {}, esc = 0, escAt = 0;
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
    function escReset() { if (esc) { esc = 0; if (opt.onEsc) opt.onEsc(0, ESC_N); } }
    function keydown(e) {
        if (!on) return;
        e.preventDefault(); e.stopPropagation();
        if (e.key === 'Escape') { if (!e.repeat) escPress(); return; }
        escReset();
        if (!fsEl()) enter();   // ESC 한 번에 전체화면이 풀리는 브라우저: 다음 키에 다시 전체화면
        if (opt.onKey) opt.onKey(e);
    }
    function swallow(e) { if (on) { e.preventDefault(); e.stopPropagation(); } }
    function guard(e) { if (on && opt.guard) { e.preventDefault(); e.returnValue = ''; } }
    // 2초 넘게 ESC 가 없으면 세던 것을 지운다(화면의 점도 같이)
    setInterval(() => { if (on && esc && performance.now() - escAt > ESC_GAP) escReset(); }, 300);
    addEventListener('keydown', keydown, true);
    addEventListener('keyup', swallow, true);
    addEventListener('keypress', swallow, true);
    addEventListener('contextmenu', swallow, true);
    addEventListener('beforeunload', guard);
    function start(o) {
        opt = o || {}; el = opt.el; on = true; esc = 0; escAt = 0;
        document.documentElement.classList.add('mash-on');
        if (el) el.classList.add('playing');
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        enter();
    }
    function stop() {
        if (!on) return;
        on = false; esc = 0;
        document.documentElement.classList.remove('mash-on');
        if (el) el.classList.remove('playing');
        leave();
        const f = opt.onExit; if (f) f();
    }
    return {
        start, stop,
        escTap() { if (on) escPress(); },
        tap() { if (on) { escReset(); if (!fsEl() && matchMedia('(pointer: fine)').matches) enter(); } },   // 화면을 누른 것도 '다른 키'로 친다
        get on() { return on; },
        ESC_N,
    };
})();
