# ExcuseMe 借口生成器 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个移动端 Web 应用，帮助用户通过 AI 生成多种风格的社交拒绝借口。

**Architecture:** 前后端分离架构。后端 Express + MongoDB 处理 API 请求并对接 AI 大模型（OpenAI 兼容接口），负责提示词组装、响应解析和数据持久化。前端 Vue3 SPA 提供移动端优先的交互体验，包含输入、结果展示、历史记录和收藏功能。

**Tech Stack:** Vue3 + Vite + TypeScript + Pinia + Vant (前端) | Express + TypeScript + Mongoose (后端) | MongoDB (数据库) | OpenAI-compatible API (AI)

**Spec docs:**
- `docs/product-requirements.md` — 产品需求
- `docs/tech-design.md` — 技术设计
- `docs/prompt-design.md` — 提示词设计
- `docs/project-structure.md` — 目录结构

---

## File Structure Map

### Server (`server/`)

| File | Responsibility |
|------|---------------|
| `package.json` | 依赖和脚本 |
| `tsconfig.json` | TypeScript 配置 |
| `.env.example` | 环境变量模板 |
| `src/index.ts` | 服务启动入口 |
| `src/app.ts` | Express 应用配置（中间件、路由挂载） |
| `src/config/index.ts` | 环境变量读取 |
| `src/types/index.ts` | 共享 TypeScript 类型 |
| `src/models/excuse.model.ts` | 生成记录 Mongoose 模型 |
| `src/models/favorite.model.ts` | 收藏 Mongoose 模型 |
| `src/models/preset.model.ts` | 预设场景 Mongoose 模型 |
| `src/middlewares/errorHandler.ts` | 全局错误处理中间件 |
| `src/middlewares/rateLimiter.ts` | 请求限流中间件 |
| `src/services/prompt.service.ts` | 提示词组装逻辑 |
| `src/services/ai.service.ts` | AI API 调用 + 响应解析 |
| `src/services/excuse.service.ts` | 借口业务逻辑（生成/刷新/反馈） |
| `src/controllers/excuse.controller.ts` | 借口路由处理器 |
| `src/controllers/history.controller.ts` | 历史记录路由处理器 |
| `src/controllers/favorite.controller.ts` | 收藏路由处理器 |
| `src/controllers/preset.controller.ts` | 预设场景路由处理器 |
| `src/routes/excuse.ts` | 借口路由定义 |
| `src/routes/history.ts` | 历史路由定义 |
| `src/routes/favorite.ts` | 收藏路由定义 |
| `src/routes/preset.ts` | 预设路由定义 |
| `src/data/presets.json` | 预设场景种子数据 |

### Client (`client/`)

| File | Responsibility |
|------|---------------|
| `index.html` | HTML 入口 |
| `package.json` | 依赖和脚本 |
| `vite.config.ts` | Vite 配置（代理、postcss） |
| `tsconfig.json` | TypeScript 配置 |
| `src/main.ts` | 应用入口（挂载 Pinia/Router/Vant） |
| `src/App.vue` | 根组件（RouterView + BottomNav） |
| `src/router/index.ts` | 路由配置（4 个页面） |
| `src/stores/excuse.ts` | 借口生成状态管理 |
| `src/stores/history.ts` | 历史/收藏状态管理 |
| `src/api/request.ts` | Axios 实例封装 |
| `src/api/excuse.ts` | 借口相关 API |
| `src/api/history.ts` | 历史/收藏 API |
| `src/types/index.ts` | 前端类型定义 |
| `src/utils/session.ts` | sessionId 管理 |
| `src/utils/clipboard.ts` | 复制功能 |
| `src/utils/shareImage.ts` | 截图 + 原生分享 |
| `src/styles/variables.css` | CSS 变量 / 主题色 |
| `src/styles/global.css` | 全局样式 + 移动端适配 |
| `src/views/Home.vue` | 首页（输入页） |
| `src/views/Result.vue` | 结果展示页 |
| `src/views/History.vue` | 历史记录页 |
| `src/views/Favorites.vue` | 收藏夹页 |
| `src/components/ExcuseInput.vue` | 主输入组件 |
| `src/components/ContextForm.vue` | 补充信息折叠表单 |
| `src/components/PresetCards.vue` | 预设场景快捷卡片 |
| `src/components/ExcuseCard.vue` | 单个借口卡片 |
| `src/components/ExcuseList.vue` | 借口列表容器 |
| `src/components/StyleTag.vue` | 风格标签 |
| `src/components/ShareImage.vue` | 分享图片生成与预览 |
| `src/components/QrCode.vue` | 二维码组件 |
| `src/components/BottomNav.vue` | 底部导航栏 |
| `src/components/LoadingAnimation.vue` | 生成等待动画 |

---

## Chunk 1: Project Scaffolding & Server Foundation

### Task 1: Initialize Server Project

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/.env.example`
- Create: `server/src/config/index.ts`
- Create: `server/src/types/index.ts`

- [ ] **Step 1: Create server directory and initialize package.json**

```bash
cd C:\Users\22719\Desktop\project-excuse
mkdir -p server/src
cd server
npm init -y
```

- [ ] **Step 2: Install server dependencies**

```bash
cd C:\Users\22719\Desktop\project-excuse\server
npm install express mongoose dotenv cors uuid express-rate-limit openai
npm install -D typescript @types/express @types/cors @types/uuid ts-node-dev @types/node
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create .env.example**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/excuse-generator
AI_API_KEY=your-api-key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o
```

- [ ] **Step 5: Create server/src/types/index.ts — shared type definitions**

```typescript
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
```

- [ ] **Step 6: Create server/src/config/index.ts**

```typescript
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/excuse-generator',
  ai: {
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_API_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.AI_MODEL || 'gpt-4o',
  },
};
```

- [ ] **Step 7: Update server/package.json scripts**

在 `package.json` 中添加 scripts：

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add server/
git commit -m "feat: initialize server project with TypeScript config and shared types"
```

---

### Task 2: Express App + Middleware

**Files:**
- Create: `server/src/app.ts`
- Create: `server/src/index.ts`
- Create: `server/src/middlewares/errorHandler.ts`
- Create: `server/src/middlewares/rateLimiter.ts`

- [ ] **Step 1: Create server/src/middlewares/errorHandler.ts**

```typescript
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  console.error(`[Error] ${statusCode}: ${message}`, err.stack);

  res.status(statusCode).json({
    code: statusCode,
    message,
  });
}

export function createError(statusCode: number, message: string): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
}
```

- [ ] **Step 2: Create server/src/middlewares/rateLimiter.ts**

```typescript
import rateLimit from 'express-rate-limit';

// 生成接口限流：每分钟 5 次
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.sessionId || req.ip || 'unknown',
  message: { code: 429, message: '请求过于频繁，请稍后再试' },
});

// 通用 API 限流：每分钟 60 次
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { code: 429, message: '请求过于频繁，请稍后再试' },
});
```

- [ ] **Step 3: Create server/src/app.ts**

```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// 路由挂载（后续 Task 中添加）
// app.use('/api/excuse', excuseRoutes);
// app.use('/api/history', historyRoutes);
// app.use('/api/favorite', favoriteRoutes);
// app.use('/api/presets', presetRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ code: 200, message: 'ok' });
});

// 错误处理（必须在路由之后）
app.use(errorHandler);

export default app;
```

- [ ] **Step 4: Create server/src/index.ts**

```typescript
import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
```

- [ ] **Step 5: Verify server starts**

```bash
cd C:\Users\22719\Desktop\project-excuse\server
# 创建 .env 文件（从 .env.example 复制）
cp .env.example .env
npm run dev
```

Expected: 控制台输出 `MongoDB connected` 和 `Server running on http://localhost:3000`（需要本地 MongoDB 运行）

- [ ] **Step 6: Commit**

```bash
git add server/src/app.ts server/src/index.ts server/src/middlewares/
git commit -m "feat: add Express app with error handler and rate limiter middleware"
```

---

### Task 3: MongoDB Models

**Files:**
- Create: `server/src/models/excuse.model.ts`
- Create: `server/src/models/favorite.model.ts`
- Create: `server/src/models/preset.model.ts`

- [ ] **Step 1: Create server/src/models/excuse.model.ts**

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IExcuseResult {
  excuseId: string;
  style: string;
  content: string;
  tip: string;
  liked: boolean | null;
}

