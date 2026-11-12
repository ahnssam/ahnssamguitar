# 기타 키우기 공유용 페이지·썸네일 만들기 (2026-11-12 사용자: 카톡으로 공유하면 방금 공유한 기타가 썸네일로 뜨게)
#   카톡·문자·인스타 미리보기는 링크 페이지의 og:image 를 읽는다(자바스크립트는 안 돌린다).
#   그래서 계열 8 × 단계 21 = 168개의 작은 페이지(play/gk/s/<계열>-<단계>.html)와 썸네일(images/play/gk/share/<계열>-<단계>.jpg)을 미리 만든다.
#   페이지는 열자마자 기타 키우기(play/guitar.html)로 넘어간다(주소 뒤 ?vs= 같은 것은 그대로 넘김).
# 다시 만들기: 새 단계 그림이 오거나 이름이 바뀌면  python -X utf8 tools/gk_share.py
#   이름·그림 접두어는 play/guitar-mockup.html 의 FAMS·GEAR 에서 읽는다(공개하면 guitar.html).
import re, os, sys, colorsys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = 'play/guitar.html' if '--public' in sys.argv else 'play/guitar-mockup.html'
SITE = 'https://ahnssamguitar.com'
FONT_B = 'C:/Windows/Fonts/malgunbd.ttf'
FONT_R = 'C:/Windows/Fonts/malgun.ttf'
W, H = 800, 420
SHARE_V = 2   # 썸네일 그림을 바꾸면 올린다 — 카톡이 og:image 를 주소로 기억해서(2026-11-12 몸통 클로즈업으로 바꿈)

src = open(os.path.join(ROOT, GAME), encoding='utf8').read()

def names_after(label):
    i = src.index(label); j = src.index('names: [', i) + len('names: [')
    k = src.index(']', j)
    return re.findall(r"'([^']*)'", src[j:k])

def art_info(label):   # 그 계열 줄 뒤에서 처음 나오는 art·artMax
    m = re.compile(r"art: '(\w+)', artMax: (\d+)").search(src, src.index(label))
    return m.group(1), int(m.group(2))

FAMS = {}
for key, label, nm in [('strat', "strat: { name: '스트랫'", '스트랫'), ('tele', "tele: { name: '텔레'", '텔레'), ('lespaul', "lespaul: { name: '레스폴'", '레스폴'),
                       ('superstrat', "superstrat: { name: '슈퍼스트랫'", '슈퍼스트랫'), ('acoustic', "acoustic: { name: '통기타'", '통기타'), ('bass', "bass: { name: '베이스'", '베이스')]:
    art, amax = art_info(label)
    FAMS[key] = dict(name=nm, names=names_after(label), art=art, artMax=amax, sq=False)
for key, glabel, flabel, nm in [('amp', "amp: { name: '앰프', art: 'amp'", "FAMS.amp = {", '앰프'), ('multi', "fx: { name: '멀티이펙터', art: 'fx'", "FAMS.multi = {", '멀티이펙터')]:
    art, amax = art_info(flabel)
    FAMS[key] = dict(name=nm, names=names_after(glabel), art=art, artMax=amax, sq=True)

bg = Image.open(os.path.join(ROOT, 'images/play/gk/bg_workshop.webp')).convert('RGB')
bw = bg.width; bh = round(bw * H / W)
bg = bg.crop((0, 380, bw, 380 + bh)).resize((W, H), Image.LANCZOS)
bg = Image.eval(bg, lambda v: int(v * 0.62))

def hue_of(img):
    small = img.resize((28, 42)); bins = [0.0] * 24
    for r, g, b, a in small.getdata():
        if a < 200: continue
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if s < 0.25: continue
        bins[int(h * 24) % 24] += s * (1 if 0.15 < l < 0.9 else 0.3)
    return (bins.index(max(bins)) + 0.5) / 24 if max(bins) > 0 else 0.12

def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(' '), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= maxw: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

fB = lambda n: ImageFont.truetype(FONT_B, n)
fR = lambda n: ImageFont.truetype(FONT_R, n)
os.makedirs(os.path.join(ROOT, 'images/play/gk/share'), exist_ok=True)
os.makedirs(os.path.join(ROOT, 'play/gk/s'), exist_ok=True)

