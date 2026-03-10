<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/history" icon="clock-o">历史</van-tabbar-item>
    <van-tabbar-item to="/favorites" icon="star-o">收藏</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(0);
</script>
