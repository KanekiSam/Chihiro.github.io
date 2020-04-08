import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Divider, message, Alert } from 'antd';
import { questions } from '@/data/question';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { history } from 'umi';
import { useAsync } from '@umijs/hooks';
import Axios from 'axios';

interface Props {}
const Register: React.FC<Props> = props => {
  const [selectLists, setSelectLists] = useState([...questions]);
  const [customName, setCustomName] = useState('');
  const [errTxt, setErrTxt] = useState('');
  const [form] = Form.useForm();
  const formlayout = {
    wrapperCol: { span: 16 },
    labelCol: { span: 8 },
  };
  const taillayout = {
    wrapperCol: { span: 16, offset: 8 },
  };
  const { loading, run } = useAsync<any>(
    values => {
      return Axios.post('/article/register', values);
    },
    {
      manual: true,
      onSuccess: ({ data, status }) => {
        if (status == 200) {
          message.success(data);
          history.push('/login');
        } else if (status == 202) {
          setErrTxt(data);
          message.warning(data);
        }
      },
      onError: res => {
        // tslint:disable-next-line:no-console
        console.log(res);
      },
    },
  );
  const onsubmit = () => {
    form.validateFields().then(values => {
      run(values);
    });
  };
  const addItem = () => {
    if (!customName) {
      return message.warning('请输入自定义名称');
    }
    setSelectLists([...selectLists, customName]);
  };
  useEffect(() => {
    form.setFieldsValue({ questions: [{}] });
    return () => {
      setErrTxt('');
    };
  }, []);
  return (
    <div className={styles.formContent}>
      <Form form={form} className={styles.formModule} onFinish={onsubmit}>
        {errTxt && (
          <Alert
            showIcon
            closable
            onClose={() => setErrTxt('')}
            message={errTxt}
            type="error"
            style={{ marginBottom: 10 }}
          />
        )}
        <Form.Item
          name="user"
          label="用户名"
          {...formlayout}
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
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
        <Form.Item label="设置找回密码的问题" {...formlayout} required>
          <Form.List name="questions">
            {(fields, { add, remove }) => {
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
                        <Select
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <Divider style={{ margin: '4px 0' }} />
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'nowrap',
                                  padding: 8,
                                }}
                              >
                                <Input
                                  style={{ flex: 'auto' }}
                                  value={customName}
                                  onChange={ev =>
                                    setCustomName(ev.target.value)
                                  }
                                />
                                <a
                                  style={{
                                    flex: 'none',
                                    padding: '8px',
                                    display: 'block',
                                    cursor: 'pointer',
                                  }}
                                  onClick={addItem}
                                >
                                  <PlusOutlined /> 自定义
                                </a>
                              </div>
                            </div>
                          )}
                        >
                          {selectLists.map((item, i) => (
                            <Select.Option key={i} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...taillayout}
                        name={[field.name, 'response']}
                        rules={[{ required: true, message: '回答不能为空' }]}
                      >
                        <Input />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className={styles.dynamicDeleteButton}
                          style={{ margin: '0 8px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </div>
                  ))}
                  <Form.Item {...taillayout}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        if (fields.length != selectLists.length) {
                          add();
                        }
                      }}
                      style={{ width: '100%' }}
                    >
                      <PlusOutlined /> 新增问题
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <div>
            <Button type="primary" htmlType="submit" loading={loading}>
              注册
            </Button>
            <a style={{ marginLeft: 8 }} onClick={() => history.push('/login')}>
              去登录
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;
