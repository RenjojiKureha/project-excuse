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
