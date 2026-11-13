// 기타 퀴즈쇼 '악보 보고 노래 맞히기' 소리 — 원본 .gp 에서 앞 몇 줄만 잘라 작은 .gp 로 만든다.
//   퀴즈는 정답을 누르면 이 파일을 TabForest 와 같은 엔진(alphaTab)·음원으로 그 줄만 들려준다.
//   곡 전체는 올리지 않는다(판매 악보). 남기는 건 공개 미리보기 1쪽 안의 앞 몇 줄뿐.
//
//   쓰는 법:  node tools/quiz_tabsnd.cjs <짝 목록.json>
//     짝 목록 = { "<악보 id>": "<원본 .gp 경로>", ... }
//   만드는 것: play/tabsnd/<악보 id>.gp, play/tabsnd/index.json ({ id: { sys: [줄마다 마디 수], fn: 음표가 처음 나오는 줄 } })
//   alphaTab 은 TabForest 폴더의 것을 쓴다(같은 판이어야 소리·줄 나눔이 같다).
global.self = global;
const fs = require('fs'), path = require('path');
const TF = process.env.TABFOREST || path.join(process.env.USERPROFILE || process.env.HOME, '..', '..', 'Developer', 'tabforest');
const AT_PATH = [path.join(TF, 'alphaTab.min.js'), 'C:/Developer/tabforest/alphaTab.min.js', path.join(process.env.HOME || '', 'Developer/tabforest/alphaTab.min.js')].find(p => fs.existsSync(p));
const at = require(AT_PATH);
const AT = at.alphaTab || at;

const KEEP_AFTER = 2;            // 음표가 처음 나오는 줄 뒤로 몇 줄 더 남길지('한 줄 더 보기' 힌트 줄까지)
const OUT = path.join(__dirname, '..', 'play', 'tabsnd');
fs.mkdirSync(OUT, { recursive: true });

const pairs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const idxPath = path.join(OUT, 'index.json');
const index = fs.existsSync(idxPath) ? JSON.parse(fs.readFileSync(idxPath, 'utf8')) : {};

function systems(score) {
    const t = score.tracks[0], n = score.masterBars.length, out = [];
    for (let k = 0, b = 0; b < n; k++) {
        const c = (t.systemsLayout && t.systemsLayout.length ? t.systemsLayout[k] : t.defaultSystemsLayout) || 4;
        out.push(Math.min(c, n - b)); b += c;
    }
    return out;
}
const barHasNotes = (score, i) => score.tracks.some(t => t.staves.some(st => {
    const bar = st.bars[i];
    return bar && bar.voices.some(v => v.beats.some(b => !b.isRest && b.notes && b.notes.length));
}));

for (const [id, gp] of Object.entries(pairs)) {
    try {
        const settings = new AT.Settings();
        const score = AT.importer.ScoreLoader.loadScoreFromBytes(new Uint8Array(fs.readFileSync(gp)), settings);
        const sys = systems(score);
        let fn = -1;
        for (let k = 0, b = 0; k < sys.length && fn < 0; b += sys[k], k++) {
            for (let i = b; i < b + sys[k]; i++) if (barHasNotes(score, i)) { fn = k; break; }
        }
        if (fn < 0) throw new Error('음표 없음');
        const keepSys = sys.slice(0, fn + 1 + KEEP_AFTER);
        const keep = keepSys.reduce((a, c) => a + c, 0);
        // 뒤 마디 잘라 내기
        score.masterBars.length = keep;
        score.masterBars[keep - 1].nextMasterBar = null;
        score.tracks.forEach(t => t.staves.forEach(st => {
            st.bars.length = keep;
            if (st.bars[keep - 1]) st.bars[keep - 1].nextBar = null;
        }));
        if (score.repeatGroups) score.repeatGroups = score.repeatGroups.filter(g => g.masterBars.every(m => m.index < keep));
        score.tracks.forEach(t => { t.systemsLayout = keepSys.slice(); });
        const bytes = new AT.exporter.Gp7Exporter().export(score, settings);
        // 다시 읽어서 깨지지 않았는지 확인
        const back = AT.importer.ScoreLoader.loadScoreFromBytes(bytes, new AT.Settings());
        if (back.masterBars.length !== keep) throw new Error('다시 읽은 마디 수가 다름 ' + back.masterBars.length);
        fs.writeFileSync(path.join(OUT, id + '.gp'), Buffer.from(bytes));
        index[id] = { sys: keepSys, fn };
        console.log('OK', id, path.basename(gp), 'sys', JSON.stringify(keepSys), 'fn', fn, (bytes.length / 1024).toFixed(1) + 'KB');
    } catch (e) {
        console.log('FAIL', id, path.basename(gp), e.message);
    }
}
fs.writeFileSync(idxPath, JSON.stringify(index));
console.log('index', Object.keys(index).length);
