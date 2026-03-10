import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ExcuseItem, ExcuseContext } from '../types';
import * as excuseApi from '../api/excuse';

export const useExcuseStore = defineStore('excuse', () => {
  const loading = ref(false);
  const requestId = ref('');
  const excuses = ref<ExcuseItem[]>([]);
  const inputContent = ref('');
  const inputContext = ref<ExcuseContext>({});

  async function generate(content: string, context?: ExcuseContext) {
    loading.value = true;
    inputContent.value = content;
    inputContext.value = context || {};
    try {
      const res = await excuseApi.generateExcuses(content, context);
      requestId.value = res.data.requestId;
      excuses.value = res.data.excuses;
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  async function refresh() {
    if (!requestId.value) return;
    loading.value = true;
    try {
      const liked = excuses.value.filter((e) => e.liked === true);
      const disliked = excuses.value.filter((e) => e.liked === false);
      const res = await excuseApi.refreshExcuses(requestId.value, {
        likedStyles: liked.map((e) => e.style),
        dislikedStyles: disliked.map((e) => e.style),
        likedIds: liked.map((e) => e.excuseId),
        dislikedIds: disliked.map((e) => e.excuseId),
      });
      requestId.value = res.data.requestId;
      excuses.value = res.data.excuses;
    } finally {
      loading.value = false;
    }
  }

  async function feedback(excuseId: string, action: 'like' | 'dislike') {
    const excuse = excuses.value.find((e) => e.excuseId === excuseId);
    if (!excuse) return;

    // 切换状态：再次点击取消
    const isToggleOff = (action === 'like' && excuse.liked === true)
      || (action === 'dislike' && excuse.liked === false);

    if (isToggleOff) {
      excuse.liked = null;
      // 不发请求，仅本地取消（后端无 unlike 接口）
      return;
    }

    excuse.liked = action === 'like' ? true : false;
    await excuseApi.feedbackExcuse(excuseId, requestId.value, action);
  }

  function reset() {
    loading.value = false;
    requestId.value = '';
    excuses.value = [];
    inputContent.value = '';
    inputContext.value = {};
  }

  return { loading, requestId, excuses, inputContent, inputContext, generate, refresh, feedback, reset };
});
