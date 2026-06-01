/**
 * Groq 한국어 생성 공용 헬퍼 (BD-AI-LANG-001 P1, 2026-06-01)
 *
 * 모든 AI 프로즈 라우트가 공유: 호출 → 구조 검증 → 한국어 순도 검사(korean-text-guard) →
 * 오염 시 온도를 낮춰 재생성(최대 temps.length회) → 최종 결과 또는 실패 사유 반환.
 *
 * "제거(strip)"가 아니라 "감지 후 재생성"이 원칙(strip은 문법 파손). 폴백은 각 라우트가 결정.
 */
import { detectNonKoreanFields } from "@/lib/korean-text-guard";

export interface GroqKoreanParams<T> {
  system: string;
  user: string;
  models?: string[];
  temps?: number[]; // 재생성 시도 온도 순서 (기본 [0.4, 0.25, 0.15])
  /** 구조 유효성 검사 (필수 필드 존재 등) */
  isValid: (obj: unknown) => boolean;
  /** 한국어 순도 검사 대상 문자열들 추출 */
  guardTexts: (obj: T) => string[];
  /** 영문(라틴 기본) 허용 — 고유명사 필요 라우트용 */
  allowLatin?: boolean;
}

export type GroqKoreanResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "api" | "contaminated" | "invalid" };

const DEFAULT_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile"];
const DEFAULT_TEMPS = [0.4, 0.25, 0.15];

export async function generateGuardedKorean<T>(
  params: GroqKoreanParams<T>
): Promise<GroqKoreanResult<T>> {
  const models = params.models ?? DEFAULT_MODELS;
  const temps = params.temps ?? DEFAULT_TEMPS;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { ok: false, reason: "api" };

  let sawApiError = false;
  let sawInvalid = false;

  for (const temperature of temps) {
    for (const model of models) {
      let res: Response;
      try {
        res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: params.system },
              { role: "user", content: params.user },
            ],
            temperature,
            response_format: { type: "json_object" },
          }),
        });
      } catch {
        sawApiError = true;
        continue;
      }
      if (!res.ok) {
        sawApiError = true;
        continue;
      }
      let content: string | undefined;
      try {
        const data = await res.json();
        content = data.choices?.[0]?.message?.content;
      } catch {
        sawApiError = true;
        continue;
      }
      if (!content) continue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        sawInvalid = true;
        continue;
      }
      if (!parsed || typeof parsed !== "object") {
        sawInvalid = true;
        continue;
      }
      if (!params.isValid(parsed)) {
        sawInvalid = true;
        continue;
      }

      const texts = params.guardTexts(parsed as T);
      const guard = detectNonKoreanFields(
        Object.fromEntries(texts.map((t, i) => [String(i), t])),
        { allowLatin: params.allowLatin }
      );
      if (guard.clean) {
        return { ok: true, data: parsed as T };
      }
      // 오염 → 다음(더 낮은) 온도로 재생성
      console.warn(
        `[groq-korean] 비한국어 감지 (model=${model}, temp=${temperature}) offenders=${guard.offenders
          .slice(0, 8)
          .join(", ")} → 재생성`
      );
    }
  }

  if (sawApiError) return { ok: false, reason: "api" };
  if (sawInvalid) return { ok: false, reason: "invalid" };
  return { ok: false, reason: "contaminated" };
}
