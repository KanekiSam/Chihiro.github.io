import { defineConfig } from 'umi';

export default defineConfig({
  antd: {},
  publicPath: '/static/',
  proxy: {
    '/article': {
      target: 'http://localhost:5000',
      changeOrigin: false,
    },
    '/user': {
      target: 'http://localhost:5000',
      changeOrigin: false,
    },
  },
  dva: {
    immer: true,
    hmr: true,
  },
});
