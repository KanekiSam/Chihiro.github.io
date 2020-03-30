import React, { useState, useEffect } from 'react';
import { Menu, Input } from 'antd';
import { MenuLists } from '@/data/header';
import { Link } from 'umi';
import styles from './index.less';
import { user } from '@/data/user';
import { category } from '@/data/category';
const { Search } = Input;

interface Props {
  location?: any;
}
const BlogLayout: React.FC<Props> = props => {
  const [selectKeys, setSelectKeys] = useState<string[]>(['/']);
  useEffect(() => {
    setSelectKeys([props.location?.pathname]);
  }, [props.location?.pathname]);

  return (
    <div className={styles.blog}>
      <div
        style={{
          padding: '10px 100px 0',
          borderBottom: '1px solid #f0f0f0',
        }}
        className={styles.header}
      >
        <div
          style={{ display: 'inline-block', margin: '0 auto' }}
          className={styles.menu}
        >
          <Menu
            selectedKeys={selectKeys}
            mode="horizontal"
            style={{ borderBottom: 0 }}
          >
            {MenuLists.map(item => (
              <Menu.Item
                key={item.path}
                onClick={() => {
                  setSelectKeys([item.path]);
                }}
              >
                <Link to={item.path}>{item.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div style={{ width: 300, float: 'right' }} className={styles.search}>
          <Search />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={`${styles.userCard} ${styles.block}`}>
            <img className={styles.avatar} src={user.avatar} />
            <div className={styles.name}>{user.name}</div>
            <div className={styles.describe}>{user.describe}</div>
          </div>
          {category.map((item, key) => (
            <div key={key} className={`${styles.tags} ${styles.block}`}>
              <div className={styles.tagsTitle}>{item.label}</div>
              <ul>
                {item.list.map(item2 => (
                  <li>{item2.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.body}>{props.children}</div>
      </div>
    </div>
  );
};
export default BlogLayout;
