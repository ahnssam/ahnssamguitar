# 기타 키우기 — ChatGPT 그림 프롬프트 (스트랫 21단계)

2026-11-12 바뀐 것 (사용자 결정)
- **픽셀아트가 아니어도 된다.** 라스트 기타리스트는 도트였지만 이 게임은 그럴 필요 없다. 굵은 외곽선의 깔끔한 모바일 게임 아이템 그림으로 뽑는다.
- **단계마다 기타 한 대를 통째로 그린다.** 예전처럼 몸통에 부품을 겹치지 않는다. 검키우기처럼 단계마다 다른 이름, 다른 모습이다.
- 새 그림이 오면 Claude가 잘라서 `images/play/gk/`에 넣고, 목업(`play/guitar-mockup.html`)의 도트 대신 그 그림을 띄운다.
- **① +0~+9는 2026-11-12 받아서 넣었다**(`strat_00`~`09.webp`). 남은 것은 ② +10~+19와 ③ +20 — ①을 뽑은 **같은 대화**에 붙여 넣는다.

## 0. 쓰는 법

1. ChatGPT **새 대화**에 아래 ①을 통째로 붙여 넣는다. 기타 10대가 한 장에 나온다.
2. 마음에 들면 **같은 대화**에 ②, 그다음 ③을 붙여 넣는다. 같은 대화에서 뽑아야 그림체와 크기가 맞는다.
3. 배경이 투명하게 안 나오면 "배경만 투명하게 다시"라고 하거나, 흰 배경 그대로 둬도 된다(Claude가 오려 낸다).
4. 글자·숫자·로고, 실제 브랜드 헤드 모양이 나오면 다시 뽑는다.
5. 뽑은 그림을 아무 폴더에 두고 경로를 알려 주면 Claude가 잘라서 목업에 연결한다.

## 1. 단계별 이름 (목업 `FAMS.strat.names`)

+0~+9는 개그, +10부터 신비한 느낌, +20은 그 기타로 유명한 기타리스트 이름을 살짝 바꾼다(레스폴이면 '게리 무르의 레스폴').

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 중고나라에서 온 스트랫 | 먼지·흠집, 누런 픽가드, 가격표 |
| +1 | 손끝까지 녹물 드는 스트랫 | 녹슨 줄, 녹물 자국 |
| +2 | 줄 갈았더니 드디어 소리 나는 스트랫 | 반짝이는 새 줄 |
| +3 | 형준이 스티커가 안 떨어지는 스트랫 | 덕지덕지 스티커 |
| +4 | 박 사장이 한숨 쉬며 셋업한 스트랫 | 반질반질, 렌치, 빈 메모지 |
| +5 | 금빛 픽업에서 윙 소리 나는 스트랫 | 금색 픽업, 윙윙 선 |
| +6 | 넥이 하나 더 자란 스트랫 | 가지처럼 자란 작은 넥 |
| +7 | 반짝이 뿌려서 눈부신 스트랫 | 온몸 반짝이 |
| +8 | 밤마다 혼자 깜빡이는 스트랫 | 테두리 LED |
| +9 | 아무도 안 꽂았는데 소리 나는 스트랫 | 빠진 케이블, 스피커에서 유령 같은 소리 물결 |
| +10 | 꺼지지 않는 불꽃의 스트랫 | 불씨처럼 빛나는 몸통, 헤드 위 고요한 불꽃 |
| +11 | 세 개의 시간을 켜는 스트랫 | 가운데 넥 + 반투명 파랑(과거)·금색(미래) 넥 |
| +12 | 서리꽃이 핀 스트랫 | 얼음빛 몸통, 서리꽃, 얼음 결정 |
| +13 | 새벽빛 날개가 돋은 스트랫 | 새벽빛 깃털 날개 |
| +14 | 바람이 대신 줄을 튕기는 스트랫 | 민트빛 바람 띠, 나뭇잎 |
| +15 | 별자리가 새겨진 스트랫 | 남색 몸통, 빛나는 별자리 |
| +16 | 천 명의 목소리가 깃든 스트랫 | 진주빛 몸통, 떠오르는 빛 음표 |
| +17 | 번개를 길들인 스트랫 | 검은 몸통, 넥에 감긴 번개 |
| +18 | 은하수를 건너온 스트랫 | 은하 몸통, 행성 고리, 작은 달 |
| +19 | 오르페우스가 저승까지 들고 간 스트랫 | 대리석·금, 월계수, 후광, 리라 그림자 |
| +20 | 지미 헨도릭스의 스트랫 | 흰 몸통 왼손잡이(좌우 반전), 보랏빛 연기, 불꽃, 왕관, 무지개 빛 |

