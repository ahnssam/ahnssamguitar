# 기타 키우기 — 텔레 3세트: 크리스마스 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-24 사용자: "크리스마스 컨셉으로 다른 악기들 프롬프트 전부 다 만들어 줘. 그리고 프롬프트 안에, zip 파일로 만들어서 기타 키우기 폴더 안에 넣어 달라고 해 줘."

스트랫 3세트(성탄 스트랫, `docs/기타키우기_GPT_스트랫3세트_크리스마스_프롬프트.md`)와 같은 규칙으로 썼다. CLAUDE.md 11절 'GPT 그림 프롬프트 쓰는 법' ①~⑤ 그대로다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑고, 끝나면 **zip 파일 하나로 묶어 구글 드라이브 `기타 키우기` 폴더에 넣는다**(못 넣으면 내려받기 링크).
- 그림마다 헤드머신(튜닝 키)·기둥·줄 개수(6개씩, 한 줄)를 GPT가 스스로 세고, 틀린 기타는 **그 하나만 따로** 다시 그린다.
- 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**. 전구·초·창·별·연기·눈보라도 외곽선이 또렷한 **단단한 모양**으로만 그린다.
- **단계 격차를 크게 + 테마는 +6부터**: +0~+4 진짜 쓰레기(크리스마스 거의 없음) → +5 수수 → **+6~+7 크리스마스 시작(싸구려 장식)** → +8~+11 '오, 멋있어지네' → +12~+19 **기타 자체가** 크리스마스 전설로 변신 → +20 그보다 더.

## 0. 이 세트의 모양과 이야기

- **세트 이름: 장난감 공방 텔레** (게임 `dexName`, 이름은 Claude가 지음 — 바꿔도 된다).
- 1세트(황야 텔레)는 버터스카치 금색, 2세트(바다왕 텔레)는 서프 그린이라서, **3세트는 반짝이는 로열 블루**다. 흰 펄 픽가드, 크롬 브리지 판·조절판, 메이플 지판에 검정 점, 한쪽에 6개 헤드. 빨강·금은 +6부터 장식으로 들어온다.
- 이야기 줄기 — **산타의 장난감 공방**
  - **+0~+4**: 아이 방 장난감 상자 바닥의 쓰레기. 장난감 상자에 깔림, 장난감 자동차 경사로, 크레파스 낙서, 건전지가 새서 삭음, 크리스마스 뒤 고장 난 장난감 더미(+4에서 크리스마스가 살짝 비침).
  - **+5**: 닦고 고친 수수한 파란 텔레.
  - **+6~+7**: 크리스마스 시작 — 붙이는 플라스틱 선물 리본, 손으로 칠한 작은 나무 장식. 아직 수수하다.
  - **+8~+11**: 멋있어진다. 나무 블록 테두리, 팽이 노브, 옛날 양철 장난감 칠, 펠트 인형 옷.
  - **+12~+19**: 기타 자체가 전설의 장난감으로 변신한다. 곰 인형, 흔들 목마, 깜짝 상자, 나무 기차 세트, 인형의 집, 장난감 성, 산타의 장난감 작업대, 북극의 황금 장난감 상자.
  - **+20**: 핑크 페이즐리 무늬의 전설의 텔레.
- **장난감은 동물·물건만** — 사람 인형·장난감 병정은 안 그린다(통기타 2세트의 호두까기 근위대와도 안 겹치게).
- **사람은 그리지 않는다** — 산타·요정·천사·캐럴 부르는 사람·사람 인형 모두. 산타는 그 물건(모자·옷의 흰 털·벨트·썰매·선물 자루·장화)으로만 보여 준다. 종교 그림(십자가·구유·천사)과 글자(Merry Christmas·숫자)도 넣지 않는다.
- 눈·흰 털·크림이 흰 배경에 녹아 안 보이지 않게, **흰 부분에는 또렷한 검은 외곽선과 연한 푸른 회색 그늘**을 넣게 했다.
- 크리스마스 세트끼리 안 겹치게 악기마다 다른 소재를 썼다 — 스트랫 = 산타 마을 · 텔레 = 장난감 · 레스폴 = 디저트 · 슈퍼스트랫 = 얼음과 눈 · 통기타 = 포근한 겨울 오두막 · 베이스 = 북극 동물 · 앰프 = 선물 상자 · 멀티 = 캐럴 음악 · 페달 = 트리 오너먼트.

