// 기타 퀴즈쇼 — 악보 한 줄 소리 (TabForest 와 같은 엔진·음원)
//   play/tabsnd/<악보 id>.gp : 원본 .gp 에서 앞 몇 줄만 자른 파일 (tools/quiz_tabsnd.cjs 가 만듦)
//   play/tabsnd/index.json   : { id: { sys: [줄마다 마디 수], fn: 음표가 처음 나오는 줄 } }
//   alphaTab(play/vendor/alphaTab.min.js, TabForest 와 같은 판)의 신스만 화면 없이 쓴다 — 악보 그림은 그리지 않는다.
//   엔진(1.2MB)·음원(1.8MB)은 악보 퀴즈를 시작할 때 처음 한 번만 받는다.
(function () {
    const BASE = new URL('.', document.currentScript ? document.currentScript.src : location.href).href;
    const V = '1';
    let index = null, engine = null, font = null, syn = null, ctx = null, cur = null;
    const cache = new Map();          // id → Promise<{ midi, ticks }>

    const once = f => { let p = null; return () => (p = p || f().catch(e => { p = null; throw e; })); };
    const loadScript = src => new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error('load ' + src));
        document.head.appendChild(s);
    });
    const getIndex = once(async () => {
        const r = await fetch(BASE + 'tabsnd/index.json?v=' + V);
        if (!r.ok) throw new Error('index ' + r.status);
        index = await r.json();
        return index;
    });
    const getEngine = once(async () => {
        if (!window.alphaTab) await loadScript(BASE + 'vendor/alphaTab.min.js?v=' + V);
        engine = window.alphaTab;
        return engine;
    });
    const getFont = once(async () => {
        if (!window.SOUNDFONT_B64) await loadScript(BASE + 'vendor/soundfont.js?v=' + V);
        const bin = atob(window.SOUNDFONT_B64), u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        window.SOUNDFONT_B64 = null;
        font = u8;
        return u8;
    });
    // 신스 — 창마다 하나. AudioContext 는 기기의 샘플레이트로(TabForest 와 같음: 안 그러면 48kHz 기기에서 음이 높게 남)
    function synth() {
        if (syn) return syn;
        const AT = engine;
        const out = new AT.synth.AlphaSynthScriptProcessorOutput();
        try { ctx = new (window.AudioContext || window.webkitAudioContext)(); out.context = ctx; } catch (e) {}
        syn = new AT.synth.AlphaSynth(out, 500);
        syn.masterVolume = 1;
        syn.loadSoundFont(font, false);
        syn.finished.on(() => { if (cur && cur.onEnd) cur.onEnd(); cur = null; });
        return syn;
    }
    async function build(id) {
        const AT = engine;
        const r = await fetch(BASE + 'tabsnd/' + encodeURIComponent(id) + '.gp?v=' + V);
        if (!r.ok) throw new Error('gp ' + r.status);
        const settings = new AT.Settings();
        const score = AT.importer.ScoreLoader.loadScoreFromBytes(new Uint8Array(await r.arrayBuffer()), settings);
        const midi = new AT.midi.MidiFile();
        const gen = new AT.midi.MidiFileGenerator(score, settings, new AT.midi.AlphaSynthMidiFileHandler(midi));
        gen.generate();
        const look = gen.tickLookup, mb = score.masterBars;
        const start = i => (i < mb.length ? look.getMasterBarStart(mb[i]) : null);
        return { midi, start, bars: mb.length };
    }

    // 이 악보에 소리가 있는지 (목록만 보고)
    async function has(id) {
        try { return !!(await getIndex())[id]; } catch (e) { return false; }
    }
    // 미리 받아 두기 — 문제를 보여 줄 때 부른다(답을 누르는 순간 바로 나오게)
    function prepare(id) {
        if (!cache.has(id)) {
            cache.set(id, (async () => {
                const ix = await getIndex();
                if (!ix[id]) throw new Error('none');
                await Promise.all([getEngine(), getFont()]);
                return build(id);
            })());
            cache.get(id).catch(() => cache.delete(id));
        }
        return cache.get(id);
    }
    // 오디오는 사람이 누른 순간에 깨워야 한다(휴대폰·사파리) — 답 단추를 누를 때 먼저 부른다
    function unlock() {
        try {
            if (engine && font) synth();
            if (ctx && ctx.state === 'suspended') ctx.resume();
        } catch (e) {}
    }
    // k 번째 줄(미리보기의 TAB 줄 순서) 재생. 그 줄이 잘라 둔 범위 밖이면 음표가 처음 나오는 줄
    async function play(id, k, onEnd) {
        const ix = await getIndex(), info = ix[id];
        if (!info) throw new Error('none');
        const d = await prepare(id);
        const sys = info.sys;
        if (!(k >= 0 && k < sys.length)) k = info.fn;
        let b0 = 0;
        for (let i = 0; i < k; i++) b0 += sys[i];
        const b1 = b0 + sys[k];
        stop();
        const s = synth();
        if (ctx && ctx.state === 'suspended') try { await ctx.resume(); } catch (e) {}
        s.loadMidiFile(d.midi);
        const st = d.start(b0), en = d.start(b1);
        s.playbackRange = { startTick: st, endTick: en == null ? 1e9 : en };
        s.tickPosition = st;
        cur = { id, onEnd };
        s.play();
        return true;
    }
    function stop() {
        if (syn) try { syn.stop(); } catch (e) {}
        const c = cur; cur = null;
        if (c && c.onEnd) c.onEnd();
    }
    window.TabSnd = { has, prepare, unlock, play, stop, playing: () => !!cur };
})();
