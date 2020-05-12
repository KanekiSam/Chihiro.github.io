export interface IMenuLists {
  title: string;
  path: string;
  children?: IMenuLists[];
}
export const MenuLists: IMenuLists[] = [
  { title: '首页', path: '/' },
  { title: '博客', path: '/blog' },
  {
    title: '我的',
    path: '/myBlog',
    children: [{ title: '编辑', path: '/editor/ueditorWrap' }],
  },
];
