import React, { useState, useEffect } from 'react';
import { Button, Card, Spin, Modal, message, Tag } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { useAsync } from '@umijs/hooks';
import Axios from 'axios';
import { format } from '@/utils';
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

interface Props {}
const MyBlog: React.FC<Props> = props => {
  const { data, loading, run: init } = useAsync(
    () => {
      return Axios.get<
        {
          content: string;
          createTime: number;
          typeDescribe: string;
          type: number;
        }[]
      >('/article/get/all');
    },
    { manual: true },
  );
  const { data: result, loading: deleteLoading, run: deleteFunc } = useAsync(
    createTime => {
      return Axios.delete('/article/delete/one', {
        params: { createTime },
      });
    },
    { manual: true },
  );
  const ondelete = (createTime: number) => {
    Modal.confirm({
      title: '提示',
      content: '是否确认删除?',
      onOk: async () => {
        deleteFunc(createTime);
        if (result?.status == 200) {
          init();
          message.success(result?.data);
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };
  useEffect(() => {
    init();
  }, []);
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
            <Card
              className={styles.card_block}
              key={i}
              extra={
                item.typeDescribe && (
                  <Tag color={item.type == 0 ? 'error' : 'success'}>
                    {item.typeDescribe}
                  </Tag>
                )
              }
            >
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></div>
              <div className={styles.footer}>
                <span className={styles.time}>
                  {format(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')}
                </span>
                <span className={styles.tool}>
                  <EditOutlined
                    onClick={() => {
                      history.push({
                        pathname: '/ueditorWrap',
                        query: { key: item.createTime },
                      });
                    }}
                  />
                  &#x3000;
                  {deleteLoading ? (
                    <LoadingOutlined />
                  ) : (
                    <DeleteOutlined onClick={() => ondelete(item.createTime)} />
                  )}
                </span>
              </div>
            </Card>
          ))}
      </Spin>
    </div>
  );
};
export default MyBlog;
