# 기타 키우기 — 강화 프렛 망치 (ChatGPT 프롬프트)

2026-11-17 사용자: 강화를 누를 때 피크로 긁는 것 말고 '내려치는' 기타 관련 도구가 있으면 좋겠다 → **프렛 망치**로 정함("프렛 망치를 쓰자. 이미지 뽑게 프롬프트 부탁해").

- 프렛 망치 = 기타 수리하는 사람(루시어)이 지판에 프렛(쇠막대)을 박을 때 쓰는 진짜 망치. 머리 한쪽은 황동(금속), 다른 쪽은 하얀 나일론(플라스틱)이다.
- 게임에서는 강화를 누를 때마다 망치가 기타 **왼쪽 → 오른쪽** 번갈아 날아와 몸통 가장자리를 '깡' 내려치고, 맞은 자리에서 하얗게 달군 불꽃이 팍 튄다. 오른쪽에서 칠 때는 같은 그림을 좌우로 뒤집어 쓴다 — 그래서 **모든 망치가 같은 방향**이어야 한다(치는 면이 왼쪽).
- 단계가 오를수록 망치도 좋아지게 4가지를 한 장에 뽑는다(+0~4 · +5~9 · +10~14 · +15~20). 그림이 오면 Claude가 잘라서 `images/play/gk/hammer_1`~`4.webp`(가칭)로 넣는다.
- 망치는 무대에서 기타의 약 1/3 크기로 보인다.

| 번호 | 쓰는 단계 | 망치 |
|---|---|---|
| 1 | +0 ~ +4 | 기본 프렛 망치 — 황동 머리 + 하얀 나일론 면, 밝은 나무 손잡이 |
| 2 | +5 ~ +9 | 손질한 망치 — 반짝이는 황동 머리, 갈색 가죽을 감은 손잡이 |
| 3 | +10 ~ +14 | 금 망치 — 금빛 머리에 작은 보석, 까만 흑단 손잡이 |
| 4 | +15 ~ +20 | 전설의 망치 — 머리에 번개 무늬, 치는 면 둘레에 외곽선 있는 단단한 불꽃 모양, 빨간 끈을 감은 손잡이 |

## 쓰는 법

1. ChatGPT 새 대화에 아래 프롬프트를 **한 번** 붙여 넣는다. 한 장(가로로 4칸)에 망치 4개가 나온다(중간에 '다음'을 기다리지 않게 했다).
2. GPT가 그린 뒤 스스로 확인한다: 망치마다 머리 하나·손잡이 하나인지, 모두 같은 방향인지, 글자·빛 번짐이 없는지 — 틀린 망치는 **그 칸만** 다시 그리게 했다.
3. 배경이 투명하게 안 나와도 무늬 없는 흰 배경이면 된다(Claude가 오려 낸다). 빛 번짐·그림자만 없으면 된다.
4. 받은 그림은 구글 드라이브 `기타 키우기` 폴더(2026-11-18 정리 뒤로는 `기타 키우기/5 장비 아이콘/`)에 넣고 알려 주면 Claude가 넣는다.

## 프롬프트

```
Make ONE image, wide 1536x1024, transparent background: 4 hammers in a single row, for my mobile game "Guitar Upgrade". Draw everything in one go - do not stop to ask me anything.

WHAT IT IS
A "fret hammer": the real tool a guitar luthier uses to tap frets into a guitar fretboard. It is a small hammer with a short cylindrical head - one striking face is BRASS metal, the other striking face is a WHITE NYLON (plastic) cap - and a straight handle. In my game the hammer flies in and strikes the side of a guitar every time the player presses "upgrade", so it is the player's upgrade tool. The 4 hammers are 4 upgrade tiers, from basic to legendary, left to right.

RULES (same for all 4)
- All 4 hammers in the EXACT SAME pose and size: side view, head at the top, the handle going straight down (vertical, very slightly tilted to the right at the bottom), the BRASS striking face pointing to the LEFT, the white nylon face pointing to the right. Each hammer fills about 75% of its column's height, centered in its column, with clear empty space between the hammers - nothing touches.
- One head and one handle per hammer - no extra heads, no second handle, no floating parts.
- STYLE: polished 2D mobile-game item art, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and cute, light from the top-left. Simple shapes so it reads clearly when small.
- NO text, letters, numbers or logos anywhere.
- NO glow, aura, light bloom, haze, mist, halo or drop shadow around the hammers (I have to cut them out of the background). Every highlight, sparkle or flame is a SOLID shape with a hard dark outline - nothing semi-transparent.
- Background: fully transparent (if impossible, plain flat white).

1 (left) BASIC: plain fret hammer - dull brass head with a white nylon cap on the right end, a light natural-wood handle with a rounded end. Simple and honest, a little worn.
2 POLISHED: the same hammer cleaned up - shiny polished brass head with a bright solid highlight stripe, the handle wrapped in brown leather with stitching.
3 GOLDEN: the head is bright gold with a small red gemstone set in the middle of its side, the white cap has a thin gold ring, the handle is black ebony wood with a gold cap at the bottom.
4 LEGENDARY: the head is gold and deep purple with a white lightning-bolt pattern on its side; around the LEFT (brass) striking face there are a few solid flame shapes in orange and yellow with hard dark outlines (like a cartoon fire crown, not a glow); the handle is wrapped in a red cord with a small tassel at the bottom.

After you draw the image, check it yourself:
- Count: exactly 4 hammers, each with exactly ONE head and ONE handle.
- Direction: every hammer has its brass face pointing LEFT and its handle pointing down, all the same size.
- No text, no glow, no haze, no semi-transparent parts.
If any single hammer is wrong, redraw ONLY that hammer (keep the other three exactly the same) before you finish.
```

## 안 맞게 나오면 (같은 대화에 이어서)

- 방향이 다르면: `Make all 4 hammers face the same way: head at the top, brass face pointing LEFT, handle straight down.`
- 크기가 다르면: `Make all 4 hammers exactly the same size and height.`
- 빛 번짐이 있으면: `Remove the glow, haze and shadows. Solid shapes with clear outlines only.`
- 머리가 두 개 같으면: `Each hammer must have only one head and one handle.`
