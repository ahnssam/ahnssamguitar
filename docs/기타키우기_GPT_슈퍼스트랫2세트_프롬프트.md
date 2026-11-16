# 기타 키우기 — 슈퍼스트랫 2세트 (+0 ~ +20) 아이디어와 ChatGPT 프롬프트

2026-11-17 사용자: "슈퍼스트랫도 또 다른 세트 프롬프트 제작을 해 줘."
CLAUDE.md 11절 'GPT 그림 프롬프트 쓰는 법' ①~④를 모두 넣어 썼다.
- 한 번 붙여 넣으면 A·B·C를 **쭉 다** 뽑는다('다음'을 기다리지 않음).
- 그림마다 헤드머신·기둥·줄 개수를 GPT가 스스로 세고, 틀린 기타는 **그 한 대만 따로** 다시 그린다.
- 기타 뒤·둘레에 **아우라·빛 번짐·안개·후광 빛은 넣지 않는다**(누끼 따기 힘듦). 효과는 외곽선이 또렷한 단단한 모양으로만 그린다.
- **단계 격차를 크게**
  - +0~+4: **기타 자체가** 박살 난 진짜 쓰레기.
  - +5~+7: 고쳤지만 수수하다.
  - +8~+11: '오, 좀 멋있어지려나?'
  - +12~+19: **기타 자체가** 신화 속 재질·괴수로 변신하는 '와, 진짜 갖고 싶다' 급.
  - +20: 그보다 더.

## 0. 이 세트의 모양과 이야기

- **세트 이름: 발할라 슈퍼스트랫** (게임 `dexName`, 이름은 Claude가 지음).
- 1세트(광속 슈퍼스트랫)는 바랜 형광 노랑 80년대 슈퍼스트랫이다. 형 기타 → 트레몰로·형광 핑크·7현 → 음속·용 비늘·플라즈마·시간·차원·초신성·사이버 천사·은하·신의 손가락 → 스티브 바히로 간다(`docs/기타키우기_GPT_새계열_프롬프트.md` 4·13절).
- **2세트는 검푸른 건메탈(쇳빛 회색 + 가장자리 짙은 파랑)** 슈퍼스트랫이다. 검정 부품, 단검처럼 뾰족한 헤드, 자개 삼각 인레이.
- 이야기 줄기
  - **+0~+4**: 가전제품처럼 막 다뤄진 쓰레기. 쓰레기 압축기, 세탁기, 전자레인지, 진공청소기, 픽업 자석에 들러붙은 쇳조각.
  - **+5~+7**: 대장간에서 두들겨 펴고 쇠 징·둥근 방패를 덧댄 수수한 기타.
  - **+8~+11**: 바이킹 기타로 멋있어진다. 투구 뿔, 청동 매듭 무늬, 오딘의 까마귀, 걀라르호른 뿔나팔.
  - **+12~+19**: 북유럽 신화. 기타 자체가 변신한다. 토르의 망치, 펜리르 늑대 갑옷, 슬레이프니르의 은 갑옷, 요르문간드, 비프로스트, 궁니르, 발할라, 라그나로크.
  - **+20**: 빨강 바탕에 흰·검은 줄을 엇갈려 칠한 전설의 슈퍼스트랫.
- 룬 문자는 '글자'라서 넣지 않는다. 북유럽풍 장식은 **매듭(넝쿨처럼 얽힌) 무늬**로만 한다.
- 다른 세트에 나온 소재는 피했다.
  - 1세트 슈퍼스트랫: 형광 핑크, 뾰족 헤드, 7현, 불꽃, 상어 지느러미, 번개 모양, 미러볼, 음속, 용 비늘, 플라즈마, 시계, 차원, 초신성, 음표, 천사 날개, 은하, 후광.
  - 스트랫·텔레·레스폴·통기타·베이스 1·2세트: 테이프, 버섯, 개, 낚싯줄, 용접, 금붕어, 한국 전설, 도마, 라면, 트럭, 비둘기, 대걸레, 바다 전설·배·보물상자, 고양이, 뚫어뻥, 껌, 바퀴, 이집트, 학교·고무줄·개미, 옛이야기, 허수아비·두더지·닭·참새, 공룡, 서리꽃, 날개, 은행나무.

