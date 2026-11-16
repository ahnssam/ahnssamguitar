# 기타 키우기 — 베이스 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-17 사용자: "스트랫·텔레·레스폴 두 세트 있으니까, 안 겹치게 이번엔 통기타하고 베이스 새로운 2세트 프롬프트."
같은 날 사용자: "좀 더 격한 차이가 나도 좋을 것 같아. 초반 +4까지는 진짜 쓰레기스럽다가, 갈수록 점점 멋있어지더니, +13쯤부터는 '와 개쩐다' 할 정도로." → **단계 격차 규칙**(CLAUDE.md 11절 'GPT 그림 프롬프트 쓰는 법' ④)으로 썼다.

스트랫·텔레·레스폴·통기타 2세트와 같은 규칙이다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 헤드머신·기둥·줄 개수를 GPT가 스스로 세고(베이스는 4개씩), 틀린 베이스는 **그 한 대만 따로** 다시 그린다.
- 베이스 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**(누끼 따기 힘듦). 효과는 외곽선이 또렷한 단단한 모양으로만 그린다.
- **단계 격차를 크게**:
  - +0~+4: 버릴 물건으로 보이는 진짜 쓰레기.
  - +5~+9: 고쳐지며 점점 멋있어진다.
  - +10~+12: 멋진 마법 베이스.
  - +13~+19: 베이스 자체가 귀한 재질·공룡 갑옷으로 변신하는 '와 개쩐다' 급.
  - +20: 그보다 더.

## 0. 이 세트의 모양과 이야기

- 1세트(지금 게임에 있는 것)는 3톤 선버스트에 거북 무늬 픽가드, 헤드머신이 한 줄로 4개인 오프셋 베이스다. 동아리방 → 5현·스피커·긴 넥·고래 → 심장·심해·화산·지구·거인·블랙홀·대지·천둥·행성·첫 음 → 자코 파스토리오로 간다(`docs/기타키우기_GPT_새계열_프롬프트.md` 10·15절).
- **2세트는 체리 레드 바이올린 모양 할로우 베이스**다. 크림 바인딩, 작은 f홀 두 개, 넥 쪽 작은 픽업 두 개, 크림 컨트롤 판, 긴 사다리꼴 테일피스. 헤드머신은 **양쪽에 2개씩**이라 1세트(한 줄 4개)와 헤드부터 다르다.
- 이야기 줄기
  - **+0~+4**: 시골 밭에 버려져 썩어 가던 쓰레기. 허수아비 팔, 두더지 구멍, 암탉 둥지, 참새 전깃줄, 짚더미.
  - **+5~+9**: 탐험가가 가죽 끈으로 고쳐 들고 다닌다. 배낭·정글 앵무새·발굴 도구를 지나 화석이 깨어난다.
  - **+10~+12**: 공룡 시대. 공룡 알, 앰버 보석, 암모나이트.
  - **+13~+19**: 베이스 자체가 공룡 갑옷으로 변신한다. 트리케라톱스, 스테고사우루스, 프테라노돈, 스피노사우루스, 매머드 상아, 공룡 뼈 왕좌, 티라노 왕.
  - **+20**: 1960년대 전설적인 밴드 베이시스트의 선버스트 바이올린 베이스.
- 공룡·동물은 늘 **친근하지만 웅장하게** 그린다. 무섭거나 피 나는 모습은 없다.
- 1세트 베이스와 다른 2세트들에 나온 소재는 피했다.
  - 1세트 베이스: 동아리방, 줄 세 개, 슬랩 자국, 안 보이는 베이스, 프렛 없음, 5현, 스피커·물컵, 긴 넥, 고래 몸통, 땅울림, 심장, 심해, 화산, 지구본, 거인 발자국, 블랙홀, 이끼 돌, 천둥, 행성, 태초의 빛.
  - 스트랫 2세트: 테이프, 버섯, 개, 낚싯줄, 용접, 금붕어, 먹물, 한국 전설(청룡 등).
  - 텔레 2세트: 도마, 라면, 트럭, 비둘기, 대걸레, 조개, 바다 전설.
  - 레스폴 2세트: 문 받침, 고양이, 뚫어뻥, 껌, 바퀴, 금 이음, 피아노, 턱시도, 경매, 박물관, 이집트 전설.
  - 같은 날 만든 통기타 2세트(`docs/기타키우기_GPT_통기타2세트_프롬프트.md`)의 학교·장난감·옛이야기와도 안 겹친다.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 허수아비 팔로 쓰던 베이스 | 햇볕에 바래 쩍쩍 갈라진 칠, 아래 가장자리가 썩어 부스러짐, 넥에 묶인 해진 체크무늬 셔츠 소매, 금과 f홀에서 삐져나온 짚, 줄 밑에 끼운 까마귀 깃털, 녹슬어 축 늘어진 줄, 휜 헤드머신 하나(4개 그대로) |
