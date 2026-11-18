#!/usr/bin/env python3
"""'강좌 & 레슨' 페이지 만들기 (2026-11-18)

사용자: 유튜브 강좌 재생목록(안쌤의 일렉기타나무숲 강좌 & 팁 콤보)을 새 페이지로 — 영상을 누르면 영상과 함께
옆에 대본을 정리한 글. 애드센스 '가치가 별로 없는 콘텐츠' 반려(2026-11-17) 대책 3번이기도 해서,
글은 자바스크립트로 채우지 않고 **HTML에 그대로** 넣는다(검색엔진·심사가 바로 읽게).

만드는 것:
  lessons.html              — 강좌 목록(종류별 칸)
  lessons/<영상id>.html     — 강좌 하나: 영상(왼쪽, 넓은 화면에선 따라 내려옴) + 정리 글(오른쪽)
  index.html 의 <!-- LESSONS:START --> ~ <!-- LESSONS:END --> — 메인 '강좌 & 레슨' 칸(카드 6개 + 더보기)
  sitemap.xml 은 tools/gen_sitemap.py 가 data/lessons.json 을 읽어 같이 넣는다.

글은 data/lessons.json (영상 대본을 Claude가 정리 — 사용자가 확인). 고치면 다시 돌린다:
    python3 tools/gen_lessons.py
머리 메뉴·하단은 session-gallery.html 의 것을 그대로 가져온다(메뉴를 고치면 다시 돌리면 따라 바뀐다).
"""
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://ahnssamguitar.com'
CH_URL = 'https://www.youtube.com/channel/UC0TC0fLj3ZahhlKcC9ebVrg'
PLAYLIST = 'https://www.youtube.com/playlist?list=PLDhNRxvxJuK7t54u9ujjQ9NxWal_LwGzD'
CATS = [('basic', '입문 기초', 'fa-seedling'), ('technique', '테크닉', 'fa-bolt'),
        ('gear', '장비', 'fa-plug'), ('arrange', '편곡 · 핑거스타일', 'fa-hand')]
CAT_NAME = {k: n for k, n, _ in CATS}
# 강좌마다 같이 쓰면 좋은 연습도구 (tools.html?tool=…)
TOOL_NAME = {'tuner': ('튜너', 'fa-wave-square'), 'metronome': ('메트로놈', 'fa-stopwatch'), 'chords': ('코드표', 'fa-table-cells'),
             'scales': ('스케일', 'fa-stairs'), 'backing': ('반주', 'fa-drum'), 'fretboard': ('지판 외우기', 'fa-grip-lines'),
             'slowplayer': ('배속 플레이어', 'fa-gauge'), 'eartraining': ('청음', 'fa-ear-listen')}
LESSON_TOOLS = {'5YPrJmJfyK8': ['tuner'], 'iHMhXA1H4tk': ['chords', 'backing'], 'a8nB90Ju_54': ['metronome', 'fretboard'],
                'YVBDvDvvrdg': ['metronome'], 'VPzXFmwEnKQ': ['metronome', 'backing'], 'SdlHzO8pXa8': ['chords', 'metronome'],
                'LCKbgwXE4GI': ['scales', 'backing'], 'xgCuPVeJiaY': ['metronome', 'slowplayer'], 'k1_HI_y60F8': ['slowplayer', 'chords']}
V = '2026111801'   # 이 페이지들의 css·js 판 (바꾸면 올린다)

e = lambda s: html.escape(str(s or ''), quote=True)


def mmss(t):
    t = int(t or 0)
    return f'{t // 3600}:{t % 3600 // 60:02d}:{t % 60:02d}' if t >= 3600 else f'{t // 60}:{t % 60:02d}'


def dur_text(t):
    t = int(t or 0)
    return f'{t // 60}분' + (f' {t % 60}초' if t % 60 else '')


def iso_dur(t):
    t = int(t or 0)
    return f'PT{t // 60}M{t % 60}S'


def thumb(vid, q='hqdefault'):
    return f'https://i.ytimg.com/vi/{vid}/{q}.jpg'


def chars(L):
    n = sum(len(x) for s in L.get('sections', []) for x in s.get('p', []) + s.get('tips', []))
    return n + sum(len(x) for k in ('learn', 'practice', 'mistakes') for x in L.get(k, []))


