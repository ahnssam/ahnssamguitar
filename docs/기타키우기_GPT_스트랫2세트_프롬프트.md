# 기타 키우기 — 스트랫 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-15 사용자: "이젠 스트랫부터 셋트를 여러 개 만들 때가 된 것 같아. 지금 있는 아이디어랑은 또 다르게 0부터 20까지 새로운 아이디어로.
초반 0~4단계쯤까지는 '어우 못 쓰겠는데' 싶을 정도로."
같은 날 사용자: "'다음' 누르면 다음 거 만들라고 하지 마. 그냥 쭉 다 뽑아 주는 걸로. 뽑고 나서 헤드머신 개수·줄 개수를 확인해서 이상하면 한 개씩 다시 작업하게."
같은 날 사용자: "기타 뒤에 아우라·안개 같은 게 뜨는 것도 누끼 따기 힘드니까 빼라고 프롬프트에 넣어." → 빛·안개·후광 빛 번짐은 모두 빼고, 효과는 **외곽선이 또렷한 단단한 모양**으로만(+10부터의 빛은 게임이 따로 그린다).

- 1세트(지금 게임에 있는 것)는 체리 레드 스트랫이 중고 → 손질 → 불·시간·얼음·별·신화로 간다(`docs/기타키우기_GPT_부품_프롬프트.md`).
- **2세트는 3톤 선버스트 스트랫**이다. 이야기 줄기는 이렇다.
  - **+0~+4**: 쓰레기장에서 주운, 도저히 못 쓸 고물
  - **+5~+9**: 고물상 아저씨가 고친 이상한 개조 기타
  - **+10~+19**: 먹물 한 방울에서 시작해 한국 전설로 커 가는 기타
  - **+20**: 길에서 만 번 연주한 전설의 선버스트. +0의 부서진 선버스트가 돌고 돌아 전설이 된다.