## 1. 단계별 이름과 그림 (2세트)

이름은 Claude가 지은 것이고 바꿔도 된다.

| 단계 | 이름 | 그림 |
|---|---|---|
| +0 | 쓰레기 압축기에 눌린 슈퍼스트랫 | 깡통처럼 납작하게 찌그러진 몸통, 지그재그로 꺾인 넥, 접혀 들어간 뿔, 튀어나온 부품, 녹슬어 엉킨 줄, 기름때 |
| +1 | 세탁기에 돌린 슈퍼스트랫 | 물에 불어 휘고 부푼 나무, 얼룩덜룩 빠진 칠, 넥에 감긴 젖은 양말 한 짝, 외곽선 있는 비눗방울, 뚝뚝 떨어지는 물 |
| +2 | 전자레인지에 녹아내린 슈퍼스트랫 | 녹은 시계처럼 축 늘어진 뿔, 부글부글 그을린 칠, 휘어 녹은 픽업 덮개와 노브 |
| +3 | 진공청소기에 빨려 들어갔던 슈퍼스트랫 | 먼지 뭉치·머리카락이 엉겨 붙음, 스트랩 버튼에 낀 청소기 호스 조각, 휜 트레몰로 막대, 노브 하나 없음 |
| +4 | 픽업에 쇳조각이 잔뜩 붙은 슈퍼스트랫 | 픽업 자석에 들러붙은 못·나사·클립·쇳가루, 녹슨 몸통, 여전히 더럽고 긁힘 |
| +5 | 대장간에서 두들겨 편 슈퍼스트랫 | 망치 자국이 남은 채 펴진 수수한 건메탈 몸통, 새 줄. 드디어 소리 남 |
| +6 | 쇠 징을 박은 슈퍼스트랫 | 가장자리를 따라 박은 쇠 징, 이음새의 쇠판. 아직 수수함 |
| +7 | 둥근 방패를 덧댄 슈퍼스트랫 | 아래 몸통 뒤에 덧댄 나무 바이킹 둥근 방패(소용돌이 칠), 쇠 테. 아직 수수함 |
| +8 | 투구 뿔이 돋은 슈퍼스트랫 | 여기서부터 멋있어지기 시작: 양쪽 위 뿔이 휘어 오른 바이킹 투구 뿔, 반짝이는 강철 몸통, 청동 테두리, 엮은 가죽·청동 고리 바인딩 |
| +9 | 매듭 무늬가 새겨진 슈퍼스트랫 | 몸통 가득 청동으로 새긴 북유럽 매듭 무늬, 스트랩 버튼의 청동 늑대 머리 장식, 단단한 은 반짝이 |
| +10 | 오딘의 까마귀가 앉은 슈퍼스트랫 | 어두운 강철 몸통에 은 매듭 무늬, 양쪽 뿔에 앉은 까마귀 두 마리(은 장신구) |
| +11 | 걀라르호른 뿔나팔을 멘 슈퍼스트랫 | 몸통을 가로질러 멘 금·은 장식 커다란 뿔나팔, 은청색 몸통, 청동 매듭 바인딩 |
| +12 | 토르의 망치로 벼린 슈퍼스트랫 | **몸통이 드워프가 벼린 검은 강철**에 녹은 금 줄기(단단하게), 묵직한 청동 매듭, 뒤에 비스듬히 선 거대한 전쟁 망치(가죽 손잡이), 단단한 불똥 |
| +13 | 펜리르 늑대 갑옷을 두른 슈퍼스트랫 | 몸통이 은회색 늑대 털과 은 갑옷판, 위 뿔이 늑대 귀·송곳니로, 아래 몸통의 으르렁대는 거대한 늑대 머리 장식(웅장하게), 감긴 끊어진 금빛 마법 끈 |
| +14 | 슬레이프니르의 은 갑옷을 입은 슈퍼스트랫 | 몸통이 매듭 무늬를 새긴 은 말 갑옷, 위 뿔에서 솟은 갈기 휘날리는 은 말머리 조각, 여덟 개의 말발굽 모양 금 상감 |
| +15 | 요르문간드가 휘감은 슈퍼스트랫 | 몸통이 에메랄드·청록 거대한 뱀 비늘, 기타 전체를 휘감은 큰 뱀(머리는 헤드 옆, 헤드머신은 안 가림)이 받침에서 제 꼬리를 묾 |
| +16 | 비프로스트 무지개다리를 건너온 슈퍼스트랫 | 몸통이 각진 무지갯빛 크리스털(단단하게), 받침에서 뒤로 휘어 오르는 무지개 크리스털 다리, 은 매듭 테두리 |
| +17 | 오딘의 창 궁니르를 든 슈퍼스트랫 | 몸통이 은백색·금 조각, 아래 몸통을 덮은 까마귀 깃털 남색 망토, 뒤로 비스듬히 선 매듭 무늬 새긴 화려한 황금 창 |
| +18 | 발할라 황금 전당의 슈퍼스트랫 | 몸통이 금, 가장자리를 지붕처럼 덮은 금빛 둥근 방패들, 뒤에서 아치를 이루는 엇갈린 창들, 받침의 금 뿔잔·금화 |
| +19 | 라그나로크를 견뎌 낸 슈퍼스트랫 | 녹은 금 균열이 간 흑요석 몸통, 한쪽은 단단한 불꽃·다른 쪽은 얼음 결정, 뒤에서 마주 보는 늑대·큰 뱀 머리, 엇갈린 망치와 창 — 세트 최고 전설 |
| +20 | **에디 반 해일런의 슈퍼스트랫** | 오래 쳐서 닳은 빨강 몸통에 흰·검은 줄을 엇갈려 칠한 무늬, 험버커 하나, 검정 트레몰로, 뒤로 외곽선이 또렷한 커다란 빨강·흰·검정 무대 빛살과 단단한 반짝이(빛 번짐·아우라 없이) |