export interface IExcuse extends Document {
  requestId: string;
  sessionId: string;
  input: {
    content: string;
    context: {
      myRole?: string;
      targetRole?: string;
      closeness?: number;
      targetCount?: string;
      time?: string;
      place?: string;
      channel?: string;
      tone?: string;
      extra?: string;
    };
  };
  results: IExcuseResult[];
  promptTokens: number;
  completionTokens: number;
  createdAt: Date;
}

const excuseResultSchema = new Schema<IExcuseResult>({
  excuseId: { type: String, required: true },
  style: { type: String, required: true },
  content: { type: String, required: true },
  tip: { type: String, default: '' },
  liked: { type: Schema.Types.Mixed, default: null },
}, { _id: false });

const excuseSchema = new Schema<IExcuse>({
  requestId: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true, index: true },
  input: {
    content: { type: String, required: true },
    context: {
      myRole: String,
      targetRole: String,
      closeness: Number,
      targetCount: String,
      time: String,
      place: String,
      channel: String,
      tone: String,
      extra: String,
    },
  },
  results: [excuseResultSchema],
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
}, { timestamps: true });

excuseSchema.index({ sessionId: 1, createdAt: -1 });

export const ExcuseModel = mongoose.model<IExcuse>('Excuse', excuseSchema);
```

- [ ] **Step 2: Create server/src/models/favorite.model.ts**

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  sessionId: string;
  excuseId: string;
  requestId: string;
  style: string;
  content: string;
  tip: string;
  originalInput: string;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  sessionId: { type: String, required: true },
  excuseId: { type: String, required: true },
  requestId: { type: String, required: true },
  style: { type: String, required: true },
  content: { type: String, required: true },
  tip: { type: String, default: '' },
  originalInput: { type: String, default: '' },
}, { timestamps: true });

favoriteSchema.index({ sessionId: 1, createdAt: -1 });
favoriteSchema.index({ sessionId: 1, excuseId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);
```

- [ ] **Step 3: Create server/src/models/preset.model.ts**

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IPreset extends Document {
  name: string;
  icon: string;
  content: string;
  defaultContext: Record<string, string>;
  sortOrder: number;
  enabled: boolean;
}

const presetSchema = new Schema<IPreset>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  content: { type: String, required: true },
  defaultContext: { type: Schema.Types.Mixed, default: {} },
  sortOrder: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
});

presetSchema.index({ enabled: 1, sortOrder: 1 });

export const PresetModel = mongoose.model<IPreset>('Preset', presetSchema);
```

- [ ] **Step 4: Commit**

```bash
git add server/src/models/
git commit -m "feat: add Mongoose models for excuses, favorites, and presets"
```

---

## Chunk 2: AI Service Layer & Backend API

### Task 4: Prompt Service

**Files:**
- Create: `server/src/services/prompt.service.ts`

- [ ] **Step 1: Create prompt.service.ts — 组装 system prompt 和 user prompt**

```typescript
import { ExcuseContext } from '../types';

const SYSTEM_PROMPT = `你是一个社交借口生成助手。用户会告诉你一件想拒绝的事，你需要帮用户生成多个不同风格的借口。

## 你的任务
根据用户描述的场景，生成 6 个不同风格的拒绝借口。每个借口应该自然、可信，并且考虑到具体的社交情境。

## 风格要求
你必须生成以下 6 种风格的借口，每种一个：
1. reasonable（合情合理）— 最自然安全的理由，难以被质疑
2. gentle（委婉温和）— 照顾对方感受，维护关系
3. humorous（幽默搞笑）— 用幽默化解尴尬
4. direct（直接干脆）— 简洁明了地表达拒绝
5. extreme（离谱夸张）— 戏剧化的小概率事件理由，趣味性强
6. reverse（反客为主）— 反提一个更麻烦的请求，让对方主动放弃

## 输出格式
你必须严格返回以下 JSON 格式，不要包含任何其他文本：

{
  "excuses": [
    {
      "style": "reasonable",
      "content": "具体的借口话术，包含完整的对话内容",
      "tip": "一句话使用建议"
    }
  ]
}

## 注意事项
- content 中要写出完整的话术，用户可以直接复制使用
- 根据拒绝方式（面对面/微信/电话）调整话术的口语化程度
- 根据关系亲密度调整措辞的正式程度
- tip 中给出简短的使用提示，如注意事项或配合动作
- 不要生成可能伤害他人或涉及违法内容的借口`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(content: string, context?: ExcuseContext): string {
  const lines: string[] = [`我想拒绝的事：${content}`];

  if (!context) return lines.join('\n');

  const optional: string[] = [];

  if (context.myRole) optional.push(`我的身份：${context.myRole}`);
  if (context.targetRole) optional.push(`对方的身份：${context.targetRole}`);
  if (context.closeness) optional.push(`我和对方的关系亲密度：${context.closeness}/5（1为陌生人，5为很亲密）`);
  if (context.targetCount) {
    optional.push(`拒绝对象：${context.targetCount === 'single' ? '单个人' : '一群人'}`);
  }
  if (context.time) optional.push(`时间：${context.time}`);
  if (context.place) optional.push(`地点：${context.place}`);
  if (context.channel) {
    const channelMap: Record<string, string> = { face: '面对面', wechat: '微信文字消息', phone: '电话' };
    optional.push(`拒绝方式：${channelMap[context.channel] || context.channel}`);
  }
  if (context.tone) {
    const toneMap: Record<string, string> = { formal: '正式一些', casual: '日常随意', relaxed: '轻松幽默' };
    optional.push(`我希望的语气：${toneMap[context.tone] || context.tone}`);
  }
  if (context.extra) optional.push(`补充信息：${context.extra}`);

  if (optional.length > 0) {
    lines.push('', ...optional);
  }

  return lines.join('\n');
}

