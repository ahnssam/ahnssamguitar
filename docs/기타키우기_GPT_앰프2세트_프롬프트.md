# 기타 키우기 — 앰프 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-18 사용자: "이제 프롬프트 2개, 앰프하고 이펙터도 디자인 프롬프트 짜서 만들어 줘."
CLAUDE.md 11절 'GPT 그림 프롬프트 쓰는 법' ①~④를 모두 넣어 썼다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 노브·전원 램프·손잡이 개수를 GPT가 스스로 세고, 틀린 앰프는 **그 한 대만 따로** 다시 그린다(기타의 헤드머신 세기 대신).
- 앰프 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**. 증기·연기도 외곽선이 또렷한 **단단한 뭉게구름 모양**으로만 그린다.
- **단계 격차를 크게**
  - +0~+4: **앰프 자체가** 박살 난 진짜 쓰레기.
  - +5~+7: 고쳤지만 수수하다.
  - +8~+11: '오, 좀 멋있어지려나?'
  - +12~+19: **앰프 자체가** 전설의 증기 기계로 변신하는 '와, 진짜 갖고 싶다' 급.
  - +20: 그보다 더.

## 0. 이 세트의 모양과 이야기

- **세트 이름: 증기기관 앰프** (게임 `dexName`, 이름은 Claude가 지음 — 바꿔도 된다).
  - 2세트가 들어가면 1세트에도 세트 이름이 필요하다. 1세트는 별빛 → 오로라 → 은하 → 태양 → 신들의 무대로 가니 **'은하 앰프'**를 권한다.
- 1세트는 까만 연습용 소형 앰프(은색 그릴)다(`docs/기타키우기_GPT_새계열_프롬프트.md` 6절, +10~+20은 15절).
- **2세트는 초콜릿색 가죽을 씌운 빈티지 진공관 앰프**다. 크림색 테두리 선, 밀짚색 그릴 천, 위쪽 크롬 판에 노브 6개 + 빨간 보석 전원 램프 하나, 네 모서리 황동 보호대, 가죽 손잡이. 1세트보다 조금 키가 크다.
- 이야기 줄기 — **스팀펑크(증기 기관·황동 기계)**
  - **+0~+4**: 버려진 기관실·철도 창고에서 망가진 쓰레기. 석탄 그을음, 녹, 튀어나온 리버브 스프링, 쥐가 갉아 먹음, 깨진 진공관.
  - **+5~+7**: 황동 판으로 땜질하고 압력계·구리 관을 단 수수한 앰프.
  - **+8~+11**: 멋있어지기 시작한다. 축음기 나팔 스피커, 톱니바퀴, 증기 기적, 쿵쾅대는 피스톤.
  - **+12~+19**: 앰프 자체가 전설의 증기 기계로 변신한다. 증기 기관차, 비행선, 파이프 오르간, 기계 코끼리, 증기 로봇, 기계 공작새, 황동 성채, 모든 기계를 움직이는 대기관.
  - **+20**: 황금빛 트위드 천을 씌운 1950년대 전설의 앰프.
- 다른 세트에 나온 소재는 피했다.
  - 1세트 앰프: 꽃무늬 이불 그릴, 노끈 손잡이, 창문, 머리 위 앰프, 스피커 네 개, 별빛, 오로라, 천둥, 용, 탑, 운석, 은하, 시간, 태양, 신들의 무대.
  - 기타 1·2세트: 테이프, 버섯, 개, 고양이, 비둘기, 닭·참새·두더지, 개미, 바다·배·보물, 이집트, 북유럽·망치·늑대·뱀, 공룡, 동화(태엽 장난감·마법 거울), 한국 전설, 시계.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 석탄 더미에 묻혀 있던 앰프 | 금 가고 비뚤어진 통, 온통 시커먼 석탄 그을음, 찢어진 그릴에 박힌 석탄 덩이, 한쪽 모서리가 푹 꺼짐, 손잡이 끊어짐 |