+20 다른 후보(바꾸고 싶으면 프롬프트 C만 바꾼다)
- **잉베이 맘스틴의 슈퍼스트랫**: 같은 몸통을 노랑·흰 크림색으로, 손가락 끝이 파이게 깎은 지판(스캘럽), 금빛 왕관 무늬 빛살.

## 2. 쓰는 법

1. ChatGPT **새 대화**에 아래 프롬프트를 통째로 한 번 붙여 넣는다. 이미지 A(+0~+9), B(+10~+19), C(+20)를 **한 번에 이어서** 뽑게 되어 있다.
2. 그림마다 헤드머신(튜닝 키)·기둥·줄이 6개씩인지 ChatGPT가 스스로 센다(헤드 한쪽에 한 줄로 6개). 틀린 기타는 그 기타 **한 대만 따로** 다시 그리게 했다.
3. 중간에 멈추면 같은 대화에 `계속해 줘 — 남은 이미지를 이어서 다 그려 줘. 매번 헤드머신·기둥·줄 개수를 세고, 틀린 기타는 한 대씩 다시 그려 줘.`를 붙여 넣는다.
4. 배경이 투명하게 안 나와도 **무늬 없는 흰 배경**이면 된다(Claude가 오려 낸다). 뿌연 안개·그라데이션 배경, **기타 뒤 아우라·빛 번짐**만 아니면 된다.
5. 받은 그림을 한 폴더에 모아 두고 알려 주면, Claude가 다시 세어 보고 맞는 것만 잘라 넣는다.
   - 1세트 슈퍼스트랫과 같은 틀(448×672)에 맞추고 `images/play/gk/superstrat2_00`~`20.webp`로 넣는다.
   - 게임에서는 슈퍼스트랫이 나오면 반반으로 1세트·2세트가 나오고, 도감에 '발할라 슈퍼스트랫' 줄이 생긴다.
   - 서버(랭킹·오늘의 상대)도 'superstrat2'를 받게 SQL 한 개가 더 필요하다.

## 3. 프롬프트 (한 번에 붙여 넣기)