# ---------- 공통 머리·하단 (session-gallery.html 에서) ----------
def shell():
    src = open(os.path.join(ROOT, 'session-gallery.html'), encoding='utf-8').read()
    style = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
    header = re.search(r'(<header class="site-hd green">.*?</header>)', src, re.S).group(1)
    footer = re.search(r'(<footer>.*?</footer>)', src, re.S).group(1)
    burger = re.search(r'(<script>\s*// 모바일 메뉴.*?</script>)', src, re.S).group(1)

    def absolute(s):   # lessons/ 아래에서도 되게 상대 주소를 / 로
        return re.sub(r'(src|href)="(?!https?:|/|#|mailto:|tel:|data:|javascript:)([^"]+)"', r'\1="/\2"', s)
    return style, absolute(header), absolute(footer), burger


CSS = """
/* ===== 강좌 & 레슨 (tools/gen_lessons.py 가 만든다) ===== */
body { background: #f6faf7; }
.ls-wrap { max-width: 1180px; margin: 0 auto; padding: 28px 20px 60px; }
.ls-hero { padding: 6px 0 18px; }
.ls-hero small { display: block; color: var(--green-mid); font-weight: 800; letter-spacing: .12em; font-size: 12px; }
.ls-hero h1 { font-size: 30px; font-weight: 900; color: var(--text-dark); margin: 4px 0 8px; letter-spacing: -0.02em; }
.ls-hero p { color: var(--text-mid); font-size: 15px; line-height: 1.7; max-width: 760px; }
.ls-hero .yt-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 13px; font-weight: 700; color: #c4302b; }
.ls-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 18px; }
.ls-chips a { padding: 7px 13px; border-radius: 999px; background: #fff; border: 1.5px solid #dbe9e0; font-size: 13px; font-weight: 700; color: var(--text-mid); }
.ls-chips a.on, .ls-chips a:hover { background: var(--green-deep); border-color: var(--green-deep); color: #fff; }
.ls-cat { margin: 26px 0 8px; font-size: 19px; font-weight: 900; color: var(--text-dark); display: flex; align-items: center; gap: 8px; }
.ls-cat i { color: var(--green-mid); }
.ls-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.ls-card { display: flex; flex-direction: column; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e3eee7; box-shadow: 0 2px 8px rgba(30,70,45,.05); transition: transform .15s, box-shadow .15s; }
.ls-card:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(30,70,45,.12); }
.ls-th { position: relative; aspect-ratio: 16 / 9; background: #111 center / cover no-repeat; }
.ls-th .dur { position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,.78); color: #fff; font-size: 12px; font-weight: 700; padding: 2px 7px; border-radius: 6px; }
.ls-th .pl { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 50px; height: 36px; border-radius: 10px; background: rgba(220,30,30,.9); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; opacity: .92; }
.ls-cb { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.ls-cb .tag { font-size: 11.5px; font-weight: 800; color: var(--green-mid); }
.ls-cb h3 { font-size: 15.5px; font-weight: 800; line-height: 1.45; color: var(--text-dark); }
.ls-cb p { font-size: 13px; line-height: 1.6; color: var(--text-mid); }
/* 강좌 하나 */
.ls-crumb { font-size: 13px; color: var(--text-light); margin-bottom: 10px; }
.ls-crumb a { color: var(--green-deep); font-weight: 700; }
.ls-title { font-size: 27px; font-weight: 900; line-height: 1.35; color: var(--text-dark); letter-spacing: -0.02em; }
.ls-meta { margin: 8px 0 20px; display: flex; flex-wrap: wrap; gap: 6px; font-size: 13px; }
.ls-meta span { padding: 4px 10px; border-radius: 999px; background: #fff; border: 1px solid #dbe9e0; color: var(--text-mid); font-weight: 600; }
.ls-meta span.lv { background: var(--green-faint); border-color: var(--green-pale); color: var(--green-deep); font-weight: 800; }
.ls-body { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 28px; align-items: start; }
.ls-side { position: sticky; top: 84px; display: flex; flex-direction: column; gap: 12px; }
.ls-vid { position: relative; aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden; background: #000 center / cover no-repeat; box-shadow: 0 10px 28px rgba(0,0,0,.18); }
.ls-vid button.play { position: absolute; inset: 0; width: 100%; border: 0; background: rgba(0,0,0,.18); cursor: pointer; color: #fff; display: flex; align-items: center; justify-content: center; }
.ls-vid button.play span { width: 74px; height: 52px; border-radius: 14px; background: #e02b2b; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 6px 18px rgba(0,0,0,.35); }
.ls-vid iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.ls-chap { background: #fff; border: 1px solid #e3eee7; border-radius: 14px; padding: 12px 8px; max-height: 300px; overflow: auto; }
.ls-chap b { display: block; font-size: 13px; padding: 0 8px 6px; color: var(--text-dark); }
.ls-chap button { display: flex; gap: 10px; width: 100%; text-align: left; border: 0; background: none; padding: 7px 8px; border-radius: 8px; font: inherit; font-size: 13.5px; color: var(--text-mid); cursor: pointer; }
.ls-chap button:hover, .ls-chap button.on { background: var(--green-faint); color: var(--green-deep); }
.ls-chap button em { font-style: normal; font-weight: 800; color: var(--green-mid); min-width: 42px; font-variant-numeric: tabular-nums; }
.ls-tools { display: flex; flex-wrap: wrap; gap: 6px; }
.ls-tools a { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; background: #fff; border: 1.5px solid #dbe9e0; font-size: 13px; font-weight: 700; color: var(--green-deep); }
.ls-tools a:hover { border-color: var(--green-mid); }
.ls-art { background: #fff; border: 1px solid #e3eee7; border-radius: 16px; padding: 26px 26px 30px; font-size: 16px; line-height: 1.85; color: #2b2f2d; }
.ls-art h2 { font-size: 19px; font-weight: 900; color: var(--text-dark); margin: 30px 0 10px; line-height: 1.45; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.ls-art h2:first-child { margin-top: 0; }
.ls-art p { margin: 0 0 12px; word-break: keep-all; }
.ls-art ul, .ls-art ol { margin: 0 0 12px 1.3em; }
.ls-art li { margin: 4px 0; word-break: keep-all; }
.ls-art .ts { flex: none; border: 0; cursor: pointer; font: inherit; font-size: 12.5px; font-weight: 800; padding: 3px 9px; border-radius: 999px; background: var(--green-faint); color: var(--green-deep); font-variant-numeric: tabular-nums; position: relative; top: -2px; }
.ls-art .ts:hover { background: var(--green-deep); color: #fff; }
.ls-learn { background: var(--green-faint); border-radius: 12px; padding: 16px 18px 6px; margin-bottom: 8px; }
.ls-learn b { display: block; font-size: 14px; color: var(--green-deep); margin-bottom: 6px; }
.ls-tip { background: #fff8e3; border-left: 4px solid #f2c14e; border-radius: 0 10px 10px 0; padding: 10px 14px; margin: 4px 0 14px; font-size: 15px; }
.ls-tip i { color: #d79b10; margin-right: 6px; }
.ls-note { margin-top: 24px; font-size: 13px; color: var(--text-light); line-height: 1.7; }
.ls-more { margin-top: 40px; }
.ls-more h2 { font-size: 20px; font-weight: 900; margin-bottom: 12px; }
.ls-pn { display: flex; justify-content: space-between; gap: 10px; margin-top: 18px; }
.ls-pn a { flex: 1; max-width: 49%; padding: 12px 14px; background: #fff; border: 1px solid #e3eee7; border-radius: 12px; font-size: 14px; font-weight: 700; color: var(--text-dark); line-height: 1.5; }
.ls-pn a small { display: block; color: var(--green-mid); font-size: 12px; }
.ls-pn a.nx { text-align: right; margin-left: auto; }
@media (max-width: 900px) {
    .ls-body { grid-template-columns: 1fr; gap: 18px; }
    .ls-side { position: static; }
    .ls-chap { max-height: 220px; }
    .ls-title { font-size: 22px; }
    .ls-art { padding: 20px 16px 24px; font-size: 15.5px; }
    .ls-hero h1 { font-size: 25px; }
}
@media (max-width: 560px) {
    .ls-wrap { padding: 18px 14px 44px; }
    .ls-grid { grid-template-columns: 1fr; }
    .ls-pn { flex-direction: column; }
    .ls-pn a { max-width: none; }
}
"""