## 2. 프롬프트 ① — +0 ~ +9 (한 장에 10대)

```
Make ONE image, landscape 1536x1024, transparent background: a sprite sheet of 10 electric guitars for a mobile game called "Guitar Upgrade", where a cheap used guitar is upgraded step by step.

LAYOUT: a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar stands perfectly upright (neck straight up), seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height). Keep every extra effect inside its own cell.

BASE GUITAR (same for all 10, only the described changes differ): a double-cutaway solid-body electric guitar in cherry red with a cream pickguard, three single-coil pickups, a tremolo arm, a maple neck, and six tuners in one line on an ORIGINAL rounded headstock.

STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone. Original designs only: no real brand headstock shape, no logos, and NO text, letters or numbers anywhere.

1. Just bought second-hand: dull dusty finish, scratches and small dents, yellowed pickguard, one bent tuner, and a small blank paper price tag tied to the headstock with string.
2. Rusty strings: all six strings orange-brown with rust, rusty stains dripping down onto the pickguard, the finish still dusty.
3. Fresh new strings: bright shining silver strings with a little sparkle, the body wiped clean (old scratches still visible), a tiny curled spare string end at the headstock.
4. Covered in stickers: lots of colorful cartoon stickers (stars, lightning bolts, hearts, smiley faces, a little skull), overlapping, some half-peeled, all over the body and pickguard.
5. Professionally set up: polished and gleaming, a small silver wrench hanging from the strap button, a blank yellow sticky note on the headstock, a few clean sparkles.
6. Gold pickups: three shiny gold pickup covers and gold hardware, with small wavy buzz lines humming out of the pickups.
7. A second neck growing: a smaller extra neck with its own little headstock sprouting out of the upper horn like a tree branch.
8. Glitter: the whole body covered in dense rainbow glitter paint that sparkles everywhere.
9. LED lights: a strip of small rainbow LEDs lining the edge of the body, glowing softly, a few LEDs switched off.
10. Plays by itself: NO cable plugged in (a loose unplugged cable end dangling), a small round speaker grille built into the lower body, faint ghostly green sound waves floating out of it, a subtle eerie glow - the first hint of something mysterious.
```

## 3. 프롬프트 ② — +10 ~ +19 (한 장에 10대)

11번째~20번째 기타(+10~+19). 2026-11-12 사용자: "11강부터 20강까지 하는 거 또 만들자".
- ①을 뽑은 대화가 남아 있으면 아래 **② 같은 대화용**을 붙여 넣는다.
- 새 대화면 **② 새 대화용**을 쓰고, ①에서 받은 기타 시트 그림(또는 `images/play/gk/strat_09.webp`)을 같이 올린다. 그래야 그림체·기타 모양·크기가 맞는다.
- 21번째(+20)는 아래 ③으로 따로 한 대 크게.

② 새 대화용 (참고 그림을 같이 올린다)

