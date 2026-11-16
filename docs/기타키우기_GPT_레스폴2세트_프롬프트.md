# 기타 키우기 — 레스폴 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-15 사용자: "이번엔 레스폴도 1셋트 만들어 줘."
스트랫 2세트·텔레 2세트와 같은 규칙으로 썼다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 헤드머신·기둥·줄 개수를 GPT가 스스로 세고, 틀린 기타는 **그 한 대만 따로** 다시 그린다.
- 기타 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**(누끼 따기 힘듦). 효과는 외곽선이 또렷한 단단한 모양으로만 그린다.

- 1세트(지금 게임에 있는 것)는 꿀빛 선버스트에 크림 바인딩인 레스폴이다. 이모부 창고 → 아빠 록 → 용암·황금 시대·무대 조명·폭풍·왕관·함성·노을·별똥별 → 게리 무르로 간다(`docs/기타키우기_GPT_새계열_프롬프트.md`).
- **2세트는 까만 몸통에 금빛 부품('블랙 뷰티')인 레스폴**이다. 흰 바인딩과 자개 블록 인레이가 있다. 이야기 줄기는 이렇다.
  - **+0~+4**: 너무 무거워서 살림살이로 굴러다닌 고물. 문 받침, 고양이 스크래처, 뚫어뻥, 껌, 바퀴.
  - **+5~+9**: 금으로 이어 붙여 되살아나 턱시도를 입고 경매에 나간다. 박물관 고대 유물 전시실에서 깨어난다.
  - **+10~+19**: 고대 이집트 전설. 황금 풍뎅이에서 시작해 나일강·피라미드·스핑크스·고양이 여신·파라오·진실의 저울·매의 눈·태양의 배를 지나 태양신의 원반까지 간다(검정 위에 금·청금석 파랑·터키석·홍옥).
  - **+20**: 까만·흰 과녁 무늬의 헤비메탈 레스폴.
- 1세트 레스폴과 다른 2세트들에 나온 소재는 피했다.
  - 1세트 레스폴: 먼지·거미줄, 아령, 부러진 헤드, 얼룩말 픽업, 반쯤 칠한 금색, 불꽃 무늬, 큰 노브, 체리, 무대 연기, 유령 손, 용암, 레코드, 조명, 숲 정령, 폭풍, 왕관, 함성, 노을, 별똥별.
  - 스트랫·텔레 2세트: 테이프, 버섯, 개, 낚싯줄, 용접, 금붕어, 먹물, 한국 전설, 도마, 라면, 트럭, 비둘기, 대걸레, 조개, 바다 전설.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 문 받침으로 쓰던 레스폴 | 몇 년 동안 문을 받쳐서 몸통 한 귀퉁이가 납작하게 찌그러짐, 아래에 낀 고무 문받침, 깊은 긁힘, 금빛 부품이 누렇게 변함, 노브 두 개 없음, 줄 축 늘어짐 |