| +1 | 녹물이 줄줄 흐르는 앰프 | 녹투성이, 벗겨진 가죽을 타고 흐르는 주황 녹물 줄, 삭아 버린 황동 모서리, 아래로 똑똑 새는 물, 그릴의 곰팡이 얼룩 |
| +2 | 스프링이 튀어나온 앰프 | 터진 스피커, 찢어진 그릴 사이로 사방에 튀어나온 리버브 스프링, 불룩 부풀어 한쪽 이음새가 벌어진 통 |
| +3 | 쥐가 갉아 먹은 앰프 | 갉아 먹힌 모서리·손잡이, 구멍이 숭숭 난 그릴, 안에 종이 부스러기 둥지와 빼꼼 내다보는 귀여운 생쥐 |
| +4 | 진공관이 다 깨진 앰프 | 위에 삐죽삐죽 깨진 진공관 유리 밑동들, 해진 전선에서 튀는 작은 불똥(단단한 모양), 벗겨진 가죽, 여전히 더럽고 찌그러짐 |
| +5 | 황동으로 땜질한 앰프 | 닦아 내고, 금 간 곳을 리벳 박은 황동 판으로 덮음, 새 수수한 그릴 천. 드디어 소리 남 |
| +6 | 압력계를 단 앰프 | 옆에 붙인 바늘 하나짜리 둥근 황동 압력계(눈금만)와 작은 밸브 바퀴. 아직 수수함 |
| +7 | 구리 관이 칭칭 감긴 앰프 | 통을 감고 위에서 뒤로 이어지는 가는 구리 관들. 아직 수수함 |
| +8 | 나팔 스피커를 단 앰프 | 여기서부터 멋있어지기 시작: 위에 얹은 커다란 축음기 나팔 스피커(번쩍이는 황동), 진한 자줏빛 가죽, 광낸 황동 모서리 |
| +9 | 톱니바퀴가 돌아가는 앰프 | 열린 옆판 안에 돌아가는 황동 톱니바퀴들, 앞의 작은 유리창에 보이는 주황 진공관 두 개(단단한 색), 가장자리 황동 리벳 |
| +10 | 증기 기적을 울리는 앰프 | 위에 황동 기적과 짧은 굴뚝 둘, 피어오르는 단단한 흰 증기 뭉치, 자줏빛 가죽에 황동 징, 구리 장식 |
| +11 | 피스톤이 쿵쾅대는 앰프 | 양옆에 쿵쾅대는 큰 황동 피스톤, 한쪽에 황동 플라이휠, 둘을 잇는 구리 관, 그릴이 황동 그물로 |
| +12 | 증기 기관차가 된 앰프 | **통 전체가 증기 기관차 앞모습**: 리벳 박은 검은 쇠·황동 보일러, 그릴 자리는 둥근 보일러 문, 위에 큰 황동 전조등과 높은 굴뚝(단단한 연기 뭉치), 아래 빨간 배장기, 양옆 빨간 바큇살 큰 바퀴와 연결봉 |
| +13 | 하늘을 나는 비행선 앰프 | 통이 광낸 마호가니·황동 비행선 곤돌라, 바로 위에 앉은 자주·크림 줄무늬 기구(앰프 폭만큼), 밧줄, 양옆에 도는 황동 프로펠러, 아래 작은 황동 착륙 다리 |
| +14 | 증기 파이프 오르간이 된 앰프 | 통이 조각한 짙은 마호가니 파이프 오르간, 뒤로 부채처럼 솟은 번쩍이는 황동 파이프들, 그릴이 화려한 황동 격자, 파이프의 작은 밸브에서 단단한 증기 뭉치 |
| +15 | 기계 코끼리가 된 앰프 | 통이 리벳 박은 황동 기계 코끼리 몸통(옆모습): 왼쪽에 부채 귀·상아·마디진 코를 말아 올린 황동 머리, 아래 튼튼한 피스톤 다리, 위에 보석 박힌 빨강·금 안장 천. 노브 판과 그릴은 코끼리 옆구리에 그대로 |
| +16 | 증기 로봇이 된 앰프 | 통이 거대한 증기 로봇의 가슴: 양옆 리벳 박은 황동 팔과 집게손, 짧고 굵은 피스톤 다리, 위에 동그란 현창 머리와 단단한 호박색 두 눈(귀엽고 멋있게), 어깨 관에서 단단한 증기 뭉치 |
| +17 | 기계 공작새가 깃든 앰프 | 통이 보석 박힌 황동·청록 법랑 기계, 뒤로 활짝 펼친 황동·청록 법랑 공작 꽁지(사파이어 '눈' 무늬), 위 모서리에서 솟은 볏 달린 황동 공작 머리, 온통 금 세공 |
| +18 | 황동 성채가 된 앰프 | 통이 광낸 황동·구리 성채 도시: 위와 옆에 쌓인 작은 탑·둥근 지붕·굴뚝·구름다리·돌아가는 작은 톱니, 글자 없는 삼각 깃발, 창마다 단단한 호박색 불빛 |
| +19 | 모든 기계를 움직이는 대기관 앰프 | 통이 거대한 기계의 황금 심장: 번쩍이는 금·황동·구리, 뒤에서 햇살처럼 도는 거대한 황금 플라이휠(단단하게), 양옆에 솟은 피스톤, 바늘 계기, 단단한 증기를 뿜는 기적, 위에 톱니 왕관, 모서리마다 루비 — 세트 최고 전설 |
| +20 | **레오 팬더의 앰프** | 1950년대 앰프 모양, 황금빛 니스 칠 트위드 천(빗살 무늬 직물), 검붉은·금 그릴 천, 크롬 판의 크롬 노브 6개와 빨간 보석 램프, 가죽 손잡이, 완벽하게 보존된 광택. 뒤로 외곽선이 또렷한 금·크림 빛살과 단단한 반짝이(빛 번짐·아우라 없이) |

