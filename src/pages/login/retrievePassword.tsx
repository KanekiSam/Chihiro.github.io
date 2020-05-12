import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import styles from './index.less';
import axios from 'axios';
import { useAsync } from '@umijs/hooks';
import { history } from 'umi';
import { httpPost } from '../../utils/request';

interface Props {}
const RetrievePassword: React.FC<Props> = props => {
  const [step, setStep] = useState(1);
  const [errtxt, setErrtxt] = useState('');
  const [form] = Form.useForm();
  const formlayout = {
    wrapperCol: { span: 16 },
    labelCol: { span: 8 },
  };
  const taillayout = {
    wrapperCol: { span: 16, offset: 8 },
  };
  const { loading: loading1, run: getQuestionAsync } = useAsync(
    query => {
      return axios.get('/user/get/questions', { params: query });
    },
    {
      manual: true,
      onSuccess: ({ data, status }) => {
        if (status == 200) {
          setStep(2);
          setErrtxt('');
          form.setFieldsValue({ questions: data });
        } else {
          setErrtxt(data);
          message.warning(data);
        }
      },
    },
  );
  const { loading: loading2, run: checkQuestionAsync } = useAsync(
    values => {
      return httpPost<string>('/user/check/questions', values);
    },
    {
      manual: true,
      onSuccess: ({ data, success }) => {
        if (success) {
          setStep(3);
          setErrtxt('');
          message.success('问题匹配正确');
        } else {
          setErrtxt(data);
        }
      },
    },
  );
  const { loading: loading3, run: checkPasswordAsync } = useAsync(
    query => {
      return axios.get('/user/change/password', { params: query });
    },
    {
      manual: true,
      onSuccess: ({ data, status }) => {
        if (status == 200) {
          setErrtxt('');
          message.success('密码重置成功,去登录吧');
          history.push('/login');
        } else {
          setErrtxt(data);
          message.warning(data);
        }
      },
    },
  );
  const getQuestions = () => {
    form.validateFields().then(values => {
      getQuestionAsync({ user: values.user });
    });
  };
  const oncheck = () => {
    form.validateFields().then(values => {
      checkQuestionAsync(values);
    });
  };
  const resetPassword = () => {
    form.validateFields().then(values => {
      checkPasswordAsync(values);
    });
  };
  useEffect(() => {
    return () => {
      setErrtxt('');
    };
  }, []);
  const back = (
    <Button style={{ marginRight: 15 }} onClick={() => history.push('/login')}>
      取消
    </Button>
  );
  return (
    <div className={styles.formContent}>
      <Form form={form} className={styles.formModule}>
        {errtxt && (
          <Alert
            message={errtxt}
            type="error"
            showIcon
            closable
            onClose={() => setErrtxt('')}
            style={{ marginBottom: 10 }}
          />
        )}
        <Form.Item
          name="user"
          label="用户名"
          {...formlayout}
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input disabled={step != 1} />
        </Form.Item>
        <Form.Item {...taillayout} style={{ display: step == 1 ? '' : 'none' }}>
          {back}
          <Button type="primary" loading={loading1} onClick={getQuestions}>
            找回密码
          </Button>
        </Form.Item>
        {step == 2 && (
          <div>
            <Form.List name="questions">
              {fields => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div className={styles.dynamicblock} key={field.key}>
                        <Form.Item
                          name={[field.name, 'question']}
                          label={`问题${index + 1}`}
                          {...formlayout}
                          rules={[{ required: true, message: '问题不能为空' }]}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          {...taillayout}
                          name={[field.name, 'response']}
                          rules={[{ required: true, message: '回答不能为空' }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                );
              }}
            </Form.List>
            <Form.Item {...taillayout}>
              {back}
              <Button type="primary" onClick={oncheck} loading={loading2}>
                确认
              </Button>
            </Form.Item>
          </div>
        )}
        {step == 3 && (
          <div>
            <Form.Item
              name="password"
              label="重置密码"
              {...formlayout}
              rules={[
                { required: true, message: '密码不能为空' },
                {
                  validator(rule, value, clb) {
                    if (value.length < 8) {
                      clb('密码长度不能小于8');
                    }
                    clb();
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="rePassword"
              label="确认密码"
              {...formlayout}
              required
              rules={[
                { required: true, message: '密码不能为空' },
                {
                  validator(rule, value, clb) {
                    if (!value) {
                      clb('请再次输入密码');
                    }
                    if (value != form.getFieldValue('password')) {
                      clb('两次输入密码不一致');
                    }
                    clb();
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...taillayout}>
              {back}
              <Button type="primary" loading={loading3} onClick={resetPassword}>
                确认修改密码
              </Button>
            </Form.Item>
          </div>
        )}
      </Form>
    </div>
  );
};
export default RetrievePassword;
