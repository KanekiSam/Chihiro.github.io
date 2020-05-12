import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

interface Props {}
const UserCenter: React.FC<Props> = props => {
  const [activeKey, setActiveKey] = useState('1');
  useEffect(() => {
    document.title = '用户中心';
  }, []);
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Tabs
        activeKey={activeKey}
        onChange={tab => setActiveKey(tab)}
        tabPosition="left"
      >
        <Tabs.TabPane tab="用户信息" key="1"></Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default UserCenter;