# 영상 재생: 처음엔 그림만(가볍게), 누르면 유튜브 — 소제목·목차의 시간을 누르면 그 자리로
JS = """
(function () {
    const box = document.getElementById('lsVid'); if (!box) return;
    const vid = box.dataset.v; let ifr = null;
    function load(t, play) {
        if (ifr) return;
        ifr = document.createElement('iframe');
        ifr.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?enablejsapi=1&rel=0&playsinline=1&start=' + (t | 0) + (play ? '&autoplay=1' : '');
        ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        ifr.allowFullscreen = true; ifr.title = box.dataset.title || '';
        box.innerHTML = ''; box.appendChild(ifr);
    }
    function cmd(f, a) { if (ifr) ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: f, args: a || [] }), '*'); }
    function seek(t) {
        if (!ifr) load(t, true); else { cmd('seekTo', [t, true]); cmd('playVideo'); }
        if (window.matchMedia('(max-width: 900px)').matches) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.ls-chap button').forEach(b => b.classList.toggle('on', +b.dataset.t === t));
        try { gtag('event', 'lesson_seek', { video: vid, t: t }); } catch (e) {}
    }
    box.querySelector('button.play').addEventListener('click', () => { load(0, true); try { gtag('event', 'lesson_play', { video: vid }); } catch (e) {} });
    document.addEventListener('click', ev => { const b = ev.target.closest('[data-t]'); if (b) { ev.preventDefault(); seek(+b.dataset.t); } });
})();
"""


