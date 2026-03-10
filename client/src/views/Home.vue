<template>
  <div class="home-page">
    <div class="home-header">
      <h1 class="app-title">ExcuseMe</h1>
      <p class="app-subtitle">帮你想个好借口</p>
    </div>

    <PresetCards @select="onPresetSelect" />

    <div class="home-form">
      <ExcuseInput ref="inputRef" />
      <ContextForm ref="contextRef" />
      <!-- 加载态：文字滚动动画 -->
      <div v-if="excuseStore.loading" class="loading-bar">
        <div class="loading-spinner"></div>
        <div class="loading-text-wrapper">
          <transition name="roll" mode="out-in">
            <span class="loading-text" :key="loadingIndex">{{ loadingTexts[loadingIndex] }}</span>
          </transition>
        </div>
      </div>

      <!-- 默认态：生成按钮 -->
      <van-button
        v-else
        type="primary"
        block
        round
        :disabled="!hasContent"
        class="submit-btn"
        @click="onSubmit"
      >
        生成借口
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
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

const hasContent = computed(() => !!inputRef.value?.getContent());

// 加载文字滚动
const loadingTexts = [
  '正在绞尽脑汁帮你想借口...',
  '搜索全网最好用的借口中...',
  '正在模拟对方的反应...',
  '精心打磨措辞中...',
  '马上就好，再等一下下...',
];
const loadingIndex = ref(0);
let loadingTimer: ReturnType<typeof setInterval> | null = null;

watch(() => excuseStore.loading, (loading) => {
  if (loading) {
    loadingIndex.value = 0;
    loadingTimer = setInterval(() => {
      loadingIndex.value = (loadingIndex.value + 1) % loadingTexts.length;
    }, 2000);
  } else if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
});

onUnmounted(() => { if (loadingTimer) clearInterval(loadingTimer); });

function onPresetSelect(preset: PresetItem) {
  inputRef.value?.setContent(preset.content);
  if (preset.defaultContext) {
    contextRef.value?.setContext(preset.defaultContext);
  }
}

async function onSubmit() {
  const content = inputRef.value?.getContent();
  if (!content) return;
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
.submit-btn { margin-top: 16px; }

/* 加载滚动文字 */
.loading-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  height: 44px;
  border-radius: 22px;
  background: var(--color-primary);
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-text-wrapper {
  height: 20px;
  overflow: hidden;
  position: relative;
}

.loading-text {
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  display: block;
}

.roll-enter-active,
.roll-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.roll-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.roll-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}
</style>
