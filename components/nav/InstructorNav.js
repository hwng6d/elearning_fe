import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from "antd";
const { Content, Sider } = Layout;
import { UnorderedListOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../../styles/components/nav/InstructorNav.module.scss';
import CCreate from '../instructor/course/CCreate';
import CInstructorIndex from '../instructor/CInstructorIndex';
import Link from 'next/link';

const InstructorNav = ({ hideSidebar, collapsed, setCollapsed, children }) => {
  const router = useRouter();
  const [currSelected, setCurrSelected] = useState('/instructor');
  const [child, setChild] = useState(<CInstructorIndex />);

  const sidebarItems = [
    {
      key: '/instructor',
      icon: React.createElement(UserOutlined),
      label: 'Bảng điều khiển',
      onClick: () => selectedHandler(<CInstructorIndex />, '/instructor')
    },
    {
      key: '/instructor/course/create',
      icon: React.createElement(PlusOutlined),
      label: 'Tạo khóa học mới',
      onClick: () => selectedHandler(<CCreate />, '/instructor/course/create')
    }
  ];

  const selectedHandler = (childComponent, currentSelected) => {
    setChild(childComponent);
    setCurrSelected(currentSelected);
  }

  useEffect(() => {
    if (sidebarItems.map(item => item.key).includes(router.pathname)) {
      setCurrSelected(router.pathname);
      if (router.pathname === '/instructor')
        selectedHandler(<CInstructorIndex />, '/instructor');
      else if (router.pathname === '/instructor/course/create')
        selectedHandler(<CCreate />, '/instructor/course/create');
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
        style={{ padding: 16, margin: 0, minHeight: 'calc(100vh - 80px)' }}
      >
        {/* {children} */}
        {child}
      </Content>
    </Layout>
  )
}

export default React.memo(InstructorNav);