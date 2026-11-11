# 로그인 메일 양식 (2026-11-11)

Supabase가 보내는 회원가입 인증 메일·비밀번호 재설정 메일을 한국어 + 사이트 로고로 바꾼 양식이다.
Supabase에 그대로 두면 "Supabase Auth"가 보낸 영어 메일로 간다.

## 붙여 넣는 곳

Supabase 대시보드 → Authentication → Emails → Templates.
양식마다 제목(Subject)을 아래처럼 바꾸고, 본문(Body)에는 파일 내용을 통째로 붙여 넣는다.

| Supabase 양식 | 제목 | 파일 |
|---|---|---|
| Confirm signup | [안쌤의 기타나무숲] 이메일 인증을 완료해 주세요 | `confirmation.html` |
| Reset password | [안쌤의 기타나무숲] 비밀번호 재설정 안내 | `recovery.html` |
| Magic link | [안쌤의 기타나무숲] 로그인 링크 | `magic_link.html` |
| Change email address | [안쌤의 기타나무숲] 이메일 주소 변경 확인 | `email_change.html` |

- 사이트가 실제로 쓰는 것은 Confirm signup(가입)과 Reset password(비밀번호 찾기)다. 나머지 둘은 혹시 쓰게 될 때를 위한 것이다.
- `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}`은 Supabase가 채우는 자리라서 고치지 않는다.
- 로고는 `https://ahnssamguitar.com/images/email-logo.png`를 불러온다. 이 그림 파일을 지우거나 이름을 바꾸면 메일 로고가 깨진다.

## 보내는 사람 (SMTP)

- Supabase 기본 메일은 시험용이다. 한 시간에 2통까지만 보내고, 보내는 사람이 "Supabase Auth"로 나온다.
- 2026-06 이후 새로 만든 무료 프로젝트는 SMTP를 따로 붙이지 않으면 양식을 고칠 수 없다.
- 같은 화면 SMTP Settings에서 메일 서비스를 붙이고, 보내는 사람 이름은 **안쌤의 기타나무숲**으로 정한다.
  - 쓰는 서비스: Resend. 보내는 주소 `noreply@ahnssamguitar.com`, Host `smtp.resend.com`, Port `465`, Username `resend`.
  - 메일 서비스 비밀번호(API 키)는 사용자가 직접 넣는다. 이 저장소에는 적지 않는다.
  - Resend 인증용 DNS 레코드는 Cloudflare에 있다(작업 지침 CLAUDE.md 참고).
- SMTP를 붙인 뒤 Authentication → Rate Limits에서 한 시간에 보낼 수 있는 메일 수를 확인한다.