```
The attached image is the first sprite sheet of guitars for my mobile game "Guitar Upgrade" (a cheap used guitar upgraded step by step, levels +0 to +9). Make the NEXT sheet, levels +10 to +19, so it matches the attached sheet exactly:
- SAME art style (polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading, light from the top-left), SAME base guitar shape (double-cutaway solid body, three single-coil pickups, tremolo arm, six tuners in one line on the same ORIGINAL rounded headstock), SAME size and SAME position of the guitar inside each cell.
- ONE image, landscape 1536x1024, transparent background, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10.
- Every guitar stands perfectly upright (neck straight up), seen exactly from the front, centered in its cell, about 85% of the cell height. The guitar itself must stay the same size as in the attached sheet; glows, wings and other effects may go around it but must stay inside its own cell and must not hide the headstock or the bottom of the body.
- No people, no logos, and NO text, letters or numbers anywhere.

From here the guitars stop being jokes and become MYSTERIOUS and MAGICAL: elegant glowing light, mythic and slightly sacred mood, each one clearly more impressive than the one before. Body colors change as described.

1. Eternal flame: body glowing like deep crimson embers with fine golden cracks, a calm, steady flame with a pale white-gold core burning above the headstock.
2. Three times: three necks - the real neck in the middle, a translucent pale-blue ghost neck on the left (the past) and a translucent pale-gold ghost neck on the right (the future), a faint clock-dial pattern glowing on the body.
3. Frost flowers: icy pale-blue body with white frost flowers blooming across it, small ice crystals along the edges, a cold misty glow.
4. Dawn wings: a pair of luminous feathered wings in dawn colors (peach and pink fading to soft gold) spreading from both sides of the body, the feather tips glowing.
5. The wind plays it: pale mint wind ribbons swirling around the body and across the strings, a few leaves caught in the wind, the strings slightly blurred as if strummed by the wind.
6. Constellations: deep navy body with a glowing constellation pattern (tiny star points joined by thin golden lines), a few twinkles around the headstock.
7. A thousand voices: pearl-white body with gold trim, softly glowing translucent music notes and small wisps of light rising around it like many voices singing.
8. Tamed lightning: matte black body, a bolt of electric-blue lightning coiled calmly around the neck like a tamed snake, small sparks along the strings.
9. Crossed the Milky Way: body painted like a galaxy (purple and blue nebula full of stars), a thin glowing planetary ring around the body at an angle, a small moon floating beside it.
10. Carried into the underworld: antique white-and-gold body like old marble with a laurel-leaf pattern, a golden halo above the headstock, a faint ghostly lyre shape glowing behind the guitar, thin purple mist curling at the bottom.
```

마음에 안 들면 같은 대화에 이어서:
- 기타 크기가 들쭉날쭉하면: `Make every guitar exactly the same size and position as in the first sheet; only the decorations differ.`
- 효과가 칸 밖으로 넘치면: `Keep every effect inside its own cell, with clear empty space between cells.`
- 덜 화려하면: `Make each guitar more magical and more impressive than the one before, especially 6-10.`

② 같은 대화용 (①을 뽑은 대화에 이어서)

```
Same style, same base guitar shape and same size as the previous sheet. Make ONE image, landscape 1536x1024, transparent background: 10 more guitars in a grid of 5 columns x 2 rows with lots of empty space between them. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar upright, seen from the front, centered in its cell, all the same size; keep every effect inside its own cell.

From here the guitars stop being jokes and become MYSTERIOUS and MAGICAL: elegant glowing light, mythic and slightly sacred mood. Body colors change as described. Still no logos and NO text, letters or numbers anywhere.

1. Eternal flame: body glowing like deep crimson embers with fine golden cracks, a calm, steady flame with a pale white-gold core burning above the headstock.
2. Three times: three necks - the real neck in the middle, a translucent pale-blue ghost neck on the left (the past) and a translucent pale-gold ghost neck on the right (the future), a faint clock-dial pattern glowing on the body.
3. Frost flowers: icy pale-blue body with white frost flowers blooming across it, small ice crystals along the edges, a cold misty glow.
4. Dawn wings: a pair of luminous feathered wings in dawn colors (peach and pink fading to soft gold) spreading from both sides of the body, the feather tips glowing.
5. The wind plays it: pale mint wind ribbons swirling around the body and across the strings, a few leaves caught in the wind, the strings slightly blurred as if strummed by the wind.
6. Constellations: deep navy body with a glowing constellation pattern (tiny star points joined by thin golden lines), a few twinkles around the headstock.
7. A thousand voices: pearl-white body with gold trim, softly glowing translucent music notes and small wisps of light rising around it like many voices singing.
8. Tamed lightning: matte black body, a bolt of electric-blue lightning coiled calmly around the neck like a tamed snake, small sparks along the strings.
9. Crossed the Milky Way: body painted like a galaxy (purple and blue nebula full of stars), a thin glowing planetary ring around the body at an angle, a small moon floating beside it.
10. Carried into the underworld: antique white-and-gold body like old marble with a laurel-leaf pattern, a golden halo above the headstock, a faint ghostly lyre shape glowing behind the guitar, thin purple mist curling at the bottom.
```

