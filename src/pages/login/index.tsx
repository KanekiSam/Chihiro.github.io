import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import styles from './index.less';
import { history } from 'umi';
import { httpPost } from '../../utils/request';
import { setToken } from '../../utils/getToken';

interface Props {}
const Login: React.FC<Props> = props => {
  const [errtxt, setErrtxt] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onsubmit = () => {
    form.validateFields().then(async values => {
      setLoading(true);
      httpPost<string>('/user/login', values).then(({ data, success }) => {
        if (success) {
          message.success('登录成功');
          history.push('/');
          setToken(data);
        } else {
          setErrtxt(data);
        }
      });
      setLoading(false);
    });
  };
  useEffect(() => {
    return () => {
      setErrtxt('');
    };
  }, []);
  return (
    <div className={styles.formContent}>
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        className={styles.formModule}
        onFinish={onsubmit}
      >
        {errtxt && (
          <Alert
            showIcon
            closable
            type="error"
            message={errtxt}
            style={{ marginBottom: 10 }}
            onClose={() => setErrtxt('')}
          />
        )}
        <Form.Item
          name="user"
          label="用户名"
          rules={[{ required: true, message: '用户名不为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '密码不为空' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <div>
            <Button type="primary" htmlType="submit" loading={loading}>
              登录
            </Button>
            <a
              style={{ marginLeft: 8 }}
              onClick={() => history.push('/login/register')}
            >
              去注册
            </a>
            <a
              style={{
                color: 'red',
                marginLeft: 8,
                textDecoration: 'underline',
              }}
              onClick={() => history.push('/login/retrievePassword')}
            >
              忘记密码?
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
