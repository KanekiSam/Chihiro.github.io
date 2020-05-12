import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select, Radio, message, Input } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAsync } from '@umijs/hooks';
import axios from 'axios';
import { history } from 'umi';
import { category } from '@/data/category';
import styles from './index.less';

interface ILabelProps {
  value?: { name: string }[];
  onChange?: any;
  deleteLabel: (name: string) => void;
}
const CategoryList: React.FC<ILabelProps> = props => {
  return (
    <div className={styles.categoryLists}>
      {props.value
        ? props.value.map((item, i) => (
            <div key={i} className={styles.category}>
              {item.name}
              <CloseOutlined
                className={styles.icon}
                onClick={() => props.deleteLabel(item.name)}
              />
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
  articleData: { content: string; title: string };
  initData: any;
}
const EditModal: React.FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [autoValue, setAutoValue] = useState('');
  const [form] = Form.useForm();
  const { loading, run: onsubmit } = useAsync(
    data => {
      return axios[props.id ? 'put' : 'post'](
        props.id ? '/article/edit/one' : '/article/create',
        data,
      ).then(res => {
        if (res.status == 200) {
          message.success('操作成功');
          props.onToggle(false);
          history.push('/myBlog');
        } else {
          message.error(res.data);
        }
      });
    },
    { manual: true },
  );
  const onOk = (type: number) => {
    form.validateFields().then(values => {
      onsubmit({
        ...values,
        ...props.articleData,
        type,
        typeDescribe: type == 0 ? '草稿' : '已发布',
        id: props.id,
      });
    });
  };
  const addLabel = (name: string) => {
    const { getFieldValue, setFieldsValue } = form;
    const category = getFieldValue('category') || [];
    if (category.find((item: { name: string }) => item.name == name)) {
      message.warning('重复标签');
    } else {
      category.push({ name });
      setFieldsValue({ category: [...category] });
    }
  };
  const deleteLabel = (name: string) => {
    const { getFieldValue, setFieldsValue } = form;
    const category = getFieldValue('category') || [];
    const target = category.find((item: { name: string }) => item.name == name);
    if (target) {
      setFieldsValue({
        category: category.filter((item: any) => item.name != name),
      });
    }
  };
  useEffect(() => {
    if (props.initData) {
      form.setFieldsValue(props.initData);
    }
  }, [props.initData]);
  return (
    <Modal
      title="发布文章"
      visible={props.visible}
      getContainer={false}
      onCancel={() => {
        props.onToggle(false);
      }}
      width={620}
      footer={[
        <span
          key={1}
          onClick={() => props.onToggle(false)}
          style={{ padding: '0 8px', cursor: 'pointer' }}
        >
          取消
        </span>,
        !props.id || props.initData?.type == 0 ? (
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
        <Form.Item label="文章标签" required>
          <Form.Item
            noStyle
            name="category"
            rules={[{ required: true, message: '文章标签不能为空' }]}
          >
            <CategoryList deleteLabel={deleteLabel} />
          </Form.Item>
          <Form.Item noStyle>
            <div className={styles.addLabelModule}>
              <Button onClick={() => setVisible(true)}>
                <PlusOutlined />
                新建分类专栏
              </Button>
              <div
                className={styles.labelModule}
                style={{ display: visible ? '' : 'none' }}
              >
                <CloseOutlined
                  className={styles.closeBtn}
                  onClick={() => setVisible(false)}
                />
                <div style={{ marginBottom: 10 }}>
                  <Input
                    value={autoValue}
                    onChange={val => setAutoValue(val.target.value)}
                    style={{ width: 150, marginRight: 10 }}
                    onPressEnter={() => addLabel(autoValue)}
                    allowClear
                  />
                  <Button onClick={() => addLabel(autoValue)}>
                    新增自定义
                  </Button>
                </div>
                {category
                  .filter(item => item.label == '标签')
                  .map((item, j) => (
                    <div key={j}>
                      {item.list.map((item2, i) => (
                        <div
                          key={i}
                          className={styles.labelBlock}
                          onClick={() => addLabel(item2.name)}
                        >
                          {item2.name}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="文章类型"
          name="articleType"
          rules={[{ required: true, message: '文章类型不能为空' }]}
        >
          <Select>
            <Select.Option value="原创">原创</Select.Option>
            <Select.Option value="转载">转载</Select.Option>
            <Select.Option value="翻译">翻译</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="发布形式"
          name="outputShape"
          rules={[{ required: true, message: '发布形式不能为空' }]}
        >
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
