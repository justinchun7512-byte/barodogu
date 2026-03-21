import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '회사 소개 - 내일모코퍼레이션',
  description: '내일모코퍼레이션은 AI와 함께 1인 기업의 가능성을 증명하는 회사입니다. 바로도구 등 실용적인 온라인 서비스를 운영합니다.',
};

export default function CompanyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Hero + Logo */}
      <section className="text-center py-12">
        {/* 로고 (시안 5) */}
        <div className="flex justify-center mb-8">
          <img src="/company/logo-option5.svg" alt="내일모코퍼레이션 로고" className="h-24" />
        </div>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
          &ldquo;내일을 모으다, 오늘을 만들다&rdquo;
        </p>
      </section>

      {/* CI 가이드 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">CI (Corporate Identity)</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 로고 */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Company Logo</h3>
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center mb-3">
                <img src="/company/logo-option5.svg" alt="로고 (라이트)" className="h-16" />
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 flex items-center justify-center">
                <img src="/company/logo-option5.svg" alt="로고 (다크)" className="h-16 invert brightness-200" />
              </div>
            </div>

            {/* 컬러 팔레트 */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Brand Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2563EB]"></div>
                  <div>
                    <p className="font-medium text-sm dark:text-white">Primary Blue</p>
                    <p className="text-xs text-gray-400">#2563EB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1D4ED8]"></div>
                  <div>
                    <p className="font-medium text-sm dark:text-white">Primary Dark</p>
                    <p className="text-xs text-gray-400">#1D4ED8</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#F59E0B]"></div>
                  <div>
                    <p className="font-medium text-sm dark:text-white">Accent Gold</p>
                    <p className="text-xs text-gray-400">#F59E0B</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#111827] border border-gray-200 dark:border-gray-600"></div>
                  <div>
                    <p className="font-medium text-sm dark:text-white">Text Dark</p>
                    <p className="text-xs text-gray-400">#111827</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 폰트 */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">한글</p>
                <p className="text-2xl font-bold dark:text-white">Pretendard</p>
                <p className="text-sm text-gray-500">가나다라마바사 0123456789</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">영문</p>
                <p className="text-2xl font-bold dark:text-white" style={{ fontFamily: 'Inter, system-ui' }}>Inter</p>
                <p className="text-sm text-gray-500">ABCDEFG abcdefg 0123456789</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 소개 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">회사 소개</h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="text-lg">
            <strong className="text-gray-900 dark:text-white">내일모코퍼레이션</strong>은
            AI 기술을 활용하여 누구나 실행 가능한 온라인 비즈니스 모델을 만드는 회사입니다.
          </p>
          <p>
            &ldquo;내일을 모으다&rdquo;라는 이름처럼, 매일 조금씩 쌓아가는 복리적 성장을 추구합니다.
            1인 기업의 한계를 AI 기술로 넘어서며, 효율적이고 실용적인 서비스를 제공합니다.
          </p>
        </div>
      </section>

      {/* 미션 & 비전 */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-primary mb-3">Mission</h3>
            <p className="text-gray-700 dark:text-gray-300">
              AI와 함께 1인 기업의 가능성을 증명하고, 누구나 실행 가능한 온라인 비즈니스 모델을 만든다.
            </p>
          </div>
          <div className="bg-secondary/5 dark:bg-secondary/10 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-secondary-dark mb-3">Vision</h3>
            <p className="text-gray-700 dark:text-gray-300">
              AI 네이티브 시대의 1인 기업 모델을 선도하며, 실용적인 디지털 서비스로 사람들의 일상을 편리하게 만든다.
            </p>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">핵심 가치</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🚀', title: '실행력', desc: '아이디어보다 실행을 우선한다' },
            { icon: '⚡', title: '효율성', desc: 'AI로 최소 리소스, 최대 결과' },
            { icon: '🔍', title: '투명성', desc: '과정과 결과를 솔직하게 공유' },
            { icon: '📈', title: '성장', desc: '매일 조금씩 나아지는 복리 성장' },
          ].map(v => (
            <div key={v.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-sm mb-1 dark:text-white">{v.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 서비스 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">서비스</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">바로도구</h3>
              <p className="text-sm text-gray-500">barodogu.com</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            회원가입 없이 바로 쓰는 무료 온라인 유틸리티 도구 모음. 연봉 계산기, 글자수 세기,
            AI 핵심역량 추출기 등 취업 준비와 직장 생활에 필요한 13가지 도구를 무료로 제공합니다.
          </p>
          <Link href="/" className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
            바로도구 바로가기 &rarr;
          </Link>
        </div>
      </section>

      {/* 사업 영역 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">사업 영역</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: '🌐', title: '수익형 웹사이트', desc: '바로도구 운영' },
            { icon: '📝', title: '블로그 운영', desc: 'SEO 기반 콘텐츠' },
            { icon: '🎬', title: '쇼츠 & 롱폼', desc: '유튜브 영상 제작' },
            { icon: '🛒', title: '구매대행', desc: '무재고 해외 구매대행' },
            { icon: '😊', title: '이모티콘', desc: '카카오톡 이모티콘 제작' },
            { icon: '📱', title: '기타 서비스', desc: '앱/웹 서비스 개발' },
          ].map(b => (
            <div key={b.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{b.icon}</div>
              <h3 className="font-semibold text-sm dark:text-white">{b.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 연혁 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">연혁</h2>
        <div className="space-y-4">
          {[
            { date: '2026.03', event: '내일모코퍼레이션 설립' },
            { date: '2026.03', event: '바로도구(barodogu.com) 런칭 - 13종 유틸리티 도구' },
            { date: '2026.03', event: 'AI 핵심역량 추출기 서비스 오픈' },
            { date: '2026.03', event: '유튜브 바로도구 채널 개설' },
          ].map((h, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-20 shrink-0">
                <span className="text-sm font-bold text-primary">{h.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{h.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 연락처 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">연락처</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏢</span>
            <span className="text-gray-700 dark:text-gray-300">내일모코퍼레이션 (NaeilMo Corporation)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">✉️</span>
            <a href="mailto:justinchun7512@gmail.com" className="text-primary hover:underline">justinchun7512@gmail.com</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">🌐</span>
            <Link href="/" className="text-primary hover:underline">barodogu.com</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">📺</span>
            <a href="https://www.youtube.com/channel/UCKepAEpDarKRafgGnFDHYuQ" target="_blank" className="text-primary hover:underline">YouTube 바로도구</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">📸</span>
            <a href="https://www.instagram.com/justinchun7512" target="_blank" className="text-primary hover:underline">Instagram</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">📰</span>
            <a href="https://blog.naver.com/barodogu" target="_blank" className="text-primary hover:underline">네이버 블로그</a>
          </div>
        </div>
      </section>

    </main>
  );
}
