# 기술 타당성 검토 보고서: 파일 변환 도구

- 작성: 플랫폼총괄
- 일자: 2026-03-19
- 상태: 검토 완료

---

## 1. PDF -> JPG/PNG 변환

### 판정: 클라이언트 사이드 100% 가능 (비용 0원)

### 기술 구현 방안

**핵심 라이브러리: pdfjs-dist (Mozilla PDF.js)**
- 라이선스: Apache 2.0
- GitHub Stars: 약 50k+
- 브라우저 호환: 모든 모던 브라우저 지원
- 번들 크기: ~1.5MB (worker 포함)

**처리 흐름:**
1. 사용자가 PDF 파일을 드래그앤드롭 또는 파일 선택으로 업로드
2. pdfjs-dist가 브라우저 메모리에서 PDF를 파싱
3. 각 페이지를 Canvas에 렌더링
4. Canvas.toBlob() / Canvas.toDataURL()로 JPG/PNG 변환
5. 사용자에게 다운로드 제공 (단일 파일 또는 ZIP)

**필요 패키지:**
- pdfjs-dist: PDF 파싱 및 Canvas 렌더링
- jszip: 다중 페이지 시 ZIP 압축 다운로드
- file-saver: 파일 다운로드 트리거

**예상 코드 핵심 로직:**
```typescript
import * as pdfjsLib from 'pdfjs-dist';

// PDF 로드 (클라이언트 메모리에서)
const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

// 각 페이지를 Canvas에 렌더링 후 이미지로 변환
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  const viewport = page.getViewport({ scale: 2.0 }); // 고해상도
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;

  // JPG 또는 PNG로 변환
  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, 'image/png')
  );
}
```

### 사용자 경험

| 항목 | 내용 |
|------|------|
| 변환 속도 | 페이지당 0.5~2초 (기기 성능에 따라 다름) |
| 품질 | scale 값 조정으로 고해상도 가능 (scale: 2.0 = 원본 대비 2배) |
| 파일 크기 제한 | 브라우저 메모리 제한 (실질적으로 50~100MB PDF까지 가능) |
| 서버 전송 | 없음 - 파일이 서버로 전송되지 않음 |

### Vercel 무료 플랜 영향
- 서버 사이드 처리 없음 -> 제약 없음
- 정적 자산(pdfjs worker 파일)만 CDN에서 서빙
- Serverless Function 사용하지 않음

### 추가 비용: 0원

### 결론: 즉시 개발 착수 가능. 기술적 리스크 없음.

---

## 2. HWP -> PDF/Word 변환

### 판정: 부분적 클라이언트 사이드 가능 (제한사항 있음)

### HWP 파일 포맷의 특수성

HWP는 한글과컴퓨터가 개발한 한국 고유의 문서 포맷이다.
- .hwp (구형): OLE2 Compound Document 기반의 바이너리 포맷
- .hwpx (신형): OOXML과 유사한 XML/ZIP 기반 포맷
- 공식 스펙은 공개되어 있으나, 모든 기능을 완벽하게 구현한 오픈소스 라이브러리가 매우 드묾

### 사용 가능한 라이브러리 현황 (2026-03-19 조사)

#### (A) @ohah/hwpjs (가장 유력한 후보)
- NPM: @ohah/hwpjs v0.1.0-rc.10
- 최종 업데이트: 2026-03-15 (4일 전, 활발히 개발 중)
- GitHub Stars: 146
- 라이선스: MIT
- 핵심: Rust 기반 코어 + WASM 빌드 -> 브라우저에서 실행 가능
- 출력 포맷: HTML (CSS 포함), Markdown, JSON
- 플랫폼: Node.js, Web(WASM), React Native

**장점:**
- 브라우저에서 WASM으로 동작 -> 클라이언트 사이드 처리 가능
- Rust 기반이라 파싱 성능이 좋음
- HTML 출력을 지원하므로, HTML -> PDF 변환 파이프라인 구성 가능
- MIT 라이선스로 상업적 사용 가능

**단점/리스크:**
- 아직 RC(Release Candidate) 버전 -> 프로덕션 안정성 미검증
- 모든 HWP 기능을 지원하는지 불분명 (표, 수식, 그림, 각주 등)
- WASM 번들 크기 미공개 (수 MB일 가능성)
- HWP -> DOCX 직접 변환은 미지원

#### (B) hwp.js (hahnlee)
- NPM: hwp.js v0.0.3
- 최종 릴리스: 2020-10-01 (5년 이상 경과)
- GitHub Stars: 1.3k
- 라이선스: Apache 2.0
- 브라우저에서 동작 가능 (Chrome 확장 프로그램 존재)

**장점:**
- 가장 널리 알려진 HWP JavaScript 라이브러리
- 1.3k stars로 커뮤니티 검증됨

**단점/리스크:**
- 5년 이상 릴리스 없음 -> 사실상 유지보수 중단 상태
- 최신 HWP 포맷 변경사항 미반영
- 출력이 뷰어(렌더링) 중심이지 변환(export) 목적이 아님

### 변환 파이프라인 설계 (클라이언트 사이드)