## 4. 프롬프트 ③ — +20 (한 대, 크게)

```
Same style as the sheets above. Make ONE image, portrait 1024x1536, transparent background: the final, legendary guitar of the game, alone and centered, more detailed than the others but the same original guitar shape, standing upright with the neck pointing UP, seen from the front.
Legendary design: a white body set up for a left-handed player - mirrored left-to-right compared with the other guitars (pickguard, tremolo arm and tuners on the opposite side), but still upright. A swirling psychedelic purple haze with orange and gold streaks around it, small sacred flames licking at the lower horn, a floating golden crown above the headstock, and a thin rainbow aura outlining the whole guitar. It should feel like the most famous guitar in history, worthy of worship.
No person, no face, no logos, and NO text, letters or numbers anywhere.
```

## 5. 그 밖의 그림 (나중에, 같은 대화에서)

부서짐·하드케이스·튜너 (가로 1536×1024)

```
Same style. Make ONE image, landscape 1536x1024, transparent background, a grid with lots of space between items:
1. The +0 cherry-red guitar from the first sheet smashed into 7 separate pieces laid out in a row (headstock with a snapped bit of neck, two splintered neck pieces, the upper horn, the lower body, two cracked pickguard fragments), plus a few wood splinters and a curled loose string.
2. A small pile of broken red guitar fragments and splinters (a small icon).
3. A closed black hard-shell guitar case with silver latches and a handle, standing upright.
4. The same hard case shattered into pieces with a few silver latch bits flying.
5. Three guitar tuners side by side: a small clip-on tuner, a stomp-box pedal tuner with a needle display, a larger strobe tuner with a striped display (displays show only a needle or light bars).
No logos, NO text, letters or numbers.
```

### 작업대 배경 — 멋있는 기타 공방 (2026-11-12 사용자 요청)

강화하는 무대 뒤 배경(지금은 도트 `bg_studio.png`). 무대는 거의 정사각형(휴대폰 약 400×400, 넓은 화면 약 560×470)이고, **가운데 세로 띠에 강화할 기타가 서 있다**(무대 높이의 85% 정도, 바닥 가까이). 그래서 정사각형으로 뽑고 가운데는 비워 둔다.
기타 그림을 뽑은 대화에 붙여 넣으면 그림체가 맞는다(다른 대화면 `strat_05.webp` 같은 기타 그림을 같이 올린다). 받으면 Claude가 `images/play/gk/bg_workshop.webp`로 넣고, 작업대 배경을 바꾼다(도트용 `pixelated`는 배경에서 뺌).

```
Same art style as the guitars in this chat, but as a BACKGROUND: make ONE image, square 1024x1024, no text.
Scene: the inside of a stylish, high-end boutique guitar workshop (luthier's atelier) at night, seen from the front at eye level, warm and atmospheric - the kind of place where legendary guitars are made.
- CENTER (most important): keep a clear, uncluttered vertical space in the middle (about 40% of the width, from the floor up to near the top) where the game will place one upright guitar. In that spot draw only a simple wooden guitar stand base on the floor at the bottom center (no guitar on it) and a soft warm spotlight pool on the floor. The wall behind the center should be calm and slightly darker so the guitar in front stands out.
- LEFT and RIGHT sides: a back wall of dark walnut wood panels and exposed brick, with several finished guitars hanging on wall hangers (sunburst, black, natural wood, a pastel-blue one, an acoustic guitar, a bass) - original body shapes, no logos, slightly softer and less detailed than a game item so they stay in the background.
- Workshop details around the edges: a heavy wooden workbench with clamps, chisels, files and a small vise; unfinished raw-wood guitar bodies and necks hanging from a rack; a pegboard with neatly hung tools; wood shavings on the bench; a small vintage tube amp with a glowing light; a coiled cable.
- Lighting: warm amber pendant lamps and small spotlights, a little dust glowing in the light beams, gentle shadows in the corners, rich but not too saturated colors (deep browns, amber, a touch of dark green).
- Keep the bottom 15% as a simple dark wooden floor.
- Polished 2D mobile-game background illustration with clean outlines, lighter outlines and softer contrast than the guitar items. No people, no logos, NO text, letters or numbers anywhere (no signs, no labels).
```

