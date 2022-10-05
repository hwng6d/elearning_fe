import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from "antd";
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
const { Content, Sider } = Layout;
import CUserIndex from '../user/CUserIndex';
import styles from '../../styles/components/nav/UserNav.module.scss';

const UserNav = ({ user, hideSidebar, collapsed, setCollapsed, children }) => {
  const router = useRouter();
  const [currSelected, setCurrSelected] = useState('/user');
  const [child, setChild] = useState(<CUserIndex />);

  const sidebarItems = [
    {
      key: '/user',
      icon: React.createElement(UserOutlined),
      label: 'Bảng điều khiển',
      onClick: () => selectedHandler(<CUserIndex />, '/user')
    },
    {
      key: '/course',
      icon: React.createElement(UnorderedListOutlined),
      label: 'Khóa học',
      children: [
        { key: '/course/favorite', label: 'Khóa học yêu thích' },
        { key: '/course/paid', label: 'Đã mua' }
      ]
    }
  ];

  const selectedHandler = (childComponent, currentSelected) => {
    setChild(childComponent);
    setCurrSelected(currentSelected);
  };

  useEffect(() => {
    if (sidebarItems.map(item => item.key).includes(router.pathname)) {
      setCurrSelected(router.pathname);
      if (router.pathname === '/user')
        selectedHandler(<CUserIndex />, '/user');
    }
  }, [router.pathname])

  return (
    <Layout className={styles.site_layout} style={{ marginTop: '1px' }}>
      <Sider
        hidden={hideSidebar}
        className={styles.site_layout_background}
        style={{
          minHeight: 'calc(100vh - 80px)'
        }}
        defaultCollapsed={false}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          mode="inline"
          theme='light'
          items={sidebarItems}
          style={{
            height: '100%',
            borderRight: 0,
          }}
          selectedKeys={[currSelected]}
        />
      </Sider>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 'calc(100vh - 80px)' }}
      >
        {child}
      </Content>
    </Layout>
  )
}

export default UserNav