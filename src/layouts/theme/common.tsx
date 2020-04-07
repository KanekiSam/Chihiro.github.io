import React, { useState, useEffect } from 'react';
import { Menu, Input } from 'antd';
import { MenuLists, IMenuLists } from '@/data/header';
import { Link } from 'umi';
import styles from './common.less';
const { Search } = Input;

interface Props {
  location?: any;
}
const CommonLayout: React.FC<Props> = props => {
  const [selectKeys, setSelectKeys] = useState<string[]>(['/']);
  const getGroupLists = (list: IMenuLists, array: string[]): string[] => {
    const data = [...array];
    data.push(list.path);
    if (list.children) {
      data.push(...list.children.map(item => item.path));
      list.children.forEach(item => {
        data.push(...getGroupLists(item, []));
      });
    }
    return data;
  };
  useEffect(() => {
    for (var item of MenuLists) {
      const data = getGroupLists(item, []);
      if (data.indexOf(props.location?.pathname) > -1) {
        if (data?.[0] && selectKeys[0] != data?.[0]) {
          setSelectKeys([data?.[0]]);
          break;
        }
      }
    }
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
      <div className={styles.container}>{props.children}</div>
    </div>
  );
};
export default CommonLayout;
