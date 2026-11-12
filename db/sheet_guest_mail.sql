-- 비회원 주문 메일 (2026-11-12)
--   · 비회원이 결제를 마치면 주문할 때 적은 이메일로 주문번호·산 악보·다시 받는 법을 보낸다(toss-confirm).
--   · 주문번호를 잊은 손님은 구매한 악보 페이지에서 이메일만 적고 '주문 내역 메일 받기'를 누른다(guest-order 의 resend).
--     그 이메일로 산, 아직 받을 수 있는(1년 안) 주문을 한 통에 모아 보낸다. 주문이 없어도 화면에는 똑같이 "보냈어요"라고만 한다.
--   · 메일은 Resend API(보내는 사람 noreply@ahnssamguitar.com)로 보낸다. 키는 Edge Function Secrets 의 RESEND_API_KEY (사용자가 넣음).
--   · guest_mail_at = 그 주문 메일을 마지막으로 보낸 때. 같은 이메일로 다시 보내기는 30분에 한 번만.

alter table public.sheet_orders add column if not exists guest_mail_at timestamptz;
