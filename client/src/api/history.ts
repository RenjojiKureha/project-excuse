import request from './request';
import type { PageData, HistoryItem, FavoriteItem, PresetItem } from '../types';

export function getHistory(params: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get<any, { code: number; data: PageData<HistoryItem> }>('/history', { params });
}

export function getFavorites(params: { page?: number; pageSize?: number; style?: string }) {
  return request.get<any, { code: number; data: PageData<FavoriteItem> }>('/favorite', { params });
}

export function addFavorite(data: {
  excuseId: string;
  requestId: string;
  style: string;
  content: string;
  tip: string;
  originalInput: string;
}) {
  return request.post('/favorite', data);
}

export function removeFavorite(id: string) {
  return request.delete(`/favorite/${id}`);
}

export function deleteHistory(id: string) {
  return request.delete(`/history/${id}`);
}

export function getPresets() {
  return request.get<any, { code: number; data: PresetItem[] }>('/presets');
}
