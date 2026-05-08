'use client';

import { useState } from 'react';
import { TOOLS, searchTools, getToolsByCategory, type Category } from '@/lib/tools';
import { CategoryFilter } from '@/components/tools/CategoryFilter';
import { ToolGrid } from '@/components/tools/ToolGrid';

export default function ToolsPageClient() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const tools = search ? searchTools(search) : getToolsByCategory(category);
  const toolCount = TOOLS.length;

  return (
    <main className="max-w-[1100px] mx-auto px-5 md:px-10 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-[Outfit] text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0] mb-3">
          전체 도구 모음
        </h1>
        <p className="text-[15px] text-gray-400 dark:text-gray-500">
          {toolCount}개 무료 도구를 회원가입 없이 바로 사용하세요
        </p>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto mb-10 px-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 space-y-3">
        <p>
          바로도구는 회원가입과 설치 없이 브라우저에서 바로 사용할 수 있는 무료 온라인 도구 모음입니다. 연봉·퇴직금·실업급여 같은 직장인 필수 계산부터, BMI·TDEE 같은 건강 관리, 이름·MBTI 궁합 같은 재미용 테스트, HWP·이미지·PDF 변환 같은 파일 도구까지 한곳에서 처리할 수 있습니다.
        </p>
        <p>
          모든 계산과 변환은 사용자의 브라우저 안에서 즉시 이루어지므로 입력한 정보가 서버로 전송되지 않습니다. 개인 정보 노출 우려 없이 안심하고 사용할 수 있고, 같은 결과를 친구·동료에게 URL 한 줄로 공유할 수 있습니다. 회원가입 없이 누구나 즉시 사용할 수 있어 급한 순간(예: 면접 직전 자기소개서 글자수 확인, 점심 약속 잡기 전 데드라인 D-day 계산)에도 부담 없습니다.
        </p>
        <p>
          어떤 도구가 필요한지 모르겠다면 아래 카테고리 필터로 좁히거나 상단 검색창에 키워드를 입력해 보세요. 자주 쓰는 도구는 즐겨찾기에 추가하고, 결과 페이지의 URL을 그대로 공유하면 같은 입력값이 그대로 유지됩니다.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="도구 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-3 rounded-xl border-[1.5px] border-[#E8EAF0] dark:border-[#2A2B35] bg-white dark:bg-[#1A1B23] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Category Filter */}
      {!search && <CategoryFilter active={category} onChange={setCategory} />}

      {/* Search results */}
      {search && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          &quot;{search}&quot; 검색 결과: {tools.length}개
        </p>
      )}

      {/* Tool Grid */}
      <ToolGrid tools={tools} />

      {/* Trust Banner */}
      <div className="mt-16 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center">
        <p className="text-primary font-medium mb-2">모든 처리는 브라우저에서 이루어집니다</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">파일이 서버로 전송되지 않아 안전합니다. 회원가입도 필요 없습니다.</p>
      </div>

      {/* Category Guide */}
      <section className="mt-16 max-w-3xl mx-auto px-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">카테고리별 추천 사용 시나리오</h2>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">취업·직장인</h3>
          <p>이력서 글자수 세기, 자기소개서 맞춤법 검사, AI 면접 질문 생성, 핵심역량 추출, 연봉 실수령액·퇴직금·실업급여·연차 계산까지 취업 준비와 직장 생활에 자주 쓰이는 계산이 모두 한 화면에 모여 있습니다. 면접 직전 5분 안에 자기소개서 분량을 다듬거나, 이직 전에 퇴직금과 실업급여 예상액을 한 번에 비교하는 데 적합합니다. 연봉 협상 전에는 시급·월급·연봉 환산 도구로 실수령 기준을 미리 잡아 두면 협상 자료로 쓸 수 있습니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">건강·다이어트</h3>
          <p>BMI 계산기(아시아 기준), TDEE·BMR 칼로리 계산기로 본인의 일일 권장 칼로리·기초대사량을 확인할 수 있습니다. 다이어트를 막 시작하는 분이라면 BMI로 본인 체중 상태를 객관적으로 파악한 후, TDEE로 일일 섭취 목표를 정하는 흐름이 가장 자연스럽습니다. 결과는 URL에 저장되니 매주 같은 도구를 다시 열어 추적해도 좋습니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">생활·재미</h3>
          <p>이름 궁합·MBTI 궁합·AI 오늘의 운세·나이 계산기·D-day 계산기까지 일상에서 자주 찾는 가벼운 도구도 한곳에 모여 있습니다. 친구·연인·동료와의 대화에서 분위기를 띄우거나, 시험·여행·기념일 카운트다운을 함께 공유할 때 부담 없이 활용할 수 있습니다. 재미용 도구는 결과를 너무 진지하게 받아들이지 마시고 가볍게 즐겨주세요.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">파일 변환</h3>
          <p>HWP·HWPX 변환기, PDF·이미지 변환, 이미지 포맷 변환(PNG·JPG·WebP), JSON 정리까지 업무에 자주 등장하는 파일 변환을 별도 프로그램 설치 없이 처리합니다. 모든 변환이 브라우저 안에서 일어나므로 회사 보안 정책상 외부 업로드가 어려운 환경에서도 안심하고 사용할 수 있습니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">개발·문서</h3>
          <p>JSON 정리·맞춤법 검사 같은 가벼운 텍스트 처리 도구도 함께 제공합니다. JSON 응답을 보기 좋게 정리하거나, 보고서 제출 전 맞춤법을 빠르게 점검할 때 별도 IDE 없이도 즉시 처리할 수 있습니다.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl mx-auto px-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">자주 묻는 질문</h2>
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">정말 회원가입 없이 모든 기능을 쓸 수 있나요?</summary>
          <p className="mt-2">네, 모든 도구는 회원가입·로그인 없이 즉시 사용할 수 있습니다. 입력한 값은 서버에 저장되지 않으며, 결과는 URL 쿼리 스트링에 저장되어 즐겨찾기·공유가 가능합니다.</p>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">계산 결과는 정확한가요?</summary>
          <p className="mt-2">각 도구는 공식 계산식(국세청·고용보험공단·근로기준법 등)을 기반으로 구현되어 있습니다. 다만 세법·노동법은 매년 개정되므로, 중요한 결정(이직·퇴직 등)에는 결과를 참고용으로만 사용하시고 최종 판단은 공식 기관 또는 전문가 상담을 권장합니다.</p>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">모바일에서도 잘 작동하나요?</summary>
          <p className="mt-2">네, 모든 도구는 모바일 반응형으로 설계되어 있습니다. PC·태블릿·스마트폰 어디서든 같은 결과를 얻을 수 있고, 모바일에서도 결과 URL을 카카오톡·메시지 앱으로 바로 공유할 수 있습니다.</p>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">신규 도구는 얼마나 자주 추가되나요?</summary>
          <p className="mt-2">매주 1~2개의 신규 도구를 검토·추가하고 있습니다. 사용자 요청이 많은 도구를 우선 개발하며, 새로운 도구가 추가되면 홈 화면에 신규 배지로 표시됩니다.</p>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">원하는 도구가 없을 때 어떻게 요청하나요?</summary>
          <p className="mt-2">하단 푸터의 문의 페이지(/contact)로 도구 아이디어를 보내주시면 검토 후 추가합니다. 자주 요청되는 키워드는 우선순위가 올라갑니다.</p>
        </details>
      </section>
    </main>
  );
}
