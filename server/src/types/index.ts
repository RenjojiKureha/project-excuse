// === Request Types ===

export interface ExcuseContext {
  myRole?: string;
  targetRole?: string;
  closeness?: number;       // 1-5
  targetCount?: 'single' | 'multiple';
  time?: string;
  place?: string;
  channel?: 'face' | 'wechat' | 'phone';
  tone?: 'formal' | 'casual' | 'relaxed';
  extra?: string;
}

export interface GenerateRequest {
  content: string;
  context?: ExcuseContext;
  preferredStyles?: string[];
  sessionId: string;
}

export interface RefreshRequest {
  requestId: string;
  sessionId: string;
  feedback: {
    likedStyles: string[];
    dislikedStyles: string[];
    likedIds: string[];
    dislikedIds: string[];
  };
}

export interface FeedbackRequest {
  excuseId: string;
  requestId: string;
  sessionId: string;
  action: 'like' | 'dislike';
}

export interface FavoriteRequest {
  sessionId: string;
  excuseId: string;
  requestId: string;
  style: string;
  content: string;
  tip: string;
  originalInput: string;
}

// === Response Types ===

export type ExcuseStyle = 'reasonable' | 'gentle' | 'humorous' | 'direct' | 'extreme' | 'reverse';

export interface ExcuseItem {
  id: string;
  style: ExcuseStyle;
  styleLabel: string;
  content: string;
  tip: string;
  liked: boolean | null;
}

export interface GenerateResponse {
  requestId: string;
  excuses: ExcuseItem[];
}

// === AI Types ===

export interface AIExcuseResult {
  style: string;
  content: string;
  tip: string;
}

export interface AIResponse {
  excuses: AIExcuseResult[];
}

// === Style Map ===

export const STYLE_MAP: Record<ExcuseStyle, string> = {
  reasonable: '合情合理',
  gentle: '委婉温和',
  humorous: '幽默搞笑',
  direct: '直接干脆',
  extreme: '离谱夸张',
  reverse: '反客为主',
};
