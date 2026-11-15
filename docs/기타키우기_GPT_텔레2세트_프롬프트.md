# 기타 키우기 — 텔레 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-15 사용자: "이제 텔레캐스터도 0부터 20까지 이미지 제작용 프롬 짜 줘. 스트랫 했으니까."
스트랫 2세트([docs/기타키우기_GPT_스트랫2세트_프롬프트.md](기타키우기_GPT_스트랫2세트_프롬프트.md))와 같은 규칙으로 썼다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 헤드머신·기둥·줄 개수를 GPT가 스스로 세고, 틀린 기타는 **그 한 대만 따로** 다시 그린다.
- 기타 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**(누끼 따기 힘듦). 효과는 외곽선이 또렷한 단단한 모양으로만 그린다.

- 1세트(지금 게임에 있는 것)는 버터스카치에 검은 픽가드인 텔레다. 시골 다방 → 카우보이 → 사막·밤하늘·은하 열차 → 키스 리차스로 간다(`docs/기타키우기_GPT_새계열_프롬프트.md`).
- **2세트는 서프 그린(연한 민트) 텔레에 흰 픽가드**다. 이야기 줄기는 이렇다.
  - **+0~+4**: 집안 살림으로 막 쓰다 버린, 도저히 못 쓸 고물. 텔레의 납작한 몸통이 도마를 닮았다는 데서 시작한다.
  - **+5~+9**: 바닷가로 흘러가 조개껍데기로 때우고, 튜브를 끼우고, 닻을 단다. +9에서 몸통에서 파도가 터져 나온다.
  - **+10~+19**: 바다 전설. 산호초에서 시작해 진주·해파리·문어·난파선·고래·인어·심해·천년 거북을 지나 바다의 왕까지 간다.
  - **+20**: 사이키델릭 용 그림을 입은 전설의 텔레.
- 1세트와 스트랫 2세트에 나온 소재는 피했다.
  - 1세트 텔레: 커피 자국, 낙서, 개, 카우보이 모자, 렐릭, 거울, 꽃무늬, 네온, 사막, 달, 고속도로, 별, 천둥, 기차, 오로라, 박차, 신기루, 술집.
  - 스트랫 2세트: 테이프, 버섯, 바나나 넥, 개 이빨, 낚싯줄, 용접, 짝짝이, 금붕어, 카세트, 먹물, 한국 전설.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 엄마가 도마로 쓰던 텔레 | 몸통 가득 칼자국, 갈색·빨간 즙 얼룩, 대파 조각·고추·마늘 한 쪽, 노브 두 개 없음, 줄 축 늘어짐 |