- +20 이름은 앰프를 만든 전설의 사람 이름을 살짝 바꾼 것(1세트 +20 '짐 마살의 앰프'와 같은 식). '팬더'는 판다를 닮게 일부러 바꿨다.
- +20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다): **브라이언 매이의 앰프** — 낡은 라디오 부품으로 손수 만든 작은 나무 앰프, 같은 크롬 판, 빨강·금 빛살.

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 노브 6개(한 줄)·전원 램프 1개·손잡이 1개인지 ChatGPT가 스스로 센다. 틀린 앰프는 그 앰프 **한 대만 따로** 다시 그리게 했다. 압력계·밸브·레버는 노브로 세지 않고 노브 줄에서 떨어뜨리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 노브·램프·손잡이 개수를 세고, 틀린 앰프는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **앰프 뒤 아우라·빛 번짐·흐릿한 증기**만 아니면 된다.
5. 받은 그림을 구글 드라이브 `기타 키우기/1 악기/앰프/2세트 증기기관/`(드라이브 맨 위 `0 정리표.txt` 참고)에 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 앰프와 같은 정사각형 틀(448×448, 아래 맞춤)에 넣고 `images/play/gk/amp2_00`~`20.webp`로 넣는다.
   - 게임에서는 앰프가 나오면 반반으로 1세트·2세트가 나오고, 도감에 '증기기관 앰프' 줄이 생긴다.
   - 게임 코드가 앰프를 'amp'라는 이름으로 알아보는 곳(컬렉션 바닥 자리·파괴 줄이는 능력치·그림 폭 `FLOOR_ART_W`)이 여러 군데라, 넣을 때 'amp2'도 앰프로 치게 같이 고친다.
   - 서버(랭킹·오늘의 상대)도 'amp2'를 받게 SQL 한 개가 더 필요하다(앰프는 '최고 무기'에는 안 들어가니 대표 계열 목록에만 더함).

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": gear is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitar AMPLIFIERS as THREE images:
- IMAGE A: amps +0 to +9 (one sprite sheet)
- IMAGE B: amps +10 to +19 (one sprite sheet)
- IMAGE C: amp +20 (one single amp)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