```
I'm making a mobile game called "Guitar Upgrade": a guitar is upgraded step by step from +0 to +20. Please draw a NEW set of 21 guitars as THREE images:
- IMAGE A: guitars +0 to +9 (one sprite sheet)
- IMAGE B: guitars +10 to +19 (one sprite sheet)
- IMAGE C: guitar +20 (one single guitar)
Draw all three images one after another in this conversation. Do not stop to ask me anything and do not wait for me to say "next" - just keep going until A, B and C (and any redraws, see SELF-CHECK) are all done.

POWER CURVE (the most important rule of this set - the jump between levels must be HUGE and obvious, like a real upgrade game)
- +0 to +4: TOTAL GARBAGE. The guitar ITSELF is wrecked - crushed, warped, melted, cracked, rusty, filthy, with broken or missing parts - NOT a clean guitar with a funny object stuck on it. Anyone would throw it in the trash. Funny and gross-cute, never scary or bloody.
- +5 to +7: repaired and playable, but still plain and humble.
- +8 to +11: "oh, this is getting cool" - nicer finish and hardware, the theme starts to change the guitar itself, clearly cooler with every step.
- +12 to +19: "WOW, I NEED this" - jaw-dropping legendary rare items. The guitar ITSELF transforms: its body becomes a mythic material, armor or legendary beast (forged steel with molten gold, silver armor, wolf fur, serpent scales, rainbow crystal, gold, obsidian...), with big dramatic sculptural decorations, intricate detail and rich bold color. Never just a normal guitar with an object or creature placed next to it. Each one more spectacular than the one before.
- +20: the ultimate guitar, the most impressive of all.
Even when the body transforms, keep the guitar's sharp double-cutaway outline, neck and headstock so it is still clearly this guitar.

RULES FOR EVERY IMAGE
- SHEETS (A and B): one image, landscape 1536x1024, a grid of 5 columns x 2 rows with lots of empty space between the guitars. Order: top row left to right = guitars 1-5, bottom row left to right = guitars 6-10. Every guitar and all of its objects stay completely inside its own cell - nothing touches or crosses into a neighbouring cell.
- Every guitar stands upright, seen exactly from the front, centered in its cell, all at the SAME size (about 85% of the cell height), with the bottom of the body at the same height in every cell. The neck points straight up.
- BACKGROUND: fully transparent (if that is impossible, plain flat white). NO fog, haze, smoke clouds, sky, stormy or landscape backgrounds, gradients or floor shadows behind the guitars - only the guitar and the solid objects described.
- NO AURA OR GLOW (very important - I have to cut every guitar out of the background, and soft light is almost impossible to cut out cleanly; the game adds its own glow later): no aura, halo light, glow, light bloom, lens flare, mist, haze, light rays fading into the background or any soft see-through light around or behind any guitar. Every effect (sparks, flames, ice, bubbles, rays, sparkles) must be a SOLID, OPAQUE shape with a clear dark outline and hard edges, sitting close to its own guitar, so it can be cut out cleanly. Crystal and ice are solid with white highlights, not see-through.
- NO text, letters, numbers or logos anywhere - and NO runes or rune-like symbols. Norse decoration is interlaced knotwork patterns, animals and ornaments only. Tags and labels are blank.
- NO people anywhere - only animals, legendary beasts and objects.
- Original designs only: no real brand headstock shape, no real brand logos.
- STYLE: polished 2D mobile-game item illustration, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and charming, light from the top-left, easy to read even when small on a phone.
- BASE GUITAR (all 21 are this same guitar, changed as described): an aggressive 1980s-style shred "superstrat" electric guitar - a slim double-cutaway body with long, deep, sharply pointed horns, two black humbucker pickups, a black locking tremolo bridge with a whammy bar, black knobs, a long thin neck with an ebony fretboard and small pearl triangle inlays, black hardware, in metallic gunmetal grey with a deep blue edge burst, and an ORIGINAL sharp dagger-shaped headstock with all six tuning keys in one straight line along ONE edge (not any real brand's headstock shape).
- HEADSTOCK AND STRINGS (very important, even for the garbage guitars): every guitar has exactly SIX tuning keys in one straight line along one edge of the headstock, exactly SIX string posts in one line on the headstock face (one post per key), and exactly SIX strings running from the bridge, over the nut, each to its own post. Keys = posts = strings = 6. Nothing (ravens, horns, serpents, wolves, hammers, spears, sparks) may cover the tuning keys or the posts.

SELF-CHECK (do this after EVERY image)
After you finish an image, zoom in and check every guitar one by one: count its tuning keys, its string posts and its strings (6 each). Check that no guitar has glow, aura, mist, a background scene or soft see-through light around or behind it. Check the POWER CURVE: +0 to +4 must look like total garbage (the guitar itself wrecked), +8 onward must clearly get cooler, and +12 to +19 must be jaw-dropping transformations - if one is not, redraw it bolder. If ANY guitar is wrong (5 or 7 keys, posts that do not match the keys, missing or extra strings), immediately redraw ONLY that guitar as its own single image - portrait 1024x1536, transparent background, same design, same style, upright and centered, about 85% of the image height - one guitar per image, one at a time. Check each redraw the same way. Then write one short line saying which guitars you redrew (for example "A3, B7 redrawn") and continue with the next image.

IMAGE A - guitars +0 to +9
From TOTAL GARBAGE (a gunmetal shred guitar abused like a broken household machine) to a Viking-forged guitar that starts to look legendary.
1. (+0) Crushed in a trash compactor: the body squashed flat and crumpled like a soda can, the neck bent into a zigzag, the pointed horns folded in, parts popping out, rusty tangled strings, black grease smudges everywhere.
2. (+1) Run through a washing machine: the wood swollen, warped and puffy, the paint faded and blotchy, a wet sock wrapped around the neck, solid outlined soap bubbles, water dripping off.
3. (+2) Melted in a microwave: the pointed horns drooping like a melting clock, the paint bubbled and scorched, the pickup covers and knobs warped and half melted.
4. (+3) Sucked into a vacuum cleaner: dust bunnies and hair tangled all over, a piece of vacuum hose stuck on the strap button, the whammy bar bent, one knob missing, dull and scratched.
5. (+4) Pickup magnets full of junk: nails, screws, paper clips and iron filings stuck all over the humbuckers and the body, rusty patches, still dirty and scratched.
6. (+5) Hammered back into shape at a forge: the body hammered flat again with hammer marks still visible, plain gunmetal finish, new strings - plain but finally playable.
7. (+6) Iron studs: rows of iron studs along the body edges and small riveted iron plates over the old joints - still plain.
8. (+7) Round shield: a round wooden Viking shield with a painted spiral pattern and an iron rim mounted behind the lower body - still a plain guitar.
9. (+8) Helmet horns (now it starts to look cool): the two upper horns of the body reshaped into curved Viking helmet horns, a polished steel finish with bronze trim along the edges, a binding of braided leather and bronze rings.
10. (+9) Knotwork: intricate Norse interlaced knotwork engraved in bronze across the whole body, a bronze wolf-head ornament at the strap button, a few solid silver sparkles - clearly cooler than the guitars before it.

IMAGE B - guitars +10 to +19
A NORSE MYTHOLOGY legend theme: blackened steel, silver, bronze, gold, deep blue, emerald and rainbow crystal. +10 and +11 are cool and getting very special; from +12 the guitar ITSELF transforms into a mythic material, armor or legendary beast and becomes "WOW, I NEED this", each one more spectacular than the last. Keep the same sharp double-cutaway outline, neck and one-edge headstock (six keys, six posts, six strings) under all the decoration. Remember: no people, no runes, no background scene, no glow - only the guitar and the solid objects described.
1. (+10) Odin's ravens: a dark steel body with silver knotwork, two black ravens wearing small silver ornaments perched on the two upper horns.
2. (+11) The great horn: a huge curved horn trimmed in gold and silver slung across the body on a leather strap, a silver-blue body with bronze knotwork binding.
3. (+12) Forged by the thunder hammer: the WHOLE body becomes dwarf-forged blackened steel with veins of molten gold (solid), heavy bronze knotwork along the edges, a giant war hammer with a leather-wrapped handle standing diagonally behind the guitar, solid sparks around it.
4. (+13) Fenrir wolf armor: the body becomes thick silver-grey wolf fur and silver armor plates, the upper horns turn into wolf ears and fangs, a huge snarling wolf head (mighty, not bloody) sculpted on the lower body, a broken golden magic ribbon chain wrapped around it.
5. (+14) Sleipnir's silver armor: the body becomes engraved silver horse armor covered in knotwork, a sculpted silver horse head with a flowing mane rising from one upper horn, eight horseshoe-shaped gold inlays across the body.
6. (+15) The world serpent: the body covered in emerald and teal giant serpent scales, a colossal serpent coiling around the whole guitar with its head rising beside the headstock (not covering the keys or posts) and biting its own tail at the base.
7. (+16) The rainbow bridge: the body becomes faceted rainbow crystal (solid, with white highlights), a rainbow crystal bridge arching up from the base behind the body, a silver knotwork frame around the edges.
8. (+17) Odin's spear: the body becomes carved white silver and gold, a dark blue cloak of raven feathers draped over the lower body, a magnificent golden spear engraved with knotwork crossing diagonally behind the guitar.
9. (+18) Golden hall of heroes: the body turns to gold, golden round shields line the edges like a roof, crossed spears form an arch behind the guitar, golden drinking horns and gold coins at the base.
10. (+19) Survivor of the end of the world: an obsidian body split by cracks of molten gold, one side wreathed in solid outlined flames and the other in solid ice crystals, the great wolf's head and the world serpent's head facing each other behind the guitar, a war hammer and a golden spear crossed behind it - the most legendary guitar of the sheet.

IMAGE C - guitar +20 (single image)
One guitar, portrait 1024x1536, transparent background, upright and centered, about 85% of the image height, same style and same base guitar shape as the sheets, six keys, six posts, six strings.
The legendary guitar hero's striped superstrat, the ultimate guitar of the set: the body painted red with white and black stripes criss-crossing it in a wild, hand-painted pattern, road-worn from thousands of shows, a single humbucker, a black locking tremolo with a whammy bar, a dark fretboard. Behind it big solid red, white and black stage starburst rays with clear outlines (no glow), and solid outlined sparkles close around the guitar. No aura, no glow, no soft light - show its legend through the rich details, so it looks like the most powerful guitar in the whole game.
```

