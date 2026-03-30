# SELF_CHECK: AI 면접 질문 생성기

점검일: 2026-03-29
점검자: Generator (개발팀)

---

## 빌드 상태

- [x] `npm run build` 통과
- [x] `/tools/interview-questions` 페이지 정상 생성 확인

---

## SPEC 10개 기능 구현 점검

| # | 기능 | 상태 | 구현 위치 |
|---|------|------|-----------|
| 1 | 채용공고 구조화 입력 (4필드 + OCR) | OK | Client.tsx JD Panel |
| 2 | 이력서 입력 (텍스트 + 이미지 OCR) | OK | Client.tsx Resume Panel (탭 전환) |
| 3 | AI 면접 질문 생성 (단계별 로딩) | OK | handleGenerate + route.ts |
| 4 | 질문 카테고리 분류 (4종 탭 + 전체) | OK | CATEGORIES + categoryFilter |
| 5 | 질문 카드 (빈도 등급 + 면접관 의도) | OK | Question Cards 섹션 |
| 6 | 답변 힌트 아코디언 | OK | toggleHint + expandedHints |
| 7 | 결과 요약 배너 | OK | Summary Banner 섹션 |
| 8 | 핵심역량 추출기 크로스셀 CTA | OK | 양방향 CTA 모두 구현 |
| 9 | 결과 인쇄 / 복사 | OK | copyAll + handlePrint + @media print CSS |
| 10 | 재생성 및 질문 수/난이도 조절 | OK | Settings bar (10/15/20개, 기본/심화) |

---

## 기존 패턴 준수 점검

| 항목 | 상태 | 비고 |
|------|------|------|
| lib/tools.ts 등록 | OK | employment 카테고리, isNew: true |
| page.tsx 서버 래퍼 | OK | generateToolMetadata + generateJsonLd |
| Client.tsx 패턴 | OK | 'use client', getToolById, ToolLayout |
| API route.ts 패턴 | OK | maxDuration=30, IP rate limiting, Groq API |
| Groq 모델 | OK | llama-3.1-70b-versatile |
| rate limiter | OK | 분당 10회, transform/route.ts 동일 패턴 |
| 에러 메시지 | OK | 한국어, 사용자 친화적 |
| 다크모드 | OK | dark: 클래스 전체 적용 |

---

## AI Slop 점검

| 항목 | 상태 |
|------|------|
| 보라색 그라데이션 | 미사용 |
| "AI가 분석했습니다" 기계적 문구 | 미사용 |
| 별점/원형 게이지/퍼센트 남용 | 미사용 |
| 동일 폰트 크기 나열형 리스트 | 미사용 (카드 UI 사용) |

---

## 역방향 CTA 점검

- [x] 면접 질문 생성기 결과 하단 -> 핵심역량 추출기 CTA
- [x] 핵심역량 추출기 결과 하단 -> 면접 질문 생성기 CTA

---

## 미결 사항 (SPEC에서 Builder/Reviewer 결정 사항)

| 항목 | 결정 내용 |
|------|-----------|
| 스트리밍 응답 | 전체 완성 후 표시 (단계별 로딩 메시지로 대체) |
| OCR 이미지 크기 제한 | 기존 OCR API와 동일 (4MB) |
| 재생성 시 이전 결과 | 덮어쓰기 (새 결과로 교체) |
| 면접관 페르소나 이름 | 미사용 (AI Slop 리스크) |

---

## 파일 목록

```
barodogu/lib/tools.ts                              # interview-questions 도구 추가
barodogu/app/tools/interview-questions/page.tsx     # 서버 래퍼
barodogu/app/tools/interview-questions/Client.tsx   # 메인 컴포넌트
barodogu/app/api/interview-questions/route.ts       # Groq API 호출
barodogu/app/tools/core-competency/Client.tsx       # 역방향 CTA 추가
```