## 1. 단계별 이름과 그림

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 장난감 상자에 깔려 박살 난 텔레 | 쓰러진 장난감 상자에 깔려 쩍 갈라진 몸통, 휜 넥, 끊어져 엉킨 줄, 찌그러진 크롬 판, 노브 하나 없음 |
| +1 | 장난감 자동차 경사로로 쓴 텔레 | 온통 검은 바퀴 자국과 긁힌 줄, 이 빠진 가장자리, 금 간 픽가드, 움푹 팬 자국 |
| +2 | 크레파스로 온통 낙서한 텔레 | 몸통 가득 알록달록 크레파스 낙서(그림만, 글자 없음), 줄 사이에 낀 부러진 크레파스, 말라붙은 풀 덩어리 |
| +3 | 건전지가 새서 삭은 텔레 | 조절판과 브리지에서 부글부글 올라온 하얗고 푸르스름한 부식 가루, 녹슨 새들, 얼룩진 나무, 덜렁거리는 건전지 뚜껑 |
| +4 | 크리스마스 뒤 고장 난 장난감 더미에 버려진 텔레 | 들러붙은 찢어진 포장지 조각, 줄에 걸린 부러진 장난감 바퀴와 용수철, 금 가고 더러움. 크리스마스가 살짝 비침 |
| +5 | 닦고 고쳐 낸 텔레 | 금 간 곳을 붙이고 수수한 로열 블루로 다시 칠함, 새 줄·새 노브. 드디어 소리 남(장식 없음) |
| +6 | 선물 리본을 붙인 텔레 | **크리스마스 시작**: 몸통에 붙인 싸구려 플라스틱 선물 리본, 스트랩 버튼에 끈으로 단 빈 종이 꼬리표. 아직 수수함 |
| +7 | 나무 장난감 장식을 매단 텔레 | 빨간 털실에 매단 손으로 칠한 작은 나무 장식(별·흔들 목마·눈송이), 줄무늬 털실 술. 아직 수수함 |
| +8 | 장난감 블록 테두리 텔레 | 여기서부터 멋있어지기 시작: 반짝이는 로열 블루에 금 핀스트라이프·금 부품, 몸통 가장자리를 두른 알록달록한 작은 나무 블록(무늬 없음) |
| +9 | 팽이 노브 텔레 | 노브·스위치 끝이 줄무늬 팽이로, 아래 뿔에 붙은 큰 빨강·금 팽이, 빨강·흰 체크무늬 픽가드 |
| +10 | 양철 장난감 텔레 | 몸통이 옛날 양철 장난감처럼: 별·소용돌이·호랑가시 무늬를 찍은 양철, 둥글게 만 가장자리, 리벳, 스트랩 버튼에 매단 작은 양철 북과 북채 |
| +11 | 펠트 인형 옷을 입은 텔레 | 몸통을 덮은 빨강·초록 펠트 조각과 큰 바느질 땀, 단추 노브, 펠트 호랑가시 아플리케, 뿔 끝의 털 방울 |
| +12 | 곰 인형이 된 텔레 | **몸통이 커다란 곰 인형**: 바느질 자국이 보이는 갈색 털, 단추 눈, 호랑가시 달린 빨간 나비넥타이, 몸통 양옆을 감싼 두 팔, 발바닥 패치 |
| +13 | 흔들 목마가 된 텔레 | 몸통이 조각하고 칠한 흔들 목마: 위 어깨 옆으로 솟은 갈기 휘날리는 말 머리(헤드는 안 가림), 금 징 박은 빨간 안장, 아래 빨간 곡선 흔들 다리 |
| +14 | 깜짝 상자가 된 텔레 | 몸통이 손잡이 달린 칠한 양철 깜짝 상자, 뚜껑이 확 열리며 큰 용수철 위로 튀어나온 털 순록 인형 머리, 단단한 색종이 |
| +15 | 나무 기차 세트가 된 텔레 | 몸통이 칠한 나무 장난감 기차 세트: 둥근 바퀴의 귀여운 나무 기관차(진짜 증기 기관차 아님)와 객차, 몸통을 한 바퀴 도는 나무 선로, 작은 나무 전나무들 |
| +16 | 인형의 집이 된 텔레 | 몸통이 앞이 열린 크리스마스 인형의 집: 작은 방마다 미니 가구·미니 트리·미니 벽난로·계단·벽지, 위 가장자리의 눈 덮인 지붕(인형·사람 없음) |
| +17 | 장난감 성이 된 텔레 | 몸통이 칠한 나무 블록으로 쌓은 장난감 성: 고깔 지붕 탑, 도개교, 글자 없는 삼각 깃발, 성벽의 화환·꽃줄 |
| +18 | 산타의 장난감 작업대가 된 텔레 | 몸통이 장난감 만드는 작업대: 장난감을 나르는 작은 컨베이어, 물감통과 붓, 작은 망치, 톱니, 리본 실패, 만들다 만 장난감들(요정·사람 없음) |
| +19 | 북극의 황금 장난감 상자가 된 텔레 | 몸통이 조각한 금·빨강 칠기 장난감 상자, 열린 뚜껑에서 쏟아지는 전설의 장난감(황금 목마·보석 곰 인형·수정 팽이·은빛 기차), 위에 금별 — 세트 최고 전설 |
| +20 | **제임스 버튼스의 텔레** | 분홍 바탕에 금·빨강·초록 페이즐리·꽃무늬를 입히고 두꺼운 광택을 올린 전설의 텔레, 흰 픽가드, 메이플 지판. 뒤로 외곽선이 또렷한 빨강·초록·금 빛살과 단단한 눈송이·반짝이(빛 번짐·아우라 없이) |

