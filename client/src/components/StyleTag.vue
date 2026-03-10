<template>
  <span class="style-tag" :style="{ backgroundColor: config.color + '1a', color: config.color }">
    {{ config.icon }} {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { STYLE_CONFIG, type ExcuseStyle } from '../types';

const props = defineProps<{ style: ExcuseStyle }>();
const config = computed(() => STYLE_CONFIG[props.style] || STYLE_CONFIG.reasonable);
</script>

<style scoped>
.style-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
</style>
