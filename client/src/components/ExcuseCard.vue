<template>
  <div class="excuse-card">
    <StyleTag :style="excuse.style" />
    <p class="excuse-content">{{ excuse.content }}</p>
    <p class="excuse-tip">{{ excuse.tip }}</p>
    <div class="excuse-actions">
      <van-icon
        name="good-job-o"
        :class="{ active: excuse.liked === true }"
        @click="$emit('feedback', excuse.id, 'like')"
      />
      <van-icon
        name="good-job-o"
        class="dislike-icon"
        :class="{ active: excuse.liked === false }"
        @click="$emit('feedback', excuse.id, 'dislike')"
      />
      <van-icon name="description" @click="$emit('copy', excuse.content)" />
      <van-icon name="star-o" @click="$emit('favorite', excuse)" />
      <van-icon name="share-o" @click="$emit('share', excuse)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StyleTag from './StyleTag.vue';
import type { ExcuseItem } from '../types';

defineProps<{ excuse: ExcuseItem }>();
defineEmits<{
  feedback: [id: string, action: 'like' | 'dislike'];
  copy: [text: string];
  favorite: [excuse: ExcuseItem];
  share: [excuse: ExcuseItem];
}>();
</script>

<style scoped>
.excuse-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.excuse-content {
  font-size: 15px;
  line-height: 1.7;
  margin: 12px 0 8px;
  color: var(--color-text);
}
.excuse-tip {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}
.excuse-actions {
  display: flex;
  gap: 20px;
  font-size: 20px;
  color: var(--color-text-muted);
}
.excuse-actions .van-icon { cursor: pointer; transition: color 0.2s; }
.excuse-actions .van-icon:active { transform: scale(1.2); }
.excuse-actions .van-icon.active { color: var(--color-primary); }
.dislike-icon { transform: rotate(180deg); }
.dislike-icon.active { color: var(--color-reverse); }
</style>