| +1 | 두더지가 뚫고 나온 베이스 | 아래 몸통을 뚫은 커다란 너덜너덜한 구멍과 고개를 내민 귀여운 두더지, 덕지덕지 굳은 진흙, 흙덩이, 삐죽 나온 뿌리, 꿈틀대는 지렁이 한 마리(귀엽게) |
| +2 | 암탉 둥지가 된 베이스 | 금 간 몸통에 쑤셔 넣은 짚 둥지(받침 쪽, 줄은 안 가림)와 그 위에 앉은 통통한 암탉, 둥지 속 알 두 개, 깃털·달걀 껍데기 조각, 흙 묻은 몸통 |
| +3 | 참새 떼 전깃줄이 된 베이스 | 전깃줄처럼 줄 위에 나란히 앉은 동글동글 참새 다섯 마리(줄 4개 그대로), 휜 넥, 녹, 벗겨진 칠, 만화 같은 흰 새똥 몇 점 |
| +4 | 짚더미에 처박혀 있던 베이스 | 사방으로 꽂힌 짚, 옆에 기댄 쇠스랑, 스트랩 버튼에 걸린 해진 밀짚모자, 금 간 몸통, 굳은 진흙, 노브 하나 없음 |
| +5 | 가죽 끈으로 동여매 고친 베이스 | 구멍을 리벳 박은 가죽 조각으로 때우고 금 간 데를 놋쇠 버클 가죽 끈으로 동여맴, 다시 반짝이는 체리 레드. 수수하지만 깔끔, 드디어 소리 남 |
| +6 | 탐험 배낭을 멘 베이스 | 스트랩 버튼에 매단 캔버스 탐험 배낭, 뒤에 꽂은 둘둘 만 빈 지도, 컨트롤 판의 놋쇠 나침반(바늘만), 몸통 모서리의 놋쇠 보호 장식 |
| +7 | 정글 앵무새가 앉은 베이스 | 위 몸통에 앉은 화려한 금강앵무, 받침에 펼쳐진 커다란 몬스테라 잎, 바인딩을 따라 정글 초록 상감 |
| +8 | 발굴 도구가 꽂힌 베이스 | 받침의 흙더미에 꽂힌 작은 곡괭이·붓·모종삽, 옆에 기댄 놋쇠 돋보기, 반짝반짝 닦인 몸통과 놋쇠 탐험대 문장 |
| +9 | 화석이 깨어나는 베이스 | 아래 몸통이 층층 바위로 바뀌며 드러난 고사리 화석과 작은 뼈 화석, 받침 흙에 찍힌 세 발가락 공룡 발자국, 단단한 호박색 반짝이. 벌써 멋진 특별한 베이스 |
| +10 | 공룡 알에서 깨어난 베이스 | 받침에서 쩍 갈라진 커다란 점박이 알과 고개를 내민 귀여운 아기 공룡, 둘레의 알껍데기 조각 |
| +11 | 앰버 보석에 갇힌 베이스 | 몸통이 반들반들한 꿀빛 앰버(불투명, 단단한 하이라이트), 그 안에 보이는 작은 곤충 화석, 앰버 노브, 금빛 바인딩 |
| +12 | 암모나이트가 박힌 베이스 | 보석처럼 몸통에 박힌 커다란 소용돌이 암모나이트 화석들, 가장자리를 따라 작은 삼엽충 화석 |
| +13 | 트리케라톱스 갑옷을 두른 베이스 | **몸통 전체가 트리케라톱스 갑옷** — 위 몸통 뒤로 펼쳐진 가시 박힌 커다란 뼈 프릴, 양쪽 위 뿔이 기다란 상아 뿔로, 아래 끝에 세 번째 뿔, 금 테두리 비늘 갑옷판 |
| +14 | 스테고사우루스 골판을 세운 베이스 | 몸통 양쪽 가장자리를 따라 솟은 거대한 앰버 크리스털 골판(단단하게), 받침을 휘감는 가시 꼬리, 초록·금 비늘 몸통 |
| +15 | 프테라노돈이 날개를 펼친 베이스 | 베이스 뒤로 칸 가득 활짝 편 거대한 프테라노돈 날개(날개막에 핏줄 무늬), 스트랩 버튼을 움켜쥔 금빛 발톱, 몸통 위쪽의 프테라노돈 볏 장식(헤드는 안 가림) |
| +16 | 스피노사우루스 돛을 단 베이스 | 몸통 뒤에서 솟은 거대한 빨강·금 가시 돛, 악어 같은 짙은 빨강·청동 비늘 몸통, 바인딩에 박힌 공룡 이빨 화석 |
| +17 | 매머드 상아로 깎은 베이스 | 몸통이 상아빛으로 반들거리는 매머드 상아 조각(무늬 새김, 글자 없음), 받침을 크게 휘감은 끝이 금빛인 거대한 상아 두 개, 덥수룩한 갈색 털 테두리 |
| +18 | 공룡 뼈 왕좌에 오른 베이스 | 금 테두리 두른 거대한 공룡 뼈 화석 왕좌에 선 베이스, 등받이 꼭대기의 뿔 달린 거대한 공룡 해골(헤드는 안 가림), 왕좌에 박힌 앰버 보석 |
| +19 | 티라노 왕의 베이스 | 몸통이 금·청동 비늘 티라노 왕의 갑옷, 아래 몸통을 감싼 티라노 해골 턱과 단단한 상아 이빨, 앰버 보석 눈, 뒤에서 몸을 일으켜 하늘로 포효하는 거대한 티라노(웅장하게, 피 없이), 받침의 갈라진 바위 |
| +20 | **폴 맥카드니의 베이스** | 오래 아껴 쓴 고전 갈색·호박색 선버스트 바이올린 베이스, 금도금 부품, 픽가드에 새긴 금 소용돌이 무늬, 진주·금 인레이, 크림 바인딩, 뒤로 외곽선이 또렷한 커다란 크림·금 빛살, 둘레를 감아 도는 단단한 빨간 하트와 음표(빛 번짐·아우라 없이) |

