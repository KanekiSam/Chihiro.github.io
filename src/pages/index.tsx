import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { user } from '@/data/user';
import { history } from 'umi';
import { httpGet } from '../utils/request';
import { connect } from 'dva';
import { Modal } from 'antd';
import { clearToken } from '../utils/getToken';
interface Props {
  dispatch: any;
  userInfo: any;
}
export default connect(({ user }) => ({ userInfo: user.userInfo }))(
  (props: Props) => {
    const starRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      // setInterval(() => {
      for (let item = 1; item < 200; item++) {
        const star = document.createElement('div');
        star.className = styles.stars;
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';
        starRef.current?.appendChild(star);
      }
      // }, 100);
      props.dispatch({ type: 'user/getUserInfo' });
    }, []);
    return (
      <div className={styles.homeModule}>
        <div className={styles.goto}>
          {!props.userInfo ? (
            <div>
              <a onClick={() => history.push('/login')}>登录</a>
              <span style={{ margin: 3 }}>/</span>
              <a onClick={() => history.push('/login/register')}>注册</a>
            </div>
          ) : (
            <div>
              <a
                onClick={() => {
                  history.push({ pathname: '/userCenter' });
                }}
              >
                {props.userInfo?.user}
              </a>
              欢迎你~
              <a
                style={{ color: 'red', textDecoration: 'underline' }}
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    content: '是否确认退出账号？',
                    onOk: () => {
                      clearToken();
                      props.dispatch({
                        type: 'user/setUser',
                        payload: undefined,
                      });
                    },
                  });
                }}
              >
                退出
              </a>
            </div>
          )}
        </div>
        <div className={styles.starModule} ref={starRef}></div>
        <div className={styles.center}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.avatar}>
            <img src={require('../static/avatar.png')} alt="" />
          </div>
          <div className={styles.describe}>{user.describe}</div>
          <div className={styles.linker} onClick={() => history.push('/blog')}>
            开始旅行>>
          </div>
        </div>
      </div>
    );
  },
);
