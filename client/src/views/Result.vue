<template>
  <div class="result-page">
    <van-nav-bar title="生成结果" left-arrow @click-left="router.back()" />

    <LoadingAnimation v-if="excuseStore.loading" />

    <template v-else-if="excuseStore.excuses.length > 0">
      <ExcuseList
        :excuses="excuseStore.excuses"
        @feedback="onFeedback"
        @copy="onCopy"
        @favorite="onFavorite"
        @share="onShare"
      />

      <div class="result-actions">
        <van-button round plain type="primary" :loading="excuseStore.loading" @click="excuseStore.refresh()">
          换一批
        </van-button>
        <van-button round plain @click="router.push('/')">
          重新输入
        </van-button>
      </div>
    </template>

    <van-empty v-else description="暂无结果，请返回首页生成" />

    <!-- 分享图片浮层 -->
    <ShareImage
      v-if="shareExcuse"
      :excuse="shareExcuse"
      :input-content="excuseStore.inputContent"
      @close="shareExcuse = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingAnimation from '../components/LoadingAnimation.vue';
import ExcuseList from '../components/ExcuseList.vue';
import ShareImage from '../components/ShareImage.vue';
import { useExcuseStore } from '../stores/excuse';
import { useHistoryStore } from '../stores/history';
import { copyText } from '../utils/clipboard';
import { showToast } from 'vant';
import type { ExcuseItem } from '../types';

const router = useRouter();
const route = useRoute();
const excuseStore = useExcuseStore();
const historyStore = useHistoryStore();
const shareExcuse = ref<ExcuseItem | null>(null);

// 处理直接 URL 访问：如果 store 为空，从历史记录加载
onMounted(async () => {
  const requestId = route.params.requestId as string;
  if (excuseStore.excuses.length === 0 && requestId) {
    try {
      const res = await import('../api/history').then((m) => m.getHistory({ keyword: '' }));
      const found = res.data.list.find((item: any) => item.requestId === requestId);
      if (found) {
        excuseStore.requestId = found.requestId;
        excuseStore.excuses = found.results;
        excuseStore.inputContent = found.input.content;
        excuseStore.inputContext = found.input.context;
      }
    } catch {
      // 找不到记录，显示空状态
    }
  }
});

function onFeedback(id: string, action: 'like' | 'dislike') {
  excuseStore.feedback(id, action);
}

function onCopy(text: string) {
  copyText(text);
}

function onFavorite(excuse: ExcuseItem) {
  historyStore.addFavorite({
    excuseId: excuse.id,
    requestId: excuseStore.requestId,
    style: excuse.style,
    content: excuse.content,
    tip: excuse.tip,
    originalInput: excuseStore.inputContent,
  });
  showToast('已收藏');
}

function onShare(excuse: ExcuseItem) {
  shareExcuse.value = excuse;
}
</script>

<style scoped>
.result-page { padding: 0 ; }
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}
.result-actions .van-button { flex: 1; }
</style>
