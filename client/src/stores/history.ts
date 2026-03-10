import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { HistoryItem, FavoriteItem } from '../types';
import * as historyApi from '../api/history';

export const useHistoryStore = defineStore('history', () => {
  const historyList = ref<HistoryItem[]>([]);
  const historyTotal = ref(0);
  const favoriteList = ref<FavoriteItem[]>([]);
  const favoriteTotal = ref(0);
  const loading = ref(false);

  async function fetchHistory(page = 1, keyword?: string) {
    loading.value = true;
    try {
      const res = await historyApi.getHistory({ page, keyword });
      if (page === 1) {
        historyList.value = res.data.list;
      } else {
        historyList.value.push(...res.data.list);
      }
      historyTotal.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFavorites(page = 1, style?: string) {
    loading.value = true;
    try {
      const res = await historyApi.getFavorites({ page, style });
      if (page === 1) {
        favoriteList.value = res.data.list;
      } else {
        favoriteList.value.push(...res.data.list);
      }
      favoriteTotal.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }

  async function addFavorite(data: {
    excuseId: string; requestId: string; style: string;
    content: string; tip: string; originalInput: string;
  }) {
    await historyApi.addFavorite(data);
  }

  async function removeFavorite(id: string) {
    await historyApi.removeFavorite(id);
    favoriteList.value = favoriteList.value.filter((f) => f._id !== id);
    favoriteTotal.value--;
  }

  return {
    historyList, historyTotal, favoriteList, favoriteTotal, loading,
    fetchHistory, fetchFavorites, addFavorite, removeFavorite,
  };
});