export function buildRefreshSuffix(feedback: {
  likedStyles: string[];
  dislikedStyles: string[];
  likedContents?: string[];
}): string {
  const lines: string[] = [
    '',
    '## 用户反馈',
    '用户对上一批借口的反馈如下，请据此调整生成方向：',
  ];

  if (feedback.likedStyles.length > 0) {
    lines.push(`- 用户喜欢的风格：${feedback.likedStyles.join('、')}`);
  }
  if (feedback.dislikedStyles.length > 0) {
    lines.push(`- 用户不喜欢的风格：${feedback.dislikedStyles.join('、')}`);
  }
  if (feedback.likedContents && feedback.likedContents.length > 0) {
    lines.push(`- 用户点赞的借口内容：${feedback.likedContents.join('；')}`);
  }

  lines.push('', '请生成一批新的借口，多侧重用户喜欢的方向，避免用户不喜欢的方向。不要重复之前生成过的借口。');

  return lines.join('\n');
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/services/prompt.service.ts
git commit -m "feat: add prompt service for building AI prompts from user input"
```

---

### Task 5: AI Service

**Files:**
- Create: `server/src/services/ai.service.ts`

- [ ] **Step 1: Create ai.service.ts — 调用 AI API 并解析 JSON 响应**

```typescript
import OpenAI from 'openai';
import { config } from '../config';
import { AIResponse } from '../types';
import { getSystemPrompt } from './prompt.service';

const client = new OpenAI({
  apiKey: config.ai.apiKey,
  baseURL: config.ai.baseUrl,
});

export interface AICallResult {
  data: AIResponse;
  promptTokens: number;
  completionTokens: number;
}

export async function callAI(userPrompt: string): Promise<AICallResult> {
  const response = await client.chat.completions.create({
    model: config.ai.model,
    messages: [
      { role: 'system', content: getSystemPrompt() },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.9,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '';
  const parsed = parseAIResponse(raw);

  return {
    data: parsed,
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
  };
}

function parseAIResponse(raw: string): AIResponse {
  // 尝试直接解析
  try {
    const json = JSON.parse(raw);
    if (json.excuses && Array.isArray(json.excuses)) {
      return filterUnsafeContent(json as AIResponse);
    }
  } catch {
    // 尝试从文本中提取 JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const json = JSON.parse(match[0]);
        if (json.excuses && Array.isArray(json.excuses)) {
          return filterUnsafeContent(json as AIResponse);
        }
      } catch {
        // fall through to fallback
      }
    }
  }

  // 兜底：返回默认响应
  return {
    excuses: [{
      style: 'reasonable',
      content: '抱歉，AI 暂时无法生成借口，请稍后重试。',
      tip: '可以点击"换一批"重新生成',
    }],
  };
}

// 内容安全过滤
const UNSAFE_KEYWORDS = ['自杀', '自残', '暴力', '杀人', '毒品', '赌博'];

function filterUnsafeContent(response: AIResponse): AIResponse {
  response.excuses = response.excuses.map((excuse) => {
    const hasUnsafe = UNSAFE_KEYWORDS.some((kw) => excuse.content.includes(kw));
    if (hasUnsafe) {
      return {
        ...excuse,
        content: '该借口不适合展示，请换一批',
        tip: '点击"换一批"重新生成',
      };
    }
    return excuse;
  });
  return response;
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/services/ai.service.ts
git commit -m "feat: add AI service for calling OpenAI-compatible API with response parsing"
```

---

### Task 6: Excuse Business Service

**Files:**
- Create: `server/src/services/excuse.service.ts`

- [ ] **Step 1: Create excuse.service.ts — 生成/刷新/反馈业务逻辑**

```typescript
import { v4 as uuidv4 } from 'uuid';
import { ExcuseModel } from '../models/excuse.model';
import { callAI } from './ai.service';
import { buildUserPrompt, buildRefreshSuffix } from './prompt.service';
import {
  GenerateRequest, RefreshRequest, FeedbackRequest,
  ExcuseItem, STYLE_MAP, ExcuseStyle,
} from '../types';

export async function generateExcuses(req: GenerateRequest): Promise<{
  requestId: string;
  excuses: ExcuseItem[];
}> {
  const userPrompt = buildUserPrompt(req.content, req.context);
  const { data, promptTokens, completionTokens } = await callAI(userPrompt);

  const requestId = `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  const excuses: ExcuseItem[] = data.excuses.map((item, index) => {
    const style = item.style as ExcuseStyle;
    return {
      id: `exc_${uuidv4().replace(/-/g, '').slice(0, 8)}`,
      style,
      styleLabel: STYLE_MAP[style] || item.style,
      content: item.content,
      tip: item.tip,
      liked: null,
    };
  });

  // 存储到数据库
  await ExcuseModel.create({
    requestId,
    sessionId: req.sessionId,
    input: {
      content: req.content,
      context: req.context || {},
    },
    results: excuses.map((e) => ({
      excuseId: e.id,
      style: e.style,
      content: e.content,
      tip: e.tip,
      liked: null,
    })),
    promptTokens,
    completionTokens,
  });

  return { requestId, excuses };
}

export async function refreshExcuses(req: RefreshRequest): Promise<{
  requestId: string;
  excuses: ExcuseItem[];
}> {
  // 查找原始请求
  const original = await ExcuseModel.findOne({ requestId: req.requestId });
  if (!original) {
    throw Object.assign(new Error('原始请求不存在'), { statusCode: 404 });
  }

  // 获取用户点赞的内容
  const likedContents = original.results
    .filter((r) => req.feedback.likedIds.includes(r.excuseId))
    .map((r) => r.content);

  // 重新组装 prompt
  const userPrompt = buildUserPrompt(original.input.content, original.input.context as any)
    + buildRefreshSuffix({
      likedStyles: req.feedback.likedStyles,
      dislikedStyles: req.feedback.dislikedStyles,
      likedContents,
    });

  const { data, promptTokens, completionTokens } = await callAI(userPrompt);

  const newRequestId = `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  const excuses: ExcuseItem[] = data.excuses.map((item) => {
    const style = item.style as ExcuseStyle;
    return {
      id: `exc_${uuidv4().replace(/-/g, '').slice(0, 8)}`,
      style,
      styleLabel: STYLE_MAP[style] || item.style,
      content: item.content,
      tip: item.tip,
      liked: null,
    };
  });

  // 存储新记录
  await ExcuseModel.create({
    requestId: newRequestId,
    sessionId: req.sessionId,
    input: original.input,
    results: excuses.map((e) => ({
      excuseId: e.id,
      style: e.style,
      content: e.content,
      tip: e.tip,
      liked: null,
    })),
    promptTokens,
    completionTokens,
  });

  return { requestId: newRequestId, excuses };
}

export async function feedbackExcuse(req: FeedbackRequest): Promise<void> {
  const liked = req.action === 'like' ? true : false;
  await ExcuseModel.updateOne(
    { requestId: req.requestId, 'results.excuseId': req.excuseId },
    { $set: { 'results.$.liked': liked } },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/services/excuse.service.ts
git commit -m "feat: add excuse service with generate, refresh, and feedback logic"
```

---

### Task 7: Controllers & Routes

**Files:**
- Create: `server/src/controllers/excuse.controller.ts`
- Create: `server/src/controllers/history.controller.ts`
- Create: `server/src/controllers/favorite.controller.ts`
- Create: `server/src/controllers/preset.controller.ts`
- Create: `server/src/routes/excuse.ts`
- Create: `server/src/routes/history.ts`
- Create: `server/src/routes/favorite.ts`
- Create: `server/src/routes/preset.ts`
- Create: `server/src/data/presets.json`
- Modify: `server/src/app.ts` — 挂载路由

- [ ] **Step 1: Create server/src/controllers/excuse.controller.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { generateExcuses, refreshExcuses, feedbackExcuse } from '../services/excuse.service';
import { createError } from '../middlewares/errorHandler';

export async function generate(req: Request, res: Response, next: NextFunction) {
  try {
    const { content, context, preferredStyles, sessionId } = req.body;
    if (!content || !sessionId) {
      throw createError(400, 'content 和 sessionId 为必填项');
    }
    if (content.length > 200) {
      throw createError(400, '输入内容不能超过 200 字');
    }
    const result = await generateExcuses({ content, context, preferredStyles, sessionId });
    res.json({ code: 200, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId, feedback, sessionId } = req.body;
    if (!requestId || !feedback || !sessionId) {
      throw createError(400, '参数不完整');
    }
    const result = await refreshExcuses({ requestId, feedback, sessionId });
    res.json({ code: 200, data: result });
  } catch (err) {
    next(err);
  }
}

export async function feedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { excuseId, requestId, action, sessionId } = req.body;
    if (!excuseId || !requestId || !action || !sessionId) {
      throw createError(400, '参数不完整');
    }
    await feedbackExcuse({ excuseId, requestId, action, sessionId });
    res.json({ code: 200, message: 'ok' });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2: Create server/src/controllers/history.controller.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { ExcuseModel } from '../models/excuse.model';
import { createError } from '../middlewares/errorHandler';

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw createError(400, 'sessionId 为必填项');

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const keyword = req.query.keyword as string;

    const filter: any = { sessionId };
    if (keyword) {
      filter['input.content'] = { $regex: keyword, $options: 'i' };
    }

    const total = await ExcuseModel.countDocuments(filter);
    const list = await ExcuseModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      code: 200,
      data: { list, total, page, pageSize },
    });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 3: Create server/src/controllers/favorite.controller.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { FavoriteModel } from '../models/favorite.model';
import { createError } from '../middlewares/errorHandler';

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, excuseId, requestId, style, content, tip, originalInput } = req.body;
    if (!sessionId || !excuseId || !requestId) {
      throw createError(400, '参数不完整');
    }

    const existing = await FavoriteModel.findOne({ sessionId, excuseId });
    if (existing) {
      return res.json({ code: 200, data: existing });
    }

    const favorite = await FavoriteModel.create({
      sessionId, excuseId, requestId, style, content, tip, originalInput,
    });
    res.json({ code: 200, data: favorite });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw createError(400, 'sessionId 为必填项');

    await FavoriteModel.deleteOne({ _id: id, sessionId });
    res.json({ code: 200, message: 'ok' });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw createError(400, 'sessionId 为必填项');

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const style = req.query.style as string;

    const filter: any = { sessionId };
    if (style) filter.style = style;

    const total = await FavoriteModel.countDocuments(filter);
    const list = await FavoriteModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      code: 200,
      data: { list, total, page, pageSize },
    });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 4: Create server/src/controllers/preset.controller.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { PresetModel } from '../models/preset.model';

export async function getPresets(_req: Request, res: Response, next: NextFunction) {
  try {
    const presets = await PresetModel.find({ enabled: true })
      .sort({ sortOrder: 1 })
      .lean();
    res.json({ code: 200, data: presets });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 5: Create route files**

`server/src/routes/excuse.ts`:
```typescript
import { Router } from 'express';
import { generate, refresh, feedback } from '../controllers/excuse.controller';
import { generateLimiter } from '../middlewares/rateLimiter';

const router = Router();
router.post('/generate', generateLimiter, generate);
router.post('/refresh', generateLimiter, refresh);
router.post('/feedback', feedback);

export default router;
```

`server/src/routes/history.ts`:
```typescript
import { Router } from 'express';
import { getHistory } from '../controllers/history.controller';

const router = Router();
router.get('/', getHistory);

export default router;
```

`server/src/routes/favorite.ts`:
```typescript
import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favorite.controller';

const router = Router();
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);
router.get('/', getFavorites);

export default router;
```

`server/src/routes/preset.ts`:
```typescript
import { Router } from 'express';
import { getPresets } from '../controllers/preset.controller';

const router = Router();
router.get('/', getPresets);

export default router;
```

- [ ] **Step 6: Create server/src/data/presets.json — 预设场景种子数据**

```json
[
  { "name": "拒绝聚餐", "icon": "🍽️", "content": "有人约我去吃饭/聚餐", "defaultContext": { "channel": "wechat", "tone": "casual" }, "sortOrder": 1 },
  { "name": "拒绝加班", "icon": "💼", "content": "领导/同事让我加班", "defaultContext": { "tone": "formal" }, "sortOrder": 2 },
  { "name": "拒绝借钱", "icon": "💰", "content": "有人向我借钱", "defaultContext": { "tone": "casual" }, "sortOrder": 3 },
  { "name": "拒绝帮忙", "icon": "🤝", "content": "有人请我帮忙做事", "defaultContext": { "tone": "casual" }, "sortOrder": 4 },
  { "name": "拒绝约会", "icon": "💕", "content": "有人约我出去/相亲", "defaultContext": { "tone": "casual" }, "sortOrder": 5 },
  { "name": "拒绝送礼", "icon": "🎁", "content": "有人给我送礼/让我收礼", "defaultContext": { "tone": "formal" }, "sortOrder": 6 },
  { "name": "拒绝活动", "icon": "🎉", "content": "有人邀请我参加活动", "defaultContext": { "channel": "wechat", "tone": "casual" }, "sortOrder": 7 },
  { "name": "拒绝推销", "icon": "📢", "content": "有人向我推销产品/安利东西", "defaultContext": { "tone": "casual" }, "sortOrder": 8 }
]
```

- [ ] **Step 7: Update server/src/app.ts — 挂载所有路由**

取消 app.ts 中被注释的路由，改为：

```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import excuseRoutes from './routes/excuse';
import historyRoutes from './routes/history';
import favoriteRoutes from './routes/favorite';
import presetRoutes from './routes/preset';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// 路由
app.use('/api/excuse', excuseRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/presets', presetRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ code: 200, message: 'ok' });
});

app.use(errorHandler);

export default app;
```

- [ ] **Step 8: Add seed script to server/src/index.ts**

在 `start()` 函数中，连接 MongoDB 后添加预设数据初始化：

```typescript
import { PresetModel } from './models/preset.model';
import presets from './data/presets.json';

// 在 mongoose.connect 成功后添加：
const presetCount = await PresetModel.countDocuments();
if (presetCount === 0) {
  await PresetModel.insertMany(presets.map((p) => ({ ...p, enabled: true })));
  console.log('Preset data seeded');
}
```

- [ ] **Step 9: Verify server compiles and starts**

```bash
cd C:\Users\22719\Desktop\project-excuse\server
npm run dev
```

Expected: 无 TypeScript 编译错误，服务正常启动

- [ ] **Step 10: Commit**

```bash
git add server/src/controllers/ server/src/routes/ server/src/data/ server/src/app.ts server/src/index.ts
git commit -m "feat: add all backend API routes - excuse, history, favorite, preset"
```

---

## Chunk 3: Frontend Core Setup

### Task 8: Initialize Client Project

**Files:**
- Create: `client/package.json`
- Create: `client/vite.config.ts`
- Create: `client/tsconfig.json`
- Create: `client/index.html`
- Create: `client/src/main.ts`

- [ ] **Step 1: Create client project with Vite**

```bash
cd C:\Users\22719\Desktop\project-excuse
npm create vite@latest client -- --template vue-ts
```

- [ ] **Step 2: Install client dependencies**

```bash
cd C:\Users\22719\Desktop\project-excuse\client
npm install
npm install vue-router@4 pinia axios vant @vant/use
npm install -D @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import postcss-px-to-viewport-8-plugin
```

- [ ] **Step 3: Configure vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          viewportWidth: 375,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore-vw'],
          minPixelValue: 1,
          mediaQuery: false,
        }),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 4: Update client/index.html — 添加移动端 viewport meta**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#6366f1" />
    <title>ExcuseMe - 借口生成器</title>
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: Commit**

```bash
git add client/
git commit -m "feat: initialize Vue3 client with Vite, Vant, and mobile viewport config"
```

---

### Task 9: Client Types, Styles & Utilities

**Files:**
- Create: `client/src/types/index.ts`
- Create: `client/src/styles/variables.css`
- Create: `client/src/styles/global.css`
- Create: `client/src/utils/session.ts`
- Create: `client/src/utils/clipboard.ts`

- [ ] **Step 1: Create client/src/types/index.ts**

```typescript
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
  id: string;
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
```

- [ ] **Step 2: Create client/src/styles/variables.css**

```css
:root {
  /* Brand Colors */
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;

  /* Style Colors */
  --color-reasonable: #22c55e;
  --color-gentle: #3b82f6;
  --color-humorous: #eab308;
  --color-direct: #f97316;
  --color-extreme: #a855f7;
  --color-reverse: #ef4444;

  /* Neutral */
  --color-bg: #f5f5f5;
  --color-card: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-border: #e5e5e5;

  /* Spacing */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --nav-height: 50px;
}
```

- [ ] **Step 3: Create client/src/styles/global.css**

```css
@import './variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 10px);
}

/* 页面过渡动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from { transform: translateX(100%); }
.slide-left-leave-to { transform: translateX(-30%); }
.slide-right-enter-from { transform: translateX(-30%); }
.slide-right-leave-to { transform: translateX(100%); }
```

- [ ] **Step 4: Create client/src/utils/session.ts**

```typescript
const SESSION_KEY = 'excuse_session_id';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
```

- [ ] **Step 5: Create client/src/utils/clipboard.ts**

```typescript
import { showToast } from 'vant';

export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showToast('复制成功');
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('复制成功');
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add client/src/types/ client/src/styles/ client/src/utils/
git commit -m "feat: add client types, CSS variables, global styles, and utility functions"
```

---

### Task 10: Router, API Layer & Stores

**Files:**
- Create: `client/src/router/index.ts`
- Create: `client/src/api/request.ts`
- Create: `client/src/api/excuse.ts`
- Create: `client/src/api/history.ts`
- Create: `client/src/stores/excuse.ts`
- Create: `client/src/stores/history.ts`

- [ ] **Step 1: Create client/src/router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/result/:requestId',
    name: 'Result',
    component: () => import('../views/Result.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

- [ ] **Step 2: Create client/src/api/request.ts**

```typescript
import axios from 'axios';
import { showToast } from 'vant';
import { getSessionId } from '../utils/session';

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// 请求拦截器：自动注入 sessionId
request.interceptors.request.use((config) => {
  const sessionId = getSessionId();
  // GET 和 DELETE 通过 query params 传递 sessionId
  if (config.method === 'get' || config.method === 'delete') {
    config.params = { ...config.params, sessionId };
  } else {
    config.data = { ...config.data, sessionId };
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      showToast(res.data.message || '请求失败');
      return Promise.reject(new Error(res.data.message));
    }
    return res.data;
  },
  (err) => {
    const msg = err.response?.data?.message || '网络异常，请稍后重试';
    showToast(msg);
    return Promise.reject(err);
  },
);

export default request;
```

- [ ] **Step 3: Create client/src/api/excuse.ts**

```typescript
import request from './request';
import type { ExcuseContext, GenerateResult, ExcuseItem } from '../types';

export function generateExcuses(content: string, context?: ExcuseContext) {
  return request.post<any, { code: number; data: GenerateResult }>('/excuse/generate', {
    content,
    context,
  });
}

export function refreshExcuses(requestId: string, feedback: {
  likedStyles: string[];
  dislikedStyles: string[];
  likedIds: string[];
  dislikedIds: string[];
}) {
  return request.post<any, { code: number; data: GenerateResult }>('/excuse/refresh', {
    requestId,
    feedback,
  });
}

export function feedbackExcuse(excuseId: string, requestId: string, action: 'like' | 'dislike') {
  return request.post('/excuse/feedback', { excuseId, requestId, action });
}
```

- [ ] **Step 4: Create client/src/api/history.ts**

```typescript
import request from './request';
import type { PageData, HistoryItem, FavoriteItem, PresetItem } from '../types';

export function getHistory(params: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get<any, { code: number; data: PageData<HistoryItem> }>('/history', { params });
}

export function getFavorites(params: { page?: number; pageSize?: number; style?: string }) {
  return request.get<any, { code: number; data: PageData<FavoriteItem> }>('/favorite', { params });
}

export function addFavorite(data: {
  excuseId: string;
  requestId: string;
  style: string;
  content: string;
  tip: string;
  originalInput: string;
}) {
  return request.post('/favorite', data);
}

export function removeFavorite(id: string) {
  return request.delete(`/favorite/${id}`);
}

export function getPresets() {
  return request.get<any, { code: number; data: PresetItem[] }>('/presets');
}
```

- [ ] **Step 5: Create client/src/stores/excuse.ts**

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ExcuseItem, ExcuseContext } from '../types';
import * as excuseApi from '../api/excuse';

export const useExcuseStore = defineStore('excuse', () => {
  const loading = ref(false);
  const requestId = ref('');
  const excuses = ref<ExcuseItem[]>([]);
  const inputContent = ref('');
  const inputContext = ref<ExcuseContext>({});

  async function generate(content: string, context?: ExcuseContext) {
    loading.value = true;
    inputContent.value = content;
    inputContext.value = context || {};
    try {
      const res = await excuseApi.generateExcuses(content, context);
      requestId.value = res.data.requestId;
      excuses.value = res.data.excuses;
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  async function refresh() {
    if (!requestId.value) return;
    loading.value = true;
    try {
      const liked = excuses.value.filter((e) => e.liked === true);
      const disliked = excuses.value.filter((e) => e.liked === false);
      const res = await excuseApi.refreshExcuses(requestId.value, {
        likedStyles: liked.map((e) => e.style),
        dislikedStyles: disliked.map((e) => e.style),
        likedIds: liked.map((e) => e.id),
        dislikedIds: disliked.map((e) => e.id),
      });
      requestId.value = res.data.requestId;
      excuses.value = res.data.excuses;
    } finally {
      loading.value = false;
    }
  }

  async function feedback(excuseId: string, action: 'like' | 'dislike') {
    const excuse = excuses.value.find((e) => e.id === excuseId);
    if (!excuse) return;

    // 切换状态：再次点击取消
    const isToggleOff = (action === 'like' && excuse.liked === true)
      || (action === 'dislike' && excuse.liked === false);

    if (isToggleOff) {
      excuse.liked = null;
      // 不发请求，仅本地取消（后端无 unlike 接口）
      return;
    }

    excuse.liked = action === 'like' ? true : false;
    await excuseApi.feedbackExcuse(excuseId, requestId.value, action);
  }

  function reset() {
    loading.value = false;
    requestId.value = '';
    excuses.value = [];
    inputContent.value = '';
    inputContext.value = {};
  }

  return { loading, requestId, excuses, inputContent, inputContext, generate, refresh, feedback, reset };
});
```

- [ ] **Step 6: Create client/src/stores/history.ts**

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { HistoryItem, FavoriteItem } from '../types';
import * as historyApi from '../api/history';

export const useHistoryStore = defineStore('history', () => {
  const historyList = ref<HistoryItem[]>([]);
  const historyTotal = ref(0);
  const favoriteList = ref<FavoriteItem[]>([]);
  const favoriteTotal = ref(0);
  const loading = ref(false);

  async function fetchHistory(page = 1, keyword?: string) {
    loading.value = true;
    try {
      const res = await historyApi.getHistory({ page, keyword });
      if (page === 1) {
        historyList.value = res.data.list;
      } else {
        historyList.value.push(...res.data.list);
      }
      historyTotal.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFavorites(page = 1, style?: string) {
    loading.value = true;
    try {
      const res = await historyApi.getFavorites({ page, style });
      if (page === 1) {
        favoriteList.value = res.data.list;
      } else {
        favoriteList.value.push(...res.data.list);
      }
      favoriteTotal.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }

  async function addFavorite(data: {
    excuseId: string; requestId: string; style: string;
    content: string; tip: string; originalInput: string;
  }) {
    await historyApi.addFavorite(data);
  }

  async function removeFavorite(id: string) {
    await historyApi.removeFavorite(id);
    favoriteList.value = favoriteList.value.filter((f) => f._id !== id);
    favoriteTotal.value--;
  }

  return {
    historyList, historyTotal, favoriteList, favoriteTotal, loading,
    fetchHistory, fetchFavorites, addFavorite, removeFavorite,
  };
});
```

- [ ] **Step 7: Update client/src/main.ts**

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'vant/lib/index.css';
import './styles/global.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
```

- [ ] **Step 8: Commit**

```bash
git add client/src/router/ client/src/api/ client/src/stores/ client/src/main.ts
git commit -m "feat: add Vue router, API layer, and Pinia stores for excuse and history"
```

---

## Chunk 4: Frontend Components & Views

### Task 11: App Shell — App.vue + BottomNav

**Files:**
- Create: `client/src/App.vue`
- Create: `client/src/components/BottomNav.vue`

- [ ] **Step 1: Create client/src/components/BottomNav.vue**

底部固定导航栏，包含 3 个 tab：首页 / 历史 / 收藏。使用 Vant 的 `van-tabbar` 组件。

```vue
<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/history" icon="clock-o">历史</van-tabbar-item>
    <van-tabbar-item to="/favorites" icon="star-o">收藏</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(0);
</script>
```

- [ ] **Step 2: Create client/src/App.vue**

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
  <BottomNav />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from './components/BottomNav.vue';

const router = useRouter();
const transitionName = ref('');

watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (!from?.name) return;
    // Result 页面使用 slide-left 进入
    if (to.name === 'Result') {
      transitionName.value = 'slide-left';
    } else if (from.name === 'Result') {
      transitionName.value = 'slide-right';
    } else {
      transitionName.value = '';
    }
  },
);
</script>
```

- [ ] **Step 3: Commit**

```bash
git add client/src/App.vue client/src/components/BottomNav.vue
git commit -m "feat: add App shell with BottomNav and page transition animations"
```

---

### Task 12: Home Page Components

**Files:**
- Create: `client/src/components/PresetCards.vue`
- Create: `client/src/components/ExcuseInput.vue`
- Create: `client/src/components/ContextForm.vue`
- Create: `client/src/views/Home.vue`

- [ ] **Step 1: Create client/src/components/PresetCards.vue**

预设场景快捷卡片网格，点击时 emit 选中的预设数据。

```vue
<template>
  <div class="preset-cards">
    <div class="preset-header">
      <span>快速选择场景</span>
    </div>
    <div class="preset-grid">
      <div
        v-for="preset in presets"
        :key="preset._id"
        class="preset-item"
        @click="$emit('select', preset)"
      >
        <span class="preset-icon">{{ preset.icon }}</span>
        <span class="preset-name">{{ preset.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPresets } from '../api/history';
import type { PresetItem } from '../types';

defineEmits<{ select: [preset: PresetItem] }>();

const presets = ref<PresetItem[]>([]);

onMounted(async () => {
  try {
    const res = await getPresets();
    presets.value = res.data;
  } catch {
    // 静默失败
  }
});
</script>

<style scoped>
.preset-cards { margin: 16px 0; }
.preset-header {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  background: var(--color-card);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}
.preset-item:active { transform: scale(0.95); }
.preset-icon { font-size: 24px; margin-bottom: 6px; }
.preset-name { font-size: 12px; color: var(--color-text-secondary); }
</style>
```

- [ ] **Step 2: Create client/src/components/ExcuseInput.vue**

主输入框组件，包含字数统计和提交按钮。

```vue
<template>
  <div class="excuse-input">
    <div class="input-wrapper">
      <van-field
        v-model="content"
        type="textarea"
        :maxlength="200"
        show-word-limit
        rows="3"
        autosize
        placeholder="描述你想拒绝的事..."
        @keydown.enter.prevent="handleSubmit"
      />
    </div>
    <van-button
      type="primary"
      block
      round
      :loading="loading"
      :disabled="!content.trim()"
      loading-text="生成中..."
      @click="handleSubmit"
    >
      生成借口
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits<{ submit: [content: string] }>();

const content = ref('');

// 自动聚焦主输入框
onMounted
  // Vant field 使用 setTimeout 确保 DOM 就绪
  setTimeout(() => inputRef.value?.focus(), 100);
});

function handleSubmit() {
  if (content.value.trim() && !props.loading) {
    emit('submit', content.value.trim());
  }
}

function setContent(text: string) {
  content.value = text;
}

defineExpose({ setContent });
</script>

<style scoped>
.excuse-input {
  padding: 0;
}
.input-wrapper {
  margin-bottom: 12px;
  background: var(--color-card);
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

- [ ] **Step 3: Create client/src/components/ContextForm.vue**

补充信息折叠表单，使用 Vant collapse 组件。

```vue
<template>
  <van-collapse v-model="activeNames">
    <van-collapse-item title="补充更多信息，生成更精准的借口" name="context">
      <van-cell-group inset>
        <van-field v-model="form.myRole" label="我的身份" placeholder="如：普通员工" maxlength="50" />
        <van-field v-model="form.targetRole" label="对方身份" placeholder="如：直属领导" maxlength="50" />

        <van-cell title="关系亲密度">
          <van-slider v-model="form.closeness" :min="1" :max="5" :step="1" />
          <template #label>
            <span class="closeness-label">{{ closenessText }}</span>
          </template>
        </van-cell>

        <van-cell title="拒绝对象">
          <van-radio-group v-model="form.targetCount" direction="horizontal">
            <van-radio name="single">单人</van-radio>
            <van-radio name="multiple">多人</van-radio>
          </van-radio-group>
        </van-cell>

        <van-field v-model="form.time" label="时间" placeholder="如：今晚、下周六" maxlength="50" />
        <van-field v-model="form.place" label="地点" placeholder="如：公司、老家" maxlength="50" />

        <van-cell title="拒绝方式">
          <van-radio-group v-model="form.channel" direction="horizontal">
            <van-radio name="face">面对面</van-radio>
            <van-radio name="wechat">微信</van-radio>
            <van-radio name="phone">电话</van-radio>
          </van-radio-group>
        </van-cell>

        <van-cell title="语气偏好">
          <van-radio-group v-model="form.tone" direction="horizontal">
            <van-radio name="formal">正式</van-radio>
            <van-radio name="casual">日常</van-radio>
            <van-radio name="relaxed">轻松</van-radio>
          </van-radio-group>
        </van-cell>

        <van-field v-model="form.extra" label="补充" type="textarea" rows="2" placeholder="其他想补充的信息..." maxlength="50" />
      </van-cell-group>
    </van-collapse-item>
  </van-collapse>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { ExcuseContext } from '../types';

const activeNames = ref<string[]>([]);

const form = reactive<ExcuseContext>({
  myRole: '',
  targetRole: '',
  closeness: 3,
  targetCount: 'single',
  time: '',
  place: '',
  channel: 'wechat',
  tone: 'casual',
  extra: '',
});

const closenessLabels = ['', '陌生人', '一般认识', '普通朋友', '好朋友', '亲密关系'];
const closenessText = computed(() => `${form.closeness}/5 - ${closenessLabels[form.closeness || 3]}`);

function getContext(): ExcuseContext {
  // 只返回有值的字段
  const result: ExcuseContext = {};
  if (form.myRole) result.myRole = form.myRole;
  if (form.targetRole) result.targetRole = form.targetRole;
  if (form.closeness !== 3) result.closeness = form.closeness;
  if (form.targetCount) result.targetCount = form.targetCount;
  if (form.time) result.time = form.time;
  if (form.place) result.place = form.place;
  if (form.channel) result.channel = form.channel;
  if (form.tone) result.tone = form.tone;
  if (form.extra) result.extra = form.extra;
  return result;
}

function setContext(context: Partial<ExcuseContext>) {
  Object.assign(form, context);
  if (!activeNames.value.includes('context')) {
    activeNames.value.push('context');
  }
}

defineExpose({ getContext, setContext });
</script>

<style scoped>
.closeness-label {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 4: Create client/src/views/Home.vue**

首页视图，组合 PresetCards + ExcuseInput + ContextForm。

```vue
<template>
  <div class="home-page">
    <div class="home-header">
      <h1 class="app-title">ExcuseMe</h1>
      <p class="app-subtitle">帮你想个好借口</p>
    </div>

    <PresetCards @select="onPresetSelect" />

    <div class="home-form">
      <ExcuseInput ref="inputRef" :loading="excuseStore.loading" @submit="onSubmit" />
      <ContextForm ref="contextRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PresetCards from '../components/PresetCards.vue';
import ExcuseInput from '../components/ExcuseInput.vue';
import ContextForm from '../components/ContextForm.vue';
import { useExcuseStore } from '../stores/excuse';
import type { PresetItem } from '../types';

const router = useRouter();
const excuseStore = useExcuseStore();
const inputRef = ref<InstanceType<typeof ExcuseInput>>();
const contextRef = ref<InstanceType<typeof ContextForm>>();

function onPresetSelect(preset: PresetItem) {
  inputRef.value?.setContent(preset.content);
  if (preset.defaultContext) {
    contextRef.value?.setContext(preset.defaultContext);
  }
}

async function onSubmit(content: string) {
  const context = contextRef.value?.getContext();
  try {
    const result = await excuseStore.generate(content, context);
    router.push(`/result/${result.requestId}`);
  } catch {
    // error handled by API layer
  }
}
</script>

<style scoped>
.home-page { padding: 20px 16px; }
.home-header { text-align: center; padding: 20px 0; }
.app-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}
.app-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.home-form { margin-top: 16px; }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add client/src/components/PresetCards.vue client/src/components/ExcuseInput.vue client/src/components/ContextForm.vue client/src/views/Home.vue
git commit -m "feat: add Home page with preset cards, input, and context form"
```

---

### Task 13: Result Page Components

**Files:**
- Create: `client/src/components/StyleTag.vue`
- Create: `client/src/components/ExcuseCard.vue`
- Create: `client/src/components/ExcuseList.vue`
- Create: `client/src/components/LoadingAnimation.vue`
- Create: `client/src/views/Result.vue`

- [ ] **Step 1: Create client/src/components/StyleTag.vue**

```vue
<template>
  <span class="style-tag" :style="{ backgroundColor: config.color + '1a', color: config.color }">
    {{ config.icon }} {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { STYLE_CONFIG, type ExcuseStyle } from '../types';

const props = defineProps<{ style: ExcuseStyle }>();
const config = computed(() => STYLE_CONFIG[props.style] || STYLE_CONFIG.reasonable);
</script>

<style scoped>
.style-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
</style>
```

- [ ] **Step 2: Create client/src/components/LoadingAnimation.vue**

```vue
<template>
  <div class="loading-container">
    <van-loading size="32px" color="var(--color-primary)" />
    <p class="loading-text">{{ currentText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const texts = [
  '正在绞尽脑汁帮你想借口...',
  '搜索全网最好用的借口中...',
  '正在模拟对方的反应...',
  '精心打磨措辞中...',
  '马上就好，再等一下下...',
];

const currentText = ref(texts[0]);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  let i = 0;
  timer = setInterval(() => {
    i = (i + 1) % texts.length;
    currentText.value = texts[i];
  }, 2000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}
.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 3: Create client/src/components/ExcuseCard.vue**

单个借口卡片，包含风格标签、正文、使用建议和操作按钮。

```vue
<template>
  <div class="excuse-card">
    <StyleTag :style="excuse.style" />
    <p class="excuse-content">{{ excuse.content }}</p>
    <p class="excuse-tip">{{ excuse.tip }}</p>
    <div class="excuse-actions">
      <van-icon
        name="good-job-o"
        :class="{ active: excuse.liked === true }"
        @click="$emit('feedback', excuse.id, 'like')"
      />
      <van-icon
        name="good-job-o"
        class="dislike-icon"
        :class="{ active: excuse.liked === false }"
        @click="$emit('feedback', excuse.id, 'dislike')"
      />
      <van-icon name="description" @click="$emit('copy', excuse.content)" />
      <van-icon name="star-o" @click="$emit('favorite', excuse)" />
      <van-icon name="share-o" @click="$emit('share', excuse)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StyleTag from './StyleTag.vue';
import type { ExcuseItem } from '../types';

defineProps<{ excuse: ExcuseItem }>();
defineEmits<{
  feedback: [id: string, action: 'like' | 'dislike'];
  copy: [text: string];
  favorite: [excuse: ExcuseItem];
  share: [excuse: ExcuseItem];
}>();
</script>

<style scoped>
.excuse-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.excuse-content {
  font-size: 15px;
  line-height: 1.7;
  margin: 12px 0 8px;
  color: var(--color-text);
}
.excuse-tip {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}
.excuse-actions {
  display: flex;
  gap: 20px;
  font-size: 20px;
  color: var(--color-text-muted);
}
.excuse-actions .van-icon { cursor: pointer; transition: color 0.2s; }
.excuse-actions .van-icon:active { transform: scale(1.2); }
.excuse-actions .van-icon.active { color: var(--color-primary); }
.dislike-icon { transform: rotate(180deg); }
.dislike-icon.active { color: var(--color-reverse); }
</style>
```

- [ ] **Step 4: Create client/src/components/ExcuseList.vue**

```vue
<template>
  <div class="excuse-list">
    <transition-group name="card-fade">
      <ExcuseCard
        v-for="excuse in excuses"
        :key="excuse.id"
        :excuse="excuse"
        @feedback="(id: string, action: 'like' | 'dislike') => $emit('feedback', id, action)"
        @copy="(text: string) => $emit('copy', text)"
        @favorite="(excuse: ExcuseItem) => $emit('favorite', excuse)"
        @share="(excuse: ExcuseItem) => $emit('share', excuse)"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import ExcuseCard from './ExcuseCard.vue';
import type { ExcuseItem } from '../types';

defineProps<{ excuses: ExcuseItem[] }>();
defineEmits<{
  feedback: [id: string, action: 'like' | 'dislike'];
  copy: [text: string];
  favorite: [excuse: ExcuseItem];
  share: [excuse: ExcuseItem];
}>();
</script>

<style scoped>
.card-fade-enter-active { transition: all 0.4s ease; }
.card-fade-leave-active { transition: all 0.3s ease; }
.card-fade-enter-from { opacity: 0; transform: translateY(20px); }
.card-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
```

- [ ] **Step 5: Create client/src/views/Result.vue**

```vue
<template>
  <div class="result-page">
    <van-nav-bar title="生成结果" left-arrow @click-left="router.back()" />

    <LoadingAnimation v-if="excuseStore.loading" />

    <template v-else-if="excuseStore.excuses.length > 0">
      <ExcuseList
        :excuses="excuseStore.excuses"
        @feedback="onFeedback"
        @copy="onCopy"
        @favorite="onFavorite"
        @share="onShare"
      />

      <div class="result-actions">
        <van-button round plain type="primary" :loading="excuseStore.loading" @click="excuseStore.refresh()">
          换一批
        </van-button>
        <van-button round plain @click="router.push('/')">
          重新输入
        </van-button>
      </div>
    </template>

    <van-empty v-else description="暂无结果，请返回首页生成" />

    <!-- 分享图片浮层（Task 15 实现） -->
    <ShareImage
      v-if="shareExcuse"
      :excuse="shareExcuse"
      :input-content="excuseStore.inputContent"
      @close="shareExcuse = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingAnimation from '../components/LoadingAnimation.vue';
import ExcuseList from '../components/ExcuseList.vue';
import ShareImage from '../components/ShareImage.vue';
import { useExcuseStore } from '../stores/excuse';
import { useHistoryStore } from '../stores/history';
import { copyText } from '../utils/clipboard';
import { showToast } from 'vant';
import type { ExcuseItem } from '../types';

const router = useRouter();
const route = useRoute();
const excuseStore = useExcuseStore();
const historyStore = useHistoryStore();
const shareExcuse = ref<ExcuseItem | null>(null);

// 处理直接 URL 访问：如果 store 为空，从历史记录加载
onMounted(async () => {
  const requestId = route.params.requestId as string;
  if (excuseStore.excuses.length === 0 && requestId) {
    try {
      const res = await import('../api/history').then((m) => m.getHistory({ keyword: '' }));
      const found = res.data.list.find((item: any) => item.requestId === requestId);
      if (found) {
        excuseStore.requestId = found.requestId;
        excuseStore.excuses = found.results;
        excuseStore.inputContent = found.input.content;
        excuseStore.inputContext = found.input.context;
      }
    } catch {
      // 找不到记录，显示空状态
    }
  }
});

function onFeedback(id: string, action: 'like' | 'dislike') {
  excuseStore.feedback(id, action);
}

function onCopy(text: string) {
  copyText(text);
}

function onFavorite(excuse: ExcuseItem) {
  historyStore.addFavorite({
    excuseId: excuse.id,
    requestId: excuseStore.requestId,
    style: excuse.style,
    content: excuse.content,
    tip: excuse.tip,
    originalInput: excuseStore.inputContent,
  });
  showToast('已收藏');
}

function onShare(excuse: ExcuseItem) {
  shareExcuse.value = excuse;
}
</script>

<style scoped>
.result-page { padding: 0 16px 16px; }
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}
.result-actions .van-button { flex: 1; }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add client/src/components/StyleTag.vue client/src/components/ExcuseCard.vue client/src/components/ExcuseList.vue client/src/components/LoadingAnimation.vue client/src/views/Result.vue
git commit -m "feat: add Result page with excuse cards, loading animation, and interactions"
```

---

### Task 14: History & Favorites Pages

**Files:**
- Create: `client/src/views/History.vue`
- Create: `client/src/views/Favorites.vue`

- [ ] **Step 1: Create client/src/views/History.vue**

```vue
<template>
  <div class="history-page">
    <van-nav-bar title="历史记录" />

    <van-search v-model="keyword" placeholder="搜索历史记录" @search="onSearch" />

    <van-list
      v-model:loading="historyStore.loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div
        v-for="item in historyStore.historyList"
        :key="item.requestId"
        class="history-item"
        @click="onItemClick(item)"
      >
        <p class="history-input">{{ item.input.content }}</p>
        <p class="history-meta">
          {{ item.results.length }} 个借口 · {{ formatTime(item.createdAt) }}
        </p>
      </div>
    </van-list>

    <van-empty v-if="!historyStore.loading && historyStore.historyList.length === 0" description="还没有记录哦" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHistoryStore } from '../stores/history';
import { useExcuseStore } from '../stores/excuse';
import type { HistoryItem } from '../types';

const router = useRouter();
const historyStore = useHistoryStore();
const excuseStore = useExcuseStore();
const keyword = ref('');
const page = ref(1);
const finished = computed(() => historyStore.historyList.length >= historyStore.historyTotal);

onMounted(() => {
  page.value = 1;
  historyStore.fetchHistory(1);
});

function loadMore() {
  page.value++;
  historyStore.fetchHistory(page.value, keyword.value || undefined);
}

function onSearch() {
  page.value = 1;
  historyStore.fetchHistory(1, keyword.value || undefined);
}

function onItemClick(item: HistoryItem) {
  // 将历史记录的结果载入 store 并跳转
  excuseStore.requestId = item.requestId;
  excuseStore.excuses = item.results;
  excuseStore.inputContent = item.input.content;
  excuseStore.inputContext = item.input.context;
  router.push(`/result/${item.requestId}`);
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return date.toLocaleDateString('zh-CN');
}
</script>

<style scoped>
.history-page { padding: 0 0 16px; }
.history-item {
  padding: 14px 16px;
  background: var(--color-card);
  margin: 8px 16px;
  border-radius: 10px;
}
.history-input { font-size: 15px; color: var(--color-text); }
.history-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
}
</style>
```

- [ ] **Step 2: Create client/src/views/Favorites.vue**

```vue
<template>
  <div class="favorites-page">
    <van-nav-bar title="收藏夹" />

    <!-- 风格筛选 -->
    <div class="filter-bar">
      <van-tag
        v-for="(conf, key) in STYLE_CONFIG"
        :key="key"
        :type="selectedStyle === key ? 'primary' : 'default'"
        size="medium"
        round
        @click="toggleStyle(key as ExcuseStyle)"
      >
        {{ conf.icon }} {{ conf.label }}
      </van-tag>
    </div>

    <van-list
      v-model:loading="historyStore.loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div
        v-for="item in historyStore.favoriteList"
        :key="item._id"
        class="favorite-item"
      >
        <StyleTag :style="item.style" />
        <p class="fav-content">{{ item.content }}</p>
        <div class="fav-actions">
          <van-icon name="description" @click="copyText(item.content)" />
          <van-icon name="delete-o" @click="onRemove(item._id)" />
        </div>
      </div>
    </van-list>

    <van-empty v-if="!historyStore.loading && historyStore.favoriteList.length === 0" description="还没有收藏哦" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import StyleTag from '../components/StyleTag.vue';
import { useHistoryStore } from '../stores/history';
import { copyText } from '../utils/clipboard';
import { STYLE_CONFIG, type ExcuseStyle } from '../types';

const historyStore = useHistoryStore();
const selectedStyle = ref<ExcuseStyle | ''>('');
const page = ref(1);
const finished = computed(() => historyStore.favoriteList.length >= historyStore.favoriteTotal);

onMounted(() => {
  historyStore.fetchFavorites(1);
});

function toggleStyle(style: ExcuseStyle) {
  selectedStyle.value = selectedStyle.value === style ? '' : style;
  page.value = 1;
  historyStore.fetchFavorites(1, selectedStyle.value || undefined);
}

function loadMore() {
  page.value++;
  historyStore.fetchFavorites(page.value, selectedStyle.value || undefined);
}

function onRemove(id: string) {
  historyStore.removeFavorite(id);
}
</script>

<style scoped>
.favorites-page { padding: 0 0 16px; }
.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  white-space: nowrap;
}
.favorite-item {
  padding: 14px 16px;
  background: var(--color-card);
  margin: 8px 16px;
  border-radius: 10px;
}
.fav-content {
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
}
.fav-actions {
  display: flex;
  gap: 16px;
  font-size: 18px;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add client/src/views/History.vue client/src/views/Favorites.vue
git commit -m "feat: add History and Favorites pages with search and filter"
```

---

## Chunk 5: Share Feature & Final Integration

### Task 15: Share Image Components

**Files:**
- Create: `client/src/components/QrCode.vue`
- Create: `client/src/components/ShareImage.vue`
- Create: `client/src/utils/shareImage.ts`

- [ ] **Step 1: Install share dependencies**

```bash
cd C:\Users\22719\Desktop\project-excuse\client
npm install html2canvas qrcode.vue
```

- [ ] **Step 2: Create client/src/utils/shareImage.ts**

```typescript
import html2canvas from 'html2canvas';

export async function captureElement(el: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, 'image/png');
  });
}

export async function shareImage(blob: Blob, title: string): Promise<void> {
  const file = new File([blob], 'excuse.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title, files: [file] });
  } else {
    // 降级：下载图片
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'excuse.png';
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

- [ ] **Step 3: Create client/src/components/QrCode.vue**

```vue
<template>
  <div class="qr-code">
    <QrcodeVue :value="url" :size="80" level="M" />
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

defineProps<{ url?: string }>();
</script>

<style scoped>
.qr-code { display: inline-block; }
</style>
```

- [ ] **Step 4: Create client/src/components/ShareImage.vue**

分享图片预览浮层 + 截图生成。

```vue
<template>
  <van-overlay :show="true" @click="$emit('close')">
    <div class="share-wrapper" @click.stop>
      <!-- 被截图的卡片 -->
      <div ref="cardRef" class="share-card" :style="{ background: bgGradient }">
        <div class="share-brand">ExcuseMe 借口生成器</div>
        <div class="share-divider" />
        <StyleTag :style="excuse.style" />
        <p class="share-content">{{ excuse.content }}</p>
        <p class="share-tip">{{ excuse.tip }}</p>
        <div class="share-divider" />
        <div class="share-footer">
          <span>扫码生成你的借口</span>
          <QrCode :url="shareUrl" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="share-actions">
        <van-button round block type="primary" :loading="saving" @click="onSave">
          保存/分享图片
        </van-button>
        <van-button round block plain @click="$emit('close')">关闭</van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { showToast } from 'vant';
import StyleTag from './StyleTag.vue';
import QrCode from './QrCode.vue';
import { captureElement, shareImage } from '../utils/shareImage';
import { STYLE_CONFIG, type ExcuseItem } from '../types';

const props = defineProps<{
  excuse: ExcuseItem;
  inputContent: string;
}>();
defineEmits<{ close: [] }>();

const cardRef = ref<HTMLElement>();
const saving = ref(false);

const shareUrl = computed(() => window.location.origin);
const bgGradient = computed(() => {
  const color = STYLE_CONFIG[props.excuse.style]?.color || '#6366f1';
  return `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`;
});

async function onSave() {
  if (!cardRef.value) return;
  saving.value = true;
  try {
    const blob = await captureElement(cardRef.value);
    await shareImage(blob, 'ExcuseMe 借口');
    showToast('操作成功');
  } catch {
    showToast('操作失败，请长按图片保存');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.share-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  justify-content: center;
}
.share-card {
  width: 335px;
  padding: 24px 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.share-brand {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  text-align: center;
}
.share-divider {
  height: 1px;
  background: var(--color-border);
  margin: 14px 0;
}
.share-content {
  font-size: 15px;
  line-height: 1.8;
  margin: 12px 0 8px;
  color: var(--color-text);
}
.share-tip {
  font-size: 12px;
  color: var(--color-text-muted);
}
.share-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.share-actions {
  margin-top: 20px;
  width: 335px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add client/src/utils/shareImage.ts client/src/components/QrCode.vue client/src/components/ShareImage.vue
git commit -m "feat: add share image feature with html2canvas and QR code"
```

---

### Task 16: Root Config & .gitignore

**Files:**
- Create: `.gitignore`（更新）
- Verify: 整体项目结构

- [ ] **Step 1: Update .gitignore**

```
node_modules/
dist/
.env
*.log
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Verify the full project compiles**

```bash
# 服务端编译检查
cd C:\Users\22719\Desktop\project-excuse\server
npx tsc --noEmit

# 客户端编译检查
cd C:\Users\22719\Desktop\project-excuse\client
npx vue-tsc --noEmit
```

Expected: 无 TypeScript 编译错误

- [ ] **Step 3: Verify dev servers start**

```bash
# Terminal 1: 启动后端
cd C:\Users\22719\Desktop\project-excuse\server
npm run dev

# Terminal 2: 启动前端
cd C:\Users\22719\Desktop\project-excuse\client
npm run dev
```

Expected: 后端运行在 http://localhost:3000，前端运行在 http://localhost:5173

- [ ] **Step 4: Final commit**

```bash
git add .gitignore
git commit -m "feat: update gitignore and complete project scaffolding"
```

---

## Task Summary

| Chunk | Task | Description | Key Files |
|-------|------|-------------|-----------|
| 1 | Task 1 | 初始化 Server 项目 | package.json, tsconfig, types, config |
| 1 | Task 2 | Express App + 中间件 | app.ts, index.ts, errorHandler, rateLimiter |
| 1 | Task 3 | MongoDB 数据模型 | excuse.model, favorite.model, preset.model |
| 2 | Task 4 | 提示词组装服务 | prompt.service.ts |
| 2 | Task 5 | AI API 调用服务 | ai.service.ts |
| 2 | Task 6 | 借口业务逻辑 | excuse.service.ts |
| 2 | Task 7 | Controllers + Routes | 4 controllers + 4 routes + presets.json |
| 3 | Task 8 | 初始化 Client 项目 | vite.config, index.html |
| 3 | Task 9 | 前端类型/样式/工具 | types, styles, session, clipboard |
| 3 | Task 10 | Router + API + Stores | router, api/*, stores/* |
| 4 | Task 11 | App Shell + 底部导航 | App.vue, BottomNav.vue |
| 4 | Task 12 | 首页组件 | PresetCards, ExcuseInput, ContextForm, Home.vue |
| 4 | Task 13 | 结果页组件 | StyleTag, ExcuseCard, ExcuseList, Loading, Result.vue |
| 4 | Task 14 | 历史 + 收藏页 | History.vue, Favorites.vue |
| 5 | Task 15 | 分享图片功能 | ShareImage, QrCode, shareImage.ts |
| 5 | Task 16 | 最终集成验证 | .gitignore, 编译验证 |

---

## v1.1 Deferred Items

以下功能在 v1 基础版本完成后作为增强迭代实现：

| Feature | Description | Complexity |
|---------|-------------|------------|
| SSE 流式输出 | 后端 `ai.service.ts` 使用 `stream: true`，通过 SSE 推送给前端，前端逐个渲染借口卡片 | 高 |
| 微调输入 | 在 Result 页面嵌入 ContextForm，支持不离开结果页修改补充信息后重新生成 | 中 |
| favicon.ico | 设计并添加应用图标 | 低 |
