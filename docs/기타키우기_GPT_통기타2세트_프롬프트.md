# 기타 키우기 — 통기타 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-17 사용자: "스트랫·텔레·레스폴 두 세트 있으니까, 안 겹치게 이번엔 통기타하고 베이스 새로운 2세트 프롬프트."
같은 날 사용자: "좀 더 격한 차이가 나도 좋을 것 같아. 초반 +4까지는 진짜 쓰레기스럽다가, 갈수록 점점 멋있어지더니, +13쯤부터는 '와 개쩐다' 할 정도로." → **단계 격차 규칙**(CLAUDE.md 11절 'GPT 그림 프롬프트 쓰는 법' ④)으로 썼다.

스트랫·텔레·레스폴 2세트와 같은 규칙이다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 헤드머신·기둥·줄 개수를 GPT가 스스로 세고, 틀린 기타는 **그 한 대만 따로** 다시 그린다.
- 기타 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**(누끼 따기 힘듦). 효과는 외곽선이 또렷한 단단한 모양으로만 그린다.
- **단계 격차를 크게**:
  - +0~+4: 버릴 물건으로 보이는 진짜 쓰레기.
  - +5~+9: 고쳐지며 점점 멋있어진다.
  - +10~+12: 멋진 마법 기타.
  - +13~+19: 기타 자체가 귀한 재질로 변신하는 '와 개쩐다' 급.
  - +20: 그보다 더.

## 0. 이 세트의 모양과 이야기

- 1세트(지금 게임에 있는 것)는 밝은 원목 드레드노트에 진한 물방울 픽가드인 통기타다. 교회 창고 → 꽃·카포·점보·12현 → 모닥불 정령·달빛·숲·비·오아시스·오로라·고래·첫눈·등대 → 에릭 크랩튼으로 간다(`docs/기타키우기_GPT_새계열_프롬프트.md` 9·14절).
- **2세트는 새까만 드레드노트 통기타**다. 흰 바인딩, 자개 로제트, 흰 테두리 까만 픽가드, 은빛 헤드머신.
- 이야기 줄기
  - **+0~+4**: 학교 쓰레기통·교실 구석에서 나온 쓰레기. 쩍 갈라진 앞판, 뚫린 구멍, 고무줄 줄, 개미 소굴, 압정·낙서, 화분 받침.
  - **+5~+9**: 태엽을 달아 고친 장난감 상자 기타. 회전목마 금장식, 종이접기, 금실 꼭두각시 무대를 지나 금박 동화책에서 걸어 나온다.
  - **+10~+12**: 옛이야기 왕국. 호박 마차, 태엽 꾀꼬리, 브레멘 음악대.
  - **+13~+19**: 기타 자체가 변신한다. 마법 거울, 라푼젤의 탑, 호두까기 근위대, 사탕 궁전, 지니의 보물, 구름 위 성, 요정 대모의 별 마법.
  - **+20**: 까만 옷의 전설적인 컨트리 가수의 까만 통기타.
- 옛이야기는 그림 형제·안데르센·페로·아라비안나이트처럼 오래된 이야기의 **소재만** 쓴다. 사람(공주·왕자·요정)은 그리지 않고, 영화 속 캐릭터 그림은 따라 하지 않게 했다.
- 1세트 통기타와 다른 2세트들에 나온 소재는 피했다.
  - 1세트 통기타: 교회 창고, 높은 줄, 거미, 모닥불, 넥타이, 꽃, 카포, 점보, 12현, 별빛, 달빛, 숲·새, 비, 사막 오아시스, 오로라, 고래, 첫눈, 등대, 금빛 후광·꽃잎.
  - 스트랫 2세트: 테이프, 버섯, 개, 낚싯줄, 용접, 금붕어, 먹물, 한국 전설.
  - 텔레 2세트: 도마, 라면, 트럭, 비둘기, 대걸레, 조개, 바다 전설.
  - 레스폴 2세트: 문 받침, 고양이 스크래처, 뚫어뻥, 껌, 바퀴, 금 이음, 피아노, 턱시도, 경매, 박물관, 이집트 전설.
  - 같은 날 만든 베이스 2세트(`docs/기타키우기_GPT_베이스2세트_프롬프트.md`)의 밭·탐험·공룡과도 안 겹친다.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 학교 쓰레기통에서 주운 통기타 | 앞판을 쩍 가른 큰 금, 사운드홀 아래 주먹만 한 구멍, 벗겨진 까만 칠 사이로 회색 나무, 살짝 휜 넥, 들뜬 브리지, 녹슬어 축 늘어진 줄, 들러붙은 구겨진 종이 뭉치·빈 주스 팩, 시커먼 얼룩 |
