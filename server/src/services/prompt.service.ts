import { ExcuseContext } from '../types';

const SYSTEM_PROMPT = `你是一个社交借口生成助手。用户会告诉你一件想拒绝的事，你需要帮用户生成多个不同风格的借口。

## 你的任务
根据用户描述的场景，生成 6 个不同风格的拒绝借口。每个借口应该自然、可信，并且考虑到具体的社交情境。

## 风格要求
你必须生成以下 6 种风格的借口，每种一个：
1. reasonable（合情合理）— 最自然安全的理由，难以被质疑
2. gentle（委婉温和）— 照顾对方感受，维护关系
3. humorous（幽默搞笑）— 用幽默化解尴尬
4. direct（直接干脆）— 简洁明了地表达拒绝
5. extreme（离谱夸张）— 戏剧化的小概率事件理由，趣味性强
6. reverse（反客为主）— 反提一个更麻烦的请求，让对方主动放弃

## 输出格式
你必须严格返回以下 JSON 格式，不要包含任何其他文本：

{
  "excuses": [
    {
      "style": "reasonable",
      "content": "具体的借口话术，包含完整的对话内容",
      "tip": "一句话使用建议"
    }
  ]
}

## 注意事项
- content 中要写出完整的话术，用户可以直接复制使用
- 根据拒绝方式（面对面/微信/电话）调整话术的口语化程度
- 根据关系亲密度调整措辞的正式程度
- tip 中给出简短的使用提示，如注意事项或配合动作
- 不要生成可能伤害他人或涉及违法内容的借口`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(content: string, context?: ExcuseContext): string {
  const lines: string[] = [`我想拒绝的事：${content}`];

  if (!context) return lines.join('\n');

  const optional: string[] = [];

  if (context.myRole) optional.push(`我的身份：${context.myRole}`);
  if (context.targetRole) optional.push(`对方的身份：${context.targetRole}`);
  if (context.closeness) optional.push(`我和对方的关系亲密度：${context.closeness}/5（1为陌生人，5为很亲密）`);
  if (context.targetCount) {
    optional.push(`拒绝对象：${context.targetCount === 'single' ? '单个人' : '一群人'}`);
  }
  if (context.time) optional.push(`时间：${context.time}`);
  if (context.place) optional.push(`地点：${context.place}`);
  if (context.channel) {
    const channelMap: Record<string, string> = { face: '面对面', wechat: '微信文字消息', phone: '电话' };
    optional.push(`拒绝方式：${channelMap[context.channel] || context.channel}`);
  }
  if (context.tone) {
    const toneMap: Record<string, string> = { formal: '正式一些', casual: '日常随意', relaxed: '轻松幽默' };
    optional.push(`我希望的语气：${toneMap[context.tone] || context.tone}`);
  }
  if (context.extra) optional.push(`补充信息：${context.extra}`);

  if (optional.length > 0) {
    lines.push('', ...optional);
  }

  return lines.join('\n');
}

export function buildRefreshSuffix(feedback: {
  likedStyles: string[];
  dislikedStyles: string[];
  likedContents?: string[];
}): string {
  const lines: string[] = [
    '',
    '## 用户反馈',
    '用户对上一批借口的反馈如下，请据此调整生成方向：',
  ];

  if (feedback.likedStyles.length > 0) {
    lines.push(`- 用户喜欢的风格：${feedback.likedStyles.join('、')}`);
  }
  if (feedback.dislikedStyles.length > 0) {
    lines.push(`- 用户不喜欢的风格：${feedback.dislikedStyles.join('、')}`);
  }
  if (feedback.likedContents && feedback.likedContents.length > 0) {
    lines.push(`- 用户点赞的借口内容：${feedback.likedContents.join('；')}`);
  }

  lines.push('', '请生成一批新的借口，多侧重用户喜欢的方向，避免用户不喜欢的方向。不要重复之前生成过的借口。');

  return lines.join('\n');
}
