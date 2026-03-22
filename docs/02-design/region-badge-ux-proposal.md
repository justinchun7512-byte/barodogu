# 바로도구 국가/지역 배지 UX 디자인 제안서

작성일: 2026-03-22
작성: 디자인팀 (플랫폼총괄 산하)
대상: 플랫폼총괄, 개발팀

---

## 1. 현황 분석

### 현재 ToolCard 구조

```
┌──────────────────────────────────────┐
│  [아이콘]  도구 이름                  │
│            설명 텍스트 (2줄)          │
│            [카테고리] [HOT] [NEW]     │
└──────────────────────────────────────┘
```

카드 우측 상단은 현재 비어 있습니다. 이 공간을 지역 배지로 활용합니다.

### 도구별 지역 분류 (현재 14개 도구 기준)

| 도구 | 지역 | 근거 |
|------|------|------|
| 연봉 실수령액 계산기 | 🇰🇷 한국 | 한국 세율/4대보험 |
| 글자수 세기 | 🌐 공통 | 언어 무관 |
| 퇴직금 계산기 | 🇰🇷 한국 | 한국 근로기준법 |
| 실업급여 계산기 | 🇰🇷 한국 | 한국 고용보험법 |
| 연차 계산기 | 🇰🇷 한국 | 한국 근로기준법 |
| 시급/월급 변환기 | 🇰🇷 한국 | 한국 최저시급 기준 |
| 맞춤법 검사기 | 🇰🇷 한국 | 한국어 전용 |
| AI 핵심역량 추출기 | 🇰🇷 한국 | 한국 채용 문화 기반 |
| 이미지 포맷 변환 | 🌐 공통 | 언어/국가 무관 |
| PDF → 이미지 변환 | 🌐 공통 | 언어/국가 무관 |
| HWP 변환 | 🇰🇷 한국 | HWP는 한국 독자 포맷 |
| 대출 이자 계산기 | 🇰🇷 한국 | 한국 금융 방식 기준 |
| JSON 포맷터 | 🌐 공통 | 언어/국가 무관 |

---

## 2. 배지 디자인 결정사항

### 2-1. 아이콘 방식: 이모지 채택 (권장)

| 방식 | 장점 | 단점 | 결론 |
|------|------|------|------|
| 이모지 (🇰🇷 🌐) | 별도 에셋 없음, 즉시 사용 | OS별 렌더링 차이 | **채택** |
| SVG 국기 | 정확한 렌더링, 색약 무관 | 에셋 관리 필요 | 추후 고려 |
| 커스텀 텍스트 배지 | 명확한 전달 | 공간 많이 차지 | 보조 수단 |

이모지 채택 이유: 현재 코드베이스가 이미 이모지(`🔥`, `✨`, `📋` 등)를 아이콘으로 적극 활용하고 있으며, 추가 에셋 없이 즉시 적용 가능합니다.

### 2-2. 배지 형태: 원형 소형 배지

```
카드 우측 상단에 절대위치로 배치:

┌──────────────────────────────────────┐
│  [아이콘]  도구 이름        [🇰🇷]    │
│            설명 텍스트               │
│            [카테고리] [HOT]          │
└──────────────────────────────────────┘
```

- 크기: 24×24px (데스크탑), 20×20px (모바일)
- 위치: `position: absolute; top: 12px; right: 12px`
- 배경: `bg-white/80 dark:bg-gray-900/80` + `backdrop-blur-sm`
- 테두리: `border border-gray-200 dark:border-gray-700`
- 형태: `rounded-full`
- 호버: 툴팁으로 지역명 표시

### 2-3. 지역 타입 정의

```typescript
export type Region = 'KR' | 'US' | 'JP' | 'GLOBAL';

export const REGION_INFO: Record<Region, { flag: string; label: string; labelEn: string }> = {
  KR:     { flag: '🇰🇷', label: '한국 전용',       labelEn: 'Korea only' },
  US:     { flag: '🇺🇸', label: '미국 기준',        labelEn: 'US-based' },
  JP:     { flag: '🇯🇵', label: '일본 기준',        labelEn: 'Japan-based' },
  GLOBAL: { flag: '🌐', label: '전세계 사용 가능',   labelEn: 'Available worldwide' },
};
```

