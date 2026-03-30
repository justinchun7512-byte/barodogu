# QA REPORT: AI 면접 질문 생성기

점검일: 2026-03-29
점검자: QA팀
대상 버전: main (77ad5d1)

---

## 최종 판정

**전체 판정**: 조건부 합격
**가중 점수**: 7.3 / 10.0

**항목별 점수**:
- 디자인 품질: 7/10 — AI slop 패턴 회피는 잘 했으나, 독자적 디자인 아이덴티티가 약하고 핵심역량 추출기의 레이아웃을 거의 복사한 수준
- 독창성: 7/10 — "면접관 시뮬레이터" 프레임이 로딩 메시지(`면접관 시점으로 분석 중`)에만 반영되고, 결과 화면에서는 느껴지지 않음. 면접관 페르소나는 AI Slop 리스크로 제외했다고 하나, 대안적 차별화 요소가 부재
- 기술적 완성도: 7/10 — 빌드 통과, 기본 패턴 준수. 하지만 layout.tsx 누락, 이미지 OCR 에러 핸들링 버그 존재
- 기능성: 8/10 — SPEC 10개 기능 중 9개 PASS. 핵심 흐름(입력-생성-결과-탭-복사-인쇄-재생성) 모두 구현

**SPEC 기능 검증**: 9/10 PASS

**방향 판단**: 현재 방향 유지 (아래 개선 지시 사항 반영 후 합격 전환)

---

## 1단계: SPEC 10개 기능 검증

| # | 기능 | 판정 | 근거 |
|---|------|------|------|
| 1 | 채용공고 구조화 입력 (4필드 + OCR) | **[PASS]** | Client.tsx:346-391 — 담당업무/자격요건/우대사항/조직문화 4개 textarea 구현, 이미지 Ctrl+V 붙여넣기 OCR 지원 (ocrForField → /api/ocr) |
| 2 | 이력서 입력 (텍스트 + 이미지) | **[PASS]** | Client.tsx:393-444 — "직접 입력" / "이미지 붙여넣기" 탭 전환, 드래그앤드롭 업로드, OCR 텍스트 추출 후 미리보기 표시 |
| 3 | AI 면접 질문 생성 (3단계 로딩) | **[PASS]** | Client.tsx:185-191 — "채용공고를 읽는 중..." → "이력서와 교차 분석 중..." → "면접 질문을 구성 중..." 3단계 로딩 메시지 + 2.5초 간격 전환 |
| 4 | 질문 카테고리 분류 (4카테고리 + 전체 탭) | **[PASS]** | Client.tsx:539-561 — 직무 역량/경험 검증/지원 동기 & 조직문화/돌발 & 압박 + 전체 탭. 각 탭에 질문 수 뱃지 표시 |
| 5 | 질문 카드 (빈도 등급 + 면접관 의도) | **[PASS]** | Client.tsx:563-613 — 카테고리 컬러 태그(좌), 빈도 등급 뱃지(우), 질문 본문(굵게), 면접관 의도(회색 작은 글씨). SPEC 레이아웃과 일치 |
| 6 | 답변 힌트 아코디언 | **[PASS]** | Client.tsx:596-610 — 기본 접혀있음, 클릭 시 펼침/접기 토글. border-left 강조 디자인 |
| 7 | 결과 요약 배너 | **[PASS]** | Client.tsx:507-524 — 총 질문 수, 집중 카테고리 표시, 이력서 공백/약점 표시(amber dot). 텍스트 중심, 아이콘 미사용 |
| 8 | 핵심역량 추출기 크로스셀 CTA (양방향) | **[PASS]** | 면접→핵심역량: Client.tsx:617-627. 핵심역량→면접: core-competency/Client.tsx:466-477. 양방향 모두 구현. CTA 문구도 SPEC 준수 |
| 9 | 결과 인쇄 / 복사 | **[PASS]** | Client.tsx:226-238, 527-533 — copyAll은 마크다운 형태로 클립보드 복사 + 토스트 알림. handlePrint는 window.print() + @media print CSS(315-321) |
| 10 | 재생성 + 질문 수 조절 | **[FAIL]** | Client.tsx:471-503 — 질문 수(10/15/20)와 난이도(기본/심화) 설정은 구현됨. 그러나 **설정 변경 후 재생성을 눌러야만 반영**되는데, 이 사실이 UI에 표시되지 않음. 사용자가 질문 수를 변경하면 현재 결과가 바로 바뀔 것으로 오해할 수 있음. SPEC은 "결과 상단에 설정 바"를 명시하였으나, 설정 변경이 즉시 반영되지 않는 UX 혼란이 있음 |

