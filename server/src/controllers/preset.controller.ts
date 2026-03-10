import { Request, Response, NextFunction } from 'express';
import { PresetModel } from '../models/preset.model';

export async function getPresets(_req: Request, res: Response, next: NextFunction) {
  try {
    const presets = await PresetModel.find({ enabled: true })
      .sort({ sortOrder: 1 })
      .lean();
    res.json({ code: 200, data: presets });
  } catch (err) {
    next(err);
  }
}
