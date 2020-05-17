import React, { useState, useEffect } from 'react';
import { MenuLists, IMenuLists } from '@/data/header';
import styles from './blog.less';
import { user } from '@/data/user';
import { category } from '@/data/category';
import { connect } from 'dva';
import CommonLayout from './theme/common';
import { EditOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface Props {
  location?: any;
  userInfo?: any;
}
const BlogLayout: React.FC<Props> = props => {
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
        if (data?.[0]) {
          setSelectKeys([data?.[0]]);
          break;
        }
      }
    }
  }, [props.location?.pathname]);

  return (
    <CommonLayout {...props}>
      <div className={styles.left}>
        <div className={`${styles.userCard} ${styles.block}`}>
          <img className={styles.avatar} src={user.avatar} />
          <div className={styles.name}>{props.userInfo?.user}</div>
          <div className={styles.describe}>
            {props.userInfo?.describe ?? '[来写点什么吧]'}
            <EditOutlined
              style={{ color: 'blue', marginTop: 15 }}
              onClick={() => history.push({ pathname: 'userCenter' })}
            />
          </div>
        </div>
        {category.map((item, key) => (
          <div key={key} className={`${styles.tags} ${styles.block}`}>
            <div className={styles.tagsTitle}>{item.label}</div>
            <ul>
              {item.list.map((item2, key2) => (
                <li key={key2}>{item2.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.body}>{props.children}</div>
    </CommonLayout>
  );
};
export default connect(({ user }) => ({ userInfo: user.userInfo }))(BlogLayout);
