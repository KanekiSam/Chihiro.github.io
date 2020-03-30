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
      ],
    },
  ],
  antd: {},
  publicPath: '/static/',
  plugins: [['ifanrx-react-ueditor', {}]],
});
