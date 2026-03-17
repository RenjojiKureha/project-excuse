# Docker 部署指南

## 快速开始

1. 复制环境变量文件：
```bash
cp .env
```

2. 编辑 `.env` 文件，填入你的 AI API KEY

3. 启动所有服务：
```bash
docker-compose up -d
```

4. 访问应用：
- 前端：http://localhost
- 后端 API：http://localhost:3000

## 常用命令

启动服务：
```bash
docker-compose up -d
```

停止服务：
```bash
docker-compose down
```

查看日志：
```bash
docker-compose logs -f
```

重启服务：
```bash
docker-compose restart
```

重新构建：
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 服务说明

- **mongodb**: MongoDB 数据库 (端口 27017)
- **server**: Node.js 后端服务 (端口 3000)
- **client**: Vue3 前端服务 (端口 80)

## 环境变量

在 `.env` 文件中配置以下变量：
- `AI_API_KEY`: AI API 密钥（必填）
- `AI_API_BASE_URL`: AI API 基础URL（可选，默认：https://api.openai.com/v1）
- `AI_MODEL`: AI 模型（可选，默认：gpt-4o）