def head(title, desc, canon, image, extra=''):
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-B1HS5NH4L1"></script>
    <script>window.dataLayer = window.dataLayer || []; function gtag(){{dataLayer.push(arguments);}} gtag('js', new Date()); gtag('config', 'G-B1HS5NH4L1');</script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{e(title)}</title>
    <meta name="description" content="{e(desc)}">
    <link rel="canonical" href="{e(canon)}">
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <meta property="og:title" content="{e(title)}">
    <meta property="og:description" content="{e(desc)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{e(canon)}">
    <meta property="og:image" content="{e(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{e(image)}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
{extra}"""


def card(L, h='h3'):
    return (f'<a class="ls-card" href="/lessons/{e(L["id"])}.html">'
            f'<div class="ls-th" style="background-image:url({thumb(L["id"])})"><span class="pl"><i class="fas fa-play"></i></span><span class="dur">{mmss(L["dur"])}</span></div>'
            f'<div class="ls-cb"><span class="tag">{e(CAT_NAME.get(L["cat"], ""))} · {e(L.get("level", ""))}</span><{h}>{e(L["title"])}</{h}><p>{e(L["short"])}</p></div></a>')


def page_lesson(L, all_lessons, shell_parts):
    style, header, footer, burger = shell_parts
    vid = L['id']
    canon = f'{SITE}/lessons/{vid}.html'
    desc = L['short'] + ' ' + ' · '.join(L.get('learn', [])[:3])
    title = f'{L["title"]} | 기타 강좌 | 안쌤의 기타나무숲'
    ld = {
        '@context': 'https://schema.org', '@type': 'VideoObject', 'name': L['title'], 'description': desc,
        'thumbnailUrl': [thumb(vid, 'maxresdefault'), thumb(vid)], 'uploadDate': L['date'],
        'duration': iso_dur(L['dur']), 'embedUrl': f'https://www.youtube.com/embed/{vid}',
        'contentUrl': f'https://www.youtube.com/watch?v={vid}',
        'author': {'@type': 'Person', 'name': '안규호(안쌤)', 'url': SITE + '/'}}
    extra = (f'    <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n'
             f'    <style>{style}{CSS}</style>\n    <script src="/auth.js?v=2026111601" defer></script>\n</head>\n<body>\n')
    o = [head(title, desc, canon, thumb(vid, 'maxresdefault'), extra), header]
    o.append('<main class="ls-wrap">')
    o.append(f'<div class="ls-crumb"><a href="/lessons.html">강좌 &amp; 레슨</a> › {e(CAT_NAME.get(L["cat"], ""))}</div>')
    o.append(f'<h1 class="ls-title">{e(L["title"])}</h1>')
    d = L['date']
    o.append(f'<div class="ls-meta"><span class="lv">{e(L.get("level", ""))}</span><span><i class="far fa-clock"></i> 영상 {dur_text(L["dur"])}</span>'
             f'<span>{int(d[:4])}.{int(d[5:7])}.{int(d[8:10])}</span><span>{e(CAT_NAME.get(L["cat"], ""))}</span></div>')
    o.append('<div class="ls-body"><div class="ls-side">')
    o.append(f'<div class="ls-vid" id="lsVid" data-v="{e(vid)}" data-title="{e(L["title"])}" style="background-image:url({thumb(vid, "maxresdefault")}),url({thumb(vid)})">'
             f'<button type="button" class="play" aria-label="영상 재생"><span><i class="fas fa-play"></i></span></button></div>')
    secs = L.get('sections', [])
    o.append('<div class="ls-chap"><b>영상 목차 · 누르면 그 장면으로</b>' + ''.join(
        f'<button type="button" data-t="{int(s.get("t", 0))}"><em>{mmss(s.get("t", 0))}</em>{e(s["h"])}</button>' for s in secs) + '</div>')
    tools = LESSON_TOOLS.get(vid, [])
    if tools:
        o.append('<div class="ls-tools">' + ''.join(
            f'<a href="/tools.html?tool={t}"><i class="fas {TOOL_NAME[t][1]}"></i>{TOOL_NAME[t][0]} 열기</a>' for t in tools) + '</div>')
    o.append(f'<div class="ls-tools"><a href="https://www.youtube.com/watch?v={e(vid)}" target="_blank" rel="noopener" style="color:#c4302b"><i class="fab fa-youtube"></i>유튜브에서 보기</a></div>')
    o.append('</div><article class="ls-art">')
    if L.get('learn'):
        o.append('<div class="ls-learn"><b>이 영상에서 배우는 것</b><ul>' + ''.join(f'<li>{e(x)}</li>' for x in L['learn']) + '</ul></div>')
    for s in secs:
        o.append(f'<h2><button type="button" class="ts" data-t="{int(s.get("t", 0))}" aria-label="영상 {mmss(s.get("t", 0))}부터 보기">▶ {mmss(s.get("t", 0))}</button>{e(s["h"])}</h2>')
        o.extend(f'<p>{e(p)}</p>' for p in s.get('p', []))
        o.extend(f'<div class="ls-tip"><i class="fas fa-lightbulb"></i>{e(t)}</div>' for t in s.get('tips', []))
    if L.get('practice'):
        o.append('<h2>이렇게 연습해 보세요</h2><ol>' + ''.join(f'<li>{e(x)}</li>' for x in L['practice']) + '</ol>')
    if L.get('mistakes'):
        o.append('<h2>자주 하는 실수</h2><ul>' + ''.join(f'<li>{e(x)}</li>' for x in L['mistakes']) + '</ul>')
    o.append(f'<p class="ls-note">이 글은 안쌤(안규호)의 유튜브 강좌 「{e(L.get("yt_title") or L["title"])}」({d[:4]}.{int(d[5:7])}.{int(d[8:10])}) 내용을 글로 정리한 것이에요. '
             '설명과 시연은 영상에서 함께 보세요.</p>')
    o.append('</article></div>')
    i = [x['id'] for x in all_lessons].index(vid)
    pv, nx = (all_lessons[i - 1] if i > 0 else None), (all_lessons[i + 1] if i + 1 < len(all_lessons) else None)
    o.append('<div class="ls-pn">' + (f'<a href="/lessons/{pv["id"]}.html"><small>‹ 이전 강좌</small>{e(pv["title"])}</a>' if pv else '<span></span>')
             + (f'<a class="nx" href="/lessons/{nx["id"]}.html"><small>다음 강좌 ›</small>{e(nx["title"])}</a>' if nx else '') + '</div>')
    same = [x for x in all_lessons if x['cat'] == L['cat'] and x['id'] != vid]
    rest = [x for x in all_lessons if x['cat'] != L['cat'] and x['id'] != vid]
    o.append('<section class="ls-more"><h2>다른 강좌</h2><div class="ls-grid">' + ''.join(card(x) for x in (same + rest)[:6]) + '</div></section>')
    o.append('</main>')
    o.append(footer)
    o.append(f'<script>{JS}</script>\n{burger}\n</body>\n</html>\n')
    return '\n'.join(o)


def page_list(lessons, shell_parts):
    style, header, footer, burger = shell_parts
    canon = f'{SITE}/lessons.html'
    title = '강좌 & 레슨 | 기타 입문·테크닉·장비 강좌 | 안쌤의 기타나무숲'
    desc = '기타 튜닝·코드·오른손·크로매틱부터 파워코드·쨉쨉이·즉흥연주, 앰프·멀티이펙터·오디오 인터페이스까지. 안쌤의 유튜브 기타 강좌를 영상과 함께 글로 정리했어요.'
    ld = {'@context': 'https://schema.org', '@type': 'ItemList', 'name': '안쌤의 기타 강좌',
          'itemListElement': [{'@type': 'ListItem', 'position': n + 1, 'url': f'{SITE}/lessons/{L["id"]}.html', 'name': L['title']} for n, L in enumerate(lessons)]}
    extra = (f'    <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n'
             f'    <style>{style}{CSS}</style>\n    <script src="/auth.js?v=2026111601" defer></script>\n</head>\n<body>\n')
    o = [head(title, desc, canon, thumb(lessons[0]['id'], 'maxresdefault'), extra), header, '<main class="ls-wrap">']
    o.append('<div class="ls-hero"><small>LESSONS</small><h1>강좌 &amp; 레슨</h1>'
             f'<p>유튜브 채널 기타나무숲의 강좌 {len(lessons)}편을 영상과 함께 글로 정리했어요. 영상을 보면서 옆의 글로 요점을 다시 확인하고, '
             '소제목의 시간을 누르면 그 장면부터 볼 수 있어요.</p>'
             f'<a class="yt-link" href="{PLAYLIST}" target="_blank" rel="noopener"><i class="fab fa-youtube"></i>유튜브 재생목록으로 보기</a></div>')
    used = [c for c in CATS if any(L['cat'] == c[0] for L in lessons)]
    o.append('<div class="ls-chips">' + ''.join(f'<a href="#cat-{k}">{n}</a>' for k, n, _ in used) + '</div>')
    for k, n, ic in used:
        o.append(f'<h2 class="ls-cat" id="cat-{k}"><i class="fas {ic}"></i>{n}</h2><div class="ls-grid">'
                 + ''.join(card(L) for L in lessons if L['cat'] == k) + '</div>')
    o.append('</main>')
    o.append(footer)
    o.append(f'{burger}\n</body>\n</html>\n')
    return '\n'.join(o)


def index_block(lessons):
    # 메인 '강좌 & 레슨' 칸 — 입문 기초부터 6개 + 더보기
    order = sorted(lessons, key=lambda L: ([c[0] for c in CATS].index(L['cat']), L.get('order', 0)))
    cards = ''.join(card(L) for L in order[:6])
    return ('<section class="sec bg-white" id="lessons" style="padding: 44px 0;">\n<div class="wrap">\n'
            '<div class="col-hd"><small>LESSONS</small><h2>강좌 &amp; 레슨</h2><span style="color:#999;font-size:13px;">영상 + 글로 정리한 기타 강좌</span>'
            f'<a class="more" href="/lessons.html">더보기 <i class="fas fa-chevron-right"></i></a></div>\n'
            f'<div class="ls-grid">{cards}</div>\n</div>\n</section>')


def main():
    lessons = json.load(open(os.path.join(ROOT, 'data/lessons.json'), encoding='utf-8'))
    parts = shell()
    os.makedirs(os.path.join(ROOT, 'lessons'), exist_ok=True)
    for L in lessons:
        with open(os.path.join(ROOT, 'lessons', L['id'] + '.html'), 'w', encoding='utf-8') as f:
            f.write(page_lesson(L, lessons, parts))
    with open(os.path.join(ROOT, 'lessons.html'), 'w', encoding='utf-8') as f:
        f.write(page_list(lessons, parts))
    ip = os.path.join(ROOT, 'index.html')
    s = open(ip, encoding='utf-8').read()
    a, b = '<!-- LESSONS:START -->', '<!-- LESSONS:END -->'
    if a in s and b in s:
        s = s[:s.index(a) + len(a)] + '\n' + index_block(lessons) + '\n' + s[s.index(b):]
        open(ip, 'w', encoding='utf-8').write(s)
    for L in lessons:
        print(f'{L["id"]}  {chars(L):>5}자  {L["title"]}')
    print(f'강좌 {len(lessons)}편 → lessons.html + lessons/*.html' + (' + 메인 칸' if a in s else ''))


if __name__ == '__main__':
    main()