## 4. 안 맞게 나오면 (같은 대화에 이어서)

- 헤드머신·줄이 또 틀렸으면: `Guitar A4 has 5 tuning keys. Redraw only A4 as a single portrait image with exactly six keys, six posts and six strings in one line.`
- 초반이 덜 망가졌으면: `Guitars A1-A5 still look like clean guitars with objects stuck on. Redraw them so the guitar ITSELF is wrecked - crushed, melted, warped, rusty, filthy, missing parts.`
- +8부터 안 나아지면: `A9 and A10 must look clearly cooler than A6-A8. Redraw them with a nicer finish, polished steel and bronze, and the theme changing the guitar itself.`
- +12부터가 덜 멋있으면: `B3-B10 still look like a normal guitar with an object next to it. Redraw them so the guitar body itself transforms into the mythic material, armor or beast - jaw-dropping legendary items.`
- 룬 문자·글자가 들어갔으면: `Remove all runes, letters and numbers - use only knotwork patterns, animals and ornaments.`
- 동물·뿔·뱀이 헤드머신을 가렸으면: `On guitar B6 the serpent covers the tuning keys. Redraw only B6 with all six keys and posts fully visible.`
- 사람(바이킹 전사·발키리)이 들어갔으면: `Remove the person. No people at all - only animals, beasts and objects. Redraw only that guitar.`
- 그림이 칸을 넘어가 옆 기타와 붙었으면: `Some objects cross into the next cell. Redraw the sheet with every guitar and its objects fully inside its own cell and more empty space between cells.`
- 하늘·폭풍 배경이 들어갔으면: `Remove the background scene. Make it completely transparent (or flat white) with nothing behind the guitars except the objects described.`
- 기타 뒤에 아우라·빛 번짐이 있으면: `Remove the glow / aura / soft light around the guitars. Effects must be solid shapes with clear outlines and hard edges, easy to cut out.`
