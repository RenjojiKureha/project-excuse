# 项目目录结构

```
project-excuse/
├── setup.md                        # 项目总览
├── docs/                           # 文档
│   ├── product-requirements.md
│   ├── tech-design.md
│   ├── prompt-design.md
│   └── project-structure.md
│
├── client/                         # 前端 (Vue3)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── main.ts                 # 入口
│       ├── App.vue                 # 根组件
│       ├── router/
│       │   └── index.ts            # 路由配置
│       ├── stores/
│       │   ├── excuse.ts           # 借口生成相关状态
│       │   └── history.ts          # 历史记录相关状态
│       ├── api/
│       │   ├── request.ts          # Axios 封装
│       │   ├── excuse.ts           # 借口相关接口
│       │   └── history.ts          # 历史相关接口
│       ├── views/
│       │   ├── Home.vue            # 首页（输入页）
│       │   ├── Result.vue          # 结果展示页
│       │   ├── History.vue         # 历史记录页
│       │   └── Favorites.vue       # 收藏页
│       ├── components/
│       │   ├── ExcuseInput.vue     # 主输入组件
│       │   ├── ContextForm.vue     # 补充信息表单
│       │   ├── PresetCards.vue     # 预设场景快捷卡片
│       │   ├── ExcuseCard.vue      # 单个借口卡片
│       │   ├── ExcuseList.vue      # 借口列表
│       │   ├── StyleTag.vue        # 风格标签
│       │   ├── ShareImage.vue      # 分享图片生成与预览浮层
│       │   ├── QrCode.vue          # 二维码组件（封装 qrcode 库）
│       │   ├── BottomNav.vue       # 底部导航栏
│       │   └── LoadingAnimation.vue # 生成等待动画
│       ├── types/
│       │   └── index.ts            # TypeScript 类型定义
│       ├── utils/
│       │   ├── session.ts          # sessionId 管理
│       │   ├── clipboard.ts        # 复制功能
│       │   └── shareImage.ts       # html2canvas 截图 + 原生分享封装
│       └── styles/
│           ├── variables.css       # CSS 变量 / 主题色
│           └── global.css          # 全局样式
│
├── server/                         # 后端 (Express + TS)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                        # 环境变量（不提交 git）
│   ├── .env.example                # 环境变量示例
│   └── src/
│       ├── index.ts                # 入口，启动服务
│       ├── app.ts                  # Express 应用配置
│       ├── config/
│       │   └── index.ts            # 配置读取
│       ├── routes/
│       │   ├── excuse.ts           # 借口相关路由
│       │   ├── history.ts          # 历史记录路由
│       │   ├── favorite.ts         # 收藏路由
│       │   └── preset.ts           # 预设场景路由
│       ├── controllers/
│       │   ├── excuse.controller.ts
│       │   ├── history.controller.ts
│       │   ├── favorite.controller.ts
│       │   └── preset.controller.ts
│       ├── services/
│       │   ├── ai.service.ts       # AI 接口调用与提示词组装
│       │   ├── excuse.service.ts   # 借口业务逻辑
│       │   └── prompt.service.ts   # 提示词构建
│       ├── models/
│       │   ├── excuse.model.ts     # Mongoose 模型
│       │   ├── favorite.model.ts
│       │   └── preset.model.ts
│       ├── middlewares/
│       │   ├── rateLimiter.ts      # 请求限流
│       │   └── errorHandler.ts     # 全局错误处理
│       └── types/
│           └── index.ts            # 类型定义
│
└── .gitignore
```

## 前端页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页，输入想拒绝的事 |
| `/result/:requestId` | Result.vue | 结果展示页 |
| `/history` | History.vue | 历史记录列表 |
| `/favorites` | Favorites.vue | 收藏夹 |
