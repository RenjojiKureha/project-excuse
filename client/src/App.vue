<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
  <BottomNav />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from './components/BottomNav.vue';

const router = useRouter();
const transitionName = ref('');

watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (!from?.name) return;
    // Result 页面使用 slide-left 进入
    if (to.name === 'Result') {
      transitionName.value = 'slide-left';
    } else if (from.name === 'Result') {
      transitionName.value = 'slide-right';
    } else {
      transitionName.value = '';
    }
  },
);
</script>
