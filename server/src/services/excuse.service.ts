import { v4 as uuidv4 } from 'uuid';
import { ExcuseModel } from '../models/excuse.model';
import { callAI } from './ai.service';
import { buildUserPrompt, buildRefreshSuffix } from './prompt.service';
import {
  GenerateRequest, RefreshRequest, FeedbackRequest,
  ExcuseItem, STYLE_MAP, ExcuseStyle,
} from '../types';

export async function generateExcuses(req: GenerateRequest): Promise<{
  requestId: string;
  excuses: ExcuseItem[];
}> {
  const userPrompt = buildUserPrompt(req.content, req.context);
  const { data, promptTokens, completionTokens } = await callAI(userPrompt);

  const requestId = `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  const excuses: ExcuseItem[] = data.excuses.map((item, index) => {
    const style = item.style as ExcuseStyle;
    return {
      excuseId: `exc_${uuidv4().replace(/-/g, '').slice(0, 8)}`,
      style,
      styleLabel: STYLE_MAP[style] || item.style,
      content: item.content,
      tip: item.tip,
      liked: null,
    };
  });

  // 存储到数据库
  await ExcuseModel.create({
    requestId,
    sessionId: req.sessionId,
    input: {
      content: req.content,
      context: req.context || {},
    },
    results: excuses.map((e) => ({
      excuseId: e.excuseId,
      style: e.style,
      content: e.content,
      tip: e.tip,
      liked: null,
    })),
    promptTokens,
    completionTokens,
  });

  return { requestId, excuses };
}

export async function refreshExcuses(req: RefreshRequest): Promise<{
  requestId: string;
  excuses: ExcuseItem[];
}> {
  // 查找原始请求
  const original = await ExcuseModel.findOne({ requestId: req.requestId });
  if (!original) {
    throw Object.assign(new Error('原始请求不存在'), { statusCode: 404 });
  }

  // 获取用户点赞的内容
  const likedContents = original.results
    .filter((r) => req.feedback.likedIds.includes(r.excuseId))
    .map((r) => r.content);

  // 重新组装 prompt
  const userPrompt = buildUserPrompt(original.input.content, original.input.context as any)
    + buildRefreshSuffix({
      likedStyles: req.feedback.likedStyles,
      dislikedStyles: req.feedback.dislikedStyles,
      likedContents,
    });

  const { data, promptTokens, completionTokens } = await callAI(userPrompt);

  const newRequestId = `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  const excuses: ExcuseItem[] = data.excuses.map((item) => {
    const style = item.style as ExcuseStyle;
    return {
      excuseId: `exc_${uuidv4().replace(/-/g, '').slice(0, 8)}`,
      style,
      styleLabel: STYLE_MAP[style] || item.style,
      content: item.content,
      tip: item.tip,
      liked: null,
    };
  });

  // 存储新记录
  await ExcuseModel.create({
    requestId: newRequestId,
    sessionId: req.sessionId,
    input: original.input,
    results: excuses.map((e) => ({
      excuseId: e.excuseId,
      style: e.style,
      content: e.content,
      tip: e.tip,
      liked: null,
    })),
    promptTokens,
    completionTokens,
  });

  return { requestId: newRequestId, excuses };
}

export async function feedbackExcuse(req: FeedbackRequest): Promise<void> {
  const liked = req.action === 'like' ? true : false;
  await ExcuseModel.updateOne(
    { requestId: req.requestId, 'results.excuseId': req.excuseId },
    { $set: { 'results.$.liked': liked } },
  );
}
