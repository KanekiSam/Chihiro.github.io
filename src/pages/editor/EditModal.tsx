import React from 'react';
import { Modal, Form, Button, Select, Radio, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAsync } from '@umijs/hooks';
import axios from 'axios';
import { history } from 'umi';

interface ILabelProps {
  value?: { name: string }[];
  onChange?: any;
}
const CategoryList: React.FC<ILabelProps> = props => {
  return (
    <div>
      {props.value
        ? props.value.map((item, i) => (
            <div key={i}>
              {item.name}
              <CloseOutlined />
            </div>
          ))
        : ''}
    </div>
  );
};
interface Props {
  visible: boolean;
  onToggle: (bool: boolean) => void;
  id?: number;
  articleData: string;
}
const EditModal: React.FC<Props> = props => {
  const [form] = Form.useForm();
  const { loading, run: onsubmit } = useAsync(
    data => {
      return axios[props.id ? 'put' : 'post']('/article/edit/one', data).then(
        res => {
          if (res.status == 200) {
            message.success(res.data);
            props.onToggle(false);
            history.push('/myBlog');
          } else {
            message.error(res.data);
          }
        },
      );
    },
    { manual: true },
  );
  const onOk = (type: number) => {
    form.validateFields().then(values => {
      onsubmit({
        ...values,
        content: props.articleData,
        type,
        typeDescribe: type == 0 ? '草稿' : '已发布',
      });
    });
  };
  return (
    <Modal
      title="发布文章"
      visible={props.visible}
      onCancel={() => {
        props.onToggle(false);
      }}
      footer={[
        <span
          key={1}
          onClick={() => props.onToggle(false)}
          style={{ padding: '0 8px' }}
        >
          取消
        </span>,
        !props.id ? (
          <Button key={2} type="link" loading={loading} onClick={() => onOk(0)}>
            保存为草稿
          </Button>
        ) : (
          undefined
        ),
        <Button key={3} loading={loading} onClick={() => onOk(1)}>
          发布文章
        </Button>,
      ]}
    >
      <Form wrapperCol={{ span: 14 }} labelCol={{ span: 6 }} form={form}>
        <Form.Item label="文章标签">
          <Form.Item noStyle name="category">
            <CategoryList />
          </Form.Item>
          <Form.Item noStyle>
            <Button>
              <PlusOutlined />
              新建分类专栏
            </Button>
          </Form.Item>
        </Form.Item>
        <Form.Item label="文章类型" name="type">
          <Select>
            <Select.Option value="原创">原创</Select.Option>
            <Select.Option value="转载">转载</Select.Option>
            <Select.Option value="翻译">翻译</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="发布形式" name="outputShape">
          <Radio.Group>
            <Radio value="公开">公开</Radio>
            <Radio value="私密">私密</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditModal;
