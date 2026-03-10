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
