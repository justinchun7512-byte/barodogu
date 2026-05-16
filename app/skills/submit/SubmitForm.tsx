'use client';

// /skills/submit 폼 — POST /api/skills/submit

import { useState, type FormEvent } from 'react';

const CATEGORIES = [
  { value: 'sales', label: '영업/세일즈' },
  { value: 'marketing', label: '마케팅' },
  { value: 'content', label: '콘텐츠/크리에이터' },
  { value: 'planning', label: '기획/분석' },
  { value: 'korean', label: '한국형 유틸리티' },
] as const;

const COMPATIBLE_OPTIONS = [
  'Claude.ai',
  'Claude Code',
  'Codex CLI',
  'Cursor',
  '기타',
];

const LICENSE_OPTIONS = ['MIT', 'CC-BY', 'CC-BY-SA', 'Apache-2.0', '자체 제작', '기타'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_json: '요청 형식이 잘못되었습니다.',
  skill_name_length: '스킬 이름은 2~80자로 입력해주세요.',
  invalid_category: '카테고리를 선택해주세요.',
  description_length: '설명은 10~2000자로 입력해주세요.',
  example_length: '예시는 4000자 이내로 입력해주세요.',
  source_url_length: '원본 링크가 너무 깁니다.',
  source_url_format: '원본 링크는 http:// 또는 https:// 로 시작해야 합니다.',
  submitter_length: '닉네임이 너무 깁니다.',
  contact_length: '연락처가 너무 깁니다.',
  rate_limit_minute: '잠시 후 다시 시도해주세요. (1분 내 5건 제한)',
  rate_limit_hour: '잠시 후 다시 시도해주세요. (1시간 내 20건 제한)',
  duplicate: '같은 스킬이 이미 제출되었습니다.',
  insert_failed: '서버 오류로 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
};

export function SubmitForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 컨트롤드 state — 호환 도구 다중 선택만 별도 관리
  const [compatible, setCompatible] = useState<string[]>([]);

  function toggleCompatible(value: string) {
    setCompatible((cur) =>
      cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setStatus('submitting');

    const fd = new FormData(e.currentTarget);
    const payload = {
      skill_name: String(fd.get('skill_name') ?? ''),
      category_slug: String(fd.get('category_slug') ?? ''),
      description: String(fd.get('description') ?? ''),
      compatible_with: compatible,
      example: String(fd.get('example') ?? ''),
      source_url: String(fd.get('source_url') ?? ''),
      license: String(fd.get('license') ?? ''),
      submitter_handle: String(fd.get('submitter_handle') ?? ''),
      submitter_contact: String(fd.get('submitter_contact') ?? ''),
      website_url: String(fd.get('website_url') ?? ''), // honeypot
    };

    // fetch / json / status 단계별 분리. 사용자에게는 친화 메시지, console 에 진단 로그.
    let res: Response;
    try {
      res = await fetch('/api/skills/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr) {
      console.error('[submit] fetch failed', fetchErr);
      setErrorMsg(
        '연결이 끊겼습니다. 광고 차단기·VPN 사용 시 비활성화하시고, 페이지 새로고침 후 다시 시도해주세요.',
      );
      setStatus('error');
      return;
    }

    type ApiResponse = { ok?: boolean; error?: string; spam?: boolean };
    let data: ApiResponse | null = null;
    try {
      data = (await res.json()) as ApiResponse;
    } catch (parseErr) {
      console.error('[submit] parse failed', { status: res.status, parseErr });
      setErrorMsg(
        '서버 응답을 읽지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
      setStatus('error');
      return;
    }

    if (!res.ok || !data?.ok) {
      const code = data?.error ?? 'unknown';
      console.warn('[submit] api error', { status: res.status, code });
      setErrorMsg(
        ERROR_MESSAGES[code] ?? '제출에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
      setStatus('error');
      return;
    }

    setStatus('success');
    e.currentTarget.reset();
    setCompatible([]);
  }

  if (status === 'success') {
    return (
      <section className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 space-y-3">
        <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          ✅ 제출 완료
        </h2>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          접수되었습니다. 운영자가 1~3일 안에 검토 후 게시합니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          한 건 더 제출하기 →
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
    >
      {/* Honeypot — 사용자에게 안 보임 */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Field label="스킬 이름" required>
        <input
          type="text"
          name="skill_name"
          required
          minLength={2}
          maxLength={80}
          placeholder="예: B2B 제안서 구조 스킬"
          className={inputCls}
        />
      </Field>

      <Field label="카테고리" required>
        <select
          name="category_slug"
          required
          defaultValue=""
          className={inputCls}
        >
          <option value="" disabled>
            선택하세요
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="한 줄 설명" required hint="10~2000자, 어떤 문제를 어떻게 푸는지">
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          placeholder="예: 기능 나열식이 아닌 7단 구조로 결재 가능한 B2B 제안서를 작성합니다."
          className={inputCls}
        />
      </Field>

      <Field label="호환 도구" hint="해당하는 것 모두 선택">
        <div className="flex flex-wrap gap-2">
          {COMPATIBLE_OPTIONS.map((opt) => {
            const active = compatible.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleCompatible(opt)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                    : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="사용 예시 / 본문" hint="시스템 프롬프트, trigger, 사용 예시 등 자유 형식">
        <textarea
          name="example"
          maxLength={4000}
          rows={6}
          placeholder="예: ---\nname: b2b-proposal\ndescription: ...\n---\n\n## 입력\n## 출력 형식\n..."
          className={`${inputCls} font-mono text-[13px]`}
        />
      </Field>

      <Field label="원본 링크" hint="GitHub, 블로그 등 (선택)">
        <input
          type="url"
          name="source_url"
          maxLength={500}
          placeholder="https://github.com/..."
          className={inputCls}
        />
      </Field>

      <Field label="라이선스">
        <select name="license" defaultValue="" className={inputCls}>
          <option value="">선택 안 함</option>
          {LICENSE_OPTIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="제출자 닉네임 (선택)">
          <input
            type="text"
            name="submitter_handle"
            maxLength={80}
            placeholder="게시 시 표시됩니다"
            className={inputCls}
          />
        </Field>

        <Field label="연락처 (선택)" hint="이메일·트위터 등, 비공개">
          <input
            type="text"
            name="submitter_contact"
            maxLength={200}
            placeholder="검토 결과 회신용"
            className={inputCls}
          />
        </Field>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3 rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? '제출 중…' : '제출하기'}
        </button>
        <span className="text-xs text-stone-500">
          제출 시 입력 내용이 운영자에게 전달됩니다
        </span>
      </div>
    </form>
  );
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500';

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-baseline gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && (
          <span className="text-xs font-normal text-stone-500 ml-1">— {hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}