| +1 | 고양이 스크래처가 된 레스폴 | 몸통 가장자리·넥 뒤가 고양이 발톱에 너덜너덜, 주황 고양이 털 뭉치, 스트랩 버튼에 매달린 장난감 쥐, 휜 헤드머신 하나(6개 그대로) |
| +2 | 뚫어뻥이 붙은 레스폴 | 아래 몸통에 빨간 고무 뚫어뻥이 쩍 붙어 나무 자루가 옆으로 삐죽(깨끗한 새것), 물방울 몇 개, 벗겨지는 바인딩 |
| +3 | 껌이 덕지덕지 붙은 레스폴 | 몸통 곳곳에 분홍·초록·파랑 씹던 껌, 줄 두 개 사이로 늘어진 분홍 껌 한 가닥(줄은 6개 그대로), 노브 위 껌 풍선 |
| +4 | 너무 무거워서 바퀴를 단 레스폴 | 몸통 아래 끝에 작은 바퀴 네 개, 끌고 다니려고 스트랩 버튼에 묶은 해진 밧줄, 바닥 쪽 긁힌 자국 |
| +5 | 금 간 데를 금으로 이은 레스폴 | 갈라진 데와 찌그러진 귀퉁이를 반짝이는 금선으로 이음(킨츠기처럼 까만 몸통에 금줄이 가지를 침), 부품도 다시 금빛. 드디어 예쁘고 소리도 남 |
| +6 | 피아노 건반이 박힌 레스폴 | 브리지 아래 몸통을 가로질러 박힌 진짜 흑백 피아노 건반 한 줄 |
| +7 | 턱시도를 입은 레스폴 | 위 몸통에 그린 턱시도 깃(검은 공단 + 흰 셔츠 V), 넥 이음새의 까만 나비넥타이, 작은 주머니의 흰 행커치프, 스트랩 버튼에 꽂은 빨간 장미 |
| +8 | 경매에 나온 레스폴 | 받침에 기대 놓은 빈 둥근 경매 번호판과 작은 금빛 의사봉, 아래에 늘어진 빨간 벨벳 줄, 스트랩 버튼의 빈 흰 가격표 |
| +9 | 고대 유물 전시실에 놓였던 레스폴 | 받침의 빈 놋쇠 전시 명판, 스트랩 버튼에 매달린 황금 풍뎅이 부적, 아래 몸통부터 번져 오는 이집트풍 금·터키석 띠무늬, 작은 금 반짝이(단단한 모양). 신비의 시작 |
| +10 | 황금 풍뎅이가 날개를 편 레스폴 | 아래 몸통 가득 날개를 활짝 편 황금 풍뎅이(터키석·청금석 날개), 바인딩을 따라 청금석 파랑 상감, 작은 금 구슬 |
| +11 | 나일강 연꽃이 핀 레스폴 | 몸통을 가로질러 굽이치는 파란 나일강 그림, 가장자리에서 솟은 파피루스 갈대와 푸른 연꽃, 받침에 선 흰 따오기 |
| +12 | 피라미드 세 개가 솟은 레스폴 | 아래 몸통에 터키석 하늘 아래 솟은 황금 피라미드 셋, 헤드 꼭대기의 작은 금빛 피라미드 장식(헤드머신은 안 가림), 받침의 금빛 모래 |
| +13 | 스핑크스가 지키는 레스폴 | 기타 받침 뒤에 엎드린 사암 스핑크스(앞발을 양옆으로 뻗음, 파랑·금 줄무늬 두건), 사암빛 바인딩 |
| +14 | 검은 고양이 여신의 레스폴 | 위 모서리에 앉은 날씬한 검은 고양이(금귀걸이, 보석 박힌 금 목걸이), 노브 네 개가 초록 고양이 눈 보석, 금빛 고양이 발자국 |
| +15 | 파라오의 황금 코브라 레스폴 | 파라오 두건 같은 파랑·금 줄무늬 몸통, 헤드 꼭대기에서 고개를 든 황금 코브라(헤드머신은 안 가림), 바인딩을 따라 터키석·붉은 보석 |
| +16 | 진실의 깃털 저울을 단 레스폴 | 기타 뒤에 선 금 저울(한쪽 접시에 흰 깃털, 다른 쪽에 붉은 하트 보석), 받침에 엎드린 검은 자칼 석상, 몸통의 금 띠 |
| +17 | 매의 눈이 뜬 레스폴 | 아래 몸통에 크게 그린 고대 이집트 눈 무늬(금·청금석), 위 모서리에 앉은 황금 매, 터키석 깃털 무늬 |
| +18 | 태양의 배를 탄 레스폴 | 기타 받침 아래 양 끝이 말려 올라간 긴 황금 배, 몸통 뒤로 떠오르는 붉은 태양 원반(가장자리 또렷, 빛 번짐 없이) |
| +19 | 태양신의 원반을 이고 온 레스폴 | 금·청금석 몸통에 터키석·홍옥 보석, 헤드 뒤의 커다란 황금 태양 원반과 코브라(단단한 원반, 후광 아님), 몸통 뒤로 활짝 편 황금 매 날개, 받침의 작은 금 피라미드 |
| +20 | **잭 와일더의 레스폴** | 몸통 한가운데서 퍼져 나가는 까만·흰 과녁(동심원) 무늬, 금빛 부품, 여러 겹 흰 바인딩, 자개 블록 인레이, 뒤로 외곽선이 또렷한 까만·금 가시 모양 빛살(빛 번짐·아우라 없이) |