| +1 | 줄 대신 고무줄을 건 통기타 | 줄 여섯 개가 늘어난 알록달록 고무줄(여섯 개 그대로, 저마다 자기 기둥에), 반쯤 뜯겨 까만 집게로 물린 브리지, 움푹 꺼진 앞판, 분필 가루 범벅 |
| +2 | 개미 소굴이 된 통기타 | 사운드홀에 처박힌 과자 봉지(글자 없음), 부스러기, 말라붙은 주황 주스 얼룩, 사운드홀을 들락거리는 개미 줄, 귀퉁이의 초록 곰팡이 점(만화처럼) |
| +3 | 낙서와 압정 범벅인 통기타 | 앞판 가득 매직 낙서(웃는 얼굴·별·하트·화살표, 글자 없음), 군데군데 꽂힌 압정, 아래 가장자리 한 덩이가 떨어져 나감, 휜 헤드머신 하나(6개 그대로) |
| +4 | 교실 잡동사니 선반이 된 통기타 | 아래 몸통에 올라앉은 금 간 토분 선인장, 사운드홀에 꽂힌 리코더, 동그란 물 자국, 흙 부스러기, 여전히 긁히고 더러움 |
| +5 | 태엽을 달아 고친 통기타 | 금을 메우고 깨끗이 닦아 다시 반짝이는 까만 칠, 새 줄, 몸통 옆에 튀어나온 커다란 놋쇠 태엽 열쇠. 수수하지만 깔끔, 드디어 소리 남 |
| +6 | 회전목마 금장식을 두른 통기타 | 빨강·금 줄무늬 바인딩, 금박 테두리, 받침 앞 금빛 기둥 위 작은 회전목마 말 두 마리 |
| +7 | 종이접기 동물이 춤추는 통기타 | 사운드홀에서 쏟아져 나온 알록달록 종이학·종이 개구리·종이배, 몸통의 가는 금 핀스트라이프 |
| +8 | 금실 꼭두각시 무대의 통기타 | 헤드보다 높이 뜬 금 장식 조각 나무 손잡이(헤드머신은 안 가림)에서 내려온 금실들, 받침에 늘어진 빨간 벨벳 무대 막 |
| +9 | 금박 동화책에서 걸어 나온 통기타 | 받침에 펼쳐진 금박 가장자리 커다란 동화책에서 걸어 나옴, 넘어가는 빈 책장, 몸통에 번져 오는 금 넝쿨 무늬, 단단한 금 반짝이. 벌써 멋진 특별한 기타 |
| +10 | 호박 마차를 타고 온 통기타 | 뒤에 선 커다란 주황 호박 마차(금빛 덩굴 바퀴, 작은 문), 받침의 하늘빛 크리스털 구두(투명하지 않게 단단한 모양) |
| +11 | 태엽 꾀꼬리가 노래하는 통기타 | 위 몸통에 앉아 노래하는 보석 박힌 금빛 태엽 꾀꼬리, 단단한 음표, 바인딩을 따라 금빛 넝쿨 |
| +12 | 브레멘 음악대가 올라탄 통기타 | 기타 옆에 차례로 올라탄 당나귀·개·고양이·수탉이 함께 노래함(칸 안, 헤드는 안 가림) |
| +13 | 마법 거울로 변한 통기타 | **앞판 전체가 은빛 거울면**, 둘레를 감싼 화려한 금빛 바로크 소용돌이 틀과 루비·사파이어, 다이아몬드 고리 사운드홀, 위 몸통의 금 문장 장식, 받침에 루비 잎 달린 황금 사과 |
| +14 | 라푼젤의 탑이 솟은 통기타 | 몸통 뒤에서 솟은 흰 돌탑과 분홍·금 뾰족 지붕, 탑 창문에서 쏟아져 기타를 휘감는 아주 긴 금빛 머리채(장미·작은 꽃을 엮음, 헤드머신은 안 가림), 몸통은 흰색·금 상감 |
| +15 | 호두까기 왕의 근위대 통기타 | 몸통이 빨간 옻칠 근위대 제복 — 금 끈 장식, 금단추, 위 몸통 양 어깨의 금 견장, 받침에 경례하는 작은 호두까기 병정 셋, 뒤로 엇갈린 은빛 칼 두 자루 |
| +16 | 사탕 궁전으로 변한 통기타 | 몸통이 무지갯빛 층층 사탕 유리(반들반들, 단단하게), 생강빵 테두리, 양쪽 위 몸통에서 솟은 아이싱 탑과 젤리 지붕, 막대 사탕 첨탑, 받침에 흘러내린 초콜릿 폭포(단단한 모양) |
| +17 | 지니의 보물을 실은 통기타 | 몸통에 터키석·루비·금 아라베스크 상감, 보석 박힌 하늘을 나는 양탄자, 뒤의 커다란 황금 램프와 단단한 보라 연기 소용돌이, 받침에 쌓인 금화·보석·진주 목걸이 |
| +18 | 구름 위 왕국의 성이 된 통기타 | 몸통이 금 장식 흰 대리석, 양쪽 위 몸통과 뒤에서 솟은 분홍·금 첨탑들, 빈 깃발, 받침을 감싼 단단한 흰 구름, 작은 금 다리 |
| +19 | 요정 대모의 별 마법이 깃든 통기타 | 금·진주 넝쿨과 다이아몬드 박힌 짙은 남색 몸통, 단단한 별들이 소용돌이치는 사운드홀, 뒤에 비스듬히 선 커다란 금별 지팡이, 몸통을 감아 도는 단단한 별·하트·리본, 크리스털 구두 모양 상감 |
| +20 | **조니 캐씨의 통기타** | 수십 년 쳐서 사운드홀 아래가 금빛 나뭇결로 닳은 반짝이는 새까만 드레드노트, 지판 가득 은·자개 넝쿨 상감, 자개·전복 로제트, 화려한 은빛 브리지, 새하얀 바인딩, 걸쳐 놓은 은·터키석 장식 스트랩, 뒤로 외곽선이 또렷한 커다란 은·검정 가시 빛살과 단단한 은별(빛 번짐·아우라 없이) |

