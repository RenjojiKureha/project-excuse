export type ExcuseStyle = 'reasonable' | 'gentle' | 'humorous' | 'direct' | 'extreme' | 'reverse';

export interface ExcuseContext {
  myRole?: string;
  targetRole?: string;
  closeness?: number;
  targetCount?: 'single' | 'multiple';
  time?: string;
  place?: string;
  channel?: 'face' | 'wechat' | 'phone';
  tone?: 'formal' | 'casual' | 'relaxed';
  extra?: string;
}

export interface ExcuseItem {
  excuseId: string;
  style: ExcuseStyle;
  styleLabel: string;
  content: string;
  tip: string;
  liked: boolean | null;
}

export interface GenerateResult {
  requestId: string;
  excuses: ExcuseItem[];
}

export interface PresetItem {
  _id: string;
  name: string;
  icon: string;
  content: string;
  defaultContext: Partial<ExcuseContext>;
}

export interface FavoriteItem {
  _id: string;
  excuseId: string;
  requestId: string;
  style: ExcuseStyle;
  content: string;
  tip: string;
  originalInput: string;
  createdAt: string;
}

export interface HistoryItem {
  _id: string;
  requestId: string;
  input: {
    content: string;
    context: ExcuseContext;
  };
  results: ExcuseItem[];
  createdAt: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const STYLE_CONFIG: Record<ExcuseStyle, { label: string; color: string; icon: string }> = {
  reasonable: { label: '合情合理', color: '#22c55e', icon: '✅' },
  gentle:     { label: '委婉温和', color: '#3b82f6', icon: '💙' },
  humorous:   { label: '幽默搞笑', color: '#eab308', icon: '😄' },
  direct:     { label: '直接干脆', color: '#f97316', icon: '⚡' },
  extreme:    { label: '离谱夸张', color: '#a855f7', icon: '🤯' },
  reverse:    { label: '反客为主', color: '#ef4444', icon: '🔄' },
};
