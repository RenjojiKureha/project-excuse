<template>
  <van-overlay :show="true" @click="$emit('close')">
    <div class="share-wrapper" @click.stop>
      <!-- 被截图的卡片 -->
      <div ref="cardRef" class="share-card">
        <div class="share-brand">ExcuseMe 借口生成器</div>
        <div class="share-divider" />
        <StyleTag :style="excuse.style" />
        <p class="share-content">{{ excuse.content }}</p>
        <p class="share-tip">{{ excuse.tip }}</p>
        <div class="share-divider" />
        <div class="share-footer">
          <span>扫码生成你的借口</span>
          <QrCode :url="shareUrl" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="share-actions">
        <van-button round block type="primary" :loading="saving" @click="onSave">
          保存/分享图片
        </van-button>
        <van-button round block plain @click="$emit('close')">关闭</van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { showToast } from 'vant';
import StyleTag from './StyleTag.vue';
import QrCode from './QrCode.vue';
import { captureElement, shareImage } from '../utils/shareImage';
import { STYLE_CONFIG, type ExcuseItem } from '../types';

const props = defineProps<{
  excuse: ExcuseItem;
  inputContent: string;
}>();
defineEmits<{ close: [] }>();

const cardRef = ref<HTMLElement>();
const saving = ref(false);

const shareUrl = computed(() => window.location.origin);

async function onSave() {
  if (!cardRef.value) return;
  saving.value = true;
  try {
    const blob = await captureElement(cardRef.value);
    await shareImage(blob, 'ExcuseMe 借口');
    showToast('操作成功');
  } catch {
    showToast('操作失败，请长按图片保存');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.share-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  justify-content: center;
}
.share-card {
  width: 335px;
  padding: 24px 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.share-brand {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  text-align: center;
}
.share-divider {
  height: 1px;
  background: var(--color-border);
  margin: 14px 0;
}
.share-content {
  font-size: 15px;
  line-height: 1.8;
  margin: 12px 0 8px;
  color: var(--color-text);
}
.share-tip {
  font-size: 12px;
  color: var(--color-text-muted);
}
.share-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.share-actions {
  margin-top: 20px;
  width: 335px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
