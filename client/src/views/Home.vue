<template>
  <div class="home-page">
    <div class="home-header">
      <h1 class="app-title">ExcuseMe</h1>
      <p class="app-subtitle">帮你想个好借口</p>
    </div>

    <PresetCards @select="onPresetSelect" />

    <div class="home-form">
      <ExcuseInput ref="inputRef" :loading="excuseStore.loading" @submit="onSubmit" />
      <ContextForm ref="contextRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PresetCards from '../components/PresetCards.vue';
import ExcuseInput from '../components/ExcuseInput.vue';
import ContextForm from '../components/ContextForm.vue';
import { useExcuseStore } from '../stores/excuse';
import type { PresetItem } from '../types';

const router = useRouter();
const excuseStore = useExcuseStore();
const inputRef = ref<InstanceType<typeof ExcuseInput>>();
const contextRef = ref<InstanceType<typeof ContextForm>>();

function onPresetSelect(preset: PresetItem) {
  inputRef.value?.setContent(preset.content);
  if (preset.defaultContext) {
    contextRef.value?.setContext(preset.defaultContext);
  }
}

async function onSubmit(content: string) {
  const context = contextRef.value?.getContext();
  try {
    const result = await excuseStore.generate(content, context);
    router.push(`/result/${result.requestId}`);
  } catch {
    // error handled by API layer
  }
}
</script>

<style scoped>
.home-page { padding: 20px 16px; }
.home-header { text-align: center; padding: 20px 0; }
.app-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}
.app-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.home-form { margin-top: 16px; }
</style>