count = 0
for fam, F in FAMS.items():
    for lv in range(21):
        n = min(lv, F['artMax'])
        art = Image.open(os.path.join(ROOT, f"images/play/gk/{F['art']}_{n:02d}.webp")).convert('RGBA')
        # 그림 틀에서 기타(물건)가 있는 곳만: 기타 448×672 은 몸통+헤드가 y 208~608, 정사각형 448×448 은 바닥이 y 430
        #   2026-11-12 사용자: 카톡 썸네일에서 기타를 더 크게, 몸통 쪽으로 클로즈업 → 기타는 넥 가운데(y 280)부터 아래만 1.1배,
        #   앰프·멀티는 1.05배. 몸통 아래 끝이 썸네일 y 400 에 온다(예전에는 헤드까지 다 보이게 0.74배)
        cx, base = 225, H - 12
        if not F['sq']:
            piece = art.crop((60, 280, 388, 672)); k = 1.1; foot = 608 - 280
        else:
            piece = art.crop((34, 60, 414, 448)); k = 1.05; foot = 430 - 60
        pw, ph = round(piece.width * k), round(piece.height * k)
        piece = piece.resize((pw, ph), Image.LANCZOS)
        top = 400 - round(foot * k)
        im = bg.copy().convert('RGBA')
        if lv >= 10:   # +10부터 그 색으로 빛나게(게임 속 아우라처럼)
            hue = hue_of(art)
            r, g, b = [int(v * 255) for v in colorsys.hls_to_rgb(hue, 0.6, 0.95)]
            glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
            rad = 150 if lv < 15 else 175 if lv < 20 else 205
            gd.ellipse((cx - rad * 0.75, H / 2 - rad, cx + rad * 0.75, H / 2 + rad), fill=(r, g, b, 150 if lv < 20 else 200))
            im = Image.alpha_composite(im, glow.filter(ImageFilter.GaussianBlur(48)))
        sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
        sd.ellipse((cx - 95, base - 16, cx + 95, base + 10), fill=(0, 0, 0, 140))
        im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(8)))
        layer = Image.new('RGBA', (W, H)); layer.paste(piece, (cx - pw // 2, top)); im = Image.alpha_composite(im, layer)
        d = ImageDraw.Draw(im)
        x0 = 430
        badge = f'+{lv}'
        bf = fB(40); tw = d.textlength(badge, font=bf)
        col = (240, 89, 43) if lv < 10 else (214, 158, 30) if lv < 20 else (140, 70, 220)
        d.rounded_rectangle((x0, 70, x0 + tw + 34, 70 + 58), radius=29, fill=col)
        d.text((x0 + 17, 70 + 4), badge, font=bf, fill='white')
        d.text((x0 + tw + 50, 70 + 14), F['name'], font=fB(24), fill=(255, 226, 150))
        name = F['names'][lv]
        nf = fB(34); lines = wrap(d, name, nf, W - x0 - 30)
        if len(lines) > 3: nf = fB(28); lines = wrap(d, name, nf, W - x0 - 30)
        y = 150
        for L in lines[:4]:
            d.text((x0, y), L, font=nf, fill='white', stroke_width=3, stroke_fill=(20, 12, 6)); y += nf.size + 10
        d.text((x0, H - 74), '기타 키우기', font=fB(24), fill=(255, 210, 100))
        d.text((x0, H - 42), '안쌤의 기타나무숲 놀이터', font=fR(18), fill=(230, 220, 200))
        out = f'{fam}-{lv}'
        im.convert('RGB').save(os.path.join(ROOT, f'images/play/gk/share/{out}.jpg'), 'JPEG', quality=82, optimize=True, progressive=True)
        title = f'+{lv} {name}'
        html = f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} | 기타 키우기</title>
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="안쌤의 기타나무숲">
<meta property="og:title" content="{title}">
<meta property="og:description" content="안쌤 놀이터 '기타 키우기'에서 키운 {F['name']}. 나도 키워 보기 →">
<meta property="og:image" content="{SITE}/images/play/gk/share/{out}.jpg?v={SHARE_V}">
<meta property="og:image:width" content="{W}"><meta property="og:image:height" content="{H}">
<meta property="og:url" content="{SITE}/play/gk/s/{out}.html">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=../../guitar.html">
<script>location.replace('../../' + (/[?&]mock=1/.test(location.search) ? 'guitar-mockup.html' : 'guitar.html') + location.search + location.hash);</script>
</head><body><p><a href="../../guitar.html">기타 키우기로 가기</a></p></body></html>
'''
        open(os.path.join(ROOT, f'play/gk/s/{out}.html'), 'w', encoding='utf8', newline='\n').write(html)
        count += 1
print('만든 수', count)
