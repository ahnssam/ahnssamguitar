/* ================================================================
   ear-ranking.js — Ear training session tracker + rankings + mypage
   Depends on auth.js (window.ahnssamAuth)
   Exposes: window.earSession, window.earRanking, window.earMypage
   ================================================================ */
(function () {
    'use strict';

    // ------------------------------------------------------------
    // Styles
    // ------------------------------------------------------------
    const CSS = `
/* Session progress pill shown inline in each mode's score-row */
.et-session-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.25rem 0.7rem;
    font-size: 0.76rem; font-weight: 700;
    color: var(--green-light, #72c492);
    background: rgba(82,168,114,0.12);
    border: 1px solid rgba(82,168,114,0.3);
    border-radius: 999px;
    margin-left: auto;
    margin-right: 0.4rem;
    white-space: nowrap;
}
.et-session-pill.warn { color: #ffc98a; background: rgba(255,190,80,0.12); border-color: rgba(255,190,80,0.3); }
.et-session-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px currentColor; }

/* Session summary overlay (10-question completion) */
.sum-overlay {
    position: fixed; inset: 0;
    background: rgba(12, 22, 18, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: none; align-items: center; justify-content: center;
    z-index: 10001;
    padding: 1rem;
    font-family: inherit;
}
.sum-overlay.open { display: flex; }
.sum-card {
    width: 100%; max-width: 420px;
    background: linear-gradient(160deg, #1e2e28, #14221d);
    border: 1px solid rgba(114,196,146,0.25);
    border-radius: 18px;
    padding: 1.8rem 1.6rem;
    color: #fff;
    box-shadow: 0 22px 60px rgba(0,0,0,0.5);
    text-align: center;
}
.sum-title {
    font-size: 1rem; font-weight: 700; letter-spacing: 0.18em;
    color: var(--green-light, #72c492);
    text-transform: uppercase;
    margin-bottom: 0.3rem;
}
.sum-mode { font-size: 0.88rem; font-weight: 500; color: rgba(255,255,255,0.6); margin-bottom: 1.2rem; }
.sum-score {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem; font-weight: 900;
    color: #fff;
    line-height: 1;
    margin-bottom: 0.4rem;
}
.sum-score .sum-pts { font-size: 1.1rem; color: var(--green-pale, #b5e6c8); margin-left: 0.3rem; font-family: inherit; font-weight: 700; letter-spacing: 0.1em; }
.sum-acc { font-size: 0.95rem; color: rgba(255,255,255,0.75); margin-bottom: 1.4rem; }
.sum-acc strong { color: #fff; font-weight: 700; }
.sum-note {
    font-size: 0.82rem; color: rgba(255,255,255,0.55);
    line-height: 1.55;
    padding: 0.75rem 0.8rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 9px;
    margin-bottom: 1.2rem;
}
.sum-actions { display: flex; gap: 0.6rem; }
.sum-btn {
    flex: 1;
    padding: 0.8rem 1rem;
    font-family: inherit; font-size: 0.92rem; font-weight: 700;
    border: none; border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
}
.sum-btn.primary {
    color: #fff;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
}
.sum-btn.primary:hover { filter: brightness(1.08); }
.sum-btn.ghost {
    color: rgba(255,255,255,0.75);
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
}
.sum-btn.ghost:hover { background: rgba(255,255,255,0.1); }

/* First-time nickname setup (blocks until set) */
.nick-overlay {
    position: fixed; inset: 0;
    background: rgba(12, 22, 18, 0.78);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: none; align-items: center; justify-content: center;
    z-index: 10002;
    padding: 1rem;
    font-family: inherit;
}
.nick-overlay.open { display: flex; }
.nick-card {
    width: 100%; max-width: 440px;
    background: #fff;
    border-radius: 16px;
    padding: 1.8rem 1.7rem 1.4rem;
    box-shadow: 0 22px 60px rgba(0,0,0,0.5);
}
.nick-title {
    font-size: 1.2rem; font-weight: 800;
    color: var(--green-deep, #2a6b4a);
    text-align: center;
    margin-bottom: 0.3rem;
}
.nick-sub {
    font-size: 0.86rem; color: rgba(0,0,0,0.6);
    text-align: center; line-height: 1.5;
    margin-bottom: 1.1rem;
}
.nick-input {
    width: 100%;
    padding: 0.8rem 0.9rem;
    font-family: inherit; font-size: 1rem;
    color: #1e2a24;
    background: #f8faf7;
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 10px;
    outline: none;
    text-align: center;
    -webkit-appearance: none;
}
.nick-input:focus { background: #fff; border-color: var(--green-mid, #52a872); box-shadow: 0 0 0 3px rgba(82,168,114,0.14); }
.nick-hint { font-size: 0.76rem; color: rgba(0,0,0,0.5); text-align: center; margin-top: 0.45rem; }
.nick-err { font-size: 0.82rem; color: #a3322c; text-align: center; margin-top: 0.5rem; min-height: 1rem; }
.nick-agree {
    display: flex; align-items: flex-start; gap: 0.55rem;
    margin-top: 1rem;
    padding: 0.7rem 0.8rem;
    background: var(--green-faint, #e2f5ea);
    border-radius: 9px;
    font-size: 0.82rem; color: rgba(0,0,0,0.72);
    line-height: 1.5;
    cursor: pointer;
}
.nick-agree input[type="checkbox"] {
    margin-top: 0.15rem;
    width: 18px; height: 18px;
    accent-color: var(--green-deep, #2a6b4a);
    cursor: pointer;
    flex-shrink: 0;
}
.nick-agree a { color: var(--green-deep, #2a6b4a); text-decoration: underline; }
.nick-submit {
    width: 100%;
    margin-top: 1rem;
    padding: 0.85rem 1rem;
    font-family: inherit; font-size: 0.95rem; font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    border: none; border-radius: 10px;
    cursor: pointer;
}
.nick-submit:disabled { opacity: 0.55; cursor: not-allowed; }

/* ---------- Rankings panel ---------- */
.rank-tabs {
    display: flex;
    gap: 0.4rem;
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 1rem;
}
.rank-tab {
    flex: 1;
    padding: 0.65rem 0.8rem;
    font-family: inherit; font-size: 0.9rem; font-weight: 600;
    color: rgba(255,255,255,0.65);
    background: transparent;
    border: none; border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s ease;
}
.rank-tab.active {
    background: rgba(82,168,114,0.22);
    color: var(--green-pale, #b5e6c8);
    box-shadow: 0 0 0 1px rgba(114,196,146,0.3);
}
.rank-meta {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 0.2rem 0.6rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.45);
}
.rank-list {
    display: flex; flex-direction: column;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    overflow: hidden;
}
.rank-row {
    display: grid;
    grid-template-columns: 44px 42px 1fr auto;
    gap: 0.8rem;
    align-items: center;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.92rem;
    color: #fff;
}
.rank-row:last-child { border-bottom: none; }
.rank-row.self { background: rgba(82,168,114,0.14); border-left: 3px solid var(--green-light, #72c492); padding-left: calc(1rem - 3px); }
.rank-pos {
    font-family: 'Playfair Display', 'DejaVu Serif', serif;
    font-weight: 800;
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    text-align: center;
}
.rank-pos.top1 { color: #ffd469; text-shadow: 0 0 10px rgba(255,212,105,0.5); }
.rank-pos.top2 { color: #c8d5e3; }
.rank-pos.top3 { color: #d99b6b; }
.rank-ava {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.9rem;
    overflow: hidden;
    flex-shrink: 0;
}
.rank-ava img { width: 100%; height: 100%; object-fit: cover; }
.rank-name { font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rank-name .rank-session-count { font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.45); margin-left: 0.4rem; }
.rank-score { font-family: inherit; font-weight: 700; font-size: 1rem; color: var(--green-pale, #b5e6c8); letter-spacing: 0.02em; }
.rank-empty { padding: 3rem 1rem; text-align: center; color: rgba(255,255,255,0.45); font-size: 0.92rem; }
.rank-self-card {
    margin-top: 0.8rem;
    padding: 0.9rem 1rem;
    background: rgba(82,168,114,0.14);
    border: 1px solid rgba(114,196,146,0.3);
    border-radius: 11px;
    display: grid;
    grid-template-columns: 44px 1fr auto;
    gap: 0.8rem;
    align-items: center;
}
.rank-self-card .rank-self-label { font-size: 0.78rem; color: rgba(255,255,255,0.6); font-weight: 500; }
.rank-self-card .rank-self-rank { font-size: 1.1rem; font-weight: 800; color: var(--green-pale, #b5e6c8); }
.rank-loginCTA {
    padding: 1.4rem 1rem;
    text-align: center;
    color: rgba(255,255,255,0.72);
    font-size: 0.9rem;
    background: rgba(255,255,255,0.04);
    border: 1px dashed rgba(255,255,255,0.12);
    border-radius: 11px;
}
.rank-loginCTA button {
    margin-top: 0.7rem;
    padding: 0.55rem 1.1rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    border: none; border-radius: 999px;
    cursor: pointer;
}

/* ---------- Mypage panel ---------- */
.mp-header {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.2rem;
    background: linear-gradient(135deg, rgba(82,168,114,0.2), rgba(42,107,74,0.1));
    border: 1px solid rgba(114,196,146,0.25);
    border-radius: 14px;
    margin-bottom: 1rem;
}
.mp-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 1.4rem;
    overflow: hidden; flex-shrink: 0;
}
.mp-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mp-info { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.mp-nick { font-size: 1.2rem; font-weight: 800; color: #fff; }
.mp-since { font-size: 0.78rem; color: rgba(255,255,255,0.55); }
.mp-edit-btn {
    margin-left: auto;
    padding: 0.5rem 0.85rem;
    font-family: inherit; font-size: 0.8rem; font-weight: 600;
    color: var(--green-pale, #b5e6c8);
    background: rgba(82,168,114,0.2);
    border: 1px solid rgba(114,196,146,0.3);
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
}
.mp-edit-btn:hover { background: rgba(82,168,114,0.3); }
.mp-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-bottom: 1.2rem;
}
.mp-stat {
    padding: 0.9rem 0.8rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 11px;
    text-align: center;
}
.mp-stat-value { font-size: 1.45rem; font-weight: 800; color: #fff; line-height: 1.1; }
.mp-stat-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-top: 0.25rem; text-transform: uppercase; }
.mp-section-title {
    font-size: 0.82rem; font-weight: 700; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    margin: 1.4rem 0 0.6rem;
}
.mp-session-list {
    display: flex; flex-direction: column;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    overflow: hidden;
}
.mp-session-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.8rem;
    align-items: center;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.88rem;
}
.mp-session-row:last-child { border-bottom: none; }
.mp-session-mode { color: #fff; font-weight: 600; }
.mp-session-mode .mp-diff { font-weight: 500; color: rgba(255,255,255,0.5); margin-left: 0.4rem; font-size: 0.78rem; }
.mp-session-score { color: var(--green-pale, #b5e6c8); font-weight: 700; font-size: 0.95rem; }
.mp-session-meta { color: rgba(255,255,255,0.5); font-size: 0.78rem; white-space: nowrap; }
.mp-danger {
    margin-top: 1.6rem;
    padding: 1rem;
    background: rgba(160, 50, 50, 0.08);
    border: 1px solid rgba(160, 50, 50, 0.25);
    border-radius: 11px;
}
.mp-danger-title { font-size: 0.82rem; font-weight: 700; color: #ff9a9a; margin-bottom: 0.4rem; letter-spacing: 0.1em; text-transform: uppercase; }
.mp-danger-desc { font-size: 0.82rem; color: rgba(255,255,255,0.6); line-height: 1.55; margin-bottom: 0.8rem; }
.mp-delete-btn {
    padding: 0.55rem 1rem;
    font-family: inherit; font-size: 0.82rem; font-weight: 600;
    color: #ff7a7a;
    background: transparent;
    border: 1px solid rgba(255, 122, 122, 0.35);
    border-radius: 7px;
    cursor: pointer;
}
.mp-delete-btn:hover { background: rgba(255, 122, 122, 0.1); }

.mp-encouragement {
    margin-top: 0.8rem;
    padding: 0.8rem 1rem;
    background: rgba(114, 196, 146, 0.1);
    border: 1px solid rgba(114, 196, 146, 0.25);
    border-radius: 10px;
    font-size: 0.85rem; color: var(--green-pale, #b5e6c8);
    line-height: 1.5;
    text-align: center;
}

@media (max-width: 560px) {
    .rank-row { grid-template-columns: 34px 34px 1fr auto; gap: 0.5rem; padding: 0.6rem 0.7rem; font-size: 0.86rem; }
    .mp-stats-grid { gap: 0.4rem; }
    .mp-stat { padding: 0.7rem 0.4rem; }
    .mp-stat-value { font-size: 1.15rem; }
}
`;

    const MODE_LABELS = {
        ear_single: '음 맞추기',
        ear_compare: '두 음 비교',
        ear_chord: '코드 맞추기'
    };
    const DIFF_LABELS = { easy: '쉬움', medium: '보통', hard: '어려움' };
    const DIFF_COEF = { easy: 1.0, medium: 1.5, hard: 2.0 };
    const SESSION_SIZE = 10;

    // ------------------------------------------------------------
    // Session tracker state
    // ------------------------------------------------------------
    const tracker = {
        mode: null,          // 'ear_single' | 'ear_compare' | 'ear_chord'
        difficulty: null,    // 'easy' | 'medium' | 'hard'
        startedAt: null,     // Date — when first question started
        questionStartedAt: null, // Date — current question play time
        answers: [],         // [{correct, response_ms}, ...]
        submitting: false,
    };

    function injectStyles() {
        if (document.getElementById('ear-ranking-styles')) return;
        const s = document.createElement('style');
        s.id = 'ear-ranking-styles';
        s.textContent = CSS;
        document.head.appendChild(s);
    }

    function sb() {
        const ahnssam = window.ahnssamAuth;
        return ahnssam && ahnssam.supabase ? ahnssam.supabase : null;
    }
    function currentUser() {
        const a = window.ahnssamAuth;
        const s = a && a.getSession ? a.getSession() : null;
        return s && s.user ? s.user : null;
    }
    function currentProfile() {
        const a = window.ahnssamAuth;
        return a && a.getProfile ? a.getProfile() : null;
    }

    // ------------------------------------------------------------
    // Session tracker API — called from tools.html hooks
    // ------------------------------------------------------------
    function resetTracker(mode, diff) {
        tracker.mode = mode || null;
        tracker.difficulty = diff || null;
        tracker.startedAt = null;
        tracker.questionStartedAt = null;
        tracker.answers = [];
        tracker.submitting = false;
        updatePill();
    }

    // Called when a new question starts playing
    function startQuestion(mode, diff) {
        if (!mode || !diff) return;
        // If mode/diff changed, drop in-flight session
        if (tracker.mode !== mode || tracker.difficulty !== diff) {
            resetTracker(mode, diff);
        }
        if (!tracker.startedAt) tracker.startedAt = new Date();
        tracker.questionStartedAt = new Date();
        updatePill();
    }

    // Called when answer is graded
    function recordAnswer(correct) {
        if (!tracker.mode || !tracker.questionStartedAt) return;
        const responseMs = Math.max(0, Date.now() - tracker.questionStartedAt.getTime());
        tracker.answers.push({ correct: !!correct, response_ms: responseMs });
        updatePill();
        if (tracker.answers.length >= SESSION_SIZE) {
            finishSession();
        }
    }

    async function finishSession() {
        if (tracker.submitting) return;
        tracker.submitting = true;
        const mode = tracker.mode;
        const diff = tracker.difficulty;
        const answers = tracker.answers.slice(0, SESSION_SIZE);
        const startedAt = tracker.startedAt || new Date();
        const endedAt = new Date();

        const correctCount = answers.filter(a => a.correct).length;
        const validCorrect = answers.filter(a => a.correct && a.response_ms >= 300).length;
        const localScore = Math.floor(validCorrect * 10 * (DIFF_COEF[diff] || 1.0));
        const accuracy = Math.round(correctCount / SESSION_SIZE * 100);

        // GA4 event
        try {
            if (window.gtag) {
                window.gtag('event', 'ear_session_complete', {
                    mode, difficulty: diff, correct: correctCount, total: SESSION_SIZE
                });
            }
        } catch (e) {}

        // If not logged in → show login CTA
        const user = currentUser();
        if (!user) {
            tracker.submitting = false;
            showSummary({
                mode, diff,
                score: localScore,
                correct: correctCount,
                total: SESSION_SIZE,
                accuracy,
                saved: false,
                loginCTA: true
            });
            resetTracker(mode, diff);
            return;
        }

        // Submit to Supabase RPC
        const client = sb();
        let serverResult = null;
        let errMsg = null;
        if (client) {
            try {
                const { data, error } = await client.rpc('submit_ear_session', {
                    p_mode: mode,
                    p_difficulty: diff,
                    p_started_at: startedAt.toISOString(),
                    p_ended_at: endedAt.toISOString(),
                    p_answers: answers
                });
                if (error) {
                    errMsg = humanizeRpcError(error);
                } else {
                    serverResult = data;
                }
            } catch (e) {
                errMsg = (e && e.message) || String(e);
            }
        } else {
            errMsg = '인증 SDK가 아직 로드되지 않았어요.';
        }

        tracker.submitting = false;
        showSummary({
            mode, diff,
            score: serverResult ? serverResult.score : localScore,
            correct: correctCount,
            total: SESSION_SIZE,
            accuracy,
            saved: !!serverResult,
            error: errMsg,
            rejectedFast: serverResult ? serverResult.rejected_fast : 0
        });
        resetTracker(mode, diff);
    }

    function humanizeRpcError(err) {
        const msg = (err && err.message) || String(err);
        const map = {
            auth_required: '로그인이 필요해요.',
            session_must_be_10: '10문제 단위가 아닌 세션이에요.',
            rate_limited: '너무 빠르게 세션을 제출했어요. 1분 후 다시 시도해주세요.',
            invalid_mode: '잘못된 모드에요.',
            invalid_difficulty: '잘못된 난이도에요.'
        };
        for (const k in map) if (msg.indexOf(k) !== -1) return map[k];
        return msg;
    }

    // Inline progress pill — inserted into each mode's .et-score-row
    function updatePill() {
        const pillId = (mode) => {
            if (mode === 'ear_compare') return 'etSessionPill_interval';
            if (mode === 'ear_single') return 'etSessionPill_pitch';
            if (mode === 'ear_chord') return 'etSessionPill_chord';
            return null;
        };
        // Remove all pills first
        document.querySelectorAll('.et-session-pill').forEach(p => p.remove());

        if (!tracker.mode) return;
        const id = pillId(tracker.mode);
        if (!id) return;

        // Find the score-row for the active mode
        let rowSelector = '';
        if (tracker.mode === 'ear_compare') rowSelector = '#etIntervalMode .et-score-row';
        else if (tracker.mode === 'ear_single') rowSelector = '#etPitchMode .et-score-row';
        else if (tracker.mode === 'ear_chord') rowSelector = '#etChordMode .et-score-row';
        const row = document.querySelector(rowSelector);
        if (!row) return;

        const resetBtn = row.querySelector('.et-reset-btn-inline');
        const pill = document.createElement('span');
        pill.id = id;
        pill.className = 'et-session-pill';
        pill.innerHTML = `<span class="dot"></span><span>세션 ${tracker.answers.length}/${SESSION_SIZE}</span>`;
        if (resetBtn) row.insertBefore(pill, resetBtn); else row.appendChild(pill);
    }

    // ------------------------------------------------------------
    // Session summary overlay
    // ------------------------------------------------------------
    function ensureSummaryDom() {
        if (document.getElementById('earSumOverlay')) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = `
<div class="sum-overlay" id="earSumOverlay">
    <div class="sum-card">
        <div class="sum-title">SESSION COMPLETE</div>
        <div class="sum-mode" id="sumMode"></div>
        <div class="sum-score"><span id="sumScore">0</span><span class="sum-pts">PTS</span></div>
        <div class="sum-acc" id="sumAcc"></div>
        <div class="sum-note" id="sumNote"></div>
        <div class="sum-actions">
            <button class="sum-btn ghost" id="sumCloseBtn">닫기</button>
            <button class="sum-btn primary" id="sumContinueBtn">다음 세션</button>
        </div>
    </div>
</div>
`.trim();
        document.body.appendChild(wrap.firstElementChild);
        document.getElementById('sumCloseBtn').addEventListener('click', closeSummary);
        document.getElementById('sumContinueBtn').addEventListener('click', closeSummary);
        document.getElementById('earSumOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'earSumOverlay') closeSummary();
        });
    }
    function closeSummary() {
        const el = document.getElementById('earSumOverlay');
        if (el) el.classList.remove('open');
    }
    function showSummary(s) {
        ensureSummaryDom();
        document.getElementById('sumMode').textContent =
            MODE_LABELS[s.mode] + ' · ' + DIFF_LABELS[s.diff];
        document.getElementById('sumScore').textContent = s.score;
        document.getElementById('sumAcc').innerHTML =
            '정답 <strong>' + s.correct + '/' + s.total + '</strong> · 정답률 <strong>' + s.accuracy + '%</strong>';
        const note = document.getElementById('sumNote');
        let noteText = '';
        if (s.loginCTA) {
            noteText = '기록을 저장하고 랭킹에 등재하려면 로그인하세요.';
        } else if (s.saved) {
            const praise = s.accuracy >= 90 ? '완벽에 가까워요. 꾸준히 이어가요.'
                : s.accuracy >= 70 ? '좋은 흐름이에요. 조금만 더.'
                : s.accuracy >= 40 ? '괜찮아요. 천천히 귀가 열려요.'
                : '오늘도 잘 앉아준 것부터가 성장이에요.';
            noteText = '기록 저장 완료. ' + praise;
            if (s.rejectedFast) noteText += ' (너무 빠른 응답 ' + s.rejectedFast + '문제는 집계에서 제외됐어요.)';
        } else {
            noteText = '기록 저장에 실패했어요' + (s.error ? ' — ' + s.error : '.');
        }
        note.textContent = noteText;

        const continueBtn = document.getElementById('sumContinueBtn');
        if (s.loginCTA) {
            continueBtn.textContent = '로그인하기';
            continueBtn.onclick = function () {
                closeSummary();
                if (window.ahnssamAuth && window.ahnssamAuth.openLogin) window.ahnssamAuth.openLogin();
            };
        } else {
            continueBtn.textContent = '다음 세션';
            continueBtn.onclick = closeSummary;
        }
        document.getElementById('earSumOverlay').classList.add('open');
    }

    // ------------------------------------------------------------
    // First-time nickname modal
    // ------------------------------------------------------------
    let nickBusy = false;
    function ensureNickDom() {
        if (document.getElementById('nickOverlay')) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = `
<div class="nick-overlay" id="nickOverlay">
    <div class="nick-card">
        <div class="nick-title">닉네임을 정해주세요</div>
        <div class="nick-sub">랭킹에 표시될 이름이에요. 한글/영문/숫자 2~12자.<br>한 번 정해도 나중에 바꿀 수 있어요.</div>
        <input class="nick-input" id="nickInput" type="text" maxlength="12" placeholder="예: 기타나무">
        <div class="nick-hint">닉네임은 중복되지 않아야 해요.</div>
        <div class="nick-err" id="nickErr"></div>
        <label class="nick-agree" for="nickAgree">
            <input type="checkbox" id="nickAgree">
            <span>(필수) <a href="legal/terms.html" target="_blank">이용약관</a> 및 <a href="legal/privacy.html" target="_blank">개인정보처리방침</a>에 동의합니다.</span>
        </label>
        <button class="nick-submit" id="nickSubmit" disabled>확인</button>
    </div>
</div>
`.trim();
        document.body.appendChild(wrap.firstElementChild);
        const input = document.getElementById('nickInput');
        const agree = document.getElementById('nickAgree');
        const btn = document.getElementById('nickSubmit');
        const err = document.getElementById('nickErr');
        function updateDisabled() {
            const trim = (input.value || '').trim();
            btn.disabled = !(trim.length >= 2 && trim.length <= 12 && agree.checked && !nickBusy);
        }
        input.addEventListener('input', () => { err.textContent = ''; updateDisabled(); });
        agree.addEventListener('change', updateDisabled);
        btn.addEventListener('click', submitNickname);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !btn.disabled) submitNickname(); });
    }

    async function submitNickname() {
        const input = document.getElementById('nickInput');
        const agree = document.getElementById('nickAgree');
        const btn = document.getElementById('nickSubmit');
        const err = document.getElementById('nickErr');
        const trim = (input.value || '').trim();
        if (trim.length < 2 || trim.length > 12) { err.textContent = '2~12자로 입력해주세요.'; return; }
        if (!agree.checked) { err.textContent = '약관에 동의해주세요.'; return; }
        const client = sb();
        if (!client) { err.textContent = '잠시 후 다시 시도해주세요.'; return; }
        nickBusy = true; btn.disabled = true; err.textContent = '';
        try {
            const { data, error } = await client.rpc('update_nickname', { p_new_nickname: trim });
            if (error) {
                const msg = (error.message || '').toLowerCase();
                if (msg.includes('nickname_taken')) err.textContent = '이미 사용 중인 닉네임이에요.';
                else if (msg.includes('nickname_length_invalid')) err.textContent = '2~12자로 입력해주세요.';
                else err.textContent = error.message || '알 수 없는 오류.';
                return;
            }
            // Record agreement
            const user = currentUser();
            if (user) {
                await client.from('agreements').upsert({
                    user_id: user.id,
                    terms_agreed_at: new Date().toISOString(),
                    privacy_agreed_at: new Date().toISOString()
                });
            }
            document.getElementById('nickOverlay').classList.remove('open');
            // Trigger auth profile refetch so UI updates
            if (window.ahnssamAuth && window.ahnssamAuth.supabase) {
                // Simulate SIGNED_IN re-render by forcing the library to re-fetch
                try { await window.ahnssamAuth.supabase.auth.refreshSession(); } catch (e) {}
            }
        } catch (e) {
            err.textContent = e.message || '오류가 발생했어요.';
        } finally {
            nickBusy = false;
            btn.disabled = false;
        }
    }

    async function checkAndPromptNickname() {
        const client = sb();
        const user = currentUser();
        if (!client || !user) return;
        // Fetch profile + agreement status
        const { data: prof } = await client.from('profiles').select('nickname').eq('id', user.id).single();
        const { data: agr } = await client.from('agreements').select('terms_agreed_at, privacy_agreed_at').eq('user_id', user.id).maybeSingle();
        const isGoogleGenerated = !!(prof && prof.nickname && /^(u|user)[0-9a-f]{6,}$/i.test(prof.nickname));
        const needsAgreement = !agr || !agr.terms_agreed_at || !agr.privacy_agreed_at;
        // Only prompt if we see auto-generated nickname or no agreement
        if (isGoogleGenerated || needsAgreement) {
            ensureNickDom();
            const input = document.getElementById('nickInput');
            if (input && prof && prof.nickname && !isGoogleGenerated) input.value = prof.nickname;
            document.getElementById('nickOverlay').classList.add('open');
            setTimeout(() => { const i = document.getElementById('nickInput'); if (i) i.focus(); }, 50);
        }
    }

    // ------------------------------------------------------------
    // Rankings panel
    // ------------------------------------------------------------
    let _rankScope = 'daily';

    function renderRankingsShell() {
        const panel = document.getElementById('rankingPanel');
        if (!panel) return;
        panel.innerHTML = `
<div class="tool-header">
    <div class="tool-header-icon"><i class="fas fa-trophy"></i></div>
    <h1>랭킹</h1>
</div>
<div class="tool-body">
    <div class="rank-tabs">
        <button class="rank-tab active" data-scope="daily">오늘</button>
        <button class="rank-tab" data-scope="weekly">이번 주</button>
        <button class="rank-tab" data-scope="total">전체</button>
    </div>
    <div class="rank-meta">
        <span id="rankScopeLabel">오늘 획득한 점수</span>
        <span id="rankRefresh" style="cursor:pointer;">↻ 새로고침</span>
    </div>
    <div id="rankContent"></div>
</div>
`;
        panel.querySelectorAll('.rank-tab').forEach((t) => {
            t.addEventListener('click', () => {
                _rankScope = t.getAttribute('data-scope');
                panel.querySelectorAll('.rank-tab').forEach((x) => x.classList.toggle('active', x === t));
                const label = { daily: '오늘 획득한 점수', weekly: '이번 주 획득한 점수', total: '누적 점수' }[_rankScope];
                panel.querySelector('#rankScopeLabel').textContent = label;
                loadRankings();
            });
        });
        panel.querySelector('#rankRefresh').addEventListener('click', loadRankings);
    }

    async function loadRankings() {
        const content = document.getElementById('rankContent');
        if (!content) return;
        content.innerHTML = '<div class="rank-empty">불러오는 중…</div>';
        const client = sb();
        if (!client) { content.innerHTML = '<div class="rank-empty">준비 중…</div>'; return; }
        const { data, error } = await client.rpc('get_ranking', { p_scope: _rankScope });
        if (error) {
            content.innerHTML = '<div class="rank-empty">랭킹을 불러올 수 없어요.</div>';
            return;
        }
        const top = (data && data.top) || [];
        const myRank = data && data.my_rank;
        const myScore = data && data.my_score;
        const user = currentUser();

        if (top.length === 0) {
            content.innerHTML = `<div class="rank-empty">아직 등재된 기록이 없어요.<br>첫 번째 기록의 주인공이 되어보세요.</div>`;
            return;
        }

        const rows = top.map(r => rankRowHtml(r, user)).join('');
        let selfCardHtml = '';
        if (user && (!myRank || myRank > 50)) {
            if (myRank) {
                selfCardHtml = `
<div class="rank-self-card">
    <div class="rank-self-label">내 순위</div>
    <div class="rank-self-rank">${myRank}위</div>
    <div class="rank-score">${myScore || 0}점</div>
</div>`;
            } else {
                selfCardHtml = `
<div class="rank-self-card">
    <div class="rank-self-label">내 순위</div>
    <div style="color:rgba(255,255,255,0.6);">아직 기록 없음</div>
    <div class="rank-score">0점</div>
</div>`;
            }
        } else if (!user) {
            selfCardHtml = `
<div class="rank-loginCTA">
    로그인하면 내 기록도 랭킹에 올라가요.
    <br><button onclick="window.ahnssamAuth && window.ahnssamAuth.openLogin()">로그인</button>
</div>`;
        }

        content.innerHTML = `<div class="rank-list">${rows}</div>${selfCardHtml}`;
    }

    function rankRowHtml(r, currentUser) {
        const isSelf = currentUser && currentUser.id === r.user_id;
        const rankClass = r.rank === 1 ? 'top1' : r.rank === 2 ? 'top2' : r.rank === 3 ? 'top3' : '';
        const avatar = r.profile_image_url
            ? `<img src="${escapeAttr(r.profile_image_url)}" alt="" onerror="this.style.display='none'; this.parentNode.innerHTML='${(r.nickname||'?').charAt(0).toUpperCase()}';">`
            : escapeHtml((r.nickname || '?').charAt(0).toUpperCase());
        return `
<div class="rank-row ${isSelf ? 'self' : ''}">
    <div class="rank-pos ${rankClass}">${r.rank}</div>
    <div class="rank-ava">${avatar}</div>
    <div class="rank-name">${escapeHtml(r.nickname || '익명')}<span class="rank-session-count">· ${r.session_count}세션</span></div>
    <div class="rank-score">${r.total_score.toLocaleString()}점</div>
</div>`;
    }

    // ------------------------------------------------------------
    // Mypage panel
    // ------------------------------------------------------------
    function renderMypageShell() {
        const panel = document.getElementById('mypagePanel');
        if (!panel) return;
        panel.innerHTML = `
<div class="tool-header">
    <div class="tool-header-icon"><i class="fas fa-user"></i></div>
    <h1>마이페이지</h1>
</div>
<div class="tool-body" id="mypageBody">
    <div class="rank-empty">불러오는 중…</div>
</div>
`;
    }

    async function loadMypage() {
        const body = document.getElementById('mypageBody');
        if (!body) return;
        const user = currentUser();
        if (!user) {
            body.innerHTML = `
<div class="rank-loginCTA">
    로그인하면 내 기록과<br>통계를 볼 수 있어요.
    <br><button onclick="window.ahnssamAuth && window.ahnssamAuth.openLogin()">로그인</button>
</div>`;
            return;
        }
        body.innerHTML = '<div class="rank-empty">불러오는 중…</div>';
        const client = sb();
        if (!client) { body.innerHTML = '<div class="rank-empty">준비 중…</div>'; return; }
        const { data, error } = await client.rpc('get_my_stats');
        if (error) {
            body.innerHTML = '<div class="rank-empty">정보를 불러올 수 없어요.</div>';
            return;
        }
        const p = data.profile || {};
        const s = data.stats || {};
        const recent = data.recent || [];
        const initial = (p.nickname || '?').charAt(0).toUpperCase();
        const avatar = p.profile_image_url
            ? `<img src="${escapeAttr(p.profile_image_url)}" alt="">`
            : escapeHtml(initial);

        const joinedDate = p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

        const recentHtml = recent.length === 0
            ? '<div class="rank-empty">아직 기록이 없어요. 첫 세션을 시작해보세요.</div>'
            : '<div class="mp-session-list">' + recent.map(r => {
                const d = new Date(r.created_at);
                const when = d.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
<div class="mp-session-row">
    <div class="mp-session-mode">${MODE_LABELS[r.mode] || r.mode}<span class="mp-diff">${DIFF_LABELS[r.difficulty] || r.difficulty}</span></div>
    <div class="mp-session-score">${(r.score || 0).toLocaleString()}점 <span style="color:rgba(255,255,255,0.5);font-weight:500;font-size:0.78rem;">(${r.correct_count}/${r.total_count})</span></div>
    <div class="mp-session-meta">${when}</div>
</div>`;
            }).join('') + '</div>';

        const encouragement = s.session_count >= 1
            ? (s.avg_accuracy >= 70 ? '꾸준히 잘 쌓아가고 있어요.' :
               s.avg_accuracy >= 40 ? '천천히, 꾸준히. 귀는 반복으로 열려요.' :
               '아직 시작 단계에요. 하루 한 세션도 큰 변화를 만들어요.')
            : '첫 세션을 시작해보세요.';

        body.innerHTML = `
<div class="mp-header">
    <div class="mp-avatar">${avatar}</div>
    <div class="mp-info">
        <div class="mp-nick">${escapeHtml(p.nickname || '-')}</div>
        <div class="mp-since">가입 ${joinedDate}</div>
    </div>
    <button class="mp-edit-btn" id="mpEditNickBtn">닉네임 변경</button>
</div>
<div class="mp-stats-grid">
    <div class="mp-stat">
        <div class="mp-stat-value">${(s.total_score || 0).toLocaleString()}</div>
        <div class="mp-stat-label">누적 점수</div>
    </div>
    <div class="mp-stat">
        <div class="mp-stat-value">${(s.session_count || 0).toLocaleString()}</div>
        <div class="mp-stat-label">완료 세션</div>
    </div>
    <div class="mp-stat">
        <div class="mp-stat-value">${(s.avg_accuracy || 0)}%</div>
        <div class="mp-stat-label">평균 정답률</div>
    </div>
</div>
<div class="mp-encouragement">${encouragement}</div>
<div class="mp-section-title">최근 10 세션</div>
${recentHtml}
<div class="mp-danger">
    <div class="mp-danger-title">계정 탈퇴</div>
    <div class="mp-danger-desc">탈퇴 시 프로필 정보(닉네임·이메일·프로필 사진)는 즉시 익명화되고, 30일 내 완전 삭제됩니다. 세션 기록은 익명 처리되어 랭킹 계산에서 제외돼요.</div>
    <button class="mp-delete-btn" id="mpDeleteBtn">계정 탈퇴하기</button>
</div>
`;
        document.getElementById('mpEditNickBtn').addEventListener('click', onMpEditNick);
        document.getElementById('mpDeleteBtn').addEventListener('click', onMpDelete);
    }

    async function onMpEditNick() {
        const next = window.prompt('새 닉네임을 입력하세요 (2~12자)', '');
        if (next == null) return;
        const trim = (next || '').trim();
        if (trim.length < 2 || trim.length > 12) { alert('2~12자로 입력해주세요.'); return; }
        const client = sb();
        if (!client) return;
        const { data, error } = await client.rpc('update_nickname', { p_new_nickname: trim });
        if (error) {
            const msg = (error.message || '').toLowerCase();
            if (msg.includes('nickname_taken')) alert('이미 사용 중인 닉네임이에요.');
            else alert(error.message);
            return;
        }
        await loadMypage();
        try { await window.ahnssamAuth.supabase.auth.refreshSession(); } catch (e) {}
    }

    async function onMpDelete() {
        if (!confirm('정말 탈퇴하시겠어요?\n\n· 프로필 정보는 즉시 익명화됩니다.\n· 30일 내 완전 삭제됩니다.\n· 이 작업은 되돌릴 수 없어요.')) return;
        const client = sb();
        if (!client) return;
        const { error } = await client.rpc('delete_my_account');
        if (error) { alert(error.message); return; }
        alert('탈퇴 처리되었어요. 30일 내 완전히 삭제됩니다.');
        await client.auth.signOut();
    }

    // ------------------------------------------------------------
    // Utility
    // ------------------------------------------------------------
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }
    function escapeAttr(s) { return escapeHtml(s); }

    // ------------------------------------------------------------
    // Wire up with switchTool
    // ------------------------------------------------------------
    function installSwitchToolHook() {
        const origSwitch = window.switchTool;
        if (typeof origSwitch !== 'function') return;
        window.switchTool = function (tool) {
            const ret = origSwitch.apply(this, arguments);
            if (tool === 'ranking') loadRankings();
            else if (tool === 'mypage') loadMypage();
            return ret;
        };
    }

    // ------------------------------------------------------------
    // Boot
    // ------------------------------------------------------------
    function waitForAuth(cb, tries) {
        tries = tries || 0;
        if (window.ahnssamAuth && window.ahnssamAuth.supabase) {
            cb();
        } else if (tries < 40) {
            setTimeout(() => waitForAuth(cb, tries + 1), 200);
        }
    }

    function boot() {
        injectStyles();
        renderRankingsShell();
        renderMypageShell();
        installSwitchToolHook();

        // Expose API for tools.html hooks + UI code
        window.earSession = {
            startQuestion,       // (mode, diff) — call when a new question plays
            recordAnswer,        // (correct:bool) — call when answer is graded
            reset: resetTracker, // ()
            getState: () => ({ ...tracker, answers: tracker.answers.slice() }),
        };
        window.earRanking = { load: loadRankings };
        window.earMypage = { load: loadMypage };

        waitForAuth(() => {
            const sbClient = sb();
            // Check current session and maybe prompt nickname
            (async () => {
                try {
                    const { data } = await sbClient.auth.getSession();
                    if (data.session) checkAndPromptNickname();
                } catch (e) {}
            })();
            // Listen for future auth state changes
            sbClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    setTimeout(checkAndPromptNickname, 600);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
