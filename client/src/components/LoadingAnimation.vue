<template>
  <div class="loading-container">
    <van-loading size="32px" color="var(--color-primary)" />
    <p class="loading-text">{{ currentText }}</p>
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

const currentText = ref(texts[0]);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  let i = 0;
  timer = setInterval(() => {
    i = (i + 1) % texts.length;
    currentText.value = texts[i];
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
  padding: 60px 20px;
}
.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
