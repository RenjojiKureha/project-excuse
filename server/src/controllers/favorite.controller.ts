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
