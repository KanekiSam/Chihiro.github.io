import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { user } from '@/data/user';
import { history } from 'umi';

export default () => {
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
  }, []);
  return (
    <div className={styles.homeModule}>
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
};