---

## 3. 국가 필터 UX 설계

### 3-1. 필터 위치

기존 카테고리 필터 바로 아래에 지역 필터를 2단으로 배치합니다.

```
[전체] [취업/직장인] [금융/생활] [AI 도구] [이미지/파일] [개발자]
[전체 지역] [🇰🇷 한국] [🌐 공통]
```

단, 현재 등록된 도구 중 미국/일본 전용은 없으므로 해당 버튼은 **도구가 존재할 때만 렌더링**합니다. 빈 필터 탭은 사용자 혼란을 유발합니다.

### 3-2. 카테고리 + 지역 필터 조합 로직

두 필터는 AND 조건으로 동작합니다.

```typescript
const filtered = TOOLS.filter(tool => {
  const categoryMatch = activeCategory === 'all' || tool.category === activeCategory;
  const regionMatch = activeRegion === 'all' || tool.region === activeRegion;
  return categoryMatch && regionMatch;
});
```

검색어 입력 시에는 두 필터 모두 무시하고 전체 검색합니다 (현재 동작과 일관성 유지).

### 3-3. 빈 결과 처리

"취업/직장인 + 공통" 조합처럼 결과가 없는 경우, 현재 "검색 결과가 없습니다" 문구에 필터 리셋 버튼을 추가합니다.

---

## 4. 다국어 전환 UX

### 4-1. 현재 상황 판단

현재 바로도구의 도구 14개 중 10개가 한국 특화입니다. 전세계 공통 도구는 3개(이미지 변환, PDF 변환, JSON 포맷터)입니다. 다국어 지원은 **현 시점 우선순위가 낮습니다.**

### 4-2. 향후 다국어 구현 시 권장 방안

**언어 전환 버튼 위치: 헤더 우측**

```
[로고 바로도구]  [검색창]  [언어: KO ▾]  [다크모드]
```

- 헤더에 고정 배치 (푸터, 플로팅 모두 발견성 낮음)
- 드롭다운: 한국어 / English / 日本語
- 현재 헤더 코드에서 다크모드 버튼 좌측에 삽입

**URL 구조:**

```
barodogu.com/          → 한국어 (기본, 현재)
barodogu.com/en/       → English
barodogu.com/ja/       → 日本語
```

Next.js App Router의 i18n 라우팅(`[locale]` 세그먼트) 활용을 권장합니다. `next-intl` 라이브러리가 현재 스택과 가장 호환성이 좋습니다.

**자동 언어 감지:**

브라우저 `navigator.language`를 읽어 첫 방문 시 1회 제안만 합니다. 강제 리디렉션은 하지 않습니다. 사용자가 URL을 공유했을 때 수신자가 다른 언어로 전환되는 UX 문제를 방지합니다.

---

## 5. 주의사항 및 접근성

### 5-1. 정치적 민감성

| 국기 | 위험도 | 대응 방안 |
|------|--------|-----------|
| 🇰🇷 태극기 | 낮음 | 사용 가능 |
| 🇺🇸 성조기 | 낮음 | 사용 가능 |
| 🇯🇵 일장기 | 중간 | 한국 사용자 대상 서비스이므로 주의, `aria-label="일본"` 명시 |
| 🇨🇳 / 🇹🇼 | 높음 | 중국 본토 / 대만 국기 모두 민감. **사용 금지**, 텍스트 배지(CN/TW)로 대체 |

현재 계획된 국가(KR, US, JP, GLOBAL)에서는 민감성 문제가 없습니다.

### 5-2. 접근성 (a11y)

**색약 사용자:** 국기 이모지는 색상이 아닌 형태로 구분되므로 색약 문제가 없습니다. 지구본(🌐)도 형태로 인식됩니다.

