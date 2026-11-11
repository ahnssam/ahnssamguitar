# 기타 키우기 — ChatGPT 그림 프롬프트 (스트랫 몸통 + 꾸밈말 부품)

`play/guitar.html`의 지금 그림은 임시다. 몸통은 라스트 기타리스트의 `item_strat.png`(19×50)이고, 단계마다 붙는 부품(녹, 스티커, 넥, 날개, 냉장고 문 …)은 코드로 점을 찍어 그렸다.
이 시트로 ChatGPT에서 뽑아 주면 Claude가 잘라서 줄이고(nearest neighbor) `images/play/gk/`에 넣고 코드에 연결한다.

## 0. 쓰는 법

1. **ChatGPT 새 대화 하나에서 전부 뽑는다.** 첫 메시지로 [1. 스타일 고정]을 보낸다. 같은 대화 안에서 뽑아야 크기·그림체가 맞는다.
2. **몸통(시트 A)부터.** 마음에 드는 스트랫이 나오면 그 뒤로는 "위의 그 기타"라고 부르며 부품 시트를 뽑는다.
3. **투명 배경.** 투명이 안 나오면 `transparent background`를 `solid flat #FF00FF magenta background`로 바꿔 다시 뽑는다.
4. **비율**은 각 시트 위에 적었다(가로 1536×1024 / 세로 1024×1536).
5. 뽑은 원본은 아무 폴더에나 두고 경로를 알려 주면 된다(예: `~/Developer/lastguitarist/image/gpt/`).
6. 글자·로고가 들어간 장은 다시 뽑는다. 실제 브랜드 헤드 모양이 그대로 나와도 다시 뽑는다(CLAUDE.md 놀이터 패러디 규칙).

### 크기 기준
- 지금 코드는 **56×84 칸** 캔버스에 기타 몸통 **19×50**을 (18, 26)에 놓고, 부품을 그 둘레에 붙인다.
- 새 그림은 **두 배 칸(112×168, 몸통 약 38×100)** 으로 받는 걸 권한다. 몸통이 지금보다 또렷해진다. 그러면 Claude가 부품 위치를 두 배로 바꾼다.
- 아래 표의 '목표 크기'는 두 배 칸 기준이다.

## 1. 스타일 고정 (대화 첫 메시지)

```
I'm making a small mobile pixel-art game called "Guitar Upgrade": you start with a cheap used electric guitar and upgrade it step by step, and every step bolts a sillier part onto it (stickers, an extra neck, LEDs, flames, a fridge door, angel wings, a satellite dish...). For EVERY image in this chat, follow this style guide:

- 16-bit era pixel art with big, chunky, clearly visible square pixels, as if drawn on a small grid and enlarged with nearest-neighbor scaling. No anti-aliasing, no blur, no soft gradients (dithering is OK).
- 1-pixel dark outline (#0e1614) around every object.
- Flat shading with 3-4 tones per color, light coming from the top-left.
- Palette: near-black #0e1614, dark panel #1d2a26, deep green #2a6b4a, green #52a872, mint #72c492, cream #e8f0ec, yellow #f5b31e, red #c44034, cherry #8d3142, blue #2f7fbf, wood #8a5a3a, maple #e6ad74, steel grey #7a7b7d. Other colors only when an object needs them.
- Simple, bold shapes that still read when shrunk very small.
- Tone: deadpan comedy. Parts look hand-made and a bit ridiculous, never scary.
- NEVER draw text, letters, numbers, logos, brand names or watermarks. Guitars must be ORIGINAL designs: never copy a real brand's headstock shape or logo.
- Every object is drawn straight-on from the front, on a transparent background, with no shadow on the ground.

Reply only "OK" and wait for my requests.
```

## 2. 시트 A — 스트랫 몸통 (세로 1024×1536)

