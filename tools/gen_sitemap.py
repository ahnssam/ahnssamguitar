#!/usr/bin/env python3
"""sitemap.xml 만들기 (2026-11-18)

애드센스 '가치가 별로 없는 콘텐츠' 반려(2026-11-17) 대책 1번:
- 예전 사이트맵에는 악보 상세 페이지가 하나도 없었고, 없는 주소(tab-detail.html?id=1)만 들어 있었다.
- 이제 공개된 악보 상세 페이지를 모두 넣는다(주소 = 상세 페이지가 canonical 로 거는 주소와 같은 꼴).

새 악보를 공개하거나 페이지를 더하면 다시 돌린다:
    python3 tools/gen_sitemap.py
공개 목록은 사이트와 같은 공개 키(sb_publishable_…, 읽기 전용·공개 값)로 읽는다.

같이 하는 일 (2026-11-19): tab-detail.html 의 <!-- SEO:START --> ~ <!-- SEO:END --> 사이에
공개 악보 이름표(id → 곡명·가수·종류·쪽·난이도·카포·값)를 채운다. 구글이 페이지를 그릴 때
Supabase 악보 요청을 건너뛰어도('기타 오류') 제목·표준 주소가 그 악보 것이게.
"""
import json
import os
import urllib.request
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://ahnssamguitar.com'
SB_URL = 'https://qpcbrqgqylxkgdwoflku.supabase.co'
SB_KEY = 'sb_publishable_5rr-OZ7Sqjk1nXn59R7XnQ_HInATuSV'   # 사이트 페이지에 그대로 있는 공개 키

# 고정 페이지: (주소, 마지막으로 크게 바뀐 날, 바뀌는 빈도, 우선순위)
PAGES = [
    ('/', None, 'weekly', '1.0'),
    ('/tools.html', '2026-11-13', 'weekly', '0.9'),
    ('/requests.html', '2026-11-05', 'daily', '0.8'),
    ('/session-gallery.html', '2026-04-26', 'monthly', '0.7'),
    ('/play/', '2026-11-16', 'weekly', '0.8'),
    ('/play/guitar.html', '2026-11-17', 'weekly', '0.8'),
    ('/play/quiz.html', '2026-11-15', 'weekly', '0.7'),
    ('/play/worldcup.html', '2026-11-14', 'weekly', '0.7'),
    ('/play/boom.html', '2026-11-15', 'monthly', '0.6'),
    ('/legal/terms.html', '2026-11-11', 'yearly', '0.3'),
    ('/legal/privacy.html', '2026-11-11', 'yearly', '0.3'),
]


def sheets():
    req = urllib.request.Request(
        SB_URL + '/rest/v1/sheets?select=id,updated_at,title,artist,style,kind,pages,difficulty,capo,price&published=eq.true&order=updated_at.desc',
        headers={'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    rows = sheets()
    today = date.today().isoformat()
    newest = max((r['updated_at'][:10] for r in rows), default=today)
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    def url(loc, lastmod, freq, prio):
        out.append('    <url>')
        out.append(f'        <loc>{SITE}{loc}</loc>')
        if lastmod:
            out.append(f'        <lastmod>{lastmod}</lastmod>')
        out.append(f'        <changefreq>{freq}</changefreq>')
        out.append(f'        <priority>{prio}</priority>')
        out.append('    </url>')

    for loc, lm, freq, prio in PAGES:
        url(loc, lm or newest, freq, prio)   # 메인은 가장 최근에 바뀐 악보 날짜
    # 강좌 & 레슨 (2026-11-18) — data/lessons.json (tools/gen_lessons.py 가 만든 페이지)
    try:
        lessons = json.load(open(os.path.join(ROOT, 'data/lessons.json'), encoding='utf-8'))
    except FileNotFoundError:
        lessons = []
    if lessons:
        url('/lessons.html', today, 'weekly', '0.9')
        for L in lessons:
            url(f'/lessons/{L["id"]}.html', L.get('date'), 'monthly', '0.8')
    # 악보 상세 — tab-detail.html 의 setSeo() 가 거는 canonical 과 같은 주소
    for r in rows:
        url('/tab-detail.html?id=' + r['id'], r['updated_at'][:10], 'monthly', '0.6')
    out.append('</urlset>')
    path = os.path.join(ROOT, 'sitemap.xml')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out) + '\n')
    n = len(PAGES) + len(rows) + (len(lessons) + 1 if lessons else 0)
    print(f'sitemap.xml: 고정 페이지 {len(PAGES)} + 강좌 {len(lessons) + 1 if lessons else 0} + 악보 {len(rows)} = {n}개')
    seo_map(rows)


def seo_map(rows):
    """tab-detail.html 안 SEO_MAP 채우기 — 값: [곡명, 가수, 종류, kind, 쪽, 난이도, 카포, 값]"""
    m = {r['id']: [r.get('title') or '', r.get('artist') or '', r.get('style') or '', r.get('kind') or '',
                   r.get('pages'), r.get('difficulty'), r.get('capo'), r.get('price')]
         for r in sorted(rows, key=lambda r: r['id'])}
    js = json.dumps(m, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    path = os.path.join(ROOT, 'tab-detail.html')
    html = open(path, encoding='utf-8').read()
    a, b = '<!-- SEO:START -->', '<!-- SEO:END -->'
    i, j = html.index(a) + len(a), html.index(b)
    head = html[:i] + '\n    <script>window.SEO_MAP=' + js + ';</script>\n    '
    html = head + html[j:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'tab-detail.html: 악보 이름표 {len(m)}곡 ({len(js) // 1024}KB)')


if __name__ == '__main__':
    main()