+20은 바이올린 베이스로 유명한 사람이라 다른 후보는 적지 않았다. 다른 베이시스트로 바꾸려면 기본 모양(바이올린 몸통)부터 바꿔야 한다.

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 4개씩인지 ChatGPT가 스스로 센다(양쪽에 2개씩). 틀린 베이스는 그 베이스 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수(4개씩)를 세고, 틀린 베이스는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **베이스 뒤 아우라·빛 번짐**만 아니면 된다.
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 베이스와 같은 틀(448×672)에 맞추고 `images/play/gk/bass2_00`~`20.webp`로 넣는다. 바이올린 베이스는 1세트보다 짧아서, 몸통 아래 끝·넥 가운데를 맞추고 길이는 그림대로 둔다.
   - 게임에서는 베이스가 나오면 반반으로 1세트·2세트가 나오고, 도감에 '베이스 2' 줄이 생긴다(스트랫 2세트와 같은 방식).
   - 서버(랭킹·오늘의 상대)도 'bass2'를 받게 SQL 한 개가 더 필요하다(텔레·레스폴·통기타 2세트와 한 번에 만들 수 있다).

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": an instrument is upgraded step by step from +0 to +20. Please draw a NEW set of 21 electric BASS guitars as THREE images:
- IMAGE A: basses +0 to +9 (one sprite sheet)
- IMAGE B: basses +10 to +19 (one sprite sheet)
- IMAGE C: bass +20 (one single bass)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