**HWP -> PDF 변환 경로:**
```
HWP 파일 -> @ohah/hwpjs (WASM) -> HTML 출력 -> window.print() / html2canvas+jsPDF -> PDF
```

**HWP -> DOCX 변환 경로:**
```
HWP 파일 -> @ohah/hwpjs (WASM) -> HTML 출력 -> html-docx-js -> DOCX
```

**필요 패키지:**
- @ohah/hwpjs: HWP 파싱 및 HTML 변환 (WASM)
- jspdf + html2canvas: HTML을 PDF로 변환 (클라이언트)
- html-docx-js: HTML을 DOCX로 변환 (클라이언트)

### 예상 품질 및 제한사항

| 항목 | 내용 |
|------|------|
| 텍스트 | 대부분 정상 변환 예상 |
| 표(Table) | 기본 표는 가능, 복잡한 병합 셀은 미확인 |
| 이미지 | 추출 가능 (CLI 도구에서 지원 확인) |
| 수식 | 한글 수식(HWP 고유) -> 변환 어려울 가능성 높음 |
| 레이아웃 | 원본과 100% 동일한 레이아웃 보장 불가 |
| 변환 속도 | WASM이므로 수 초 예상 (파일 크기에 비례) |
| 파일 크기 | 브라우저 메모리 제한, 대형 문서에서 성능 저하 가능 |

### Vercel 무료 플랜 영향
- 클라이언트 사이드 처리 시: 제약 없음
- WASM 파일을 정적 자산으로 서빙해야 함 (CDN 배포)
- Serverless Function 미사용

### 추가 비용: 0원 (클라이언트 사이드 처리 시)

### 주요 리스크

1. **품질 리스크**: HWP의 모든 서식을 완벽하게 변환하는 것은 현실적으로 불가능
   - 사용자 기대치 관리 필요: "기본 변환"으로 포지셔닝
   - "완벽한 변환이 필요한 경우 한/글 프로그램 사용 권장" 안내 필요

2. **라이브러리 안정성 리스크**: @ohah/hwpjs가 아직 RC 버전
   - 프로덕션 투입 전 충분한 테스트 필요
   - 다양한 HWP 파일로 변환 품질 검증 필수

3. **HWPX 지원 여부**: 최근 한글은 .hwpx 포맷을 기본으로 사용
   - @ohah/hwpjs의 HWPX 지원 여부 추가 확인 필요

---

## 종합 판정

| 기능 | 클라이언트 사이드 | 추가 비용 | 구현 난이도 | 품질 | 추천 |
|------|------------------|----------|------------|------|------|
| PDF -> JPG/PNG | 가능 | 0원 | 낮음 | 높음 | 즉시 개발 착수 |
| HWP -> PDF | 가능 (WASM) | 0원 | 중간 | 중간 | PoC 후 판단 |
| HWP -> DOCX | 가능 (WASM+변환) | 0원 | 높음 | 중-하 | PoC 후 판단 |

---

## 플랫폼총괄 최종 의견

### PDF -> JPG/PNG
- **결정: 개발 승인**
- pdfjs-dist는 Mozilla가 유지보수하는 검증된 라이브러리
- 클라이언트 사이드 100% 처리 가능, 비용 0원
- 바로도구의 "파일이 서버로 전송되지 않는다"는 핵심 가치와 완벽하게 부합
- 개발 예상 공수: 1~2일

### HWP -> PDF/Word
- **결정: PoC(Proof of Concept) 먼저 진행**
- @ohah/hwpjs를 활용한 프로토타입을 먼저 만들어 변환 품질 검증
- PoC 범위: 5종 이상의 실제 HWP 파일(이력서, 자기소개서, 공문서 등)로 변환 테스트
- PoC 결과에 따라 정식 개발 여부 판단
- 개발 예상 공수: PoC 1~2일, 정식 개발 2~3일

### 전략총괄 보고 사항
- 두 기능 모두 추가 비용 없이 구현 가능 (서버 비용 0원 원칙 유지)
- HWP 변환은 품질 한계가 있으므로, "간편 변환" 수준으로 포지셔닝 권장
- 취업 도구 사이트 특성상, 이력서/자기소개서 HWP -> PDF 변환은 수요가 매우 높을 것으로 예상
- 4월 초 MVP에 PDF -> JPG/PNG는 포함하고, HWP 변환은 PoC 결과 후 Phase 2로 분류 가능

---

## 개발팀 지시사항

### Phase 1 (즉시)
- [ ] PDF -> JPG/PNG 변환 도구 개발
  - pdfjs-dist + jszip + file-saver 사용
  - 해상도 선택 옵션 (1x, 2x, 3x)
  - JPG/PNG 포맷 선택
  - 전체 페이지 또는 페이지 범위 선택
  - ZIP 다운로드 (다중 페이지)

### Phase 2 (PoC)
- [ ] @ohah/hwpjs WASM 번들 크기 및 로딩 시간 측정
- [ ] 실제 HWP 파일 5종 이상으로 HTML 변환 품질 테스트
- [ ] HWPX 포맷 지원 여부 확인
- [ ] HTML -> PDF, HTML -> DOCX 파이프라인 품질 검증
- [ ] PoC 결과 보고서 작성
