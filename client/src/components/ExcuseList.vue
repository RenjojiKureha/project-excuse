<template>
  <div class="excuse-list">
    <transition-group name="card-fade">
      <ExcuseCard
        v-for="excuse in excuses"
        :key="excuse.id"
        :excuse="excuse"
        @feedback="(id: string, action: 'like' | 'dislike') => $emit('feedback', id, action)"
        @copy="(text: string) => $emit('copy', text)"
        @favorite="(excuse: ExcuseItem) => $emit('favorite', excuse)"
        @share="(excuse: ExcuseItem) => $emit('share', excuse)"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import ExcuseCard from './ExcuseCard.vue';
import type { ExcuseItem } from '../types';

defineProps<{ excuses: ExcuseItem[] }>();
defineEmits<{
  feedback: [id: string, action: 'like' | 'dislike'];
  copy: [text: string];
  favorite: [excuse: ExcuseItem];
  share: [excuse: ExcuseItem];
}>();
</script>

<style scoped>
.excuse-list { padding: 16px; }
.card-fade-enter-active { transition: all 0.4s ease; }
.card-fade-leave-active { transition: all 0.3s ease; }
.card-fade-enter-from { opacity: 0; transform: translateY(20px); }
.card-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
