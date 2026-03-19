# Barodogu Security Audit Report

**Date**: 2026-03-19
**Auditor**: Security Architect Agent
**Scope**: API Routes, Environment Variables, File Upload, XSS, CSRF, Dependencies

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 3 |
| Medium | 4 |
| Low | 2 |

**Overall Score: 55/100** -- 핵심 보안 이슈 수정 필요

---

## Critical Issues

### C1. OCR API -- Base64 이미지 크기 제한 없음 (DoS 취약점)

**File**: `app/api/ocr/route.ts`
**OWASP**: A04 Insecure Design

OCR 엔드포인트가 JSON body로 base64 이미지를 받지만, **이미지 크기 검증이 전혀 없음**. 공격자가 수십~수백 MB base64 문자열을 전송하여 서버 메모리를 고갈시킬 수 있음.

```typescript
// 현재 코드 (line 31-32)
const { image } = await request.json();
if (!image || typeof image !== 'string') { ... }
// 크기 검증 없음!
```

**Remediation**:
```typescript
// base64 문자열 크기 제한 (약 5MB = ~6.67MB base64)
const MAX_BASE64_LENGTH = 7 * 1024 * 1024;
if (image.length > MAX_BASE64_LENGTH) {
  return NextResponse.json({ error: '이미지 크기가 너무 큽니다. 5MB 이하만 가능합니다.' }, { status: 400 });
}
```

---

## High Issues

### H1. In-Memory Rate Limiter -- 서버리스 환경에서 무효화

**Files**: 모든 API route (transform, parse-resume, ocr, spell-check)
**OWASP**: A04 Insecure Design

`Map<string, ...>` 기반 인메모리 rate limiter는 **Vercel 서버리스 환경에서 인스턴스별로 독립**이므로 사실상 rate limiting이 작동하지 않음. 각 요청이 새 인스턴스에서 처리되면 Map이 비어있는 상태로 시작됨.

또한 메모리 누수 위험: `rateLimitMap`의 만료 엔트리를 정리하는 로직이 없음.

**Remediation**:
- **단기**: Vercel Edge Middleware + KV store 또는 Upstash Redis 기반 rate limiting 적용
- **경량 대안**: `next.config.ts`에서 Vercel의 built-in rate limiting 활용, 또는 IP 기반으로 Vercel KV 사용

### H2. Security Headers 미설정

**File**: `next.config.ts`
**OWASP**: A05 Security Misconfiguration

`next.config.ts`가 완전히 비어있어 보안 헤더가 전혀 설정되지 않음:
- `Strict-Transport-Security` (HSTS) 없음
- `X-Frame-Options` 없음 -- clickjacking 가능
- `X-Content-Type-Options` 없음
- `Content-Security-Policy` 없음
- `Referrer-Policy` 없음

