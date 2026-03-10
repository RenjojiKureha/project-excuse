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
