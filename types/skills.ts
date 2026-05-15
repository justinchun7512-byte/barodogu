// 바로스킬 — TypeScript 타입 정의
// supabase/migrations/0001_init_skills.sql 의 enum/테이블과 1:1 매핑

export type SkillSourceType = 'official' | 'community' | 'internal';
export type SkillStatus = 'draft' | 'auto' | 'curated' | 'featured' | 'hidden';
export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type CompatibleTool =
  | 'claude-ai'
  | 'claude-code'
  | 'codex-cli'
  | 'cursor'
  | 'gemini-cli';

export type InputType = 'text' | 'file' | 'image' | 'api';

export interface Category {
  id: number;
  slug: string;
  name_ko: string;
  name_en: string | null;
  description_ko: string | null;
  icon: string | null;
  accent_color: string | null;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
  description_ko: string;
  description_long_ko: string | null;

  category_id: number;
  category?: Category;

  tags: string[];
  compatible_with: CompatibleTool[];
  difficulty: SkillDifficulty;
  input_types: InputType[];

  source_type: SkillSourceType;
  source_repo_url: string | null;
  source_author: string | null;
  source_commit_hash: string | null;
  license: string | null;
  stars: number;
  last_synced_at: string | null;

  skill_md_path: string | null;
  zip_path: string | null;

  status: SkillStatus;
  download_count: number;
  like_count: number;

  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface SkillExample {
  id: number;
  skill_id: string;
  before_text: string | null;
  after_text: string | null;
  prompt_example: string | null;
  sort_order: number;
  created_at: string;
}

export interface SkillWithExamples extends Skill {
  examples: SkillExample[];
}

// UI 라벨 매핑
export const DIFFICULTY_LABEL: Record<SkillDifficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

export const COMPATIBLE_TOOL_LABEL: Record<CompatibleTool, string> = {
  'claude-ai': 'Claude.ai',
  'claude-code': 'Claude Code',
  'codex-cli': 'Codex CLI',
  cursor: 'Cursor',
  'gemini-cli': 'Gemini CLI',
};