POWER CURVE (the most important rule of this set - the jump between levels must be HUGE and obvious, like a real upgrade game)
- +0 to +4: TOTAL GARBAGE. The amp ITSELF is wrecked - sooty, rusty, cracked, bulging, chewed, with broken tubes and missing parts - NOT a clean amp with a funny object stuck on it. Anyone would throw it in the trash. Funny and gross-cute, never scary or bloody.
- +5 to +7: repaired and working, but still plain and humble.
- +8 to +11: "oh, this is getting cool" - polished brass, rich leather, the steam theme starts to change the amp itself, clearly cooler with every step.
- +12 to +19: "WOW, I NEED this" - jaw-dropping legendary rare items. The amp ITSELF transforms into a legendary steam-age machine (a locomotive, an airship, a pipe organ, a mechanical elephant, a steam robot, a mechanical peacock, a brass citadel, a great golden engine), with big dramatic sculptural details, intricate brass and copper work and rich bold color. Never just a normal amp with an object placed next to it. Each one more spectacular than the one before.
- +20: the ultimate amp, the most impressive of all.
Even when the amp transforms, keep its front face - the chrome control panel with its row of six knobs and the speaker grill area - clearly visible, so it is still clearly this amp.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the amps. Order: top row left to right = amps 1-5, bottom row left to right = amps 6-10. Every amp and all of its objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every amp stands on the bottom of its cell, seen from the front with a slight view of the top, centered, all at about the SAME width (about 70% of the cell width), with the bottom of every amp at the same height. Each amp together with all its objects must fit inside a roughly SQUARE area: decorations may rise above the amp by at most about half of the amp's height, and stick out to the sides only a little.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, sky, factory or landscape backgrounds, gradients or floor shadows behind the amps - only the amp and the solid objects described.
- NO AURA OR GLOW (very important - I have to cut every amp out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any amp. Steam and smoke must be SOLID, OPAQUE puffs with a clear dark outline, like cartoon cloud shapes - never soft see-through vapour. Glowing tubes and windows are solid bright colors with no light spilling around them. Every effect (steam, sparks, flames, rays, sparkles) is a solid shape with hard edges, sitting close to its own amp.
- NO text, letters, numbers or logos anywhere - gauges and dials have only tick marks and a needle, knobs have only tick marks, plates and flags are blank.
- NO people anywhere - only animals, machines and objects.
- Original designs only: no real amp brand shapes, logos or name plates.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE AMP (all 21 are this same amp, changed as described): a vintage-style tube combo guitar amplifier, a little taller than it is wide - a wooden cabinet covered in dark chocolate-brown leather-look vinyl with thin cream piping along the edges, a wheat-colored grill cloth covering the lower two thirds of the front, a chrome control panel across the top of the front with exactly SIX pointer knobs in one straight row and ONE small round red jewel power light at the right end of the panel, four brass corner protectors, and a brown leather strap handle on top.
- KNOBS (very important, even for the garbage amps): every amp has exactly SIX knobs in one straight row on its control panel (a broken knob still shows its stump and still counts), exactly ONE jewel power light and exactly ONE handle on top (a snapped or chewed handle still shows its ends). Gauges, valves, levers and dials added by the designs are extra decorations, are NOT knobs, and must stay away from the knob row. Nothing (steam, pipes, animals, gears, flags) may cover the knob row or the power light.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every amp one by one: count the knobs in its row (6), its power light (1) and its handle (1). Check that no amp has glow, aura, mist, see-through steam, a background scene or soft light around or behind it, and that each amp with its objects fits a roughly square area. Check the POWER CURVE: +0 to +4 must look like total garbage (the amp itself wrecked), +8 onward must clearly get cooler, and +12 to +19 must be jaw-dropping transformations - if one is not, redraw it bolder. If ANY amp is wrong (5 or 7 knobs, two power lights, a missing handle), immediately redraw ONLY that amp as its own single image - square 1024x1024, transparent background, same design, same style, standing on the bottom and centered, about 70% of the image width - one amp per image, one at a time. Check each redraw the same way. Then write one short line saying which amps you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - amps +0 to +9
From TOTAL GARBAGE (a vintage amp left to rot in an abandoned engine room and railway shed) to a steam-age amp that starts to look legendary.
1. (+0) Buried in a coal heap: the cabinet cracked and crooked, everything black with coal soot, lumps of coal stuck in the torn grill, one corner caved in, the handle snapped in the middle.
2. (+1) Rusting in the rain: rust everywhere, orange rust streaks running down the peeling vinyl, the brass corners rusted through, water dripping out of the bottom, mold spots on the grill cloth.
3. (+2) Springs bursting out: the speaker cone burst, coiled reverb springs sproinging out of the torn grill in every direction, the cabinet bulging and split open along one seam.
4. (+3) Chewed by mice: the corners and the handle gnawed away, the grill full of chewed holes, a nest of shredded paper inside with a cute little mouse peeking out.
5. (+4) Every tube smashed: jagged glass stubs of broken vacuum tubes sticking out of the top, frayed cables throwing small solid sparks, the vinyl peeling off, still filthy and dented.
6. (+5) Patched with brass: cleaned up, the cracks covered with riveted brass patch plates, a new plain grill cloth - plain but finally playable.
7. (+6) Pressure gauge: a round brass pressure gauge with one needle and a small brass valve wheel mounted on the side of the cabinet - still plain.
8. (+7) Copper pipes: thin copper pipes wrapped around the cabinet, running from the top down to the back - still humble.
9. (+8) Gramophone horn (now it starts to look cool): a big polished brass gramophone-style horn speaker mounted on top, pointing up and forward, the vinyl now rich oxblood leather, polished brass corners.
10. (+9) Gears: the side panels opened to show polished brass gears and cogs, a small round glass window in the grill showing two vacuum tubes as solid bright orange shapes, brass rivets along every edge - clearly cooler than the amps before it.

IMAGE B - amps +10 to +19
A STEAM-AGE MACHINE legend theme: polished brass, copper, gold, oxblood leather, dark mahogany, black iron, teal enamel and rubies. +10 and +11 are cool and getting very special; from +12 the amp ITSELF transforms into a legendary steam machine and becomes "WOW, I NEED this", each one more spectacular than the last. Keep the front face with the chrome panel (six knobs in a row, one jewel light) and the grill area visible under all the decoration. Remember: no people, no background scene, no glow, steam only as solid outlined puffs - only the amp and the solid objects described.
1. (+10) Steam whistles: polished brass steam whistles and two short chimneys on top puffing solid outlined white steam puffs, the oxblood leather studded with brass, copper trim along the edges.
2. (+11) Pistons: two big brass pistons pumping on both sides, a brass flywheel on one side, polished copper pipes joining them, the grill turned into fine brass mesh.
3. (+12) Steam locomotive: the WHOLE cabinet becomes the front of a black-iron and brass steam locomotive - riveted boiler plates, the grill area becomes the round boiler front door with brass hinges, a big brass headlight and a tall smokestack puffing solid outlined smoke puffs on top, a red cowcatcher at the bottom, big red-spoked driving wheels with connecting rods on both sides. The chrome knob panel runs across the top front like the cab controls.
4. (+13) Airship: the cabinet becomes the polished mahogany and brass gondola of an airship, a compact burgundy-and-cream striped balloon resting right on top of it (about as wide as the amp), rope rigging, brass propellers spinning on both sides, small brass landing legs underneath.
5. (+14) Steam pipe organ: the cabinet becomes a grand pipe organ of carved dark mahogany, a fan of tall polished brass organ pipes rising behind it, the grill turned into an ornate brass lattice, little brass valves on the pipes puffing solid steam puffs.
6. (+15) Mechanical elephant: the cabinet becomes the riveted brass body of a mechanical elephant seen from the side - a big brass elephant head with fan-shaped ears, ivory-white tusks and a curled segmented trunk on the left, sturdy brass piston legs underneath, a jeweled red-and-gold saddle cloth on top. The knob panel and grill stay on the elephant's flank.
7. (+16) Steam robot: the cabinet becomes the chest of a giant steam-powered robot - riveted brass arms with pincer hands at the sides, short stout piston legs, a round porthole head with two solid amber eyes on top (cute-cool, not scary), pipes on its shoulders puffing solid steam puffs. The grill is in the middle of its chest.
8. (+17) Mechanical peacock: the cabinet becomes a jeweled brass and teal-enamel machine, a huge fan of brass and teal-enamel peacock tail feathers with sapphire eye-spots spread behind it, a crested brass peacock head rising from one top corner, gold filigree everywhere.
9. (+18) Brass citadel: the cabinet becomes a fortress-city of polished brass and copper - little towers, domes, smokestacks, catwalks and tiny turning gears stacked on its top and sides, blank pennant flags, windows filled with solid warm amber color.
10. (+19) The great engine that drives all machines: the cabinet becomes the golden heart of a colossal machine - gleaming gold, brass and copper, a giant golden flywheel turning behind it like a sunburst, towering pistons on both sides, needle gauges, whistles puffing solid steam puffs, a crown of gears on top, rubies set in every corner - the most legendary amp of the sheet.

IMAGE C - amp +20 (single image)
One amp, square 1024x1024, transparent background, standing on the bottom and centered, about 70% of the image width, same style and same base amp proportions as the sheets, six knobs in a row, one jewel light, one handle.
The legendary amp maker's own amp, the ultimate amp of the set: a classic 1950s-style combo amp covered in golden lacquered tweed cloth with a fine diagonal weave, an oxblood-and-gold grill cloth, a chrome control panel with six chrome pointer knobs and a red jewel power light, a leather handle, perfectly preserved and gleaming like new. Behind it big solid gold and cream starburst rays with clear outlines (no glow), and solid outlined sparkles close around the amp. No aura, no glow, no soft light - show its legend through the rich details, so it looks like the most powerful amp in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 노브 개수가 또 틀렸으면: `Amp A4 has 5 knobs. Redraw only A4 as a single square image with exactly six knobs in one row, one jewel light and one handle.`
- 초반이 덜 망가졌으면: `Amps A1-A5 still look like clean amps with objects stuck on. Redraw them so the amp ITSELF is wrecked - sooty, rusty, cracked, bulging, chewed, broken tubes.`
- +8부터 안 나아지면: `A9 and A10 must look clearly cooler than A6-A8. Redraw them with polished brass, rich oxblood leather and the steam theme changing the amp itself.`
- +12부터가 덜 멋있으면: `B3-B10 still look like a normal amp with an object next to it. Redraw them so the amp itself transforms into the legendary steam machine - jaw-dropping legendary items.`
- 증기·연기가 뿌옇게 나왔으면: `The steam is soft and see-through. Redraw it as solid opaque puffs with clear dark outlines, like cartoon clouds.`
- 계기판·밸브가 노브 줄을 가렸으면: `On amp B5 the pipes cover the knob row. Redraw only B5 with all six knobs and the power light fully visible.`
- 사람(기관사·발명가)이 들어갔으면: `Remove the person. No people at all - only machines, animals and objects. Redraw only that amp.`
- 장식이 너무 높게 솟았으면: `The decorations on B5 rise far above the amp. Redraw it so the amp and its objects fit a roughly square area.`
- 그림이 칸을 넘어가 옆 앰프와 붙었으면: `Some objects cross into the next cell. Redraw the sheet with every amp and its objects fully inside its own cell and more empty space between cells.`
- 공장·하늘 배경이 들어갔으면: `Remove the background scene. Make it completely transparent (or flat white) with nothing behind the amps except the objects described.`
- 앰프 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the amps. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
