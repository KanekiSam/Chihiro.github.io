import React, { useState, useEffect } from 'react';
import { category } from '@/data/category';
import styles from './index.less';
import { useAsync } from '@umijs/hooks';
import Axios from 'axios';
import { Spin } from 'antd';

interface Props {}
const Blog: React.FC<Props> = props => {
  const [selectKey, setSelectKey] = useState(0);
  const { data, loading, run: init } = useAsync(
    () => {
      return Axios.get<
        {
          content: string;
          createTime: number;
          typeDescribe: string;
          type: number;
          articleType: string;
          category: { name: string }[];
          title?: string;
        }[]
      >('/article/get/all');
    },
    { manual: true },
  );
  useEffect(() => {
    init();
  }, []);
  return (
    <div className={styles.centerblock}>
      <div className={styles.left}>
        <div className={styles.list}>
          <div className={`${styles.listItem}`}>推荐</div>
          {category
            .find(item => item.label == '标签')
            ?.list.map((item, i) => (
              <div
                className={`${styles.listItem} ${selectKey == i &&
                  styles.selected}`}
                key={i}
                onClick={() => setSelectKey(i)}
              >
                {item.name}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.right}>
        <Spin spinning={loading}>
          {(data?.data ?? [])
            .filter(item =>
              item.category?.find(
                item2 =>
                  item2.name ==
                  category.find(item => item.label == '标签')?.list[selectKey]
                    .name,
              ),
            )
            .map((item, i) => (
              <div key={i} className={styles.articleCard}>
                <h3 className={styles.title}>{item.title}</h3>
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            ))}
        </Spin>
      </div>
    </div>
  );
};
export default Blog;
