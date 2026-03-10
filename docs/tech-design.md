# 技术设计文档

## 一、整体架构

```
┌─────────────────────────────────────────────────┐
│                   客户端 (Vue3)                  │
│  Vite + Vue3 + TypeScript + Pinia + Vue Router  │
│            UI: Vant（移动端组件库）                │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────┐
│              服务端 (Node.js + Express)           │
│           TypeScript + Mongoose + dotenv         │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ excuse API │  │ history API│  │ preset API │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
│        │               │               │        │
│        ▼               ▼               ▼        │
│  ┌─────────────────────────────────────────────┐ │
│  │              AI Service Layer               │ │
│  │    (OpenAI 兼容接口, 提示词组装, 解析响应)     │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    MongoDB      │
              └─────────────────┘
```

## 二、API 设计

### 2.1 借口生成

```
POST /api/excuse/generate
```

请求体：
```json
{
  "content": "同事约我周末去爬山",
  "context": {
    "myRole": "普通员工",
    "targetRole": "同事",
    "closeness": 3,
    "targetCount": "single",
    "time": "周末",
    "place": "",
    "channel": "wechat",
    "tone": "casual",
    "extra": "上次已经拒绝过一次了"
  },
  "preferredStyles": ["reasonable", "gentle"]
}
```

响应体：
```json
{
  "code": 200,
  "data": {
    "requestId": "req_abc123",
    "excuses": [
      {
        "id": "exc_001",
        "style": "reasonable",
        "styleLabel": "合情合理",
        "content": "不好意思，这周末我答应陪家里人去医院做体检...",
        "tip": "语气自然一些，不用解释太多细节",
        "liked": null
      }
    ]
  }
}
```

### 2.2 换一批

```
POST /api/excuse/refresh
```

请求体：
```json
{
  "requestId": "req_abc123",
  "feedback": {
    "likedStyles": ["reasonable"],
    "dislikedStyles": ["extreme"],
    "likedIds": ["exc_001"],
    "dislikedIds": ["exc_005"]
  }
}
```

### 2.3 反馈（点赞/点踩）

```
POST /api/excuse/feedback
```

请求体：
```json
{
  "excuseId": "exc_001",
  "requestId": "req_abc123",
  "action": "like"
}
```

### 2.4 历史记录

```
GET /api/history?page=1&pageSize=20&keyword=爬山
```

### 2.5 收藏

```
POST   /api/favorite         — 收藏
DELETE /api/favorite/:id      — 取消收藏
GET    /api/favorite?style=reasonable&page=1&pageSize=20  — 收藏列表
```

### 2.6 预设场景

```
GET /api/presets
```

响应体：
```json
{
  "code": 200,
  "data": [
    {
      "id": "preset_001",
      "name": "拒绝聚餐",
      "icon": "🍽️",
      "content": "有人约我去吃饭/聚餐",
      "defaultContext": {
        "channel": "wechat",
        "tone": "casual"
      }
    }
  ]
}
```

---

## 三、数据库设计 (MongoDB)

### 3.1 excuses — 生成记录

```javascript
{
  _id: ObjectId,
  requestId: String,          // 请求唯一标识
  sessionId: String,          // 匿名用户会话标识（v1 无登录）
  input: {
    content: String,           // 用户输入的拒绝事项
    context: {
      myRole: String,
      targetRole: String,
      closeness: Number,       // 1-5
      targetCount: String,     // "single" | "multiple"
      time: String,
      place: String,
      channel: String,         // "face" | "wechat" | "phone"
      tone: String,            // "formal" | "casual" | "relaxed"
      extra: String
    }
  },
  results: [{
    excuseId: String,
    style: String,             // "reasonable" | "gentle" | "humorous" | "direct" | "extreme" | "reverse"
    content: String,           // 借口正文
    tip: String,               // 使用建议
    liked: Boolean | null      // true=赞, false=踩, null=未操作
  }],
  promptTokens: Number,        // token 用量统计
  completionTokens: Number,
  createdAt: Date
}
```

### 3.2 favorites — 收藏

```javascript
{
  _id: ObjectId,
  sessionId: String,
  excuseId: String,            // 关联 excuses.results.excuseId
  requestId: String,           // 关联 excuses.requestId
  style: String,
  content: String,             // 冗余存储，避免关联查询
  originalInput: String,       // 原始输入，方便回忆场景
  createdAt: Date
}
```

### 3.3 presets — 预设场景

```javascript
{
  _id: ObjectId,
  name: String,
  icon: String,
  content: String,
  defaultContext: Object,
  sortOrder: Number,
  enabled: Boolean
}
```

### 3.4 索引建议

```javascript
// excuses
db.excuses.createIndex({ sessionId: 1, createdAt: -1 })
db.excuses.createIndex({ requestId: 1 }, { unique: true })

// favorites
db.favorites.createIndex({ sessionId: 1, createdAt: -1 })
db.favorites.createIndex({ sessionId: 1, excuseId: 1 }, { unique: true })
```

---

## 四、关键技术要点

### 4.1 会话管理（v1 无登录）

- 首次访问时生成 UUID 作为 sessionId，存储在 localStorage
- 所有请求携带 sessionId 用于关联数据
- 后续迭代可升级为用户登录系统

### 4.2 流式响应

- AI 生成借口时使用 SSE（Server-Sent Events）实现流式输出
- 后端通过 AI SDK 的 stream 模式获取数据，逐步推送给前端
- 前端逐步渲染借口卡片，提升体验

### 4.3 请求限流

- 基于 sessionId 做频率限制
- 建议：每分钟最多 5 次生成请求
- 使用 express-rate-limit 中间件

### 4.4 AI 响应解析

- 要求 AI 返回 JSON 格式（而非 markdown），便于前端直接解析
- 后端做 JSON 校验和兜底处理，确保格式异常时不崩溃
- 对 AI 返回内容做基础的内容安全过滤

### 4.5 分享图片生成

- 前端使用 html2canvas 将借口卡片渲染为图片
- 流程：构建隐藏的分享卡片 DOM → html2canvas 截图 → 生成 Blob → 预览/保存
- 二维码使用 qrcode 库（如 qrcode.vue）在前端动态生成
- v1 阶段二维码链接统一指向首页，预留 URL 参数位，后续可传入推广追踪参数
- 调用 `navigator.share()` 实现原生分享，不支持时降级提示长按保存图片
- 图片生成在前端完成，不需要后端接口

### 4.6 移动端适配

- 使用 postcss-px-to-viewport 或 amfe-flexible + postcss-pxtorem 做移动端适配
- UI 组件库选择 Vant（Vue3 移动端组件库），不使用 Element Plus / Naive UI
- 视口 meta 标签设置 `width=device-width, initial-scale=1, maximum-scale=1`
- CSS 使用 vw/rem 单位，设计稿基准宽度 375px

### 4.7 环境变量

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/excuse-generator
AI_API_KEY=your-api-key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o
```
