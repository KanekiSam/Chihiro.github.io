import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from './index.less';
import { history } from 'umi';

interface Props {}
const Login: React.FC<Props> = props => {
  const [form] = Form.useForm();
  const onsubmit = () => {};
  return (
    <div className={styles.formContent}>
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        className={styles.formModule}
        onFinish={onsubmit}
      >
        <Form.Item name="user" label="用户名">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <div>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <a
              style={{ marginLeft: 8 }}
              onClick={() => history.push('/register')}
            >
              去注册
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