마음에 안 들면 같은 대화에 이어서:
- 더 어둡고 멋있게: `Make it darker and more dramatic, like a premium showroom at night, but keep the center space clear.`
- 더 아늑하게: `Make it cozier and brighter, like a warm daytime workshop with sunlight from a window on the left.`
- 가운데가 복잡하면: `The center is too busy. Keep only the empty guitar stand and the floor light in the middle 40%.`

- 2026-11-12 이 프롬프트로 뽑은 '밤의 기타 공방'을 기본 배경으로 넣었다(`images/play/gk/bg_workshop.webp`).

### 작업대 배경 스킨 10개 (2026-11-12 사용자: "배경 스킨도 10개까지 괜찮은 테마로")

진열 벽 스킨처럼 상점에서 사서 바꾸는 **작업대(강화 무대) 배경**이다. 기본 '밤의 기타 공방'과 자리를 똑같이 맞춰야 강화할 기타가 거치대 위에 그대로 선다.
- 공방 배경을 뽑은 **그 대화**에 붙여 넣는다. 다른 대화면 `bg_workshop.webp`를 같이 올린다.
- 한 장씩 나온다. 다음 테마를 보려면 "다음"이라고 쓴다. 마음에 안 드는 것은 "다시"라고 쓴다.
- 받으면 Claude가 `bg_<이름>.webp`로 넣고, 목업 상점에 '작업대 배경' 칸을 만들어 값을 붙인다. 값은 그때 정한다.

| # | 테마 | 느낌 |
|---|---|---|
| 1 | 햇살 드는 낮 공방 | 기본 공방의 낮 버전, 창으로 들어오는 햇빛과 나무 먼지 |
| 2 | 지하 합주실 | 검은 흡음재, 빨간 LED 띠, 앰프와 드럼 (진열 벽 '합주실'과 짝) |
| 3 | 빈티지 기타 가게 | 나무 선반에 줄줄이 걸린 기타, 유리 진열장, 오래된 포스터 틀 |
| 4 | 라이브 클럽 무대 | 작은 무대, 색 조명, 철골 트러스, 모니터 스피커 |
| 5 | 한옥 공방 | 창호지 문, 나무 격자, 종이 등, 나무 공구 |
| 6 | 눈 내리는 통나무 오두막 | 벽난로, 눈 오는 창, 따뜻한 담요 (겨울 한정 판매 가능) |
| 7 | 네온 신스웨이브 공방 | 보라·분홍 네온, 격자 바닥, 레트로 미래 |
| 8 | 해질녘 해변 서핑숍 | 대나무 벽, 서핑보드, 노을 창, 우쿨렐레 |
| 9 | 대형 공연장 무대 | 거대한 조명탑, 연기, 빈 객석의 불빛(사람 없이) |
| 10 | 별빛 신전 | 밤하늘 돔, 떠다니는 별빛, 빛나는 기둥 (+15 넘은 기타에 어울림) |