```
A single electric guitar standing perfectly upright, neck pointing straight up, seen exactly from the front, centered, transparent background.
Double-cutaway contoured solid body in cherry red (#8d3142) with a cream pickguard, three single-coil pickups, a tremolo arm, a maple neck with dark fret dots, and six tuners in one line on an ORIGINAL rounded headstock shape (not any real brand's headstock). No logo, no writing.
The whole guitar must still read clearly when shrunk to 38x100 pixels. Leave empty space around it.
```

다 되면 같은 대화에서 아래 두 장도 뽑아 두면 좋다(+0 '중고나라에서 온', 부서짐 연출용).

```
The same guitar from above, exactly the same size and pose, but old and dusty: dull grey dust specks on the body, slightly yellowed pickguard, a small blank white paper price tag hanging from the headstock on a string. Transparent background.
```

```
The same guitar smashed into 7 separate broken pieces laid out in a row with space between them: the headstock with a snapped bit of neck, two splintered neck pieces, the upper body horn, the lower body, two cracked pickguard fragments, plus a few small wood splinters and a loose curled string. Same pixel scale as the guitar. Transparent background.
```

## 3. 부품 시트 (가로 1536×1024)

모든 부품 시트 앞에 이 줄을 붙인다:

```
Sprite sheet of separate add-on parts for the guitar above, drawn at EXACTLY the same pixel scale as that guitar, arranged in a grid with lots of empty space between items, each item centered in its own cell. Transparent background, no text, no shadows.
```

### 시트 B — +1 ~ +8

```
Top row, left to right:
1. A short vertical strip of six thin guitar strings, the same length as the guitar's neck, covered in orange-brown rust spots.
2. Five small cartoon stickers: a yellow star, a blue lightning bolt, a pink heart, a green smiley circle and a red skull-and-crossbones, each a different bright color with a white sticker border.
3. A small silver wrench next to a 4-point white sparkle (two sizes of the sparkle).
4. Three shiny gold single-coil pickup covers, side by side, each the width of the guitar body's pickups.
Bottom row, left to right:
5. One extra guitar neck with its own headstock and tuners (same maple neck and original headstock as the guitar above), standing upright on its own.
6. Six tiny glitter sparkles in white and pale yellow, in 3 sizes.
7. A curved strip of tiny square LED lights in rainbow colors that follows the outline of the guitar body's lower half, plus the same strip with every other LED turned off.
8. A small round black speaker grille the size of a coin, with a metal rim, plus three green curved sound-wave arcs.
```

### 시트 C — +10 ~ +15

```
Top row, left to right:
1. Three animation frames of a flame burst shooting straight up, as if coming out of the top of a guitar headstock: yellow core, orange middle, red tips, a few sparks.
2. A small white refrigerator door with a long vertical handle, a freezer line near the top and two tiny fridge magnets (one red, one blue), sized to cover the right half of the guitar body.
3. Two animation frames of a pair of white feathered angel wings spread to the sides (frame 1 wings up, frame 2 wings down), with a gap in the middle where the guitar goes.
Bottom row, left to right:
4. A tall grey concrete utility pole with a wooden crossbar, four white insulators and black power lines drooping out to both sides. Much taller than the guitar.
5. A tiny white satellite dish on a short arm, plus three green signal arcs in growing sizes.
6. Three floating music notes in cream and yellow: a single eighth note, two beamed eighth notes, a quarter note.
```

### 시트 D — +16 ~ +20, 하드케이스·튜너

```
Top row, left to right:
1. Two animation frames of a jagged yellow lightning bolt striking down diagonally, plus a small black scorch mark.
2. A thin pale-blue planetary ring seen at an angle (a flat ellipse), drawn as two separate halves (back half and front half), plus a small yellow moon and a few tiny white stars.
3. A floating golden halo (flat ellipse) and a small golden crown with one red and one blue gem.
4. A rainbow glow outline shaped like the guitar's silhouette, as a thin 2-pixel aura only (the guitar itself not drawn).
Bottom row, left to right:
5. A closed black hard-shell guitar case with silver latches and a handle, standing upright.
6. The same hard case shattered into 6 broken pieces with a few silver latch bits.
7. Three guitar tuners side by side: a small clip-on tuner, a stomp-box pedal tuner with a needle display, and a larger strobe tuner with a striped display. Displays show only a needle or light bars, no letters.
8. A small pile of broken red guitar fragments, wood splinters and a curled string (used as a UI icon).
```

