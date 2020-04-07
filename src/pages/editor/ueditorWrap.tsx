import React, { useState, useEffect } from 'react';
import RcUeditor from 'react-ueditor-wrap';
import { Button, Spin, message, Input } from 'antd';
import axios from 'axios';
import { useAsync } from '@umijs/hooks';
import EditModal from './EditModal';
import styles from './index.less';

interface UeditorData {
  createTime: number | null;
  content: string;
}
interface Props {
  location: { query: any };
}
const UeditorWrap: React.FC<Props> = props => {
  const [contentData, setContentData] = useState('');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const key = props.location?.query?.key;
  const onChange = (val: any) => {
    setContentData(val);
  };
  const onSave = () => {
    if (!contentData) {
      return message.warning('文章内容不能为空');
    }
    if (!title) {
      return message.warning('文章标题不能为空');
    }
    setVisible(true);
  };
  const { loading, run, data: result } = useAsync(
    () => {
      return axios.get('/article/get/one', {
        params: { createTime: props.location.query.key },
      });
    },
    { manual: true },
  );
  useEffect(() => {
    if (key) {
      run();
    }
  }, []);
  useEffect(() => {
    if (result?.data) {
      setTitle(result?.data?.title);
    }
  }, [result]);
  return (
    <div style={{ marginTop: 10 }}>
      <Spin spinning={loading}>
        <div className={styles.titleForm}>
          <span className={`${styles.label} ${styles.required}`}>文章名称</span>
          <Input
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            style={{ width: 300 }}
            className={styles.input}
            maxLength={20}
            placeholder="最多20字"
          />
          <Button type="primary" onClick={onSave} style={{ margin: '10px 0' }}>
            保存
          </Button>
        </div>
        {(!key || result?.data) && (
          <RcUeditor
            editorConfig={{
              initialFrameHeight: 680,
            }}
            value={!key ? '' : result?.data?.content}
            onChange={onChange}
          />
        )}
        <EditModal
          visible={visible}
          onToggle={bool => setVisible(bool)}
          articleData={{ title, content: contentData }}
          id={props.location?.query?.key}
          initData={result?.data}
        />
      </Spin>
    </div>
  );
};
export default UeditorWrap;