**Remediation**:
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    }];
  },
};
```

### H3. OCR API -- Groq API 에러 메시지 직접 노출

**File**: `app/api/ocr/route.ts` (line 66-70)
**OWASP**: A05 Security Misconfiguration

Groq API의 에러 메시지를 클라이언트에 그대로 전달하고 있음. 내부 API 키 관련 에러, 모델 정보, 인프라 세부사항이 노출될 수 있음.

```typescript
// 현재 코드
let detail = '';
try { detail = JSON.parse(errBody)?.error?.message || errBody.slice(0, 200); } catch { detail = errBody.slice(0, 200); }
return NextResponse.json({ error: `Groq API ${res.status}: ${detail}` }, { status: 502 });
```

**Remediation**: transform API처럼 일반적인 에러 메시지만 반환:
```typescript
console.error('Groq Vision API error:', res.status, errBody);
return NextResponse.json({ error: 'AI 서비스에 일시적인 문제가 발생했습니다.' }, { status: 502 });
```

---

## Medium Issues

### M1. MIME Type 검증 없음 (파일 업로드)

**File**: `app/api/parse-resume/route.ts`
**OWASP**: A04 Insecure Design

파일 확장자(`.pdf`, `.docx`)만 검사하고, **실제 MIME type/magic bytes 검증이 없음**. 악성 파일이 확장자만 변경하여 업로드될 수 있음.

**Remediation**: `file.type` 검증 추가 및 magic bytes 확인:
```typescript
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
if (!ALLOWED_TYPES.includes(file.type)) {
  return NextResponse.json({ error: 'PDF 또는 DOCX 파일만 지원합니다.' }, { status: 400 });
}
```

### M2. Content-Type 검증 없음 (모든 JSON API)

**Files**: `app/api/transform/route.ts`, `app/api/ocr/route.ts`, `app/api/spell-check/route.ts`
**OWASP**: A03 Injection

POST 요청의 `Content-Type: application/json` 검증이 없음. 비정상적 content type으로 요청 시 예기치 않은 동작 가능.

### M3. 입력 타입 검증 불완전 (Transform API)

**File**: `app/api/transform/route.ts` (line 103-105)
**OWASP**: A03 Injection

`request.json()`으로 body를 파싱한 후 존재 여부만 확인하고, **string 타입인지 검증하지 않음**. 객체나 배열이 전달되면 `.length` 체크가 우회될 수 있음.

```typescript
// 현재: 타입 검증 없음
const { jdTasks, jdRequirements, jdPreferred, jdCulture, resumeText } = body;
if (!jdTasks || !jdRequirements || !resumeText) { ... }
```

**Remediation**:
```typescript
if (typeof jdTasks !== 'string' || typeof jdRequirements !== 'string' || typeof resumeText !== 'string') {
  return NextResponse.json({ error: '입력 형식이 올바르지 않습니다.' }, { status: 400 });
}
```

### M4. CSRF 방어 없음

**OWASP**: A01 Broken Access Control

API route에 CSRF 토큰 검증이 없음. Next.js API Routes는 SameSite 쿠키를 사용하지 않으므로 외부 사이트에서 POST 요청이 가능.

**현재 위험도**: 인증 없는 공개 API이므로 직접적 피해는 제한적이나, rate limit 우회(다른 사이트에서 방문자 브라우저를 이용해 요청 전송)에 활용될 수 있음.

**Remediation**:
- `Origin` / `Referer` 헤더 검증 추가
- 또는 Next.js middleware에서 요청 origin 확인

---

## Low Issues

### L1. JSON.parse 에러 처리 (Transform API)

**File**: `app/api/transform/route.ts` (line 182)
**OWASP**: A05 Security Misconfiguration

`JSON.parse(content)`가 실패할 경우 catch 블록에서 일반 에러로 처리되지만, 이는 AI 응답이 올바르지 않은 JSON일 때 발생할 수 있음. 명시적 try-catch가 바람직.

### L2. 맞춤법 검사 fallback 규칙에서 잘못된 교정

**File**: `app/api/spell-check/route.ts` (line 103)

`왠지 -> 웬지`는 실제로 틀린 교정임. "왠지"가 맞는 경우도 있음 ("왠지 모르게" 등). 보안 이슈는 아니지만 잘못된 교정이 사용자 신뢰도를 떨어뜨릴 수 있음.

---

## Positive Findings (잘된 부분)

| Item | Status |
|------|--------|
| GROQ_API_KEY 클라이언트 노출 | **안전** -- `process.env.GROQ_API_KEY`만 서버 측에서 사용, `NEXT_PUBLIC_` prefix 없음 |
| .gitignore에 .env 포함 | **안전** -- `.env`, `.env.local` 제외됨 |
| XSS (dangerouslySetInnerHTML) | **안전** -- 모두 정적 콘텐츠(dark mode script, JSON-LD schema)에만 사용, 사용자 입력 미포함 |
| 파일 크기 제한 (parse-resume) | **양호** -- 10MB 제한 적용됨 |
| AI 응답 스키마 검증 (transform) | **양호** -- 기본 구조 검증 있음 |
| 에러 메시지 일반화 (transform, spell-check) | **양호** -- 내부 정보 미노출 |

---

## Priority Action Plan

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 (즉시) | C1. OCR base64 크기 제한 추가 | 5분 |
| 2 (즉시) | H3. OCR 에러 메시지 일반화 | 5분 |
| 3 (이번 주) | H2. Security headers 설정 | 15분 |
| 4 (이번 주) | M3. Transform 입력 타입 검증 | 10분 |
| 5 (이번 주) | M1. 파일 MIME type 검증 | 10분 |
| 6 (다음 배포 전) | H1. Rate limiter를 외부 저장소 기반으로 교체 | 1-2시간 |
| 7 (다음 스프린트) | M2, M4. Content-Type/CSRF 검증 | 30분 |