```
Use the night guitar workshop background from earlier in this chat (or the attached image) as the EXACT layout template, and make new "skins" of it - ONE image per reply.
Keep the layout identical: square 1024x1024, front view at eye level, a clear uncluttered vertical space in the middle (about 40% of the width, from the floor to near the top) with only an empty guitar stand at the bottom center and a soft pool of light on the floor under it, the wall behind the center calm and slightly darker so a guitar placed there stands out, decorations and details only on the left and right sides, and a simple floor strip in the bottom 15%. Keep the same art style (polished 2D mobile-game background with clean, lighter outlines and softer contrast than the game items). Only change the place, materials, colors and lighting to fit the theme. No people, no logos, and NO text, letters or numbers anywhere (no signs, no labels, no posters with writing).

Make skin 1 now. Each time I say "다음", make the next one.
1. Sunny daytime workshop: the same luthier workshop in the daytime, warm sunlight streaming through a big window on the left, light beams with floating sawdust, lighter wood tones, a few plants.
2. Underground rehearsal room: black egg-crate acoustic foam walls, a red-orange LED strip along the ceiling, a drum kit and a stack of amps on the sides, coiled cables on the floor, a worn rug under the stand.
3. Vintage guitar shop: dark wooden shelves on both sides with rows of hanging guitars, a glass display counter, empty vintage poster frames, warm brass lamps, a checkered floor.
4. Live club stage: a small club stage with a black curtain, a metal lighting truss across the top, colorful spotlights (magenta, cyan, amber) aimed at the center, monitor speakers and amps on the sides, light haze.
5. Korean hanok workshop: warm paper sliding doors with wooden lattice, exposed wooden beams, hanging paper lanterns instead of lamps, traditional wooden tools and a low wooden workbench on the sides, a small potted pine, a wooden floor.
6. Snowy log cabin: log walls, a crackling stone fireplace on one side, a frosty window with snow falling outside on the other, a cozy knitted blanket on a chair, warm firelight.
7. Neon synthwave workshop: dark purple room with glowing pink and cyan neon tubes outlining the walls, a glowing grid floor, a retro-futuristic sunset window, chrome tools on the sides.
8. Beach surf shop at sunset: bamboo and driftwood walls, surfboards leaning on the sides, a ukulele on a hook, a big open window showing the ocean at sunset, string lights, a sandy wooden floor.
9. Huge concert hall stage: a giant stage with tall lighting towers on both sides, bright beams sweeping through stage smoke, rows of small lights in the dark empty seats far behind (no people), a glossy black stage floor.
10. Starlight shrine: a mystical temple under a night-sky dome full of stars, glowing marble pillars on both sides, floating particles of starlight, a soft beam of silver light falling on the stand, a polished stone floor.
```

작업방 진열 벽 (가로 1536×1024) — 걸이만 그리고 기타는 비워 둔다(기타는 게임이 단계에 맞춰 그려 넣는다).

```
Same style. A front-facing wall of a small, cozy guitar workshop, seen perfectly straight-on (no perspective), filling the whole image, landscape 1536x1024.
- One row of FIVE identical empty guitar wall hangers (a small wooden block with a U-shaped yoke), all at exactly the same height in the upper third of the wall, evenly spaced, centered as a group.
- Below each hanger leave an EMPTY tall, narrow space for an upright guitar (about 1/8 of the image width, a bit more than half of the image height). Do NOT draw any guitars.
- A small warm spotlight above each hanger, casting a soft cone of light down its slot.
- A small blank brass nameplate under each slot.
- Dark green-grey vertical wooden slat wall, a wooden baseboard and a strip of worn wooden floor at the bottom. Small details (a coiled cable on a hook, an empty poster frame, a tiny plant) only at the far left and right edges.
- No text, letters, numbers or logos anywhere.
```

- 2026-11-12 사용자가 이 프롬프트로 뽑은 벽을 기본 스킨으로 넣었다(`images/play/gk/wall_wood.webp`, 초록 나무 벽 작업실). 목업 작업방이 이 벽 하나(걸이 5개)가 됐다.

### 진열 벽 스킨 더 뽑기 (2026-11-12 사용자: "진열대 스킨도 여러 개")

진열 벽을 뽑은 **그 ChatGPT 대화**에 붙여 넣는다(다른 대화면 `wall_wood.webp`를 같이 올린다). 한 장 나오면 "다음"이라고 쓰면 다음 스킨이 나온다.
받으면 Claude가 걸이·명판 위치를 재서 목업 `WALLS`에 넣는다(상점 '진열 벽 스킨'). 스킨 값은 그때 정한다.