## 4. 부품 표 (두 배 칸 기준 목표 크기)

| 단계 | 꾸밈말 | 부품 | 붙는 곳 | 목표 크기(px) |
|---|---|---|---|---|
| +0 | 중고나라에서 온 | 먼지·가격표 (시트 A 둘째 장) | 몸통 전체 | 38×100 |
| +1 | 줄 녹슨 | 녹슨 줄 (B1) | 넥 위 | 6×56 |
| +2 | 줄 새로 간 | (코드로 반짝이는 줄) | 넥 위 | — |
| +3 | 스티커 덕지덕지 붙인 | 스티커 5개 (B2) | 몸통 | 각 4×4 ~ 6×6 |
| +4 | 셋업 받은 | 렌치·반짝 (B3) | 넛 근처 | 8×8 |
| +5 | 픽업 세 개 다 바꾼 | 금색 픽업 (B4) | 픽업 자리 | 각 12×3 |
| +6 | 넥 하나 더 단 | 넥 (B5) | 왼쪽 | 12×60 |
| +7 | 반짝이 칠한 | 반짝이 (B6) | 몸통 곳곳 | 2×2 ~ 4×4 |
| +8 | LED 박은 | LED 띠 (B7) | 몸통 테두리 | 38×40 |
| +9 | 앰프 내장된 | 스피커·소리 물결 (B8) | 몸통 왼쪽 아래 | 10×10 |
| +10 | 암 흔들면 불 뿜는 | 불꽃 3장 (C1) | 헤드 위 | 14×18 |
| +11 | 넥 세 개 달린 | 넥 (B5 다시) | 오른쪽 | 12×60 |
| +12 | 냉장고 문 달린 | 냉장고 문 (C2) | 몸통 오른쪽 | 16×36 |
| +13 | 날개 돋친 | 날개 2장 (C3) | 몸통 양옆 | 64×30 |
| +14 | 전봇대만 한 | 전봇대 (C4) | 뒤 | 112×168 |
| +15 | 암으로 위성 신호 잡는 | 위성 안테나·신호 (C5) | 헤드 오른쪽 | 12×10 |
| +16 | 관객이 따라 부르는 | 음표 3개 (C6) | 둘레에 떠다님 | 각 6×10 |
| +17 | 번개 맞은 | 번개 2장 (D1) | 왼쪽 위 → 헤드 | 30×50 |
| +18 | 우주에서 돌아온 | 고리·달·별 (D2) | 몸통 둘레 | 64×16 |
| +19 | 전설이 된 | 후광 (D3) | 헤드 위 | 12×4 |
| +20 | 라스트 | 왕관·무지개 빛 (D3·D4) | 헤드 위·둘레 | 12×10 |
| 부서짐 | — | 조각 7개 (시트 A 셋째 장) | 터지는 연출 | 몸통과 같은 비율 |
| 하드케이스 | — | 닫힌 케이스·부서진 케이스 (D5·D6) | 막았을 때 연출, 아이콘 | 24×64 |
| 튜너 | — | 클립·페달·스트로보 (D7) | 상점 아이콘 | 긴 변 64 |

## 5. 다음 계열 (나중에)

스트랫이 자리 잡으면 시트 A만 바꿔 같은 방법으로 뽑는다. 부품은 계열이 같이 쓴다.
- 텔레(캐스타): single-cutaway flat slab body, butterscotch blonde, black pickguard, two single-coil pickups, metal bridge plate
- 레스폴: single-cutaway carved-top body, two humbuckers, cream binding
- 슈퍼스트랫: thin body with two sharp pointed horns, two humbuckers, locking tremolo
- 통기타: dreadnought acoustic, round soundhole
- 앰프: small tube amp head on a speaker cabinet (세로로 세운 기타 대신 정면 박스)
