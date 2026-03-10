<template>
  <div class="excuse-input">
    <div class="input-wrapper">
      <van-field
        v-model="content"
        type="textarea"
        :maxlength="200"
        show-word-limit
        rows="3"
        autosize
        placeholder="描述你想拒绝的事..."
        @keydown.enter.prevent="handleSubmit"
      />
    </div>
    <van-button
      type="primary"
      block
      round
      :loading="loading"
      :disabled="!content.trim()"
      loading-text="生成中..."
      @click="handleSubmit"
    >
      生成借口
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits<{ submit: [content: string] }>();

const content = ref('');

function handleSubmit() {
  if (content.value.trim() && !props.loading) {
    emit('submit', content.value.trim());
  }
}

function setContent(text: string) {
  content.value = text;
}

defineExpose({ setContent });
</script>

<style scoped>
.excuse-input {
  padding: 0;
}
.input-wrapper {
  margin-bottom: 12px;
  background: var(--color-card);
  border-radius: 12px;
  overflow: hidden;
}
</style>
