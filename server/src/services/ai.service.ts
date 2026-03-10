import OpenAI from 'openai';
import { config } from '../config';
import { AIResponse } from '../types';
import { getSystemPrompt } from './prompt.service';

const client = new OpenAI({
  apiKey: config.ai.apiKey,
  baseURL: config.ai.baseUrl,
});

export interface AICallResult {
  data: AIResponse;
  promptTokens: number;
  completionTokens: number;
}

export async function callAI(userPrompt: string): Promise<AICallResult> {
  const response = await client.chat.completions.create({
    model: config.ai.model,
    messages: [
      { role: 'system', content: getSystemPrompt() },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.9,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '';
  const parsed = parseAIResponse(raw);

  return {
    data: parsed,
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
  };
}

function parseAIResponse(raw: string): AIResponse {
  // 尝试直接解析
  try {
    const json = JSON.parse(raw);
    if (json.excuses && Array.isArray(json.excuses)) {
      return filterUnsafeContent(json as AIResponse);
    }
  } catch {
    // 尝试从文本中提取 JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const json = JSON.parse(match[0]);
        if (json.excuses && Array.isArray(json.excuses)) {
          return filterUnsafeContent(json as AIResponse);
        }
      } catch {
        // fall through to fallback
      }
    }
  }

  // 兜底：返回默认响应
  return {
    excuses: [{
      style: 'reasonable',
      content: '抱歉，AI 暂时无法生成借口，请稍后重试。',
      tip: '可以点击"换一批"重新生成',
    }],
  };
}

// 内容安全过滤
const UNSAFE_KEYWORDS = ['自杀', '自残', '暴力', '杀人', '毒品', '赌博'];

function filterUnsafeContent(response: AIResponse): AIResponse {
  response.excuses = response.excuses.map((excuse) => {
    const hasUnsafe = UNSAFE_KEYWORDS.some((kw) => excuse.content.includes(kw));
    if (hasUnsafe) {
      return {
        ...excuse,
        content: '该借口不适合展示，请换一批',
        tip: '点击"换一批"重新生成',
      };
    }
    return excuse;
  });
  return response;
}