| +1 | 라면 냄비 받침이던 텔레 | 몸통 한가운데 냄비에 탄 검은 동그라미, 픽가드에 붙은 마른 꼬불 면발, 국물 튄 자국, 줄 밑에 끼운 젓가락 한 짝 |
| +2 | 이삿짐 트럭에 밟힌 텔레 | 몸통을 가로지르는 흙 묻은 바퀴 자국, 살짝 찌그러진 몸통, 헤드 끝 금(헤드머신은 6개 그대로), 귀퉁이에 붙은 종이 박스 조각 |
| +3 | 비둘기가 둥지를 튼 텔레 | 넥 픽업 둘레에 나뭇가지 둥지와 흰 알 두 개, 위쪽 모서리에 앉은 회색 비둘기, 깃털과 하얀 새똥 몇 점 |
| +4 | 넥 대신 대걸레 자루를 꽂은 텔레 | 넥이 나무 대걸레 자루(매직으로 그은 프렛 선), 그 위에 나무판자를 박아 만든 헤드, 이음새에 묶인 회색 걸레 술 |
| +5 | 조개껍데기로 때운 텔레 | 구멍·금을 여러 색 조개껍데기와 바다 유리, 작은 못으로 때움, 귀퉁이에 모래. 드디어 소리는 남 |
| +6 | 튜브를 낀 텔레 | 아래 몸통에 빨강·흰 줄무늬 튜브, 위쪽 모서리에 걸린 작은 선글라스, 비치볼 색 스트랩 |
| +7 | 모래성이 올라앉은 텔레 | 아래 몸통에 젖은 모래와 작은 모래성(빈 깃발), 옆에 장난감 양동이·삽, 픽가드 위 분홍 불가사리 |
| +8 | 닻을 매단 텔레 | 굵은 밧줄로 스트랩 버튼에 매단 쇠 닻, 넥 이음새를 감은 뱃사람 매듭, 컨트롤 판의 놋쇠 나침반(바늘만, 글자 없음), 따개비 몇 개 |
| +9 | 파도가 터져 나오는 텔레 | 아래 몸통이 목판화풍 파도(흰 물거품 발톱, 또렷한 외곽선)로 변해 말려 오름, 물방울, 튀어 오르는 은빛 물고기 한 마리. 신비의 시작 |
| +10 | 산호초가 자라는 텔레 | 몸통 가장자리에서 분홍·주황·보라 산호가 가지를 뻗음, 브리지 옆 말미잘, 줄무늬 흰동가리 두 마리, 외곽선 있는 물방울 |
| +11 | 진주조개가 품은 텔레 | 자개빛(분홍·하늘·흰 소용돌이) 몸통, 뒤에 왕좌처럼 선 큰 조개껍데기와 그 안의 큰 진주, 노브·스트랩 버튼이 진주 |
| +12 | 해파리가 춤추는 텔레 | 연보라 몸통, 둘레에 파스텔 해파리 셋(또렷한 외곽선, 비치지 않게), 꼬불 촉수가 넥을 느슨하게 감음 |
| +13 | 문어가 연주하는 텔레 | 몸통 뒤에 붙은 착한 보라 문어, 빨판 달린 다리가 기타를 감고 한 다리는 줄 위에서 연주하는 듯, 위 모서리 너머로 큰 눈 |
| +14 | 난파선 보물상자의 텔레 | 낡은 배 널빤지 몸통과 놋쇠 모서리·리벳, 아래 작은 보물상자에서 쏟아지는 금화·보석, 조종 키 모양 노브, 미역 몇 가닥 |
| +15 | 고래의 노래를 담은 텔레 | 기타 뒤로 칸 안에서 활처럼 휜 커다란 푸른 고래, 깊은 바다색 몸통에 물결 선 무늬, 외곽선 있는 물방울 |
| +16 | 인어의 비늘을 입은 텔레 | 청록·보라 물고기 비늘 몸통(흰 하이라이트는 단단하게), 몸통 아래 끝이 인어 꼬리지느러미, 불가사리·진주 줄 |
| +17 | 심해의 등불을 단 텔레 | 헤드 위로 휘어 내려온 아귀 초롱(노란 공 + 흰 하이라이트, 빛 번짐 없이), 남흑색 몸통에 하늘색 점 무늬(단단한 점), 둘레에 작은 심해 물고기. 무섭지 않게 |
| +18 | 천년 바다거북이 업고 온 텔레 | 기타 뒤에서 헤엄치는 아주 큰 늙은 바다거북, 이끼 낀 등딱지 위 야자수 한 그루 작은 섬, 지느러미 둘레 물거품(외곽선) |
| +19 | 바다의 왕이 삼지창을 내린 텔레 | 아쿠아마린·금 몸통, 기타 뒤로 비스듬히 선 금빛 삼지창, 헤드 위 산호·진주 왕관(헤드머신은 안 가림), 받침 둘레 흰 물거품 소용돌이 |
| +20 | **지미 패이지의 텔레** | 오래 써서 닳은 서프 그린 몸통 전체에 손으로 그린 1960년대 사이키델릭 무지개색 용, 흰 픽가드, 뒤로 외곽선이 또렷한 무지개색 빛살 몇 줄기(빛 번짐·아우라 없이) |

