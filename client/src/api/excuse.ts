import request from './request';
import type { ExcuseContext, GenerateResult, ExcuseItem } from '../types';

export function generateExcuses(content: string, context?: ExcuseContext) {
  return request.post<any, { code: number; data: GenerateResult }>('/excuse/generate', {
    content,
    context,
  });
}

export function refreshExcuses(requestId: string, feedback: {
  likedStyles: string[];
  dislikedStyles: string[];
  likedIds: string[];
  dislikedIds: string[];
}) {
  return request.post<any, { code: number; data: GenerateResult }>('/excuse/refresh', {
    requestId,
    feedback,
  });
}

export function feedbackExcuse(excuseId: string, requestId: string, action: 'like' | 'dislike') {
  return request.post('/excuse/feedback', { excuseId, requestId, action });
}