+20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다)
- **슬러시의 레스폴**: 진한 호박빛 불꽃 무늬 선버스트, 받침 옆에 놓인 까만 실크해트(헤드는 안 가림)
- **피터 프렘튼의 레스폴**: 금빛 부품의 까만 레스폴 뒤로 날개를 편 불사조(단단한 모양의 깃털)

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 6개씩인지 ChatGPT가 스스로 센다(레스폴은 양쪽에 3개씩). 틀린 기타는 그 기타 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수를 세고, 틀린 기타는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **기타 뒤 아우라·빛 번짐**만 아니면 된다.
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 레스폴과 같은 틀(448×672)에 맞추고 `images/play/gk/lespaul2_00`~`20.webp`로 넣는다.
   - 게임에서는 레스폴이 나오면 반반으로 1세트·2세트가 나오고, 도감에 '레스폴 2' 줄이 생긴다(스트랫 2세트와 같은 방식).
   - 서버(랭킹·오늘의 상대)도 'lespaul2'를 받게 SQL 한 개가 더 필요하다(텔레 2세트와 한 번에 만들 수 있다).

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
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, desert or sky backgrounds, gradients or floor shadows behind the guitars - only the guitar and the solid objects described.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (sparkles, sun discs, wings, rays, sand) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly.
- NO text, letters, numbers or logos anywhere. No hieroglyphs or writing-like symbols either - ancient decorations are pattern bands, jewels and pictures only. Plates, tags, paddles and labels are blank.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a heavy single-cutaway carved-top solid-body electric guitar in glossy ebony black with gold hardware, multi-layer white binding around the body edge and the headstock, two gold-covered humbucker pickups, four gold knobs and a small toggle switch, a gold bridge with a separate tailpiece, a dark ebony fretboard with pearl block inlays, and an ORIGINAL headstock with three tuning keys on each side. Keep the black body clearly outlined so it reads well on a white background.
- HEADSTOCK AND STRINGS (very important, even for the broken junk guitars): every guitar has exactly SIX tuning keys - three on the left edge and three on the right edge of the headstock - exactly SIX round string posts on the headstock face (three on each side, one post per key), and exactly SIX strings running from the tailpiece, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (animals, ornaments, cobras, pyramids) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys (3 + 3), its string posts (3 + 3) and its strings (6). Also check that no guitar has glow, aura, mist, a background scene or soft see-through light around or behind it - if one does, redraw that guitar without it. If ANY guitar is wrong (5 or 7 keys, 4 + 2 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From "ugh, totally unplayable junk" (so heavy it ended up as household stuff) to a fancy guitar that wakes up in a museum. Guitars 1-5 must look so bad that nobody would want to play them - funny and a little gross, never scary.
1. (+0) Used as a doorstop: this heavy guitar held a door open for years - one corner of the body is crushed flat and scuffed, a rubber door-stop wedge is jammed under the lower body, deep scratches all over, the gold hardware has gone dull brown, two knobs are missing, and the six strings hang slack and loose.
2. (+1) Cat scratcher: the body edges and the back of the neck are shredded by cat claws, tufts of orange cat hair stuck all over, a toy mouse dangling from the strap button on a string, one tuning key bent (still six keys).
3. (+2) Toilet plunger: a clean red rubber toilet plunger is stuck by suction to the lower body with its wooden handle sticking out sideways (inside the cell), a few water drops, the white binding peeling off in places - funny, not gross.
4. (+3) Covered in chewing gum: blobs of chewed gum in pink, green and blue stuck all over the body, one pink gum strand stretched between two strings (still six strings), a pink gum bubble on one knob.
5. (+4) So heavy it got wheels: four small caster wheels screwed to the bottom edge of the body, a frayed rope tied to the strap button for dragging it around, scrape marks along the bottom of the body.
6. (+5) Gold-mended cracks: the old cracks and the crushed corner are now mended with shiny gold seams in kintsugi style - gold lines branching across the black body - and the hardware is polished back to bright gold; finally beautiful and playable.
7. (+6) Piano keys: a row of real black-and-white piano keys inlaid straight across the lower body below the tailpiece.
8. (+7) Tuxedo: tuxedo lapels painted on the upper body (black satin with a white shirt V), a small black bow tie at the neck joint, a white pocket square in a tiny painted pocket, a red rose tucked at the strap button.
9. (+8) At the auction: a blank round auction paddle and a small golden gavel leaning against the base, a red velvet rope draped low at the base, a blank white price tag hanging from the strap button.
10. (+9) Ancient artifact awakens: a small blank brass museum plate at the base, a golden scarab amulet hanging from the strap button, and ancient Egyptian-style gold and turquoise pattern bands starting to spread over the black body from the lower edge, a few tiny solid gold sparkles - the first hint of magic.

IMAGE B - guitars +10 to +19
A magical ANCIENT EGYPT legend theme: gold, lapis-lazuli blue, turquoise and carnelian red on the black guitar. Each step is more powerful and more gorgeous than the one before. Keep the same base guitar shape (and the 3 + 3 keys, 3 + 3 posts, six strings) under all the decoration. Remember: no background scene, no glow, no hieroglyphs - only the guitar and the solid objects described.
1. (+10) Golden scarab: a large golden scarab beetle with spread turquoise-and-lapis wings across the lower body, lapis-blue inlays along the binding, a few small gold beads.
2. (+11) Nile lotus: a blue river painted winding across the body, tall green papyrus reeds and blue lotus flowers growing up from the edges of the body, a white ibis bird standing at the base.
3. (+12) Three pyramids: three golden pyramids rising on the lower body under a turquoise sky painted on the body, a small golden pyramid ornament on top of the headstock (not covering the keys or posts), a little golden sand at the base.
4. (+13) Sphinx guardian: a sandstone sphinx lying behind the base of the guitar with its front paws stretched forward on both sides, wearing a blue-and-gold striped headdress; the guitar has sandstone-colored binding.
5. (+14) Black cat goddess: a sleek black cat with gold earrings and a jeweled gold collar sitting on the upper horn of the body (NOT on the headstock), the four knobs are green cat-eye gems, small gold cat paw prints across the body.
6. (+15) Pharaoh's golden cobra: the body covered in a blue-and-gold striped pattern like a pharaoh's headdress, a golden cobra rising from the top of the headstock (not covering the keys or posts), turquoise and red jewels set along the binding.
7. (+16) Scale of truth: a golden balance scale standing behind the guitar with a white feather on one pan and a red heart-shaped gem on the other, a black jackal statue lying at the base, gold bands across the body.
8. (+17) Eye of the falcon: a large stylized ancient Egyptian eye symbol painted in gold and lapis blue across the lower body, a golden falcon perched on the upper horn, turquoise feather patterns along the edges.
9. (+18) Boat of the sun: the guitar stands on a long golden ancient boat with curled-up ends on both sides, and a solid red sun disc (hard edge, no glow) rises behind the body.
10. (+19) Sun god's disc: a gold-and-lapis body inlaid with turquoise and carnelian jewels, a huge solid golden sun disc with a small cobra standing behind the headstock (a hard-edged disc, not a glowing halo, not covering the keys or posts), large golden falcon wings fanning out behind the body, a tiny golden pyramid at the base.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, 3 + 3 keys, 3 + 3 posts, six strings.
The legendary heavy-metal hero's guitar: the whole body is painted with a bold black-and-white bullseye pattern - big concentric rings spreading out from the center of the body like a target - with gold hardware, multi-layer white binding and pearl block inlays, a little road-worn from years of loud shows. Behind it a few solid black-and-gold spiky rays like a heavy-metal star burst with clear outlines (no glow), and a few solid outlined gold sparkles close around the guitar. No aura, no glow, no soft light - show its power through the rich details, so it looks like the most powerful guitar in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 has 4 + 2 tuning keys. Redraw only A4 as a single portrait image with exactly three keys and three posts on each side and six strings.`
- 동물·장식이 헤드머신을 가렸으면: `On guitar B6 the cobra covers the tuning keys. Redraw only B6 with all six keys and posts fully visible.`
- 그림이 칸을 넘어가 옆 기타와 붙었으면: `Some effects cross into the next cell. Redraw the sheet with every guitar and its effects fully inside its own cell and more empty space between cells.`
- 사막·하늘 배경이 들어갔으면: `Remove the background scene. Make it completely transparent (or flat white) with nothing behind the guitars except the objects described.`
- 기타 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the guitars. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- 상형문자·글자가 들어갔으면: `Remove all hieroglyphs, text, letters and numbers - use only pattern bands, jewels and pictures.`

## 5. 다시 뽑기 판 (2026-11-17 — 단계 격차 크게)

사용자: "레스폴 2와 텔레 2는 그런 느낌이 덜하네. 12강쯤부터는 와 진짜 갖고 싶다, 4강까지는 진짜 쓰레기, 8강 갈 무렵부턴 오 좀 멋있어지려나? 이 느낌이 나와야 하는데."

게임에 넣은 21장은 **처음부터 끝까지 멀쩡한 같은 까만 레스폴에 소품만 하나씩** 붙어 있었다.
- +0~+4: 고양이 털·뚫어뻥·껌이 붙어도 몸통은 새것이라 쓰레기 같지 않다.
- +5~+8: 금선·건반·턱시도·경매 소품만 바뀌어서 나아지는 느낌이 약하다.
- +12~+19: +14 고양이, +18 빨간 해처럼 기타 자체는 그대로인 단계가 많다.

그래서 이름·주제는 그대로 두고, 그림 설명만 CLAUDE.md 11절 ④ 단계 격차 규칙대로 세게 다시 썼다.
- +0~+4: 기타 자체가 박살·썩음.
- +5~+7: 고쳤지만 수수함.
- +8~+11: '오, 멋있어지려나?'
- +12~+19: 기타 자체가 황금 유물·조각상으로 변신해 '와, 갖고 싶다'.
- +20: 그보다 더.

새로 받으면 지금 `lespaul2_00`~`20.webp` 자리에 바꿔 넣는다. 같은 이름 그림이라 `ART_V`·`SHARE_V`를 올리고 공유 썸네일을 다시 만든다.

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitars as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

POWER CURVE (the most important rule of this set - the jump between levels must be HUGE and obvious, like a real upgrade game)
- +0 to +4: TOTAL GARBAGE. The guitar ITSELF is wrecked - cracked, chipped, warped, rotten, rusty, filthy, with broken or missing parts - NOT a clean guitar with a funny object stuck on it. Anyone would throw it in the trash. Funny and gross-cute, never scary or bloody.
- +5 to +7: repaired and playable, but still plain and humble.
- +8 to +11: "oh, this is getting cool" - nicer finish and hardware, the theme starts to change the guitar itself, clearly cooler with every step.
- +12 to +19: "WOW, I NEED this" - jaw-dropping legendary rare items. The guitar ITSELF transforms: its body becomes a golden ancient relic, a statue or a sacred creature (solid gold, lapis lazuli, turquoise, carnelian, obsidian, carved sandstone...), with big dramatic sculptural decorations, intricate detail and rich bold color. Never just a normal black guitar with an object or animal placed next to it. Each one more spectacular than the one before.
- +20: the ultimate guitar, the most impressive of all.
Even when the body transforms, keep the guitar's single-cutaway outline, neck and headstock so it is still clearly this guitar.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, desert or sky backgrounds, gradients or floor shadows behind the guitars - only the guitar and the solid objects described.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (sparkles, sun discs, wings, rays, sand) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly.
- NO text, letters, numbers or logos anywhere. No hieroglyphs or writing-like symbols either - ancient decorations are pattern bands, jewels and pictures only. Plates, tags, paddles and labels are blank.
- NO people anywhere - only animals, statues of animals and objects.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a heavy single-cutaway carved-top solid-body electric guitar in glossy ebony black with gold hardware, multi-layer white binding around the body edge and the headstock, two gold-covered humbucker pickups, four gold knobs and a small toggle switch, a gold bridge with a separate tailpiece, a dark ebony fretboard with pearl block inlays, and an ORIGINAL headstock with three tuning keys on each side. Keep the black body clearly outlined so it reads well on a white background.
- HEADSTOCK AND STRINGS (very important, even for the garbage guitars): every guitar has exactly SIX tuning keys - three on the left edge and three on the right edge of the headstock - exactly SIX round string posts on the headstock face (three on each side, one post per key), and exactly SIX strings running from the tailpiece, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (animals, ornaments, cobras, pyramids, sun discs) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys (3 + 3), its string posts (3 + 3) and its strings (6). Check that no guitar has glow, aura, mist, a background scene or soft see-through light around or behind it. Check the POWER CURVE: +0 to +4 must look like total garbage (the guitar itself wrecked), +8 onward must clearly get cooler, and +12 to +19 must be jaw-dropping transformations - if one is not, redraw it bolder. If ANY guitar is wrong (5 or 7 keys, 4 + 2 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From TOTAL GARBAGE (a guitar so heavy it ended up as household junk) to a fancy guitar that wakes up as an ancient relic.
1. (+0) Used as a doorstop: years of holding a door open - one corner of the body smashed flat and splintered, a long crack through the top, the black finish chipped down to bare wood all over, the neck snapped and glued back crooked, the gold hardware gone dull brown and rusty, two knobs and one pickup cover missing, slack rusty strings, a rubber door wedge jammed under it, dust and dirt.
2. (+1) Cat scratcher: the body edges and the back of the neck shredded down to raw splintered wood by cat claws, strips of binding torn off and hanging, clumps of orange cat hair matted everywhere, a chewed toy mouse dangling from the strap button, one tuning key bent (still six keys).
3. (+2) Toilet plunger: a red rubber plunger stuck by suction to the lower body (handle sticking out sideways inside the cell), the wood water-damaged, swollen and warped, the black paint bubbling and peeling, a crack, grimy water stains - funny, not gross.
4. (+3) Chewing gum: blobs of old chewed gum in pink, green and blue stuck all over the chipped, scratched body, one pickup cover ripped off showing loose wires, a gum strand stretched between two strings (still six strings), dirt stuck in the gum.
5. (+4) So heavy it got wheels: four rusty caster wheels screwed straight into the bottom of the body with crooked screws, the bottom edge ground down raw from being dragged across the floor, a frayed rope tied to the strap button, scrapes and dents everywhere.
6. (+5) Gold-mended cracks: the cracks and the smashed corner mended with shiny gold seams in kintsugi style, the hardware polished back to gold - finally clean and playable, but still a simple black guitar.
7. (+6) Piano keys: a row of real black-and-white piano keys inlaid across the lower body below the tailpiece - neat but still simple.
8. (+7) Tuxedo: tuxedo lapels painted on the upper body (black satin with a white shirt V), a small black bow tie at the neck joint, a white pocket square, a red rose at the strap button - classy but still a plain guitar underneath.
9. (+8) At the auction (now it starts to look cool): the guitar gleams like a prize - mirror-polished black with bright gold hardware and gold-leaf trim along the binding, displayed on a small velvet stand with a blank round auction paddle, a little golden gavel and a red velvet rope.
10. (+9) Ancient relic awakens: gold and turquoise Egyptian-style pattern bands spread over the black body from the lower edge, gold engraved corners, a golden scarab amulet hanging from the strap button, a small blank brass museum plate at the base, solid gold sparkles - clearly cooler than the guitars before it.

IMAGE B - guitars +10 to +19
A magical ANCIENT EGYPT legend theme: gold, lapis-lazuli blue, turquoise, carnelian red and obsidian black. +10 and +11 are cool and getting very special; from +12 the guitar ITSELF transforms into a golden relic, statue or sacred creature and becomes "WOW, I NEED this", each one more spectacular than the last. Keep the same single-cutaway outline, neck and headstock (3 + 3 keys, 3 + 3 posts, six strings) under all the decoration. Remember: no people, no background scene, no glow, no hieroglyphs - only the guitar and the solid objects described.
1. (+10) Golden scarab: a large golden scarab beetle with spread turquoise-and-lapis wings across the lower body, lapis-blue inlays along the binding, gold beads.
2. (+11) Nile lotus: the body painted with a blue river winding across it, green papyrus reeds and blue lotus flowers rising from the edges, gold-and-lapis binding, a white ibis at the base.
3. (+12) Golden pyramid: the WHOLE body becomes solid gold carved with stepped pyramid relief under turquoise enamel, three golden pyramids rising at the base, a gold pyramid capstone on the very top of the headstock (not covering the keys or posts), lapis jewels set along the edges.
4. (+13) Sphinx guardian: a colossal sandstone-and-gold sphinx embraces the guitar from behind, its blue-and-gold striped headdress framing the upper body and its great paws stretched forward around the base; the body itself is carved sandstone inlaid with gold and lapis bands.
5. (+14) Cat goddess: the body becomes a sleek polished obsidian cat-goddess statue - gold collar patterns around the edges, emerald cat-eye gems as the four knobs, tall golden cat ears rising from the top of the upper body, a seated black cat goddess with gold earrings wrapping her tail around the base.
6. (+15) Pharaoh's golden cobra: the body striped blue and gold like a pharaoh's royal headdress and studded with jewels, a broad gold-turquoise-carnelian collar necklace draped across the lower body, a huge golden cobra with its hood spread rising behind the headstock (not covering the keys or posts).
7. (+16) Scale of truth: the body becomes black onyx covered in fine gold filigree, a giant golden balance scale stands behind it with a white feather on one pan and a red heart-shaped gem on the other, a golden jackal statue lies at the base.
8. (+17) Eye of the falcon: huge golden falcon wings spread wide behind the guitar, the whole body feathered in gold and turquoise with a large ancient eye symbol in gold and lapis on the lower body, a golden falcon head crest rising from the upper horn.
9. (+18) Boat of the sun: the guitar stands on a magnificent golden sun-boat with curled-up ends decorated with lapis and turquoise, a huge solid red-and-gold sun disc with solid golden rays behind the body (hard edges, no glow), the body inlaid with gold sun patterns.
10. (+19) Sun god's disc: a gold-and-lapis body inlaid with turquoise and carnelian jewels, a huge solid golden sun disc with a rearing cobra behind the headstock (a hard-edged disc, not a glowing halo, not covering the keys or posts), enormous golden falcon wings fanning out behind the body, golden pyramids and jewels at the base.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, 3 + 3 keys, 3 + 3 posts, six strings.
The legendary heavy-metal hero's guitar, the ultimate guitar of the set: the whole body painted with a bold black-and-white bullseye pattern - big concentric rings spreading out from the center like a target - with gold hardware, multi-layer white binding and pearl block inlays, a little road-worn from years of loud shows. Behind it big solid black-and-gold spiky rays like a heavy-metal star burst with clear outlines (no glow), and solid outlined gold sparkles close around the guitar. No aura, no glow, no soft light - show its power through the rich details, so it looks like the most powerful guitar in the whole game.
```

다시 뽑기 판이 안 맞게 나오면 4절 문장과 아래를 같은 대화에 붙여 넣는다.
- 초반이 덜 망가졌으면: `Guitars A1-A5 still look like clean guitars with objects stuck on. Redraw them so the guitar ITSELF is wrecked - cracked, broken, rotten, filthy, missing parts.`
- +8부터 안 나아지면: `A9 and A10 must look clearly cooler than A6-A8. Redraw them with a nicer finish, polished gold hardware and the theme changing the guitar itself.`
- +12부터가 덜 멋있으면: `B3-B10 still look like a normal black guitar with an object next to it. Redraw them so the guitar body itself transforms into the golden relic, statue or sacred creature - jaw-dropping legendary items.`
