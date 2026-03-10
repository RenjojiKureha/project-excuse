<template>
  <div class="qr-code">
    <QrcodeVue :value="url" :size="80" level="M" />
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

defineProps<{ url?: string }>();
</script>

<style scoped>
.qr-code { display: inline-block; }
</style>
