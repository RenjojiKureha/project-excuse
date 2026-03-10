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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{}>();
const emit = defineEmits<{}>();

const content = ref('');

function getContent(): string {
  return content.value.trim();
}

function setContent(text: string) {
  content.value = text;
}

defineExpose({ getContent, setContent });
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