```
Use the guitar display wall picture from earlier in this chat as the EXACT layout template, and make new "skins" of it - ONE image per reply.
Keep the layout identical: same landscape size, straight-on front view, five hangers in one row at exactly the same positions and height, one light above each hanger shining down its slot, one small blank plate under each slot at the same positions, a floor strip at the bottom, and NO guitars. Only change the materials, colors, lights and decorations to fit the theme. Keep the same art style as the original wall. Decorations only at the far left and right edges so the five slots stay clean. No text, letters, numbers or logos anywhere (the plates stay blank).

Make skin 1 now. Each time I say "다음", make the next one.
1. Rehearsal room: black egg-crate acoustic foam panels, a warm red-orange LED strip along the top, matte black metal hangers, a small amp and a coiled cable at the edges.
2. Brick loft studio: exposed red brick wall, hanging Edison bulbs instead of spotlights, black iron hangers, brass plates, a small wooden stool at one edge.
3. Luxury guitar showroom: dark walnut wood panels with thin gold trim, a deep red velvet panel behind each slot, gold hangers and gold plates, soft white display lights.
4. Concert stage: black stage curtain, colorful stage spotlights (magenta, cyan, amber), a metal lighting truss across the top, chrome hangers, a monitor speaker at one edge.
5. Starlight shrine (mystical): dark indigo stone wall with faint glowing abstract symbols (no letters), beams of starlight instead of lamps, silver hangers, moonstone plates, tiny floating sparkles.
6. Korean hanok room: warm paper walls with wooden lattice frames, hanging paper lanterns instead of lamps, wooden peg hangers, bronze plates, a small potted pine at one edge.
```

- 2026-11-12: 사용자가 1~6을 ChatGPT에서 다 뽑았다. 그중 1 합주실을 상점에 넣었다(`wall_rehearsal.webp`, 5만G). 나머지 그림도 보내 주면 넣는다.

**7~10 더 뽑기** (2026-11-12 사용자: 한옥까지 만들었으니 나머지를). 1~6을 뽑은 **같은 대화**에 붙여 넣는다.

```
Great. Continue with 4 more skins using exactly the same rules and the same layout template (five hangers in the same positions, one light above each, blank plates, floor strip, NO guitars, no text). Make skin 7 now. Each time I say "다음", make the next one.
7. Vintage guitar shop: dark varnished wooden wall panels with carved trim, warm brass picture lights instead of spotlights, brass hangers and plates, a glass display case and a stack of old leather guitar cases at the edges.
8. Neon synthwave: dark purple wall with a glowing pink-and-cyan neon grid, neon tube lights instead of lamps, chrome hangers, glowing plates, a retro sunset window shape at one edge.
9. Snowy log cabin: rough log wall, small hanging lanterns instead of lamps, wooden peg hangers, iron plates, a frosty window with falling snow and a hint of fireplace glow at the edges.
10. Space station: white and grey sci-fi panels with blue light strips, small round ceiling lights, metal clamp hangers, glowing blue plates, a round porthole showing stars and a planet at one edge.
```

## 6. 나중 계획 — 첫 기타 찾기는 랜덤

- 사용자 결정(2026-11-12): 피크로 처음 '기타 찾기'를 할 때 스트랫이 나올지, 텔레가 나올지, **주전자 같은 아예 다른 물건**이 나올지 모른다. 지금은 개발 첫 단계라 스트랫만 한다.
- 계열마다 이름 21개와 그림 21장을 따로 만든다. 같은 방법(① ② ③)으로 기본 기타만 바꿔 뽑는다.
  - 텔레(캐스터): single-cutaway flat slab body, butterscotch blonde, black pickguard, two single-coil pickups, metal bridge plate
  - 레스폴: single-cutaway carved-top body, two humbuckers, cream binding — +20은 '게리 무르의 레스폴'
  - 슈퍼스트랫: thin body with two sharp pointed horns, two humbuckers, locking tremolo
  - 통기타: dreadnought acoustic, round soundhole
- 기타가 아닌 물건(주전자·빗자루·빨래판 등)은 확률이 낮은 '히든'으로 둔다.

## 7. 검키우기 참고 (2026-11-12 조사)

- 검키우기(카카오톡 플레이봇)는 강화할 때마다 무기가 다른 이름의 물건으로 바뀐다(예: 첫 강화에 '물이 줄줄 새는 주전자').
- 무기 도감(SwordQ, `swordq.kr/weapons`)에 검 60종 + 히든 19종. 계열 예: 불씨 검, 새싹 검, 흐릿한 달빛 검, 새해의 약속 몽둥이. 단계가 높을수록 이름이 길어지고, 높은 단계에는 신화 속 이름이 붙는다고 한다(검색 요약에서만 봄).
- 2026-11-12에는 SwordQ가 서버 오류(502)라 전체 목록은 못 읽었다. 이름은 그대로 가져오지 않고 같은 방식으로 새로 지었다(1절).