---

## 2단계: 평가 기준 채점

### 디자인 품질 (비중 40%) — 7/10

**잘한 점:**
- AI slop 패턴 완전 회피: 보라색 그라데이션 없음, "AI가 분석했습니다" 문구 없음, 별점/게이지 없음
- 다크모드 전체 적용: 모든 컴포넌트에 `dark:` 클래스 일관 적용
- 카테고리별 색상 구분 명확 (파랑/초록/주황/빨강)
- 빈도 등급 색상 태그 (빨강/주황/파랑) SPEC과 정확히 일치

**감점 사유:**
- `Client.tsx:332-333` — Step Indicator의 active 상태 색상이 `text-primary bg-primary/5`인데, 기존 core-competency와 완전 동일한 패턴. 독자적 디자인 요소가 없음
- `Client.tsx:573` — 질문 카드 배경이 `bg-gray-50 dark:bg-gray-700/50`로 core-competency 역량 카드와 동일. SPEC은 "미묘한 그림자, 약간의 depth — 실제 카드를 집는 느낌"을 요구했으나, hover:shadow-md만 있고 기본 상태에서 depth가 없음
- `Client.tsx:315-321` — @media print CSS가 최소한만 구현. "인쇄하고 싶어지는 구성(포트폴리오 느낌)"에 미달. 폰트 크기 12px 설정 외에 카드 간 여백, 페이지 나눔 등 미고려

### 독창성 (비중 30%) — 7/10

**잘한 점:**
- 빈도 등급 시스템 (높음/보통/낮음)은 기존 면접 질문 도구에서 보기 어려운 차별점
- 면접관 의도 한 줄 요약이 각 카드에 표시되어 단순 질문 나열과 차별화
- CTA 문구 "답변에 쓸 핵심역량, 아직 정리 안 하셨나요?" — 뻔한 "관련 도구" 대신 행동 유도 문구 사용

**감점 사유:**
- "면접관 시뮬레이터" 프레임이 로딩 오버레이의 `면접관 시점으로 분석 중`(Client.tsx:462)에서만 느껴지고, 결과 화면에서는 단순 카드 나열로 전락함. 면접관 페르소나를 AI Slop으로 판단하여 제외한 것은 이해하지만, 대안(예: "이 질문은 ~에서 비롯됩니다" 같은 면접관 사고 과정 표현)이 없음
- 전체 레이아웃이 core-competency와 거의 동일한 구조 (입력 2컬럼 → 버튼 → 로딩 오버레이 → 결과). 새 도구라는 느낌보다 "같은 틀에 다른 내용을 넣은" 느낌

### 기술적 완성도 (비중 15%) — 7/10

**잘한 점:**
- TypeScript 타입 정의 충실 (Question, Summary, InterviewResult 인터페이스)
- API rate limiting 구현 (분당 10회, IP 기반)
- API 입력 검증 충실 (각 필드 길이 제한, 필수 입력 확인)
- Groq API 키는 `process.env.GROQ_API_KEY`로 서버 사이드에서만 사용, 클라이언트 미노출
- `response_format: { type: "json_object" }` 사용으로 JSON 파싱 안정성 확보
- 빌드 통과 확인

**감점 사유:**

1. **[BUG] layout.tsx 누락** — SPEC 파일 구조에 `layout.tsx` (SEO 레이아웃)이 명시되어 있고, core-competency에는 존재하나 interview-questions에는 없음. page.tsx에서 `generateToolMetadata`로 메타데이터를 처리하고 있어 기능상 치명적이지는 않으나, canonical URL이나 별도 OG 설정이 core-competency와 불일치.
   - 위치: `barodogu/app/tools/interview-questions/` (layout.tsx 미존재)
   - 수정: core-competency/layout.tsx 패턴으로 layout.tsx 생성

