import { Request, Response, NextFunction } from 'express';
import { ExcuseModel } from '../models/excuse.model';
import { createError } from '../middlewares/errorHandler';

export async function deleteHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw createError(400, 'sessionId 为必填项');

    await ExcuseModel.deleteOne({ _id: id, sessionId });
    res.json({ code: 200, message: 'ok' });
  } catch (err) {
    next(err);
  }
}

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
