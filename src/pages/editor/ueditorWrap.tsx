import React, { useState, useEffect } from 'react';
import RcUeditor from 'react-ueditor-wrap';
import { Button, Spin, message } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import { useAsync } from '@umijs/hooks';
import EditModal from './EditModal';

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
  const onChange = (val: any) => {
    setContentData(val);
  };
  // const { loading: submitLoading, run: onSubmit } = useAsync(
  //   data => {
  //     return axios[props.location?.query?.key ? 'put' : 'post'](
  //       '/article/edit/one',
  //       data,
  //     ).then(res => {
  //       if (res.status == 200) {
  //         message.success(res.data);
  //         history.push('/myBlog');
  //       } else {
  //         message.error(res.data);
  //       }
  //     });
  //   },
  //   { manual: true },
  // );
  const onSave = () => {
    setVisible(true);
  };
  const { loading, run } = useAsync(
    () => {
      return axios.get('/article/get/one', {
        params: { createTime: props.location.query.key },
      });
    },
    { manual: true },
  );
  useEffect(() => {
    if (props.location?.query?.key) {
      run();
    }
  }, []);
  // tslint:disable-next-line:no-console
  console.log(props.location?.query?.key);
  return (
    <div>
      <Spin spinning={loading}>
        <Button type="primary" onClick={onSave} style={{ margin: '10px 0' }}>
          保存
        </Button>
        <RcUeditor
          editorConfig={{
            initialFrameHeight: 700,
            initialContent: '哈哈哈',
            // initialContent: result?.data?.content,
          }}
          onChange={onChange}
        />
        <EditModal
          visible={visible}
          onToggle={bool => setVisible(bool)}
          articleData={contentData}
          id={props.location?.query?.key}
        />
      </Spin>
    </div>
  );
};
export default UeditorWrap;