+20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다)
- **프린쓰의 텔레**: 표범 무늬 몸통(노랑·갈색 점박이), 보랏빛 비 몇 줄기(외곽선 있는 단단한 선)
- **조 스트러머의 텔레**: 칠이 거의 벗겨진 검은 몸통, 빈 스티커 자국, 빨간 별 하나(글자 없음)

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 6개씩인지 ChatGPT가 스스로 센다. 틀린 기타는 그 기타 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수를 세고, 틀린 기타는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **기타 뒤 아우라·빛 번짐**만 아니면 된다.
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 텔레와 같은 틀(448×672)에 맞추고 `images/play/gk/tele2_00`~`20.webp`로 넣는다.
   - 게임에서는 텔레가 나오면 반반으로 1세트·2세트가 나오고, 도감에 '텔레 2' 줄이 생긴다(스트랫 2세트와 같은 방식).
   - 서버(랭킹·오늘의 상대)도 'tele2'를 받게 SQL 한 개가 더 필요하다(스트랫 2세트 때 `db/play_guitar_fam_strat2.sql`과 같은 모양).

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitars as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its effects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, water backgrounds, gradients or floor shadows behind the guitars - even for the ocean guitars, only the objects described, no sea background.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (waves, foam, bubbles, corals, jellyfish, rays) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly. Bubbles are outlined circles, not soft blobs.
- NO text, letters, numbers or logos anywhere. Flags, labels, compass faces, tags and stickers are blank.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a single-cutaway flat slab-body electric guitar in surf green (pale mint green) with a white pickguard, a slanted bridge pickup set in a flat chrome bridge plate with three saddles, a chrome-covered neck pickup, a chrome control plate with two knobs and a switch, a maple neck with a dark rosewood fretboard and dot inlays, and an ORIGINAL headstock with all six tuning keys on ONE side.
- HEADSTOCK AND STRINGS (very important, even for the broken junk guitars): every guitar has exactly SIX tuning keys in one straight line along the upper edge of the headstock, exactly SIX round string posts in one line on the headstock face (one post per key), and exactly SIX strings running from the bridge, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (animals, hats, crowns, sunglasses) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys, its string posts and its strings. Also check that no guitar has glow, aura, mist, a sea background or soft see-through light around or behind it - if one does, redraw that guitar without it. If ANY guitar is wrong (5 or 7 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From "ugh, totally unplayable junk" (used as household stuff) to a weird beach-repaired guitar. Guitars 1-5 must look so bad that nobody would want to play them - funny and a little gross, never scary.
1. (+0) Mom's chopping board: the flat body was used as a kitchen chopping board for years - covered in knife cut marks and scratches, faded, with brown and red food-juice stains; a few slices of green onion, one red chili and a garlic clove lying on the body; two of the knobs are missing; the six strings hang slack and loose.
2. (+1) Ramen pot stand: a big burnt black ring in the middle of the body from a hot pot, one dried curly instant noodle stuck to the pickguard, orange soup splashes, a single wooden chopstick stuck under the strings.
3. (+2) Run over by a moving truck: a wide muddy tire track printed straight across the body, the body slightly dented and warped, a crack at the very tip of the headstock (all six tuning keys still there), a torn piece of brown cardboard box stuck to the lower corner.
4. (+3) Pigeon nest: a messy nest of twigs and straw built on the body around the neck pickup with two small white eggs in it, a grey pigeon perched on the upper edge of the body (NOT on the headstock), a few loose feathers and some white bird droppings on the body - funny, not too gross.
5. (+4) Mop-handle neck: the original neck is gone, replaced by a plain round wooden mop handle with frets drawn on as black marker lines (no numbers); a flat wooden plank nailed on top serves as the headstock with the six tuning keys and six posts; a tuft of grey mop strings tied around the joint near the body. The six strings still run from the bridge to the plank headstock.
6. (+5) Patched with seashells: every hole and crack is now patched with seashells of different colors, pieces of sea glass and small nails; a little sand stuck in the corners - ugly but finally solid and playable.
7. (+6) Swim ring: a red-and-white striped inflatable swim ring around the lower body, a pair of small round sunglasses hooked on the upper corner of the body, a beach-ball-colored strap.
8. (+7) Sandcastle: wet sand stuck to the lower body with a small sandcastle on top of it (with a tiny blank flag), a toy bucket and spade leaning beside it, a pink starfish on the pickguard.
9. (+8) Sailor's anchor: a heavy iron anchor hanging from the strap button on a thick rope, sailor's rope knots wrapped around the neck joint, a small brass compass set into the control plate (a dial with only a needle - no letters), a few barnacles on the body edge.
10. (+9) A wave bursts out: the lower half of the body turns into a curling blue ocean wave in classic woodblock-print style - solid shapes, white foam "claws" and clear outlines - with a few solid water drops and one small silver fish leaping out; the rest is still the normal surf-green guitar - the first hint of magic.

IMAGE B - guitars +10 to +19
A magical OCEAN LEGEND theme. Each step is more powerful and more gorgeous than the one before. Keep the same base guitar shape (and the six keys, six posts, six strings) under all the decoration. Remember: no sea background, no glow - only the guitar and the solid objects described.
1. (+10) Coral reef: branching pink, orange and purple corals growing from the edges of the body, a sea anemone next to the bridge, two small striped clownfish swimming beside it, a few outlined bubbles.
2. (+11) Pearl clam: the body is iridescent mother-of-pearl (solid pink, sky-blue and white swirls), a giant open clam shell standing behind the lower body like a throne with one big pearl inside, round pearls as the knobs and the strap buttons.
3. (+12) Dancing jellyfish: a soft lavender body, three cute pastel jellyfish floating around it - OPAQUE with clear outlines, not see-through, no glow - their curly tentacles wrapped loosely around the neck.
4. (+13) Octopus guitarist: a friendly purple octopus clinging to the back of the body, its tentacles with round suckers curling around the guitar, one tentacle tip resting on the strings as if playing, its big kind eyes peeking over the upper edge of the body.
5. (+14) Sunken treasure: the body is made of dark old ship planks with brass corner fittings and rivets, gold coins and red and green jewels spilling out of a small open treasure chest at the base, a tiny ship's steering wheel as one control knob, a few strands of seaweed.
6. (+15) Whale song: a huge friendly blue whale arching behind the guitar from one side to the other (staying inside the cell), the body deep ocean blue with flowing wave-line patterns (solid lines), a few outlined bubbles.
7. (+16) Mermaid scales: the body covered in teal and violet fish scales (solid colors with small hard white highlights), the bottom of the body flowing into a mermaid tail fin, a small starfish and a string of pearls draped over it.
8. (+17) Deep-sea lantern: an anglerfish-style lure on a long curved stalk hangs over the top of the headstock (NOT covering the keys or posts) with a bright yellow bulb - a solid circle with a white highlight, NO glow around it; the body is deep navy-black with rows of bright cyan dots like deep-sea creatures (solid dots, no glow); a few small toothy deep-sea fish swim around it - mysterious, not scary.
9. (+18) Thousand-year sea turtle: a gigantic ancient sea turtle swimming behind the guitar, with a mossy shell carrying a tiny island with one palm tree, solid outlined foam swirls around its flippers; the guitar stands upright in front of the shell.
10. (+19) King of the seas: a polished aquamarine-and-gold body, a golden trident standing diagonally behind the guitar, a small crown of coral and pearls on top of the headstock (NOT covering the keys or posts), solid white sea-foam swirls with clear outlines curling around the base.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, six keys, six posts, six strings.
The legendary rock hero's dragon guitar: the surf-green body is road-worn after thousands of concerts and hand-painted all over with a swirling psychedelic 1960s-style dragon in rainbow colors (green, yellow, orange, red and blue), the dragon's tail curling up onto the headstock (not covering the keys or posts); white pickguard, worn chrome hardware. Behind it a few hard-edged rainbow-colored rays with clear outlines (no glow), and a few solid outlined sparkles close around the guitar. No aura, no glow, no soft light - show its power through the rich details, so it looks like the most powerful guitar in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 still has 5 tuning keys. Redraw only A4 as a single portrait image with exactly six keys, six posts and six strings.`
- 동물·왕관·선글라스가 헤드머신을 가렸으면: `On guitar A4 the pigeon covers the tuning keys. Redraw only A4 with all six keys and posts fully visible.`
- 그림이 칸을 넘어가 옆 기타와 붙었으면: `Some effects cross into the next cell. Redraw the sheet with every guitar and its effects fully inside its own cell and more empty space between cells.`
- 바다 배경·뿌연 배경이 들어갔으면: `Remove the sea / foggy background. Make it completely transparent (or flat white) with nothing behind the guitars except the objects described.`
- 기타 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the guitars. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- 해파리가 비쳐 보이면: `Make the jellyfish fully opaque with clear outlines - not see-through.`
- 글자가 들어갔으면: `Remove all text, letters and numbers - flags, labels and the compass must be blank.`
