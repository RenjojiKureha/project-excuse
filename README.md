# ExcuseMe - 借口生成器

帮助不擅长拒绝的你，在各类社交场合中快速生成得体、自然的借口。输入"想拒绝的事"，AI 即刻生成 6 种风格的借口供你选择。

## 功能特性

- **6 种借口风格** — 合情合理、委婉温和、幽默搞笑、直接干脆、离谱夸张、反客为主
- **8 个预设场景** — 拒绝聚餐、加班、借钱、帮忙、约会、送礼、活动、推销，一键快速生成
- **情景补充** — 可选填身份关系、亲密度、沟通方式等，让借口更贴合实际
- **换一批** — 不满意？基于点赞/点踩反馈重新生成更合适的借口
- **收藏与历史** — 收藏好用的借口，随时查看历史记录
- **分享图片** — 一键生成分享卡片，支持保存或原生分享
- **免登录使用** — 基于 sessionId 自动隔离数据，无需注册

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + TypeScript + Vite + Vant |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | MongoDB + Mongoose |
| AI | 兼容 OpenAI 接口的大语言模型 |
| 部署 | Docker + Nginx |

## 快速开始

### 前置条件

- Node.js >= 18
- MongoDB（本地或远程）
- 兼容 OpenAI 接口的 API Key

### 1. 配置环境变量

```bash
cp server/.env.example server/.env
```

编辑 `server/.env`：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/excuse-generator
AI_API_KEY=your-api-key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o
```

### 2. 启动后端

```bash
cd server
npm install
npm run dev
```

### 3. 启动前端（新终端）

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，后端运行在 `http://localhost:3000`。

### Docker 一键部署

```bash
# 编辑根目录 .env 文件配置 AI_API_KEY 等变量
docker-compose up -d
```

启动后访问 `http://localhost` 即可使用。详见 [DOCKER.md](./DOCKER.md)。

## 项目结构

```
project-excuse/
├── client/                  # 前端 Vue3 应用
│   ├── src/
│   │   ├── views/           # 页面：首页、结果页、历史、收藏
│   │   ├── components/      # 组件：借口卡片、输入框、分享图片等
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── api/             # Axios 接口封装
│   │   └── utils/           # 工具函数
│   ├── Dockerfile
│   └── nginx.conf
├── server/                  # 后端 Express 应用
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑（AI 调用、提示词构建）
│   │   ├── models/          # Mongoose 数据模型
│   │   └── middlewares/     # 限流、错误处理
│   └── Dockerfile
├── docs/                    # 项目文档
├── docker-compose.yml
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/excuse/generate` | 生成借口（6 种风格） |
| POST | `/api/excuse/refresh` | 换一批（基于反馈重新生成） |
| POST | `/api/excuse/feedback` | 点赞/点踩 |
| GET | `/api/history` | 获取历史记录 |
| DELETE | `/api/history/:id` | 删除历史记录 |
| POST | `/api/favorite` | 添加收藏 |
| GET | `/api/favorite` | 获取收藏列表 |
| DELETE | `/api/favorite/:id` | 取消收藏 |
| GET | `/api/presets` | 获取预设场景 |
| GET | `/api/health` | 健康检查 |

## 文档

- [产品需求文档](./docs/product-requirements.md)
- [技术设计文档](./docs/tech-design.md)
- [提示词设计文档](./docs/prompt-design.md)
- [项目结构](./docs/project-structure.md)
- [Docker 部署指南](./DOCKER.md)

## License

MIT