2. **[BUG] 이미지 OCR 에러 핸들링 누락** — `handleResumeImageUpload`(Client.tsx:133-156)에서 `reader.onload` 내부의 async 에러가 외부 try/catch에 잡히지 않음. `reader.onload`는 비동기 콜백이므로, 내부에서 throw된 에러는 `readAsDataURL` 이후의 catch 블록에 전파되지 않음. 결과: OCR 실패 시 `resumeOcrLoading`이 `true`로 고정되어 UI가 "이력서를 읽는 중..." 상태에서 멈춤.
   - 위치: `Client.tsx:133-156`
   - 수정: `reader.onload` 내부에 별도 try/catch 추가, finally에서 `setResumeOcrLoading(false)` 호출

3. **[WARN] compressImage에 에러 핸들링 없음** — `Client.tsx:80-94`에서 Image load 실패 시 Promise가 영원히 pending 상태. onerror 핸들러 미구현.
   - 위치: `Client.tsx:80-94`
   - 수정: `img.onerror` 핸들러 추가하여 reject 처리

4. **[WARN] rate limiter 메모리 누수 가능** — `route.ts:6`의 rateLimitMap이 오래된 엔트리를 정리하지 않음. Vercel serverless 환경에서는 함수 인스턴스가 재활용되므로 장기 운영 시 메모리 축적 가능. 다만 Vercel의 cold start 특성상 실제 영향은 제한적.
   - 위치: `route.ts:6-19`
   - 수정: resetAt 경과한 엔트리를 주기적으로 삭제하는 로직 추가 (낮은 우선순위)

### 기능성 (비중 15%) — 8/10

**잘한 점:**
- 입력 → 생성 → 결과 전체 흐름 구현
- 탭 전환으로 카테고리 필터링 작동
- 복사(마크다운 형식) + 인쇄(print CSS) 기능 구현
- 크로스셀 CTA 양방향 구현 완료
- 토스트 알림 구현

**감점 사유:**
- 질문 수/난이도 변경 후 재생성 필요 사실이 UI에 미표시 (SPEC 기능 10 관련)
- 결과 영역에서 "새로 입력" 버튼 클릭 시 모든 입력이 보존되지 않고 단순히 result를 null로 설정만 함 — 입력은 보존되므로 이 부분은 OK

---

## 3단계: 코드 품질 검증

### 기존 패턴 준수

| 항목 | 판정 | 비고 |
|------|------|------|
| lib/tools.ts 등록 | OK | employment 카테고리, isNew: true, SEO 메타데이터 포함 |
| page.tsx 서버 래퍼 | OK | generateToolMetadata + generateJsonLd 사용 |
| Client.tsx 'use client' | OK | 최상단 선언 |
| ToolLayout 래퍼 | OK | seoContent + guideContent 제공 |
| API route.ts | OK | maxDuration=30, POST 메서드, IP rate limiting |
| Groq 모델 | OK | llama-3.1-70b-versatile |

### 패턴 불일치

1. **layout.tsx 미존재** — core-competency는 layout.tsx에서 별도 Metadata export. interview-questions는 page.tsx의 generateToolMetadata에만 의존. 구조적 불일치.
2. **이력서 입력 방식 차이** — core-competency는 PDF/DOCX 파일 업로드(`/api/parse-resume`), interview-questions는 이미지 OCR(`/api/ocr`). SPEC은 "이미지/PDF 스크린샷을 OCR로 처리"라고 명시했으므로 이미지만 지원하는 현재 구현은 SPEC 범위 내이나, 사용자 편의 측면에서 core-competency와 통일되지 않음.

### 보안

| 항목 | 판정 |
|------|------|
| API 키 서버 사이드 전용 | OK — process.env.GROQ_API_KEY |
| Rate limiting | OK — 분당 10회 IP 기반 |
| 입력 길이 제한 | OK — 필드당 10,000자, 이력서 30,000자 |
| XSS 방지 | OK — React의 기본 이스케이프, dangerouslySetInnerHTML은 JSON-LD에만 사용 |