+20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다)
- **엘비스 프레스니의 통기타**: 같은 까만 통기타에 꽃·별 무늬를 새긴 갈색 가죽 커버를 씌우고 금빛 장식을 단다.
- **토미 엠마누앨의 통기타**: 수십 년 핑거스타일로 쳐서 사운드홀 둘레가 넓게 닳아 원목이 드러난 까만 통기타, 둘레에 단단한 금빛 음표.

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 6개씩인지 ChatGPT가 스스로 센다(통기타는 양쪽에 3개씩). 틀린 기타는 그 기타 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수를 세고, 틀린 기타는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **기타 뒤 아우라·빛 번짐**만 아니면 된다.
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 통기타와 같은 틀(448×672)에 맞추고 `images/play/gk/acoustic2_00`~`20.webp`로 넣는다.
   - 게임에서는 통기타가 나오면 반반으로 1세트·2세트가 나오고, 도감에 '통기타 2' 줄이 생긴다(스트랫 2세트와 같은 방식).
   - 서버(랭킹·오늘의 상대)도 'acoustic2'를 받게 SQL 한 개가 더 필요하다(텔레·레스폴·베이스 2세트와 한 번에 만들 수 있다).

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 acoustic guitars as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

POWER CURVE (very important - the jump in quality between levels must be HUGE and obvious)
- +0 to +4: REAL GARBAGE. Broken, filthy, cracked, warped, rusty, held together with junk - something anyone would throw in the trash and nobody would ever want to play. Funny and gross-cute, never scary or bloody.
- +5 to +9: repaired and getting nicer and cooler step by step - by +9 it already looks like a cool, special guitar.
- +10 to +12: impressive magical guitars.
- +13 to +19: absolutely JAW-DROPPING, legendary rare-item level. The guitar itself transforms into precious materials (gold, silver mirror, jewels, crystal, marble, lacquer, candy glass), with big dramatic sculptural decorations, intricate detail and rich bold color - each one more spectacular than the one before, the kind of item players scream "WOW" at.
- +20: the ultimate guitar, even more impressive than +19.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, sky, room or landscape backgrounds, gradients or floor shadows behind the guitars - only the guitar and the solid objects described.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (sparkles, stars, hearts, clouds, smoke, rays) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly. Glass, crystal and candy are drawn as solid shapes with white highlights, not see-through.
- NO text, letters, numbers or logos anywhere. Books, pages, bags, tags, flags and labels are blank.
- NO people anywhere (no princesses, princes, fairies or human faces) - only animals, toys and objects. The fairy-tale ideas come from old public-domain stories; do not copy any movie's character designs.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a steel-string acoustic guitar with a big dreadnought body in glossy jet black, bright white binding around the body edge, the neck and the headstock, a round soundhole with a mother-of-pearl rosette, a black pickguard outlined in white, a black bridge with six white bridge pins, a dark fingerboard with white dot inlays, silver tuning keys, and an ORIGINAL headstock with three tuning keys on each side. Keep the black body clearly outlined so it reads well on a white background. Even when the body turns into another material (+13 and up), keep the same dreadnought outline, soundhole, neck and headstock so it is still clearly this guitar.
- HEADSTOCK AND STRINGS (very important, even for the garbage guitars): every guitar has exactly SIX tuning keys - three on the left edge and three on the right edge of the headstock - exactly SIX round string posts on the headstock face (three on each side, one post per key), and exactly SIX strings running from the bridge, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (animals, toys, hair, towers, wands, puppet strings) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys (3 + 3), its string posts (3 + 3) and its strings (6). Also check that no guitar has glow, aura, mist, a background scene or soft see-through light around or behind it - if one does, redraw that guitar without it. Also check the POWER CURVE: +0 to +4 must look like trash, and +13 to +19 must look jaw-dropping - if one does not, redraw it bolder. If ANY guitar is wrong (5 or 7 keys, 4 + 2 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From REAL GARBAGE (a black acoustic dug out of a school trash bin and classroom corners) to a toy-box guitar that steps out of a golden storybook. Guitars 1-5 must look like trash nobody would touch.
1. (+0) Dug out of a school trash bin: a big jagged crack splitting the top, a fist-sized hole punched through below the soundhole, the black paint peeling off to grey bare wood, the neck slightly warped, the bridge lifting off, rusty slack strings, crumpled paper balls and an empty juice box stuck to it, dirty black smudges everywhere.
2. (+1) Rubber-band strings: all six strings replaced by stretched, faded colorful rubber bands (still exactly six, each looped around its own post), the bridge half torn off and held on with a black binder clip, the top caved in and dented, covered in chalk dust.
3. (+2) Ant nest: a blank snack bag jammed into the soundhole, crumbs everywhere, dried sticky orange juice stains, a long line of ants marching in and out of the soundhole, a few fuzzy cartoon green mold spots on one corner.
4. (+3) Doodles and thumbtacks: the top scribbled all over with marker doodles (smiley faces, stars, hearts, arrows - no letters or numbers), thumbtacks stuck into the wood here and there, a chunk broken off the lower edge, one tuning key bent sideways (still six keys).
5. (+4) Classroom junk shelf: a cactus in a cracked clay pot sitting on the lower body, a plastic recorder stuck in the soundhole, round water-ring stains, soil crumbs, still scratched and dirty.
6. (+5) Wind-up repair: the cracks filled and the guitar cleaned and polished back to glossy black with new strings, and a big brass wind-up key sticking out of the side of the body like a toy - plain but neat, finally playable.
7. (+6) Carousel gold: red-and-gold striped binding, gold-leaf trim around the body, and two little carousel horses on golden poles standing at the base.
8. (+7) Origami dance: colorful origami cranes, frogs and boats pouring out of the soundhole and dancing on the top, thin gold pinstripes along the body.
9. (+8) Golden puppet stage: an ornate carved wooden marionette control bar with gold trim floating above the guitar (higher than the headstock, not covering the keys), golden puppet strings running down to the edges of the body, a red velvet stage curtain draped at the base.
10. (+9) Out of a golden storybook: the guitar stepping out of a big open storybook with gold-edged pages lying at its base, a few blank pages fluttering, gold vine filigree starting to spread over the black body, a few solid gold sparkles - it already looks like a cool special guitar.

IMAGE B - guitars +10 to +19
A FAIRY-TALE KINGDOM legend theme: gold, rose pink, sky blue, emerald, ruby and pearl on the black guitar. +10 to +12 are impressive; from +13 the guitar itself transforms and becomes JAW-DROPPING, each one more spectacular than the last. Keep the same dreadnought outline, soundhole, neck and headstock (3 + 3 keys, 3 + 3 posts, six strings) under all the decoration. Remember: no people, no background scene, no glow - only the guitar and the solid objects described.
1. (+10) Pumpkin carriage: a big orange pumpkin turned into a little carriage with curly golden vine wheels and a tiny door stands behind the guitar's lower body, and a pale-blue crystal slipper (solid, not see-through) sits at the base.
2. (+11) Clockwork nightingale: a jeweled golden clockwork nightingale perched on the upper body, singing, a few solid music notes around it, golden filigree vines along the binding.
3. (+12) The town musicians: four friendly animals stacked on top of each other beside the guitar - a donkey at the bottom, a dog on its back, a cat on the dog and a rooster on top - all singing together (the stack stays inside the cell and does not cover the headstock).
4. (+13) The magic mirror: the WHOLE top of the guitar becomes a polished silver mirror surface framed by ornate gold baroque scrolls set with rubies and sapphires, the soundhole ringed with diamonds, an ornate gold crest on the upper body, and a golden apple with a ruby leaf at the base.
5. (+14) The tower of the golden braid: a white stone tower with a pink-and-gold pointed spire rises behind the body, and an enormous golden braid pours from its window and coils around the guitar with roses and little flowers woven in (not covering the keys or posts); the body is now white with gold inlays.
6. (+15) Nutcracker king's royal guard: the body becomes a red-lacquered royal guard uniform - gold braid frogging, shiny gold buttons, gold epaulettes on both upper shoulders of the body - with three small nutcracker soldier toys saluting at the base and two silver sabres crossed behind the guitar.
7. (+16) Candy palace: the body becomes glossy rainbow-layered hard candy (solid, with white highlights) with gingerbread trim, frosting towers with gumdrop roofs rising from both upper horns, lollipop spires, and a solid chocolate waterfall pouring down at the base.
8. (+17) Genie's treasure: the body inlaid with turquoise, ruby and gold arabesque patterns, standing on a jewel-studded flying carpet, a huge golden magic lamp behind it with a solid purple smoke swirl, and piles of gold coins, gems and pearl necklaces at the base.
9. (+18) Castle above the clouds: the body becomes white marble with gold trim, pink-and-gold castle spires rise from both upper horns and from behind the body, blank pennant flags fly from the towers, solid white clouds with clear outlines wrap around the base, tiny golden bridges between the towers.
10. (+19) Fairy godmother's star magic: a deep midnight-blue body covered in gold and pearl filigree studded with diamonds, the soundhole a swirling portal of solid stars, a huge golden star-tipped wand standing diagonally behind the guitar, a spiral of solid stars, hearts and ribbons circling the body, crystal-slipper-shaped inlays.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, 3 + 3 keys, 3 + 3 posts, six strings.
The legendary "man in black" country singer's guitar, the ultimate guitar of the set: a glossy jet-black dreadnought played for decades, the black finish worn through to golden bare wood in a pick-worn patch just below the soundhole, the whole fingerboard inlaid with silver and mother-of-pearl vines, an abalone-and-pearl rosette, an ornate silver bridge, bright white binding, and a silver-and-turquoise decorated strap draped over it. Behind it big solid silver-and-black spiky rays like a stage starburst with clear outlines (no glow), and a few solid outlined silver stars close around the guitar. No aura, no glow, no soft light - show its legend through the rich details, so it looks like the most powerful acoustic guitar in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 has 4 + 2 tuning keys. Redraw only A4 as a single portrait image with exactly three keys and three posts on each side and six strings.`
- 고무줄(+1)이 여섯 개가 아니면: `Guitar A2 must have exactly six rubber bands as strings, one for each post. Redraw only A2.`
- 초반이 덜 쓰레기 같으면: `Guitars A1-A5 still look too nice. Redraw them as real garbage - cracked, broken, filthy, warped, rusty - something nobody would ever play.`
- +13부터가 덜 멋있으면: `B4-B10 are not impressive enough. Redraw them much more spectacular - the guitar body itself transforms into precious materials with big dramatic sculptural decorations and intricate detail, jaw-dropping legendary items.`
- 동물·머리채·탑이 헤드머신을 가렸으면: `On guitar B3 the rooster covers the tuning keys. Redraw only B3 with all six keys and posts fully visible.`
- 사람(공주·요정)이 들어갔으면: `Remove the person. No people at all - only animals, toys and objects. Redraw only that guitar.`
- 그림이 칸을 넘어가 옆 기타와 붙었으면: `Some objects cross into the next cell. Redraw the sheet with every guitar and its objects fully inside its own cell and more empty space between cells.`
- 하늘·방 배경이 들어갔으면: `Remove the background scene. Make it completely transparent (or flat white) with nothing behind the guitars except the objects described.`
- 기타 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the guitars. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- 글자·숫자가 들어갔으면: `Remove all text, letters and numbers - books, bags, flags and tags stay blank.`
