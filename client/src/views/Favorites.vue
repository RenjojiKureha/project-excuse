<template>
  <div class="favorites-page">
    <van-nav-bar title="收藏夹" />

    <!-- 风格筛选 -->
    <div class="filter-bar">
      <van-tag
        v-for="(conf, key) in STYLE_CONFIG"
        :key="key"
        :type="selectedStyle === key ? 'primary' : 'default'"
        size="medium"
        round
        @click="toggleStyle(key as ExcuseStyle)"
      >
        {{ conf.icon }} {{ conf.label }}
      </van-tag>
    </div>

    <van-list
      v-model:loading="historyStore.loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div
        v-for="item in historyStore.favoriteList"
        :key="item._id"
        class="favorite-item"
      >
        <StyleTag :style="item.style" />
        <p class="fav-content">{{ item.content }}</p>
        <div class="fav-actions">
          <van-icon name="description" @click="copyText(item.content)" />
          <van-icon name="delete-o" @click="onRemove(item._id)" />
        </div>
      </div>
    </van-list>

    <van-empty v-if="!historyStore.loading && historyStore.favoriteList.length === 0" description="还没有收藏哦" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import StyleTag from '../components/StyleTag.vue';
import { useHistoryStore } from '../stores/history';
import { copyText } from '../utils/clipboard';
import { STYLE_CONFIG, type ExcuseStyle } from '../types';

const historyStore = useHistoryStore();
const selectedStyle = ref<ExcuseStyle | ''>('');
const page = ref(1);
const finished = computed(() => historyStore.favoriteList.length >= historyStore.favoriteTotal);

onMounted(() => {
  historyStore.fetchFavorites(1);
});

function toggleStyle(style: ExcuseStyle) {
  selectedStyle.value = selectedStyle.value === style ? '' : style;
  page.value = 1;
  historyStore.fetchFavorites(1, selectedStyle.value || undefined);
}

function loadMore() {
  page.value++;
  historyStore.fetchFavorites(page.value, selectedStyle.value || undefined);
}

function onRemove(id: string) {
  historyStore.removeFavorite(id);
}
</script>

<style scoped>
.favorites-page { padding: 0 0 16px; }
.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  white-space: nowrap;
}
.favorite-item {
  padding: 14px 16px;
  background: var(--color-card);
  margin: 8px 16px;
  border-radius: 10px;
}
.fav-content {
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
}
.fav-actions {
  display: flex;
  gap: 16px;
  font-size: 18px;
  color: var(--color-text-muted);
}
</style>
