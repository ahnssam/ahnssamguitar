# 기타 키우기 — 튜너 아이콘 4개 (ChatGPT 프롬프트)

2026-11-15 사용자: "클립 튜너·페달 튜너·스트로보 튜너, 그리고 랙 튜너까지 추가해 줘. 각 튜너별로 아이콘 지피티 프롬프트 만들어 줘."

- 값·보너스는 2026-11-17 사용자가 바꾼 것(클립 +0.5 · 페달 +1 · 스트로보 +2 · 랙 1,000만G +3%p). 상점 칸 이름은 '장비'(튜너 + 하드케이스).
- 지금 게임은 Font Awesome 아이콘(클립·계기판·물결·서버)을 쓴다. 그림이 오면 Claude가 잘라서 `images/play/gk/tuner_1`~`4.webp`(가칭)로 넣고 상점·'튜너' 스위치에 띄운다.
- 아이콘은 상점에서 약 44px, 강화 단추 위 스위치에서 약 16px로 작게 보인다. 그래서 **모양이 단순하고 실루엣만 봐도 구분되게** 그린다.

| 튜너 | 값 · 보너스 | 그림 |
|---|---|---|
| 클립 튜너 | 6천G · 성공 +0.5%p | 기타 헤드에 집게로 꽂는 작은 튜너, 둥근 화면에 바늘 |
| 페달 튜너 | 6만G · +1%p | 바닥에 놓고 밟는 네모난 이펙터 모양, 위에 LED 줄, 큰 풋스위치 |
| 스트로보 튜너 | 40만G · +2%p | 동그란 창 안에 줄무늬 원반이 도는 고급 튜너 |
| 랙 튜너 | 1,000만G · +3%p | 랙 장비처럼 가로로 긴 금속 상자, 양쪽 귀에 나사 구멍, 긴 LED 막대 |

## 쓰는 법

1. ChatGPT 새 대화에 아래 프롬프트를 한 번 붙여 넣는다. 한 장(2×2)에 아이콘 4개가 나온다.
2. 화면에 글자·숫자가 들어가면 ChatGPT가 스스로 고쳐 다시 그리게 했다.
3. 배경이 투명하게 안 나와도 무늬 없는 흰 배경이면 된다(Claude가 오려 낸다). 빛 번짐·그림자만 없으면 된다.

## 프롬프트

```
Make ONE image, square 1024x1024, transparent background: 4 game item icons in a 2x2 grid for my mobile game "Guitar Upgrade". They are guitar tuners the player buys in the shop, from cheapest to best. Order: top-left = 1, top-right = 2, bottom-left = 3, bottom-right = 4. Draw everything in one go - do not stop to ask me anything.

RULES
- Each icon sits centered in its own quarter with plenty of empty space around it, all four at the same size (about 70% of the quarter), nothing touching another quarter.
- STYLE: polished 2D mobile-game item icon, bold clean dark outlines, flat colors with soft cel shading (2-3 tones), slightly chunky and cute, light from the top-left, very simple shapes so each icon is still recognizable at 16 pixels.
- Slight 3/4 front view, so the face of each tuner is clearly visible.
- NO text, letters, numbers, note names or logos anywhere - the screens show only a needle, colored LED dots or a striped disc.
- NO glow, aura, light bloom, haze or drop shadow around the icons (I have to cut them out of the background). Every highlight is a solid shape with a hard edge.
- Background: fully transparent (if impossible, plain flat white).

1. Clip-on tuner: a small cheap clip-on tuner - a round black display head on a little hinge, attached to a spring clip (the clip jaw open slightly at the bottom). The display shows a simple white needle pointing straight up over a short green arc. Mostly black plastic with one small yellow accent.
2. Pedal tuner: a chunky rectangular guitar pedal in deep green metal, a row of small LED dots across the top (left ones red, middle one bright green, right ones red), one big round silver footswitch, two small input jacks on the sides.
3. Strobe tuner: a premium tabletop strobe tuner - a rounded box in royal blue with a big round window on the front, inside the window a disc of black and white stripes in rings (looking like it is spinning, drawn with a few solid curved motion lines), one small knob below the window, chrome trim.
4. Rack tuner: a professional studio rack unit - a long, low, brushed-metal box in dark purple-grey, two rack "ears" on the left and right ends with two screw holes each, a long horizontal LED meter bar across the front (red at both ends, a bright green segment in the middle), two small knobs and one small power switch.

After you draw the image, check it: if any icon has text, letters or numbers on it, or glow around it, redraw the whole image without them before you finish.
```

## 안 맞게 나오면 (같은 대화에 이어서)

- 글자가 들어갔으면: `Remove all text, letters and numbers from the screens - only a needle, LED dots or stripes.`
- 아이콘이 너무 복잡하면: `Make each icon simpler and chunkier, so it is still clear at 16 pixels.`
- 빛 번짐이 있으면: `Remove the glow and shadows. Solid shapes with clear outlines only.`