- **2026-11-15 받아서 넣었다**(구글 드라이브 `기타 키우기/strat2_final_00-20`, 21장 1024×1536 흰 배경 → 가장자리부터 흰색을 오려 1세트와 같은 틀 448×672로 `images/play/gk/strat2_00`~`20.webp`). 게임에서는 스트랫을 찾으면 반반으로 1세트·2세트, 도감은 '스트랫 2' 줄이 따로.
- **+19만 줄 감는 기둥이 5개**(헤드머신은 6개)라 아래 '+19 다시 뽑기'로 고쳐 오면 바꿔 넣는다.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다. 1세트와 겹치는 소재(녹, 스티커, 금 픽업, 넥 추가, 반짝이, LED, 불꽃, 얼음, 날개, 별자리, 번개, 은하)는 피했다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 반토막 난 걸 박스 테이프로 붙인 스트랫 | 몸통이 사선으로 쪼개져 누런 박스 테이프로 칭칭, 귀퉁이 떨어져 나감, 노브 두 개 없음, 줄 축 늘어짐 |
| +1 | 지하실에서 버섯이 자라난 스트랫 | 곰팡이 얼룩, 빈 픽업 구멍에서 버섯 두 개, 거미줄, 픽가드 위 달팽이 |
| +2 | 넥이 바나나처럼 휜 스트랫 | 넥이 옆으로 바나나처럼 휨, 줄이 지판에서 붕 떠 있음 |
| +3 | 옆집 개가 물어뜯은 스트랫 | 몸통 가장자리·헤드 끝에 이빨 자국, 침 번들, 스트랩 버튼에 빈 개 이름표 |
| +4 | 줄 대신 낚싯줄을 맨 스트랫 | 투명한 낚싯줄 6줄, 헤드에서 찌·바늘이 대롱, 노브 하나는 병뚜껑 |
| +5 | 고물상 아저씨가 용접해 준 스트랫 | 쪼개진 데를 철판·리벳으로 용접, 용접 자국, 작은 불똥·연기 한 줄기 — 드디어 소리는 남 |
| +6 | 부품이 전부 짝짝이인 스트랫 | 픽업 금·검정·은 하나씩, 노브 색 셋 다 다름, 픽가드 반반, 헤드머신 색 여섯 가지 |
| +7 | 몸통에 금붕어가 사는 스트랫 | 아래 몸통에 둥근 유리 어항 창, 금붕어 한 마리와 물방울 |
| +8 | 카세트테이프가 돌아가는 스트랫 | 몸통에 카세트 데크(빈 라벨, 릴 두 개), 풀려 나온 갈색 테이프 한 가닥 |
| +9 | 먹물이 스며드는 스트랫 | 헤드와 아래 귀퉁이부터 먹물이 번져 그 부분만 수묵화가 됨, 먹물 방울이 둥둥 — 신비의 시작 |
| +10 | 수묵화에서 걸어 나온 스트랫 | 기타 전체가 수묵화(먹·회색 붓 터치), 금박 조각, 글자 없는 붉은 낙관, 둘레에 먹물 방울·붓 소용돌이(안개 아님) |
| +11 | 청자빛으로 구워 낸 스트랫 | 비취색 청자 유약, 빙렬(잔금), 구름 사이 학 상감 무늬 |
| +12 | 단청 옷을 입은 스트랫 | 궁궐 처마 같은 단청(녹·주홍 바탕에 파랑·노랑·흰 연꽃·기하 무늬) |
| +13 | 달토끼가 방아 찧는 스트랫 | 밤하늘색 몸통에 커다란 보름달, 그 안에 방아 찧는 흰 토끼, 은빛 반짝임 |
| +14 | 까치호랑이가 지키는 스트랫 | 민화 호랑이 무늬(주황+굵은 검정 줄무늬), 동그란 호랑이 눈·수염, 꼬리, 헤드 위 까치, 소나무 가지 |
| +15 | 천년 은행나무가 품은 스트랫 | 금빛 나무껍질 몸통, 부채꼴 은행잎이 돋고 흩날림, 아래 몸통을 감싼 뿌리 |
| +16 | 선녀의 날개옷을 두른 스트랫 | 무지갯빛 비단 띠(반투명 말고 또렷하게)가 기타 둘레를 휘감아 떠 있음, 진주빛 몸통, 외곽선 있는 작은 구름 |
| +17 | 아홉 꼬리 구미호가 감싼 스트랫 | 기타 뒤로 부채처럼 펼친 흰·금빛 꼬리 아홉 개, 상아색 몸통에 붉은 여우 무늬, 푸른 여우불 셋 |
| +18 | 여의주를 문 청룡의 스트랫 | 청룡이 넥과 몸통을 휘감음(청록 비늘, 금빛 갈기·수염), 헤드 옆에서 빛나는 여의주를 쥠, 구름무늬 |
| +19 | 옥황상제가 하늘에서 내린 스트랫 | 백옥과 금 몸통에 일월오봉도(붉은 해·흰 달·청록 봉우리), 외곽선 있는 금빛 구름, 헤드 뒤 금빛 고리(빛 번짐 없이), 헤드 위 작은 궁궐 지붕 장식 |
| +20 | **스티비 레이 반의 스트랫** | 오래 써서 나무가 드러난 선버스트, 검은 픽가드, 금빛 트레몰로, 뒤로 외곽선이 또렷한 노을 해와 햇살 몇 줄기, 모래·불씨 몇 점(빛 번짐·아우라 없이) |

