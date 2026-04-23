/* ================================================================
   안쌤의 기타나무숲 — Auth (Supabase)
   - Loads Supabase JS SDK from CDN
   - Injects login button into .auth-slot (or fallback anchors)
   - Injects login/signup modal
   - Manages session state across all pages
   ================================================================ */
(function () {
    'use strict';

    const SUPABASE_URL = 'https://qpcbrqgqylxkgdwoflku.supabase.co';
    const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5rr-OZ7Sqjk1nXn59R7XnQ_HInATuSV';
    const SDK_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/dist/umd/supabase.min.js';

    // ------------------------------------------------------------
    // Styles — injected once
    // ------------------------------------------------------------
    const CSS = `
.auth-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.45rem 1rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 600;
    color: var(--green-deep, #2a6b4a);
    background: #fff;
    border: 1.5px solid var(--green-mid, #52a872);
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
}
.auth-btn:hover {
    background: var(--green-mid, #52a872);
    color: #fff;
}
.auth-btn .auth-btn-icon { font-size: 0.82rem; }

.auth-user {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem;
    padding: 0.35rem 0.9rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 600;
    color: var(--green-deep, #2a6b4a);
    background: rgba(255,255,255,0.96);
    border: 1.5px solid var(--green-mid, #52a872);
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    max-width: 180px;
}
.auth-user .auth-user-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.auth-user:hover { background: #fff; }
.auth-user .auth-user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    color: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.78rem;
    flex-shrink: 0;
}
.auth-user-menu {
    position: absolute; top: calc(100% + 6px); right: 0;
    min-width: 180px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    padding: 0.4rem;
    display: none;
    z-index: 1002;
}
.auth-user-menu.open { display: block; }
.auth-user-menu button {
    width: 100%;
    padding: 0.55rem 0.75rem;
    text-align: left;
    font-family: inherit; font-size: 0.86rem; font-weight: 500;
    color: #2a3a35;
    background: transparent;
    border: none; border-radius: 6px;
    cursor: pointer;
}
.auth-user-menu button:hover { background: var(--green-faint, #e2f5ea); color: var(--green-deep, #2a6b4a); }
.auth-user-menu hr { border: none; border-top: 1px solid rgba(0,0,0,0.06); margin: 0.3rem 0; }

/* nav.scrolled variant — dark text on white nav */
nav.scrolled .auth-btn {
    background: var(--green-deep, #2a6b4a);
    color: #fff;
    border-color: var(--green-deep, #2a6b4a);
}
nav.scrolled .auth-btn:hover {
    background: var(--green-dark, #3a8a5c);
    border-color: var(--green-dark, #3a8a5c);
}

/* topbar (tools.html) — dark bg */
.topbar .auth-slot .auth-btn {
    background: rgba(255,255,255,0.08);
    color: #fff;
    border-color: rgba(255,255,255,0.25);
}
.topbar .auth-slot .auth-btn:hover {
    background: rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.5);
}
.topbar .auth-slot .auth-user {
    background: rgba(255,255,255,0.08);
    color: #fff;
    border-color: rgba(255,255,255,0.25);
}
.topbar .auth-slot .auth-user:hover { background: rgba(255,255,255,0.14); }

/* ---------- Modal ---------- */
.auth-overlay {
    position: fixed; inset: 0;
    background: rgba(18, 34, 26, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: none;
    align-items: center; justify-content: center;
    z-index: 10000;
    padding: 1rem;
}
.auth-overlay.open { display: flex; }
.auth-modal {
    width: 100%; max-width: 420px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.32);
    overflow: hidden;
    font-family: inherit;
    color: #1e2a24;
}
.auth-modal-header {
    position: relative;
    padding: 0.8rem 0.8rem 0;
    min-height: 36px;
    text-align: center;
}
.auth-modal-close {
    position: absolute; top: 0.8rem; right: 0.8rem;
    width: 32px; height: 32px;
    border: none; background: transparent;
    color: rgba(0,0,0,0.4);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 6px;
}
.auth-modal-close:hover { background: rgba(0,0,0,0.06); color: rgba(0,0,0,0.7); }
.auth-modal-title {
    font-size: 1.25rem; font-weight: 800;
    color: var(--green-deep, #2a6b4a);
    letter-spacing: 0.02em;
    margin-bottom: 0.3rem;
}
.auth-modal-sub {
    font-size: 0.88rem; font-weight: 500;
    color: rgba(0,0,0,0.55);
    line-height: 1.4;
}

.auth-tabs {
    display: flex;
    margin: 1rem 1.6rem 0;
    background: var(--green-faint, #e2f5ea);
    border-radius: 10px;
    padding: 4px;
}
.auth-tab {
    flex: 1;
    padding: 0.55rem 0.8rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 600;
    color: var(--green-deep, #2a6b4a);
    background: transparent;
    border: none; border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s ease;
}
.auth-tab.active {
    background: #fff;
    color: var(--green-deep, #2a6b4a);
    box-shadow: 0 2px 6px rgba(42,107,74,0.14);
}

.auth-body { padding: 1.2rem 1.6rem 1.6rem; min-height: 370px; }

.auth-oauth {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;
    margin-bottom: 1rem;
}
.auth-oauth-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.7rem 0.8rem;
    font-family: inherit; font-size: 0.88rem; font-weight: 600;
    background: #fff;
    color: #2a3a35;
    border: 1px solid rgba(0,0,0,0.14);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
}
.auth-oauth-btn:hover { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.22); }
.auth-oauth-btn.google { color: #1a1a1a; }
.auth-oauth-btn.kakao { background: #FEE500; color: #3a2c00; border-color: #FEE500; }
.auth-oauth-btn.kakao:hover { background: #f4d900; border-color: #f4d900; }
.auth-oauth-icon { width: 18px; height: 18px; flex-shrink: 0; }

.auth-divider {
    display: flex; align-items: center; gap: 0.6rem;
    margin: 1rem 0;
    font-size: 0.78rem; font-weight: 500;
    color: rgba(0,0,0,0.4);
}
.auth-divider::before, .auth-divider::after {
    content: ""; flex: 1; height: 1px;
    background: rgba(0,0,0,0.1);
}

.auth-form { display: flex; flex-direction: column; gap: 0.7rem; }
.auth-field { display: flex; flex-direction: column; gap: 0.3rem; }
.auth-field-nickname { margin-bottom: 1.6rem; }
.auth-label { font-size: 0.8rem; font-weight: 600; color: rgba(0,0,0,0.7); }
.auth-input {
    padding: 0.75rem 0.9rem;
    font-family: inherit; font-size: 0.95rem;
    color: #1e2a24;
    background: #f8faf7;
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 9px;
    outline: none;
    transition: all 0.15s ease;
    -webkit-appearance: none;
}
.auth-input:focus {
    background: #fff;
    border-color: var(--green-mid, #52a872);
    box-shadow: 0 0 0 3px rgba(82,168,114,0.14);
}
.auth-submit {
    padding: 0.85rem 1rem;
    font-family: inherit; font-size: 0.95rem; font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--green-mid, #52a872), var(--green-deep, #2a6b4a));
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0.4rem;
    transition: all 0.15s ease;
    letter-spacing: 0.02em;
}
.auth-submit:hover:not(:disabled) { filter: brightness(1.08); }
.auth-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.auth-msg {
    margin-top: 0.7rem;
    padding: 0.6rem 0.8rem;
    font-size: 0.82rem; font-weight: 500;
    border-radius: 8px;
    display: none;
}
.auth-msg.show { display: block; }
.auth-msg.error { background: #fdecec; color: #a3322c; }
.auth-msg.success { background: #e6f5ec; color: #1e6b42; }

.auth-footer-link {
    display: block;
    margin-top: 0.8rem;
    text-align: center;
    font-size: 0.82rem;
    color: var(--green-deep, #2a6b4a);
    background: none; border: none;
    cursor: pointer;
    font-family: inherit;
    text-decoration: underline;
}
.auth-footer-link:hover { color: var(--green-dark, #3a8a5c); }

@media (max-width: 480px) {
    .auth-modal { max-width: 100%; }
    .auth-oauth { grid-template-columns: 1fr; }
    /* On narrow screens OAuth stacks vertically, making login taller.
       Bump body min-height so signup matches login and the modal stays put. */
    .auth-body { min-height: 425px; }
}
`;

    // ------------------------------------------------------------
    // Modal HTML
    // ------------------------------------------------------------
    const MODAL_HTML = `
<div class="auth-overlay" id="authOverlay" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
    <div class="auth-modal" role="document">
        <div class="auth-modal-header">
            <button class="auth-modal-close" aria-label="닫기" data-auth-action="close">&times;</button>
        </div>
        <div class="auth-tabs" role="tablist">
            <button class="auth-tab active" data-auth-tab="login" role="tab">로그인</button>
            <button class="auth-tab" data-auth-tab="signup" role="tab">회원가입</button>
        </div>
        <div class="auth-body">
            <div class="auth-oauth">
                <button class="auth-oauth-btn google" data-auth-action="oauth-google" type="button">
                    <svg class="auth-oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                </button>
                <button class="auth-oauth-btn kakao" data-auth-action="oauth-kakao" type="button">
                    <svg class="auth-oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.32 4.68 6.77-.18.64-.66 2.39-.76 2.76-.12.46.17.46.36.34.15-.09 2.31-1.57 3.24-2.2.82.12 1.67.18 2.48.18 5.52 0 10-3.58 10-8S17.52 3 12 3z" fill="#3a2c00"/>
                    </svg>
                    <span>카카오</span>
                </button>
            </div>
            <div class="auth-divider">또는</div>
            <form class="auth-form" id="authForm">
                <div class="auth-field">
                    <label class="auth-label" for="authEmail">이메일</label>
                    <input class="auth-input" id="authEmail" type="email" autocomplete="email" required placeholder="you@example.com">
                </div>
                <div class="auth-field">
                    <label class="auth-label" for="authPassword">비밀번호</label>
                    <input class="auth-input" id="authPassword" type="password" autocomplete="current-password" required minlength="6" placeholder="최소 6자 이상">
                </div>
                <div class="auth-field auth-field-nickname" style="display:none;">
                    <label class="auth-label" for="authNickname">닉네임</label>
                    <input class="auth-input" id="authNickname" type="text" autocomplete="nickname" maxlength="20" placeholder="사이트에 표시될 이름">
                </div>
                <button class="auth-submit" id="authSubmit" type="submit">로그인</button>
                <div class="auth-msg" id="authMsg"></div>
                <button class="auth-footer-link" type="button" data-auth-action="reset-password">비밀번호를 잊으셨나요?</button>
            </form>
        </div>
    </div>
</div>
`;

    // ------------------------------------------------------------
    // State
    // ------------------------------------------------------------
    let sb = null;
    let currentSession = null;
    let currentProfile = null;
    let currentMode = 'login';

    // ------------------------------------------------------------
    // Bootstrap helpers
    // ------------------------------------------------------------
    function loadSDK() {
        return new Promise((resolve, reject) => {
            if (window.supabase && window.supabase.createClient) return resolve();
            const s = document.createElement('script');
            s.src = SDK_CDN;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Supabase SDK failed to load'));
            document.head.appendChild(s);
        });
    }

    function injectStyles() {
        if (document.getElementById('auth-styles')) return;
        const style = document.createElement('style');
        style.id = 'auth-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (document.getElementById('authOverlay')) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = MODAL_HTML.trim();
        document.body.appendChild(wrap.firstElementChild);
        wireModal();
    }

    function findAuthSlots() {
        // Ensure the canonical navbar slot exists (main site pages)
        const navbar = document.querySelector('nav#navbar');
        if (navbar && !navbar.querySelector('.auth-slot')) {
            const social = navbar.querySelector('.nav-social');
            if (social) {
                const s = document.createElement('div');
                s.className = 'auth-slot';
                s.style.display = 'inline-flex';
                s.style.alignItems = 'center';
                social.parentNode.insertBefore(s, social);
            }
        }
        // Ensure the tools.html topbar slot exists
        const topbar = document.querySelector('.topbar');
        if (topbar && !topbar.querySelector('.auth-slot')) {
            const mv = topbar.querySelector('.master-vol');
            if (mv) {
                const s = document.createElement('div');
                s.className = 'auth-slot';
                s.style.display = 'inline-flex';
                s.style.alignItems = 'center';
                s.style.marginRight = '0.8rem';
                mv.parentNode.insertBefore(s, mv);
            }
        }
        // Return ALL .auth-slot elements (includes any manually-placed ones like .mobile-auth-slot)
        return Array.from(document.querySelectorAll('.auth-slot'));
    }

    // ------------------------------------------------------------
    // UI render
    // ------------------------------------------------------------
    function renderSlot() {
        const slots = findAuthSlots();
        if (slots.length === 0) return;
        slots.forEach((slot) => {
            slot.innerHTML = '';
            if (currentSession) {
                const nick = (currentProfile && currentProfile.nickname) ||
                             (currentSession.user && currentSession.user.user_metadata && currentSession.user.user_metadata.nickname) ||
                             (currentSession.user.email || '').split('@')[0];
                const initial = (nick || '?').trim().charAt(0).toUpperCase();
                const container = document.createElement('div');
                container.style.position = 'relative';
                container.style.display = 'inline-flex';
                container.innerHTML = `
                    <button class="auth-user" type="button" aria-haspopup="menu">
                        <span class="auth-user-avatar">${escapeHtml(initial)}</span>
                        <span class="auth-user-name">${escapeHtml(nick)}</span>
                    </button>
                    <div class="auth-user-menu" role="menu">
                        <button type="button" data-auth-action="mypage">마이페이지</button>
                        <button type="button" data-auth-action="change-nickname">닉네임 변경</button>
                        <hr>
                        <button type="button" data-auth-action="signout">로그아웃</button>
                    </div>
                `;
                const userBtn = container.querySelector('.auth-user');
                const menu = container.querySelector('.auth-user-menu');
                userBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('open');
                });
                document.addEventListener('click', () => menu.classList.remove('open'));
                menu.addEventListener('click', (e) => {
                    const action = e.target.closest('[data-auth-action]');
                    if (!action) return;
                    const a = action.getAttribute('data-auth-action');
                    menu.classList.remove('open');
                    if (a === 'signout') signOut();
                    else if (a === 'change-nickname') promptNicknameChange();
                    else if (a === 'mypage') goToMypage();
                });
                slot.appendChild(container);
            } else {
                const btn = document.createElement('button');
                btn.className = 'auth-btn';
                btn.type = 'button';
                btn.innerHTML = '<i class="fas fa-user auth-btn-icon"></i><span>로그인</span>';
                btn.addEventListener('click', () => {
                    openModal('login');
                    // If this click came from within the mobile hamburger menu, also close it
                    if (slot.classList.contains('mobile-auth-slot')) {
                        try {
                            const mm = document.getElementById('mobileMenu');
                            if (mm) mm.classList.remove('open');
                        } catch (e) {}
                    }
                });
                slot.appendChild(btn);
            }
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // ------------------------------------------------------------
    // Modal
    // ------------------------------------------------------------
    function openModal(mode) {
        currentMode = mode || 'login';
        updateModalMode();
        clearMsg();
        document.getElementById('authOverlay').classList.add('open');
        setTimeout(() => {
            const emailInput = document.getElementById('authEmail');
            if (emailInput) emailInput.focus();
        }, 60);
    }

    function closeModal() {
        const ov = document.getElementById('authOverlay');
        if (ov) ov.classList.remove('open');
    }

    function updateModalMode() {
        const isSignup = currentMode === 'signup';
        document.querySelectorAll('.auth-tab').forEach((t) => {
            t.classList.toggle('active', t.getAttribute('data-auth-tab') === currentMode);
        });
        document.querySelector('.auth-field-nickname').style.display = isSignup ? '' : 'none';
        document.getElementById('authSubmit').textContent = isSignup ? '회원가입' : '로그인';
        document.getElementById('authPassword').setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
        // Hide OAuth buttons + "또는" divider in signup mode — email+password only
        const oauth = document.querySelector('.auth-oauth');
        const divider = document.querySelector('.auth-divider');
        if (oauth) oauth.style.display = isSignup ? 'none' : '';
        if (divider) divider.style.display = isSignup ? 'none' : '';
        const forgotLink = document.querySelector('[data-auth-action="reset-password"]');
        if (forgotLink) forgotLink.style.display = isSignup ? 'none' : '';
    }

    function wireModal() {
        const overlay = document.getElementById('authOverlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
        });
        overlay.querySelectorAll('.auth-tab').forEach((t) => {
            t.addEventListener('click', () => {
                currentMode = t.getAttribute('data-auth-tab');
                updateModalMode();
                clearMsg();
            });
        });
        overlay.querySelectorAll('[data-auth-action]').forEach((el) => {
            el.addEventListener('click', () => {
                const action = el.getAttribute('data-auth-action');
                if (action === 'close') closeModal();
                else if (action === 'oauth-google') oauth('google');
                else if (action === 'oauth-kakao') oauth('kakao');
                else if (action === 'reset-password') resetPassword();
            });
        });
        document.getElementById('authForm').addEventListener('submit', onSubmitForm);
    }

    function setMsg(text, kind) {
        const el = document.getElementById('authMsg');
        if (!el) return;
        el.textContent = text;
        el.className = 'auth-msg show ' + (kind || 'error');
    }
    function clearMsg() {
        const el = document.getElementById('authMsg');
        if (el) { el.textContent = ''; el.className = 'auth-msg'; }
    }

    // ------------------------------------------------------------
    // Auth actions
    // ------------------------------------------------------------
    async function onSubmitForm(e) {
        e.preventDefault();
        clearMsg();
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        const submitBtn = document.getElementById('authSubmit');
        submitBtn.disabled = true;
        try {
            if (currentMode === 'signup') {
                const nickname = document.getElementById('authNickname').value.trim();
                if (nickname.length < 2) {
                    setMsg('닉네임은 2자 이상 입력해주세요.', 'error');
                    return;
                }
                const { data, error } = await sb.auth.signUp({
                    email, password,
                    options: {
                        data: { nickname },
                        emailRedirectTo: window.location.origin + window.location.pathname
                    }
                });
                if (error) { setMsg(humanError(error), 'error'); return; }
                if (data.session) {
                    setMsg('가입 완료! 환영합니다.', 'success');
                    setTimeout(closeModal, 900);
                } else {
                    setMsg('입력하신 이메일로 인증 메일을 보냈어요. 메일함을 확인해주세요.', 'success');
                }
            } else {
                const { error } = await sb.auth.signInWithPassword({ email, password });
                if (error) { setMsg(humanError(error), 'error'); return; }
                setMsg('로그인 성공!', 'success');
                setTimeout(closeModal, 500);
            }
        } catch (err) {
            setMsg(humanError(err), 'error');
        } finally {
            submitBtn.disabled = false;
        }
    }

    async function oauth(provider) {
        clearMsg();
        try {
            const { error } = await sb.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + window.location.pathname,
                    queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
                    scopes: provider === 'kakao' ? 'profile_nickname profile_image' : undefined
                }
            });
            if (error) setMsg(humanError(error), 'error');
        } catch (err) {
            setMsg(humanError(err), 'error');
        }
    }

    async function resetPassword() {
        clearMsg();
        const email = (document.getElementById('authEmail').value || '').trim();
        if (!email) {
            setMsg('비밀번호 재설정 메일을 받을 이메일 주소를 입력하세요.', 'error');
            document.getElementById('authEmail').focus();
            return;
        }
        try {
            const { error } = await sb.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + window.location.pathname
            });
            if (error) { setMsg(humanError(error), 'error'); return; }
            setMsg('비밀번호 재설정 링크를 메일로 보냈어요.', 'success');
        } catch (err) {
            setMsg(humanError(err), 'error');
        }
    }

    function goToMypage() {
        // If already on tools.html, just set hash; otherwise navigate
        const path = window.location.pathname;
        if (path.endsWith('/tools.html') || path.endsWith('/tools')) {
            if (window.location.hash !== '#mypage') {
                window.location.hash = '#mypage';
            } else {
                // force re-trigger
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        } else {
            window.location.href = 'tools.html#mypage';
        }
    }

    async function signOut() {
        await sb.auth.signOut();
    }

    async function promptNicknameChange() {
        const current = (currentProfile && currentProfile.nickname) || '';
        const next = window.prompt('새 닉네임을 입력하세요 (2~20자)', current);
        if (next == null) return;
        const trimmed = next.trim();
        if (trimmed.length < 2 || trimmed.length > 20) {
            alert('닉네임은 2~20자로 입력해주세요.');
            return;
        }
        const uid = currentSession && currentSession.user && currentSession.user.id;
        if (!uid) return;
        const { error } = await sb.from('profiles').update({ nickname: trimmed }).eq('id', uid);
        if (error) {
            alert('닉네임 변경 중 오류가 발생했어요.\n' + error.message);
            return;
        }
        currentProfile = Object.assign({}, currentProfile, { nickname: trimmed });
        renderSlot();
    }

    function humanError(err) {
        const msg = (err && err.message) || String(err);
        const map = [
            [/Invalid login credentials/i, '이메일 또는 비밀번호가 올바르지 않아요.'],
            [/Email not confirmed/i, '이메일 인증이 필요해요. 받은 메일함을 확인해주세요.'],
            [/User already registered/i, '이미 가입된 이메일이에요. 로그인 탭을 이용해주세요.'],
            [/Password should be at least/i, '비밀번호는 최소 6자 이상이어야 해요.'],
            [/rate limit/i, '잠시 후 다시 시도해주세요.']
        ];
        for (const [re, ko] of map) {
            if (re.test(msg)) return ko;
        }
        return msg;
    }

    // ------------------------------------------------------------
    // Profile
    // ------------------------------------------------------------
    async function fetchProfile(uid) {
        if (!uid) { currentProfile = null; return; }
        try {
            const { data, error } = await sb
                .from('profiles')
                .select('id, nickname')
                .eq('id', uid)
                .single();
            currentProfile = error ? null : data;
        } catch (e) {
            currentProfile = null;
        }
    }

    // ------------------------------------------------------------
    // Entry
    // ------------------------------------------------------------
    async function boot() {
        // Phase 1 — synchronous UI setup so the login button shows up
        // immediately, even before the Supabase SDK finishes loading.
        injectStyles();
        injectModal();
        renderSlot();

        // Phase 2 — load the SDK in the background and wire up session.
        try {
            await loadSDK();
        } catch (err) {
            console.warn('[auth] Supabase SDK failed to load:', err);
            return;
        }
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });

        const { data } = await sb.auth.getSession();
        currentSession = data.session || null;
        if (currentSession) await fetchProfile(currentSession.user.id);
        renderSlot();

        sb.auth.onAuthStateChange(async (event, session) => {
            currentSession = session || null;
            if (currentSession) {
                await fetchProfile(currentSession.user.id);
            } else {
                currentProfile = null;
            }
            renderSlot();
            if (event === 'SIGNED_IN') closeModal();
        });

        window.ahnssamAuth = {
            supabase: sb,
            getSession: () => currentSession,
            getProfile: () => currentProfile,
            openLogin: () => openModal('login'),
            openSignup: () => openModal('signup'),
            signOut,
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
