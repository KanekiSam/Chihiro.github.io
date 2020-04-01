import React, { useState } from 'react';
import RcUeditor from 'react-ueditor-wrap';
import { Button } from 'antd';
import fs from 'fs';
import axios from 'axios';
import { history } from 'umi';

interface UeditorData {
  createTime: number | null;
  content: string;
}
interface Props {}
const UeditorWrap: React.FC<Props> = props => {
  const [data, setData] = useState<UeditorData>({
    createTime: null,
    content: '',
  });
  const onChange = (val: any) => {
    const createTime = new Date().getTime();
    const data = {
      createTime,
      content: val,
    };
    setData(data);
  };
  const onSave = () => {
    axios.post('/article/create', data).then(res => {
      // tslint:disable-next-line:no-console
      console.log(res);
      if (res.status == 200) {
        history.push('/myBlog');
      }
    });
  };
  return (
    <div>
      <Button type="primary" onClick={onSave} style={{ margin: '10px 0' }}>
        保存
      </Button>
      <RcUeditor
        editorConfig={{ initialFrameHeight: 700 }}
        onChange={onChange}
      />
    </div>
  );
};
export default UeditorWrap;