### 성능

- `filteredQuestions` 계산이 매 렌더마다 실행됨 (Client.tsx:246-256). useMemo 미사용. 질문 20개 수준에서는 문제없으나, 원칙적으로는 메모이제이션 권장.
- `categoryCount` 함수도 렌더마다 배열 필터링. 탭 5개 x 배열 필터 5회 = 최대 100회 비교. 무시 가능한 수준이나 useMemo 적용이 바람직.

---

## 4단계: 구체적 개선 지시

### P0 (합격 전환을 위해 필수)

1. **layout.tsx 생성**
   - 위치: `barodogu/app/tools/interview-questions/layout.tsx`
   - 수정: core-competency/layout.tsx 패턴으로 생성. title, description, canonical URL, openGraph 메타데이터 포함
   - 이유: 기존 패턴 준수 + SEO canonical URL 설정

2. **handleResumeImageUpload 에러 핸들링 수정**
   - 위치: `Client.tsx:133-156`
   - 수정: `reader.onload` 내부에 try/catch 추가
   ```tsx
   reader.onload = async () => {
     try {
       const compressed = await compressImage(reader.result as string);
       // ... fetch + setResumeText
       setResumeOcrLoading(false);
     } catch (err: unknown) {
       setError(err instanceof Error ? err.message : '이미지 인식 오류');
       setResumeOcrLoading(false);
     }
   };
   ```
   - 이유: OCR 실패 시 로딩 스피너가 영원히 회전하는 버그 방지

3. **compressImage에 onerror 추가**
   - 위치: `Client.tsx:80-94`
   - 수정: Promise에 reject 추가, img.onerror 핸들러 구현
   - 이유: 잘못된 이미지 데이터 입력 시 Promise가 무한 pending되는 것 방지

### P1 (출시 후 1주 내 개선)

4. **질문 수/난이도 변경 시 재생성 유도 UI**
   - 위치: `Client.tsx:471-504`
   - 수정: 설정 변경 시 "재생성" 버튼을 강조 표시(예: pulse 애니메이션 또는 색상 변경)하거나, 설정 변경 안내 텍스트 추가
   - 이유: 사용자가 설정 변경이 즉시 반영되지 않는다는 것을 인지하지 못할 수 있음

5. **질문 카드에 기본 depth 추가**
   - 위치: `Client.tsx:573`
   - 수정: `hover:shadow-md` 외에 기본 상태에서도 `shadow-sm` 또는 `border border-gray-100 dark:border-gray-600` 추가
   - 이유: SPEC이 요구한 "실제 카드를 집는 느낌"에 미달

6. **@media print CSS 강화**
   - 위치: `Client.tsx:315-321`
   - 수정: 카드 간 page-break-inside: avoid, 카테고리별 구분선, 상단에 생성 일시 표시 등 추가
   - 이유: "인쇄하고 싶어지는 포트폴리오 느낌" 목표에 미달

### P2 (낮은 우선순위)

7. **filteredQuestions / categoryCount useMemo 적용**
8. **rate limiter 오래된 엔트리 정리 로직 추가**

---

## 가중 점수 산출

| 항목 | 점수 | 비중 | 기여 |
|------|------|------|------|
| 디자인 품질 | 7 | 40% | 2.8 |
| 독창성 | 7 | 30% | 2.1 |
| 기술적 완성도 | 7 | 15% | 1.05 |
| 기능성 | 8 | 15% | 1.2 |
| **합계** | | **100%** | **7.15 → 7.2** |

---

## 요약

핵심 기능 구현은 충실하나, 기존 core-competency를 과도하게 따라간 결과 독자적 아이덴티티가 약하다. "면접관 시뮬레이터"라는 프레임이 결과 화면에서 체감되지 않는 것이 가장 큰 아쉬움. P0 버그 3건(layout.tsx 누락, OCR 에러 핸들링, compressImage 에러 핸들링) 수정 후 합격 전환 가능.