**스크린 리더 대응:**
```html
<span aria-label="한국 전용 도구" role="img">🇰🇷</span>
```
이모지 단독으로는 스크린 리더가 "South Korea flag"라고 읽으므로, `aria-label`로 "한국 전용 도구"를 명시합니다.

**키보드 네비게이션:** 필터 버튼은 이미 `<button>` 태그이므로 추가 작업 없습니다.

**모바일 터치 타겟:** 필터 버튼 최소 44×44px 유지 (현재 `px-4 py-2`로 충족).

### 5-3. 모바일 반응형

배지 크기는 고정값 대신 텍스트 크기 기준으로 조절합니다.

```html
<!-- 데스크탑: text-base(16px) 이모지 = 약 24px -->
<!-- 모바일: text-sm(14px) 이모지 = 약 20px -->
<span class="text-sm sm:text-base">🇰🇷</span>
```

카드 padding이 `p-5(20px)`이므로 배지는 `top-3 right-3`으로 여백을 충분히 확보합니다.

---

## 6. 구현 명세 요약

### lib/tools.ts 변경 사항

1. `Region` 타입 추가: `'KR' | 'US' | 'JP' | 'GLOBAL'`
2. `REGION_INFO` 상수 추가
3. `Tool` 인터페이스에 `region: Region` 필드 추가 (필수)
4. 기존 14개 도구에 `region` 값 추가

### components/tools/ToolCard.tsx 변경 사항

1. 카드 최상위 `<Link>` 태그에 `relative` 클래스 추가
2. 우측 상단에 `RegionBadge` 컴포넌트 삽입
3. 배지 호버 시 툴팁 표시

### components/tools/RegionBadge.tsx (신규)

```typescript
interface Props {
  region: Region;
}

export function RegionBadge({ region }: Props) {
  const info = REGION_INFO[region];
  return (
    <div className="group relative">
      <span
        aria-label={info.label}
        role="img"
        className="w-6 h-6 flex items-center justify-center text-sm
                   bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                   border border-gray-200 dark:border-gray-700
                   rounded-full shadow-sm cursor-default select-none"
      >
        {info.flag}
      </span>
      {/* 툴팁 */}
      <div className="absolute right-0 top-7 z-10 hidden group-hover:block
                      bg-gray-900 dark:bg-gray-700 text-white text-xs
                      rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
        {info.label}
      </div>
    </div>
  );
}
```

### components/tools/RegionFilter.tsx (신규)

카테고리 필터 아래에 배치. 현재 도구 목록에 실제 존재하는 지역만 버튼으로 렌더링합니다.

### page.tsx 변경 사항

1. `activeRegion` state 추가
2. `filtered` 로직을 카테고리 + 지역 AND 조건으로 변경
3. `RegionFilter` 컴포넌트 삽입

---

## 7. 인터랙티브 프로토타입

별도 HTML 프로토타입 파일을 참고하세요:

`/Users/cih7601hotmail.com/프로젝트폴더/내일모코퍼레이션/barodogu/docs/02-design/region-badge-prototype.html`

프로토타입에서 확인 가능한 항목:
- 배지 크기/위치/형태
- 호버 툴팁 동작
- 지역 필터 탭 동작 (AND 조건 필터링)
- 다크/라이트 테마 전환
- 빈 결과 처리

---

## 8. 구현 우선순위

| 단계 | 작업 | 예상 공수 |
|------|------|-----------|
| 1 | `lib/tools.ts`에 `region` 필드 추가 | 30분 |
| 2 | `RegionBadge` 컴포넌트 제작 | 1시간 |
| 3 | `ToolCard`에 배지 적용 | 30분 |
| 4 | `RegionFilter` 컴포넌트 제작 | 1시간 |
| 5 | `page.tsx` 필터 로직 연결 | 30분 |
| **합계** | | **3.5시간** |

다국어(i18n) 지원은 별도 스프린트에서 진행합니다.
