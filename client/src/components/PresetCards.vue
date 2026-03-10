<template>
  <div class="preset-cards">
    <div class="preset-header">
      <span>快速选择场景</span>
    </div>
    <div class="preset-grid">
      <div
        v-for="preset in presets"
        :key="preset._id"
        class="preset-item"
        @click="$emit('select', preset)"
      >
        <span class="preset-icon">{{ preset.icon }}</span>
        <span class="preset-name">{{ preset.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPresets } from '../api/history';
import type { PresetItem } from '../types';

defineEmits<{ select: [preset: PresetItem] }>();

const presets = ref<PresetItem[]>([]);

onMounted(async () => {
  try {
    const res = await getPresets();
    presets.value = res.data;
  } catch {
    // 静默失败
  }
});
</script>

<style scoped>
.preset-cards { margin: 16px 0; }
.preset-header {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  background: var(--color-card);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}
.preset-item:active { transform: scale(0.95); }
.preset-icon { font-size: 24px; margin-bottom: 6px; }
.preset-name { font-size: 12px; color: var(--color-text-secondary); }
</style>
