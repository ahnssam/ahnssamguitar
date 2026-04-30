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
    color: var(--green-deep, #2a6b4a);
    background: rgba(82,168,114,0.12);
    border: 1px solid rgba(82,168,114,0.3);
    border-radius: 999px;
    margin-left: auto;
    margin-right: 0.4rem;
    white-space: nowrap;
}
.et-session-pill.warn { color: #c77900; background: rgba(255,190,80,0.12); border-color: rgba(255,190,80,0.3); }
.et-session-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px currentColor; }

/* Session summary overlay (10-question completion) */
.sum-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.4);
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
    background: linear-gradient(160deg, #ffffff, #f5fbf7);
    border: 1px solid rgba(114,196,146,0.25);
    border-radius: 18px;
    padding: 1.8rem 1.6rem;
    color: var(--text-primary, #1a2421);
    box-shadow: 0 22px 60px rgba(0,0,0,0.5);
    text-align: center;
}
.sum-title {
    font-size: 1rem; font-weight: 700; letter-spacing: 0.18em;
    color: var(--green-deep, #2a6b4a);
    text-transform: uppercase;
    margin-bottom: 0.3rem;
}
.sum-mode { font-size: 0.88rem; font-weight: 500; color: rgba(26, 36, 33, 0.6); margin-bottom: 1.2rem; }
.sum-score {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem; font-weight: 900;
    color: var(--text-primary, #1a2421);
    line-height: 1;
    margin-bottom: 0.4rem;
}
.sum-score .sum-pts { font-size: 1.1rem; color: var(--green-mid, #62b682); margin-left: 0.3rem; font-family: inherit; font-weight: 700; letter-spacing: 0.1em; }
.sum-acc { font-size: 0.95rem; color: rgba(26, 36, 33, 0.75); margin-bottom: 1.4rem; }
.sum-acc strong { color: var(--text-primary, #1a2421); font-weight: 700; }
.sum-note {
    font-size: 0.82rem; color: rgba(26, 36, 33, 0.55);
    line-height: 1.55;
    padding: 0.75rem 0.8rem;
    background: rgba(26, 36, 33, 0.04);
    border: 1px solid rgba(26, 36, 33, 0.06);
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
    color: #ffffff;
    /* 단색 — 그라데이션 대신 밝은 쪽(--green-mid) 으로 통일. 라운드 완료
       다이얼로그의 다음 라운드 버튼이 깔끔하게 보이도록. */
    background: var(--green-mid, #52a872);
}
.sum-btn.primary:hover {
    background: var(--green-deep, #2a6b4a);
}
.sum-btn.ghost {
    color: rgba(26, 36, 33, 0.75);
    background: rgba(26, 36, 33, 0.06);
    border: 1px solid rgba(26, 36, 33, 0.12);
}
.sum-btn.ghost:hover { background: rgba(26, 36, 33, 0.1); }

/* First-time nickname setup (blocks until set) */
.nick-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.45);
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
    color: var(--text-primary, #1a2421);
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
    color: var(--text-primary, #1a2421);
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    border: none; border-radius: 10px;
    cursor: pointer;
}
.nick-submit:disabled { opacity: 0.55; cursor: not-allowed; }

/* ---------- Rankings panel ---------- */
.rank-tabs {
    display: flex;
    gap: 0.4rem;
    background: rgba(26, 36, 33, 0.04);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 1rem;
}
.rank-tab {
    flex: 1;
    padding: 0.65rem 0.8rem;
    font-family: inherit; font-size: 0.9rem; font-weight: 600;
    color: rgba(26, 36, 33, 0.65);
    background: transparent;
    border: none; border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s ease;
}
.rank-tab.active {
    background: rgba(82,168,114,0.22);
    color: var(--green-mid, #62b682);
    box-shadow: 0 0 0 1px rgba(114,196,146,0.3);
}

/* ---------- Period navigator — 기간 그룹 안의 pill 아래에 위치 ----------
   "기간" 라벨은 다른 그룹들과 동일하게 왼쪽에 두고, 오른쪽 영역을 세로 스택
   (pill row → navigator row) 으로 만들어 navigator 의 왼쪽 끝이 pill 첫 번째
   ("오늘") 버튼과 같은 column 에 정렬되도록. */
.rank-filter-group-period { flex-wrap: nowrap; }
.rank-filter-group-period .rank-period-content {
    flex: 1; min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.rank-period-nav {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;   /* navigator 첫 요소 (‹) 가 좌측 정렬 */
    flex-wrap: nowrap;             /* 좁은 화면에서도 한 줄 유지 */
    gap: 0.4rem;
    margin: 0;
    min-width: 0;
}
.rank-period-arrow {
    width: 32px; height: 32px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid rgba(42, 107, 74, 0.22);
    background: rgba(82, 168, 114, 0.08);
    color: var(--green-deep, #2a6b4a);
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;   /* 화살표는 줄어들지 않음 */
}
.rank-period-arrow:hover:not(:disabled) {
    background: rgba(82, 168, 114, 0.22);
    border-color: rgba(82, 168, 114, 0.5);
}
.rank-period-arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
.rank-period-label {
    flex: 1 1 auto;          /* 가운데 라벨이 남은 공간 다 차지 */
    min-width: 0;            /* 좁아지면 줄어들 수 있게 */
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: 1px solid rgba(82, 168, 114, 0.32);
    background: rgba(82, 168, 114, 0.08);
    color: var(--green-deep, #2a6b4a);
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background 0.15s, border-color 0.15s;
}
.rank-period-label > span {
    overflow: hidden;
    text-overflow: ellipsis;
}
.rank-period-label:hover {
    background: rgba(82, 168, 114, 0.18);
    border-color: rgba(82, 168, 114, 0.55);
}
.rank-period-label i {
    font-size: 0.78rem;
    opacity: 0.7;
}
.rank-period-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    min-width: 220px;
    max-width: 90vw;
    max-height: 300px;
    overflow-y: auto;
    padding: 0.4rem;
    background: #ffffff;
    border: 1px solid rgba(82, 168, 114, 0.28);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.rank-period-menu[hidden] { display: none; }
.rank-period-menu-item {
    padding: 0.5rem 0.75rem;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: 7px;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-primary, #1a2421);
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    white-space: nowrap;
}
.rank-period-menu-item:hover {
    background: rgba(82, 168, 114, 0.14);
    color: var(--green-deep, #2a6b4a);
}
.rank-period-menu-item.is-active {
    background: rgba(82, 168, 114, 0.22);
    color: var(--green-deep, #2a6b4a);
    font-weight: 700;
}

.rank-meta {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 0.2rem 0.6rem;
    font-size: 0.78rem; color: rgba(26, 36, 33, 0.45);
}
.rank-list {
    display: flex; flex-direction: column;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.07);
    border-radius: 12px;
    overflow: hidden;
}
.rank-row {
    display: grid;
    grid-template-columns: 44px 42px 1fr auto;
    gap: 0.8rem;
    align-items: center;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(26, 36, 33, 0.05);
    font-size: 0.92rem;
    color: var(--text-primary, #1a2421);
}
.rank-row:last-child { border-bottom: none; }
.rank-row.self { background: rgba(82,168,114,0.14); border-left: 3px solid var(--green-deep, #2a6b4a); padding-left: calc(1rem - 3px); }
.rank-pos {
    font-family: 'Playfair Display', 'DejaVu Serif', serif;
    font-weight: 800;
    font-size: 1rem;
    color: rgba(26, 36, 33, 0.7);
    text-align: center;
}
.rank-pos.top1 { color: #b8860b; text-shadow: 0 0 10px rgba(255,212,105,0.5); }
.rank-pos.top2 { color: #5a7a88; }
.rank-pos.top3 { color: #d99b6b; }
.rank-ava {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    color: var(--text-primary, #1a2421);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.9rem;
    overflow: hidden;
    flex-shrink: 0;
}
.rank-ava img { width: 100%; height: 100%; object-fit: cover; }
.rank-name { font-weight: 600; color: var(--text-primary, #1a2421); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rank-name .rank-session-count { font-size: 0.75rem; font-weight: 500; color: rgba(26, 36, 33, 0.45); margin-left: 0.4rem; }
.rank-score { font-family: inherit; font-weight: 700; font-size: 1rem; color: var(--green-mid, #62b682); letter-spacing: 0.02em; display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2; }
.rank-score .rank-score-pts { font-weight: 700; }
.rank-score .rank-score-acc { font-size: 0.72rem; font-weight: 500; color: rgba(26, 36, 33, 0.55); margin-top: 0.05rem; }
:root[data-theme="dark"] .rank-score .rank-score-acc { color: rgba(232, 240, 236, 0.55); }
.rank-empty { padding: 3rem 1rem; text-align: center; color: rgba(26, 36, 33, 0.45); font-size: 0.92rem; }
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
.rank-self-card .rank-self-label { font-size: 0.78rem; color: rgba(26, 36, 33, 0.6); font-weight: 500; }
.rank-self-card .rank-self-rank { font-size: 1.1rem; font-weight: 800; color: var(--green-mid, #62b682); }
.rank-self-card .rank-self-empty { font-size: 0.92rem; color: rgba(26, 36, 33, 0.6); font-weight: 500; }
.rank-loginCTA {
    padding: 1.4rem 1rem;
    text-align: center;
    color: rgba(26, 36, 33, 0.72);
    font-size: 0.9rem;
    background: rgba(26, 36, 33, 0.04);
    border: 1px dashed rgba(26, 36, 33, 0.12);
    border-radius: 11px;
}
/* ---------- Ranking: scoring help buttons ---------- */
/* (legacy — kept in case something still references .rank-help-btn) */
.rank-help-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 26px; height: 26px;
    margin-left: 0.45rem;
    padding: 0;
    vertical-align: middle;
    font-size: 0.85rem; font-weight: 700;
    background: rgba(26, 36, 33, 0.08);
    color: rgba(26, 36, 33, 0.7);
    border: 1.5px solid rgba(26, 36, 33, 0.25);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease;
}
.rank-help-btn:hover {
    background: rgba(82,168,114,0.2);
    border-color: var(--green-deep, #2a6b4a);
    color: var(--green-mid, #62b682);
}
/* Round "?" button in the ranking header (right of the title). */
#rankingPanel .tool-header .rank-help-hdr-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-left: 0.5rem;
    padding: 0;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    background: rgba(42, 107, 74, 0.1);
    color: var(--green-deep, #2a6b4a);
    border: 1.5px solid rgba(42, 107, 74, 0.32);
    border-radius: 50%;
    cursor: pointer;
    /* Parent .tool-header disables pointer events on desktop — re-enable here. */
    pointer-events: auto;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
}
#rankingPanel .tool-header .rank-help-hdr-btn:hover {
    background: rgba(82, 168, 114, 0.25);
    border-color: var(--green-deep, #2a6b4a);
    color: var(--green-deep, #2a6b4a);
}

/* Pill-style "점수 집계방법" button inside the me-card. */
.rank-help-info-btn {
    padding: 0.42rem 0.85rem;
    background: rgba(82, 168, 114, 0.12);
    color: var(--green-deep, #2a6b4a);
    border: 1px solid rgba(42, 107, 74, 0.32);
    border-radius: 18px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s;
    margin-left: auto;
}
.rank-help-info-btn:hover {
    background: rgba(82, 168, 114, 0.25);
    border-color: var(--green-mid, #62b682);
}
.rank-help-info-btn i { font-size: 0.85rem; }

/* ---------- "내 누적" card above filters ---------- */
.rank-me-card {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    background: linear-gradient(135deg, rgba(82,168,114,0.16), rgba(42,107,74,0.08));
    border: 1px solid rgba(114,196,146,0.28);
    border-radius: 12px;
}
.rank-me-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em;
    color: rgba(26, 36, 33, 0.55);
    text-transform: uppercase;
    flex-shrink: 0;
}
/* 숫자와 단위(점/라운드)를 한 줄에 baseline 으로 정렬해서
   '내 누적' 라벨과도 시각적으로 같은 가로선 위에 놓이도록 한다. */
.rank-me-values {
    display: flex; align-items: center;
    gap: 0.3rem;
    flex: 1;
    color: var(--text-primary, #1a2421);
    flex-wrap: wrap;
    line-height: 1.1;
}
.rank-me-values .rank-me-num {
    font-size: 1.35rem; font-weight: 800;
    color: var(--text-primary, #1a2421);
    letter-spacing: 0.01em;
    font-variant-numeric: tabular-nums;
}
.rank-me-values .rank-me-sep {
    color: rgba(26, 36, 33, 0.3);
    font-size: 0.95rem;
    margin: 0 0.3rem;
}
.rank-me-values .rank-me-unit {
    font-size: 0.82rem; font-weight: 600;
    /* 연한 민트 배경 위에서도 읽히도록 충분히 어두운 회색톤 */
    color: rgba(26, 36, 33, 0.6);
    letter-spacing: 0.04em;
    margin-right: 0.2rem;
}

/* ---------- Filter pills (scope/mode/difficulty) ---------- */
.rank-filters {
    display: flex; flex-direction: column; gap: 0.6rem;
    margin-bottom: 1rem;
    padding: 0.7rem 0.9rem;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.05);
    border-radius: 11px;
}
.rank-filter-group {
    display: flex; align-items: center; gap: 0.6rem;
    flex-wrap: wrap;
}
.rank-filter-label {
    flex: 0 0 auto;
    width: 42px;
    font-size: 0.75rem; font-weight: 600;
    color: rgba(26, 36, 33, 0.5);
    letter-spacing: 0.05em;
}
.rank-pills {
    display: flex; gap: 0.35rem;
    flex-wrap: wrap;
    flex: 1; min-width: 0;
}
.rank-pill {
    padding: 0.38rem 0.78rem;
    font-family: inherit;
    font-size: 0.8rem; font-weight: 600;
    color: rgba(26, 36, 33, 0.62);
    background: rgba(26, 36, 33, 0.04);
    border: 1px solid rgba(26, 36, 33, 0.08);
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
}
.rank-pill:hover { background: rgba(82,168,114,0.12); color: var(--text-primary, #1a2421); border-color: rgba(114,196,146,0.3); }
.rank-pill.active {
    background: rgba(82,168,114,0.28);
    color: var(--green-mid, #62b682);
    border-color: var(--green-deep, #2a6b4a);
    box-shadow: 0 0 0 1px rgba(114,196,146,0.3);
}
/* 지옥 난이도 pill — 음정 트레이닝의 지옥 버튼과 동일 톤 */
.rank-pill[data-diff="hell"] {
    border-color: rgba(196, 64, 52, 0.28);
    background: rgba(196, 64, 52, 0.06);
    color: rgba(148, 42, 34, 0.72);
}
.rank-pill[data-diff="hell"]:hover {
    background: rgba(196, 64, 52, 0.12);
    color: rgba(148, 42, 34, 0.9);
    border-color: rgba(196, 64, 52, 0.45);
}
.rank-pill[data-diff="hell"].active {
    background: #c44034;
    color: #ffffff;
    border-color: #c44034;
    box-shadow: 0 0 0 1px rgba(196, 64, 52, 0.3);
}

/* ---------- Help popup ---------- */
.rank-help-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: none;
    align-items: center; justify-content: center;
    z-index: 10000;
    padding: 1rem;
    font-family: inherit;
}
.rank-help-overlay.open { display: flex; }
.rank-help-card {
    width: 100%; max-width: 460px;
    background: linear-gradient(160deg, #ffffff, #f5fbf7);
    border: 1px solid rgba(114,196,146,0.3);
    border-radius: 16px;
    padding: 1.6rem 1.6rem 1.3rem;
    color: var(--text-primary, #1a2421);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    position: relative;
    max-height: 90vh; overflow-y: auto;
}
.rank-help-card h3 {
    font-size: 1rem; font-weight: 700;
    color: var(--green-mid, #62b682);
    letter-spacing: 0.02em;
    margin: 1rem 0 0.55rem;
}
.rank-help-card h3:first-of-type { margin-top: 0.2rem; }
.rank-help-close {
    position: absolute; top: 0.7rem; right: 0.7rem;
    width: 32px; height: 32px;
    font-size: 1.2rem;
    background: transparent;
    border: none;
    color: rgba(26, 36, 33, 0.55);
    cursor: pointer; border-radius: 6px;
}
.rank-help-close:hover { background: rgba(26, 36, 33, 0.08); color: var(--text-primary, #1a2421); }
.rank-help-line {
    font-size: 0.88rem; color: rgba(26, 36, 33, 0.82);
    line-height: 1.6; margin: 0 0 0.6rem;
}
.rank-help-line b { color: var(--text-primary, #1a2421); font-weight: 700; }
.rank-help-formula {
    margin: 0.5rem 0 0.9rem;
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem; font-weight: 700;
    text-align: center;
    background: rgba(82,168,114,0.15);
    border: 1px dashed rgba(114,196,146,0.35);
    border-radius: 10px;
    color: var(--green-mid, #62b682);
    letter-spacing: 0.03em;
}
.rank-help-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.3rem 1.2rem;
    margin: 0.3rem 0 0.9rem;
    padding-left: 0.3rem;
    font-size: 0.86rem; color: rgba(26, 36, 33, 0.78);
}
.rank-help-grid div:nth-child(odd) { font-weight: 700; color: var(--text-primary, #1a2421); }
/* 지옥 난이도 행은 살짝 붉은 톤으로 경고 느낌 유지 */
.rank-help-grid .rank-help-hell-row { color: #b83a2e; font-weight: 700; }
.rank-help-list {
    margin: 0 0 0.5rem 1.1rem;
    padding: 0;
    font-size: 0.85rem; color: rgba(26, 36, 33, 0.78);
    line-height: 1.65;
}
.rank-help-list li { margin-bottom: 0.2rem; }
.rank-help-list b { color: var(--text-primary, #1a2421); font-weight: 700; }

.rank-loginCTA button {
    margin-top: 0.7rem;
    padding: 0.55rem 1.1rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 700;
    color: #ffffff;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    border: none; border-radius: 999px;
    cursor: pointer;
    transition: background 0.18s, transform 0.1s;
}
.rank-loginCTA button:hover {
    background: linear-gradient(135deg, var(--green-dark, #3a8a5c), var(--green-deep, #2a6b4a));
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
    color: var(--text-primary, #1a2421);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 1.4rem;
    overflow: hidden; flex-shrink: 0;
}
.mp-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mp-info { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.mp-nick { font-size: 1.2rem; font-weight: 800; color: var(--text-primary, #1a2421); }
.mp-since { font-size: 0.78rem; color: rgba(26, 36, 33, 0.55); }
.mp-edit-btn {
    margin-left: auto;
    padding: 0.5rem 0.85rem;
    font-family: inherit; font-size: 0.8rem; font-weight: 600;
    color: var(--green-mid, #62b682);
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
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.07);
    border-radius: 11px;
    text-align: center;
}
.mp-stat-value { font-size: 1.45rem; font-weight: 800; color: var(--text-primary, #1a2421); line-height: 1.1; }
.mp-stat-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; color: rgba(26, 36, 33, 0.5); margin-top: 0.25rem; text-transform: uppercase; }
.mp-section-title {
    font-size: 0.82rem; font-weight: 700; letter-spacing: 0.15em;
    color: rgba(26, 36, 33, 0.55);
    text-transform: uppercase;
    margin: 1.4rem 0 0.6rem;
}
/* ── 마이페이지 — 연습 시간 섹션 ─────────────────────────── */
.mp-practice-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem; margin-bottom: 0.9rem;
}
.mp-practice-stat {
    padding: 0.7rem 0.6rem; text-align: center;
    background: rgba(82, 168, 114, 0.08);
    border: 1px solid rgba(82, 168, 114, 0.18);
    border-radius: 11px;
}
.mp-practice-stat-value {
    font-size: 1.1rem; font-weight: 800;
    color: var(--green-deep, #2a6b4a); line-height: 1.1;
    font-variant-numeric: tabular-nums;
}
.mp-practice-stat-label {
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em;
    color: rgba(26, 36, 33, 0.55); margin-top: 0.2rem;
    text-transform: uppercase;
}
.mp-practice-sub-title {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    color: rgba(26, 36, 33, 0.5);
    text-transform: uppercase;
    margin: 0.9rem 0 0.45rem;
}
.mp-practice-empty {
    padding: 1rem; text-align: center;
    font-size: 0.85rem; color: rgba(26, 36, 33, 0.5);
    background: rgba(26, 36, 33, 0.03);
    border: 1px dashed rgba(26, 36, 33, 0.12);
    border-radius: 10px;
}
/* 도구별 가로 막대 */
.mp-tool-list {
    display: flex; flex-direction: column; gap: 0.3rem;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.07);
    border-radius: 11px;
    padding: 0.6rem 0.7rem;
}
.mp-tool-row {
    display: grid;
    grid-template-columns: 5.5rem 1fr auto;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
}
.mp-tool-name {
    color: rgba(26, 36, 33, 0.75);
    font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-tool-bar {
    height: 8px;
    background: rgba(26, 36, 33, 0.06);
    border-radius: 4px; overflow: hidden;
}
.mp-tool-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--green-mid, #62b682), var(--green-deep, #2a6b4a));
    border-radius: 4px;
    transition: width 0.25s ease;
}
.mp-tool-time {
    font-variant-numeric: tabular-nums;
    color: rgba(26, 36, 33, 0.65);
    font-weight: 600;
    min-width: 4rem; text-align: right;
}
/* 최근 7일 세로 막대 차트 */
.mp-day-chart {
    display: grid; grid-template-columns: repeat(7, 1fr);
    gap: 0.35rem;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.07);
    border-radius: 11px;
    padding: 0.6rem 0.6rem 0.5rem;
    margin-bottom: 0.4rem;
}
.mp-day-col {
    display: flex; flex-direction: column;
    align-items: center; gap: 0.2rem;
    min-width: 0;
}
.mp-day-bar {
    width: 100%; height: 60px;
    background: rgba(26, 36, 33, 0.05);
    border-radius: 4px;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
}
.mp-day-fill {
    width: 100%;
    background: linear-gradient(180deg, var(--green-mid, #62b682), var(--green-deep, #2a6b4a));
    border-radius: 4px;
    transition: height 0.25s ease;
    min-height: 0;
}
.mp-day-num {
    font-size: 0.78rem; font-weight: 700;
    color: rgba(26, 36, 33, 0.7);
    font-variant-numeric: tabular-nums;
    line-height: 1;
}
.mp-day-dow {
    font-size: 0.64rem; font-weight: 500;
    color: rgba(26, 36, 33, 0.45);
    line-height: 1;
}
.mp-session-list {
    display: flex; flex-direction: column;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.07);
    border-radius: 12px;
    overflow: hidden;
}
.mp-session-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.8rem;
    align-items: center;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(26, 36, 33, 0.05);
    font-size: 0.88rem;
}
.mp-session-row:last-child { border-bottom: none; }
.mp-session-mode { color: var(--text-primary, #1a2421); font-weight: 600; }
.mp-session-mode .mp-diff { font-weight: 500; color: rgba(26, 36, 33, 0.5); margin-left: 0.4rem; font-size: 0.78rem; }
.mp-session-score { color: var(--green-mid, #62b682); font-weight: 700; font-size: 0.95rem; }
.mp-session-meta { color: rgba(26, 36, 33, 0.5); font-size: 0.78rem; white-space: nowrap; }
.mp-danger {
    margin-top: 1.6rem;
    padding: 1rem;
    background: rgba(160, 50, 50, 0.08);
    border: 1px solid rgba(160, 50, 50, 0.25);
    border-radius: 11px;
}
.mp-danger-title { font-size: 0.82rem; font-weight: 700; color: #a03232; margin-bottom: 0.4rem; letter-spacing: 0.1em; text-transform: uppercase; }
.mp-danger-desc { font-size: 0.82rem; color: rgba(26, 36, 33, 0.6); line-height: 1.55; margin-bottom: 0.8rem; }
.mp-delete-btn {
    padding: 0.55rem 1rem;
    font-family: inherit; font-size: 0.82rem; font-weight: 600;
    color: #ff7a7a;
    background: transparent;
    border: 1px solid rgba(255, 122, 122, 0.35);
    border-radius: 7px;
    cursor: pointer;
}
.mp-purchase {
    margin-top: 1.4rem;
    padding: 1rem;
    background: rgba(26, 36, 33, 0.03);
    border: 1px solid rgba(26, 36, 33, 0.08);
    border-radius: 11px;
}
.mp-purchase-title { font-size: 0.82rem; font-weight: 700; color: var(--green-mid, #62b682); margin-bottom: 0.4rem; letter-spacing: 0.1em; text-transform: uppercase; }
.mp-purchase-desc { font-size: 0.82rem; color: rgba(26, 36, 33, 0.6); line-height: 1.55; margin-bottom: 0.8rem; }
.mp-purchase-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1rem;
    font-family: inherit; font-size: 0.82rem; font-weight: 600;
    color: #ffffff;
    background: var(--green-mid, #52a872);
    border: none;
    border-radius: 7px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s;
}
.mp-purchase-btn:hover { background: var(--green-dark, #3a8a5c); }
.mp-purchase-btn i { font-size: 0.78rem; }
.mp-delete-btn:hover { background: rgba(255, 122, 122, 0.1); }

.mp-encouragement {
    margin-top: 0.8rem;
    padding: 0.8rem 1rem;
    background: rgba(114, 196, 146, 0.1);
    border: 1px solid rgba(114, 196, 146, 0.25);
    border-radius: 10px;
    font-size: 0.85rem; color: var(--green-mid, #62b682);
    line-height: 1.5;
    text-align: center;
}

@media (max-width: 560px) {
    .rank-row { grid-template-columns: 34px 34px 1fr auto; gap: 0.5rem; padding: 0.6rem 0.7rem; font-size: 0.86rem; }
    .mp-stats-grid { gap: 0.4rem; }
    .mp-stat { padding: 0.7rem 0.4rem; }
    .mp-stat-value { font-size: 1.15rem; }
}

/* ===== DARK MODE ===== */
:root[data-theme="dark"] .et-session-pill {
    color: #b5e6c8;
    background: rgba(82, 168, 114, 0.18);
    border-color: rgba(180, 230, 200, 0.22);
}
:root[data-theme="dark"] .et-session-pill.warn {
    color: #ffd089;
    background: rgba(255, 190, 80, 0.18);
    border-color: rgba(255, 190, 80, 0.32);
}
/* Round-completion summary modal — was using a hardcoded white gradient */
:root[data-theme="dark"] .sum-overlay {
    background: rgba(0, 0, 0, 0.6);
}
:root[data-theme="dark"] .sum-card,
:root[data-theme="dark"] .nick-card {
    background: linear-gradient(160deg, #1d2a26, #15201c);
    color: #e8f0ec;
    border-color: rgba(180, 230, 200, 0.18);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
}
:root[data-theme="dark"] .sum-title {
    color: #b5e6c8;
}
:root[data-theme="dark"] .sum-mode {
    color: rgba(232, 240, 236, 0.7);
}
:root[data-theme="dark"] .sum-score {
    color: #e8f0ec;
}
:root[data-theme="dark"] .sum-score .sum-pts {
    color: #b5e6c8;
}
:root[data-theme="dark"] .sum-acc {
    color: rgba(232, 240, 236, 0.85);
}
:root[data-theme="dark"] .sum-acc strong {
    color: #fff;
}
:root[data-theme="dark"] .sum-note {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(232, 240, 236, 0.78);
    border-color: rgba(180, 230, 200, 0.16);
}
:root[data-theme="dark"] .sum-btn.ghost {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(232, 240, 236, 0.78);
    border-color: rgba(180, 230, 200, 0.22);
}
:root[data-theme="dark"] .sum-btn.ghost:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}
:root[data-theme="dark"] .sum-title,
:root[data-theme="dark"] .sum-acc strong,
:root[data-theme="dark"] .sum-score,
:root[data-theme="dark"] .nick-title,
:root[data-theme="dark"] .mp-title,
:root[data-theme="dark"] .rank-title {
    color: #e8f0ec;
}
:root[data-theme="dark"] .sum-mode,
:root[data-theme="dark"] .sum-acc,
:root[data-theme="dark"] .sum-stats,
:root[data-theme="dark"] .nick-sub {
    color: rgba(232, 240, 236, 0.7);
}
:root[data-theme="dark"] .sum-stats {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(232, 240, 236, 0.78);
}
:root[data-theme="dark"] .sum-btn.ghost {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(232, 240, 236, 0.78);
}
:root[data-theme="dark"] .sum-btn.ghost:hover {
    background: rgba(255, 255, 255, 0.1);
}
:root[data-theme="dark"] .nick-overlay {
    background: rgba(0, 0, 0, 0.6);
}
:root[data-theme="dark"] .nick-input {
    background: rgba(255, 255, 255, 0.04);
    color: #e8f0ec;
    border-color: rgba(180, 230, 200, 0.18);
}
:root[data-theme="dark"] .nick-input:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--green-mid, #52a872);
}
:root[data-theme="dark"] .nick-hint { color: rgba(232, 240, 236, 0.5); }
:root[data-theme="dark"] .nick-err { color: #f4a8a4; }

/* Ranking + mypage rows */
:root[data-theme="dark"] .rank-row,
:root[data-theme="dark"] .mp-stat,
:root[data-theme="dark"] .mp-recent-item {
    background: rgba(255, 255, 255, 0.03);
    color: #e8f0ec;
    border-color: rgba(180, 230, 200, 0.12);
}
:root[data-theme="dark"] .rank-row:hover,
:root[data-theme="dark"] .mp-recent-item:hover {
    background: rgba(82, 168, 114, 0.1);
}
:root[data-theme="dark"] .rank-row.me {
    background: rgba(82, 168, 114, 0.18);
    border-color: rgba(180, 230, 200, 0.24);
}
:root[data-theme="dark"] .mp-stat-label,
:root[data-theme="dark"] .mp-meta,
:root[data-theme="dark"] .rank-meta {
    color: rgba(232, 240, 236, 0.6);
}
:root[data-theme="dark"] .mp-stat-value {
    color: #e8f0ec;
}
/* 마이페이지 — 연습 시간 섹션 다크모드 */
:root[data-theme="dark"] .mp-practice-stat {
    background: rgba(82, 168, 114, 0.14);
    border-color: rgba(180, 230, 200, 0.2);
}
:root[data-theme="dark"] .mp-practice-stat-value { color: #b8e6c8; }
:root[data-theme="dark"] .mp-practice-stat-label,
:root[data-theme="dark"] .mp-practice-sub-title {
    color: rgba(232, 240, 236, 0.6);
}
:root[data-theme="dark"] .mp-tool-list,
:root[data-theme="dark"] .mp-day-chart,
:root[data-theme="dark"] .mp-practice-empty {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(180, 230, 200, 0.12);
    color: rgba(232, 240, 236, 0.78);
}
:root[data-theme="dark"] .mp-tool-name { color: rgba(232, 240, 236, 0.78); }
:root[data-theme="dark"] .mp-tool-time { color: rgba(232, 240, 236, 0.65); }
:root[data-theme="dark"] .mp-tool-bar,
:root[data-theme="dark"] .mp-day-bar { background: rgba(255, 255, 255, 0.06); }
:root[data-theme="dark"] .mp-day-num { color: rgba(232, 240, 236, 0.78); }
:root[data-theme="dark"] .mp-day-dow { color: rgba(232, 240, 236, 0.5); }
:root[data-theme="dark"] .rank-mode-tabs,
:root[data-theme="dark"] .mp-mode-tabs {
    background: rgba(255, 255, 255, 0.05);
}
:root[data-theme="dark"] .rank-mode-tab,
:root[data-theme="dark"] .mp-mode-tab {
    color: rgba(232, 240, 236, 0.65);
}
:root[data-theme="dark"] .rank-mode-tab:hover,
:root[data-theme="dark"] .mp-mode-tab:hover {
    background: rgba(82, 168, 114, 0.12);
    color: #d8e8df;
}
:root[data-theme="dark"] .rank-mode-tab.active,
:root[data-theme="dark"] .mp-mode-tab.active {
    background: rgba(82, 168, 114, 0.22);
    color: #fff;
}
:root[data-theme="dark"] .rank-loginCTA {
    background: rgba(255, 255, 255, 0.04);
    color: #e8f0ec;
    border-color: rgba(180, 230, 200, 0.18);
}

/* Ranking filter UI (period / mode / difficulty pills) */
:root[data-theme="dark"] .rank-filters {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(180, 230, 200, 0.12);
}
:root[data-theme="dark"] .rank-filter-label {
    color: rgba(232, 240, 236, 0.6);
}
:root[data-theme="dark"] .rank-pill {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(232, 240, 236, 0.78);
    border-color: rgba(180, 230, 200, 0.18);
}
:root[data-theme="dark"] .rank-pill:hover {
    background: rgba(82, 168, 114, 0.18);
    color: #d8e8df;
    border-color: rgba(180, 230, 200, 0.4);
}
:root[data-theme="dark"] .rank-pill.active {
    background: rgba(82, 168, 114, 0.28);
    color: #d8e8df;
    border-color: rgba(180, 230, 200, 0.55);
    box-shadow: 0 0 0 1px rgba(180, 230, 200, 0.25);
}
/* 지옥 난이도 pill — 다크에서도 또렷한 빨강 */
:root[data-theme="dark"] .rank-pill[data-diff="hell"] {
    background: rgba(196, 64, 52, 0.14);
    color: #ff9e94;
    border-color: rgba(244, 168, 164, 0.4);
}
:root[data-theme="dark"] .rank-pill[data-diff="hell"]:hover {
    background: rgba(196, 64, 52, 0.22);
    color: #ffb8b0;
    border-color: rgba(244, 168, 164, 0.6);
}
:root[data-theme="dark"] .rank-pill[data-diff="hell"].active {
    background: rgba(196, 64, 52, 0.32);
    color: #ffd0c8;
    border-color: rgba(244, 168, 164, 0.7);
}
/* Empty state + meta row (refresh / scope label) */
:root[data-theme="dark"] .rank-empty {
    color: rgba(232, 240, 236, 0.55);
}
:root[data-theme="dark"] .rank-meta,
:root[data-theme="dark"] #rankScopeLabel,
:root[data-theme="dark"] #rankRefresh {
    color: rgba(232, 240, 236, 0.78);
}

/* "내 누적 N점 · M 라운드" banner card */
:root[data-theme="dark"] .rank-me-card {
    background: linear-gradient(135deg, rgba(82, 168, 114, 0.18), rgba(180, 230, 200, 0.06));
    border-color: rgba(180, 230, 200, 0.25);
}
:root[data-theme="dark"] .rank-me-label {
    color: rgba(232, 240, 236, 0.65);
}
:root[data-theme="dark"] .rank-me-values,
:root[data-theme="dark"] .rank-me-values .rank-me-num {
    color: #e8f0ec;
}
:root[data-theme="dark"] .rank-me-values .rank-me-sep {
    color: rgba(232, 240, 236, 0.35);
}
:root[data-theme="dark"] .rank-me-values .rank-me-unit {
    color: rgba(232, 240, 236, 0.7);
}
/* Period navigator — dark variant */
:root[data-theme="dark"] .rank-period-arrow {
    background: rgba(82, 168, 114, 0.18);
    color: #b5e6c8;
    border-color: rgba(180, 230, 200, 0.32);
}
:root[data-theme="dark"] .rank-period-arrow:hover:not(:disabled) {
    background: rgba(82, 168, 114, 0.32);
    color: #fff;
    border-color: rgba(180, 230, 200, 0.55);
}
:root[data-theme="dark"] .rank-period-label {
    background: rgba(82, 168, 114, 0.18);
    color: #b5e6c8;
    border-color: rgba(180, 230, 200, 0.4);
}
:root[data-theme="dark"] .rank-period-label:hover {
    background: rgba(82, 168, 114, 0.32);
    color: #fff;
    border-color: rgba(180, 230, 200, 0.6);
}
:root[data-theme="dark"] .rank-period-menu {
    background: #1d2a26;
    border-color: rgba(180, 230, 200, 0.25);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}
:root[data-theme="dark"] .rank-period-menu-item {
    color: rgba(232, 240, 236, 0.85);
}
:root[data-theme="dark"] .rank-period-menu-item:hover {
    background: rgba(82, 168, 114, 0.22);
    color: #fff;
}
:root[data-theme="dark"] .rank-period-menu-item.is-active {
    background: rgba(82, 168, 114, 0.32);
    color: #fff;
}

/* 랭킹 행의 점수 (1,030점, 800점 ...) — 다크 배경의 초록 계열과 톤이 비슷해
   잘 안 띄어서 흰색으로 또렷하게. 정답률(%) 은 보조 정보이므로 회색 유지. */
:root[data-theme="dark"] .rank-score,
:root[data-theme="dark"] .rank-score .rank-score-pts {
    color: #ffffff;
}

/* 랭킹 행의 순위 숫자 (1, 2, 3 ...) */
:root[data-theme="dark"] .rank-pos {
    color: rgba(232, 240, 236, 0.85);
}
:root[data-theme="dark"] .rank-pos.top1 {
    color: #f5d36b;
    text-shadow: 0 0 14px rgba(255, 220, 130, 0.6);
}
:root[data-theme="dark"] .rank-pos.top2 {
    color: #b6c8d2;
}
:root[data-theme="dark"] .rank-pos.top3 {
    color: #f5b787;
}

/* "내 순위" self-card (50등 밖 또는 기록 없음 안내) */
:root[data-theme="dark"] .rank-self-card {
    background: rgba(82, 168, 114, 0.18);
    border-color: rgba(180, 230, 200, 0.32);
}
:root[data-theme="dark"] .rank-self-card .rank-self-label {
    color: rgba(232, 240, 236, 0.7);
}
:root[data-theme="dark"] .rank-self-card .rank-self-rank {
    color: #b5e6c8;
}
:root[data-theme="dark"] .rank-self-card .rank-self-empty {
    color: rgba(232, 240, 236, 0.78);
}

/* Mypage — header, profile, section titles + recent rounds list */
:root[data-theme="dark"] .mp-nick {
    color: #e8f0ec;
}
:root[data-theme="dark"] .mp-since {
    color: rgba(232, 240, 236, 0.65);
}
:root[data-theme="dark"] .mp-edit-btn {
    background: rgba(82, 168, 114, 0.18);
    color: #b5e6c8;
    border-color: rgba(180, 230, 200, 0.32);
}
:root[data-theme="dark"] .mp-edit-btn:hover {
    background: rgba(82, 168, 114, 0.32);
    color: #fff;
    border-color: rgba(180, 230, 200, 0.5);
}
:root[data-theme="dark"] .mp-section-title {
    color: rgba(232, 240, 236, 0.62);
}
:root[data-theme="dark"] .mp-stat-value {
    color: #e8f0ec;
}
:root[data-theme="dark"] .mp-stat-label {
    color: rgba(232, 240, 236, 0.6);
}
:root[data-theme="dark"] .mp-session-list {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(180, 230, 200, 0.14);
}
:root[data-theme="dark"] .mp-session-row {
    border-bottom-color: rgba(180, 230, 200, 0.1);
}
:root[data-theme="dark"] .mp-session-mode {
    color: #e8f0ec;
}
:root[data-theme="dark"] .mp-session-mode .mp-diff {
    color: rgba(232, 240, 236, 0.65);
}
:root[data-theme="dark"] .mp-session-score {
    color: #b5e6c8;
}
:root[data-theme="dark"] .mp-session-meta {
    color: rgba(232, 240, 236, 0.55);
}
:root[data-theme="dark"] .mp-danger {
    background: rgba(196, 64, 52, 0.12);
    border-color: rgba(244, 168, 164, 0.32);
}
:root[data-theme="dark"] .mp-danger-desc {
    color: rgba(232, 240, 236, 0.7);
}
:root[data-theme="dark"] .mp-purchase {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(180, 230, 200, 0.14);
}
:root[data-theme="dark"] .mp-purchase-desc {
    color: rgba(232, 240, 236, 0.7);
}
:root[data-theme="dark"] .mp-encouragement {
    color: rgba(232, 240, 236, 0.7);
}

/* "점수 집계방법" pill */
:root[data-theme="dark"] .rank-help-info-btn {
    background: rgba(180, 230, 200, 0.12);
    color: #b5e6c8;
    border-color: rgba(180, 230, 200, 0.32);
}
:root[data-theme="dark"] .rank-help-info-btn:hover {
    background: rgba(180, 230, 200, 0.22);
    border-color: rgba(180, 230, 200, 0.5);
}

/* Score-help modal — was hardcoded to a near-white card so it stayed
   light even in dark mode. Override card + every text element. */
:root[data-theme="dark"] .rank-help-overlay {
    background: rgba(0, 0, 0, 0.6);
}
:root[data-theme="dark"] .rank-help-card {
    background: linear-gradient(160deg, #1d2a26, #15201c);
    border-color: rgba(180, 230, 200, 0.18);
    color: #e8f0ec;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
}
:root[data-theme="dark"] .rank-help-card h3 {
    color: #b5e6c8;
}
:root[data-theme="dark"] .rank-help-close {
    color: rgba(232, 240, 236, 0.55);
}
:root[data-theme="dark"] .rank-help-close:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
}
:root[data-theme="dark"] .rank-help-line {
    color: rgba(232, 240, 236, 0.85);
}
:root[data-theme="dark"] .rank-help-line b {
    color: #fff;
}
:root[data-theme="dark"] .rank-help-formula {
    background: rgba(82, 168, 114, 0.18);
    border-color: rgba(180, 230, 200, 0.4);
    color: #b5e6c8;
}
:root[data-theme="dark"] .rank-help-grid {
    color: rgba(232, 240, 236, 0.82);
}
:root[data-theme="dark"] .rank-help-grid div:nth-child(odd) {
    color: #fff;
}
:root[data-theme="dark"] .rank-help-grid .rank-help-hell-row {
    color: #ff9e94;
}
:root[data-theme="dark"] .rank-help-list {
    color: rgba(232, 240, 236, 0.82);
}
:root[data-theme="dark"] .rank-help-list b {
    color: #fff;
}
`;

    const MODE_LABELS = {
        ear_single: '음 맞추기',
        ear_compare: '두 음 비교',
        ear_chord: '코드 맞추기'
    };
    const DIFF_LABELS = { easy: '쉬움', medium: '보통', hard: '어려움', hell: '지옥' };
    const DIFF_COEF = { easy: 1.0, medium: 1.5, hard: 2.0, hell: 3.0 };
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
            session_must_be_10: '10문제 단위가 아닌 라운드이에요.',
            rate_limited: '너무 빠르게 라운드를 제출했어요. 1분 후 다시 시도해주세요.',
            invalid_mode: '잘못된 모드에요.',
            invalid_difficulty: '잘못된 난이도에요.'
        };
        for (const k in map) if (msg.indexOf(k) !== -1) return map[k];
        return msg;
    }

    // Inline progress pill — updates the STATIC pill in each mode's .et-reset-col
    // (HTML ships with a "라운드 0/10" placeholder pill so the row layout is
    // stable whether or not a session is in flight).
    function updatePill() {
        const pillMap = {
            'ear_compare': 'etSessionPill_interval',
            'ear_single':  'etSessionPill_pitch',
            'ear_chord':   'etSessionPill_chord'
        };
        Object.keys(pillMap).forEach((m) => {
            const el = document.getElementById(pillMap[m]);
            if (!el) return;
            const isActive = tracker.mode === m;
            const count = isActive ? tracker.answers.length : 0;
            el.innerHTML = `<span class="dot"></span><span>라운드 ${count}/${SESSION_SIZE}</span>`;
            el.classList.toggle('idle', !isActive);
        });
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
        <div class="sum-title">라운드 완료</div>
        <div class="sum-mode" id="sumMode"></div>
        <div class="sum-score"><span id="sumScore">0</span><span class="sum-pts">PTS</span></div>
        <div class="sum-acc" id="sumAcc"></div>
        <div class="sum-note" id="sumNote"></div>
        <div class="sum-actions">
            <button class="sum-btn ghost" id="sumCloseBtn">닫기</button>
            <button class="sum-btn primary" id="sumContinueBtn">다음 라운드</button>
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
            continueBtn.textContent = '다음 라운드';
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
    let _rankScope = 'weekly';   // 기본: 이번 주
    let _rankMode = 'all';
    let _rankDiff = 'all';
    // Offset relative to "now" — 0 이면 현재 기간, -1 이면 한 단위 이전 (지난 주, 어제, 지난 달).
    // scope 가 바뀌거나 랭킹 탭 다시 진입 시 0 으로 리셋.
    let _rankOffset = 0;
    // Anchor 캘린더 dropdown 열림 상태
    let _rankAnchorMenuOpen = false;

    // ---- Anchor utilities ---------------------------------------------------
    // Site went live 2026-04 — 그 이전 기간은 의미 없는 빈 데이터라 navigator
    // 에서 노출 자체를 막는다. (오프셋이 이 날짜 미만으로 가면 prev 비활성)
    const SITE_START_ISO = '2026-04-01';
    // Asia/Seoul 기준 "오늘" 의 ISO 날짜 (YYYY-MM-DD)
    function todayISO() {
        const now = new Date();
        // 사용자 PC 타임존이 KST 가 아닐 수도 있어서 UTC+9 로 명시 보정
        const kstMs = now.getTime() + (now.getTimezoneOffset() + 9 * 60) * 60000;
        const d = new Date(kstMs);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }
    function parseISO(s) {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    }
    function fmtISO(d) {
        return d.getUTCFullYear() + '-' +
               String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
               String(d.getUTCDate()).padStart(2, '0');
    }
    // scope+offset → 그 기간 안에 들어가는 anchor date 한 개 반환 (SQL 함수가 그걸 보고 기간 결정)
    function computeAnchorDate(scope, offset) {
        const today = parseISO(todayISO());
        if (scope === 'daily') {
            today.setUTCDate(today.getUTCDate() + offset);
            return fmtISO(today);
        }
        if (scope === 'weekly') {
            // 이번 주 월요일을 기준으로 offset 주 만큼 이동
            const dow = today.getUTCDay() === 0 ? 7 : today.getUTCDay(); // 1..7 (월=1, 일=7)
            today.setUTCDate(today.getUTCDate() - (dow - 1) + offset * 7);
            return fmtISO(today);
        }
        if (scope === 'monthly') {
            // 이번 달 1일을 기준으로 offset 달 만큼 이동
            const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + offset, 1));
            return fmtISO(d);
        }
        return null;  // total 은 anchor 무시
    }
    // 주어진 (scope, offset) 의 기간 시작점이 사이트 오픈일(2026-04-01) 이후인지.
    // false 면 "사이트 오픈 전" 이라 의미 없는 데이터라서 노출 안 함.
    function isOffsetReachable(scope, offset) {
        if (scope === 'total') return true;
        const anchor = computeAnchorDate(scope, offset);
        if (!anchor) return true;
        let periodStartISO;
        if (scope === 'daily') {
            // daily: anchor 자체가 시작일
            periodStartISO = anchor;
        } else if (scope === 'weekly') {
            // weekly: computeAnchorDate('weekly', ...) 이미 그 주 월요일을 반환
            periodStartISO = anchor;
        } else if (scope === 'monthly') {
            // monthly: computeAnchorDate('monthly', ...) 이미 그 달 1일을 반환
            periodStartISO = anchor;
        } else {
            return true;
        }
        return periodStartISO >= SITE_START_ISO;
    }
    // 표시용 라벨 ("4/21 ~ 4/27 (이번 주)" 같은)
    function formatPeriodLabel(scope, offset) {
        if (scope === 'total') return '전체 누적';
        if (scope === 'daily') {
            const t = parseISO(computeAnchorDate('daily', offset));
            const md = (t.getUTCMonth() + 1) + '/' + t.getUTCDate();
            // 오늘은 태그 없이 날짜만, 어제/N일 전은 태그 유지
            if (offset === 0) return md;
            const tag = offset === -1 ? '어제' : (-offset) + '일 전';
            return md + ' (' + tag + ')';
        }
        if (scope === 'weekly') {
            const start = parseISO(computeAnchorDate('weekly', offset));
            const end = new Date(start); end.setUTCDate(end.getUTCDate() + 6);
            const sMd = (start.getUTCMonth() + 1) + '/' + start.getUTCDate();
            const eMd = (end.getUTCMonth() + 1) + '/' + end.getUTCDate();
            // 그 주 시작일(월) 기준 월의 N주차 (예: 4/27 → 4주차)
            const weekOfMonth = Math.ceil(start.getUTCDate() / 7);
            return weekOfMonth + '주차 (' + sMd + ' ~ ' + eMd + ')';
        }
        if (scope === 'monthly') {
            const t = parseISO(computeAnchorDate('monthly', offset));
            // 26 / 4월 형식 — 연도 끝 두 자리 + 월
            const yearShort = String(t.getUTCFullYear()).slice(-2);
            return yearShort + ' / ' + (t.getUTCMonth() + 1) + '월';
        }
        return '';
    }

    function renderRankingsShell() {
        const panel = document.getElementById('rankingPanel');
        if (!panel) return;
        panel.innerHTML = `
<div class="tool-header">
    <div class="tool-header-icon"><i class="fas fa-trophy"></i></div>
    <h1>랭킹</h1>
    <button class="rank-help-open rank-help-hdr-btn" type="button" aria-label="점수 집계 방법" title="점수 집계 방법">?</button>
</div>
<div class="tool-body">
    <div class="rank-me-card" id="rankMeCard">
        <div class="rank-me-label">내 누적</div>
        <div class="rank-me-values">
            <span class="rank-me-num" id="rankMyGrand">0</span>
            <span class="rank-me-unit">점</span>
            <span class="rank-me-sep">·</span>
            <span class="rank-me-num" id="rankMyRounds">0</span>
            <span class="rank-me-unit">라운드</span>
        </div>
        <button class="rank-help-open rank-help-info-btn" type="button" title="점수 집계 방법">
            <i class="fas fa-circle-info"></i> 점수 집계방법
        </button>
    </div>
    <div class="rank-filters">
        <div class="rank-filter-group rank-filter-group-period">
            <span class="rank-filter-label">기간</span>
            <div class="rank-period-content">
                <div class="rank-pills">
                    <button class="rank-pill" data-scope="daily">오늘</button>
                    <button class="rank-pill active" data-scope="weekly">주간</button>
                    <button class="rank-pill" data-scope="monthly">월간</button>
                    <button class="rank-pill" data-scope="total">전체</button>
                </div>
                <div class="rank-period-nav" id="rankPeriodNav">
                    <button class="rank-period-arrow" id="rankPeriodPrev" type="button" aria-label="이전 기간">‹</button>
                    <button class="rank-period-label" id="rankPeriodLabel" type="button" aria-label="기간 빠르게 선택">
                        <span id="rankPeriodLabelText">주간</span>
                        <i class="fas fa-caret-down"></i>
                    </button>
                    <button class="rank-period-arrow" id="rankPeriodNext" type="button" aria-label="다음 기간">›</button>
                    <div class="rank-period-menu" id="rankPeriodMenu" hidden></div>
                </div>
            </div>
        </div>
        <div class="rank-filter-group">
            <span class="rank-filter-label">모드</span>
            <div class="rank-pills">
                <button class="rank-pill active" data-mode="all">전체</button>
                <button class="rank-pill" data-mode="ear_single">음 맞추기</button>
                <button class="rank-pill" data-mode="ear_compare">두 음 비교</button>
                <button class="rank-pill" data-mode="ear_chord">코드 맞추기</button>
            </div>
        </div>
        <div class="rank-filter-group">
            <span class="rank-filter-label">난이도</span>
            <div class="rank-pills">
                <button class="rank-pill active" data-diff="all">전체</button>
                <button class="rank-pill" data-diff="easy">쉬움</button>
                <button class="rank-pill" data-diff="medium">보통</button>
                <button class="rank-pill" data-diff="hard">어려움</button>
                <button class="rank-pill" data-diff="hell">지옥</button>
            </div>
        </div>
    </div>
    <div class="rank-meta">
        <span id="rankScopeLabel">주간 점수</span>
        <span id="rankRefresh" style="cursor:pointer;">↻ 새로고침</span>
    </div>
    <div id="rankContent"></div>
</div>

<!-- Scoring help popup -->
<div class="rank-help-overlay" id="rankHelpOverlay">
    <div class="rank-help-card">
        <button class="rank-help-close" aria-label="닫기">&times;</button>
        <h3>점수는 어떻게 계산되나요?</h3>
        <p class="rank-help-line">
            한 <b>라운드</b>는 <b>10문제</b>로 이루어집니다. 라운드가 끝나면 아래 공식으로 점수가 매겨져요.
        </p>
        <div class="rank-help-formula">
            점수 = 정답 수 × 10 × 난이도 계수
        </div>
        <div class="rank-help-grid">
            <div>쉬움</div><div>× 1.0</div>
            <div>보통</div><div>× 1.5</div>
            <div>어려움</div><div>× 2.0</div>
            <div class="rank-help-hell-row">지옥</div><div class="rank-help-hell-row">× 3.0</div>
        </div>
        <p class="rank-help-line">
            예: <b>지옥</b>에서 10문제 모두 맞히면 <b>10 × 10 × 3.0 = 300점</b>
        </p>
        <h3>점수 아래 % 표시는?</h3>
        <p class="rank-help-line">
            랭킹 행에서 점수 아래 작게 표시되는 퍼센트는 <b>정답률</b>입니다.
            지금까지 푼 모든 문제 중 맞춘 비율이에요.
        </p>
        <h3>주의사항</h3>
        <ul class="rank-help-list">
            <li>응답 시간 0.3초 미만인 문제는 찍기로 간주되어 점수에서 제외됩니다.</li>
            <li>1분 내에 5회 이상 라운드를 제출하면 일시적으로 저장이 거부됩니다.</li>
        </ul>
    </div>
</div>
`;
        function reload() { loadRankings(); }
        function syncScopeUI() {
            const navEl = panel.querySelector('#rankPeriodNav');
            const labelEl = panel.querySelector('#rankPeriodLabelText');
            const prevBtn = panel.querySelector('#rankPeriodPrev');
            const nextBtn = panel.querySelector('#rankPeriodNext');
            // total 은 기간 의미 없으니 navigator 숨김
            if (navEl) navEl.style.display = (_rankScope === 'total') ? 'none' : '';
            if (labelEl) labelEl.textContent = formatPeriodLabel(_rankScope, _rankOffset);
            // 미래는 막음 (offset 이 0 보다 커지지 않도록)
            if (nextBtn) nextBtn.disabled = (_rankOffset >= 0);
            // 사이트 오픈일 이전이면 prev 도 막음
            if (prevBtn) prevBtn.disabled = !isOffsetReachable(_rankScope, _rankOffset - 1);
        }
        function applyScope(newScope) {
            if (_rankScope === newScope) return;
            _rankScope = newScope;
            _rankOffset = 0;
            // 위쪽 필터 pill 도 같이 동기화 (시각적 일관성)
            panel.querySelectorAll('.rank-pill[data-scope]').forEach(function(p) {
                p.classList.toggle('active', p.getAttribute('data-scope') === newScope);
            });
            const label = {
                daily: '오늘 획득한 점수',
                weekly: '주간 점수',
                monthly: '월간 점수',
                total: '누적 점수'
            }[_rankScope];
            const lblEl = panel.querySelector('#rankScopeLabel');
            if (lblEl) lblEl.textContent = label;
            syncScopeUI();
            closePeriodMenu();
            reload();
        }
        panel.querySelectorAll('.rank-pill[data-scope]').forEach((t) => {
            t.addEventListener('click', () => {
                _rankScope = t.getAttribute('data-scope');
                _rankOffset = 0;   // scope 변경 시 현재 기간으로 리셋
                panel.querySelectorAll('.rank-pill[data-scope]').forEach((x) => x.classList.toggle('active', x === t));
                const label = {
                    daily: '오늘 획득한 점수',
                    weekly: '주간 점수',
                    monthly: '월간 점수',
                    total: '누적 점수'
                }[_rankScope];
                panel.querySelector('#rankScopeLabel').textContent = label;
                syncScopeUI();
                closePeriodMenu();
                reload();
            });
        });
        // ---- Period navigator (← 라벨 → 화살표 + 라벨 클릭 시 빠른 점프 메뉴) ----
        function buildPeriodMenuItems() {
            const menu = panel.querySelector('#rankPeriodMenu');
            if (!menu) return;
            const MAX_ITEMS = 12;   // 최근 12 단위 한도
            let html = '';
            // 사이트 오픈일 이후에 들어오는 offset 만 노출. 0 부터 -i 로 내려가며
            // 도달 가능한 항목만 추가.
            for (let i = 0; i < MAX_ITEMS; i++) {
                const offset = -i;
                if (!isOffsetReachable(_rankScope, offset)) break;
                const label = formatPeriodLabel(_rankScope, offset);
                const isActive = offset === _rankOffset ? ' is-active' : '';
                html += '<button type="button" class="rank-period-menu-item' + isActive +
                        '" data-offset="' + offset + '">' + label + '</button>';
            }
            menu.innerHTML = html;
            menu.querySelectorAll('button[data-offset]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    _rankOffset = parseInt(btn.getAttribute('data-offset'), 10) || 0;
                    closePeriodMenu();
                    syncScopeUI();
                    reload();
                });
            });
        }
        function openPeriodMenu() {
            const menu = panel.querySelector('#rankPeriodMenu');
            if (!menu || _rankScope === 'total') return;
            buildPeriodMenuItems();
            menu.hidden = false;
            _rankAnchorMenuOpen = true;
        }
        function closePeriodMenu() {
            const menu = panel.querySelector('#rankPeriodMenu');
            if (menu) menu.hidden = true;
            _rankAnchorMenuOpen = false;
        }
        const labelBtn = panel.querySelector('#rankPeriodLabel');
        if (labelBtn) {
            labelBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (_rankAnchorMenuOpen) closePeriodMenu();
                else openPeriodMenu();
            });
        }
        const prevBtn = panel.querySelector('#rankPeriodPrev');
        if (prevBtn) prevBtn.addEventListener('click', function() {
            // 사이트 오픈 이전 데이터는 의미 없음 — 방어 가드
            if (!isOffsetReachable(_rankScope, _rankOffset - 1)) return;
            _rankOffset -= 1;
            syncScopeUI();
            reload();
        });
        const nextBtn = panel.querySelector('#rankPeriodNext');
        if (nextBtn) nextBtn.addEventListener('click', function() {
            if (_rankOffset >= 0) return;   // 현재보다 미래로 못 감
            _rankOffset += 1;
            syncScopeUI();
            reload();
        });
        // 다른 곳 클릭 시 메뉴 닫기
        document.addEventListener('click', function(e) {
            if (!_rankAnchorMenuOpen) return;
            if (e.target.closest && e.target.closest('#rankPeriodNav')) return;
            closePeriodMenu();
        });
        panel.querySelectorAll('.rank-pill[data-mode]').forEach((t) => {
            t.addEventListener('click', () => {
                _rankMode = t.getAttribute('data-mode');
                panel.querySelectorAll('.rank-pill[data-mode]').forEach((x) => x.classList.toggle('active', x === t));
                reload();
            });
        });
        panel.querySelectorAll('.rank-pill[data-diff]').forEach((t) => {
            t.addEventListener('click', () => {
                _rankDiff = t.getAttribute('data-diff');
                panel.querySelectorAll('.rank-pill[data-diff]').forEach((x) => x.classList.toggle('active', x === t));
                reload();
            });
        });
        panel.querySelector('#rankRefresh').addEventListener('click', reload);
        // 초기 라벨 / nav 상태 동기화
        syncScopeUI();

        // Help popup wiring — supports any button with .rank-help-open
        // (header ? icon + "점수 집계방법" text button) plus legacy .rank-help-btn.
        const helpOverlay = panel.querySelector('#rankHelpOverlay');
        const helpClose = panel.querySelector('.rank-help-close');
        const helpBtns = panel.querySelectorAll('.rank-help-open, .rank-help-btn');
        if (helpBtns.length && helpOverlay) {
            helpBtns.forEach((b) => b.addEventListener('click', () => helpOverlay.classList.add('open')));
            helpClose && helpClose.addEventListener('click', () => helpOverlay.classList.remove('open'));
            helpOverlay.addEventListener('click', (e) => {
                if (e.target === helpOverlay) helpOverlay.classList.remove('open');
            });
        }
    }

    async function loadRankings() {
        const content = document.getElementById('rankContent');
        if (!content) return;
        content.innerHTML = '<div class="rank-empty">불러오는 중…</div>';
        const client = sb();
        if (!client) { content.innerHTML = '<div class="rank-empty">준비 중…</div>'; return; }
        const anchor = (_rankScope === 'total')
            ? null
            : computeAnchorDate(_rankScope, _rankOffset);
        const { data, error } = await client.rpc('get_ranking', {
            p_scope: _rankScope,
            p_mode: _rankMode,
            p_difficulty: _rankDiff,
            p_anchor_date: anchor
        });
        if (error) {
            content.innerHTML = '<div class="rank-empty">랭킹을 불러올 수 없어요.</div>';
            return;
        }
        const top = (data && data.top) || [];
        const myRank = data && data.my_rank;
        const myScore = data && data.my_score;
        const user = currentUser();

        // Update "내 누적" header values
        const grandTotalEl = document.getElementById('rankMyGrand');
        const grandRoundsEl = document.getElementById('rankMyRounds');
        if (grandTotalEl) grandTotalEl.textContent = ((data && data.my_grand_total) || 0).toLocaleString();
        if (grandRoundsEl) grandRoundsEl.textContent = ((data && data.my_grand_rounds) || 0).toLocaleString();
        const meCard = document.getElementById('rankMeCard');
        if (meCard) meCard.style.display = user ? '' : 'none';

        if (top.length === 0) {
            const emptyLoginCTA = !user ? `
<div class="rank-loginCTA">
    로그인하면 내 기록도 랭킹에 올라가요.
    <br><button type="button" data-open-login="1">로그인</button>
</div>` : '';
            content.innerHTML = `<div class="rank-empty">이 조건에는 아직 기록이 없어요.<br>첫 번째 기록의 주인공이 되어보세요.</div>${emptyLoginCTA}`;
            return;
        }

        const rows = top.map(r => rankRowHtml(r, user)).join('');
        const myAccuracy = data && data.my_accuracy;
        const myAccuracyStr = (myAccuracy === null || myAccuracy === undefined)
            ? '-'
            : (Math.round(myAccuracy * 10) / 10) + '%';
        let selfCardHtml = '';
        if (user && (!myRank || myRank > 50)) {
            if (myRank) {
                selfCardHtml = `
<div class="rank-self-card">
    <div class="rank-self-label">내 순위</div>
    <div class="rank-self-rank">${myRank}위</div>
    <div class="rank-score">
        <span class="rank-score-pts">${myScore || 0}점</span>
        <span class="rank-score-acc">${myAccuracyStr}</span>
    </div>
</div>`;
            } else {
                selfCardHtml = `
<div class="rank-self-card">
    <div class="rank-self-label">내 순위</div>
    <div class="rank-self-empty">아직 기록 없음</div>
    <div class="rank-score">
        <span class="rank-score-pts">0점</span>
    </div>
</div>`;
            }
        } else if (!user) {
            selfCardHtml = `
<div class="rank-loginCTA">
    로그인하면 내 기록도 랭킹에 올라가요.
    <br><button type="button" data-open-login="1">로그인</button>
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
        // 정답률 — null/undefined 인 경우 '-' 로 표시
        const acc = (r.accuracy === null || r.accuracy === undefined)
            ? '-'
            : (Math.round(r.accuracy * 10) / 10) + '%';
        return `
<div class="rank-row ${isSelf ? 'self' : ''}">
    <div class="rank-pos ${rankClass}">${r.rank}</div>
    <div class="rank-ava">${avatar}</div>
    <div class="rank-name">${escapeHtml(r.nickname || '익명')}<span class="rank-session-count">· ${r.round_count || r.session_count}라운드</span></div>
    <div class="rank-score">
        <span class="rank-score-pts">${r.total_score.toLocaleString()}점</span>
        <span class="rank-score-acc">${acc}</span>
    </div>
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
    <br><button type="button" data-open-login="1">로그인</button>
</div>`;
            return;
        }
        body.innerHTML = '<div class="rank-empty">불러오는 중…</div>';
        const client = sb();
        if (!client) { body.innerHTML = '<div class="rank-empty">준비 중…</div>'; return; }
        // 두 RPC 동시 호출 — 기존 마이페이지 통계 + 새 연습시간 통계
        const [statsRes, practiceRes] = await Promise.all([
            client.rpc('get_my_stats'),
            client.rpc('get_practice_stats').catch(function() { return { data: null, error: { message: 'rpc_missing' } }; }),
        ]);
        if (statsRes.error) {
            body.innerHTML = '<div class="rank-empty">정보를 불러올 수 없어요.</div>';
            return;
        }
        const data = statsRes.data;
        const practice = (practiceRes && practiceRes.data) || null;
        const p = data.profile || {};
        const s = data.stats || {};
        const recent = data.recent || [];
        const initial = (p.nickname || '?').charAt(0).toUpperCase();
        const avatar = p.profile_image_url
            ? `<img src="${escapeAttr(p.profile_image_url)}" alt="">`
            : escapeHtml(initial);

        const joinedDate = p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

        const recentHtml = recent.length === 0
            ? '<div class="rank-empty">아직 기록이 없어요. 첫 라운드를 시작해보세요.</div>'
            : '<div class="mp-session-list">' + recent.map(r => {
                const d = new Date(r.created_at);
                const when = d.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
<div class="mp-session-row">
    <div class="mp-session-mode">${MODE_LABELS[r.mode] || r.mode}<span class="mp-diff">${DIFF_LABELS[r.difficulty] || r.difficulty}</span></div>
    <div class="mp-session-score">${(r.score || 0).toLocaleString()}점 <span style="color:rgba(26,36,33,0.5);font-weight:500;font-size:0.78rem;">(${r.correct_count}/${r.total_count})</span></div>
    <div class="mp-session-meta">${when}</div>
</div>`;
            }).join('') + '</div>';

        const encouragement = s.session_count >= 1
            ? (s.avg_accuracy >= 70 ? '꾸준히 잘 쌓아가고 있어요.' :
               s.avg_accuracy >= 40 ? '천천히, 꾸준히. 귀는 반복으로 열려요.' :
               '아직 시작 단계에요. 하루 한 세션도 큰 변화를 만들어요.')
            : '첫 라운드를 시작해보세요.';

        const practiceHtml = renderPracticeSection(practice);

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
        <div class="mp-stat-label">완료 라운드</div>
    </div>
    <div class="mp-stat">
        <div class="mp-stat-value">${(s.avg_accuracy || 0)}%</div>
        <div class="mp-stat-label">평균 정답률</div>
    </div>
</div>
<div class="mp-encouragement">${encouragement}</div>
${practiceHtml}
<div class="mp-section-title">최근 10 라운드</div>
${recentHtml}
<div class="mp-purchase">
    <div class="mp-purchase-title">구매 내역</div>
    <div class="mp-purchase-desc">TAB 악보·교본 구매 내역은 Lemon Squeezy 고객 포털에서 확인할 수 있어요. 버튼을 누르면 구매 시 사용하신 이메일로 매직 링크가 전송돼요.</div>
    <a href="https://ahnssamguitar.lemonsqueezy.com/billing" target="_blank" rel="noopener" class="mp-purchase-btn"><i class="fas fa-external-link-alt"></i> 구매 내역 확인하기</a>
</div>
<div class="mp-danger">
    <div class="mp-danger-title">계정 탈퇴</div>
    <div class="mp-danger-desc">탈퇴 시 프로필 정보(닉네임·이메일·프로필 사진)는 즉시 익명화되고, 30일 내 완전 삭제됩니다. 라운드 기록은 익명 처리되어 랭킹 계산에서 제외돼요.</div>
    <button class="mp-delete-btn" id="mpDeleteBtn">계정 탈퇴하기</button>
</div>
`;
        document.getElementById('mpEditNickBtn').addEventListener('click', onMpEditNick);
        document.getElementById('mpDeleteBtn').addEventListener('click', onMpDelete);
    }

    // ----------------------------------------------------------------
    // Practice 섹션 — 마이페이지에 표시할 "오늘/주/누적 + 도구별 + 최근 7일"
    // ----------------------------------------------------------------
    const PRACTICE_TOOL_LABELS = {
        tuner: '튜너', metronome: '메트로놈', taptempo: '탭템포',
        capo: '카포', chords: '코드 라이브러리', scales: '스케일',
        fretboard: '프렛보드', piano: '피아노', eartraining: '음정 트레이닝',
    };

    function fmtDuration(sec) {
        sec = Math.max(0, parseInt(sec || 0, 10));
        if (sec === 0) return '0분';
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        if (h > 0 && m > 0) return h + '시간 ' + m + '분';
        if (h > 0) return h + '시간';
        if (m > 0) return m + '분';
        return sec + '초';
    }

    function lastNDays(n) {
        const out = [];
        const today = new Date();
        // KST 기준 — 클라이언트가 KST 라고 가정 (서버 RPC 와 정렬)
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const da = String(d.getDate()).padStart(2, '0');
            out.push({ key: y + '-' + mo + '-' + da, date: d });
        }
        return out;
    }

    function renderPracticeSection(p) {
        if (!p) {
            // RPC 가 없는 경우 — 스키마 미적용 환경에선 섹션 숨김
            return '';
        }
        const today = parseInt(p.today_sec || 0, 10);
        const week  = parseInt(p.week_sec  || 0, 10);
        const total = parseInt(p.total_sec || 0, 10);
        const byTool = (p.by_tool || []).filter(function(t) { return t.duration_sec > 0; });
        const days = lastNDays(7);
        const dayMap = {};
        (p.last_7days || []).forEach(function(d) { dayMap[d.day] = parseInt(d.duration_sec || 0, 10); });
        const dayMax = Math.max(1, Math.max.apply(null, days.map(function(d) { return dayMap[d.key] || 0; })));
        const toolMax = Math.max(1, Math.max.apply(null, byTool.map(function(t) { return t.duration_sec; })));

        // 가로 막대 — 도구별
        const toolBars = byTool.map(function(t) {
            const pct = Math.round(t.duration_sec * 100 / toolMax);
            const label = PRACTICE_TOOL_LABELS[t.tool_name] || t.tool_name;
            return (
                '<div class="mp-tool-row">' +
                  '<div class="mp-tool-name">' + escapeHtml(label) + '</div>' +
                  '<div class="mp-tool-bar"><div class="mp-tool-fill" style="width:' + pct + '%"></div></div>' +
                  '<div class="mp-tool-time">' + fmtDuration(t.duration_sec) + '</div>' +
                '</div>'
            );
        }).join('');

        // 세로 막대 — 최근 7일
        const dayBars = days.map(function(d) {
            const sec = dayMap[d.key] || 0;
            const pct = Math.round(sec * 100 / dayMax);
            const dow = ['일','월','화','수','목','금','토'][d.date.getDay()];
            const dd  = d.date.getDate();
            return (
                '<div class="mp-day-col" title="' + d.key + ' · ' + fmtDuration(sec) + '">' +
                  '<div class="mp-day-bar"><div class="mp-day-fill" style="height:' + pct + '%"></div></div>' +
                  '<div class="mp-day-num">' + dd + '</div>' +
                  '<div class="mp-day-dow">' + dow + '</div>' +
                '</div>'
            );
        }).join('');

        const toolBlock = byTool.length === 0
            ? '<div class="mp-practice-empty">아직 도구 사용 기록이 없어요. 도구를 켜고 연습하면 자동으로 시간이 쌓여요.</div>'
            : '<div class="mp-tool-list">' + toolBars + '</div>';

        return (
            '<div class="mp-section-title">연습 시간</div>' +
            '<div class="mp-practice-grid">' +
                '<div class="mp-practice-stat"><div class="mp-practice-stat-value">' + fmtDuration(today) + '</div><div class="mp-practice-stat-label">오늘</div></div>' +
                '<div class="mp-practice-stat"><div class="mp-practice-stat-value">' + fmtDuration(week)  + '</div><div class="mp-practice-stat-label">최근 7일</div></div>' +
                '<div class="mp-practice-stat"><div class="mp-practice-stat-value">' + fmtDuration(total) + '</div><div class="mp-practice-stat-label">전체 누적</div></div>' +
            '</div>' +
            '<div class="mp-practice-sub-title">최근 7일</div>' +
            '<div class="mp-day-chart">' + dayBars + '</div>' +
            '<div class="mp-practice-sub-title">도구별</div>' +
            toolBlock
        );
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
            // Practice tracker — 도구 전환 시 이전 세션 마감 + 새 세션 시작
            try { practiceOnToolChange(tool); } catch (e) {}
            const ret = origSwitch.apply(this, arguments);
            if (tool === 'ranking') loadRankings();
            else if (tool === 'mypage') loadMypage();
            return ret;
        };
    }

    // ================================================================
    // Practice tracker — 도구별 사용 시간 누적
    // ----------------------------------------------------------------
    //   · switchTool 후크에서 도구가 바뀔 때마다 이전 세션을 닫고 새 세션 시작
    //   · 페이지 hide / unload 시 sendBeacon 으로 안전 마감
    //   · 5초 이하 세션은 무시 (잠깐 들어왔다 나간 경우)
    //   · 한 세션 최대 4시간 (서버 check 제약과 맞춤)
    //   · 비로그인 상태면 localStorage 큐에 쌓아뒀다 로그인 시 일괄 전송
    //   · 로그인 직후·하트비트는 별도 RPC 없이 supabase REST insert 만 사용
    // ================================================================
    const PRACTICE_TOOLS = new Set([
        'tuner','metronome','taptempo','capo',
        'chords','scales','fretboard','piano',
        'eartraining'
    ]);
    const PRACTICE_MIN_SEC = 5;          // 5초 이하 무시
    const PRACTICE_MAX_SEC = 14400;      // 4시간 캡 (서버 check 와 일치)
    const PRACTICE_QUEUE_KEY = 'ahnssam_practice_queue_v1';

    let _practiceCurrent = null;   // { tool, startedAt: Date, lastActiveAt: Date }
    let _practiceFlushing = false;

    function practiceQueueRead() {
        try {
            const raw = window.localStorage.getItem(PRACTICE_QUEUE_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }
    function practiceQueueWrite(arr) {
        try { window.localStorage.setItem(PRACTICE_QUEUE_KEY, JSON.stringify(arr || [])); } catch (e) {}
    }
    function practiceQueueAdd(rec) {
        const q = practiceQueueRead();
        q.push(rec);
        // 1000건 넘어가면 오래된 것부터 자른다 (이상치 방어)
        if (q.length > 1000) q.splice(0, q.length - 1000);
        practiceQueueWrite(q);
    }

    // 세션 종료 — duration 산출 → 5초 이상이면 저장 (또는 큐)
    function practiceEndCurrent(opts) {
        opts = opts || {};
        const cur = _practiceCurrent;
        if (!cur) return;
        _practiceCurrent = null;
        const ended = opts.endedAt instanceof Date ? opts.endedAt : new Date();
        const ms = ended.getTime() - cur.startedAt.getTime();
        const sec = Math.max(0, Math.floor(ms / 1000));
        if (sec < PRACTICE_MIN_SEC) return;
        const dur = Math.min(sec, PRACTICE_MAX_SEC);
        const rec = {
            tool_name: cur.tool,
            started_at: cur.startedAt.toISOString(),
            ended_at: ended.toISOString(),
            duration_sec: dur,
        };
        const user = currentUser();
        if (!user) {
            practiceQueueAdd(rec);
            return;
        }
        // 로그인 상태 — 즉시 insert 시도, 실패하면 큐에 보관
        const client = sb();
        if (!client) { practiceQueueAdd(rec); return; }
        try {
            client.from('practice_sessions').insert(rec).then(function(res) {
                if (res && res.error) {
                    console.warn('[practice] insert failed, queueing', res.error);
                    practiceQueueAdd(rec);
                }
            }).catch(function() { practiceQueueAdd(rec); });
        } catch (e) {
            practiceQueueAdd(rec);
        }
    }

    // 세션 시작 — 도구가 PRACTICE_TOOLS 안에 있을 때만
    function practiceStart(tool) {
        if (!tool || !PRACTICE_TOOLS.has(tool)) { _practiceCurrent = null; return; }
        const now = new Date();
        _practiceCurrent = { tool: tool, startedAt: now, lastActiveAt: now };
    }

    function practiceOnToolChange(tool) {
        // 이전 세션 마감
        practiceEndCurrent();
        // 새 도구가 트래킹 대상이면 새 세션 시작
        practiceStart(tool);
    }

    // visibilitychange / pagehide 시 즉시 마감 — 모바일 앱 전환·탭 닫기 등 대응
    function practiceBindLifecycle() {
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                // 마감하되, 탭이 다시 보이면 (visible) 같은 도구로 새 세션 시작
                const tool = _practiceCurrent && _practiceCurrent.tool;
                practiceEndCurrent();
                _pendingResume = tool;
            } else if (document.visibilityState === 'visible' && _pendingResume) {
                const t = _pendingResume;
                _pendingResume = null;
                if (PRACTICE_TOOLS.has(t)) practiceStart(t);
                // 비로그인 상태로 쌓였던 큐가 있고 지금 로그인이라면 flush 시도
                practiceFlushQueue();
            }
        });
        // pagehide 는 모바일 사파리 / 일부 브라우저에서 더 잘 잡힘 (beforeunload 보다)
        window.addEventListener('pagehide', function() { practiceEndCurrent(); });
        // beforeunload — 데스크톱 일반 unload
        window.addEventListener('beforeunload', function() { practiceEndCurrent(); });
    }
    let _pendingResume = null;

    // 큐에 쌓인 익명 / 실패 세션을 일괄 전송
    async function practiceFlushQueue() {
        if (_practiceFlushing) return;
        const user = currentUser();
        if (!user) return;
        const client = sb();
        if (!client) return;
        const q = practiceQueueRead();
        if (q.length === 0) return;
        _practiceFlushing = true;
        try {
            // 한 번에 너무 많이 보내지 않도록 묶어서 (50건씩)
            for (let i = 0; i < q.length; i += 50) {
                const batch = q.slice(i, i + 50);
                const { error } = await client.from('practice_sessions').insert(batch);
                if (error) {
                    console.warn('[practice] flush batch failed', error);
                    // 실패한 batch 는 큐에 남기고 중단
                    practiceQueueWrite(q.slice(i));
                    _practiceFlushing = false;
                    return;
                }
            }
            practiceQueueWrite([]);  // 모두 성공 → 큐 비움
        } catch (e) {
            console.warn('[practice] flush threw', e);
        } finally {
            _practiceFlushing = false;
        }
    }

    // 초기 도구 (페이지 로드 직후 active 인 패널) 로 세션 시작
    function practiceInitFromActivePanel() {
        try {
            const active = document.querySelector('.tool-panel.active');
            if (!active) return;
            const id = active.id || '';
            // panelId → tool name (panelId 가 "<tool>Panel" 컨벤션을 따름)
            const tool = id.replace(/Panel$/, '');
            if (PRACTICE_TOOLS.has(tool)) practiceStart(tool);
        } catch (e) {}
    }

    // Re-render the active panel when auth state settles. Without this,
    // landing on /tools.html?tool=mypage shows "로그인 안 됨" briefly because
    // the page renders before Supabase getSession() completes — even though
    // the user IS logged in.
    function getActivePanelTool() {
        try {
            if (document.getElementById('mypagePanel') &&
                document.getElementById('mypagePanel').classList.contains('active')) return 'mypage';
            if (document.getElementById('rankingPanel') &&
                document.getElementById('rankingPanel').classList.contains('active')) return 'ranking';
        } catch (e) {}
        return null;
    }
    window.addEventListener('ahnssam-auth-settled', function () {
        const t = getActivePanelTool();
        if (t === 'mypage') loadMypage();
        else if (t === 'ranking') loadRankings();
    });

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

    function openLoginModalSafe() {
        function tryOpen(tries) {
            if (window.ahnssamAuth && typeof window.ahnssamAuth.openLogin === 'function') {
                window.ahnssamAuth.openLogin();
            } else if (tries < 40) {
                setTimeout(function () { tryOpen(tries + 1); }, 120);
            } else {
                alert('로그인 창을 여는 중 문제가 발생했어요. 페이지를 새로고침한 뒤 다시 시도해주세요.');
            }
        }
        tryOpen(0);
    }

    // One-time delegated click handler for any [data-open-login] button rendered later.
    if (!window.__earLoginDelegateInstalled) {
        window.__earLoginDelegateInstalled = true;
        document.addEventListener('click', function (e) {
            const btn = e.target.closest && e.target.closest('[data-open-login]');
            if (!btn) return;
            e.preventDefault();
            openLoginModalSafe();
        });
    }

    function boot() {
        injectStyles();
        renderRankingsShell();
        renderMypageShell();
        installSwitchToolHook();
        practiceBindLifecycle();
        practiceInitFromActivePanel();

        // Expose API for tools.html hooks + UI code
        window.earSession = {
            startQuestion,       // (mode, diff) — call when a new question plays
            recordAnswer,        // (correct:bool) — call when answer is graded
            reset: resetTracker, // ()
            getState: () => ({ ...tracker, answers: tracker.answers.slice() }),
        };
        window.earRanking = { load: loadRankings };
        window.earMypage = { load: loadMypage };
        window.practiceTracker = {
            flushQueue: practiceFlushQueue,
            endCurrent: practiceEndCurrent,
            queueSize: () => practiceQueueRead().length,
        };

        waitForAuth(() => {
            const sbClient = sb();
            // Check current session and maybe prompt nickname
            (async () => {
                try {
                    const { data } = await sbClient.auth.getSession();
                    if (data.session) {
                        checkAndPromptNickname();
                        practiceFlushQueue();   // 익명 시절 쌓인 큐 즉시 전송
                    }
                } catch (e) {}
            })();
            // Listen for future auth state changes
            sbClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    setTimeout(checkAndPromptNickname, 600);
                    setTimeout(practiceFlushQueue, 800);
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