+20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다)
- **데이빗 길모아의 스트랫**: 검은 몸통·검은 픽가드, 프리즘을 지나 무지개로 갈라지는 빛 한 줄기
- **잉베이 맘스틴의 스트랫**: 흰 몸통, 홈 파인(스캘럽) 지판, 금빛 왕관과 바이올린 같은 소용돌이 장식

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 6개씩인지 ChatGPT가 스스로 센다. 틀린 기타는 그 기타 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수를 세고, 틀린 기타는 한 대씩 다시 그려 줘.`
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **기타 뒤 아우라·빛 번짐**만 아니면 된다(누끼 따기 힘들어서 프롬프트에서 막았다).
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitars as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its effects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up unless the description says it is bent.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, gradients or floor shadows behind the guitars.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (clouds, flames, sparkles, leaves, ribbons, rays) must be a SOLID shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly.
- NO text, letters, numbers or logos anywhere. Price tags, labels, seals, tags and stickers are blank.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): a double-cutaway solid-body electric guitar with a three-tone sunburst body (dark brown edge, amber middle, golden-yellow center), a white pickguard, three white single-coil pickups, three knobs, a tremolo arm, a maple neck with a dark rosewood fretboard and dot inlays, and an ORIGINAL rounded headstock.
- HEADSTOCK AND STRINGS (very important, even for the broken junk guitars): every guitar has exactly SIX tuning keys in one straight line along the upper edge of the headstock, exactly SIX round string posts on the headstock face (one post per key), and exactly SIX strings running from the bridge, over the nut, each to its own post. Keys = posts = strings = 6.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys, its string posts and its strings. Also check that no guitar has glow, aura, mist or soft light around or behind it - if one does, redraw that guitar without it. If ANY guitar is wrong (5 or 7 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From "ugh, totally unplayable junk" to a weird but working guitar. Guitars 1-5 must look so bad that nobody would want to play them - funny and a little gross, never scary.
1. (+0) Split in half and taped: the body is cracked in two along a jagged diagonal line and held together with many layers of brown packing tape; a chunk is missing from the lower horn; two of the three knobs are gone; the six strings hang slack and loose; dusty and scratched all over.
2. (+1) Mushrooms from the basement: grey-green mold spots all over the body, two small brown mushrooms growing out of the empty middle pickup hole (that pickup is missing), a cobweb between the upper horn and the neck, and a tiny snail on the pickguard.
3. (+2) Banana neck: the neck curves sideways in a gentle banana bend (the headstock still ends near the top of the cell), the six strings float high above the fretboard, the body is dull and faded.
4. (+3) Chewed by a dog: bite marks and chunks chewed out of the body edges and the very tip of the headstock (all six tuning keys are still there), a wet slobbery shine on the chewed parts, and a small round blank dog tag hanging from the strap button.
5. (+4) Fishing line instead of strings: the six strings are clear, shiny fishing line; a red-and-white fishing bobber and a small hook dangle from the headstock on a loose line; extra fishing line is wrapped messily around the tuners; one knob is a bottle cap.
6. (+5) Welded at the scrapyard: the cracked body is now fixed with grey steel plates, rivets and rough weld seams, mismatched bolts, one small outlined puff of smoke and two tiny solid sparks from a fresh weld - ugly but finally solid and playable.
7. (+6) Every part mismatched: one gold, one black and one chrome pickup; three knobs in three different colors; the pickguard is half bright green and half tortoise-shell joined down the middle; the six tuning keys are six different colors (still six keys in one line); a red tremolo arm.
8. (+7) Goldfish tank: a round glass porthole window built into the lower body, filled with water, with one small orange goldfish and a few bubbles inside; a few water drops on the body.
9. (+8) Cassette player: a retro cassette deck built into the lower body with a clear window showing two tape reels and a blank label, a small row of buttons, and one loose curl of brown tape spilling out.
10. (+9) Ink seeping in: black ink is spreading into the guitar from the headstock and from the lower horn, turning those parts into traditional East-Asian ink-brush painting style (black and grey wash strokes) while the rest is still the normal sunburst; a few ink drops float around it - the first hint of magic.

IMAGE B - guitars +10 to +19
A magical Korean / East-Asian legend theme. Each step is more powerful and more gorgeous than the one before. Keep the same base guitar shape (and the six keys, six posts, six strings) under all the decoration.
1. (+10) Ink painting come alive: the whole guitar is painted in East-Asian ink-wash style - black and grey brush strokes, a few splashes of gold leaf flakes, a small blank red square seal stamp (no characters) on the lower body, a few solid ink drops and hard-edged brush-stroke swirls close around it (no mist).
2. (+11) Celadon porcelain: the body is pale jade-green celadon glaze with fine crackle lines and a glossy porcelain shine, with inlaid white and black cranes flying among clouds.
3. (+12) Palace dancheong: covered in Korean palace dancheong painting - green and vermilion base with bright blue, yellow and white lotus and geometric patterns along the body edge and the neck, like the painted eaves of a palace.
4. (+13) Moon rabbit: a deep night-blue body with a huge bright full moon painted on the lower body; inside the moon, a cute white rabbit pounding a rice-cake mortar with a pestle; a few solid silver star sparkles and two small outlined clouds (no glow around the guitar).
5. (+14) Folk-painting tiger and magpie: an orange body with bold black tiger stripes, a friendly folk-art tiger face with big round eyes and whiskers on the lower body, a striped tiger tail curling around the lower horn, a black-and-white magpie perched on the headstock, and a small pine branch.
6. (+15) Thousand-year ginkgo tree: the body is golden tree-bark texture, golden fan-shaped ginkgo leaves sprouting from it and drifting around it, small roots wrapping the bottom of the body.
7. (+16) The fairy's heavenly robe: long silk ribbons in soft rainbow pastel colors (opaque, with clear outlines - not see-through) float and swirl close around the guitar, the body is pearl white with a gentle rainbow sheen, a few tiny outlined cloud puffs.
8. (+17) Nine-tailed fox: nine fluffy white-and-gold fox tails fan out behind the guitar like a halo, the body is ivory with red fox-mask markings, three small solid blue fox-fire flames with clear outlines float beside it.
9. (+18) Azure dragon with the pearl: an East-Asian azure dragon coils around the neck and the body - long blue-green scaled body, golden mane and whiskers - its head beside the headstock, holding a shining pearl in its claw (a solid pearl with a highlight, no glow around it); a few outlined cloud patterns.
10. (+19) Gift from the Jade Emperor: a white-jade and gold body painted with the sun-moon-and-five-peaks pattern (red sun, white moon, blue-green mountain peaks), outlined golden auspicious clouds close around it, a solid golden ring behind the headstock (a hard-edged ring, not a glowing halo), and a tiny golden palace-roof ornament on top of the headstock.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, six keys, six posts, six strings.
The legendary blues hero's guitar: a heavily road-worn three-tone sunburst body, worn through to bare wood where the arm rests and around the edges after ten thousand nights on stage, a black pickguard (blank), a gold tremolo arm, gold-tinted worn hardware. Behind it a solid orange sunset sun disc with a few hard-edged golden rays (clear outlines, no glow), and a few solid sand swirls and sparks drawn as outlined shapes close around the guitar. No aura, no glow, no soft light - show its power through the rich details, so it looks like the most powerful guitar in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 still has 5 tuning keys. Redraw only A4 as a single portrait image with exactly six keys, six posts and six strings.`
- 그림이 칸을 넘어가 옆 기타와 붙었으면: `Some effects cross into the next cell. Redraw the sheet with every guitar and its effects fully inside its own cell and more empty space between cells.`
- 배경이 뿌여면: `The background is foggy. Make it completely transparent (or flat white) with nothing between the guitars.`
- 기타 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the guitars. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
- 글자가 들어갔으면: `Remove all text, letters and numbers - labels and tags must be blank.`

## +19 다시 뽑기 (2026-11-15 — 헤드 앞면의 줄 감는 기둥이 5개)

`strat2_19.png`를 첨부해서 붙여 넣는다.

```
Edit the attached image. Keep EVERYTHING exactly the same: the same guitar, colors, decorations (the gold ring, the palace-roof ornament, the clouds, the sun-moon-and-peaks painting), size, position and art style, portrait 1024x1536, plain white background.
Fix ONLY the headstock: it has six tuning keys on the side, but only FIVE round string posts on the face of the headstock. Add the missing sixth post so there are exactly SIX posts in one diagonal line, one for each key, and exactly SIX strings, each running from the nut to its own post.
Before finishing, count: 6 tuning keys, 6 posts, 6 strings. No glow, no fog, no text.
```
