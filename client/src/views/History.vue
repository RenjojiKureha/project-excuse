<template>
  <div class="history-page">
    <van-nav-bar title="历史记录" />

    <van-search v-model="keyword" placeholder="搜索历史记录" @search="onSearch" />

    <van-list
      v-model:loading="historyStore.loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div
        v-for="item in historyStore.historyList"
        :key="item.requestId"
        class="history-item"
        @click="onItemClick(item)"
      >
        <div class="history-content">
          <p class="history-input">{{ item.input.content }}</p>
          <p class="history-meta">
            {{ item.results.length }} 个借口 · {{ formatTime(item.createdAt) }}
          </p>
        </div>
        <van-icon
          name="delete-o"
          class="history-delete"
          @click.stop="onDelete(item)"
        />
      </div>
    </van-list>

    <van-empty v-if="!historyStore.loading && historyStore.historyList.length === 0" description="还没有记录哦" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHistoryStore } from '../stores/history';
import { useExcuseStore } from '../stores/excuse';
import { showConfirmDialog, showToast } from 'vant';
import type { HistoryItem } from '../types';

const router = useRouter();
const historyStore = useHistoryStore();
const excuseStore = useExcuseStore();
const keyword = ref('');
const page = ref(1);
const finished = computed(() => historyStore.historyList.length >= historyStore.historyTotal);

onMounted(() => {
  page.value = 1;
  historyStore.fetchHistory(1);
});

function loadMore() {
  page.value++;
  historyStore.fetchHistory(page.value, keyword.value || undefined);
}

function onSearch() {
  page.value = 1;
  historyStore.fetchHistory(1, keyword.value || undefined);
}

function onItemClick(item: HistoryItem) {
  // 将历史记录的结果载入 store 并跳转
  excuseStore.requestId = item.requestId;
  excuseStore.excuses = item.results;
  excuseStore.inputContent = item.input.content;
  excuseStore.inputContext = item.input.context;
  router.push(`/result/${item.requestId}`);
}

async function onDelete(item: HistoryItem) {
  try {
    await showConfirmDialog({ title: '确认删除', message: '删除后不可恢复' });
    await historyStore.deleteHistory(item._id);
    showToast('已删除');
  } catch {
    // 用户取消
  }
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return date.toLocaleDateString('zh-CN');
}
</script>

<style scoped>
.history-page { padding: 0 0 16px; }
.history-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: var(--color-card);
  margin: 8px 16px;
  border-radius: 10px;
}
.history-content { flex: 1; min-width: 0; }
.history-delete {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--color-text-muted);
  margin-left: 12px;
  padding: 4px;
}
.history-input { font-size: 15px; color: var(--color-text); }
.history-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
}
</style>
