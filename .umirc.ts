import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: 'index' },
        { path: '/blog', component: 'blog/index' },
        { path: '/myBlog', component: 'myBlog/index' },
        { path: '/editor', component: 'editor/index' },
        { path: '/ueditorWrap', component: 'editor/ueditorWrap' },
        { path: '/login', component: 'login/index' },
        { path: '/register', component: 'login/register' },
        { path: '/retrieve', component: 'login/retrievePassword' },
      ],
    },
  ],
  antd: {},
  publicPath: '/static/',
  proxy: {
    '/article': {
      target: 'http://localhost:5000',
      changeOrigin: false,
    },
  },
});