- +20 이름은 핑크 페이즐리 텔레로 유명한 컨트리·로큰롤 기타리스트(엘비스의 기타리스트) 이름을 살짝 바꾼 것(다른 세트 +20과 같은 식).
- +20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다): **브루스 스프링스딘의 텔레** — 수십 년 땀에 닳아 나무가 드러난 금빛 텔레, 검은 픽가드(1세트 텔레 바탕과 닮아서 둘째로 둠).

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 3절 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑고, 끝나면 zip까지 만든다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄 개수(6개씩, 한 줄)를 ChatGPT가 스스로 센다. 틀린 기타는 **그 하나만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그리고, 다 끝나면 zip 파일까지 만들어 줘. 매번 개수를 세고, 틀린 건 하나씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·눈 내리는 하늘·그라데이션 배경, **뒤의 아우라·빛 번짐**만 아니면 된다.
5. **zip**: ChatGPT가 그림을 모두 PNG로 `tele3_christmas.zip` 하나에 묶어 구글 드라이브 **`기타 키우기`** 폴더에 넣게 했다.
   - 안의 파일 이름: `tele3_A.png`(+0~+9 시트) · `tele3_B.png`(+10~+19 시트) · `tele3_20.png`(+20) · 다시 그린 낱장 `tele3_03.png`처럼 단계 두 자리.
   - ChatGPT가 드라이브에 직접 못 넣으면 내려받기 링크를 준다 — 받아서 `기타 키우기` 폴더에 넣으면 된다.
