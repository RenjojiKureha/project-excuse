<template>
  <div class="loading-container">
    <div class="loading-icon">
      <div class="spinner"></div>
    </div>
    <div class="loading-text-wrapper">
      <transition name="roll" mode="out-in">
        <p class="loading-text" :key="currentIndex">{{ texts[currentIndex] }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const texts = [
  '正在绞尽脑汁帮你想借口...',
  '搜索全网最好用的借口中...',
  '正在模拟对方的反应...',
  '精心打磨措辞中...',
  '马上就好，再等一下下...',
];

const currentIndex = ref(0);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.length;
  }, 2000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
}

/* 自定义 spinner */
.loading-icon {
  margin-bottom: 24px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 文字滚动容器 */
.loading-text-wrapper {
  height: 24px;
  overflow: hidden;
  position: relative;
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  text-align: center;
}

/* 滚动动画：旧文字向上滑出，新文字从下方滑入 */
.roll-enter-active,
.roll-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.roll-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.roll-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
