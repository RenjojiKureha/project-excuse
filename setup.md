# 借口生成器 (ExcuseMe)

## 技术栈

前端：Vue3 + TypeScript + Vite
后端：Node.js + Express + TypeScript
数据库：MongoDB + Mongoose
AI：兼容 OpenAI 接口的大语言模型

## 项目定位

帮助不擅长拒绝的用户，在各类社交场合中快速生成得体、自然的借口。
用户只需描述"想拒绝的事"，系统就能生成多种风格的借口供选择。

## 核心流程

```
用户输入想拒绝的事
       ↓
补充情景信息（可选）
       ↓
选择借口风格偏好（可选）
       ↓
系统组装优化提示词
       ↓
调用 AI 接口生成借口
       ↓
解析并展示多风格借口
       ↓
用户点赞/点踩/换一批/收藏
```

## 文档索引

- [产品需求文档](./docs/product-requirements.md) — 功能设计与用户体验
- [技术设计文档](./docs/tech-design.md) — 架构、API、数据库设计
- [提示词设计文档](./docs/prompt-design.md) — AI 提示词工程策略
- [项目结构](./docs/project-structure.md) — 前后端目录结构