POWER CURVE (very important - the jump in quality between levels must be HUGE and obvious)
- +0 to +4: REAL GARBAGE. Broken, rotten, filthy, cracked, warped, rusty, muddy - something anyone would throw away and nobody would ever want to play. Funny and gross-cute, never scary or bloody.
- +5 to +9: repaired and getting nicer and cooler step by step - by +9 it already looks like a cool, special bass.
- +10 to +12: impressive magical basses.
- +13 to +19: absolutely JAW-DROPPING, legendary rare-item level. The bass itself transforms into dinosaur armor and precious materials (bone, ivory, amber crystal, gold, bronze scales), with big dramatic sculptural creatures and decorations, intricate detail and rich bold color - each one more spectacular than the one before, the kind of item players scream "WOW" at.
- +20: the ultimate bass, even more impressive than +19.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the basses. Order: top row left to right = basses 1-5, bottom row left to right = basses 6-10. Every bass and all of its creatures and objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every bass stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 90% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, dust clouds, sky, jungle, field or landscape backgrounds, gradients or floor shadows behind the basses - only the bass and the solid creatures and objects described.
- NO AURA OR GLOW (very important - I have to cut every bass out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any bass. Every effect (sparkles, rays, hearts, notes, crystals) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own bass, so it can be cut out cleanly. Amber and crystal are drawn as solid shapes with white highlights, not see-through.
- NO text, letters, numbers or logos anywhere. Maps, tags, emblems and carvings are blank or patterns only.
- NO people anywhere - only animals, dinosaurs and objects. Dinosaurs and animals are friendly-looking but mighty, never scary, never bloody.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE BASS (all 21 are this same bass, changed as described): a four-string, violin-shaped hollow-body electric bass in glossy cherry red with a darker red edge burst, cream binding around the body and the neck, two small f-holes, two small chrome pickups near the neck end of the body, a small cream control plate with knobs, a long chrome trapeze tailpiece, a rosewood fingerboard with dot inlays, and a small ORIGINAL headstock with two tuning keys on each side. Even when the body turns into another material or armor (+13 and up), keep the same violin-shaped outline, neck and headstock so it is still clearly this bass.
- HEADSTOCK AND STRINGS (very important, even for the garbage basses): every bass has exactly FOUR tuning keys - two on the left edge and two on the right edge of the headstock - exactly FOUR string posts on the headstock face (two on each side, one post per key), and exactly FOUR strings running from the tailpiece, over the nut, each to its own post. Keys = posts = strings = 4. Nothing (birds, dinosaurs, wings, horns, skulls, hats) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every bass one by one: count its tuning keys (2 + 2), its string posts (2 + 2) and its strings (4). Also check that no bass has glow, aura, mist, a background scene or soft see-through light around or behind it - if one does, redraw that bass without it. Also check the POWER CURVE: +0 to +4 must look like trash, and +13 to +19 must look jaw-dropping - if one does not, redraw it bolder. If ANY bass is wrong (3, 5 or 6 keys, 3 + 1 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that bass as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 90% of the image height - one bass per image, one at a time. Check each redraw the same way. Then write one short line saying which basses you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - basses +0 to +9
From REAL GARBAGE (a cherry violin bass left to rot on a country farm) to an explorer's bass that uncovers a dinosaur fossil. Basses 1-5 must look like trash nobody would touch.
1. (+0) Used as a scarecrow's arm: sun-bleached paint cracked all over, the lower edge rotten and crumbling, a torn plaid shirt sleeve tied around the neck, straw sticking out of the cracks and the f-holes, a black crow feather tucked under the strings, rusty slack strings, one tuning key bent (still four keys).
2. (+1) A mole dug through it: a big ragged hole through the lower body with a cute mole poking its head out, caked dried mud, clumps of soil, roots sticking out, one cute wiggly worm.
3. (+2) Hen's nest: a straw nest stuffed into the cracked lower body near the base (not covering the strings) with a plump brown hen sitting on it, two eggs in the nest, feathers and eggshell bits stuck to the muddy body.
4. (+3) Sparrows' power line: five round little sparrows perched in a row on the strings like birds on a power line (still exactly four strings), the neck warped, rust and peeling paint, a few white cartoon bird droppings.
5. (+4) Pulled out of a haystack: hay sticking out everywhere, a pitchfork leaning against it, a frayed straw hat hanging from the strap button, cracks, caked mud, one knob missing.
6. (+5) Leather-strap repair: the holes patched with riveted leather pieces and the cracks bound with leather straps and brass buckles, polished back to glossy cherry red - plain but neat, finally playable.
7. (+6) Explorer's backpack: a small canvas explorer backpack hanging from the strap button, a rolled-up blank map tucked behind it, a brass compass (needle only, no letters) on the control plate, brass corner guards on the body.
8. (+7) Jungle parrot: a colorful macaw parrot perched on the upper body, big monstera leaves fanning out at the base, jungle-green inlays along the binding.
9. (+8) Dig-site tools: a small pickaxe, a brush and a trowel stuck in a little mound of dirt at the base, a brass magnifying glass leaning beside it, the body polished to a shine with a blank brass explorer emblem.
10. (+9) The fossil awakens: the lower part of the body turning into layered stone with a fossil fern and a small fossil bone showing, a three-toed dinosaur footprint pressed in the dirt at the base, a few solid amber sparkles - it already looks like a cool special bass.

IMAGE B - basses +10 to +19
A PREHISTORIC GIANTS legend theme (dinosaurs and ice-age beasts): amber, bone white, ivory, jungle green, bronze, deep red and gold on the bass. +10 to +12 are impressive; from +13 the bass itself transforms into dinosaur armor and becomes JAW-DROPPING, each one more spectacular than the last. Keep the same violin-shaped outline, neck and headstock (2 + 2 keys, 2 + 2 posts, four strings) under all the decoration. Remember: no people, no background scene, no glow - only the bass and the solid creatures and objects described.
1. (+10) Hatching dinosaur egg: a big speckled egg cracked open at the base with a cute baby dinosaur peeking out, eggshell pieces around.
2. (+11) Trapped in amber: the body turned into glossy honey-orange amber (opaque and polished, with solid white highlights) with a small fossil insect pictured inside, amber knobs, golden binding.
3. (+12) Ammonites: large spiral ammonite fossil shells set into the body like jewels, small trilobite fossils along the edges.
4. (+13) Triceratops armor: the WHOLE body becomes triceratops armor - a huge bony frill with spikes fanning out behind the upper body (not covering the headstock), the two upper bouts ending in long ivory horns, a third horn at the bottom of the body, and gold-rimmed armored scale plates.
5. (+14) Stegosaurus plates: a row of giant solid amber-crystal plates standing up along both edges of the body, a spiked tail curling around the base, the body covered in green-and-gold scales.
6. (+15) Pterodactyl wings: enormous pterodactyl wings spread wide behind the bass filling the cell (wing membranes with vein patterns), golden claws gripping the strap button, a pterosaur crest ornament on the upper body (not covering the headstock).
7. (+16) Spinosaurus sail: a huge red-and-gold spiny sail fin rising from behind the body, the body covered in deep red and bronze crocodile-like scales, fossil dinosaur teeth set along the binding.
8. (+17) Carved mammoth ivory: the body carved from polished ivory-white mammoth tusk with engraved patterns (no letters), two enormous curved tusks with golden tips sweeping around the base, a trim of shaggy brown fur.
9. (+18) Fossil-bone throne: the bass standing on a throne built from giant fossil bones edged in gold, with a huge horned dinosaur skull on top of the throne's back behind the bass (not covering the headstock) and amber jewels set into the throne.
10. (+19) Tyrannosaurus king: the body becomes gold-and-bronze scaled T-rex king armor, a T-rex skull jaw with solid ivory teeth framing the bottom of the body, amber gem eyes, and a huge mighty T-rex rearing up behind the bass and roaring at the sky (majestic and friendly, never bloody), cracked solid rocks at the base.

IMAGE C - bass +20 (single image)
One bass, portrait 1024x1536, transparent background, upright and centered, about 90% of the image height, same style and same violin-shaped bass as the sheets, 2 + 2 keys, 2 + 2 posts, four strings.
The legendary 1960s rock band bassist's bass, the ultimate bass of the set: the same violin-shaped hollow bass in a classic brown-to-amber sunburst, played and loved for decades, now with gold-plated hardware, gold scrollwork engraved on the control plate, pearl-and-gold inlays on the fingerboard and cream binding. Behind it big solid cream-and-gold rays with clear outlines (no glow), and solid red hearts and music notes spiralling close around the bass. No aura, no glow, no soft light - show its legend through the rich details, so it looks like the most powerful bass in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 틀렸으면: `Bass A4 has 3 + 1 tuning keys. Redraw only A4 as a single portrait image with exactly two keys and two posts on each side and four strings.`
- 헤드머신이 한 줄로 4개면(1세트처럼): `The headstock must have two tuning keys on EACH side (2 + 2), not four in a line. Redraw that bass.`
- 초반이 덜 쓰레기 같으면: `Basses A1-A5 still look too nice. Redraw them as real garbage - rotten, cracked, muddy, warped, rusty - something nobody would ever play.`
- +13부터가 덜 멋있으면: `B4-B10 are not impressive enough. Redraw them much more spectacular - the bass body itself transforms into dinosaur armor and precious materials with big dramatic creatures and intricate detail, jaw-dropping legendary items.`
- 공룡·날개·해골이 헤드머신을 가렸으면: `On bass B6 the wing covers the tuning keys. Redraw only B6 with all four keys and posts fully visible.`
- 무섭거나 피가 보이면: `Make the dinosaurs friendly-looking but mighty - no blood, nothing scary. Redraw only that bass.`
- 그림이 칸을 넘어가 옆 베이스와 붙었으면: `Some creatures cross into the next cell. Redraw the sheet with every bass and its creatures fully inside its own cell and more empty space between cells.`
- 정글·하늘·밭 배경이 들어갔으면: `Remove the background scene. Make it completely transparent (or flat white) with nothing behind the basses except the creatures and objects described.`
- 베이스 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the basses. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- 글자·숫자가 들어갔으면: `Remove all text, letters and numbers - maps, tags and emblems stay blank.`
