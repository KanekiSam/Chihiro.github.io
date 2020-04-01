import React, { useState } from 'react';
import { Button, Card, Spin } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { useAsync } from '@umijs/hooks';
import Axios from 'axios';
import { format } from '@/utils';

interface Props {}
const MyBlog: React.FC<Props> = props => {
  const { data, loading } = useAsync(() => {
    return Axios.get<{ content: string; createTime: number }[]>(
      '/article/get/all',
    );
  });
  // tslint:disable-next-line:no-console
  console.log(data);
  return (
    <div style={{ margin: 20 }}>
      <Button
        type="primary"
        onClick={() => {
          history.push('/ueditorWrap');
        }}
      >
        新增
      </Button>
      <Spin spinning={loading}>
        {data &&
          data.data.map((item, i) => (
            <Card className={styles.card_block} key={i}>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></div>
              <div className={styles.footer}>
                {format(new Date(item.createTime))}
              </div>
            </Card>
          ))}
      </Spin>
    </div>
  );
};
export default MyBlog;
