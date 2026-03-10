import axios from 'axios';
import { showToast } from 'vant';
import { getSessionId } from '../utils/session';

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// 请求拦截器：自动注入 sessionId
request.interceptors.request.use((config) => {
  const sessionId = getSessionId();
  // GET 和 DELETE 通过 query params 传递 sessionId
  if (config.method === 'get' || config.method === 'delete') {
    config.params = { ...config.params, sessionId };
  } else {
    config.data = { ...config.data, sessionId };
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      showToast(res.data.message || '请求失败');
      return Promise.reject(new Error(res.data.message));
    }
    return res.data;
  },
  (err) => {
    const msg = err.response?.data?.message || '网络异常，请稍后重试';
    showToast(msg);
    return Promise.reject(err);
  },
);

export default request;