6. 넣었다고 Claude에게 알려 주면, 풀어서 `1 악기/텔레/3세트 장난감 공방/`에 두고 다시 세어 본 뒤 맞는 것만 잘라 넣는다.
   - 1·2세트 텔레와 같은 틀(448×672 — 헤드 위 끝 y=204, 몸통 아래 끝 y=608, 넥 가운데 x=224)에 맞추고 `images/play/gk/tele3_00`~`20.webp`로 넣는다.
   - 계열은 `tele3`. 게임에서는 텔레가 나오면 1·2·3세트가 1/3씩 나온다(넣을 때 정함 — 멀티·페달처럼 `SETS`로).
   - 서버(랭킹·오늘의 상대·최고 무기)도 'tele3'를 받게 SQL 한 개가 더 필요하다(기타라서 최고 무기 목록에도 넣는다).

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitars with a CHRISTMAS theme (Santa's toy workshop) as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation, then make the ZIP file (see FINAL STEP at the end). Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B, C, any redraws (see SELF-CHECK) and the zip file are all done.

POWER CURVE (the most important rule of this set - the jump between levels must be HUGE and obvious, like a real upgrade game)
- +0 to +4: TOTAL GARBAGE. The guitar ITSELF is wrecked - cracked, dented, scribbled on, corroded, filthy, with broken or missing parts - NOT a clean guitar with a funny object stuck on it. Anyone would throw it in the trash. Kids'-playroom junk from the bottom of an old toy box, with almost no Christmas decoration yet. Funny and gross-cute, never scary.
- +5: repaired and playable, plain and humble, no Christmas decoration.
- +6 and +7: the CHRISTMAS THEME STARTS here for real - but with cheap, humble decorations (a stick-on plastic gift bow, a blank paper tag, little hand-painted wooden ornaments on yarn). Still a plain guitar.
- +8 to +11: "oh, this is getting cool" - classy Christmas decoration, gloss and gold, and the theme starts to change the guitar itself, clearly cooler with every step.
- +12 to +19: "WOW, I NEED this" - jaw-dropping legendary rare items. The guitar ITSELF transforms into a legendary Christmas toy (a giant plush teddy bear, a carved rocking horse, a jack-in-the-box, a wooden toy train set, a Christmas dollhouse, a toy castle, Santa's toy-making workbench, the golden toy chest of the North Pole), with big dramatic sculptural decorations, intricate detail and rich bold toy-box red, royal blue, pine green, gold and white. Never just a normal guitar with an object placed next to it. Each one more spectacular than the one before.
- +20: the ultimate guitar, the most impressive of all.
Even when the body transforms, keep the guitar's single-cutaway slab outline, neck and headstock so it is still clearly this guitar.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO falling snow in the empty background, no snowy sky, fog, haze, night sky, room or landscape backgrounds, gradients or floor shadows behind the guitars - only the guitar and the solid objects described.
- WHITE THINGS: snow, ice, white fur, cream, icing and white highlights always have a clear dark outline and light blue-grey shading, so they never melt into a white background.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Christmas lights, candle flames, lanterns, windows and stars are drawn as SOLID bright colors with no light spilling around them. Smoke, steam and snowstorms are SOLID, OPAQUE puffs and bands with a clear dark outline, like cartoon clouds. Every effect (flames, snowflakes, sparkles, confetti, rays) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar. Glass and ice are solid with white highlights, not see-through haze.
- NO text, letters, numbers or logos anywhere - no "Merry Christmas" banners; gift tags, labels, cards, plaques and screens are blank or show only pictures.
- NO people anywhere - no Santa Claus, no elves, no angels, no carolers, no dolls or figurines of people. Santa only appears through his things (hat, red suit with white fur trim, belt, sleigh, sack, boots). Toys are animals and objects only (teddy bears, horses, reindeer, trains, blocks, castles) - no toy people, no toy soldiers, no dolls. No religious symbols (no crosses, no nativity scene); a star on top is fine.
- Original designs only: no real brand shapes or logos, no characters from movies, cartoons or games.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a single-cutaway flat slab-body electric guitar in glossy royal blue with a white pearloid pickguard, a slanted bridge pickup set in a flat chrome bridge plate with three saddles, a chrome-covered neck pickup, a chrome control plate with two knobs and a switch, a maple neck with a maple fretboard and black dot inlays, chrome hardware, and an ORIGINAL headstock with all six tuning keys on ONE side (not any real brand's headstock shape).
- HEADSTOCK AND STRINGS (very important, even for the garbage guitars): every guitar has exactly SIX tuning keys in one straight line along the upper edge of the headstock, exactly SIX round string posts in one line on the headstock face (one post per key), and exactly SIX strings running from the bridge, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (bows, tags, ears, horse heads, springs, blocks, flags, toys) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys, its string posts and its strings (6 each). Check that no guitar has glow, aura, mist, falling background snow, a background scene or soft see-through light around or behind it, that there are no letters or numbers, no people and no religious symbols, and that white snow, fur and cream have dark outlines. Check the POWER CURVE and the THEME: +0 to +4 must look like total garbage (the guitar itself wrecked) with almost no Christmas decoration, +5 has none, +6 and +7 must clearly start the Christmas theme in a cheap humble way, +8 onward must clearly get cooler, and +12 to +19 must be jaw-dropping transformations of the guitar itself - if one is not, redraw it bolder. If ANY guitar is wrong (5 or 7 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From TOTAL GARBAGE (a blue guitar ruined at the bottom of a kids' toy box) to a Christmas toy-shop guitar that starts to look legendary.
1. (+0) Crushed under a toppled toy chest: the body cracked right across, the neck bent, snapped strings tangled, the chrome bridge plate and control plate dented, one knob missing.
2. (+1) Used as a ramp for toy cars: black rubber tire marks and scuff lines all over, the edges chipped, the pickguard cracked, deep dents where the cars crashed.
3. (+2) Scribbled all over with crayons: wild colorful crayon scribbles everywhere (just scribbles, no letters or numbers), a broken crayon stub stuck between the strings, dried blobs of craft glue.
4. (+3) Corroded by leaking toy batteries: crusty white-and-green battery corrosion bubbling out of the control plate and the bridge, rusted saddles, stained wood, a cracked plastic battery hatch hanging off the edge.
5. (+4) Dumped on a pile of broken toys after Christmas: a torn scrap of wrapping paper stuck to the body, a snapped toy wheel and a loose spring caught in the strings, cracks and grime everywhere - still total garbage.
6. (+5) Cleaned and fixed: the cracks glued, a plain royal-blue repaint, new strings and a new knob - plain but finally playable, no decoration.
7. (+6) Gift bow (the Christmas theme starts): a cheap stick-on plastic gift bow on the lower body and a blank paper gift tag tied to the strap button with string - still a plain guitar.
8. (+7) Wooden toy ornaments: three little hand-painted wooden ornaments (a star, a tiny rocking horse, a snowflake) hanging from the strap buttons on red yarn, a striped yarn tassel - still humble.
9. (+8) Toy blocks (now it starts to look cool): a glossy royal-blue finish with gold pinstripes and gold hardware, a border of small colorful wooden toy blocks (blank faces, no letters) running around the body edge.
10. (+9) Spinning tops: the knobs and the switch tip turned into striped spinning tops, a big red-and-gold spinning top fixed on the lower horn, a red-and-white checkered pickguard - clearly cooler than the guitars before it.

IMAGE B - guitars +10 to +19
A LEGENDARY CHRISTMAS TOY WORKSHOP theme: toy-box red, royal blue, pine green, gold and white. +10 and +11 are cool and getting very special; from +12 the guitar ITSELF transforms into a legendary Christmas toy and becomes "WOW, I NEED this", each one more spectacular than the last. Keep the same single-cutaway outline, neck and headstock (six keys, six posts, six strings) under all the decoration. Remember: no people, no dolls, no letters, no background scene, no glow - only the guitar and the solid objects described.
1. (+10) Tin toy: the body painted like a shiny vintage tin toy - bright printed tin patterns of stars, swirls and holly (no letters), rolled tin edges, little rivets, a tiny tin drum with drumsticks hanging from the strap button.
2. (+11) Felt toy: the body covered in patchwork red and green felt with big cute stitches, button knobs, a felt holly appliqué, fluffy felt pom-poms on the horn tips.
3. (+12) Teddy bear: the WHOLE body becomes a giant plush teddy bear - soft brown fur with visible stitched seams, shiny button eyes, a red bow tie with a holly sprig, its two arms hugging the sides of the body, stitched paw-pad patches at the bottom.
4. (+13) Rocking horse: the body becomes a carved and painted wooden rocking horse - a proud dapple-grey horse head with a flowing mane rising beside the upper shoulder of the body (not covering the headstock), a red saddle with gold tacks, curved red rockers under the body.
5. (+14) Jack-in-the-box: the body becomes a painted tin jack-in-the-box with a crank handle on the side, the lid flung open and a plush reindeer head bursting out on a big coiled spring beside the neck, solid confetti pieces flying.
6. (+15) Wooden toy train set: the body becomes a painted wooden toy train set - a chunky toy locomotive with round wheels (a toy, not a real steam engine) and colorful wagons, a wooden track looping around the body, little wooden fir trees.
7. (+16) Christmas dollhouse: the body becomes an open-front dollhouse decorated for Christmas - tiny rooms with miniature furniture, a mini Christmas tree, a mini fireplace, a staircase and patterned wallpaper, a snowy roof along the top edge (no dolls, no people).
8. (+17) Toy castle: the body becomes a toy castle built from painted wooden blocks - towers with cone roofs, a drawbridge, blank pennant flags, wreaths and garlands on the walls.
9. (+18) Santa's toy workbench: the body becomes Santa's toy-making workbench - tiny conveyor belts carrying toys, paint pots and brushes, little hammers, gears, ribbon spools and half-finished toys (no elves, no people).
10. (+19) The golden toy chest of the North Pole: the body becomes a legendary carved gold-and-red-lacquer toy chest set with gems, its lid open and spilling legendary toys (a golden rocking horse, a jeweled teddy bear, a crystal spinning top, a silver toy train), a gold star on top - the most legendary guitar of the sheet.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, six keys, six posts, six strings.
The legendary country-and-rock guitar hero's own guitar, the ultimate guitar of the set: a glossy pink paisley guitar - a pink body covered in a swirling paisley and flower pattern in gold, red and green under a thick clear gloss with crisp white highlights, a white pickguard, a maple neck with a maple fretboard, chrome hardware. Behind it big solid red, green and gold starburst rays with clear outlines (no glow), and solid outlined snowflakes and sparkles close around the guitar. No aura, no glow, no soft light - show its legend through the rich details, so it looks like the most powerful guitar in the whole game.

FINAL STEP - ZIP FILE (do this after A, B, C and every redraw are finished)
Save every final image as a full-resolution PNG (keep the transparent background) and put them ALL into ONE zip file named "tele3_christmas.zip":
- tele3_A.png = sheet A (+0 to +9)
- tele3_B.png = sheet B (+10 to +19)
- tele3_20.png = guitar +20
- every guitar you redrew as a single image, named by its level with two digits - for example tele3_03.png for +3 and tele3_17.png for +17 (only the redrawn ones).
Then put this zip file into my Google Drive, in the folder named "기타 키우기" (it is in My Drive). If you cannot save files to my Google Drive, give me the zip as a download link instead and tell me in one short line to put it into the "기타 키우기" folder myself.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 has 5 tuning keys. Redraw only A4 as a single portrait image with exactly six keys, six posts and six strings in one line.`
- 초반이 덜 망가졌으면: `Guitars A1-A5 still look like clean guitars with objects stuck on. Redraw them so the guitar ITSELF is wrecked - cracked, dented, scribbled on, corroded, filthy, with broken or missing parts.`
- 크리스마스가 너무 일찍(+0~+5) 들어갔으면: `A1-A6 have too much Christmas decoration. Keep +0 to +4 as junk with almost no decoration and +5 plain.`
- +6·+7에 크리스마스가 안 보이면: `A7 and A8 must clearly start the Christmas theme with cheap, humble decorations (a stick-on plastic gift bow, a blank paper tag, little hand-painted wooden ornaments on yarn). Redraw them.`
- +8부터 안 나아지면: `A9 and A10 must look clearly cooler than A6-A8. Redraw them with a glossy finish, gold and classy Christmas decoration changing the guitar itself.`
- +12부터가 덜 멋있으면: `B3-B10 still look like a normal guitar with an object next to it. Redraw them so the guitar itself transforms into the Christmas object or creature - jaw-dropping legendary items.`
- 산타·요정·인형 같은 사람이 들어갔으면: `Remove the person. No people, no elves, no dolls - show Santa only through his hat, suit trim, sleigh and sack. Redraw only that guitar.`
- 글자(Merry Christmas·숫자 등)가 들어갔으면: `Remove all letters and numbers - banners, tags, cards and screens stay blank or show only pictures.`
- 눈·흰 털·크림이 배경에 녹아 안 보이면: `The white parts on B4 have no outline and melt into the white background. Redraw it with clear dark outlines and light blue-grey shading.`
- 장식이 헤드머신·기둥을(를) 가렸으면: `On guitar B6 the decorations cover the tuning keys. Redraw only B6 with all six keys and posts fully visible.`
- 그림이 칸을 넘어가 옆 기타와(과) 붙었으면: `Some objects cross into the next cell. Redraw the sheet with every guitar and its objects fully inside its own cell and more empty space between cells.`
- 눈 내리는 하늘·방 배경이 들어갔으면: `Remove the background scene and the falling snow. Make it completely transparent (or flat white) with nothing behind the guitars except the objects described.`
- 뒤에 아우라·빛 번짐이 있으면(전구·초·창·별 포함): `Remove the glow / aura / soft light around the guitars. Lights and effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- zip을 안 만들었으면: `Now make the zip file as described in FINAL STEP and put it into my Google Drive folder "기타 키우기" (or give me a download link).`
